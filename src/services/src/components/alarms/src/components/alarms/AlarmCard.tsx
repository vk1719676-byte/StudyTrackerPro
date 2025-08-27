import React from 'react';
import { Clock, Edit3, Trash2, Power, Volume2, Repeat, Calendar } from 'lucide-react';
import { Alarm } from '../../services/alarmService';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onToggle, onEdit, onDelete }) => {
  const getAlarmTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'from-blue-500 to-blue-600';
      case 'break': return 'from-green-500 to-green-600';
      case 'exam': return 'from-red-500 to-red-600';
      case 'focus': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAlarmTypeIcon = (type: string) => {
    switch (type) {
      case 'study': return '📚';
      case 'break': return '☕';
      case 'exam': return '📝';
      case 'focus': return '🎯';
      default: return '⏰';
    }
  };

  const getDayNames = (days: number[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (days.length === 7) return 'Daily';
    if (days.length === 5 && days.every(d => d >= 1 && d <= 5)) return 'Weekdays';
    if (days.length === 0) return 'One-time';
    return days.map(d => dayNames[d]).join(', ');
  };

  const isUpcoming = () => {
    const now = new Date();
    const [hours, minutes] = alarm.time.split(':').map(Number);
    const alarmTime = new Date(now);
    alarmTime.setHours(hours, minutes, 0, 0);
    
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    return alarmTime.getTime() - now.getTime() <= 60 * 60 * 1000; // Within 1 hour
  };

  return (
    <div className={`group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all duration-300 ${
      alarm.enabled 
        ? 'border-indigo-200 dark:border-indigo-700 shadow-lg hover:shadow-xl' 
        : 'border-gray-200 dark:border-gray-700 opacity-60'
    } ${isUpcoming() && alarm.enabled ? 'ring-2 ring-indigo-500/50' : ''}`}>
      
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        alarm.enabled ? getAlarmTypeColor(alarm.type) : 'from-gray-300 to-gray-400'
      }`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Alarm icon and type */}
            <div className={`p-3 rounded-2xl shadow-md group-hover:scale-110 transition-all duration-300 ${
              alarm.enabled 
                ? `bg-gradient-to-br ${getAlarmTypeColor(alarm.type)}`
                : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              <div className="text-xl">{getAlarmTypeIcon(alarm.type)}</div>
            </div>
            
            {/* Alarm details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`font-bold text-xl truncate ${
                  alarm.enabled 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {alarm.title}
                </h3>
                {alarm.priority === 'urgent' && (
                  <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                    URGENT
                  </div>
                )}
              </div>
              
              {alarm.description && (
                <p className={`text-sm mb-3 truncate ${
                  alarm.enabled 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {alarm.description}
                </p>
              )}
              
              {/* Alarm schedule info */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  alarm.enabled 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>{getDayNames(alarm.days)}</span>
                </div>
                
                {alarm.repeatInterval && alarm.repeatInterval !== 'none' && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                    alarm.enabled 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    <Repeat className="w-3 h-3" />
                    <span className="capitalize">{alarm.repeatInterval}</span>
                  </div>
                )}
                
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  alarm.enabled 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
                }`}>
                  <Volume2 className="w-3 h-3" />
                  <span>{alarm.volume}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Time display */}
          <div className="text-right flex-shrink-0 ml-4">
            <div className={`text-3xl font-black mb-2 ${
              alarm.enabled 
                ? 'text-gray-900 dark:text-gray-100' 
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {alarm.time}
            </div>
            {isUpcoming() && alarm.enabled && (
              <div className="text-xs font-bold text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                Soon
              </div>
            )}
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(!alarm.enabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                alarm.enabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <Power className="w-4 h-4" />
              {alarm.enabled ? 'ON' : 'OFF'}
            </button>
            
            <span className={`text-sm font-medium ${
              alarm.enabled 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {alarm.type.charAt(0).toUpperCase() + alarm.type.slice(1)} Alarm
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
