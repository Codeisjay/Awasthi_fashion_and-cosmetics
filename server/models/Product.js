const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: 2000
    },
    image: {
      type: String,
      required: [true, 'Please provide product image URL']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: [
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Sports',
        'Books',
        'Beauty',
        'Toys',
        'Automotive'
      ]
    },
    meeshoLink: {
      type: String,
      required: [true, 'Please provide Meesho product link']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      default: null,
      min: [0, 'Original price cannot be negative']
    },
    discountedPrice: {
      type: Number,
      default: null,
      min: [0, 'Discounted price cannot be negative']
    },
    activeOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
      }
    ],
    isOfferActive: {
      type: Boolean,
      default: false
    },
    clicks: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    stockStatus: {
      type: String,
      enum: ['in-stock', 'out-of-stock', 'limited'],
      default: 'in-stock'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
