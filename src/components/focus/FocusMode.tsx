import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio, Settings, Sparkles, Waves, Wind, CloudRain } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';

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
  type: 'lofi' | 'nature' | 'ambient';
  color: string;
}

interface AudioState {
  currentTime: number;
  duration: number;
  isLoaded: boolean;
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30
};

// Enhanced music collection with nature sounds and ambient tracks
const FOCUS_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Deep Focus Flow',
    artist: 'Study Beats',
    url: 'focus-track-1',
    duration: '3:24',
    type: 'lofi',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '2',
    title: 'Peaceful Concentration',
    artist: 'Mindful Music',
    url: 'focus-track-2', 
    duration: '4:15',
    type: 'lofi',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    title: 'Study Session Vibes',
    artist: 'Academic Ambience',
    url: 'focus-track-3',
    duration: '3:45',
    type: 'lofi',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: '4',
    title: 'Forest Rain',
    artist: 'Nature Sounds',
    url: 'nature-rain',
    duration: '5:00',
    type: 'nature',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: '5',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    url: 'nature-ocean',
    duration: '4:30',
    type: 'nature',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: '6',
    title: 'Mountain Breeze',
    artist: 'Nature Sounds',
    url: 'nature-wind',
    duration: '3:50',
    type: 'nature',
    color: 'from-gray-500 to-slate-600'
  },
  {
    id: '7',
    title: 'Cosmic Meditation',
    artist: 'Ambient Space',
    url: 'ambient-space',
    duration: '6:20',
    type: 'ambient',
    color: 'from-violet-600 to-purple-700'
  },
  {
    id: '8',
    title: 'Dawn Harmony',
    artist: 'Ambient Dawn',
    url: 'ambient-dawn',
    duration: '4:45',
    type: 'ambient',
    color: 'from-orange-500 to-red-500'
  }
];

const STUDY_TIPS = [
  "🌊 Take deep breaths and stay hydrated! Your brain needs oxygen and water to function optimally.",
  "📚 Review what you've learned before starting new material to strengthen neural connections.",
  "⭐ Great progress! You're building strong study habits that will serve you for life.",
  "👁️ Take a moment to stretch and rest your eyes to prevent strain and fatigue.",
  "🚀 You're doing amazing! Each session builds momentum toward your goals.",
  "🧠 Break complex topics into smaller chunks - your brain loves organized information!",
  "💡 Try explaining what you learned to yourself or others to deepen understanding.",
  "🎯 Set specific goals for each session to maximize focus and achievement."
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a mindful walk outside to refresh your mind and boost creativity",
  "💧 Hydrate with water and enjoy a healthy snack to fuel your next session",
  "👀 Practice the 20-20-20 rule: look at something 20 feet away for 20 seconds",
  "🧘‍♀️ Do gentle stretching or breathing exercises to release tension",
  "🎵 Listen to your favorite uplifting song to recharge your energy",
  "🌿 Step outside for fresh air and vitamin D to boost mood and focus",
  "📱 Send a quick message to someone you care about - social connection matters!",
  "✨ Practice gratitude by thinking of three things you're thankful for today"
];

// Mock audio context for simulating music playback
class MockAudio {
  private interval: NodeJS.Timeout | null = null;
  private _currentTime = 0;
  private _duration = 240; // 4 minutes default
  private _isPlaying = false;
  
  public volume = 0.6;
  public loop = true;
  public src = '';
  
  get currentTime() { return this._currentTime; }
  get duration() { return this._duration; }
  get paused() { return !this._isPlaying; }
  
  play() {
    this._isPlaying = true;
    this.interval = setInterval(() => {
      this._currentTime += 1;
      if (this._currentTime >= this._duration && this.loop) {
        this._currentTime = 0;
      }
    }, 1000);
    return Promise.resolve();
  }
  
