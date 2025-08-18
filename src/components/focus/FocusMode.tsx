import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio, Settings, Move, Zap, Heart, Moon, Sun, Waves, TreePine, Car, Headphones } from 'lucide-react';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom' | 'deepFocus' | 'study' | 'creative';

interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
  productivity: number;
  notes?: string;
}

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  genre: string;
  mood: string;
}

interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  url: string;
  category: 'nature' | 'urban' | 'white-noise' | 'cafe';
}

interface TimerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  custom: number;
  deepFocus: number;
  study: number;
  creative: number;
  autoBreak: boolean;
  notifications: boolean;
  sounds: boolean;
}

const DEFAULT_POMODORO_SETTINGS: TimerSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30,
  deepFocus: 50,
  study: 45,
  creative: 90,
  autoBreak: true,
  notifications: true,
  sounds: true
};

const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Lofi Study Session',
    artist: 'Chill Beats',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: '2:14'
    genre: 'lofi-hip-hop',
    mood: 'focused'
  },
  {
    id: '2',
    title: 'Calm Piano Lofi',
    artist: 'Relaxing Sounds',
    url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_2c4d3b8c8e.mp3',
    duration: '3:42'
    genre: 'ambient',
    mood: 'relaxed'
  },
  {
    id: '3',
    title: 'Midnight Coffee',
    artist: 'Study Lounge',
    url: 'https://cdn.pixabay.com/audio/2022/11/27/audio_af1e9b6b8e.mp3',
    duration: '2:58'
  },
  {
    id: '4',
    title: 'Focus Flow',
    artist: 'Ambient Collective',
    url: 'https://cdn.pixabay.com/audio/2023/01/15/audio_7b3c9d4f2a.mp3',
    duration: '4:12'
  },
  {
    id: '5',
    title: 'Dreamy Study Beats',
    artist: 'Lofi Dreams',
    url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_c8b5e6f1d3.mp3',
    duration: '3:28'
    genre: 'ambient',
    mood: 'intense'
  },
  {
    id: '4',
    title: 'Rainy Day Study',
    artist: 'Nature Sounds',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '6:20',
    genre: 'nature',
    mood: 'calm'
  },
  {
    id: '5',
    title: 'Creative Inspiration',
    artist: 'Dreamy Loops',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '4:55',
    genre: 'creative',
    mood: 'inspiring'
  }
];

const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: '1', name: 'Rain', icon: '🌧️', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'nature' },
  { id: '2', name: 'Ocean Waves', icon: '🌊', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'nature' },
  { id: '3', name: 'Forest', icon: '🌲', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'nature' },
  { id: '4', name: 'Coffee Shop', icon: '☕', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'cafe' },
  { id: '5', name: 'White Noise', icon: '📻', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'white-noise' },
  { id: '6', name: 'City Traffic', icon: '🚗', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', category: 'urban' }
];

const STUDY_TIPS = [
  "🧠 Take deep breaths and stay hydrated! Your brain needs oxygen and water to function optimally.",
  "📚 Review what you've learned before starting new material to strengthen neural pathways.",
  "⭐ Excellent progress! You're building strong study habits that will serve you well.",
  "👀 Take a moment to look away from your screen and rest your eyes every 20 minutes.",
  "🚀 You're doing amazing! Keep up this momentum and watch your knowledge grow.",
  "💡 Try explaining what you've learned to someone else - it's a great way to reinforce knowledge.",
  "🎯 Break complex topics into smaller, manageable chunks for better understanding.",
  "⚡ Your focus is improving with each session. Consistency is key to mastery!"
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a short walk outside to get fresh air and boost your energy",
  "💧 Drink some water and have a healthy snack to fuel your brain",
  "👀 Practice the 20-20-20 rule: look at something 20 feet away for 20 seconds",
  "🧘‍♀️ Do some light stretching or deep breathing exercises to relax",
  "🎵 Listen to your favorite uplifting song to recharge your spirits",
  "🌱 Step outside and get some natural light to reset your circadian rhythm",
  "🤸‍♂️ Do some quick jumping jacks or push-ups to get your blood flowing",
  "📝 Write down three things you're grateful for to boost your mood"
];

