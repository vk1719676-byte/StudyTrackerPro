import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Calendar, Filter, Download, BarChart3, PieChart as PieChartIcon, Activity, Users, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subDays } from 'date-fns';

type TimeFilter = '7d' | '30d' | '90d' | 'all';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30d');
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

  // Filter sessions based on time filter
  const getFilteredSessions = () => {
    if (timeFilter === 'all') return sessions;
    
    const days = timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90;
    const cutoffDate = subDays(new Date(), days);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= cutoffDate;
    });
  };

  const filteredSessions = getFilteredSessions();

  // Enhanced data preparation functions
  const getWeeklyData = () => {
    const weeks = [];
    const weeksToShow = timeFilter === '7d' ? 1 : timeFilter === '30d' ? 4 : 12;
    
    for (let i = weeksToShow - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      
      const weekSessions = filteredSessions.filter(session => {
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
        efficiency: Math.round(avgEfficiency * 10) / 10
      });
    }
    return weeks;
  };

  const getDailyData = () => {
    const days = timeFilter === '7d' ? 7 : 14;
    const dateRange = eachDayOfInterval({
      start: subDays(new Date(), days - 1),
      end: new Date()
    });

    return dateRange.map(day => {
      const daySessions = filteredSessions.filter(session => {
        const sessionDate = new Date(session.date);
        return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });

      const totalTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
      const avgEfficiency = daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length 
        : 0;
      
      return {
        day: format(day, 'MMM dd'),
        dayName: format(day, 'EEE'),
        hours: Math.round(totalTime / 60 * 10) / 10,
        efficiency: Math.round(avgEfficiency * 10) / 10,
        sessions: daySessions.length
      };
    });
  };

  const getSubjectData = () => {
    const subjectMap = new Map();
    
    filteredSessions.forEach(session => {
      const current = subjectMap.get(session.subject) || { 
        subject: session.subject, 
        hours: 0, 
        sessions: 0, 
        efficiency: 0 
      };
      current.hours += session.duration / 60;
      current.sessions += 1;
      current.efficiency += session.efficiency;
      subjectMap.set(session.subject, current);
    });

    return Array.from(subjectMap.values())
      .map(item => ({
        ...item,
        hours: Math.round(item.hours * 10) / 10,
        efficiency: Math.round((item.efficiency / item.sessions) * 10) / 10
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  const getHourlyPattern = () => {
    const hourMap = new Map();
    
    filteredSessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    return Array.from(hourMap.entries())
      .map(([hour, sessions]) => ({
        hour: `${hour}:00`,
        sessions
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5a2b', '#06b6d4'];
  const GRADIENT_COLORS = [
    'from-purple-500 to-blue-600',
    'from-blue-500 to-cyan-600', 
    'from-green-500 to-teal-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-pink-600'
  ];

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const subjectData = getSubjectData();
  const hourlyData = getHourlyPattern();

  const totalStudyTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
  const averageSessionTime = filteredSessions.length > 0 ? totalStudyTime / filteredSessions.length : 0;
  const averageEfficiency = filteredSessions.length > 0 
    ? filteredSessions.reduce((sum, session) => sum + session.efficiency, 0) / filteredSessions.length 
    : 0;
  const totalSessions = filteredSessions.length;
  const studyStreak = 5; // Mock data

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
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('hours') ? 'h' : entry.name.includes('efficiency') ? '/5' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
            <div className="h-3 w-48 bg-gray-100 dark:bg-gray-600 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
          <Card className="p-16 text-center bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Your Analytics Dashboard Awaits
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Start tracking your study sessions to unlock detailed insights, performance analytics, and AI-powered recommendations
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Activity className="w-4 h-4" />
              Start Your First Session
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Study Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Unlock insights into your learning journey and optimize your study performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                {(['7d', '30d', '90d', 'all'] as TimeFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      timeFilter === filter
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {filter === '7d' ? '7 Days' : filter === '30d' ? '30 Days' : filter === '90d' ? '90 Days' : 'All Time'}
                  </button>
                ))}
              </div>
              
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Study Time</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatTime(totalStudyTime)}
                </p>
                <p className="text-purple-100 text-sm mt-2">
                  +12% from last period
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Study Sessions</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {totalSessions}
                </p>
                <p className="text-blue-100 text-sm mt-2">
                  {Math.round(totalSessions / 7)} avg/week
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Avg. Efficiency</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {averageEfficiency.toFixed(1)}/5
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(i => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i <= averageEfficiency ? 'text-yellow-300 fill-current' : 'text-green-200'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Study Streak</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {studyStreak}
                </p>
                <p className="text-orange-100 text-sm mt-2">
                  days in a row
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Avg. Session</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {formatTime(averageSessionTime)}
                </p>
                <p className="text-teal-100 text-sm mt-2">
                  optimal range
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Charts Section */}
        <div className="space-y-8 mb-8">
          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Study Progress Over Time */}
            <div className="xl:col-span-2">
              <Card className="p-6 h-full" gradient>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Study Progress Trends
                  </h3>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dailyData}>
                    <defs>
                      <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      className="text-sm text-gray-600 dark:text-gray-400"
                    />
                    <YAxis yAxisId="left" className="text-sm text-gray-600 dark:text-gray-400" />
                    <YAxis yAxisId="right" orientation="right" className="text-sm text-gray-600 dark:text-gray-400" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="hours"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#hoursGradient)"
                      name="Study Hours"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                      name="Efficiency"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Subject Performance */}
            <Card className="p-6" gradient>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                Subject Focus
              </h3>
              <div className="space-y-4">
                {subjectData.slice(0, 5).map((subject, index) => (
                  <div key={subject.subject} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {subject.subject}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                          {subject.hours}h
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.sessions} sessions
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(subject.hours / Math.max(...subjectData.map(s => s.hours))) * 100}%`,
                          background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}99)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Weekly Performance */}
          <Card className="p-6" gradient>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Weekly Performance Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" className="text-sm text-gray-600 dark:text-gray-400" />
                <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="hours" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  name="Study Hours"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Premium Analytics Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                AI-Powered Insights
              </h2>
              {isPremium && <PremiumBadge />}
            </div>

            <PremiumFeatureGate
              featureName="Advanced AI Analytics"
              description="Unlock personalized study insights, performance predictions, and intelligent recommendations powered by AI"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Performance Insights */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800" gradient>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Smart Analytics
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🎯</span>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Peak Performance</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Your highest efficiency scores occur between 10-12 AM. Schedule challenging subjects during this time.
                      </p>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📈</span>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Progress Trajectory</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Your study consistency has improved by 34% this month. You're on track to exceed your goals!
                      </p>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">⚡</span>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Smart Recommendation</h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        Consider 25-minute focused sessions for Mathematics - your efficiency drops after 30 minutes.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Predictive Analytics */}
                <Card className="p-6 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-green-900/20 dark:via-teal-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" gradient>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Future Predictions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Exam Readiness Forecast</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Mathematics Final</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                            <span className="text-green-600 font-bold text-sm">92%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Physics Midterm</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '76%'}}></div>
                            </div>
                            <span className="text-yellow-600 font-bold text-sm">76%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Study Goal Prediction</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        At your current pace, you'll complete monthly goals 4 days early with 95% confidence.
                      </p>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 dark:border-gray-700/50">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Optimal Study Schedule</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        AI suggests: Mon/Wed/Fri mornings for Math, Tue/Thu afternoons for Physics for maximum retention.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </PremiumFeatureGate>
          </div>
        </div>
      </div>
    </div>
  );
};
