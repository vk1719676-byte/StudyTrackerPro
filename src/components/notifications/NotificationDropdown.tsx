import React from 'react';
import { X, CheckCheck, Bell, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationItem } from './NotificationItem';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAsUnread, 
    clearNotification, 
    clearAllNotifications, 
    markAllAsRead 
  } = useNotifications();

  if (!isOpen) return null;

  const getNotificationStats = () => {
    const total = notifications.length;
    const success = notifications.filter(n => n.type === 'success').length;
    const warning = notifications.filter(n => n.type === 'warning').length;
    const error = notifications.filter(n => n.type === 'error').length;
    const info = notifications.filter(n => n.type === 'info').length;
    
    return { total, success, warning, error, info };
  };

  const stats = getNotificationStats();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Dropdown Panel */}
      <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 origin-top-right overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close notifications"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">{stats.success} Success</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">{stats.warning} Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">{stats.error} Error</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">{stats.info} Info</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification) => (
                <div key={notification.id} className="mb-2 last:mb-0">
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onMarkAsUnread={markAsUnread}
                    onClear={clearNotification}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No notifications
              </h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
