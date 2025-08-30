import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationContextType } from '../types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sample notifications to demonstrate the system
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to Study Tracker Pro!',
        message: 'Your premium features are now active. Explore advanced analytics and AI-powered insights.',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        isRead: false
      },
      {
        id: '2',
        title: 'Study Session Reminder',
        message: 'You have a Mathematics study session scheduled in 30 minutes.',
        type: 'info',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        isRead: false
      },
      {
        id: '3',
        title: 'Goal Achievement!',
        message: 'Congratulations! You\'ve completed 80% of your weekly study goal.',
        type: 'success',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: false
      },
      {
        id: '4',
        title: 'Data Backup Complete',
        message: 'Your study data has been successfully backed up to the cloud.',
        type: 'info',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true
      },
      {
        id: '5',
        title: 'Break Reminder',
        message: 'You\'ve been studying for 2 hours. Consider taking a short break.',
        type: 'warning',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isRead: false
      }
    ];
    
    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: false } : notification
      )
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAsUnread,
    clearNotification,
    clearAllNotifications,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
