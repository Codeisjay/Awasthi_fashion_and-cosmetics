const Offer = require('../models/Offer');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// CREATE OFFER
exports.createOffer = asyncHandler(async (req, res) => {
  const { title, description, offerType, discountType, discountValue, bogoConfig, couponCode, bannerImage, mobileBannerImage, applicableProducts, applicableCategories, minimumPurchase, maximumDiscount, startDate, endDate, priority, displayPosition, usageLimit, notes } = req.body;

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ success: false, message: 'End date must be after start date' });
  }

  const offer = await Offer.create({
    title,
    description,
    offerType,
    discountType,
    discountValue,
    bogoConfig,
    couponCode,
    bannerImage,
    mobilebannerImage: mobileBannerImage,
    applicableProducts: applicableProducts || [],
    applicableCategories: applicableCategories || [],
    minimumPurchase: minimumPurchase || 0,
    maximumDiscount: maximumDiscount || null,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    priority: priority || 0,
    displayPosition: displayPosition || 'none',
    usageLimit: usageLimit || null,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, offer });
});

// GET ALL OFFERS
exports.getAllOffers = asyncHandler(async (req, res) => {
  const { isActive, offerType, sortBy } = req.query;
  let filter = {};
  
  if (isActive === 'true') {
    filter.isActive = true;
    filter.isExpired = false;
  } else if (isActive === 'false') {
    filter.isActive = false;
  }
  if (offerType) filter.offerType = offerType;

  let query = Offer.find(filter);
  if (sortBy === 'priority') query = query.sort({ priority: -1 });
  else if (sortBy === 'date') query = query.sort({ startDate: -1 });
  else query = query.sort({ createdAt: -1 });

  const offers = await query.populate('applicableProducts');
  res.status(200).json({ success: true, count: offers.length, offers });
});

// GET OFFER BY ID
exports.getOfferById = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id).populate('applicableProducts').populate('createdBy', 'name email');
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
  res.status(200).json({ success: true, offer });
});

// UPDATE OFFER
exports.updateOffer = asyncHandler(async (req, res) => {
  let offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

  const updatableFields = ['title', 'description', 'discountValue', 'bogoConfig', 'bannerImage', 'mobilebannerImage', 'applicableProducts', 'applicableCategories', 'minimumPurchase', 'maximumDiscount', 'priority', 'displayPosition', 'usageLimit', 'notes', 'isActive'];

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      offer[field] = req.body[field];
    }
  });

  if (req.body.startDate || req.body.endDate) {
    const startDate = req.body.startDate ? new Date(req.body.startDate) : offer.startDate;
    const endDate = req.body.endDate ? new Date(req.body.endDate) : offer.endDate;
    if (startDate >= endDate) return res.status(400).json({ success: false, message: 'End date must be after start date' });
    offer.startDate = startDate;
    offer.endDate = endDate;
  }

  offer.updatedBy = req.user._id;
  await offer.save();
  res.status(200).json({ success: true, offer });
});

// DELETE OFFER
exports.deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
  
  await Product.updateMany({ activeOffers: offer._id }, { $pull: { activeOffers: offer._id } });
  res.status(200).json({ success: true, message: 'Offer deleted successfully' });
});

// TOGGLE OFFER STATUS
exports.toggleOfferStatus = asyncHandler(async (req, res) => {
  let offer = await Offer.findById(req.params.id);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

  offer.isActive = !offer.isActive;
  await offer.save();
  res.status(200).json({ success: true, message: `Offer ${offer.isActive ? 'activated' : 'deactivated'}`, offer });
});

// GET ACTIVE OFFERS
exports.getActiveOffers = asyncHandler(async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now }
  }).sort({ priority: -1 });

  res.status(200).json({ success: true, count: offers.length, offers });
});

// GET OFFERS FOR PRODUCT
exports.getOffersForProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    $or: [
      { applicableProducts: { $in: [productId] } },
      { applicableCategories: { $in: [product.category] } },
      { applicableProducts: { $size: 0 }, applicableCategories: { $size: 0 } }
    ]
  }).sort({ priority: -1 });

  res.status(200).json({ success: true, count: offers.length, offers });
});

// GET OFFERS FOR CATEGORY
exports.getOffersForCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const now = new Date();
  
  const offers = await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    $or: [
      { applicableCategories: { $in: [category] } },
      { applicableProducts: { $size: 0 }, applicableCategories: { $size: 0 } }
    ]
  }).sort({ priority: -1 });

  res.status(200).json({ success: true, count: offers.length, offers });
});

