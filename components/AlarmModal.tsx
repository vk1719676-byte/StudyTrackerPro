import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { X, Clock, Volume2, Repeat, Bell, Settings2, Play, Pause } from 'lucide-react-native';
import { Alarm, AlarmSoundType, AlarmCategory, RepeatDay } from '../types/alarm';
import AlarmService from '../services/AlarmService';

interface AlarmModalProps {
  visible: boolean;
  alarm?: Alarm | null;
  onClose: () => void;
  onSave: (alarmData: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  alarm,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:00');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AlarmCategory>('general');
  const [soundType, setSoundType] = useState<AlarmSoundType>('classic_bell');
  const [repeatDays, setRepeatDays] = useState<RepeatDay[]>([]);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(10);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [playingSound, setPlayingSound] = useState(false);

  const alarmService = AlarmService.getInstance();

  useEffect(() => {
    if (alarm) {
      setTitle(alarm.title);
      setTime(alarm.time);
      setDescription(alarm.description || '');
      setCategory(alarm.category);
      setSoundType(alarm.soundType);
      setRepeatDays(alarm.repeatDays);
      setSnoozeEnabled(alarm.snoozeEnabled);
      setSnoozeDuration(alarm.snoozeDuration);
      setVibrationEnabled(alarm.vibrationEnabled);
    } else {
      // Reset to defaults for new alarm
      setTitle('');
      setTime('07:00');
      setDescription('');
      setCategory('general');
      setSoundType('classic_bell');
      setRepeatDays([]);
      setSnoozeEnabled(true);
      setSnoozeDuration(10);
      setVibrationEnabled(true);
    }
  }, [alarm, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your alarm');
      return;
    }

    const alarmData: Omit<Alarm, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      time,
      description: description.trim(),
      category,
      soundType,
      repeatDays,
      snoozeEnabled,
      snoozeDuration,
      vibrationEnabled,
      vibrationPattern: 'short',
      enabled: true,
    };

    onSave(alarmData);
    onClose();
  };

  const toggleRepeatDay = (day: RepeatDay) => {
    if (repeatDays.includes(day)) {
      setRepeatDays(repeatDays.filter(d => d !== day));
    } else {
      setRepeatDays([...repeatDays, day]);
    }
  };

  const testSound = async () => {
    if (playingSound) {
      await alarmService.stopCurrentSound();
      setPlayingSound(false);
    } else {
      setPlayingSound(true);
      await alarmService.playAlarmSound(soundType);
      setTimeout(() => {
        alarmService.stopCurrentSound();
        setPlayingSound(false);
      }, 3000);
    }
  };

  const categories: { value: AlarmCategory; label: string }[] = [
    { value: 'study_session', label: 'Study Session' },
    { value: 'break_reminder', label: 'Break Reminder' },
    { value: 'exam_preparation', label: 'Exam Preparation' },
    { value: 'wake_up', label: 'Wake Up' },
    { value: 'medication', label: 'Medication' },
    { value: 'general', label: 'General' },
  ];

  const soundTypes: { value: AlarmSoundType; label: string }[] = [
    { value: 'gentle_wake', label: 'Gentle Wake' },
    { value: 'classic_bell', label: 'Classic Bell' },
    { value: 'nature_sounds', label: 'Nature Sounds' },
    { value: 'focus_chime', label: 'Focus Chime' },
    { value: 'study_bell', label: 'Study Bell' },
    { value: 'urgent_alert', label: 'Urgent Alert' },
  ];

  const days: { value: RepeatDay; label: string }[] = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {alarm ? 'Edit Alarm' : 'New Alarm'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter alarm title"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.timeContainer}>
                <Clock size={20} color="#6b7280" />
                <TextInput
                  style={styles.timeInput}
                  value={time}
                  onChangeText={setTime}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add a description for your alarm"
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryRow}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.value}
                      style={[
                        styles.categoryChip,
                        category === cat.value && styles.selectedCategoryChip
                      ]}
                      onPress={() => setCategory(cat.value)}
                    >
                      <Text style={[
                        styles.categoryText,
                        category === cat.value && styles.selectedCategoryText
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Sound Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sound Settings</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Alarm Sound</Text>
                <TouchableOpacity onPress={testSound} style={styles.testButton}>
                  {playingSound ? <Pause size={16} color="#3b82f6" /> : <Play size={16} color="#3b82f6" />}
                  <Text style={styles.testButtonText}>
                    {playingSound ? 'Stop' : 'Test'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.soundRow}>
                  {soundTypes.map(sound => (
                    <TouchableOpacity
                      key={sound.value}
                      style={[
                        styles.soundChip,
                        soundType === sound.value && styles.selectedSoundChip
                      ]}
                      onPress={() => setSoundType(sound.value)}
                    >
                      <Volume2 size={16} color={soundType === sound.value ? 'white' : '#6b7280'} />
                      <Text style={[
                        styles.soundText,
                        soundType === sound.value && styles.selectedSoundText
                      ]}>
                        {sound.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Vibration</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={vibrationEnabled ? '#3b82f6' : '#9ca3af'}
              />
            </View>
          </View>

          {/* Repeat Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Repeat Settings</Text>
            
            <View style={styles.daysContainer}>
              {days.map(day => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayChip,
                    repeatDays.includes(day.value) && styles.selectedDayChip
                  ]}
                  onPress={() => toggleRepeatDay(day.value)}
                >
                  <Text style={[
                    styles.dayText,
                    repeatDays.includes(day.value) && styles.selectedDayText
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Snooze Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Snooze Settings</Text>
            
            <View style={styles.switchRow}>
              <Text style={styles.label}>Enable Snooze</Text>
              <Switch
                value={snoozeEnabled}
                onValueChange={setSnoozeEnabled}
                trackColor={{ false: '#d1d5db', true: '#60a5fa' }}
                thumbColor={snoozeEnabled ? '#3b82f6' : '#9ca3af'}
              />
            </View>

            {snoozeEnabled && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Snooze Duration (minutes)</Text>
                <TextInput
                  style={styles.numberInput}
                  value={snoozeDuration.toString()}
                  onChangeText={(text) => setSnoozeDuration(parseInt(text) || 10)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={[styles.button, styles.saveButton]}>
            <Text style={styles.saveButtonText}>
              {alarm ? 'Update Alarm' : 'Create Alarm'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  testButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 16,
    color: '#1f2937',
    width: 80,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedCategoryChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: 'white',
  },
  soundRow: {
    flexDirection: 'row',
    gap: 8,
  },
  soundChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  selectedSoundChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  soundText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedSoundText: {
    color: 'white',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  selectedDayText: {
    color: 'white',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