const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
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

  // Enhanced UI state
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [showStats, setShowStats] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [productivity, setProductivity] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<'lofi' | 'ambient'>('lofi');
  const [currentAmbientSound, setCurrentAmbientSound] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');

  // Floating window state
  const [floatingPosition, setFloatingPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const targetTime = pomodoroSettings[mode];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('advancedFocusTimer');
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
      setTheme(data.theme || 'auto');
      setFloatingPosition(data.floatingPosition || { x: 20, y: 20 });
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = repeat === 'one';
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? 0 : volume * 0.7;
      ambientAudioRef.current.loop = true;
    }
  }, [volume, isMuted, repeat]);

  // Mouse drag handlers for floating window
  const handleMouseDown = (e: React.MouseEvent) => {
    if (floatingRef.current) {
      const rect = floatingRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 280, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
      setFloatingPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

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
      theme,
      floatingPosition
    };
    localStorage.setItem('advancedFocusTimer', JSON.stringify(data));
  };

  // Background timer
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

  // Request notification permission on mount
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
      productivity,
      notes: sessionNotes
    };

    if (mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'study' || mode === 'creative') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      
      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      if (pomodoroSettings.notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus Session Complete!', {
          body: STUDY_TIPS[tipIndex],
          icon: '/vite.svg'
        });
      }

      if (pomodoroSettings.autoBreak) {
        if (mode === 'focus' && newCount % 4 === 0) {
          setMode('longBreak');
        } else if (mode === 'focus') {
          setMode('shortBreak');
        }
      }
    } else {
      if (pomodoroSettings.notifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Break Time Over!', {
          body: 'Time to get back to studying! You\'ve got this! 💪',
          icon: '/vite.svg'
        });
      }
      if (pomodoroSettings.autoBreak) {
        setMode('focus');
      }
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    setProductivity(5);
    setSessionNotes('');
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
    if (currentPlaylist === 'lofi') {
      const nextIndex = shuffle 
        ? Math.floor(Math.random() * LOFI_TRACKS.length)
        : (currentTrack + 1) % LOFI_TRACKS.length;
      setCurrentTrack(nextIndex);
    } else {
      const nextIndex = (currentAmbientSound + 1) % AMBIENT_SOUNDS.length;
      setCurrentAmbientSound(nextIndex);
    }
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const previousTrack = () => {
    if (currentPlaylist === 'lofi') {
      const prevIndex = shuffle 
        ? Math.floor(Math.random() * LOFI_TRACKS.length)
        : currentTrack === 0 ? LOFI_TRACKS.length - 1 : currentTrack - 1;
      setCurrentTrack(prevIndex);
    } else {
      const prevIndex = currentAmbientSound === 0 ? AMBIENT_SOUNDS.length - 1 : currentAmbientSound - 1;
      setCurrentAmbientSound(prevIndex);
    }
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? volume * 0.7 : 0;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? 0 : newVolume * 0.7;
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
  };

  const pauseFocus = () => {
    setIsRunning(false);
  };

  const stopFocus = () => {
    setIsRunning(false);
    setTime(0);
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
    if (minutes > 0 && minutes <= 180) {
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

  const getTodaysPomodoros = () => {
    const today = new Date().toDateString();
    return studyHistory.filter(session =>
      ['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(session.mode) &&
      new Date(session.completedAt).toDateString() === today
    ).length;
  };

  const getDailyProgress = () => {
    return Math.min((getTodaysPomodoros() / dailyGoal) * 100, 100);
  };

  const getRandomTip = () => {
    if (['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode)) {
      return STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    }
    return BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)];
  };

  const getModeIcon = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'focus': return <Target className="w-4 h-4" />;
      case 'deepFocus': return <Brain className="w-4 h-4" />;
      case 'study': return <BookOpen className="w-4 h-4" />;
      case 'creative': return <Lightbulb className="w-4 h-4" />;
      case 'shortBreak': return <Coffee className="w-4 h-4" />;
      case 'longBreak': return <Moon className="w-4 h-4" />;
      case 'custom': return <Settings className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getModeColor = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'focus': return 'blue';
      case 'deepFocus': return 'purple';
      case 'study': return 'indigo';
      case 'creative': return 'yellow';
      case 'shortBreak': return 'green';
      case 'longBreak': return 'emerald';
      case 'custom': return 'gray';
      default: return 'blue';
    }
  };

  // Enhanced Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    const color = getModeColor(mode);

    return (
      <div 
        ref={floatingRef}
        className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          left: floatingPosition.x, 
          top: floatingPosition.y,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
      >
        <div className={`bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-[280px] max-w-[320px] ${isDragging ? 'shadow-3xl' : ''}`}>
          <div 
            className="flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 ring-2 ring-${color}-500/20`}>
                {getModeIcon(mode)}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {mode === 'deepFocus' ? 'Deep Focus' : 
                   mode === 'shortBreak' ? 'Short Break' : 
                   mode === 'longBreak' ? 'Long Break' : mode}
                </span>
                {currentSubject && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                    {currentSubject}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Move className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining • {targetTime}m total
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r from-${color}-500 to-${color}-600`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={isRunning ? pauseFocus : startFocus}
              disabled={time >= targetTime * 60}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                isRunning 
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                  : `bg-${color}-600 text-white hover:bg-${color}-700 shadow-lg hover:shadow-xl`
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleFloatingStop}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              title="Stop & Expand"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Maximize"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 font-medium ${isRunning ? `text-${color}-600 dark:text-${color}-400` : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? `bg-${color}-500` : 'bg-gray-400'} ${isRunning ? 'animate-pulse' : ''}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Flame className="w-3 h-3" />
                <span>{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span>{getTodaysPomodoros()}</span>
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

      {/* Hidden audio elements */}
      <audio
        ref={audioRef}
        src={currentPlaylist === 'lofi' ? LOFI_TRACKS[currentTrack].url : AMBIENT_SOUNDS[currentAmbientSound].url}
        preload="metadata"
      />
      <audio
        ref={ambientAudioRef}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br from-${getModeColor(mode)}-100 to-${getModeColor(mode)}-200 dark:from-${getModeColor(mode)}-900/30 dark:to-${getModeColor(mode)}-800/20 ring-2 ring-${getModeColor(mode)}-500/20`}>
                    {getModeIcon(mode)}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                      {mode === 'deepFocus' ? 'Deep Focus Mode' : 
                       mode === 'shortBreak' ? 'Short Break' : 
                       mode === 'longBreak' ? 'Long Break' : 
                       `${mode} Mode`}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      {['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode) 
                        ? 'Time to concentrate and achieve your goals!' 
                        : 'Take a well-deserved break and recharge!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleMinimize}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  title="Minimize to floating window"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Mode Switcher */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                  {(['focus', 'deepFocus', 'study', 'creative', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((timerMode) => {
                    const color = getModeColor(timerMode);
                    const isActive = mode === timerMode;
                    return (
                      <button
                        key={timerMode}
                        onClick={() => switchMode(timerMode)}
                        disabled={isRunning}
                        className={`flex flex-col items-center gap-2 py-3 px-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? `bg-${color}-600 text-white shadow-lg scale-105`
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : `bg-${color}-100 dark:bg-${color}-900/30`}`}>
                          {getModeIcon(timerMode)}
                        </div>
                        <span className="capitalize text-center">
                          {timerMode === 'deepFocus' ? 'Deep' : 
                           timerMode === 'shortBreak' ? 'Break' : 
                           timerMode === 'longBreak' ? 'Long' : timerMode}
                        </span>
                        <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                          {pomodoroSettings[timerMode]}m
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        Custom Timer Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Duration (minutes)
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="180"
                          value={pomodoroSettings.custom}
                          onChange={(e) => handleCustomTimerChange(parseInt(e.target.value))}
                          disabled={isRunning}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5m</span>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{pomodoroSettings.custom}m</span>
                          <span>3h</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Quick Presets
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[15, 30, 45, 90].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className={`py-2 px-3 text-sm rounded-lg font-medium transition-all ${
                                pomodoroSettings.custom === preset
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                              } disabled:opacity-50`}
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

              {/* Study Subject & Task */}
              {['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <BookOpen className="w-4 h-4" />
                      Subject
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      placeholder="e.g., Mathematics, History, Programming..."
                      disabled={isRunning}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Target className="w-4 h-4" />
                      Current Task
                    </label>
                    <input
                      type="text"
                      value={currentTask}
                      onChange={(e) => setCurrentTask(e.target.value)}
                      placeholder="e.g., Chapter 5 problems, Essay outline..."
                      disabled={isRunning}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={`rgb(59 130 246)`} />
                        <stop offset="100%" stopColor={`rgb(147 51 234)`} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 85}`}
                      strokeDashoffset={`${2 * Math.PI * 85 * (1 - getProgress() / 100)}`}
                      className="transition-all duration-1000 drop-shadow-lg"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        {formatTime(Math.max(0, targetTime * 60 - time))} remaining
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {Math.round(getProgress())}% complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Motivation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} shadow-lg`} />
                    <span className={`text-lg font-medium ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {isRunning ? 'Stay Focused! You\'re Doing Amazing!' : 'Ready to Begin Your Session'}
                    </span>
                  </div>
                  
                  {mode === 'shortBreak' || mode === 'longBreak' ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-semibold text-green-800 dark:text-green-400">
                          Break Activity Suggestion
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-300 leading-relaxed">
                        {getRandomTip()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-semibold text-blue-800 dark:text-blue-400">
                          Study Tip
                        </span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                        {getRandomTip()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Timer Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isRunning ? (
                  <button
                    onClick={startFocus}
                    disabled={time >= targetTime * 60 || (['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode) && !currentSubject.trim())}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                      ['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    <Play className="w-6 h-6" />
                    {['focus', 'custom', 'deepFocus', 'study', 'creative'].includes(mode) ? 'Start Focus Session' : 'Start Break Time'}
                  </button>
                ) : (
                  <button
                    onClick={pauseFocus}
                    className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <Pause className="w-6 h-6" />
                    Pause Session
                  </button>
                )}
                
                <button
                  onClick={stopFocus}
                  disabled={time === 0}
                  className="sm:w-auto w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              </div>

              {time > 0 && !isRunning && (
                <button
                  onClick={resetSession}
                  className="w-full py-3 px-6 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Reset Session
                </button>
              )}

              {/* Enhanced Music Player */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Music className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold text-purple-800 dark:text-purple-400">
                      Focus Music & Sounds
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
                  >
                    {showMusicPlayer ? 'Hide' : 'Show'}
                  </button>
                </div>

                {showMusicPlayer && (
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <button
                        onClick={() => setCurrentPlaylist('lofi')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                          currentPlaylist === 'lofi'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-purple-600 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                        }`}
                      >
                        Lofi Music
                      </button>
                      <button
                        onClick={() => setCurrentPlaylist('ambient')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                          currentPlaylist === 'ambient'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-purple-600 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                        }`}
                      >
                        Ambient Sounds
                      </button>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-1">
                        {currentPlaylist === 'lofi' 
                          ? LOFI_TRACKS[currentTrack].title
                          : AMBIENT_SOUNDS[currentAmbientSound].name
                        }
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">
                        {currentPlaylist === 'lofi' 
                          ? `${LOFI_TRACKS[currentTrack].artist} • ${LOFI_TRACKS[currentTrack].duration}`
                          : `${AMBIENT_SOUNDS[currentAmbientSound].icon} ${AMBIENT_SOUNDS[currentAmbientSound].category}`
                        }
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={previousTrack} 
                        className="p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                        title="Previous track"
                      >
                        <SkipBack className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </button>
                      <button 
                        onClick={toggleMusic} 
                        className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button 
                        onClick={nextTrack} 
                        className="p-3 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                        title="Next track"
                      >
                        <SkipForward className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        onClick={toggleMute} 
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-purple-600" /> : <Volume2 className="w-5 h-5 text-purple-600" />}
                      </button>
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
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setShuffle(!shuffle)}
                          className={`p-2 rounded-xl transition-colors ${
                            shuffle ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600'
                          }`}
                          title="Shuffle"
                        >
                          <Radio className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 text-center border border-blue-200/50 dark:border-blue-700/30">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl inline-block mb-3">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-1">
                    {getTodaysPomodoros()}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Today's Sessions
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 text-center border border-orange-200/50 dark:border-orange-700/30">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl inline-block mb-3">
                    <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-400 mb-1">
                    {currentStreak}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">
                    Current Streak
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 text-center border border-green-200/50 dark:border-green-700/30">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl inline-block mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-400 mb-1">
                    {sessionsCompleted}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Total Sessions
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 text-center border border-purple-200/50 dark:border-purple-700/30">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl inline-block mb-3">
                    <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-400 mb-1">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Daily Goal
                  </div>
                </div>
              </div>

              {/* Enhanced Daily Goal Setting */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Daily Study Goal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                      className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                      <span className="font-bold text-purple-800 dark:text-purple-300">{dailyGoal}</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">sessions</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{getTodaysPomodoros()} completed</span>
                  <span>{dailyGoal - getTodaysPomodoros()} remaining</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleMinimize}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                >
                  <Minimize2 className="w-5 h-5" />
                  Minimize to Float
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: none;
        }
      `}</style>
    </>
  );
};

function App() {
  const [showFocus, setShowFocus] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 max-w-md">
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl inline-block mb-4">
              <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Advanced Focus Mode
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Boost your productivity with advanced timers, ambient sounds, and intelligent tracking.
            </p>
          </div>
          
          <button
            onClick={() => setShowFocus(true)}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Start Focus Session
          </button>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Timer Modes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Music & Sounds</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">📊</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Smart Analytics</div>
            </div>
          </div>
        </div>
      </div>

      <FocusMode 
        isOpen={showFocus} 
        onClose={() => setShowFocus(false)} 
      />
    </div>
  );
}

export default App;
