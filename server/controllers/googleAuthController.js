const jwt = require('jwt-simple');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');

// Verify Google token
const verifyGoogleToken = async (token) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

// @route   POST /api/auth/google
// @desc    Login/Register user with Google
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { googleId, email, name, profileImage } = req.body;

  // Validate required fields
  if (!googleId || !email || !name) {
    return res.status(400).json({
      success: false,
      message: 'Please provide googleId, email, and name'
    });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ googleId });

    if (user) {
      // Existing user - update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Check if email exists from other sources
      let userByEmail = await User.findOne({ email });

      if (!userByEmail) {
        // Create new user
        user = await User.create({
          name,
          email,
          googleId,
          profileImage,
          lastLogin: new Date(),
          loginMethod: 'google'
        });
      } else {
        // Email exists, link Google ID
        userByEmail.googleId = googleId;
        userByEmail.profileImage = profileImage || userByEmail.profileImage;
        userByEmail.lastLogin = new Date();
        await userByEmail.save();
        user = userByEmail;
      }
    }

    // Generate JWT token
    const token = jwt.encode({ id: user._id, type: 'user' }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        loginMethod: user.loginMethod,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during Google login: ' + error.message
    });
  }
});

// @route   GET /api/auth/user/me
// @desc    Get current logged in user
// @access  Private
exports.getUserMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      loginMethod: user.loginMethod,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
});

// @route   POST /api/auth/user/logout
// @desc    Logout user (client-side handled but optional server endpoint)
// @access  Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
