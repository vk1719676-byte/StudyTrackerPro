import { Exam, StudySession } from '../types';

export interface Alarm {
  id: string;
  title: string;
  description?: string;
  time: string;
  days: number[];
  type: 'study' | 'break' | 'exam' | 'reminder' | 'focus';
  sound: string;
  volume: number;
  enabled: boolean;
  snoozeEnabled: boolean;
  snoozeInterval: number;
  vibrate: boolean;
  examId?: string;
  userId: string;
  createdAt: Date;
  lastTriggered?: Date;
  repeatInterval?: 'none' | 'daily' | 'weekly' | 'weekdays' | 'custom';
  icon: string;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AlarmSound {
  id: string;
  name: string;
  url: string;
  duration: number;
  type: 'built-in' | 'custom';
  preview?: string;
}

class AlarmService {
  private alarms: Alarm[] = [];
  private audio: HTMLAudioElement | null = null;
  private notificationPermission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializeService();
  }

  private async initializeService() {
    // Request notification permission
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
    }

    // Register service worker for background alarms
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Load saved alarms
    this.loadAlarms();
    
    // Start alarm checking
    this.startAlarmChecker();
  }

  private loadAlarms() {
    const savedAlarms = localStorage.getItem('studyBuddy_alarms');
    if (savedAlarms) {
      this.alarms = JSON.parse(savedAlarms).map((alarm: any) => ({
        ...alarm,
        createdAt: new Date(alarm.createdAt),
        lastTriggered: alarm.lastTriggered ? new Date(alarm.lastTriggered) : undefined
      }));
    }
  }

  private saveAlarms() {
    localStorage.setItem('studyBuddy_alarms', JSON.stringify(this.alarms));
  }

  private startAlarmChecker() {
    setInterval(() => {
      this.checkAlarms();
    }, 1000); // Check every second
  }

  private async checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    for (const alarm of this.alarms) {
      if (!alarm.enabled) continue;

      const shouldTrigger = this.shouldTriggerAlarm(alarm, currentTime, currentDay, now);
      
      if (shouldTrigger) {
        await this.triggerAlarm(alarm);
        alarm.lastTriggered = now;
        this.saveAlarms();
      }
    }
  }

  private shouldTriggerAlarm(alarm: Alarm, currentTime: string, currentDay: number, now: Date): boolean {
    if (alarm.time !== currentTime) return false;

    // Check if already triggered within the last minute to prevent duplicates
    if (alarm.lastTriggered && (now.getTime() - alarm.lastTriggered.getTime()) < 60000) {
      return false;
    }

    // Check day of week for recurring alarms
    if (alarm.days && alarm.days.length > 0) {
      return alarm.days.includes(currentDay);
    }

    return true;
  }

  private async triggerAlarm(alarm: Alarm) {
    // Play sound
    await this.playAlarmSound(alarm);

    // Show notification
    this.showNotification(alarm);

    // Vibrate if supported and enabled
    if (alarm.vibrate && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('alarmTriggered', { 
      detail: { alarm } 
    }));
  }

  private async playAlarmSound(alarm: Alarm) {
    try {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }

      this.audio = new Audio(alarm.sound);
      this.audio.volume = alarm.volume / 100;
      this.audio.loop = true;

      await this.audio.play();

      // Auto-stop after 30 seconds if not manually stopped
      setTimeout(() => {
        if (this.audio && !this.audio.paused) {
          this.stopAlarmSound();
        }
      }, 30000);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  }

  public stopAlarmSound() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  private showNotification(alarm: Alarm) {
    if (this.notificationPermission === 'granted') {
      const notification = new Notification(alarm.title, {
        body: alarm.description || 'Alarm triggered',
        icon: '/icon-192x192.png',
        tag: `alarm-${alarm.id}`,
        requireInteraction: alarm.priority === 'urgent',
        actions: alarm.snoozeEnabled ? [
          { action: 'snooze', title: 'Snooze' },
          { action: 'dismiss', title: 'Dismiss' }
        ] : [
          { action: 'dismiss', title: 'Dismiss' }
        ]
      });

      notification.addEventListener('click', () => {
        window.focus();
        notification.close();
      });
    }
  }

  // Public methods
  public createAlarm(alarmData: Omit<Alarm, 'id' | 'createdAt'>): string {
    const id = `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const alarm: Alarm = {
      id,
      createdAt: new Date(),
      ...alarmData
    };

    this.alarms.push(alarm);
    this.saveAlarms();

    return id;
  }

  public updateAlarm(id: string, updates: Partial<Alarm>): boolean {
    const index = this.alarms.findIndex(alarm => alarm.id === id);
    if (index === -1) return false;

    this.alarms[index] = { ...this.alarms[index], ...updates };
    this.saveAlarms();
    return true;
  }

  public deleteAlarm(id: string): boolean {
    const index = this.alarms.findIndex(alarm => alarm.id === id);
    if (index === -1) return false;

    this.alarms.splice(index, 1);
    this.saveAlarms();
    return true;
  }

  public getAlarms(): Alarm[] {
    return [...this.alarms];
  }

  public getAlarmById(id: string): Alarm | undefined {
    return this.alarms.find(alarm => alarm.id === id);
  }

  public snoozeAlarm(id: string): boolean {
    const alarm = this.getAlarmById(id);
    if (!alarm || !alarm.snoozeEnabled) return false;

    // Stop current sound
    this.stopAlarmSound();

    // Create temporary snoozed alarm
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + alarm.snoozeInterval);
    
    const snoozeAlarm: Alarm = {
      ...alarm,
      id: `snooze_${alarm.id}_${Date.now()}`,
      time: `${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`,
      days: [], // One-time alarm
      title: `⏰ ${alarm.title} (Snoozed)`,
      createdAt: new Date()
    };

    this.alarms.push(snoozeAlarm);
    this.saveAlarms();

    return true;
  }

  // Smart alarm suggestions based on user data
  public generateSmartAlarms(exams: Exam[], sessions: StudySession[]): Partial<Alarm>[] {
    const suggestions: Partial<Alarm>[] = [];

    // Exam deadline reminders
    exams.forEach(exam => {
      const examDate = new Date(exam.date);
      const reminderDates = [
        new Date(examDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week before
        new Date(examDate.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days before
        new Date(examDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
      ];

      reminderDates.forEach((date, index) => {
        if (date > new Date()) {
          suggestions.push({
            title: `📚 ${exam.name} Study Reminder`,
            description: `Time to prepare for your ${exam.subject} exam!`,
            time: '09:00',
            days: [date.getDay()],
            type: 'exam',
            sound: '/sounds/gentle-chime.mp3',
            volume: 70,
            examId: exam.id,
            priority: index === 2 ? 'urgent' : 'high',
            icon: '📚',
            color: 'blue'
          });
        }
      });
    });

    // Study session reminders based on historical data
    if (sessions.length > 0) {
      // Find most productive hours
      const hourCounts = sessions.reduce((acc, session) => {
        const hour = new Date(session.date).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const mostProductiveHour = Object.entries(hourCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      if (mostProductiveHour) {
        suggestions.push({
          title: '🎯 Focus Time!',
          description: 'Your most productive study hour is starting',
          time: `${mostProductiveHour.padStart(2, '0')}:00`,
          days: [1, 2, 3, 4, 5], // Weekdays
          type: 'focus',
          sound: '/sounds/focus-bell.mp3',
          volume: 60,
          priority: 'medium',
          icon: '🎯',
          color: 'green'
        });
      }
    }

    return suggestions;
  }

  public getBuiltInSounds(): AlarmSound[] {
    return [
      {
        id: 'gentle-chime',
        name: 'Gentle Chime',
        url: '/sounds/gentle-chime.mp3',
        duration: 3000,
        type: 'built-in'
      },
      {
        id: 'focus-bell',
        name: 'Focus Bell',
        url: '/sounds/focus-bell.mp3',
        duration: 2500,
        type: 'built-in'
      },
      {
        id: 'study-reminder',
        name: 'Study Reminder',
        url: '/sounds/study-reminder.mp3',
        duration: 4000,
        type: 'built-in'
      },
      {
        id: 'urgent-alert',
        name: 'Urgent Alert',
        url: '/sounds/urgent-alert.mp3',
        duration: 3500,
        type: 'built-in'
      },
      {
        id: 'peaceful-wake',
        name: 'Peaceful Wake',
        url: '/sounds/peaceful-wake.mp3',
        duration: 5000,
        type: 'built-in'
      }
    ];
  }
}

export const alarmService = new AlarmService();
