import React, { useState, useEffect } from 'react';
import { BookOpen, Zap } from 'lucide-react';

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
    <div className={`md:hidden sticky top-0 z-50 transition-all duration-300 ease-out ${
      isVisible ? 'transform translate-y-0 opacity-100' : 'transform -translate-y-full opacity-0'
    }`}>
      {/* Compact header with glassmorphism effect */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left side - Powered By TRMS */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-full border border-emerald-200/50">
              <Zap className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                Powered By TRMS
              </span>
            </div>
            
            {/* Right side - Status indicator */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-full border border-emerald-200/50">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">
                Active
              </span>
            </div>
          </div>
        </div>
        
        {/* Subtle progress indicator */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-60"></div>
      </div>
    </div>
  );
};
