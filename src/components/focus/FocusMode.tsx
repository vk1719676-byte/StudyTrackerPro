import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Radio } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

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

const POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15
};

const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Chill Lofi ',
    artist: 'Study Tracker',
    url: 'https://s107-isny.freeconvert.com/task/689311370f7f547d80af53d5/lofi-study-beat-24-255269.mp3',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Study Romance',
    artist: 'Chill Café',
    url: 'https://s85-ious.freeconvert.com/task/68931137ecabe1ff1900a73c/lofi-study-beat-21-255266.mp3',
    duration: '4:15'
  },
  {
    id: '3',
    title: 'Heartbeat Study',
    artist: 'Warm Vinyl',
    url: 'https://s97-ious.freeconvert.com/task/6893113835e5168e5f1e6893/lofi-study-beat-5-245776.mp3',
    duration: '3:45'
  },
  {
    id: '4',
    title: 'Coffee & Cuddles',
    artist: 'Sunset Lounge',
    url: 'https://s96-ious.freeconvert.com/task/68931138ecabe1ff1900a857/lofi-beat-to-study-299573.mp3',
    duration: '4:32'
  },
  {
    id: '5',
    title: 'Love Notes',
    artist: 'Dreamy Beats',
    url: 'https://s34-hzfi.freeconvert.com/task/689311390f7f547d80af556a/flamenco-lofi-instrumental-minimal-study-music-slow-299575.mp3',
    duration: '3:58'
  },
  {
    id: '6',
    title: 'Sweet Study Session',
    artist: 'Mellow Mood',
    url: 'https://s71-hzde.freeconvert.com/task/6893113e7cbbeebdc7bfef0b/chill-lofi-study-music-381035.mp3',
    duration: '4:28'
  }
];

const STUDY_TIPS = [
  "Take deep breaths and stay hydrated! 💧",
  "Remember to review what you've learned in the last session 📚",
  "Great progress! You're building strong study habits 🌟",
  "Take a moment to stretch your body and rest your eyes 👀",
  "You're doing amazing! Keep up the momentum 🚀",
  "Consider switching subjects to keep your mind fresh 🔄"
];

