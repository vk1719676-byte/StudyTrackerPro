import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, Crown } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
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
      setLastScrollY(currentScrollY);
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
      <div className={`bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="px-4 py-3">
          <div className="text-center space-y-2">
            {/* Logo and title with PRO badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">
                  Study Tracker
                </h1>
                {/* Gold PRO Badge */}
                <div className="relative">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full shadow-lg border border-yellow-300/50">
                    <Crown className="w-3 h-3 text-yellow-900" />
                    <span className="text-xs font-bold text-yellow-900 tracking-wide">
                      PRO
                    </span>
                  </div>
                  {/* Golden glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-full opacity-20 blur-sm animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Powered by badge */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full border border-purple-200/50">
                <Zap className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  Designer Text
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
