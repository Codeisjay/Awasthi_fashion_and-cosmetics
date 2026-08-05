import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postService, ASSET_BASE_URL } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, Image, User, Heart, ArrowRightCircle } from 'lucide-react';

const PostsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [guestName, setGuestName] = useState({});
  const [sending, setSending] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getPosts();
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Unable to load posts at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) return `${ASSET_BASE_URL}${url}`;
    return url;
  };

  const handleCommentChange = (postId, value) => {
    setCommentText((prev) => ({ ...prev, [postId]: value }));
  };

  const handleGuestNameChange = (postId, value) => {
    setGuestName((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentText[postId]?.trim();
    const name = isAuthenticated ? undefined : (guestName[postId] || '').trim();
    if (!text) return;
    if (!isAuthenticated && !name) {
      setError('Please provide your name to post a comment');
      return;
    }

    setSending((prev) => ({ ...prev, [postId]: true }));
    setFeedback(null);
    setError(null);

    try {
      await postService.addComment(postId, text, name);
      setFeedback('Comment posted successfully.');
      setCommentText((prev) => ({ ...prev, [postId]: '' }));
      setGuestName((prev) => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError(err.response?.data?.message || 'Unable to post comment.');
    } finally {
      setSending((prev) => ({ ...prev, [postId]: false }));
      window.setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20 xs:pt-24 sm:pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg mb-4">
            <Image className="w-4 h-4" />
            <span className="text-sm font-semibold">Community Posts</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Stories from Awasthi Fashion</h1>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-3xl mx-auto">
            Browse recent image posts from our organization and join the conversation with comments.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="rounded-3xl bg-white shadow-lg p-6 animate-pulse h-96" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl bg-white shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h2>
                <p className="text-gray-600 mb-6">Our team is preparing the latest inspirational posts. Check back soon.</p>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition"
                >
                  Admin Login to add a post
                  <ArrowRightCircle className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post._id} className="rounded-[2rem] overflow-hidden bg-white shadow-xl border border-gray-200">
                  <div className="relative h-72 sm:h-80 lg:h-96">
                    <img
                      src={getAssetUrl(post.imageUrl)}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                      <span className="inline-flex items-center gap-2 bg-white/90 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm">
                        <Image className="w-3 h-3 text-blue-600" />
                        New Image Post
                      </span>
                      <h2 className="text-2xl xs:text-3xl font-bold text-white drop-shadow-lg">{post.title}</h2>
                      <p className="max-w-2xl text-sm xs:text-base text-white/90">{post.body?.slice(0, 120)}{post.body && post.body.length > 120 ? '...' : ''}</p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-gray-500 text-sm">Published on {new Date(post.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className="text-gray-900 font-semibold mt-1">Posted by {post.createdBy?.name || 'Admin'}</p>
                      </div>
                      <div className="inline-flex items-center gap-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full font-semibold">
                          <Heart className="w-4 h-4" /> {post.commentCount || 0} Comments
                        </span>
                      </div>
                    </div>

                    {post.body && (
                      <p className="text-gray-700 leading-relaxed text-sm xs:text-base">{post.body}</p>
                    )}

                    <div className="space-y-4">
                      {post.comments && post.comments.length > 0 ? (
                        <div className="space-y-4">
                          {post.comments.slice(0, 3).map((comment) => (
                            <div key={comment._id} className="rounded-3xl bg-gray-50 p-4 border border-gray-200">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-500">
                                  {comment.profileImage ? (
                                    <img src={getAssetUrl(comment.profileImage)} alt={comment.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-5 h-5" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">{comment.name}</p>
                                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.commentText}</p>
                            </div>
                          ))}
                          {post.comments.length > 3 && (
                            <p className="text-xs text-gray-500">Showing latest 3 comments. Refresh the page to see more.</p>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-3xl bg-blue-50 p-4 border border-blue-100 text-blue-700">
                          <p className="text-sm">No comments yet. Be the first one to share your thoughts.</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span>{isAuthenticated ? 'Leave a comment' : 'Leave a comment as guest'}</span>
                      </div>

                      {!isAuthenticated && (
                        <input
                          type="text"
                          value={guestName[post._id] || ''}
                          onChange={(e) => handleGuestNameChange(post._id, e.target.value)}
                          className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 focus:border-blue-500 focus:ring-0 outline-none"
                          placeholder="Your name (required)"
                        />
                      )}

                      <textarea
                        value={commentText[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                        rows={3}
                        className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-blue-500 focus:ring-0 outline-none resize-none"
                        placeholder={'Write your comment...'}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <button
                          onClick={() => handleCommentSubmit(post._id)}
                          disabled={sending[post._id] || !commentText[post._id] || (!isAuthenticated && !guestName[post._id])}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 text-sm font-semibold transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending[post._id] ? 'Posting…' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Why follow our posts?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Get styling inspiration from our latest product drops.</li>
                <li>• Discover customer stories and look ideas.</li>
                <li>• Stay up to date with new beauty launches and offers.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 text-white p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-3">Want to post?</h3>
              <p className="text-sm mb-4">Our organization team can share image posts directly from the admin panel.</p>
              <Link
                to="/admin/posts"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-blue-700 px-5 py-3 font-semibold shadow-lg hover:opacity-95 transition"
              >
                Add a new post
              </Link>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community guidelines</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Keep your comments respectful, on-topic, and helpful for others browsing our fashion and cosmetics community posts.
              </p>
            </div>
          </aside>
        </div>

        {feedback && (
          <div className="mt-8 rounded-3xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 shadow-sm">
            {feedback}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-3xl bg-red-50 border border-red-200 p-4 text-red-800 shadow-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
