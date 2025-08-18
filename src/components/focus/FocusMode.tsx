import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target, CheckCircle, Minimize2, Maximize2, BookOpen, Trophy, Flame, Coffee, Brain, Lightbulb, Music, Volume2, VolumeX, SkipForward, SkipBack, Settings, Star, TrendingUp, Calendar, Eye, Palette, Waves } from 'lucide-react';
import { FloatingTimer } from './FloatingTimer';
import { MusicPlayer } from './MusicPlayer';
import { StatsPanel } from './StatsPanel';
import { TimerDisplay } from './TimerDisplay';
import { SessionInsights } from './SessionInsights';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom' | 'deepFocus';
type ThemeMode = 'default' | 'forest' | 'ocean' | 'sunset' | 'midnight';
type AmbientSound = 'none' | 'rain' | 'waves' | 'forest' | 'cafe' | 'fireplace';

interface StudySession {
  id: string;
  subject: string;
  task: string;
  duration: number;
  completedAt: Date;
  mode: TimerMode;
  focusScore: number;
  notes: string;
  distractions: number;
  theme: ThemeMode;
}

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  mood: 'chill' | 'focus' | 'deep' | 'calm';
}

const DEFAULT_POMODORO_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  custom: 30,
  deepFocus: 50
};

const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Deep Focus Flow',
    a
