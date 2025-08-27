interface TimerState {
  isRunning: boolean;
  time: number;
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'custom';
  startTime: number;
  subject: string;
  task: string;
  targetTime: number;
  lastUpdated?: number;
}

export class BackgroundTimerService {
  private static readonly STORAGE_KEY = 'focusTimerState';
  private static readonly BACKGROUND_CHECK_INTERVAL = 30000; // 30 seconds

  private backgroundInterval?: number;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Register visibility change handler
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Register beforeunload handler for cleanup
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    this.isInitialized = true;
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.startBackgroundSync();
    } else {
      this.stopBackgroundSync();
    }
  }

  private handleBeforeUnload(): void {
    // Save current state before page unload
    const currentState = this.loadTimerState();
    if (currentState && currentState.isRunning) {
      this.saveTimerState({
        ...currentState,
        lastUpdated: Date.now()
      });
    }
  }

  private startBackgroundSync(): void {
    if (this.backgroundInterval) return;

    this.backgroundInterval = window.setInterval(() => {
      const state = this.loadTimerState();
      if (state && state.isRunning) {
        // Calculate elapsed time and update
        const now = Date.now();
        const elapsed = state.lastUpdated ? Math.floor((now - state.lastUpdated) / 1000) : 0;
        const newTime = Math.min(state.time + elapsed, state.targetTime * 60);
        
        this.saveTimerState({
          ...state,
          time: newTime,
          lastUpdated: now
        });

        // Update document title
        this.updateDocumentTitle(state, newTime);
      }
    }, BackgroundTimerService.BACKGROUND_CHECK_INTERVAL);
  }

  private stopBackgroundSync(): void {
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
      this.backgroundInterval = undefined;
    }
  }

  private updateDocumentTitle(state: TimerState, currentTime: number): void {
    const remainingTime = Math.max(0, state.targetTime * 60 - currentTime);
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const modeEmoji = {
      focus: '🎯',
      custom: '⚙️',
      shortBreak: '☕',
      longBreak: '☕'
    }[state.mode];

    const modeText = {
      focus: 'Focus',
      custom: 'Custom',
      shortBreak: 'Break',
      longBreak: 'Long Break'
    }[state.mode];

    document.title = `${timeString} - ${modeEmoji} ${modeText} | ${state.subject || 'Study Timer'}`;
  }

  saveTimerState(state: TimerState): void {
    try {
      const stateToSave = {
        ...state,
        lastUpdated: Date.now()
      };
      localStorage.setItem(BackgroundTimerService.STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save timer state:', error);
    }
  }

  loadTimerState(): TimerState | null {
    try {
      const saved = localStorage.getItem(BackgroundTimerService.STORAGE_KEY);
      if (!saved) return null;

      const state: TimerState = JSON.parse(saved);
      
      // If timer was running, calculate elapsed time
      if (state.isRunning && state.lastUpdated) {
        const elapsed = Math.floor((Date.now() - state.lastUpdated) / 1000);
        state.time = Math.min(state.time + elapsed, state.targetTime * 60);
      }

      return state;
    } catch (error) {
      console.warn('Failed to load timer state:', error);
      return null;
    }
  }

  updateTimer(state: TimerState): void {
    this.saveTimerState(state);
  }

  startTimer(state: TimerState): void {
    this.saveTimerState({
      ...state,
      isRunning: true,
      lastUpdated: Date.now()
    });
  }

  stopTimer(): void {
    const state = this.loadTimerState();
    if (state) {
      this.saveTimerState({
        ...state,
        isRunning: false,
        lastUpdated: Date.now()
      });
    }
  }

  clearTimerState(): void {
    try {
      localStorage.removeItem(BackgroundTimerService.STORAGE_KEY);
      
      // Reset document title
      if (document.title.includes('|')) {
        const originalTitle = document.title.split('|').pop()?.trim() || 'Focus Timer';
        document.title = originalTitle;
      }
    } catch (error) {
      console.warn('Failed to clear timer state:', error);
    }
  }

  // Get current timer progress for external access
  getTimerProgress(): { time: number; targetTime: number; progress: number } | null {
    const state = this.loadTimerState();
    if (!state) return null;

    return {
      time: state.time,
      targetTime: state.targetTime,
      progress: Math.min((state.time / (state.targetTime * 60)) * 100, 100)
    };
  }

  // Check if timer is currently running
  isTimerRunning(): boolean {
    const state = this.loadTimerState();
    return state ? state.isRunning : false;
  }
}
