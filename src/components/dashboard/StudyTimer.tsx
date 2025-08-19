import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Plus, Clock, Target, BookOpen, TrendingUp } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

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
    return {
      display: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      hours,
      minutes: Math.floor(seconds / 60),
      seconds: secs
    };
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
    console.log('Saving session:', { selectedExam, duration, subject, topic, efficiency });
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

  const timeFormatted = formatTime(time);
  const isFormValid = subject && topic && selectedExam;
  const progress = Math.min((time / (25 * 60)) * 100, 100); // 25 minutes as target

  const efficiencyColors = {
    5: 'text-emerald-600 bg-emerald-50',
    4: 'text-blue-600 bg-blue-50',
    3: 'text-yellow-600 bg-yellow-50',
    2: 'text-orange-600 bg-orange-50',
    1: 'text-red-600 bg-red-50'
  };

  const efficiencyLabels = {
    5: 'Excellent',
    4: 'Good',
    3: 'Average',
    2: 'Below Average',
    1: 'Poor'
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Study Timer</span>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Timer Section */}
        <div className={`transition-all duration-500 ${isRunning ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <CircularProgress 
                percentage={progress} 
                size={200}
                strokeWidth={8}
                isActive={isRunning}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`text-center ${isRunning ? 'text-white' : 'text-gray-700'}`}>
                  <div className="text-3xl md:text-4xl font-mono font-bold tracking-tight">
                    {timeFormatted.display}
                  </div>
                  <div className={`text-sm mt-1 ${isRunning ? 'text-blue-100' : 'text-gray-500'}`}>
                    {timeFormatted.minutes} minutes
                  </div>
                </div>
              </div>
            </div>
            
            {isRunning && (
              <div className="text-white/80 text-sm mb-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Recording session</span>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex justify-center gap-3">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  disabled={!isFormValid}
                  className={`
                    group flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isFormValid 
                      ? 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Play className="w-4 h-4" />
                  Start Timer
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium text-sm transition-all duration-200 hover:bg-white/30 hover:scale-105"
                >
                  <Pause className="w-4 h-4" />
                  Pause
                </button>
              )}
              
              <button
                onClick={stopTimer}
                disabled={time === 0}
                className={`
                  group flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200
                  ${time > 0
                    ? isRunning 
                      ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-lg'
                      : 'bg-red-100 text-red-600 hover:bg-red-200 hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <Square className="w-4 h-4" />
                Stop & Save
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Session Details
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Exam
                  </label>
                  <div className="relative">
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:ring-0 transition-colors appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose your exam</option>
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.name}</option>
                      ))}
                    </select>
                    <Target className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics, Physics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Calculus, Quantum Physics"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Performance & Options */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Performance
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Efficiency Rating
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setEfficiency(rating)}
                      className={`
                        p-3 rounded-xl border-2 transition-all duration-200 text-center
                        ${efficiency === rating 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      <div className="font-bold text-lg">{rating}</div>
                      <div className="text-xs mt-1">{efficiencyLabels[rating as keyof typeof efficiencyLabels]}</div>
                    </button>
                  ))}
                </div>
                <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${efficiencyColors[efficiency as keyof typeof efficiencyColors]}`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  {efficiencyLabels[efficiency as keyof typeof efficiencyLabels]}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Add Manual Entry</span>
                </button>

                {showManualEntry && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top duration-300">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 60"
                        value={manualDuration}
                        onChange={(e) => setManualDuration(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-0 transition-colors"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleManualEntry}
                        disabled={!manualDuration || !isFormValid}
                        className={`
                          flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                          ${(!manualDuration || !isFormValid)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                          }
                        `}
                      >
                        Save Session
                      </button>
                      <button
                        onClick={() => setShowManualEntry(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Bar */}
          {!isFormValid && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-amber-500 mt-0.5">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Complete all fields to start timer</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Please select an exam, enter a subject, and specify a topic before starting your study session.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
