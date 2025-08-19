import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Brain, Sparkles, Flame, Eye } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/exams', label: 'Exams', icon: Calendar },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/sessions', label: 'Sessions', icon: Clock },
    { path: '/analytics', label: 'Analytics', icon: Analytics },
    { path: '/materials', label: 'Materials', icon: Upload },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      {/* Catchy Floating Focus Mode Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        {/* Magical aura effects */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-spin opacity-20 blur-md"></div>
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse opacity-30"></div>
        
        {/* Main catchy button */}
        <button
          onClick={() => setShowFocusMode(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white 
            px-6 py-4 rounded-2xl shadow-2xl hover:shadow-orange-500/40 
            transition-all duration-500 ease-out
            hover:scale-110 active:scale-95 hover:rotate-3
            flex items-center gap-3 group overflow-hidden
            border-2 border-yellow-300/30 backdrop-blur-sm
            ${isHovered ? 'animate-bounce' : ''}
          `}
          title="🔥 Beast Mode Activated!"
        >
          {/* Animated background waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-pink-400/10 via-purple-400/10 to-blue-400/10 animate-ping"></div>
          
          {/* Dynamic icon with effects */}
          <div className="relative z-10">
            {isHovered ? (
              <Flame className="w-6 h-6 text-yellow-300 animate-pulse transition-all duration-300" />
            ) : (
              <Brain className="w-6 h-6 transition-all duration-300 group-hover:rotate-180" />
            )}
            
            {/* Floating sparkles */}
            <Sparkles className="w-3 h-3 absolute -top-2 -right-2 text-yellow-300 animate-spin" />
            <Eye className="w-2 h-2 absolute -bottom-1 -left-1 text-cyan-300 animate-bounce" />
          </div>
          
          {/* Dynamic text content */}
          <div className="relative z-10 flex flex-col">
            <span className="text-sm font-bold tracking-wide transition-all duration-300 group-hover:text-yellow-200">
              {isHovered ? '🚀 BEAST MODE' : '🧠 FOCUS ZONE'}
            </span>
            <span className="text-xs font-medium opacity-90 transition-all duration-300">
              {isHovered ? 'Unleash Power!' : 'Lock & Load'}
            </span>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 pointer-events-none"></div>
        </button>

        {/* Power indicator */}
        <div className="absolute -top-2 -right-2 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
        </div>
        
        {/* Energy text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-orange-500 animate-pulse whitespace-nowrap">
          ⚡ POWER UP ⚡
        </div>
      </div>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Enhanced Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 z-50">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative flex flex-col items-center gap-1 px-2 py-2 rounded-xl min-w-0 flex-1
                  transition-all duration-300 ease-out
                  group hover:scale-105 active:scale-95
                  ${isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300'
                  }
                `}
              >
                {/* Active indicator background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl animate-pulse"></div>
                )}
                
                {/* Icon container */}
                <div className="relative">
                  <Icon className={`
                    w-5 h-5 transition-all duration-300
                    ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-110'} 
                  `} />
                  
                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Label with better typography */}
                <span className={`
                  text-xs font-medium truncate transition-all duration-300
                  ${isActive ? 'font-semibold' : 'group-hover:font-medium'}
                `}>
                  {label}
                </span>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>
        
        {/* Bottom safe area for devices with home indicators */}
        <div className="h-safe-area-inset-bottom"></div>
      </nav>
    </>
  );
};
