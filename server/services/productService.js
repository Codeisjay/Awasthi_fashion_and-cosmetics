// Product Service - Business Logic

const Product = require('../models/Product');

/**
 * Get all products with filtering and pagination
 */
const getAllProducts = async (filters = {}) => {
  const { category, search, page = 1, limit = 12, isActive = true } = filters;

  const query = { isActive };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get single product by ID
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

/**
 * Create new product
 */
const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

/**
 * Update product
 */
const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

/**
 * Delete product (soft delete)
 */
const deleteProduct = async (id) => {
  return await updateProduct(id, { isActive: false });
};

/**
 * Get products by category
 */
const getProductsByCategory = async (category) => {
  return await Product.find({ category, isActive: true }).sort({ createdAt: -1 });
};

/**
 * Get products with stock status
 */
const getProductsByStockStatus = async (status) => {
  return await Product.find({ stockStatus: status, isActive: true });
};

/**
 * Search products
 */
const searchProducts = async (searchTerm) => {
  return await Product.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { category: { $regex: searchTerm, $options: 'i' } },
    ],
    isActive: true,
  });
};

/**
 * Get top products by clicks
 */
const getTopProductsByClicks = async (limit = 10) => {
  return await Product.find({ isActive: true })
    .sort({ clicks: -1 })
    .limit(limit);
};

/**
 * Get bottom products by clicks (least popular)
 */
const getBottomProductsByClicks = async (limit = 10) => {
  return await Product.find({ isActive: true })
    .sort({ clicks: 1 })
    .limit(limit);
};

/**
 * Increment product clicks
 */
const incrementProductClicks = async (productId) => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { clicks: 1 } },
    { new: true }
  );
};

/**
 * Increment product impressions
 */
const incrementProductImpressions = async (productId) => {
  return await Product.findByIdAndUpdate(
    productId,
    { $inc: { impressions: 1 } },
    { new: true }
  );
};

/**
 * Get product statistics
 */
const getProductStats = async (productId) => {
  const product = await getProductById(productId);
  const ctr = product.impressions > 0 ? (product.clicks / product.impressions) * 100 : 0;

  return {
    productId,
    title: product.title,
    clicks: product.clicks,
    impressions: product.impressions,
    ctr: Math.round(ctr * 100) / 100,
    category: product.category,
    stockStatus: product.stockStatus,
  };
};

/**
 * Get all categories
 */
const getAllCategories = async () => {
  const categories = await Product.distinct('category', { isActive: true });
  return categories.sort();
};

/**
 * Bulk update products
 */
const bulkUpdateProducts = async (updates) => {
  const bulkOps = updates.map((update) => ({
    updateOne: {
      filter: { _id: update.id },
      update: { $set: update.data },
    },
  }));

  return await Product.bulkWrite(bulkOps);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByStockStatus,
  searchProducts,
  getTopProductsByClicks,
  getBottomProductsByClicks,
  incrementProductClicks,
  incrementProductImpressions,
  getProductStats,
  getAllCategories,
  bulkUpdateProducts,
};
