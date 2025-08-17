import React, { useState, useEffect } from 'react';
import { Send, Users, Star, X, ExternalLink, CheckCircle, Play, Clock, Heart } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { useAuth } from '../../contexts/AuthContext';

interface TelegramJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelsJoined?: () => void;
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [joinedChannels, setJoinedChannels] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const { user } = useAuth();

  // Get saved display name or fallback to email username
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null;
  const displayName = savedDisplayName || user?.displayName || user?.email?.split('@')[0] || 'Student';

  const channels = [
    {
      id: 'main',
      name: 'Study Tracker Pro',
      url: 'https://t.me/studytrackerpro',
      description: 'Main community for updates, tips, and study motivation',
      members: '150+ members',
      icon: '📚',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'premium',
      name: 'TRMS Premium',
      url: 'https://t.me/+_fkSUEqyukFiMjI1',
      description: 'Premium features and advanced study tools',
      members: '25K+ members',
      icon: '⭐',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Timer effect for close button
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowCloseButton(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120);
      setShowCloseButton(false);
      setJoinedChannels([]);
      setShowSuccess(false);
    }
  }, [isOpen]);

  // Calculate days until Independence Day 2025
  const getIndependenceDayCountdown = () => {
    const independenceDayDate = new Date('2025-08-15T00:00:00');
    const now = new Date();
    const timeDiff = independenceDayDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleJoinChannel = (channelId: string, url: string) => {
    // Open Telegram channel
    window.open(url, '_blank');

    // Mark as joined
    setJoinedChannels(prev => [...prev, channelId]);

    // Check if all channels are joined
    if (joinedChannels.length + 1 >= channels.length) {
      onChannelsJoined?.();
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 1000);
    }
  };

  const handleTutorial = () => {
    window.open('https://youtu.be/2qexru15k0c?si=01wYr_K9Yn-I2HWD', '_blank');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome to the Community! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks for joining, <span className="font-semibold text-blue-600 dark:text-blue-400">{displayName}</span>! 
            You'll receive updates and connect with fellow students.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              🚀 Get ready for an amazing study journey!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="relative p-6">
          {/* Header with close button and timer */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Join Our Community
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Hey <span className="font-semibold text-purple-600 dark:text-purple-400">{displayName}</span>! 👋
                </p>
              </div>
            </div>

            {showCloseButton ? (
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Compact Independence Day Section */}
          <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 dark:from-orange-900/20 dark:via-gray-800 dark:to-green-900/20 rounded-lg p-3 mb-4 border border-orange-200 dark:border-orange-700 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1 right-2 text-lg animate-pulse opacity-30">🇮🇳</div>
            <div className="absolute bottom-1 left-2 text-sm animate-bounce opacity-30">✨</div>
            
            <div className="flex items-center gap-3">
              {/* 3D Indian Flag Animation */}
              <div className="flex items-center gap-2 relative">
                {/* Flag Pole */}
                <div className="w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-600 relative animate-flag-sway">
                  {/* Flag */}
                  <div className="absolute -right-0 top-1 w-8 h-6 rounded-sm overflow-hidden animate-flag-wave shadow-lg">
                    {/* Saffron */}
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400 animate-tricolor-glow"></div>
                    {/* White with Chakra */}
                    <div className="h-2 bg-white relative flex items-center justify-center">
                      <div className="w-2 h-2 border border-blue-600 rounded-full relative animate-chakra-spin">
                        <div className="absolute inset-0.5 border border-blue-500 rounded-full"></div>
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    {/* Green */}
                    <div className="h-2 bg-gradient-to-r from-green-600 to-green-500 animate-tricolor-glow"></div>
                  </div>
                  
                  {/* Flag sparkles */}
                  <div className="absolute -right-1 top-0 w-1 h-1 bg-yellow-400 rounded-full animate-flag-sparkle opacity-0"></div>
                  <div className="absolute -right-2 top-2 w-0.5 h-0.5 bg-orange-400 rounded-full animate-flag-sparkle-delay opacity-0"></div>
                  <div className="absolute -right-1 top-4 w-0.5 h-0.5 bg-green-400 rounded-full animate-flag-sparkle-alt opacity-0"></div>
                </div>

                {/* Patriotic Heart */}
                <Heart className="w-3 h-3 text-red-500 animate-patriotic-heartbeat mx-1" fill="currentColor" />

                {/* Saluting Figure */}
                <div className="relative animate-salute-figure">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-white to-green-400 rounded-full relative animate-figure-float border-2 border-blue-500">
                    <div className="absolute inset-1 bg-yellow-100 rounded-full">
                      <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-black rounded-full animate-eye-blink"></div>
                      <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-black rounded-full animate-eye-blink-delay"></div>
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-red-400 rounded-full animate-smile"></div>
                    </div>
                    {/* Turban/Cap */}
                    <div className="absolute -top-1 -left-1 -right-1 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-full border border-orange-600"></div>
                  </div>
                  <div className="w-5 h-6 bg-gradient-to-b from-blue-500 to-blue-600 mx-1.5 rounded-b-lg relative">
                    {/* Saluting arm */}
                    <div className="absolute -right-1 top-0 w-2 h-3 bg-yellow-200 rounded-full transform rotate-45 animate-salute-wave"></div>
                    {/* Other arm */}
                    <div className="absolute -left-1 top-1 w-2 h-3 bg-yellow-200 rounded-full transform -rotate-12 animate-gentle-sway"></div>
                  </div>
                  
                  {/* Medals/Badge */}
                  <div className="absolute top-6 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-medal-shine border border-orange-500"></div>
                </div>
              </div>

              {/* Festival Info */}
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs bg-gradient-to-r from-orange-500 via-white to-green-500 text-gray-900 px-2 py-0.5 rounded-full font-bold border border-gray-300">
                    🇮🇳 Coming Soon
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  August 15th • {getIndependenceDayCountdown()} days to go!
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                  🏴 Celebrate Freedom with Study Family
                </p>
              </div>
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 mb-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">App Tutorial</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to use Study Tracker</p>
                </div>
              </div>
              <Button
                onClick={handleTutorial}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg"
                icon={ExternalLink}
              >
                Watch
              </Button>
            </div>
          </div>

          {/* Channels Section */}
          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Join Telegram Channels
            </h3>
            
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 bg-gradient-to-r ${channel.color} rounded-lg text-white text-xl flex-shrink-0`}>
                    {channel.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {channel.name}
                      </h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-lg`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? 'Joined' : 'Join'}
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {channel.description}
                    </p>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{channel.members}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              What You'll Get
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Daily motivation', color: 'bg-green-500' },
                { label: 'App updates', color: 'bg-blue-500' },
                { label: 'Study tips', color: 'bg-purple-500' },
                { label: 'Study buddies', color: 'bg-orange-500' },
                { label: 'Contests & rewards', color: 'bg-red-500' },
                { label: 'Priority support', color: 'bg-indigo-500' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className={`w-2 h-2 ${benefit.color} rounded-full`}></div>
                  <span>{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              💡 You can find these channels later in Settings → Contact Us
            </p>
          </div>
        </div>
      </Card>

      {/* Custom CSS for Independence Day animations */}
      <style jsx>{`
        /* Indian Flag Animations */
        @keyframes flag-wave {
          0%, 100% { 
            transform: skewX(0deg) scaleX(1);
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
          }
          25% { 
            transform: skewX(-2deg) scaleX(1.02);
            filter: drop-shadow(3px 2px 6px rgba(0,0,0,0.15));
          }
          50% { 
            transform: skewX(0deg) scaleX(1.05);
            filter: drop-shadow(4px 2px 8px rgba(0,0,0,0.2));
          }
          75% { 
            transform: skewX(2deg) scaleX(1.02);
            filter: drop-shadow(3px 2px 6px rgba(0,0,0,0.15));
          }
        }

        @keyframes flag-sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }

        @keyframes chakra-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes tricolor-glow {
          0%, 100% { 
            filter: brightness(1) saturate(1);
          }
          50% { 
            filter: brightness(1.1) saturate(1.2);
          }
        }

        @keyframes flag-sparkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        @keyframes flag-sparkle-delay {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          25% { opacity: 0; }
          75% { 
            opacity: 1;
            transform: scale(1.2) rotate(-180deg);
          }
        }

        @keyframes flag-sparkle-alt {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          33% { opacity: 0; }
          67% { 
            opacity: 1;
            transform: scale(1.3) rotate(270deg);
          }
        }

        /* Patriotic Character Animations */
        @keyframes figure-float {
          0%, 100% { 
            transform: translateY(0px) rotateY(-5deg);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          }
          50% { 
            transform: translateY(-4px) rotateY(5deg);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
          }
        }

        @keyframes salute-wave {
          0%, 100% { transform: rotate(45deg) scale(1); }
          50% { transform: rotate(50deg) scale(1.1); }
        }

        @keyframes salute-figure {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes patriotic-heartbeat {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
          }
          50% { 
            transform: scale(1.2);
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.8));
          }
        }

        @keyframes medal-shine {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 3px rgba(251, 191, 36, 0.5);
          }
          50% { 
            transform: scale(1.3);
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.9);
          }
        }

        /* Apply Independence Day Animations */
        .animate-flag-wave {
          animation: flag-wave 2s ease-in-out infinite;
        }

        .animate-flag-sway {
          animation: flag-sway 3s ease-in-out infinite;
        }

        .animate-chakra-spin {
          animation: chakra-spin 4s linear infinite;
        }

        .animate-tricolor-glow {
          animation: tricolor-glow 3s ease-in-out infinite;
        }

        .animate-flag-sparkle {
          animation: flag-sparkle 2s ease-in-out infinite;
        }

        .animate-flag-sparkle-delay {
          animation: flag-sparkle-delay 2s ease-in-out infinite;
        }

        .animate-flag-sparkle-alt {
          animation: flag-sparkle-alt 2s ease-in-out infinite;
        }

        .animate-figure-float {
          animation: figure-float 3s ease-in-out infinite;
        }

        .animate-salute-wave {
          animation: salute-wave 2s ease-in-out infinite;
        }

        .animate-salute-figure {
          animation: salute-figure 4s ease-in-out infinite;
        }

        .animate-patriotic-heartbeat {
          animation: patriotic-heartbeat 1.5s ease-in-out infinite;
        }

        .animate-medal-shine {
          animation: medal-shine 2s ease-in-out infinite;
        }

        /* Keep existing animations for other elements */
        @keyframes gentle-sway {
          0%, 100% { transform: rotate(-12deg); }
          50% { transform: rotate(-8deg); }
        }

        @keyframes eye-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        @keyframes eye-blink-delay {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }

        @keyframes smile {
          0%, 100% { transform: translateX(-50%) scaleX(1); }
          50% { transform: translateX(-50%) scaleX(1.2); }
        }

        .animate-gentle-sway {
          animation: gentle-sway 4s ease-in-out infinite;
        }

        .animate-eye-blink {
          animation: eye-blink 4s ease-in-out infinite;
        }

        .animate-eye-blink-delay {
          animation: eye-blink-delay 4s ease-in-out infinite;
        }

        .animate-smile {
          animation: smile 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};