const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private (Admin)
exports.getOverview = asyncHandler(async (req, res, next) => {
  // Total visitors
  const totalVisitors = await Visitor.countDocuments();

  // Total clicks
  const totalClicks = await ClickEvent.countDocuments();

  // Total products
  const totalProducts = await Product.countDocuments({ isActive: true });

  // Today's visitors
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayVisitors = await Visitor.countDocuments({ visitTime: { $gte: today } });

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
