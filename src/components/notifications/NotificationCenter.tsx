import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import OneSignalService, { NotificationData } from '../../services/OneSignalService';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const oneSignal = OneSignalService.getInstance();

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = oneSignal.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
      setUnreadCount(oneSignal.getUnreadCount());
    });

    // Initialize notifications
    setNotifications(oneSignal.getNotifications());
    setUnreadCount(oneSignal.getUnreadCount());

    return unsubscribe;
  }, [oneSignal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    oneSignal.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    oneSignal.markAllAsRead();
  };

  const handleClearNotification = (notificationId: string) => {
    oneSignal.clearNotification(notificationId);
  };

  const handleClearAll = () => {
    oneSignal.clearAllNotifications();
    setIsOpen(false);
  };

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '🔔';
    }
  };

  const getNotificationBgColor = (type: NotificationData['type'], read: boolean) => {
    const opacity = read ? 'opacity-60' : '';
    switch (type) {
      case 'success':
        return `bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 ${opacity}`;
      case 'warning':
        return `bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 ${opacity}`;
      case 'error':
        return `bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 ${opacity}`;
      default:
        return `bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ${opacity}`;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative p-2 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
          ${isOpen 
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400 shadow-lg scale-105' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md'
          }
        `}
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right overflow-hidden max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={CheckCheck}
                    onClick={handleMarkAllAsRead}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Mark all as read"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={handleClearAll}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                    title="Clear all"
                  />
                </>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications yet</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  You'll see new notifications here
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      p-3 rounded-xl border transition-all duration-200 hover:shadow-md group
                      ${getNotificationBgColor(notification.type, notification.read)}
                      ${!notification.read ? 'ring-2 ring-blue-500/20' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3 h-3 text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleClearNotification(notification.id)}
                              className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(notification.action!.url, '_blank')}
                              className="text-xs px-2 py-1 h-6"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Notification Settings
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
</thinking>

          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
