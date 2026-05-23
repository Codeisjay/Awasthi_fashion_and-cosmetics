const express = require('express');
const {
  getOverview,
  getTraffic,
  getProductAnalytics,
  getUserAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes (Admin only)
router.get('/overview', protect, authorize('admin', 'superadmin'), getOverview);
router.get('/traffic', protect, authorize('admin', 'superadmin'), getTraffic);
router.get('/products', protect, authorize('admin', 'superadmin'), getProductAnalytics);
router.get('/users', protect, authorize('admin', 'superadmin'), getUserAnalytics);

module.exports = router;
