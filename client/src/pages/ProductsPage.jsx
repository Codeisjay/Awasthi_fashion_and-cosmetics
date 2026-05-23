import React, { useState, useEffect } from 'react';
import { productService, trackingService } from '../services/api';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import { useNotification } from '../hooks/useNotification';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const { addNotification } = useNotification();

  const categories = [
    'Fashion',
    'Cosmetics'
  ];

  useEffect(() => {
    trackingService.trackVisit('/products').catch(err => console.log('Tracking error:', err));
    fetchProducts();
  }, [category, search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts(category, search, page);
      setProducts(response.data.products);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (error) {
      addNotification('Failed to fetch products', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (product) => {
    try {
      await trackingService.trackClick(product._id);
      window.location.href = product.meeshoLink;
    } catch (error) {
      console.error('Tracking error:', error);
      // Redirect anyway if tracking fails
      window.location.href = product.meeshoLink;
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(category === cat ? '' : cat);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="pt-28 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Products</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg transition ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
