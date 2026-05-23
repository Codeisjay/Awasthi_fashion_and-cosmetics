import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { offerService } from '../services/api';

const OfferBanner = () => {
  const [offers, setOffers] = useState([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBannerOffers();
  }, []);

  const fetchBannerOffers = async () => {
    try {
      const response = await offerService.getActiveOffers();
      
      if (response.data.offers) {
        // Filter offers with banners and shuffle
        const bannerOffers = response.data.offers.filter(o => o.bannerImage || o.displayPosition === 'hero');
        setOffers(bannerOffers);
      }
    } catch (err) {
      setError('Failed to load offers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextOffer = () => {
    setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  useEffect(() => {
    if (offers.length > 0) {
      const interval = setInterval(nextOffer, 5000); // Auto-rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [offers.length]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-pink-100 to-purple-100 h-64 animate-pulse rounded-lg"></div>
    );
  }

  if (error || offers.length === 0) {
    return null;
  }

  const currentOffer = offers[currentOfferIndex];

  return (
    <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl group">
      {/* Background Image */}
      {currentOffer.bannerImage && (
        <img
          src={currentOffer.bannerImage}
          alt={currentOffer.title}
          className="w-full h-full object-cover"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">
        <div>
          {/* Offer Badge */}
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm md:text-base mb-4">
            {currentOffer.offerType === 'bogo' ? 'BOGO' : `${currentOffer.discountValue}% OFF`}
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
            {currentOffer.title}
          </h2>

          {/* Description */}
          {currentOffer.description && (
            <p className="text-white text-sm md:text-lg max-w-2xl mb-4">
              {currentOffer.description}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex-1">
            {currentOffer.couponCode && (
              <div className="mb-4">
                <p className="text-white text-sm mb-1">Use Code:</p>
                <div className="bg-white/20 backdrop-blur-sm border border-white px-4 py-2 rounded inline-block">
                  <span className="text-white font-bold text-lg">{currentOffer.couponCode}</span>
                </div>
              </div>
            )}
          </div>

          {/* Countdown Timer */}
          <div className="ml-4">
            <CountdownTimer endDate={currentOffer.endDate} compact={true} />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {offers.length > 1 && (
        <>
          <button
            onClick={prevOffer}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={nextOffer}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOfferIndex(index)}
                className={`h-2 rounded-full transition ${
                  index === currentOfferIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* CTA Button */}
      <div className="absolute bottom-6 right-6">
        <button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default OfferBanner;
