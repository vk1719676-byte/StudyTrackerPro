import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Clock, Target, TrendingUp, Users, Trophy, Star, Zap, Brain, CheckCircle, Sparkles } from 'lucide-react';

interface SplashProps {
  onGetStarted: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onGetStarted }) => {
  const [mounted, setMounted] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    {
      icon: Clock,
      title: 'Smart Tracking',
      description: 'AI-powered time management',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Goal Setting',
      description: 'Achieve your study targets',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Deep insights & progress',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Personalized recommendations',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const stats = [
    { icon: Users, value: '15K+', label: 'Students', color: 'text-blue-500' },
    { icon: Trophy, value: '12K+', label: 'Exams', color: 'text-green-500' },
    { icon: Star, value: '4.9', label: 'Rating', color: 'text-yellow-500' },
    { icon: Zap, value: '200K+', label: 'Hours', color: 'text-purple-500' }
  ];

  useEffect(() => {
    setMounted(true);
    
    const featureRotation = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(featureRotation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-float-slow"
          style={{
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`
          }}
        />
        <div 
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-float-medium"
          style={{
            transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * 15}px, 0) rotateX(${mousePosition.y * -8}deg) rotateY(${mousePosition.x * -8}deg)`
          }}
        />
        <div 
          className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-float-fast"
          style={{
            transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * -20}px, 0) rotateX(${mousePosition.y * 12}deg) rotateY(${mousePosition.x * 12}deg)`
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Logo Section */}
        <div 
          className={`mb-8 transform transition-all duration-1500 ${mounted ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-20 opacity-0 scale-95'}`}
          style={{
            transform: `${mounted ? 'translate-y-0 scale-100' : '-translate-y-20 scale-95'} perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
          }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform-gpu hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30 animate-pulse" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Study Tracker Pro
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300">Powered by AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero */}
        <div 
          className={`text-center mb-8 max-w-2xl transform transition-all duration-1500 delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          style={{
            transform: `${mounted ? 'translate-y-0' : 'translate-y-20'} perspective(1000px) rotateX(${mousePosition.y * 1}deg)`
          }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">
              Study Smarter
            </span>
            <br />
            <span className="text-white text-3xl md:text-5xl">
              Achieve More! 🚀
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            AI-powered study tracking with 3D analytics and personalized insights
          </p>
        </div>

        {/* 3D Stats Cards */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transform transition-all duration-1500 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group perspective-1000"
                style={{
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-2 hover:shadow-2xl group-hover:shadow-purple-500/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Feature Carousel */}
        <div 
          className={`mb-8 transform transition-all duration-1500 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
          style={{
            transform: `${mounted ? 'translate-y-0' : 'translate-y-20'} perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
          }}
        >
          <div className="relative w-80 h-32 mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === currentFeature;
              const rotation = (index - currentFeature) * 90;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 transform-gpu ${
                    isActive ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-60'
                  }`}
                  style={{
                    transform: `perspective(800px) rotateY(${rotation}deg) translateZ(${isActive ? '50px' : '0px'})`
                  }}
                >
                  <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 h-full ${
                    isActive ? 'shadow-2xl shadow-purple-500/25' : ''
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg transform-gpu ${
                        isActive ? 'animate-bounce-subtle' : ''
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Feature Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 transform-gpu ${
                  index === currentFeature
                    ? 'bg-purple-500 scale-125 shadow-lg shadow-purple-500/50'
                    : 'bg-gray-600 hover:bg-purple-400 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3D CTA Button */}
        <div 
          className={`transform transition-all duration-1500 delay-900 ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
          style={{
            transform: `${mounted ? 'translate-y-0 scale-100' : 'translate-y-20 scale-95'} perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`
          }}
        >
          <div className="group perspective-1000">
            <button
              onClick={onGetStarted}
              className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl transform-gpu transition-all duration-300 hover:scale-105 hover:-translate-y-1 group-hover:shadow-purple-500/50"
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="flex items-center gap-2 relative z-10">
                <span className="text-lg">Get Started Free</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </button>
            <p className="text-center text-sm text-gray-400 mt-3">
              ✨ No credit card • Free forever • 30s setup
            </p>
          </div>
        </div>

        {/* Compact Footer */}
        <div 
          className={`mt-8 text-center transform transition-all duration-1500 delay-1100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Trusted by 15,000+ students</span>
          </div>
          <div className="text-xs text-gray-500">
            Built with ❤️ by{' '}
            <a 
              href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Vinay Kumar
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(360deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.4); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.6), 0 0 40px rgba(59, 130, 246, 0.4); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
        
        .group:hover .group-hover\\:shadow-purple-500\\/25 {
          box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25);
        }
      `}</style>
    </div>
  );
};
