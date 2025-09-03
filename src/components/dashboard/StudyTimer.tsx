import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, BookOpen, Brain, Zap, Target, Activity } from 'lucide-react';
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
  const startTimeRef = useRef<number | null>(null);

  // Load saved timer state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('studyTimerState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setTime(state.time || 0);
        setSubject(state.subject || '');
        setTopic(state.topic || '');
        setSelectedExam(state.selectedExam || '');
        setEfficiency(state.efficiency || 5);
        setIsRunning(state.isRunning || false);
        startTimeRef.current = state.startTime;
        
        // If timer was running, calculate elapsed time since last save
        if (state.isRunning && state.startTime) {
          const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
          setTime(state.time + elapsed);
        }
      } catch (error) {
        console.error('Error loading timer state:', error);
      }
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      time,
      subject,
      topic,
      selectedExam,
      efficiency,
      isRunning,
      startTime: startTimeRef.current
    };
    localStorage.setItem('studyTimerState', JSON.stringify(state));
  }, [time, subject, topic, selectedExam, efficiency, isRunning]);

  // Handle page visibility changes for background operation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        // Store the current time when page becomes hidden
        startTimeRef.current = Date.now() - (time * 1000);
      } else if (!document.hidden && isRunning && startTimeRef.current) {
        // Calculate elapsed time when page becomes visible again
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTime(elapsed);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, time]);

  useEffect(() => {
    if (isRunning) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - (time * 1000);
      }
      
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

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - (time * 1000);
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
    startTimeRef.current = null;
  };
  
  const stopTimer = async () => {
    setIsRunning(false);
    startTimeRef.current = null;
    
    if (time > 0 && user && subject && topic && selectedExam) {
      await saveSession(Math.floor(time / 60));
      setTime(0);
      resetForm();
      // Clear saved state
      localStorage.removeItem('studyTimerState');
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
      localStorage.removeItem('studyTimerState');
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

  // AI Brain Animation Components
  const AIBrainAnimation = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Neural Network Nodes */}
      <div className="relative w-48 h-48">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"
            style={{
              top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
              left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          >
            <div className="absolute inset-0 bg-cyan-300 rounded-full animate-ping opacity-75"></div>
          </div>
        ))}
        
        {/* Central Brain Icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <Brain className="h-8 w-8 text-indigo-500 animate-pulse" />
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md opacity-30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="96"
              y1="96"
              x2={96 + 67 * Math.cos((i * Math.PI * 2) / 8)}
              y2={96 + 67 * Math.sin((i * Math.PI * 2) / 8)}
              stroke="url(#neuralGradient)"
              strokeWidth="1"
              opacity="0.6"
              className="animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '3s'
              }}
            />
          ))}
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Floating AI Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-60"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-10px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-15px) rotate(270deg); opacity: 1; }
        }
        
        @keyframes brainPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes neuralFlow {
          0% { stroke-dashoffset: 100; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        
        .neural-flow {
          stroke-dasharray: 20;
          animation: neuralFlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header with AI Enhancement Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            AI Study Timer
          </h2>
        </div>
        
        {isRunning && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-xs font-medium shadow-lg">
            <Activity className="h-3 w-3 animate-pulse" />
            AI Enhanced
          </div>
        )}
      </div>
      
      {/* Circular Timer with AI Animations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="p-8 text-center relative">
          {/* AI Background Animation when active */}
          {isRunning && <AIBrainAnimation />}
          
          {/* Circular Progress */}
          <div className="relative inline-block z-10">
            <svg 
              width="240" 
              height="240" 
              className="transform -rotate-90"
              viewBox="0 0 240 240"
            >
              {/* Background Circle */}
              <circle
                cx="120"
                cy="120"
                r="85"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200 dark:text-gray-700"
              />
              
              {/* Progress Circle */}
              <circle
                cx="120"
                cy="120"
                r="85"
                stroke="url(#timerGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isRunning ? 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.6))' : 'none'
                }}
              />
              
              {/* AI Enhancement Ring */}
              {isRunning && (
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke="url(#aiGradient)"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray="10 5"
                  className="animate-spin opacity-60"
                  style={{ animationDuration: '8s' }}
                />
              )}
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer Display in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`font-mono font-bold text-3xl sm:text-4xl transition-all duration-300 ${
                isRunning 
                  ? 'text-indigo-700 dark:text-indigo-300' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {formatTime(time)}
              </div>
              <div className={`mt-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                isRunning 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {isRunning && <Zap className="h-4 w-4 animate-pulse" />}
                {isRunning ? 'AI Enhanced Study' : 'Ready to Focus'}
              </div>
              
              {/* AI Status Indicators */}
              {isRunning && (
                <div className="mt-3 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Controls */}
          <div className="flex justify-center items-center gap-4 mt-8 z-10 relative">
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={!isFormComplete}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform ${
                  !isFormComplete
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
                }`}
              >
                <Play className="h-6 w-6 group-hover:animate-pulse" />
                <span className="text-lg">Start AI Study</span>
                {!isFormComplete && <Target className="h-5 w-5 opacity-50" />}
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={pauseTimer}
                  className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <Pause className="h-5 w-5 group-hover:animate-pulse" />
                  Pause
                </button>
                
                <button
                  onClick={stopTimer}
                  className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
                >
                  <Square className="h-5 w-5 group-hover:animate-pulse" />
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Session Form with Highlighting */}
      <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 shadow-lg transition-all duration-500 ${
        isRunning 
          ? 'border-indigo-400 dark:border-indigo-500 shadow-indigo-200 dark:shadow-indigo-900/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30' 
          : 'border-gray-200 dark:border-gray-700'
      }`}>
        <div className="p-6 relative overflow-hidden">
          {/* AI Enhancement Overlay */}
          {isRunning && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
          )}
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                isRunning 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                  : 'bg-indigo-600'
              }`}>
                <BookOpen className={`h-5 w-5 text-white ${isRunning ? 'animate-pulse' : ''}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Session Details
              </h3>
              {isRunning && (
                <div className="flex items-center gap-1 ml-auto">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Active</span>
                </div>
              )}
            </div>
            
            {!isFormComplete && (
              <div className={`p-4 mb-6 rounded-xl border transition-all duration-300 ${
                isRunning
                  ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 shadow-lg'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    Complete all fields to enable AI-enhanced timer
                  </p>
                  {isRunning && <Brain className="h-4 w-4 text-amber-600 animate-pulse ml-auto" />}
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
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md ${
                    isRunning 
                      ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
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
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md ${
                    isRunning 
                      ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
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
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md ${
                    isRunning 
                      ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  required
                />
              </div>

              {/* Efficiency */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Focus Level
                </label>
                <select
                  value={efficiency}
                  onChange={(e) => setEfficiency(parseInt(e.target.value))}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md ${
                    isRunning 
                      ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  <option value={5}>🎯 Peak Focus</option>
                  <option value={4}>🔥 High Focus</option>
                  <option value={3}>⚡ Good Focus</option>
                  <option value={2}>💭 Moderate Focus</option>
                  <option value={1}>😴 Low Focus</option>
                </select>
              </div>
            </div>
            
            {/* AI Study Insights */}
            {isRunning && (
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="h-5 w-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">AI Study Insights</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 dark:text-gray-300">Focus: Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span className="text-gray-600 dark:text-gray-300">Progress: {Math.floor(time / 60)}min</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Manual Entry */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="p-6">
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 rounded-xl transition-all duration-300 font-medium border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg group"
          >
            <Plus className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${showManualEntry ? 'rotate-45' : ''}`} />
            <span className="group-hover:scale-105 transition-transform duration-300">
              {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Study Session'}
            </span>
          </button>

          {showManualEntry && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6 animate-in slide-in-from-top duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Study Duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 60"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleManualEntry}
                  disabled={!manualDuration || !isFormComplete}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                    !manualDuration || !isFormComplete
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  }`}
                >
                  Save Session
                </button>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Operation Notice */}
      {isRunning && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Timer Running in Background
              </p>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                Your study session will continue even if you close the app. Progress is automatically saved.
              </p>
            </div>
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400 animate-pulse ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
