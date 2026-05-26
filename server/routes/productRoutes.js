const express = require('express');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  getProductAnalytics,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  recordProductClick
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES - SPECIFIC PATHS FIRST
// ═══════════════════════════════════════════════════════════════
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES - PARAMETERIZED PATHS
// ═══════════════════════════════════════════════════════════════
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/:id/click', recordProductClick);

// ═══════════════════════════════════════════════════════════════
// PUBLIC ROUTES - GENERAL
// ═══════════════════════════════════════════════════════════════
router.get('/', getProducts);

// ═══════════════════════════════════════════════════════════════
// PROTECTED ROUTES (Admin Only)
// ═══════════════════════════════════════════════════════════════
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.get('/:id/analytics', protect, authorize('admin', 'superadmin'), getProductAnalytics);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);
router.delete('/', protect, authorize('admin', 'superadmin'), bulkDeleteProducts);

module.exports = router;
