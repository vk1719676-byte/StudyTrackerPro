import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Shield, Menu } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
  const [clickedItem, setClickedItem] = React.useState<string | null>(null);
  const [shockwaves, setShockwaves] = React.useState<{ id: number; x: number; y: number; path: string }[]>([]);
  const [activeEffects, setActiveEffects] = React.useState<string | null>(null);

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      colors: {
        primary: 'blue',
        activeBg: 'from-blue-100 via-blue-50 to-blue-100 text-blue-600 shadow-blue-200',
        active: 'from-blue-400 to-blue-600',
        iconBg: 'from-blue-500 to-blue-600 text-white',
        ripple: 'bg-blue-400/30',
        ripple2: 'bg-blue-500/20',
        ripple3: 'bg-blue-300/40',
        shockwave: 'border-blue-400/40',
        shockwave2: 'border-blue-300/30',
        sparkle1: 'bg-blue-400',
        sparkle2: 'bg-blue-500',
        sparkle3: 'bg-blue-300'
      }
    },
    { 
      path: '/exams', 
      label: 'Exams', 
      icon: Calendar,
      colors: {
        primary: 'emerald',
        activeBg: 'from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-600 shadow-emerald-200',
        active: 'from-emerald-400 to-emerald-600',
        iconBg: 'from-emerald-500 to-emerald-600 text-white',
        ripple: 'bg-emerald-400/30',
        ripple2: 'bg-emerald-500/20',
        ripple3: 'bg-emerald-300/40',
        shockwave: 'border-emerald-400/40',
        shockwave2: 'border-emerald-300/30',
        sparkle1: 'bg-emerald-400',
        sparkle2: 'bg-emerald-500',
        sparkle3: 'bg-emerald-300'
      }
    },
    { 
      path: '/goals', 
      label: 'Goals', 
      icon: Target,
      colors: {
        primary: 'orange',
        activeBg: 'from-orange-100 via-orange-50 to-orange-100 text-orange-600 shadow-orange-200',
        active: 'from-orange-400 to-orange-600',
        iconBg: 'from-orange-500 to-orange-600 text-white',
        ripple: 'bg-orange-400/30',
        ripple2: 'bg-orange-500/20',
        ripple3: 'bg-orange-300/40',
        shockwave: 'border-orange-400/40',
        shockwave2: 'border-orange-300/30',
        sparkle1: 'bg-orange-400',
        sparkle2: 'bg-orange-500',
        sparkle3: 'bg-orange-300'
      }
    },
    { 
      path: '/sessions', 
      label: 'Sessions', 
      icon: Clock,
      colors: {
        primary: 'purple',
        activeBg: 'from-purple-100 via-purple-50 to-purple-100 text-purple-600 shadow-purple-200',
        active: 'from-purple-400 to-purple-600',
        iconBg: 'from-purple-500 to-purple-600 text-white',
        ripple: 'bg-purple-400/30',
        ripple2: 'bg-purple-500/20',
        ripple3: 'bg-purple-300/40',
        shockwave: 'border-purple-400/40',
        shockwave2: 'border-purple-300/30',
        sparkle1: 'bg-purple-400',
        sparkle2: 'bg-purple-500',
        sparkle3: 'bg-purple-300'
      }
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: Analytics,
      colors: {
        primary: 'indigo',
        activeBg: 'from-indigo-100 via-indigo-50 to-indigo-100 text-indigo-600 shadow-indigo-200',
        active: 'from-indigo-400 to-indigo-600',
        iconBg: 'from-indigo-500 to-indigo-600 text-white',
        ripple: 'bg-indigo-400/30',
        ripple2: 'bg-indigo-500/20',
        ripple3: 'bg-indigo-300/40',
        shockwave: 'border-indigo-400/40',
        shockwave2: 'border-indigo-300/30',
        sparkle1: 'bg-indigo-400',
        sparkle2: 'bg-indigo-500',
        sparkle3: 'bg-indigo-300'
      }
    },
    { 
      path: '/materials', 
      label: 'Materials', 
      icon: Upload,
      colors: {
        primary: 'teal',
        activeBg: 'from-teal-100 via-teal-50 to-teal-100 text-teal-600 shadow-teal-200',
        active: 'from-teal-400 to-teal-600',
        iconBg: 'from-teal-500 to-teal-600 text-white',
        ripple: 'bg-teal-400/30',
        ripple2: 'bg-teal-500/20',
        ripple3: 'bg-teal-300/40',
        shockwave: 'border-teal-400/40',
        shockwave2: 'border-teal-300/30',
        sparkle1: 'bg-teal-400',
        sparkle2: 'bg-teal-500',
        sparkle3: 'bg-teal-300'
      }
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings,
      colors: {
        primary: 'gray',
        activeBg: 'from-gray-100 via-gray-50 to-gray-100 text-gray-600 shadow-gray-200',
        active: 'from-gray-400 to-gray-600',
        iconBg: 'from-gray-500 to-gray-600 text-white',
        ripple: 'bg-gray-400/30',
        ripple2: 'bg-gray-500/20',
        ripple3: 'bg-gray-300/40',
        shockwave: 'border-gray-400/40',
        shockwave2: 'border-gray-300/30',
        sparkle1: 'bg-gray-400',
        sparkle2: 'bg-gray-500',
        sparkle3: 'bg-gray-300'
      }
    }
  ];

  const createRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const path = button.getAttribute('href') || '';
    
    // Clear previous effects
    setRipples([]);
    setShockwaves([]);
    setActiveEffects(null);
    
    const newRipple = { id: Date.now(), x, y };
    const newShockwave = { id: Date.now() + 1, x, y, path };
    
    setRipples(prev => [...prev, newRipple]);
    setShockwaves(prev => [...prev, newShockwave]);
    setClickedItem(path);
    setActiveEffects(path);
    
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      setShockwaves(prev => prev.filter(wave => wave.id !== newShockwave.id));
    }, 600);
    
    setTimeout(() => {
      setClickedItem(null);
      setActiveEffects(null);
    }, 300);
  };

  return (
    <>
      {/* Compact Floating Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className="md:hidden fixed bottom-24 right-4 z-40 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group overflow-hidden animate-pulse hover:animate-none backdrop-blur-sm"
        title="Focus Mode"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Shield className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-sm font-medium relative z-10 whitespace-nowrap">Focus Mode</span>
        
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 z-50 shadow-2xl">
        {/* Glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ path, label, icon: Icon, colors }, index) => {
            const isActive = location.pathname === path;
            const isClicked = clickedItem === path;
            const hasActiveEffects = activeEffects === path;
            
            return (
              <Link
                key={path}
                to={path}
                onClick={createRipple}
                className={`
                  relative flex flex-col items-center gap-1 px-2 py-2 rounded-xl min-w-0 flex-1 overflow-hidden group
                  transition-all duration-300 ease-out transform select-none
                  ${isActive
                    ? `bg-gradient-to-br ${colors.activeBg} scale-105 z-10 shadow-lg`
                    : 'text-gray-600 dark:text-gray-400'
                  }
                  ${isClicked ? 'scale-110 brightness-125' : ''}
                  hover:bg-gray-50/80 dark:hover:bg-gray-800/40 active:scale-125
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Multiple Ripple Effects - Only show for active effects */}
                {hasActiveEffects && ripples.map(ripple => (
                  <div
                    key={ripple.id}
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: ripple.x - 15,
                      top: ripple.y - 15,
                    }}
                  >
                    {/* Primary ripple */}
                    <div className={`w-8 h-8 rounded-full ${colors.ripple} animate-ping opacity-75`}></div>
                    {/* Secondary ripple */}
                    <div className={`absolute inset-0 w-10 h-10 -left-1 -top-1 rounded-full ${colors.ripple2} animate-ping opacity-50`} style={{ animationDelay: '100ms' }}></div>
                    {/* Tertiary ripple */}
                    <div className={`absolute inset-0 w-12 h-12 -left-2 -top-2 rounded-full ${colors.ripple3} animate-ping opacity-30`} style={{ animationDelay: '200ms' }}></div>
                  </div>
                ))}

                {/* Shockwave Effects - Only show for active effects */}
                {hasActiveEffects && shockwaves.filter(wave => wave.path === path).map(wave => (
                  <div
                    key={wave.id}
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: wave.x - 25,
                      top: wave.y - 25,
                    }}
                  >
                    {/* Expanding shockwave */}
                    <div className={`w-12 h-12 rounded-full border-2 ${colors.shockwave} animate-ping opacity-60`}></div>
                    <div className={`absolute inset-0 w-16 h-16 -left-2 -top-2 rounded-full border ${colors.shockwave2} animate-ping opacity-40`} style={{ animationDelay: '150ms' }}></div>
                  </div>
                ))}

                {/* Active indicator */}
                {isActive && (
                  <>
                    <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r ${colors.active} rounded-full shadow-lg z-10`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.active} rounded-full animate-pulse opacity-75`}></div>
                    </div>
                  </>
                )}

                {/* Click burst effect - Only show for active effects */}
                {hasActiveEffects && isClicked && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className={`absolute inset-0 bg-gradient-radial ${colors.ripple} to-transparent rounded-xl animate-ping opacity-50`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.ripple2} to-transparent rounded-xl animate-pulse opacity-30`}></div>
                  </div>
                )}

                {/* Icon with enhanced animations */}
                <div className={`
                  relative flex items-center justify-center w-9 h-9 rounded-xl z-30
                  transition-all duration-300 transform
                  ${isActive 
                    ? `bg-gradient-to-br ${colors.iconBg} shadow-lg shadow-${colors.primary}-200/50` 
                    : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-700/50 group-hover:shadow-md'
                  }
                  ${isClicked ? 'scale-125 rotate-12 shadow-xl' : ''}
                  group-active:scale-150 group-active:rotate-180
                `}>
                  {/* Icon glow background */}
                  <div className={`
                    absolute inset-0 rounded-xl transition-all duration-300
                    ${isActive ? `${colors.ripple3} animate-pulse opacity-40` : ''}
                    ${hasActiveEffects && isClicked ? `bg-gradient-to-br ${colors.ripple} ${colors.ripple2} animate-ping opacity-60` : ''}
                  `}></div>
                  
                  <Icon 
                    className={`
                      w-5 h-5 transition-all duration-300 relative z-10
                      ${isActive ? 'scale-110 drop-shadow-lg filter brightness-110' : 'group-hover:scale-105'}
                      ${hasActiveEffects && isClicked ? 'scale-125 drop-shadow-xl filter brightness-125 hue-rotate-15' : ''}
                      group-active:scale-150
                    `}
                    style={{
                      color: isActive ? getColorValue(colors.primary) : undefined
                    }}
                  />
                  
                  {/* Sparkle effects on click - Only show for active effects */}
                  {hasActiveEffects && isClicked && (
                    <>
                      <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.sparkle1} rounded-full animate-ping opacity-80 z-40`}></div>
                      <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 ${colors.sparkle2} rounded-full animate-ping opacity-70 z-40`} style={{ animationDelay: '100ms' }}></div>
                      <div className={`absolute top-0 left-0 w-1 h-1 ${colors.sparkle3} rounded-full animate-ping opacity-60 z-40`} style={{ animationDelay: '200ms' }}></div>
                      <div className={`absolute top-1 right-0 w-1 h-1 ${colors.sparkle1} rounded-full animate-ping opacity-50 z-40`} style={{ animationDelay: '250ms' }}></div>
                    </>
                  )}
                </div>

                {/* Label with better typography */}
                <span className={`
                  text-xs font-medium truncate transition-all duration-300 relative z-20 max-w-full
                  ${isActive ? 'font-semibold text-shadow-sm drop-shadow-sm' : ''}
                  ${hasActiveEffects && isClicked ? 'font-bold scale-105 drop-shadow-md' : ''}
                  group-active:scale-110
                `}
                style={{
                  color: isActive ? getColorValue(colors.primary) : undefined
                }}>
                  {label}
                </span>

                {/* Enhanced shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700 ease-out pointer-events-none z-10"></div>
                <div className={`absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-active:translate-x-full transition-transform duration-400 ease-out pointer-events-none z-10`}></div>
                
                {/* Floating particles effect on active */}
                {isActive && (
                  <>
                    <div className={`absolute top-2 left-3 w-1 h-1 ${colors.sparkle1} rounded-full animate-bounce opacity-60`} style={{ animationDelay: '0s' }}></div>
                    <div className={`absolute top-4 right-2 w-0.5 h-0.5 ${colors.sparkle2} rounded-full animate-bounce opacity-50`} style={{ animationDelay: '0.5s' }}></div>
                    <div className={`absolute bottom-3 left-2 w-0.5 h-0.5 ${colors.sparkle3} rounded-full animate-bounce opacity-40`} style={{ animationDelay: '1s' }}></div>
                  </>
                )}
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
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
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
        
        @keyframes burst {
          0% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(180deg); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// Helper function to get color values
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'rgb(59 130 246)',
    emerald: 'rgb(16 185 129)',
    orange: 'rgb(249 115 22)',
    purple: 'rgb(168 85 247)',
    indigo: 'rgb(99 102 241)',
    teal: 'rgb(20 184 166)',
    gray: 'rgb(107 114 128)'
  };
  return colorMap[colorName] || 'rgb(107 114 128)';
};
