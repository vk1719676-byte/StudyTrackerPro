import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ComposedChart, ScatterChart, Scatter 
} from 'recharts';
import { 
  TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Calendar, 
  BarChart3, Activity, Award, Flame, Sun, Moon, Filter, ChevronDown,
  TrendingDown, Eye, BookOpen, Timer, Lightbulb
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subMonths, getHours, startOfDay } from 'date-fns';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [showFilters, setShowFilters] = useState(false);
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

  // Enhanced data preparation functions
  const getWeeklyData = () => {
    const weeks = [];
    const weeksCount = selectedPeriod === 'week' ? 4 : selectedPeriod === 'month' ? 8 : 12;
    
    for (let i = weeksCount - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });
      
      const totalTime = weekSessions.reduce((sum, session) => sum + session.duration, 0);
      const avgEfficiency = weekSessions.length > 0 
        ? weekSessions.reduce((sum, s) => sum + s.efficiency, 0) / weekSessions.length 
        : 0;
      
      weeks.push({
        week: format(weekStart, 'MMM dd'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        sessions: weekSessions.length,
        efficiency: Math.round(avgEfficiency * 10) / 10,
        focus: Math.round((totalTime / weekSessions.length || 0) * 10) / 10
      });
    }
    return weeks;
  };

  const getDailyData = () => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
    const dateRange = eachDayOfInterval({
      start: subWeeks(new Date(), Math.ceil(days / 7)),
      end: new Date()
    });

    return dateRange.slice(-days).map(day => {
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });

      const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const efficiency = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length 
        : 0;
      
      return {
        day: format(day, days <= 7 ? 'EEE' : 'MM/dd'),
        date: format(day, 'yyyy-MM-dd'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        efficiency: Math.round(efficiency * 10) / 10,
        sessions: daySessions.length,
        productivity: Math.round((totalTime * efficiency / 100) * 10) / 10
      };
    });
  };

  const getTimeOfDayData = () => {
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sessions: 0,
      totalTime: 0,
      efficiency: 0
    }));

    sessions.forEach(session => {
      const sessionHour = getHours(new Date(session.date));
      hourlyData[sessionHour].sessions += 1;
      hourlyData[sessionHour].totalTime += session.duration;
      hourlyData[sessionHour].efficiency += session.efficiency;
    });

    return hourlyData.map(item => ({
      ...item,
      hours: Math.round(item.totalTime / 60 * 10) / 10,
      avgEfficiency: item.sessions > 0 ? Math.round((item.efficiency / item.sessions) * 10) / 10 : 0,
      period: parseInt(item.hour) < 6 ? 'Night' : 
              parseInt(item.hour) < 12 ? 'Morning' :
              parseInt(item.hour) < 18 ? 'Afternoon' : 'Evening'
    })).filter(item => item.sessions > 0);
  };

  const getSubjectPerformanceData = () => {
    const subjectMap = new Map();
    
    sessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { 
        subject: session.subject, 
        hours: 0, 
        sessions: 0, 
        totalEfficiency: 0,
        avgEfficiency: 0,
        recentEfficiency: 0
      };
      
      current.hours += session.duration / 60;
      current.sessions += 1;
      current.totalEfficiency += session.efficiency;
      subjectMap.set(session.subject, current);
    });

    return Array.from(subjectMap.values())
      .map(item => {
        const recentSessions = sessions
          .filter(s => s.subject === item.subject)
          .slice(-5);
        
        return {
          ...item,
          hours: Math.round(item.hours * 10) / 10,
          avgEfficiency: Math.round((item.totalEfficiency / item.sessions) * 10) / 10,
          recentEfficiency: recentSessions.length > 0 
            ? Math.round((recentSessions.reduce((sum, s) => sum + s.efficiency, 0) / recentSessions.length) * 10) / 10
            : 0,
          trend: recentSessions.length >= 3 ? 
            (recentSessions.slice(-2).reduce((sum, s) => sum + s.efficiency, 0) / 2) - 
            (recentSessions.slice(0, -2).reduce((sum, s) => sum + s.efficiency, 0) / Math.max(1, recentSessions.length - 2))
            : 0
        };
      })
      .sort((a, b) => b.hours - a.hours);
  };

  const getStudyStreakData = () => {
    const sortedSessions = [...sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const streakData = [];
    let currentStreak = 0;
    let maxStreak = 0;
    let lastDate = null;

    const uniqueDates = [...new Set(sortedSessions.map(s => format(new Date(s.date), 'yyyy-MM-dd')))];
    
    uniqueDates.forEach((date, index) => {
      const currentDate = new Date(date);
      
      if (lastDate) {
        const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
        } else if (daysDiff > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      streakData.push({
        date: format(currentDate, 'MMM dd'),
        streak: currentStreak,
        isRecord: currentStreak === maxStreak
      });
      
      lastDate = currentDate;
    });

    return { streakData: streakData.slice(-30), currentStreak, maxStreak };
  };

  const getProductivityHeatmapData = () => {
    const heatmapData = [];
    const last30Days = eachDayOfInterval({
      start: subWeeks(new Date(), 5),
      end: new Date()
    });

    last30Days.forEach(day => {
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });

      const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const efficiency = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length 
        : 0;

      heatmapData.push({
        date: format(day, 'yyyy-MM-dd'),
        day: format(day, 'EEE'),
        week: Math.floor(last30Days.indexOf(day) / 7),
        dayOfWeek: day.getDay(),
        hours: Math.round(totalTime / 60 * 10) / 10,
        productivity: Math.round((totalTime / 60) * (efficiency / 5) * 100) / 100,
        sessions: daySessions.length
      });
    });

    return heatmapData;
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5a2b', '#6b46c1', '#059669'];
  const GRADIENT_COLORS = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500'
  ];

  // Get all the data
  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const subjectData = getSubjectPerformanceData();
  const timeOfDayData = getTimeOfDayData();
  const { streakData, currentStreak, maxStreak } = getStudyStreakData();
  const heatmapData = getProductivityHeatmapData();

  // Calculate advanced metrics
  const totalStudyTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionTime = sessions.length > 0 ? totalStudyTime / sessions.length : 0;
  const averageEfficiency = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.efficiency, 0) / sessions.length 
    : 0;
  const totalSessions = sessions.length;
  const studyDays = new Set(sessions.map(s => format(new Date(s.date), 'yyyy-MM-dd'))).size;
  const avgSessionsPerDay = studyDays > 0 ? totalSessions / studyDays : 0;
  const productivityScore = Math.round((averageEfficiency / 5) * (totalStudyTime / 600) * 100) / 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.toLowerCase().includes('hour') && 'h'}
              {entry.name.toLowerCase().includes('efficiency') && '/5'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
          <Card className="p-12 text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <div className="relative">
              <TrendingUp className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 blur-3xl rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Welcome to Your Analytics Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start tracking your study sessions to unlock powerful insights, trends, and personalized recommendations
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500 dark:text-gray-400">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">📊 Performance Tracking</span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">🎯 Goal Management</span>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">🧠 AI Insights</span>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Study Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Advanced insights into your learning journey
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <Filter className="w-4 h-4" />
                  <span className="capitalize">{selectedPeriod}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                    {(['week', 'month', 'quarter'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => {
                          setSelectedPeriod(period);
                          setShowFilters(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg capitalize"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {isPremium && <PremiumBadge />}
            </div>
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(totalStudyTime / 60)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalSessions}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageEfficiency.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-xl shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentStreak}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-pink-600 dark:text-pink-400 uppercase tracking-wide">Study Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {studyDays}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700/50" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Productivity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round(productivityScore * 100)}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Analytics Grid */}
        <div className="space-y-8">
          {/* Top Row - Primary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Weekly Progress */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Progress Overview
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Hours</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full ml-3"></div>
                  <span>Efficiency</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={weeklyData}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="hours" fill="url(#hoursGradient)" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            {/* Time of Day Analysis */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-600" />
                  Peak Performance Hours
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timeOfDayData}>
                  <defs>
                    <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="sessions" stroke="#f59e0b" fill="url(#timeGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Subject Performance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Subject Performance Matrix
                </h3>
              </div>
              
              <div className="space-y-4">
                {subjectData.slice(0, 6).map((subject, index) => (
                  <div key={subject.subject} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                          {subject.subject}
                        </span>
                        {subject.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : subject.trend < -0.5 ? (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        ) : null}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                            {subject.hours}h
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {subject.sessions} sessions
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                            {subject.avgEfficiency}/5
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            avg rating
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bars */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16">Hours</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((subject.hours / Math.max(...subjectData.map(s => s.hours))) * 100, 100)}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16">Rating</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(subject.avgEfficiency / 5) * 100}%`,
                              backgroundColor: subject.avgEfficiency > 4 ? '#10b981' : subject.avgEfficiency > 3 ? '#f59e0b' : '#ef4444'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Study Streak Visualization */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Study Streaks
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    {currentStreak}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Current Streak
                  </div>
                  <div className="text-xs text-gray-500">
                    Personal best: {maxStreak} days
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {streakData.slice(-21).map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded text-xs flex items-center justify-center font-bold transition-all duration-200 ${
                        day.streak > 0
                          ? day.isRecord 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : 'bg-orange-300 text-orange-800'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                      title={`${day.date}: ${day.streak} day streak`}
                    >
                      {day.streak || '·'}
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Last 21 days
                </div>
              </div>
            </Card>
          </div>

          {/* Advanced Analytics Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                AI-Powered Insights
                {isPremium && <Crown className="w-6 h-6 text-yellow-500" />}
              </h2>
            </div>

            <PremiumFeatureGate
              featureName="Advanced AI Analytics"
              description="Unlock personalized insights, performance predictions, and intelligent recommendations powered by machine learning"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Insights Panel */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50 dark:from-purple-900/20 dark:via-purple-800/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Smart Insights
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Performance Trend
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your study efficiency has improved by <span className="font-bold text-green-600">23%</span> over the last month. Your most productive time is <span className="font-bold">morning sessions</span>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Smart Recommendation
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Based on your patterns, consider studying <span className="font-bold">Mathematics</span> during your peak hours (9-11 AM) for optimal results.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/30">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                          <Timer className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            Focus Optimization
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Your ideal session length is <span className="font-bold">45-60 minutes</span> based on efficiency data.
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                            </div>
                            <span className="text-xs font-bold text-orange-600">87%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Performance Predictions */}
                <Card className="p-6 bg-gradient-to-br from-green-50 via-green-50 to-teal-50 dark:from-green-900/20 dark:via-green-800/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Performance Predictions
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        📊 Exam Readiness Forecast
                      </h4>
                      <div className="space-y-3">
                        {['Mathematics Final', 'Physics Midterm', 'Chemistry Quiz'].map((exam, index) => {
                          const readiness = [92, 76, 84][index];
                          return (
                            <div key={exam} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{exam}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${readiness > 85 ? 'bg-green-500' : readiness > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${readiness}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-bold ${readiness > 85 ? 'text-green-600' : readiness > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {readiness}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        🔮 Weekly Goal Projection
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        At your current pace, you'll exceed your weekly study goal by <span className="font-bold text-green-600">15%</span>.
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{ width: '115%', maxWidth: '100%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-green-600">115%</span>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 border border-green-200/50 dark:border-green-700/30">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        🎯 Achievement Probability
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-bold text-green-600">94%</span> chance of maintaining current streak through next week.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </PremiumFeatureGate>
          </div>

          {/* Daily Activity Heatmap */}
          <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Daily Study Pattern
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-3 h-3 bg-green-200 dark:bg-green-900/40 rounded"></div>
                  <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded"></div>
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                </div>
                <span>More</span>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-500 text-center py-2 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((day, index) => {
                const intensity = Math.min(day.productivity * 4, 1);
                return (
                  <div
                    key={index}
                    className="aspect-square rounded transition-all duration-200 hover:ring-2 hover:ring-green-400"
                    style={{
                      backgroundColor: intensity > 0 
                        ? `rgba(34, 197, 94, ${Math.max(0.2, intensity)})` 
                        : '#e5e7eb'
                    }}
                    title={`${day.date}: ${day.hours}h studied, ${day.sessions} sessions`}
                  />
                );
              })}
            </div>
            
            <div className="text-xs text-gray-500 text-center mt-4">
              Last 5 weeks activity
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
