import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Bell, Plus, X, Play, Pause, Settings, Volume2, VolumeX, 
  Coffee, BookOpen, Target, Zap, Brain, Timer, Calendar, ChevronDown,
  Check, Edit3, Trash2, Moon, Sun, Lightbulb, AlertTriangle, 
  Repeat, SkipForward, RotateCcw, Focus
} from 'lucide-react';

interface Alarm {
  id: string;
  name: string;
  time: string;
  days: string[];
  type: 'study' | 'break' | 'exam' | 'focus' | 'sleep';
  sound: string;
  enabled: boolean;
  snoozeEnabled: boolean;
  snoozeMinutes: number;
  repeat: boolean;
  vibrate: boolean;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  customMessage?: string;
}

interface AlarmSound {
  id: string;
  name: string;
  file: string;
  type: 'gentle' | 'energetic' | 'nature' | 'custom';
}

const ALARM_SOUNDS: AlarmSound[] = [
  { id: 'gentle-chime', name: 'Gentle Chime', file: 'chime.mp3', type: 'gentle' },
  { id: 'forest-birds', name: 'Forest Birds', file: 'birds.mp3', type: 'nature' },
  { id: 'ocean-waves', name: 'Ocean Waves', file: 'waves.mp3', type: 'nature' },
  { id: 'focus-tone', name: 'Focus Tone', file: 'focus.mp3', type: 'energetic' },
  { id: 'study-bell', name: 'Study Bell', file: 'bell.mp3', type: 'gentle' },
  { id: 'energy-boost', name: 'Energy Boost', file: 'energy.mp3', type: 'energetic' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ALARM_TYPES = [
  { id: 'study', name: 'Study Session', icon: BookOpen, color: 'blue', description: 'Start focused study time' },
  { id: 'break', name: 'Break Time', icon: Coffee, color: 'green', description: 'Take a well-deserved break' },
  { id: 'exam', name: 'Exam Reminder', icon: Target, color: 'red', description: 'Important exam coming up' },
  { id: 'focus', name: 'Deep Focus', icon: Brain, color: 'purple', description: 'Enter deep focus mode' },
  { id: 'sleep', name: 'Sleep Time', icon: Moon, color: 'indigo', description: 'Time for rest and recovery' },
];

export const AlarmSystem: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Initialize alarm system
  useEffect(() => {
    // Load saved alarms
    const savedAlarms = localStorage.getItem('studyAlarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/alarm-worker.js')
        .catch(console.error);
    }

    // Start time tracking
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('studyAlarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check for triggered alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1]; // Adjust for Monday start

      alarms.forEach(alarm => {
        if (
          alarm.enabled &&
          alarm.time === currentTimeString &&
          alarm.days.includes(currentDay) &&
          !activeAlarm
        ) {
          triggerAlarm(alarm);
        }
      });
    };

    intervalRef.current = setInterval(checkAlarms, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alarms, activeAlarm]);

  const triggerAlarm = (alarm: Alarm) => {
    setActiveAlarm(alarm);
    
    // Play sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }

    // Show browser notification
    if (Notification.permission === 'granted') {
      const notification = new Notification(`${alarm.name}`, {
        body: alarm.customMessage || getDefaultMessage(alarm.type),
        icon: '/icons/alarm-icon.png',
        badge: '/icons/study-badge.png',
        tag: alarm.id,
        requireInteraction: true,
        vibrate: alarm.vibrate ? [200, 100, 200] : undefined,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 30 seconds if not interacted with
      setTimeout(() => {
        notification.close();
      }, 30000);
    }

    // Vibrate on mobile devices
    if (alarm.vibrate && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const getDefaultMessage = (type: string) => {
    switch (type) {
      case 'study': return 'Time to start your focused study session! 📚';
      case 'break': return 'Take a break! Your brain needs to recharge ☕';
      case 'exam': return 'Exam reminder! Review your preparation 🎯';
      case 'focus': return 'Enter deep focus mode for maximum productivity 🧠';
      case 'sleep': return 'Time to rest! Good sleep improves learning 🌙';
      default: return 'Study reminder notification';
    }
  };

  const dismissAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveAlarm(null);
  };

  const snoozeAlarm = () => {
    if (activeAlarm) {
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + activeAlarm.snoozeMinutes);
      
      const snoozeAlarm: Alarm = {
        ...activeAlarm,
        id: `snooze-${Date.now()}`,
        time: `${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`,
        days: [DAYS[snoozeTime.getDay() === 0 ? 6 : snoozeTime.getDay() - 1]],
        repeat: false,
      };

      setAlarms(prev => [...prev, snoozeAlarm]);
    }
    dismissAlarm();
  };

  const addAlarm = (alarmData: Partial<Alarm>) => {
    const newAlarm: Alarm = {
      id: `alarm-${Date.now()}`,
      name: alarmData.name || 'New Alarm',
      time: alarmData.time || '09:00',
      days: alarmData.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      type: alarmData.type || 'study',
      sound: alarmData.sound || 'gentle-chime',
      enabled: true,
      snoozeEnabled: alarmData.snoozeEnabled ?? true,
      snoozeMinutes: alarmData.snoozeMinutes || 5,
      repeat: alarmData.repeat ?? true,
      vibrate: alarmData.vibrate ?? true,
      priority: alarmData.priority || 'medium',
      tags: alarmData.tags || [],
      customMessage: alarmData.customMessage,
    };

    setAlarms(prev => [...prev, newAlarm]);
    setShowAddForm(false);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = ALARM_TYPES.find(t => t.id === type);
    return typeConfig?.icon || Clock;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = ALARM_TYPES.find(t => t.id === type);
    return typeConfig?.color || 'gray';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-xl">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Smart Alarm System</h2>
            <p className="text-gray-600 dark:text-gray-400">Advanced study reminders and focus tools</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-xl font-bold transition-all duration-300 ${
              soundEnabled 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Alarm
          </button>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-50 dark:to-gray-100 rounded-3xl p-8 text-center shadow-2xl">
        <div className="text-6xl md:text-7xl font-black text-white dark:text-gray-900 mb-4 font-mono tracking-wider">
          {currentTime.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div className="text-lg text-gray-300 dark:text-gray-600 font-semibold">
          {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Active Alarm Modal */}
      {activeAlarm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-pulse">
            <div className="text-center mb-8">
              <div className={`p-6 bg-gradient-to-br from-${getTypeColor(activeAlarm.type)}-100 to-${getTypeColor(activeAlarm.type)}-200 dark:from-${getTypeColor(activeAlarm.type)}-900/30 dark:to-${getTypeColor(activeAlarm.type)}-800/30 rounded-full inline-block mb-4`}>
                {React.createElement(getTypeIcon(activeAlarm.type), {
                  className: `w-12 h-12 text-${getTypeColor(activeAlarm.type)}-600 dark:text-${getTypeColor(activeAlarm.type)}-400`
                })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {activeAlarm.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeAlarm.customMessage || getDefaultMessage(activeAlarm.type)}
              </p>
              <div className="text-4xl font-black text-gray-900 dark:text-gray-100 mt-4">
                {activeAlarm.time}
              </div>
            </div>
            
            <div className="flex gap-4">
              {activeAlarm.snoozeEnabled && (
                <button
                  onClick={snoozeAlarm}
                  className="flex-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Snooze {activeAlarm.snoozeMinutes}m
                </button>
              )}
              
              <button
                onClick={dismissAlarm}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ALARM_TYPES.slice(0, 4).map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                const quickTime = new Date();
                quickTime.setMinutes(quickTime.getMinutes() + (type.id === 'break' ? 25 : 60));
                addAlarm({
                  name: `Quick ${type.name}`,
                  time: `${quickTime.getHours().toString().padStart(2, '0')}:${quickTime.getMinutes().toString().padStart(2, '0')}`,
                  type: type.id as any,
                  days: [DAYS[quickTime.getDay() === 0 ? 6 : quickTime.getDay() - 1]],
                  repeat: false,
                });
              }}
              className={`p-6 bg-gradient-to-br from-${type.color}-50 to-${type.color}-100 dark:from-${type.color}-900/20 dark:to-${type.color}-800/20 border border-${type.color}-200/50 dark:border-${type.color}-700/50 rounded-2xl hover:shadow-lg transition-all duration-300 group`}
            >
              <Icon className={`w-8 h-8 text-${type.color}-600 dark:text-${type.color}-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className={`font-bold text-${type.color}-900 dark:text-${type.color}-300 text-sm`}>
                Quick {type.name}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Alarms List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your Alarms ({alarms.length})
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {alarms.filter(a => a.enabled).length} active
          </div>
        </div>

        {alarms.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-6 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl inline-block mb-4">
              <Bell className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2">
              No Alarms Set
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first alarm to stay on track with your studies
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
            >
              Create First Alarm
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alarms.map((alarm) => {
              const Icon = getTypeIcon(alarm.type);
              const color = getTypeColor(alarm.type);
              
              return (
                <div
                  key={alarm.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    alarm.enabled
                      ? `border-${color}-200/60 dark:border-${color}-700/60 bg-gradient-to-r from-${color}-50/50 to-transparent dark:from-${color}-900/10 dark:to-transparent`
                      : 'border-gray-200/60 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 bg-gradient-to-br from-${color}-100 to-${color}-200 dark:from-${color}-900/30 dark:to-${color}-800/30 rounded-xl`}>
                        <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {alarm.name}
                          </h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}>
                            {ALARM_TYPES.find(t => t.id === alarm.type)?.name}
                          </span>
                        </div>
                        
                        <div className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-3">
                          {alarm.time}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {alarm.days.map((day) => (
                            <span
                              key={day}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {alarm.repeat && (
                            <div className="flex items-center gap-1">
                              <Repeat className="w-4 h-4" />
                              <span>Repeats</span>
                            </div>
                          )}
                          {alarm.snoozeEnabled && (
                            <div className="flex items-center gap-1">
                              <Timer className="w-4 h-4" />
                              <span>{alarm.snoozeMinutes}m snooze</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            <span>{ALARM_SOUNDS.find(s => s.id === alarm.sound)?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          alarm.enabled
                            ? `bg-${color}-600`
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            alarm.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      
                      <button
                        onClick={() => deleteAlarm(alarm.id)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Alarm Form Modal */}
      {showAddForm && (
        <AlarmForm
          onSave={addAlarm}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Hidden audio element for alarm sounds */}
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        src="/sounds/gentle-chime.mp3"
      />
    </div>
  );
};

// Separate AlarmForm component for adding new alarms
const AlarmForm: React.FC<{
  onSave: (alarm: Partial<Alarm>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Alarm>>({
    name: '',
    time: '09:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    type: 'study',
    sound: 'gentle-chime',
    snoozeEnabled: true,
    snoozeMinutes: 5,
    repeat: true,
    vibrate: true,
    priority: 'medium',
    customMessage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.time) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Alarm</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Alarm Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Morning Math Study"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {ALARM_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              Repeat on Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    const newDays = formData.days?.includes(day)
                      ? formData.days.filter(d => d !== day)
                      : [...(formData.days || []), day];
                    setFormData(prev => ({ ...prev, days: newDays }));
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                    formData.days?.includes(day)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Alarm Sound
              </label>
              <select
                value={formData.sound}
                onChange={(e) => setFormData(prev => ({ ...prev, sound: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {ALARM_SOUNDS.map((sound) => (
                  <option key={sound.id} value={sound.id}>
                    {sound.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Snooze Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.snoozeMinutes}
                onChange={(e) => setFormData(prev => ({ ...prev, snoozeMinutes: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="font-medium text-gray-900 dark:text-gray-100">Enable Snooze</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, snoozeEnabled: !prev.snoozeEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.snoozeEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.snoozeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="font-medium text-gray-900 dark:text-gray-100">Repeat Weekly</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, repeat: !prev.repeat }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.repeat ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.repeat ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <span className="font-medium text-gray-900 dark:text-gray-100">Vibration</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, vibrate: !prev.vibrate }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  formData.vibrate ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    formData.vibrate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={formData.customMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add a custom motivational message..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Create Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
