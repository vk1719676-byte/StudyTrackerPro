import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'timer';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface NotificationBellProps {
  className?: string;
  notifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onNotificationClear?: (id: string) => void;
  onClearAll?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  notifications = [],
  onNotificationRead,
  onNotificationClear,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellRef.current && 
        panelRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animation for new notifications
  useEffect(() => {
    if (hasUnread) {
      setHasNewNotifications(true);
      const timer = setTimeout(() => setHasNewNotifications(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasUnread]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    
    // Mark all as read when opening
    if (!isOpen && onNotificationRead) {
      notifications.filter(n => !n.isRead).forEach(n => {
        onNotificationRead(n.id);
      });
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'timer':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`relative ${className}`} ref={bellRef}>
      {/* Bell Button */}
      <button
        onClick={togglePanel}
        className={`relative p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
          isOpen 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        } ${hasNewNotifications ? 'animate-bounce' : ''}`}
      >
        {hasUnread ? (
          <BellRing className={`w-6 h-6 ${hasNewNotifications ? 'animate-pulse text-blue-600' : ''}`} />
        ) : (
          <Bell className="w-6 h-6" />
        )}
        
        {/* Notification Badge */}
        {hasUnread && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
        
        {/* Pulse Ring for New Notifications */}
        {hasNewNotifications && (
          <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-ping" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div 
          ref={panelRef}
          className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-slide-in"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notifications.length === 0 
                    ? 'No notifications yet' 
                    : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {notifications.length > 0 && (
                <Button
                  onClick={onClearAll}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No notifications yet. Start a focus session to receive updates!
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                              {notification.message}
                            </p>
                            
                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    onClick={action.action}
                                    variant={action.variant || 'secondary'}
                                    size="sm"
                                    className="text-xs"
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(notification.timestamp)}
                            </span>
                            {onNotificationClear && (
                              <button
                                onClick={() => onNotificationClear(notification.id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                              >
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                Focus mode notifications help you stay productive
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
