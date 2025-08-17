import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Exam } from '../../types';
import { formatDistanceToNow, isAfter, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

interface ExamCountdownProps {
  exams: Exam[];
}

export const ExamCountdown: React.FC<ExamCountdownProps> = ({ exams }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const upcomingExams = exams
    .filter(exam => isAfter(exam.date, currentTime))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const getCountdown = (examDate: Date) => {
    const days = differenceInDays(examDate, currentTime);
    const hours = differenceInHours(examDate, currentTime) % 24;
    const minutes = differenceInMinutes(examDate, currentTime) % 60;

    return { days, hours, minutes };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (upcomingExams.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Upcoming Exams
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add your first exam to start tracking your progress!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Upcoming Exams
      </h2>
      
      {upcomingExams.map((exam) => {
        const countdown = getCountdown(exam.date);
        const isUrgent = countdown.days <= 7;

        return (
          <Card 
            key={exam.id} 
            className={`p-4 transition-all duration-200 ${isUrgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
            hover
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {exam.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(exam.priority)}`}>
                    {exam.priority.toUpperCase()}
                  </span>
                  {isUrgent && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {exam.date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {countdown.days}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {countdown.hours}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {countdown.minutes}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Minutes</div>
                </div>
              </div>
            </div>

            {countdown.days <= 3 && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                  ⚡ Final sprint time! Stay focused!
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};