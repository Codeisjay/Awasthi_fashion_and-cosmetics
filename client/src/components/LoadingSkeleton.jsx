import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg animate-pulse h-80" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
