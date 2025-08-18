import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, 
  BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, 
  VolumeX, SkipForward, SkipBack, Settings, Star, Zap, Heart,
  TrendingUp, Award, Calendar, Timer, Focus, Sun, Moon, Sparkles,
  Headphones, Activity, BarChart3, PieChart, User
} from 'lucide-react';

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

const AMBIENT_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Forest Rain',
    artist: 'Nature Sounds',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav',
    duration: '10:00'
  },
  {
    id: '2',
    title: 'Ocean Waves',
    artist: 'Calm Ocean',
    url: 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav',
    duration: '8:30'
  },
  {
    id: '3',
    title: 'Coffee Shop Ambience',
    artist: 'Ambient Café',
    url: 'https://www.soundjay.com/misc/sounds/coffee-shop.wav',
    duration: '12:15'
  },
  {
    id: '4',
    title: 'White Noise Focus',
    artist: 'Concentration Helper',
    url: 'https://www.soundjay.com/misc/sounds/white-noise.wav',
    duration: '15:00'
  },
  {
    id: '5',
    title: 'Cozy Fireplace',
    artist: 'Warm Ambience',
    url: 'https://www.soundjay.com/misc/sounds/fireplace.wav',
    duration: '20:00'
  },
  {
    id: '6',
    title: 'Library Silence',
    artist: 'Study Atmosphere',
    url: 'https://www.soundjay.com/misc/sounds/library.wav',
    duration: '18:45'
  }
];

const STUDY_TIPS = [
  "🧠 Take deep breaths and stay hydrated! Your brain is 75% water.",
  "📚 Review what you've learned before starting new material - active recall works!",
  "⭐ Great progress! You're building strong neural pathways through consistent practice.",
  "👁️ Take a moment to stretch and rest your eyes - the 20-20-20 rule helps!",
  "🚀 You're doing amazing! Consistent small steps lead to extraordinary results.",
  "🎯 Break complex topics into smaller chunks - your brain loves manageable pieces.",
  "💡 Teaching someone else what you learned solidifies your understanding.",
  "🌱 Growth happens outside your comfort zone - embrace the challenge!"
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a mindful walk and let your subconscious process what you learned",
  "💧 Hydrate with water and have a brain-boosting snack like nuts or berries",
  "👁️ Look at something 20 feet away for 20 seconds to rest your eyes",
  "🧘‍♀️ Do some deep breathing exercises or gentle stretching",
  "🎵 Listen to your favorite uplifting song to recharge your energy",
  "🌿 Step outside for fresh air and vitamin D from natural light",
  "📝 Jot down quick notes about what you just learned",
  "😊 Practice gratitude - think of three things you're thankful for"
];

