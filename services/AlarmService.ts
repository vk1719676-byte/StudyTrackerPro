import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { Alarm, AlarmNotification, AlarmSound, AlarmSoundType } from '../types/alarm';

class AlarmService {
  private static instance: AlarmService;
  private alarms: Alarm[] = [];
  private scheduledNotifications: AlarmNotification[] = [];
  private currentSound: Audio.Sound | null = null;

  static getInstance(): AlarmService {
    if (!AlarmService.instance) {
      AlarmService.instance = new AlarmService();
    }
    return AlarmService.instance;
  }

  async initialize() {
    // Configure notifications
    await this.setupNotifications();
    
    // Load saved alarms
    await this.loadAlarms();
    
    // Set up audio
    await this.setupAudio();
  }

  private async setupNotifications() {
    if (Platform.OS !== 'web') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permissions not granted');
      }

      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Set up notification categories for actions
      await Notifications.setNotificationCategoryAsync('alarm', [
        {
          identifier: 'SNOOZE',
          buttonTitle: 'Snooze',
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: 'DISMISS',
          buttonTitle: 'Dismiss',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    }
  }

  private async setupAudio() {
    if (Platform.OS !== 'web') {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
    }
  }

  async createAlarm(alarmData: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Alarm> {
    const alarm: Alarm = {
      ...alarmData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.alarms.push(alarm);
    await this.saveAlarms();
    
    if (alarm.enabled) {
      await this.scheduleAlarmNotification(alarm);
    }

    return alarm;
  }

  async updateAlarm(id: string, updates: Partial<Alarm>): Promise<Alarm | null> {
    const index = this.alarms.findIndex(alarm => alarm.id === id);
    if (index === -1) return null;

    // Cancel existing notifications for this alarm
    await this.cancelAlarmNotification(id);

    const updatedAlarm = {
      ...this.alarms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.alarms[index] = updatedAlarm;
    await this.saveAlarms();

    // Reschedule if enabled
    if (updatedAlarm.enabled) {
      await this.scheduleAlarmNotification(updatedAlarm);
    }

    return updatedAlarm;
  }

  async deleteAlarm(id: string): Promise<boolean> {
    const index = this.alarms.findIndex(alarm => alarm.id === id);
    if (index === -1) return false;

    // Cancel notifications
    await this.cancelAlarmNotification(id);

    // Remove from array
    this.alarms.splice(index, 1);
    await this.saveAlarms();

    return true;
  }

  async toggleAlarm(id: string): Promise<Alarm | null> {
    const alarm = this.alarms.find(a => a.id === id);
    if (!alarm) return null;

    return await this.updateAlarm(id, { enabled: !alarm.enabled });
  }

  getAlarms(): Alarm[] {
    return [...this.alarms];
  }

  getAlarm(id: string): Alarm | null {
    return this.alarms.find(alarm => alarm.id === id) || null;
  }

  private async scheduleAlarmNotification(alarm: Alarm) {
    if (Platform.OS === 'web') return;

    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(Number);

    // If no repeat days, schedule for today or tomorrow
    if (alarm.repeatDays.length === 0) {
      const triggerTime = new Date();
      triggerTime.setHours(hours, minutes, 0, 0);
      
      if (triggerTime <= now) {
        triggerTime.setDate(triggerTime.getDate() + 1);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.title,
          body: alarm.description || 'Time for your alarm!',
          sound: this.getSoundUri(alarm.soundType),
          categoryIdentifier: 'alarm',
          data: { alarmId: alarm.id, type: 'alarm' },
        },
        trigger: triggerTime,
      });

      this.scheduledNotifications.push({
        alarmId: alarm.id,
        scheduledTime: triggerTime,
        notificationId,
      });
    } else {
      // Schedule for each repeat day
      for (const day of alarm.repeatDays) {
        const triggerTime = this.getNextOccurrence(hours, minutes, day);
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: alarm.title,
            body: alarm.description || 'Time for your alarm!',
            sound: this.getSoundUri(alarm.soundType),
            categoryIdentifier: 'alarm',
            data: { alarmId: alarm.id, type: 'alarm', day },
          },
          trigger: {
            weekday: this.getDayNumber(day),
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });

        this.scheduledNotifications.push({
          alarmId: alarm.id,
          scheduledTime: triggerTime,
          notificationId,
        });
      }
    }
  }

  private async cancelAlarmNotification(alarmId: string) {
    const notifications = this.scheduledNotifications.filter(n => n.alarmId === alarmId);
    
    for (const notification of notifications) {
      await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
    }

    this.scheduledNotifications = this.scheduledNotifications.filter(n => n.alarmId !== alarmId);
  }

