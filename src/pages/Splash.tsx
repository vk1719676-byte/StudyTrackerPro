import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Clock, Target, TrendingUp, Users, Trophy, Star, Zap, Brain, Award, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

interface SplashProps {
  onGetStarted: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onGetStarted }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Clock,
      title: 'Smart Time Tracking',
      description: 'Track your study sessions with precision and get insights into your productivity patterns.',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
    },
    {
      icon: Target,
      title: 'Goal Management',
      description: 'Set daily, weekly, and monthly study goals. Track progress and stay motivated to achieve excellence.',
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Visualize your study patterns with detailed charts and performance metrics.',
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations and study tips based on your learning patterns.',
      color: 'from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description: 'Unlock achievements, maintain study streaks, and celebrate your academic milestones.',
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Medical Student',
      content: 'Study Tracker Pro helped me organize my MCAT prep perfectly. The analytics showed me exactly where to focus my time!',
      rating: 5,
      avatar: '👩‍⚕️'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Engineering Student',
      content: 'The goal tracking feature is amazing! I increased my study efficiency by 40% in just one month.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Johnson',
      role: 'Law Student',
      content: 'Finally, a study app that actually understands students. The insights are incredibly helpful for exam prep.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ];

  const stats = [
    { icon: Users, value: '15,000+', label: 'Active Students', color: 'text-blue-600' },
    { icon: Trophy, value: '12,500', label: 'Exams Passed', color: 'text-green-600' },
    { icon: Star, value: '4.9/5', label: 'User Rating', color: 'text-yellow-600' },
    { icon: Zap, value: '200K+', label: 'Study Hours', color: 'text-purple-600' }
  ];

  useEffect(() => {
    setIsVisible(true);
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <div className="flex flex-col items-center space-y-3">
              <Logo size="lg" />
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border border-purple-200 dark:border-purple-700">
                <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Powered By TRMS
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            {/* Hero Section - Mobile Optimized */}
            <div className="text-center mb-8 sm:mb-16">
              <div className={`space-y-6 sm:space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border border-purple-200 dark:border-purple-700">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                      #1 Study Tracking Platform
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Study Smarter,
                    </span>
                    <br />
                    <span className="text-gray-900 dark:text-gray-100">
                      Achieve More! 🚀
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto px-2">
                    Transform your exam preparation with AI-powered insights, smart time tracking, 
                    and personalized study analytics. Join thousands of students achieving their academic goals.
                  </p>
                </div>

                {/* Mobile-First Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <Card key={index} className="p-3 sm:p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mx-auto mb-2 ${stat.color} dark:opacity-80`} />
                      <div className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </Card>
                  ))}
                </div>

                {/* Mobile CTA Button */}
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                    icon={ArrowRight}
                  >
                    Get Started Free
                  </Button>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
                    ✨ No credit card required • Free forever • Setup in 30 seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Features & Testimonials */}
            <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              {/* Feature Showcase - Mobile First */}
              <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
                      Powerful Features for Success
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Everything you need to excel in your studies
                    </p>
                  </div>

                  {/* Mobile Feature Cards */}
                  <div className="space-y-3 sm:space-y-4">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      const isActive = index === currentFeature;
                      
                      return (
                        <Card
                          key={index}
                          className={`p-4 sm:p-6 transition-all duration-500 transform cursor-pointer ${
                            isActive 
                              ? `scale-100 sm:scale-105 shadow-2xl ring-2 ring-purple-500 ring-opacity-50 ${feature.gradient}` 
                              : 'scale-95 opacity-60 hover:opacity-80 hover:scale-100'
                          }`}
                          onClick={() => setCurrentFeature(index)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg flex-shrink-0`}>
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                                {feature.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Mobile Feature Indicators */}
                  <div className="flex justify-center lg:justify-start space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                          index === currentFeature
                            ? 'bg-purple-600 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Student Testimonials - Mobile Optimized */}
              <div className={`transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
                      Loved by Students Worldwide
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      See what our community is saying
                    </p>
                  </div>

                  <div className="relative h-48 sm:h-64">
                    {testimonials.map((testimonial, index) => (
                      <Card
                        key={index}
                        className={`absolute inset-0 p-4 sm:p-6 transition-all duration-500 transform ${
                          index === currentTestimonial
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 translate-y-4'
                        } bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="text-2xl sm:text-3xl flex-shrink-0">{testimonial.avatar}</div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 italic text-sm sm:text-base leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Mobile Testimonial Indicators */}
                  <div className="flex justify-center lg:justify-start space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial
                            ? 'bg-purple-600 scale-125'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-purple-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Mobile Optimized */}
        <footer className={`p-4 sm:p-6 text-center transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-xs sm:text-sm">Trusted by 15,000+ students worldwide</span>
              </div>
              <div className="text-xs sm:text-sm">
                Built with ❤️ by{' '}
                <a 
                  href="https://www.linkedin.com/in/vinay-kumar-964209342/?originalSubdomain=in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium transition-colors duration-200"
                >
                  Vinay Kumar
                </a>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full border border-purple-200 dark:border-purple-700">
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                  Powered By TRMS
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
};
