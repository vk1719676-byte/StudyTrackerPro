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
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const banners = [
    {
      id: 1,
      title: 'Master Study Tracker Pro',
      subtitle: '15-min Hindi Tutorial',
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      icon: Brain,
      action: 'Watch Now',
      metric: '12K+ Views',
      metricIcon: Play,
      badge: 'TRENDING',
      badgeColor: 'bg-red-500',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      title: 'Join Study Community',
      subtitle: 'Official Telegram Channel',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      icon: MessageCircle,
      action: 'Join Now',
      metric: '5K+ Members',
      metricIcon: Users,
      badge: 'ACTIVE',
      badgeColor: 'bg-green-500',
      link: 'https://t.me/studytrackerpro',
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      title: 'NEET JEE UPSC Content',
      subtitle: 'Premium Study Materials',
      gradient: 'from-orange-500 via-red-500 to-pink-600',
      icon: BookOpen,
      action: 'Access Now',
      metric: '1000+ Resources',
      metricIcon: Star,
      badge: 'PREMIUM',
      badgeColor: 'bg-yellow-500',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    },
    {
      id: 4,
      title: 'Study Techniques Hub',
      subtitle: 'Proven Learning Methods',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-600',
      icon: Target,
      action: 'Explore',
      metric: '95% Success',
      metricIcon: TrendingUp,
      badge: 'NEW',
      badgeColor: 'bg-blue-500',
      link: '#techniques',
      onClick: () => console.log('Navigate to techniques')
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const currentBannerData = banners[currentBanner];
  const Icon = currentBannerData.icon;
  const MetricIcon = currentBannerData.metricIcon;

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="mb-4">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentBannerData.gradient} transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.01] transform`}>
          
          {/* Animated background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-2xl border border-white/40 group-hover:border-white/60 transition-all duration-500"></div>
          
          {/* Trending badge */}
          <div className={`absolute top-3 left-3 ${currentBannerData.badgeColor} text-white text-xs font-black px-2 py-1 rounded-full animate-pulse shadow-lg`}>
            {currentBannerData.badge}
          </div>
          
          <div className="relative z-10 p-4">
            <div className="flex items-center justify-between gap-3">
              
              {/* Content section */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                
                {/* Icon with glow effect */}
                <div className="relative p-2.5 bg-white/25 backdrop-blur-sm rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                  <Icon className="relative w-5 h-5 text-white drop-shadow-lg" />
                </div>
                
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-white mb-0.5 truncate leading-tight">
                    {currentBannerData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-semibold mb-1.5 truncate">
                    {currentBannerData.subtitle}
                  </p>
                  
                  {/* Compact metric badge */}
                  <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white/95 text-xs font-bold">
                    <MetricIcon className="w-3 h-3" />
                    <span>{currentBannerData.metric}</span>
                  </div>
                </div>
              </div>

              {/* Action section */}
              <div className="flex items-center gap-2 flex-shrink-0">
                
                {/* Main CTA button with pulse effect */}
                <button 
                  onClick={currentBannerData.onClick}
                  className="group/btn relative overflow-hidden bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white font-bold px-3 py-2.5 rounded-xl border border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-105 transform shadow-lg"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  
                  <div className="relative flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span className="text-xs font-black">{currentBannerData.action}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                  </div>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 rounded-xl bg-white/10 animate-ping opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Compact navigation */}
                <div className="flex items-center gap-0.5">
                  <button 
                    onClick={prevBanner}
                    className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg transition-all duration-300 group/nav"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-white group-hover/nav:-translate-x-0.5 transition-transform duration-300" />
                  </button>
                  
                  <button 
                    onClick={nextBanner}
                    className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg transition-all duration-300 group/nav"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white group-hover/nav:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full overflow-hidden">
            {!isHovered && (
              <div 
                className="h-full bg-gradient-to-r from-white/90 via-white to-white/90 animate-progress shadow-sm"
                style={{
                  animation: 'progress 5s linear infinite'
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Compact navigation dots */}
        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 flex gap-1">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentBanner 
                  ? 'w-5 h-1.5 bg-gray-800 dark:bg-white shadow-md' 
                  : 'w-1.5 h-1.5 bg-gray-400 hover:bg-gray-600 hover:scale-125'
              }`}
            >
              {index === currentBanner && (
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Hover effect - Quick action hints */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
            Click to {currentBannerData.action.toLowerCase()} • {currentBannerData.metric}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        .animate-progress {
          animation: progress 5s linear infinite;
        }
      `}</style>
    </div>
  );
};
