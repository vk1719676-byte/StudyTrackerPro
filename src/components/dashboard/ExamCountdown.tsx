import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Zap, Target, BookOpen, Brain, Coffee, Trophy, Flame, Timer, Award } from 'lucide-react';
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
      case 'high': return 'text-red-700 bg-gradient-to-r from-red-50 to-rose-100 dark:from-red-950/50 dark:to-rose-950/50 border-red-300 dark:border-red-700 shadow-red-100 dark:shadow-red-900/20';
      case 'medium': return 'text-amber-700 bg-gradient-to-r from-amber-50 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-300 dark:border-amber-700 shadow-amber-100 dark:shadow-amber-900/20';
      case 'low': return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-300 dark:border-emerald-700 shadow-emerald-100 dark:shadow-emerald-900/20';
      default: return 'text-gray-700 bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-300 dark:border-gray-700 shadow-gray-100 dark:shadow-gray-900/20';
    }
  };

  const getCardDesign = (days: number) => {
    if (days === 0) return {
      gradient: 'from-red-600 via-rose-500 to-pink-600',
      shadow: 'shadow-xl shadow-red-500/30',
      border: 'border-red-500',
      glow: 'ring-2 ring-red-500/40',
      bgGradient: 'from-red-50 via-rose-50 to-pink-50 dark:from-red-950/50 dark:via-rose-950/50 dark:to-pink-950/50'
    };
    if (days === 1) return {
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      shadow: 'shadow-lg shadow-orange-500/25',
      border: 'border-orange-500',
      glow: 'ring-2 ring-orange-500/30',
      bgGradient: 'from-orange-50 via-red-50 to-rose-50 dark:from-orange-950/50 dark:via-red-950/50 dark:to-rose-950/50'
    };
    if (days === 2) return {
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      shadow: 'shadow-lg shadow-amber-500/20',
      border: 'border-amber-500',
      glow: 'ring-1 ring-amber-500/25',
      bgGradient: 'from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/50 dark:via-orange-950/50 dark:to-red-950/50'
    };
    if (days <= 7) return {
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      shadow: 'shadow-md shadow-blue-500/15',
      border: 'border-blue-400',
      glow: '',
      bgGradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50'
    };
    return {
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      shadow: 'shadow-md shadow-emerald-500/10',
      border: 'border-emerald-400',
      glow: '',
      bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50'
    };
  };

  const getCountdownColors = (days: number) => {
    if (days === 0) return {
      days: 'text-white bg-gradient-to-br from-red-600 to-red-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-yellow-600 to-yellow-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-red-600 to-red-700 shadow-lg'
    };
    if (days === 1) return {
      days: 'text-white bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-red-600 to-red-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg'
    };
    if (days === 2) return {
      days: 'text-white bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-yellow-600 to-yellow-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg'
    };
    if (days <= 3) return {
      days: 'text-white bg-gradient-to-br from-yellow-600 to-yellow-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-amber-600 to-amber-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-orange-600 to-orange-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-yellow-600 to-yellow-700 shadow-lg'
    };
    if (days <= 7) return {
      days: 'text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg'
    };
    return {
      days: 'text-white bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg',
      hours: 'text-white bg-gradient-to-br from-teal-600 to-teal-700 shadow-lg',
      minutes: 'text-white bg-gradient-to-br from-cyan-600 to-cyan-700 shadow-lg',
      seconds: 'text-white bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg'
    };
  };

  const getMotivationalMessage = (days: number) => {
    if (days === 0) return {
      icon: Flame,
      message: "🚨 EXAM DAY! You've got this! Stay calm and confident!",
      bgColor: 'from-red-500/20 via-rose-500/20 to-pink-500/20 dark:from-red-900/40 dark:via-rose-900/40 dark:to-pink-900/40',
      borderColor: 'border-red-500',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600'
    };
    if (days === 1) return {
      icon: Timer,
      message: "⚡ 24 HOURS LEFT! Final review time - you're almost there!",
      bgColor: 'from-orange-500/20 via-red-500/20 to-rose-500/20 dark:from-orange-900/40 dark:via-red-900/40 dark:to-rose-900/40',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-800 dark:text-orange-200',
      iconColor: 'text-orange-600'
    };
    if (days === 2) return {
      icon: Coffee,
      message: "☕ 2 DAYS TO GO! Perfect time for focused review sessions!",
      bgColor: 'from-amber-500/20 via-orange-500/20 to-red-500/20 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-red-900/40',
      borderColor: 'border-amber-500',
      textColor: 'text-amber-800 dark:text-amber-200',
      iconColor: 'text-amber-600'
    };
    if (days === 3) return {
      icon: Brain,
      message: "🧠 3 DAYS LEFT! Time to consolidate your knowledge!",
      bgColor: 'from-yellow-500/20 via-amber-500/20 to-orange-500/20 dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-600'
    };
    if (days <= 7) return {
      icon: Target,
      message: "🎯 One week to go! Stick to your study plan and stay focused!",
      bgColor: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-600'
    };
    return {
      icon: BookOpen,
      message: "📚 Plenty of time! Build a solid foundation with consistent study!",
      bgColor: 'from-emerald-500/20 via-teal-500/20 to-cyan-500/20 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      iconColor: 'text-emerald-600'
    };
  };

  if (upcomingExams.length === 0) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          No Upcoming Exams
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Add your first exam to start tracking your progress and stay on top of your schedule!
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
          <Award className="w-4 h-4" />
          Add Your First Exam From Exam Section
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Upcoming Exams
          </h2>
        </div>
      </div>
      
      <div className="grid gap-4">
        {upcomingExams.map((exam) => {
          const countdown = getCountdown(exam.date);
          const cardDesign = getCardDesign(countdown.days);
          const colors = getCountdownColors(countdown.days);
          const motivationalMsg = getMotivationalMessage(countdown.days);
          const IconComponent = motivationalMsg.icon;

          return (
            <Card 
              key={exam.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${cardDesign.shadow} ${cardDesign.glow} border-2 ${cardDesign.border}`}
              hover
            >
              {/* Background layers */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cardDesign.bgGradient}`} />
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cardDesign.gradient}`} />
              
              <div className="relative p-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {exam.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(exam.priority)}`}>
                        {exam.priority.toUpperCase()}
                      </span>
                      {countdown.days <= 7 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 dark:from-red-900/40 dark:to-orange-900/40 rounded-full border border-red-300 dark:border-red-700">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-xs font-bold text-red-600 dark:text-red-400">URGENT</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-white" />
                      </div>
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
                <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 mb-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${colors.days} transition-all duration-300 hover:scale-105 rounded-lg p-2`}>
                        {countdown.days.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 uppercase tracking-wide">
                        Days
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${colors.hours} transition-all duration-300 hover:scale-105 rounded-lg p-2`}>
                        {countdown.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 uppercase tracking-wide">
                        Hours
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${colors.minutes} transition-all duration-300 hover:scale-105 rounded-lg p-2`}>
                        {countdown.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 uppercase tracking-wide">
                        Minutes
                      </div>
                    </div>
                    <div>
                      <div className={`text-2xl sm:text-3xl font-black ${colors.seconds} transition-all duration-300 hover:scale-105 rounded-lg p-2`}>
                        {countdown.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 uppercase tracking-wide">
                        Seconds
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span>Time remaining</span>
                      <span>{formatDistanceToNow(exam.date)} left</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${cardDesign.gradient}`}
                        style={{
                          width: `${Math.max(10, Math.min(100, (countdown.totalSeconds / (30 * 24 * 3600)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Motivational Messages */}
                <div className={`p-3 bg-gradient-to-r ${motivationalMsg.bgColor} border-l-4 ${motivationalMsg.borderColor} rounded-r-lg`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md`}>
                      <IconComponent className={`w-4 h-4 ${motivationalMsg.iconColor}`} />
                    </div>
                    <p className={`text-sm font-bold ${motivationalMsg.textColor} leading-snug`}>
                      {motivationalMsg.message}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
