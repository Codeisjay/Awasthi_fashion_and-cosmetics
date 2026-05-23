const jwt = require('jwt-simple');
const Admin = require('../models/Admin');
const asyncHandler = require('../middleware/asyncHandler');

// @route   POST /api/auth/register
// @desc    Register admin user
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  // Check if admin exists
  let admin = await Admin.findOne({ email });
  if (admin) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  // Create admin
  admin = await Admin.create({
    name,
    email,
    password,
    role: 'admin'
  });

  const token = jwt.encode({ id: admin._id }, process.env.JWT_SECRET);

  res.status(201).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }
  });
});

// @route   POST /api/auth/login
// @desc    Login admin user
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  const token = jwt.encode({ id: admin._id }, process.env.JWT_SECRET);

  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }
  });
});

// @route   GET /api/auth/me
// @desc    Get current logged in admin
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.user.id);

  res.status(200).json({
    success: true,
    admin
  });
});
