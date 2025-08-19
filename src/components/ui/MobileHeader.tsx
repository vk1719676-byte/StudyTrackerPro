import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, Sparkles } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    'from-emerald-500 via-teal-600 to-cyan-600',
    'from-purple-500 via-pink-600 to-rose-600',
    'from-blue-500 via-indigo-600 to-purple-600',
    'from-orange-500 via-red-600 to-pink-600',
    'from-green-500 via-emerald-600 to-teal-600',
    'from-cyan-500 via-blue-600 to-indigo-600'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % gradients.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [gradients.length]);

  return (
    <div className="md:hidden relative overflow-hidden sticky top-0 z-50">
      {/* Animated background with color transitions */}
      <div 
        className={`bg-gradient-to-r ${gradients[colorIndex]} text-white transition-all duration-1000 ease-in-out transform ${
          isHovered ? 'scale-[1.02]' : 'scale-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)] animate-pulse delay-1000"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.25)_0%,transparent_50%)] animate-pulse delay-2000"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white/40 rounded-full animate-bounce`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>
        
        {/* Main content */}
        <div className="relative px-4 py-3">
          <div className="text-center space-y-3">
            {/* Title section with enhanced animations */}
            <div className="relative">
              <h1 className={`text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-sm transition-all duration-500 ${
                isHovered ? 'scale-105 tracking-wide' : 'scale-100'
              }`}>
                Study Tracker Pro
              </h1>
              
              {/* Animated underline */}
              <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-white/60 to-transparent transition-all duration-700 ${
                isHovered ? 'w-full' : 'w-0'
              }`}></div>
            </div>
            
            {/* Enhanced powered by section */}
            <div className="flex items-center justify-center">
              <div className={`flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-500 transform ${
                isHovered ? 'scale-105 bg-white/30 shadow-lg shadow-white/20' : 'scale-100'
              } hover:bg-white/25 group cursor-pointer`}>
                <div className="relative">
                  <Zap className={`w-4 h-4 text-orange-300 transition-all duration-300 ${
                    isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                  }`} />
                  <div className="absolute inset-0 animate-ping">
                    <Zap className="w-4 h-4 text-orange-300 opacity-30" />
                  </div>
                </div>
                
                <span className={`text-sm font-medium text-white/95 tracking-wide transition-all duration-300 ${
                  isHovered ? 'text-white' : 'text-white/95'
                }`}>
                  Powered By TRMS
                </span>
                
                <Sparkles className={`w-4 h-4 text-yellow-300 transition-all duration-500 ${
                  isHovered ? 'opacity-100 rotate-180 scale-110' : 'opacity-0 rotate-0 scale-100'
                }`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className={`h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 ${
            isHovered ? 'via-white/60' : 'via-white/40'
          }`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
      
      {/* Enhanced shadow with animation */}
      <div className={`absolute -bottom-6 left-0 right-0 h-6 bg-gradient-to-b from-black/12 to-transparent pointer-events-none transition-all duration-500 ${
        isHovered ? 'from-black/20' : 'from-black/12'
      }`}></div>
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradients[colorIndex]} opacity-0 blur-xl transition-all duration-700 pointer-events-none ${
        isHovered ? 'opacity-20' : 'opacity-0'
      }`}></div>
    </div>
  );
};

