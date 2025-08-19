import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Shield, Menu, Zap } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

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
      {/* Enhanced Floating Focus Mode Button */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        {/* Animated ring effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 animate-ping opacity-20"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 animate-pulse opacity-30"></div>
        
        {/* Main button */}
        <button
          onClick={() => setShowFocusMode(true)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`
            relative bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 text-white 
            px-5 py-3 rounded-full shadow-2xl hover:shadow-purple-500/25 
            transition-all duration-300 ease-out
            hover:scale-110 active:scale-95
            ${isPressed ? 'scale-95' : 'hover:scale-110'}
            flex items-center gap-2 group
            border border-white/20 backdrop-blur-sm
            before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r 
            before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100
            before:transition-opacity before:duration-300
          `}
          title="Enter Focus Mode"
        >
          {/* Icon with rotation animation */}
          <div className="relative">
            <Shield className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            {/* Sparkle effect */}
            <Zap className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Text with slide animation */}
          <div className="overflow-hidden">
            <span className="text-sm font-semibold block transition-transform duration-300 group-hover:-translate-y-1">
              Focus Mode
            </span>
            <span className="text-xs opacity-80 block transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
              Stay focused!
            </span>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </button>

        {/* Focus indicator dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
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
