import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { productService } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Edit2, Trash2, Plus } from 'lucide-react';

const AdminProducts = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const categories = [
    'Fashion', 'Cosmetics'
  ];

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
    if (window.confirm('Are you sure?')) {
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
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Product Management</h1>
            <button
              onClick={() => {
                setFormData({
                  title: '', description: '', image: '',
                  category: 'Fashion', meeshoLink: '', stockStatus: 'in-stock'
                });
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Meesho Link"
                    value={formData.meeshoLink}
                    onChange={(e) => setFormData({...formData, meeshoLink: e.target.value})}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <select
                  value={formData.stockStatus}
                  onChange={(e) => setFormData({...formData, stockStatus: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="limited">Limited Stock</option>
                </select>
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    {editingId ? 'Update' : 'Add'} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Clicks</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{product.title.substring(0, 30)}...</td>
                    <td className="px-6 py-3">{product.category}</td>
                    <td className="px-6 py-3">{product.clicks}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        product.stockStatus === 'in-stock'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
