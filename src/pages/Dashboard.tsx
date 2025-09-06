import React, { useEffect, useState } from 'react';
import { BookOpen, Target, TrendingUp, Award, Sparkles, Zap, Star, Calendar, Clock, Trophy, ChevronRight, Brain, Flame, Activity, BarChart3, AlertCircle, CheckCircle2, Timer, X, Lightbulb, Rocket, Plus, ArrowRight, TrendingDown, Users, ChevronLeft, MapPin, Edit3, Save, RotateCcw } from 'lucide-react';
import { ExamCountdown } from '../components/dashboard/ExamCountdown';
import { StudyTimer } from '../components/dashboard/StudyTimer';
import { Card } from '../components/ui/Card';
import { EnhancedTextBanner } from '../components/banner/EnhancedTextBanner';
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

// Study Schedule Planner Component
const StudySchedulePlanner: React.FC<{
  exams: Exam[];
  sessions: StudySession[];
}> = ({ exams, sessions }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [plannedSessions, setPlannedSessions] = useState<{[key: string]: {subject: string; time: string; duration: number}[]}>({});

  // Get current week dates
  const getWeekDates = (weekOffset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentWeek);
  const weekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return sessions.filter(session => 
      new Date(session.date).toDateString() === dateStr
    );
  };

  // Get planned sessions for a date
  const getPlannedSessionsForDate = (date: Date) => {
    const dateKey = date.toDateString();
    return plannedSessions[dateKey] || [];
  };

  // Add planned session
  const addPlannedSession = (date: Date, subject: string, time: string, duration: number) => {
    const dateKey = date.toDateString();
    setPlannedSessions(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), { subject, time, duration }]
    }));
  };

  // Get exams for a specific date
  const getExamsForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return exams.filter(exam => 
      new Date(exam.date).toDateString() === dateStr
    );
  };

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'English', 'Computer Science'];
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return (
    <ModernCard className="p-8 h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl shadow-xl">
            <Calendar className="w-8 h-8 text-white drop-shadow-sm" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">Study Schedule</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Plan your week for success</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-2xl p-2">
            <button
              onClick={() => setCurrentWeek(prev => prev - 1)}
              className="p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
            </button>
            <div className="px-6 py-2 font-bold text-gray-900 dark:text-gray-100 min-w-[140px] text-center">
              {currentWeek === 0 ? 'This Week' : 
               currentWeek > 0 ? `${currentWeek} Week${currentWeek > 1 ? 's' : ''} Ahead` : 
               `${Math.abs(currentWeek)} Week${Math.abs(currentWeek) > 1 ? 's' : ''} Ago`}
            </div>
            <button
              onClick={() => setCurrentWeek(prev => prev + 1)}
              className="p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all duration-200 group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Edit Mode Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              isEditing 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg' 
                : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-5 h-5" />
                Save Plan
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5" />
                Plan Week
              </>
            )}
          </button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-2">
        {weekDates.map((date, index) => {
          const dayName = weekNames[index];
          const isToday = date.toDateString() === new Date().toDateString();
          const sessionsForDay = getSessionsForDate(date);
          const plannedForDay = getPlannedSessionsForDate(date);
          const examsForDay = getExamsForDate(date);
          const totalStudyTime = sessionsForDay.reduce((total, session) => total + session.duration, 0);
          
          return (
            <div
              key={date.toDateString()}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                isToday 
                  ? 'border-purple-400 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/30 dark:via-indigo-900/30 dark:to-blue-900/30 shadow-lg shadow-purple-200/30 dark:shadow-purple-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Day Header */}
              <div className={`p-4 border-b border-gray-200/50 dark:border-gray-700/50 ${
                isToday ? 'bg-purple-500' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <div className="text-center">
                  <div className={`text-sm font-bold uppercase tracking-wider mb-1 ${
                    isToday ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {dayName}
                  </div>
                  <div className={`text-xl font-black ${
                    isToday ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {date.getDate()}
                  </div>
                  {isToday && (
                    <div className="text-xs text-white/80 font-semibold">TODAY</div>
                  )}
                </div>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-3 min-h-[300px]">
                {/* Exams */}
                {examsForDay.map((exam) => (
                  <div key={exam.id} className="relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl shadow-lg">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 drop-shadow-sm" />
                        <span className="text-xs font-bold uppercase tracking-wide">EXAM</span>
                      </div>
                      <div className="font-bold text-sm truncate">{exam.name}</div>
                      <div className="text-xs opacity-90">{exam.subject}</div>
                    </div>
                  </div>
                ))}

                {/* Completed Sessions */}
                {sessionsForDay.map((session, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">COMPLETED</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{session.subject}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{Math.round(session.duration)}m • {session.topic}</div>
                  </div>
                ))}

                {/* Planned Sessions */}
                {plannedForDay.map((planned, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">PLANNED</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{planned.subject}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{planned.time} • {planned.duration}m</div>
                  </div>
                ))}

                {/* Add Session Button (Edit Mode) */}
                {isEditing && (
                  <button
                    onClick={() => {
                      const subject = subjects[Math.floor(Math.random() * subjects.length)];
                      const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
                      const duration = [60, 90, 120][Math.floor(Math.random() * 3)];
                      addPlannedSession(date, subject, time, duration);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 group"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold">Add Session</span>
                  </button>
                )}

                {/* Day Summary */}
                {(sessionsForDay.length > 0 || plannedForDay.length > 0) && (
                  <div className="pt-3 mt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      <div className="font-semibold">
                        {totalStudyTime > 0 && `${Math.round(totalStudyTime)}m studied`}
                        {totalStudyTime > 0 && plannedForDay.length > 0 && ' • '}
                        {plannedForDay.length > 0 && `${plannedForDay.length} planned`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Week Summary */}
      <div className="mt-8 p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
                {sessions.filter(session => {
                  const sessionDate = new Date(session.date);
                  return weekDates.some(date => date.toDateString() === sessionDate.toDateString());
                }).length}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
                {Math.round(sessions.filter(session => {
                  const sessionDate = new Date(session.date);
                  return weekDates.some(date => date.toDateString() === sessionDate.toDateString());
                }).reduce((total, session) => total + session.duration, 0) / 60)}h
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-gray-900 dark:text-gray-100">
                {Object.values(plannedSessions).flat().length}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Planned</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentWeek(0)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-semibold transition-all duration-300 border border-gray-300 dark:border-gray-600"
            >
              <RotateCcw className="w-4 h-4" />
              Current Week
            </button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

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

        {/* Enhanced Text Banner - Now positioned after hero section */}
        <EnhancedTextBanner />

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

        {/* Study Schedule Planner - NEW FEATURE */}
        <div className="mb-10">
          <StudySchedulePlanner exams={exams} sessions={sessions} />
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

          {/* Enhanced Upcoming Deadlines */}
          <div>
            <ModernCard className="p-0 h-full overflow-hidden">
              {/* Enhanced Header */}
              <div className="relative bg-gradient-to-br from-red-600 via-pink-600 to-rose-700 p-6">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-2 left-6 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30">
                      <AlertCircle className="w-7 h-7 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-1 drop-shadow-sm">Deadlines</h2>
                      <p className="text-white/80 font-medium text-sm">Upcoming this week</p>
                    </div>
                  </div>
                  
                  {upcomingDeadlines.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-2 border border-white/30">
                      <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
                      <span className="text-white font-bold text-sm">{upcomingDeadlines.length} urgent</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Content */}
              <div className="p-6">
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingDeadlines.slice(0, 4).map((exam, index) => {
                      const daysUntil = Math.ceil((new Date(exam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysUntil <= 3;
                      const isToday = daysUntil === 0;
                      const studySessionsForExam = sessions.filter(s => s.examId === exam.id);
                      const totalStudyTime = studySessionsForExam.reduce((total, session) => total + session.duration, 0);
                      
                      return (
                        <div 
                          key={exam.id} 
                          className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Deadline Card */}
                          <div className={`relative p-5 border-2 transition-all duration-300 ${
                            isToday 
                              ? 'bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900/30 dark:via-pink-900/30 dark:to-rose-900/30 border-red-400 shadow-lg shadow-red-200/50 dark:shadow-red-900/30' 
                              : isUrgent 
                              ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border-orange-400 shadow-lg shadow-orange-200/30 dark:shadow-orange-900/20' 
                              : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-blue-300 shadow-lg shadow-blue-200/30 dark:shadow-blue-900/20'
                          } rounded-2xl`}>
                            
                            {/* Priority indicator line */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${
                              isToday 
                                ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                                : isUrgent 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            } rounded-t-2xl`}></div>

                            <div className="flex items-start justify-between mb-4">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-black text-gray-900 dark:text-gray-100 text-xl truncate">
                                    {exam.name}
                                  </h3>
                                  {isToday && (
                                    <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                      LIVE
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                                  {exam.subject}
                                </p>
                                
                                {/* Enhanced countdown display */}
                                <div className="flex items-center gap-3">
                                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${
                                    isToday 
                                      ? 'bg-red-500 text-white shadow-lg' 
                                      : isUrgent 
                                      ? 'bg-orange-500 text-white shadow-lg' 
                                      : 'bg-blue-500 text-white shadow-lg'
                                  }`}>
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {isToday ? 'TODAY!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days left`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right flex-shrink-0 ml-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                  {new Date(exam.date).toLocaleDateString()}
                                </div>
                                <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  totalStudyTime >= 300 ? 'text-emerald-700 bg-emerald-200 dark:text-emerald-300 dark:bg-emerald-800/40' : 
                                  totalStudyTime >= 120 ? 'text-blue-700 bg-blue-200 dark:text-blue-300 dark:bg-blue-800/40' : 
                                  'text-red-700 bg-red-200 dark:text-red-300 dark:bg-red-800/40'
                                }`}>
                                  {totalStudyTime >= 300 ? '✅ Ready' : 
                                   totalStudyTime >= 120 ? '⚡ Good' : '🚨 Study More'}
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress bar and study time */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                  Study Progress
                                </span>
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                  {formatMinutes(totalStudyTime)} / 5h goal
                                </span>
                              </div>
                              
                              {/* Enhanced progress bar */}
                              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full"></div>
                                <div 
                                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                                    totalStudyTime >= 300 
                                      ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-lg shadow-emerald-200/50' 
                                      : totalStudyTime >= 120 
                                      ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-blue-200/50' 
                                      : 'bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 shadow-lg shadow-red-200/50'
                                  }`}
                                  style={{ width: `${Math.min((totalStudyTime / 300) * 100, 100)}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                </div>
                                
                                {/* Sparkle effect for completed goals */}
                                {totalStudyTime >= 300 && (
                                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Study milestones */}
                              <div className="flex justify-between text-xs">
                                <span className={`font-semibold ${totalStudyTime >= 60 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                                  1h
                                </span>
                                <span className={`font-semibold ${totalStudyTime >= 180 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                  3h
                                </span>
                                <span className={`font-semibold ${totalStudyTime >= 300 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                                  5h Goal
                                </span>
                              </div>
                            </div>

                            {/* Action button */}
                            <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                              <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                isUrgent 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg' 
                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg'
                              }`}>
                                <Rocket className="w-4 h-4" />
                                {isUrgent ? 'Study Now!' : 'Start Studying'}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* View all deadlines link */}
                    {upcomingDeadlines.length > 4 && (
                      <div className="text-center pt-4">
                        <button className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold bg-red-50 dark:bg-red-900/30 px-6 py-3 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-300 group">
                          View All Deadlines
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="p-8 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 rounded-full mb-4 inline-block shadow-xl">
                        <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce">
                        ✨
                      </div>
                    </div>
                    <h3 className="font-black text-gray-900 dark:text-gray-100 text-2xl mb-3">
                      All Clear!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                      No deadlines this week.<br />
                      Perfect time to get ahead! 🚀
                    </p>
                    <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <Plus className="w-5 h-5" />
                      Plan Ahead
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                )}
              </div>
            </ModernCard>
          </div>
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

        {/* Study Schedule Planner */}
        <div className="mb-10">
          <ModernCard className="p-0 overflow-hidden">
            {/* Enhanced Header */}
            <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-4 sm:p-6 lg:p-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-4 right-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-2 left-6 w-12 sm:w-16 h-12 sm:h-16 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/30">
                    <Calendar className="w-5 h-5 sm:w-6 lg:w-7 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-sm">Study Schedule</h2>
                    <p className="text-white/80 font-medium text-sm sm:text-base">Plan your week ahead</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 border border-white/30">
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                    <span className="text-white font-bold text-xs sm:text-sm">This Week</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Week Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <button className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 rotate-180" />
                  </button>
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105">
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
                  <button className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 font-bold px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Plan Session</span>
                    <span className="sm:hidden">Plan</span>
                  </button>
                  <button className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 font-bold px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base">
                    <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Smart Plan</span>
                    <span className="sm:hidden">Auto</span>
                  </button>
                </div>
              </div>

              {/* Weekly Calendar Grid */}
              <div className="space-y-4 sm:space-y-6">
                {/* Days Header - Hidden on mobile, shown on tablet+ */}
                <div className="hidden sm:grid sm:grid-cols-7 gap-2 lg:gap-4 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className="text-center">
                      <div className={`text-sm lg:text-base font-bold p-2 lg:p-3 rounded-xl ${
                        index === new Date().getDay() 
                          ? 'text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {day}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-7 sm:gap-2 lg:gap-4">
                  {[...Array(7)].map((_, dayIndex) => {
                    const date = new Date();
                    date.setDate(date.getDate() - date.getDay() + dayIndex);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
                    
                    // Mock data for demonstration
                    const dayExams = exams.filter(exam => 
                      new Date(exam.date).toDateString() === date.toDateString()
                    );
                    const daySessions = sessions.filter(session => 
                      new Date(session.date).toDateString() === date.toDateString()
                    );
                    
                    return (
                      <div key={dayIndex} className={`group relative ${
                        isToday 
                          ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-2 border-purple-300 dark:border-purple-600' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      } rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-5 transition-all duration-300 hover:shadow-lg min-h-[120px] sm:min-h-[160px] lg:min-h-[200px]`}>
                        
                        {/* Mobile Day Header */}
                        <div className="sm:hidden flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`text-lg font-black ${
                              isToday ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {date.getDate()}
                            </div>
                            <div>
                              <div className={`text-base font-bold ${
                                isToday ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {dayName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                          {isToday && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Today
                            </div>
                          )}
                        </div>

                        {/* Desktop Day Header */}
                        <div className="hidden sm:block">
                          <div className="flex items-center justify-between mb-3 lg:mb-4">
                            <div className={`text-lg lg:text-xl font-black ${
                              isToday ? 'text-purple-700 dark:text-purple-400' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {date.getDate()}
                            </div>
                            {isToday && (
                              <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                Today
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Day Content */}
                        <div className="space-y-2">
                          {/* Exams */}
                          {dayExams.map((exam, examIndex) => (
                            <div key={`exam-${examIndex}`} className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 lg:p-3 rounded-xl shadow-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="font-bold text-xs lg:text-sm truncate">EXAM</span>
                              </div>
                              <div className="text-xs lg:text-sm font-semibold truncate">{exam.name}</div>
                            </div>
                          ))}
                          
                          {/* Study Sessions */}
                          {daySessions.slice(0, 2).map((session, sessionIndex) => (
                            <div key={`session-${sessionIndex}`} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-2 lg:p-3 rounded-xl shadow-md">
                              <div className="flex items-center gap-2 mb-1">
                                <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="font-bold text-xs lg:text-sm">{formatMinutes(session.duration)}</span>
                              </div>
                              <div className="text-xs lg:text-sm font-semibold truncate">{session.subject}</div>
                            </div>
                          ))}
                          
                          {/* Planned Sessions (Mock data) */}
                          {dayIndex === 1 && (
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 lg:p-3 rounded-xl shadow-md border-2 border-dashed border-blue-300">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="font-bold text-xs lg:text-sm">2h planned</span>
                              </div>
                              <div className="text-xs lg:text-sm font-semibold">Mathematics</div>
                            </div>
                          )}
                          
                          {/* Add Session Button */}
                          {dayExams.length === 0 && daySessions.length < 2 && (
                            <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl p-2 lg:p-3 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 group">
                              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mx-auto mb-1 group-hover:scale-110 transition-transform duration-300" />
                              <div className="text-xs lg:text-sm font-semibold">Add Session</div>
                            </button>
                          )}
                          
                          {/* More sessions indicator */}
                          {daySessions.length > 2 && (
                            <div className="text-center">
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                +{daySessions.length - 2} more
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Summary */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                    <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                      {thisWeekSessions.length}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Sessions
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                    <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                      {formatMinutes(weeklyStudyTime)}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Study Time
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50">
                    <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">
                      {upcomingDeadlines.length}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Deadlines
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-700/50">
                    <div className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 mb-1">
                      {Math.round(averageEfficiency * 10) / 10}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Avg Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ModernCard>
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
