import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, TrendingUp, Clock, Zap } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { ASSET_BASE_URL } from '../services/api';

const OfferCard = ({ offer }) => {
  const isPercentage = offer.discountType === 'percentage';
  const discountValue = isPercentage ? `${offer.discountValue}%` : `₹${offer.discountValue}`;
  
  const getOfferTypeColor = (type) => {
    const colors = {
      festive: 'from-red-500 to-pink-500',
      percentage: 'from-blue-500 to-cyan-500',
      fixed: 'from-green-500 to-emerald-500',
      bogo: 'from-purple-500 to-pink-500',
      seasonal: 'from-orange-500 to-yellow-500',
      flash: 'from-red-600 to-orange-500',
      category: 'from-indigo-500 to-purple-500',
      product: 'from-cyan-500 to-blue-500'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getBadgeShadow = (type) => {
    const shadows = {
      festive: 'shadow-red-500/50',
      percentage: 'shadow-blue-500/50',
      fixed: 'shadow-green-500/50',
      bogo: 'shadow-purple-500/50',
      seasonal: 'shadow-yellow-500/50',
      flash: 'shadow-red-600/60',
      category: 'shadow-indigo-500/50',
      product: 'shadow-cyan-500/50'
    };
    return shadows[type] || 'shadow-gray-500/50';
  };

  const getOfferTypeLabel = (type) => {
    const labels = {
      festive: '🎉 Festive',
      percentage: '💰 Discount',
      fixed: '💵 Fixed',
      bogo: '🎁 BOGO',
      seasonal: '🌞 Seasonal',
      flash: '⚡ Flash',
      category: '📦 Category',
      product: '📍 Product'
    };
    return labels[type] || type;
  };

  const isFlash = offer.offerType === 'flash';

  const getAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads')) {
      return `${ASSET_BASE_URL}${url}`;
    }
    return url;
  };

  return (
    <div className={`
      bg-white rounded-2xl shadow-md hover:shadow-2xl 
      transition-all duration-500 overflow-hidden group h-full
      hover:scale-105 active:scale-95 md:active:scale-100 transform
      ${isFlash ? 'ring-2 ring-red-400' : ''}
    `}>
      {/* Image Section */}
      <div className="relative h-32 xs:h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {offer.bannerImage ? (
          <>
            <img
              src={getAssetUrl(offer.bannerImage)}
              alt={offer.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getOfferTypeColor(offer.offerType)} flex items-center justify-center`}>
            <div className="text-center text-white">
              <TrendingUp className="w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 mx-auto mb-1 xs:mb-2 opacity-80" />
              <p className="text-xs xs:text-sm font-semibold">Special Offer</p>
            </div>
          </div>
        )}

        {/* Discount Badge with Animation */}
        <div className={`
          absolute top-2 xs:top-3 right-2 xs:right-3 
          bg-gradient-to-r ${getOfferTypeColor(offer.offerType)}
          text-white px-2 xs:px-4 py-1 xs:py-2 rounded-full font-bold 
          shadow-2xl ${getBadgeShadow(offer.offerType)}
          ${isFlash ? 'animate-pulse' : 'animate-float'}
          border-2 border-white/30
          transform transition-all duration-300
          text-xs xs:text-sm
        `}>
          <div className="flex items-center gap-1 justify-center">
            {isFlash && <Zap className="w-3 xs:w-5 h-3 xs:h-5 animate-spin" />}
            <span className="text-base xs:text-lg">{discountValue}</span>
          </div>
          <div className="text-xs font-semibold uppercase text-center">OFF</div>
        </div>

        {/* Offer Type Badge */}
        <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 bg-white/95 backdrop-blur-sm px-2 xs:px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-md hover:bg-white transition-all">
          {getOfferTypeLabel(offer.offerType)}
        </div>

        {/* Hot Badge for Flash Offers */}
        {isFlash && (
          <div className="absolute top-2 xs:top-3 left-2 xs:left-3 bg-red-600 text-white px-2 xs:px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse shadow-lg">
            🔥 Hot Deal
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 xs:p-4 flex flex-col h-[calc(100%-8rem)] xs:h-[calc(100%-10rem)] sm:h-[calc(100%-12rem)]">
        {/* Title */}
        <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-1 xs:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {offer.title}
        </h3>

        {/* Description */}
        {offer.description && (
          <p className="text-xs xs:text-sm text-gray-600 mb-2 xs:mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors flex-grow">
            {offer.description}
          </p>
        )}

        {/* Coupon Code with Enhanced Styling */}
        {offer.couponCode && (
          <div className="mb-2 xs:mb-3 p-2 xs:p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all">
            <p className="text-xs text-gray-600 mb-1 font-semibold">Use Code:</p>
            <p className="text-xs xs:text-sm font-mono font-bold text-gray-900 tracking-widest text-center hover:text-blue-600 transition-colors break-all">
              {offer.couponCode}
            </p>
          </div>
        )}

        {/* Validity */}
        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 xs:mb-3 bg-gray-50 p-2 rounded-lg">
          <Calendar className="w-3 xs:w-4 h-3 xs:h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs">
            Till {new Date(offer.endDate).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Countdown Timer */}
        {new Date(offer.endDate) > new Date() && (
          <div className="mb-2 xs:mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
            <CountdownTimer endDate={offer.endDate} />
          </div>
        )}

        {/* Minimum Purchase */}
        {offer.minimumPurchase > 0 && (
          <p className="text-xs text-gray-600 border-t pt-2 mb-3 flex items-center gap-1">
            <Tag className="w-3 h-3 text-gray-500" />
            Min: <span className="font-bold text-gray-900">₹{offer.minimumPurchase}</span>
          </p>
        )}

        {/* CTA Button with Animation */}
        <Link
          to={`/offers/${offer._id}`}
          className={`
            w-full mt-auto bg-gradient-to-r ${getOfferTypeColor(offer.offerType)}
            text-white py-2 xs:py-3 rounded-xl font-bold 
            hover:shadow-2xl transition-all duration-300 
            transform hover:scale-105 active:scale-95 md:active:scale-100
            ${isFlash ? 'animate-pulse' : ''}
            flex items-center justify-center gap-2 text-xs xs:text-sm
          `}
        >
          <Zap className="w-3 xs:w-4 h-3 xs:h-4" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;
