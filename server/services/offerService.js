const Offer = require('../models/Offer');
const { Product } = require('../models/Product');

// ============================================
// OFFER SERVICE UTILITIES
// ============================================

/**
 * Get best applicable offer for a product
 */
exports.getBestOfferForProduct = async (productId, category) => {
  const now = new Date();
  
  const offers = await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    $or: [
      { applicableProducts: { $in: [productId] } },
      { applicableCategories: { $in: [category] } },
      { applicableProducts: { $size: 0 }, applicableCategories: { $size: 0 } }
    ]
  }).sort({ priority: -1 }).limit(1);

  return offers.length > 0 ? offers[0] : null;
};

/**
 * Get all applicable offers for a product (for displaying multiple offers)
 */
exports.getApplicableOffers = async (productId, category) => {
  const now = new Date();
  
  return await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    $or: [
      { applicableProducts: { $in: [productId] } },
      { applicableCategories: { $in: [category] } },
      { applicableProducts: { $size: 0 }, applicableCategories: { $size: 0 } }
    ]
  }).sort({ priority: -1 });
};

/**
 * Calculate final price for a product with offer
 */
exports.calculateDiscountedPrice = (basePrice, offer) => {
  if (!offer) return basePrice;

  let discount = 0;

  if (offer.discountType === 'percentage') {
    discount = (basePrice * offer.discountValue) / 100;
  } else if (offer.discountType === 'fixedAmount') {
    discount = offer.discountValue;
  }

  // Apply maximum discount cap if set
  if (offer.maximumDiscount) {
    discount = Math.min(discount, offer.maximumDiscount);
  }

  return Math.max(0, basePrice - discount);
};

/**
 * Get discount details for display
 */
exports.getDiscountDetails = (basePrice, offer) => {
  if (!offer) return null;

  let discount = 0;
  let discountPercentage = 0;

  if (offer.discountType === 'percentage') {
    discountPercentage = offer.discountValue;
    discount = (basePrice * discountPercentage) / 100;
  } else if (offer.discountType === 'fixedAmount') {
    discount = offer.discountValue;
    discountPercentage = (discount / basePrice) * 100;
  }

  if (offer.maximumDiscount) {
    discount = Math.min(discount, offer.maximumDiscount);
    discountPercentage = (discount / basePrice) * 100;
  }

  const finalPrice = Math.max(0, basePrice - discount);

  return {
    offerTitle: offer.title,
    offerType: offer.offerType,
    originalPrice: basePrice,
    discount: Math.round(discount * 100) / 100,
    discountPercentage: Math.round(discountPercentage * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
    savings: Math.round(discount * 100) / 100,
    couponCode: offer.couponCode || null,
    expiryDate: offer.endDate
  };
};

/**
 * Update product with active offers
 */
exports.updateProductOffers = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) return;

  // Get applicable offers
  const offers = await this.getApplicableOffers(productId, product.category);

  // Update product
  product.activeOffers = offers.map(o => o._id);
  product.isOfferActive = offers.length > 0;

  // Calculate best offer price
  if (offers.length > 0) {
    const bestOffer = offers[0];
    const basePrice = product.originalPrice || product.price;
    product.originalPrice = basePrice;
    product.discountedPrice = this.calculateDiscountedPrice(basePrice, bestOffer);
  } else {
    product.discountedPrice = null;
    product.originalPrice = null;
  }

  await product.save();
};

/**
 * Update all products with active offers (bulk operation)
 */
exports.updateAllProductOffers = async () => {
  const products = await Product.find({ isActive: true });
  
  let updatedCount = 0;

  for (const product of products) {
    const offers = await this.getApplicableOffers(product._id, product.category);

    if (offers.length > 0) {
      const bestOffer = offers[0];
      const basePrice = product.originalPrice || product.price;
      
      product.activeOffers = offers.map(o => o._id);
      product.isOfferActive = true;
      product.originalPrice = basePrice;
      product.discountedPrice = this.calculateDiscountedPrice(basePrice, bestOffer);
      
      await product.save();
      updatedCount++;
    } else {
      if (product.isOfferActive) {
        product.activeOffers = [];
        product.isOfferActive = false;
        product.discountedPrice = null;
        await product.save();
        updatedCount++;
      }
    }
  }

  return updatedCount;
};

/**
 * Check if offer is valid for purchase
 */
