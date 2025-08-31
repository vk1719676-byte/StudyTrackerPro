class NotificationService {
  private notificationInterval: number | null = null;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.permission = Notification.permission;
  }

  async requestPermission(): Promise<boolean> {
    if (this.permission === 'granted') return true;

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  showSessionStartNotification(mode: string, duration: number): void {
    if (this.permission !== 'granted') return;

    const title = mode === 'focus' || mode === 'custom' 
      ? '🎯 Focus Session Started' 
      : '☕ Break Time Started';
    
    const body = `${duration} minute ${mode} session is now active. Stay focused!`;

    new Notification(title, {
      body,
      icon: '/vite.svg',
      silent: false,
      requireInteraction: false
    });
  }

  showSessionCompleteNotification(mode: string): void {
    if (this.permission !== 'granted') return;

    const title = mode === 'focus' || mode === 'custom'
      ? '✅ Focus Session Complete!' 
      : '⏰ Break Time Over!';
    
    const body = mode === 'focus' || mode === 'custom'
      ? 'Great work! Time for a well-deserved break.'
      : 'Break time is over. Ready to get back to work?';

    new Notification(title, {
      body,
      icon: '/vite.svg',
      silent: false,
      requireInteraction: true
    });
  }

  showSessionResumedNotification(remainingMinutes: number): void {
    if (this.permission !== 'granted') return;

    new Notification('🔄 Focus Session Resumed', {
      body: `Welcome back! You have ${remainingMinutes} minutes remaining in your session.`,
      icon: '/vite.svg',
      silent: false
    });
  }

  startPersistentReminder(mode: string): void {
    if (this.permission !== 'granted') return;

    // Show reminder every 10 minutes during focus sessions
    if (mode === 'focus' || mode === 'custom') {
      this.notificationInterval = window.setInterval(() => {
        new Notification('💪 Stay Focused!', {
          body: 'You\'re doing great! Keep your focus strong.',
          icon: '/vite.svg',
          silent: true
        });
      }, 10 * 60 * 1000); // 10 minutes
    }
  }

  stopPersistentReminder(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
  }

  isSupported(): boolean {
    return 'Notification' in window;
  }

  hasPermission(): boolean {
    return this.permission === 'granted';
  }
}

export const notificationService = new NotificationService();
