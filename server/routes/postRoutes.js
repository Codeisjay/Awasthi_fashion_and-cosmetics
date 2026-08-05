const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getAdminPosts,
  getPostById,
  addComment,
  uploadPostImage,
  deletePost
} = require('../controllers/postController');
const { protect, adminOnly } = require('../middleware/auth');
const { createUploader } = require('../middleware/upload');

const upload = createUploader('posts');

// Public routes
router.get('/', getAllPosts);
router.get('/admin', protect, adminOnly, getAdminPosts);
router.get('/:id', getPostById);

// Admin routes
router.post('/upload-image', protect, adminOnly, upload.single('image'), uploadPostImage);
router.post('/', protect, adminOnly, createPost);
router.delete('/:id', protect, adminOnly, deletePost);

// Comments (allow guest comments)
router.post('/:id/comments', addComment);

module.exports = router;
