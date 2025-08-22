import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio, Settings, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
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

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30
};

const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Chill Lofi Study',
    artist: 'Focus Beats',
    url: 'https://s107-isny.freeconvert.com/task/689311370f7f547d80af53d5/lofi-study-beat-24-255269.mp3',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Peaceful Focus',
    artist: 'Study Vibes',
    url: 'https://s85-ious.freeconvert.com/task/68931137ecabe1ff1900a73c/lofi-study-beat-21-255266.mp3',
    duration: '4:15'
  },
  {
    id: '3',
    title: 'Deep Concentration',
    artist: 'Calm Waves',
    url: 'https://s97-ious.freeconvert.com/task/6893113835e5168e5f1e6893/lofi-study-beat-5-245776.mp3',
    duration: '3:45'
  }
];

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

const APP_NAME = "StudyFlow Focus";

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodoroSettings, setPomodoroSettings] = useState(DEFAULT_POMODORO_SETTINGS);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([]);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const intervalRef = useRef<number>();
  const notificationIntervalRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastNotificationTime = useRef<number>(0);

  const targetTime = pomodoroSettings[mode];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentFocusTimer');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSessionsCompleted(data.sessionsCompleted || 0);
      setCurrentStreak(data.currentStreak || 0);
      setDailyGoal(data.dailyGoal || 4);
      setStudyHistory(data.studyHistory || []);
      setPomodoroCount(data.pomodoroCount || 0);
      setVolume(data.musicVolume || 0.6);
      setShowMusicPlayer(data.showMusicPlayer || false);
      setPomodoroSettings(data.pomodoroSettings || DEFAULT_POMODORO_SETTINGS);
      setNotificationsEnabled(data.notificationsEnabled !== false);
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = true;
    }
  }, [volume, isMuted]);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      sessionsCompleted,
      currentStreak,
      dailyGoal,
      studyHistory,
      pomodoroCount,
      musicVolume: volume,
      showMusicPlayer,
      pomodoroSettings,
      notificationsEnabled
    };
    localStorage.setItem('studentFocusTimer', JSON.stringify(data));
  };

  // Enhanced notification system
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, body: string, options: NotificationOptions = {}) => {
    if (!notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(`${APP_NAME}: ${title}`, {
      body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      tag: 'focus-timer',
      requireInteraction: false,
      ...options
    });

    // Auto-close after 4 seconds
    setTimeout(() => {
      notification.close();
    }, 4000);

    return notification;
  };

  const updateProgressNotification = () => {
    if (!isRunning || !notificationsEnabled) return;

    const elapsed = time;
    const remaining = targetTime * 60 - elapsed;
    const progress = Math.floor((elapsed / (targetTime * 60)) * 100);
    
    const minutesLeft = Math.floor(remaining / 60);
    const secondsLeft = remaining % 60;
    
    let title = '';
    let body = '';
    
    if (mode === 'focus' || mode === 'custom') {
      title = currentSubject ? `Studying ${currentSubject}` : 'Focus Session';
      body = `${progress}% complete • ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')} remaining`;
      if (currentTask) {
        body += `\nTask: ${currentTask}`;
      }
    } else {
      title = mode === 'shortBreak' ? 'Short Break' : 'Long Break';
      body = `${progress}% complete • ${minutesLeft}:${secondsLeft.toString().padStart(2, '0')} remaining`;
    }

    showNotification(title, body, {
      silent: true,
      tag: 'timer-progress'
    });
  };

  // Enhanced background timer with notifications
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          // Show progress notifications every 5 minutes (300 seconds)
          if (newTime > 0 && newTime % 300 === 0) {
            updateProgressNotification();
          }
          
          // Show halfway notification
          const halfway = Math.floor((targetTime * 60) / 2);
          if (newTime === halfway && halfway > 300) { // Only if session is longer than 5 minutes
            const modeText = mode === 'focus' || mode === 'custom' ? 'Focus' : 'Break';
            showNotification(
              `${modeText} Session Halfway Point!`,
              `Great job! You're halfway through your ${targetTime}-minute ${modeText.toLowerCase()} session.`,
              { tag: 'halfway-point' }
            );
          }

          if (newTime >= targetTime * 60) {
            setIsRunning(false);
            handleSessionComplete();
            return prev;
          }
          return newTime;
        });
      }, 1000);

      // Set up periodic notification updates (every 5 minutes)
      notificationIntervalRef.current = window.setInterval(() => {
        updateProgressNotification();
      }, 300000); // 5 minutes
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, [isRunning, targetTime, mode, currentSubject, currentTask, notificationsEnabled]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

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

      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      showNotification(
        'Focus Session Complete! 🎉',
        `Excellent work! ${STUDY_TIPS[tipIndex]}`,
        {
          tag: 'session-complete',
          requireInteraction: true
        }
      );

      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
        showNotification(
          'Time for a Long Break! 🛋️',
          'You\'ve completed 4 focus sessions. Take a well-deserved 15-minute break!',
          { tag: 'mode-switch' }
        );
      } else if (mode === 'focus') {
        setMode('shortBreak');
        showNotification(
          'Time for a Short Break! ☕',
          'Great focus session! Take a 5-minute break to recharge.',
          { tag: 'mode-switch' }
        );
      }
    } else {
      showNotification(
        'Break Time Over! 💪',
        'Hope you feel refreshed! Time to get back to studying.',
        {
          tag: 'break-complete',
          requireInteraction: true
        }
      );
      setMode('focus');
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    saveData();
  };

  // Music player functions
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % LOFI_TRACKS.length;
    setCurrentTrack(nextIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const previousTrack = () => {
    const prevIndex = currentTrack === 0 ? LOFI_TRACKS.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return (time / (targetTime * 60)) * 100;
  };

  const startFocus = () => {
    setIsRunning(true);
    const modeText = mode === 'focus' || mode === 'custom' ? 'Focus' : 'Break';
    const subjectText = currentSubject ? ` on ${currentSubject}` : '';
    showNotification(
      `${modeText} Session Started! 🚀`,
      `${targetTime}-minute ${modeText.toLowerCase()} session${subjectText} is now active. Stay focused!`,
      { tag: 'session-start' }
    );
  };

  const pauseFocus = () => {
    setIsRunning(false);
    showNotification(
      'Session Paused ⏸️',
      'Your focus session is paused. Resume when you\'re ready!',
      { tag: 'session-pause' }
    );
  };

  const stopFocus = () => {
    setIsRunning(false);
    setTime(0);
    showNotification(
      'Session Stopped 🛑',
      'Your focus session has been stopped. Great effort!',
      { tag: 'session-stop' }
    );
  };

  const resetSession = () => {
    setTime(0);
    setIsRunning(false);
  };

  const switchMode = (newMode: TimerMode) => {
    if (!isRunning) {
      setMode(newMode);
      setTime(0);
      if (newMode === 'custom') {
        setShowCustomTimer(true);
      }
    }
  };

  const handleCustomTimerChange = (minutes: number) => {
    if (minutes > 0 && minutes <= 180) { // Max 3 hours
      setPomodoroSettings(prev => ({
        ...prev,
        custom: minutes
      }));
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if (isRunning) {
      showNotification(
        'Running in Background 🔄',
        `Your ${mode} session continues in the background. Check the floating timer for progress.`,
        { tag: 'minimized' }
      );
    }
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleFloatingStop = () => {
    stopFocus();
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

  const getRandomTip = () => {
    if (mode === 'focus' || mode === 'custom') return STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    return BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)];
  };

  // Timer mode button configurations
  const timerModes = [
    { 
      key: 'focus' as TimerMode, 
      label: 'Focus',
      shortLabel: 'Focus',
      time: pomodoroSettings.focus,
      icon: Target
    },
    { 
      key: 'shortBreak' as TimerMode, 
      label: 'Short Break',
      shortLabel: 'Break',
      time: pomodoroSettings.shortBreak,
      icon: Coffee
    },
    { 
      key: 'longBreak' as TimerMode, 
      label: 'Long Break',
      shortLabel: 'Long',
      time: pomodoroSettings.longBreak,
      icon: Coffee
    },
    { 
      key: 'custom' as TimerMode, 
      label: 'Custom Timer',
      shortLabel: 'Custom',
      time: pomodoroSettings.custom,
      icon: Settings
    }
  ];

  // Enhanced Floating Timer Component with better visibility
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Coffee className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {APP_NAME}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {mode === 'focus' ? 'Focus Session' : mode === 'custom' ? 'Custom Timer' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleMaximize}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Stop Timer"
              >
                <Square className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
            {currentSubject && (
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                📚 {currentSubject}
              </div>
            )}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                (mode === 'focus' || mode === 'custom') ? 'bg-blue-600 dark:bg-blue-400' : 'bg-green-600 dark:bg-green-400'
              }`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-1 text-sm font-medium ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              <Clock className="w-4 h-4" />
              <span>{isRunning ? 'Active' : 'Paused'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Flame className="w-4 h-4" />
                <span>{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                <Trophy className="w-4 h-4" />
                <span>{getTodaysPomodoros()}/{dailyGoal}</span>
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

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={LOFI_TRACKS[currentTrack].url}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-6 lg:p-8 space-y-6">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Coffee className="w-8 h-8 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {APP_NAME}
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-400">
                      {mode === 'focus' ? 'Focus Time - Time to concentrate and learn!' :
                       mode === 'custom' ? 'Custom Timer - Your personalized study session' :
                       mode === 'shortBreak' ? 'Short Break - Take a quick breather!' : 'Long Break - Relax and recharge!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    icon={Bell}
                    variant={notificationsEnabled ? "primary" : "ghost"}
                    size="sm"
                    className={notificationsEnabled ? "text-white" : "text-gray-500"}
                    title={notificationsEnabled ? "Notifications enabled" : "Click to enable notifications"}
                  />
                  <Button
                    onClick={handleMinimize}
                    icon={Minimize2}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                    title="Minimize to background"
                  />
                </div>
              </div>

              {/* Notification Status */}
              {!notificationsEnabled && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                        Enable notifications for the best experience
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Get timer updates and session reminders even when minimized
                      </p>
                    </div>
                    <Button
                      onClick={requestNotificationPermission}
                      size="sm"
                      className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Enable
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced Mode Switcher for all devices */}
              <div className="space-y-4">
                {/* Tablet and Desktop Mode Switcher */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-4 gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {timerModes.map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`group relative py-4 px-4 text-sm font-medium rounded-lg transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                              : 'bg-green-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <timerMode.icon className="w-6 h-6" />
                          <span>{timerMode.label}</span>
                          <span className="text-xs opacity-75">({timerMode.time}m)</span>
                        </div>
                        {mode === timerMode.key && (
                          <div className="absolute inset-0 rounded-lg ring-2 ring-white ring-opacity-60" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile and Small Tablet Mode Switcher */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {timerModes.slice(0, 2).map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`py-4 px-4 text-sm font-medium rounded-xl transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-green-600 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center gap-3 justify-center">
                          <timerMode.icon className="w-5 h-5" />
                          <div className="text-left">
                            <div>{timerMode.shortLabel}</div>
                            <div className="text-xs opacity-75">({timerMode.time}m)</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {timerModes.slice(2, 4).map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`py-4 px-4 text-sm font-medium rounded-xl transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-green-600 text-white shadow-lg'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center gap-3 justify-center">
                          <timerMode.icon className="w-5 h-5" />
                          <div className="text-left">
                            <div>{timerMode.shortLabel}</div>
                            <div className="text-xs opacity-75">({timerMode.time}m)</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-blue-800 dark:text-blue-400 text-lg">
                        Custom Timer Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Custom Duration (minutes)
                        </label>
                        <Input
                          type="number"
                          value={pomodoroSettings.custom.toString()}
                          onChange={(value) => handleCustomTimerChange(parseInt(value) || 30)}
                          min="1"
                          max="180"
                          disabled={isRunning}
                          className="text-center text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Quick Presets
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[15, 30, 45, 60].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors"
                            >
                              {preset}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Study Subject & Task (only during focus/custom modes) */}
              {(mode === 'focus' || mode === 'custom') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      📚 Subject
                    </label>
                    <Input
                      type="text"
                      value={currentSubject}
                      onChange={setCurrentSubject}
                      placeholder="e.g., Mathematics, History, Programming..."
                      disabled={isRunning}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      🎯 Current Task
                    </label>
                    <Input
                      type="text"
                      value={currentTask}
                      onChange={setCurrentTask}
                      placeholder="e.g., Chapter 5 problems, Essay writing..."
                      disabled={isRunning}
                      className="text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center">
                <div className="relative w-48 h-48 lg:w-56 lg:h-56 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      strokeDashoffset={`${2 * Math.PI * 85 * (1 - getProgress() / 100)}`}
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
                      <div className="text-4xl lg:text-5xl font-mono font-bold text-gray-900 dark:text-gray-100">
                        {formatTime(time)}
                      </div>
                      <div className="text-lg text-gray-500 dark:text-gray-400">
                        {formatTime(Math.max(0, targetTime * 60 - time))} left
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {Math.floor(getProgress())}% complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status & Motivation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className={`w-5 h-5 ${isRunning ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-lg font-medium ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {isRunning ? 'Keep Going! You\'re Doing Great!' : 'Ready When You Are'}
                    </span>
                  </div>
                  
                  {(mode === 'shortBreak' || mode === 'longBreak') && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-3">
                        <Lightbulb className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-400">
                          Break Suggestion
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-300">
                        {getRandomTip()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    className={`flex-1 text-lg py-4 ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom') ? 'Start Focus Session' : 'Start Break'}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseFocus}
                    icon={Pause}
                    variant="secondary"
                    className="flex-1 text-lg py-4"
                  >
                    Pause Session
                  </Button>
                )}
                
                <Button
                  onClick={stopFocus}
                  icon={Square}
                  variant="danger"
                  disabled={time === 0}
                  className="px-8 text-lg py-4"
                >
                  Stop
                </Button>
              </div>

              {time > 0 && !isRunning && (
                <Button
                  onClick={resetSession}
                  variant="secondary"
                  className="w-full py-3 text-lg"
                >
                  Reset Session
                </Button>
              )}

              {/* Enhanced Music Player Toggle */}
              <div className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <Button
                  onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                  icon={Music}
                  variant="ghost"
                  className="text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  {showMusicPlayer ? 'Hide Music Player' : 'Show Music Player'}
                </Button>
                
                {showMusicPlayer && (
                  <div className="flex items-center gap-3">
                    <button onClick={previousTrack} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                      <SkipBack className="w-5 h-5 text-purple-600" />
                    </button>
                    <button onClick={toggleMusic} className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={nextTrack} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                      <SkipForward className="w-5 h-5 text-purple-600" />
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5 text-purple-600" /> : <Volume2 className="w-5 h-5 text-purple-600" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced Volume Control */}
              {showMusicPlayer && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="text-center text-purple-700 dark:text-purple-300 mb-3 font-medium">
                    🎵 {LOFI_TRACKS[currentTrack].title} - {LOFI_TRACKS[currentTrack].artist}
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-purple-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer"
                      disabled={isMuted}
                    />
                    <span className="text-sm text-purple-600 font-mono w-8">
                      {Math.floor((isMuted ? 0 : volume) * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-400">
                    {pomodoroCount}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Sessions Today
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 text-center border border-orange-200 dark:border-orange-800">
                  <Flame className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-400">
                    {currentStreak}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Current Streak
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-900 dark:text-green-400">
                    {sessionsCompleted}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Total Sessions
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-400">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    Daily Goal
                  </div>
                </div>
              </div>

              {/* Enhanced Daily Goal Setting */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    📊 Daily Study Goal
                  </span>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(parseInt(value) || 4)}
                      className="w-20 text-center"
                      min="1"
                      max="12"
                    />
                    <span className="text-sm text-gray-500">sessions</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>{getTodaysPomodoros()} completed</span>
                  <span>{dailyGoal - getTodaysPomodoros()} remaining</span>
                </div>
              </div>

              {/* Enhanced Study Tip */}
              {(mode === 'focus' || mode === 'custom') && !isRunning && time === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    <span className="font-semibold text-yellow-800 dark:text-yellow-400 text-lg">
                      💡 Study Tip
                    </span>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300 text-lg">
                    {getRandomTip()}
                  </p>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleMinimize}
                  variant="secondary"
                  className="flex-1 py-3 text-lg"
                  icon={Minimize2}
                >
                  Run in Background
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1 py-3 text-lg"
                >
                  Close Focus Mode
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

