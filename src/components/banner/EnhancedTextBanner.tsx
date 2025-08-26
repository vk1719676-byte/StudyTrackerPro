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
  Bell
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const notices = [
    {
      id: 1,
      type: 'tutorial',
      title: 'New Tutorial Available',
      message: 'Master Study Tracker Pro - Complete Hindi Tutorial (15 min)',
      action: 'Watch Now',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      icon: Play,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      actionColor: 'bg-blue-600 hover:bg-blue-700',
      iconColor: 'text-blue-600',
      metric: '12K+ views',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      type: 'community',
      title: 'Join Our Community',
      message: 'Connect with 5K+ students on our official Telegram channel',
      action: 'Join Now',
      link: 'https://t.me/studytrackerpro',
      icon: Users,
      color: 'bg-green-50 border-green-200 text-green-800',
      actionColor: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-green-600',
      metric: '5K+ members',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      type: 'premium',
      title: 'Premium Content',
      message: 'Access NEET, JEE & UPSC study materials and resources',
      action: 'Access Now',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      icon: Star,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      actionColor: 'bg-amber-600 hover:bg-amber-700',
      iconColor: 'text-amber-600',
      metric: '1000+ resources',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    },
    {
      id: 4,
      type: 'techniques',
      title: 'Study Techniques',
      message: 'Discover proven learning methods and productivity tips',
      action: 'Learn More',
      link: '#techniques',
      icon: Brain,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      actionColor: 'bg-purple-600 hover:bg-purple-700',
      iconColor: 'text-purple-600',
      metric: '95% success rate',
      onClick: () => console.log('Navigate to techniques')
    }
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [notices.length, isPaused, isVisible]);

  const currentNoticeData = notices[currentNotice];
  const Icon = currentNoticeData.icon;

  if (!isVisible) return null;

  return (
    <div className="mb-6">
      {/* Main Notice Banner */}
      <div 
        className={`relative ${currentNoticeData.color} border rounded-lg p-4 shadow-sm transition-all duration-500`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 p-1 hover:bg-black/10 rounded-full transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          {/* Icon */}
          <div className={`p-2 bg-white rounded-lg shadow-sm flex-shrink-0 ${currentNoticeData.iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{currentNoticeData.title}</h3>
              <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full font-medium">
                {currentNoticeData.metric}
              </span>
            </div>
            <p className="text-sm opacity-90 mb-3 leading-relaxed">
              {currentNoticeData.message}
            </p>
            
            {/* Action button */}
            <button
              onClick={currentNoticeData.onClick}
              className={`inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-sm`}
            >
              <ExternalLink className="w-4 h-4" />
              {currentNoticeData.action}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-black/10 w-full overflow-hidden rounded-b-lg">
            <div 
              className="h-full bg-current opacity-60 animate-progress"
              style={{
                animation: 'progress 6s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {notices.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentNotice(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentNotice 
                ? 'w-6 h-2 bg-gray-400' 
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Quick access bar */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
        <Bell className="w-3 h-3" />
        <span>Stay updated with our latest content and community updates</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 6s linear infinite;
        }
      `}</style>
    </div>
  );
};
