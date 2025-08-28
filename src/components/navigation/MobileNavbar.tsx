import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Shield, Sparkles } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [animatingButton, setAnimatingButton] = React.useState<string | null>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home, animation: 'bounce' },
    { path: '/exams', label: 'Exams', icon: Calendar, animation: 'pulse' },
    { path: '/goals', label: 'Goals', icon: Target, animation: 'spin' },
    { path: '/sessions', label: 'Sessions', icon: Clock, animation: 'wiggle' },
    { path: '/analytics', label: 'Analytics', icon: Analytics, animation: 'flip' },
    { path: '/settings', label: 'Settings', icon: Settings, animation: 'shake' }
  ];

  const handleButtonClick = (path: string) => {
    setAnimatingButton(path);
    setTimeout(() => setAnimatingButton(null), 600);
  };

  const getAnimationClass = (animation: string, isAnimating: boolean, isActive: boolean) => {
    if (!isAnimating && !isActive) return '';
    
    const baseClasses = 'transition-all duration-200';
    
    if (isActive) {
      return `${baseClasses} scale-110`;
    }
    
    switch (animation) {
      case 'bounce':
        return `${baseClasses} animate-bounce`;
      case 'pulse':
        return `${baseClasses} animate-pulse scale-110`;
      case 'spin':
        return `${baseClasses} animate-spin`;
      case 'wiggle':
        return `${baseClasses} animate-wiggle`;
      case 'flip':
        return `${baseClasses} animate-flip`;
      case 'shake':
        return `${baseClasses} animate-shake`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      {/* Floating Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className="md:hidden fixed bottom-20 right-4 z-40 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-3 flex items-center gap-2 group"
        title="Focus Mode"
      >
        <Shield className="w-5 h-5 group-hover:animate-pulse" />
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-twinkle" />
        <span className="text-sm font-medium">Enter Focus Mode</span>
      </button>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, label, icon: Icon, animation }) => (
            <Link
              key={path}
              to={path}
              onClick={() => handleButtonClick(path)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-0 flex-1
                transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700
                ${location.pathname === path
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 ${getAnimationClass(
                  animation, 
                  animatingButton === path, 
                  location.pathname === path
                )}`} 
              />
              <span className={`text-xs font-medium truncate transition-all duration-200 ${
                location.pathname === path ? 'font-semibold' : ''
              }`}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(0deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out;
        }
        
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

