export interface NotificationOptions {
  requireInteraction?: boolean;
  actions?: Array<{ action: string; title: string }>;
}

export class NotificationService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    this.isInitialized = true;
  }

  async sendNotification(
    title: string, 
    body: string, 
    options: NotificationOptions = {}
  ): Promise<void> {
    if (!this.isInitialized || Notification.permission !== 'granted') {
      console.warn('Notifications not available');
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: options.requireInteraction || false,
        tag: 'focus-timer',
        timestamp: Date.now(),
        silent: false
      });

      // Auto-close after 5 seconds unless interaction is required
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Handle notification clicks
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async sendProgressUpdate(timeRemaining: string, mode: string): Promise<void> {
    const emoji = mode === 'focus' || mode === 'custom' ? '🎯' : '☕';
    const action = mode === 'focus' || mode === 'custom' ? 'Focus session' : 'Break time';
    
    await this.sendNotification(
      `${emoji} ${action} in progress`,
      `${timeRemaining} remaining. Keep up the great work!`,
      { requireInteraction: false }
    );
  }
}
