import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, BookOpen } from 'lucide-react';
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

  const isFormComplete = subject && topic && selectedExam;

  // Calculate circular progress based on seconds (full circle every 60 seconds)
  const circleProgress = (time % 60) / 60;
  const strokeDasharray = 2 * Math.PI * 85; // radius = 85
  const strokeDashoffset = strokeDasharray * (1 - circleProgress);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Study Timer
        </h2>
      </div>
      
      {/* Circular Timer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-8 text-center">
          {/* Circular Progress */}
          <div className="relative inline-block">
            <svg 
              width="200" 
              height="200" 
              className="transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              
              {/* Progress Circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isRunning ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' : 'none'
                }}
              />
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer Display in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`font-mono font-bold text-2xl sm:text-3xl transition-all duration-300 ${
                isRunning 
                  ? 'text-indigo-700 dark:text-indigo-300 animate-pulse' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {formatTime(time)}
              </div>
              <div className={`mt-1 text-sm font-medium transition-colors ${
                isRunning 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isRunning ? 'Studying...' : 'Ready to Start'}
              </div>
              
              {/* Rotating Indicator for Active State */}
              {isRunning && (
                <div className="absolute -top-2 w-3 h-3 bg-indigo-500 rounded-full animate-spin" 
                     style={{ animationDuration: '4s' }}>
                  <div className="w-1 h-1 bg-white rounded-full mt-1 ml-1"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={!isFormComplete}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !isFormComplete
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                <Play className="h-5 w-5" />
                Start Study
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </button>
                
                <button
                  onClick={stopTimer}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Square className="h-5 w-5" />
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Session Details</h3>
          </div>
          
          {!isFormComplete && (
            <div className="p-4 mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  Complete all fields to enable timer
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Exam Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                required
              >
                <option value="">Select exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                required
              />
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Topic
              </label>
              <input
                type="text"
                placeholder="e.g., Calculus"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                required
              />
            </div>

            {/* Efficiency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Efficiency Rating
              </label>
              <select
                value={efficiency}
                onChange={(e) => setEfficiency(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
              >
                <option value={5}>5 - Excellent Focus</option>
                <option value={4}>4 - Good Focus</option>
                <option value={3}>3 - Average Focus</option>
                <option value={2}>2 - Some Distractions</option>
                <option value={1}>1 - Many Distractions</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all duration-200 font-medium border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-500"
          >
            <Plus className={`h-5 w-5 transition-transform duration-200 ${showManualEntry ? 'rotate-45' : ''}`} />
            {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Study Session'}
          </button>

          {showManualEntry && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 60"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-gray-400 dark:hover:border-gray-500"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleManualEntry}
                  disabled={!manualDuration || !isFormComplete}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !manualDuration || !isFormComplete
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  Save Session
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
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
