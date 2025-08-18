import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, 
  Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, 
  SkipForward, SkipBack, Settings, X, Calendar, BookOpen, BarChart3,
  Headphones, Moon, Sun, Sparkles
} from 'lucide-react';
import { DraggableFloatingTimer } from './DraggableFloatingTimer';
import { MusicPlayer } from './MusicPlayer';
import { StatsPanel } from './StatsPanel';
import { SettingsPanel } from './SettingsPanel';
import { StudySessionInput } from './StudySessionInput';
import { TimerCircle } from './TimerCircle';
import { ModeSelector } from './ModeSelector';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

export interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
  pomodoroNumber?: number;
}

export interface FocusSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  custom: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  playCompletionSound: boolean;
  showNotifications: boolean;
  musicVolume: number;
  darkMode: boolean;
}

const DEFAULT_SETTINGS: FocusSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30,
  autoStartBreaks: false,
  autoStartFocus: false,
  playCompletionSound: true,
  showNotifications: true,
  musicVolume: 0.6,
  darkMode: false
};

const MOTIVATIONAL_QUOTES = [
  "Great job! Every session brings you closer to mastery! 🌟",
  "You're building incredible focus habits! Keep going! 💪",
  "Consistency is key - you're doing amazing work! 🎯",
  "Your dedication today shapes your success tomorrow! ✨",
  "Focus achieved! Your brain is getting stronger! 🧠"
];

