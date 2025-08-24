import OneSignal from 'react-onesignal';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: {
    url: string;
    label: string;
  };
}

class OneSignalService {
  private static instance: OneSignalService;
  private initialized = false;
  private notifications: NotificationData[] = [];
  private notificationListeners: Array<(notifications: NotificationData[]) => void> = [];

  private constructor() {}

  public static getInstance(): OneSignalService {
    if (!OneSignalService.instance) {
      OneSignalService.instance = new OneSignalService();
    }
    return OneSignalService.instance;
  }

  public async initialize(appId: string): Promise<void> {
    if (this.initialized) return;

    try {
      await OneSignal.init({
        appId: appId,
        safari_web_id: 'web.onesignal.auto.18ce9b70-0bd8-49ff-83a9-5d9d5e3a9a3a',
        notifyButton: {
          enable: false, // We'll use our custom UI
        },
        allowLocalhostAsSecureOrigin: true,
      });

      // Set up notification handlers
      OneSignal.on('notificationReceived', (event) => {
        this.handleNotificationReceived(event);
      });

      OneSignal.on('notificationClicked', (event) => {
        this.handleNotificationClicked(event);
      });

      this.initialized = true;
      console.log('OneSignal initialized successfully');

      // Load stored notifications
      this.loadStoredNotifications();
    } catch (error) {
      console.error('OneSignal initialization error:', error);
    }
  }

  public async requestPermission(): Promise<boolean> {
    try {
      const permission = await OneSignal.getNotificationPermission();
      if (permission !== 'granted') {
        await OneSignal.requestPermission();
        return await OneSignal.getNotificationPermission() === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  public async setUserId(userId: string): Promise<void> {
    try {
      await OneSignal.setExternalUserId(userId);
    } catch (error) {
      console.error('Set user ID error:', error);
    }
  }

  public async sendNotification(
    userIds: string[],
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      // This would typically be done from your backend
      // For demo purposes, we'll add it locally
      this.addLocalNotification({
        title,
        message,
        type: 'info',
        data,
      });
    } catch (error) {
      console.error('Send notification error:', error);
    }
  }

  private handleNotificationReceived(event: any): void {
    const notification: NotificationData = {
      id: event.id || Date.now().toString(),
      title: event.title || 'New Notification',
      message: event.body || '',
      timestamp: new Date(),
      read: false,
      type: event.data?.type || 'info',
      action: event.data?.action,
    };

    this.addNotification(notification);
  }

  private handleNotificationClicked(event: any): void {
    const notificationId = event.id;
    this.markAsRead(notificationId);

    if (event.data?.action?.url) {
      window.open(event.data.action.url, '_blank');
    }
  }

  private addLocalNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
  }): void {
    const notification: NotificationData = {
      id: Date.now().toString(),
      title: data.title,
      message: data.message,
      timestamp: new Date(),
      read: false,
      type: data.type,
      action: data.data?.action,
    };

    this.addNotification(notification);
  }

  private addNotification(notification: NotificationData): void {
    this.notifications.unshift(notification);
    // Keep only last 50 notifications
    this.notifications = this.notifications.slice(0, 50);
    this.saveNotifications();
    this.notifyListeners();
  }

  public getNotifications(): NotificationData[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  public clearNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.saveNotifications();
    this.notifyListeners();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  public subscribe(callback: (notifications: NotificationData[]) => void): () => void {
    this.notificationListeners.push(callback);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.notificationListeners.forEach(callback => {
      callback([...this.notifications]);
    });
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Save notifications error:', error);
    }
  }

  private loadStoredNotifications(): void {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        this.notifyListeners();
      }

      // Add some demo notifications for testing
      if (this.notifications.length === 0) {
        this.addDemoNotifications();
      }
    } catch (error) {
      console.error('Load notifications error:', error);
    }
  }

  private addDemoNotifications(): void {
    const demoNotifications = [
      {
        title: 'Study Session Reminder',
        message: 'Your Math study session starts in 15 minutes',
        type: 'info' as const,
      },
      {
        title: 'Goal Achievement!',
        message: 'Congratulations! You completed your weekly study goal',
        type: 'success' as const,
      },
      {
        title: 'Exam Alert',
        message: 'Physics exam is tomorrow. Good luck!',
        type: 'warning' as const,
      },
    ];

    demoNotifications.forEach((demo, index) => {
      this.addLocalNotification({
        ...demo,
        data: { timestamp: new Date(Date.now() - (index * 60000)) },
      });
    });
  }
}

export default OneSignalService;
