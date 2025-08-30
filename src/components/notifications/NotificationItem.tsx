import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X, RotateCcw, Check } from 'lucide-react';
import { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onClear: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onClear
}) => {
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={`
      p-4 border-l-4 rounded-lg transition-all duration-200 group hover:shadow-md
      ${getNotificationBg(notification.type)}
      ${!notification.isRead ? 'border-l-4' : 'border-l-2 opacity-75'}
    `}>
      <div className="flex items-start gap-3">
        {/* Notification Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`text-sm font-semibold text-gray-900 dark:text-gray-100 ${!notification.isRead ? 'font-bold' : ''}`}>
                {notification.title}
                {!notification.isRead && (
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2 animate-pulse"></span>
                )}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-medium">
                {formatTimeAgo(notification.timestamp)}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => notification.isRead ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
              >
                {notification.isRead ? (
                  <RotateCcw className="w-3 h-3 text-gray-500" />
                ) : (
                  <Check className="w-3 h-3 text-green-600" />
                )}
              </button>
              <button
                onClick={() => onClear(notification.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Clear notification"
              >
                <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>
          
          {/* Action Button if present */}
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-3 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
