const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const { Product } = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private (Admin)
exports.getOverview = asyncHandler(async (req, res, next) => {
  try {
    console.log('[Analytics] Fetching overview data...');

    // Total visitors
    const totalVisitors = await Visitor.countDocuments();
    console.log('[Analytics] Total Visitors:', totalVisitors);

    // Total clicks
    const totalClicks = await ClickEvent.countDocuments();
    console.log('[Analytics] Total Clicks:', totalClicks);

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });
    console.log('[Analytics] Total Products:', totalProducts);

    // Today's visitors - check both visitTime and createdAt
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayVisitors = await Visitor.countDocuments({
      $or: [
        { visitTime: { $gte: today, $lt: tomorrow } },
        { createdAt: { $gte: today, $lt: tomorrow } },
        { lastVisit: { $gte: today, $lt: tomorrow } }
      ]
    });
    console.log('[Analytics] Today Visitors:', todayVisitors);

    // Debug: Check visitor counts by field
    const visitTimeCount = await Visitor.countDocuments({ visitTime: { $gte: today } });
    const createdAtCount = await Visitor.countDocuments({ createdAt: { $gte: today } });
    const lastVisitCount = await Visitor.countDocuments({ lastVisit: { $gte: today } });
    console.log('[Analytics] Debug - visitTime:', visitTimeCount, 'createdAt:', createdAtCount, 'lastVisit:', lastVisitCount);

    // Debug: Check if there are ANY visitors and clicks
    const allVisitors = await Visitor.find().limit(3).sort({ createdAt: -1 });
    const allClicks = await ClickEvent.find().limit(3).sort({ createdAt: -1 });
    console.log('[Analytics] Recent visitors:', allVisitors.length);
    console.log('[Analytics] Recent clicks:', allClicks.length);

    // Most clicked product
    const mostClicked = await Product.findOne().sort({ clicks: -1 });

    // Least clicked product
    const leastClicked = await Product.findOne({ clicks: { $gt: 0 } }).sort({ clicks: 1 });

    res.status(200).json({
      success: true,
      overview: {
        totalVisitors,
        totalClicks,
        totalProducts,
        todayVisitors,
        mostClickedProduct: mostClicked,
        leastClickedProduct: leastClicked
      }
    });
  } catch (error) {
    console.error('[Analytics] Error fetching overview:', error);
    next(error);
  }
});

// @route   GET /api/analytics/traffic
// @desc    Get traffic analytics
// @access  Private (Admin)
exports.getTraffic = asyncHandler(async (req, res, next) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Daily traffic
  const dailyTraffic = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$visitTime' }
        },
        visitors: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Device breakdown
  const deviceBreakdown = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: '$device',
        count: { $sum: 1 }
      }
    }
  ]);

  // Browser breakdown
  const browserBreakdown = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: '$browser',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Hourly traffic
  const hourlyTraffic = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: {
          $hour: '$visitTime'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.status(200).json({
    success: true,
    traffic: {
      dailyTraffic,
      deviceBreakdown,
      browserBreakdown,
      hourlyTraffic
    }
  });
});

// @route   GET /api/analytics/products
// @desc    Get product analytics
// @access  Private (Admin)
exports.getProductAnalytics = asyncHandler(async (req, res, next) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Product performance
  const productPerformance = await Product.find({ isActive: true })
    .select('title clicks impressions category')
    .sort({ clicks: -1 });

  // Category performance
  const categoryPerformance = await ClickEvent.aggregate([
    {
      $match: { timestamp: { $gte: startDate } }
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    {
      $unwind: '$product'
    },
    {
      $group: {
        _id: '$product.category',
        clicks: { $sum: 1 }
      }
    },
    {
      $sort: { clicks: -1 }
    }
  ]);

  // Top products
  const topProducts = await Product.find({ isActive: true })
    .sort({ clicks: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    productAnalytics: {
      productPerformance,
      categoryPerformance,
      topProducts
    }
  });
});

// @route   GET /api/analytics/users
// @desc    Get user analytics
// @access  Private (Admin)
exports.getUserAnalytics = asyncHandler(async (req, res, next) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Returning vs new visitors
  const returningVsNew = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: '$isReturning',
        count: { $sum: 1 }
      }
    }
  ]);

  // Sessions count
  const totalSessions = await Visitor.countDocuments({ visitTime: { $gte: startDate } });

  // Average session duration
  const avgSessionDuration = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $group: {
        _id: null,
        avgDuration: { $avg: '$sessionDuration' }
      }
    }
  ]);

  // Top pages
  const topPages = await Visitor.aggregate([
    {
      $match: { visitTime: { $gte: startDate } }
    },
    {
      $unwind: '$pagesVisited'
    },
    {
      $group: {
        _id: '$pagesVisited',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.status(200).json({
    success: true,
    userAnalytics: {
      returningVsNew,
      totalSessions,
      avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0,
      topPages
    }
  });
});
