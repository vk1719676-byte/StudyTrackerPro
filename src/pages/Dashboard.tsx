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
    background: 'bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800',
    overlay: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20',
    icon: Sparkles,
    accent: 'text-indigo-300',
    particles: '✨'
  },
  {
    name: 'midnight',
    background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700',
    overlay: 'bg-gradient-to-r from-slate-700/20 to-slate-600/20',
    icon: Zap,
    accent: 'text-slate-300',
    particles: '⚡'
  },
  {
    name: 'sunset',
    background: 'bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700',
    overlay: 'bg-gradient-to-r from-orange-500/20 to-pink-500/20',
    icon: Star,
    accent: 'text-orange-300',
    particles: '🌟'
  },
  {
    name: 'ocean',
    background: 'bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800',
    overlay: 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20',
    icon: Target,
    accent: 'text-teal-300',
    particles: '🌊'
  },
  {
    name: 'aurora',
    background: 'bg-gradient-to-br from-green-500 via-purple-600 to-pink-700',
    overlay: 'bg-gradient-to-r from-green-500/20 to-purple-500/20',
    icon: Heart,
    accent: 'text-green-300',
    particles: '💫'
  },
  {
    name: 'golden',
    background: 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700',
    overlay: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
    icon: Crown,
    accent: 'text-yellow-300',
    particles: '✨'
  }
];

