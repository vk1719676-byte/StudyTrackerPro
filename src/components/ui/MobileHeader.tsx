import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';

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
    <div className="md:hidden relative overflow-hidden sticky top-0 z-50 perspective-1000">
      {/* 3D Container with depth */}
      <div 
        className={`relative bg-gradient-to-r ${gradients[colorIndex]} text-white transition-all duration-1000 ease-in-out transform-gpu ${
          isHovered 
            ? 'scale-105 rotateX-2 rotateY-1 translateZ-8' 
            : 'scale-100 rotateX-0 rotateY-0 translateZ-0'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered 
            ? 'perspective(1000px) rotateX(-2deg) rotateY(1deg) translateZ(8px) scale(1.05)' 
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
            : '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Depth layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
          style={{
            transform: 'translateZ(-2px)',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Animated 3D pattern overlay */}
        <div className="absolute inset-0 opacity-30" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.4)_0%,transparent_50%)] animate-pulse"
            style={{ transform: 'translateZ(1px)' }}
          />
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)] animate-pulse delay-1000"
            style={{ transform: 'translateZ(2px)' }}
          />
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.35)_0%,transparent_50%)] animate-pulse delay-2000"
            style={{ transform: 'translateZ(1.5px)' }}
          />
        </div>

        {/* 3D Floating particles with depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce shadow-lg"
              style={{
                left: `${15 + i * 12}%`,
                top: `${25 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + i * 0.2}s`,
                transform: `translateZ(${2 + (i % 3)}px)`,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3), 0 0 4px rgba(255, 255, 255, 0.5)'
              }}
            />
          ))}
        </div>
        
        {/* Main 3D content */}
        <div 
          className="relative px-4 py-4"
          style={{
            transform: 'translateZ(4px)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="text-center space-y-4">
            {/* 3D Title section */}
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <h1 
                className={`text-2xl font-bold tracking-tight transition-all duration-500 ${
                  isHovered ? 'scale-110 tracking-wider' : 'scale-100'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #e0f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: isHovered 
                    ? '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transform: isHovered 
                    ? 'translateZ(6px) rotateX(-1deg)' 
                    : 'translateZ(3px)',
                  transformStyle: 'preserve-3d'
                }}
              >
                Study Tracker Pro
              </h1>
              
              {/* 3D Animated underline */}
              <div 
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-white/70 via-white/90 to-white/70 rounded-full transition-all duration-700 ${
                  isHovered ? 'w-full shadow-lg' : 'w-0'
                }`}
                style={{
                  transform: isHovered 
                    ? 'translateX(-50%) translateZ(2px) rotateX(-5deg)' 
                    : 'translateX(-50%) translateZ(0px)',
                  boxShadow: isHovered 
                    ? '0 4px 8px rgba(255, 255, 255, 0.3), 0 0 12px rgba(255, 255, 255, 0.2)' 
                    : 'none'
                }}
              />
            </div>
            
            {/* Enhanced 3D powered by section */}
            <div className="flex items-center justify-center">
              <div 
                className={`flex items-center gap-3 px-6 py-3 bg-white/25 backdrop-blur-md rounded-2xl border border-white/40 transition-all duration-500 transform cursor-pointer ${
                  isHovered ? 'scale-110 bg-white/35 shadow-2xl' : 'scale-100'
                } hover:bg-white/30 group`}
                style={{
                  transform: isHovered 
                    ? 'translateZ(8px) rotateX(-2deg) scale(1.1)' 
                    : 'translateZ(4px)',
                  transformStyle: 'preserve-3d',
                  boxShadow: isHovered 
                    ? '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                    : '0 8px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                  <Zap 
                    className={`w-5 h-5 text-orange-300 transition-all duration-300 ${
                      isHovered ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
                    }`}
                    style={{
                      transform: isHovered 
                        ? 'translateZ(2px) scale(1.25) rotate(12deg)' 
                        : 'translateZ(1px)',
                      filter: isHovered 
                        ? 'drop-shadow(0 4px 8px rgba(251, 146, 60, 0.4)) drop-shadow(0 0 8px rgba(251, 146, 60, 0.3))' 
                        : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                    }}
                  />
                  <div className="absolute inset-0 animate-ping">
                    <Zap className="w-5 h-5 text-orange-300 opacity-40" />
                  </div>
                </div>
                
                <span 
                  className={`text-base font-semibold text-white tracking-wide transition-all duration-300 ${
                    isHovered ? 'text-white' : 'text-white/95'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'translateZ(3px)' 
                      : 'translateZ(1px)',
                    textShadow: isHovered 
                      ? '0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Powered By TRMS
                </span>
                
                <Sparkles 
                  className={`w-5 h-5 text-yellow-300 transition-all duration-500 ${
                    isHovered ? 'opacity-100 rotate-180 scale-125' : 'opacity-0 rotate-0 scale-100'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'translateZ(4px) rotate(180deg) scale(1.25)' 
                      : 'translateZ(0px)',
                    filter: isHovered 
                      ? 'drop-shadow(0 4px 8px rgba(253, 224, 71, 0.4)) drop-shadow(0 0 12px rgba(253, 224, 71, 0.3))' 
                      : 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 3D Animated bottom border */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ transform: 'translateZ(2px)' }}
        >
          <div 
            className={`h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-1000 ${
              isHovered ? 'via-white/70' : 'via-white/50'
            }`}
            style={{
              boxShadow: isHovered 
                ? '0 0 8px rgba(255, 255, 255, 0.5)' 
                : '0 0 4px rgba(255, 255, 255, 0.3)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Enhanced 3D shadow with depth */}
      <div 
        className={`absolute -bottom-8 left-2 right-2 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none transition-all duration-500 rounded-full blur-sm ${
          isHovered ? 'from-black/30 scale-110' : 'from-black/20 scale-100'
        }`}
        style={{
          transform: isHovered 
            ? 'translateY(4px) scale(1.1)' 
            : 'translateY(0px) scale(1)'
        }}
      />
      
      {/* 3D Glow effect on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${gradients[colorIndex]} opacity-0 blur-2xl transition-all duration-700 pointer-events-none rounded-lg ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          transform: 'translateZ(-10px) scale(1.2)'
        }}
      />
    </div>
  );
};