exports.validateOfferForPurchase = async (offerId, cartTotal, products) => {
  const offer = await Offer.findById(offerId);
  
  if (!offer) {
    return { valid: false, message: 'Offer not found' };
  }

  // Check active status
  if (!offer.isActive || offer.isExpired) {
    return { valid: false, message: 'Offer is not active' };
  }

  // Check date range
  const now = new Date();
  if (offer.startDate > now || offer.endDate <= now) {
    return { valid: false, message: 'Offer is not valid at this time' };
  }

  // Check minimum purchase
  if (cartTotal < offer.minimumPurchase) {
    return { 
      valid: false, 
      message: `Minimum purchase of ₹${offer.minimumPurchase} required` 
    };
  }

  // Check usage limit
  if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
    return { valid: false, message: 'Offer usage limit exceeded' };
  }

  // Check product applicability
  if (offer.applicableProducts.length > 0) {
    const applicableProducts = offer.applicableProducts.map(id => id.toString());
    const hasApplicableProduct = products.some(p => applicableProducts.includes(p._id.toString()));
    
    if (!hasApplicableProduct) {
      return { valid: false, message: 'Offer is not applicable to these products' };
    }
  }

  return { valid: true, offer };
};

/**
 * Get banner offers for homepage
 */
exports.getBannerOffers = async () => {
  const now = new Date();
  
  return await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    displayPosition: { $in: ['hero', 'banner', 'carousel'] }
  })
  .sort({ priority: -1, displayPosition: 1 })
  .limit(5);
};

/**
 * Get popup offers
 */
exports.getPopupOffers = async () => {
  const now = new Date();
  
  return await Offer.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now },
    displayPosition: 'popup'
  })
  .sort({ priority: -1 })
  .limit(1);
};

/**
 * Get flash sale offers
 */
exports.getFlashSaleOffers = async () => {
  const now = new Date();
  
  return await Offer.find({
    isActive: true,
    isExpired: false,
    offerType: 'flash',
    startDate: { $lte: now },
    endDate: { $gt: now }
  })
  .sort({ priority: -1 });
};

/**
 * Get festive offers
 */
exports.getFestiveOffers = async () => {
  const now = new Date();
  
  return await Offer.find({
    isActive: true,
    isExpired: false,
    offerType: { $in: ['festive', 'seasonal'] },
    startDate: { $lte: now },
    endDate: { $gt: now }
  })
  .sort({ priority: -1 });
};

/**
 * Create offer summary for product listing
 */
exports.createProductOfferSummary = (basePrice, offers) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  const bestOffer = offers[0];
  let discount = 0;
  let discountPercentage = 0;

  if (bestOffer.discountType === 'percentage') {
    discountPercentage = bestOffer.discountValue;
    discount = (basePrice * discountPercentage) / 100;
  } else if (bestOffer.discountType === 'fixedAmount') {
    discount = bestOffer.discountValue;
    discountPercentage = (discount / basePrice) * 100;
  }

  if (bestOffer.maximumDiscount) {
    discount = Math.min(discount, bestOffer.maximumDiscount);
  }

  return {
    badge: bestOffer.offerType === 'bogo' ? 'BOGO' : `${Math.round(discountPercentage)}% OFF`,
    tag: bestOffer.title,
    originalPrice: basePrice,
    finalPrice: Math.max(0, basePrice - discount),
    savingsPercentage: Math.round(discountPercentage),
    offerId: bestOffer._id
  };
};

/**
 * Calculate BOGO offer final price
 */
exports.calculateBOGOPrice = (unitPrice, quantity, bogoConfig) => {
  if (!bogoConfig) return unitPrice * quantity;

  let totalPrice = 0;
  let itemsProcessed = 0;

  while (itemsProcessed < quantity) {
    // Buy items
    totalPrice += unitPrice * bogoConfig.buyQuantity;
    itemsProcessed += bogoConfig.buyQuantity;

    // Get free/discounted items
    if (itemsProcessed < quantity) {
      if (bogoConfig.getDiscount === 0) {
        // Free items
        itemsProcessed += Math.min(bogoConfig.getQuantity, quantity - itemsProcessed);
      } else {
        // Discounted items
        const discountedQuantity = Math.min(bogoConfig.getQuantity, quantity - itemsProcessed);
        const discountedPrice = unitPrice * (1 - bogoConfig.getDiscount / 100);
        totalPrice += discountedPrice * discountedQuantity;
        itemsProcessed += discountedQuantity;
      }
    }
  }

  return totalPrice;
};
