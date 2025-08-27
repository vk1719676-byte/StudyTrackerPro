import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Play,
  Users,
  Star,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const notices = [
    {
      id: 1,
      type: 'tutorial',
      title: 'Hindi Tutorial',
      message: 'Master Study Tracker Pro in 8 minutes',
      action: 'Watch',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      icon: Play,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white',
      metric: '150+ views',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      type: 'community',
      title: 'Telegram Channel',
      message: 'Connect with 300+ students',
      action: 'Join',
      link: 'https://t.me/studytrackerpro',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      textColor: 'text-white',
      metric: '300+ members',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      type: 'premium',
      title: 'ITs TRMS Channel',
      message: 'NEET, JEE & UPSC materials',
      action: 'Access',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      icon: Star,
      bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
      textColor: 'text-white',
      metric: '25K+ Members',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    }
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [notices.length, isPaused, isVisible]);

  const handlePrevious = () => {
    setCurrentNotice((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const handleNext = () => {
    setCurrentNotice((prev) => (prev + 1) % notices.length);
  };

  const currentNoticeData = notices[currentNotice];
  const Icon = currentNoticeData.icon;

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-sm mx-auto mb-6 relative">
      {/* Main Banner */}
      <div 
        className={`relative overflow-hidden ${currentNoticeData.bgColor} ${currentNoticeData.textColor} rounded-2xl shadow-lg transition-all duration-500`}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-200 z-20 touch-manipulation"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-200 z-20 touch-manipulation"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-200 z-20 touch-manipulation"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="px-12 py-6 text-center relative z-10">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="w-6 h-6" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-bold text-lg">{currentNoticeData.title}</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium backdrop-blur-sm">
                {currentNoticeData.metric}
              </span>
            </div>
            
            <p className="text-sm opacity-90 leading-relaxed">
              {currentNoticeData.message}
            </p>
            
            {/* Action button */}
            <button
              onClick={currentNoticeData.onClick}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm touch-manipulation min-h-[48px]"
            >
              <ExternalLink className="w-4 h-4" />
              {currentNoticeData.action}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
            <div 
              className="h-full bg-white/60 transition-all duration-[5000ms] ease-linear"
              style={{
                width: isPaused ? '0%' : '100%',
                transform: 'translateX(-100%)',
                animation: isPaused ? 'none' : 'slideProgress 5s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {notices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentNotice(index)}
            className={`transition-all duration-300 rounded-full touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ${
              index === currentNotice 
                ? 'w-8 h-3 bg-gray-600 dark:bg-gray-300' 
                : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 active:bg-gray-500 dark:active:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Compact info bar */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
          Stay updated • Swipe or tap to navigate
        </p>
      </div>

      <style jsx>{`
        @keyframes slideProgress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};
