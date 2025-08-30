import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Timer,
  ExternalLink,
  Minimize2,
  Download
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { StudySession, Exam } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StudyTimerProps {
  exams: Exam[];
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
  const [sessions, setSessions] = useLocalStorage<StudySession[]>('study-sessions', []);
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  
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
    if (time > 0 && subject && topic && selectedExam) {
      await saveSession(Math.floor(time / 60));
      setTime(0);
      resetForm();
    }
  };

  const saveSession = async (duration: number) => {
    if (!selectedExam) return;

    const examName = exams.find(exam => exam.id === selectedExam)?.name || 'Unknown Exam';
    
    const session: StudySession = {
      id: Date.now().toString(),
      examId: selectedExam,
      examName,
      duration,
      subject,
      topic,
      efficiency,
      date: new Date()
    };

    setSessions(prev => [...prev, session]);
    onSessionAdded();
  };

  const handleManualEntry = async () => {
    const duration = parseInt(manualDuration);
    if (duration > 0 && subject && topic && selectedExam) {
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

  const openPictureInPicture = async () => {
    try {
      // Try Document Picture-in-Picture API first (Chrome 116+)
      if ('documentPictureInPicture' in window) {
        const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
          width: 320,
          height: 200,
        });

        // Copy styles to PiP window
        const styles = Array.from(document.styleSheets)
          .map(styleSheet => {
            try {
              return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('');
            } catch {
              return '';
            }
          })
          .join('');

        const styleElement = pipWindow.document.createElement('style');
        styleElement.textContent = styles;
        pipWindow.document.head.appendChild(styleElement);

        // Add Tailwind CSS
        const tailwindLink = pipWindow.document.createElement('link');
        tailwindLink.rel = 'stylesheet';
        tailwindLink.href = 'https://cdn.tailwindcss.com';
        pipWindow.document.head.appendChild(tailwindLink);

        // Create timer content for PiP
        pipWindow.document.body.innerHTML = `
          <div class="h-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border-2 border-gray-800 dark:border-gray-200 shadow-2xl p-6 text-center min-w-[280px]">
              <div class="mb-4">
                <div class="text-3xl font-mono font-bold text-indigo-700 dark:text-indigo-300" id="pip-timer">
                  ${formatTime(time)}
                </div>
                <div class="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1" id="pip-status">
                  ${isRunning ? 'Session Active' : 'Paused'}
                </div>
              </div>
              <div class="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <div><strong>Subject:</strong> ${subject || 'Not set'}</div>
                <div><strong>Topic:</strong> ${topic || 'Not set'}</div>
              </div>
              <div class="mt-4 flex gap-2 justify-center">
                <button id="pip-toggle" class="px-3 py-1 text-xs font-semibold rounded-lg ${
                  isRunning 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } transition-colors">
                  ${isRunning ? 'Pause' : 'Start'}
                </button>
                <button id="pip-stop" class="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors">
                  Stop
                </button>
              </div>
            </div>
          </div>
        `;

        // Add event listeners for PiP controls
        const toggleBtn = pipWindow.document.getElementById('pip-toggle');
        const stopBtn = pipWindow.document.getElementById('pip-stop');

        toggleBtn?.addEventListener('click', () => {
          if (isRunning) {
            pauseTimer();
          } else {
            startTimer();
          }
        });

        stopBtn?.addEventListener('click', stopTimer);

        // Update PiP timer display
        const updatePipTimer = () => {
          const timerEl = pipWindow.document.getElementById('pip-timer');
          const statusEl = pipWindow.document.getElementById('pip-status');
          const toggleBtnEl = pipWindow.document.getElementById('pip-toggle');
          
          if (timerEl) timerEl.textContent = formatTime(time);
          if (statusEl) statusEl.textContent = isRunning ? 'Session Active' : 'Paused';
          if (toggleBtnEl) {
            toggleBtnEl.textContent = isRunning ? 'Pause' : 'Start';
            toggleBtnEl.className = `px-3 py-1 text-xs font-semibold rounded-lg ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } transition-colors`;
          }
        };

        // Set up interval to update PiP display
        const pipUpdateInterval = setInterval(updatePipTimer, 1000);

        // Clean up when PiP window closes
        pipWindow.addEventListener('beforeunload', () => {
          clearInterval(pipUpdateInterval);
          setPipWindow(null);
        });

        setPipWindow(pipWindow);
      } else {
        // Fallback to popup window
        openPopupTimer();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
      openPopupTimer();
    }
  };

  const openPopupTimer = () => {
    const popup = window.open(
      '',
      'StudyTimer',
      'width=350,height=250,resizable=yes,scrollbars=no,status=no,menubar=no,toolbar=no,location=no'
    );

    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Study Timer</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <div class="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div class="bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-gray-800 shadow-2xl p-6 text-center w-full max-w-sm">
              <div class="mb-4">
                <div class="text-3xl font-mono font-bold text-indigo-700" id="popup-timer">
                  ${formatTime(time)}
                </div>
                <div class="text-sm font-semibold text-gray-600 mt-1" id="popup-status">
                  ${isRunning ? 'Session Active' : 'Paused'}
                </div>
              </div>
              <div class="space-y-2 text-xs text-gray-600 mb-4">
                <div><strong>Subject:</strong> ${subject || 'Not set'}</div>
                <div><strong>Topic:</strong> ${topic || 'Not set'}</div>
              </div>
              <div class="flex gap-2 justify-center">
                <button id="popup-toggle" class="px-3 py-1 text-xs font-semibold rounded-lg ${
                  isRunning 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                } transition-colors">
                  ${isRunning ? 'Pause' : 'Start'}
                </button>
                <button id="popup-stop" class="px-3 py-1 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors">
                  Stop
                </button>
              </div>
            </div>
          </div>
          <script>
            document.getElementById('popup-toggle').addEventListener('click', () => {
              window.opener.postMessage({ action: 'toggle' }, '*');
            });
            document.getElementById('popup-stop').addEventListener('click', () => {
              window.opener.postMessage({ action: 'stop' }, '*');
            });
          </script>
        </body>
        </html>
      `);

      // Listen for messages from popup
      const messageHandler = (event: MessageEvent) => {
        if (event.source === popup) {
          if (event.data.action === 'toggle') {
            if (isRunning) {
              pauseTimer();
            } else {
              startTimer();
            }
          } else if (event.data.action === 'stop') {
            stopTimer();
          }
        }
      };

      window.addEventListener('message', messageHandler);

      // Update popup timer display
      const updatePopupTimer = () => {
        if (popup && !popup.closed) {
          try {
            const timerEl = popup.document.getElementById('popup-timer');
            const statusEl = popup.document.getElementById('popup-status');
            const toggleBtnEl = popup.document.getElementById('popup-toggle');
            
            if (timerEl) timerEl.textContent = formatTime(time);
            if (statusEl) statusEl.textContent = isRunning ? 'Session Active' : 'Paused';
            if (toggleBtnEl) {
              toggleBtnEl.textContent = isRunning ? 'Pause' : 'Start';
              toggleBtnEl.className = `px-3 py-1 text-xs font-semibold rounded-lg ${
                isRunning 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`;
            }
          } catch (error) {
            // Popup might be closed or from different origin
          }
        }
      };

      const popupUpdateInterval = setInterval(updatePopupTimer, 1000);

      popup.addEventListener('beforeunload', () => {
        clearInterval(popupUpdateInterval);
        window.removeEventListener('message', messageHandler);
        setPipWindow(null);
      });

      setPipWindow(popup);
    }
  };

  const exportSessions = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `study-sessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEfficiencyColor = (rating: number) => {
    const colors = {
      5: 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300 dark:text-emerald-300 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:border-emerald-700',
      4: 'text-green-700 bg-gradient-to-r from-green-50 to-green-100 border-green-300 dark:text-green-300 dark:from-green-900/30 dark:to-green-800/20 dark:border-green-700',
      3: 'text-yellow-700 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 dark:text-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/20 dark:border-yellow-700',
      2: 'text-orange-700 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 dark:text-orange-300 dark:from-orange-900/30 dark:to-orange-800/20 dark:border-orange-700',
      1: 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-300 dark:text-red-300 dark:from-red-900/30 dark:to-red-800/20 dark:border-red-700'
    };
    return colors[rating as keyof typeof colors] || colors[5];
  };

  const getEfficiencyLabel = (rating: number) => {
    const labels = {
      5: 'Excellent',
      4: 'Good',
      3: 'Average',
      2: 'Below Average',
      1: 'Poor'
    };
    return labels[rating as keyof typeof labels] || 'Excellent';
  };

  const isFormComplete = subject && topic && selectedExam;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30"></div>
            <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 rounded-xl border-2 border-gray-800 dark:border-gray-200 shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Study Timer
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Track your study sessions and measure progress
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={exportSessions}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            disabled={sessions.length === 0}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            onClick={openPictureInPicture}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            disabled={pipWindow !== null}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">
              {pipWindow ? 'Already Open' : 'Float Timer'}
            </span>
            <Minimize2 className="h-4 w-4 sm:hidden" />
          </Button>
        </div>
      </div>
      
      {/* Main Timer Card */}
      <Card gradient={true}>
        <div className="p-6 sm:p-8 space-y-8">
          {/* Timer Display */}
          <div className="text-center">
            <div className={`relative inline-block p-8 sm:p-12 rounded-3xl transition-all duration-500 ${
              isRunning 
                ? 'bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50 dark:from-indigo-900/40 dark:via-indigo-800/30 dark:to-purple-900/40 border-2 border-indigo-300 dark:border-indigo-500 shadow-xl' 
                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 shadow-lg'
            }`}>
              {isRunning && (
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-3xl blur opacity-20 animate-pulse"></div>
              )}
              <div className="relative">
                <div className={`font-mono font-bold transition-all duration-300 ${
                  isRunning 
                    ? 'text-indigo-700 dark:text-indigo-300' 
                    : 'text-gray-700 dark:text-gray-300'
                } text-4xl sm:text-6xl md:text-7xl tracking-wider`}>
                  {formatTime(time)}
                </div>
                <div className={`mt-3 text-sm sm:text-base font-semibold tracking-wide ${
                  isRunning 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <Timer className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Session Active' : 'Ready to Start'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notice for missing session details */}
          {!isFormComplete && (
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur opacity-20"></div>
              <div className="relative p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-300 dark:border-amber-600 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div className="text-amber-800 dark:text-amber-200">
                    <p className="font-semibold text-sm sm:text-base">Complete session details to begin</p>
                    <p className="text-xs sm:text-sm mt-1 opacity-90">Fill in exam, subject, and topic fields below to start timing or add manual entries</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                disabled={!isFormComplete}
                variant="success"
                size="lg"
                className="flex items-center gap-3"
              >
                <Play className="h-5 w-5" />
                <span>Start Session</span>
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                variant="warning"
                size="lg"
                className="flex items-center gap-3"
              >
                <Pause className="h-5 w-5" />
                <span>Pause</span>
              </Button>
            )}
            
            <Button
              onClick={stopTimer}
              disabled={time === 0}
              variant="danger"
              size="lg"
              className="flex items-center gap-3"
            >
              <Square className="h-5 w-5" />
              <span className="hidden sm:inline">Stop & Save</span>
              <span className="sm:hidden">Stop</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Study Session Form */}
      <Card>
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Session Details
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Exam Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Target Exam
              </label>
              <div className="relative group/select">
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/select:shadow-lg font-medium"
                  required
                >
                  <option value="">Choose your exam</option>
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Subject Input */}
            <Input
              label="Subject"
              placeholder="e.g., Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            {/* Topic Input */}
            <Input
              label="Topic"
              placeholder="e.g., Calculus"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />

            {/* Efficiency Rating */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                Efficiency Rating
              </label>
              <div className="relative group/select">
                <select
                  value={efficiency}
                  onChange={(e) => setEfficiency(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 group-hover/select:shadow-lg font-medium appearance-none pr-12"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Below Average</option>
                  <option value={1}>1 - Poor</option>
                </select>
                <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-300 ${getEfficiencyColor(efficiency)}`}>
                  {getEfficiencyLabel(efficiency)}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Manual Entry Section */}
      <Card>
        <div className="p-6 sm:p-8">
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="group/btn w-full flex items-center justify-center gap-4 px-6 py-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-300 font-semibold border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-500 hover:shadow-lg"
          >
            <Plus className={`h-5 w-5 transform transition-all duration-300 group-hover/btn:scale-110 ${showManualEntry ? 'rotate-45' : ''}`} />
            <span className="text-base">
              {showManualEntry ? 'Cancel Manual Entry' : 'Add Manual Entry'}
            </span>
          </button>

          {showManualEntry && (
            <div className="mt-6 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-10"></div>
              <div className="relative p-6 bg-gradient-to-br from-indigo-50 via-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:via-indigo-800/30 dark:to-purple-900/40 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 space-y-6">
                <Input
                  label="Duration (minutes)"
                  icon={<Clock className="h-4 w-4" />}
                  type="number"
                  placeholder="e.g., 60"
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  required
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleManualEntry}
                    disabled={!manualDuration || !isFormComplete}
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Save Session
                  </Button>
                  <Button
                    onClick={() => setShowManualEntry(false)}
                    variant="secondary"
                    className="flex items-center justify-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Study Sessions Summary */}
      {sessions.length > 0 && (
        <Card>
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                Recent Sessions
              </h3>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {sessions.slice(-5).reverse().map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {session.subject} - {session.topic}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {session.examName} • {new Date(session.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {session.duration}m
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-semibold ${getEfficiencyColor(session.efficiency)}`}>
                        {getEfficiencyLabel(session.efficiency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {sessions.length > 5 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing latest 5 sessions • Total: {sessions.length} sessions
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
