const mongoose = require('mongoose');

const clickEventSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    sessionId: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'desktop',
      required: true
    },
    browser: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    },
    referrer: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Index for efficient querying
clickEventSchema.index({ productId: 1, timestamp: -1 });
clickEventSchema.index({ sessionId: 1 });
clickEventSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ClickEvent', clickEventSchema);
