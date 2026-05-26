/**
 * Product Service
 * Business logic for product operations
 */

const { Product, CATEGORIES, STOCK_STATUS } = require('../models/Product');
const ValidationService = require('./validationService');

class ProductService {
  /**
   * Create a new product
   */
  static async createProduct(data) {
    // Validate input data
    const validation = ValidationService.validateCreateProduct(data);

    if (!validation.valid) {
      const error = new Error(validation.errors[0]);
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    try {
      // Create product with validated data
      const product = await Product.create(validation.data);
      return product;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        error.statusCode = 400;
        error.details = messages;
      } else if (error.code === 11000) {
        error.statusCode = 409;
        error.message = 'Product with similar data already exists';
      } else {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Get all products with filtering and pagination
   */
  static async getProducts(filters = {}) {
    const {
      category,
      search,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'published'
    } = filters;

    // Build query
    const query = { isActive: true };

    if (category && Object.values(CATEGORIES).includes(category)) {
      query.category = category;
    }

    if (search && typeof search === 'string' && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && ['draft', 'published', 'archived'].includes(status)) {
      query.status = status;
    }

    // Build sort object
    const sortObj = {};
    const validSortFields = ['createdAt', 'price', 'clicks', 'impressions', 'featured', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    try {
      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sortObj)
          .limit(limitNum)
          .skip(skip)
          .lean(),
        Product.countDocuments(query)
      ]);

      return {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limitNum),
          currentPage: pageNum,
          pageSize: limitNum
        }
      };
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Get single product by ID
   */
  static async getProductById(id) {
    try {
      const product = await Product.findById(id).populate('activeOffers', 'title discount expiryDate');

      if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
      }

      // Increment impressions
      product.impressions += 1;
      await product.save();

      return product;
    } catch (error) {
      if (error.name === 'CastError') {
        error.statusCode = 400;
        error.message = 'Invalid product ID';
      } else if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Update product
   */
  static async updateProduct(id, data) {
    try {
      // Find product first
      const product = await Product.findById(id);

      if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
      }

      // Validate update data (partial validation)
      const validation = ValidationService.validateUpdateProduct({
        ...data,
        currentPrice: product.price
      });

      if (!validation.valid) {
        const error = new Error(validation.errors[0]);
        error.statusCode = 400;
        error.details = validation.errors;
        throw error;
      }

      // Apply updates
      Object.assign(product, validation.data);
      await product.save();

      return product;
    } catch (error) {
      if (error.name === 'CastError') {
        error.statusCode = 400;
        error.message = 'Invalid product ID';
      } else if (error.name === 'ValidationError' && !error.statusCode) {
        const messages = Object.values(error.errors).map(err => err.message);
        error.statusCode = 400;
        error.details = messages;
      } else if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Delete product (soft delete)
   */
  static async deleteProduct(id) {
    try {
      const product = await Product.findById(id);

      if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
      }

      product.isActive = false;
      product.status = 'archived';
      await product.save();

      return { message: 'Product deleted successfully', id };
    } catch (error) {
      if (error.name === 'CastError') {
        error.statusCode = 400;
        error.message = 'Invalid product ID';
      } else if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Bulk delete products
   */
  static async bulkDeleteProducts(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        const error = new Error('Product IDs must be a non-empty array');
        error.statusCode = 400;
        throw error;
      }

      const result = await Product.updateMany(
        { _id: { $in: ids } },
        { isActive: false, status: 'archived' }
      );

      return {
        message: 'Products deleted successfully',
        deletedCount: result.modifiedCount
      };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Record product click
   */
  static async recordProductClick(productId) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
      }

      product.clicks += 1;

      if (product.impressions > 0) {
        product.ctr = Math.round((product.clicks / product.impressions) * 10000) / 100;
      }

      await product.save();
      return product;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  /**
   * Get featured products
   */
  static async getFeaturedProducts(limit = 10) {
    try {
      const products = await Product.find({ featured: true, isActive: true })
        .limit(parseInt(limit))
        .lean();

      return products;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Search products
   */
  static async searchProducts(searchTerm, limit = 20) {
    try {
      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
        const error = new Error('Search term is required');
        error.statusCode = 400;
        throw error;
      }

      const products = await Product.find(
        { $text: { $search: searchTerm }, isActive: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit))
        .lean();

      return products;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category, limit = 20) {
    try {
      if (!category || !Object.values(CATEGORIES).includes(category)) {
        const error = new Error(`Invalid category. Must be one of: ${Object.values(CATEGORIES).join(', ')}`);
        error.statusCode = 400;
        throw error;
      }

      const products = await Product.find({ category, isActive: true })
        .limit(parseInt(limit))
        .lean();

      return products;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }

  /**
   * Get analytics for a product
   */
  static async getProductAnalytics(id) {
    try {
      const product = await Product.findById(id);

      if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
      }

      return {
        productId: product._id,
        title: product.title,
        clicks: product.clicks,
        impressions: product.impressions,
        ctr: product.ctr,
        price: product.price,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }
}

module.exports = ProductService;
