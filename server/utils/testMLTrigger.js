/**
 * Manual ML Prediction Trigger & Diagnostic Tool
 * Run with: node server/utils/testMLTrigger.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('../models/Product');
const ClickEvent = require('../models/ClickEvent');
const MLPrediction = require('../models/MLPrediction');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

const runDiagnostics = async () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║              [DIAGNOSTIC TEST] Running...             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  // 1. Check database collections
  console.log('📊 1. DATABASE COLLECTIONS\n');
  const productCount = await Product.countDocuments();
  const clickCount = await ClickEvent.countDocuments();
  const mlCount = await MLPrediction.countDocuments();
  console.log(`   Products: ${productCount}`);
  console.log(`   Click Events: ${clickCount}`);
  console.log(`   ML Predictions: ${mlCount}\n`);

  // 2. Check click distribution
  console.log('📈 2. CLICK DISTRIBUTION\n');
  const products = await Product.find().select('title clicks');
  const totalClicks = products.reduce((sum, p) => sum + (p.clicks || 0), 0);
  
  products.forEach(p => {
    const clicks = p.clicks || 0;
    const bar = '█'.repeat(Math.floor(clicks / 5));
    console.log(`   ${p.title?.substring(0, 30)?.padEnd(30)} : ${clicks.toString().padStart(3)} clicks ${bar}`);
  });
  console.log(`\n   TOTAL CLICKS: ${totalClicks}\n`);

  // 3. Sample recent clicks
  if (clickCount > 0) {
    console.log('🖱️  3. RECENT CLICK EVENTS\n');
    const recentClicks = await ClickEvent.find().sort({ timestamp: -1 }).limit(5);
    recentClicks.forEach((click, i) => {
      console.log(`   [${i + 1}] Product: ${click.productId} | Session: ${click.sessionId?.substring(0, 8)}... | Device: ${click.device}`);
    });
    console.log('');
  }

  // 4. Generate ML Predictions
  console.log('🤖 4. GENERATING ML PREDICTIONS\n');
  await generateMLPredictions();
  
  // 5. Verify predictions were generated
  const newMLCount = await MLPrediction.countDocuments();
  console.log(`   ✅ ML Predictions generated: ${newMLCount}\n`);

  // 6. Show predictions
  if (newMLCount > 0) {
    console.log('📋 5. ML PREDICTIONS SAMPLE\n');
    const predictions = await MLPrediction.find().populate('productId').limit(5);
    predictions.forEach((pred, i) => {
      console.log(`   [${i + 1}] ${pred.productId?.title?.substring(0, 25)?.padEnd(25)} | Demand: ${pred.predictedDemand?.padEnd(6)} | Trend: ${pred.trendScore}/100`);
    });
  }

  console.log('\n✅ Diagnostic complete!\n');
};

const generateMLPredictions = async () => {
  try {
    const products = await Product.find();
    console.log(`   Processing ${products.length} products...`);
    
    const predictions = products.map((product) => {
      const clicks = product.clicks || 0;
      
      let predictedDemand = 'medium';
      if (clicks > 20) predictedDemand = 'high';
      if (clicks < 5) predictedDemand = 'low';

      let recommendation = 'maintain';
      if (clicks > 20) recommendation = 'promote';
      if (clicks < 3) recommendation = 'discontinue';
      if (clicks > 10 && clicks <= 20) recommendation = 'maintain';
      if (clicks >= 3 && clicks <= 10) recommendation = 'reduce';

      const randomFactor = Math.random();
      const isIncreasing = clicks > 10 || randomFactor > 0.4;
      const trendScore = Math.min(100, Math.floor(clicks * 2 + randomFactor * 30));

      return {
        productId: product._id,
        predictedDemand,
        recommendation,
        isIncreasing,
        trendScore: Math.max(0, Math.min(100, trendScore)),
        confidence: 0.75 + Math.random() * 0.25,
        predictedClicks: Math.floor(clicks * (1 + (randomFactor - 0.5) * 0.3)),
        generatedAt: new Date()
      };
    });

    await MLPrediction.deleteMany({});
    await MLPrediction.insertMany(predictions);
    console.log(`   ✅ Generated ${predictions.length} predictions`);
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }
};

const main = async () => {
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  await runDiagnostics();

  await mongoose.connection.close();
  console.log('🔌 Database connection closed\n');
  process.exit(0);
};

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
