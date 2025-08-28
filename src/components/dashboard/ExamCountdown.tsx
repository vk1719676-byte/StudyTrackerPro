import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Zap, Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { Exam } from '../../types';
import { formatDistanceToNow, isAfter, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';

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
    const totalSeconds = differenceInSeconds(examDate, currentTime);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'low': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800';
    }
  };

  const getUrgencyGradient = (days: number) => {
    if (days <= 1) return 'from-red-500/20 via-orange-500/20 to-red-500/20';
    if (days <= 3) return 'from-orange-500/20 via-yellow-500/20 to-orange-500/20';
    if (days <= 7) return 'from-yellow-500/20 via-blue-500/20 to-yellow-500/20';
    return 'from-blue-500/20 via-purple-500/20 to-indigo-500/20';
  };

  const getCountdownColors = (days: number) => {
    if (days <= 1) return {
      days: 'text-red-600 dark:text-red-400',
      hours: 'text-orange-600 dark:text-orange-400',
      minutes: 'text-yellow-600 dark:text-yellow-400',
      seconds: 'text-red-500 dark:text-red-400'
    };
    if (days <= 3) return {
      days: 'text-orange-600 dark:text-orange-400',
      hours: 'text-yellow-600 dark:text-yellow-400',
      minutes: 'text-amber-600 dark:text-amber-400',
      seconds: 'text-orange-500 dark:text-orange-400'
    };
    if (days <= 7) return {
      days: 'text-yellow-600 dark:text-yellow-400',
      hours: 'text-blue-600 dark:text-blue-400',
      minutes: 'text-indigo-600 dark:text-indigo-400',
      seconds: 'text-purple-500 dark:text-purple-400'
    };
    return {
      days: 'text-blue-600 dark:text-blue-400',
      hours: 'text-indigo-600 dark:text-indigo-400',
      minutes: 'text-purple-600 dark:text-purple-400',
      seconds: 'text-cyan-500 dark:text-cyan-400'
    };
  };

  if (upcomingExams.length === 0) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
          <Calendar className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          No Upcoming Exams
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Add your first exam to start tracking your progress and stay on top of your schedule!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Upcoming Exams
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay focused and prepared
          </p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {upcomingExams.map((exam) => {
          const countdown = getCountdown(exam.date);
          const isUrgent = countdown.days <= 7;
          const isCritical = countdown.days <= 3;
          const colors = getCountdownColors(countdown.days);

          return (
            <Card 
              key={exam.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                isCritical ? 'ring-2 ring-red-500/50 shadow-red-100 dark:shadow-red-900/20' : 
                isUrgent ? 'ring-2 ring-yellow-500/50 shadow-yellow-100 dark:shadow-yellow-900/20' : ''
              }`}
              hover
            >
              {/* Background gradient animation */}
              <div className={`absolute inset-0 bg-gradient-to-r ${getUrgencyGradient(countdown.days)} animate-pulse opacity-50`} />
              
              <div className="relative p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {exam.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(exam.priority)}`}>
                        {exam.priority.toUpperCase()}
                      </span>
                      {isUrgent && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-medium text-red-600 dark:text-red-400">URGENT</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <p className="text-sm font-medium">
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
                </div>

                {/* Enhanced Countdown Display */}
                <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="group">
                      <div className={`text-3xl sm:text-4xl font-bold ${colors.days} transition-all duration-300 group-hover:scale-110`}>
                        {countdown.days.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wide">
                        Days
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-3xl sm:text-4xl font-bold ${colors.hours} transition-all duration-300 group-hover:scale-110`}>
                        {countdown.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wide">
                        Hours
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-3xl sm:text-4xl font-bold ${colors.minutes} transition-all duration-300 group-hover:scale-110`}>
                        {countdown.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wide">
                        Minutes
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-3xl sm:text-4xl font-bold ${colors.seconds} transition-all duration-300 group-hover:scale-110`}>
                        {countdown.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-wide">
                        Seconds
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for visual countdown */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>Time remaining</span>
                      <span>{formatDistanceToNow(exam.date)} left</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${
                          countdown.days <= 1 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          countdown.days <= 3 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                          countdown.days <= 7 ? 'bg-gradient-to-r from-yellow-500 to-blue-500' :
                          'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        style={{
                          width: `${Math.max(10, Math.min(100, (countdown.totalSeconds / (30 * 24 * 3600)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Motivational Messages */}
                {countdown.days <= 1 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-500 animate-pulse" />
                      <p className="text-sm font-bold text-red-700 dark:text-red-300">
                        🔥 Last 24 hours! Give it your absolute best!
                      </p>
                    </div>
                  </div>
                )}
                {countdown.days <= 3 && countdown.days > 1 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-l-4 border-orange-500 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                        ⚡ Final sprint! Focus on high-impact study sessions!
                      </p>
                    </div>
                  </div>
                )}
                {countdown.days <= 7 && countdown.days > 3 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        📚 One week to go! Stick to your study plan!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
