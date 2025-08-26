import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, Play, Clock, Gift, Sparkles, AlertCircle } from "lucide-react"
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
  const [timeLeft, setTimeLeft] = useState(180)
  const [canClose, setCanClose] = useState(false)
  const { user } = useAuth()

  // Get display name
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null
  const displayName = savedDisplayName || user?.displayName || user?.email?.split("@")[0] || "Student"

  const channels = [
    {
      id: "main",
      name: "Study Tracker Pro",
      url: "https://t.me/studytrackerpro",
      description: "Main community for updates, tips, and study motivation",
      members: "260+ members",
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

  // Timer effect
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(180)
      setShowCloseButton(false)
      setJoinedChannels([])
      setShowSuccess(false)
      setCanClose(false)
    }
  }, [isOpen])

  // Check if user can close
  useEffect(() => {
    const allChannelsJoined = joinedChannels.length >= channels.length
    setCanClose(allChannelsJoined)
  }, [joinedChannels.length, channels.length])

  const handleJoinChannel = (channelId: string, url: string) => {
    window.open(url, "_blank")
    setJoinedChannels((prev) => [...prev, channelId])

    if (joinedChannels.length + 1 >= channels.length) {
      onChannelsJoined?.()
      setTimeout(() => {
        setShowSuccess(true)
        setTimeout(() => onClose(), 2500)
      }, 1000)
    }
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
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to the Community! 🎉</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks for joining, <span className="font-semibold text-blue-600 dark:text-blue-400">{displayName}</span>!
            You'll receive updates and connect with fellow students.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Get ready for an amazing study journey!
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="relative p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Join Our Community</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Hey <span className="font-semibold text-purple-600 dark:text-purple-400">{displayName}</span>! 👋
                </p>
              </div>
            </div>

            {(showCloseButton || canClose) ? (
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:scale-105"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                <Clock className="w-3 h-3" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-center mb-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  canClose 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-600' 
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-600'
                }`}>
                  {canClose ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready to continue to dashboard! 🎉</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Join both channels to continue</span>
                    </>
                  )}
                </div>
              </div>
              
              {!canClose && (
                <div className="text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>To access your dashboard:</strong>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Please join <span className="font-semibold text-blue-600 dark:text-blue-400">both Telegram channels</span> below to unlock full access to Study Tracker Pro
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${joinedChannels.includes('main') ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span>Study Tracker Pro</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${joinedChannels.includes('premium') ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span>TRMS Premium</span>
                    </div>
                  </div>
                </div>
              )}
              
              {canClose && (
                <div className="text-center">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    🎊 <strong>Welcome to the community!</strong>
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    You can now close this modal and access your full dashboard
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tutorial Video Section */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">Watch Tutorial</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Learn how to use Study Tracker Pro effectively</p>
              </div>
            </div>

            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/ne9YlsIMSrI"
                title="Study Tracker Pro Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Play className="w-4 h-4" />
              <span>Watch to get the most out of your study sessions!</span>
            </div>
          </div>

          {/* Channels Section */}
          <div className="space-y-3 mb-4">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Join Telegram Channels
            </h3>

            {channels.map((channel) => (
              <div
                key={channel.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r ${channel.color} rounded-lg text-white text-lg shadow-md`}>
                    {channel.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{channel.name}</h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-md transition-all font-medium text-xs px-3 py-1`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "Joined" : "Join"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{channel.description}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{channel.members}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-3 mb-4 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4 text-yellow-500" />
              What You'll Get
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Daily motivation", icon: "💪" },
                { label: "App updates", icon: "🚀" },
                { label: "Study tips", icon: "💡" },
                { label: "Study community", icon: "👥" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                  <span>{benefit.icon}</span>
                  <span className="font-medium">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Find these channels later in Settings → Contact Us
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
