import React, { useState, useEffect } from 'react';
import { Clock, Plus, Bell, Volume2, VolumeX, Settings, Trash2, Edit3, Power, Snooze } from 'lucide-react';
import { AlarmCard } from './AlarmCard';
import { AlarmCreator } from './AlarmCreator';
import { AlarmSettings } from './AlarmSettings';
import { alarmService, Alarm } from '../../services/alarmService';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumFeatureGate } from '../premium/PremiumFeatureGate';

interface AlarmManagerProps {
  exams: any[];
  sessions: any[];
}

export const AlarmManager: React.FC<AlarmManagerProps> = ({ exams, sessions }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    loadAlarms();
    
    const handleAlarmTriggered = (event: CustomEvent) => {
      setActiveAlarm(event.detail.alarm);
    };

    window.addEventListener('alarmTriggered', handleAlarmTriggered as EventListener);
    
    return () => {
      window.removeEventListener('alarmTriggered', handleAlarmTriggered as EventListener);
    };
  }, []);

  const loadAlarms = () => {
    const userAlarms = alarmService.getAlarms().filter(alarm => alarm.userId === user?.uid);
    setAlarms(userAlarms);
  };

  const handleCreateAlarm = (alarmData: any) => {
    alarmService.createAlarm({
      ...alarmData,
      userId: user?.uid || '',
    });
    loadAlarms();
    setShowCreator(false);
  };

  const handleUpdateAlarm = (id: string, updates: Partial<Alarm>) => {
    alarmService.updateAlarm(id, updates);
    loadAlarms();
  };

  const handleDeleteAlarm = (id: string) => {
    alarmService.deleteAlarm(id);
    loadAlarms();
  };

  const handleSnoozeAlarm = () => {
    if (activeAlarm) {
      alarmService.snoozeAlarm(activeAlarm.id);
      setActiveAlarm(null);
    }
  };

  const handleDismissAlarm = () => {
    alarmService.stopAlarmSound();
    setActiveAlarm(null);
  };

  const getAlarmStats = () => {
    const enabledAlarms = alarms.filter(alarm => alarm.enabled);
    const upcomingAlarms = enabledAlarms.filter(alarm => {
      const now = new Date();
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmTime = new Date(now);
      alarmTime.setHours(hours, minutes, 0, 0);
      
      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }
      
      return alarmTime.getTime() - now.getTime() <= 24 * 60 * 60 * 1000;
    });

    return {
      total: alarms.length,
      enabled: enabledAlarms.length,
      upcoming: upcomingAlarms.length
    };
  };

  const stats = getAlarmStats();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Smart Alarms</h2>
                <p className="text-white/80">Intelligent study reminders</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-white/80">Total Alarms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.enabled}</div>
              <div className="text-xs text-white/80">Active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <div className="text-xs text-white/80">Upcoming</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Create Alarm Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Your Alarms</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your study reminders and alerts</p>
            </div>
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add Alarm
            </button>
          </div>

          {/* Alarm List */}
          {alarms.length > 0 ? (
            <div className="space-y-4">
              {alarms.map((alarm) => (
                <AlarmCard
                  key={alarm.id}
                  alarm={alarm}
                  onToggle={(enabled) => handleUpdateAlarm(alarm.id, { enabled })}
                  onEdit={() => {
                    setEditingAlarm(alarm);
                    setShowCreator(true);
                  }}
                  onDelete={() => handleDeleteAlarm(alarm.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl mb-4 inline-block">
                <Clock className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                No Alarms Set
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first alarm to get smart study reminders
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create First Alarm
              </button>
            </div>
          )}

          {/* Premium Smart Suggestions */}
          <div className="mt-8">
            <PremiumFeatureGate
              featureName="Smart Alarm Suggestions"
              description="AI-powered alarm recommendations based on your study patterns"
              className="min-h-[200px]"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 border-2 border-indigo-200/60 dark:border-indigo-700/60">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Smart Suggestions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI recommendations based on your data</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {alarmService.generateSmartAlarms(exams, sessions).slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{suggestion.icon}</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100">{suggestion.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{suggestion.time} • {suggestion.description}</div>
                        </div>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </PremiumFeatureGate>
          </div>
        </div>
      </div>

      {/* Active Alarm Modal */}
      {activeAlarm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full text-center animate-pulse">
            <div className="mb-6">
              <div className={`text-6xl mb-4 animate-bounce`}>{activeAlarm.icon}</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {activeAlarm.title}
              </h2>
              {activeAlarm.description && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {activeAlarm.description}
                </p>
              )}
            </div>
            
            <div className="flex gap-4">
              {activeAlarm.snoozeEnabled && (
                <button
                  onClick={handleSnoozeAlarm}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Snooze className="w-5 h-5" />
                  Snooze ({activeAlarm.snoozeInterval}m)
                </button>
              )}
              <button
                onClick={handleDismissAlarm}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreator && (
        <AlarmCreator
          alarm={editingAlarm}
          exams={exams}
          onSave={handleCreateAlarm}
          onCancel={() => {
            setShowCreator(false);
            setEditingAlarm(null);
          }}
        />
      )}

      {showSettings && (
        <AlarmSettings
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
};
