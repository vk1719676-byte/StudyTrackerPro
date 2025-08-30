interface FocusData {
  sessionsCompleted: number;
  currentStreak: number;
  studyHistory: any[];
  pomodoroCount: number;
  pomodoroSettings: any;
}

export class StorageService {
  private focusDataKey = 'focus-mode-data';

  async saveFocusData(data: FocusData): Promise<void> {
    try {
      localStorage.setItem(this.focusDataKey, JSON.stringify({
        ...data,
        lastSaved: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save focus data:', error);
    }
  }

  async loadFocusData(): Promise<FocusData | null> {
    try {
      const stored = localStorage.getItem(this.focusDataKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load focus data:', error);
      return null;
    }
  }

  async clearFocusData(): Promise<void> {
    try {
      localStorage.removeItem(this.focusDataKey);
    } catch (error) {
      console.error('Failed to clear focus data:', error);
    }
  }

  async exportData(): Promise<string> {
    const data = await this.loadFocusData();
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      await this.saveFocusData(data);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}
