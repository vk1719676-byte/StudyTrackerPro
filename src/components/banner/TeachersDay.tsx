import React, { useEffect, useState } from 'react';
import { Heart, Star, Users, ExternalLink } from 'lucide-react';

export const TeachersDayBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Initial fade in
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    
    // Animation phases for continuous movement
    const timer2 = setTimeout(() => setAnimationPhase(1), 1000);
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, []);

  const handleTelegramJoin = () => {
    window.open('https://t.me/studytrackerpro', '_blank');
  };

  return (
    <div className={`relative overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      {/* Main Banner Container */}
      <div className="relative mx-4 sm:mx-6 lg:mx-8 mb-8 sm:mb-12">
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 rounded-3xl sm:rounded-[2rem] lg:rounded-[3rem] shadow-2xl border border-white/20">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating hearts */}
            <div className="absolute top-4 left-4 sm:top-8 sm:left-8 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white/40 fill-white/20" />
            </div>
            <div className="absolute top-12 right-8 sm:top-16 sm:right-16 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
              <Star className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-300/60 fill-yellow-300/40" />
            </div>
            <div className="absolute bottom-6 left-12 sm:bottom-12 sm:left-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3s' }}>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white/30 fill-white/20" />
            </div>
            <div className="absolute bottom-8 right-4 sm:bottom-16 sm:right-8 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              <Star className="w-5 h-5 sm:w-7 sm:h-7 text-pink-300/50 fill-pink-300/30" />
            </div>

            {/* Gradient orbs */}
            <div className="absolute -top-20 -left-20 w-40 h-40 sm:w-60 sm:h-60 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 sm:w-80 sm:h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-pink-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 px-6 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
            <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8">
              
              {/* Animated Badge */}
              <div className={`inline-flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-4 py-2 sm:px-6 sm:py-3 transition-all duration-1000 ${animationPhase % 2 === 0 ? 'scale-100' : 'scale-105'}`}>
                <div className="relative">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
                  <div className="absolute inset-0 animate-ping">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                  </div>
                </div>
                <span className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                  Special Event
                </span>
              </div>

              {/* Main Animated Text */}
              <div className="space-y-2 sm:space-y-4">
                {/* Primary text with character animation */}
                <div className="overflow-hidden">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight">
                    {"Teacher's Day".split('').map((char, index) => (
                      <span
                        key={index}
                        className={`inline-block transition-all duration-700 ${
                          isVisible 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-full opacity-0'
                        }`}
                        style={{ 
                          transitionDelay: `${index * 100 + 500}ms`,
                          textShadow: '0 0 30px rgba(255,255,255,0.5)'
                        }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </h1>
                </div>

                {/* Secondary animated text */}
                <div className="overflow-hidden">
                  <div className={`bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`} style={{ transitionDelay: '1.5s' }}>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                      {"Coming Soon!".split('').map((char, index) => (
                        <span
                          key={index}
                          className={`inline-block animate-pulse`}
                          style={{ 
                            animationDelay: `${index * 150 + 2000}ms`,
                            animationDuration: '2s'
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </h2>
                  </div>
                </div>

                {/* Subtitle with typewriter effect */}
                <div className={`transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: '2.5s' }}>
                  <p className="text-white/90 text-base sm:text-lg md:text-xl font-semibold max-w-2xl mx-auto leading-relaxed px-4">
                    🎉 Celebrating the mentors who inspire, guide, and shape our future. 
                    <span className="block mt-2 text-yellow-200 font-bold">
                      Get ready for something special! ✨
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{ transitionDelay: '3s' }}>
                
                {/* Telegram Join Button */}
                <button
                  onClick={handleTelegramJoin}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-bold px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm sm:text-base font-bold">Join Our Community</div>
                      <div className="text-xs sm:text-sm text-blue-100">Connect on Telegram</div>
                    </div>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </button>

                {/* Learn More Button */}
                <button className="group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 hover:border-white/50 text-white font-bold px-6 py-4 sm:px-8 sm:py-5 rounded-2xl transition-all duration-500 transform hover:scale-105 w-full sm:w-auto">
                  <div className="relative flex items-center justify-center gap-3">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300 fill-pink-200/50 group-hover:animate-pulse" />
                    <div className="text-left">
                      <div className="text-sm sm:text-base font-bold">Learn More</div>
                      <div className="text-xs sm:text-sm text-white/80">About the Event</div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Floating Action Indicators */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                      animationPhase % 3 === dot 
                        ? 'bg-yellow-300 scale-125 shadow-lg shadow-yellow-300/50' 
                        : 'bg-white/40'
                    }`}
                    style={{ animationDelay: `${dot * 200}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom decorative wave */}
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div className="h-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Mobile-optimized notification bar */}
      <div className="block sm:hidden mx-4 mb-6">
        <div className="bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-lg text-orange-900 px-4 py-3 rounded-2xl shadow-lg border border-orange-300/50">
          <div className="flex items-center gap-3 text-center justify-center">
            <div className="animate-spin">
              <Star className="w-4 h-4 fill-orange-600" />
            </div>
            <span className="font-bold text-sm">
              💝 Special celebration coming your way! 
            </span>
            <div className="animate-pulse">
              ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
