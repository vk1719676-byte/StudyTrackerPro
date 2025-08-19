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

// Enhanced Card component with advanced glassmorphism and neon effects
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean; gradient?: boolean; neon?: boolean }> = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  neon = false 
}) => (
  <div className={`
    ${gradient 
      ? 'bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30' 
      : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60'
    }
    rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30
    ${neon ? 'ring-1 ring-blue-400/50 shadow-blue-500/20 dark:shadow-blue-400/20' : ''}
    ${hover ? 'hover:shadow-3xl hover:shadow-black/20 hover:scale-[1.02] hover:-translate-y-2 hover:ring-2 hover:ring-blue-400/30 transition-all duration-500 ease-out cursor-pointer group' : 'transition-all duration-300'}
    relative overflow-hidden
    ${className}
  `}>
    {/* Subtle gradient overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none rounded-3xl" />
    {/* Animated border glow effect */}
    {hover && (
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />
    )}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Enhanced stat card with advanced animations and progress rings
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  trend?: string;
  progress?: number;
}> = ({ icon: Icon, label, value, color, bgColor, trend, progress = 0 }) => (
  <GlassCard hover neon className="p-8 group relative overflow-hidden">
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-blue-900/20 dark:via-gray-800/50 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 ${bgColor} rounded-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg relative`}>
          <Icon className={`w-7 h-7 ${color} drop-shadow-sm`} />
          {/* Icon glow effect */}
          <div className={`absolute inset-0 ${bgColor} rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
        </div>
        {trend && (
          <div className="relative">
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100/80 dark:bg-green-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-green-200/50 dark:border-green-700/50">
              {trend}
            </span>
            {/* Trend glow effect */}
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">{label}</p>
        <p className="text-4xl font-black text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-500 tracking-tight">
          {value}
        </p>
        
        {/* Progress ring indicator */}
        {progress > 0 && (
          <div className="flex items-center gap-3 mt-4">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-200 dark:text-gray-700" />
                <circle 
                  cx="16" 
                  cy="16" 
                  r="14" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray={`${progress * 0.88} 88`}
                  strokeLinecap="round"
                  className="text-blue-500 transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% complete
            </span>
          </div>
        )}
      </div>
    </div>
  </GlassCard>
);

// Enhanced session card with premium design elements
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <GlassCard hover className="p-7 group overflow-hidden">
    {/* Animated background pattern */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
    </div>
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-blue-200/30 dark:border-blue-700/30">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 tracking-tight">
              {session.subject}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {session.topic}
            </p>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <span className="text-2xl font-black text-gray-900 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
            {formatMinutes(session.duration)}
          </span>
          <div className="flex items-center gap-1 justify-end">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-125 ${
                  star <= session.efficiency
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
                style={{ transitionDelay: `${star * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="p-1.5 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-medium">{new Date(session.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
          <span className="font-semibold">{exam?.name}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="text-center space-y-8 relative z-10">
          <div className="relative">
            {/* Multiple loading rings */}
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200/30 dark:border-gray-700/30 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2" style={{ animationDuration: '1.5s' }}></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent absolute top-2 left-1/2 transform -translate-x-1/2" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                StudyForge Loading...
              </h2>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preparing your dashboard</p>
            </div>
            
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '200ms' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentHeroDesign = heroDesigns[currentDesign];
  const IconComponent = currentHeroDesign.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-all duration-1000 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-purple-400/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-400/5 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '6s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-0 pb-20 md:pb-8 relative z-10">
        
        {/* Enhanced Hero Section with App Branding */}
        <div className="mb-8 -mt-20 md:-mt-0 pt-20 md:pt-6 relative overflow-hidden">
          <GlassCard 
            gradient 
            className={`${rakshabandhanInfo.shouldShow 
              ? `bg-gradient-to-br ${rakshabandhanInfo.bgGradient}` 
              : currentHeroDesign.background} text-white transition-all duration-1000 relative overflow-hidden`}
          >
            <div className={`absolute inset-0 ${rakshabandhanInfo.shouldShow 
              ? 'bg-gradient-to-r from-pink-400/20 to-red-400/20' 
              : currentHeroDesign.overlay} transition-all duration-1000`} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
            
            {/* Enhanced floating particles animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-lg animate-float opacity-30 hover:opacity-60 transition-opacity duration-300"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                    fontSize: `${12 + Math.random() * 8}px`
                  }}
                >
                  {rakshabandhanInfo.shouldShow ? 
                    (i % 4 === 0 ? '🎋' : i % 4 === 1 ? '💝' : i % 4 === 2 ? '✨' : '🌟') : 
                    currentHeroDesign.particles}
                </div>
              ))}
            </div>

            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `
            }} />

            <div className="relative p-6 md:p-8">
              {/* Raksha Bandhan Special Message */}
              {rakshabandhanInfo.shouldShow && (
                <div className="mb-6 p-5 bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 animate-pulse-soft shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl animate-bounce">{rakshabandhanInfo.emoji}</span>
                    <h2 className="text-lg font-black text-white tracking-wide">Special Occasion</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                  </div>
                  <p className="text-white/95 text-sm leading-relaxed font-medium">
                    {rakshabandhanInfo.message}
                  </p>
                  {rakshabandhanInfo.daysUntil > 0 && rakshabandhanInfo.daysUntil <= 7 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-white/90">
                      <Gift className="w-4 h-4" />
                      <span className="font-semibold">Plan a study session with your siblings!</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black flex items-center gap-3 tracking-tight">
                      <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                        {getCurrentGreeting()}, {displayName}!
                      </span>
                      {isPremium && <PremiumBadge size="sm" />}
                      <div className="text-2xl animate-wave">👋</div>
                    </h1>
                    <p className="text-white/90 text-base sm:text-lg font-medium max-w-2xl">
                      {rakshabandhanInfo.shouldShow ? 
                        "Study with festive spirit and achieve excellence!" : 
                        "Ready to conquer your academic goals today?"}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    {studyStreak > 0 && (
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg">
                        <Flame className="w-4 h-4 text-orange-300" />
                        <span className="font-bold">{studyStreak} day streak</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-lg">
                      <Target className="w-4 h-4" />
                      <span className="font-semibold">StudyForge Dashboard</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-3 ml-6">
                  <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl transform hover:scale-125 hover:rotate-12 transition-all duration-500 border border-white/30 shadow-2xl group">
                    <IconComponent className="w-8 h-8 text-white/90 group-hover:text-white transition-colors duration-300" />
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>
                  
                  {/* Enhanced Quick Status */}
                  <div className="text-center">
                    {studyStreak > 0 && (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-2xl animate-pulse">
                          {studyStreak >= 14 ? '👑' : studyStreak >= 7 ? '🔥' : studyStreak >= 3 ? '⚡' : '💪'}
                        </span>
                        <span className="text-xs text-white/80 font-bold">
                          {studyStreak >= 14 ? 'Legendary' : studyStreak >= 7 ? 'On Fire!' : studyStreak >= 3 ? 'Strong' : 'Growing'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Premium AI Insights Section */}
        {isPremium && (
          <div className="mb-10">
            <GlassCard className="p-8 bg-gradient-to-r from-purple-50/80 via-blue-50/80 to-indigo-50/80 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-indigo-900/30 border border-purple-200/60 dark:border-purple-700/60">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">
                      StudyForge AI Assistant
                    </h2>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                      Powered by Advanced Machine Learning
                    </p>
                  </div>
                  <PremiumBadge size="sm" />
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-bold bg-purple-100/80 dark:bg-purple-900/40 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50">
                  AI Powered ✨
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard hover className="bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-800/60 p-6 border border-purple-100/60 dark:border-purple-800/60">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-lg">
                    🎯 Today's AI Focus
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {rakshabandhanInfo.shouldShow ? 
                      "Study Mathematics with your siblings for better retention and fun!" :
                      "Based on your schedule, focus on Mathematics for optimal results."}
                  </p>
                </GlassCard>
                
                <GlassCard hover className="bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-800/60 p-6 border border-blue-100/60 dark:border-blue-800/60">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-lg">
                    📈 Smart Performance Insight
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your efficiency peaks at 10 AM. Schedule important topics then for maximum impact.
                  </p>
                </GlassCard>
                
                <GlassCard hover className="bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-800/60 p-6 border border-green-100/60 dark:border-green-800/60">
                  <h3 className="font-black text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-lg">
                    ⚡ AI Smart Tip
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {rakshabandhanInfo.shouldShow ?
                      "Celebrate learning! Share knowledge with family for better understanding." :
                      "Take a 5-minute break every 25 minutes to maintain focus and productivity."}
                  </p>
                </GlassCard>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            icon={Clock}
            label="Today's Study Time"
            value={formatMinutes(todaysStudyTime)}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-gradient-to-br from-blue-100/80 to-blue-200/80 dark:from-blue-900/40 dark:to-blue-800/40"
            trend={performanceMetrics.timeChange > 0 ? `+${performanceMetrics.timeChange}%` : `${performanceMetrics.timeChange}%`}
            progress={Math.min(100, (todaysStudyTime / 480) * 100)} // 8 hours target
          />
          <StatCard
            icon={Target}
            label="Weekly Study Time"
            value={formatMinutes(weeklyStudyTime)}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-gradient-to-br from-purple-100/80 to-purple-200/80 dark:from-purple-900/40 dark:to-purple-800/40"
            trend={`${performanceMetrics.sessionsThisWeek} sessions`}
            progress={Math.min(100, (weeklyStudyTime / 2100) * 100)} // 35 hours target
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            color="text-green-600 dark:text-green-400"
            bgColor="bg-gradient-to-br from-green-100/80 to-green-200/80 dark:from-green-900/40 dark:to-green-800/40"
            trend={performanceMetrics.efficiencyChange > 0 ? `+${performanceMetrics.efficiencyChange}%` : `${performanceMetrics.efficiencyChange}%`}
            progress={(averageEfficiency / 5) * 100}
          />
          <StatCard
            icon={Flame}
            label="Study Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgColor="bg-gradient-to-br from-orange-100/80 to-orange-200/80 dark:from-orange-900/40 dark:to-orange-800/40"
            trend={studyStreak > 14 ? "👑 Legendary!" : studyStreak > 7 ? "🔥 Hot!" : studyStreak > 3 ? "💪 Strong" : "📈 Building"}
            progress={Math.min(100, (studyStreak / 30) * 100)} // 30 days max
          />
        </div>

        {/* Advanced Analytics Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Performance Analytics */}
            <GlassCard className="p-8 lg:col-span-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                StudyForge Analytics
                <div className="text-xs bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full font-bold">
                  Advanced
                </div>
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <GlassCard className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 dark:from-blue-900/30 dark:to-blue-800/30 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Weekly Progress</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Study Time</span>
                      <span className={`text-sm font-black px-3 py-1 rounded-full ${performanceMetrics.timeChange >= 0 ? 'text-green-600 bg-green-100/80 dark:bg-green-900/40' : 'text-red-600 bg-red-100/80 dark:bg-red-900/40'}`}>
                        {performanceMetrics.timeChange >= 0 ? '+' : ''}{performanceMetrics.timeChange}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Efficiency</span>
                      <span className={`text-sm font-black px-3 py-1 rounded-full ${performanceMetrics.efficiencyChange >= 0 ? 'text-green-600 bg-green-100/80 dark:bg-green-900/40' : 'text-red-600 bg-red-100/80 dark:bg-red-900/40'}`}>
                        {performanceMetrics.efficiencyChange >= 0 ? '+' : ''}{performanceMetrics.efficiencyChange}%
                      </span>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 dark:from-purple-900/30 dark:to-purple-800/30 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Session Insights</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Length</span>
                      <span className="text-sm font-black text-gray-900 dark:text-gray-100 bg-purple-100/80 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                        {formatMinutes(performanceMetrics.averageSessionLength)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">This Week</span>
                      <span className="text-sm font-black text-gray-900 dark:text-gray-100 bg-purple-100/80 dark:bg-purple-900/40 px-3 py-1 rounded-full">
                        {performanceMetrics.sessionsThisWeek} sessions
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </div>
              
              {/* Enhanced Study Streak Visualization */}
              <GlassCard className="bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-900/30 dark:to-red-900/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Study Streak Tracker</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-orange-600 dark:text-orange-400">{studyStreak}</span>
                    <p className="text-sm text-orange-600/80 dark:text-orange-400/80 font-semibold">days strong</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {[...Array(14)].map((_, i) => {
                    const dayIndex = 13 - i;
                    const hasStudied = dayIndex < studyStreak;
                    return (
                      <div
                        key={i}
                        className={`h-4 flex-1 rounded-lg transition-all duration-500 relative overflow-hidden ${
                          hasStudied 
                            ? 'bg-gradient-to-t from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-400 shadow-lg' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        title={`${dayIndex + 1} days ago`}
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        {hasStudied && (
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/40 animate-shimmer" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                  Last 14 days • {studyStreak >= 7 ? 'Amazing consistency! 🎉' : 'Keep building your streak! 💪'}
                </p>
              </GlassCard>
            </GlassCard>

            {/* Enhanced Upcoming Deadlines */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                Upcoming Deadlines
              </h2>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
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
                      <GlassCard key={exam.id} hover className={`p-5 border-l-4 ${
                        isUrgent 
                          ? 'bg-gradient-to-br from-red-50/80 to-red-100/80 dark:from-red-900/30 dark:to-red-800/30 border-red-400' 
                          : 'bg-gradient-to-br from-yellow-50/80 to-yellow-100/80 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-400'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-black text-gray-900 dark:text-gray-100 text-base">
                              {exam.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                              {exam.subject}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-black px-3 py-1.5 rounded-full ${
                              isUrgent 
                                ? 'text-red-600 dark:text-red-400 bg-red-100/80 dark:bg-red-900/40' 
                                : 'text-yellow-600 dark:text-yellow-400 bg-yellow-100/80 dark:bg-yellow-900/40'
                            }`}>
                              {daysUntil === 0 
                                ? hoursUntil <= 1 ? 'Now!' : `${hoursUntil}h left`
                                : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                              {new Date(exam.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {/* Enhanced Study Progress */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 font-semibold">Study Progress</span>
                            <span className="font-black text-gray-900 dark:text-gray-100 bg-gray-100/80 dark:bg-gray-700/80 px-3 py-1 rounded-full">
                              {formatMinutes(totalStudyTime)} • {studySessionsForExam.length} sessions
                            </span>
                          </div>
                          
                          {/* Enhanced Progress Bar */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                            <div 
                              className={`h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                isUrgent ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                              }`}
                              style={{ 
                                width: `${Math.min(100, (totalStudyTime / 300) * 100)}%` // Assuming 5 hours (300 min) as target
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>
                          </div>
                          
                          {/* Enhanced Efficiency and Recommendation */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Efficiency:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <div
                                    key={star}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      star <= averageEfficiency
                                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                    style={{ transitionDelay: `${star * 100}ms` }}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {/* Enhanced Smart Recommendations */}
                            <div className="text-sm">
                              {totalStudyTime < 120 && daysUntil <= 3 && (
                                <span className="text-red-600 dark:text-red-400 font-black bg-red-100/80 dark:bg-red-900/40 px-2 py-1 rounded-full">
                                  📚 Study more!
                                </span>
                              )}
                              {totalStudyTime >= 300 && (
                                <span className="text-green-600 dark:text-green-400 font-black bg-green-100/80 dark:bg-green-900/40 px-2 py-1 rounded-full">
                                  ✅ Well prepared
                                </span>
                              )}
                              {totalStudyTime >= 120 && totalStudyTime < 300 && (
                                <span className="text-blue-600 dark:text-blue-400 font-black bg-blue-100/80 dark:bg-blue-900/40 px-2 py-1 rounded-full">
                                  📈 Good progress
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                  
                  {/* Enhanced Quick Study Suggestion */}
                  {upcomingDeadlines.length > 0 && (
                    <GlassCard className="mt-6 p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-800/60">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-black text-blue-900 dark:text-blue-100">StudyForge AI Smart Tip</span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
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
                    </GlassCard>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse" />
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    No upcoming deadlines in the next 7 days
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
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
        <div className="mb-12">
          <PremiumFeatureGate
            featureName="Advanced Performance Analytics"
            description="Get detailed insights into your study patterns, AI-powered recommendations, and performance predictions powered by StudyForge AI"
            className="min-h-[300px]"
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                StudyForge Advanced Analytics Dashboard
                <div className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full font-bold">
                  Premium AI
                </div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GlassCard hover className="bg-gradient-to-br from-blue-50/90 to-blue-100/90 dark:from-blue-900/40 dark:to-blue-800/40 p-6">
                  <h3 className="font-black text-blue-900 dark:text-blue-400 mb-4 text-xl">Study Efficiency Trends</h3>
                  <div className="h-24 bg-blue-200/80 dark:bg-blue-800/80 rounded-2xl flex items-end justify-around p-3 mb-4 shadow-inner">
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 h-10 rounded-t-lg shadow-lg transition-all duration-500 hover:scale-110"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 h-16 rounded-t-lg shadow-lg transition-all duration-500 hover:scale-110" style={{ transitionDelay: '100ms' }}></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 h-20 rounded-t-lg shadow-lg transition-all duration-500 hover:scale-110" style={{ transitionDelay: '200ms' }}></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 h-14 rounded-t-lg shadow-lg transition-all duration-500 hover:scale-110" style={{ transitionDelay: '300ms' }}></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-6 h-18 rounded-t-lg shadow-lg transition-all duration-500 hover:scale-110" style={{ transitionDelay: '400ms' }}></div>
                  </div>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300/80 font-semibold">AI-powered performance tracking</p>
                </GlassCard>
                
                <GlassCard hover className="bg-gradient-to-br from-green-50/90 to-green-100/90 dark:from-green-900/40 dark:to-green-800/40 p-6">
                  <h3 className="font-black text-green-900 dark:text-green-400 mb-4 text-xl">AI Performance Predictions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      <span className="font-semibold">Math Exam</span>
                      <span className="font-black text-green-600 bg-green-100/80 dark:bg-green-900/40 px-3 py-1 rounded-full">94% Ready</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      <span className="font-semibold">Physics Test</span>
                      <span className="font-black text-yellow-600 bg-yellow-100/80 dark:bg-yellow-900/40 px-3 py-1 rounded-full">78% Ready</span>
                    </div>
                  </div>
                  <p className="text-xs text-green-700/80 dark:text-green-300/80 font-semibold mt-4">Machine learning predictions</p>
                </GlassCard>
                
                <GlassCard hover className="bg-gradient-to-br from-purple-50/90 to-purple-100/90 dark:from-purple-900/40 dark:to-purple-800/40 p-6">
                  <h3 className="font-black text-purple-900 dark:text-purple-400 mb-4 text-xl">AI Recommendations</h3>
                  <div className="space-y-3 text-sm text-purple-700 dark:text-purple-300 font-medium">
                    <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      • Study Math at 10 AM for best results
                    </div>
                    <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      • Take breaks every 25 minutes
                    </div>
                    <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                      • {rakshabandhanInfo.shouldShow ? "Study with siblings today!" : "Review Physics notes tonight"}
                    </div>
                  </div>
                  <p className="text-xs text-purple-700/80 dark:text-purple-300/80 font-semibold mt-4">Personalized AI insights</p>
                </GlassCard>
              </div>
            </GlassCard>
          </PremiumFeatureGate>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Enhanced Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                Recent Study Sessions
                <div className="text-sm bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-black">
                  StudyForge Tracked
                </div>
              </h2>
              <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black transition-all duration-300 hover:scale-105 bg-blue-50/80 dark:bg-blue-900/40 px-4 py-2 rounded-xl backdrop-blur-sm">
                View All Sessions
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};
