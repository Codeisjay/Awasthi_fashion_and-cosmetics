const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

exports.createPost = asyncHandler(async (req, res) => {
  const { title, body, imageUrl, isPublished } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Title and image are required' });
  }

  const post = await Post.create({
    title,
    body,
    imageUrl,
    isPublished: isPublished !== undefined ? isPublished : true,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, post });
});

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  res.status(200).json({ success: true, count: posts.length, posts });
});

exports.getAdminPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  res.status(200).json({ success: true, count: posts.length, posts });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('comments.author', 'name profileImage');

  if (!post || !post.isPublished) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, post });
});

exports.addComment = asyncHandler(async (req, res) => {
  const { commentText, name, profileImage } = req.body;
  const postId = req.params.id;

  if (!commentText || !commentText.trim()) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  const post = await Post.findById(postId);
  if (!post || !post.isPublished) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  // Determine commenter identity: authenticated users or guests
  let author = null;
  let commenterName = name ? name.trim() : null;
  let commenterProfile = profileImage || null;

  if (req.user) {
    author = req.user._id;
    commenterName = req.user.name || commenterName || 'Guest';
    commenterProfile = req.user.profileImage || commenterProfile || null;
  } else {
    // For guest comments require a name
    if (!commenterName) {
      return res.status(400).json({ success: false, message: 'Name is required for guest comments' });
    }
  }

  const comment = {
    author: author,
    name: commenterName,
    profileImage: commenterProfile || null,
    commentText: commentText.trim()
  };

  post.comments.unshift(comment);
  await post.save();

  res.status(201).json({ success: true, comment });
});

exports.uploadPostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }

  const imageUrl = `/uploads/posts/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Post image uploaded successfully',
    imageUrl,
    filename: req.file.filename
  });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.status(200).json({ success: true, message: 'Post deleted successfully' });
});
