import React, { useState, useEffect } from 'react';
import { 
  Play,
  Users,
  Star,
  ExternalLink,
  X,
  Bell
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const notices = [
    {
      id: 1,
      type: 'tutorial',
      message: 'Master Study Tracker Pro - Complete Hindi Tutorial (8 min)',
      shortMessage: 'Study Tracker Pro Tutorial',
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
      id: 2,
      type: 'telegram',
      message: 'Join Study Tracker Pro Telegram - Connect with 300+ students',
      shortMessage: 'Join Telegram Community',
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
      id: 3,
      type: 'premium',
      message: 'ITs TRMS Channel - NEET, JEE & UPSC study materials',
      shortMessage: 'NEET, JEE & UPSC Materials',
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
    <div className="mb-6 relative">
      {/* Main Single-line Notice */}
      <div 
        className={`relative overflow-hidden ${currentNoticeData.bgColor} border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group backdrop-blur-sm`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={currentNoticeData.onClick}
      >
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentNoticeData.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Animated Border Glow */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentNoticeData.gradient} opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-300 -z-10`} />

        {/* Content Container - Responsive Layout */}
        <div className={`${currentNoticeData.textColor} transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between py-4 px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm border border-white/30 dark:border-white/20 group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-5 h-5" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium pr-4 group-hover:text-opacity-90 transition-colors duration-200">
                  {currentNoticeData.message}
                </p>
              </div>

              {/* Metric Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/70 dark:bg-white/10 px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap">
                  {currentNoticeData.metric}
                </span>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {/* Action Button */}
              <button
                className={`inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <span>{currentNoticeData.action}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden p-4">
            {/* Top Row - Icon, Message, Close */}
            <div className="flex items-start gap-3 mb-3">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-white/80 dark:bg-white/10 rounded-lg shadow-sm backdrop-blur-sm border border-white/30 dark:border-white/20">
                <Icon className="w-4 h-4" />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-medium leading-relaxed">
                  {currentNoticeData.shortMessage}
                </p>
              </div>
            </div>

            {/* Bottom Row - Action Button and Metric */}
            <div className="flex items-center justify-between gap-3">
              {/* Action Button */}
              <button
                className={`inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm flex-1`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{currentNoticeData.action}</span>
              </button>

              {/* Metric Badge */}
              <span className="text-xs bg-white/70 dark:bg-white/10 px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap flex-shrink-0">
                {currentNoticeData.metric}
              </span>
            </div>
          </div>

          {/* Close Button - Positioned for both layouts */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute top-3 right-3 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 opacity-60 hover:opacity-100 z-10"
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

      {/* Navigation Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
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
                ? 'w-6 h-2 bg-gray-600 dark:bg-gray-400 shadow-sm' 
                : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Subtle Bottom Info */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Bell className="w-3 h-3 animate-pulse" />
        <span className="hidden sm:inline">Stay connected • Updates every 5 seconds</span>
        <span className="sm:hidden">Stay connected</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        .animate-progress {
          animation: progress 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
