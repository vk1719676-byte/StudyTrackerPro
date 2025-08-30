import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, BookOpen, Target, TrendingUp, Timer } from 'lucide-react';
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
      5: 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300 dark:text-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:border-emerald-700',
      4: 'text-green-700 bg-gradient-to-r from-green-50 to-green-100 border-green-300 dark:text-green-300 dark:from-green-900/30 dark:to-green-800/20 dark:border-green-700',
      3: 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 dark:text-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/20 dark:border-yellow-700',
      2: 'text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 dark:text-orange-300 dark:from-orange-900/30 dark:to-orange-800/20 dark:border-orange-700',
      1: 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-300 dark:text-red-300 dark:from-red-900/30 dark:to-red-800/20 dark:border-red-700'
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

  const isFormComplete = subject && topic && selectedExam;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 px-2">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30"></div>
          <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 rounded-xl border-2 border-gray-800 dark:border-gray-200 shadow-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Study Timer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Track your study sessions and measure progress
          </p>
        </div>
      </div>
      
      {/* Main Timer Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border-2 border-gray-800 dark:border-gray-200 shadow-2xl">
          <div className="p-6 sm:p-8 space-y-8">
            {/* Timer Display */}
            <div className="text-center">
              <div className={`relative inline-block p-8 sm:p-12 rounded-3xl transition-all duration-500 ${
                isRunning 
                  ? 'bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50 dark:from-indigo-900/40 dark:via-indigo-800/30 dark:to-purple-900/40 border-2 border-indigo-300 dark:border-indigo-500 shadow-xl' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 shadow-lg'
              }`}>
                {isRunning && (
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur opacity-20 animate-pulse"></div>
                )}
                <div className="relative">
                  <div className={`font-mono font-bold transition-all duration-300 ${
                    isRunning 
                      ? 'text-indigo-700 dark:text-indigo-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  } text-4xl sm:text-6xl md:text-7xl tracking-wider`}>
                    {formatTime(time)}
                  </div>
                  <div className={`mt-3 text-sm sm:text-base font-semibold tracking-wide ${
                    isRunning 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <div className="flex items-center justify-center gap-2">
                      <Timer className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                      {isRunning ? 'Session Active' : 'Ready to Start'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notice for missing session details */}
            {!isFormComplete && (
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur opacity-20"></div>
                <div className="relative p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="text-amber-800 dark:text-amber-200">
                      <p className="font-semibold text-sm sm:text-base">Complete session details to begin</p>
                      <p className="text-xs sm:text-sm mt-1 opacity-90">Fill in exam, subject, and topic fields below to start timing or add manual entries</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex justify-center items-center gap-3 sm:gap-4">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  disabled={!isFormComplete}
                  className={`group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all duration-300 transform ${
                    !isFormComplete
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-gray-800 dark:border-gray-200 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg'
                  }`}
                >
                  <Play className={`h-5 w-5 transition-transform duration-300 ${isFormComplete ? 'group-hover:scale-110' : ''}`} />
                  <span>Start Session</span>
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-2xl font-bold text-base sm:text-lg border-2 border-gray-800 dark:border-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg"
                >
                  <Pause className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span>Pause</span>
                </button>
              )}
              
              <button
                onClick={stopTimer}
                disabled={time === 0}
                className={`group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg border-2 transition-all duration-300 transform ${
                  time === 0
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-gray-800 dark:border-gray-200 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg'
                }`}
              >
                <Square className={`h-5 w-5 transition-transform duration-300 ${time > 0 ? 'group-hover:scale-110' : ''}`} />
                <span className="hidden sm:inline">Stop & Save</span>
                <span className="sm:hidden">Stop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Study Session Form */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border-2 border-gray-800 dark:border-gray-200 shadow-xl">
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Session Details
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Exam Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Target Exam
                </label>
                <div className="relative group/select">
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/select:shadow-lg font-medium"
                    required
                  >
                    <option value="">Choose your exam</option>
                    {exams.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/input:shadow-lg font-medium"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Topic Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Topic
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    placeholder="e.g., Calculus"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/input:shadow-lg font-medium"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Efficiency Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Efficiency Rating
                </label>
                <div className="relative group/select">
                  <select
                    value={efficiency}
                    onChange={(e) => setEfficiency(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/select:shadow-lg font-medium appearance-none pr-12"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                  <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-300 ${getEfficiencyColor(efficiency)}`}>
                    {getEfficiencyLabel(efficiency)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border-2 border-gray-800 dark:border-gray-200 shadow-xl">
          <div className="p-6 sm:p-8">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="group/btn w-full flex items-center justify-center gap-4 px-6 py-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-300 font-semibold border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-500 hover:shadow-lg"
            >
              <Plus className={`h-5 w-5 transform transition-all duration-300 group-hover/btn:scale-110 ${showManualEntry ? 'rotate-45' : ''}`} />
              <span className="text-base">
                {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Entry'}
              </span>
            </button>

            {showManualEntry && (
              <div className="mt-6 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-10"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:via-indigo-800/30 dark:to-purple-900/40 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration (minutes)
                    </label>
                    <div className="relative group/duration">
                      <input
                        type="number"
                        placeholder="e.g., 60"
                        value={manualDuration}
                        onChange={(e) => setManualDuration(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/duration:shadow-lg font-medium"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/duration:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleManualEntry}
                      disabled={!manualDuration || !isFormComplete}
                      className={`group/save flex-1 px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 transform ${
                        !manualDuration || !isFormComplete
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-gray-800 dark:border-gray-200 hover:scale-105 hover:shadow-lg active:scale-95'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Plus className={`h-4 w-4 transition-transform duration-300 ${!manualDuration || !isFormComplete ? '' : 'group-hover/save:scale-110'}`} />
                        Save Session
                      </span>
                    </button>
                    <button
                      onClick={() => setShowManualEntry(false)}
                      className="group/cancel px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Square className="h-4 w-4 transition-transform duration-300 group-hover/cancel:scale-110" />
                        Cancel
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
