import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio, Settings, Star, TrendingUp, Calendar, Eye, Palette, Waves, Move, Shuffle, Heart, Zap, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom' | 'deepFocus' | 'ultraFocus';
type ThemeMode = 'default' | 'forest' | 'ocean' | 'sunset' | 'midnight' | 'aurora' | 'zen';
type AmbientSound = 'none' | 'rain' | 'waves' | 'forest' | 'cafe' | 'fireplace' | 'thunder' | 'birds' | 'wind' | 'stream';

interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
  focusScore: number;
  notes: string;
  distractions: number;
  theme: ThemeMode;
}

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  mood: 'chill' | 'focus' | 'deep' | 'calm' | 'energetic';
  bpm: number;
  genre: string;
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30,
  deepFocus: 50,
  ultraFocus: 90
};

// High-quality Pixabay lofi tracks
const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Lofi Study Beat',
    artist: 'Coma-Media',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: '2:00',
    mood: 'focus',
    bpm: 85,
    genre: 'Lo-Fi Hip Hop'
  },
  {
    id: '2',
    title: 'Chill Abstract',
    artist: 'Lofi_hour',
    url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3',
    duration: '3:32',
    mood: 'chill',
    bpm: 70,
    genre: 'Ambient Lo-Fi'
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: 'SergePavkinMusic',
    url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_65008ce4c7.mp3',
    duration: '2:45',
    mood: 'deep',
    bpm: 75,
    genre: 'Study Beats'
  },
  {
    id: '4',
    title: 'Calm Lofi',
    artist: 'FASSounds',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4621777a42.mp3',
    duration: '2:30',
    mood: 'calm',
    bpm: 65,
    genre: 'Relaxing Lo-Fi'
  },
  {
    id: '5',
    title: 'Study Vibes',
    artist: 'Mikhail_Smusev',
    url: 'https://cdn.pixabay.com/audio/2023/06/20/audio_af1c9c7bcc.mp3',
    duration: '3:15',
    mood: 'focus',
    bpm: 80,
    genre: 'Lo-Fi Beats'
  },
  {
    id: '6',
    title: 'Peaceful Mind',
    artist: 'penguinmusic',
    url: 'https://cdn.pixabay.com/audio/2022/11/27/audio_e2c0ec4c9c.mp3',
    duration: '2:55',
    mood: 'calm',
    bpm: 60,
    genre: 'Meditation Lo-Fi'
  },
  {
    id: '7',
    title: 'Creative Flow',
    artist: 'AlexiAction',
    url: 'https://cdn.pixabay.com/audio/2023/01/15/audio_7c0f0b7e91.mp3',
    duration: '3:40',
    mood: 'energetic',
    bpm: 90,
    genre: 'Upbeat Lo-Fi'
  },
  {
    id: '8',
    title: 'Night Study',
    artist: 'Grand_Project',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    duration: '4:20',
    mood: 'deep',
    bpm: 72,
    genre: 'Dark Lo-Fi'
  }
];

