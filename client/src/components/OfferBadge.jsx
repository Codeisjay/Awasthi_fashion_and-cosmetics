import React from 'react';
import { Zap } from 'lucide-react';

const OfferBadge = ({ offer, compact = false, variant = 'default' }) => {
  if (!offer) return null;

  const getBadgeColor = (offerType) => {
    const colors = {
      festive: 'from-red-500 to-orange-500',
      percentage: 'from-blue-500 to-blue-600',
      fixed: 'from-green-500 to-green-600',
      bogo: 'from-purple-500 to-purple-600',
      seasonal: 'from-yellow-500 to-orange-500',
      flash: 'from-red-600 to-red-700',
      category: 'from-indigo-500 to-indigo-600',
      product: 'from-pink-500 to-pink-600'
    };
    return colors[offerType] || 'from-gray-500 to-gray-600';
  };

  const getBadgeShadow = (offerType) => {
    const shadows = {
      festive: 'shadow-lg shadow-red-500/50',
      percentage: 'shadow-lg shadow-blue-500/50',
      fixed: 'shadow-lg shadow-green-500/50',
      bogo: 'shadow-lg shadow-purple-500/50',
      seasonal: 'shadow-lg shadow-yellow-500/50',
      flash: 'shadow-2xl shadow-red-600/60',
      category: 'shadow-lg shadow-indigo-500/50',
      product: 'shadow-lg shadow-pink-500/50'
    };
    return shadows[offerType] || 'shadow-lg shadow-gray-500/50';
  };

  const getBadgeText = () => {
    if (offer.offerType === 'bogo') {
      return 'BOGO';
    } else if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else if (offer.discountType === 'fixedAmount') {
      return `₹${offer.discountValue} OFF`;
    }
    return offer.title;
  };

  const isFlash = offer.offerType === 'flash';

  // Compact style for small spaces (product cards, navbar)
  if (compact) {
    return (
      <div 
        className={`
          relative inline-block
          bg-gradient-to-r ${getBadgeColor(offer.offerType)} 
          text-white px-2 py-1 rounded text-xs font-bold
          ${getBadgeShadow(offer.offerType)}
          ${isFlash ? 'animate-pulse' : ''}
          transition-all duration-300
        `}
      >
        {isFlash && <Zap className="w-3 h-3 inline mr-1" />}
        {getBadgeText()}
      </div>
    );
  }

  // Ribbon variant for product pages
  if (variant === 'ribbon') {
    return (
      <div className="absolute top-0 right-0 z-10">
        <div className={`
          relative
          bg-gradient-to-r ${getBadgeColor(offer.offerType)}
          text-white px-4 py-2 text-sm font-bold
          ${getBadgeShadow(offer.offerType)}
          ${isFlash ? 'animate-pulse' : 'animate-bounce'}
          origin-top-right rotate-0
          transition-all duration-300
          before:content-['']
          before:absolute
          before:top-0
          before:left-0
          before:w-0
          before:h-0
          before:border-l-[20px]
          before:border-r-[20px]
          before:border-t-[20px]
          before:border-l-transparent
          before:border-r-transparent
          before:border-t-transparent
          rounded-bl-lg
        `}>
          <div className="flex items-center gap-1">
            {isFlash && <Zap className="w-4 h-4" />}
            <span>{getBadgeText()}</span>
          </div>
        </div>
      </div>
    );
  }

  // Pill variant for home page featured section
  if (variant === 'pill') {
    return (
      <div className={`
        inline-flex items-center gap-2
        bg-gradient-to-r ${getBadgeColor(offer.offerType)}
        text-white px-4 py-2 rounded-full text-sm font-bold
        ${getBadgeShadow(offer.offerType)}
        ${isFlash ? 'animate-pulse' : ''}
        backdrop-blur-sm
        border border-white/30
        hover:scale-105 hover:shadow-2xl
        transition-all duration-300
        cursor-pointer
      `}>
        {isFlash && <Zap className="w-5 h-5 animate-spin" />}
        <span>{getBadgeText()}</span>
      </div>
    );
  }

  // Default variant with floating animation
  return (
    <div className={`
      inline-block
      bg-gradient-to-r ${getBadgeColor(offer.offerType)}
      text-white px-3 py-1 rounded-full text-sm font-bold
      ${getBadgeShadow(offer.offerType)}
      ${isFlash ? 'animate-pulse' : 'animate-float'}
      border border-white/20
      transition-all duration-300
      hover:scale-110 hover:shadow-2xl
    `}>
      {getBadgeText()}
    </div>
  );
};

export default OfferBadge;
