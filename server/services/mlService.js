// ML Service - ML Predictions and Recommendations

const MLPrediction = require('../models/MLPrediction');
const Product = require('../models/Product');

/**
 * Get all ML predictions
 */
const getAllPredictions = async (filters = {}) => {
  const { demandLevel, recommendation, limit = 100 } = filters;

  const query = {};

  if (demandLevel) {
    query.predictedDemand = demandLevel;
  }

  if (recommendation) {
    query.recommendation = recommendation;
  }

  return await MLPrediction.find(query)
    .populate('productId')
    .sort({ generatedAt: -1 })
    .limit(limit);
};

/**
 * Get high demand products
 */
const getHighDemandProducts = async (limit = 10) => {
  return await MLPrediction.find({ predictedDemand: 'high' })
    .populate('productId')
    .sort({ trendScore: -1 })
    .limit(limit);
};

/**
 * Get low demand products
 */
const getLowDemandProducts = async (limit = 10) => {
  return await MLPrediction.find({ predictedDemand: 'low' })
    .populate('productId')
    .sort({ trendScore: 1 })
    .limit(limit);
};

/**
 * Get trending products
 */
const getTrendingProducts = async (limit = 10) => {
  return await MLPrediction.find({ isIncreasing: true })
    .populate('productId')
    .sort({ trendScore: -1 })
    .limit(limit);
};

/**
 * Get products to promote
 */
const getProductsToPromote = async (limit = 10) => {
  return await MLPrediction.find({ recommendation: 'promote' })
    .populate('productId')
    .sort({ confidence: -1 })
    .limit(limit);
};

/**
 * Get products to maintain
 */
const getProductsToMaintain = async (limit = 10) => {
  return await MLPrediction.find({ recommendation: 'maintain' })
    .populate('productId')
    .sort({ confidence: -1 })
    .limit(limit);
};

/**
 * Get products to reduce investment
 */
const getProductsToReduce = async (limit = 10) => {
  return await MLPrediction.find({ recommendation: 'reduce' })
    .populate('productId')
    .sort({ confidence: -1 })
    .limit(limit);
};

/**
 * Get products to discontinue
 */
const getProductsToDiscontinue = async (limit = 10) => {
  return await MLPrediction.find({ recommendation: 'discontinue' })
    .populate('productId')
    .sort({ confidence: -1 })
    .limit(limit);
};

/**
 * Get prediction for specific product
 */
const getPredictionForProduct = async (productId) => {
  const prediction = await MLPrediction.findOne({ productId }).populate(
    'productId'
  );

  if (!prediction) {
    throw new Error('Prediction not found for this product');
  }

  return prediction;
};

/**
 * Get demand analysis
 */
const getDemandAnalysis = async () => {
  const predictions = await MLPrediction.find();

  const analysis = {
    highDemand: predictions.filter((p) => p.predictedDemand === 'high').length,
    mediumDemand: predictions.filter((p) => p.predictedDemand === 'medium').length,
    lowDemand: predictions.filter((p) => p.predictedDemand === 'low').length,
    increasing: predictions.filter((p) => p.isIncreasing).length,
    decreasing: predictions.filter((p) => !p.isIncreasing).length,
  };

  return analysis;
};

/**
 * Get recommendation summary
 */
const getRecommendationSummary = async () => {
  const predictions = await MLPrediction.find();

  return {
    promote: predictions.filter((p) => p.recommendation === 'promote').length,
    maintain: predictions.filter((p) => p.recommendation === 'maintain').length,
    reduce: predictions.filter((p) => p.recommendation === 'reduce').length,
    discontinue: predictions.filter((p) => p.recommendation === 'discontinue')
      .length,
  };
};

/**
 * Update prediction for product
 */
const updatePrediction = async (productId, predictionData) => {
  const prediction = await MLPrediction.findOneAndUpdate(
    { productId },
    predictionData,
    { new: true, upsert: true }
  );

  return prediction;
};

/**
 * Get high confidence predictions
 */
const getHighConfidencePredictions = async (minConfidence = 0.8) => {
  return await MLPrediction.find({
    confidence: { $gte: minConfidence },
  })
    .populate('productId')
    .sort({ confidence: -1 });
};

/**
 * Get low confidence predictions
 */
const getLowConfidencePredictions = async (maxConfidence = 0.5) => {
  return await MLPrediction.find({
    confidence: { $lte: maxConfidence },
  })
    .populate('productId')
    .sort({ confidence: 1 });
};

/**
 * Get predictions by category
 */
const getPredictionsByCategory = async (category) => {
  return await MLPrediction.find()
    .populate({
      path: 'productId',
      match: { category },
    })
    .then((predictions) =>
      predictions.filter((p) => p.productId !== null)
    );
};

/**
 * Get products below average performance
 */
const getBelowAveragePerformance = async () => {
  const allPredictions = await MLPrediction.find().populate('productId');

  if (allPredictions.length === 0) return [];

  const avgClicks =
    allPredictions.reduce((sum, p) => sum + p.predictedClicks, 0) /
    allPredictions.length;

  return allPredictions.filter((p) => p.predictedClicks < avgClicks);
};

/**
 * Get ML metrics
 */
const getMLMetrics = async () => {
  const predictions = await MLPrediction.find();

  if (predictions.length === 0) {
    return {
      totalPredictions: 0,
      avgConfidence: 0,
      avgTrendScore: 0,
      lastUpdated: null,
    };
  }

  const avgConfidence =
    Math.round(
      (predictions.reduce((sum, p) => sum + p.confidence, 0) /
        predictions.length) *
        100 * 100
    ) / 100;

  const avgTrendScore =
    Math.round(
      (predictions.reduce((sum, p) => sum + p.trendScore, 0) /
        predictions.length) *
        100
    ) / 100;

  return {
    totalPredictions: predictions.length,
    avgConfidence,
    avgTrendScore,
    lastUpdated: predictions[0]?.generatedAt || null,
  };
};

module.exports = {
  getAllPredictions,
  getHighDemandProducts,
  getLowDemandProducts,
  getTrendingProducts,
  getProductsToPromote,
  getProductsToMaintain,
  getProductsToReduce,
  getProductsToDiscontinue,
  getPredictionForProduct,
  getDemandAnalysis,
  getRecommendationSummary,
  updatePrediction,
  getHighConfidencePredictions,
  getLowConfidencePredictions,
  getPredictionsByCategory,
  getBelowAveragePerformance,
  getMLMetrics,
};
