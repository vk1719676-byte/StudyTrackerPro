import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface Alarm {
  id: string;
  name: string;
  time: string; // HH:MM format
  isActive: boolean;
  sound: string;
  volume: number;
  daysOfWeek: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  snoozeEnabled: boolean;
  snoozeInterval: number; // minutes
}

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  snoozeAlarm: (id: string) => void;
  dismissAlarm: (id: string) => void;
  currentAlarm: string | null;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarm = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};

const ALARM_SOUNDS = [
  { id: 'gentle', name: 'Gentle Bell', emoji: '🔔' },
  { id: 'nature', name: 'Nature Sounds', emoji: '🌿' },
  { id: 'classical', name: 'Classical', emoji: '🎵' },
  { id: 'digital', name: 'Digital Beep', emoji: '💻' },
  { id: 'urgent', name: 'Urgent Alert', emoji: '🚨' }
];

export const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentAlarm, setCurrentAlarm] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load alarms from localStorage
  useEffect(() => {
    const savedAlarms = localStorage.getItem('studyAlarms');
    if (savedAlarms) {
      setAlarms(JSON.parse(savedAlarms));
    }
  }, []);

  // Save alarms to localStorage
  useEffect(() => {
    localStorage.setItem('studyAlarms', JSON.stringify(alarms));
  }, [alarms]);

  // Check for alarms every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay();

      alarms.forEach(alarm => {
        if (alarm.isActive && 
            alarm.time === currentTime && 
            alarm.daysOfWeek[currentDay] &&
            now.getSeconds() === 0) { // Only trigger once per minute
          triggerAlarm(alarm.id);
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [alarms]);

  const triggerAlarm = useCallback((alarmId: string) => {
    const alarm = alarms.find(a => a.id === alarmId);
    if (!alarm) return;

    setCurrentAlarm(alarmId);

    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = alarm.volume / 100;
    audioRef.current.loop = true;

    // Generate alarm sound based on type
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different sounds
    const frequencies: { [key: string]: number } = {
      gentle: 440,
      nature: 523.25,
      classical: 659.25,
      digital: 880,
      urgent: 1046.5
    };
    
    oscillator.frequency.setValueAtTime(frequencies[alarm.sound] || 440, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(alarm.volume / 100, audioContext.currentTime);
    
    oscillator.start();
    
    // Stop after 30 seconds if not dismissed
    setTimeout(() => {
      if (currentAlarm === alarmId) {
        oscillator.stop();
        setCurrentAlarm(null);
      }
    }, 30000);

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Study Alarm: ${alarm.name}`, {
        body: `Time: ${alarm.time}`,
        icon: '/favicon.ico',
        requireInteraction: true
      });
    }

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, [alarms, currentAlarm]);

  const addAlarm = useCallback((alarmData: Omit<Alarm, 'id'>) => {
    const newAlarm: Alarm = {
      ...alarmData,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, newAlarm]);
  }, []);

  const updateAlarm = useCallback((id: string, updates: Partial<Alarm>) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    ));
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  }, []);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  }, []);

  const snoozeAlarm = useCallback((id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (!alarm || !alarm.snoozeEnabled) return;

    // Stop current alarm
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentAlarm(null);

    // Schedule snooze
    setTimeout(() => {
      triggerAlarm(id);
    }, alarm.snoozeInterval * 60 * 1000);
  }, [alarms, triggerAlarm]);

  const dismissAlarm = useCallback((id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentAlarm(null);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AlarmContext.Provider value={{
      alarms,
      addAlarm,
      updateAlarm,
      deleteAlarm,
      toggleAlarm,
      snoozeAlarm,
      dismissAlarm,
      currentAlarm
    }}>
      {children}
    </AlarmContext.Provider>
  );
};

export { ALARM_SOUNDS };
