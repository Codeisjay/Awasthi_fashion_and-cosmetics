import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, TrendingUp, Upload, X } from 'lucide-react';
import { offerService } from '../services/api';
import { useNotification } from '../hooks/useNotification';

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

  const filteredOffers = filterType === 'all' ? offers : offers.filter(o => o.offerType === filterType);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="pt-20 xs:pt-24 sm:pt-28 px-2 xs:px-3 sm:px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Cards */}
          {analytics && (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
              <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs xs:text-sm font-medium">Active Offers</p>
                    <p className="text-2xl xs:text-3xl font-bold text-blue-600 mt-2">{analytics.activeOffers}</p>
                  </div>
                  <TrendingUp className="w-10 xs:w-12 h-10 xs:h-12 text-blue-600 opacity-15" />
                </div>
              </div>
              <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <p className="text-gray-600 text-xs xs:text-sm font-medium">Total Clicks</p>
                  <p className="text-2xl xs:text-3xl font-bold text-green-600 mt-2">{analytics.totalClicks}</p>
                </div>
              </div>
              <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <p className="text-gray-600 text-xs xs:text-sm font-medium">Conversions</p>
                  <p className="text-2xl xs:text-3xl font-bold text-purple-600 mt-2">{analytics.totalConversions}</p>
                </div>
              </div>
              <div className="bg-white p-4 xs:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div>
                  <p className="text-gray-600 text-xs xs:text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl xs:text-3xl font-bold text-orange-600 mt-2">₹{analytics.totalRevenue}</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 mb-6 xs:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900">Offers & Promotions</h1>
            <button
              onClick={() => {
                setEditingOffer(null);
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95 md:active:scale-100 font-semibold text-sm xs:text-base"
            >
              <Plus className="w-5 h-5" /> New Offer
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-xl shadow-lg mb-6 xs:mb-8 border-2 border-blue-200 animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl xs:text-2xl font-bold text-gray-900">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                    placeholder="Offer Title"
                  />
                </div>

                {/* Offer Type */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Offer Type *</label>
                  <select
                    required
                    value={formData.offerType}
                    onChange={(e) => setFormData({...formData, offerType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="bogo">Buy One Get One</option>
                    <option value="festive">Festive Sale</option>
                    <option value="seasonal">Seasonal Sale</option>
                    <option value="flash">Flash Sale</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                    placeholder="10"
                  />
                </div>

                {/* Coupon Code */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({...formData, couponCode: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                    placeholder="SUMMER25"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Priority (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                </div>

                {/* Display Position */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Display Position</label>
                  <select
                    value={formData.displayPosition}
                    onChange={(e) => setFormData({...formData, displayPosition: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  >
                    <option value="none">None</option>
                    <option value="hero">Hero Banner</option>
                    <option value="carousel">Carousel</option>
                    <option value="banner">Side Banner</option>
                  </select>
                </div>

                {/* Banner Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Banner Image</label>
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
                      <p className="text-xs text-gray-500 mt-1">Max: 5MB (JPEG, PNG, WebP)</p>
                    </div>
                    {imagePreview && (
                      <div className="relative w-24 h-24">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-300" />
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
                  <label className="block text-gray-700 font-semibold mb-2 text-sm xs:text-base">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base resize-none"
                    rows="4"
                    placeholder="Offer description"
                  />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex gap-3 xs:gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 xs:px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
                  >
                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 xs:px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-6 xs:mb-8 overflow-x-auto">
            {['all', 'percentage', 'fixed', 'bogo', 'festive', 'seasonal', 'flash'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 xs:px-4 py-2 rounded-lg transition text-sm xs:text-base font-medium whitespace-nowrap ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Offers Table - Responsive */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading offers...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Title</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Type</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Discount</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOffers.map((offer) => (
                      <tr key={offer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 xs:px-6 py-4 text-sm font-medium text-gray-900">{offer.title.substring(0, 25)}</td>
                        <td className="px-4 xs:px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {offer.offerType}
                          </span>
                        </td>
                        <td className="px-4 xs:px-6 py-4 text-sm text-gray-900 font-semibold">
                          {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                        </td>
                        <td className="px-4 xs:px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 xs:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(offer)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition active:scale-95"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(offer._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <div key={offer._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">{offer.title.substring(0, 20)}</h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {offer.isActive ? 'On' : 'Off'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3"><strong>Type:</strong> {offer.offerType}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="flex-1 p-2 text-blue-600 bg-blue-50 rounded-lg text-xs font-semibold active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="flex-1 p-2 text-red-600 bg-red-50 rounded-lg text-xs font-semibold active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOffers.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <p className="text-lg font-semibold">No offers found</p>
                  <p className="text-sm">Click "New Offer" to create your first promotion</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOffers;
