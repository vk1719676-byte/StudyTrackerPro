import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Quote, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Users, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, Crown, Heart, Gift } from 'lucide-react';
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

// Enhanced Card component with glassmorphism effect
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean; gradient?: boolean }> = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false 
}) => (
  <div className={`
    ${gradient 
      ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20' 
      : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50'
    }
    rounded-2xl shadow-lg
    ${hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer' : 'transition-all duration-200'}
    ${className}
  `}>
    {children}
  </div>
);

// Enhanced stat card with better animations
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  trend?: string;
}> = ({ icon: Icon, label, value, color, bgColor, trend }) => (
  <GlassCard hover className="p-6 group">
    <div className="flex items-center justify-between mb-4">
      <div className={p-3 ${bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300}>
        <Icon className={w-6 h-6 ${color}} />
      </div>
      {trend && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
        {value}
      </p>
    </div>
  </GlassCard>
);

// Session card with enhanced design
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <GlassCard hover className="p-6 group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {session.subject}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {session.topic}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {formatMinutes(session.duration)}
        </span>
        <div className="flex items-center gap-1 mt-1 justify-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                star <= session.efficiency
                  ? 'bg-yellow-400 shadow-sm'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
        <span>{exam?.name}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  </GlassCard>
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
    message = Raksha Bandhan in ${diffDays} days! 🎋 Perfect time to study together with siblings!;
  } else if (diffDays <= 30) {
    message = Raksha Bandhan approaching in ${diffDays} days! 🎋 Plan your celebration and studies wisely!;
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
  const savedDisplayName = user ? localStorage.getItem(displayName-${user.uid}) : null;
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
      return ${hours}h ${mins}m;
    }
    return ${mins}m;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300"></p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentHeroDesign = heroDesigns[currentDesign];
  const IconComponent = currentHeroDesign.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-0 pb-20 md:pb-8">
        
        {/* Enhanced Hero Section with App Branding */}
        <div className="mb-6 -mt-20 md:-mt-0 pt-20 md:pt-6 relative overflow-hidden">
          <GlassCard 
            gradient 
            className={`${rakshabandhanInfo.shouldShow 
              ? bg-gradient-to-br ${rakshabandhanInfo.bgGradient} 
              : currentHeroDesign.background} text-white transition-all duration-1000 relative`}
          >
            <div className={`absolute inset-0 ${rakshabandhanInfo.shouldShow 
              ? 'bg-gradient-to-r from-pink-400/20 to-red-400/20' 
              : currentHeroDesign.overlay} transition-all duration-1000`} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            
            {/* Enhanced floating particles animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-sm animate-float opacity-40"
                  style={{
                    left: ${Math.random() * 100}%,
                    top: ${Math.random() * 100}%,
                    animationDelay: ${i * 0.3}s,
                    animationDuration: ${2 + Math.random() * 3}s
                  }}
                >
                  {rakshabandhanInfo.shouldShow ? 
                    (i % 3 === 0 ? '🎋' : i % 3 === 1 ? '💝' : '✨') : 
                    currentHeroDesign.particles}
                </div>
              ))}
            </div>

            <div className="relative p-4 md:p-5">
              {/* Raksha Bandhan Special Message */}
              {rakshabandhanInfo.shouldShow && (
                <div className="mb-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-pulse-soft">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg animate-bounce">{rakshabandhanInfo.emoji}</span>
                    <h2 className="text-sm font-bold text-white">Special Occasion</h2>
                  </div>
                  <p className="text-white/90 text-xs leading-relaxed">
                    {rakshabandhanInfo.message}
                  </p>
                  {rakshabandhanInfo.daysUntil > 0 && rakshabandhanInfo.daysUntil <= 7 && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                      <Gift className="w-2 h-2" />
                      <span>Plan a study session with your siblings!</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="space-y-1">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                      <span>{getCurrentGreeting()}, {displayName}!</span>
                      {isPremium && <PremiumBadge size="sm" />}
                      <div className="text-lg animate-wave">👋</div>
                    </h1>
                    <p className="text-white/80 text-xs sm:text-sm">
                      {rakshabandhanInfo.shouldShow ? 
                        "Study with festive spirit and achieve excellence!" : 
                        "Ready to conquer your academic goals today?"}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {studyStreak > 0 && (
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <Flame className="w-3 h-3" />
                        <span>{studyStreak} day streak</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <Target className="w-3 h-3" />
                      <span>Study Dashboard</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-1 ml-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl transform hover:scale-110 transition-all duration-300">
                    <IconComponent className="w-6 h-6 text-white/80" />
                  </div>
                  
                  {/* Quick Status */}
                  <div className="text-center">
                    {studyStreak > 0 && (
                      <span className="text-sm animate-pulse">
                        {studyStreak >= 14 ? '👑' : studyStreak >= 7 ? '🔥' : studyStreak >= 3 ? '⚡' : '💪'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Premium AI Insights Section */}
        {isPremium && (
          <div className="mb-8">
            <Card className="p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    StudyForge AI Assistant
                  </h2>
                  <PremiumBadge size="sm" />
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Powered by Advanced AI
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    🎯 Today's Focus
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study Mathematics with your siblings for better retention and fun!" :
                      "Based on your schedule, focus on Mathematics for optimal results."}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    📈 Performance Insight
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your efficiency peaks at 10 AM. Schedule important topics then for maximum impact.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                    ⚡ Smart Tip
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {rakshabandhanInfo.shouldShow ?
                      "Celebrate learning! Share knowledge with family for better understanding." :
                      "Take a 5-minute break every 25 minutes to maintain focus and productivity."}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Clock}
            label="Today's Study Time"
            value={formatMinutes(todaysStudyTime)}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30"
            trend={performanceMetrics.timeChange > 0 ? +${performanceMetrics.timeChange}% : ${performanceMetrics.timeChange}%}
          />
          <StatCard
            icon={Target}
            label="Weekly Study Time"
            value={formatMinutes(weeklyStudyTime)}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
            trend={${performanceMetrics.sessionsThisWeek} sessions}
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Efficiency"
            value={${averageEfficiency.toFixed(1)}/5}
            color="text-green-600 dark:text-green-400"
            bgColor="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30"
            trend={performanceMetrics.efficiencyChange > 0 ? +${performanceMetrics.efficiencyChange}% : ${performanceMetrics.efficiencyChange}%}
          />
          <StatCard
            icon={Flame}
            label="Study Streak"
            value={${studyStreak} days}
            color="text-orange-600 dark:text-orange-400"
            bgColor="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30"
            trend={studyStreak > 14 ? "👑 Legendary!" : studyStreak > 7 ? "🔥 Hot!" : studyStreak > 3 ? "💪 Strong" : "📈 Building"}
          />
        </div>

        {/* Advanced Analytics Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Performance Analytics */}
            <GlassCard className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                StudyForge Analytics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Study Time</span>
                      <span className={text-xs font-semibold ${performanceMetrics.timeChange >= 0 ? 'text-green-600' : 'text-red-600'}}>
                        {performanceMetrics.timeChange >= 0 ? '+' : ''}{performanceMetrics.timeChange}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Efficiency</span>
                      <span className={text-xs font-semibold ${performanceMetrics.efficiencyChange >= 0 ? 'text-green-600' : 'text-red-600'}}>
                        {performanceMetrics.efficiencyChange >= 0 ? '+' : ''}{performanceMetrics.efficiencyChange}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
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
              <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
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
                        className={`h-3 flex-1 rounded-sm transition-all duration-200 ${
                          hasStudied 
                            ? 'bg-orange-400 dark:bg-orange-500' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        title={${dayIndex + 1} days ago}
                      />
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            {/* Upcoming Deadlines */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Upcoming Deadlines
              </h2>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.slice(0, 4).map((exam) => {
                    const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 3;
                    const hoursUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60));
                    const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                    const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                    const averageEfficiency = studySessionsForExam.length > 0 
                      ? studySessionsForExam.reduce((total, session) => total + session.efficiency, 0) / studySessionsForExam.length 
                      : 0;
                    
                    return (
                      <div key={exam.id} className={`p-3 rounded-lg border-l-4 ${
                        isUrgent 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-400' 
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {exam.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {exam.subject}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-semibold ${
                              isUrgent ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {daysUntil === 0 
                                ? hoursUntil <= 1 ? 'Now!' : ${hoursUntil}h left
                                : daysUntil === 1 ? 'Tomorrow' : ${daysUntil} days}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(exam.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Study Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Study Progress</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatMinutes(totalStudyTime)} • {studySessionsForExam.length} sessions
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isUrgent ? 'bg-red-400' : 'bg-yellow-400'
                              }`}
                              style={{ 
                                width: ${Math.min(100, (totalStudyTime / 300) * 100)}% // Assuming 5 hours (300 min) as target
                              }}
                            />
                          </div>
                          
                          {/* Efficiency and Recommendation */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-600 dark:text-gray-400">Efficiency:</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      star <= averageEfficiency
                                        ? 'bg-yellow-400'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {/* Smart Recommendations */}
                            <div className="text-xs">
                              {totalStudyTime < 120 && daysUntil <= 3 && (
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                  📚 Study more!
                                </span>
                              )}
                              {totalStudyTime >= 300 && (
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                  ✅ Well prepared
                                </span>
                              )}
                              {totalStudyTime >= 120 && totalStudyTime < 300 && (
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                  📈 Good progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Quick Study Suggestion */}
                  {upcomingDeadlines.length > 0 && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">StudyForge Smart Tip</span>
                      </div>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        {(() => {
                          const nextExam = upcomingDeadlines[0];
                          const daysUntil = Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          const studyTime = sessions.filter(s => s.examId === nextExam.id).reduce((total, session) => total + session.duration, 0);
                          
                          if (rakshabandhanInfo.shouldShow && rakshabandhanInfo.daysUntil <= 7) {
                            return "Perfect timing! Study with family during Raksha Bandhan celebrations for better retention!";
                          } else if (daysUntil <= 1 && studyTime < 120) {
                            return "Focus on key concepts and practice problems for your upcoming exam!";
                          } else if (daysUntil <= 3) {
                            return "Review your notes and do practice tests to reinforce your knowledge.";
                          } else {
                            return "Create a study schedule and break down topics into manageable chunks.";
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No upcoming deadlines in the next 7 days
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {rakshabandhanInfo.shouldShow ? 
                      "Perfect time to celebrate and plan ahead! 🎋" :
                      "You're all caught up! 🎉"}
                  </p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* Premium Advanced Analytics Preview */}
        <div className="mb-8">
          <PremiumFeatureGate
            featureName="Advanced Performance Analytics"
            description="Get detailed insights into your study patterns, AI-powered recommendations, and performance predictions powered by StudyForge AI"
            className="min-h-[300px]"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                StudyForge Advanced Analytics Dashboard
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Study Efficiency Trends</h3>
                  <div className="h-20 bg-blue-200 dark:bg-blue-800 rounded flex items-end justify-around p-2">
                    <div className="bg-blue-500 w-4 h-8 rounded-t"></div>
                    <div className="bg-blue-500 w-4 h-12 rounded-t"></div>
                    <div className="bg-blue-500 w-4 h-16 rounded-t"></div>
                    <div className="bg-blue-500 w-4 h-10 rounded-t"></div>
                    <div className="bg-blue-500 w-4 h-14 rounded-t"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-400 mb-2">AI Performance Predictions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Math Exam</span>
                      <span className="text-sm font-bold text-green-600">94% Ready</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Physics Test</span>
                      <span className="text-sm font-bold text-yellow-600">78% Ready</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-400 mb-2">AI Recommendations</h3>
                  <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                    <p>• Study Math at 10 AM for best results</p>
                    <p>• Take breaks every 25 minutes</p>
                    <p>• {rakshabandhanInfo.shouldShow ? "Study with siblings today!" : "Review Physics notes tonight"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </PremiumFeatureGate>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                Recent Study Sessions
                <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                  StudyForge Tracked
                </div>
              </h2>
              <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                View All Sessions
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
