const MLPrediction = require('../models/MLPrediction');
const { Product } = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @route   GET /api/ml/recommendations
// @desc    Get ML recommendations
// @access  Private (Admin)
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  const predictions = await MLPrediction.find()
    .populate('productId', 'title clicks impressions category')
    .sort({ predictedDemand: 1 })
    .limit(20);

  // Group by recommendation
  const recommendations = {
    promote: predictions.filter(p => p.recommendation === 'promote'),
    maintain: predictions.filter(p => p.recommendation === 'maintain'),
    reduce: predictions.filter(p => p.recommendation === 'reduce'),
    discontinue: predictions.filter(p => p.recommendation === 'discontinue')
  };

  res.status(200).json({
    success: true,
    recommendations
  });
});

// @route   GET /api/ml/trending
// @desc    Get trending products
// @access  Private (Admin)
exports.getTrending = asyncHandler(async (req, res, next) => {
  const trendingProducts = await MLPrediction.find({ isIncreasing: true })
    .populate('productId', 'title clicks impressions category')
    .sort({ trendScore: -1 })
    .limit(15);

  res.status(200).json({
    success: true,
    trendingProducts
  });
});

// @route   GET /api/ml/demand-analysis
// @desc    Get demand analysis
// @access  Private (Admin)
exports.getDemandAnalysis = asyncHandler(async (req, res, next) => {
  const demandAnalysis = await MLPrediction.aggregate([
    {
      $group: {
        _id: '$predictedDemand',
        count: { $sum: 1 },
        avgTrendScore: { $avg: '$trendScore' },
        avgConfidence: { $avg: '$confidence' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const highDemand = await MLPrediction.find({ predictedDemand: 'high' })
    .populate('productId', 'title')
    .limit(10);

  const lowDemand = await MLPrediction.find({ predictedDemand: 'low' })
    .populate('productId', 'title')
    .limit(10);

  res.status(200).json({
    success: true,
    demandAnalysis: {
      overview: demandAnalysis,
      highDemandProducts: highDemand,
      lowDemandProducts: lowDemand
    }
  });
});

// @route   POST /api/ml/predictions/:productId
// @desc    Update ML prediction for a product
// @access  Private (Admin)
exports.updatePrediction = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { predictedDemand, trendScore, recommendation, confidence, isIncreasing, predictedClicks } = req.body;

  let prediction = await MLPrediction.findOne({ productId });

  if (prediction) {
    prediction = await MLPrediction.findByIdAndUpdate(
      prediction._id,
      {
        predictedDemand,
        trendScore,
        recommendation,
        confidence,
        isIncreasing,
        predictedClicks,
        generatedAt: new Date()
      },
      { new: true }
    ).populate('productId', 'title');
  } else {
    prediction = await MLPrediction.create({
      productId,
      predictedDemand,
      trendScore,
      recommendation,
      confidence,
      isIncreasing,
      predictedClicks
    });
    prediction = await prediction.populate('productId', 'title');
  }

  res.status(200).json({
    success: true,
    prediction
  });
});
