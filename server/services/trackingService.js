// Tracking Service - Analytics Tracking Logic

const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const Product = require('../models/Product');

/**
 * Track visitor visit
 */
const trackVisit = async (sessionId, visitData) => {
  const { device, browser, location, pages } = visitData;

  // Check if returning visitor
  const existingVisitor = await Visitor.findOne({ sessionId });
  const isReturning = !!existingVisitor;

  if (isReturning) {
    // Update existing visitor
    return await Visitor.findOneAndUpdate(
      { sessionId },
      {
        $push: { pagesVisited: pages[0] },
        lastVisit: new Date(),
      },
      { new: true }
    );
  }

  // Create new visitor
  const visitor = new Visitor({
    sessionId,
    visitTime: new Date(),
    pagesVisited: pages,
    device,
    browser,
    location,
    isReturning: false,
    sessionDuration: 0,
    lastVisit: new Date(),
  });

  return await visitor.save();
};

/**
 * Track product click
 */
const trackClick = async (productId, sessionId, clickData) => {
  const { device, browser } = clickData;

  // Create click event
  const clickEvent = new ClickEvent({
    productId,
    sessionId,
    timestamp: new Date(),
    device,
    browser,
  });

  const savedClick = await clickEvent.save();

  // Increment product clicks
  await Product.findByIdAndUpdate(
    productId,
    { $inc: { clicks: 1 } },
    { new: true }
  );

  // Update visitor pages visited
  await Visitor.findOneAndUpdate(
    { sessionId },
    { $push: { pagesVisited: `product-${productId}` } },
    { new: true }
  );

  return savedClick;
};

/**
 * Get click statistics for a product
 */
const getProductClickStats = async (productId) => {
  const clicks = await ClickEvent.find({ productId }).sort({ timestamp: -1 });

  return {
    total: clicks.length,
    uniqueSessions: [...new Set(clicks.map((c) => c.sessionId))].length,
    deviceBreakdown: getDeviceBreakdown(clicks),
    browserBreakdown: getBrowserBreakdown(clicks),
    clicks,
  };
};

/**
 * Get device breakdown from clicks
 */
const getDeviceBreakdown = (clicks) => {
  const breakdown = {};
  clicks.forEach((click) => {
    breakdown[click.device] = (breakdown[click.device] || 0) + 1;
  });
  return breakdown;
};

/**
 * Get browser breakdown from clicks
 */
const getBrowserBreakdown = (clicks) => {
  const breakdown = {};
  clicks.forEach((click) => {
    breakdown[click.browser] = (breakdown[click.browser] || 0) + 1;
  });
  return breakdown;
};

/**
 * Get visitor session duration
 */
const updateSessionDuration = async (sessionId, duration) => {
  return await Visitor.findOneAndUpdate(
    { sessionId },
    { sessionDuration: duration },
    { new: true }
  );
};

/**
 * Get visitor session details
 */
const getVisitorSession = async (sessionId) => {
  const visitor = await Visitor.findOne({ sessionId });
  if (!visitor) {
    throw new Error('Session not found');
  }

  const clicks = await ClickEvent.find({ sessionId });

  return {
    sessionId,
    visitor,
    clicks,
    clickCount: clicks.length,
  };
};

/**
 * Get recent visitors
 */
const getRecentVisitors = async (limit = 10) => {
  return await Visitor.find()
    .sort({ lastVisit: -1 })
    .limit(limit);
};

/**
 * Get returning visitors count
 */
const getReturningVisitorsCount = async () => {
  return await Visitor.countDocuments({ isReturning: true });
};

/**
 * Get new visitors count
 */
const getNewVisitorsCount = async () => {
  return await Visitor.countDocuments({ isReturning: false });
};

/**
 * Get total unique visitors
 */
const getTotalUniqueVisitors = async () => {
  return await Visitor.countDocuments();
};

/**
 * Get device breakdown for all visitors
 */
const getDeviceBreakdownStats = async () => {
  const visitors = await Visitor.find();
  const breakdown = {};

  visitors.forEach((visitor) => {
    breakdown[visitor.device] = (breakdown[visitor.device] || 0) + 1;
  });

  return Object.entries(breakdown).map(([device, count]) => ({
    device,
    count,
    percentage: Math.round((count / visitors.length) * 100),
  }));
};

/**
 * Get browser breakdown for all visitors
 */
const getBrowserBreakdownStats = async () => {
  const visitors = await Visitor.find();
  const breakdown = {};

  visitors.forEach((visitor) => {
    breakdown[visitor.browser] = (breakdown[visitor.browser] || 0) + 1;
  });

  return Object.entries(breakdown)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: Math.round((count / visitors.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get clicks by hour
 */
const getClicksByHour = async () => {
  const clicks = await ClickEvent.find();
  const breakdown = Array(24).fill(0);

  clicks.forEach((click) => {
    const hour = click.timestamp.getHours();
    breakdown[hour]++;
  });

  return breakdown.map((count, hour) => ({
    hour: `${hour}:00`,
    clicks: count,
  }));
};

/**
 * Delete old tracking data (older than days)
 */
const deleteOldTrackingData = async (days = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  await ClickEvent.deleteMany({ timestamp: { $lt: date } });
  await Visitor.deleteMany({ lastVisit: { $lt: date } });

  return true;
};

module.exports = {
  trackVisit,
  trackClick,
  getProductClickStats,
  updateSessionDuration,
  getVisitorSession,
  getRecentVisitors,
  getReturningVisitorsCount,
  getNewVisitorsCount,
  getTotalUniqueVisitors,
  getDeviceBreakdownStats,
  getBrowserBreakdownStats,
  getClicksByHour,
  deleteOldTrackingData,
};
