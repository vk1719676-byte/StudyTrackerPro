import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Quote, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Users, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, Crown, Heart, Gift, X, Bell, Lightbulb, Megaphone, Info, Rocket } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

const heroDesigns = [
  {
    name: 'cosmic',
    background: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700',
    overlay: 'bg-gradient-to-r from-purple-500/20 to-blue-500/20',
    icon: Sparkles,
    accent: 'text-purple-300',
    particles: '✨'
  },
  {
    name: 'midnight',
    background: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900',
    overlay: 'bg-gradient-to-r from-slate-600/20 to-slate-500/20',
    icon: Zap,
    accent: 'text-slate-300',
    particles: '⚡'
  },
  {
    name: 'sunset',
    background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
    overlay: 'bg-gradient-to-r from-orange-400/20 to-pink-400/20',
    icon: Star,
    accent: 'text-orange-300',
    particles: '🌟'
  },
  {
    name: 'ocean',
    background: 'bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700',
    overlay: 'bg-gradient-to-r from-teal-400/20 to-cyan-400/20',
    icon: Target,
    accent: 'text-teal-300',
    particles: '🌊'
  },
  {
    name: 'aurora',
    background: 'bg-gradient-to-br from-green-400 via-purple-500 to-pink-600',
    overlay: 'bg-gradient-to-r from-green-400/20 to-purple-400/20',
    icon: Heart,
    accent: 'text-green-300',
    particles: '💫'
  },
  {
    name: 'golden',
    background: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600',
    overlay: 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20',
    icon: Crown,
    accent: 'text-yellow-300',
    particles: '✨'
  }
];

