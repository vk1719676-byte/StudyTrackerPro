import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Radio, Shuffle } from 'lucide-react';
import { Button } from '../ui/Button';

interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

const LOFI_TRACKS: LofiTrack[] = [
  {
    id: '1',
    title: 'Chill Study Beats',
    artist: 'Lo-Fi Collective',
    url: 'https://mp3juice.co/#-1CwZ-U7UEs',
    duration: '3:24'
  },
  {
    id: '2',
    title: 'Peaceful Focus',
    artist: 'Study Vibes',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '4:15'
  },
  {
    id: '3',
    title: 'Deep Concentration',
    artist: 'Calm Waves',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '3:45'
  },
  {
    id: '4',
    title: 'Midnight Study',
    artist: 'Night Owl Beats',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '5:20'
  },
  {
    id: '5',
    title: 'Coffee Shop Ambience',
    artist: 'Ambient Sounds',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '4:40'
  }
];

const AMBIENT_SOUNDS = [
  { id: 'rain', name: '🌧️ Rain', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaAjuS2uy0eSYELYHE8tuHNQcYarfk7qBICQxNpebsulmBCkWc7FWwxzgsRJn7CqB7PwweQJHjEJ5rNQhFltv5tIDQAgFrppCuVBF' },
  { id: 'ocean', name: '🌊 Ocean Waves', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaAjuS2uy0eSYELYHE8tuHNQcYarfk7qBICQxNpebsulmBCkWc7FWwxzgsRJn7CqB7PwweQJHjEJ5rNQhFltv5tIDQAgFrppCuVBF' },
  { id: 'forest', name: '🌲 Forest Sounds', url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEaAjuS2uy0eSYELYHE8tuHNQcYarfk7qBICQxNpebsulmBCkWc7FWwxzgsRJn7CqB7PwweQJHjEJ5rNQhFltv5tIDQAgFrppCuVBF' }
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState<string | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  const audioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);

  // Background audio support
  useEffect(() => {
    if ('mediaSession' in navigator && audioRef.current) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: LOFI_TRACKS[currentTrack].title,
        artist: LOFI_TRACKS[currentTrack].artist,
        album: 'Study Focus Music',
        artwork: [
          { src: '/music-icon-96.png', sizes: '96x96', type: 'image/png' },
          { src: '/music-icon-256.png', sizes: '256x256', type: 'image/png' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => toggleMusic());
      navigator.mediaSession.setActionHandler('pause', () => toggleMusic());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('previoustrack', () => previousTrack());
    }
  }, [currentTrack]);

  // Audio setup
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = true;
      audioRef.current.preload = 'metadata';
    }
    
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? 0 : ambientVolume;
      ambientAudioRef.current.loop = true;
    }
  }, [volume, ambientVolume, isMuted]);

  const toggleMusic = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const nextTrack = () => {
    if (isShuffleMode) {
      const randomIndex = Math.floor(Math.random() * LOFI_TRACKS.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % LOFI_TRACKS.length);
    }
    
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const previousTrack = () => {
    if (isShuffleMode) {
      const randomIndex = Math.floor(Math.random() * LOFI_TRACKS.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => prev === 0 ? LOFI_TRACKS.length - 1 : prev - 1);
    }
    
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = isMuted ? ambientVolume : 0;
    }
  };

  const toggleAmbientSound = async (soundId: string) => {
    if (currentAmbient === soundId) {
      // Stop current ambient sound
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
      }
      setCurrentAmbient(null);
    } else {
      // Start new ambient sound
      setCurrentAmbient(soundId);
      if (ambientAudioRef.current) {
        try {
          await ambientAudioRef.current.play();
        } catch (error) {
          console.error('Error playing ambient sound:', error);
        }
      }
    }
  };

  const currentAmbientSound = AMBIENT_SOUNDS.find(s => s.id === currentAmbient);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 overflow-hidden">
      {/* Hidden Audio Elements */}
      <audio ref={audioRef} src={LOFI_TRACKS[currentTrack].url} />
      {currentAmbientSound && (
        <audio ref={ambientAudioRef} src={currentAmbientSound.url} />
      )}

      {/* Compact Header */}
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-xl p-3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-purple-800 dark:text-purple-400">
                🎵 Focus Music
              </div>
              {isPlaying && (
                <div className="text-xs text-purple-600 dark:text-purple-400 truncate max-w-[200px]">
                  {LOFI_TRACKS[currentTrack].title}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentAmbient && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs text-blue-700 dark:text-blue-400">Ambient</span>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMusic();
              }}
              className={`p-2 rounded-xl transition-all transform hover:scale-105 ${
                isPlaying 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-purple-200/50 dark:border-purple-800/50 pt-4">
          {/* Now Playing */}
          <div className="text-center">
            <div className="font-semibold text-purple-900 dark:text-purple-100">
              {LOFI_TRACKS[currentTrack].title}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              {LOFI_TRACKS[currentTrack].artist} • {LOFI_TRACKS[currentTrack].duration}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={previousTrack}
              className="p-2 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded-xl transition-colors"
            >
              <SkipBack className="w-5 h-5 text-purple-600" />
            </button>
            
            <button
              onClick={toggleMusic}
              className={`p-3 rounded-xl transition-all transform hover:scale-105 ${
                isPlaying 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
                  : 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded-xl transition-colors"
            >
              <SkipForward className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded-lg transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-purple-600" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
                </button>
                <span className="text-sm text-purple-700 dark:text-purple-300">Music</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShuffleMode(!isShuffleMode)}
                  className={`p-2 rounded-lg transition-colors ${
                    isShuffleMode 
                      ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' 
                      : 'hover:bg-purple-200/50 dark:hover:bg-purple-800/50 text-purple-500'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 dark:bg-purple-800 rounded-lg appearance-none cursor-pointer slider"
                disabled={isMuted}
              />
              <div 
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg pointer-events-none"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
          </div>

          {/* Ambient Sounds */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Ambient Sounds</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {AMBIENT_SOUNDS.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => toggleAmbientSound(sound.id)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all transform hover:scale-105 ${
                    currentAmbient === sound.id
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {sound.name}
                </button>
              ))}
            </div>

            {currentAmbient && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Ambient Volume</span>
                  <span className="text-xs text-blue-500">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg pointer-events-none"
                    style={{ width: `${(ambientVolume / 0.8) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Track List Preview */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Up Next</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {LOFI_TRACKS.slice(currentTrack + 1, currentTrack + 4).map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center justify-between p-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 rounded-lg cursor-pointer transition-colors"
                  onClick={() => setCurrentTrack(currentTrack + index + 1)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    <span className="text-sm text-purple-700 dark:text-purple-300 truncate">
                      {track.title}
                    </span>
                  </div>
                  <span className="text-xs text-purple-500">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
