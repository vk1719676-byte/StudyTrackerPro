import { Store } from '@tinybase/store';

export interface FocusSession {
  id: string;
  startTime: number;
  duration: number; // in minutes
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom';
  subject?: string;
  task?: string;
  pomodoroCount: number;
  isActive: boolean;
}

class SessionStorageService {
  private store: Store;
  private readonly SESSION_KEY = 'activeFocusSession';

  constructor() {
    this.store = new Store();
  }

  saveSession(session: FocusSession): void {
    try {
      this.store.setTable('sessions', {
        [this.SESSION_KEY]: session
      });
      localStorage.setItem('tinybase_sessions', JSON.stringify(this.store.getTables()));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  getActiveSession(): FocusSession | null {
    try {
      const stored = localStorage.getItem('tinybase_sessions');
      if (!stored) return null;

      const data = JSON.parse(stored);
      this.store.setTables(data);
      
      const session = this.store.getRow('sessions', this.SESSION_KEY) as FocusSession | undefined;
      return session && session.isActive ? session : null;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  clearSession(): void {
    try {
      this.store.delRow('sessions', this.SESSION_KEY);
      localStorage.setItem('tinybase_sessions', JSON.stringify(this.store.getTables()));
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  calculateRemainingTime(session: FocusSession): number {
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const totalDuration = session.duration * 60;
    return Math.max(0, totalDuration - elapsed);
  }

  isSessionExpired(session: FocusSession): boolean {
    return this.calculateRemainingTime(session) <= 0;
  }
}

export const sessionStorage = new SessionStorageService();
