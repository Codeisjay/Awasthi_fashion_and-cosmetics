const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    visitTime: {
      type: Date,
      default: Date.now,
      index: true
    },
    pagesVisited: {
      type: [String],
      default: []
    },
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'desktop'
    },
    browser: {
      type: String,
      default: 'Unknown'
    },
    location: {
      country: String,
      city: String,
      state: String
    },
    userAgent: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    },
    sessionDuration: {
      type: Number,
      default: 0
    },
    isReturning: {
      type: Boolean,
      default: false
    },
    lastVisit: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);
