const ClickEvent = require('../models/ClickEvent');
const Visitor = require('../models/Visitor');
const { Product } = require('../models/Product');
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

  console.log('[Tracking] Visit - sessionId:', sessionId, 'page:', page);

  const now = new Date();

  // Use findOneAndUpdate with upsert to prevent race conditions and duplicate key errors
  const visitor = await Visitor.findOneAndUpdate(
    { sessionId },
    {
      $set: {
        device,
        browser,
        userAgent,
        ipAddress,
        lastVisit: now,
        visitTime: now, // Ensure visitTime is set on both create and update
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

  console.log('[Tracking] Visitor saved/updated:', visitor._id, 'visitTime:', visitor.visitTime);

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

  console.log('[Tracking] Click - Request body:', { productId, sessionId, device, browser });

  if (!productId) {
    console.warn('[Tracking] Missing productId');
    return res.status(400).json({ success: false, message: 'productId is required' });
  }

  if (!sessionId) {
    console.warn('[Tracking] Missing sessionId');
    return res.status(400).json({ success: false, message: 'sessionId is required' });
  }

  try {
    // Validate and normalize device to enum values
    const validDevices = ['mobile', 'tablet', 'desktop'];
    let normalizedDevice = (device || '').toLowerCase().trim();
    
    // Default to 'desktop' if device is not one of the valid enum values
    if (!validDevices.includes(normalizedDevice)) {
      console.warn('[Tracking] Invalid device value:', device, '- defaulting to desktop');
      normalizedDevice = 'desktop';
    }

    // Create click event with all available data
    const clickData = {
      productId,
      sessionId,
      timestamp: new Date(),
      device: normalizedDevice,
      browser: browser || 'Unknown',
      userAgent: userAgent || null,
      ipAddress: ipAddress || null
    };

    console.log('[Tracking] Creating click event with normalized data:', clickData);

    const clickEvent = await ClickEvent.create(clickData);
    console.log('[Tracking] Click event created successfully:', clickEvent._id);

    // Update product clicks count
    const product = await Product.findById(productId);
    if (product) {
      product.clicks = (product.clicks || 0) + 1;
      await product.save();
      console.log('[Tracking] Product clicks updated to:', product.clicks);
    } else {
      console.warn('[Tracking] Product not found:', productId);
    }

    // Optionally update visitor
    if (sessionId) {
      await Visitor.findOneAndUpdate(
        { sessionId },
        { $push: { pagesVisited: `product-click-${productId}` } },
        { new: true }
      ).catch(err => console.log('[Tracking] Visitor update skipped:', err.message));
    }

    res.status(201).json({
      success: true,
      message: 'Click tracked successfully',
      clickEvent
    });
  } catch (error) {
    console.error('[Tracking] Error tracking click:', error.message);
    console.error('[Tracking] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to track click: ' + error.message
    });
  }
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
