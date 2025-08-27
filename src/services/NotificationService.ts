export class NotificationService {
  private permission: NotificationPermission = 'default';
  private notificationQueue: Array<{ title: string; body: string; options: NotificationOptions }> = [];

  async initialize(): Promise<void> {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  async sendNotification(
    title: string, 
    body: string, 
    options: {
      requireInteraction?: boolean;
      silent?: boolean;
      actions?: Array<{ action: string; title: string }>;
      tag?: string;
    } = {}
  ): Promise<void> {
    // Enhanced notification options
    const notificationOptions: NotificationOptions = {
      body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      tag: options.tag || 'focus-timer',
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
      actions: options.actions || [],
      data: {
        timestamp: Date.now(),
        url: window.location.origin
      },
      vibrate: [200, 100, 200], // Vibration pattern for mobile
      renotify: true
    };

    if (this.permission === 'granted') {
      try {
        const notification = new Notification(title, notificationOptions);
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-close non-urgent notifications
        if (!notificationOptions.requireInteraction) {
          setTimeout(() => notification.close(), 5000);
        }

        // Play notification sound for important alerts
        if (options.requireInteraction) {
          this.playNotificationSound();
        }

        return;
      } catch (error) {
        console.warn('Notification API failed:', error);
      }
    }

    // Fallback: Add to queue for later or show in-app notification
    this.notificationQueue.push({ title, body, options: notificationOptions });
    this.showInAppNotification(title, body);
  }

  private playNotificationSound(): void {
    // Create audio context for notification sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  private showInAppNotification(title: string, body: string): void {
    // Create toast notification element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform transition-all duration-300 translate-x-full';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="flex-1">
          <div class="font-semibold">${title}</div>
          <div class="text-sm opacity-90">${body}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 ml-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }

  async scheduleNotification(
    title: string,
    body: string,
    delay: number,
    options: {
      requireInteraction?: boolean;
      tag?: string;
    } = {}
  ): Promise<void> {
    setTimeout(() => {
      this.sendNotification(title, body, options);
    }, delay);
  }

  clearNotifications(tag?: string): void {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_NOTIFICATIONS',
        tag
      });
    }
  }

  get hasPermission(): boolean {
    return this.permission === 'granted';
  }

  get canNotify(): boolean {
    return 'Notification' in window && this.permission === 'granted';
  }
}