// Enhanced Card component with glassmorphism and advanced styling
const SimpleCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ 
  children, 
  className = '', 
  hover = false 
}) => (
  <div className={`
    group relative overflow-hidden
    bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg backdrop-saturate-150
    rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
    border border-white/20 dark:border-gray-700/50
    before:absolute before:inset-0 before:rounded-2xl before:border before:border-white/30 dark:before:border-gray-600/30
    before:bg-gradient-to-br before:from-white/10 before:to-transparent
    ${hover ? 'hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-gray-900/60 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer' : ''}
    ${className}
  `}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Notice types with enhanced styling
const noticeTypes = [
  {
    id: 'study-tip',
    icon: Lightbulb,
    type: 'tip',
    title: 'Study Smart Tip',
    message: 'Take a 10-minute break after every 45 minutes of focused study to boost retention by up to 30%!',
    bgGradient: 'from-yellow-500 via-orange-500 to-red-500',
    iconBg: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30',
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
    bgGradient: 'from-purple-500 via-pink-500 to-indigo-600',
    iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30',
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
    bgGradient: 'from-blue-500 via-cyan-500 to-teal-600',
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
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
    bgGradient: 'from-green-500 via-teal-500 to-emerald-600',
    iconBg: 'bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30',
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
    bgGradient: 'from-amber-500 via-orange-500 to-yellow-600',
    iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    duration: 7000,
    emoji: '🏆'
  }
];

// Enhanced Notice Component with advanced animations
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
        bgGradient: 'from-pink-500 via-red-500 to-purple-600',
        iconBg: 'bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/30 dark:to-red-900/30',
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
    <div className="mb-8 -mt-16 md:-mt-0 pt-16 md:pt-6">
      <div className={`
        relative overflow-hidden rounded-2xl transition-all duration-700 transform
        ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
        p-[1px] bg-gradient-to-r ${notice.bgGradient}
        shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/10
        hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20
      `}>
        {/* Enhanced animated border gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-30 animate-pulse"
             style={{
               background: `conic-gradient(from 0deg, transparent, white, transparent)`,
               animation: 'spin 8s linear infinite'
             }} />
        
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20">
          {/* Enhanced floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-lg opacity-20 animate-float"
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${15 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${3 + (i % 2)}s`
                }}
              >
                {notice.emoji}
              </div>
            ))}
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="flex items-start gap-4">
              {/* Enhanced Icon */}
              <div className={`
                flex-shrink-0 p-3 rounded-xl ${notice.iconBg}
                shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
                transform transition-all duration-500
                hover:scale-110 hover:rotate-12 hover:shadow-xl
                border border-white/30 dark:border-gray-600/30
              `}>
                <IconComponent className={`w-6 h-6 ${notice.iconColor} drop-shadow-sm`} />
              </div>

              {/* Enhanced Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-3">
                    {notice.title}
                    {notice.type === 'special' && (
                      <span className="text-xs bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                        Special
                      </span>
                    )}
                    {notice.type === 'update' && isPremium && (
                      <PremiumBadge size="sm" />
                    )}
                  </h3>
                  
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 group ml-3 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 font-medium">
                  {notice.message}
                </p>

                {/* Enhanced Progress indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {availableNotices.map((_, index) => (
                      <div
                        key={index}
                        className={`
                          h-1.5 rounded-full transition-all duration-500 shadow-sm
                          ${index === currentNotice 
                            ? `bg-gradient-to-r ${notice.bgGradient} w-8 shadow-md` 
                            : 'bg-gray-200 dark:bg-gray-600 w-3 hover:w-4'}
                        `}
                      />
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    {currentNotice + 1} of {availableNotices.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.4; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Enhanced stat card with modern design
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <SimpleCard hover className="p-6 sm:p-8 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`
        p-4 ${bgColor} rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50
        group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
        border border-white/30 dark:border-gray-600/30
        relative overflow-hidden
      `}>
        {/* Icon background glow */}
        <div className={`absolute inset-0 ${bgColor} opacity-50 blur-xl`} />
        <Icon className={`relative z-10 w-6 h-6 ${color} drop-shadow-sm`} />
      </div>
      {trend && (
        <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-3 py-2 rounded-xl shadow-md border border-green-200/50 dark:border-green-700/50">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
        {value}
      </p>
    </div>
  </SimpleCard>
);

// Enhanced session card
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <SimpleCard hover className="p-6 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-700/50 group-hover:scale-110 transition-all duration-300">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base truncate mb-1">
            {session.subject}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
            {session.topic}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <span className="text-lg font-black text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-3 py-1 rounded-xl shadow-sm">
          {formatMinutes(session.duration)}
        </span>
        <div className="flex items-center gap-1 mt-2 justify-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                star <= session.efficiency
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm scale-110'
                  : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-100/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
        <Calendar className="w-4 h-4" />
        <span>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      {exam && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1 rounded-full backdrop-blur-sm">
          <span className="truncate max-w-24 font-medium">{exam.name}</span>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 shadow-lg"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-600 to-purple-600 border-t-transparent absolute top-0 shadow-2xl"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">Loading your dashboard...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preparing your personalized experience</p>
          </div>
        </div>
      </div>
    );
  }

  const currentHeroDesign = heroDesigns[currentDesign];
  const IconComponent = currentHeroDesign.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-6 pb-20 md:pb-8">
        
        {/* Notice Section */}
        <NoticeSection 
          studyStreak={studyStreak}
          isPremium={isPremium}
          rakshabandhanActive={rakshabandhanInfo.shouldShow}
        />
        
        {/* Enhanced Hero Section */}
        <div className="mb-8 -mt-16 md:-mt-0 pt-16 md:pt-0">
          <div className={`${rakshabandhanInfo.shouldShow 
            ? `bg-gradient-to-br ${rakshabandhanInfo.bgGradient}` 
            : currentHeroDesign.background} text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10`}>
            
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-50"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            
            {/* Enhanced floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl opacity-20 animate-float"
                  style={{
                    left: `${10 + (i * 8)}%`,
                    top: `${15 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${4 + (i % 2)}s`
                  }}
                >
                  {rakshabandhanInfo.shouldShow ? '🎋' : currentHeroDesign.particles}
                </div>
              ))}
            </div>

            <div className="relative z-10">
              {/* Enhanced Raksha Bandhan Special Message */}
              {rakshabandhanInfo.shouldShow && (
                <div className="mb-6 p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl animate-bounce">{rakshabandhanInfo.emoji}</span>
                    <h2 className="text-lg font-black">Special Occasion</h2>
                    <div className="px-3 py-1 bg-white/30 rounded-full text-xs font-bold">
                      Festive Edition
                    </div>
                  </div>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed font-medium">
                    {rakshabandhanInfo.message}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 flex items-center gap-3">
                    <span className="truncate bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {getCurrentGreeting()}, {displayName}!
                    </span>
                    {isPremium && <PremiumBadge size="md" />}
                    <span className="text-2xl animate-wave">👋</span>
                  </h1>
                  <p className="text-white/90 text-lg mb-4 font-medium">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study with festive spirit! 🎉" : 
                      "Ready to achieve your goals today? ✨"}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-lg">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {studyStreak > 0 && (
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-lg">
                        <Flame className="w-4 h-4 text-orange-300" />
                        <span className="font-bold">{studyStreak} day streak!</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-6">
                  <div className="p-6 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl group hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg group-hover:rotate-12 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Premium AI Insights */}
        {isPremium && (
          <div className="mb-8">
            <SimpleCard className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-2 border-purple-200/50 dark:border-purple-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  AI Assistant
                </h2>
                <PremiumBadge size="lg" />
                <div className="flex-1"></div>
                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-bold">
                  Powered by AI
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-2 text-lg flex items-center gap-2">
                    🎯 Today's Focus
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study with siblings for better retention! Research shows 25% improvement." :
                      "Focus on Mathematics for optimal results. Your peak performance window is approaching."}
                  </p>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-2 text-lg flex items-center gap-2">
                    📈 Performance
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your efficiency peaks at 10 AM. Schedule important topics then for maximum retention.
                  </p>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group sm:col-span-2 lg:col-span-1">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-2 text-lg flex items-center gap-2">
                    ⚡ Smart Tip
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {rakshabandhanInfo.shouldShow ?
                      "Celebrate learning with family! Collaborative study sessions boost motivation by 40%." :
                      "Take breaks every 25 minutes for better focus. Your brain needs time to consolidate."}
                  </p>
                </div>
              </div>
            </SimpleCard>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={Clock}
            label="Today's Study"
            value={formatMinutes(todaysStudyTime)}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            trend={performanceMetrics.timeChange > 0 ? `+${performanceMetrics.timeChange}%` : undefined}
          />
          <StatCard
            icon={Target}
            label="Weekly Study"
            value={formatMinutes(weeklyStudyTime)}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
            trend={`${performanceMetrics.sessionsThisWeek} sessions`}
          />
          <StatCard
            icon={TrendingUp}
            label="Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            color="text-green-600 dark:text-green-400"
            bgColor="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30"
            trend={performanceMetrics.efficiencyChange > 0 ? `+${performanceMetrics.efficiencyChange}%` : undefined}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgColor="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30"
            trend={studyStreak > 7 ? "🔥" : studyStreak > 3 ? "💪" : undefined}
          />
        </div>

        {/* Enhanced Analytics and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Enhanced Performance Analytics */}
          <SimpleCard className="p-6 sm:p-8 lg:col-span-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              Performance Analytics
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full font-bold">
                Live Data
              </div>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-xl shadow-md">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Weekly Progress</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Time</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-full ${
                      performanceMetrics.timeChange >= 0 
                        ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                        : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}>
                      {performanceMetrics.timeChange >= 0 ? '+' : ''}{performanceMetrics.timeChange}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-full ${
                      performanceMetrics.efficiencyChange >= 0 
                        ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                        : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}>
                      {performanceMetrics.efficiencyChange >= 0 ? '+' : ''}{performanceMetrics.efficiencyChange}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-xl shadow-md">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Session Insights</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Length</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                      {formatMinutes(performanceMetrics.averageSessionLength)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="text-sm font-black text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                      {performanceMetrics.sessionsThisWeek} sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Study Streak Visualization */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-md">
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">Study Streak</span>
                </div>
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-2xl shadow-md">
                  {studyStreak} days
                </span>
              </div>
              <div className="flex gap-2">
                {[...Array(14)].map((_, i) => {
                  const dayIndex = 13 - i;
                  const hasStudied = dayIndex < studyStreak;
                  return (
                    <div
                      key={i}
                      className={`h-3 flex-1 rounded-full transition-all duration-500 shadow-sm ${
                        hasStudied 
                          ? 'bg-gradient-to-r from-orange-400 to-red-500 shadow-orange-300/50' 
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center font-medium">
                Last 14 days • Keep it going! 🔥
              </p>
            </div>
          </SimpleCard>

          {/* Enhanced Upcoming Deadlines */}
          <SimpleCard className="p-6 sm:p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              Deadlines
            </h2>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeadlines.slice(0, 4).map((exam) => {
                  const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysUntil <= 3;
                  const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                  const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                  
                  return (
                    <div key={exam.id} className={`p-5 rounded-2xl border-l-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                      isUrgent 
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-500 shadow-red-200/50 dark:shadow-red-900/20' 
                        : 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-500 shadow-yellow-200/50 dark:shadow-yellow-900/20'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg truncate mb-1">
                            {exam.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-semibold bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full inline-block">
                            {exam.subject}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <span className={`text-sm font-black px-3 py-2 rounded-xl shadow-md ${
                            isUrgent ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40' : 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/40'
                          }`}>
                            {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                            {new Date(exam.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      {/* Enhanced Progress */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-medium bg-white/30 dark:bg-gray-800/30 px-3 py-1 rounded-full">
                          {formatMinutes(totalStudyTime)} studied
                        </span>
                        <span className={`font-black px-3 py-2 rounded-xl shadow-sm ${
                          totalStudyTime >= 300 ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/40' : 
                          totalStudyTime >= 120 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' : 
                          'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40'
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
              <div className="text-center py-8">
                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-lg mb-4 inline-block">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  No upcoming deadlines
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {rakshabandhanInfo.shouldShow ? 
                    "Perfect time to celebrate! 🎋" :
                    "You're all caught up! 🎉"}
                </p>
              </div>
            )}
          </SimpleCard>
        </div>

        {/* Enhanced Premium Advanced Analytics Preview */}
        <div className="mb-8">
          <PremiumFeatureGate
            featureName="Advanced Analytics"
            description="Get detailed insights and AI-powered recommendations"
            className="min-h-[250px]"
          >
            <SimpleCard className="p-8 border-2 border-purple-200/50 dark:border-purple-700/50">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                Advanced Analytics
                <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full font-bold">
                  Premium Feature
                </div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                  <h3 className="font-black text-blue-900 dark:text-blue-400 mb-4 text-xl">Efficiency Trends</h3>
                  <div className="h-20 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800 rounded-xl flex items-end justify-around p-3 shadow-inner">
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 h-8 rounded-t-lg shadow-md"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 h-10 rounded-t-lg shadow-md"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 h-12 rounded-t-lg shadow-md"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 h-9 rounded-t-lg shadow-md"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-4 h-11 rounded-t-lg shadow-md"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 shadow-lg">
                  <h3 className="font-black text-green-900 dark:text-green-400 mb-4 text-xl">AI Predictions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm">
                      <span className="text-sm font-semibold">Math Exam</span>
                      <span className="text-sm font-black text-green-600 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">94%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm">
                      <span className="text-sm font-semibold">Physics Test</span>
                      <span className="text-sm font-black text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">78%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                  <h3 className="font-black text-purple-900 dark:text-purple-400 mb-4 text-xl">Recommendations</h3>
                  <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                    <p className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg font-medium">
                      <span className="text-lg">🎯</span> Study Math at 10 AM
                    </p>
                    <p className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg font-medium">
                      <span className="text-lg">⏰</span> Take breaks every 25min
                    </p>
                    <p className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg font-medium">
                      <span className="text-lg">{rakshabandhanInfo.shouldShow ? "🎋" : "📚"}</span> 
                      {rakshabandhanInfo.shouldShow ? "Study with siblings!" : "Review Physics tonight"}
                    </p>
                  </div>
                </div>
              </div>
            </SimpleCard>
          </PremiumFeatureGate>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Enhanced Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                Recent Sessions
              </h2>
              <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-lg bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-lg hover:shadow-xl">
                View All
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.2; }
          33% { transform: translateY(-8px) rotate(120deg) scale(1.1); opacity: 0.4; }
          66% { transform: translateY(-4px) rotate(240deg) scale(0.9); opacity: 0.3; }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        
        /* Glassmorphism backdrop effects */
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
        
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
        }
        
        .backdrop-saturate-150 {
          backdrop-filter: saturate(150%);
        }
      `}</style>
    </div>
  );
};
