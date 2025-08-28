import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, BookOpen, Target, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { addStudySession } from '../../services/firestore';
import { StudySession } from '../../types';

interface StudyTimerProps {
  exams: any[];
  onSessionAdded: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ exams, onSessionAdded }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [efficiency, setEfficiency] = useState(5);
  
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const stopTimer = async () => {
    setIsRunning(false);
    if (time > 0 && user && subject && topic && selectedExam) {
      await saveSession(Math.floor(time / 60));
      setTime(0);
      resetForm();
    }
  };

  const saveSession = async (duration: number) => {
    if (!user || !selectedExam) return;

    const session: Omit<StudySession, 'id'> = {
      examId: selectedExam,
      duration,
      subject,
      topic,
      efficiency,
      date: new Date(),
      userId: user.uid
    };

    try {
      await addStudySession(session);
      onSessionAdded();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleManualEntry = async () => {
    const duration = parseInt(manualDuration);
    if (duration > 0 && user && subject && topic && selectedExam) {
      await saveSession(duration);
      setShowManualEntry(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSubject('');
    setTopic('');
    setSelectedExam('');
    setManualDuration('');
    setEfficiency(5);
  };

  const getEfficiencyColor = (rating: number) => {
    const colors = {
      5: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800',
      4: 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
      3: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800',
      2: 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800',
      1: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800'
    };
    return colors[rating as keyof typeof colors] || colors[5];
  };

  const getEfficiencyLabel = (rating: number) => {
    const labels = {
      5: 'Excellent',
      4: 'Good',
      3: 'Average',
      2: 'Below Average',
      1: 'Poor'
    };
    return labels[rating as keyof typeof labels] || 'Excellent';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg border-2 border-gray-800 dark:border-gray-200">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Study Timer
        </h2>
      </div>
      
      {/* Main Timer Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-800 dark:border-gray-200 shadow-lg">
        <div className="p-4 sm:p-6 space-y-6">
          {/* Timer Display - Responsive */}
          <div className="text-center">
            <div className={`inline-block p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
              isRunning 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 dark:border-indigo-400' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
            }`}>
              <div className={`font-mono font-bold transition-all duration-300 ${
                isRunning 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-700 dark:text-gray-300'
              } text-3xl sm:text-4xl md:text-5xl`}>
                {formatTime(time)}
              </div>
              <div className={`mt-2 text-xs sm:text-sm font-medium ${
                isRunning 
                  ? 'text-indigo-500 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isRunning ? 'Session Active' : 'Ready to Start'}
              </div>
            </div>
          </div>

          {/* Notice for missing session details */}
          {(!subject || !topic || !selectedExam) && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <div className="text-sm text-amber-800 dark:text-amber-200">
                  <p className="font-medium">Add session details first to start timer or add manual entry</p>
                  <p className="text-xs mt-1 opacity-90">Please fill in exam, subject, and topic fields below</p>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons - Mobile Optimized */}
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={!subject || !topic || !selectedExam}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base border-2 transition-all duration-200 ${
                  !subject || !topic || !selectedExam
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white border-gray-800 dark:border-gray-200 hover:scale-105 active:scale-95'
                }`}
              >
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Start</span>
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm sm:text-base border-2 border-gray-800 dark:border-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Pause className="h-4 w-4" />
                <span className="hidden sm:inline">Pause</span>
              </button>
            )}
            
            <button
              onClick={stopTimer}
              disabled={time === 0}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base border-2 transition-all duration-200 ${
                time === 0
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white border-gray-800 dark:border-gray-200 hover:scale-105 active:scale-95'
              }`}
            >
              <Square className="h-4 w-4" />
              <span className="hidden sm:inline">Stop & Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Study Session Form */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-800 dark:border-gray-200 shadow-lg">
        <div className="p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Session Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              >
                <option value="">Choose your exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topic
              </label>
              <input
                type="text"
                placeholder="e.g., Calculus"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Efficiency Rating
              </label>
              <div className="relative">
                <select
                  value={efficiency}
                  onChange={(e) => setEfficiency(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Below Average</option>
                  <option value={1}>1 - Poor</option>
                </select>
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs font-medium border ${getEfficiencyColor(efficiency)}`}>
                  {getEfficiencyLabel(efficiency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-800 dark:border-gray-200 shadow-lg">
        <div className="p-4 sm:p-6">
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 font-medium border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-500"
          >
            <Plus className={`h-5 w-5 transform transition-transform duration-200 ${showManualEntry ? 'rotate-45' : ''}`} />
            {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Entry'}
          </button>

          {showManualEntry && (
            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 60"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-indigo-300 dark:border-indigo-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleManualEntry}
                  disabled={!manualDuration || !subject || !topic || !selectedExam}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold border-2 transition-all duration-200 ${
                    !manualDuration || !subject || !topic || !selectedExam
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white border-gray-800 dark:border-gray-200 hover:scale-105'
                  }`}
                >
                  Save Session
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};                Save Session
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
