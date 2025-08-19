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
        <span className="text-sm font-medium relative z-10 whitespace-nowrap">Enter Focus Mode</span>
        
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-around py-1">
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
                    ? `bg-gradient-to-br ${colors.activeBg} scale-105 z-10`
                    : 'text-gray-600 dark:text-gray-400'
                  }
                  ${isClicked ? 'scale-110 brightness-125' : ''}
                  hover:bg-gray-50/50 dark:hover:bg-gray-900/20 active:scale-125
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Multiple Ripple Effects - Only show for active effects */}
                {hasActiveEffects && ripples.map(ripple => (
                  <div
                    key={ripple.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: ripple.x - 15,
                      top: ripple.y - 15,
                    }}
                  >
                    {/* Primary ripple */}
                    <div className={`w-8 h-8 rounded-full ${colors.ripple} animate-ping`}></div>
                    {/* Secondary ripple */}
                    <div className={`absolute inset-0 w-8 h-8 rounded-full ${colors.ripple2} animate-ping`} style={{ animationDelay: '100ms' }}></div>
                    {/* Tertiary ripple */}
                    <div className={`absolute inset-0 w-8 h-8 rounded-full ${colors.ripple3} animate-ping`} style={{ animationDelay: '200ms' }}></div>
                  </div>
                ))}

                {/* Shockwave Effects - Only show for active effects */}
                {hasActiveEffects && shockwaves.filter(wave => wave.path === path).map(wave => (
                  <div
                    key={wave.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: wave.x - 25,
                      top: wave.y - 25,
                    }}
                  >
                    {/* Expanding shockwave */}
                    <div className={`w-12 h-12 rounded-full border-2 ${colors.shockwave} animate-ping`}></div>
                    <div className={`absolute inset-0 w-12 h-12 rounded-full border ${colors.shockwave2} animate-ping`} style={{ animationDelay: '150ms' }}></div>
                  </div>
                ))}

                {/* Active indicator */}
                {isActive && (
                  <>
                    <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r ${colors.active} rounded-full shadow-lg`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.active} rounded-full animate-pulse opacity-75`}></div>
                    </div>
                  </>
                )}

                {/* Click burst effect - Only show for active effects */}
                {hasActiveEffects && isClicked && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-radial ${colors.ripple} to-transparent rounded-xl animate-ping`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.ripple2} to-transparent rounded-xl animate-pulse`}></div>
                  </div>
                )}

                {/* Icon with enhanced animations */}
                <div className={`
                  relative flex items-center justify-center w-8 h-8 rounded-lg z-10
                  transition-all duration-300 transform
                  ${isActive 
                    ? `bg-gradient-to-br ${colors.iconBg} shadow-lg` 
                    : 'group-hover:bg-gray-100 dark:group-hover:bg-gray-700 group-hover:shadow-md'
                  }
                  ${isClicked ? 'scale-125 rotate-12 shadow-xl' : ''}
                  group-active:scale-150 group-active:rotate-180
                `}>
                  {/* Icon glow background */}
                  <div className={`
                    absolute inset-0 rounded-lg transition-all duration-300
                    ${isActive ? `${colors.ripple3} animate-pulse` : ''}
                    ${hasActiveEffects && isClicked ? `bg-gradient-to-br ${colors.ripple} ${colors.ripple2} animate-ping` : ''}
                  `}></div>
                  
                  <Icon 
                    className={`
                      w-5 h-5 transition-all duration-300 relative z-10
                      ${isActive ? 'scale-110 drop-shadow-lg filter brightness-110' : 'group-hover:scale-105'}
                      ${hasActiveEffects && isClicked ? 'scale-125 drop-shadow-xl filter brightness-125 hue-rotate-15' : ''}
                      group-active:scale-150
                    `}
                    style={{
                      color: isActive ? `rgb(${colors.primary.includes('blue') ? '59 130 246' : 
                                              colors.primary.includes('emerald') ? '16 185 129' :
                                              colors.primary.includes('orange') ? '249 115 22' :
                                              colors.primary.includes('purple') ? '168 85 247' :
                                              colors.primary.includes('indigo') ? '99 102 241' :
                                              colors.primary.includes('yellow') ? '245 158 11' :
                                              '107 114 128'})` : undefined
                    }}
                  />
                  
                  {/* Sparkle effects on click - Only show for active effects */}
                  {hasActiveEffects && isClicked && (
                    <>
                      <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.sparkle1} rounded-full animate-ping`}></div>
                      <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 ${colors.sparkle2} rounded-full animate-ping`} style={{ animationDelay: '100ms' }}></div>
                      <div className={`absolute top-0 left-0 w-1 h-1 ${colors.sparkle3} rounded-full animate-ping`} style={{ animationDelay: '200ms' }}></div>
                    </>
                  )}
                </div>

                {/* Label with better typography */}
                <span className={`
                  text-xs font-medium truncate transition-all duration-300 relative z-10
                  ${isActive ? 'font-semibold text-shadow-sm drop-shadow-sm' : ''}
                  ${hasActiveEffects && isClicked ? 'font-bold scale-105 drop-shadow-md' : ''}
                  group-active:scale-110
                `}
                style={{
                  color: isActive ? `rgb(${colors.primary.includes('blue') ? '59 130 246' : 
                                          colors.primary.includes('emerald') ? '16 185 129' :
                                          colors.primary.includes('orange') ? '249 115 22' :
                                          colors.primary.includes('purple') ? '168 85 247' :
                                          colors.primary.includes('indigo') ? '99 102 241' :
                                          colors.primary.includes('yellow') ? '245 158 11' :
                                          '107 114 128'})` : undefined
                }}>
                  {label}
                </span>

                {/* Enhanced shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-500 ease-out pointer-events-none"></div>
                <div className={`absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-active:translate-x-full transition-transform duration-300 ease-out pointer-events-none`}></div>
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
      `}</style>
    </>
  );
};
