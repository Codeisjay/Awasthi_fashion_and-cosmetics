import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trackingService, offerService } from '../services/api';
import { ChevronRight, Star, Users, Zap, Sparkles, ShoppingBag, TrendingUp } from 'lucide-react';
import OfferBanner from '../components/OfferBanner';
import OfferCard from '../components/OfferCard';

// Animated Text Component
const AnimatedText = ({ text, className }) => {
  const words = text.split(' ');
  return (
    <span className="inline">
      {words.map((word, idx) => (
        <span
          key={idx}
          className={className}
          style={{ animationDelay: `${idx * 0.15}s` }}
        >
          {word}{' '}
        </span>
      ))}
    </span>
  );
};

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
      {/* Premium Hero Section with Animated Business Name */}
      <div className="relative overflow-hidden bg-white min-h-screen xs:min-h-fit flex items-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 z-0" />
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-0 w-72 h-72 bg-gradient-to-tl from-blue-200 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float z-0" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-tr from-pink-200 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-subtle z-0" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-15 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft z-0" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-8 xs:py-12 sm:py-16 lg:py-20">
            <div className="text-center space-y-6 xs:space-y-8 sm:space-y-10">
              {/* Sparkle Icon */}
              <div className="flex justify-center animate-bounce-in">
                <Sparkles className="w-8 xs:w-10 h-8 xs:h-10 text-purple-600 animate-wiggle" />
              </div>

              {/* Main Animated Business Heading */}
              <div className="space-y-4 xs:space-y-6">
                <div>
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black tracking-widest" style={{ wordSpacing: '0.2em', letterSpacing: '0.05em' }}>
                    <span className="block overflow-hidden">
                      <AnimatedText
                        text="Awasthi Fashion"
                        className="inline-block animate-slide-in-up bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black"
                      />
                    </span>
                    <span className="block overflow-hidden mt-2 xs:mt-3">
                      <AnimatedText
                        text="& Cosmetics"
                        className="inline-block animate-slide-in-up bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-black"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </span>
                  </h1>
                </div>

                {/* Subtitle with Glow Effect */}
                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <p className="text-gray-600 text-base xs:text-lg sm:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                      Luxury Fashion & Premium Cosmetics
                    </span>
                    {' '}crafted for the modern you. Discover curated collections that define your style.
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col xs:flex-row justify-center items-center gap-4 xs:gap-6 sm:gap-8 pt-2 xs:pt-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm xs:text-base font-semibold text-gray-700">10K+ Happy Customers</span>
                </div>
                <div className="hidden xs:block w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                  <span className="text-sm xs:text-base font-semibold text-gray-700">Premium Quality</span>
                </div>
                <div className="hidden xs:block w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-pink-600" />
                  <span className="text-sm xs:text-base font-semibold text-gray-700">Trusted Since 2024</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4 pt-4 xs:pt-6 sm:pt-8 animate-bounce-in" style={{ animationDelay: '1s' }}>
                <Link
                  to="/products"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 md:active:scale-100 shadow-lg text-sm xs:text-base group"
                >
                  Shop Now
                  <ChevronRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/offers"
                  className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300 active:scale-95 md:active:scale-100 text-sm xs:text-base group"
                >
                  View Offers
                  <Sparkles className="w-4 xs:w-5 h-4 xs:h-5 group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Banner */}
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-4 xs:py-6 sm:py-8 animate-fade-in">
        <OfferBanner />
      </div>

      {/* Featured Offers Section */}
      {featuredOffers.length > 0 && (
        <div className="py-12 xs:py-16 sm:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8">
            <div className="text-center mb-8 xs:mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 xs:px-4 py-2 rounded-full mb-3 xs:mb-4 text-xs xs:text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Limited Time Offers
              </div>
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black text-gray-900 mb-2 xs:mb-4 leading-tight">
                Trending This Week
              </h2>
              <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
                Don't miss out on our best deals curated specially for you
              </p>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 mb-6 xs:mb-8 sm:mb-10">
              {featuredOffers.map((offer, idx) => (
                <div key={offer._id} className="animate-slide-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>

            <div className="text-center animate-bounce-in">
              <Link
                to="/offers"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 md:active:scale-100 shadow-lg text-sm xs:text-base group"
              >
                Explore All Offers
                <ChevronRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us - Features Section */}
      <div className="py-12 xs:py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="text-center mb-8 xs:mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black text-gray-900 mb-2 xs:mb-4 leading-tight">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
              Experience the difference with our premium collection and dedicated service
            </p>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {[
              { 
                icon: Star, 
                title: 'Premium Selection', 
                desc: 'Handpicked fashion & cosmetics from trusted brands',
                gradient: 'from-blue-500 to-cyan-500',
                lightGrad: 'from-blue-50 to-cyan-50',
                delay: '0s' 
              },
              { 
                icon: Zap, 
                title: 'Unbeatable Prices', 
                desc: 'Exclusive discounts and daily flash sales',
                gradient: 'from-purple-500 to-pink-500',
                lightGrad: 'from-purple-50 to-pink-50',
                delay: '0.15s' 
              },
              { 
                icon: Users, 
                title: 'Trusted Community', 
                desc: 'Join thousands of satisfied fashion enthusiasts',
                gradient: 'from-pink-500 to-rose-500',
                lightGrad: 'from-pink-50 to-rose-50',
                delay: '0.3s' 
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx} 
                  className={`relative p-6 xs:p-8 rounded-3xl overflow-hidden group animate-slide-in-up hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: feature.delay }}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.lightGrad} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 xs:w-14 h-12 xs:h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-1 mb-4 xs:mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-6 xs:w-7 h-6 xs:h-7 text-white" />
                    </div>
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-sm xs:text-base leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium CTA Section */}
      <div className="relative py-12 xs:py-16 sm:py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 z-0" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full animate-float" />
          <div className="absolute -bottom-20 left-20 w-60 h-60 bg-white rounded-full animate-bounce-subtle" />
        </div>

        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 text-center relative z-10">
          <div className="animate-slide-in-down mb-4 xs:mb-6">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 xs:mb-4 leading-tight">
              Ready to Transform Your Style?
            </h2>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-base xs:text-lg sm:text-xl text-white/90 mb-6 xs:mb-8 max-w-2xl mx-auto opacity-95">
              Discover our latest collection of fashion and cosmetics designed for the modern individual
            </p>
          </div>
          <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/products"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95 md:active:scale-100 shadow-xl text-sm xs:text-base group"
            >
              Shop Now
              <ShoppingBag className="w-4 xs:w-5 h-4 xs:h-5 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="w-full xs:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-white px-6 xs:px-8 sm:px-10 py-3 xs:py-4 sm:py-5 rounded-2xl font-bold border-2 border-white hover:bg-white/10 transition-all duration-300 active:scale-95 md:active:scale-100 text-sm xs:text-base group"
            >
              Get in Touch
              <ChevronRight className="w-4 xs:w-5 h-4 xs:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
