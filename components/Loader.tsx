import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center animate-pulse">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">
        Analyzing pixels...
      </h2>
      <p className="text-gray-500 font-light">
        "Bhai website check ho rahi hai…"
      </p>
    </div>
  );
};