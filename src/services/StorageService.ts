interface FocusData {
  sessionsCompleted: number;
  currentStreak: number;
  studyHistory: Array<{
    id: string;
    subject: string;
    task: string;
    duration: number;
    completedAt: Date;
    mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom';
  }>;
  pomodoroCount: number;
  pomodoroSettings: {
    focus: number;
    shortBreak: number;
    longBreak: number;
    custom: number;
  };
  musicSettings?: {
    volume: number;
    showPlayer: boolean;
    currentTrack: number;
    ambientSound: string | null;
    ambientVolume: number;
  };
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    backgroundMode: boolean;
    autoStartBreaks: boolean;
  };
}

export class StorageService {
  private static readonly FOCUS_DATA_KEY = 'studentFocusTimer';
  private static readonly SETTINGS_KEY = 'focusTimerSettings';
  private static readonly ANALYTICS_KEY = 'focusTimerAnalytics';

  async saveFocusData(data: Partial<FocusData>): Promise<void> {
    try {
      const existing = await this.loadFocusData();
      const merged = { ...existing, ...data };
      localStorage.setItem(StorageService.FOCUS_DATA_KEY, JSON.stringify(merged));
    } catch (error) {
      console.warn('Failed to save focus data:', error);
    }
  }

  async loadFocusData(): Promise<FocusData | null> {
    try {
      const saved = localStorage.getItem(StorageService.FOCUS_DATA_KEY);
      if (!saved) return null;
      
      const data = JSON.parse(saved);
      
      // Convert date strings back to Date objects
      if (data.studyHistory) {
        data.studyHistory = data.studyHistory.map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt)
        }));
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to load focus data:', error);
      return null;
    }
  }

  async saveSettings(settings: any): Promise<void> {
    try {
      localStorage.setItem(StorageService.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  async loadSettings(): Promise<any> {
    try {
      const saved = localStorage.getItem(StorageService.SETTINGS_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load settings:', error);
      return null;
    }
  }

  // Analytics and statistics
  async saveAnalytics(analytics: any): Promise<void> {
    try {
      const existing = await this.loadAnalytics();
      const merged = { ...existing, ...analytics };
      localStorage.setItem(StorageService.ANALYTICS_KEY, JSON.stringify(merged));
    } catch (error) {
      console.warn('Failed to save analytics:', error);
    }
  }

  async loadAnalytics(): Promise<any> {
    try {
      const saved = localStorage.getItem(StorageService.ANALYTICS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Failed to load analytics:', error);
      return {};
    }
  }

  // Data export and import
  async exportData(): Promise<string> {
    try {
      const focusData = await this.loadFocusData();
      const settings = await this.loadSettings();
      const analytics = await this.loadAnalytics();
      
      const exportData = {
        focusData,
        settings,
        analytics,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.warn('Failed to export data:', error);
      throw error;
    }
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.focusData) {
        await this.saveFocusData(data.focusData);
      }
      
      if (data.settings) {
        await this.saveSettings(data.settings);
      }
      
      if (data.analytics) {
        await this.saveAnalytics(data.analytics);
      }
    } catch (error) {
      console.warn('Failed to import data:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(StorageService.FOCUS_DATA_KEY);
      localStorage.removeItem(StorageService.SETTINGS_KEY);
      localStorage.removeItem(StorageService.ANALYTICS_KEY);
      localStorage.removeItem('focusTimerState'); // Clear timer state too
    } catch (error) {
      console.warn('Failed to clear data:', error);
      throw error;
    }
  }

  // Data statistics
  async getDataSize(): Promise<{ total: number; breakdown: Record<string, number> }> {
    const breakdown: Record<string, number> = {};
    let total = 0;

    try {
      const keys = [
        StorageService.FOCUS_DATA_KEY,
        StorageService.SETTINGS_KEY,
        StorageService.ANALYTICS_KEY,
        'focusTimerState'
      ];

      for (const key of keys) {
        const data = localStorage.getItem(key);
        const size = data ? new Blob([data]).size : 0;
        breakdown[key] = size;
        total += size;
      }

      return { total, breakdown };
    } catch (error) {
      console.warn('Failed to calculate data size:', error);
      return { total: 0, breakdown: {} };
    }
  }
}
