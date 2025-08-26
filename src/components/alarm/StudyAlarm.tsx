import React, { useState } from 'react';
import { Clock, Plus, Edit3, Trash2, Power, Volume2, Bell, Calendar, Settings } from 'lucide-react';
import { useAlarm, Alarm, ALARM_SOUNDS } from '../../contexts/AlarmContext';

interface AlarmFormProps {
  alarm?: Alarm;
  onSave: (alarm: Omit<Alarm, 'id'> | Partial<Alarm>) => void;
  onCancel: () => void;
}

const AlarmForm: React.FC<AlarmFormProps> = ({ alarm, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: alarm?.name || '',
    time: alarm?.time || '07:00',
    sound: alarm?.sound || 'gentle',
    volume: alarm?.volume || 70,
    snoozeEnabled: alarm?.snoozeEnabled ?? true,
    snoozeInterval: alarm?.snoozeInterval || 5,
    daysOfWeek: alarm?.daysOfWeek || [false, true, true, true, true, true, false],
    isActive: alarm?.isActive ?? true
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          {alarm ? 'Edit Alarm' : 'New Study Alarm'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alarm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alarm Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Study Session Start"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Repeat Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    daysOfWeek: prev.daysOfWeek.map((selected, i) => 
                      i === index ? !selected : selected
                    )
                  }))}
                  className={`
                    py-2 px-1 text-xs font-medium rounded-lg transition-all duration-200
                    ${formData.daysOfWeek[index]
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alarm Sound
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALARM_SOUNDS.map(sound => (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, sound: sound.id }))}
                  className={`
                    p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                    ${formData.sound === sound.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{sound.emoji}</div>
                  <div className="text-xs">{sound.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume: {formData.volume}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.volume}
              onChange={(e) => setFormData(prev => ({ ...prev, volume: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Snooze Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="snooze"
                checked={formData.snoozeEnabled}
                onChange={(e) => setFormData(prev => ({ ...prev, snoozeEnabled: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="snooze" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enable Snooze
              </label>
            </div>
            
            {formData.snoozeEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Snooze Interval (minutes)
                </label>
                <select
                  value={formData.snoozeInterval}
                  onChange={(e) => setFormData(prev => ({ ...prev, snoozeInterval: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                </select>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {alarm ? 'Update Alarm' : 'Create Alarm'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const StudyAlarm: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, snoozeAlarm, dismissAlarm, currentAlarm } = useAlarm();
  const [showForm, setShowForm] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  if (!isOpen) return null;

  const handleSaveAlarm = (alarmData: Omit<Alarm, 'id'> | Partial<Alarm>) => {
    if (editingAlarm) {
      updateAlarm(editingAlarm.id, alarmData as Partial<Alarm>);
    } else {
      addAlarm(alarmData as Omit<Alarm, 'id'>);
    }
    setShowForm(false);
    setEditingAlarm(null);
  };

  const formatDays = (daysOfWeek: boolean[]) => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDays = daysOfWeek.map((selected, index) => selected ? dayNames[index] : null).filter(Boolean);
    
    if (selectedDays.length === 7) return 'Daily';
    if (selectedDays.length === 5 && !daysOfWeek[0] && !daysOfWeek[6]) return 'Weekdays';
    if (selectedDays.length === 2 && daysOfWeek[0] && daysOfWeek[6]) return 'Weekends';
    return selectedDays.join(', ');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-500" />
                Study Alarms
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Alarm
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Alarm List */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {alarms.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                  No alarms set
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Create your first study alarm to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {alarms.map(alarm => (
                  <div
                    key={alarm.id}
                    className={`
                      p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg
                      ${alarm.isActive
                        ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700'
                      }
                      ${currentAlarm === alarm.id ? 'ring-2 ring-red-500 animate-pulse' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {alarm.name}
                          </h3>
                          <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                            {alarm.time}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDays(alarm.daysOfWeek)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Volume2 className="w-4 h-4" />
                            {ALARM_SOUNDS.find(s => s.id === alarm.sound)?.emoji} {alarm.volume}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentAlarm === alarm.id && (
                          <div className="flex gap-2">
                            {alarm.snoozeEnabled && (
                              <button
                                onClick={() => snoozeAlarm(alarm.id)}
                                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                Snooze
                              </button>
                            )}
                            <button
                              onClick={() => dismissAlarm(alarm.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
                        
                        <button
                          onClick={() => toggleAlarm(alarm.id)}
                          className={`
                            p-2 rounded-xl transition-all duration-200
                            ${alarm.isActive
                              ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                              : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }
                          `}
                          title={alarm.isActive ? 'Disable alarm' : 'Enable alarm'}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setEditingAlarm(alarm);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
                          title="Edit alarm"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => deleteAlarm(alarm.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                          title="Delete alarm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alarm Form Modal */}
      {showForm && (
        <AlarmForm
          alarm={editingAlarm || undefined}
          onSave={handleSaveAlarm}
          onCancel={() => {
            setShowForm(false);
            setEditingAlarm(null);
          }}
        />
      )}
    </>
  );
};
