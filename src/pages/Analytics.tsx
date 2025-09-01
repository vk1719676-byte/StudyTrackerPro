import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Star, Brain, Zap, Crown, Calendar, Award, BookOpen, ArrowUp, ArrowDown, Activity, Download, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PremiumFeatureGate } from '../components/premium/PremiumFeatureGate';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { useAuth } from '../contexts/AuthContext';
import { getUserSessions, getUserExams } from '../services/firestore';
import { StudySession, Exam } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';

export const Analytics: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  // PDF Export functionality
  const exportToPDF = () => {
    setIsExporting(true);
    
    // Add print styles dynamically
    const printStyles = document.createElement('style');
    printStyles.id = 'pdf-export-styles';
    printStyles.textContent = `
      @media print {
        /* Hide navigation, header, footer */
        header, nav, footer, .navigation, .header, .footer, .navbar, .sidebar {
          display: none !important;
        }
        
        /* Hide non-essential elements */
        .no-print {
          display: none !important;
        }
        
        /* Page setup */
        @page {
          size: A4;
          margin: 0.5in;
          background: white;
        }
        
        /* Body styling for PDF */
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          background: white !important;
        }
        
        /* Advanced Custom Watermark */
        .pdf-watermark {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: -1 !important;
          pointer-events: none !important;
          background: 
            radial-gradient(circle at 15% 15%, rgba(139, 92, 246, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(59, 130, 246, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 60%),
            linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%) !important;
        }
        
        .pdf-watermark::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          width: 90%;
          height: 3px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.08) 20%, 
            rgba(59, 130, 246, 0.08) 40%, 
            rgba(16, 185, 129, 0.08) 60%, 
            rgba(245, 158, 11, 0.08) 80%, 
            transparent 100%) !important;
        }
        
        .pdf-watermark::after {
          content: 'StudyGoalTracker Pro • studygoaltracker-pro.netlify.app';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 2.5rem;
          font-weight: 100;
          color: rgba(107, 114, 128, 0.06) !important;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        /* Custom branding watermarks */
        .pdf-brand-watermark {
          position: fixed !important;
          bottom: 15px !important;
          right: 20px !important;
          z-index: 1000 !important;
          font-size: 9px !important;
          color: rgba(107, 114, 128, 0.5) !important;
          font-weight: 500 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-end !important;
          gap: 2px !important;
          line-height: 1.2 !important;
        }
        
        .pdf-creator-watermark {
          position: fixed !important;
          bottom: 15px !important;
          left: 20px !important;
          z-index: 1000 !important;
          font-size: 9px !important;
          color: rgba(107, 114, 128, 0.5) !important;
          font-weight: 500 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 2px !important;
          line-height: 1.2 !important;
        }
        
        .pdf-telegram-watermark {
          position: fixed !important;
          top: 15px !important;
          right: 20px !important;
          z-index: 1000 !important;
          font-size: 8px !important;
          color: rgba(107, 114, 128, 0.4) !important;
          font-weight: 400 !important;
          background: rgba(255, 255, 255, 0.8) !important;
          padding: 4px 8px !important;
          border-radius: 12px !important;
          border: 1px solid rgba(139, 92, 246, 0.1) !important;
        }
        
        /* Export info header */
        .pdf-header {
          display: block !important;
          text-align: center !important;
          margin-bottom: 2rem !important;
          padding: 1.5rem !important;
          border-bottom: 2px solid rgba(139, 92, 246, 0.15) !important;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%) !important;
        }
        
        /* Main container adjustments */
        .pdf-container {
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          min-height: auto !important;
        }
        
        /* Card styling for PDF */
        .pdf-card {
          background: white !important;
          border: 1px solid rgba(229, 231, 235, 0.6) !important;
          border-radius: 12px !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
          margin-bottom: 1.5rem !important;
          page-break-inside: avoid !important;
        }
        
        /* Chart containers */
        .recharts-responsive-container {
          background: white !important;
        }
        
        /* Grid adjustments */
        .pdf-grid-2 {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 1.5rem !important;
        }
        
        .pdf-grid-4 {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 1rem !important;
        }
        
        /* Typography */
        .pdf-title {
          font-size: 2rem !important;
          color: #1f2937 !important;
          margin-bottom: 0.5rem !important;
          font-weight: bold !important;
        }
        
        .pdf-subtitle {
          font-size: 1rem !important;
          color: #6b7280 !important;
          margin-bottom: 1rem !important;
        }
        
        /* Stat cards */
        .pdf-stat-card {
          text-align: center !important;
          padding: 1.5rem !important;
          background: rgba(249, 250, 251, 0.5) !important;
          border-radius: 12px !important;
        }
        
        .pdf-stat-value {
          font-size: 1.75rem !important;
          font-weight: bold !important;
          color: #1f2937 !important;
          margin-bottom: 0.25rem !important;
        }
        
        .pdf-stat-label {
          font-size: 0.875rem !important;
          color: #6b7280 !important;
        }
        
        /* Page breaks */
        .pdf-page-break {
          page-break-before: always !important;
        }
        
        /* Background patterns */
        .pdf-bg-pattern {
          background: 
            radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.02) 0%, transparent 30%),
            radial-gradient(circle at 90% 90%, rgba(59, 130, 246, 0.02) 0%, transparent 30%),
            linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%) !important;
        }
        
        /* Website link styling */
        .pdf-website-link {
          color: rgba(139, 92, 246, 0.7) !important;
          text-decoration: none !important;
          font-weight: 600 !important;
        }
      }
    `;
    
    document.head.appendChild(printStyles);
    
    // Add main watermark
    const watermark = document.createElement('div');
    watermark.className = 'pdf-watermark';
    document.body.appendChild(watermark);
    
    // Add brand watermark (bottom right)
    const brandWatermark = document.createElement('div');
    brandWatermark.className = 'pdf-brand-watermark';
    brandWatermark.innerHTML = `
      <div>📊 StudyGoalTracker Pro Analytics</div>
      <div>Generated: ${new Date().toLocaleDateString()}</div>
      <div class="pdf-website-link">studygoaltracker-pro.netlify.app</div>
    `;
    document.body.appendChild(brandWatermark);
    
    // Add creator watermark (bottom left)
    const creatorWatermark = document.createElement('div');
    creatorWatermark.className = 'pdf-creator-watermark';
    creatorWatermark.innerHTML = `
      <div>Created By: <strong>Vinay Kumar</strong></div>
      <div>Powered By: <strong>TRMs</strong></div>
    `;
    document.body.appendChild(creatorWatermark);
    
    // Add Telegram watermark (top right)
    const telegramWatermark = document.createElement('div');
    telegramWatermark.className = 'pdf-telegram-watermark';
    telegramWatermark.innerHTML = `📱 Join: t.me/studytrackerpro`;
    document.body.appendChild(telegramWatermark);
    
    // Wait a bit for styles to apply then print
    setTimeout(() => {
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        const stylesToRemove = document.getElementById('pdf-export-styles');
        if (stylesToRemove) stylesToRemove.remove();
        
        const watermarkToRemove = document.querySelector('.pdf-watermark');
        if (watermarkToRemove) watermarkToRemove.remove();
        
        const brandToRemove = document.querySelector('.pdf-brand-watermark');
        if (brandToRemove) brandToRemove.remove();
        
        const creatorToRemove = document.querySelector('.pdf-creator-watermark');
        if (creatorToRemove) creatorToRemove.remove();
        
        const telegramToRemove = document.querySelector('.pdf-telegram-watermark');
        if (telegramToRemove) telegramToRemove.remove();
        
        setIsExporting(false);
      }, 1000);
    }, 300);
  };

  // PDF Export functionality
  const exportToPDF = () => {
    setIsExporting(true);
    
    // Add print styles dynamically
    const printStyles = document.createElement('style');
    printStyles.id = 'pdf-export-styles';
    printStyles.textContent = `
      @media print {
        /* Hide non-essential elements */
        .no-print {
          display: none !important;
        }
        
        /* Page setup */
        @page {
          size: A4;
          margin: 0.5in;
          background: white;
        }
        
        /* Body styling for PDF */
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          background: white !important;
        }
        
        /* Advanced Watermark */
        .pdf-watermark {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          z-index: -1 !important;
          pointer-events: none !important;
          background: 
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
            linear-gradient(135deg, rgba(139, 92, 246, 0.01) 0%, rgba(59, 130, 246, 0.01) 100%) !important;
        }
        
        .pdf-watermark::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(139, 92, 246, 0.1) 25%, 
            rgba(59, 130, 246, 0.1) 50%, 
            rgba(16, 185, 129, 0.1) 75%, 
            transparent 100%) !important;
        }
        
        .pdf-watermark::after {
          content: 'StudyTracker Pro Analytics Report';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 3rem;
          font-weight: 100;
          color: rgba(107, 114, 128, 0.05) !important;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          white-space: nowrap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        /* Company branding watermark */
        .pdf-brand-watermark {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 1000 !important;
          font-size: 10px !important;
          color: rgba(107, 114, 128, 0.4) !important;
          font-weight: 500 !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        
        /* Export info header */
        .pdf-header {
          display: block !important;
          text-align: center !important;
          margin-bottom: 2rem !important;
          padding: 1rem !important;
          border-bottom: 2px solid rgba(139, 92, 246, 0.1) !important;
        }
        
        /* Main container adjustments */
        .pdf-container {
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          min-height: auto !important;
        }
        
        /* Card styling for PDF */
        .pdf-card {
          background: white !important;
          border: 1px solid rgba(229, 231, 235, 0.5) !important;
          border-radius: 8px !important;
          box-shadow: none !important;
          margin-bottom: 1rem !important;
          page-break-inside: avoid !important;
        }
        
        /* Chart containers */
        .recharts-responsive-container {
          background: white !important;
        }
        
        /* Grid adjustments */
        .pdf-grid-2 {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 1rem !important;
        }
        
        .pdf-grid-4 {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 0.75rem !important;
        }
        
        /* Typography */
        .pdf-title {
          font-size: 1.5rem !important;
          color: #1f2937 !important;
          margin-bottom: 0.5rem !important;
        }
        
        .pdf-subtitle {
          font-size: 0.875rem !important;
          color: #6b7280 !important;
          margin-bottom: 1rem !important;
        }
        
        /* Stat cards */
        .pdf-stat-card {
          text-align: center !important;
          padding: 1rem !important;
        }
        
        .pdf-stat-value {
          font-size: 1.5rem !important;
          font-weight: bold !important;
          color: #1f2937 !important;
        }
        
        .pdf-stat-label {
          font-size: 0.75rem !important;
          color: #6b7280 !important;
          margin-top: 0.25rem !important;
        }
        
        /* Page breaks */
        .pdf-page-break {
          page-break-before: always !important;
        }
        
        /* Background patterns */
        .pdf-bg-pattern {
          background: 
            radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.02) 0%, transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.02) 0%, transparent 25%) !important;
        }
      }
    `;
    
    document.head.appendChild(printStyles);
    
    // Add watermark and PDF-specific elements
    const watermark = document.createElement('div');
    watermark.className = 'pdf-watermark';
    document.body.appendChild(watermark);
    
    const brandWatermark = document.createElement('div');
    brandWatermark.className = 'pdf-brand-watermark no-print';
    brandWatermark.innerHTML = '🎓 StudyTracker Pro • Generated on ' + new Date().toLocaleDateString();
    document.body.appendChild(brandWatermark);
    
    // Wait a bit for styles to apply then print
    setTimeout(() => {
      window.print();
      
      // Clean up after printing
      setTimeout(() => {
        const stylesToRemove = document.getElementById('pdf-export-styles');
        if (stylesToRemove) stylesToRemove.remove();
        
        const watermarkToRemove = document.querySelector('.pdf-watermark');
        if (watermarkToRemove) watermarkToRemove.remove();
        
        const brandToRemove = document.querySelector('.pdf-brand-watermark');
        if (brandToRemove) brandToRemove.remove();
        
        setIsExporting(false);
      }, 1000);
    }, 300);
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

  // Calculate growth percentages for enhanced UI
  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

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
    <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 ${isExporting ? 'pdf-container pdf-bg-pattern' : ''}`}>
      {/* PDF Export Header - Only visible when printing */}
      <div className="pdf-header" style={{ display: 'none' }}>
        <h1 className="pdf-title">📊 StudyGoalTracker Pro Analytics Report</h1>
        <p className="pdf-subtitle">
          Generated on {new Date().toLocaleDateString()} • {user?.email}
        </p>
        <div className="pdf-grid-4" style={{ marginTop: '1rem' }}>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{formatTime(totalStudyTime)}</div>
            <div className="pdf-stat-label">Total Study Time</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{totalSessions}</div>
            <div className="pdf-stat-label">Total Sessions</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{formatTime(averageSessionTime)}</div>
            <div className="pdf-stat-label">Avg. Session</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{averageEfficiency.toFixed(1)}/5</div>
            <div className="pdf-stat-label">Avg. Efficiency</div>
          </div>
        </div>
      </div>

      {/* PDF Export Header - Only visible when printing */}
      <div className="pdf-header" style={{ display: 'none' }}>
        <h1 className="pdf-title">📊 StudyTracker Pro Analytics Report</h1>
        <p className="pdf-subtitle">
          Generated on {new Date().toLocaleDateString()} • {user?.email}
        </p>
        <div className="pdf-grid-4" style={{ marginTop: '1rem' }}>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{formatTime(totalStudyTime)}</div>
            <div className="pdf-stat-label">Total Study Time</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{totalSessions}</div>
            <div className="pdf-stat-label">Total Sessions</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{formatTime(averageSessionTime)}</div>
            <div className="pdf-stat-label">Avg. Session</div>
          </div>
          <div className="pdf-stat-card">
            <div className="pdf-stat-value">{averageEfficiency.toFixed(1)}/5</div>
            <div className="pdf-stat-label">Avg. Efficiency</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 pt-4 md:pt-8">
        {/* Header with improved design and PDF export button */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              Study Analytics
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`no-print flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover insights, track progress, and optimize your learning journey with data-driven analytics
          </p>
        </div>

        {/* Time frame selector */}
        <div className="flex justify-center mb-8 no-print">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTimeframe === timeframe
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 pdf-grid-4">
          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+12%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+8%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+15%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pdf-grid-2">
            {/* Weekly Progress */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Weekly Study Hours
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full no-print">
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
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
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
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
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

          {/* Page break for PDF */}
          <div className="pdf-page-break" style={{ display: 'none' }}></div>

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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pdf-grid-2">
                {/* AI Insights Panel with enhanced design */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-sm pdf-card">
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
            <div className="flex-1"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              Study Analytics
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`no-print flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isExporting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover insights, track progress, and optimize your learning journey with data-driven analytics
          </p>
        </div>

        {/* Time frame selector */}
        <div className="flex justify-center mb-8 no-print">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setActiveTimeframe(timeframe)}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 ${
                  activeTimeframe === timeframe
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 pdf-grid-4">
          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+12%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+8%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">+15%</span>
                  <span className="text-xs text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
            </div>
          </Card>

          <Card 
            className={`p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer pdf-card ${
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
                <div className="flex items-center mt-2 no-print">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pdf-grid-2">
            {/* Weekly Progress */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Weekly Study Hours
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full no-print">
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
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
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
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
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

          {/* Page break for PDF */}
          <div className="pdf-page-break" style={{ display: 'none' }}></div>

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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pdf-grid-2">
                {/* AI Insights Panel with enhanced design */}
                <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-sm pdf-card">
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
                <Card className="p-8 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-0 shadow-xl backdrop-blur-sm pdf-card">
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
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl pdf-card">
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
