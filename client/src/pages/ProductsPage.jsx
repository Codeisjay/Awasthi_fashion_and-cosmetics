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
    // Validate meesho link exists
    if (!product.meeshoLink || product.meeshoLink.trim() === '') {
      addNotification('Meesho link not available for this product', 'error');
      console.error('Product missing meeshoLink:', product);
      return;
    }

    let meeshoUrl = product.meeshoLink.trim();
    
    // Ensure URL has protocol
    if (!meeshoUrl.startsWith('http://') && !meeshoUrl.startsWith('https://')) {
      meeshoUrl = 'https://' + meeshoUrl;
    }

    // Track click - don't wait for response
    trackingService.trackClick(product._id)
      .then(() => console.log('[ProductsPage] Click tracked successfully for:', product._id))
      .catch((error) => console.error('[ProductsPage] Tracking error:', error));

    // Open link in same tab (more reliable)
    setTimeout(() => {
      window.location.href = meeshoUrl;
    }, 100);
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
    <div className="pt-20 xs:pt-24 sm:pt-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-6 xs:py-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 xs:mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Discover Our Products
          </h1>
          <p className="text-gray-600 text-sm xs:text-base mb-6 xs:mb-8">
            Browse our curated collection of fashion and cosmetics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-3 xs:p-4 sm:p-6 mb-6 xs:mb-8 animate-slide-in-down">
          <form onSubmit={handleSearch} className="mb-4 xs:mb-6">
            <div className="flex gap-2 xs:gap-3">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm xs:text-base transition-colors duration-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
              >
                <Search className="w-4 xs:w-5 h-4 xs:h-5" />
                <span className="hidden xs:inline">Search</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 xs:gap-3">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className={`px-3 xs:px-4 py-2 xs:py-3 rounded-full font-semibold transition-all duration-300 text-sm xs:text-base ${
                  category === cat
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 md:active:scale-100'
                } animate-scale-in`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-40 xs:h-48 sm:h-56 rounded-2xl mb-4" />
                <div className="bg-gray-200 h-4 rounded mb-2" />
                <div className="bg-gray-200 h-4 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 xs:py-20 sm:py-24 animate-fade-in">
            <div className="text-5xl xs:text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-base xs:text-lg">No products found</p>
            <p className="text-gray-400 text-sm xs:text-base mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="product-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-8 xs:mb-10">
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewClick={handleProductClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 xs:gap-4 flex-wrap animate-slide-in-up">
              <button
                onClick={() => {
                  setPage(Math.max(1, page - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="px-3 xs:px-4 py-2 xs:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
              >
                ← Previous
              </button>
              <span className="text-gray-600 text-sm xs:text-base font-semibold">
                Page <span className="text-blue-600">{page}</span> of <span className="text-blue-600">{pages}</span>
              </span>
              <button
                onClick={() => {
                  setPage(Math.min(pages, page + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === pages}
                className="px-3 xs:px-4 py-2 xs:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:from-gray-300 disabled:to-gray-400 transition-all duration-300 font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
