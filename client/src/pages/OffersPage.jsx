import React, { useState, useEffect } from 'react';
import { offerService } from '../services/api';
import { Calendar, Tag, TrendingUp, Search } from 'lucide-react';
import OfferCard from '../components/OfferCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offerService.getActiveOffers();
      if (response.data.offers) {
        setOffers(response.data.offers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers
    .filter(o => filterType === 'all' || o.offerType === filterType)
    .filter(o => 
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    if (sortBy === 'priority') return b.priority - a.priority;
    if (sortBy === 'endDate') return new Date(a.endDate) - new Date(b.endDate);
    if (sortBy === 'discount') return b.discountValue - a.discountValue;
    return 0;
  });

  const offerTypes = [
    'all',
    'percentage',
    'fixed',
    'bogo',
    'festive',
    'seasonal',
    'flash',
    'category',
    'product'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 xs:py-12 sm:py-16 pt-20 xs:pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-40 xs:h-48 sm:h-56 rounded-2xl mb-4" />
                <div className="bg-gray-200 h-4 rounded mb-2" />
                <div className="bg-gray-200 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pt-20 xs:pt-24 sm:pt-28 pb-8 xs:pb-12">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 xs:px-4 py-2 rounded-full mb-3 xs:mb-4 text-xs xs:text-sm">
            <TrendingUp className="w-3 xs:w-4 h-3 xs:h-4" />
            <span className="font-bold">{offers.length} Active Offers</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 xs:mb-4">
            Exclusive Offers & Deals
          </h1>
          <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
            Browse our amazing discounts, flash sales, and special offers. Save big on your favorite products!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 xs:mb-8 animate-slide-in-down">
          <div className="relative">
            <Search className="absolute left-3 xs:left-4 top-2.5 xs:top-3 w-4 xs:w-5 h-4 xs:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 xs:pl-12 pr-3 xs:pr-4 py-2 xs:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-colors text-sm xs:text-base"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-6 xs:mb-8 sm:mb-12 space-y-3 xs:space-y-4 bg-white p-3 xs:p-4 sm:p-6 rounded-2xl shadow-md animate-slide-in-down" style={{ animationDelay: '0.1s' }}>
          {/* Offer Type Filter */}
          <div>
            <h3 className="text-xs xs:text-sm font-bold text-gray-700 mb-2 xs:mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {offerTypes.map((type, idx) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-full transition font-medium text-xs xs:text-sm active:scale-95 md:active:scale-100 ${
                    filterType === type
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                  style={{ animation: 'scale-in 0.3s ease-out', animationDelay: `${idx * 0.05}s` }}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-xs xs:text-sm font-bold text-gray-700 mb-2 xs:mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Sort by
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 bg-white text-sm xs:text-base transition-colors"
            >
              <option value="priority">Priority</option>
              <option value="endDate">Ending Soon</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Offers Grid */}
        {sortedOffers.length > 0 ? (
          <>
            <div className="product-grid grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 mb-8 xs:mb-10">
              {sortedOffers.map((offer, idx) => (
                <div key={offer._id} className="product-item" style={{ animationDelay: `${(idx % 6) * 0.1}s` }}>
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>

            {/* Results Count */}
            {sortedOffers.length > 0 && (
              <div className="text-center text-gray-600 text-xs xs:text-sm animate-fade-in">
                <p>
                  Showing <span className="font-bold text-gray-900">{sortedOffers.length}</span> of{' '}
                  <span className="font-bold text-gray-900">{offers.length}</span> offers
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-2xl shadow-md animate-fade-in">
            <div className="text-5xl xs:text-6xl mb-4">🔍</div>
            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-700 mb-2">No Offers Found</h3>
            <p className="text-sm xs:text-base text-gray-600 mb-6">
              {searchQuery
                ? 'No offers match your search. Try different keywords.'
                : 'No active offers at the moment. Check back soon!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 xs:px-8 py-2 xs:py-3 rounded-xl hover:shadow-lg transition font-semibold active:scale-95 md:active:scale-100 text-sm xs:text-base"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
