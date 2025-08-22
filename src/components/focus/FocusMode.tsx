import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio, Settings, Eye, EyeOff } from 'lucide-react';
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

interface TimerState {
  isRunning: boolean;
  time: number;
  mode: TimerMode;
  startTime: number;
  subject: string;
  task: string;
  targetTime: number;
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

  // Background timer states
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');
  const [lastNotificationTime, setLastNotificationTime] = useState(0);
  const [showGlobalTimer, setShowGlobalTimer] = useState(false);
  const [globalTimerPosition, setGlobalTimerPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Background timer states
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');
  const [lastNotificationTime, setLastNotificationTime] = useState(0);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  // Timer refs
  const intervalRef = useRef<number>();
  const backgroundIntervalRef = useRef<number>();
  const globalTimerRef = useRef<HTMLDivElement>(null);
  const backgroundIntervalRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const targetTime = pomodoroSettings[mode];

  // Background timer system
  const saveTimerState = (timerState: any) => {
    const state = {
      ...timerState,
      lastUpdated: Date.now(),
      tabId: sessionStorage.getItem('focusTabId') || Date.now().toString()
    };
    localStorage.setItem('focusTimerState', JSON.stringify(state));
    
    // Broadcast to other tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TIMER_UPDATE',
        state
      });
    }
  };

  const loadTimerState = () => {
    const saved = localStorage.getItem('focusTimerState');
    if (!saved) return null;
    
    try {
      const state = JSON.parse(saved);
      // Check if timer was running and calculate elapsed time
      if (state.isRunning && state.lastUpdated) {
        const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
        state.time = Math.min(state.time + elapsed, state.targetTime * 60);
      }
      return state;
    } catch {
      return null;
    }
  };

  const clearTimerState = () => {
    localStorage.removeItem('focusTimerState');
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TIMER_CLEARED'
      });
    }
  };

  const updateDocumentTitle = () => {
    if (!isPageVisible && (isRunning || backgroundMode)) {
      const remainingTime = Math.max(0, targetTime * 60 - time);
      const formattedTime = formatTime(remainingTime);
      const modeText = mode === 'focus' ? '🎯 Focus' : 
                      mode === 'custom' ? '⚙️ Custom' :
                      mode === 'shortBreak' ? '☕ Break' : '☕ Long Break';
      
      document.title = `${formattedTime} - ${modeText} | ${currentSubject || 'Study Timer'}`;
    } else if (originalTitle && !showGlobalTimer) {
      document.title = originalTitle;
    }
  };

  const sendBackgroundNotification = (title: string, body: string, isUrgent = false) => {
    // Desktop notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'focus-timer',
        requireInteraction: isUrgent,
        silent: !isUrgent,
        timestamp: Date.now()
      });

      if (!isUrgent) {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // Try to use system tray notification (if available)
    if ('serviceWorker' in navigator && isUrgent) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/vite.svg',
          badge: '/vite.svg',
          tag: 'focus-timer-urgent',
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'View Timer' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        });
      }).catch(() => {
        // Fallback handled above
      });
    }
  };

  const handlePageVisibilityChange = () => {
    const isVisible = document.visibilityState === 'visible';
    setIsPageVisible(isVisible);

    if (!isVisible && isRunning) {
      // Page became hidden while timer is running
      setBackgroundMode(true);
      setShowGlobalTimer(true);
      
      // Save current state
      saveTimerState({
        isRunning,
        time,
        mode,
        startTime: Date.now() - (time * 1000),
        subject: currentSubject,
        task: currentTask,
        targetTime
      });

      // Send notification about background mode
      sendBackgroundNotification(
        '🕐 Timer Running in Background',
        `${mode === 'focus' ? 'Focus session' : 'Break time'} continues. Global timer now visible.`
      );
    } else if (isVisible && backgroundMode) {
      // Page became visible again
      setBackgroundMode(false);
      
      // Load and sync state
      const savedState = loadTimerState();
      if (savedState) {
        setTime(savedState.time);
        setMode(savedState.mode);
        setCurrentSubject(savedState.subject);
        setCurrentTask(savedState.task);
      }
    }
  };

  // Initialize background timer system
  useEffect(() => {
    // Store original title
    setOriginalTitle(document.title);

    // Create unique tab ID
    if (!sessionStorage.getItem('focusTabId')) {
      sessionStorage.setItem('focusTabId', Date.now().toString());
    }

    // Initialize broadcast channel for cross-tab communication
    broadcastChannelRef.current = new BroadcastChannel('focus-timer');
    
    broadcastChannelRef.current.onmessage = (event) => {
      const { type, state } = event.data;
      
      if (type === 'TIMER_UPDATE') {
        // Update global timer display from other tabs
        if (state.isRunning && !isRunning) {
          setTime(state.time);
          setMode(state.mode);
          setCurrentSubject(state.subject);
          setCurrentTask(state.task);
          setIsRunning(true);
          setShowGlobalTimer(true);
        }
      } else if (type === 'TIMER_CLEARED') {
        setShowGlobalTimer(false);
        setIsRunning(false);
        setTime(0);
      }
    };

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Load previous timer state
    const savedTimerState = loadTimerState();
    if (savedTimerState && savedTimerState.isRunning) {
      setTime(savedTimerState.time);
      setMode(savedTimerState.mode);
      setIsRunning(true);
      setCurrentSubject(savedTimerState.subject);
      setCurrentTask(savedTimerState.task);
      setBackgroundMode(true);
      setShowGlobalTimer(true);
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handlePageVisibilityChange);

    // Listen for beforeunload to save state
    const handleBeforeUnload = () => {
      if (isRunning) {
        saveTimerState({
          isRunning,
          time,
          mode,
      sendBackgroundNotification(
        '🎉 Focus Session Complete!',
        `Great work! ${STUDY_TIPS[tipIndex]}`,
        true
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handlePageVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (originalTitle) {
        document.title = originalTitle;
      }
    };
  }, []);

  // Background notification system
  useEffect(() => {
    if (backgroundMode && isRunning) {
      backgroundIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.max(0, targetTime * 60 - time);
        
        // Send periodic notifications (every 5 minutes for focus, every minute for breaks)
        const notificationInterval = (mode === 'focus' || mode === 'custom') ? 5 * 60 * 1000 : 60 * 1000;
        
        if (now - lastNotificationTime > notificationInterval && remainingTime > 60) {
          const minutes = Math.floor(remainingTime / 60);
          sendBackgroundNotification(
            `⏰ ${minutes} minutes remaining`,
            `${mode === 'focus' ? 'Focus session' : 'Break time'} - ${currentSubject || 'Study Timer'}`,
            false
          );
          setLastNotificationTime(now);
        }
      }, 30000); // Check every 30 seconds
    } else {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    }

    return () => {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    };
  }, [backgroundMode, isRunning, time, mode, currentSubject, targetTime, lastNotificationTime]);

  // Update document title when timer state changes
  useEffect(() => {
    updateDocumentTitle();
  }, [isRunning, time, mode, currentSubject, isPageVisible, targetTime, showGlobalTimer]);

  // Background timer system
  const saveTimerState = (timerState: TimerState) => {
    localStorage.setItem('focusTimerState', JSON.stringify({
      ...timerState,
      lastUpdated: Date.now()
    }));
  };

  const loadTimerState = (): TimerState | null => {
    const saved = localStorage.getItem('focusTimerState');
    if (!saved) return null;
    
    try {
      const state = JSON.parse(saved);
      // Check if timer was running and calculate elapsed time
      if (state.isRunning && state.lastUpdated) {
        const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
        state.time = Math.min(state.time + elapsed, state.targetTime * 60);
      }
      return state;
    } catch {
      return null;
    }
  };

  const clearTimerState = () => {
    localStorage.removeItem('focusTimerState');
  };

  const updateDocumentTitle = () => {
    if (!isPageVisible && isRunning) {
      const remainingTime = Math.max(0, targetTime * 60 - time);
      const formattedTime = formatTime(remainingTime);
      const modeText = mode === 'focus' ? '🎯 Focus' : 
                      mode === 'custom' ? '⚙️ Custom' :
                      mode === 'shortBreak' ? '☕ Break' : '☕ Long Break';
      
      document.title = `${formattedTime} - ${modeText} | ${currentSubject || 'Study Timer'}`;
    } else if (originalTitle) {
      document.title = originalTitle;
    }
  };

  const sendBackgroundNotification = (title: string, body: string, isUrgent = false) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'focus-timer',
        requireInteraction: isUrgent,
        silent: !isUrgent
      });

      // Auto close non-urgent notifications
      if (!isUrgent) {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const handlePageVisibilityChange = () => {
    const isVisible = document.visibilityState === 'visible';
    setIsPageVisible(isVisible);

    if (!isVisible && isRunning) {
      // Page became hidden while timer is running
      setBackgroundMode(true);
      
      // Save current state
      saveTimerState({
        isRunning,
        time,
        mode,
        startTime: Date.now() - (time * 1000),
        subject: currentSubject,
        task: currentTask,
        targetTime
      });

      // Send notification about background mode
      sendBackgroundNotification(
        '🕐 Timer Running in Background',
        `${mode === 'focus' ? 'Focus session' : 'Break time'} continues in background. Check tab title for updates.`
      );
    } else if (isVisible && backgroundMode) {
      // Page became visible again
      setBackgroundMode(false);
      
      // Load and sync state
      const savedState = loadTimerState();
      if (savedState) {
        setTime(savedState.time);
        setMode(savedState.mode);
        setCurrentSubject(savedState.subject);
        setCurrentTask(savedState.task);
      }
    }
  };

  // Initialize background timer system
  useEffect(() => {
    // Store original title
    setOriginalTitle(document.title);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Load previous timer state
    const savedTimerState = loadTimerState();
    if (savedTimerState && savedTimerState.isRunning) {
      setTime(savedTimerState.time);
      setMode(savedTimerState.mode);
      setIsRunning(true);
      setCurrentSubject(savedTimerState.subject);
      setCurrentTask(savedTimerState.task);
      setBackgroundMode(true);
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handlePageVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handlePageVisibilityChange);
      if (originalTitle) {
        document.title = originalTitle;
      }
    };
  }, []);

  // Background notification system
  useEffect(() => {
    if (backgroundMode && isRunning) {
      backgroundIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const remainingTime = Math.max(0, targetTime * 60 - time);
        
        // Send periodic notifications (every 5 minutes for focus, every minute for breaks)
        const notificationInterval = (mode === 'focus' || mode === 'custom') ? 5 * 60 * 1000 : 60 * 1000;
        
        if (now - lastNotificationTime > notificationInterval && remainingTime > 60) {
          const minutes = Math.floor(remainingTime / 60);
          sendBackgroundNotification(
            `⏰ ${minutes} minutes remaining`,
            `${mode === 'focus' ? 'Focus session' : 'Break time'} - ${currentSubject || 'Study Timer'}`,
            false
          );
          setLastNotificationTime(now);
        }
      }, 30000); // Check every 30 seconds
    } else {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    }

    return () => {
      if (backgroundIntervalRef.current) {
        clearInterval(backgroundIntervalRef.current);
      }
    };
  }, [backgroundMode, isRunning, time, mode, currentSubject, targetTime, lastNotificationTime]);

  // Update document title when timer state changes
  useEffect(() => {
    updateDocumentTitle();
  }, [isRunning, time, mode, currentSubject, isPageVisible, targetTime]);

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
      setGlobalTimerPosition(data.globalTimerPosition || { x: 20, y: 20 });
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
      globalTimerPosition
    };
    localStorage.setItem('studentFocusTimer', JSON.stringify(data));
  };

  // Background timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          // Save state continuously while running
          saveTimerState({
            isRunning: true,
            time: newTime,
            mode,
            startTime: Date.now() - (newTime * 1000),
            subject: currentSubject,
            task: currentTask,
            targetTime
          });

          if (newTime >= targetTime * 60) {
          
          // Save state continuously while running
          saveTimerState({
            isRunning: true,
            time: newTime,
            mode,
            startTime: Date.now() - (newTime * 1000),
            subject: currentSubject,
            task: currentTask,
            targetTime
          });

          if (newTime >= targetTime * 60) {
            setIsRunning(false);
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
      // Clear timer state when stopped
      if (!isRunning && time === 0) {
        clearTimerState();
        setShowGlobalTimer(false);
      }
      // Clear timer state when stopped
      if (!isRunning && time === 0) {
        clearTimerState();
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, targetTime, mode, currentSubject, currentTask]);
      completedAt: new Date(),
      mode
    };

    if (mode === 'focus' || mode === 'custom') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);

      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      sendBackgroundNotification(
        '🎉 Focus Session Complete!',
        `Great work! ${STUDY_TIPS[tipIndex]}`,
        true
      );

      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
      } else if (mode === 'focus') {
        setMode('shortBreak');
      }
    } else {
      sendBackgroundNotification(
        '⏰ Break Time Over!',
        'Time to get back to studying! You\'ve got this! 💪',
        true
      );
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    clearTimerState();
    setShowGlobalTimer(false);
    clearTimerState();
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
    setBackgroundMode(false);
    setLastNotificationTime(Date.now());
    setBackgroundMode(false);
    setLastNotificationTime(Date.now());
  };

  const pauseFocus = () => {
    setIsRunning(false);
    clearTimerState();
    clearTimerState();
  };

  const stopFocus = () => {
    setIsRunning(false);
    setTime(0);
    setBackgroundMode(false);
    setShowGlobalTimer(false);
    clearTimerState();
    setBackgroundMode(false);
    clearTimerState();
  };

  const resetSession = () => {
    setTime(0);
    setIsRunning(false);
    clearTimerState();
    clearTimerState();
  };

  const switchMode = (newMode: TimerMode) => {
    if (!isRunning) {
      setMode(newMode);
      setTime(0);
      clearTimerState();
      clearTimerState();
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
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleFloatingStop = () => {
    stopFocus();
    setIsMinimized(false);
  };

  // Global timer drag handlers
  const handleGlobalTimerMouseDown = (e: React.MouseEvent) => {
    if (globalTimerRef.current) {
      const rect = globalTimerRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleGlobalTimerMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 120, e.clientY - dragOffset.y))
      };
      setGlobalTimerPosition(newPosition);
    }
  };

  const handleGlobalTimerMouseUp = () => {
    setIsDragging(false);
    saveData(); // Save new position
  };

  // Global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalTimerMouseMove);
      document.addEventListener('mouseup', handleGlobalTimerMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalTimerMouseMove);
      document.removeEventListener('mouseup', handleGlobalTimerMouseUp);
    };
  }, [isDragging, dragOffset]);

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

  // Background Status Indicator
  const BackgroundStatusIndicator = () => {
    if (!backgroundMode && !isRunning) return null;

    return (
      <div className="fixed top-4 left-4 z-50">
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 p-3 min-w-[200px] ${
          backgroundMode ? 'border-orange-400' : 'border-green-400'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              backgroundMode ? 'bg-orange-400' : 'bg-green-400'
            }`} />
            <span className="text-sm font-medium">
              {backgroundMode ? '🌐 Running in Background' : '🎯 Timer Active'}
            </span>
          </div>
          
          {backgroundMode && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>• Timer continues when tab is closed</div>
              <div>• Check browser tab title for updates</div>
              <div>• Global timer visible across all apps</div>
              <div>• You'll get notifications at intervals</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Global Timer Component (shows across all tabs/apps)
  const GlobalTimer = () => {
    if (!showGlobalTimer || (!isRunning && time === 0)) return null;

    return (
      <div
        ref={globalTimerRef}
        className="fixed z-[9999] select-none"
        style={{
          left: `${globalTimerPosition.x}px`,
          top: `${globalTimerPosition.y}px`,
          pointerEvents: 'auto'
        }}
      >
        <div className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-600 p-3 min-w-[280px] cursor-move"
             onMouseDown={handleGlobalTimerMouseDown}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-500/30' : 'bg-green-500/30'}`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Target className="w-4 h-4 text-blue-400" />
                ) : (
                  <Coffee className="w-4 h-4 text-green-400" />
                )}
              </div>
              <span className="text-sm font-medium">
                {mode === 'focus' ? 'Focus Session' : 
                 mode === 'custom' ? 'Custom Timer' : 
                 mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowGlobalTimer(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Hide Global Timer"
              >
                <EyeOff className="w-3 h-3 text-gray-400" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Stop Timer"
              >
                <Square className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-mono font-bold">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining • {targetTime}m total
            </div>
            {currentSubject && (
              <div className="text-xs text-blue-400 mt-1">
                📚 {currentSubject}
              </div>
            )}
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                (mode === 'focus' || mode === 'custom') ? 'bg-blue-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`font-medium flex items-center gap-1 ${isRunning ? 'text-green-400' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-blue-400" />
                <span>{pomodoroCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-xs text-gray-400 text-center">
              🖱️ Drag to move • Works across all tabs & apps
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Background Status Indicator
  const BackgroundStatusIndicator = () => {
    if (!backgroundMode && !isRunning) return null;

    return (
      <div className="fixed top-4 left-4 z-50">
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 p-3 min-w-[200px] ${
          backgroundMode ? 'border-orange-400' : 'border-green-400'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              backgroundMode ? 'bg-orange-400' : 'bg-green-400'
            }`} />
            <span className="text-sm font-medium">
              {backgroundMode ? '🌐 Running in Background' : '🎯 Timer Active'}
            </span>
          </div>
          
          {backgroundMode && (
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>• Timer continues when tab is closed</div>
              <div>• Check browser tab title for updates</div>
              <div>• You'll get notifications at intervals</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {mode === 'focus' ? 'Focus' : mode === 'custom' ? 'Custom' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleMaximize}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-3 h-3 text-gray-500" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Stop Timer"
              >
                <Square className="w-3 h-3 text-red-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-2">
            <div className="text-xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              / {targetTime}m {currentSubject && `• ${currentSubject}`}
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                (mode === 'focus' || mode === 'custom') ? 'bg-blue-600 dark:bg-blue-400' : 'bg-green-600 dark:bg-green-400'
              }`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`font-medium ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              {isRunning ? '● Active' : '⏸ Paused'}
            </div>
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Flame className="w-3 h-3" />
              <span>{currentStreak}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      <BackgroundStatusIndicator />
      <GlobalTimer />
      <BackgroundStatusIndicator />
      <FloatingTimer />

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={LOFI_TRACKS[currentTrack].url}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Coffee className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {mode === 'focus' ? 'Focus Time' :
                       mode === 'custom' ? 'Custom Timer' :
                       mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(mode === 'focus' || mode === 'custom') ? 'Time to concentrate and learn!' : 'Take a well-deserved break!'}
                    </p>
                    {backgroundMode && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        <span className="text-xs text-orange-600 font-medium">
                          Background Mode Active
                        </span>
                      </div>
                    )}
                    {backgroundMode && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        <span className="text-xs text-orange-600 font-medium">
                          Background Mode Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {(isRunning || backgroundMode) && (
                    <Button
                      onClick={() => setShowGlobalTimer(!showGlobalTimer)}
                      icon={showGlobalTimer ? EyeOff : Eye}
                      variant="ghost"
                      size="sm"
                      className="text-purple-500 hover:text-purple-700"
                      title={showGlobalTimer ? "Hide Global Timer" : "Show Global Timer"}
                    />
                  )}
                  <Button
                    onClick={handleMinimize}
                    icon={Minimize2}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  />
                </div>
              </div>

              {/* Background Mode Information */}
              {(isRunning || backgroundMode) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="font-medium text-blue-800 dark:text-blue-400 text-sm">
                      Advanced Background Timer Active
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <div>✅ Timer continues when you close this tab or browser</div>
                    <div>🏷️ Check your browser tab title to see remaining time</div>
                    <div>🌐 Global timer shows across all tabs and apps</div>
                    <div>🔔 You'll receive notifications at regular intervals</div>
                    <div>💾 Your progress is automatically saved and synced</div>
                    <div>🖱️ Drag the global timer to reposition it anywhere</div>
                  </div>
                </div>
              )}

              {/* Background Mode Information */}
              {(isRunning || backgroundMode) && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="font-medium text-blue-800 dark:text-blue-400 text-sm">
                      Background Timer Active
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <div>✅ Timer continues when you close this tab or app</div>
                    <div>🏷️ Check your browser tab title to see remaining time</div>
                    <div>🔔 You'll receive notifications at regular intervals</div>
                    <div>💾 Your progress is automatically saved</div>
                  </div>
                </div>
              )}

              {/* Enhanced Mode Switcher - Fixed overlap issues */}
              <div className="space-y-4">
                {/* Desktop Mode Switcher */}
                <div className="hidden sm:block">
                  <div className="grid grid-cols-4 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {timerModes.map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`group relative py-3 px-2 text-sm font-medium rounded-md transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <timerMode.icon className="w-4 h-4" />
                          <span className="text-xs">{timerMode.label}</span>
                          <span className="text-xs opacity-75">({timerMode.time}m)</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Mode Switcher */}
                <div className="sm:hidden">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {timerModes.slice(0, 2).map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`py-3 px-3 text-sm font-medium rounded-lg transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <timerMode.icon className="w-4 h-4" />
                          <span>{timerMode.shortLabel}</span>
                          <span className="text-xs opacity-75">({timerMode.time}m)</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {timerModes.slice(2, 4).map((timerMode) => (
                      <button
                        key={timerMode.key}
                        onClick={() => switchMode(timerMode.key)}
                        disabled={isRunning}
                        className={`py-3 px-3 text-sm font-medium rounded-lg transition-all ${
                          mode === timerMode.key
                            ? (timerMode.key === 'focus' || timerMode.key === 'custom')
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex items-center gap-2 justify-center">
                          <timerMode.icon className="w-4 h-4" />
                          <span>{timerMode.shortLabel}</span>
                          <span className="text-xs opacity-75">({timerMode.time}m)</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-400">
                        Custom Timer Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Custom Duration (minutes)
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quick Presets
                        </label>
                        <div className="flex gap-2">
                          {[15, 30, 45, 60].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50"
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
                      🎯 Current Task
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

              {/* Timer Display */}
              <div className="text-center">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="65"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 65}`}
                      strokeDashoffset={`${2 * Math.PI * 65 * (1 - getProgress() / 100)}`}
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
                      <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(Math.max(0, targetTime * 60 - time))} left
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Motivation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className={`w-4 h-4 ${isRunning ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {isRunning ? 'Keep Going! You\'re Doing Great!' : 'Ready When You Are'}
                    </span>
                  </div>
                  
                  {(mode === 'shortBreak' || mode === 'longBreak') && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-400 text-sm">
                          Break Suggestion
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {getRandomTip()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-3">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    className={`flex-1 ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom') ? 'Start Session' : 'Start Break'}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseFocus}
                    icon={Pause}
                    variant="secondary"
                    className="flex-1"
                  >
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={stopFocus}
                  icon={Square}
                  variant="danger"
                  disabled={time === 0}
                  className="px-6"
                >
                  Stop
                </Button>
              </div>

              {time > 0 && !isRunning && (
                <Button
                  onClick={resetSession}
                  variant="secondary"
                  className="w-full"
                >
                  Reset Session
                </Button>
              )}

              {/* Compact Music Player Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                  icon={Music}
                  variant="ghost"
                  className="text-purple-600"
                >
                  {showMusicPlayer ? 'Hide Music' : 'Show Music'}
                </Button>
                
                {showMusicPlayer && (
                  <div className="flex items-center gap-2">
                    <button onClick={previousTrack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <SkipBack className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={toggleMusic} className="p-2 bg-purple-600 text-white rounded-lg">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button onClick={nextTrack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      <SkipForward className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Volume Control (when music player is shown) */}
              {showMusicPlayer && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="text-sm text-center text-purple-700 dark:text-purple-300 mb-2">
                    {LOFI_TRACKS[currentTrack].title} - {LOFI_TRACKS[currentTrack].artist}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    disabled={isMuted}
                  />
                </div>
              )}

              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <Target className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    {pomodoroCount}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Today
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                  <Flame className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-400">
                    {currentStreak}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    Streak
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-400">
                    {sessionsCompleted}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Total
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    Goal
                  </div>
                </div>
              </div>

              {/* Daily Goal Setting */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Study Goal
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(parseInt(value) || 4)}
                      className="w-16 text-center text-sm"
                      min="1"
                      max="12"
                    />
                    <span className="text-xs text-gray-500">sessions</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
              </div>

              {/* Study Tip (when not running) */}
              {(mode === 'focus' || mode === 'custom') && !isRunning && time === 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-400 text-sm">
                      Study Tip
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {getRandomTip()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleMinimize}
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

