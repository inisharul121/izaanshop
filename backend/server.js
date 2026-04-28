const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { db } = require('./db');
const { sql } = require('drizzle-orm');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();


// 1. CORS - MUST BE FIRST
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://izaanshop.vercel.app',
  'https://izaanshop.com',
  'http://izaanshop.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow mobile apps / server-to-server (no origin)
    if (!origin) return callback(null, true);
    
    // 2. Clean origin (remove trailing slash)
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // 3. Check against whitelist
    if (allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS BLOCKED: ${origin} not in [${allowedOrigins.join(', ')}]`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Custom-Header'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // Cache preflight for 24 hours
  optionsSuccessStatus: 204
}));

// 2. Body Parsers (MOVED TO apiRouter to avoid disturbing Next.js requests)
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Optimize logging for Production
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('tiny'));
} else {
  app.use(morgan('dev'));
}

app.use(cookieParser());

// 3. Smart Caching: no-cache for mutations, short cache for reads
app.use('/api', (req, res, next) => {
  const isMutation = req.method !== 'GET';
  const hasAuth = req.headers.authorization;
  const url = req.url.toLowerCase();
  
  // Routes that should NEVER be cached (Admin management, analytics, etc.)
  const isManagement = 
    url.includes('/admin') || 
    url.includes('/all') || 
    url.includes('/analytics') || 
    url.includes('/coupons') || 
    url.includes('/shipping') ||
    url.includes('/media') ||
    url.includes('/settings');

  // CRITICAL: If requester is authenticated (Admin) or it's a mutation/management route, disable cache
  if (isMutation || isManagement || hasAuth) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('X-LiteSpeed-Cache-Control', 'no-cache');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else {
    // Shorter cache for public volatile data (banners/categories) to ensure visible updates within 10s
    const isVolatile = url.includes('/banners') || url.includes('/categories');
    const age = isVolatile ? 10 : 60;
    res.set('Cache-Control', `public, max-age=${age}, stale-while-revalidate=120`);
  }
  next();
});

// Allow cross-origin images and disable strict CSP so Next.js inline scripts (hydration) can run!
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, 
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
async function connectDB() {
  try {
    // Drizzle doesn't need explicit connect, but we can test it
    await db.execute(sql`SELECT 1`);
    console.log('✅ Connected to MySQL via Drizzle');
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}
connectDB();

// Routes
const apiRouter = express.Router();

// 🚀 CRITICAL: Body parsers applied ONLY to API routes
// This prevents Next.js frontend routes from having "disturbed" request bodies
apiRouter.use(express.json({ limit: '50mb' }));
apiRouter.use(express.urlencoded({ extended: true, limit: '50mb' }));

apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/categories', require('./routes/categoryRoutes'));
apiRouter.use('/products', require('./routes/productRoutes'));
apiRouter.use('/orders', require('./routes/orderRoutes'));
apiRouter.use('/coupons', require('./routes/couponRoutes'));
apiRouter.use('/upload', require('./routes/uploadRoutes'));
apiRouter.use('/media', require('./routes/mediaRoutes'));
apiRouter.use('/settings', require('./routes/settingsRoutes'));
apiRouter.use('/analytics', require('./routes/analyticsRoutes'));
apiRouter.use('/banners', require('./routes/bannerRoutes'));
apiRouter.use('/shipping', require('./routes/shippingRoutes'));

apiRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to IzaanShop API' });
});

apiRouter.use('/shop', require('./routes/shopRoutes'));

apiRouter.get('/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ 
      status: 'ok', 
      database: 'connected',
      message: 'Drizzle is working correctly'
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      message: error.message,
      hint: 'Check DATABASE_URL and if mysql server is running.'
    });
  }
});

// Only mount on /api so the React frontend can use the root (/) path!
app.use('/api', apiRouter);

// Global Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
