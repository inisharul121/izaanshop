const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const prisma = require('./utils/prisma');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
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
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to IzaanShop API' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
