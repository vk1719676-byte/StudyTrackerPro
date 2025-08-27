import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, X, Lightbulb, Rocket, Plus, ArrowRight, TrendingDown, Users, Bell } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { EnhancedTextBanner } from '../components/banner/EnhancedTextBanner';
import { AlarmManager } from '../components/alarms/AlarmManager';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

// Modern hero themes
const heroThemes = [
  {
    name: 'ocean',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    accent: 'from-blue-400 to-cyan-400',
    icon: Sparkles,
    particles: '✨',
    greeting: 'Ready to dive deep into learning?'
  },
  {
    name: 'forest',
    gradient: 'from-emerald-600 via-green-700 to-teal-800',
    accent: 'from-emerald-400 to-green-400',
    icon: Target,
    particles: '🎯',
    greeting: 'Let\'s grow your knowledge today!'
  },
  {
    name: 'sunset',
    gradient: 'from-orange-600 via-red-600 to-pink-700',
    accent: 'from-orange-400 to-red-400',
    icon: Zap,
    particles: '⚡',
    greeting: 'Energize your learning journey!'
  },
  {
    name: 'cosmic',
    gradient: 'from-purple-600 via-indigo-700 to-blue-800',
    accent: 'from-purple-400 to-pink-400',
    icon: Star,
    particles: '🌟',
    greeting: 'Reach for the stars with knowledge!'
  }
];

// Enhanced Card component with modern design
const ModernCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  gradient?: boolean;
}> = ({ children, className = '', hover = false, gradient = false }) => (
  <div className={`
    group relative overflow-hidden
    ${gradient 
      ? 'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800' 
      : 'bg-white dark:bg-gray-800'
    }
    rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-700/60
    ${hover ? 'hover:shadow-xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/20 hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:-translate-y-1 transition-all duration-500 cursor-pointer' : ''}
    transition-all duration-300
    ${className}
  `}>
    {children}
  </div>
);

// Modern stat card with improved design
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  change?: { value: number; type: 'increase' | 'decrease' };
  color: string;
  bgGradient: string;
}> = ({ icon: Icon, label, value, change, color, bgGradient }) => (
  <ModernCard hover className="p-6 h-full">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 ${bgGradient} rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-500`}>
        <Icon className={`w-6 h-6 ${color} drop-shadow-sm`} />
      </div>
      {change && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold ${
          change.type === 'increase' 
            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
        }`}>
          {change.type === 'increase' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {Math.abs(change.value)}%
        </div>
      )}
    </div>
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  </ModernCard>
);

// Enhanced session card
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <ModernCard hover className="p-6 h-full">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-md group-hover:scale-110 transition-all duration-300">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg truncate mb-1">
            {session.subject}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {session.topic}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <div className="text-xl font-black text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-xl">
          {formatMinutes(session.duration)}
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center gap-1 justify-end">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              star <= session.efficiency
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm'
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        {exam && (
          <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300 truncate max-w-24">
            {exam.name}
          </div>
        )}
      </div>
    </div>
  </ModernCard>
);

