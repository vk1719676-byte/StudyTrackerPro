interface TimerState {
  isRunning: boolean;
  time: number;
  mode: string;
  startTime: number;
  subject: string;
  task: string;
  targetTime: number;
}

export class BackgroundTimerService {
  private timerKey = 'focus-timer-state';
  private lastUpdateKey = 'focus-timer-last-update';
  private worker: Worker | null = null;

  async initialize(): Promise<void> {
    // Create a simple worker for background processing
    if ('Worker' in window) {
      try {
        const workerBlob = new Blob([`
          let timerInterval;
          
          self.onmessage = function(e) {
            const { action, data } = e.data;
            
            if (action === 'start') {
              if (timerInterval) clearInterval(timerInterval);
              
              timerInterval = setInterval(() => {
                self.postMessage({
                  type: 'tick',
                  time: data.time + Math.floor((Date.now() - data.startTime) / 1000)
                });
              }, 1000);
            } else if (action === 'stop') {
              if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
              }
            }
          };
        `], { type: 'application/javascript' });

        this.worker = new Worker(URL.createObjectURL(workerBlob));
        
        this.worker.onmessage = (e) => {
          if (e.data.type === 'tick') {
            this.updateTimerState({ time: e.data.time });
          }
        };
      } catch (error) {
        console.warn('Background worker not available:', error);
      }
    }

    // Set up page visibility handling
    this.setupVisibilityHandling();
  }

  private setupVisibilityHandling(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const timerState = this.loadTimerState();
        if (timerState && timerState.isRunning) {
          localStorage.setItem(this.lastUpdateKey, Date.now().toString());
        }
      } else if (document.visibilityState === 'visible') {
        this.syncWithBackground();
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      const timerState = this.loadTimerState();
      if (timerState && timerState.isRunning) {
        localStorage.setItem(this.lastUpdateKey, Date.now().toString());
      }
    });
  }

  private syncWithBackground(): void {
    const timerState = this.loadTimerState();
    const lastUpdate = localStorage.getItem(this.lastUpdateKey);
    
    if (timerState && timerState.isRunning && lastUpdate) {
      const timePassed = Math.floor((Date.now() - parseInt(lastUpdate)) / 1000);
      const newTime = timerState.time + timePassed;
      
      this.updateTimerState({ time: newTime });
    }
  }

  startTimer(state: TimerState): void {
    this.saveTimerState(state);
    
    if (this.worker) {
      this.worker.postMessage({
        action: 'start',
        data: state
      });
    }
  }

  updateTimer(state: Partial<TimerState>): void {
    this.updateTimerState(state);
  }

  stopTimer(): void {
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
    }
  }

  loadTimerState(): TimerState | null {
    try {
      const stored = localStorage.getItem(this.timerKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveTimerState(state: TimerState): void {
    localStorage.setItem(this.timerKey, JSON.stringify(state));
    localStorage.setItem(this.lastUpdateKey, Date.now().toString());
  }

  private updateTimerState(updates: Partial<TimerState>): void {
    const currentState = this.loadTimerState();
    if (currentState) {
      const newState = { ...currentState, ...updates };
      this.saveTimerState(newState);
    }
  }

  clearTimerState(): void {
    localStorage.removeItem(this.timerKey);
    localStorage.removeItem(this.lastUpdateKey);
    
    if (this.worker) {
      this.worker.postMessage({ action: 'stop' });
    }
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
