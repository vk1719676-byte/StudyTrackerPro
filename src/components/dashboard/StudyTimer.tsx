import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Bell, BellOff } from 'lucide-react';
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

export const StudyTimer: React.FC<StudyTimerProps> = ({ exams, onSessionAdded }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [efficiency, setEfficiency] = useState(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const lastNotificationRef = useRef<number>(0);

  // Initialize notifications and page visibility
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsTabVisible(visible);
      
      if (isRunning) {
        if (!visible) {
          // Tab hidden - store timer state and start background notifications
          const currentTime = Date.now();
          localStorage.setItem('timerState', JSON.stringify({
            isRunning: true,
            startTime: startTimeRef.current,
            elapsed: time,
            subject,
            topic,
            hiddenAt: currentTime
          }));
          startBackgroundNotifications();
        } else {
          // Tab visible - restore timer state
          restoreTimerState();
          stopBackgroundNotifications();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Restore timer state on component mount
    restoreTimerState();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopBackgroundNotifications();
    };
  }, []);

  // Main timer effect
  useEffect(() => {
    if (isRunning && isTabVisible) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
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
  }, [isRunning, isTabVisible]);

  const restoreTimerState = () => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        if (state.isRunning) {
          const now = Date.now();
          const backgroundTime = Math.floor((now - state.hiddenAt) / 1000);
          const totalTime = state.elapsed + backgroundTime;
          
          setTime(totalTime);
          setIsRunning(true);
          setSubject(state.subject);
          setTopic(state.topic);
          startTimeRef.current = state.startTime;

          // Show notification about time spent in background
          if (backgroundTime > 30 && notificationsEnabled) {
            showNotification(
              'Timer Continued in Background',
              `Added ${formatTime(backgroundTime)} while tab was closed. Total: ${formatTime(totalTime)}`
            );
          }
        }
        localStorage.removeItem('timerState');
      } catch (error) {
        console.error('Error restoring timer state:', error);
      }
    }
  };

  const startBackgroundNotifications = () => {
    if (!notificationsEnabled) return;

    // Show initial notification
    showNotification(
      'Study Timer Running in Background',
      `${subject} - ${topic} | Time: ${formatTime(time)}`
    );

    // Schedule periodic notifications every 5 minutes
    const notificationInterval = setInterval(() => {
      const now = Date.now();
      const savedState = localStorage.getItem('timerState');
      if (savedState) {
        const state = JSON.parse(savedState);
        const backgroundTime = Math.floor((now - state.hiddenAt) / 1000);
        const totalTime = state.elapsed + backgroundTime;
        
        showNotification(
          'Study Timer Update',
          `${state.subject} - ${state.topic} | Time: ${formatTime(totalTime)}`
        );
      }
    }, 5 * 60 * 1000); // 5 minutes

    localStorage.setItem('notificationInterval', notificationInterval.toString());
  };

  const stopBackgroundNotifications = () => {
    const intervalId = localStorage.getItem('notificationInterval');
    if (intervalId) {
      clearInterval(parseInt(intervalId));
      localStorage.removeItem('notificationInterval');
    }
  };

  const showNotification = (title: string, body: string) => {
    if (notificationsEnabled && 'Notification' in window) {
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'study-timer',
        requireInteraction: false,
        silent: false
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Handle notification clicks
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    
    if (notificationsEnabled) {
      showNotification(
        'Study Session Started',
        `${subject} - ${topic}`
      );
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    localStorage.removeItem('timerState');
    stopBackgroundNotifications();
    
    if (notificationsEnabled) {
      showNotification(
        'Study Session Paused',
        `Total time: ${formatTime(time)}`
      );
    }
  };
  
  const stopTimer = async () => {
    setIsRunning(false);
    localStorage.removeItem('timerState');
    stopBackgroundNotifications();
    
    if (time > 0 && user && subject && topic && selectedExam) {
      if (notificationsEnabled) {
        showNotification(
          'Study Session Completed',
          `${subject} - ${topic} | Duration: ${formatTime(time)}`
        );
      }
      
      await saveSession(Math.floor(time / 60));
      setTime(0);
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
      userId: user.uid
    };

    try {
      await addStudySession(session);
      onSessionAdded();
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
    startTimeRef.current = 0;
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Timer</h2>
        <Button
          onClick={toggleNotifications}
          variant="ghost"
          icon={notificationsEnabled ? Bell : BellOff}
          className={`${notificationsEnabled ? 'text-green-600' : 'text-gray-400'}`}
        >
          {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
        </Button>
      </div>
      
      <Card className="p-6 space-y-4" gradient>
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-4">
            {formatTime(time)}
          </div>
          
          {!isTabVisible && isRunning && (
            <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ Timer continues running in background with notifications
              </p>
            </div>
          )}
          
          <div className="flex justify-center gap-2 mb-4">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                icon={Play}
                disabled={!subject || !topic || !selectedExam}
              >
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} icon={Pause} variant="secondary">
                Pause
              </Button>
            )}
            
            <Button
              onClick={stopTimer}
              icon={Square}
              variant="danger"
              disabled={time === 0}
            >
              Stop & Save
            </Button>
          </div>
        </div>

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
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Below Average</option>
              <option value={1}>1 - Poor</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <Button
            onClick={() => setShowManualEntry(!showManualEntry)}
            variant="ghost"
            icon={Plus}
            className="w-full"
          >
            Add Manual Entry
          </Button>

          {showManualEntry && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
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

        {notificationsEnabled && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              🔔 Background timer enabled! You'll receive notifications every 5 minutes when the tab is closed.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