const BREAK_ACTIVITIES = [
  "🚶‍♀️ Take a short walk to refresh your mind",
  "💧 Drink some water and have a healthy snack",
  "👀 Look away from your screen and rest your eyes",
  "🧘‍♀️ Do some light stretching or breathing exercises",
  "🎵 Listen to your favorite song to recharge",
  "☀️ Step outside for some fresh air if possible"
];

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [studyHistory, setStudyHistory] = useState<StudySession[]>([]);
  
  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const targetTime = POMODORO_SETTINGS[mode];

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
      setShowMusicPlayer(data.showMusicPlayer !== undefined ? data.showMusicPlayer : true);
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
      showMusicPlayer
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
    const newSession: StudySession = {
      id: Date.now().toString(),
      subject: currentSubject,
      task: currentTask,
      duration: targetTime,
      completedAt: new Date(),
      mode
    };

    if (mode === 'focus') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      setSessionsCompleted(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      
      const tipIndex = Math.floor(Math.random() * STUDY_TIPS.length);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Focus Session Complete!', {
          body: `Great work! ${STUDY_TIPS[tipIndex]} Session ${newCount}/4 in this cycle.`,
          icon: '/vite.svg'
        });
      }

      if (newCount % 4 === 0) {
        setMode('longBreak');
      } else {
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
    console.log(`${mode} session started - timer running in background`);
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
      session.mode === 'focus' && 
      session.completedAt.toDateString === today
    ).length;
  };

  const getDailyProgress = () => {
    return Math.min((getTodaysPomodoros() / dailyGoal) * 100, 100);
  };

  const getRandomTip = () => {
    if (mode === 'focus') return STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
    return BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)];
  };

  // Floating Timer Component
  const FloatingTimer = () => {
    if (!isMinimized || (!isRunning && time === 0)) return null;

    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${mode === 'focus' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                {mode === 'focus' ? (
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Coffee className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {mode === 'focus' ? 'Studying' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
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
                mode === 'focus' ? 'bg-blue-600 dark:bg-blue-400' : 'bg-green-600 dark:bg-green-400'
              }`}
              style={{ width: `${Math.min(getProgress(), 100)}%` }}
            />
          </div>

          {/* Mini Music Controls */}
          {isPlaying && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3 text-purple-600" />
                <button
                  onClick={toggleMusic}
                  className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 text-purple-600" />
                  ) : (
                    <Play className="w-3 h-3 text-purple-600" />
                  )}
                </button>
              </div>
              <div className="flex-1 text-xs text-purple-700 dark:text-purple-300 truncate">
                {LOFI_TRACKS[currentTrack].title}
              </div>
            </div>
          )}

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
      <FloatingTimer />
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={LOFI_TRACKS[currentTrack].url}
        preload="metadata"
      />

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${mode === 'focus' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {mode === 'focus' ? (
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Coffee className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mode === 'focus' ? 'Time to concentrate and learn!' : 'Take a well-deserved break!'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleMinimize}
                  icon={Minimize2}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>

              {/* Lofi Music Player */}
              {showMusicPlayer && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Radio className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Lofi Love Study Music
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          Romantic & relaxing beats for your study sessions 💕
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMusicPlayer(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Current Track Display */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {LOFI_TRACKS[currentTrack].title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {LOFI_TRACKS[currentTrack].artist} • {LOFI_TRACKS[currentTrack].duration}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isPlaying 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {isPlaying ? '♪ Playing' : 'Paused'}
                      </div>
                    </div>
                  </div>

                  {/* Music Controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={previousTrack}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Previous Track"
                    >
                      <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    <button
                      onClick={toggleMusic}
                      className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" />
                      )}
                    </button>
                    
                    <button
                      onClick={nextTrack}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title="Next Track"
                    >
                      <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        disabled={isMuted}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-center">
                      {Math.round((isMuted ? 0 : volume) * 100)}%
                    </span>
                  </div>

                  {/* Track List Preview */}
                  <div className="mt-4 max-h-32 overflow-y-auto">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Lofi Love Playlist ({LOFI_TRACKS.length} tracks)
                    </div>
                    <div className="space-y-1">
                      {LOFI_TRACKS.map((track, index) => (
                        <button
                          key={track.id}
                          onClick={() => setCurrentTrack(index)}
                          className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                            currentTrack === index
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                              : 'hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <span className="font-medium">{track.title}</span>
                          <span className="text-gray-500 dark:text-gray-500 ml-2">by {track.artist}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Show Music Player Button (when hidden) */}
              {!showMusicPlayer && (
                <button
                  onClick={() => setShowMusicPlayer(true)}
                  className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border-2 border-dashed border-purple-200 dark:border-purple-700 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                    <Music className="w-5 h-5" />
                    <span className="font-medium">Show Lofi Love Music Player</span>
                  </div>
                </button>
              )}

              {/* Mode Switcher */}
              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((timerMode) => (
                  <button
                    key={timerMode}
                    onClick={() => switchMode(timerMode)}
                    disabled={isRunning}
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                      mode === timerMode
                        ? timerMode === 'focus'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {timerMode === 'focus' ? 'Focus (25m)' : 
                     timerMode === 'shortBreak' ? 'Break (5m)' : 'Long Break (15m)'}
                  </button>
                ))}
              </div>

              {/* Study Subject & Task (only during focus mode) */}
              {mode === 'focus' && (
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
                        mode === 'focus' 
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
                  
                  {mode !== 'focus' && (
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
                    className={`flex-1 ${mode === 'focus' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={time >= targetTime * 60 || (mode === 'focus' && !currentSubject.trim())}
                  >
                    {mode === 'focus' ? 'Start Studying' : 'Start Break'}
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

              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                    {pomodoroCount}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    Pomodoros Today
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-400">
                    {currentStreak}
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">
                    Current Streak
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-400">
                    {sessionsCompleted}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    Total Sessions
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-400">
                    {Math.round(getDailyProgress())}%
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    Daily Goal
                  </div>
                </div>
              </div>

              {/* Daily Goal Setting */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Study Goal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={dailyGoal.toString()}
                      onChange={(value) => setDailyGoal(parseInt(value) || 4)}
                      className="w-16 text-center text-sm"
                      min="1"
                      max="12"
                    />
                    <span className="text-xs text-gray-500">pomodoros</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getDailyProgress()}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>{pomodoroCount} completed</span>
                  <span>{dailyGoal} goal</span>
                </div>
              </div>

              {/* Pomodoro Cycle Progress */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-blue-800 dark:text-blue-400">
                    Pomodoro Cycle Progress
                  </span>
                </div>
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4].map((cycle) => (
                    <div
                      key={cycle}
                      className={`flex-1 h-3 rounded-full ${
                        cycle <= (pomodoroCount % 4 === 0 ? 4 : pomodoroCount % 4)
                          ? 'bg-blue-600 dark:bg-blue-400'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 text-center">
                  {pomodoroCount % 4 === 0 && pomodoroCount > 0 
                    ? 'Cycle complete! Time for a long break 🎉' 
                    : `${(pomodoroCount % 4)} of 4 focus sessions completed`}
                </div>
              </div>

              {/* Study Tip */}
              {mode === 'focus' && !isRunning && (
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

              {/* Session Progress (when timer is running or paused) */}
              {time > 0 && (
                <div className={`${mode === 'focus' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className={`w-4 h-4 ${mode === 'focus' ? 'text-blue-600' : 'text-green-600'}`} />
                    <span className={`font-semibold ${mode === 'focus' ? 'text-blue-800 dark:text-blue-400' : 'text-green-800 dark:text-green-400'}`}>
                      Session Progress
                    </span>
                  </div>
                  <div className={`text-sm space-y-2 ${mode === 'focus' ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-semibold">{Math.round(getProgress())}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Remaining:</span>
                      <span className="font-mono">{formatTime(Math.max(0, targetTime * 60 - time))}</span>
                    </div>
                    {mode === 'focus' && currentSubject && (
                      <div className="flex justify-between">
                        <span>Subject:</span>
                        <span className="font-medium">{currentSubject}</span>
                      </div>
                    )}
                    {mode === 'focus' && currentTask && (
                      <div className="flex justify-between">
                        <span>Task:</span>
                        <span className="font-medium truncate ml-2" title={currentTask}>
                          {currentTask.length > 20 ? currentTask.substring(0, 20) + '...' : currentTask}
                        </span>
                      </div>
                    )}
                  </div>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #9333ea;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
};
