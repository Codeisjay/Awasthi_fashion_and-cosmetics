import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, Gift, Flame, X } from 'lucide-react';

const PromotionalBanner = ({ offers = [] }) => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (offers.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  if (!offers || offers.length === 0 || !isVisible) {
    return null;
  }

  const currentOffer = offers[currentOfferIndex];
  const isFlash = currentOffer.offerType === 'flash';

  const getOfferColor = (type) => {
    const colors = {
      festive: 'from-red-500 to-orange-500',
      flash: 'from-red-600 to-orange-500',
      percentage: 'from-blue-500 to-blue-600',
      fixed: 'from-green-500 to-green-600',
      bogo: 'from-purple-500 to-purple-600',
      seasonal: 'from-orange-500 to-yellow-500',
      category: 'from-indigo-500 to-indigo-600',
      product: 'from-cyan-500 to-blue-500',
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`
      relative bg-gradient-to-r ${getOfferColor(currentOffer.offerType)}
      text-white py-2 px-3 sm:px-6 lg:px-8
      ${isFlash ? 'animate-pulse' : ''}
      overflow-hidden text-sm sm:text-base border-b border-white/20
    `}>
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Left Icon */}
        <div className="flex-shrink-0 hidden xs:block">
          {isFlash ? (
            <Flame className="w-5 h-5 text-yellow-200 animate-bounce" />
          ) : (
            <Zap className="w-5 h-5 text-yellow-300" />
          )}
        </div>

        {/* Center Content */}
        <div className="flex-1 text-center min-w-0">
          <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            <span className="font-bold truncate">{currentOffer.title}</span>
            <span className="inline-block bg-white/30 backdrop-blur-sm px-2 sm:px-3 py-0.5 rounded text-xs sm:text-sm font-bold whitespace-nowrap">
              {currentOffer.discountType === 'percentage' 
                ? `${currentOffer.discountValue}%` 
                : `₹${currentOffer.discountValue}`}
            </span>
            {currentOffer.couponCode && (
              <span className="hidden md:inline-block bg-white/25 px-2 py-0.5 rounded text-xs font-mono font-bold">
                {currentOffer.couponCode}
              </span>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-1 flex-shrink-0">
          <button
            onClick={() => setCurrentOfferIndex((prev) => (prev - 1 + offers.length) % offers.length)}
            className="p-1 rounded hover:bg-white/20 transition-all"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentOfferIndex((prev) => (prev + 1) % offers.length)}
            className="p-1 rounded hover:bg-white/20 transition-all"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 flex-shrink-0 hover:bg-white/20 rounded transition-all"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