// Simple Card component
const SimpleCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ 
  children, 
  className = '', 
  hover = false 
}) => (
  <div className={`
    bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
    ${hover ? 'hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Notice types
const noticeTypes = [
  {
    id: 'study-tip',
    icon: Lightbulb,
    type: 'tip',
    title: 'Study Smart Tip',
    message: 'Take a 10-minute break after every 45 minutes of focused study to boost retention by up to 30%!',
    bgGradient: 'from-yellow-500 to-orange-500',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    duration: 8000,
    emoji: '💡'
  },
  {
    id: 'motivation',
    icon: Rocket,
    type: 'motivation',
    title: 'Stay Motivated',
    message: "You're doing great! Every study session brings you closer to your goals. Keep pushing forward!",
    bgGradient: 'from-purple-500 to-pink-500',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    duration: 10000,
    emoji: '🚀'
  },
  {
    id: 'feature-update',
    icon: Star,
    type: 'update',
    title: 'New Feature Alert',
    message: 'Check out the enhanced analytics dashboard with AI-powered study recommendations!',
    bgGradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    duration: 12000,
    emoji: '⭐'
  },
  {
    id: 'health-reminder',
    icon: Heart,
    type: 'health',
    title: 'Health Reminder',
    message: 'Remember to stay hydrated, maintain good posture, and get enough sleep for optimal learning!',
    bgGradient: 'from-green-500 to-teal-500',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    duration: 9000,
    emoji: '❤️'
  },
  {
    id: 'achievement',
    icon: Trophy,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'Congratulations on maintaining your study streak! You\'re building excellent habits!',
    bgGradient: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    duration: 7000,
    emoji: '🏆'
  }
];

// Notice Component
const NoticeSection: React.FC<{ 
  studyStreak: number; 
  isPremium: boolean;
  rakshabandhanActive: boolean;
}> = ({ studyStreak, isPremium, rakshabandhanActive }) => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter notices based on conditions
  const getAvailableNotices = () => {
    let available = [...noticeTypes];
    
    // Add special Raksha Bandhan notice if active
    if (rakshabandhanActive) {
      available.unshift({
        id: 'raksha-bandhan',
        icon: Gift,
        type: 'special',
        title: 'Raksha Bandhan Special',
        message: 'Study with your siblings today! Research shows collaborative learning improves retention by 25%.',
        bgGradient: 'from-pink-500 to-red-500',
        iconBg: 'bg-pink-100 dark:bg-pink-900/30',
        iconColor: 'text-pink-600 dark:text-pink-400',
        duration: 6000,
        emoji: '🎋'
      });
    }
    
    // Show achievement notice only if streak > 3
    if (studyStreak <= 3) {
      available = available.filter(notice => notice.id !== 'achievement');
    }
    
    return available;
  };

  const availableNotices = getAvailableNotices();

  // Auto-rotate notices
  useEffect(() => {
    if (isDismissed || availableNotices.length === 0) return;
    
    const currentNoticeDuration = availableNotices[currentNotice]?.duration || 8000;
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentNotice((prev) => (prev + 1) % availableNotices.length);
        setIsAnimating(false);
      }, 300);
    }, currentNoticeDuration);
    
    return () => clearInterval(interval);
  }, [currentNotice, isDismissed, availableNotices.length]);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsDismissed(true);
    }, 300);
  };

  if (!isVisible || isDismissed || availableNotices.length === 0) {
    return null;
  }

  const notice = availableNotices[currentNotice];
  const IconComponent = notice.icon;

  return (
    <div className="mb-6 -mt-16 md:-mt-0 pt-16 md:pt-6">
      <div className={`
        relative overflow-hidden rounded-xl transition-all duration-500 transform
        ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
        bg-gradient-to-r ${notice.bgGradient} p-[1px]
      `}>
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r opacity-20 animate-pulse"
             style={{
               background: `linear-gradient(90deg, transparent, white, transparent)`,
               animation: 'shimmer 3s infinite'
             }} />
        
        <div className="relative bg-white dark:bg-gray-900 rounded-xl">
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-xs opacity-20 animate-bounce"
                style={{
                  left: `${15 + (i * 18)}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.6}s`,
                  animationDuration: '2.5s'
                }}
              >
                {notice.emoji}
              </div>
            ))}
          </div>

          <div className="relative p-4 sm:p-5">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`
                flex-shrink-0 p-2 rounded-lg ${notice.iconBg}
                animate-pulse hover:animate-none transition-all duration-300
                hover:scale-110 hover:rotate-6
              `}>
                <IconComponent className={`w-5 h-5 ${notice.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base flex items-center gap-2">
                    {notice.title}
                    {notice.type === 'special' && (
                      <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">
                        Special
                      </span>
                    )}
                    {notice.type === 'update' && isPremium && (
                      <PremiumBadge size="xs" />
                    )}
                  </h3>
                  
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group ml-2"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {notice.message}
                </p>

                {/* Progress indicator */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1">
                    {availableNotices.map((_, index) => (
                      <div
                        key={index}
                        className={`
                          h-1 rounded-full transition-all duration-300
                          ${index === currentNotice 
                            ? `bg-gradient-to-r ${notice.bgGradient} w-6` 
                            : 'bg-gray-200 dark:bg-gray-600 w-2'}
                        `}
                      />
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentNotice + 1} of {availableNotices.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

// Simple stat card
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <SimpleCard hover className="p-4 sm:p-6">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 sm:p-3 ${bgColor} rounded-lg`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  </SimpleCard>
);

// Simple session card
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <SimpleCard hover className="p-4">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
            {session.subject}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {session.topic}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-2">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {formatMinutes(session.duration)}
        </span>
        <div className="flex items-center gap-0.5 mt-1 justify-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-1.5 h-1.5 rounded-full ${
                star <= session.efficiency
                  ? 'bg-yellow-400'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Calendar className="w-3 h-3" />
        <span>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      {exam && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="truncate max-w-20">{exam.name}</span>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
        </div>
      )}
    </div>
  </SimpleCard>
);

// Raksha Bandhan checker
const getRakshaBandhanInfo = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const rakshabandhanDate = new Date(2025, 7, 15); // August 15, 2025 (month is 0-indexed)
  
  const diffTime = rakshabandhanDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Show message if within 30 days before or on the day
  const shouldShowMessage = diffDays >= 0 && diffDays <= 30;
  
  let message = '';
  let emoji = '🎋';
  let bgGradient = 'from-pink-500 via-red-500 to-orange-500';
  
  if (diffDays === 0) {
    message = 'Happy independence Day! 🎉 May your bond of love grow stronger with every study session!';
    emoji = '🎊';
  } else if (diffDays === 1) {
    message = 'Raksha Bandhan tomorrow! 🎋 Study smart and make your siblings proud!';
  } else if (diffDays <= 7) {
    message = `Raksha Bandhan in ${diffDays} days! 🎋 Perfect time to study together with siblings!`;
  } else if (diffDays <= 30) {
    message = `Raksha Bandhan approaching in ${diffDays} days! 🎋 Plan your celebration and studies wisely!`;
    bgGradient = 'from-purple-500 via-pink-500 to-red-500';
  }
  
  return {
    shouldShow: shouldShowMessage,
    message,
    emoji,
    bgGradient,
    daysUntil: diffDays
  };
};

export const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDesign, setCurrentDesign] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { user, isPremium } = useAuth();

  // Get Raksha Bandhan info
  const rakshabandhanInfo = getRakshaBandhanInfo();

  // Get saved display name
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null;
  const displayName = savedDisplayName || user?.displayName || user?.email?.split('@')[0];

  useEffect(() => {
    setMounted(true);
    if (!user) return;

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
      setLoading(false);
    });

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
    });

    return () => {
      unsubscribeExams();
      unsubscribeSessions();
    };
  }, [user]);

  // Change design every 25 seconds (or every 15 seconds if Raksha Bandhan is active)
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentDesign((prev) => (prev + 1) % heroDesigns.length);
    }, rakshabandhanInfo.shouldShow ? 15000 : 25000);
    return () => clearInterval(interval);
  }, [mounted, rakshabandhanInfo.shouldShow]);

  const handleSessionAdded = () => {
    // Sessions will be updated automatically via the real-time listener
  };

  // Calculate stats
  const todaysSessions = sessions.filter(session => 
    new Date(session.date).toDateString() === new Date().toDateString()
  );
  const todaysStudyTime = todaysSessions.reduce((total, session) => total + session.duration, 0);
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  const weeklyStudyTime = thisWeekSessions.reduce((total, session) => total + session.duration, 0);
  const averageEfficiency = sessions.length > 0 
    ? sessions.reduce((total, session) => total + session.efficiency, 0) / sessions.length 
    : 0;

  // Calculate study streak
  const calculateStudyStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasSessionOnDate = sortedSessions.some(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });
      
      if (hasSessionOnDate) {
        streak++;
      } else if (i > 0) { // Allow for today to not break streak
        break;
      }
    }
    
    return streak;
  };

  // Get upcoming deadlines (next 7 days)
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= now && examDate <= nextWeek;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    const last7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const previous7Days = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
    });

    const currentWeekTime = last7Days.reduce((total, session) => total + session.duration, 0);
    const previousWeekTime = previous7Days.reduce((total, session) => total + session.duration, 0);
    const timeChange = previousWeekTime > 0 ? ((currentWeekTime - previousWeekTime) / previousWeekTime) * 100 : 0;

    const currentWeekEfficiency = last7Days.length > 0 
      ? last7Days.reduce((total, session) => total + session.efficiency, 0) / last7Days.length 
      : 0;
    const previousWeekEfficiency = previous7Days.length > 0 
      ? previous7Days.reduce((total, session) => total + session.efficiency, 0) / previous7Days.length 
      : 0;
    const efficiencyChange = previousWeekEfficiency > 0 ? ((currentWeekEfficiency - previousWeekEfficiency) / previousWeekEfficiency) * 100 : 0;

    return {
      timeChange: Math.round(timeChange),
      efficiencyChange: Math.round(efficiencyChange),
      sessionsThisWeek: last7Days.length,
      averageSessionLength: last7Days.length > 0 ? Math.round(currentWeekTime / last7Days.length) : 0
    };
  };

  const studyStreak = calculateStudyStreak();
  const upcomingDeadlines = getUpcomingDeadlines();
  const performanceMetrics = getPerformanceMetrics();

  // Get current time for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentHeroDesign = heroDesigns[currentDesign];
  const IconComponent = currentHeroDesign.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-6 pb-20 md:pb-8">
        
        {/* Notice Section */}
        <NoticeSection 
          studyStreak={studyStreak}
          isPremium={isPremium}
          rakshabandhanActive={rakshabandhanInfo.shouldShow}
        />
        
        {/* Simple Hero Section */}
        <div className="mb-6 -mt-16 md:-mt-0 pt-16 md:pt-0">
          <div className={`${rakshabandhanInfo.shouldShow 
            ? `bg-gradient-to-br ${rakshabandhanInfo.bgGradient}` 
            : currentHeroDesign.background} text-white rounded-xl p-4 sm:p-6 relative overflow-hidden`}>
            
            {/* Simple floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-lg opacity-30 animate-bounce"
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${20 + (i % 2) * 40}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '3s'
                  }}
                >
                  {rakshabandhanInfo.shouldShow ? '🎋' : currentHeroDesign.particles}
                </div>
              ))}
            </div>

            <div className="relative">
              {/* Raksha Bandhan Special Message */}
              {rakshabandhanInfo.shouldShow && (
                <div className="mb-4 p-3 bg-white/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{rakshabandhanInfo.emoji}</span>
                    <h2 className="text-sm font-bold">Special Occasion</h2>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm">
                    {rakshabandhanInfo.message}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                    <span className="truncate">{getCurrentGreeting()}, {displayName}!</span>
                    {isPremium && <PremiumBadge size="sm" />}
                    <span className="text-lg">👋</span>
                  </h1>
                  <p className="text-white/80 text-sm mb-3">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study with festive spirit!" : 
                      "Ready to achieve your goals today?"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {studyStreak > 0 && (
                      <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                        <Flame className="w-3 h-3" />
                        <span>{studyStreak} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium AI Insights - Simplified */}
        {isPremium && (
          <div className="mb-6">
            <SimpleCard className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </h2>
                <PremiumBadge size="sm" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">
                    🎯 Today's Focus
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study with siblings for better retention!" :
                      "Focus on Mathematics for optimal results."}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">
                    📈 Performance
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your efficiency peaks at 10 AM. Schedule important topics then.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm">
                    ⚡ Smart Tip
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {rakshabandhanInfo.shouldShow ?
                      "Celebrate learning with family!" :
                      "Take breaks every 25 minutes for better focus."}
                  </p>
                </div>
              </div>
            </SimpleCard>
          </div>
        )}

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          <StatCard
            icon={Clock}
            label="Today's Study"
            value={formatMinutes(todaysStudyTime)}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            trend={performanceMetrics.timeChange > 0 ? `+${performanceMetrics.timeChange}%` : undefined}
          />
          <StatCard
            icon={Target}
            label="Weekly Study"
            value={formatMinutes(weeklyStudyTime)}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            trend={`${performanceMetrics.sessionsThisWeek} sessions`}
          />
          <StatCard
            icon={TrendingUp}
            label="Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            color="text-green-600 dark:text-green-400"
            bgColor="bg-green-50 dark:bg-green-900/30"
            trend={performanceMetrics.efficiencyChange > 0 ? `+${performanceMetrics.efficiencyChange}%` : undefined}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgColor="bg-orange-50 dark:bg-orange-900/30"
            trend={studyStreak > 7 ? "🔥" : studyStreak > 3 ? "💪" : undefined}
          />
        </div>

        {/* Analytics and Deadlines - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Performance Analytics */}
          <SimpleCard className="p-4 sm:p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Study Time</span>
                    <span className={`text-xs font-semibold ${performanceMetrics.timeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {performanceMetrics.timeChange >= 0 ? '+' : ''}{performanceMetrics.timeChange}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className={`text-xs font-semibold ${performanceMetrics.efficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {performanceMetrics.efficiencyChange >= 0 ? '+' : ''}{performanceMetrics.efficiencyChange}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Session Insights</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Avg. Length</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {formatMinutes(performanceMetrics.averageSessionLength)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {performanceMetrics.sessionsThisWeek} sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Study Streak Visualization */}
            <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Study Streak</span>
                </div>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{studyStreak} days</span>
              </div>
              <div className="flex gap-1">
                {[...Array(14)].map((_, i) => {
                  const dayIndex = 13 - i;
                  const hasStudied = dayIndex < studyStreak;
                  return (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${
                        hasStudied 
                          ? 'bg-orange-400 dark:bg-orange-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </SimpleCard>

          {/* Upcoming Deadlines */}
          <SimpleCard className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Deadlines
            </h2>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.slice(0, 4).map((exam) => {
                  const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 3;
                  const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                  const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                  
                  return (
                    <div key={exam.id} className={`p-3 rounded-lg border-l-4 ${
                      isUrgent 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-400' 
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                            {exam.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {exam.subject}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className={`text-xs font-semibold ${
                            isUrgent ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(exam.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Simple Progress */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {formatMinutes(totalStudyTime)} studied
                        </span>
                        <span className={`font-medium ${
                          totalStudyTime >= 300 ? 'text-green-600' : 
                          totalStudyTime >= 120 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {totalStudyTime >= 300 ? '✅ Ready' : 
                           totalStudyTime >= 120 ? '📈 Progress' : '📚 Study more'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No upcoming deadlines
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {rakshabandhanInfo.shouldShow ? 
                    "Perfect time to celebrate! 🎋" :
                    "You're all caught up! 🎉"}
                </p>
              </div>
            )}
          </SimpleCard>
        </div>

        {/* Premium Advanced Analytics Preview */}
        <div className="mb-6">
          <PremiumFeatureGate
            featureName="Advanced Analytics"
            description="Get detailed insights and AI-powered recommendations"
            className="min-h-[200px]"
          >
            <SimpleCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Advanced Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Efficiency Trends</h3>
                  <div className="h-16 bg-blue-200 dark:bg-blue-800 rounded flex items-end justify-around p-2">
                    <div className="bg-blue-500 w-3 h-6 rounded-t"></div>
                    <div className="bg-blue-500 w-3 h-8 rounded-t"></div>
                    <div className="bg-blue-500 w-3 h-10 rounded-t"></div>
                    <div className="bg-blue-500 w-3 h-7 rounded-t"></div>
                    <div className="bg-blue-500 w-3 h-9 rounded-t"></div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-400 mb-2">AI Predictions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Math Exam</span>
                      <span className="text-sm font-bold text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Physics Test</span>
                      <span className="text-sm font-bold text-yellow-600">78%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-400 mb-2">Recommendations</h3>
                  <div className="space-y-1 text-sm text-purple-700 dark:text-purple-300">
                    <p>• Study Math at 10 AM</p>
                    <p>• Take breaks every 25min</p>
                    <p>• {rakshabandhanInfo.shouldShow ? "Study with siblings!" : "Review Physics tonight"}</p>
                  </div>
                </div>
              </div>
            </SimpleCard>
          </PremiumFeatureGate>
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Recent Sessions - Simplified */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Recent Sessions
              </h2>
              <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, 6).map((session) => {
                const exam = exams.find(e => e.id === session.examId);
                return (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    exam={exam} 
                    formatMinutes={formatMinutes}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