  async snoozeAlarm(alarmId: string): Promise<void> {
    const alarm = this.getAlarm(alarmId);
    if (!alarm || !alarm.snoozeEnabled) return;

    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + alarm.snoozeDuration);

    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${alarm.title} (Snoozed)`,
          body: alarm.description || 'Time for your alarm!',
          sound: this.getSoundUri(alarm.soundType),
          categoryIdentifier: 'alarm',
          data: { alarmId: alarm.id, type: 'snooze' },
        },
        trigger: snoozeTime,
      });
    }

    await this.stopCurrentSound();
  }

  async playAlarmSound(soundType: AlarmSoundType, customUri?: string): Promise<void> {
    if (Platform.OS === 'web') {
      // Web-based audio playback
      return this.playWebAudio(soundType);
    }

    try {
      await this.stopCurrentSound();

      const soundUri = customUri || this.getSoundUri(soundType);
      const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
      
      this.currentSound = sound;
      
      await sound.setIsLoopingAsync(true);
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  }

  async stopCurrentSound(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    }
  }

  private playWebAudio(soundType: AlarmSoundType): Promise<void> {
    return new Promise((resolve) => {
      // Create web audio context for alarm sounds
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Generate different tones based on sound type
      const frequency = this.getSoundFrequency(soundType);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = this.getOscillatorType(soundType);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);

      oscillator.start();
      
      setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
        setTimeout(() => {
          oscillator.stop();
          resolve();
        }, 100);
      }, 2000);
    });
  }

  private getSoundUri(soundType: AlarmSoundType): string {
    const soundMap: Record<AlarmSoundType, string> = {
      gentle_wake: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
      classic_bell: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3',
      nature_sounds: 'https://www.soundjay.com/nature/sounds/birds-singing-1.mp3',
      focus_chime: 'https://www.soundjay.com/misc/sounds/bell-chime-01.mp3',
      study_bell: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.mp3',
      urgent_alert: 'https://www.soundjay.com/misc/sounds/alarm-01.mp3',
      custom: '',
    };

    return soundMap[soundType] || soundMap.classic_bell;
  }

  private getSoundFrequency(soundType: AlarmSoundType): number {
    const frequencyMap: Record<AlarmSoundType, number> = {
      gentle_wake: 440, // A4
      classic_bell: 523, // C5
      nature_sounds: 330, // E4
      focus_chime: 698, // F5
      study_bell: 587, // D5
      urgent_alert: 880, // A5
      custom: 440,
    };

    return frequencyMap[soundType] || 440;
  }

  private getOscillatorType(soundType: AlarmSoundType): OscillatorType {
    const typeMap: Record<AlarmSoundType, OscillatorType> = {
      gentle_wake: 'sine',
      classic_bell: 'triangle',
      nature_sounds: 'sine',
      focus_chime: 'square',
      study_bell: 'triangle',
      urgent_alert: 'sawtooth',
      custom: 'sine',
    };

    return typeMap[soundType] || 'sine';
  }

  private getNextOccurrence(hours: number, minutes: number, day: string): Date {
    const dayNumbers = {
      sunday: 1, monday: 2, tuesday: 3, wednesday: 4,
      thursday: 5, friday: 6, saturday: 7
    };

    const targetDay = dayNumbers[day as keyof typeof dayNumbers];
    const now = new Date();
    const nextOccurrence = new Date();
    
    nextOccurrence.setHours(hours, minutes, 0, 0);
    
    const daysUntilTarget = (targetDay - now.getDay() + 7) % 7;
    nextOccurrence.setDate(now.getDate() + daysUntilTarget);
    
    if (daysUntilTarget === 0 && nextOccurrence <= now) {
      nextOccurrence.setDate(nextOccurrence.getDate() + 7);
    }

    return nextOccurrence;
  }

  private getDayNumber(day: string): number {
    const dayNumbers = {
      sunday: 1, monday: 2, tuesday: 3, wednesday: 4,
      thursday: 5, friday: 6, saturday: 7
    };
    return dayNumbers[day as keyof typeof dayNumbers] || 1;
  }

  private async saveAlarms(): Promise<void> {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(this.alarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  }

  private async loadAlarms(): Promise<void> {
    try {
      const alarmsData = await AsyncStorage.getItem('alarms');
      if (alarmsData) {
        this.alarms = JSON.parse(alarmsData);
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
      this.alarms = [];
    }
  }

  getAvailableSounds(): AlarmSound[] {
    return [
      {
        type: 'gentle_wake',
        name: 'Gentle Wake',
        uri: this.getSoundUri('gentle_wake'),
        duration: 3,
        volume: 0.7,
      },
      {
        type: 'classic_bell',
        name: 'Classic Bell',
        uri: this.getSoundUri('classic_bell'),
        duration: 2,
        volume: 0.8,
      },
      {
        type: 'nature_sounds',
        name: 'Nature Sounds',
        uri: this.getSoundUri('nature_sounds'),
        duration: 5,
        volume: 0.6,
      },
      {
        type: 'focus_chime',
        name: 'Focus Chime',
        uri: this.getSoundUri('focus_chime'),
        duration: 1,
        volume: 0.9,
      },
      {
        type: 'study_bell',
        name: 'Study Bell',
        uri: this.getSoundUri('study_bell'),
        duration: 2,
        volume: 0.8,
      },
      {
        type: 'urgent_alert',
        name: 'Urgent Alert',
        uri: this.getSoundUri('urgent_alert'),
        duration: 3,
        volume: 1.0,
      },
    ];
  }
}

export default AlarmService;
