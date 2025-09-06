import React, { useState, useEffect } from 'react';
import { 
  Play,
  Users,
  Star,
  ExternalLink,
  X,
  Bell,
  Heart,
  BookOpen,
  Award
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
      shortMessage: 'Study Tracker Pro Complete Tutorial',
      action: 'Watch Now',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      icon: Play,
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40',
      textColor: 'text-blue-900 dark:text-blue-100',
      actionColor: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl',
      metric: '250+ views',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      type: 'telegram',
      message: 'Join Study Tracker Pro Telegram - Connect with 400+ students',
      shortMessage: 'Join Study Tracker Pro Telegram Community',
      action: 'Join Channel',
      link: 'https://t.me/studytrackerpro',
      icon: Users,
      gradient: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-950/40 dark:to-green-950/40',
      textColor: 'text-emerald-900 dark:text-emerald-100',
      actionColor: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl',
      metric: '400+ members',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      type: 'premium',
      message: 'ITs TRMS Channel - NEET, JEE & UPSC study materials',
      shortMessage: 'Join ITs TRMS Channel For NEET, JEE & UPSC Materials',
      action: 'Access Now',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      icon: Star,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40',
      textColor: 'text-amber-900 dark:text-amber-100',
      actionColor: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl',
      metric: '25K+ members',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    },
    {
      id: 4,
      type: 'premium',
      message: 'For Better Experience Download Our Android App Now',
      shortMessage: 'Download Our Official Android App For Better Experience',
      action: 'Download App',
      link: 'https://apkfilelinkcreator.cloud/uploads/1754827794_9b05fddf.apk',
      icon: Star,
      gradient: 'from-teal-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-teal-50/80 to-green-50/80 dark:from-teal-950/40 dark:to-green-950/40',
      textColor: 'text-teal-900 dark:text-teal-100',
      actionColor: 'bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl',
      metric: '1200+ Users',
      onClick: () => window.open('https://apkfilelinkcreator.cloud/uploads/1754827794_9b05fddf.apk', '_blank')
    }
  ];

  useEffect(() => {
    if (isPaused || !isVisible) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentNotice((prev) => (prev + 1) % notices.length);
        setIsAnimating(false);
      }, 200);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [notices.length, isPaused, isVisible]);

  const currentNoticeData = notices[currentNotice];
  const Icon = currentNoticeData.icon;

  if (!isVisible) return null;

  return (
    <div className="mb-4 relative">
      {/* Enhanced Notice Banner */}
      <div 
        className={`relative overflow-hidden ${currentNoticeData.bgColor} border border-white/20 dark:border-white/10 shadow-lg rounded-2xl hover:shadow-2xl transition-all duration-500 cursor-pointer group backdrop-blur-xl`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={currentNoticeData.onClick}
      >
        {/* Enhanced Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentNoticeData.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-2 right-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <BookOpen className="w-5 h-5 animate-float" />
        </div>
        <div className="absolute bottom-2 left-16 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
          <Award className="w-4 h-4 animate-float-delayed" />
        </div>
        <div className="absolute top-1/2 right-24 opacity-15 group-hover:opacity-35 transition-opacity duration-600">
          <Heart className="w-3 h-3 animate-pulse" />
        </div>

        {/* Content Container */}
        <div className={`${currentNoticeData.textColor} transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between py-4 px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Enhanced Icon Container */}
              <div className="relative flex-shrink-0">
                <div className="p-2 bg-white/90 dark:bg-white/10 rounded-xl shadow-lg backdrop-blur-sm border border-white/40 dark:border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Message and Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold pr-3 group-hover:text-opacity-90 transition-colors duration-200 leading-relaxed">
                  {currentNoticeData.message}
                </p>
              </div>

              {/* Enhanced Metric Badge */}
              <div className="flex-shrink-0">
                <span className="text-xs bg-white/70 dark:bg-white/10 px-3 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap">
                  {currentNoticeData.metric}
                </span>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex-shrink-0 ml-4">
              <button
                className={`relative overflow-hidden inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group-hover:shadow-2xl transform-gpu`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <span className="relative z-10">{currentNoticeData.action}</span>
                <ExternalLink className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden p-4">
            <div className="flex items-start gap-3 mb-3">
              {/* Enhanced Mobile Icon */}
              <div className="relative flex-shrink-0">
                <div className="p-2 bg-white/90 dark:bg-white/10 rounded-xl shadow-lg backdrop-blur-sm border border-white/40 dark:border-white/20 group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-relaxed">
                  {currentNoticeData.shortMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                className={`relative overflow-hidden inline-flex items-center gap-2 ${currentNoticeData.actionColor} text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg flex-1`}
                onClick={(e) => {
                  e.stopPropagation();
                  currentNoticeData.onClick();
                }}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{currentNoticeData.action}</span>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] active:translate-x-[100%] transition-transform duration-500 ease-out" />
              </button>

              <div className="flex-shrink-0">
                <span className="text-xs bg-white/70 dark:bg-white/10 px-2.5 py-1.5 rounded-full font-semibold backdrop-blur-sm border border-white/30 dark:border-white/20 whitespace-nowrap">
                  {currentNoticeData.metric}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute top-3 right-3 p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110 opacity-50 hover:opacity-100 z-20 backdrop-blur-sm border border-white/20 dark:border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Enhanced Progress Bar with Gradient */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 h-1 bg-black/5 dark:bg-white/5 w-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${currentNoticeData.gradient} animate-progress shadow-sm`}
            />
          </div>
        )}
      </div>

      {/* Enhanced Navigation Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {notices.map((notice, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentNotice(index);
                setIsAnimating(false);
              }, 150);
            }}
            className={`relative transition-all duration-300 rounded-full hover:scale-125 group ${
              index === currentNotice 
                ? 'w-6 h-2 shadow-md' 
                : 'w-2 h-2 hover:w-3'
            }`}
          >
            <div className={`w-full h-full rounded-full transition-all duration-300 ${
              index === currentNotice 
                ? `bg-gradient-to-r ${notice.gradient} shadow-lg` 
                : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-500 dark:group-hover:bg-gray-500'
            }`} />
          </button>
        ))}
      </div>

      {/* Enhanced Bottom Info */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <Bell className="w-3.5 h-3.5 animate-pulse" />
        <span className="hidden sm:inline font-medium">Stay updated with latest announcements</span>
        <span className="sm:hidden font-medium">Latest updates</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
        
        .animate-progress {
          animation: progress 6s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <EnhancedTextBanner />
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Your main content goes here</p>
        </div>
      </div>
    </div>
  );
}

export default App;
