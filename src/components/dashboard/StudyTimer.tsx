import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Bell, BellOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { addStudySession } from '../../services/firestore';
import { StudySession } from '../../types';
import { useBackgroundTimer } from '../../hooks/useBackgroundTimer';

interface StudyTimerProps {
  exams: any[];
  onSessionAdded: () => void;
}

export const StudyTimer: React.FC<StudyTimerProps> = ({ exams, onSessionAdded }) => {
  const [time, setTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualDuration, setManualDuration] = useState('');
  const [efficiency, setEfficiency] = useState(5);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const {
    hasNotificationPermission,
    isServiceWorkerReady,
    timerState,
    requestNotificationPermission,
    startBackgroundTimer,
    pauseBackgroundTimer,
    stopBackgroundTimer,
    syncWithServiceWorker
  } = useBackgroundTimer();

  // Sync local time with background timer
  useEffect(() => {
    setTime(timerState.elapsed);
    
    if (timerState.isRunning && timerState.subject && timerState.topic && timerState.examId) {
      setSubject(timerState.subject);
      setTopic(timerState.topic);
      setSelectedExam(timerState.examId);
    }
  }, [timerState]);

  // Handle foreground timer updates
  useEffect(() => {
    if (timerState.isRunning && document.visibilityState === 'visible') {
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
  }, [timerState.isRunning]);

  // Listen for timer stopped event from service worker
  useEffect(() => {
    const handleTimerStopped = (event: CustomEvent) => {
      const { elapsed, subject, topic, examId } = event.detail;
      if (elapsed > 0 && user) {
        saveSession(Math.floor(elapsed / 60));
      }
    };

    window.addEventListener('timerStopped', handleTimerStopped as EventListener);
    return () => window.removeEventListener('timerStopped', handleTimerStopped as EventListener);
  }, [user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = async () => {
    if (!hasNotificationPermission) {
      setShowNotificationModal(true);
      return;
    }
    
    if (isServiceWorkerReady) {
      startBackgroundTimer(subject, topic, selectedExam, time);
    }
  };

  const pauseTimer = () => {
    if (isServiceWorkerReady) {
      pauseBackgroundTimer();
    }
  };
  
  const stopTimer = async () => {
    if (isServiceWorkerReady) {
      stopBackgroundTimer();
    }
    
    if (time > 0 && user && subject && topic && selectedExam) {
      await saveSession(Math.floor(time / 60));
      setTime(0);
      resetForm();
    }
  };

  const handleNotificationPermission = async (granted: boolean) => {
    setShowNotificationModal(false);
    
    if (granted) {
      const permission = await requestNotificationPermission();
      if (permission && isServiceWorkerReady) {
        startBackgroundTimer(subject, topic, selectedExam, time);
      }
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
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Timer</h2>
          <div className="flex items-center gap-2">
            {hasNotificationPermission ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <Bell size={16} />
                <span>Background enabled</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                <BellOff size={16} />
                <span>Background disabled</span>
              </div>
            )}
            {timerState.isRunning && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <Card className="p-6 space-y-4" gradient>
          <div className="text-center">
            <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-4">
              {formatTime(time)}
            </div>
            
            {timerState.isRunning && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Timer running in background
              </div>
            )}
            
            <div className="flex justify-center gap-2 mb-4">
              {!timerState.isRunning ? (
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
                disabled={timerState.isRunning}
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
              disabled={timerState.isRunning}
            />

            <Input
              label="Topic"
              placeholder="e.g., Calculus"
              value={topic}
              onChange={setTopic}
              required
              disabled={timerState.isRunning}
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
        </Card>
      </div>

      {/* Notification Permission Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <Bell className="mx-auto mb-4 text-blue-600 dark:text-blue-400" size={48} />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Enable Background Timer
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Allow notifications to keep your study timer running in the background. You'll see timer updates in your browser's notification area.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleNotificationPermission(true)}
                  className="flex-1"
                >
                  Enable Notifications
                </Button>
                <Button
                  onClick={() => handleNotificationPermission(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
