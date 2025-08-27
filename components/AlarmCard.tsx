import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Clock, Edit3, Trash2, Play, Volume2, Calendar } from 'lucide-react-native';
import { Alarm } from '../types/alarm';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onEdit: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
  onTest: (alarm: Alarm) => void;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onToggle,
  onEdit,
  onDelete,
  onTest,
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      study_session: '#3b82f6',
      break_reminder: '#10b981',
      exam_preparation: '#f59e0b',
      wake_up: '#8b5cf6',
      medication: '#ef4444',
      general: '#6b7280',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getCategoryName = (category: string) => {
    const names = {
      study_session: 'Study Session',
      break_reminder: 'Break Reminder',
      exam_preparation: 'Exam Prep',
      wake_up: 'Wake Up',
      medication: 'Medication',
      general: 'General',
    };
    return names[category as keyof typeof names] || 'General';
  };

  const getRepeatText = (repeatDays: string[]) => {
    if (repeatDays.length === 0) return 'Once';
    if (repeatDays.length === 7) return 'Daily';
    if (repeatDays.length === 5 && 
        repeatDays.every(day => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day))) {
      return 'Weekdays';
    }
    if (repeatDays.length === 2 && 
        repeatDays.every(day => ['saturday', 'sunday'].includes(day))) {
      return 'Weekends';
    }
    return `${repeatDays.length} days`;
  };

  return (
    <View style={[styles.container, !alarm.enabled && styles.disabledContainer]}>
      <View style={styles.header}>
        <View style={styles.timeSection}>
          <Text style={[styles.time, !alarm.enabled && styles.disabledText]}>
            {alarm.time}
          </Text>
          <Text style={[styles.title, !alarm.enabled && styles.disabledText]}>
            {alarm.title}
          </Text>
        </View>
        <Switch
          value={alarm.enabled}
          onValueChange={() => onToggle(alarm.id)}
          trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
          thumbColor={alarm.enabled ? '#3b82f6' : '#9ca3af'}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.categoryRow}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(alarm.category) }]}>
            <Text style={styles.categoryText}>
              {getCategoryName(alarm.category)}
            </Text>
          </View>
          <View style={styles.repeatInfo}>
            <Calendar size={14} color="#6b7280" />
            <Text style={styles.repeatText}>
              {getRepeatText(alarm.repeatDays)}
            </Text>
          </View>
        </View>

        {alarm.description && (
          <Text style={[styles.description, !alarm.enabled && styles.disabledText]}>
            {alarm.description}
          </Text>
        )}

        <View style={styles.features}>
          {alarm.snoozeEnabled && (
            <View style={styles.feature}>
              <Clock size={14} color="#6b7280" />
              <Text style={styles.featureText}>Snooze {alarm.snoozeDuration}min</Text>
            </View>
          )}
          <View style={styles.feature}>
            <Volume2 size={14} color="#6b7280" />
            <Text style={styles.featureText}>{alarm.soundType.replace('_', ' ')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onTest(alarm)}
        >
          <Play size={16} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(alarm)}
        >
          <Edit3 size={16} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(alarm.id)}
        >
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeSection: {
    flex: 1,
  },
  time: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  disabledText: {
    color: '#9ca3af',
  },
  details: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  repeatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  repeatText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
});
