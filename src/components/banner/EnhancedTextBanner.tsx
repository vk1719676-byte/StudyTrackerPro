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
  Zap
} from 'lucide-react';

export const CompactBanner: React.FC = () => {
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
      metricIcon: Zap,
      link: '#techniques',
      onClick: () => console.log('Navigate to techniques')
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const currentBannerData = banners[currentBanner];
  const Icon = currentBannerData.icon;
  const MetricIcon = currentBannerData.metricIcon;

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="mb-6">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentBannerData.gradient} transition-all duration-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform`}>
          
          {/* Animated background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Pulse ring effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse"></div>
          
          <div className="relative z-10 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              
              {/* Content section */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                
                {/* Icon */}
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 flex-shrink-0">
                  <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-white mb-1 truncate leading-tight">
                    {currentBannerData.title}
                  </h2>
                  <p className="text-sm text-white/90 font-semibold mb-2 truncate">
                    {currentBannerData.subtitle}
                  </p>
                  
                  {/* Metric badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs font-bold">
                    <MetricIcon className="w-3 h-3" />
                    <span>{currentBannerData.metric}</span>
                  </div>
                </div>
              </div>

              {/* Action section */}
              <div className="flex items-center gap-2 flex-shrink-0">
                
                {/* Main CTA button */}
                <button 
                  onClick={currentBannerData.onClick}
                  className="group/btn relative overflow-hidden bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-4 py-3 rounded-xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 transform shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span className="text-sm">{currentBannerData.action}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                {/* Navigation controls */}
                <div className="hidden sm:flex items-center gap-1">
                  <button 
                    onClick={prevBanner}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group/nav"
                  >
                    <ChevronLeft className="w-4 h-4 text-white group-hover/nav:-translate-x-0.5 transition-transform duration-300" />
                  </button>
                  
                  <button 
                    onClick={nextBanner}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group/nav"
                  >
                    <ChevronRight className="w-4 h-4 text-white group-hover/nav:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full overflow-hidden">
            {!isHovered && (
              <div 
                className="h-full bg-white/80 animate-progress"
                style={{
                  animation: 'progress 6s linear infinite'
                }}
              ></div>
            )}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentBanner 
                  ? 'w-6 h-2 bg-gray-800 dark:bg-white shadow-md' 
                  : 'w-2 h-2 bg-gray-400 hover:bg-gray-600 hover:scale-125'
              }`}
            >
              {index === currentBanner && (
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
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
