import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Target, Clock, Settings, FlipVertical as Analytics, Upload, Shield, Menu } from 'lucide-react';
import { FocusMode } from '../focus/FocusMode';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface ShockwaveEffect {
  id: number;
  x: number;
  y: number;
  path: string;
  intensity: number;
}

export const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const [showFocusMode, setShowFocusMode] = React.useState(false);
  const [ripples, setRipples] = React.useState<RippleEffect[]>([]);
  const [particles, setParticles] = React.useState<ParticleEffect[]>([]);
  const [clickedItem, setClickedItem] = React.useState<string | null>(null);
  const [shockwaves, setShockwaves] = React.useState<ShockwaveEffect[]>([]);
  const [activeEffects, setActiveEffects] = React.useState<string | null>(null);
  const [isAnimating, setIsAnimating] = React.useState<string | null>(null);
  const [pressStart, setPressStart] = React.useState<number>(0);
  const [longPress, setLongPress] = React.useState<string | null>(null);

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      colors: {
        primary: 'blue',
        activeBg: 'from-blue-50 via-blue-100/80 to-blue-50 text-blue-700 shadow-blue-300/60',
        active: 'from-blue-400 via-blue-500 to-blue-600',
        iconBg: 'from-blue-500 via-blue-600 to-blue-700 text-white',
        ripple: 'bg-blue-400/40',
        ripple2: 'bg-blue-500/30',
        ripple3: 'bg-blue-300/50',
        shockwave: 'border-blue-400/60',
        shockwave2: 'border-blue-300/40',
        particle1: 'bg-blue-400',
        particle2: 'bg-blue-500',
        particle3: 'bg-blue-300',
        glow: 'shadow-blue-400/50'
      }
    },
    { 
      path: '/exams', 
      label: 'Exams', 
      icon: Calendar,
      colors: {
        primary: 'emerald',
        activeBg: 'from-emerald-50 via-emerald-100/80 to-emerald-50 text-emerald-700 shadow-emerald-300/60',
        active: 'from-emerald-400 via-emerald-500 to-emerald-600',
        iconBg: 'from-emerald-500 via-emerald-600 to-emerald-700 text-white',
        ripple: 'bg-emerald-400/40',
        ripple2: 'bg-emerald-500/30',
        ripple3: 'bg-emerald-300/50',
        shockwave: 'border-emerald-400/60',
        shockwave2: 'border-emerald-300/40',
        particle1: 'bg-emerald-400',
        particle2: 'bg-emerald-500',
        particle3: 'bg-emerald-300',
        glow: 'shadow-emerald-400/50'
      }
    },
    { 
      path: '/goals', 
      label: 'Goals', 
      icon: Target,
      colors: {
        primary: 'orange',
        activeBg: 'from-orange-50 via-orange-100/80 to-orange-50 text-orange-700 shadow-orange-300/60',
        active: 'from-orange-400 via-orange-500 to-orange-600',
        iconBg: 'from-orange-500 via-orange-600 to-orange-700 text-white',
        ripple: 'bg-orange-400/40',
        ripple2: 'bg-orange-500/30',
        ripple3: 'bg-orange-300/50',
        shockwave: 'border-orange-400/60',
        shockwave2: 'border-orange-300/40',
        particle1: 'bg-orange-400',
        particle2: 'bg-orange-500',
        particle3: 'bg-orange-300',
        glow: 'shadow-orange-400/50'
      }
    },
    { 
      path: '/sessions', 
      label: 'Sessions', 
      icon: Clock,
      colors: {
        primary: 'purple',
        activeBg: 'from-purple-50 via-purple-100/80 to-purple-50 text-purple-700 shadow-purple-300/60',
        active: 'from-purple-400 via-purple-500 to-purple-600',
        iconBg: 'from-purple-500 via-purple-600 to-purple-700 text-white',
        ripple: 'bg-purple-400/40',
        ripple2: 'bg-purple-500/30',
        ripple3: 'bg-purple-300/50',
        shockwave: 'border-purple-400/60',
        shockwave2: 'border-purple-300/40',
        particle1: 'bg-purple-400',
        particle2: 'bg-purple-500',
        particle3: 'bg-purple-300',
        glow: 'shadow-purple-400/50'
      }
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: Analytics,
      colors: {
        primary: 'indigo',
        activeBg: 'from-indigo-50 via-indigo-100/80 to-indigo-50 text-indigo-700 shadow-indigo-300/60',
        active: 'from-indigo-400 via-indigo-500 to-indigo-600',
        iconBg: 'from-indigo-500 via-indigo-600 to-indigo-700 text-white',
        ripple: 'bg-indigo-400/40',
        ripple2: 'bg-indigo-500/30',
        ripple3: 'bg-indigo-300/50',
        shockwave: 'border-indigo-400/60',
        shockwave2: 'border-indigo-300/40',
        particle1: 'bg-indigo-400',
        particle2: 'bg-indigo-500',
        particle3: 'bg-indigo-300',
        glow: 'shadow-indigo-400/50'
      }
    },
    { 
      path: '/materials', 
      label: 'Materials', 
      icon: Upload,
      colors: {
        primary: 'teal',
        activeBg: 'from-teal-50 via-teal-100/80 to-teal-50 text-teal-700 shadow-teal-300/60',
        active: 'from-teal-400 via-teal-500 to-teal-600',
        iconBg: 'from-teal-500 via-teal-600 to-teal-700 text-white',
        ripple: 'bg-teal-400/40',
        ripple2: 'bg-teal-500/30',
        ripple3: 'bg-teal-300/50',
        shockwave: 'border-teal-400/60',
        shockwave2: 'border-teal-300/40',
        particle1: 'bg-teal-400',
        particle2: 'bg-teal-500',
        particle3: 'bg-teal-300',
        glow: 'shadow-teal-400/50'
      }
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings,
      colors: {
        primary: 'slate',
        activeBg: 'from-slate-50 via-slate-100/80 to-slate-50 text-slate-700 shadow-slate-300/60',
        active: 'from-slate-400 via-slate-500 to-slate-600',
        iconBg: 'from-slate-500 via-slate-600 to-slate-700 text-white',
        ripple: 'bg-slate-400/40',
        ripple2: 'bg-slate-500/30',
        ripple3: 'bg-slate-300/50',
        shockwave: 'border-slate-400/60',
        shockwave2: 'border-slate-300/40',
        particle1: 'bg-slate-400',
        particle2: 'bg-slate-500',
        particle3: 'bg-slate-300',
        glow: 'shadow-slate-400/50'
      }
    }
  ];

  // Advanced haptic feedback patterns
  const triggerHapticFeedback = (pattern: 'light' | 'medium' | 'heavy' | 'success') => {
    if (!navigator.vibrate) return;
    
    switch (pattern) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate([20, 10, 20]);
        break;
      case 'heavy':
        navigator.vibrate([30, 20, 30, 20, 30]);
        break;
      case 'success':
        navigator.vibrate([15, 10, 15, 10, 25]);
        break;
    }
  };

  // Enhanced particle system
  const createParticleExplosion = (x: number, y: number, colors: any) => {
    const newParticles: ParticleEffect[] = [];
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 2 + Math.random() * 3;
      const colorOptions = [colors.particle1, colors.particle2, colors.particle3];
      
      newParticles.push({
        id: Date.now() + i,
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)]
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Animate particles
    let animationId: number;
    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vx: particle.vx * 0.98,
          vy: particle.vy * 0.98 + 0.1,
          life: particle.life - 0.02
        })).filter(particle => particle.life > 0)
      );
      
      if (particles.length > 0) {
        animationId = requestAnimationFrame(animateParticles);
      }
    };
    
    animationId = requestAnimationFrame(animateParticles);
    
    setTimeout(() => {
      cancelAnimationFrame(animationId);
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  };

  // Enhanced click handler with multi-layered effects
  const createAdvancedRipple = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const path = button.getAttribute('href') || '';
    const navItem = navItems.find(item => item.path === path);
    
    if (!navItem) return;
    
    // Clear previous effects immediately
    setRipples([]);
    setShockwaves([]);
    setParticles([]);
    setActiveEffects(null);
    setIsAnimating(null);
    
    // Set new effects
    setClickedItem(path);
    setActiveEffects(path);
    setIsAnimating(path);
    
    // Create multiple ripple layers with different timing
    const rippleEffects: RippleEffect[] = [
      { id: Date.now(), x, y, scale: 1, opacity: 0.8 },
      { id: Date.now() + 1, x, y, scale: 1.5, opacity: 0.6 },
      { id: Date.now() + 2, x, y, scale: 2, opacity: 0.4 }
    ];
    
    setRipples(rippleEffects);
    
    // Create enhanced shockwaves
    const shockwaveEffects: ShockwaveEffect[] = [
      { id: Date.now() + 3, x, y, path, intensity: 1 },
      { id: Date.now() + 4, x, y, path, intensity: 0.7 }
    ];
    
    setShockwaves(shockwaveEffects);
    
    // Create particle explosion
    createParticleExplosion(x, y, navItem.colors);
    
    // Enhanced haptic feedback
    triggerHapticFeedback('success');
    
    // Staggered cleanup
    setTimeout(() => setRipples([]), 800);
    setTimeout(() => setShockwaves([]), 900);
    setTimeout(() => setClickedItem(null), 400);
    setTimeout(() => {
      setActiveEffects(null);
      setIsAnimating(null);
    }, 600);
  };

  // Long press handlers for additional interactions
  const handleTouchStart = (path: string) => {
    setPressStart(Date.now());
    const timeout = setTimeout(() => {
      setLongPress(path);
      triggerHapticFeedback('medium');
    }, 500);
    
    return timeout;
  };

  const handleTouchEnd = (timeout: NodeJS.Timeout) => {
    clearTimeout(timeout);
    setPressStart(0);
    setTimeout(() => setLongPress(null), 200);
  };

  return (
    <>
      {/* Enhanced Focus Mode Button */}
      <button
        onClick={() => setShowFocusMode(true)}
        className="md:hidden fixed bottom-24 right-4 z-40 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-110 active:scale-95 flex items-center gap-3 group overflow-hidden backdrop-blur-lg border border-white/20"
        title="Focus Mode"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl"></div>
        <Shield className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-500" />
        <span className="text-sm font-semibold relative z-10 whitespace-nowrap tracking-wide">Focus Mode</span>
        
        <div className="absolute -inset-2 rounded-2xl border border-purple-300/30 animate-pulse opacity-60"></div>
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-400/20 to-indigo-500/20 animate-pulse"></div>
      </button>

      <FocusMode isOpen={showFocusMode} onClose={() => setShowFocusMode(false)} />

      {/* Ultra-Enhanced Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-2xl border-t border-gray-200/80 dark:border-gray-700/80 z-50 shadow-2xl">
        {/* Dynamic top glow */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
        </div>
        
        <div className="flex items-center justify-around py-2 px-1 relative">
          {navItems.map(({ path, label, icon: Icon, colors }, index) => {
            const isActive = location.pathname === path;
            const isClicked = clickedItem === path;
            const hasActiveEffects = activeEffects === path;
            const isAnimatingNow = isAnimating === path;
            const isLongPressed = longPress === path;
            
            return (
              <Link
                key={path}
                to={path}
                onClick={createAdvancedRipple}
                onTouchStart={(e) => {
                  const timeout = handleTouchStart(path);
                  e.currentTarget.dataset.timeout = timeout.toString();
                }}
                onTouchEnd={(e) => {
                  const timeout = e.currentTarget.dataset.timeout;
                  if (timeout) handleTouchEnd(timeout as any);
                }}
                className={`
                  relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-2xl min-w-0 flex-1 overflow-hidden group
                  transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform select-none
                  ${isActive
                    ? `bg-gradient-to-br ${colors.activeBg} scale-110 z-20 ${colors.glow} shadow-xl`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/60 dark:hover:bg-gray-800/40'
                  }
                  ${isClicked ? 'scale-125 brightness-125 saturate-150' : ''}
                  ${isLongPressed ? 'scale-105 brightness-110' : ''}
                  active:scale-150 hover:scale-105
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transformOrigin: 'center'
                }}
              >
                {/* Advanced Multi-Layer Ripples */}
                {hasActiveEffects && ripples.map((ripple, idx) => (
                  <div
                    key={ripple.id}
                    className="absolute pointer-events-none z-30"
                    style={{
                      left: ripple.x - (20 * ripple.scale),
                      top: ripple.y - (20 * ripple.scale),
                    }}
                  >
                    <div 
                      className={`rounded-full ${colors.ripple} animate-ping`}
                      style={{
                        width: `${40 * ripple.scale}px`,
                        height: `${40 * ripple.scale}px`,
                        opacity: ripple.opacity,
                        animationDelay: `${idx * 150}ms`,
                        animationDuration: '0.8s'
                      }}
                    ></div>
                  </div>
                ))}

                {/* Dynamic Particle Effects */}
                {particles.filter(p => hasActiveEffects).map(particle => (
                  <div
                    key={particle.id}
                    className={`absolute w-1.5 h-1.5 rounded-full ${particle.color} pointer-events-none z-25`}
                    style={{
                      left: particle.x,
                      top: particle.y,
                      opacity: particle.life,
                      transform: `scale(${particle.life})`
                    }}
                  ></div>
                ))}

                {/* Enhanced Shockwaves */}
                {hasActiveEffects && shockwaves.filter(wave => wave.path === path).map((wave, idx) => (
                  <div
                    key={wave.id}
                    className="absolute pointer-events-none z-25"
                    style={{
                      left: wave.x - 30,
                      top: wave.y - 30,
                    }}
                  >
                    <div 
                      className={`w-16 h-16 rounded-full border-2 ${colors.shockwave} animate-ping`}
                      style={{
                        opacity: wave.intensity * 0.8,
                        animationDelay: `${idx * 200}ms`,
                        animationDuration: '1s'
                      }}
                    ></div>
                    <div 
                      className={`absolute inset-0 w-20 h-20 -left-2 -top-2 rounded-full border ${colors.shockwave2} animate-ping`}
                      style={{
                        opacity: wave.intensity * 0.5,
                        animationDelay: `${idx * 200 + 300}ms`,
                        animationDuration: '1.2s'
                      }}
                    ></div>
                  </div>
                ))}

                {/* Enhanced Active Indicator */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                    <div className={`w-10 h-1.5 bg-gradient-to-r ${colors.active} rounded-full shadow-lg`}>
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.active} rounded-full animate-pulse opacity-90`}></div>
                      <div className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-60"></div>
                    </div>
                  </div>
                )}

                {/* Multi-layer background effects */}
                {hasActiveEffects && isClicked && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-radial ${colors.ripple} to-transparent rounded-2xl animate-ping opacity-60`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.ripple2} to-transparent rounded-2xl animate-pulse opacity-40`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.ripple3} to-transparent rounded-2xl animate-ping opacity-30`} style={{ animationDelay: '200ms' }}></div>
                  </>
                )}

                {/* Advanced Icon Container */}
                <div className={`
                  relative flex items-center justify-center w-11 h-11 rounded-2xl z-40
                  transition-all duration-500 transform
                  ${isActive 
                    ? `bg-gradient-to-br ${colors.iconBg} ${colors.glow} shadow-2xl` 
                    : 'group-hover:bg-gray-100/80 dark:group-hover:bg-gray-700/60 group-hover:shadow-lg'
                  }
                  ${isClicked ? 'scale-130 rotate-12 shadow-2xl brightness-125' : ''}
                  ${isLongPressed ? 'scale-115 rotate-6' : ''}
                  group-active:scale-160 group-active:rotate-180
                `}>
                  
                  {/* Icon background glow layers */}
                  <div className={`
                    absolute inset-0 rounded-2xl transition-all duration-500
                    ${isActive ? `${colors.ripple3} animate-pulse opacity-50` : ''}
                    ${hasActiveEffects && isClicked ? `bg-gradient-to-br ${colors.ripple} ${colors.ripple2} animate-ping opacity-70` : ''}
                  `}></div>
                  
                  {/* Additional glow for active state */}
                  {isActive && (
                    <div className={`absolute -inset-1 rounded-2xl ${colors.ripple} opacity-30 animate-pulse`}></div>
                  )}
                  
                  <Icon 
                    className={`
                      w-6 h-6 transition-all duration-500 relative z-10
                      ${isActive ? 'scale-110 drop-shadow-2xl filter brightness-110 contrast-110' : 'group-hover:scale-110'}
                      ${hasActiveEffects && isClicked ? 'scale-140 drop-shadow-2xl filter brightness-150 hue-rotate-15 saturate-150' : ''}
                      ${isLongPressed ? 'scale-120 filter brightness-125' : ''}
                      group-active:scale-170
                    `}
                    style={{
                      color: isActive ? getColorValue(colors.primary) : undefined,
                      filter: isClicked ? 'drop-shadow(0 0 8px currentColor)' : undefined
                    }}
                  />
                  
                  {/* Enhanced sparkle constellation */}
                  {hasActiveEffects && isClicked && (
                    <div className="absolute inset-0 z-50">
                      <div className={`absolute -top-2 -right-2 w-2.5 h-2.5 ${colors.particle1} rounded-full animate-ping opacity-90`}></div>
                      <div className={`absolute -bottom-2 -left-2 w-2 h-2 ${colors.particle2} rounded-full animate-ping opacity-80`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`absolute -top-1 left-0 w-1.5 h-1.5 ${colors.particle3} rounded-full animate-ping opacity-70`} style={{ animationDelay: '300ms' }}></div>
                      <div className={`absolute top-0 -right-1 w-1.5 h-1.5 ${colors.particle1} rounded-full animate-ping opacity-60`} style={{ animationDelay: '450ms' }}></div>
                      <div className={`absolute bottom-0 left-1 w-1 h-1 ${colors.particle2} rounded-full animate-ping opacity-50`} style={{ animationDelay: '600ms' }}></div>
                    </div>
                  )}
                  
                  {/* Long press indicator ring */}
                  {isLongPressed && (
                    <div className={`absolute -inset-2 rounded-2xl border-2 ${colors.shockwave} animate-pulse`}></div>
                  )}
                </div>

                {/* Enhanced Label */}
                <span className={`
                  text-xs font-medium truncate transition-all duration-500 relative z-30 max-w-full
                  ${isActive ? 'font-bold text-shadow-lg drop-shadow-lg tracking-wide' : ''}
                  ${hasActiveEffects && isClicked ? 'font-extrabold scale-110 drop-shadow-2xl tracking-wider' : ''}
                  ${isLongPressed ? 'font-semibold scale-105' : ''}
                  group-active:scale-125
                `}
                style={{
                  color: isActive ? getColorValue(colors.primary) : undefined,
                  textShadow: isActive ? `0 0 10px ${getColorValue(colors.primary)}40` : undefined
                }}>
                  {label}
                </span>

                {/* Advanced shine animations */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-120%] transition-transform duration-1000 ease-out pointer-events-none z-10"></div>
                <div className={`absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-active:translate-x-120% transition-transform duration-600 ease-out pointer-events-none z-10`}></div>
                
                {/* Floating ambient particles for active state */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    <div className={`absolute top-1 left-2 w-1.5 h-1.5 ${colors.particle1} rounded-full animate-float opacity-70`} style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                    <div className={`absolute top-3 right-1 w-1 h-1 ${colors.particle2} rounded-full animate-float opacity-60`} style={{ animationDelay: '1s', animationDuration: '2.5s' }}></div>
                    <div className={`absolute bottom-2 left-1 w-1 h-1 ${colors.particle3} rounded-full animate-float opacity-50`} style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
                    <div className={`absolute bottom-3 right-2 w-0.5 h-0.5 ${colors.particle1} rounded-full animate-float opacity-40`} style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Enhanced safe area */}
        <div className="h-safe-area-inset-bottom bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50"></div>
      </nav>

      <style jsx>{`
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-6px) rotate(180deg); 
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes burst {
          0% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(2) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        @keyframes morphic-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.6);
            transform: scale(1.05);
          }
        }
        
        .animate-morphic-glow {
          animation: morphic-glow 2s ease-in-out infinite;
        }
        
        @keyframes particle-drift {
          0% { 
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          10% { 
            opacity: 1;
          }
          90% { 
            opacity: 1;
          }
          100% { 
            transform: translate(var(--drift-x, 20px), var(--drift-y, -20px)) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-particle-drift {
          animation: particle-drift 2s ease-out infinite;
        }
      `}</style>
    </>
  );
};

// Enhanced color mapping with more sophisticated values
const getColorValue = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'rgb(59 130 246)',
    emerald: 'rgb(16 185 129)',
    orange: 'rgb(249 115 22)',
    purple: 'rgb(168 85 247)',
    indigo: 'rgb(99 102 241)',
    teal: 'rgb(20 184 166)',
    slate: 'rgb(100 116 139)'
  };
  return colorMap[colorName] || 'rgb(100 116 139)';
};
