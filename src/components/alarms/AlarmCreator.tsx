import React, { useState, useEffect } from 'react';
import { X, Clock, Bell, Volume2, Repeat, Calendar, AlertCircle, Play, Pause, BookOpen } from 'lucide-react';
import { Alarm, alarmService } from '../../services/alarmService';

interface AlarmCreatorProps {
  alarm?: Alarm | null;
  exams: any[];
  onSave: (alarmData: any) => void;
  onCancel: () => void;
}

export const AlarmCreator: React.FC<AlarmCreatorProps> = ({ alarm, exams, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '09:00',
    days: [] as number[],
    type: 'study' as 'study' | 'break' | 'exam' | 'reminder' | 'focus',
    sound: '/sounds/gentle-chime.mp3',
    volume: 70,
    enabled: true,
    snoozeEnabled: true,
    snoozeInterval: 5,
    vibrate: true,
    examId: '',
    repeatInterval: 'daily' as 'none' | 'daily' | 'weekly' | 'weekdays' | 'custom',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    icon: '⏰',
    color: 'blue'
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (alarm) {
      setFormData({
        title: alarm.title,
        description: alarm.description || '',
        time: alarm.time,
        days: alarm.days,
        type: alarm.type,
        sound: alarm.sound,
        volume: alarm.volume,
        enabled: alarm.enabled,
        snoozeEnabled: alarm.snoozeEnabled,
        snoozeInterval: alarm.snoozeInterval,
        vibrate: alarm.vibrate,
        examId: alarm.examId || '',
        repeatInterval: alarm.repeatInterval || 'daily',
        priority: alarm.priority,
        icon: alarm.icon,
        color: alarm.color
      });
    }
  }, [alarm]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day].sort()
    }));
  };

  const playPreview = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        return;
      }

      const newAudio = new Audio(formData.sound);
      newAudio.volume = formData.volume / 100;
      setAudio(newAudio);

      await newAudio.play();
      setIsPlaying(true);

      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (newAudio && !newAudio.paused) {
          newAudio.pause();
          newAudio.currentTime = 0;
          setIsPlaying(false);
        }
      }, 5000);
    } catch (error) {
      console.error('Failed to play preview:', error);
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    // Auto-set icon based on type
    const typeIcons = {
      study: '📚',
      break: '☕',
      exam: '📝',
      focus: '🎯',
      reminder: '⏰'
    };

    onSave({
      ...formData,
      icon: typeIcons[formData.type] || '⏰',
      title: formData.title.trim(),
      description: formData.description.trim() || undefined
    });
  };

  const alarmTypes = [
    { id: 'study', name: 'Study Session', icon: '📚', color: 'blue' },
    { id: 'break', name: 'Break Reminder', icon: '☕', color: 'green' },
    { id: 'exam', name: 'Exam Alert', icon: '📝', color: 'red' },
    { id: 'focus', name: 'Focus Time', icon: '🎯', color: 'purple' },
    { id: 'reminder', name: 'General Reminder', icon: '⏰', color: 'gray' }
  ];

  const builtInSounds = alarmService.getBuiltInSounds();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {alarm ? 'Edit Alarm' : 'Create New Alarm'}
                </h2>
                <p className="text-white/80">Set up your smart reminder</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div className="space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter alarm title..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add more details..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Time and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Alarm Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Alarm Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {alarmTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('type', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === type.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {type.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Selection for Exam Type */}
            {formData.type === 'exam' && exams.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Related Exam
                </label>
                <select
                  value={formData.examId}
                  onChange={(e) => handleInputChange('examId', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select an exam (optional)</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} - {exam.subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                <Calendar className="w-4 h-4 inline mr-1" />
                Repeat Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDayToggle(index)}
                    className={`p-3 rounded-xl border-2 text-sm font-bold transition-all duration-200 ${
                      formData.days.includes(index)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Alarm Sound
                </label>
                <div className="space-y-2">
                  <select
                    value={formData.sound}
                    onChange={(e) => handleInputChange('sound', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {builtInSounds.map((sound) => (
                      <option key={sound.id} value={sound.url}>
                        {sound.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={playPreview}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 rounded-xl font-medium transition-all duration-200"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Stop Preview' : 'Play Preview'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Volume2 className="w-4 h-4 inline mr-1" />
                  Volume: {formData.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.volume}
                  onChange={(e) => handleInputChange('volume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">Enable Snooze</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Allow snoozing this alarm</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.snoozeEnabled}
                    onChange={(e) => handleInputChange('snoozeEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {formData.snoozeEnabled && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Snooze Interval (minutes)
                  </label>
                  <select
                    value={formData.snoozeInterval}
                    onChange={(e) => handleInputChange('snoozeInterval', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={1}>1 minute</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <div className="font-bold text-gray-900 dark:text-gray-100">Vibrate</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Vibrate device when alarm triggers</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vibrate}
                    onChange={(e) => handleInputChange('vibrate', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.title.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {alarm ? 'Update Alarm' : 'Create Alarm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
