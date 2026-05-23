// MongoDB Aggregation Pipelines for Analytics

/**
 * Get daily traffic aggregation pipeline
 * @param {number} days - Number of days to get data for (default 30)
 * @returns {Array} Aggregation pipeline
 */
const getDailyTrafficPipeline = (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return [
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        clicks: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$sessionId' },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id',
        clicks: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' },
      },
    },
    {
      $sort: { date: 1 },
    },
  ];
};

/**
 * Get hourly traffic aggregation pipeline
 * @param {Date} date - Date to get data for (default today)
 * @returns {Array} Aggregation pipeline
 */
const getHourlyTrafficPipeline = (date = new Date()) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $hour: '$createdAt',
        },
        clicks: { $sum: 1 },
        uniqueVisitors: { $addToSet: '$sessionId' },
      },
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        clicks: 1,
        uniqueVisitors: { $size: '$uniqueVisitors' },
      },
    },
    {
      $sort: { hour: 1 },
    },
  ];
};

/**
 * Get device breakdown aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getDeviceBreakdownPipeline = () => [
  {
    $group: {
      _id: '$device',
      count: { $sum: 1 },
      percentage: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      device: '$_id',
      count: 1,
      percentage: { $multiply: [{ $divide: ['$count', 100] }, 100] },
    },
  },
  {
    $sort: { count: -1 },
  },
];

/**
 * Get browser breakdown aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getBrowserBreakdownPipeline = () => [
  {
    $group: {
      _id: '$browser',
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      browser: '$_id',
      count: 1,
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $limit: 10,
  },
];

/**
 * Get top products aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getTopProductsPipeline = () => [
  {
    $group: {
      _id: '$productId',
      clicks: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'product',
    },
  },
  {
    $unwind: '$product',
  },
  {
    $project: {
      _id: 0,
      productId: '$_id',
      productTitle: '$product.title',
      clicks: 1,
      category: '$product.category',
    },
  },
  {
    $sort: { clicks: -1 },
  },
  {
    $limit: 10,
  },
];

/**
 * Get click events by category aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getClicksByCategory = () => [
  {
    $lookup: {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product',
    },
  },
  {
    $unwind: '$product',
  },
  {
    $group: {
      _id: '$product.category',
      clicks: { $sum: 1 },
      revenue: { $sum: '$product.price' },
    },
  },
  {
    $project: {
      _id: 0,
      category: '$_id',
      clicks: 1,
      revenue: 1,
    },
  },
  {
    $sort: { clicks: -1 },
  },
];

/**
 * Get visitor session statistics aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getVisitorSessionStats = () => [
  {
    $group: {
      _id: '$sessionId',
      pagesVisited: { $first: { $size: '$pagesVisited' } },
      duration: { $first: '$sessionDuration' },
      device: { $first: '$device' },
      isReturning: { $first: '$isReturning' },
    },
  },
  {
    $facet: {
      totalSessions: [{ $count: 'count' }],
      returningVisitors: [
        { $match: { isReturning: true } },
        { $count: 'count' },
      ],
      averageSessionDuration: [
        { $group: { _id: null, avgDuration: { $avg: '$duration' } } },
      ],
      averagePagesPerSession: [
        { $group: { _id: null, avgPages: { $avg: '$pagesVisited' } } },
      ],
    },
  },
];

/**
 * Get returning vs new visitor ratio aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getReturningVsNewPipeline = () => [
  {
    $group: {
      _id: '$isReturning',
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      type: { $cond: ['$_id', 'Returning', 'New'] },
      count: 1,
    },
  },
];

/**
 * Get peak hours aggregation pipeline
 * @returns {Array} Aggregation pipeline
 */
const getPeakHoursPipeline = () => [
  {
    $group: {
      _id: { $hour: '$visitTime' },
      visits: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      hour: '$_id',
      visits: 1,
    },
  },
  {
    $sort: { visits: -1 },
  },
  {
    $limit: 5,
  },
];

module.exports = {
  getDailyTrafficPipeline,
  getHourlyTrafficPipeline,
  getDeviceBreakdownPipeline,
  getBrowserBreakdownPipeline,
  getTopProductsPipeline,
  getClicksByCategory,
  getVisitorSessionStats,
  getReturningVsNewPipeline,
  getPeakHoursPipeline,
};
