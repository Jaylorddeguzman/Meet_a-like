'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Hearts */}
        <div className="relative w-24 h-24 mx-auto">
          <Heart 
            className="absolute inset-0 w-24 h-24 text-pink-500 animate-ping" 
            fill="rgba(236, 72, 153, 0.3)"
          />
          <Heart 
            className="absolute inset-0 w-24 h-24 text-pink-500 animate-pulse" 
            fill="rgb(236, 72, 153)"
          />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {message}
          </h2>
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
