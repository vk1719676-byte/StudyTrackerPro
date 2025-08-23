import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Clock, Target, TrendingUp, Users, Trophy, Star, Zap, Brain, Award, CheckCircle, Sparkles } from 'lucide-react';

interface SplashProps {
  onGetStarted: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    {
      icon: Clock,
      title: 'Smart Time Tracking',
      description: 'AI-powered study session insights',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Goal Management',
      description: 'Achieve your academic milestones',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Personalized study recommendations',
      color: 'from-indigo-500 to-purple-500',
    }
  ];

  const stats = [
    { icon: Users, value: '15K+', label: 'Students', color: 'text-blue-600' },
    { icon: Trophy, value: '12.5K', label: 'Exams Passed', color: 'text-green-600' },
    { icon: Star, value: '4.9/5', label: 'Rating', color: 'text-yellow-600' },
    { icon: Zap, value: '200K+', label: 'Study Hours', color: 'text-purple-600' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 perspective-1000">
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-float-3d"
          style={{
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg)`
          }}
        />
        <div 
          className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-30 animate-float-3d-delayed"
          style={{
            transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 0) rotateX(${mousePosition.y * -8}deg) rotateY(${mousePosition.x * -8}deg)`
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse-3d"
          style={{
            transform: `translate3d(-50%, -50%, 0) translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 0)`
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* 3D Logo and Header */}
        <div className={`text-center mb-12 transform-gpu transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div 
            className="mb-6 transform-gpu transition-transform duration-300 hover:scale-110"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
            }}
          >
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center transform-gpu hover:shadow-purple-500/50 transition-all duration-300">
                <BookOpen className="w-12 h-12 text-white transform-gpu hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-50 -z-10 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Study Tracker Pro
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white/90">Powered by AI</span>
              </div>
            </div>
          </div>

          <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
            Transform your study sessions with AI-powered insights and 3D visualizations. 
            <span className="text-yellow-300 font-semibold">Join 15,000+ successful students!</span>
          </p>
        </div>

        {/* 3D Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transform-gpu transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative transform-gpu transition-all duration-500 hover:scale-110"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl text-center transform-gpu group-hover:bg-white/20 transition-all duration-300">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} transform-gpu group-hover:scale-125 transition-transform duration-300`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Feature Showcase */}
        <div className={`mb-12 w-full max-w-4xl transform-gpu transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-white/70">Everything you need for academic success</p>
          </div>

          <div className="relative h-64 perspective-1000">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === currentFeature;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transform-gpu transition-all duration-700 ${
                    isActive 
                      ? 'opacity-100 scale-100 translate-z-0 rotate-y-0' 
                      : 'opacity-0 scale-90 translate-z-[-100px] rotate-y-180'
                  }`}
                  style={{
                    transform: isActive 
                      ? `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) scale(1)`
                      : `perspective(1000px) rotateY(180deg) scale(0.8)`
                  }}
                >
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl h-full flex flex-col justify-center items-center text-center transform-gpu hover:bg-white/15 transition-all duration-300">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-2xl mb-6 transform-gpu hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/80 text-lg leading-relaxed">{feature.description}</p>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3D Feature Indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-4 h-4 rounded-full transition-all duration-500 transform-gpu hover:scale-125 ${
                  index === currentFeature
                    ? 'bg-white scale-125 shadow-lg shadow-white/50'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                style={{
                  transform: `perspective(500px) rotateX(${mousePosition.y * 2}deg) ${index === currentFeature ? 'scale(1.25)' : 'scale(1)'}`
                }}
              />
            ))}
          </div>
        </div>

        {/* 3D CTA Button */}
        <div className={`text-center transform-gpu transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <button
            onClick={onGetStarted}
            className="group relative px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl font-bold rounded-2xl shadow-2xl transform-gpu transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 active:scale-95"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
            }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Get Started Free
              <ArrowRight className="w-6 h-6 transform-gpu group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <div className="mt-4 flex flex-col items-center gap-2 text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm">Free forever • No credit card required</span>
            </div>
            <p className="text-xs">
              Made with ❤️ by{' '}
              <a 
                href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white underline transition-colors duration-200"
              >
                Vinay Kumar
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform-style: preserve-3d;
        }
        
        @keyframes float-3d {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: translate3d(10px, -20px, 20px) rotateX(5deg) rotateY(5deg);
          }
          50% {
            transform: translate3d(-10px, 10px, -10px) rotateX(-3deg) rotateY(-3deg);
          }
          75% {
            transform: translate3d(15px, 5px, 15px) rotateX(3deg) rotateY(7deg);
          }
        }
        
        @keyframes float-3d-delayed {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: translate3d(-15px, 10px, -20px) rotateX(-5deg) rotateY(-5deg);
          }
          50% {
            transform: translate3d(8px, -15px, 10px) rotateX(3deg) rotateY(3deg);
          }
          75% {
            transform: translate3d(-8px, -5px, -15px) rotateX(-3deg) rotateY(-7deg);
          }
        }
        
        @keyframes pulse-3d {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(1) rotateX(0deg);
          }
          50% {
            transform: translate3d(-50%, -50%, 20px) scale(1.1) rotateX(180deg);
          }
        }
        
        .animate-float-3d {
          animation: float-3d 8s ease-in-out infinite;
        }
        
        .animate-float-3d-delayed {
          animation: float-3d-delayed 10s ease-in-out infinite;
        }
        
        .animate-pulse-3d {
          animation: pulse-3d 4s ease-in-out infinite;
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .translate-z-0 {
          transform: translateZ(0);
        }
        
        .translate-z-\[-100px\] {
          transform: translateZ(-100px);
        }
      `}</style>
    </div>
  );
};

export default Splash;
