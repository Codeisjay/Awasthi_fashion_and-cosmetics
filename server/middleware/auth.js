const jwt = require('jwt-simple');
const Admin = require('../models/Admin');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    
    // Check if it's an admin token
    if (decoded.type === 'admin' || !decoded.type) {
      req.user = await Admin.findById(decoded.id);
    } else if (decoded.type === 'user') {
      // Check if it's a user token
      req.user = await User.findById(decoded.id);
    }

    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'User role is not authorized to access this route' });
    }
    next();
  };
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Only admins can access this route' });
  }
};

module.exports = { protect, authorize, adminOnly };
