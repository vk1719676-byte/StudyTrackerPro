import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, X, Lightbulb, Rocket, Plus, ArrowRight, TrendingDown, Users, BookMarked, GraduationCap, Waves, Mountain, Sun, Moon } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { EnhancedTextBanner } from '../components/banner/EnhancedTextBanner';
import { useAuth } from '../contexts/AuthContext';
import { getUserExams, getUserSessions } from '../services/firestore';
import { Exam, StudySession } from '../types';

// Modern hero themes with enhanced visuals
const heroThemes = [
  {
    name: 'ocean',
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    accent: 'from-blue-400 to-cyan-400',
    icon: Waves,
    particles: '🌊',
    greeting: 'Ready to dive deep into learning?',
    pattern: 'opacity-20 absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="m 20 0 l 0 20 m -10 -20 l 0 20 m -10 -20 l 0 20" stroke="white" stroke-width="0.5" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23grid)"/%3E%3C/svg%3E")]'
  },
  {
    name: 'mountain',
    gradient: 'from-emerald-600 via-green-700 to-teal-800',
    accent: 'from-emerald-400 to-green-400',
    icon: Mountain,
    particles: '🏔️',
    greeting: 'Let\'s climb the peaks of knowledge!',
    pattern: 'opacity-20 absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 0l20 40H0z" fill="white" opacity="0.1"/%3E%3C/svg%3E")]'
  },
  {
    name: 'sunset',
    gradient: 'from-orange-600 via-red-600 to-pink-700',
    accent: 'from-orange-400 to-red-400',
    icon: Sun,
    particles: '🌅',
    greeting: 'Energize your learning journey!',
    pattern: 'opacity-20 absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="30" cy="30" r="20" fill="none" stroke="white" stroke-width="2" opacity="0.2"/%3E%3C/svg%3E")]'
  },
  {
    name: 'cosmic',
    gradient: 'from-purple-600 via-indigo-700 to-blue-800',
    accent: 'from-purple-400 to-pink-400',
    icon: Star,
    particles: '✨',
    greeting: 'Reach for the stars with knowledge!',
    pattern: 'opacity-20 absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="50" height="50" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M25 0l5 20h20l-15 10 5 20-15-10-15 10 5-20-15-10h20z" fill="white" opacity="0.1"/%3E%3C/svg%3E")]'
  }
];

// Enhanced Card component with modern design
const ModernCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  gradient?: boolean;
  glow?: boolean;
}> = ({ children, className = '', hover = false, gradient = false, glow = false }) => (
  <div className={`
    group relative overflow-hidden
    ${gradient 
      ? 'bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-800' 
      : 'bg-white dark:bg-gray-800'
    }
    rounded-3xl shadow-lg border border-gray-200/60 dark:border-gray-700/60
    ${glow ? 'shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/20' : ''}
    ${hover ? 'hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/20 hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 cursor-pointer' : ''}
    transition-all duration-300
    ${className}
  `}>
    {children}
    {/* Subtle animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
  </div>
);

// Enhanced stat card with improved design
const StatCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string;
  change?: { value: number; type: 'increase' | 'decrease' };
  color: string;
  bgGradient: string;
  description?: string;
}> = ({ icon: Icon, label, value, change, color, bgGradient, description }) => (
  <ModernCard hover glow className="p-6 h-full">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 ${bgGradient} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        <Icon className={`w-6 h-6 ${color} drop-shadow-sm`} />
      </div>
      {change && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold backdrop-blur-sm ${
          change.type === 'increase' 
            ? 'text-emerald-700 bg-emerald-100/80 dark:text-emerald-400 dark:bg-emerald-900/40' 
            : 'text-red-700 bg-red-100/80 dark:text-red-400 dark:bg-red-900/40'
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
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-gray-900 dark:text-gray-100 group-hover:scale-105 transition-transform duration-300">{value}</p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{description}</p>
      )}
    </div>
  </ModernCard>
);

// Enhanced session card with more visual appeal
const SessionCard: React.FC<{
  session: StudySession;
  exam?: Exam;
  formatMinutes: (minutes: number) => string;
}> = ({ session, exam, formatMinutes }) => (
  <ModernCard hover className="p-6 h-full relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-all duration-500"></div>
    
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
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
          <div className="text-xl font-black text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-4 py-2 rounded-2xl shadow-inner">
            {formatMinutes(session.duration)}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 justify-end">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                star <= session.efficiency
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30'
                  : 'bg-gray-200 dark:bg-gray-600'
              } ${star <= session.efficiency ? 'animate-pulse' : ''}`}
              style={{ animationDelay: `${star * 100}ms` }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(session.date).toLocaleDateString()}</span>
          </div>
          {exam && (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300 truncate max-w-28 shadow-inner">
              {exam.name}
            </div>
          )}
        </div>
      </div>
    </div>
  </ModernCard>
);

// Enhanced Insight Card component
const InsightCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  value?: string;
  gradient: string;
  iconColor: string;
}> = ({ icon: Icon, title, description, value, gradient, iconColor }) => (
  <ModernCard hover className={`p-6 ${gradient} border-0 relative overflow-hidden`}>
    {/* Background pattern */}
    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-50 bg-[url('data:image/svg+xml,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.1"/></svg>')]"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="font-bold text-white text-lg">{title}</h3>
        {value && (
          <span className="ml-auto text-2xl font-black text-white/90">{value}</span>
        )}
      </div>
      <p className="text-white/80 leading-relaxed font-medium">{description}</p>
    </div>
  </ModernCard>
);

