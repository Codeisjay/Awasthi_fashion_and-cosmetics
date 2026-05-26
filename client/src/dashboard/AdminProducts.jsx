import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { productService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { useFormSubmission } from '../context/FormSubmissionContext';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Fashion',
    meeshoLink: '',
    price: '',
    originalPrice: '',
    discountedPrice: '',
    stockStatus: 'in-stock'
  });
  const { addNotification } = useNotification();
  const { executeSubmission, isFormLocked } = useFormSubmission();
  const FORM_ID = 'admin-product-form';

  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts('', '', 1, 100);
      setProducts(response.data.products);
    } catch (error) {
      addNotification('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use executeSubmission to prevent duplicate submissions
    try {
      await executeSubmission(FORM_ID, async () => {
        console.log('\n╔═══════════════════════════════════════════════════╗');
        console.log('║       [FORM SUBMIT] STARTING SUBMISSION            ║');
        console.log('╚═══════════════════════════════════════════════════╝');

      // Log the entire formData object
      console.log('[FORM] formData object:', formData);
      console.log('[FORM] formData.price raw:', formData.price);
      console.log('[FORM] typeof formData.price:', typeof formData.price);
      
      // Validate required fields on client side
      if (!formData.title?.trim()) {
        addNotification('Title is required', 'error');
        return;
      }
      if (!formData.description?.trim()) {
        addNotification('Description is required', 'error');
        return;
      }
      if (!formData.image?.trim()) {
        addNotification('Image URL is required', 'error');
        return;
      }
      if (!formData.category) {
        addNotification('Category is required', 'error');
        return;
      }
      if (!formData.meeshoLink?.trim()) {
        addNotification('Meesho Link is required', 'error');
        return;
      }

      // **FRONTEND STEP 1: Validate and parse price**
      console.log('\n[PRICE PARSE] Starting price parsing...');
      console.log('[PRICE PARSE] formData.price value:', formData.price);
      console.log('[PRICE PARSE] formData.price type:', typeof formData.price);
      
      // Ensure price is not empty
      if (!formData.price || formData.price.toString().trim() === '') {
        console.error('[PRICE PARSE] VALIDATION FAILED - Price is empty');
        addNotification('❌ Price is required', 'error');
        return;
      }
      
      const price = parseFloat(formData.price);
      console.log('[PRICE PARSE] Parsed price:', price);
      console.log('[PRICE PARSE] parseFloat result:', price);
      console.log('[PRICE PARSE] isNaN(price):', isNaN(price));
      
      if (isNaN(price)) {
        console.error('[PRICE PARSE] VALIDATION FAILED - Price is not a valid number');
        addNotification('❌ Price must be a valid number (e.g., 191 or 191.50)', 'error');
        return;
      }

      if (price <= 0) {
        console.error('[PRICE PARSE] VALIDATION FAILED - Price is not greater than 0');
        addNotification('❌ Price must be greater than 0', 'error');
        return;
      }

      console.log('[PRICE PARSE] ✓ Price validation passed:', price);

      // **FRONTEND STEP 2: Build payload object**
      console.log('\n[PAYLOAD BUILD] Building dataToSend object...');
      
      const dataToSend = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        category: formData.category,
        meeshoLink: formData.meeshoLink.trim(),
        price: Number(price),  // ← EXPLICIT: Convert to Number type
        stockStatus: formData.stockStatus
      };

      console.log('[PAYLOAD BUILD] dataToSend created:', dataToSend);
      console.log('[PAYLOAD BUILD] dataToSend.price:', dataToSend.price);
      console.log('[PAYLOAD BUILD] typeof dataToSend.price:', typeof dataToSend.price);
      console.log('[PAYLOAD BUILD] dataToSend.price === number?', typeof dataToSend.price === 'number');
      console.log('[PAYLOAD BUILD] "price" in dataToSend:', 'price' in dataToSend);

      // Add optional price fields only if they have values
      if (formData.originalPrice && !isNaN(parseFloat(formData.originalPrice))) {
        const originalPriceNum = parseFloat(formData.originalPrice);
        if (originalPriceNum >= 0) {
          dataToSend.originalPrice = originalPriceNum;
          console.log('[PAYLOAD BUILD] Added originalPrice:', dataToSend.originalPrice);
        }
      }
      if (formData.discountedPrice && !isNaN(parseFloat(formData.discountedPrice))) {
        const discountedPriceNum = parseFloat(formData.discountedPrice);
        if (discountedPriceNum >= 0) {
          dataToSend.discountedPrice = discountedPriceNum;
          console.log('[PAYLOAD BUILD] Added discountedPrice:', dataToSend.discountedPrice);
        }
      }

      // **FRONTEND STEP 3: Final payload verification before API call**
      console.log('\n[FINAL VERIFICATION] Before API call...');
      console.log('[FINAL VERIFICATION] dataToSend object:', dataToSend);
      console.log('[FINAL VERIFICATION] Object.keys:', Object.keys(dataToSend));
      console.log('[FINAL VERIFICATION] dataToSend.price exists?', dataToSend.price !== undefined);
      console.log('[FINAL VERIFICATION] dataToSend.price value:', dataToSend.price);
      console.log('[FINAL VERIFICATION] dataToSend.price type:', typeof dataToSend.price);
      console.log('[FINAL VERIFICATION] JSON stringified:\n', JSON.stringify(dataToSend, null, 2));
      console.log('[FINAL VERIFICATION] Is FormData?', dataToSend instanceof FormData);
      console.log('[FINAL VERIFICATION] Is plain object?', dataToSend.constructor.name === 'Object');

      console.log('\n[API CALL] Calling API with payload...');
      
      if (editingId) {
        console.log('[API CALL] UPDATE MODE - ID:', editingId);
        await productService.updateProduct(editingId, dataToSend);
        addNotification('Product updated successfully', 'success');
      } else {
        console.log('[API CALL] CREATE MODE - New product');
        await productService.createProduct(dataToSend);
        addNotification('Product added successfully', 'success');
      }
      setFormData({
        title: '',
        description: '',
        image: '',
        category: 'Fashion',
        meeshoLink: '',
        price: '',
        originalPrice: '',
        discountedPrice: '',
        stockStatus: 'in-stock'
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
      });
    } catch (error) {
      // Extract detailed error message from axios error
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save product';
      
      // Handle array of validation messages
      let displayMessage = errorMessage;
      if (Array.isArray(errorMessage)) {
        displayMessage = errorMessage.join(', ');
      }
      
      console.error('Product save error:', error.response?.data || error);
      addNotification(displayMessage, 'error');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        addNotification('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        addNotification('Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="pt-20 xs:pt-24 sm:pt-28 px-2 xs:px-3 sm:px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4 mb-6 xs:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900">Product Management</h1>
            <button
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  image: '',
                  category: 'Fashion',
                  meeshoLink: '',
                  price: '',
                  originalPrice: '',
                  discountedPrice: '',
                  stockStatus: 'in-stock'
                });
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 xs:px-6 py-2 xs:py-3 rounded-lg hover:shadow-lg transition-all duration-300 active:scale-95 md:active:scale-100 font-semibold text-sm xs:text-base"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Product Form Modal */}
          {showForm && (
            <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-xl shadow-lg mb-6 xs:mb-8 border-2 border-blue-200 animate-scale-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl xs:text-2xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add New'} Product</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <textarea
                  placeholder="Product Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base resize-none"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    required
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                  <input
                    type="url"
                    placeholder="Meesho Link"
                    value={formData.meeshoLink}
                    onChange={(e) => setFormData({...formData, meeshoLink: e.target.value})}
                    required
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="number"
                      placeholder="Price (Required)"
                      value={formData.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        console.log('[FORM INPUT] Price field changed:', val, 'type:', typeof val);
                        setFormData({...formData, price: val})
                      }}
                      onBlur={(e) => {
                        // Ensure price is numeric when user leaves the field
                        const val = e.target.value;
                        if (val && !isNaN(parseFloat(val))) {
                          console.log('[FORM INPUT] Price validated on blur:', val);
                          setFormData({...formData, price: val});
                        }
                      }}
                      required
                      step="0.01"
                      min="0.01"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base w-full"
                    />
                    <small className="text-gray-500 mt-1 block">Must be greater than 0</small>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Original Price (Optional)"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      step="0.01"
                      min="0"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base w-full"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Discounted Price (Optional)"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                      step="0.01"
                      min="0"
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base w-full"
                    />
                  </div>
                </div>
                
                <select
                  value={formData.stockStatus}
                  onChange={(e) => setFormData({...formData, stockStatus: e.target.value})}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="limited">Limited Stock</option>
                </select>
                
                <div className="flex gap-3 xs:gap-4">
                  <button 
                    type="submit"
                    disabled={isFormLocked(FORM_ID)}
                    className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base ${
                      isFormLocked(FORM_ID)
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
                    }`}
                  >
                    {isFormLocked(FORM_ID) ? 'Submitting...' : (editingId ? 'Update' : 'Add')} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={isFormLocked(FORM_ID)}
                    className={`flex-1 px-6 py-3 rounded-lg transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base ${
                      isFormLocked(FORM_ID)
                        ? 'bg-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table - Responsive */}
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading products...</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Title</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Category</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Clicks</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                      <th className="px-4 xs:px-6 py-4 text-left text-sm font-bold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 xs:px-6 py-4 text-sm text-gray-900 font-medium">{product.title.substring(0, 25)}</td>
                        <td className="px-4 xs:px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-4 xs:px-6 py-4 text-sm text-gray-600">{product.clicks || 0}</td>
                        <td className="px-4 xs:px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stockStatus === 'in-stock'
                              ? 'bg-green-100 text-green-800'
                              : product.stockStatus === 'limited'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stockStatus}
                          </span>
                        </td>
                        <td className="px-4 xs:px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors active:scale-95"
                            >
                              <Edit2 className="w-4 xs:w-5 h-4 xs:h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                            >
                              <Trash2 className="w-4 xs:w-5 h-4 xs:h-5" />
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
                {products.map(product => (
                  <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900 text-sm">{product.title.substring(0, 20)}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        product.stockStatus === 'in-stock'
                          ? 'bg-green-100 text-green-800'
                          : product.stockStatus === 'limited'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockStatus}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-3 space-y-1">
                      <p><strong>Category:</strong> {product.category}</p>
                      <p><strong>Clicks:</strong> {product.clicks || 0}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 p-2 text-blue-600 bg-blue-50 rounded-lg text-sm font-semibold active:scale-95"
                      >
                        <Edit2 className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 p-2 text-red-600 bg-red-50 rounded-lg text-sm font-semibold active:scale-95"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <p className="text-lg">No products found</p>
                  <p className="text-sm">Click "Add Product" to create your first product</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