const BREAK_SUGGESTIONS = [
  "🚶‍♀️ Take a mindful walk to refresh your perspective",
  "💧 Hydrate and nourish your body with healthy snacks",
  "👀 Practice the 20-20-20 rule: look 20 feet away for 20 seconds",
  "🧘‍♀️ Try deep breathing exercises or light stretching",
  "🌱 Step outside for fresh air and vitamin D",
  "🎵 Listen to calming music to reset your energy"
];

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  // Core timer state
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [settings, setSettings] = useState<FocusSettings>(DEFAULT_SETTINGS);
  
  // Session tracking
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([]);
  
  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  
  // Music state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const targetTime = settings[mode];

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('advancedFocusTimer');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSettings(prev => ({ ...prev, ...data.settings }));
        setSessionsCompleted(data.sessionsCompleted || 0);
        setCurrentStreak(data.currentStreak || 0);
        setDailyGoal(data.dailyGoal || 4);
        setStudyHistory(data.studyHistory || []);
        setPomodoroCount(data.pomodoroCount || 0);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data
  const saveData = () => {
    const data = {
      settings,
      sessionsCompleted,
      currentStreak,
      dailyGoal,
      studyHistory,
      pomodoroCount
    };
    localStorage.setItem('advancedFocusTimer', JSON.stringify(data));
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev >= targetTime * 60) {
            setIsRunning(false);
            handleSessionComplete();
            return prev;
          }
          return prev + 1;
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

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSessionComplete = () => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: currentSubject,
      task: currentTask,
      duration: targetTime,
      completedAt: new Date(),
      mode,
      pomodoroNumber: mode === 'focus' ? pomodoroCount + 1 : undefined
    };

    if (mode === 'focus' || mode === 'custom') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      
      if (settings.showNotifications && 'Notification' in window && Notification.permission === 'granted') {
        const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        new Notification('🎉 Focus Session Complete!', {
          body: quote,
          icon: '/vite.svg'
        });
      }

      // Auto-switch to break
      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
      } else if (mode === 'focus') {
        setMode('shortBreak');
      }
      
      if (settings.autoStartBreaks && mode === 'focus') {
        setTime(0);
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      if (settings.showNotifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Break Time Over!', {
          body: 'Time to get back to focused work! You\'ve got this! 💪',
          icon: '/vite.svg'
        });
      }
      setMode('focus');
      
      if (settings.autoStartFocus) {
        setTime(0);
        setTimeout(() => setIsRunning(true), 1000);
      }
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    saveData();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return (time / (targetTime * 60)) * 100;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const switchMode = (newMode: TimerMode) => {
    if (!isRunning) {
      setMode(newMode);
      setTime(0);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const getTodaysPomodoros = () => {
    const today = new Date().toDateString();
    return studyHistory.filter(session => 
      (session.mode === 'focus' || session.mode === 'custom') && 
      new Date(session.completedAt).toDateString() === today
    ).length;
  };

  const getDailyProgress = () => {
    return Math.min((getTodaysPomodoros() / dailyGoal) * 100, 100);
  };

  const getRandomMotivation = () => {
    if (mode === 'focus' || mode === 'custom') {
      return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    }
    return BREAK_SUGGESTIONS[Math.floor(Math.random() * BREAK_SUGGESTIONS.length)];
  };

  const updateSettings = (newSettings: Partial<FocusSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      {/* Draggable Floating Timer */}
      <DraggableFloatingTimer
        isMinimized={isMinimized}
        isRunning={isRunning}
        time={time}
        targetTime={targetTime}
        mode={mode}
        currentSubject={currentSubject}
        currentStreak={currentStreak}
        getProgress={getProgress}
        formatTime={formatTime}
        onMaximize={handleMaximize}
        onStop={() => {
          stopTimer();
          setIsMinimized(false);
        }}
      />

      {/* Main Focus Mode Interface */}
      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-8 h-8" />
                    ) : (
                      <Coffee className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">
                      {mode === 'focus' ? 'Focus Time' : 
                       mode === 'custom' ? 'Custom Session' :
                       mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h1>
                    <p className="text-white/80 text-sm">
                      {(mode === 'focus' || mode === 'custom') ? 
                        'Deep work session - eliminate distractions' : 
                        'Time to recharge and refresh your mind'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-all duration-200"
                    title="Statistics"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-all duration-200"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleMinimize}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-all duration-200"
                    title="Minimize"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-all duration-200"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              {/* Settings Panel */}
              {showSettings && (
                <SettingsPanel
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  isRunning={isRunning}
                  onClose={() => setShowSettings(false)}
                />
              )}

              {/* Stats Panel */}
              {showStats && (
                <StatsPanel
                  studyHistory={studyHistory}
                  pomodoroCount={pomodoroCount}
                  sessionsCompleted={sessionsCompleted}
                  currentStreak={currentStreak}
                  dailyGoal={dailyGoal}
                  onSetDailyGoal={setDailyGoal}
                  onClose={() => setShowStats(false)}
                />
              )}

              {/* Mode Selector */}
              <ModeSelector
                currentMode={mode}
                settings={settings}
                isRunning={isRunning}
                onModeChange={switchMode}
                onUpdateSettings={updateSettings}
              />

              {/* Study Session Input */}
              {(mode === 'focus' || mode === 'custom') && (
                <StudySessionInput
                  subject={currentSubject}
                  task={currentTask}
                  onSubjectChange={setCurrentSubject}
                  onTaskChange={setCurrentTask}
                  isRunning={isRunning}
                />
              )}

              {/* Timer Circle */}
              <TimerCircle
                time={time}
                targetTime={targetTime}
                progress={getProgress()}
                mode={mode}
                formatTime={formatTime}
                isRunning={isRunning}
              />

              {/* Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <button
                    onClick={startTimer}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                    className={`
                      flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      ${(mode === 'focus' || mode === 'custom') 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    <Play className="w-6 h-6" />
                    {(mode === 'focus' || mode === 'custom') ? 'Start Focus Session' : 'Start Break'}
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Pause className="w-6 h-6" />
                    Pause Session
                  </button>
                )}
                
                <button
                  onClick={stopTimer}
                  disabled={time === 0}
                  className="px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Square className="w-6 h-6" />
                </button>
              </div>

              {/* Motivation Message */}
              <div className={`
                p-4 rounded-xl backdrop-blur-sm border
                ${(mode === 'focus' || mode === 'custom')
                  ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-700/50'
                  : 'bg-green-50/50 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/50'
                }
              `}>
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg
                    ${(mode === 'focus' || mode === 'custom')
                      ? 'bg-blue-100 dark:bg-blue-800/50'
                      : 'bg-green-100 dark:bg-green-800/50'
                    }
                  `}>
                    <Sparkles className={`w-5 h-5 ${(mode === 'focus' || mode === 'custom') ? 'text-blue-600' : 'text-green-600'}`} />
                  </div>
                  <p className={`font-medium ${(mode === 'focus' || mode === 'custom') ? 'text-blue-800 dark:text-blue-200' : 'text-green-800 dark:text-green-200'}`}>
                    {getRandomMotivation()}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-60">Today</span>
                  </div>
                  <div className="text-2xl font-bold">{getTodaysPomodoros()}</div>
                  <div className="text-xs opacity-80">Focus Sessions</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-60">Current</span>
                  </div>
                  <div className="text-2xl font-bold">{currentStreak}</div>
                  <div className="text-xs opacity-80">Day Streak</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-60">Total</span>
                  </div>
                  <div className="text-2xl font-bold">{sessionsCompleted}</div>
                  <div className="text-xs opacity-80">Completed</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-60">Goal</span>
                  </div>
                  <div className="text-2xl font-bold">{Math.round(getDailyProgress())}%</div>
                  <div className="text-xs opacity-80">Progress</div>
                </div>
              </div>

              {/* Music Player */}
              <MusicPlayer
                audioRef={audioRef}
                isPlaying={isPlaying}
                currentTrack={currentTrack}
                volume={settings.musicVolume}
                isMuted={isMuted}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onNextTrack={() => setCurrentTrack((prev) => (prev + 1) % 6)}
                onPrevTrack={() => setCurrentTrack((prev) => prev === 0 ? 5 : prev - 1)}
                onVolumeChange={(vol) => updateSettings({ musicVolume: vol })}
                onToggleMute={() => setIsMuted(!isMuted)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
