import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, BookOpen, Target, TrendingUp, Timer, Save, AlertCircle } from 'lucide-react';
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

interface SessionData {
  selectedExam: string;
  subject: string;
  topic: string;
  efficiency: number;
  startTime: number | null;
  isRunning: boolean;
  time: number;
}

const STORAGE_KEY = 'study-timer-session';

export const StudyTimer: React.FC<StudyTimerProps> = ({ exams, onSessionAdded }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [efficiency, setEfficiency] = useState(5);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | null>(null);
  
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  const autoSaveRef = useRef<NodeJS.Timeout>();

  // Load session from localStorage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const sessionData: SessionData = JSON.parse(savedSession);
        setSelectedExam(sessionData.selectedExam);
        setSubject(sessionData.subject);
        setTopic(sessionData.topic);
        setEfficiency(sessionData.efficiency);
        setTime(sessionData.time);
        setIsRunning(sessionData.isRunning);

        // Resume timer if it was running
        if (sessionData.isRunning && sessionData.startTime) {
          const elapsed = Math.floor((Date.now() - sessionData.startTime) / 1000);
          setTime(sessionData.time + elapsed);
        }
      } catch (error) {
        console.error('Error loading saved session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Auto-save session data to localStorage
  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }

    autoSaveRef.current = setTimeout(() => {
      const sessionData: SessionData = {
        selectedExam,
        subject,
        topic,
        efficiency,
        startTime: isRunning ? Date.now() - (time * 1000) : null,
        isRunning,
        time
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      
      if (isRunning || time > 0 || subject || topic || selectedExam) {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
      }
    }, 1000);

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [selectedExam, subject, topic, efficiency, isRunning, time]);

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
    return hours > 0 
      ? `${hours}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`
      : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const stopTimer = async () => {
    setIsRunning(false);
    if (time > 0 && user && subject && topic && selectedExam) {
      setAutoSaveStatus('saving');
      try {
        await saveSession(Math.floor(time / 60));
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
        setTime(0);
        resetForm();
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(null), 3000);
      }
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
      throw error;
    }
  };

  const handleManualEntry = async () => {
    const duration = parseInt(manualDuration);
    if (duration > 0 && user && subject && topic && selectedExam) {
      setAutoSaveStatus('saving');
      try {
        await saveSession(duration);
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(null), 2000);
        setShowManualEntry(false);
        resetForm();
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(null), 3000);
      }
    }
  };

  const resetForm = () => {
    setSubject('');
    setTopic('');
    setSelectedExam('');
    setManualDuration('');
    setEfficiency(5);
  };

  const clearSession = () => {
    setIsRunning(false);
    setTime(0);
    resetForm();
    localStorage.removeItem(STORAGE_KEY);
  };

  const getEfficiencyColor = (rating: number) => {
    const colors = {
      5: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-600',
      4: 'text-green-700 bg-green-100 border-green-300 dark:text-green-300 dark:bg-green-900/30 dark:border-green-600',
      3: 'text-yellow-700 bg-yellow-100 border-yellow-300 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-600',
      2: 'text-orange-700 bg-orange-100 border-orange-300 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-600',
      1: 'text-red-700 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/30 dark:border-red-600'
    };
    return colors[rating as keyof typeof colors] || colors[5];
  };

  const getEfficiencyEmoji = (rating: number) => {
    const emojis = { 5: '🔥', 4: '👍', 3: '👌', 2: '😐', 1: '😔' };
    return emojis[rating as keyof typeof emojis] || '🔥';
  };

  const isFormComplete = subject && topic && selectedExam;

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      {/* Auto-save Status */}
      {autoSaveStatus && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg border-2 transition-all duration-300 ${
          autoSaveStatus === 'saving' 
            ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300'
            : autoSaveStatus === 'saved'
            ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300'
            : 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300'
        }`}>
          <div className="flex items-center gap-2 text-sm font-medium">
            {autoSaveStatus === 'saving' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {autoSaveStatus === 'saved' && <Save className="w-4 h-4" />}
            {autoSaveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
            {autoSaveStatus === 'saving' ? 'Saving...' : autoSaveStatus === 'saved' ? 'Saved!' : 'Save failed'}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Timer</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track your study progress</p>
          </div>
        </div>
        {(time > 0 || isRunning || subject || topic || selectedExam) && (
          <Button variant="ghost" size="sm" onClick={clearSession}>
            Clear Session
          </Button>
        )}
      </div>
      
      {/* Compact Timer & Form Card */}
      <Card variant="glass" className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative p-6 space-y-6">
          {/* Timer Display - Compact */}
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className={`relative p-6 rounded-2xl transition-all duration-500 ${
                isRunning 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 border-2 border-indigo-300 dark:border-indigo-500 shadow-lg' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 shadow-md'
              }`}>
                {isRunning && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20 animate-pulse"></div>
                )}
                <div className="relative text-center">
                  <div className={`font-mono font-bold transition-all duration-300 ${
                    isRunning 
                      ? 'text-indigo-700 dark:text-indigo-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  } text-2xl sm:text-3xl tracking-wide`}>
                    {formatTime(time)}
                  </div>
                  <div className={`mt-1 text-xs font-semibold tracking-wide flex items-center justify-center gap-1 ${
                    isRunning 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <Timer className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Active' : 'Ready'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls - Compact */}
            <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
              {!isRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={!isFormComplete}
                  variant="success"
                  size="md"
                >
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="warning" size="md">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={stopTimer}
                disabled={time === 0}
                variant="danger"
                size="md"
              >
                <Square className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>

              <Button
                onClick={() => setShowManualEntry(!showManualEntry)}
                variant="ghost"
                size="md"
              >
                <Plus className={`h-4 w-4 transform transition-transform duration-300 ${showManualEntry ? 'rotate-45' : ''}`} />
                Manual
              </Button>
            </div>
          </div>

          {/* Form Notice */}
          {!isFormComplete && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-600 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm font-medium">Complete all fields to start timer</p>
              </div>
            </div>
          )}

          {/* Compact Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <Target className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                Exam
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 font-medium"
                required
              >
                <option value="">Select exam</option>
                {exams.map(exam => (
                  <option key={exam.id} value={exam.id}>{exam.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Subject"
              placeholder="e.g., Math"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm py-2"
              required
            />

            <Input
              label="Topic"
              placeholder="e.g., Calculus"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-sm py-2"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                Efficiency
              </label>
              <div className="relative">
                <select
                  value={efficiency}
                  onChange={(e) => setEfficiency(parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 font-medium appearance-none pr-8"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Below Avg</option>
                  <option value={1}>1 - Poor</option>
                </select>
                <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs ${getEfficiencyColor(efficiency)} px-2 py-0.5 rounded-full border font-bold`}>
                  {getEfficiencyEmoji(efficiency)}
                </div>
              </div>
            </div>
          </div>

          {/* Manual Entry - Compact */}
          {showManualEntry && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur opacity-10"></div>
              <div className="relative p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1">
                    <Input
                      label="Duration (minutes)"
                      type="number"
                      placeholder="e.g., 60"
                      value={manualDuration}
                      onChange={(e) => setManualDuration(e.target.value)}
                      className="text-sm py-2"
                      icon={<Clock className="h-4 w-4" />}
                      required
                    />
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={handleManualEntry}
                      disabled={!manualDuration || !isFormComplete}
                      variant="primary"
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setShowManualEntry(false)}
                      variant="secondary"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats - Compact */}
      {(time > 0 || isRunning) && (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <span className="font-medium">Session: {Math.floor(time / 60)}m {time % 60}s</span>
              {subject && <span>• {subject}</span>}
              {topic && <span>• {topic}</span>}
            </div>
            {isRunning && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                Recording
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
