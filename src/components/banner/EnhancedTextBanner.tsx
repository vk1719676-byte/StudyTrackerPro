import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Brain, 
  MessageCircle, 
  BookOpen,
  Target,
  Play,
  Users,
  Star,
  ExternalLink,
  X,
  Bell,
  Sparkles
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const notices = [
    {
      id: 1,
      type: 'tutorial',
      title: 'Learn How To Use Study Tracker Pro',
      message: 'Master Study Tracker Pro - Complete Hindi Tutorial (8 min)',
      action: 'Watch Now On YouTube',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      icon: Play,
      color: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200',
      actionColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600',
      iconColor: 'text-blue-600 dark:text-blue-400',
      glowColor: 'shadow-blue-500/20 dark:shadow-blue-400/30',
      metric: '150+ views',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      type: 'telegram',
      title: 'Join Study Tracker Pro Telegram Channel',
      message: 'Connect with 250+ students on our official Telegram channel',
      action: 'Join Now',
      link: 'https://t.me/studytrackerpro',
      icon: Users,
      color: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-200',
      actionColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600',
      iconColor: 'text-green-600 dark:text-green-400',
      glowColor: 'shadow-green-500/20 dark:shadow-green-400/30',
      metric: '300+ members',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      type: 'premium',
      title: 'Join ITs TRMS telegram Channel',
      message: 'Access NEET, JEE & UPSC study materials and resources',
      action: 'Access Now',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      icon: Star,
      color: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-200',
      actionColor: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
      iconColor: 'text-amber-600 dark:text-amber-400',
      glowColor: 'shadow-amber-500/20 dark:shadow-amber-400/30',
      metric: '25K+ Members',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    }
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [notices.length, isPaused, isVisible]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const currentNoticeData = notices[currentNotice];
  const Icon = currentNoticeData.icon;

  if (!isVisible) return null;

  return (
    <div className="mb-6">
      {/* Main Notice Banner */}
      <div 
        className={`relative overflow-hidden ${currentNoticeData.color} border rounded-xl p-6 shadow-lg ${currentNoticeData.glowColor} transition-all duration-500 hover:shadow-xl backdrop-blur-sm`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        </div>

        {/* Corner Animations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
          {/* Top Left Corner */}
          <div className="absolute -top-2 -left-2 w-8 h-8 opacity-60">
            <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-full animate-ping" 
                 style={{ animationDelay: '0s', animationDuration: '3s' }} />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent rounded-full animate-ping" 
                 style={{ animationDelay: '1s', animationDuration: '3s' }} />
          </div>

          {/* Top Right Corner */}
          <div className="absolute -top-1 -right-1 w-6 h-6 opacity-40">
            <Sparkles className="w-full h-full text-current animate-pulse" 
                     style={{ animationDelay: '0.5s', animationDuration: '2s' }} />
          </div>

          {/* Bottom Left Corner */}
          <div className="absolute -bottom-1 -left-1 w-4 h-4 opacity-50">
            <div className="w-full h-full bg-gradient-to-tr from-white/25 to-transparent rounded-full animate-bounce" 
                 style={{ animationDelay: '2s', animationDuration: '4s' }} />
          </div>

          {/* Bottom Right Corner */}
          <div className="absolute -bottom-2 -right-2 w-7 h-7 opacity-30">
            <div className="w-full h-full bg-gradient-to-tl from-white/20 to-transparent rounded-full animate-spin" 
                 style={{ animationDuration: '8s' }} />
          </div>

          {/* Floating Particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-float" />
          <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 left-3/4 w-0.5 h-0.5 bg-white/50 rounded-full animate-float-slow" />

          {/* Mouse Follow Glow */}
          <div 
            className="absolute w-32 h-32 bg-white/5 dark:bg-white/10 rounded-full blur-xl transition-all duration-300 pointer-events-none"
            style={{
              left: mousePosition.x - 64,
              top: mousePosition.y - 64,
              opacity: isPaused ? 1 : 0
            }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 pr-12 relative z-10">
          {/* Icon */}
          <div className={`p-3 bg-white/80 dark:bg-white/10 rounded-xl shadow-sm flex-shrink-0 ${currentNoticeData.iconColor} backdrop-blur-sm border border-white/20 dark:border-white/10`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-base">{currentNoticeData.title}</h3>
              <span className="text-xs bg-white/70 dark:bg-white/10 px-3 py-1 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20">
                {currentNoticeData.metric}
              </span>
            </div>
            <p className="text-sm opacity-90 mb-4 leading-relaxed">
              {currentNoticeData.message}
            </p>
            
            {/* Action button */}
            <button
              onClick={currentNoticeData.onClick}
              className={`inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-lg hover:shadow-xl`}
            >
              <ExternalLink className="w-4 h-4" />
              {currentNoticeData.action}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 h-1 bg-black/5 dark:bg-white/5 w-full overflow-hidden rounded-b-xl">
            <div 
              className="h-full bg-current opacity-40 animate-progress"
              style={{
                background: `linear-gradient(90deg, transparent, currentColor, transparent)`,
                animation: 'progress 6s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-3 mt-4">
        {notices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentNotice(index)}
            className={`transition-all duration-300 rounded-full hover:scale-110 ${
              index === currentNotice 
                ? 'w-8 h-2.5 bg-gray-500 dark:bg-gray-400 shadow-sm' 
                : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Quick access bar */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full py-2 px-4 border border-gray-200/50 dark:border-gray-700/50">
        <Bell className="w-3.5 h-3.5 animate-pulse" />
        <span className="font-medium">Stay updated with our latest content and community updates</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-8px) rotate(90deg); opacity: 0.8; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-6px) scale(1.2); opacity: 0.7; }
        }
        
        .animate-progress {
          animation: progress 6s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};
