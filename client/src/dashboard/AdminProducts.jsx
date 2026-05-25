import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { productService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
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
    stockStatus: 'in-stock'
  });
  const { addNotification } = useNotification();

  const categories = ['Fashion', 'Cosmetics'];

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
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
        addNotification('Product updated successfully', 'success');
      } else {
        await productService.createProduct(formData);
        addNotification('Product added successfully', 'success');
      }
      setFormData({
        title: '',
        description: '',
        image: '',
        category: 'Fashion',
        meeshoLink: '',
        stockStatus: 'in-stock'
      });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      addNotification('Failed to save product', 'error');
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
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
                  >
                    {editingId ? 'Update' : 'Add'} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
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
