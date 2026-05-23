const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const { v4: uuidv4 } = require('uuid');

// @route   POST /api/track/visit
// @desc    Track visitor visit
// @access  Public
exports.trackVisit = asyncHandler(async (req, res, next) => {
  const { device, browser, page, userAgent, ipAddress } = req.body;
  let { sessionId } = req.body;

  if (!sessionId) {
    sessionId = uuidv4();
  }

  // Use findOneAndUpdate with upsert to prevent race conditions and duplicate key errors
  const visitor = await Visitor.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        device,
        browser,
        userAgent,
        ipAddress,
        lastVisit: new Date(),
        isReturning: true
      },
      $addToSet: { pagesVisited: page }
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    sessionId: visitor.sessionId
  });
});

// @route   POST /api/track/click
// @desc    Track product click
// @access  Public
exports.trackClick = asyncHandler(async (req, res, next) => {
  const { productId, sessionId, device, browser, userAgent, ipAddress } = req.body;

  if (!productId || !sessionId) {
    return res.status(400).json({ success: false, message: 'productId and sessionId are required' });
  }

  // Create click event
  const clickEvent = await ClickEvent.create({
    productId,
    sessionId,
    device,
    browser,
    userAgent,
    ipAddress
  });

  // Update product clicks
  await Product.findByIdAndUpdate(productId, { $inc: { clicks: 1 } });

  res.status(201).json({
    success: true,
    clickEvent
  });
});

// @route   GET /api/track/clicks/:productId
// @desc    Get product click count
// @access  Public
exports.getProductClicks = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({
    success: true,
    productId: product._id,
    clicks: product.clicks,
    impressions: product.impressions,
    clickRate: product.impressions > 0 ? ((product.clicks / product.impressions) * 100).toFixed(2) : 0
  });
});
