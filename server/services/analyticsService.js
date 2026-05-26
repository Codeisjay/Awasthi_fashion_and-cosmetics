// Analytics Service - Dashboard Analytics

const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const { Product } = require('../models/Product');
const MLPrediction = require('../models/MLPrediction');
const {
  getDailyTrafficPipeline,
  getHourlyTrafficPipeline,
  getTopProductsPipeline,
  getClicksByCategory,
} = require('../analytics/aggregations');

/**
 * Get dashboard overview
 */
const getDashboardOverview = async () => {
  const [
    totalVisitors,
    totalClicks,
    totalProducts,
    todayVisitors,
    todayClicks,
  ] = await Promise.all([
    Visitor.countDocuments(),
    ClickEvent.countDocuments(),
    Product.countDocuments({ isActive: true }),
    getVisitorsToday(),
    getClicksToday(),
  ]);

  const topProduct = await getTopProduct();
  const lowestProduct = await getLowestProduct();

  return {
    totalVisitors,
    totalClicks,
    totalProducts,
    todayVisitors,
    todayClicks,
    topProduct,
    lowestProduct,
  };
};

/**
 * Get visitors today
 */
const getVisitorsToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await Visitor.countDocuments({
    visitTime: { $gte: today },
  });
};

/**
 * Get clicks today
 */
const getClicksToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await ClickEvent.countDocuments({
    timestamp: { $gte: today },
  });
};

/**
 * Get top product
 */
const getTopProduct = async () => {
  const product = await Product.findOne({ isActive: true })
    .sort({ clicks: -1 });

  return product
    ? {
        id: product._id,
        title: product.title,
        clicks: product.clicks,
      }
    : null;
};

/**
 * Get lowest product (least clicks)
 */
const getLowestProduct = async () => {
  const product = await Product.findOne({ isActive: true })
    .sort({ clicks: 1 });

  return product
    ? {
        id: product._id,
        title: product.title,
        clicks: product.clicks,
      }
    : null;
};

/**
 * Get daily traffic data
 */
const getDailyTraffic = async (days = 30) => {
  const pipeline = getDailyTrafficPipeline(days);
  return await ClickEvent.aggregate(pipeline);
};

/**
 * Get hourly traffic for today
 */
const getHourlyTraffic = async (date) => {
  const pipeline = getHourlyTrafficPipeline(date);
  return await ClickEvent.aggregate(pipeline);
};

/**
 * Get top products
 */
const getTopProducts = async () => {
  const pipeline = getTopProductsPipeline();
  return await ClickEvent.aggregate(pipeline);
};

/**
 * Get clicks by category
 */
const getClicksByProductCategory = async () => {
  const pipeline = getClicksByCategory();
  return await ClickEvent.aggregate(pipeline);
};

/**
 * Get traffic summary
 */
const getTrafficSummary = async () => {
  const [visitors, clicks, products] = await Promise.all([
    Visitor.countDocuments(),
    ClickEvent.countDocuments(),
    Product.countDocuments({ isActive: true }),
  ]);

  const avgClicksPerVisitor = visitors > 0 ? (clicks / visitors).toFixed(2) : 0;

  return {
    totalVisitors: visitors,
    totalClicks: clicks,
    totalProducts: products,
    avgClicksPerVisitor,
  };
};

/**
 * Get visitor demographics
 */
const getVisitorDemographics = async () => {
  const visitors = await Visitor.find();

  const deviceBreakdown = {};
  const browserBreakdown = {};
  let totalDuration = 0;
  let returningCount = 0;

  visitors.forEach((visitor) => {
    // Device breakdown
    deviceBreakdown[visitor.device] = (deviceBreakdown[visitor.device] || 0) + 1;

    // Browser breakdown
    browserBreakdown[visitor.browser] =
      (browserBreakdown[visitor.browser] || 0) + 1;

    // Session duration
    totalDuration += visitor.sessionDuration;

    // Returning visitors
    if (visitor.isReturning) returningCount++;
  });

  return {
    devices: Object.entries(deviceBreakdown).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / visitors.length) * 100),
    })),
    browsers: Object.entries(browserBreakdown)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / visitors.length) * 100),
      }))
      .sort((a, b) => b.count - a.count),
    avgSessionDuration:
      visitors.length > 0 ? Math.round(totalDuration / visitors.length) : 0,
    returningVisitors: returningCount,
    newVisitors: visitors.length - returningCount,
  };
};

/**
 * Get product performance
 */
const getProductPerformance = async () => {
  const products = await Product.find({ isActive: true });

  return products
    .map((product) => ({
      id: product._id,
      title: product.title,
      category: product.category,
      clicks: product.clicks,
      impressions: product.impressions,
      ctr: product.impressions > 0
        ? Math.round((product.clicks / product.impressions) * 100 * 100) / 100
        : 0,
      stockStatus: product.stockStatus,
    }))
    .sort((a, b) => b.clicks - a.clicks);
};

/**
 * Get ML insights summary
 */
const getMLInsightsSummary = async () => {
  const predictions = await MLPrediction.find().sort({ generatedAt: -1 });

  const demandDistribution = {
    high: predictions.filter((p) => p.predictedDemand === 'high').length,
    medium: predictions.filter((p) => p.predictedDemand === 'medium').length,
    low: predictions.filter((p) => p.predictedDemand === 'low').length,
  };

  const recommendations = {
    promote: predictions.filter((p) => p.recommendation === 'promote').length,
    maintain: predictions.filter((p) => p.recommendation === 'maintain').length,
    reduce: predictions.filter((p) => p.recommendation === 'reduce').length,
    discontinue: predictions.filter((p) => p.recommendation === 'discontinue')
      .length,
  };

  return {
    totalPredictions: predictions.length,
    lastUpdated: predictions[0]?.generatedAt || null,
    demandDistribution,
    recommendations,
  };
};

/**
 * Get analytics data for time range
 */
const getAnalyticsForDateRange = async (startDate, endDate) => {
  const clicks = await ClickEvent.countDocuments({
    timestamp: { $gte: startDate, $lte: endDate },
  });

  const visitors = await Visitor.countDocuments({
    visitTime: { $gte: startDate, $lte: endDate },
  });

  const products = await Product.find({
    createdAt: { $gte: startDate, $lte: endDate },
    isActive: true,
  }).countDocuments();

  return {
    clicks,
    visitors,
    products,
    avgClicksPerVisitor: visitors > 0 ? (clicks / visitors).toFixed(2) : 0,
  };
};

module.exports = {
  getDashboardOverview,
  getVisitorsToday,
  getClicksToday,
  getTopProduct,
  getLowestProduct,
  getDailyTraffic,
  getHourlyTraffic,
  getTopProducts,
  getClicksByProductCategory,
  getTrafficSummary,
  getVisitorDemographics,
  getProductPerformance,
  getMLInsightsSummary,
  getAnalyticsForDateRange,
};
