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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">{offers.length} Active Offers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exclusive Offers & Deals
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse all our amazing discounts, flash sales, and special offers. Save big on your favorite products!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-12 space-y-4 bg-white p-6 rounded-lg shadow-md">
          {/* Offer Type Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Filter by Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {offerTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg transition font-medium ${
                    filterType === type
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Sort by
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="priority">Priority</option>
              <option value="endDate">Ending Soon</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>

        {/* Offers Grid */}
        {sortedOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOffers.map(offer => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Offers Found</h3>
            <p className="text-gray-600 mb-6">
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
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        {sortedOffers.length > 0 && (
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              Showing <span className="font-bold text-gray-900">{sortedOffers.length}</span> of{' '}
              <span className="font-bold text-gray-900">{offers.length}</span> offers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
