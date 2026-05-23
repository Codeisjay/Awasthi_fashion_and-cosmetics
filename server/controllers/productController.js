const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, search, page = 1, limit = 12 } = req.query;

  let query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const startIndex = (page - 1) * limit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(startIndex);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    products
  });
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Increment impressions
  product.impressions += 1;
  await product.save();

  res.status(200).json({
    success: true,
    product
  });
});

// @route   POST /api/products
// @desc    Create product
// @access  Private (Admin)
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, image, category, meeshoLink, stockStatus } = req.body;

  // Validate
  if (!title || !description || !image || !category || !meeshoLink) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  const product = await Product.create({
    title,
    description,
    image,
    category,
    meeshoLink,
    stockStatus: stockStatus || 'in-stock'
  });

  res.status(201).json({
    success: true,
    product
  });
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    product
  });
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin)
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted'
  });
});