export const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState(0);
  const { user } = useAuth();

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

  // Auto-rotate themes every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme((prev) => (prev + 1) % heroThemes.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleSessionAdded = () => {
    // Sessions updated via real-time listener
  };

  // Enhanced analytics calculations
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

  // Enhanced study streak calculation
  const calculateStudyStreak = () => {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) { // Extended to check full year
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

  // Enhanced performance metrics
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
      averageSessionLength: last7Days.length > 0 ? Math.round(currentWeekTime / last7Days.length) : 0,
      totalSessions: sessions.length,
      bestStreak: calculateStudyStreak()
    };
  };

  // Upcoming deadlines
  const getUpcomingDeadlines = () => {
    const now = new Date();
    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(now.getDate() + 14);
    
    return exams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= now && examDate <= nextTwoWeeks;
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

  const getMotivationalQuote = () => {
    const quotes = [
      "Excellence is never an accident. It is always the result of high intention.",
      "The expert in anything was once a beginner.",
      "Success is the sum of small efforts, repeated day in and day out.",
      "Don't watch the clock; do what it does. Keep going.",
      "The way to get started is to quit talking and begin doing."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-400/30 to-purple-400/30 animate-ping"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Preparing Your Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Crafting your personalized learning experience...</p>
            <div className="flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
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
        
        {/* Enhanced Hero Section */}
        <div className="mb-12">
          <div className={`relative overflow-hidden bg-gradient-to-br ${currentThemeData.gradient} rounded-3xl p-8 md:p-12 text-white shadow-2xl`}>
            {/* Dynamic background pattern */}
            <div className={currentThemeData.pattern}></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                    {getTimeGreeting()}, <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text">{displayName}</span>!
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
                    {currentThemeData.greeting}
                  </p>
                  <p className="text-white/70 font-medium italic max-w-2xl">
                    "{getMotivationalQuote()}"
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                    <Calendar className="w-5 h-5 text-white/90" />
                    <span className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {studyStreak > 0 && (
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                      <Flame className="w-5 h-5 text-orange-300 animate-pulse" />
                      <span className="font-semibold">{studyStreak} day streak 🔥</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">Level {Math.floor(sessions.length / 10) + 1}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className={`p-8 bg-gradient-to-br ${currentThemeData.accent} rounded-3xl shadow-2xl backdrop-blur-sm border border-white/20 hover:scale-110 transition-all duration-500`}>
                  <ThemeIcon className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Theme indicator dots */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              {heroThemes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTheme(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTheme 
                      ? 'bg-white shadow-lg scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Text Banner */}
        <EnhancedTextBanner />

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Clock}
            label="Today's Study"
            value={formatMinutes(todaysStudyTime)}
            change={performanceMetrics.timeChange > 0 ? { value: performanceMetrics.timeChange, type: 'increase' } : undefined}
            color="text-blue-600 dark:text-blue-400"
            bgGradient="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30"
            description="Focus session completed"
          />
          <StatCard
            icon={Target}
            label="Weekly Hours"
            value={formatMinutes(weeklyStudyTime)}
            change={{ value: 12, type: 'increase' }}
            color="text-emerald-600 dark:text-emerald-400"
            bgGradient="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
            description="Consistent progress made"
          />
          <StatCard
            icon={TrendingUp}
            label="Efficiency"
            value={`${averageEfficiency.toFixed(1)}/5`}
            change={{ value: 8, type: 'increase' }}
            color="text-purple-600 dark:text-purple-400"
            bgGradient="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
            description="Average performance score"
          />
          <StatCard
            icon={Flame}
            label="Study Streak"
            value={`${studyStreak} days`}
            color="text-orange-600 dark:text-orange-400"
            bgGradient="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
            description="Keep the momentum going!"
          />
        </div>

        {/* Smart Insights Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Smart Insights</h2>
              <p className="text-gray-600 dark:text-gray-400 font-medium">AI-powered learning recommendations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InsightCard
              icon={Target}
              title="Optimal Focus"
              description="Your peak learning hours are between 9-11 AM. Mathematics shows 34% higher retention during this period."
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              iconColor="text-blue-100"
            />
            <InsightCard
              icon={TrendingUp}
              title="Progress Momentum"
              description="You've improved study efficiency by 23% this week. Consistent 25-minute sessions are working perfectly for you."
              value="+23%"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              iconColor="text-emerald-100"
            />
            <InsightCard
              icon={Lightbulb}
              title="Study Recommendation"
              description="Review Physics concepts tonight. Your brain consolidates information best 4-6 hours after initial learning."
              gradient="bg-gradient-to-br from-purple-500 to-pink-600"
              iconColor="text-purple-100"
            />
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Performance Analytics */}
          <div className="lg:col-span-2">
            <ModernCard glow className="p-8 h-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow-xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Performance Analytics</h2>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Real-time learning insights</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold shadow-inner">
                  Live Data
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Weekly Progress</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Study Time</span>
                      <span className="text-sm font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                        +{performanceMetrics.timeChange}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sessions</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {performanceMetrics.sessionsThisWeek} completed
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <Timer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Session Insights</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Duration</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatMinutes(performanceMetrics.averageSessionLength)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl shadow-sm">
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Sessions</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {performanceMetrics.totalSessions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Study Streak Visualization */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-8 border border-orange-200/50 dark:border-orange-700/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-gray-700 dark:text-gray-300 text-xl">Study Streak</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Keep the fire burning! 🔥</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-orange-600 dark:text-orange-400 block">
                      {studyStreak}
                    </span>
                    <span className="text-sm text-orange-700 dark:text-orange-500 font-bold">days</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  {[...Array(21)].map((_, i) => {
                    const dayIndex = 20 - i;
                    const hasStudied = dayIndex < studyStreak;
                    return (
                      <div
                        key={i}
                        className={`h-6 flex-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                          hasStudied 
                            ? 'bg-gradient-to-t from-orange-400 to-red-500 shadow-lg shadow-orange-400/30' 
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title={`Day ${dayIndex + 1}`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-medium">
                  Last 21 days • Your best streak: {performanceMetrics.bestStreak} days! 🏆
                </p>
              </div>
            </ModernCard>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <ModernCard glow className="p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl shadow-xl">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Deadlines</h2>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Upcoming exam schedule</p>
                </div>
              </div>
              
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-6">
                  {upcomingDeadlines.slice(0, 4).map((exam) => {
                    const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 3;
                    const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                    const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                    
                    return (
                      <div key={exam.id} className={`p-6 rounded-3xl border-l-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                        isUrgent 
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-500 shadow-red-100 dark:shadow-red-900/20' 
                          : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-500 shadow-amber-100 dark:shadow-amber-900/20'
                      } shadow-lg`}>
                        <div className="flex items-start justify-between mb-6">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-xl mb-2 truncate">
                              {exam.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                              {exam.subject}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <span className={`text-sm font-bold px-4 py-2 rounded-2xl shadow-inner ${
                              isUrgent ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40' : 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40'
                            }`}>
                              {daysUntil === 0 ? 'Today! ⏰' : daysUntil === 1 ? 'Tomorrow ⚡' : `${daysUntil} days`}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            📚 {formatMinutes(totalStudyTime)} studied
                          </span>
                          <span className={`font-bold px-4 py-2 rounded-full text-xs shadow-sm ${
                            totalStudyTime >= 300 ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40' : 
                            totalStudyTime >= 120 ? 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40' : 
                            'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/40'
                          }`}>
                            {totalStudyTime >= 300 ? '🎯 Well Prepared' : 
                             totalStudyTime >= 120 ? '📈 Good Progress' : 
                             '⚠️ Need More Time'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl mb-6 inline-block shadow-lg">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-2xl mb-3">
                    No Upcoming Deadlines
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Perfect! You're all caught up 🎉<br/>
                    Time to plan your next learning goals
                  </p>
                </div>
              )}
            </ModernCard>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <ExamCountdown exams={exams} />
          </div>
          <div>
            <StudyTimer exams={exams} onSessionAdded={handleSessionAdded} />
          </div>
        </div>

        {/* Enhanced Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl shadow-xl">
                  <BookMarked className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Recent Sessions</h2>
                  <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">Your latest learning achievements</p>
                </div>
              </div>
              <button className="group flex items-center gap-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 px-8 py-4 rounded-3xl hover:shadow-lg transition-all duration-300 border border-indigo-200/60 dark:border-indigo-700/60">
                <GraduationCap className="w-6 h-6" />
                View All Sessions
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <button className="group inline-flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-10 py-5 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  Load More Sessions
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
