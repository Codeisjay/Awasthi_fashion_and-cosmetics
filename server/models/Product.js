const mongoose = require('mongoose');

const CATEGORIES = {
  ELECTRONICS: 'Electronics',
  FASHION: 'Fashion',
  HOME_KITCHEN: 'Home & Kitchen',
  SPORTS: 'Sports',
  BOOKS: 'Books',
  BEAUTY: 'Beauty',
  TOYS: 'Toys',
  AUTOMOTIVE: 'Automotive'
};

const STOCK_STATUS = {
  IN_STOCK: 'in-stock',
  OUT_OF_STOCK: 'out-of-stock',
  LIMITED: 'limited'
};

const productSchema = new mongoose.Schema(
  {
    // ═══════════════════════════════════════════════════════════════
    // CORE PRODUCT INFORMATION
    // ═══════════════════════════════════════════════════════════════
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Product title must be at least 3 characters'],
      maxlength: [200, 'Product title cannot exceed 200 characters'],
      index: true // For faster searches
    },
    
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Product description must be at least 10 characters'],
      maxlength: [2000, 'Product description cannot exceed 2000 characters']
    },
    
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v) || /^data:image/.test(v);
        },
        message: 'Image must be a valid URL or data URI'
      }
    },
    
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: Object.values(CATEGORIES),
        message: `Category must be one of: ${Object.values(CATEGORIES).join(', ')}`
      },
      index: true
    },
    
    meeshoLink: {
      type: String,
      required: [true, 'Meesho link is required'],
      validate: {
        validator: function(v) {
          return /^https?:\/\/(www\.)?meesho\.com/.test(v);
        },
        message: 'Meesho link must be a valid Meesho product URL'
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // PRICING
    // ═══════════════════════════════════════════════════════════════
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0.01, 'Price must be greater than 0'],
      set: function(val) {
        // Auto-round to 2 decimal places
        return Math.round(val * 100) / 100;
      }
    },
    
    originalPrice: {
      type: Number,
      default: null,
      min: [0, 'Original price cannot be negative'],
      set: function(val) {
        return val === null || val === undefined ? null : Math.round(val * 100) / 100;
      }
    },
    
    discountedPrice: {
      type: Number,
      default: null,
      min: [0, 'Discounted price cannot be negative'],
      set: function(val) {
        return val === null || val === undefined ? null : Math.round(val * 100) / 100;
      },
      validate: {
        validator: function(val) {
          if (val === null || val === undefined) return true;
          if (this.price && val >= this.price) {
            return false;
          }
          return true;
        },
        message: 'Discounted price must be less than selling price'
      }
    },
    
    // Calculated discount percentage
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount percentage cannot be negative'],
      max: [100, 'Discount percentage cannot exceed 100']
    },

    // ═══════════════════════════════════════════════════════════════
    // INVENTORY & AVAILABILITY
    // ═══════════════════════════════════════════════════════════════
    stockStatus: {
      type: String,
      enum: {
        values: Object.values(STOCK_STATUS),
        message: `Stock status must be one of: ${Object.values(STOCK_STATUS).join(', ')}`
      },
      default: STOCK_STATUS.IN_STOCK,
      index: true
    },
    
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },

    // ═══════════════════════════════════════════════════════════════
    // ENGAGEMENT METRICS
    // ═══════════════════════════════════════════════════════════════
    clicks: {
      type: Number,
      default: 0,
      min: [0, 'Clicks cannot be negative']
    },
    
    impressions: {
      type: Number,
      default: 0,
      min: [0, 'Impressions cannot be negative']
    },
    
    ctr: {
      type: Number, // Click-through rate: (clicks / impressions) * 100
      default: 0,
      min: [0, 'CTR cannot be negative'],
      max: [100, 'CTR cannot exceed 100']
    },

    // ═══════════════════════════════════════════════════════════════
    // OFFERS & PROMOTIONS
    // ═══════════════════════════════════════════════════════════════
    activeOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
      }
    ],
    
    isOfferActive: {
      type: Boolean,
      default: false,
      index: true
    },

    // ═══════════════════════════════════════════════════════════════
    // STATUS & METADATA
    // ═══════════════════════════════════════════════════════════════
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true
    },
    
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    
    // Admin notes
    notes: {
      type: String,
      default: '',
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ═══════════════════════════════════════════════════════════════
// VIRTUAL FIELDS
// ═══════════════════════════════════════════════════════════════
productSchema.virtual('discountAmount').get(function() {
  if (this.discountedPrice) {
    return Math.round((this.price - this.discountedPrice) * 100) / 100;
  }
  return 0;
});

productSchema.virtual('isFeatured').get(function() {
  return this.featured === true;
});

// ═══════════════════════════════════════════════════════════════
// INDEXES
// ═══════════════════════════════════════════════════════════════
productSchema.index({ title: 'text', description: 'text' }); // For full-text search
productSchema.index({ category: 1, isActive: 1 }); // For category filtering
productSchema.index({ createdAt: -1 }); // For sorting by date
productSchema.index({ featured: 1, isActive: 1 }); // For featured products
productSchema.index({ price: 1 }); // For price filtering

// ═══════════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════════
// Calculate discount percentage before save
productSchema.pre('save', function(next) {
  if (this.discountedPrice && this.price > 0) {
    this.discountPercentage = Math.round(
      ((this.price - this.discountedPrice) / this.price) * 100
    );
  } else {
    this.discountPercentage = 0;
  }
  
  // Calculate CTR
  if (this.impressions > 0) {
    this.ctr = Math.round((this.clicks / this.impressions) * 10000) / 100;
  } else {
    this.ctr = 0;
  }
  
  next();
});

module.exports = {
  Product: mongoose.model('Product', productSchema),
  CATEGORIES,
  STOCK_STATUS
};
