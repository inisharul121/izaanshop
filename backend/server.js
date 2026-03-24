const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const prisma = require('./utils/prisma');
require('dotenv').config();

const app = express();

// 1. CORS - MUST BE FIRST
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://izaanshop.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.warn(`CORS BLOCKED for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204
}));

// Pre-flight requests across all routes
app.options('*', cors());

// 2. Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));
app.use(cookieParser());
// Allow cross-origin images (important for separated frontend/backend)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use('/uploads', express.static('uploads'));

// Database Connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL via Prisma');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}
connectDB();

// Routes
const apiRouter = express.Router();

apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/categories', require('./routes/categoryRoutes'));
apiRouter.use('/products', require('./routes/productRoutes'));
apiRouter.use('/orders', require('./routes/orderRoutes'));
apiRouter.use('/coupons', require('./routes/couponRoutes'));
apiRouter.use('/upload', require('./routes/uploadRoutes'));
apiRouter.use('/media', require('./routes/mediaRoutes'));
apiRouter.use('/settings', require('./routes/settingsRoutes'));
apiRouter.use('/analytics', require('./routes/analyticsRoutes'));

apiRouter.get('/', (req, res) => {
  res.json({ message: 'Welcome to IzaanShop API' });
});

apiRouter.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      message: 'Prisma is working correctly'
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      message: error.message,
      hint: 'Check DATABASE_URL and if prisma generate has been run.'
    });
  }
});

// Support both /api and / routes (cPanel compatibility)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
