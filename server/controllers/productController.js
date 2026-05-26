/**
 * Product Controller
 * Handles HTTP requests for product operations
 */

const asyncHandler = require('../middleware/asyncHandler');
const ProductService = require('../services/productService');

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, search, page, limit, sortBy, sortOrder, status } = req.query;

  const filters = {
    category,
    search,
    page: page || 1,
    limit: limit || 12,
    sortBy,
    sortOrder,
    status: status || 'published'
  };

  const result = await ProductService.getProducts(filters);

  res.status(200).json({
    success: true,
    ...result
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const { limit } = req.query;

  const products = await ProductService.getFeaturedProducts(limit || 10);

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products/search
// @desc    Search products
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { q, limit } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query (q) is required'
    });
  }

  const products = await ProductService.searchProducts(q, limit || 20);

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const { limit } = req.query;

  const products = await ProductService.getProductsByCategory(category, limit || 20);

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductService.getProductById(id);

  res.status(200).json({
    success: true,
    product
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   GET /api/products/:id/analytics
// @desc    Get product analytics
// @access  Private (Admin)
// ═══════════════════════════════════════════════════════════════
exports.getProductAnalytics = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const analytics = await ProductService.getProductAnalytics(id);

  res.status(200).json({
    success: true,
    analytics
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin)
// ═══════════════════════════════════════════════════════════════
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await ProductService.createProduct(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
// ═══════════════════════════════════════════════════════════════
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductService.updateProduct(id, req.body);

  res.status(200).json({
    success: true,
    product
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin)
// ═══════════════════════════════════════════════════════════════
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const result = await ProductService.deleteProduct(id);

  res.status(200).json({
    success: true,
    ...result
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   DELETE /api/products
// @desc    Bulk delete products
// @access  Private (Admin)
// ═══════════════════════════════════════════════════════════════
exports.bulkDeleteProducts = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;

  const result = await ProductService.bulkDeleteProducts(ids);

  res.status(200).json({
    success: true,
    ...result
  });
});

// ═══════════════════════════════════════════════════════════════
// @route   POST /api/products/:id/click
// @desc    Record product click
// @access  Public
// ═══════════════════════════════════════════════════════════════
exports.recordProductClick = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductService.recordProductClick(id);

  res.status(200).json({
    success: true,
    product
  });
});