  pause() {
    this._isPlaying = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  load() {
    this._currentTime = 0;
    // Simulate different track durations
    const track = FOCUS_TRACKS.find(t => this.src.includes(t.url));
    if (track) {
      const [minutes, seconds] = track.duration.split(':').map(Number);
      this._duration = minutes * 60 + seconds;
    }
  }
  
  addEventListener() {} // Mock
  removeEventListener() {} // Mock
}

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
  
  // Enhanced music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>({
    currentTime: 0,
    duration: 0,
    isLoaded: false
  });
  const [musicFilter, setMusicFilter] = useState<'all' | 'lofi' | 'nature' | 'ambient'>('all');
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<MockAudio>(new MockAudio());

  const targetTime = pomodoroSettings[mode];

  // Initialize mock audio
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;
    
    // Load current track
    const track = FOCUS_TRACKS[currentTrack];
    audio.src = track.url;
    audio.load();
    
    setAudioState({
      currentTime: 0,
      duration: audio.duration,
      isLoaded: true
    });
  }, [currentTrack, volume, isMuted]);

  // Update audio time
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const audio = audioRef.current;
        setAudioState(prev => ({
          ...prev,
          currentTime: audio.currentTime
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentFocusTimer');
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
        setCurrentTrack(data.currentTrack || 0);
        setMusicFilter(data.musicFilter || 'all');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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
      currentTrack,
      musicFilter
    };
    localStorage.setItem('studentFocusTimer', JSON.stringify(data));
  };

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
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus Session Complete!', {
          body: STUDY_TIPS[tipIndex],
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
    saveData();
  };

  // Enhanced music player functions
  const toggleMusic = async () => {
    try {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  };

  const changeTrack = (direction: 'next' | 'prev') => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentTrack + 1) % FOCUS_TRACKS.length;
    } else {
      newIndex = currentTrack === 0 ? FOCUS_TRACKS.length - 1 : currentTrack - 1;
    }
    
    setCurrentTrack(newIndex);
    
    if (isPlaying) {
      setTimeout(() => {
        audioRef.current.play().catch(console.error);
      }, 100);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.volume = isMuted ? volume : 0;
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (!isMuted) {
      audioRef.current.volume = newVolume;
    }
  };

  const getFilteredTracks = () => {
    if (musicFilter === 'all') return FOCUS_TRACKS;
    return FOCUS_TRACKS.filter(track => track.type === musicFilter);
  };

  const selectTrack = (trackId: string) => {
    const trackIndex = FOCUS_TRACKS.findIndex(t => t.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrack(trackIndex);
    }
  };

  // Utility functions
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

  const getMusicIcon = (type: string) => {
    switch (type) {
      case 'nature': return CloudRain;
      case 'ambient': return Sparkles;
      default: return Music;
    }
  };

  // Enhanced Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${(mode === 'focus' || mode === 'custom') ? 'from-blue-500 to-purple-600' : 'from-green-500 to-teal-600'}`}>
                {(mode === 'focus' || mode === 'custom') ? (
                  <Brain className="w-5 h-5 text-white" />
                ) : (
                  <Coffee className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {mode === 'focus' ? 'Deep Focus' : 
                   mode === 'custom' ? 'Custom Study' :
                   mode === 'shortBreak' ? 'Quick Break' : 'Long Break'}
                </span>
                {currentSubject && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentSubject}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleMaximize}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                title="Expand"
              >
                <Maximize2 className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={handleFloatingStop}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
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
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-1000 bg-gradient-to-r ${
                (mode === 'focus' || mode === 'custom') ? 'from-blue-500 to-purple-600' : 'from-green-500 to-teal-600'
              }`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className={`text-xs font-medium flex items-center gap-1 ${isRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {isRunning ? 'Active' : 'Paused'}
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                <Flame className="w-3 h-3" />
                <span className="font-medium">{currentStreak}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Target className="w-3 h-3" />
                <span className="font-medium">{pomodoroCount}</span>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-8 space-y-8">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-lg ${(mode === 'focus' || mode === 'custom') ? 'from-blue-500 to-purple-600' : 'from-green-500 to-teal-600'}`}>
                    {(mode === 'focus' || mode === 'custom') ? (
                      <Brain className="w-8 h-8 text-white" />
                    ) : (
                      <Coffee className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {mode === 'focus' ? 'Deep Focus Mode' : 
                       mode === 'custom' ? 'Custom Study Session' :
                       mode === 'shortBreak' ? 'Mindful Break' : 'Extended Rest'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {(mode === 'focus' || mode === 'custom') ? 'Channel your energy into productive learning' : 'Recharge and refresh your mind'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleMinimize}
                  icon={Minimize2}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>

              {/* Enhanced Mode Switcher */}
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  {(['focus', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((timerMode) => (
                    <button
                      key={timerMode}
                      onClick={() => switchMode(timerMode)}
                      disabled={isRunning}
                      className={`py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        mode === timerMode
                          ? (timerMode === 'focus' || timerMode === 'custom')
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {timerMode === 'focus' ? `Focus (${pomodoroSettings.focus}m)` : 
                       timerMode === 'shortBreak' ? `Break (${pomodoroSettings.shortBreak}m)` : 
                       timerMode === 'longBreak' ? `Rest (${pomodoroSettings.longBreak}m)` :
                       `Custom (${pomodoroSettings.custom}m)`}
                    </button>
                  ))}
                </div>

                {/* Enhanced Custom Timer Settings */}
                {(showCustomTimer || mode === 'custom') && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400">
                        Custom Study Session
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Session Duration (minutes)
                        </label>
                        <Input
                          type="number"
                          value={pomodoroSettings.custom.toString()}
                          onChange={(value) => handleCustomTimerChange(parseInt(value) || 30)}
                          min="1"
                          max="180"
                          disabled={isRunning}
                          className="text-center text-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quick Presets
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[15, 30, 45, 60].map((preset) => (
                            <button
                              key={preset}
                              onClick={() => handleCustomTimerChange(preset)}
                              disabled={isRunning}
                              className="px-4 py-2 text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
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

              {/* Study Information (focus/custom modes only) */}
              {(mode === 'focus' || mode === 'custom') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <BookOpen className="w-4 h-4" />
                      Study Subject
                    </label>
                    <Input
                      type="text"
                      value={currentSubject}
                      onChange={setCurrentSubject}
                      placeholder="What are you studying?"
                      disabled={isRunning}
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      <Target className="w-4 h-4" />
                      Session Goal
                    </label>
                    <Input
                      type="text"
                      value={currentTask}
                      onChange={setCurrentTask}
                      placeholder="What do you want to accomplish?"
                      disabled={isRunning}
                      className="text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Enhanced Timer Display */}
              <div className="text-center space-y-6">
                <div className="relative w-60 h-60 mx-auto">
                  <svg className="w-60 h-60 transform -rotate-90" viewBox="0 0 240 240">
                    {/* Background circle */}
                    <circle
                      cx="120"
                      cy="120"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="120"
                      cy="120"
                      r="100"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 100}`}
                      strokeDashoffset={`${2 * Math.PI * 100 * (1 - getProgress() / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={mode === 'focus' || mode === 'custom' ? '#3B82F6' : '#10B981'} />
                        <stop offset="100%" stopColor={mode === 'focus' || mode === 'custom' ? '#8B5CF6' : '#06B6D4'} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {formatTime(time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(Math.max(0, targetTime * 60 - time))} remaining
                      </div>
                      {getProgress() > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {Math.round(getProgress())}% complete
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Session Status */}
                <div className="flex items-center justify-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isRunning ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm font-medium">
                      {isRunning ? 'Session Active' : 'Ready to Start'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Timer Controls */}
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    onClick={startFocus}
                    icon={Play}
                    className={`flex-1 text-lg py-4 ${(mode === 'focus' || mode === 'custom') ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'}`}
                    disabled={time >= targetTime * 60 || ((mode === 'focus' || mode === 'custom') && !currentSubject.trim())}
                  >
                    {(mode === 'focus' || mode === 'custom') ? 'Start Deep Focus' : 'Begin Break'}
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
                  className="px-8 py-4"
                >
                  Stop
                </Button>
              </div>

              {time > 0 && !isRunning && (
                <Button
                  onClick={resetSession}
                  variant="secondary"
                  className="w-full py-3"
                >
                  Reset Session
                </Button>
              )}

              {/* Enhanced Music Player */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400">
                      Focus Soundscape
                    </h3>
                  </div>
                  <Button
                    onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                    icon={showMusicPlayer ? Minimize2 : Maximize2}
                    variant="ghost"
                    className="text-purple-600"
                  >
                    {showMusicPlayer ? 'Minimize' : 'Expand'}
                  </Button>
                </div>

                {showMusicPlayer && (
                  <div className="space-y-6">
                    {/* Music Filters */}
                    <div className="flex gap-2 justify-center">
                      {(['all', 'lofi', 'nature', 'ambient'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setMusicFilter(filter)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            musicFilter === filter
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          }`}
                        >
                          {filter === 'all' ? 'All Tracks' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Current Track Display */}
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${FOCUS_TRACKS[currentTrack].color} flex items-center justify-center shadow-lg`}>
                        {React.createElement(getMusicIcon(FOCUS_TRACKS[currentTrack].type), {
                          className: "w-8 h-8 text-white"
                        })}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {FOCUS_TRACKS[currentTrack].title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {FOCUS_TRACKS[currentTrack].artist} • {FOCUS_TRACKS[currentTrack].duration}
                      </p>
                    </div>

                    {/* Music Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => changeTrack('prev')}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      <button
                        onClick={toggleMusic}
                        className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <button
                        onClick={() => changeTrack('next')}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      <button
                        onClick={toggleMute}
                        className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-gray-600" /> : <Volume2 className="w-5 h-5 text-gray-600" />}
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
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer"
                        disabled={isMuted}
                      />
                      <Volume2 className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Track List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                      {getFilteredTracks().map((track) => (
                        <button
                          key={track.id}
                          onClick={() => selectTrack(track.id)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            FOCUS_TRACKS[currentTrack].id === track.id
                              ? 'bg-purple-200 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700'
                              : 'bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-gray-200 dark:border-gray-700'
                          } border`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.color} flex items-center justify-center`}>
                              {React.createElement(getMusicIcon(track.type), {
                                className: "w-4 h-4 text-white"
                              })}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {track.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {track.artist} • {track.duration}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-6 text-center border border-blue-200 dark:border-blue-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-1">
                    {pomodoroCount}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Today's Sessions
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-6 text-center border border-orange-200 dark:border-orange-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-400 mb-1">
                    {currentStreak}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    Current Streak
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-6 text-center border border-green-200 dark:border-green-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-900 dark:text-green-400 mb-1">
                    {sessionsCompleted}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Total Complete
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-6 text-center border border-purple-200 dark:border-purple-800">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-400 mb-1">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                    Daily Goal
                  </div>
                </div>
              </div>

              {/* Enhanced Daily Goal Setting */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-purple-600" />
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Daily Study Goal
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(parseInt(value) || 4)}
                      className="w-20 text-center font-bold"
                      min="1"
                      max="12"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">sessions</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{getTodaysPomodoros()} completed</span>
                  <span>{dailyGoal - getTodaysPomodoros()} remaining</span>
                </div>
              </div>

              {/* Enhanced Study Tip */}
              {(mode === 'focus' || mode === 'custom') && !isRunning && time === 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400">
                      Study Wisdom
                    </h3>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300 leading-relaxed">
                    {getRandomTip()}
                  </p>
                </div>
              )}

              {/* Break Activity Suggestion */}
              {(mode === 'shortBreak' || mode === 'longBreak') && !isRunning && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Coffee className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                      Break Suggestion
                    </h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 leading-relaxed">
                    {getRandomTip()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleMinimize}
                  variant="secondary"
                  className="flex-1 py-3"
                  icon={Minimize2}
                >
                  Minimize to Corner
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="flex-1 py-3"
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
