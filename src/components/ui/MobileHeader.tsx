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
      {/* Floating header with scale and fade animation */}
      <div className={`transition-all duration-700 ease-out transform ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
          : 'opacity-0 scale-75 -translate-y-8 rotate-3'
      }`}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-center">
            {/* Floating TRMS Badge with morphing effects */}
            <div className="relative group cursor-pointer">
              {/* Animated background orbs */}
              <div className="absolute -inset-4 opacity-30">
                <div className="absolute top-0 left-0 w-8 h-8 bg-cyan-400 rounded-full blur-xl animate-bounce"></div>
                <div className="absolute top-2 right-0 w-6 h-6 bg-purple-400 rounded-full blur-lg animate-pulse delay-300"></div>
                <div className="absolute bottom-0 left-2 w-4 h-4 bg-pink-400 rounded-full blur-md animate-ping delay-700"></div>
              </div>
              
              {/* Main floating badge */}
              <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2">
                <div className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-xl">
                  {/* Animated icon with rotation */}
                  <div className="relative">
                    <Zap className="w-5 h-5 text-white drop-shadow-lg transform transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
                    {/* Icon trail effect */}
                    <div className="absolute inset-0 bg-white/40 rounded-full blur-sm animate-spin"></div>
                  </div>
                  
                  {/* Text with letter spacing animation */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-light text-white/80 tracking-widest transform transition-all duration-300 group-hover:tracking-wider">
                      Powered By
                    </span>
                    <span className="text-lg font-black text-white tracking-wider drop-shadow-lg transform transition-all duration-300 group-hover:text-yellow-200 group-hover:tracking-widest">
                      TRMS
                    </span>
                  </div>
                </div>
                
                {/* Morphing glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500 animate-pulse"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="absolute top-1 left-4 w-1 h-1 bg-white rounded-full opacity-60 animate-bounce delay-100"></div>
                  <div className="absolute top-3 right-6 w-1 h-1 bg-white rounded-full opacity-40 animate-bounce delay-500"></div>
                  <div className="absolute bottom-2 left-8 w-1 h-1 bg-white rounded-full opacity-80 animate-bounce delay-1000"></div>
                </div>
                
                {/* Sliding highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:animate-pulse"></div>
              </div>
              
              {/* Ripple effect on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
                <div className="absolute inset-2 rounded-xl border border-white/20 animate-ping delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
