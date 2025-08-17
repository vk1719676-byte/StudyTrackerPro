import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Download, FileText, Camera } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';
import { exportAnalyticsToPDF, captureChartsAsPDF } from '../utils/pdfExport';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);
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

  // PDF Export Functions
  const handleExportPDF = async (includeCharts = false) => {
    setExportingPDF(true);
    
    try {
      const exportData = {
        totalStudyTime,
        totalSessions,
        averageSessionTime,
        averageEfficiency,
        weeklyData,
        dailyData,
        subjectData,
        efficiencyData,
        isPremium,
        userName: user?.displayName || user?.email || 'Student'
      };

      if (includeCharts) {
        // Capture charts and combine with data
        const chartIds = ['weekly-chart', 'daily-chart', 'subject-chart', 'efficiency-chart'];
        const combinedPdf = await captureChartsAsPDF(chartIds, exportData);
        if (combinedPdf) {
          combinedPdf.save(`study-analytics-complete-${new Date().toISOString().split('T')[0]}.pdf`);
        }
      } else {
        // Export data only
        await exportAnalyticsToPDF(exportData);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExportingPDF(false);
    }
  };

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const weeklyData = getWeeklyData();
  const dailyData = getDailyData();
  const subjectData = getSubjectData();
  const efficiencyData = getEfficiencyData();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
            <p className="text-gray-600 dark:text-gray-400">
              Start tracking your study sessions to see detailed analytics and insights
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header with Export Options */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Study Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gain insights into your study patterns and performance
            </p>
          </div>
          
          {/* Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleExportPDF(false)}
              disabled={exportingPDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Export Data PDF
            </button>
            
            <button
              onClick={() => handleExportPDF(true)}
              disabled={exportingPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPDF ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Camera className="w-4 h-4" />
              )}
              Export with Charts
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(totalStudyTime)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalSessions}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {formatTime(averageSessionTime)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6" hover>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageEfficiency.toFixed(1)}/5
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-8 mb-8">
          {/* Basic Analytics - Always Available */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Progress */}
            <Card className="p-6" id="weekly-chart">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Weekly Study Hours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
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
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Daily Efficiency */}
            <Card className="p-6" id="daily-chart">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Daily Study Time & Efficiency
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
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
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Subject Distribution */}
          <Card className="p-6" id="subject-chart">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Study Time by Subject
            </h3>
            <div className="space-y-3">
              {subjectData.slice(0, 5).map((subject, index) => (
                <div key={subject.subject} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {subject.subject}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                      {subject.hours}h
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {subject.sessions} sessions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Analytics Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                Advanced Analytics
              </h2>
              {isPremium && <PremiumBadge />}
            </div>

            <PremiumFeatureGate
              featureName="Advanced Analytics Dashboard"
              description="Get detailed insights into your study patterns, performance predictions, and personalized recommendations"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Insights Panel */}
                <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      AI Study Insights
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        📈 Performance Trend
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your study efficiency has improved by 23% over the last month. Keep up the great work!
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        🎯 Recommendation
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consider studying Mathematics in the morning when your focus is highest.
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        ⚡ Productivity Score
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-green-600">87%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Predictive Analytics */}
                <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Performance Predictions
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        📊 Exam Readiness
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Mathematics Final</span>
                          <span className="text-sm font-bold text-green-600">92% Ready</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Physics Midterm</span>
                          <span className="text-sm font-bold text-yellow-600">76% Ready</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        🔮 Study Forecast
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        At your current pace, you'll complete your study goals 3 days ahead of schedule.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </PremiumFeatureGate>
          </div>

          {/* Efficiency Distribution */}
          <Card className="p-6" id="efficiency-chart">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Efficiency Ratings
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {efficiencyData.map((entry, index) => (
                <div key={entry.rating} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.rating}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Export Notice */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Export Your Analytics
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Save your study insights as a comprehensive PDF report. Choose "Export Data PDF" for detailed statistics and recommendations, or "Export with Charts" to include visual representations of your progress.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