// VALIDATE COUPON CODE
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { couponCode, cartTotal } = req.body;
  if (!couponCode) return res.status(400).json({ success: false, message: 'Coupon code is required' });

  const offer = await Offer.findOne({
    couponCode: couponCode.toUpperCase(),
    isActive: true,
    isExpired: false
  });

  if (!offer) return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });

  const now = new Date();
  if (offer.startDate > now || offer.endDate <= now) return res.status(400).json({ success: false, message: 'Coupon code is not valid at this time' });
  if (cartTotal < offer.minimumPurchase) return res.status(400).json({ success: false, message: `Minimum purchase amount of ₹${offer.minimumPurchase} required for this coupon` });
  if (offer.usageLimit && offer.usageCount >= offer.usageLimit) return res.status(400).json({ success: false, message: 'Coupon usage limit exceeded' });

  const discount = offer.calculateDiscount(cartTotal);
  const finalAmount = Math.max(0, cartTotal - discount);

  res.status(200).json({ 
    success: true, 
    message: 'Coupon code is valid',
    offer: {
      _id: offer._id,
      couponCode: offer.couponCode,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      discount: discount,
      finalAmount: finalAmount
    }
  });
});

// APPLY OFFER
exports.applyOffer = asyncHandler(async (req, res) => {
  const { offerId, productId, quantity } = req.body;

  const offer = await Offer.findById(offerId);
  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  if (!offer.isCurrentlyActive()) return res.status(400).json({ success: false, message: 'Offer is not active' });
  if (!offer.isApplicableToProduct(productId, product.category)) return res.status(400).json({ success: false, message: 'Offer is not applicable to this product' });

  const basePrice = product.originalPrice || product.price;
  const discount = offer.calculateDiscount(basePrice);
  const finalPrice = basePrice - discount;

  offer.clicks += 1;
  await offer.save();

  res.status(200).json({ 
    success: true, 
    discount: discount,
    originalPrice: basePrice,
    finalPrice: finalPrice,
    savings: ((discount / basePrice) * 100).toFixed(2) + '%'
  });
});

// RECORD CONVERSION
exports.recordConversion = asyncHandler(async (req, res) => {
  const { offerId } = req.params;
  const { revenue } = req.body;

  const offer = await Offer.findByIdAndUpdate(
    offerId,
    {
      $inc: {
        conversions: 1,
        revenue: revenue || 0,
        usageCount: 1
      }
    },
    { new: true }
  );

  if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
  res.status(200).json({ success: true, offer });
});

// GET OFFER ANALYTICS
exports.getOfferAnalytics = asyncHandler(async (req, res) => {
  const offers = await Offer.find();

  const analytics = {
    totalOffers: offers.length,
    activeOffers: offers.filter(o => o.isActive && !o.isExpired).length,
    totalClicks: offers.reduce((sum, o) => sum + o.clicks, 0),
    totalConversions: offers.reduce((sum, o) => sum + o.conversions, 0),
    totalRevenue: offers.reduce((sum, o) => sum + o.revenue, 0),
    conversionRate: offers.length > 0 ? ((offers.reduce((sum, o) => sum + o.conversions, 0) / offers.reduce((sum, o) => sum + o.clicks, 0)) * 100).toFixed(2) : 0,
    offersByType: {},
    topOffers: []
  };

  offers.forEach(offer => {
    analytics.offersByType[offer.offerType] = (analytics.offersByType[offer.offerType] || 0) + 1;
  });

  analytics.topOffers = offers.sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(o => ({
    title: o.title,
    revenue: o.revenue,
    conversions: o.conversions,
    clicks: o.clicks
  }));

  res.status(200).json({ success: true, analytics });
});

// AUTO EXPIRE OFFERS
exports.autoExpireOffers = asyncHandler(async (req, res) => {
  const now = new Date();
  
  const result = await Offer.updateMany(
    { endDate: { $lte: now }, isExpired: false },
    { isExpired: true, isActive: false }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} offers expired automatically` });
});

// AUTO ACTIVATE SCHEDULED OFFERS
exports.autoActivateScheduled = asyncHandler(async (req, res) => {
  const now = new Date();
  
  const result = await Offer.updateMany(
    { startDate: { $lte: now }, endDate: { $gt: now }, isActive: false, isExpired: false },
    { isActive: true }
  );

  res.status(200).json({ success: true, message: `${result.modifiedCount} offers activated automatically` });
});

// UPLOAD OFFER IMAGE
exports.uploadOfferImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }

  // Generate the image URL
  const imageUrl = `/uploads/offers/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    imageUrl: imageUrl,
    filename: req.file.filename
  });
});
