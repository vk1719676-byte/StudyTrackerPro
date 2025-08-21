import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, X, Lightbulb, Rocket } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

// Simple hero designs
const heroThemes = [
  {
    name: 'blue',
    gradient: 'from-blue-500 to-purple-600',
    icon: Sparkles,
    particles: '✨',
    greeting: 'Ready to learn something amazing?'
  },
  {
    name: 'green',
    gradient: 'from-green-500 to-teal-600',
    icon: Target,
    particles: '🎯',
    greeting: 'Let\'s achieve your goals today!'
  },
  {
    name: 'orange',
    gradient: 'from-orange-500 to-red-600',
    icon: Zap,
    particles: '⚡',
    greeting: 'Power up your learning!'
  },
  {
    name: 'purple',
    gradient: 'from-purple-500 to-pink-600',
    icon: Star,
    particles: '🌟',
    greeting: 'Shine bright with knowledge!'
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

// Simple notice types
const notices = [
  {
    id: 'tip',
    icon: Lightbulb,
    title: 'Study Tip',
    message: 'Take breaks every 25 minutes to improve focus and retention.',
    color: 'yellow',
    duration: 6000
  },
  {
    id: 'motivate',
    icon: Rocket,
    title: 'Keep Going!',
    message: 'Every study session brings you closer to your goals.',
    color: 'purple',
    duration: 7000
  },
  {
    id: 'feature',
    icon: Star,
    title: 'New Features',
    message: 'Explore enhanced analytics and AI recommendations.',
    color: 'blue',
    duration: 8000
  }
];

// Simple Notice Component
const SimpleNotice: React.FC<{ studyStreak: number }> = ({ studyStreak }) => {
  const [currentNotice, setCurrentNotice] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Rotate notices
  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, notices[currentNotice]?.duration || 6000);
    return () => clearInterval(interval);
  }, [currentNotice, dismissed]);

  if (dismissed) return null;

  const notice = notices[currentNotice];
  const IconComponent = notice.icon;

  const colorClasses = {
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  };

  return (
    <div className="mb-6">
      <div className={`
        rounded-lg border p-4 transition-all duration-300 hover:shadow-md
        ${colorClasses[notice.color as keyof typeof colorClasses]}
      `}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-sm">{notice.title}</h3>
                <p className="text-sm opacity-80 mt-1">{notice.message}</p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="p-1 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded transition-colors"
              >
                <X className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>
        </div>
      </div>
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

export const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { user, isPremium } = useAuth();

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

  // Change theme every 20 seconds
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % heroThemes.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [mounted]);

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

  // Get current time greeting
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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

  const currentThemeData = heroThemes[currentTheme];
  const ThemeIcon = currentThemeData.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-6 pb-20 md:pb-8">
        
        {/* Simple Notice */}
        <SimpleNotice studyStreak={studyStreak} />
        
        {/* Clean Hero Section */}
        <div className="mb-8">
          <div className={`bg-gradient-to-r ${currentThemeData.gradient} text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden`}>
            {/* Subtle particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-pulse"
                  style={{
                    left: `${25 + (i * 20)}%`,
                    top: `${30 + (i % 2) * 30}%`,
                    animationDelay: `${i * 1}s`,
                    animationDuration: '4s'
                  }}
                >
                  {currentThemeData.particles}
                </div>
              ))}
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {getTimeGreeting()}, {displayName}!
                  </h1>
                  {isPremium && <PremiumBadge size="sm" />}
                </div>
                
                <p className="text-white/90 text-lg mb-4">
                  {currentThemeData.greeting}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {studyStreak > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                      <Flame className="w-4 h-4" />
                      <span>{studyStreak} day streak</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="hidden sm:block">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <ThemeIcon className="w-12 h-12" />
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
                    Focus on Mathematics for optimal results. Your peak performance window is approaching.
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
                    Take breaks every 25 minutes for better focus. Your brain needs time to consolidate.
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
                  "You're all caught up! 🎉"
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
                      <span className="text-lg">📚</span> Review Physics tonight
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
