"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, Play, Clock, Trophy, Zap, Target } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"

interface TelegramJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onChannelsJoined?: () => void
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [joinedChannels, setJoinedChannels] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const { user } = useAuth()

  // Get saved display name or fallback to email username
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null
  const displayName = savedDisplayName || user?.displayName || user?.email?.split("@")[0] || "Student"

  const channels = [
    {
      id: "main",
      name: "Study Tracker Pro",
      url: "https://t.me/studytrackerpro",
      description: "Main community for updates, tips, and study motivation",
      members: "150+ members",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "premium",
      name: "TRMS Premium",
      url: "https://t.me/+_fkSUEqyukFiMjI1",
      description: "Premium features and advanced study tools",
      members: "25K+ members",
      icon: "⭐",
      color: "from-purple-500 to-pink-500",
    },
  ]

  // Timer effect for close button
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowCloseButton(true)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120)
      setShowCloseButton(false)
      setJoinedChannels([])
      setShowSuccess(false)
    }
  }, [isOpen])

  const getCommunityStats = () => {
    const joinDate = new Date()
    const studyStreak = Math.floor(Math.random() * 30) + 1 // Simulated streak
    const totalMembers = 25150 + Math.floor(Math.random() * 100) // Dynamic member count
    return { joinDate, studyStreak, totalMembers }
  }

  const handleJoinChannel = (channelId: string, url: string) => {
    // Open Telegram channel
    window.open(url, "_blank")

    // Mark as joined
    setJoinedChannels((prev) => [...prev, channelId])

    // Check if all channels are joined
    if (joinedChannels.length + 1 >= channels.length) {
      onChannelsJoined?.()
      setTimeout(() => {
        setShowSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      }, 1000)
    }
  }

  const handleTutorial = () => {
    window.open("https://youtu.be/2qexru15k0c?si=01wYr_K9Yn-I2HWD", "_blank")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to the Community! 🎉</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks for joining, <span className="font-semibold text-blue-600 dark:text-blue-400">{displayName}</span>!
            You'll receive updates and connect with fellow students.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">🚀 Get ready for an amazing study journey!</p>
          </div>
        </Card>
      </div>
    )
  }

  const { totalMembers } = getCommunityStats()

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
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Join Our Community</h2>
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

          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-700 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-2 right-3 text-2xl animate-bounce opacity-30">🎯</div>
            <div className="absolute bottom-2 left-3 text-lg animate-pulse opacity-30">⚡</div>

            <div className="flex items-center gap-4">
              {/* Animated Trophy */}
              <div className="flex items-center gap-2 relative">
                <div className="relative animate-trophy-glow">
                  <Trophy className="w-8 h-8 text-yellow-500 animate-trophy-bounce" fill="currentColor" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-sparkle"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-sparkle-delay"></div>
                </div>

                {/* Study Streak Indicator */}
                <div className="flex flex-col items-center">
                  <Zap className="w-6 h-6 text-orange-500 animate-zap-pulse" fill="currentColor" />
                  <div className="text-xs font-bold text-orange-600 dark:text-orange-400 animate-number-count">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                </div>

                {/* Target Achievement */}
                <div className="relative">
                  <Target className="w-6 h-6 text-green-500 animate-target-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bullseye"></div>
                  </div>
                </div>
              </div>

              {/* Community Stats */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full font-bold">
                    🔥 Active Community
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Join {totalMembers.toLocaleString()}+ Study Champions
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">🎓 Average study streak: 28 days</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">💪 Together we achieve more!</p>
              </div>
            </div>
          </div>

          {/* Quick Tips Section */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 mb-4 border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                <Star className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100">Quick Start Tips</h4>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {[
                { tip: "Set daily study goals", icon: "🎯" },
                { tip: "Track your progress", icon: "📊" },
                { tip: "Join study sessions", icon: "👥" },
                { tip: "Celebrate milestones", icon: "🎉" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2 bg-white/50 dark:bg-gray-800/50 rounded-md"
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.tip}</span>
                </div>
              ))}
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
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{channel.name}</h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-lg`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "Joined" : "Join"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{channel.description}</p>

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
                { label: "Daily motivation", color: "bg-green-500" },
                { label: "App updates", color: "bg-blue-500" },
                { label: "Study tips", color: "bg-purple-500" },
                { label: "Study buddies", color: "bg-orange-500" },
                { label: "Contests & rewards", color: "bg-red-500" },
                { label: "Priority support", color: "bg-indigo-500" },
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

      <style jsx>{`
        /* Community Achievement Animations */
        @keyframes trophy-bounce {
          0%, 100% { 
            transform: translateY(0px) rotate(-5deg);
          }
          50% { 
            transform: translateY(-8px) rotate(5deg);
          }
        }

        @keyframes trophy-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.6));
          }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        @keyframes sparkle-delay {
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

        @keyframes zap-pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 3px rgba(249, 115, 22, 0.5));
          }
          50% { 
            transform: scale(1.2);
            filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8));
          }
        }

        @keyframes target-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes bullseye {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.7;
          }
        }

        @keyframes number-count {
          0%, 90%, 100% { 
            transform: scale(1);
          }
          95% { 
            transform: scale(1.2);
          }
        }

        /* Apply new animations */
        .animate-trophy-bounce {
          animation: trophy-bounce 2s ease-in-out infinite;
        }

        .animate-trophy-glow {
          animation: trophy-glow 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-sparkle-delay {
          animation: sparkle-delay 2s ease-in-out infinite;
        }

        .animate-zap-pulse {
          animation: zap-pulse 1.5s ease-in-out infinite;
        }

        .animate-target-spin {
          animation: target-spin 4s linear infinite;
        }

        .animate-bullseye {
          animation: bullseye 2s ease-in-out infinite;
        }

        .animate-number-count {
          animation: number-count 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
