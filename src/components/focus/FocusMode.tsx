import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Target, CheckCircle, Minimize2, Maximize2, Brain, Coffee, Settings, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { MusicPlayer } from './MusicPlayer';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationUpdate?: (count: number) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30
};

const STUDY_TIPS = [
  "Take deep breaths and stay hydrated! 💧",
  "Review what you've learned before starting new material 📚",
  "Great progress! You're building strong study habits 🌟",
  "Take a moment to stretch and rest your eyes 👀",
  "You're doing amazing! Keep up the momentum 🚀"
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a short walk to refresh your mind",
  "💧 Drink some water and have a healthy snack",
  "👀 Look away from your screen and rest your eyes",
  "🧘‍♀️ Do some light stretching or breathing exercises",
  "🎵 Listen to your favorite song to recharge"
];

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodoroSettings, setPomodoroSettings] = useState(DEFAULT_POMODORO_SETTINGS);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([]);

  const intervalRef = useRef<number>();
  const targetTime = pomodoroSettings[mode];

  // Simple timer management
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          if (newTime >= targetTime * 60) {
            handleSessionComplete();
            return newTime;
          }
          
          return newTime;
        });
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
  }, [isRunning, targetTime]);

  const handleSessionComplete = () => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: currentSubject,
      task: currentTask,
      duration: targetTime,
      completedAt: new Date(),
      mode
    };

    if (mode === 'focus' || mode === 'custom') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);

      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
      } else if (mode === 'focus') {
        setMode('shortBreak');
      }
    } else {
      setMode('focus');
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return Math.min((time / (targetTime * 60)) * 100, 100);
  };

  const startFocus = () => {
    setIsRunning(true);
  };

  const pauseFocus = () => {
    setIsRunning(false);
  };

  const stopFocus = () => {
    setIsRunning(false);
    setTime(0);
  };

  const switchMode = (newMode: TimerMode) => {
    if (!isRunning) {
      setMode(newMode);
      setTime(0);
    }
  };

  const handleCustomTimerChange = (minutes: number) => {
    if (minutes > 0 && minutes <= 180) {
      setPomodoroSettings(prev => ({
        ...prev,
        custom: minutes
      }));
    }
  };

  // Timer mode configurations
  const timerModes = [
    { 
      key: 'focus' as TimerMode, 
      label: 'Focus',
      time: pomodoroSettings.focus,
      icon: Target,
      color: 'bg-blue-600'
    },
    { 
      key: 'shortBreak' as TimerMode, 
      label: 'Short Break',
      time: pomodoroSettings.shortBreak,
      icon: Coffee,
      color: 'bg-green-600'
    },
    { 
      key: 'longBreak' as TimerMode, 
      label: 'Long Break',
      time: pomodoroSettings.longBreak,
      icon: Coffee,
      color: 'bg-green-700'
    },
    { 
      key: 'custom' as TimerMode, 
      label: 'Custom',
      time: pomodoroSettings.custom,
      icon: Settings,
      color: 'bg-purple-600'
    }
  ];

  // Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    const currentMode = timerModes.find(m => m.key === mode);

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className="backdrop-blur-md bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${currentMode?.color} bg-opacity-10`}>
                {currentMode && <currentMode.icon className="w-4 h-4 text-current" />}
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {mode === 'focus' ? 'Focus Session' : 
                   mode === 'custom' ? 'Custom Timer' : 
                   mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
                {currentSubject && (
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {currentSubject}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  stopFocus();
                  setIsMinimized(false);
                }}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-mono font-bold mb-1">
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
          </div>

          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ${
                currentMode?.color || 'bg-blue-600'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 font-medium ${
              isRunning ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isRunning ? 'Running' : 'Paused'}
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>{pomodoroCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>{currentStreak}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      <FloatingTimer />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${
                    (mode === 'focus' || mode === 'custom') 
                      ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30' 
                      : 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30'
                  }`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Coffee className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                      {mode === 'focus' ? 'Focus Time' :
                       mode === 'custom' ? 'Custom Timer' :
                       mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(mode === 'focus' || mode === 'custom') 
                        ? 'Deep work session - eliminate distractions' 
                        : 'Recharge your mind and body'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsMinimized(true)}
                    icon={Minimize2}
                    variant="ghost"
                    size="sm"
                  />
                  <Button
                    onClick={onClose}
                    icon={X}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>

              {/* Compact Mode Switcher */}
              <div className="grid grid-cols-4 gap-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                {timerModes.map((timerMode) => (
                  <button
                    key={timerMode.key}
                    onClick={() => switchMode(timerMode.key)}
                    disabled={isRunning}
                    className={`group relative py-4 px-3 text-sm font-medium rounded-xl transition-all transform hover:scale-105 ${
                      mode === timerMode.key
                        ? `${timerMode.color} text-white shadow-lg shadow-current/25`
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <timerMode.icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{timerMode.label}</span>
                      <span className="text-xs opacity-75">({timerMode.time}m)</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Timer Settings */}
              {mode === 'custom' && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800 dark:text-purple-400">
                      Custom Timer Settings
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.custom.toString()}
                        onChange={(value) => handleCustomTimerChange(parseInt(value) || 30)}
                        min="1"
                        max="180"
                        disabled={isRunning}
                        className="text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                        Quick Presets
                      </label>
                      <div className="flex gap-2">
                        {[15, 30, 45, 60].map((preset) => (
                          <button
                            key={preset}
                            onClick={() => handleCustomTimerChange(preset)}
                            disabled={isRunning}
                            className="flex-1 px-3 py-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 transition-colors"
                          >
                            {preset}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Inputs (Focus/Custom only) */}
              {(mode === 'focus' || mode === 'custom') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      📚 Subject
                    </label>
                    <Input
                      type="text"
                      value={currentSubject}
                      onChange={setCurrentSubject}
                      placeholder="e.g., Mathematics, History..."
                      disabled={isRunning}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      🎯 Task
                    </label>
                    <Input
                      type="text"
                      value={currentTask}
                      onChange={setCurrentTask}
                      placeholder="e.g., Chapter 5 problems..."
                      disabled={isRunning}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-inner"></div>
                  
                  <svg className="absolute inset-2 w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - getProgress() / 100)}`}
                      className={`transition-all duration-1000 ${
                        (mode === 'focus' || mode === 'custom')
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-green-600 dark:text-green-400'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(Math.max(0, targetTime * 60 - time))} remaining
                      </div>
                      <div className={`text-xs font-medium mt-1 ${
                        isRunning ? 'text-green-600 animate-pulse' : 'text-gray-400'
                      }`}>
                        {isRunning ? '● Running' : '⏸ Ready'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-indigo-200/50 dark:border-indigo-800/50">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                    {(mode === 'shortBreak' || mode === 'longBreak') 
                      ? BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)]
                      : STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)]}
                  </p>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    className={`flex-1 py-4 text-lg font-semibold ${
                      (mode === 'focus' || mode === 'custom') 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    }`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom') ? 'Start Focus Session' : 'Start Break'}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseFocus}
                    icon={Pause}
                    variant="secondary"
                    className="flex-1 py-4 text-lg font-semibold"
                  >
                    Pause Timer
                  </Button>
                )}
                
                <Button
                  onClick={stopFocus}
                  icon={Square}
                  variant="danger"
                  disabled={time === 0}
                  className="px-8 py-4"
                >
                  Stop
                </Button>
              </div>

              {/* Music Player Integration */}
              <MusicPlayer />

              {/* Compact Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pomodoroCount}</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Sessions Today</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentStreak}</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">Current Streak</div>
                </div>
                
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionsCompleted}</div>
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">Total Sessions</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setIsMinimized(true)}
                  variant="secondary"
                  className="flex-1"
                  icon={Minimize2}
                >
                  Minimize
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
