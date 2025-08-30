import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Play, Pause } from 'lucide-react';

interface PictureInPictureTimerProps {
  time: number;
  targetTime: number;
  mode: string;
  isRunning: boolean;
  onClose: () => void;
  onMaximize: () => void;
}

export const PictureInPictureTimer: React.FC<PictureInPictureTimerProps> = ({
  time,
  targetTime,
  mode,
  isRunning,
  onClose,
  onMaximize
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPipSupported, setIsPipSupported] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);

  useEffect(() => {
    setIsPipSupported('pictureInPictureEnabled' in document);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const drawTimer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = mode === 'focus' || mode === 'custom' ? '#1e40af' : '#059669';
    ctx.fillRect(0, 0, width, height);

    // Draw timer circle
    const centerX = width / 2;
    const centerY = height / 2 - 20;
    const radius = 80;
    const progress = Math.min((time / (targetTime * 60)) * 100, 100);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * progress / 100));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Timer text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(formatTime(time), centerX, centerY + 10);

    // Remaining time
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${formatTime(Math.max(0, targetTime * 60 - time))} remaining`, centerX, centerY + 40);

    // Mode indicator
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    const modeText = mode === 'focus' ? 'FOCUS' : mode === 'custom' ? 'CUSTOM' : 'BREAK';
    ctx.fillText(modeText, centerX, centerY - 60);

    // Status indicator
    ctx.font = '14px sans-serif';
    ctx.fillStyle = isRunning ? '#10b981' : '#f59e0b';
    ctx.fillText(isRunning ? '● Running' : '⏸ Paused', centerX, height - 30);
  };

  useEffect(() => {
    drawTimer();
  }, [time, targetTime, mode, isRunning]);

  const startPictureInPicture = async () => {
    if (!isPipSupported || !videoRef.current || !canvasRef.current) return;

    try {
      const stream = canvasRef.current.captureStream(1);
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      await videoRef.current.requestPictureInPicture();
      setIsPipActive(true);
    } catch (error) {
      console.error('Failed to start Picture-in-Picture:', error);
    }
  };

  useEffect(() => {
    if (isPipSupported) {
      startPictureInPicture();
    }
  }, [isPipSupported]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLeavePip = () => {
      setIsPipActive(false);
      onClose();
    };

    video.addEventListener('leavepictureinpicture', handleLeavePip);
    return () => video.removeEventListener('leavepictureinpicture', handleLeavePip);
  }, [onClose]);

  if (!isPipSupported) {
    // Fallback floating widget for unsupported browsers
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
        <div className="backdrop-blur-md bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sm flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              Always Visible Timer
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={onMaximize}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
              >
                <X className="w-3.5 h-3.5 text-red-500" />
              </button>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-mono font-bold mb-1">
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-500">
              {formatTime(Math.max(0, targetTime * 60 - time))} remaining
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {mode === 'focus' ? 'Focus Session' : mode === 'custom' ? 'Custom Timer' : 'Break Time'}
            </div>
          </div>

          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ${
                mode === 'focus' || mode === 'custom' ? 'bg-blue-600' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min((time / (targetTime * 60)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <video
        ref={videoRef}
        muted
        playsInline
        style={{ width: '400px', height: '300px' }}
      />
    </div>
  );
};
