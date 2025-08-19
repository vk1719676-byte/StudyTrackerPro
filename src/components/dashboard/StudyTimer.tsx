import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, Target, BookOpen, Bell, Save, TrendingUp, Coffee, Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { addStudySession } from '../../services/firestore';
import { StudySession } from '../../types';

interface StudyTimerProps {
  exams: any[];
  onSessionAdded: () => void;
}

interface SessionTemplate {
  id: string;
  name: string;
  subject: string;
  topic: string;
  examId: string;
}

interface StudyStats {
  todayTime: number;
  weekTime: number;
  streak: number;
  sessionsToday: number;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ exams, onSessionAdded }) => {
  // Existing state
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [efficiency, setEfficiency] = useState(5);

  // New enhanced features state
  const [mode, setMode] = useState<'timer' | 'pomodoro'>('timer');
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [dailyGoal, setDailyGoal] = useState(120); // minutes
  const [studyStats, setStudyStats] = useState<StudyStats>({
    todayTime: 0,
    weekTime: 0,
    streak: 0,
    sessionsToday: 0
  });
  const [sessionTemplates, setSessionTemplates] = useState<SessionTemplate[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [presetDuration, setPresetDuration] = useState<number | null>(null);
  const [targetTime, setTargetTime] = useState<number>(0);

  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();

  // Timer presets in minutes
  const timerPresets = [
    { name: 'Pomodoro', duration: 25, icon: '🍅' },
    { name: 'Focus', duration: 45, icon: '🎯' },
    { name: 'Deep Work', duration: 90, icon: '🧠' },
    { name: 'Quick Study', duration: 15, icon: '⚡' },
  ];

  const breakPresets = [
    { name: 'Short Break', duration: 5, icon: '☕' },
    { name: 'Long Break', duration: 15, icon: '🌟' },
  ];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 1;
          
          // Check if target time reached (for presets)
          if (targetTime > 0 && newTime >= targetTime) {
            handleTimerComplete();
            return newTime;
          }

          // Auto-save every 10 minutes if enabled
          if (autoSaveEnabled && newTime > 0 && newTime % 600 === 0) {
            handleAutoSave(newTime);
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
  }, [isRunning, targetTime, autoSaveEnabled]);

  // Initialize audio for notifications
  useEffect(() => {
    if (soundEnabled) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYSBj2O1/LIeh8EMnHJ8NeKOwoUXLbq5KhVFApGn+DyvmYSBj2O1/LIeh8EMnHJ8NeKOwqMg4qFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYSBj2O1/LIeh8EMnHJ8NeKOwoUXLbq5KhVFApGn+DyvmYSBj2O1/LIeh8EMnHJ8NeKOw==');
    }
  }, [soundEnabled]);

  // Load study stats on component mount
  useEffect(() => {
    loadStudyStats();
    loadSessionTemplates();
  }, [user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();
    
    if (mode === 'pomodoro') {
      if (isBreak) {
        // Break finished, start next pomodoro
        setIsBreak(false);
        setTargetTime(25 * 60); // 25 minutes
        alert('Break finished! Ready for next study session?');
      } else {
        // Pomodoro finished
        setPomodoroCount(prev => prev + 1);
        const isLongBreak = (pomodoroCount + 1) % 4 === 0;
        setIsBreak(true);
        setTargetTime(isLongBreak ? 15 * 60 : 5 * 60); // Long break or short break
        alert(`Pomodoro ${pomodoroCount + 1} complete! Time for a ${isLongBreak ? 'long' : 'short'} break.`);
      }
    } else {
      alert('Study session complete!');
    }
    
    setTime(0);
  };

  const handleAutoSave = async (currentTime: number) => {
    if (user && subject && topic && selectedExam) {
      const session: Omit<StudySession, 'id'> = {
        examId: selectedExam,
        duration: Math.floor(currentTime / 60),
        subject,
        topic,
        efficiency,
        date: new Date(),
        userId: user.uid,
        notes: sessionNotes,
        isAutoSave: true
      };

      try {
        await addStudySession(session);
        console.log('Session auto-saved');
      } catch (error) {
        console.error('Error auto-saving session:', error);
      }
    }
  };

  const loadStudyStats = () => {
    // This would typically load from Firebase
    // For now, using localStorage as example
    const today = new Date().toDateString();
    const savedStats = localStorage.getItem(`studyStats_${today}`);
    if (savedStats) {
      setStudyStats(JSON.parse(savedStats));
    }
  };

  const loadSessionTemplates = () => {
    const saved = localStorage.getItem(`studyTemplates_${user?.uid}`);
    if (saved) {
      setSessionTemplates(JSON.parse(saved));
    }
  };

  const saveSessionTemplate = () => {
    if (subject && topic && selectedExam) {
      const newTemplate: SessionTemplate = {
        id: Date.now().toString(),
        name: `${subject} - ${topic}`,
        subject,
        topic,
        examId: selectedExam
      };
      
      const updated = [...sessionTemplates, newTemplate];
      setSessionTemplates(updated);
      localStorage.setItem(`studyTemplates_${user?.uid}`, JSON.stringify(updated));
      alert('Template saved!');
    }
  };

  const loadTemplate = (template: SessionTemplate) => {
    setSubject(template.subject);
    setTopic(template.topic);
    setSelectedExam(template.examId);
    setShowTemplates(false);
  };

  const startTimer = () => {
    setIsRunning(true);
    if (presetDuration) {
      setTargetTime(presetDuration * 60);
    }
  };
  
  const pauseTimer = () => setIsRunning(false);
  
  const stopTimer = async () => {
    setIsRunning(false);
    if (time > 0 && user && subject && topic && selectedExam) {
      await saveSession(Math.floor(time / 60));
      setTime(0);
      setTargetTime(0);
      resetForm();
    }
  };

  const saveSession = async (duration: number) => {
    if (!user || !selectedExam) return;

    const session: Omit<StudySession, 'id'> = {
      examId: selectedExam,
      duration,
      subject,
      topic,
      efficiency,
      date: new Date(),
      userId: user.uid,
      notes: sessionNotes,
      pomodoroCount: mode === 'pomodoro' ? pomodoroCount : undefined
    };

    try {
      await addStudySession(session);
      onSessionAdded();
      
      // Update stats
      const newStats = {
        ...studyStats,
        todayTime: studyStats.todayTime + duration,
        sessionsToday: studyStats.sessionsToday + 1
      };
      setStudyStats(newStats);
      localStorage.setItem(`studyStats_${new Date().toDateString()}`, JSON.stringify(newStats));
      
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleManualEntry = async () => {
    const duration = parseInt(manualDuration);
    if (duration > 0 && user && subject && topic && selectedExam) {
      await saveSession(duration);
      setShowManualEntry(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setSubject('');
    setTopic('');
    setSelectedExam('');
    setManualDuration('');
    setEfficiency(5);
    setSessionNotes('');
    setPresetDuration(null);
    setTargetTime(0);
  };

  const setPresetTime = (minutes: number) => {
    setPresetDuration(minutes);
    setTime(0);
    setTargetTime(minutes * 60);
  };

  const toggleMode = () => {
    setMode(mode === 'timer' ? 'pomodoro' : 'timer');
    setTime(0);
    setIsBreak(false);
    setPomodoroCount(0);
    setTargetTime(0);
  };

  const progressPercentage = targetTime > 0 ? (time / targetTime) * 100 : 0;
  const dailyProgress = (studyStats.todayTime / dailyGoal) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {mode === 'pomodoro' ? '🍅 Pomodoro Timer' : '⏱️ Study Timer'}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowStats(!showStats)}
            variant="ghost"
            icon={TrendingUp}
            size="sm"
          >
            Stats
          </Button>
          <Button
            onClick={toggleMode}
            variant="ghost"
            icon={mode === 'timer' ? Brain : Clock}
            size="sm"
          >
            {mode === 'timer' ? 'Pomodoro' : 'Timer'}
          </Button>
        </div>
      </div>

      {/* Study Statistics */}
      {showStats && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Today's Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{Math.floor(studyStats.todayTime / 60)}h {studyStats.todayTime % 60}m</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Studied Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{studyStats.sessionsToday}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.round(dailyProgress)}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{studyStats.streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(dailyProgress, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Daily Goal: {Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-4" gradient>
        {/* Timer Display */}
        <div className="text-center">
          <div className="relative mb-4">
            <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400">
              {formatTime(time)}
            </div>
            {targetTime > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isBreak 
                        ? 'bg-gradient-to-r from-green-400 to-blue-500'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {isBreak ? '☕ Break Time' : '📚 Focus Time'} - {Math.ceil((targetTime - time) / 60)} min left
                </p>
              </div>
            )}
            {mode === 'pomodoro' && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Pomodoro #{pomodoroCount + 1} {isBreak ? '(Break)' : '(Focus)'}
              </div>
            )}
          </div>

          {/* Timer Presets */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {(isBreak ? breakPresets : timerPresets).map((preset) => (
              <Button
                key={preset.name}
                onClick={() => setPresetTime(preset.duration)}
                variant={presetDuration === preset.duration ? "primary" : "ghost"}
                size="sm"
                className="text-xs"
              >
                {preset.icon} {preset.duration}m
              </Button>
            ))}
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center gap-2 mb-4">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                icon={Play}
                disabled={!subject || !topic || !selectedExam}
                className="px-6"
              >
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} icon={Pause} variant="secondary" className="px-6">
                Pause
              </Button>
            )}
            
            <Button
              onClick={stopTimer}
              icon={Square}
              variant="danger"
              disabled={time === 0}
              className="px-6"
            >
              Stop & Save
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">Select an exam</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Subject"
            placeholder="e.g., Mathematics"
            value={subject}
            onChange={setSubject}
            required
          />

          <Input
            label="Topic"
            placeholder="e.g., Calculus"
            value={topic}
            onChange={setTopic}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Efficiency Rating
            </label>
            <select
              value={efficiency}
              onChange={(e) => setEfficiency(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={5}>5 - Excellent 🌟</option>
              <option value={4}>4 - Good 👍</option>
              <option value={3}>3 - Average ⚡</option>
              <option value={2}>2 - Below Average 📚</option>
              <option value={1}>1 - Poor 😴</option>
            </select>
          </div>
        </div>

        {/* Session Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Session Notes (Optional)
          </label>
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="What did you learn? Key concepts, challenges, insights..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 h-20 resize-none"
          />
        </div>

        {/* Settings */}
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="mr-2"
            />
            Auto-save every 10 min
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="mr-2"
            />
            Sound notifications
          </label>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowManualEntry(!showManualEntry)}
              variant="ghost"
              icon={Plus}
              size="sm"
            >
              Manual Entry
            </Button>
            
            <Button
              onClick={saveSessionTemplate}
              variant="ghost"
              icon={Save}
              size="sm"
              disabled={!subject || !topic || !selectedExam}
            >
              Save Template
            </Button>
            
            <Button
              onClick={() => setShowTemplates(!showTemplates)}
              variant="ghost"
              icon={BookOpen}
              size="sm"
            >
              Load Template
            </Button>
          </div>

          {/* Templates */}
          {showTemplates && sessionTemplates.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium mb-2">Session Templates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sessionTemplates.map((template) => (
                  <Button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    variant="ghost"
                    size="sm"
                    className="text-left justify-start"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Entry */}
          {showManualEntry && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
              <Input
                label="Duration (minutes)"
                type="number"
                placeholder="e.g., 60"
                value={manualDuration}
                onChange={setManualDuration}
                required
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleManualEntry}
                  disabled={!manualDuration || !subject || !topic || !selectedExam}
                  className="flex-1"
                >
                  Save Session
                </Button>
                <Button
                  onClick={() => setShowManualEntry(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
