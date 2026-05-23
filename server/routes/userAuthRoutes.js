const express = require('express');
const googleAuthController = require('../controllers/googleAuthController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/google', googleAuthController.googleLogin);

// Protected routes
router.get('/user/me', protect, googleAuthController.getUserMe);
router.post('/user/logout', protect, googleAuthController.logoutUser);

module.exports = router;
