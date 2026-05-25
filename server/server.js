require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const MLPrediction = require('./models/MLPrediction');
const { scheduleMLGeneration } = require('./jobs/mlScheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const productRoutes = require('./routes/productRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const mlRoutes = require('./routes/mlRoutes');
const offerRoutes = require('./routes/offerRoutes');

const app = express();

// Connect to database
connectDB();

// ============================================
// CORS CONFIGURATION - PRODUCTION & DEVELOPMENT
// ============================================
const allowedOrigins = [
  // Production Vercel frontend
  'https://awasthi-fashion-and-cosmetic.vercel.app',
  // Local development with Vite
  'http://localhost:5173',
  // Fallback for older setup
  'http://localhost:3000',
  // Support for FRONTEND_URL env variable
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON-Response'],
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};

// ============================================
// MIDDLEWARE - ORDER IS CRITICAL
// ============================================

// 1. CORS must be first
app.use(cors(corsOptions));

// 2. Preflight OPTIONS handler
app.options('*', cors(corsOptions));

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Static file serving (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// LOG SERVER STARTUP INFO
// ============================================
if (process.env.NODE_ENV === 'production') {
  console.log('[Server] ========================================');
  console.log('[Server] Running in PRODUCTION mode');
  console.log('[Server] Backend URL: ' + (process.env.RENDER_EXTERNAL_URL || 'https://awasthi-fashion-and-cosmetics-1.onrender.com'));
  console.log('[Server] Frontend URL: ' + (process.env.FRONTEND_URL || 'https://awasthi-fashion-and-cosmetic.vercel.app'));
  console.log('[Server] CORS Allowed Origins:');
  allowedOrigins.forEach(origin => console.log('[Server]   - ' + origin));
  console.log('[Server] ========================================');
}

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// SEED ENDPOINT - Create demo admin if not exists
// ============================================
app.get('/api/seed', async (req, res) => {
  try {
    // Delete old admin credentials
    await Admin.deleteMany({ email: 'admin@example.com' });
    
    const adminExists = await Admin.findOne({ email: 'admin@manika.com' });
    
    if (adminExists) {
      return res.status(200).json({ 
        success: true, 
        message: 'Admin already exists',
        admin: {
          email: adminExists.email,
          name: adminExists.name
        }
      });
    }

    const newAdmin = await Admin.create({
      name: 'Admin',
      email: 'admin@manika.com',
      password: 'manika93057',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating admin: ' + error.message 
    });
  }
});

// ============================================
// SEED ML DATA ENDPOINT
// ============================================
app.get('/api/seed-ml', async (req, res) => {
  try {
    // Get all products
    const products = await Product.find().limit(20);

    if (products.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No products found. Please create products first.'
      });
    }

    // Clear existing ML predictions
    await MLPrediction.deleteMany({});

    // Generate ML predictions for each product
    const predictions = products.map((product, index) => {
      const clicks = product.clicks || 0;
      const randomFactor = Math.random();
      
      // Determine demand level based on clicks
      let predictedDemand = 'medium';
      if (clicks > 20) predictedDemand = 'high';
      if (clicks < 5) predictedDemand = 'low';

      // Determine recommendation
      let recommendation = 'maintain';
      if (clicks > 20) recommendation = 'promote';
      if (clicks < 3) recommendation = 'discontinue';
      if (clicks > 10 && clicks <= 20) recommendation = 'maintain';
      if (clicks >= 3 && clicks <= 10) recommendation = 'reduce';

      // Determine if trending
      const isIncreasing = randomFactor > 0.4;
      const trendScore = Math.floor(randomFactor * 100);

      return {
        productId: product._id,
        predictedDemand,
        recommendation,
        isIncreasing,
        trendScore,
        confidence: 0.75 + Math.random() * 0.25,
        predictedClicks: Math.floor(clicks * (1 + (randomFactor - 0.5) * 0.5)),
        generatedAt: new Date()
      };
    });

    // Insert predictions
    await MLPrediction.insertMany(predictions);

    res.status(201).json({
      success: true,
      message: `ML predictions generated for ${predictions.length} products`,
      predictionsCount: predictions.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error generating ML data: ' + error.message 
    });
  }
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/offers', offerRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLER (MUST BE LAST)
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n[Server] Express server listening on port ${PORT}\n`);
  
  // Start ML scheduler after server starts
  scheduleMLGeneration();
});

module.exports = app;
