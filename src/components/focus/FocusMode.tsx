import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, 
  BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, 
  VolumeX, SkipForward, SkipBack, Settings, Moon, Sun, Award, 
  TrendingUp, Calendar, Zap, Star, Wind, Waves, TreePine, CloudRain 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';
type SoundType = 'lofi' | 'nature' | 'white-noise' | 'off';

interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
  efficiency: number;
}

interface SoundTrack {
  id: string;
  title: string;
  artist: string;
  type: SoundType;
  icon: React.ReactNode;
  url: string;
  duration: string;
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30
};

const SOUND_TRACKS: SoundTrack[] = [
  {
    id: '1',
    title: 'Chill Lofi Study',
    artist: 'Focus Beats',
    type: 'lofi',
    icon: <Music className="w-4 h-4" />,
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Forest Rain',
    artist: 'Nature Sounds',
    type: 'nature',
    icon: <CloudRain className="w-4 h-4" />,
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4deafeaece.mp3',
    duration: '4:15'
  },
  {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Natural Vibes',
    type: 'nature',
    icon: <Waves className="w-4 h-4" />,
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3',
    duration: '3:45'
  },
  {
    id: '4',
    title: 'White Noise',
    artist: 'Focus Helper',
    type: 'white-noise',
    icon: <Wind className="w-4 h-4" />,
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d57e5a452e.mp3',
    duration: '5:00'
  }
];

const STUDY_TIPS = [
  "🧠 Take deep breaths and stay hydrated! Your brain needs oxygen and water to function optimally.",
  "📚 Review what you've learned before starting new material - this strengthens neural pathways.",
  "🌟 Great progress! You're building strong study habits that will serve you for life.",
  "👀 Remember to blink often and rest your eyes every 20 minutes by looking 20 feet away.",
  "🚀 You're doing amazing! Consistency is the key to mastering any subject.",
  "⚡ Try the Feynman Technique: explain what you're learning in simple terms.",
  "🎯 Break complex topics into smaller, manageable chunks for better understanding.",
  "🧘‍♀️ A clear mind absorbs information better - consider a quick meditation before studying."
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a short walk to get your blood flowing and refresh your mind",
  "💧 Drink some water and have a healthy snack to refuel your body",
  "👀 Practice the 20-20-20 rule: look at something 20 feet away for 20 seconds",
  "🧘‍♀️ Do some light stretching or breathing exercises to release tension",
  "🎵 Listen to your favorite upbeat song to recharge your energy",
  "🌿 Step outside for fresh air if possible - nature boosts cognitive function",
  "💪 Do a few jumping jacks or push-ups to increase alertness",
  "😊 Chat with a friend or family member for social connection"
];

