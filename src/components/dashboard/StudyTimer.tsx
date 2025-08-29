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
      5: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      4: 'text-green-700 bg-green-100 border-green-300',
      3: 'text-yellow-700 bg-yellow-100 border-yellow-300',
      2: 'text-orange-700 bg-orange-100 border-orange-300',
      1: 'text-red-700 bg-red-100 border-red-300'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
            <Timer className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Study Timer
            </h1>
            <p className="text-gray-600 mt-2">Track your study sessions and boost productivity</p>
          </div>
        </div>
        
        {/* Main Timer Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl">
            <div className="p-8 sm:p-12 space-y-8">
              {/* Timer Display */}
              <div className="text-center">
                <div className={`relative inline-block p-8 sm:p-12 rounded-3xl transition-all duration-500 ${
                  isRunning 
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner border-2 border-blue-200' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner border-2 border-gray-200'
                }`}>
                  {isRunning && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                  )}
                  <div className="relative">
                    <div className={`font-mono font-bold transition-all duration-500 ${
                      isRunning 
                        ? 'text-blue-700 scale-110' 
                        : 'text-gray-700 scale-100'
                    } text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}>
                      {formatTime(time)}
                    </div>
                    <div className={`mt-3 text-sm sm:text-base font-semibold transition-all duration-300 ${
                      isRunning 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      {isRunning ? (
                        <span className="inline-flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Session Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          Ready to Start
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice for missing session details */}
              {(!subject || !topic || !selectedExam) && (
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="text-amber-800">
                      <p className="font-semibold text-base">Complete session details to begin</p>
                      <p className="text-sm mt-1 opacity-80">Fill in exam, subject, and topic fields below to start your timer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center items-center gap-4">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    disabled={!subject || !topic || !selectedExam}
                    className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                      !subject || !topic || !selectedExam
                        ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-2 border-green-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Play className="h-6 w-6" />
                    <span>Start Timer</span>
                    {(!subject || !topic || !selectedExam) && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white rounded-2xl font-semibold text-lg border-2 border-yellow-600 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Pause className="h-6 w-6" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={stopTimer}
                  disabled={time === 0}
                  className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform ${
                    time === 0
                      ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-2 border-red-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  }`}
                >
                  <Square className="h-6 w-6" />
                  <span>Stop & Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Study Session Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl">
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Session Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-500" />
                    Select Exam
                  </label>
                  <div className="relative">
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose your exam</option>
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Calculus"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                    Efficiency Rating
                  </label>
                  <div className="relative">
                    <select
                      value={efficiency}
                      onChange={(e) => setEfficiency(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                    <div className={`absolute right-12 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getEfficiencyColor(efficiency)}`}>
                      {getEfficiencyLabel(efficiency)}
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Entry Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl">
            <div className="p-6 sm:p-8">
              <button
                onClick={() => setShowManualEntry(!showManualEntry)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-2xl transition-all duration-300 font-semibold border-2 border-dashed border-indigo-300 hover:border-indigo-500 group"
              >
                <Plus className={`h-6 w-6 transform transition-transform duration-300 ${showManualEntry ? 'rotate-45' : 'group-hover:scale-110'}`} />
                <span className="text-lg">
                  {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Entry'}
                </span>
              </button>

              {showManualEntry && (
                <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 space-y-6 animate-in slide-in-from-top duration-300">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-indigo-800 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 60"
                      value={manualDuration}
                      onChange={(e) => setManualDuration(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 shadow-sm placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleManualEntry}
                      disabled={!manualDuration || !subject || !topic || !selectedExam}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                        !manualDuration || !subject || !topic || !selectedExam
                          ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white border-2 border-indigo-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                      }`}
                    >
                      Save Session
                    </button>
                    <button
                      onClick={() => setShowManualEntry(false)}
                      className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
