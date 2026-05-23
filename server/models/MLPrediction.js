const mongoose = require('mongoose');

const mlPredictionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    predictedDemand: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true
    },
    predictedClicks: {
      type: Number,
      default: 0
    },
    trendScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    isIncreasing: {
      type: Boolean,
      default: false
    },
    recommendation: {
      type: String,
      enum: ['promote', 'maintain', 'reduce', 'discontinue'],
      default: 'maintain'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    nextUpdateAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MLPrediction', mlPredictionSchema);
