const cron = require('node-cron');
const { Product } = require('../models/Product');
const MLPrediction = require('../models/MLPrediction');

/**
 * Generate ML predictions based on current product data
 */
const generateMLPredictions = async () => {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        [ML SCHEDULER] Starting ML prediction          ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    
    // Get all products with their current click data
    const products = await Product.find();
    console.log(`[ML] Found ${products.length} products in database`);
    
    if (products.length === 0) {
      console.log('[ML Scheduler] ⚠️ No products found, skipping ML generation');
      return;
    }

    // Debug: Show click distribution
    const clickDistribution = products.map(p => ({ title: p.title, clicks: p.clicks || 0 }));
    console.log('[ML] Click distribution:', JSON.stringify(clickDistribution, null, 2));
    console.log('[ML] Total clicks across all products:', products.reduce((sum, p) => sum + (p.clicks || 0), 0));

    const predictions = products.map((product) => {
      const clicks = product.clicks || 0;
      
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

      // Calculate trend based on recent activity
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

    console.log('[ML] Generated predictions for all products');
    console.log('[ML] Sample predictions:', JSON.stringify(predictions.slice(0, 2), null, 2));

    // Delete old predictions and insert new ones
    await MLPrediction.deleteMany({});
    console.log('[ML] Deleted old ML predictions');
    
    const insertedPredictions = await MLPrediction.insertMany(predictions);
    console.log(`[ML] ✅ Inserted ${insertedPredictions.length} new ML predictions`);

    // Verify predictions were saved
    const verifyCount = await MLPrediction.countDocuments();
    console.log(`[ML] ✅ Verification - ${verifyCount} predictions now in database`);

    return { success: true, count: predictions.length };
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════════════════╗');
    console.error('║        [ML SCHEDULER] ML Prediction Generation Failed ║');
    console.error('╚════════════════════════════════════════════════════════╝');
    console.error('[ML] ❌ Error message:', error.message);
    console.error('[ML] Error name:', error.name);
    console.error('[ML] Stack:', error.stack);
    return { success: false, error: error.message };
  }
};

/**
 * Schedule ML prediction generation
 * Runs every 30 minutes automatically
 */
const scheduleMLGeneration = () => {
  // Run every 30 minutes (*/30 * * * *)
  const job = cron.schedule('*/30 * * * *', generateMLPredictions, {
    scheduled: true
  });

  console.log('[ML Scheduler] 🤖 ML prediction scheduler started (runs every 30 minutes)');

  // Also run once on server start
  generateMLPredictions();

  return job;
};

module.exports = {
  scheduleMLGeneration,
  generateMLPredictions
};
