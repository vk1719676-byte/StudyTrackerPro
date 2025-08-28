import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, Zap, Target, BookOpen, Brain, Coffee, Trophy, Flame, Timer } from 'lucide-react';
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
      shadow: 'shadow-2xl shadow-red-500/25',
      border: 'border-red-400/50',
      glow: 'ring-4 ring-red-500/30 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
      animation: 'animate-pulse'
    };
    if (days === 1) return {
      gradient: 'from-orange-500 via-red-500 to-rose-600',
      shadow: 'shadow-xl shadow-orange-500/20',
      border: 'border-orange-400/50',
      glow: 'ring-2 ring-orange-500/40',
      animation: ''
    };
    if (days === 2) return {
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      shadow: 'shadow-lg shadow-amber-500/15',
      border: 'border-amber-400/50',
      glow: 'ring-1 ring-amber-500/30',
      animation: ''
    };
    if (days <= 7) return {
      gradient: 'from-blue-500 via-indigo-500 to-purple-600',
      shadow: 'shadow-lg shadow-blue-500/10',
      border: 'border-blue-400/30',
      glow: '',
      animation: ''
    };
    return {
      gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
      shadow: 'shadow-md shadow-emerald-500/10',
      border: 'border-emerald-400/20',
      glow: '',
      animation: ''
    };
  };

  const getCountdownColors = (days: number) => {
    if (days === 0) return {
      days: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
      hours: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
      minutes: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
      seconds: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
    };
    if (days === 1) return {
      days: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
      hours: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
      minutes: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30',
      seconds: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30'
    };
    if (days === 2) return {
      days: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30',
      hours: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
      minutes: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
      seconds: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30'
    };
    if (days <= 3) return {
      days: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
      hours: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30',
      minutes: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
      seconds: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30'
    };
    if (days <= 7) return {
      days: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30',
      hours: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30',
      minutes: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30',
      seconds: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30'
    };
    return {
      days: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30',
      hours: 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30',
      minutes: 'text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900/30',
      seconds: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30'
    };
  };

  const getMotivationalMessage = (days: number) => {
    if (days === 0) return {
      icon: Flame,
      message: "🚨 EXAM DAY! You've got this! Stay calm and confident!",
      bgColor: 'from-red-500/10 via-rose-500/10 to-pink-500/10 dark:from-red-900/30 dark:via-rose-900/30 dark:to-pink-900/30',
      borderColor: 'border-red-500',
      textColor: 'text-red-800 dark:text-red-200',
      iconColor: 'text-red-600 animate-bounce'
    };
    if (days === 1) return {
      icon: Timer,
      message: "⚡ 24 HOURS LEFT! Final review time - you're almost there!",
      bgColor: 'from-orange-500/10 via-red-500/10 to-rose-500/10 dark:from-orange-900/30 dark:via-red-900/30 dark:to-rose-900/30',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-800 dark:text-orange-200',
      iconColor: 'text-orange-600 animate-pulse'
    };
    if (days === 2) return {
      icon: Coffee,
      message: "☕ 2 DAYS TO GO! Perfect time for focused review sessions!",
      bgColor: 'from-amber-500/10 via-orange-500/10 to-red-500/10 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-red-900/30',
      borderColor: 'border-amber-500',
      textColor: 'text-amber-800 dark:text-amber-200',
      iconColor: 'text-amber-600'
    };
    if (days === 3) return {
      icon: Brain,
      message: "🧠 3 DAYS LEFT! Time to consolidate your knowledge!",
      bgColor: 'from-yellow-500/10 via-amber-500/10 to-orange-500/10 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      iconColor: 'text-yellow-600'
    };
    if (days <= 7) return {
      icon: Target,
      message: "🎯 One week to go! Stick to your study plan and stay focused!",
      bgColor: 'from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800 dark:text-blue-200',
      iconColor: 'text-blue-600'
    };
    return {
      icon: BookOpen,
      message: "📚 Plenty of time! Build a solid foundation with consistent study!",
      bgColor: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-800 dark:text-emerald-200',
      iconColor: 'text-emerald-600'
    };
  };

  if (upcomingExams.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
          <Calendar className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          No Upcoming Exams
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
          Add your first exam to start tracking your progress and stay on top of your schedule!
        </p>
        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
          <Trophy className="w-5 h-5" />
          Get Started
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
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
          const cardDesign = getCardDesign(countdown.days);
          const colors = getCountdownColors(countdown.days);
          const motivationalMsg = getMotivationalMessage(countdown.days);
          const IconComponent = motivationalMsg.icon;

          return (
            <Card 
              key={exam.id} 
              className={`relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${cardDesign.shadow} ${cardDesign.glow} ${cardDesign.animation} border-2 ${cardDesign.border}`}
              hover
            >
              {/* Enhanced Background with multiple layers */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cardDesign.gradient} opacity-5`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-gray-800/50 opacity-60" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${cardDesign.gradient}" />
              
              <div className="relative p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                        {exam.name}
                      </h3>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 shadow-lg ${getPriorityColor(exam.priority)}`}>
                        {exam.priority.toUpperCase()}
                      </span>
                      {countdown.days <= 7 && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/30 dark:to-orange-900/30 rounded-full border border-red-300 dark:border-red-700">
                          <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                          <span className="text-sm font-bold text-red-600 dark:text-red-400">URGENT</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-base font-semibold">
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
                <div className="bg-white/90 dark:bg-gray-900/70 backdrop-blur-md rounded-3xl p-8 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-inner">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="group">
                      <div className={`text-4xl sm:text-5xl font-black ${colors.days} transition-all duration-300 group-hover:scale-110 rounded-2xl p-4 shadow-lg`}>
                        {countdown.days.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-3 uppercase tracking-wider">
                        Days
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-4xl sm:text-5xl font-black ${colors.hours} transition-all duration-300 group-hover:scale-110 rounded-2xl p-4 shadow-lg`}>
                        {countdown.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-3 uppercase tracking-wider">
                        Hours
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-4xl sm:text-5xl font-black ${colors.minutes} transition-all duration-300 group-hover:scale-110 rounded-2xl p-4 shadow-lg`}>
                        {countdown.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-3 uppercase tracking-wider">
                        Minutes
                      </div>
                    </div>
                    <div className="group">
                      <div className={`text-4xl sm:text-5xl font-black ${colors.seconds} transition-all duration-300 group-hover:scale-110 rounded-2xl p-4 shadow-lg`}>
                        {countdown.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-3 uppercase tracking-wider">
                        Seconds
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress bar */}
                  <div className="mt-8">
                    <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <span>Time remaining</span>
                      <span>{formatDistanceToNow(exam.date)} left</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out bg-gradient-to-r ${cardDesign.gradient} shadow-lg`}
                        style={{
                          width: `${Math.max(10, Math.min(100, (countdown.totalSeconds / (30 * 24 * 3600)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Motivational Messages */}
                <div className={`mt-6 p-6 bg-gradient-to-r ${motivationalMsg.bgColor} border-l-4 ${motivationalMsg.borderColor} rounded-r-2xl shadow-lg`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg`}>
                      <IconComponent className={`w-6 h-6 ${motivationalMsg.iconColor}`} />
                    </div>
                    <p className={`text-base font-bold ${motivationalMsg.textColor} leading-relaxed`}>
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