const FOCUS_QUOTES = [
  "The expert in anything was once a beginner. - Helen Hayes",
  "Success is the sum of small efforts repeated daily. - Robert Collier",
  "Focus on being productive instead of busy. - Tim Ferriss",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson"
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  // Animation states
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const motivationInterval = useRef<NodeJS.Timeout>();

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
      setIsDarkMode(data.isDarkMode || false);
    }

    // Check system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = true;
    }
  }, [volume, isMuted]);

  // Motivation cycling
  useEffect(() => {
    if (isRunning) {
      motivationInterval.current = setInterval(() => {
        setMotivationIndex(prev => (prev + 1) % STUDY_TIPS.length);
      }, 30000); // Change tip every 30 seconds
    } else {
      if (motivationInterval.current) {
        clearInterval(motivationInterval.current);
      }
    }

    return () => {
      if (motivationInterval.current) {
        clearInterval(motivationInterval.current);
      }
    };
  }, [isRunning]);

  // Pulse effect for active timer
  useEffect(() => {
    if (isRunning) {
      const pulseInterval = setInterval(() => {
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 1000);
      }, 2000);

      return () => clearInterval(pulseInterval);
    }
  }, [isRunning]);

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
      isDarkMode
    };
    localStorage.setItem('studentFocusTimer', JSON.stringify(data));
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
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);

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
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Fantastic! Session Complete!', {
          body: `Amazing work! ${STUDY_TIPS[tipIndex]}`,
          icon: '/vite.svg'
        });
      }

      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
      } else if (mode === 'focus') {
        setMode('shortBreak');
      }
    } else {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚡ Ready to Focus!', {
          body: 'Break time over! Time to crush your next study session! 💪',
          icon: '/vite.svg'
        });
      }
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
    const nextIndex = (currentTrack + 1) % AMBIENT_TRACKS.length;
    setCurrentTrack(nextIndex);
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const previousTrack = () => {
    const prevIndex = currentTrack === 0 ? AMBIENT_TRACKS.length - 1 : currentTrack - 1;
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

  const getRandomQuote = () => {
    return FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)];
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    saveData();
  };

  // Floating Timer Component with enhanced design
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
        <div className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900 border-gray-700' : 'from-white to-gray-50 border-gray-200'} rounded-2xl shadow-2xl border backdrop-blur-sm p-4 min-w-[280px] transform transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${(mode === 'focus' || mode === 'custom') ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-teal-600'} shadow-lg`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Brain className="w-5 h-5 text-white" />
                ) : (
                  <Coffee className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mode === 'focus' ? 'Deep Focus' : 
                   mode === 'custom' ? 'Custom Study' :
                   mode === 'shortBreak' ? 'Quick Break' : 'Long Break'}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-600 font-medium">{currentStreak} streak</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleMaximize}
                className={`p-1.5 hover:bg-opacity-20 hover:bg-gray-500 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                title="Maximize"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-1.5 hover:bg-red-100 rounded-lg transition-all duration-200 text-red-500 hover:text-red-700"
                title="Stop Timer"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className={`text-2xl font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${pulseEffect ? 'animate-pulse' : ''}`}>
              {formatTime(time)}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining {currentSubject && `• ${currentSubject}`}
            </div>
          </div>

          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-3 overflow-hidden`}>
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${
                (mode === 'focus' || mode === 'custom') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-r from-green-500 to-teal-600'
              } shadow-sm`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 font-medium ${isRunning ? 'text-green-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isDarkMode ? 'bg-gray-400' : 'bg-gray-500'}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-blue-500">
                <Target className="w-3 h-3" />
                <span>{getTodaysPomodoros()}/{dailyGoal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Celebration animation component
  const CelebrationOverlay = () => {
    if (!showCelebration) return null;

    return (
      <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
        <div className="animate-bounce-in text-center">
          <div className="text-6xl mb-4 animate-pulse">🎉</div>
          <div className="text-2xl font-bold text-yellow-500 animate-fade-in">
            Session Complete!
          </div>
          <div className="text-lg text-gray-600 animate-slide-up">
            Amazing work! Keep going! 🚀
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float-${i % 4} text-2xl`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {['🌟', '✨', '⭐', '🎊'][i % 4]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      <FloatingTimer />
      <CelebrationOverlay />
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={AMBIENT_TRACKS[currentTrack].url}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-black'} bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in`}>
          <div className={`w-full max-w-4xl max-h-[95vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl shadow-2xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} transform transition-all duration-300 animate-scale-in`}>
            <div className="p-8 space-y-8">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${(mode === 'focus' || mode === 'custom') ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-green-500 to-teal-600'} shadow-lg transform hover:scale-110 transition-transform duration-200`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-8 h-8 text-white" />
                    ) : (
                      <Coffee className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-gradient-to-r ${(mode === 'focus' || mode === 'custom') ? 'from-blue-600 to-purple-600' : 'from-green-600 to-teal-600'} bg-clip-text text-transparent`}>
                      {mode === 'focus' ? 'Deep Focus Zone' : 
                       mode === 'custom' ? 'Custom Study Session' :
                       mode === 'shortBreak' ? 'Quick Recharge' : 'Extended Break'}
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {(mode === 'focus' || mode === 'custom') ? 'Your mind is your most powerful tool - let\'s sharpen it!' : 'Rest is productive too - recharge for maximum performance!'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>{currentStreak} day streak</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>{sessionsCompleted} total sessions</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className={`p-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl transition-all duration-200 hover:scale-110`}
                    title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                  </button>
                  <button
                    onClick={handleMinimize}
                    className={`p-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl transition-all duration-200 hover:scale-110`}
                    title="Minimize"
                  >
                    <Minimize2 className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>

              {/* Enhanced Mode Switcher */}
              <div className="space-y-6">
                <div className={`flex gap-2 p-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl shadow-inner`}>
                  {(['focus', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((timerMode) => (
                    <button
                      key={timerMode}
                      onClick={() => switchMode(timerMode)}
                      disabled={isRunning}
                      className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        mode === timerMode
                          ? (timerMode === 'focus' || timerMode === 'custom')
                            ? `bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ${pulseEffect ? 'animate-pulse' : ''}`
                            : 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg'
                          : `${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-white'} hover:shadow-md`
                      } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {timerMode === 'focus' && <Brain className="w-4 h-4" />}
                        {timerMode === 'shortBreak' && <Coffee className="w-4 h-4" />}
                        {timerMode === 'longBreak' && <Heart className="w-4 h-4" />}
                        {timerMode === 'custom' && <Settings className="w-4 h-4" />}
                        <span>
                          {timerMode === 'focus' ? `Focus (${pomodoroSettings.focus}m)` : 
                           timerMode === 'shortBreak' ? `Break (${pomodoroSettings.shortBreak}m)` : 
                           timerMode === 'longBreak' ? `Long (${pomodoroSettings.longBreak}m)` :
                           `Custom (${pomodoroSettings.custom}m)`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Enhanced Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'} rounded-2xl p-6 border backdrop-blur-sm animate-slide-down`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                        Custom Timer Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Custom Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={pomodoroSettings.custom.toString()}
                          onChange={(e) => handleCustomTimerChange(parseInt(e.target.value) || 30)}
                          min="1"
                          max="180"
                          disabled={isRunning}
                          className={`w-full text-center text-lg font-bold py-3 px-4 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                          Quick Presets
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[15, 30, 45, 60].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className={`py-2 px-4 text-sm font-bold ${isDarkMode ? 'bg-blue-800/50 text-blue-400 hover:bg-blue-700/50' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:transform-none`}
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

              {/* Enhanced Study Subject & Task */}
              {(mode === 'focus' || mode === 'custom') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      <BookOpen className="w-4 h-4" />
                      Study Subject
                    </label>
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      placeholder="e.g., Advanced Mathematics, World History..."
                      disabled={isRunning}
                      className={`w-full py-3 px-4 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50`}
                    />
                  </div>
                  <div>
                    <label className={`flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                      <Target className="w-4 h-4" />
                      Learning Goal
                    </label>
                    <input
                      type="text"
                      value={currentTask}
                      onChange={(e) => setCurrentTask(e.target.value)}
                      placeholder="e.g., Master calculus problems, Understand key concepts..."
                      disabled={isRunning}
                      className={`w-full py-3 px-4 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50`}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center space-y-6">
                <div className="relative w-56 h-56 mx-auto">
                  <svg className="w-56 h-56 transform -rotate-90 drop-shadow-lg" viewBox="0 0 224 224">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={(mode === 'focus' || mode === 'custom') ? '#3B82F6' : '#10B981'} />
                        <stop offset="100%" stopColor={(mode === 'focus' || mode === 'custom') ? '#8B5CF6' : '#06B6D4'} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="112"
                      cy="112"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className={`${isDarkMode ? 'text-gray-700' : 'text-gray-200'} opacity-30`}
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="88"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgress() / 100)}`}
                      className={`transition-all duration-1000 ${isRunning ? 'filter-glow' : ''}`}
                      strokeLinecap="round"
                      filter={isRunning ? "url(#glow)" : "none"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-mono font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${pulseEffect ? 'animate-pulse' : ''} mb-1`}>
                        {formatTime(time)}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                        {formatTime(Math.max(0, targetTime * 60 - time))} remaining
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                        Target: {targetTime} minutes
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status & Motivation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isRunning ? (isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-100 border-green-300') : (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')} border`}>
                      <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                      <span className={`text-sm font-bold ${isRunning ? 'text-green-600 dark:text-green-400' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isRunning ? 'In The Zone!' : 'Ready to Focus'}
                      </span>
                    </div>
                    {isRunning && (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${(mode === 'focus' || mode === 'custom') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'} animate-fade-in`}>
                        {Math.round(getProgress())}% Complete
                      </div>
                    )}
                  </div>
                  
                  {/* Dynamic Motivation Messages */}
                  {isRunning && (
                    <div className={`${isDarkMode ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-700/50' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'} rounded-2xl p-4 border animate-fade-in`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                          You're Crushing It!
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'} animate-slide-up`}>
                        {STUDY_TIPS[motivationIndex]}
                      </p>
                    </div>
                  )}

                  {/* Inspirational Quote for non-running states */}
                  {!isRunning && time === 0 && (
                    <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'} rounded-2xl p-4 border animate-fade-in`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-purple-500" />
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                          Daily Inspiration
                        </span>
                      </div>
                      <p className={`text-sm italic ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        {getRandomQuote()}
                      </p>
                    </div>
                  )}

                  {/* Break Activity Suggestions */}
                  {(mode === 'shortBreak' || mode === 'longBreak') && (
                    <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-900/30 to-teal-900/30 border-green-700/50' : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'} rounded-2xl p-4 border animate-slide-up`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-4 h-4 text-green-500" />
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
                          Break Time Activity
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        {getRandomTip()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <button
                    onClick={startFocus}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg ${
                      (mode === 'focus' || mode === 'custom') 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-green-500/25'
                    }`}
                  >
                    <Play className="w-6 h-6" />
                    {(mode === 'focus' || mode === 'custom') ? 'Start Deep Focus' : 'Begin Break Time'}
                  </button>
                ) : (
                  <button
                    onClick={pauseFocus}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} shadow-lg`}
                  >
                    <Pause className="w-6 h-6" />
                    Pause Session
                  </button>
                )}
                
                <button
                  onClick={stopFocus}
                  disabled={time === 0}
                  className="px-8 py-4 flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-500/25"
                >
                  <Square className="w-5 h-5" />
                  Stop
                </button>
              </div>

              {time > 0 && !isRunning && (
                <button
                  onClick={resetSession}
                  className={`w-full py-3 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  Reset Session
                </button>
              )}

              {/* Enhanced Music Player */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    className={`flex items-center gap-2 px-4 py-2 ${showMusicPlayer ? 'bg-gradient-to-r from-purple-500 to-pink-600' : isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-white rounded-xl font-medium transition-all duration-200 hover:scale-105`}
                  >
                    <Headphones className="w-4 h-4" />
                    {showMusicPlayer ? 'Hide Ambient Sounds' : 'Show Ambient Sounds'}
                  </button>
                  
                  {showMusicPlayer && (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={previousTrack} 
                        className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-lg transition-all duration-200 hover:scale-110`}
                        title="Previous Track"
                      >
                        <SkipBack className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                      <button 
                        onClick={toggleMusic} 
                        className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl transition-all duration-200 hover:scale-110 shadow-lg"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={nextTrack} 
                        className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-lg transition-all duration-200 hover:scale-110`}
                        title="Next Track"
                      >
                        <SkipForward className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                      <button 
                        onClick={toggleMute} 
                        className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-lg transition-all duration-200 hover:scale-110`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} /> : <Volume2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />}
                      </button>
                    </div>
                  )}
                </div>

                {showMusicPlayer && (
                  <div className={`${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-700/50' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'} rounded-2xl p-6 border backdrop-blur-sm animate-slide-down`}>
                    <div className="text-center mb-4">
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'} mb-1`}>
                        {AMBIENT_TRACKS[currentTrack].title}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        by {AMBIENT_TRACKS[currentTrack].artist} • {AMBIENT_TRACKS[currentTrack].duration}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Volume: {Math.round(volume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className={`w-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg appearance-none cursor-pointer slider-thumb transition-all duration-200`}
                        disabled={isMuted}
                      />
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                        {AMBIENT_TRACKS.map((track, index) => (
                          <button
                            key={track.id}
                            onClick={() => setCurrentTrack(index)}
                            className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 ${
                              currentTrack === index 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' 
                                : isDarkMode 
                                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                                  : 'bg-white/50 text-gray-700 hover:bg-white'
                            }`}
                          >
                            {track.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-2xl p-5 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl w-fit mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-900'} mb-1`}>
                    {getTodaysPomodoros()}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    Today's Sessions
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} rounded-2xl p-5 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl w-fit mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-900'} mb-1`}>
                    {currentStreak}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                    Day Streak
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-900/40 to-green-800/40 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-2xl p-5 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl w-fit mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-900'} mb-1`}>
                    {sessionsCompleted}
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                    Total Completed
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-2xl p-5 text-center border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl w-fit mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-900'} mb-1`}>
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                    Goal Progress
                  </div>
                </div>
              </div>

              {/* Enhanced Daily Goal Setting */}
              <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} rounded-2xl p-6 border shadow-inner`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Daily Study Goal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 4)}
                      className={`w-16 text-center text-sm font-bold py-2 px-3 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
                      min="1"
                      max="12"
                    />
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>sessions</span>
                  </div>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 mb-2 overflow-hidden`}>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {getTodaysPomodoros()} of {dailyGoal} completed
                  </span>
                  <span className={`${getDailyProgress() >= 100 ? 'text-green-500' : isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {getDailyProgress() >= 100 ? '🎉 Goal Achieved!' : `${dailyGoal - getTodaysPomodoros()} to go`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleMinimize}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  <Minimize2 className="w-4 h-4" />
                  Minimize
                </button>
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 px-6 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-gray-50 text-gray-700'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-0 { 
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes float-1 { 
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-25px) rotate(-180deg); opacity: 1; }
        }
        @keyframes float-2 { 
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.9; }
          50% { transform: translateY(-15px) rotate(90deg); opacity: 0.7; }
        }
        @keyframes float-3 { 
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(-90deg); opacity: 0.9; }
        }
        .animate-float-0 { animation: float-0 3s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 2.5s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 3.5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 2.8s ease-in-out infinite; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { 
          from { opacity: 0; transform: scale(0.9); } 
          to { opacity: 1; transform: scale(1); } 
        }
        @keyframes slide-in-right { 
          from { opacity: 0; transform: translateX(100%); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        @keyframes slide-up { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slide-down { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes bounce-in { 
          0% { opacity: 0; transform: scale(0.3) translateY(-100px); }
          50% { opacity: 1; transform: scale(1.05) translateY(0); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-slide-down { animation: slide-down 0.4s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8B5CF6, #EC4899);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </>
  );
};

export default FocusMode;