export const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [showAlarms, setShowAlarms] = useState(false);
  const { user, isPremium } = useAuth();

  // Get display name
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null;
  const displayName = savedDisplayName || user?.displayName || user?.email?.split('@')[0];

  useEffect(() => {
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

  // Auto-rotate themes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % heroThemes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSessionAdded = () => {
    // Sessions updated via real-time listener
  };

  // Analytics calculations
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

  // Study streak calculation
  const calculateStudyStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasSessionOnDate = sortedSessions.some(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });
      
      if (hasSessionOnDate) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  // Performance metrics
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

    return {
      timeChange: Math.round(timeChange),
      sessionsThisWeek: last7Days.length,
      averageSessionLength: last7Days.length > 0 ? Math.round(currentWeekTime / last7Days.length) : 0
    };
  };

  // Upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= now && examDate <= nextWeek;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Preparing Your Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400">Loading your personalized learning insights...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentThemeData = heroThemes[currentTheme];
  const ThemeIcon = currentThemeData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-8 pb-24 md:pb-12">
        
        {/* Enhanced Text Banner */}
        <EnhancedTextBanner />
        
        {/* Modern Hero Section */}
        <div className="mb-10">
          <div className={`relative overflow-hidden bg-gradient-to-br ${currentThemeData.gradient} rounded-3xl p-8 md:p-12 text-white shadow-2xl`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2">
                      {getTimeGreeting()}, {displayName}!
                    </h1>
                    <p className="text-xl text-white/90 font-medium">
                      {currentThemeData.greeting}
                    </p>
                  </div>
                  {isPremium && <PremiumBadge size="lg" />}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {studyStreak > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <Flame className="w-4 h-4" />
                      <span>{studyStreak} day streak</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                    <Users className="w-4 h-4" />
                    <span>Level {Math.floor(sessions.length / 10) + 1}</span>
                  </div>
                  <button
                    onClick={() => setShowAlarms(!showAlarms)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl px-4 py-2 transition-all duration-300"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Alarms</span>
                  </button>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className={`p-6 bg-gradient-to-br ${currentThemeData.accent} rounded-3xl shadow-2xl backdrop-blur-sm`}>
                  <ThemeIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Alarms Section */}
        {showAlarms && (
          <div className="mb-10">
            <AlarmManager exams={exams} sessions={sessions} />
          </div>
        )}

        {/* Premium AI Section */}
        {isPremium && (
          <div className="mb-10">
            <ModernCard className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-indigo-200/60 dark:border-indigo-700/60">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">AI Study Assistant</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Personalized insights powered by machine learning</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <PremiumBadge size="lg" />
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">🎯</div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Today's Focus</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Mathematics shows the highest retention rate in your morning sessions. Optimal focus window: 9-11 AM.
                  </p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 dark:border-gray-700/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">📊</div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Performance Trend</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your efficiency has improved 23% this week. Consistent 25-minute sessions are working perfectly.
                  </p>
                </div>
                
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 dark:border-gray-700/60 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">💡</div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Smart Recommendation</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Review Physics concepts tonight. Your brain consolidates information best 4-6 hours after learning.
                  </p>
                </div>
              </div>
            </ModernCard>
          </div>
        )}

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10">
          <StatCard
            icon={Clock}
            label="Today's Study"
            value={formatMinutes(todaysStudyTime)}
            change={performanceMetrics.timeChange > 0 ? { value: performanceMetrics.timeChange, type: 'increase' } : undefined}
            color="text-blue-600 dark:text-blue-400"
            bgGradient="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
          />
          <StatCard
            icon={Target}
            label="Weekly Hours"
            value={formatMinutes(weeklyStudyTime)}
            change={{ value: 12, type: 'increase' }}
            color="text-emerald-600 dark:text-emerald-400"
            bgGradient="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
          />
          <StatCard
            icon={TrendingUp}
            label="Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            change={{ value: 8, type: 'increase' }}
            color="text-purple-600 dark:text-purple-400"
            bgGradient="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
          />
          <StatCard
            icon={Flame}
            label="Study Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgGradient="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
          />
        </div>

        {/* Analytics and Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Performance Analytics */}
          <div className="lg:col-span-2">
            <ModernCard className="p-8 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h2>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold">
                  Real-time Data
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Weekly Progress</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Study Time</span>
                      <span className="text-sm font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        +{performanceMetrics.timeChange}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sessions</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {performanceMetrics.sessionsThisWeek} completed
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Session Insights</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Duration</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatMinutes(performanceMetrics.averageSessionLength)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Best Time</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        10:00 AM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Study Streak Visualization */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-6 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300">Study Streak</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400">
                    {studyStreak} days
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {[...Array(14)].map((_, i) => {
                    const dayIndex = 13 - i;
                    const hasStudied = dayIndex < studyStreak;
                    return (
                      <div
                        key={i}
                        className={`h-4 flex-1 rounded-lg transition-all duration-300 ${
                          hasStudied 
                            ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Last 14 days • Keep the momentum! 🔥
                </p>
              </div>
            </ModernCard>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <ModernCard className="p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl shadow-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Deadlines</h2>
              </div>
              
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0, 4).map((exam) => {
                    const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 3;
                    const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                    const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                    
                    return (
                      <div key={exam.id} className={`p-5 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-lg ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-500' 
                          : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 truncate">
                              {exam.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {exam.subject}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className={`text-sm font-bold px-3 py-2 rounded-xl ${
                              isUrgent ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40'
                            }`}>
                              {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatMinutes(totalStudyTime)} studied
                          </span>
                          <span className={`font-bold px-3 py-1 rounded-full text-xs ${
                            totalStudyTime >= 300 ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' : 
                            totalStudyTime >= 120 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' : 
                            'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40'
                          }`}>
                            {totalStudyTime >= 300 ? 'Well Prepared' : 
                             totalStudyTime >= 120 ? 'Good Progress' : 'Need More Time'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-6 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl mb-4 inline-block">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
                    No Upcoming Deadlines
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Great! You're all caught up 🎉
                  </p>
                </div>
              )}
            </ModernCard>
          </div>
        </div>

        {/* Premium Advanced Analytics */}
        <div className="mb-10">
          <PremiumFeatureGate
            featureName="Advanced Analytics Dashboard"
            description="Unlock detailed insights, AI predictions, and personalized recommendations"
            className="min-h-[300px]"
          >
            <ModernCard className="p-8 border-2 border-indigo-200/60 dark:border-indigo-700/60">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Advanced Analytics</h2>
                  <p className="text-gray-600 dark:text-gray-400">Deep insights into your learning patterns</p>
                </div>
                <div className="ml-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold">
                  Premium Feature
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-6 text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Learning Curves
                  </h3>
                  <div className="h-24 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-2xl flex items-end justify-around p-4">
                    {[6, 8, 12, 9, 14, 11, 16].map((height, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg shadow-lg"
                        style={{ width: '10px', height: `${height * 3}px` }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-4 font-medium">
                    Your learning velocity is increasing consistently
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-3xl p-6 border border-emerald-200/50 dark:border-emerald-700/50">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-400 mb-6 text-xl flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI Predictions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                      <span className="font-medium">Math Exam</span>
                      <span className="font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                        92% Success
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                      <span className="font-medium">Physics Quiz</span>
                      <span className="font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                        78% Success
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                  <h3 className="font-bold text-purple-900 dark:text-purple-400 mb-6 text-xl flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Smart Tips
                  </h3>
                  <div className="space-y-3">
                    {['Study Math at 9 AM for peak focus', 'Take 5-min breaks every 25 minutes', 'Review notes within 24 hours'].map((tip, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
                        <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ModernCard>
          </PremiumFeatureGate>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Recent Sessions</h2>
                  <p className="text-gray-600 dark:text-gray-400">Your latest study activities</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-6 py-3 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all duration-300 group">
                View All Sessions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            {sessions.length > 6 && (
              <div className="text-center">
                <button className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Plus className="w-5 h-5" />
                  Load More Sessions
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