const FOCUS_TECHNIQUES = [
  { name: 'Pomodoro', focus: 25, break: 5, description: 'Classic 25-minute focus sessions' },
  { name: 'Ultradian', focus: 90, break: 20, description: 'Natural 90-minute attention cycles' },
  { name: 'Timeboxing', focus: 45, break: 15, description: 'Structured 45-minute work blocks' },
  { name: 'Flowtime', focus: 30, break: 5, description: 'Flexible timing based on flow state' }
];

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const [selectedTechnique, setSelectedTechnique] = useState(0);
  
  // Enhanced Music & Sound State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>('lofi');
  
  // Analytics State
  const [weeklyStats, setWeeklyStats] = useState({ completed: 0, totalTime: 0 });
  const [efficiency, setEfficiency] = useState(85);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const targetTime = pomodoroSettings[mode];

  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('studyflow-theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studyFlowFocusData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSessionsCompleted(data.sessionsCompleted || 0);
        setCurrentStreak(data.currentStreak || 0);
        setDailyGoal(data.dailyGoal || 4);
        setStudyHistory(data.studyHistory || []);
        setPomodoroCount(data.pomodoroCount || 0);
        setVolume(data.musicVolume || 0.6);
        setShowMusicPlayer(data.showMusicPlayer || false);
        setPomodoroSettings(data.pomodoroSettings || DEFAULT_POMODORO_SETTINGS);
        setSoundType(data.soundType || 'lofi');
        setSelectedTechnique(data.selectedTechnique || 0);
        setEfficiency(data.efficiency || 85);
        setWeeklyStats(data.weeklyStats || { completed: 0, totalTime: 0 });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = true;
    }
  }, [volume, isMuted, currentTrack]);

  // Apply technique settings
  useEffect(() => {
    const technique = FOCUS_TECHNIQUES[selectedTechnique];
    if (technique) {
      setPomodoroSettings(prev => ({
        ...prev,
        focus: technique.focus,
        shortBreak: technique.break
      }));
    }
  }, [selectedTechnique]);

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
      soundType,
      selectedTechnique,
      efficiency,
      weeklyStats
    };
    localStorage.setItem('studyFlowFocusData', JSON.stringify(data));
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

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('studyflow-theme', newTheme ? 'dark' : 'light');
  };

  const handleSessionComplete = () => {
    const sessionEfficiency = Math.min(100, efficiency + Math.random() * 10 - 5);
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: currentSubject,
      task: currentTask,
      duration: targetTime,
      completedAt: new Date(),
      mode,
      efficiency: Math.round(sessionEfficiency)
    };

    if (mode === 'focus' || mode === 'custom') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      setEfficiency(sessionEfficiency);
      
      // Update weekly stats
      setWeeklyStats(prev => ({
        completed: prev.completed + 1,
        totalTime: prev.totalTime + targetTime
      }));
      
      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus Session Complete!', {
          body: `Excellent work! ${STUDY_TIPS[tipIndex]}`,
          icon: '/vite.svg'
        });
      }

      // Smart mode switching based on completed sessions
      if (mode === 'focus' && newCount % 4 === 0) {
        setMode('longBreak');
      } else if (mode === 'focus') {
        setMode('shortBreak');
      }
    } else {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Break Time Over!', {
          body: 'Ready to dive back into focused learning! 💪',
          icon: '/vite.svg'
        });
      }
      setMode('focus');
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    saveData();
  };

  // Enhanced Music Functions
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
    const availableTracks = SOUND_TRACKS.filter(track => soundType === 'off' || track.type === soundType);
    const currentIndex = availableTracks.findIndex(track => track.id === SOUND_TRACKS[currentTrack].id);
    const nextIndex = (currentIndex + 1) % availableTracks.length;
    const newTrackIndex = SOUND_TRACKS.findIndex(track => track.id === availableTracks[nextIndex].id);
    setCurrentTrack(newTrackIndex);
    
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 100);
    }
  };

  const previousTrack = () => {
    const availableTracks = SOUND_TRACKS.filter(track => soundType === 'off' || track.type === soundType);
    const currentIndex = availableTracks.findIndex(track => track.id === SOUND_TRACKS[currentTrack].id);
    const prevIndex = currentIndex === 0 ? availableTracks.length - 1 : currentIndex - 1;
    const newTrackIndex = SOUND_TRACKS.findIndex(track => track.id === availableTracks[prevIndex].id);
    setCurrentTrack(newTrackIndex);
    
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play().catch(console.error), 100);
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

  const getWeeklyEfficiency = () => {
    const recentSessions = studyHistory.slice(-10);
    if (recentSessions.length === 0) return efficiency;
    return Math.round(recentSessions.reduce((sum, session) => sum + session.efficiency, 0) / recentSessions.length);
  };

  // Enhanced Floating Timer
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-pulse">
        <Card className="p-4 min-w-[280px] shadow-2xl border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${(mode === 'focus' || mode === 'custom') ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Brain className="w-5 h-5 text-white" />
                ) : (
                  <Coffee className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {mode === 'focus' ? 'Focus Session' : 
                   mode === 'custom' ? 'Custom Timer' :
                   mode === 'shortBreak' ? 'Quick Break' : 'Long Break'}
                </span>
                {currentSubject && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">{currentSubject}</p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
          </div>

          <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                (mode === 'focus' || mode === 'custom') 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className={`text-xs font-medium flex items-center gap-1 ${
              isRunning ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-orange-500'}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Flame className="w-3 h-3" />
                <span className="text-xs font-bold">{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Target className="w-3 h-3" />
                <span className="text-xs font-bold">{getTodaysPomodoros()}/{dailyGoal}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (!isOpen && !isMinimized) return null;

  return (
    <>
      <FloatingTimer />
      
      {/* Enhanced Audio Element */}
      <audio
        ref={audioRef}
        src={SOUND_TRACKS[currentTrack]?.url}
        preload="metadata"
        onEnded={nextTrack}
      />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-8 space-y-8">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl shadow-lg ${
                    (mode === 'focus' || mode === 'custom') 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-8 h-8 text-white" />
                    ) : (
                      <Coffee className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {mode === 'focus' ? 'Deep Focus Mode' : 
                       mode === 'custom' ? 'Custom Study Session' :
                       mode === 'shortBreak' ? 'Energizing Break' : 'Restorative Break'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {(mode === 'focus' || mode === 'custom') ? 'Channel your focus and achieve deep learning' : 'Recharge your mind for the next session'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic mt-1">
                      Created by Vinay Kumar
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleTheme}
                    icon={isDarkMode ? Sun : Moon}
                    variant="ghost"
                    size="sm"
                  />
                  <Button
                    onClick={() => setIsMinimized(true)}
                    icon={Minimize2}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>

              {/* Focus Technique Selector */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Focus Technique
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FOCUS_TECHNIQUES.map((technique, index) => (
                    <button
                      key={technique.name}
                      onClick={() => setSelectedTechnique(index)}
                      disabled={isRunning}
                      className={`p-4 rounded-xl text-left transition-all duration-200 ${
                        selectedTechnique === index
                          ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500 scale-105'
                          : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{technique.name}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">{technique.focus}m focus</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{technique.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                {(['focus', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((timerMode) => (
                  <button
                    key={timerMode}
                    onClick={() => switchMode(timerMode)}
                    disabled={isRunning}
                    className={`flex-1 py-4 px-4 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      mode === timerMode
                        ? (timerMode === 'focus' || timerMode === 'custom')
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="text-center">
                      <div>{timerMode === 'focus' ? 'Focus' : 
                             timerMode === 'shortBreak' ? 'Short Break' : 
                             timerMode === 'longBreak' ? 'Long Break' : 'Custom'}</div>
                      <div className="text-xs opacity-75">
                        {pomodoroSettings[timerMode]}m
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Timer Settings */}
              {(showCustomTimer || mode === 'custom') && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    Custom Timer Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        value={pomodoroSettings.custom.toString()}
                        onChange={(value) => handleCustomTimerChange(parseInt(value) || 30)}
                        min="1"
                        max="180"
                        disabled={isRunning}
                        className="text-center font-mono text-lg"
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
                            className="px-3 py-2 text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
                          >
                            {preset}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Study Input Fields */}
              {(mode === 'focus' || mode === 'custom') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Study Subject
                    </label>
                    <Input
                      type="text"
                      value={currentSubject}
                      onChange={setCurrentSubject}
                      placeholder="e.g., Mathematics, Physics, History..."
                      disabled={isRunning}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      Focus Task
                    </label>
                    <Input
                      type="text"
                      value={currentTask}
                      onChange={setCurrentTask}
                      placeholder="e.g., Chapter 5 problems, Essay writing..."
                      disabled={isRunning}
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center">
                <div className="relative w-56 h-56 mx-auto mb-8">
                  <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 224 224">
                    <circle
                      cx="112"
                      cy="112"
                      r="95"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="95"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 95}`}
                      strokeDashoffset={`${2 * Math.PI * 95 * (1 - getProgress() / 100)}`}
                      className="transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={mode === 'focus' || mode === 'custom' ? '#3B82F6' : '#10B981'} />
                      <stop offset="100%" stopColor={mode === 'focus' || mode === 'custom' ? '#8B5CF6' : '#059669'} />
                    </linearGradient>
                  </defs>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {formatTime(time)}
                      </div>
                      <div className="text-lg text-gray-500 dark:text-gray-400 mb-1">
                        {formatTime(Math.max(0, targetTime * 60 - time))} left
                      </div>
                      <div className="text-sm text-gray-400">
                        {Math.round(getProgress())}% complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Display */}
                <div className="space-y-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    isRunning 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="font-medium">
                      {isRunning ? '🧠 Deep Focus Active - You\'re in the Zone!' : '⏸️ Ready to Resume - Take Your Time'}
                    </span>
                  </div>
                  
                  {/* Motivational Message */}
                  <div className={`p-4 rounded-xl ${
                    mode === 'focus' || mode === 'custom' 
                      ? 'bg-blue-50 dark:bg-blue-900/20' 
                      : 'bg-green-50 dark:bg-green-900/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {mode === 'focus' || mode === 'custom' ? '💡 Study Tip' : '🌟 Break Suggestion'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {getRandomTip()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    size="lg"
                    className={`flex-1 text-lg py-4 ${
                      (mode === 'focus' || mode === 'custom')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg'
                    }`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom') ? 'Start Deep Focus' : 'Start Break'}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseFocus}
                    icon={Pause}
                    size="lg"
                    variant="secondary"
                    className="flex-1 text-lg py-4"
                  >
                    Pause Session
                  </Button>
                )}
                
                <Button
                  onClick={stopFocus}
                  icon={Square}
                  size="lg"
                  variant="danger"
                  disabled={time === 0}
                  className="px-8 py-4"
                >
                  Stop
                </Button>
              </div>

              {time > 0 && !isRunning && (
                <Button
                  onClick={() => setTime(0)}
                  variant="secondary"
                  className="w-full py-3"
                  icon={Clock}
                >
                  Reset Session
                </Button>
              )}

              {/* Enhanced Sound & Music Player */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-600" />
                    Ambient Sounds
                  </h3>
                  <Button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    variant="ghost"
                    size="sm"
                    className="text-purple-600"
                  >
                    {showMusicPlayer ? 'Hide Player' : 'Show Player'}
                  </Button>
                </div>

                {/* Sound Type Selector */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {['lofi', 'nature', 'white-noise', 'off'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSoundType(type as SoundType)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        soundType === type
                          ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 ring-2 ring-purple-400'
                          : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <div className="flex justify-center mb-1">
                        {type === 'lofi' && <Music className="w-5 h-5" />}
                        {type === 'nature' && <TreePine className="w-5 h-5" />}
                        {type === 'white-noise' && <Wind className="w-5 h-5" />}
                        {type === 'off' && <VolumeX className="w-5 h-5" />}
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {type === 'white-noise' ? 'White Noise' : type}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Music Player Controls */}
                {showMusicPlayer && soundType !== 'off' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {SOUND_TRACKS[currentTrack]?.title || 'No Track Selected'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {SOUND_TRACKS[currentTrack]?.artist} • {SOUND_TRACKS[currentTrack]?.duration}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={previousTrack} 
                        className="p-3 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full transition-colors"
                      >
                        <SkipBack className="w-5 h-5 text-purple-600" />
                      </button>
                      <button 
                        onClick={toggleMusic} 
                        className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200 transform hover:scale-110"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button 
                        onClick={nextTrack} 
                        className="p-3 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full transition-colors"
                      >
                        <SkipForward className="w-5 h-5 text-purple-600" />
                      </button>
                      <button 
                        onClick={toggleMute} 
                        className="p-3 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-purple-600" /> : <Volume2 className="w-5 h-5 text-purple-600" />}
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-3">
                      <VolumeX className="w-4 h-4 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        disabled={isMuted}
                      />
                      <Volume2 className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-4 text-center border border-blue-200 dark:border-blue-800/50">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-400">
                    {getTodaysPomodoros()}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    Today's Sessions
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-4 text-center border border-orange-200 dark:border-orange-800/50">
                  <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-400">
                    {currentStreak}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                    Day Streak
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 text-center border border-green-200 dark:border-green-800/50">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-900 dark:text-green-400">
                    {sessionsCompleted}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Total Complete
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-4 text-center border border-purple-200 dark:border-purple-800/50">
                  <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-400">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                    Daily Goal
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-4 text-center border border-indigo-200 dark:border-indigo-800/50">
                  <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">
                    {getWeeklyEfficiency()}%
                  </div>
                  <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                    Efficiency
                  </div>
                </div>
              </div>

              {/* Daily Goal Progress */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Daily Study Goal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Target:</label>
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(Math.max(1, Math.min(12, parseInt(value) || 4)))}
                      className="w-16 text-center text-sm"
                      min="1"
                      max="12"
                    />
                    <span className="text-sm text-gray-500">sessions</span>
                  </div>
                </div>
                
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(getDailyProgress(), 100)}%` }}
                  >
                    {getDailyProgress() > 20 && (
                      <span className="text-xs font-bold text-white">
                        {getTodaysPomodoros()}/{dailyGoal}
                      </span>
                    )}
                  </div>
                </div>
                
                {getDailyProgress() >= 100 && (
                  <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">🎉 Daily goal achieved! Excellent work!</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
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
                  Close Focus Mode
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
