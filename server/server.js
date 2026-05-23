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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Seed endpoint - Create demo admin if not exists
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

// Seed ML data endpoint
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/offers', offerRoutes);

// Fallback to frontend for SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start ML scheduler after server starts
  scheduleMLGeneration();
});
