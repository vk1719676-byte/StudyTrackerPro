import React, { useState, useEffect } from 'react';
import { 
  Play,
  Users,
  Star,
  ExternalLink,
  X,
  Bell,
  GraduationCap,
  Heart
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const notices = [
    {
      id: 1,
      type: 'teachers-day',
      message: 'Teachers Day Special - Celebrating Our Mentors & Educators! Coming Soon',
      shortMessage: 'Teachers Day Special Coming Soon',
      action: 'Learn More',
      link: 'https://t.me/studytrackerpro',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      textColor: 'text-rose-900 dark:text-rose-100',
      actionColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      metric: 'Sept 5th',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 2,
      type: 'tutorial',
      message: 'Master Study Tracker Pro - Complete Hindi Tutorial (8 min)',
      shortMessage: 'Study Tracker Pro Complete Tutorial',
      action: 'Watch Now',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      icon: Play,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-900 dark:text-blue-100',
      actionColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      metric: '150+ views',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 3,
      type: 'telegram',
      message: 'Join Study Tracker Pro Telegram - Connect with 300+ students',
      shortMessage: 'Join Study Tracker Pro Telegram Community',
      action: 'Join Channel',
      link: 'https://t.me/studytrackerpro',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      textColor: 'text-green-900 dark:text-green-100',
      actionColor: 'bg-green-600 hover:bg-green-700 text-white',
      metric: '300+ members',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 4,
      type: 'premium',
      message: 'ITs TRMS Channel - NEET, JEE & UPSC study materials',
      shortMessage: 'Join ITs TRMS Channel For NEET, JEE & UPSC Materials',
      action: 'Access Now',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      icon: Star,
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      textColor: 'text-amber-900 dark:text-amber-100',
      actionColor: 'bg-amber-600 hover:bg-amber-700 text-white',
      metric: '25K+ members',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    }
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentNotice((prev) => (prev + 1) % notices.length);
        setIsAnimating(false);
      }, 150);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [notices.length, isPaused, isVisible]);

  const currentNoticeData = notices[currentNotice];
  const Icon = currentNoticeData.icon;

  if (!isVisible) return null;

  return (
    <div className="mb-4 relative">
      {/* Advanced Logo Header */}
      <div className="text-center mb-4 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-blue-400/10 rounded-2xl" />
        
        {/* Logo Container */}
        <div className="relative py-3 px-4">
          {/* Main Logo Text */}
          <div className="flex items-center justify-center gap-3 mb-1">
            {/* Logo Icon */}
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Study Tracker
              </h1>
              <span className="text-lg md:text-xl font-semibold text-purple-600 dark:text-purple-400 -mt-1">
                Pro
              </span>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Your Ultimate Study Management Solution
          </p>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-2 right-4 w-8 h-8 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full opacity-20 animate-pulse" />
        <div className="absolute bottom-2 left-4 w-6 h-6 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-full opacity-30 animate-pulse animation-delay-1000" />
      </div>

      {/* Compact Notice Banner */}
      <div 
        className={`relative overflow-hidden ${currentNoticeData.bgColor} border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group backdrop-blur-sm`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={currentNoticeData.onClick}
      >
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentNoticeData.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

        {/* Content Container - More Compact */}
        <div className={`${currentNoticeData.textColor} transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          
          {/* Desktop Layout - More Compact */}
          <div className="hidden md:flex items-center justify-between py-3 px-5">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Icon */}
              <div className="flex-shrink-0 p-1.5 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm border border-white/30 dark:border-white/20 group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-4 h-4" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium pr-3 group-hover:text-opacity-90 transition-colors duration-200">
                  {currentNoticeData.message}
                </p>
              </div>

              {/* Metric Badge */}
              <span className="text-xs bg-white/70 dark:bg-white/10 px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap">
                {currentNoticeData.metric}
              </span>
            </div>

            {/* Action Button - More Compact */}
            <div className="flex-shrink-0 ml-3">
              <button
                className={`inline-flex items-center gap-1.5 ${currentNoticeData.actionColor} text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <span>{currentNoticeData.action}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Mobile Layout - More Compact */}
          <div className="md:hidden p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="flex-shrink-0 p-1.5 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm border border-white/30 dark:border-white/20">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-medium leading-relaxed">
                  {currentNoticeData.shortMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5">
              <button
                className={`inline-flex items-center gap-1.5 ${currentNoticeData.actionColor} text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm flex-1`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <ExternalLink className="w-3 h-3" />
                <span>{currentNoticeData.action}</span>
              </button>

              <span className="text-xs bg-white/70 dark:bg-white/10 px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap flex-shrink-0">
                {currentNoticeData.metric}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute top-2 right-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 opacity-60 hover:opacity-100 z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-black/5 dark:bg-white/5 w-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${currentNoticeData.gradient} animate-progress`}
            />
          </div>
        )}
      </div>

      {/* Compact Navigation Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {notices.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentNotice(index);
                setIsAnimating(false);
              }, 150);
            }}
            className={`transition-all duration-300 rounded-full hover:scale-125 ${
              index === currentNotice 
                ? 'w-5 h-1.5 bg-gray-600 dark:bg-gray-400 shadow-sm' 
                : 'w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Compact Bottom Info */}
      <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Bell className="w-3 h-3 animate-pulse" />
        <span className="hidden sm:inline">Stay updated</span>
        <span className="sm:hidden">Updates</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-progress {
          animation: progress 5s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
};
