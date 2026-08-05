const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null
    },
    name: {
      type: String,
      required: [true, 'Commenter name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    profileImage: {
      type: String,
      trim: true,
      default: null
    },
    commentText: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [150, 'Post title cannot exceed 150 characters']
    },
    body: {
      type: String,
      trim: true,
      maxlength: [2000, 'Post body cannot exceed 2000 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'Post image URL is required'],
      trim: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

postSchema.virtual('commentCount').get(function () {
  return this.comments ? this.comments.length : 0;
});

postSchema.index({ createdAt: -1 });
postSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Post', postSchema);
