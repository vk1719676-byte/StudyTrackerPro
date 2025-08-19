import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Shield, Menu } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/exams', label: 'Exams', icon: Calendar },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/sessions', label: 'Sessions', icon: Clock },
    { path: '/analytics', label: 'Analytics', icon: Analytics },
    { path: '/materials', label: 'Materials', icon: Upload },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <>
      {/* Compact Floating Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group overflow-hidden animate-pulse hover:animate-none backdrop-blur-sm"
        title="Focus Mode"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Shield className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Breathing ring effect */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-300/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-500/20 animate-pulse"></div>
      </button>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
      />

      {/* Enhanced Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 z-50 shadow-lg">
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-around py-1">
          {navItems.map(({ path, label, icon: Icon }, index) => {
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={path}
                to={path}
                onClick={createRipple}
                className={`
                  relative flex flex-col items-center gap-1 px-2 py-2 rounded-xl min-w-0 flex-1 overflow-hidden
                  transition-all duration-300 ease-out transform
                  ${isActive
                    ? 'text-purple-600 dark:text-purple-400 scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300'
                  }
                  hover:bg-purple-50/50 dark:hover:bg-purple-900/20 active:scale-95
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Ripple effects */}
                {ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute pointer-events-none rounded-full bg-purple-400/30 animate-ping"
                    style={{
                      left: ripple.x - 10,
                      top: ripple.y - 10,
                      width: 20,
                      height: 20,
                    }}
                  />
                ))}

                {/* Active indicator */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-100/30 to-transparent dark:from-purple-900/30 rounded-xl"></div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm"></div>
                  </>
                )}

                {/* Icon with enhanced animations */}
                <div className={`
                  relative flex items-center justify-center w-8 h-8 rounded-lg
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50' 
                    : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
                  }
                `}>
                  <Icon className={`
                    w-5 h-5 transition-all duration-300
                    ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'}
                  `} />
                  
                  {/* Icon glow effect for active state */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-purple-500/10 animate-pulse"></div>
                  )}
                </div>

                {/* Label with better typography */}
                <span className={`
                  text-xs font-medium truncate transition-all duration-300
                  ${isActive ? 'font-semibold text-shadow-sm' : ''}
                `}>
                  {label}
                </span>

                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700 ease-out pointer-events-none"></div>
              </Link>
            );
          })}
        </div>

        {/* Bottom safe area for devices with home indicators */}
        <div className="h-safe-area-inset-bottom bg-transparent"></div>
      </nav>

      <style jsx>{`
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};
