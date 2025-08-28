import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Zap, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Exam } from '../../types';
import { isAfter, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

interface ExamCountdownProps {
  exams: Exam[];
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ exams }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for real-time countdown

    return () => clearInterval(timer);
  }, []);

  const upcomingExams = exams
    .filter(exam => isAfter(exam.date, currentTime))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const getCountdown = (examDate: Date) => {
    const totalDays = differenceInDays(examDate, currentTime);
    const totalHours = differenceInHours(examDate, currentTime);
    const totalMinutes = differenceInMinutes(examDate, currentTime);
    const totalSeconds = differenceInSeconds(examDate, currentTime);

    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalHours, totalDays: totalDays };
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          color: 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
          gradient: 'from-red-500 to-pink-500',
          icon: AlertTriangle
        };
      case 'medium': 
        return {
          color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
          gradient: 'from-amber-500 to-orange-500',
          icon: Target
        };
      case 'low': 
        return {
          color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
          gradient: 'from-emerald-500 to-teal-500',
          icon: Calendar
        };
      default: 
        return {
          color: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800',
          gradient: 'from-gray-500 to-slate-500',
          icon: Calendar
        };
    }
  };

  const getUrgencyLevel = (countdown: any) => {
    if (countdown.totalDays <= 1) return 'critical';
    if (countdown.totalDays <= 3) return 'urgent';
    if (countdown.totalDays <= 7) return 'warning';
    return 'normal';
  };

  const getUrgencyStyles = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'critical':
        return {
          container: 'ring-2 ring-red-500 ring-opacity-75 shadow-red-500/25 shadow-2xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/10 before:via-transparent before:to-red-500/10 before:rounded-xl',
          message: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
          messageText: '🚨 EXAM ALERT! Time to shine - you\'ve got this!',
          pulseColor: ''
        };
      case 'urgent':
        return {
          container: 'ring-2 ring-orange-400 ring-opacity-60 shadow-orange-500/20 shadow-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500/8 before:via-transparent before:to-orange-500/8 before:rounded-xl',
          message: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
          messageText: '⚡ CRUNCH TIME! Channel your inner genius mode!',
          pulseColor: ''
        };
      case 'warning':
        return {
          container: 'ring-1 ring-yellow-400 ring-opacity-50 shadow-yellow-500/15 shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-400/6 before:via-transparent before:to-yellow-400/6 before:rounded-xl',
          message: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
          messageText: '🎯 GAME ON! One week to academic victory!',
          pulseColor: ''
        };
      default:
        return {
          container: 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/4 before:via-transparent before:to-purple-500/4 before:rounded-xl',
          message: '',
          messageText: '',
          pulseColor: ''
        };
    }
  };

  if (upcomingExams.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-0 shadow-xl">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
          <Calendar className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          No Upcoming Exams
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          All caught up! Add your next exam to start tracking your preparation journey.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Exam Countdown
        </h2>
      </div>
      
      {upcomingExams.map((exam, index) => {
        const countdown = getCountdown(exam.date);
        const urgencyLevel = getUrgencyLevel(countdown);
        const urgencyStyles = getUrgencyStyles(urgencyLevel);
        const priorityConfig = getPriorityConfig(exam.priority);
        const IconComponent = priorityConfig.icon;

        return (
          <Card 
            key={exam.id} 
            className={`p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl ${urgencyStyles.container} ${index === 0 ? 'transform scale-[1.02]' : ''}`}
          >
            {/* Corner Lighting Effects */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-x-10 -translate-y-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/15 to-transparent rounded-full translate-x-8 -translate-y-8 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full -translate-x-12 translate-y-12 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-18 h-18 bg-gradient-to-tl from-white/12 to-transparent rounded-full translate-x-9 translate-y-9 pointer-events-none"></div>
            
            {/* Header */}
            <div className="relative flex items-start justify-between mb-6 z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${priorityConfig.gradient} flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {exam.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig.color}`}>
                    {exam.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {exam.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Countdown Display */}
            <div className="relative z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
              <div className="relative bg-gradient-to-br from-slate-50/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/40 shadow-inner">
                {/* Inner corner highlights */}
                <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-white/30 to-transparent rounded-full -translate-x-6 -translate-y-6"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-tl from-white/20 to-transparent rounded-full translate-x-5 translate-y-5"></div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { value: countdown.days, label: 'Days', color: 'from-purple-500 to-pink-500', bg: 'from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30' },
                    { value: countdown.hours, label: 'Hours', color: 'from-blue-500 to-purple-500', bg: 'from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30' },
                    { value: countdown.minutes, label: 'Minutes', color: 'from-teal-500 to-blue-500', bg: 'from-teal-50/80 to-blue-50/80 dark:from-teal-900/30 dark:to-blue-900/30' },
                    { value: countdown.seconds, label: 'Seconds', color: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30' }
                  ].map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`relative bg-gradient-to-br ${item.bg} rounded-xl p-3 mb-2 border border-white/40 dark:border-gray-600/40 shadow-sm overflow-hidden`}>
                        {/* Mini corner lights for each countdown box */}
                        <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-white/25 to-transparent rounded-full translate-x-3 -translate-y-3"></div>
                        <div className={`text-2xl md:text-3xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent transition-all duration-300 relative z-10`}>
                          {item.value.toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    <span>Time Remaining</span>
                    <span>{countdown.totalDays > 0 ? `${countdown.totalDays} days` : `${countdown.totalHours} hours`}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${priorityConfig.gradient} transition-all duration-1000 rounded-full`}
                      style={{ 
                        width: `${Math.max(10, Math.min(100, (countdown.days / 30) * 100))}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Message */}
            {urgencyStyles.message && (
              <div className={`relative mt-4 p-3 ${urgencyStyles.message} rounded-xl shadow-lg overflow-hidden z-10`}>
                {/* Message corner lighting */}
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-x-4 -translate-y-4"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-white/15 to-transparent rounded-full translate-x-3 translate-y-3"></div>
                <p className="text-sm font-bold text-center tracking-wide">
                  {urgencyStyles.messageText}
                </p>
              </div>
            )}

            {/* Study Tips for Different Urgency Levels */}
            {urgencyLevel !== 'normal' && (
              <div className="relative mt-4 p-3 bg-gradient-to-r from-indigo-50/80 to-cyan-50/80 dark:from-indigo-900/30 dark:to-cyan-900/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 overflow-hidden z-10">
                {/* Study tip corner lighting */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-white/20 to-transparent rounded-full translate-x-3 -translate-y-3"></div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Study Tip</span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
                  {urgencyLevel === 'critical' 
                    ? 'Power through with key concepts, mock tests, and deep breathing. Victory is within reach! 🏆'
                    : urgencyLevel === 'urgent'
                    ? 'Target weak spots, craft killer summary notes, and master the clock. You\'re in the zone! 🎯'
                    : 'Build your battle plan, tackle the tough stuff first, and create momentum. Champions start here! 💪'
                  }
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
