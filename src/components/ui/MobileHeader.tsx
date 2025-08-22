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
    <div className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
      isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'
    }`}>
      {/* Main header with glassmorphism effect */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/30 shadow-lg shadow-emerald-500/5">
        <div className="px-6 py-4">
          {/* Centrally aligned main branding */}
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full border border-blue-200/40 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <Zap className="w-4 h-4 text-blue-600 drop-shadow-sm" />
                <div className="absolute inset-0 w-4 h-4 bg-blue-400/30 blur-sm rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-700 via-purple-700 to-blue-700 bg-clip-text text-transparent">
                Powered By TRMS
              </span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
        </div>
        
        {/* Animated progress indicator */}
        <div className="relative h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-60 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-40">
            <div className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </div>
  );
};
