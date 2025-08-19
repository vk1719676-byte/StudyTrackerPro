import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Menu, X } from 'lucide-react';

export const ResponsiveHeader: React.FC = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gradients = [
    'from-blue-600 via-purple-600 to-indigo-700',
    'from-emerald-600 via-teal-600 to-cyan-700',
    'from-orange-600 via-red-600 to-pink-700',
    'from-purple-600 via-pink-600 to-rose-700',
    'from-green-600 via-emerald-600 to-teal-700',
    'from-indigo-600 via-blue-600 to-cyan-700'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % gradients.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [gradients.length]);

  // Close menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 perspective-1000">
        <div 
          className={`relative bg-gradient-to-r ${gradients[colorIndex]} text-white transition-all duration-700 ease-out transform-gpu ${
            isHovered 
              ? 'scale-[1.01] md:scale-[1.02]' 
              : 'scale-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isHovered 
              ? 'perspective(800px) rotateX(-0.5deg) rotateY(0.3deg) translateZ(2px) md:rotateX(-1deg) md:rotateY(0.5deg) md:translateZ(4px) scale(1.01) md:scale(1.02)' 
              : 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
            boxShadow: isHovered 
              ? '0 8px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15) md:0 12px 32px rgba(0, 0, 0, 0.25)' 
              : '0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle 3D depth layer */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent rounded-sm"
            style={{ transform: 'translateZ(-1px)' }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-white/40 rounded-full animate-bounce"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${25 + (i % 2) * 50}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${2 + i * 0.2}s`,
                  transform: `translateZ(${1 + i}px)`,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              />
            ))}
          </div>
          
          {/* Main content */}
          <div 
            className="relative px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5"
            style={{ transform: 'translateZ(2px)' }}
          >
            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center md:justify-between">
              {/* Left side - Logo and Title */}
              <div className="flex items-center space-x-4">
                <h1 
                  className={`text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight transition-all duration-400 ${
                    isHovered ? 'scale-105 tracking-wide' : 'scale-100'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isHovered 
                      ? '0 3px 6px rgba(0, 0, 0, 0.25)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.15)',
                    transform: isHovered 
                      ? 'translateZ(3px) scale(1.05)' 
                      : 'translateZ(1px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                  }}
                >
                  Study Tracker Pro
                </h1>
              </div>

              {/* Right side - Navigation and Badge */}
              <div className="flex items-center space-x-6">
                {/* Navigation Menu */}
                <nav className="hidden lg:flex items-center space-x-6">
                  {['Dashboard', 'Analytics', 'Settings'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-white/90 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10"
                      style={{
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </nav>

                {/* Powered by badge */}
                <div 
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-400 cursor-pointer ${
                    isHovered ? 'scale-105 bg-white/25 shadow-lg' : 'scale-100'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'translateZ(4px) scale(1.05)' 
                      : 'translateZ(2px)',
                    boxShadow: isHovered 
                      ? '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <Zap 
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300 transition-all duration-300 ${
                      isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                    }`}
                    style={{
                      filter: isHovered 
                        ? 'drop-shadow(0 2px 4px rgba(253, 224, 71, 0.3))' 
                        : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                  
                  <span 
                    className="text-xs md:text-sm font-semibold text-white tracking-wide"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Powered By TRMS
                  </span>
                  
                  <Sparkles 
                    className={`w-3 h-3 md:w-3.5 md:h-3.5 text-blue-200 transition-all duration-500 ${
                      isHovered ? 'opacity-100 rotate-90 scale-110' : 'opacity-0 rotate-0 scale-100'
                    }`}
                    style={{
                      filter: isHovered 
                        ? 'drop-shadow(0 2px 4px rgba(191, 219, 254, 0.3))' 
                        : 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex items-center justify-between">
                {/* Mobile Title */}
                <h1 
                  className={`text-lg font-bold tracking-tight transition-all duration-400 ${
                    isHovered ? 'scale-105 tracking-wide' : 'scale-100'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: isHovered 
                      ? '0 3px 6px rgba(0, 0, 0, 0.25)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.15)',
                    transform: isHovered 
                      ? 'translateZ(3px) scale(1.05)' 
                      : 'translateZ(1px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                  }}
                >
                  Study Tracker Pro
                </h1>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:bg-white/25 hover:scale-105"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Menu className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Mobile Badge */}
              <div className="flex justify-center mt-3">
                <div 
                  className={`flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 transition-all duration-400 cursor-pointer ${
                    isHovered ? 'scale-105 bg-white/25 shadow-lg' : 'scale-100'
                  }`}
                  style={{
                    transform: isHovered 
                      ? 'translateZ(4px) scale(1.05)' 
                      : 'translateZ(2px)',
                    boxShadow: isHovered 
                      ? '0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <Zap 
                    className={`w-3.5 h-3.5 text-yellow-300 transition-all duration-300 ${
                      isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                    }`}
                    style={{
                      filter: isHovered 
                        ? 'drop-shadow(0 2px 4px rgba(253, 224, 71, 0.3))' 
                        : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                  
                  <span 
                    className="text-xs font-semibold text-white tracking-wide"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Powered By TRMS
                  </span>
                  
                  <Sparkles 
                    className={`w-3 h-3 text-blue-200 transition-all duration-500 ${
                      isHovered ? 'opacity-100 rotate-90 scale-110' : 'opacity-0 rotate-0 scale-100'
                    }`}
                    style={{
                      filter: isHovered 
                        ? 'drop-shadow(0 2px 4px rgba(191, 219, 254, 0.3))' 
                        : 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom accent line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ transform: 'translateZ(1px)' }}
          />
        </div>
        
        {/* 3D shadow */}
        <div 
          className={`absolute -bottom-2 left-1 right-1 h-2 md:-bottom-3 md:h-3 bg-gradient-to-b from-black/15 to-transparent pointer-events-none transition-all duration-400 rounded-full blur-sm ${
            isHovered ? 'from-black/20 scale-105' : 'from-black/15 scale-100'
          }`}
          style={{
            transform: isHovered 
              ? 'translateY(2px) scale(1.05)' 
              : 'translateY(0px) scale(1)'
          }}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-64 h-full bg-gradient-to-b ${gradients[colorIndex]} shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Menu</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <nav className="space-y-3">
              {['Dashboard', 'Analytics', 'Settings', 'Profile', 'Help'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

