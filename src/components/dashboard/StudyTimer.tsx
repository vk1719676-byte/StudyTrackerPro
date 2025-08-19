import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus } from 'lucide-react';
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
  
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning) {
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
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  
  const stopTimer = async () => {
    setIsRunning(false);
    if (time > 0 && user && subject && topic && selectedExam) {
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
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Study Timer</h2>
      
      <Card className="p-6 space-y-4" gradient>
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-purple-600 dark:text-purple-400 mb-4">
            {formatTime(time)}
          </div>
          
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
      </Card>
    </div>
  );
};
