const express = require('express');
const {
  getRecommendations,
  getTrending,
  getDemandAnalysis,
  updatePrediction,
  generateMLPredictions
} = require('../controllers/mlController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes (Admin only)
router.get('/recommendations', protect, authorize('admin', 'superadmin'), getRecommendations);
router.get('/trending', protect, authorize('admin', 'superadmin'), getTrending);
router.get('/demand-analysis', protect, authorize('admin', 'superadmin'), getDemandAnalysis);
router.post('/predictions/:productId', protect, authorize('admin', 'superadmin'), updatePrediction);

// Manual trigger for ML predictions
router.post('/generate', protect, authorize('admin', 'superadmin'), generateMLPredictions);

module.exports = router;
