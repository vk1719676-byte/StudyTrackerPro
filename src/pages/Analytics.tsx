import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar, ScatterChart, Scatter, ComposedChart, ReferenceLine, Treemap, FunnelChart, Funnel, LabelList } from 'recharts';
import { TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Calendar, Filter, ChevronDown, Award, AlertCircle, CheckCircle, ArrowUp, ArrowDown, BarChart3, PieChart as PieChartIcon, Activity, Layers, Gauge, TrendingDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, subDays, startOfMonth, endOfMonth, subMonths, getHours, startOfDay, addHours } from 'date-fns';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'patterns' | 'predictions'>('overview');
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

  // Enhanced data processing with memoization
  const analyticsData = useMemo(() => {
    const filteredSessions = sessions.filter(session => 
      selectedSubjects.length === 0 || selectedSubjects.includes(session.subject)
    );

    const getTimeRangeData = () => {
      const periods = [];
      const now = new Date();
      
      let periodCount, periodStart, periodEnd, formatStr;
      
      switch (timeRange) {
        case 'week':
          periodCount = 8;
          formatStr = 'EEE';
          for (let i = periodCount - 1; i >= 0; i--) {
            periodStart = subDays(now, i);
            periodEnd = periodStart;
            periods.push({ start: periodStart, end: periodEnd, label: format(periodStart, formatStr) });
          }
          break;
        case 'month':
          periodCount = 12;
          formatStr = 'MMM dd';
          for (let i = periodCount - 1; i >= 0; i--) {
            periodStart = startOfWeek(subWeeks(now, i));
            periodEnd = endOfWeek(periodStart);
            periods.push({ start: periodStart, end: periodEnd, label: format(periodStart, formatStr) });
          }
          break;
        case 'quarter':
          periodCount = 12;
          formatStr = 'MMM';
          for (let i = periodCount - 1; i >= 0; i--) {
            periodStart = startOfMonth(subMonths(now, i));
            periodEnd = endOfMonth(periodStart);
            periods.push({ start: periodStart, end: periodEnd, label: format(periodStart, formatStr) });
          }
          break;
        default:
          periodCount = 12;
          formatStr = 'MMM';
          for (let i = periodCount - 1; i >= 0; i--) {
            periodStart = startOfMonth(subMonths(now, i));
            periodEnd = endOfMonth(periodStart);
            periods.push({ start: periodStart, end: periodEnd, label: format(periodStart, formatStr) });
          }
      }

      return periods.map(period => {
        const periodSessions = filteredSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= period.start && sessionDate <= period.end;
        });

        const totalTime = periodSessions.reduce((sum, session) => sum + session.duration, 0);
        const avgEfficiency = periodSessions.length > 0 
          ? periodSessions.reduce((sum, s) => sum + s.efficiency, 0) / periodSessions.length 
          : 0;
        const avgFocus = periodSessions.length > 0
          ? periodSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / periodSessions.length
          : 0;

        return {
          period: period.label,
          hours: Math.round(totalTime / 60 * 10) / 10,
          sessions: periodSessions.length,
          efficiency: Math.round(avgEfficiency * 10) / 10,
          focus: Math.round(avgFocus),
          productivity: Math.round((avgEfficiency * avgFocus / 5) * 10) / 10,
          totalMinutes: totalTime
        };
      });
    };

    const getHourlyDistribution = () => {
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}:00`,
        sessions: 0,
        totalTime: 0,
        avgEfficiency: 0,
        avgFocus: 0
      }));

      filteredSessions.forEach(session => {
        // Mock hour distribution based on session data
        const mockHour = Math.floor(Math.random() * 16) + 6; // 6 AM to 10 PM
        hourlyData[mockHour].sessions += 1;
        hourlyData[mockHour].totalTime += session.duration;
        hourlyData[mockHour].avgEfficiency += session.efficiency;
        hourlyData[mockHour].avgFocus += session.focusScore || 0;
      });

      return hourlyData.map(data => ({
        ...data,
        hours: Math.round(data.totalTime / 60 * 10) / 10,
        avgEfficiency: data.sessions > 0 ? Math.round(data.avgEfficiency / data.sessions * 10) / 10 : 0,
        avgFocus: data.sessions > 0 ? Math.round(data.avgFocus / data.sessions) : 0
      }));
    };

    const getSessionDurationDistribution = () => {
      const durations = [
        { range: '0-30 min', min: 0, max: 30, count: 0, color: '#ef4444' },
        { range: '30-60 min', min: 30, max: 60, count: 0, color: '#f59e0b' },
        { range: '60-90 min', min: 60, max: 90, count: 0, color: '#10b981' },
        { range: '90-120 min', min: 90, max: 120, count: 0, color: '#3b82f6' },
        { range: '120+ min', min: 120, max: Infinity, count: 0, color: '#8b5cf6' }
      ];

      filteredSessions.forEach(session => {
        const duration = session.duration;
        const bucket = durations.find(d => duration >= d.min && duration < d.max);
        if (bucket) bucket.count++;
      });

      return durations.filter(d => d.count > 0);
    };

    const getEfficiencyTrends = () => {
      const last30Days = eachDayOfInterval({
        start: subDays(new Date(), 29),
        end: new Date()
      });

      return last30Days.map(day => {
        const daySessions = filteredSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });

        const avgEfficiency = daySessions.length > 0 
          ? daySessions.reduce((sum, s) => sum + s.efficiency, 0) / daySessions.length 
          : 0;
        const avgFocus = daySessions.length > 0
          ? daySessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / daySessions.length
          : 0;

        return {
          date: format(day, 'MMM dd'),
          efficiency: Math.round(avgEfficiency * 10) / 10,
          focus: Math.round(avgFocus),
          sessions: daySessions.length,
          totalTime: daySessions.reduce((sum, s) => sum + s.duration, 0)
        };
      });
    };

    const getSubjectAnalysis = () => {
      const subjectMap = new Map();
      
      filteredSessions.forEach(session => {
        const current = subjectMap.get(session.subject) || { 
          subject: session.subject, 
          totalTime: 0, 
          sessions: 0, 
          totalEfficiency: 0,
          totalFocus: 0,
          improvements: []
        };
        
        current.totalTime += session.duration;
        current.sessions += 1;
        current.totalEfficiency += session.efficiency;
        current.totalFocus += session.focusScore || 0;
        
        subjectMap.set(session.subject, current);
      });

      return Array.from(subjectMap.values())
        .map(item => ({
          subject: item.subject,
          hours: Math.round(item.totalTime / 60 * 10) / 10,
          sessions: item.sessions,
          avgEfficiency: Math.round(item.totalEfficiency / item.sessions * 10) / 10,
          avgFocus: Math.round(item.totalFocus / item.sessions),
          performance: Math.round((item.totalEfficiency / item.sessions) * (item.totalFocus / item.sessions) / 5 * 10) / 10,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          value: item.totalTime // For treemap
        }))
        .sort((a, b) => b.hours - a.hours);
    };

    const getWeeklyComparison = () => {
      const weeks = [];
      for (let i = 3; i >= 0; i--) {
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
          week: `Week ${4 - i}`,
          studyTime: Math.round(totalTime / 60 * 10) / 10,
          efficiency: Math.round(avgEfficiency * 10) / 10,
          sessions: weekSessions.length,
          target: 20 // Mock target
        });
      }
      return weeks;
    };

    const getStudyStreakData = () => {
      const last14Days = eachDayOfInterval({
        start: subDays(new Date(), 13),
        end: new Date()
      });

      return last14Days.map(day => {
        const daySessions = filteredSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return format(sessionDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
        });

        const totalTime = daySessions.reduce((sum, s) => sum + s.duration, 0);
        const hasStudied = totalTime > 0;

        return {
          date: format(day, 'MMM dd'),
          day: format(day, 'EEE'),
          studied: hasStudied ? 1 : 0,
          hours: Math.round(totalTime / 60 * 10) / 10,
          intensity: totalTime > 120 ? 'high' : totalTime > 60 ? 'medium' : totalTime > 0 ? 'low' : 'none'
        };
      });
    };

    const getPerformanceMetrics = () => {
      const totalTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
      const totalSessions = filteredSessions.length;
      const avgEfficiency = totalSessions > 0 
        ? filteredSessions.reduce((sum, session) => sum + session.efficiency, 0) / totalSessions 
        : 0;
      const avgFocus = totalSessions > 0
        ? filteredSessions.reduce((sum, session) => sum + (session.focusScore || 0), 0) / totalSessions
        : 0;

      // Calculate streaks and consistency
      const sortedSessions = [...filteredSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let currentStreak = 0;
      let maxStreak = 0;
      let lastDate = null;

      for (const session of sortedSessions) {
        const sessionDate = new Date(session.date);
        if (lastDate && (sessionDate.getTime() - lastDate.getTime()) <= 86400000 * 2) { // Within 2 days
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        lastDate = sessionDate;
      }

      const productivityScore = Math.round((avgEfficiency * avgFocus / 5) * 100) / 100;
      const consistencyScore = Math.min(100, (currentStreak / 7) * 100);

      return {
        totalTime,
        totalSessions,
        avgSessionTime: totalSessions > 0 ? totalTime / totalSessions : 0,
        avgEfficiency,
        avgFocus,
        productivityScore,
        consistencyScore,
        currentStreak,
        maxStreak,
        weeklyGrowth: Math.random() * 20 - 10, // Mock data for demo
        monthlyGrowth: Math.random() * 30 - 15
      };
    };

    const getInsights = (metrics: any, subjectAnalysis: any[]) => {
      const insights = [];

      // Performance insights
      if (metrics.productivityScore > 80) {
        insights.push({
          type: 'success',
          title: 'Excellent Performance!',
          message: `Your productivity score of ${metrics.productivityScore}% is outstanding. Keep up the great work!`,
          priority: 'high'
        });
      } else if (metrics.productivityScore < 50) {
        insights.push({
          type: 'warning',
          title: 'Room for Improvement',
          message: `Your productivity score is ${metrics.productivityScore}%. Consider adjusting your study schedule or environment.`,
          priority: 'high'
        });
      }

      // Consistency insights
      if (metrics.currentStreak >= 7) {
        insights.push({
          type: 'success',
          title: 'Great Consistency!',
          message: `You've maintained a ${metrics.currentStreak}-day study streak. Consistency is key to success!`,
          priority: 'medium'
        });
      }

      // Subject-specific insights
      const topSubject = subjectAnalysis[0];
      if (topSubject && topSubject.performance > 4.0) {
        insights.push({
          type: 'info',
          title: `${topSubject.subject} Mastery`,
          message: `You're excelling in ${topSubject.subject} with a performance score of ${topSubject.performance}/5.`,
          priority: 'medium'
        });
      }

      // Focus insights
      if (metrics.avgFocus < 60) {
        insights.push({
          type: 'warning',
          title: 'Focus Improvement Needed',
          message: 'Your average focus score is below 60%. Try studying in shorter, more focused sessions.',
          priority: 'high'
        });
      }

      return insights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    };

    const timeRangeData = getTimeRangeData();
    const hourlyDistribution = getHourlyDistribution();
    const sessionDurationDistribution = getSessionDurationDistribution();
    const efficiencyTrends = getEfficiencyTrends();
    const subjectAnalysis = getSubjectAnalysis();
    const weeklyComparison = getWeeklyComparison();
    const studyStreakData = getStudyStreakData();
    const performanceMetrics = getPerformanceMetrics();
    const insights = getInsights(performanceMetrics, subjectAnalysis);

    return {
      timeRangeData,
      hourlyDistribution,
      sessionDurationDistribution,
      efficiencyTrends,
      subjectAnalysis,
      weeklyComparison,
      studyStreakData,
      performanceMetrics,
      insights
    };
  }, [sessions, timeRange, selectedSubjects]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getUniqueSubjects = () => {
    return [...new Set(sessions.map(session => session.subject))];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
          <Card className="p-12 text-center">
            <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No data to analyze yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start tracking your study sessions to see detailed analytics and insights
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Start Your First Session
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header with Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Advanced Study Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive insights into your learning performance and patterns
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* Time Range Selector */}
              <div className="relative">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-3 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mt-4 p-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                  {getUniqueSubjects().map(subject => (
                    <button
                      key={subject}
                      onClick={() => {
                        setSelectedSubjects(prev => 
                          prev.includes(subject) 
                            ? prev.filter(s => s !== subject)
                            : [...prev, subject]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedSubjects.includes(subject)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
                {selectedSubjects.length > 0 && (
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </Card>
          )}

          {/* Navigation Tabs */}
          <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'performance', label: 'Performance', icon: TrendingUp },
                { id: 'patterns', label: 'Patterns', icon: Activity },
                { id: 'predictions', label: 'Predictions', icon: Brain }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Enhanced KPI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatTime(analyticsData.performanceMetrics.totalTime)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-sm ${
                  analyticsData.performanceMetrics.weeklyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analyticsData.performanceMetrics.weeklyGrowth > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(analyticsData.performanceMetrics.weeklyGrowth).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">vs last week</div>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Productivity Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {analyticsData.performanceMetrics.productivityScore}%
                  </p>
                </div>
              </div>
              <div className="w-12 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={[{ value: analyticsData.performanceMetrics.productivityScore }]}>
                    <RadialBar dataKey="value" fill="#3b82f6" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analyticsData.performanceMetrics.currentStreak} days
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (analyticsData.performanceMetrics.currentStreak / 30) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Focus Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analyticsData.performanceMetrics.avgFocus}/100
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Efficiency: {analyticsData.performanceMetrics.avgEfficiency.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Insights Section */}
        {analyticsData.insights.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI-Powered Insights
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                      insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {insight.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : insight.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Brain className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Performance Trend Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Performance Trends Over Time
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={analyticsData.timeRangeData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgb(31 41 55)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Bar yAxisId="left" dataKey="sessions" fill="#3b82f6" opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            {/* Subject Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject Performance Treemap */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Subject Time Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <Treemap
                    data={analyticsData.subjectAnalysis}
                    dataKey="value"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#8b5cf6"
                  >
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgb(31 41 55)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </Card>

              {/* Weekly Comparison */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Weekly Progress Comparison
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData.weeklyComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgb(31 41 55)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="studyTime" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                    <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="5 5" label="Target" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Session Duration Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Session Duration Distribution
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analyticsData.sessionDurationDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {analyticsData.sessionDurationDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgb(31 41 55)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center space-y-3">
                  {analyticsData.sessionDurationDistribution.map((entry, index) => (
                    <div key={entry.range} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {entry.range}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                          {entry.count}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          sessions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Efficiency Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                30-Day Efficiency & Focus Trends
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={analyticsData.efficiencyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgb(31 41 55)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    name="Efficiency (1-5)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="focus" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    name="Focus (0-100)"
                  />
                  <ReferenceLine yAxisId="left" y={4} stroke="#f59e0b" strokeDasharray="5 5" label="Target Efficiency" />
                  <ReferenceLine yAxisId="right" y={80} stroke="#3b82f6" strokeDasharray="5 5" label="Target Focus" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Subject Performance Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Subject Performance Matrix
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={analyticsData.subjectAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="hours" name="Study Hours" />
                    <YAxis dataKey="performance" name="Performance Score" domain={[0, 5]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ 
                        backgroundColor: 'rgb(31 41 55)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value, name) => [
                        name === 'performance' ? `${value}/5` : value,
                        name === 'performance' ? 'Performance' : 'Hours'
                      ]}
                    />
                    <Scatter dataKey="performance" fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Performance Breakdown
                </h3>
                <div className="space-y-4">
                  {analyticsData.subjectAnalysis.slice(0, 5).map((subject, index) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {subject.subject}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {subject.performance}/5
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(subject.performance / 5) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Efficiency: {subject.avgEfficiency}/5</span>
                        <span>Focus: {subject.avgFocus}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-8">
            {/* Hourly Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Study Time Distribution by Hour
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analyticsData.hourlyDistribution}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgb(31 41 55)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Study Streak Heatmap */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                14-Day Study Streak Heatmap
              </h3>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {analyticsData.studyStreakData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {day.day}
                    </div>
                    <div 
                      className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${
                        day.intensity === 'high' ? 'bg-green-500 text-white' :
                        day.intensity === 'medium' ? 'bg-green-300 text-gray-800' :
                        day.intensity === 'low' ? 'bg-green-100 text-gray-600' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}
                      title={`${day.date}: ${day.hours}h`}
                    >
                      {day.hours > 0 ? `${day.hours}h` : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <div className="w-3 h-3 bg-green-300 rounded"></div>
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                </div>
                <span>More</span>
              </div>
            </Card>

            {/* Study Patterns Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Peak Performance Hours
                </h4>
                <div className="space-y-3">
                  {[
                    { time: '9:00 AM', efficiency: 4.8, color: 'bg-green-500' },
                    { time: '2:00 PM', efficiency: 4.2, color: 'bg-blue-500' },
                    { time: '7:00 PM', efficiency: 3.9, color: 'bg-yellow-500' }
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${slot.color}`}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {slot.time}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {slot.efficiency}/5
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Session Length Patterns
                </h4>
                <div className="space-y-3">
                  {[
                    { duration: '45-60 min', percentage: 42, optimal: true },
                    { duration: '30-45 min', percentage: 28, optimal: false },
                    { duration: '60-90 min', percentage: 20, optimal: true },
                    { duration: '90+ min', percentage: 10, optimal: false }
                  ].map((pattern, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {pattern.duration}
                          {pattern.optimal && <span className="ml-1 text-green-600">✓</span>}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {pattern.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${pattern.optimal ? 'bg-green-500' : 'bg-gray-400'}`}
                          style={{ width: `${pattern.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Weekly Consistency
                </h4>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const consistency = Math.floor(Math.random() * 40) + 60;
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {day}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                consistency >= 80 ? 'bg-green-500' : 
                                consistency >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${consistency}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                            {consistency}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'predictions' && (
          <PremiumFeatureGate
            featureName="Advanced Predictive Analytics"
            description="Get AI-powered predictions for exam performance, study optimization recommendations, and personalized learning insights"
          >
            <div className="space-y-8">
              {/* Performance Predictions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Exam Performance Predictions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { exam: 'Mathematics Final', readiness: 92, predicted: 'A-', confidence: 'High' },
                      { exam: 'Physics Midterm', readiness: 76, predicted: 'B+', confidence: 'Medium' },
                      { exam: 'Chemistry Lab', readiness: 84, predicted: 'A-', confidence: 'High' },
                      { exam: 'Biology Quiz', readiness: 68, predicted: 'B', confidence: 'Medium' }
                    ].map((exam, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {exam.exam}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            exam.confidence === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {exam.confidence} Confidence
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Readiness</span>
                          <span className="font-bold text-gray-900 dark:text-gray-100">{exam.readiness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              exam.readiness >= 80 ? 'bg-green-500' : 
                              exam.readiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${exam.readiness}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Predicted Grade</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{exam.predicted}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      AI Study Recommendations
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        📅 Optimal Study Schedule
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Based on your performance patterns, here's your personalized schedule:
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Mathematics</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">9:00-10:30 AM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Physics</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">2:00-3:30 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Chemistry</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">7:00-8:30 PM</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        🎯 Focus Areas
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Increase Physics study time by 30%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Practice more Chemistry problems
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Maintain current Mathematics pace
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        ⚡ Productivity Boosters
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Take 5-minute breaks every 25 minutes</li>
                        <li>• Study in 45-60 minute focused sessions</li>
                        <li>• Review material within 24 hours</li>
                        <li>• Use active recall techniques</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Goal Progress Forecast */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Goal Achievement Forecast
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { goal: 'Study 20h/week', current: 16.5, target: 20, forecast: 'On track', trend: 'up' },
                    { goal: 'Maintain 4.0+ efficiency', current: 4.2, target: 4.0, forecast: 'Exceeding', trend: 'up' },
                    { goal: '90% focus score', current: 78, target: 90, forecast: 'Behind', trend: 'down' }
                  ].map((goal, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {goal.goal}
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {goal.current}{typeof goal.current === 'number' && goal.current < 10 ? '/5' : typeof goal.current === 'number' && goal.current > 50 ? '%' : 'h'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.forecast === 'Exceeding' ? 'bg-green-500' :
                            goal.forecast === 'On track' ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          goal.forecast === 'Exceeding' ? 'text-green-600' :
                          goal.forecast === 'On track' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {goal.forecast}
                        </span>
                        <div className={`flex items-center gap-1 ${
                          goal.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {goal.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          <span className="text-xs">
                            {goal.trend === 'up' ? 'Improving' : 'Declining'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </PremiumFeatureGate>
        )}
      </div>
    </div>
  );
};


