export interface Alarm {
  id: string;
  title: string;
  time: string; // HH:MM format
  enabled: boolean;
  soundType: AlarmSoundType;
  customSoundUri?: string;
  repeatDays: RepeatDay[];
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  vibrationEnabled: boolean;
  vibrationPattern: VibrationPattern;
  createdAt: string;
  updatedAt: string;
  description?: string;
  category: AlarmCategory;
}

export type AlarmSoundType = 
  | 'gentle_wake' 
  | 'classic_bell' 
  | 'nature_sounds' 
  | 'focus_chime' 
  | 'study_bell' 
  | 'urgent_alert' 
  | 'custom';

export type AlarmCategory = 
  | 'study_session'
  | 'break_reminder'
  | 'exam_preparation'
  | 'wake_up'
  | 'medication'
  | 'general';

export type RepeatDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type VibrationPattern = 'short' | 'long' | 'pulse' | 'custom';

export interface AlarmNotification {
  alarmId: string;
  scheduledTime: Date;
  notificationId: string;
}

export interface AlarmSound {
  type: AlarmSoundType;
  name: string;
  uri: string;
  duration: number; // seconds
  volume: number; // 0-1
}]
