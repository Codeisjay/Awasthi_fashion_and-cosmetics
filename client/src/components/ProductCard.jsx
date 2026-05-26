import React from 'react';

const ProductCard = ({ product, onViewClick }) => {
  return (
    <div className="product-item bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group h-full flex flex-col hover:scale-105 transform active:scale-95 md:active:scale-100">
      {/* Image Container */}
      <div className="relative overflow-hidden h-40 xs:h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Category Badge */}
        <div className="absolute top-2 xs:top-3 left-2 xs:left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 xs:px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 xs:p-4 flex-1 flex flex-col">
        <h3 className="text-sm xs:text-base font-semibold text-gray-800 line-clamp-2 mb-1 xs:mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {product.title}
        </h3>
        <p className="text-xs xs:text-sm text-gray-600 mb-3 xs:mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price and Stock Status Row */}
        <div className="flex items-center justify-between mb-3 xs:mb-4">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-lg xs:text-xl font-bold text-gray-900">
              ₹{product.price?.toFixed(2) || 'N/A'}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs xs:text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <span className={`text-xs font-semibold px-2 xs:px-3 py-1 rounded-full transition-all duration-300 whitespace-nowrap ${
            product.stockStatus === 'in-stock'
              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-sm'
              : 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 shadow-sm'
          }`}>
            {product.stockStatus === 'in-stock' ? '✓ In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewClick(product)}
          className="w-full py-2 xs:py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-95 md:active:scale-100 transform shadow-md"
        >
          View on Meesho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
