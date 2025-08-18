import React, { useState, useRef, useEffect } from 'react';
import { Target, Coffee, Square, Maximize2, Flame } from 'lucide-react';
import { TimerMode } from './FocusMode';

interface DraggableFloatingTimerProps {
  isMinimized: boolean;
  isRunning: boolean;
  time: number;
  targetTime: number;
  mode: TimerMode;
  currentSubject: string;
  currentStreak: number;
  getProgress: () => number;
  formatTime: (seconds: number) => string;
  onMaximize: () => void;
  onStop: () => void;
}

export const DraggableFloatingTimer: React.FC<DraggableFloatingTimerProps> = ({
  isMinimized,
  isRunning,
  time,
  targetTime,
  mode,
  currentSubject,
  currentStreak,
  getProgress,
  formatTime,
  onMaximize,
  onStop
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Boundary checking
      const maxX = window.innerWidth - 280; // Timer width
      const maxY = window.innerHeight - 150; // Timer height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!timerRef.current) return;

    const rect = timerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.preventDefault();
  };

  if (!isMinimized || (!isRunning && time === 0)) return null;

  return (
    <div
      ref={timerRef}
      className={`
        fixed z-[60] cursor-move select-none transform transition-transform duration-200
        ${isDragging ? 'scale-105 rotate-1' : 'scale-100 rotate-0'}
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-4 min-w-[280px] max-w-[320px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-xl backdrop-blur-sm
              ${(mode === 'focus' || mode === 'custom') 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }
            `}>
              {(mode === 'focus' || mode === 'custom') ? (
                <Target className="w-4 h-4 text-white" />
              ) : (
                <Coffee className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {mode === 'focus' ? 'Focus' : 
                 mode === 'custom' ? 'Custom' :
                 mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>
              {currentSubject && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                  {currentSubject}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Maximize"
            >
              <Maximize2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStop();
              }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Stop Timer"
            >
              <Square className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-3">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - getProgress() / 100)}`}
                className={`
                  transition-all duration-1000
                  ${(mode === 'focus' || mode === 'custom')
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-green-600 dark:text-green-400'
                  }
                `}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
                {formatTime(time)}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {formatTime(Math.max(0, targetTime * 60 - time))} remaining
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
          <div
            className={`
              h-2 rounded-full transition-all duration-1000
              ${(mode === 'focus' || mode === 'custom') 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }
            `}
            style={{ width: `${Math.min(getProgress(), 100)}%` }}
          />
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full font-medium
            ${isRunning 
              ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
              : 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
            {isRunning ? 'Active' : 'Paused'}
          </div>
          
          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-medium">
            <Flame className="w-3 h-3" />
            <span>{currentStreak}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
