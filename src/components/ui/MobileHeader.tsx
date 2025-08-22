import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controlHeader = () => {
      // Hide header when scrolling
      setIsVisible(false);
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Show header after scrolling stops (300ms delay)
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      
      setScrollTimeout(timeout);
    };

    // Add scroll listener
    window.addEventListener('scroll', controlHeader, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlHeader);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <div className="md:hidden sticky top-0 z-50">
      {/* Main header with smooth transition */}
      <div className={`bg-white/95 backdrop-blur-md border-b border-gray-200/30 shadow-lg transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-center">
            {/* Stylish TRMS Badge */}
            <div className="relative group">
              {/* Main badge */}
              <div className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-xl border border-white/20 backdrop-blur-sm">
                <div className="relative">
                  <Zap className="w-4 h-4 text-white drop-shadow-sm" />
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-white/90 tracking-wide">
                    Powered By
                  </span>
                  <span className="text-sm font-bold text-white tracking-wider drop-shadow-sm">
                    TRMS
                  </span>
                </div>
              </div>
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-300 animate-pulse"></div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
