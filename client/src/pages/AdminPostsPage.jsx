import React, { useEffect, useState } from 'react';
import AdminNavbar from '../dashboard/AdminNavbar';
import { postService, ASSET_BASE_URL } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Plus, Upload, Trash2, Eye } from 'lucide-react';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: '',
    isPublished: true
  });
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchAdminPosts();
  }, []);

  const fetchAdminPosts = async () => {
    setLoading(true);
    try {
      const response = await postService.getAdminPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      addNotification('Unable to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addNotification('Image size must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const response = await postService.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
      setImagePreview(response.data.imageUrl);
      addNotification('Image uploaded successfully', 'success');
    } catch (err) {
      console.error('Upload failed:', err);
      addNotification('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      addNotification('Title and image are required', 'error');
      return;
    }

    try {
      await postService.createPost(formData);
      addNotification('Post created successfully', 'success');
      setFormData({ title: '', body: '', imageUrl: '', isPublished: true });
      setImagePreview(null);
      fetchAdminPosts();
    } catch (err) {
      console.error('Failed to create post:', err);
      addNotification(err.response?.data?.message || 'Could not save post', 'error');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(postId);
      addNotification('Post deleted', 'success');
      fetchAdminPosts();
    } catch (err) {
      console.error('Delete failed:', err);
      addNotification('Unable to delete post', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="pt-20 xs:pt-24 sm:pt-28 px-2 xs:px-3 sm:px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Organization Posts</h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Create image posts for your customers and manage the shared content in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setFormData({ title: '', body: '', imageUrl: '', isPublished: true });
                  setImagePreview(null);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-2xl font-semibold shadow-lg hover:opacity-95 transition"
              >
                <Plus className="w-4 h-4" /> New Post
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Post</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Post headline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                    rows={5}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Add post details or story..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
                  <label className="block rounded-2xl border border-dashed border-gray-300 p-5 text-center cursor-pointer hover:border-blue-400 transition">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div className="flex flex-col items-center gap-3 text-sm text-gray-500">
                      <Upload className="w-6 h-6" />
                      <span>{uploading ? 'Uploading image...' : 'Click to upload or drag and drop'}</span>
                    </div>
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Post preview"
                      className="mt-4 w-full h-56 rounded-3xl object-cover border border-gray-200"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    Publish now
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 text-sm font-semibold shadow-lg hover:opacity-95 transition"
                  >
                    Save Post
                  </button>
                </div>
              </form>
            </section>

            <section className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Published Posts</h2>
                    <p className="text-sm text-gray-500">Manage existing organization posts and preview the feed.</p>
                  </div>
                </div>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, idx) => (
                      <div key={idx} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                    No posts yet. Add your first image post using the form on the left.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post._id} className="rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-4">
                          <img
                            src={post.imageUrl.startsWith('/uploads') ? `${ASSET_BASE_URL}${post.imageUrl}` : post.imageUrl}
                            alt={post.title}
                            className="h-56 w-full object-cover"
                          />
                          <div className="p-5 space-y-3">
                            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
                              <span>By {post.createdBy?.name || 'Admin'}</span>
                              <span className="h-1 w-1 rounded-full bg-gray-300" />
                              <span>{new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                              <span className={`rounded-full px-3 py-1 ${post.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {post.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3">{post.body || 'No description provided.'}</p>
                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => window.open(`/posts`, '_blank')}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                              >
                                <Eye className="w-4 h-4" /> Preview
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(post._id)}
                                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPostsPage;
