const express = require('express');
const router = express.Router();
const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  getActiveOffers,
  getOffersForProduct,
  getOffersForCategory,
  validateCoupon,
  applyOffer,
  recordConversion,
  getOfferAnalytics,
  autoExpireOffers,
  autoActivateScheduled,
  uploadOfferImage
} = require('../controllers/offerController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all active offers
router.get('/active', getActiveOffers);

// Get offers for specific product
router.get('/product/:productId', getOffersForProduct);

// Get offers for specific category
router.get('/category/:category', getOffersForCategory);

// Validate coupon code
router.post('/validate-coupon', validateCoupon);

// Apply offer to product
router.post('/apply', applyOffer);

// ============================================
// ADMIN ROUTES
// ============================================

// Image upload endpoint (before other routes)
router.post('/upload-image', protect, adminOnly, upload, uploadOfferImage);

// Get offer analytics (must be BEFORE /:id route)
router.get('/admin/analytics', protect, adminOnly, getOfferAnalytics);

// Auto expire offers (can be called by cron job)
router.post('/admin/auto-expire', protect, adminOnly, autoExpireOffers);

// Auto activate scheduled offers (can be called by cron job)
router.post('/admin/auto-activate', protect, adminOnly, autoActivateScheduled);

// Create offer
router.post('/', protect, adminOnly, createOffer);

// Get all offers
router.get('/', protect, adminOnly, getAllOffers);

// Get offer by ID
router.get('/:id', protect, adminOnly, getOfferById);

// Update offer
router.put('/:id', protect, adminOnly, updateOffer);

// Delete offer
router.delete('/:id', protect, adminOnly, deleteOffer);

// Toggle offer status
router.patch('/:id/toggle-status', protect, adminOnly, toggleOfferStatus);

// Record offer conversion
router.post('/record-conversion/:offerId', protect, recordConversion);

module.exports = router;
