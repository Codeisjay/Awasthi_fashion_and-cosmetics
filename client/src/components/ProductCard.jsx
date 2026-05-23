import React from 'react';

const ProductCard = ({ product, onViewClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-200">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Stock Status */}
        <div className="flex items-center justify-end mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
            product.stockStatus === 'in-stock'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stockStatus === 'in-stock' ? '✓ In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewClick(product)}
          className="w-full py-2 rounded-lg font-semibold transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        >
          View on Meesho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
