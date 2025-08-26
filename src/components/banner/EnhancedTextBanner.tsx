import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Users, 
  Play, 
  MessageCircle, 
  BookOpen,
  Target,
  TrendingUp,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const EnhancedTextBanner: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const banners = [
    {
      id: 1,
      title: 'Master Study Tracker Pro',
      subtitle: 'Complete Tutorial in Hindi - Learn all features in 15 minutes',
      description: 'Discover advanced study techniques, time management, and productivity tips',
      gradient: 'from-blue-600 via-indigo-600 to-purple-700',
      bgPattern: 'from-blue-500/20 to-purple-500/20',
      icon: Brain,
      action: 'Watch Tutorial',
      secondaryAction: 'View Guide',
      link: 'https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX',
      engagement: { views: '12K+', rating: 4.9 },
      onClick: () => window.open('https://youtu.be/ne9YlsIMSrI?si=Lgrurjdlu0r0oPsX', '_blank')
    },
    {
      id: 2,
      title: 'Join Our Community',
      subtitle: 'Study Tracker Pro Official Telegram Channel',
      description: 'Get latest updates, study tips, and connect with fellow students',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      bgPattern: 'from-emerald-500/20 to-teal-500/20',
      icon: MessageCircle,
      action: 'Join Channel',
      secondaryAction: 'Learn More',
      link: 'https://t.me/studytrackerpro',
      engagement: { members: '5K+', activity: 'Very Active' },
      onClick: () => window.open('https://t.me/studytrackerpro', '_blank')
    },
    {
      id: 3,
      title: 'ITs TRMS Channel',
      subtitle: 'Premium NEET, JEE & UPSC Content',
      description: 'Access high-quality lectures, notes, and study materials',
      gradient: 'from-orange-600 via-red-600 to-pink-700',
      bgPattern: 'from-orange-500/20 to-red-500/20',
      icon: BookOpen,
      action: 'Join Now',
      secondaryAction: 'Preview',
      link: 'https://t.me/+_fkSUEqyukFiMjI1',
      engagement: { content: '1000+', subjects: '15+' },
      onClick: () => window.open('https://t.me/+_fkSUEqyukFiMjI1', '_blank')
    },
    {
      id: 4,
      title: 'Study Techniques Hub',
      subtitle: 'Evidence-based learning methods',
      description: 'Discover scientifically proven study techniques and memory boosters',
      gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
      bgPattern: 'from-violet-500/20 to-fuchsia-500/20',
      icon: Target,
      action: 'Explore Methods',
      secondaryAction: 'Quick Tips',
      link: '#study-techniques',
      engagement: { techniques: '25+', success: '95%' },
      onClick: () => console.log('Navigate to study techniques')
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [banners.length, isAutoPlay]);

  const currentBannerData = banners[currentBanner];
  const Icon = currentBannerData.icon;

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
    setIsAutoPlay(false);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    setIsAutoPlay(false);
  };

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
    setIsAutoPlay(false);
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative group">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentBannerData.gradient} transition-all duration-1000 shadow-2xl`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className={`absolute inset-0 bg-gradient-to-r ${currentBannerData.bgPattern}`}></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
              
              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  <div className="p-4 sm:p-5 bg-white/20 backdrop-blur-sm rounded-2xl flex-shrink-0 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">
                      {currentBannerData.title}
                    </h2>
                    <h3 className="text-lg sm:text-xl text-white/90 font-bold mb-3 leading-snug">
                      {currentBannerData.subtitle}
                    </h3>
                    <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed max-w-2xl">
                      {currentBannerData.description}
                    </p>
                  </div>
                </div>

                {/* Engagement metrics */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {Object.entries(currentBannerData.engagement).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-2 rounded-xl text-white/90 text-sm font-bold">
                      {key === 'views' && <Play className="w-4 h-4" />}
                      {key === 'rating' && <Star className="w-4 h-4 fill-current" />}
                      {key === 'members' && <Users className="w-4 h-4" />}
                      {key === 'activity' && <TrendingUp className="w-4 h-4" />}
                      {key === 'content' && <BookOpen className="w-4 h-4" />}
                      {key === 'subjects' && <Target className="w-4 h-4" />}
                      {key === 'techniques' && <Brain className="w-4 h-4" />}
                      {key === 'success' && <Star className="w-4 h-4 fill-current" />}
                      <span>{key}: {value}</span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button 
                    onClick={currentBannerData.onClick}
                    className="group/btn flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-6 py-4 rounded-2xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 transform shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>{currentBannerData.action}</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium px-5 py-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
                    {currentBannerData.secondaryAction}
                  </button>
                </div>
              </div>

              {/* Navigation section */}
              <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-6 flex-shrink-0">
                
                {/* Navigation controls */}
                <div className="flex lg:flex-col items-center gap-3">
                  <button 
                    onClick={prevBanner}
                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl transition-all duration-300 group/nav hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-white group-hover/nav:-translate-x-0.5 transition-transform duration-300" />
                  </button>
                  
                  <button 
                    onClick={nextBanner}
                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-2xl transition-all duration-300 group/nav hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-white group-hover/nav:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </div>

                {/* Navigation dots */}
                <div className="flex lg:flex-col gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToBanner(index)}
                      className={`relative transition-all duration-500 rounded-full ${
                        index === currentBanner 
                          ? 'w-3 h-8 lg:w-8 lg:h-3 bg-white shadow-lg scale-110' 
                          : 'w-2 h-2 lg:w-2 lg:h-2 bg-white/40 hover:bg-white/60 hover:scale-125'
                      }`}
                    >
                      {index === currentBanner && (
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Auto-play indicator */}
                <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-white/80 text-xs font-medium">
                    {isAutoPlay ? 'Auto' : 'Manual'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {isAutoPlay && (
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-white to-white/80 animate-progress"
                style={{
                  animation: 'progress 8s linear infinite'
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Quick action pills */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          {['Tutorial', 'Community', 'Resources'].map((item, index) => (
            <div key={item} className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {item}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
