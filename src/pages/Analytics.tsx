import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Calendar, Award, BookOpen, ArrowUp, ArrowDown, Activity, Flame, Trophy, Gift } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, differenceInDays, isToday, isYesterday, subDays } from 'date-fns';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredStreakCard, setHoveredStreakCard] = useState<string | null>(null);
  const [hoveredCalendarDay, setHoveredCalendarDay] = useState<string | null>(null);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribeSessions = getUserSessions(user.uid, (sessionData) => {
      setSessions(sessionData);
      setLoading(false);
    });

    const unsubscribeExams = getUserExams(user.uid, (examData) => {
      setExams(examData);
    });

    return () => {
      unsubscribeSessions();
      unsubscribeExams();
    };
  }, [user]);

  // Study Streak Calculation
  const calculateStudyStreak = () => {
    if (sessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, streakDates: [] };
    }

    // Get unique study dates and sort them
    const studyDates = [...new Set(sessions.map(session => format(new Date(session.date), 'yyyy-MM-dd')))]
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let streakDates = [];

    // Check if today or yesterday has a study session
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    const hasStudiedToday = studyDates.includes(today);
    const hasStudiedYesterday = studyDates.includes(yesterday);

    // Calculate current streak
    if (hasStudiedToday || hasStudiedYesterday) {
      let checkDate = hasStudiedToday ? new Date() : subDays(new Date(), 1);
      currentStreak = 0;
      
      while (true) {
        const checkDateStr = format(checkDate, 'yyyy-MM-dd');
        if (studyDates.includes(checkDateStr)) {
          currentStreak++;
          streakDates.unshift(checkDateStr);
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < studyDates.length; i++) {
      const prevDate = new Date(studyDates[i - 1]);
      const currDate = new Date(studyDates[i]);
      const daysDiff = differenceInDays(currDate, prevDate);

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak, streakDates };
  };

  // Prepare data for charts
  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
      
      weeks.push({
        week: format(weekStart, 'MMM dd'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        sessions: weekSessions.length
      });
    }
    return weeks;
  };

  const getDailyData = () => {
    const last7Days = eachDayOfInterval({
      start: subWeeks(new Date(), 1),
      end: new Date()
    });

    return last7Days.map(day => {
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });

      const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
      
      return {
        day: format(day, 'EEE'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        efficiency: daySessions.length > 0 
          ? Math.round(daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length * 10) / 10 
          : 0
      };
    });
  };

  const getSubjectData = () => {
    const subjectMap = new Map();
    
    sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { subject: session.subject, hours: 0, sessions: 0 };
      current.hours += session.duration / 60;
      current.sessions += 1;
      subjectMap.set(session.subject, current);
    });

    return Array.from(subjectMap.values())
      .map(item => ({
        ...item,
        hours: Math.round(item.hours * 10) / 10
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  const getEfficiencyData = () => {
    const efficiencyMap = new Map();
    
    sessions.forEach(session => {
      const rating = `${session.efficiency} Stars`;
      efficiencyMap.set(rating, (efficiencyMap.get(rating) || 0) + 1);
    });

    return Array.from(efficiencyMap.entries()).map(([rating, count]) => ({
      rating,
      count
    }));
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const subjectData = getSubjectData();
  const efficiencyData = getEfficiencyData();
  const streakData = calculateStudyStreak();

  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionTime = sessions.length > 0 ? totalStudyTime / sessions.length : 0;
  const averageEfficiency = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.efficiency, 0) / sessions.length 
    : 0;
  const totalSessions = sessions.length;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get streak motivation message
  const getStreakMotivation = () => {
    const { currentStreak } = streakData;
    if (currentStreak === 0) {
      return { message: "Start your journey!", color: "text-blue-600 dark:text-blue-400", icon: "🚀" };
    } else if (currentStreak < 3) {
      return { message: "Building momentum", color: "text-green-600 dark:text-green-400", icon: "🌱" };
    } else if (currentStreak < 7) {
      return { message: "On fire!", color: "text-orange-600 dark:text-orange-400", icon: "🔥" };
    } else if (currentStreak < 14) {
      return { message: "Unstoppable!", color: "text-purple-600 dark:text-purple-400", icon: "⚡" };
    } else {
      return { message: "Legend!", color: "text-pink-600 dark:text-pink-400", icon: "👑" };
    }
  };

  const motivation = getStreakMotivation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-200 border-t-violet-600 dark:border-gray-700 dark:border-t-violet-400"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="rounded-full h-16 w-16 bg-gradient-to-r from-violet-400 to-cyan-400 opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
          <Card className="p-16 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
              <TrendingUp className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No data to analyze yet
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Start tracking your study sessions to unlock powerful analytics and insights about your learning journey
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header with improved design */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                Study Analytics
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover insights, track progress, and optimize your learning journey with data-driven analytics
              </p>
            </div>
          </div>
        </div>

        {/* Compact Study Streak Section */}
        <div className="mb-8">
          <Card className="p-6 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 border-0 shadow-2xl backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Study Streak
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your consistency and build lasting study habits
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Current Streak */}
              <div 
                className={`text-center transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  hoveredStreakCard === 'current' ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredStreakCard('current')}
                onMouseLeave={() => setHoveredStreakCard(null)}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm border border-orange-200/30 dark:border-orange-700/30 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl mb-2 animate-bounce">🔥</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Current Streak
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {streakData.currentStreak === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>

              {/* Longest Streak */}
              <div 
                className={`text-center transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  hoveredStreakCard === 'longest' ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredStreakCard('longest')}
                onMouseLeave={() => setHoveredStreakCard(null)}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {streakData.longestStreak}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Best Streak
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    personal record
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div 
                className={`text-center transform transition-all duration-300 hover:scale-105 cursor-pointer ${
                  hoveredStreakCard === 'motivation' ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredStreakCard('motivation')}
                onMouseLeave={() => setHoveredStreakCard(null)}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 hover:shadow-2xl transition-all duration-300">
                  <div className="text-4xl mb-2 animate-pulse">{motivation.icon}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Keep Going!
                  </div>
                  <div className={`text-xs font-semibold ${motivation.color} mb-1`}>
                    {motivation.message}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    every day counts
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Streak Calendar */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                Recent Activity
              </h4>
              <div className="flex gap-1 justify-center mb-3">
                {Array.from({ length: 14 }, (_, i) => {
                  const date = subDays(new Date(), 13 - i);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const hasSession = sessions.some(session => 
                    format(new Date(session.date), 'yyyy-MM-dd') === dateStr
                  );
                  
                  return (
                    <div
                      key={dateStr}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                        hasSession
                          ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } ${isToday(date) ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${
                        hoveredCalendarDay === dateStr ? 'scale-110 z-10' : ''
                      }`}
                      title={format(date, 'MMM dd, yyyy')}
                      onMouseEnter={() => setHoveredCalendarDay(dateStr)}
                      onMouseLeave={() => setHoveredCalendarDay(null)}
                    >
                      {format(date, 'd')}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-100 dark:bg-gray-700 rounded transition-all hover:scale-125"></div>
                  <div className="w-2 h-2 bg-orange-200 dark:bg-orange-800 rounded transition-all hover:scale-125"></div>
                  <div className="w-2 h-2 bg-orange-400 dark:bg-orange-600 rounded transition-all hover:scale-125"></div>
                  <div className="w-2 h-2 bg-orange-600 dark:bg-orange-500 rounded transition-all hover:scale-125"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
              hoveredCard === 'total-time' ? 'ring-2 ring-violet-500/50' : ''
            }`}
            onMouseEnter={() => setHoveredCard('total-time')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Study Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(totalStudyTime)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+12%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
              hoveredCard === 'total-sessions' ? 'ring-2 ring-blue-500/50' : ''
            }`}
            onMouseEnter={() => setHoveredCard('total-sessions')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {totalSessions}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+8%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
              hoveredCard === 'avg-session' ? 'ring-2 ring-green-500/50' : ''
            }`}
            onMouseEnter={() => setHoveredCard('avg-session')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. Session</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(averageSessionTime)}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+15%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
              hoveredCard === 'efficiency' ? 'ring-2 ring-yellow-500/50' : ''
            }`}
            onMouseEnter={() => setHoveredCard('efficiency')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Avg. Efficiency</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {averageEfficiency.toFixed(1)}/5
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+5%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts with enhanced design */}
        <div className="space-y-8 mb-12">
          {/* Basic Analytics - Always Available */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Weekly Progress */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl" id="weekly-chart">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Weekly Study Hours
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Live Data</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="week" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Daily Efficiency */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl" id="daily-chart">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Daily Performance Trend
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Efficiency</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="left" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#3b82f6', strokeWidth: 0 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#10b981', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Subject Distribution with enhanced design */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Study Time by Subject
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {subjectData.length} Subjects
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {subjectData.slice(0, 5).map((subject, index) => {
                const maxHours = Math.max(...subjectData.map(s => s.hours));
                const percentage = (subject.hours / maxHours) * 100;
                
                return (
                  <div key={subject.subject} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-lg shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                          {subject.subject}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 dark:text-gray-100 font-bold text-xl">
                          {subject.hours}h
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.sessions} sessions
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Premium Analytics Section with enhanced design */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                Advanced Analytics
              </h2>
              {isPremium && <PremiumBadge />}
            </div>

            <PremiumFeatureGate
              featureName="Advanced Analytics Dashboard"
              description="Get detailed insights into your study patterns, performance predictions, and personalized recommendations"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* AI Insights Panel with enhanced design */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      AI Study Insights
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-lg border border-purple-200/30 dark:border-purple-700/30">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          📈
                        </div>
                        Performance Trend
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Your study efficiency has improved by 23% over the last month. Keep up the great work!
                      </p>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-lg border border-purple-200/30 dark:border-purple-700/30">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          🎯
                        </div>
                        Smart Recommendation
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Consider studying Mathematics in the morning when your focus is highest.
                      </p>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-lg border border-purple-200/30 dark:border-purple-700/30">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          ⚡
                        </div>
                        Productivity Score
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">87%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Predictive Analytics with enhanced design */}
                <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-0 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Performance Predictions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-lg border border-green-200/30 dark:border-green-700/30">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          📊
                        </div>
                        Exam Readiness
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mathematics Final</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div className="w-11/12 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Physics Midterm</span>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div className="w-3/4 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">76%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm shadow-lg border border-green-200/30 dark:border-green-700/30">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          🔮
                        </div>
                        Study Forecast
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        At your current pace, you'll complete your study goals 3 days ahead of schedule.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </PremiumFeatureGate>
          </div>

          {/* Efficiency Distribution with enhanced design */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl" id="efficiency-chart">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Efficiency Ratings Distribution
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Star className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Avg: {averageEfficiency.toFixed(1)}/5
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor={`${color}99`} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#gradient-${index % COLORS.length})`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {efficiencyData.map((entry, index) => (
                  <div key={entry.rating} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {entry.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {entry.count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">sessions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