const AMBIENT_SOUNDS = {
  none: { name: 'None', url: '', icon: VolumeX },
  rain: { name: 'Rain', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c610232c18.mp3', icon: Waves },
  waves: { name: 'Ocean Waves', url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_bb630cc098.mp3', icon: Waves },
  forest: { name: 'Forest', url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_28fa6d3379.mp3', icon: Brain },
  cafe: { name: 'Coffee Shop', url: 'https://cdn.pixabay.com/audio/2023/07/25/audio_a5c1d3e8c4.mp3', icon: Coffee },
  fireplace: { name: 'Fireplace', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_d1c4e8f9a2.mp3', icon: Flame },
  thunder: { name: 'Thunder', url: 'https://cdn.pixabay.com/audio/2021/10/12/audio_7b8c9d2e1f.mp3', icon: Zap },
  birds: { name: 'Birds', url: 'https://cdn.pixabay.com/audio/2022/06/18/audio_3f5a8b7c9d.mp3', icon: Heart },
  wind: { name: 'Wind', url: 'https://cdn.pixabay.com/audio/2023/04/08/audio_9e2d1f4a6b.mp3', icon: Wind },
  stream: { name: 'Stream', url: 'https://cdn.pixabay.com/audio/2022/09/30/audio_6c8a5d3e7f.mp3', icon: Waves }
};

const THEMES = {
  default: {
    name: 'Default',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-blue-50 to-purple-50',
    accent: 'blue-600',
    background: 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
  },
  forest: {
    name: 'Forest',
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-green-50 to-emerald-50',
    accent: 'green-600',
    background: 'bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50'
  },
  ocean: {
    name: 'Ocean',
    primary: 'from-cyan-600 to-blue-600',
    secondary: 'from-cyan-50 to-blue-50',
    accent: 'cyan-600',
    background: 'bg-gradient-to-br from-cyan-50 via-blue-25 to-indigo-50'
  },
  sunset: {
    name: 'Sunset',
    primary: 'from-orange-600 to-red-600',
    secondary: 'from-orange-50 to-red-50',
    accent: 'orange-600',
    background: 'bg-gradient-to-br from-orange-50 via-red-25 to-pink-50'
  },
  midnight: {
    name: 'Midnight',
    primary: 'from-indigo-600 to-purple-600',
    secondary: 'from-indigo-50 to-purple-50',
    accent: 'indigo-600',
    background: 'bg-gradient-to-br from-indigo-50 via-purple-25 to-blue-50'
  },
  aurora: {
    name: 'Aurora',
    primary: 'from-pink-600 to-violet-600',
    secondary: 'from-pink-50 to-violet-50',
    accent: 'pink-600',
    background: 'bg-gradient-to-br from-pink-50 via-violet-25 to-purple-50'
  },
  zen: {
    name: 'Zen',
    primary: 'from-gray-600 to-slate-600',
    secondary: 'from-gray-50 to-slate-50',
    accent: 'gray-600',
    background: 'bg-gradient-to-br from-gray-50 via-slate-25 to-zinc-50'
  }
};

const STUDY_TIPS = [
  "Take deep breaths and stay hydrated! 💧",
  "Review what you've learned before starting new material 📚",
  "Great progress! You're building strong study habits 🌟",
  "Take a moment to stretch and rest your eyes 👀",
  "You're doing amazing! Keep up the momentum 🚀",
  "Break complex topics into smaller, manageable chunks 🧩",
  "Use active recall - test yourself without looking at notes 🧠",
  "The Feynman Technique: Explain concepts in simple terms 💡",
  "Spaced repetition helps move information to long-term memory 📈",
  "Create mind maps to visualize connections between ideas 🗺️"
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a short walk to refresh your mind",
  "💧 Drink some water and have a healthy snack",
  "👀 Look away from your screen and rest your eyes",
  "🧘‍♀️ Do some light stretching or breathing exercises",
  "🎵 Listen to your favorite song to recharge",
  "🌱 Step outside for some fresh air and sunlight",
  "📱 Check in with a friend or family member",
  "🎨 Do a quick creative activity like doodling",
  "🧠 Practice a few minutes of mindfulness meditation",
  "☕ Make yourself a warm, comforting beverage"
];

const MOTIVATIONAL_QUOTES = [
  "The expert in anything was once a beginner. - Helen Hayes",
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Learning never exhausts the mind. - Leonardo da Vinci",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Study while others are sleeping; work while others are loafing. - William A. Ward"
];

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodoroSettings, setPomodoroSettings] = useState(DEFAULT_POMODORO_SETTINGS);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([]);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('default');
  const [focusScore, setFocusScore] = useState(100);
  const [distractions, setDistractions] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [playedTracks, setPlayedTracks] = useState<number[]>([]);

  // Ambient sound state
  const [currentAmbientSound, setCurrentAmbientSound] = useState<AmbientSound>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);

  // Floating timer state
  const [floatingPosition, setFloatingPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const targetTime = pomodoroSettings[mode];
  const theme = THEMES[currentTheme];

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('advancedFocusTimer');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSessionsCompleted(data.sessionsCompleted || 0);
      setCurrentStreak(data.currentStreak || 0);
      setLongestStreak(data.longestStreak || 0);
      setDailyGoal(data.dailyGoal || 4);
      setStudyHistory(data.studyHistory || []);
      setPomodoroCount(data.pomodoroCount || 0);
      setVolume(data.musicVolume || 0.6);
      setAmbientVolume(data.ambientVolume || 0.3);
      setShowMusicPlayer(data.showMusicPlayer || false);
      setPomodoroSettings(data.pomodoroSettings || DEFAULT_POMODORO_SETTINGS);
      setCurrentTheme(data.currentTheme || 'default');
      setFloatingPosition(data.floatingPosition || { x: 20, y: 20 });
      setCurrentAmbientSound(data.currentAmbientSound || 'none');
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = true;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isAmbientMuted ? 0 : ambientVolume;
      ambientAudioRef.current.loop = true;
    }
  }, [volume, isMuted, ambientVolume, isAmbientMuted]);

  // Save data to localStorage
  const saveData = () => {
    const data = {
      sessionsCompleted,
      currentStreak,
      longestStreak,
      dailyGoal,
      studyHistory,
      pomodoroCount,
      musicVolume: volume,
      ambientVolume,
      showMusicPlayer,
      pomodoroSettings,
      currentTheme,
      floatingPosition,
      currentAmbientSound
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
    const finalFocusScore = Math.max(0, focusScore - (distractions * 5));
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: currentSubject,
      task: currentTask,
      duration: targetTime,
      completedAt: new Date(),
      mode,
      focusScore: finalFocusScore,
      notes: sessionNotes,
      distractions,
      theme: currentTheme
    };

    if (mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
      
      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      const quoteIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus Session Complete!', {
          body: `Focus Score: ${finalFocusScore}% • ${MOTIVATIONAL_QUOTES[quoteIndex]}`,
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
        new Notification('⏰ Break Time Over!', {
          body: 'Time to get back to studying! You\'ve got this! 💪',
          icon: '/vite.svg'
        });
      }
      setMode('focus');
    }

    setStudyHistory(prev => [...prev, newSession]);
    setTime(0);
    setFocusScore(100);
    setDistractions(0);
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
    let nextIndex;
    if (isShuffleOn) {
      const availableTracks = LOFI_TRACKS.map((_, index) => index).filter(index => !playedTracks.includes(index));
      if (availableTracks.length === 0) {
        setPlayedTracks([]);
        nextIndex = Math.floor(Math.random() * LOFI_TRACKS.length);
      } else {
        nextIndex = availableTracks[Math.floor(Math.random() * availableTracks.length)];
      }
      setPlayedTracks(prev => [...prev, nextIndex]);
    } else {
      nextIndex = (currentTrack + 1) % LOFI_TRACKS.length;
    }
    
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

  // Ambient sound functions
  const toggleAmbientSound = (sound: AmbientSound) => {
    if (currentAmbientSound === sound) {
      setCurrentAmbientSound('none');
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
    } else {
      setCurrentAmbientSound(sound);
      if (ambientAudioRef.current && sound !== 'none') {
        ambientAudioRef.current.play().catch(console.error);
      }
    }
  };

  const handleAmbientVolumeChange = (newVolume: number) => {
    setAmbientVolume(newVolume);
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isAmbientMuted ? 0 : newVolume;
    }
  };

  // Floating timer drag functions
  const handleMouseDown = (e: React.MouseEvent) => {
    if (floatingRef.current) {
      setIsDragging(true);
      const rect = floatingRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
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
    saveData();
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
    setFocusScore(100);
    setDistractions(0);
  };

  const pauseFocus = () => {
    setIsRunning(false);
  };

  const stopFocus = () => {
    setIsRunning(false);
    setTime(0);
    setFocusScore(100);
    setDistractions(0);
  };

  const resetSession = () => {
    setTime(0);
    setIsRunning(false);
    setFocusScore(100);
    setDistractions(0);
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
    if (minutes > 0 && minutes <= 300) { // Max 5 hours
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

  const addDistraction = () => {
    setDistractions(prev => prev + 1);
    setFocusScore(prev => Math.max(0, prev - 5));
  };

  const getTodaysPomodoros = () => {
    const today = new Date().toDateString();
    return studyHistory.filter(session =>
      (session.mode === 'focus' || session.mode === 'custom' || session.mode === 'deepFocus' || session.mode === 'ultraFocus') &&
      new Date(session.completedAt).toDateString() === today
    ).length;
  };

  const getDailyProgress = () => {
    return Math.min((getTodaysPomodoros() / dailyGoal) * 100, 100);
  };

  const getAverageFocusScore = () => {
    if (studyHistory.length === 0) return 0;
    const totalScore = studyHistory.reduce((sum, session) => sum + session.focusScore, 0);
    return Math.round(totalScore / studyHistory.length);
  };

  const getRandomTip = () => {
    if (mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') {
      return STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    }
    return BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)];
  };

  const getRandomQuote = () => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  };

  // Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div
        ref={floatingRef}
        className="fixed z-50 select-none"
        style={{ left: floatingPosition.x, top: floatingPosition.y }}
      >
        <div className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-4 min-w-[280px] transition-all duration-300 hover:shadow-3xl ${isDragging ? 'scale-105 rotate-1' : ''}`}>
          <div 
            className="flex items-center justify-between mb-3 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
                {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') ? (
                  <Target className="w-5 h-5 text-white" />
                ) : (
                  <Coffee className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {mode === 'focus' ? 'Focus' : 
                   mode === 'custom' ? 'Custom' :
                   mode === 'deepFocus' ? 'Deep Focus' :
                   mode === 'ultraFocus' ? 'Ultra Focus' :
                   mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentSubject && `${currentSubject}`}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Move className="w-4 h-4 text-gray-400" />
              <button
                onClick={handleMaximize}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Maximize"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Stop Timer"
              >
                <Square className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-3">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(time)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 bg-gradient-to-r ${theme.primary} shadow-sm`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 font-medium ${isRunning ? `text-${theme.accent}` : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? `bg-${theme.accent} animate-pulse` : 'bg-gray-400'}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{focusScore}%</span>
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
        src={LOFI_TRACKS[currentTrack].url}
        preload="metadata"
      />
      <audio
        ref={ambientAudioRef}
        src={currentAmbientSound !== 'none' ? AMBIENT_SOUNDS[currentAmbientSound].url : ''}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className={`fixed inset-0 ${theme.background} flex items-center justify-center z-50 p-4 overflow-y-auto`}>
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border-white/20">
            <div className="p-8 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${theme.primary} shadow-xl`}>
                    {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') ? (
                      <Brain className="w-8 h-8 text-white" />
                    ) : (
                      <Coffee className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {mode === 'focus' ? 'Focus Time' : 
                       mode === 'custom' ? 'Custom Timer' :
                       mode === 'deepFocus' ? 'Deep Focus' :
                       mode === 'ultraFocus' ? 'Ultra Focus' :
                       mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') ? 
                        'Time to concentrate and achieve your goals!' : 
                        'Take a well-deserved break and recharge!'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowInsights(!showInsights)}
                    icon={TrendingUp}
                    variant="ghost"
                    size="sm"
                    className={`${theme.accent} hover:text-${theme.accent}`}
                  />
                  <Button
                    onClick={handleMinimize}
                    icon={Minimize2}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  />
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <Palette className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme:</span>
                <div className="flex gap-2">
                  {Object.entries(THEMES).map(([key, themeData]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentTheme(key as ThemeMode)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                        currentTheme === key
                          ? `bg-gradient-to-r ${themeData.primary} text-white shadow-lg`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {themeData.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {(['focus', 'shortBreak', 'longBreak', 'deepFocus', 'ultraFocus', 'custom'] as TimerMode[]).map((timerMode) => (
                    <button
                      key={timerMode}
                      onClick={() => switchMode(timerMode)}
                      disabled={isRunning}
                      className={`py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                        mode === timerMode
                          ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg transform scale-105`
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {timerMode === 'focus' ? `Focus (${pomodoroSettings.focus}m)` : 
                       timerMode === 'shortBreak' ? `Break (${pomodoroSettings.shortBreak}m)` : 
                       timerMode === 'longBreak' ? `Long (${pomodoroSettings.longBreak}m)` :
                       timerMode === 'deepFocus' ? `Deep (${pomodoroSettings.deepFocus}m)` :
                       timerMode === 'ultraFocus' ? `Ultra (${pomodoroSettings.ultraFocus}m)` :
                       `Custom (${pomodoroSettings.custom}m)`}
                    </button>
                  ))}
                </div>

                {/* Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className={`bg-gradient-to-r ${theme.secondary} dark:bg-gray-800/50 rounded-xl p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className={`w-6 h-6 text-${theme.accent}`} />
                      <span className={`font-bold text-${theme.accent} text-lg`}>
                        Custom Timer Settings
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Custom Duration (minutes)
                        </label>
                        <Input
                          type="number"
                          value={pomodoroSettings.custom.toString()}
                          onChange={(value) => handleCustomTimerChange(parseInt(value) || 30)}
                          min="1"
                          max="300"
                          disabled={isRunning}
                          className="text-center text-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Quick Presets
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[15, 30, 45, 60, 90, 120, 180, 240].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className={`px-3 py-2 text-sm bg-gradient-to-r ${theme.primary} text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all`}
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
              {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />
                  </div>
                </div>
              )}

              {/* Timer Display */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 192 192">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - getProgress() / 100)}`}
                      className="transition-all duration-1000 drop-shadow-lg"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className={`text-${theme.accent}`} stopColor="currentColor" />
                        <stop offset="100%" className={`text-purple-600`} stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {formatTime(Math.max(0, targetTime * 60 - time))} left
                      </div>
                      {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') && (
                        <div className="flex items-center justify-center gap-2 text-xs">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-600 font-medium">{focusScore}% Focus</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Motivation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className={`w-5 h-5 ${isRunning ? `text-${theme.accent}` : 'text-gray-400'}`} />
                    <span className={`text-lg font-medium ${isRunning ? `text-${theme.accent}` : 'text-gray-500'}`}>
                      {isRunning ? 'Keep Going! You\'re Doing Amazing!' : 'Ready When You Are'}
                    </span>
                  </div>
                  
                  {(mode === 'shortBreak' || mode === 'longBreak') && (
                    <div className={`bg-gradient-to-r ${theme.secondary} dark:bg-gray-800/50 rounded-xl p-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Lightbulb className={`w-5 h-5 text-${theme.accent}`} />
                        <span className={`font-bold text-${theme.accent}`}>
                          Break Suggestion
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {getRandomTip()}
                      </p>
                    </div>
                  )}

                  {!isRunning && time === 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:bg-yellow-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-yellow-800 dark:text-yellow-400">
                          Daily Motivation
                        </span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300 italic">
                        "{getRandomQuote()}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Focus Score & Distractions */}
              {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') && isRunning && (
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{focusScore}%</div>
                    <div className="text-xs text-gray-500">Focus Score</div>
                  </div>
                  <button
                    onClick={addDistraction}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm"
                  >
                    + Distraction ({distractions})
                  </button>
                </div>
              )}

              {/* Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    className={`flex-1 bg-gradient-to-r ${theme.primary} hover:shadow-xl transform hover:scale-105 transition-all text-lg py-4`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') ? 'Start Focus Session' : 'Start Break'}
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
                  className="w-full text-lg py-4"
                >
                  Reset Session
                </Button>
              )}

              {/* Music Player */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    icon={Music}
                    variant="ghost"
                    className={`text-purple-600 hover:text-purple-700`}
                  >
                    {showMusicPlayer ? 'Hide Music Player' : 'Show Music Player'}
                  </Button>
                  
                  {showMusicPlayer && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsShuffleOn(!isShuffleOn)}
                        className={`p-2 rounded-lg transition-colors ${isShuffleOn ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'}`}
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>
                      <button onClick={previousTrack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <SkipBack className="w-5 h-5 text-gray-600" />
                      </button>
                      <button onClick={toggleMusic} className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button onClick={nextTrack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <SkipForward className="w-5 h-5 text-gray-600" />
                      </button>
                      <button onClick={toggleMute} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                </div>

                {showMusicPlayer && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-purple-800 dark:text-purple-300">
                        {LOFI_TRACKS[currentTrack].title}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                        {LOFI_TRACKS[currentTrack].artist} • {LOFI_TRACKS[currentTrack].genre}
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-purple-500">
                        <span>Mood: {LOFI_TRACKS[currentTrack].mood}</span>
                        <span>•</span>
                        <span>{LOFI_TRACKS[currentTrack].bpm} BPM</span>
                        <span>•</span>
                        <span>{LOFI_TRACKS[currentTrack].duration}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                          Music Volume
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-full h-2 bg-purple-200 dark:bg-purple-700 rounded-lg appearance-none cursor-pointer"
                          disabled={isMuted}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ambient Sounds */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Ambient Sounds
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(AMBIENT_SOUNDS).map(([key, sound]) => {
                    const IconComponent = sound.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => toggleAmbientSound(key as AmbientSound)}
                        className={`p-3 rounded-xl transition-all ${
                          currentAmbientSound === key
                            ? `bg-gradient-to-r ${theme.primary} text-white shadow-lg`
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-xs font-medium">{sound.name}</div>
                      </button>
                    );
                  })}
                </div>
                
                {currentAmbientSound !== 'none' && (
                  <div className={`bg-gradient-to-r ${theme.secondary} dark:bg-gray-800/50 rounded-xl p-4`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ambient Volume
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isAmbientMuted ? 0 : ambientVolume}
                      onChange={(e) => handleAmbientVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      disabled={isAmbientMuted}
                    />
                  </div>
                )}
              </div>

              {/* Session Notes */}
              {(mode === 'focus' || mode === 'custom' || mode === 'deepFocus' || mode === 'ultraFocus') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    📝 Session Notes (Optional)
                  </label>
                  <textarea
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="What did you learn? Any insights or challenges?"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows={3}
                    disabled={isRunning}
                  />
                </div>
              )}

              {/* Advanced Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`bg-gradient-to-r ${theme.secondary} dark:bg-blue-900/20 rounded-xl p-4 text-center`}>
                  <Target className={`w-6 h-6 text-${theme.accent} mx-auto mb-2`} />
                  <div className={`text-2xl font-bold text-${theme.accent}`}>
                    {getTodaysPomodoros()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Today
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
                  <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-400">
                    {currentStreak}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    Current
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-400">
                    {sessionsCompleted}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Total
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">
                    {getAverageFocusScore()}%
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">
                    Avg Focus
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
                    {longestStreak}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    Best Streak
                  </div>
                </div>
              </div>

              {/* Daily Goal Progress */}
              <div className={`bg-gradient-to-r ${theme.secondary} dark:bg-gray-800/50 rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    Daily Study Goal
                  </span>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(parseInt(value) || 4)}
                      className="w-20 text-center"
                      min="1"
                      max="20"
                    />
                    <span className="text-sm text-gray-500">sessions</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className={`bg-gradient-to-r ${theme.primary} h-4 rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {getTodaysPomodoros()} of {dailyGoal} sessions completed ({Math.round(getDailyProgress())}%)
                </div>
              </div>

              {/* Session Insights */}
              {showInsights && studyHistory.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Session Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(studyHistory.reduce((sum, s) => sum + s.duration, 0) / 60)}h
                      </div>
                      <div className="text-sm text-gray-600">Total Study Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {studyHistory.filter(s => s.focusScore >= 80).length}
                      </div>
                      <div className="text-sm text-gray-600">High Focus Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {new Set(studyHistory.map(s => s.subject)).size}
                      </div>
                      <div className="text-sm text-gray-600">Subjects Studied</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleMinimize}
                  variant="secondary"
                  className="flex-1 text-lg py-4"
                  icon={Minimize2}
                >
                  Minimize
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1 text-lg py-4"
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
