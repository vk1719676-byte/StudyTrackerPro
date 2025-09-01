import React, { useState, useEffect } from 'react';
import { X, Calendar, Heart, Sparkles, Users, ArrowRight, Gift, BookOpen, Lightbulb, Star, Trophy, Zap } from 'lucide-react';

interface TeachersDayPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const teacherQuotes = [
  {
    quote: "A teacher affects eternity; they can never tell where their influence stops.",
    author: "Henry Adams",
    icon: Sparkles
  },
  {
    quote: "The art of teaching is the art of assisting discovery.",
    author: "Mark Van Doren",
    icon: Lightbulb
  },
  {
    quote: "Teaching is the greatest act of optimism.",
    author: "Colleen Wilcox",
    icon: Star
  },
  {
    quote: "A good teacher can inspire hope, ignite imagination, and instill a love of learning.",
    author: "Brad Henry",
    icon: Trophy
  },
  {
    quote: "The best teachers are those who show you where to look but don't tell you what to see.",
    author: "Alexandra K. Trenfor",
    icon: BookOpen
  }
];

export const TeachersDayPopup: React.FC<TeachersDayPopupProps> = ({ isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quoteAnimating, setQuoteAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Show confetti after popup animation
      setTimeout(() => setShowConfetti(true), 1200);
    }
  }, [isOpen]);

  // Rotate quotes every 4 seconds
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setQuoteAnimating(true);
        setTimeout(() => {
          setCurrentQuoteIndex((prev) => (prev + 1) % teacherQuotes.length);
          setQuoteAnimating(false);
        }, 300);
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleTelegramJoin = () => {
    // Mark as joined in localStorage
    localStorage.setItem('teachersDayTelegramJoined', 'true');
    
    // Add visual feedback
    setShowConfetti(true);
    
    // Open Telegram link
    window.open('https://t.me/your_telegram_channel', '_blank');
    
    // Close popup after short delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  const currentQuote = teacherQuotes[currentQuoteIndex];
  const QuoteIcon = currentQuote.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop with depth */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70 backdrop-blur-md transition-all duration-700 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Enhanced Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `confettiFall ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 3}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['🎉', '✨', '🌟', '🎊', '💫', '🌈', '📚', '🍎', '🎓', '💝'][Math.floor(Math.random() * 10)]}
            </div>
          ))}
        </div>
      )}

      {/* 3D Popup with enhanced depth */}
      <div 
        className={`relative w-full max-w-lg mx-auto transform transition-all duration-1000 ease-out ${
          isAnimating 
            ? 'scale-100 translate-y-0 opacity-100 rotate-0' 
            : 'scale-50 -translate-y-20 opacity-0 rotate-6'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Enhanced 3D shadow layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-3xl blur-2xl transform translate-y-8 translate-x-4 scale-105"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl transform translate-y-4 translate-x-2 scale-102"></div>
        
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-orange-900/20 rounded-3xl shadow-2xl border border-rose-200/60 dark:border-rose-700/60 backdrop-blur-sm"
             style={{
               transform: 'translateZ(0)',
               boxShadow: `
                 0 0 0 1px rgba(255, 255, 255, 0.1),
                 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                 0 0 100px rgba(244, 63, 94, 0.15)
               `
             }}>
          
          {/* Enhanced animated background elements with 3D effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-rose-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"
              style={{
                transform: 'translateZ(-10px)',
                animation: 'float 6s ease-in-out infinite'
              }}
            ></div>
            <div 
              className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-br from-orange-300/25 to-rose-300/25 rounded-full blur-3xl animate-pulse" 
              style={{
                animationDelay: '2s',
                transform: 'translateZ(-20px)',
                animation: 'float 8s ease-in-out infinite reverse'
              }}
            ></div>
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-pink-200/15 to-rose-200/15 rounded-full blur-3xl animate-pulse" 
              style={{
                animationDelay: '4s',
                transform: 'translateZ(-30px) translate(-50%, -50%)',
                animation: 'rotate 20s linear infinite'
              }}
            ></div>
            
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full opacity-60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animation: `floatParticle ${4 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `translateZ(${Math.random() * 20 - 10}px)`
                }}
              />
            ))}
          </div>

          {/* 3D Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group transform hover:scale-110 hover:rotate-90"
            style={{
              transform: 'translateZ(20px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300" />
          </button>

          <div className="relative p-8 space-y-8" style={{ transform: 'translateZ(10px)' }}>
            {/* Enhanced Header with 3D icon */}
            <div className="text-center space-y-6">
              <div 
                className="inline-flex p-6 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500"
                style={{
                  transform: 'translateZ(30px) rotateY(-10deg) rotateX(5deg)',
                  boxShadow: `
                    0 25px 50px rgba(244, 63, 94, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `
                }}
              >
                <Heart className="w-12 h-12 text-white animate-pulse drop-shadow-lg" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Teachers' Day Special
                </h2>
                <div className="flex items-center justify-center gap-3 text-rose-600 dark:text-rose-400 font-bold text-lg">
                  <Calendar className="w-6 h-6" />
                  <span>September 5th</span>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Enhanced Motivational Quote Section with 3D effect */}
            <div 
              className="relative bg-gradient-to-br from-white/80 to-rose-50/80 dark:from-gray-800/80 dark:to-rose-900/20 rounded-3xl p-8 border border-rose-200/40 dark:border-rose-700/40 backdrop-blur-sm"
              style={{
                transform: 'translateZ(15px)',
                boxShadow: `
                  0 15px 35px rgba(244, 63, 94, 0.1),
                  0 5px 15px rgba(0, 0, 0, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.6)
                `
              }}
            >
              {/* Quote icon with 3D effect */}
              <div className="flex justify-center mb-6">
                <div 
                  className="p-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-500"
                  style={{
                    transform: 'translateZ(10px) rotateY(-5deg)',
                    boxShadow: '0 10px 25px rgba(244, 63, 94, 0.3)'
                  }}
                >
                  <QuoteIcon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Animated quote with fade transition */}
              <div 
                className={`text-center space-y-4 transition-all duration-500 ${
                  quoteAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                <blockquote className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed italic">
                  "{currentQuote.quote}"
                </blockquote>
                <cite className="text-sm font-bold text-rose-600 dark:text-rose-400 not-italic">
                  — {currentQuote.author}
                </cite>
              </div>
              
              {/* Quote navigation dots */}
              <div className="flex justify-center gap-2 mt-6">
                {teacherQuotes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuoteIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                      index === currentQuoteIndex
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-rose-300 dark:hover:bg-rose-600'
                    }`}
                    style={{
                      boxShadow: index === currentQuoteIndex ? '0 4px 15px rgba(244, 63, 94, 0.4)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Enhanced Special offer content with 3D cards */}
            <div className="space-y-6">
              <div 
                className="bg-gradient-to-br from-rose-100/90 to-pink-100/90 dark:from-rose-900/40 dark:to-pink-900/40 rounded-3xl p-8 border border-rose-200/60 dark:border-rose-700/60 backdrop-blur-sm"
                style={{
                  transform: 'translateZ(10px)',
                  boxShadow: `
                    0 20px 40px rgba(244, 63, 94, 0.1),
                    0 8px 16px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.7)
                  `
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="p-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-xl transform hover:scale-110 transition-all duration-500"
                    style={{
                      transform: 'translateZ(10px) rotateY(-10deg)',
                      boxShadow: '0 15px 30px rgba(244, 63, 94, 0.4)'
                    }}
                  >
                    <Gift className="w-8 h-8 text-white animate-bounce drop-shadow-lg" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 dark:text-gray-100 text-xl mb-3 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      Exclusive Community Access!
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      Join our premium Telegram community to celebrate Teachers' Day with exclusive offers, study resources, and direct access to expert educators!
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: BookOpen, text: "Premium study materials & resources", color: "from-blue-500 to-cyan-500" },
                    { icon: Gift, text: "Exclusive Teachers' Day discounts", color: "from-rose-500 to-pink-500" },
                    { icon: Users, text: "Direct access to expert teachers", color: "from-purple-500 to-indigo-500" },
                    { icon: Zap, text: "Interactive learning sessions", color: "from-orange-500 to-red-500" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-white/40 dark:border-gray-700/40 transform hover:scale-105 transition-all duration-300"
                      style={{
                        transform: 'translateZ(5px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                        animationDelay: `${index * 200}ms`
                      }}
                    >
                      <div 
                        className={`p-3 bg-gradient-to-r ${item.color} rounded-xl shadow-lg`}
                        style={{
                          transform: 'translateZ(8px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                        }}
                      >
                        <item.icon className="w-5 h-5 text-white drop-shadow" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons with 3D effects */}
            <div className="space-y-4">
              <button
                onClick={handleTelegramJoin}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-700 transform hover:scale-105 hover:-translate-y-1"
                style={{
                  transform: 'translateZ(20px)',
                  boxShadow: `
                    0 20px 40px rgba(59, 130, 246, 0.3),
                    0 8px 16px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `
                }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:animate-shine"></div>
                
                {/* Button content with 3D text effect */}
                <div className="relative flex items-center justify-center gap-4" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  <Users className="w-7 h-7 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                  <span className="text-xl">Join Our Community</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                </div>
                
                {/* Pulsing glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 animate-pulse"></div>
              </button>
              
              <button
                onClick={onClose}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                style={{
                  transform: 'translateZ(5px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}
              >
                Maybe Later
              </button>
            </div>

            {/* Enhanced countdown with 3D styling */}
            <div 
              className="relative bg-gradient-to-r from-amber-100/90 to-orange-100/90 dark:from-amber-900/40 dark:to-orange-900/40 rounded-3xl p-6 border border-amber-200/60 dark:border-amber-700/60 backdrop-blur-sm overflow-hidden"
              style={{
                transform: 'translateZ(8px)',
                boxShadow: `
                  0 15px 35px rgba(245, 158, 11, 0.15),
                  0 5px 15px rgba(0, 0, 0, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.6)
                `
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200/20 via-orange-200/20 to-amber-200/20 animate-pulse"></div>
              
              <div className="relative flex items-center justify-center gap-4 text-amber-700 dark:text-amber-400">
                <Calendar className="w-6 h-6 animate-pulse" />
                <span className="font-black text-xl tracking-wide" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                  Teachers' Day • September 5th
                </span>
                <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Celebration message */}
              <div className="text-center mt-4">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 opacity-90">
                  Honoring the heroes who shape our future ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes confettiFall {
          to {
            transform: translateY(100vh) rotate(720deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 1;
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(300%) skewX(-12deg);
          }
        }
      `}</style>
    </div>
  );
};
