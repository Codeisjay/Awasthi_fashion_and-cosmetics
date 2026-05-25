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
    <div className="pt-20 xs:pt-24 sm:pt-28">
      {/* Offer Banner */}
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-4 xs:py-6 sm:py-8 animate-fade-in">
        <OfferBanner />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-12 xs:py-16 sm:py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36 animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 animate-bounce-subtle" />
        
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="animate-slide-in-down mb-4 xs:mb-6">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 xs:mb-4 leading-tight">
                Discover Amazing Products
              </h1>
            </div>
            <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-base xs:text-lg sm:text-xl mb-6 xs:mb-8 opacity-95 max-w-2xl mx-auto">
                Shop from thousands of curated products with the best deals available
              </p>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-5 xs:px-6 sm:px-8 py-2 xs:py-3 sm:py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 md:active:scale-100 shadow-lg text-sm xs:text-base"
              >
                Start Shopping <ChevronRight className="w-4 xs:w-5 h-4 xs:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Offers Section */}
      {featuredOffers.length > 0 && (
        <div className="py-12 xs:py-16 sm:py-20 bg-gradient-to-b from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
            <div className="text-center mb-8 xs:mb-12 animate-fade-in">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 mb-2 xs:mb-4">Featured Offers</h2>
              <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
                Don't miss out on our best deals happening right now
              </p>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 mb-6 xs:mb-8 sm:mb-10">
              {featuredOffers.map((offer, idx) => (
                <div key={offer._id} className="animate-slide-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>

            <div className="text-center animate-scale-in">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 xs:px-7 sm:px-8 py-3 xs:py-4 sm:py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 active:scale-95 md:active:scale-100 shadow-lg text-sm xs:text-base"
              >
                View All Offers <ChevronRight className="w-4 xs:w-5 h-4 xs:h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-12 xs:py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-center mb-8 xs:mb-12 sm:mb-16 animate-fade-in">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {[
              { icon: Star, title: 'Curated Selection', desc: 'Handpicked products from trusted sellers', delay: '0s' },
              { icon: Zap, title: 'Best Deals', desc: 'Exclusive discounts and offers daily', delay: '0.15s' },
              { icon: Users, title: 'Trusted Community', desc: 'Join millions of happy shoppers', delay: '0.3s' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-5 xs:p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 md:active:scale-100 animate-slide-in-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 xs:p-4 rounded-full mb-3 xs:mb-4 group">
                      <Icon className="w-6 xs:w-8 h-6 xs:h-8 text-blue-600 group-hover:animate-bounce-subtle" />
                    </div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm xs:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 xs:py-16 sm:py-20 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full animate-float" />
          <div className="absolute -bottom-20 left-20 w-60 h-60 bg-white rounded-full animate-bounce-subtle" />
        </div>

        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 text-center relative z-10">
          <div className="animate-slide-in-down mb-4 xs:mb-6">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-2 xs:mb-4">Ready to Start Shopping?</h2>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-base xs:text-lg sm:text-xl mb-6 xs:mb-8 opacity-95 max-w-2xl mx-auto">
              Browse our latest products and find exactly what you're looking for
            </p>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 px-6 xs:px-7 sm:px-8 py-3 xs:py-4 sm:py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 md:active:scale-100 shadow-lg text-sm xs:text-base"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
