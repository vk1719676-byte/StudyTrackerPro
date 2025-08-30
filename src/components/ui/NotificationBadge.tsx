import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full shadow-lg animate-bounce">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4" />
        <span className="text-sm font-semibold">Timer Active</span>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  );
};
