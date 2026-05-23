import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, TrendingUp, Upload, X } from 'lucide-react';
import { offerService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import Toast from '../components/Toast';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offerType: 'percentage',
    discountType: 'percentage',
    discountValue: 10,
    couponCode: '',
    bannerImage: '',
    applicableCategories: [],
    minimumPurchase: 0,
    maximumDiscount: 0,
    startDate: '',
    endDate: '',
    priority: 0,
    displayPosition: 'none',
    usageLimit: null,
    bogoConfig: {
      buyQuantity: 1,
      getQuantity: 1,
      getDiscount: 0
    }
  });

  useEffect(() => {
    fetchOffers();
    fetchAnalytics();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await offerService.getAllOffers({ isActive: filterType === 'all' ? undefined : 'true' });
      setOffers(response.data.offers);
    } catch (error) {
      addNotification('Failed to fetch offers', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await offerService.getOfferAnalytics();
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addNotification('Image size must be less than 5MB', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await offerService.uploadImage(file);
      setFormData({ ...formData, bannerImage: response.data.imageUrl });
      setImagePreview(response.data.imageUrl);
      addNotification('Image uploaded successfully', 'success');
    } catch (error) {
      addNotification('Failed to upload image', 'error');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingOffer) {
        await offerService.updateOffer(editingOffer._id, formData);
        addNotification('Offer updated successfully', 'success');
      } else {
        await offerService.createOffer(formData);
        addNotification('Offer created successfully', 'success');
      }
      setShowForm(false);
      setEditingOffer(null);
      resetForm();
      fetchOffers();
    } catch (error) {
      addNotification(error.response?.data?.message || 'Failed to save offer', 'error');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      offerType: 'percentage',
      discountType: 'percentage',
      discountValue: 10,
      couponCode: '',
      bannerImage: '',
      applicableCategories: [],
      minimumPurchase: 0,
      maximumDiscount: 0,
      startDate: '',
      endDate: '',
      priority: 0,
      displayPosition: 'none',
      usageLimit: null,
      bogoConfig: {
        buyQuantity: 1,
        getQuantity: 1,
        getDiscount: 0
      }
    });
    setImagePreview(null);
  };

  const handleDelete = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offerService.deleteOffer(offerId);
        addNotification('Offer deleted successfully', 'success');
        fetchOffers();
      } catch (error) {
        addNotification(error.response?.data?.message || 'Failed to delete offer', 'error');
        console.error(error);
      }
    }
  };

  const handleToggle = async (offerId) => {
    try {
      const response = await offerService.toggleOfferStatus(offerId);
      addNotification(`Offer ${response.data.offer.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchOffers();
    } catch (error) {
      addNotification('Failed to update offer status', 'error');
      console.error(error);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setImagePreview(offer.bannerImage || null);
    setFormData({
      title: offer.title,
      description: offer.description,
      offerType: offer.offerType,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      couponCode: offer.couponCode || '',
      bannerImage: offer.bannerImage || '',
      applicableCategories: offer.applicableCategories,
      minimumPurchase: offer.minimumPurchase,
      maximumDiscount: offer.maximumDiscount,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
      priority: offer.priority,
      displayPosition: offer.displayPosition,
      usageLimit: offer.usageLimit,
      bogoConfig: offer.bogoConfig || { buyQuantity: 1, getQuantity: 1, getDiscount: 0 }
    });
    setShowForm(true);
  };

  const filteredOffers = filterType === 'all' 
    ? offers 
    : offers.filter(o => o.offerType === filterType);

  if (loading) {
    return <div className="text-center py-8">Loading offers...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Offers</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.activeOffers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-600 text-sm">Total Clicks</p>
              <p className="text-3xl font-bold text-green-600">{analytics.totalClicks}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-600 text-sm">Conversions</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.totalConversions}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-600">₹{analytics.totalRevenue}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Offers Management</h2>
        <button
          onClick={() => {
            setEditingOffer(null);
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" /> New Offer
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-6">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Offer Title"
              />
            </div>

            {/* Offer Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Offer Type *</label>
              <select
                required
                value={formData.offerType}
                onChange={(e) => setFormData({...formData, offerType: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">Percentage Discount</option>
                <option value="fixed">Fixed Amount</option>
                <option value="bogo">Buy One Get One</option>
                <option value="festive">Festive Sale</option>
                <option value="seasonal">Seasonal Sale</option>
                <option value="flash">Flash Sale</option>
                <option value="category">Category Offer</option>
                <option value="product">Product Specific</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Discount Value *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>

            {/* Coupon Code */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Coupon Code</label>
              <input
                type="text"
                value={formData.couponCode}
                onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SUMMER25"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Priority (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Display Position */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Display Position</label>
              <select
                value={formData.displayPosition}
                onChange={(e) => setFormData({...formData, displayPosition: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="hero">Hero Banner</option>
                <option value="carousel">Carousel</option>
                <option value="banner">Side Banner</option>
                <option value="popup">Popup</option>
              </select>
            </div>

            {/* Banner Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Banner Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB (JPEG, PNG, WebP, GIF)</p>
                </div>
                {imagePreview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({...formData, bannerImage: ''});
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Offer description"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingOffer ? 'Update Offer' : 'Create Offer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'percentage', 'fixed', 'bogo', 'festive', 'seasonal', 'flash'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg transition ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Offers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Discount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Dates</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOffers.map((offer) => (
              <tr key={offer._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {offer.bannerImage ? (
                    <img
                      src={offer.bannerImage}
                      alt={offer.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600">No Image</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{offer.title}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {offer.offerType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {offer.discountType === 'percentage' 
                    ? `${offer.discountValue}%` 
                    : `₹${offer.discountValue}`}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="text-xs text-gray-600">
                    {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggle(offer._id)}
                    className={`p-2 rounded-lg transition ${
                      offer.isActive
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    {offer.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOffers;
