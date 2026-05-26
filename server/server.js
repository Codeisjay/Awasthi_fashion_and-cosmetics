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
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Connect to database
connectDB();

// ============================================
// CORS CONFIGURATION - WILDCARD VERCEL SUPPORT
// ============================================
// Allow all Vercel deployment URLs (including preview deployments)
// and localhost for local development

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    // Remove trailing slash for comparison
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    // Check if origin is allowed
    const isAllowed = 
      // Allow all Vercel deployment URLs (production and preview)
      normalizedOrigin.endsWith('.vercel.app') ||
      // Allow all Render deployment URLs
      normalizedOrigin.endsWith('.onrender.com') ||
      // Allow localhost development servers
      normalizedOrigin === 'http://localhost:3000' ||
      normalizedOrigin === 'http://localhost:5173' ||
      normalizedOrigin === 'http://127.0.0.1:3000' ||
      normalizedOrigin === 'http://127.0.0.1:5173';

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] ❌ Blocked request from origin: ${origin}`);
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Request-ID'],
  exposedHeaders: ['Content-Length', 'X-JSON-Response', 'X-Total-Count', 'X-Request-ID'],
  optionsSuccessStatus: 200,
  maxAge: 3600 // 1 hour cache for preflight
};

// ============================================
// MIDDLEWARE - ORDER IS CRITICAL
// ============================================

// 1. CORS middleware - MUST be first before all other middleware
app.use(cors(corsOptions));

// 2. Explicit OPTIONS handler for preflight requests
app.options('*', cors(corsOptions));

// 3. Body parsers - MUST come before routes and auth middleware
// These parse incoming request bodies into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3.5. Error handler for body parser failures (e.g., malformed JSON)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('[BODY PARSER ERROR] Malformed JSON received');
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  next(err);
});

// 3.7. Request logging middleware for debugging (concise version)
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && process.env.NODE_ENV !== 'production') {
    console.log(`\n[REQUEST] ${req.method} ${req.path}`);
    console.log('[REQUEST] Content-Type:', req.headers['content-type']);
    
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyKeys = Object.keys(req.body);
      console.log('[REQUEST] Body fields:', bodyKeys.join(', '));
      
      // Log price specifically for product routes
      if (req.path.includes('/products') && 'price' in req.body) {
        console.log('[REQUEST] ✓ Price field detected:', req.body.price, `(${typeof req.body.price})`);
      }
    } else {
      console.log('[REQUEST] ⚠ req.body is empty or undefined');
    }
  }
  next();
});

// 3.8. Request timing middleware - diagnose slow operations
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    req.startTime = Date.now();
    
    // Intercept res.json to log response time
    const originalJson = res.json;
    res.json = function(data) {
      const duration = Date.now() - req.startTime;
      
      if (process.env.NODE_ENV !== 'production') {
        if (duration > 1000) {
          console.log(`[TIMING] ⚠ SLOW: ${req.method} ${req.path} took ${duration}ms`);
        } else {
          console.log(`[TIMING] ✓ ${req.method} ${req.path} completed in ${duration}ms`);
        }
      }
      
      // Add timing header for debugging
      res.set('X-Response-Time', `${duration}ms`);
      return originalJson.call(this, data);
    };
  }
  next();
});

// 4. Static file serving (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// LOG SERVER STARTUP INFO
// ============================================
if (process.env.NODE_ENV === 'production') {
  console.log('\n[Server] ========================================');
  console.log('[Server] Running in PRODUCTION mode');
  console.log('[Server] Backend URL: https://awasthi-fashion-and-cosmetics-1.onrender.com');
  console.log('[Server] CORS Policy:');
  console.log('[Server]   ✓ All *.vercel.app domains (production & preview)');
  console.log('[Server]   ✓ http://localhost:3000 (local dev)');
  console.log('[Server]   ✓ http://localhost:5173 (Vite dev)');
  console.log('[Server]   ✓ Requests with no origin (mobile apps, CLI tools)');
  console.log('[Server] ========================================\n');
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
// DIAGNOSTIC ENDPOINT - Test body parsing
// ============================================
app.post('/api/diagnostic/test-body-parser', (req, res) => {
  console.log('\n╔═══════════════════════════════════════════════════╗');
  console.log('║        [DIAGNOSTIC] TEST BODY PARSER              ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  
  const diagnostics = {
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length'],
    bodyExists: req.body !== undefined,
    bodyType: typeof req.body,
    bodyKeys: Object.keys(req.body || {}),
    fullBody: req.body,
    priceField: req.body?.price,
    priceType: typeof req.body?.price,
    allData: {
      raw_body: JSON.stringify(req.body),
      individual_fields: {
        title: req.body?.title,
        price: req.body?.price,
        category: req.body?.category,
        description: req.body?.description
      }
    }
  };

  console.log('[DIAGNOSTIC] Full diagnostics:', JSON.stringify(diagnostics, null, 2));
  
  res.status(200).json({
    success: true,
    message: 'Body parser diagnostic complete',
    diagnostics
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
// ROOT ROUTE
// ============================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Awasthi Fashion & Cosmetics API Server',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      offers: '/api/offers',
      analytics: '/api/analytics',
      tracking: '/api/track',
      contact: '/api/contact'
    }
  });
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
app.use('/api/contact', contactRoutes);

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
