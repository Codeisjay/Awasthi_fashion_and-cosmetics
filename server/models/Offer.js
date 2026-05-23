const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Offer Type
    offerType: {
      type: String,
      enum: ['festive', 'percentage', 'fixed', 'bogo', 'seasonal', 'flash', 'category', 'product'],
      required: [true, 'Offer type is required'],
      default: 'percentage'
    },

    // Discount Configuration
    discountType: {
      type: String,
      enum: ['percentage', 'fixedAmount', 'bogo'],
      required: [true, 'Discount type is required']
    },

    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
      validate: {
        validator: function() {
          if (this.discountType === 'percentage') {
            return this.discountValue <= 100;
          }
          return true;
        },
        message: 'Percentage discount cannot exceed 100%'
      }
    },

    // BOGO Configuration
    bogoConfig: {
      buyQuantity: { type: Number, default: 1 },
      getQuantity: { type: Number, default: 1 },
      getDiscount: { type: Number, default: 0 } // 0 = free, otherwise percentage discount
    },

    // Coupon Configuration
    couponCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true
    },

    // Banner & Media
    bannerImage: {
      type: String,
      trim: true
    },

    mobilebannerImage: {
      type: String,
      trim: true
    },

    // Applicability
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    applicableCategories: [
      {
        type: String,
        trim: true
      }
    ],

    // Constraints
    minimumPurchase: {
      type: Number,
      default: 0,
      min: [0, 'Minimum purchase cannot be negative']
    },

    maximumDiscount: {
      type: Number,
      default: null,
      min: [0, 'Maximum discount cannot be negative']
    },

    // Dates
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },

    // Status
    isActive: {
      type: Boolean,
      default: true
    },

    isExpired: {
      type: Boolean,
      default: false
    },

    // Priority & Display
    priority: {
      type: Number,
      default: 0,
      // Higher number = higher priority
      // Flash Sale = 100, Festive = 50, Seasonal = 10
    },

    displayPosition: {
      type: String,
      enum: ['hero', 'carousel', 'popup', 'banner', 'none'],
      default: 'none'
    },

    // Usage Tracking
    usageLimit: {
      type: Number,
      default: null
    },

    usageCount: {
      type: Number,
      default: 0
    },

    // Analytics
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },

    // Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },

    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// Indexes for faster queries
offerSchema.index({ startDate: 1, endDate: 1 });
offerSchema.index({ isActive: 1, isExpired: 1 });
offerSchema.index({ offerType: 1 });
offerSchema.index({ couponCode: 1 });
offerSchema.index({ applicableProducts: 1 });
offerSchema.index({ applicableCategories: 1 });
offerSchema.index({ priority: -1 });

// Pre-save validation
offerSchema.pre('save', async function(next) {
  // Check coupon code uniqueness if provided
  if (this.couponCode) {
    const existing = await mongoose.model('Offer').findOne({
      couponCode: this.couponCode,
      _id: { $ne: this._id }
    });
    if (existing) {
      throw new Error('Coupon code already exists');
    }
  }

  // Check if offer has expired
  if (this.endDate < new Date()) {
    this.isExpired = true;
  }

  next();
});

// Method to check if offer is currently active
offerSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && !this.isExpired && this.startDate <= now && this.endDate > now;
};

// Method to check if offer is applicable to a product
offerSchema.methods.isApplicableToProduct = function(productId, category) {
  if (this.applicableProducts.length > 0) {
    return this.applicableProducts.some(id => id.toString() === productId.toString());
  }
  if (this.applicableCategories.length > 0) {
    return this.applicableCategories.includes(category);
  }
  return true; // Apply to all if no specific products/categories
};

// Method to calculate discount amount
offerSchema.methods.calculateDiscount = function(price) {
  if (this.discountType === 'percentage') {
    const discount = (price * this.discountValue) / 100;
    if (this.maximumDiscount) {
      return Math.min(discount, this.maximumDiscount);
    }
    return discount;
  } else if (this.discountType === 'fixedAmount') {
    if (this.maximumDiscount) {
      return Math.min(this.discountValue, this.maximumDiscount);
    }
    return this.discountValue;
  }
  return 0;
};

// Static method to get active offers
offerSchema.statics.getActiveOffers = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    isExpired: false,
    startDate: { $lte: now },
    endDate: { $gt: now }
  }).sort({ priority: -1 });
};

// Static method to get offers for a product
offerSchema.statics.getOffersForProduct = function(productId, category) {
  const now = new Date();
  return this.find({
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

module.exports = mongoose.model('Offer', offerSchema);
