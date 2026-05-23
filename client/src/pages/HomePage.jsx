import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackingService, offerService } from '../services/api';
import { ChevronRight, Star, Users, Zap } from 'lucide-react';
import OfferBanner from '../components/OfferBanner';
import OfferCard from '../components/OfferCard';

const HomePage = () => {
  const [featuredOffers, setFeaturedOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  useEffect(() => {
    trackingService.trackVisit('/').catch(err => console.log('Tracking error:', err));
    fetchFeaturedOffers();
  }, []);

  const fetchFeaturedOffers = async () => {
    try {
      const response = await offerService.getActiveOffers();
      if (response.data.offers) {
        // Get top 3 offers by priority
        const topOffers = response.data.offers
          .sort((a, b) => b.priority - a.priority)
          .slice(0, 3);
        setFeaturedOffers(topOffers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoadingOffers(false);
    }
  };

  return (
    <div className="pt-28">
      {/* Offer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OfferBanner />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Products</h1>
            <p className="text-xl mb-8 opacity-90">
              Shop from thousands of curated products with the best deals available
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Shopping <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Offers Section */}
      {featuredOffers.length > 0 && (
        <div className="py-20 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Offers</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Don't miss out on our best deals happening right now
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredOffers.map(offer => (
                <OfferCard key={offer._id} offer={offer} />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                View All Offers <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
              <p className="text-gray-600">
                Handpicked products from trusted sellers
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
              <p className="text-gray-600">
                Exclusive discounts and offers daily
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join millions of happy shoppers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our latest products and find exactly what you're looking for
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
