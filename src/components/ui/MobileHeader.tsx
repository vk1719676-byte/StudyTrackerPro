import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide when scrolling down, show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`block md:hidden sticky top-0 z-50 transition-all duration-300 ease-out ${
      isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'
    }`}>
      {/* Compact golden header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-amber-200/30 shadow-sm">
        <div className="px-4 py-2">
          {/* Centrally aligned golden branding */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 rounded-full border border-amber-300/40 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 relative overflow-hidden">
              {/* Golden shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent animate-shimmer"></div>
              <div className="relative flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600 drop-shadow-sm" />
                <span className="text-xs font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 bg-clip-text text-transparent">
                Powered By TRMS
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Golden progress line */}
        <div className="h-0.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 opacity-70">
          <div className="h-full bg-gradient-to-r from-transparent via-amber-200/60 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
