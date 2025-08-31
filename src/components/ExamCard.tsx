import React from 'react';
import { Calendar, Timer, AlertTriangle, Edit, Trash2, BookOpen, Star, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SyllabusTrackerComponent } from './SyllabusTracker';
import { Exam } from '../types';

interface ExamCardProps {
  exam: Exam;
  index: number;
  currentTime: Date;
  onEdit: (exam: Exam) => void;
  onDelete: (examId: string) => void;
  onUpdateSyllabus: (examId: string, syllabusTracker: any) => void;
  expandedCards: Set<string>;
  onToggleExpand: (examId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  index,
  currentTime,
  onEdit,
  onDelete,
  onUpdateSyllabus,
  expandedCards,
  onToggleExpand
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAdvancedTimeRemaining = (examDate: Date) => {
    const now = currentTime;
    const timeDiff = examDate.getTime() - now.getTime();
    
    if (timeDiff < 0) {
      return { text: 'Past due', type: 'past', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' };
    }
    
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (days === 0 && hours === 0 && minutes === 0) {
      return { 
        text: `${seconds}s`, 
        type: 'critical', 
        color: 'text-red-600 animate-pulse', 
        bgColor: 'bg-red-100 dark:bg-red-900/30 ring-2 ring-red-400 ring-opacity-60' 
      };
    }
    
    if (days === 0 && hours < 24) {
      return { 
        text: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`, 
        type: 'urgent', 
        color: 'text-orange-600 font-bold', 
        bgColor: 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-400 ring-opacity-60' 
      };
    }
    
    if (days === 0) {
      return { 
        text: 'Today!', 
        type: 'today', 
        color: 'text-green-600 font-bold animate-pulse', 
        bgColor: 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400 ring-opacity-60' 
      };
    }
    
    if (days <= 3) {
      return { 
        text: `${days}d ${hours}h`, 
        type: 'warning', 
        color: 'text-red-600 font-semibold', 
        bgColor: 'bg-red-50 dark:bg-red-900/20 ring-1 ring-red-300 ring-opacity-50' 
      };
    }
    
    if (days <= 7) {
      return { 
        text: `${days} days`, 
        type: 'caution', 
        color: 'text-yellow-600 font-medium', 
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' 
      };
    }
    
    return { 
      text: `${days} days`, 
      type: 'normal', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50 dark:bg-blue-900/20' 
    };
  };

  const getProgressPercentage = (exam: Exam) => {
    const now = currentTime;
    const totalTime = exam.date.getTime() - exam.createdAt.getTime();
    const elapsedTime = now.getTime() - exam.createdAt.getTime();
    return Math.min(Math.max((elapsedTime / totalTime) * 100, 0), 100);
  };

  const timeData = getAdvancedTimeRemaining(exam.date);
  const isUrgent = timeData.type === 'urgent' || timeData.type === 'warning';
  const isPastDue = timeData.type === 'past';
  const isToday = timeData.type === 'today';
  const isCritical = timeData.type === 'critical';
  const progress = getProgressPercentage(exam);
  const isExpanded = expandedCards.has(exam.id);

  return (
    <Card 
      className={`
        border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden
        ${timeData.bgColor}
        ${isCritical ? 'animate-pulse shadow-red-500/50' : ''}
        ${isPastDue ? 'opacity-75' : ''}
        animate-fade-in bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 backdrop-blur-sm
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Animated Background Effect for Critical Exams */}
      {isCritical && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse"></div>
      )}
      
      {/* Urgent Exam Glow Effect */}
      {isUrgent && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse"></div>
      )}

      <div className="relative z-10 p-6">
        {/* Time Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
              {exam.name}
            </h3>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(exam.priority)}`}>
                {exam.priority.toUpperCase()} PRIORITY
              </span>
              {isCritical && <Zap className="w-4 h-4 text-red-500 animate-bounce" />}
              {isUrgent && <AlertTriangle className="w-4 h-4 text-orange-500 animate-pulse" />}
              {isToday && <Star className="w-4 h-4 text-green-500 animate-pulse" />}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={Edit}
              onClick={() => onEdit(exam)}
              className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-all duration-200"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(exam.id)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="font-medium">
              {exam.date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Advanced Countdown Timer */}
          <div className={`rounded-xl p-4 border-2 transition-all duration-300 ${timeData.bgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className={`w-5 h-5 ${timeData.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time Remaining
                </span>
              </div>
              {isCritical && (
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-red-500 animate-bounce" />
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                    Critical
                  </span>
                </div>
              )}
            </div>
            <div className={`text-2xl sm:text-3xl font-bold mt-2 ${timeData.color} tracking-tight`}>
              {timeData.text}
            </div>
            {timeData.type === 'critical' && (
              <div className="mt-2 text-xs text-red-600 font-medium animate-pulse">
                🚨 EXAM STARTING SOON!
              </div>
            )}
            {timeData.type === 'today' && (
              <div className="mt-2 text-xs text-green-600 font-medium">
                🎯 Good luck with your exam today!
              </div>
            )}
          </div>

          {/* Syllabus Section with Expand/Collapse */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
            <button
              onClick={() => onToggleExpand(exam.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-200"
            >
              <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                Syllabus {exam.syllabusTracker && `(${exam.syllabusTracker.totalProgress}% complete)`}
              </h4>
              {isExpanded ? 
                <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>
            
            {isExpanded && (
              <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-300">
                {exam.syllabusTracker ? (
                  <SyllabusTrackerComponent
                    syllabusTracker={exam.syllabusTracker}
                    onUpdate={(tracker) => onUpdateSyllabus(exam.id, tracker)}
                  />
                ) : (
                  <div className="space-y-4">
                    {exam.syllabus && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {exam.syllabus}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => onUpdateSyllabus(exam.id, {
                        subjects: [],
                        totalProgress: 0,
                        completedSubjects: 0,
                        completedChapters: 0,
                        totalChapters: 0
                      })}
                      icon={BookOpen}
                      variant="ghost"
                      className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      Create Structured Syllabus
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Exam Status Indicator */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isCritical ? 'bg-red-500 animate-ping' :
                isUrgent ? 'bg-orange-500 animate-pulse' :
                isToday ? 'bg-green-500 animate-pulse' :
                isPastDue ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {isCritical ? 'CRITICAL' :
                 isUrgent ? 'URGENT' :
                 isToday ? 'TODAY' :
                 isPastDue ? 'PAST DUE' : 'SCHEDULED'}
              </span>
            </div>
            {(isCritical || isUrgent) && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="text-xs font-bold text-red-600">
                  ACTION NEEDED
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
