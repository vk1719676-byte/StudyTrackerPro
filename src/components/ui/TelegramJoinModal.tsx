import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, ExternalLink, CheckCircle, AlertCircle, Gift, Sparkles } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"
import { ReviewForm } from "./ReviewForm"

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [joinedChannels, setJoinedChannels] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [backgroundTimer, setBackgroundTimer] = useState(0)
  const [reviewFormTimer, setReviewFormTimer] = useState(120) // 2 minutes for review form
  const [allChannelsJoined, setAllChannelsJoined] = useState(false)
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

  // Background timer effect - runs after all channels are joined
  useEffect(() => {
    if (!allChannelsJoined) return

    const timer = setInterval(() => {
      setBackgroundTimer((prev) => {
        const newTime = prev + 1
        // Show review form after 1 minute (60 seconds)
        if (newTime >= 60 && !showReviewForm) {
          setShowReviewForm(true)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [allChannelsJoined, showReviewForm])

  // Review form timer - 2 minutes to close after review form appears
  useEffect(() => {
    if (!showReviewForm) return

    const timer = setInterval(() => {
      setReviewFormTimer((prev) => {
        if (prev <= 1) {
          setShowReviewForm(false)
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showReviewForm])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setJoinedChannels([])
      setShowSuccess(false)
      setShowReviewForm(false)
      setBackgroundTimer(0)
      setReviewFormTimer(120)
      setAllChannelsJoined(false)
    }
  }, [isOpen])

  const handleJoinChannel = (channelId: string, url: string) => {
    window.open(url, "_blank")
    setJoinedChannels((prev) => {
      const newJoined = [...prev, channelId]
      
      // Check if all channels are joined
      if (newJoined.length >= channels.length) {
        setAllChannelsJoined(true)
        onChannelsJoined?.()
        
        // Show success and close immediately
        setShowSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000) // Close after 2 seconds
      }
      
      return newJoined
    })
  }

  const handleReviewFormClose = () => {
    setShowReviewForm(false)
  }

  if (!isOpen) return null

  // Show review form
  if (showReviewForm) {
    return (
      <ReviewForm
        isOpen={showReviewForm}
        onClose={handleReviewFormClose}
        displayName={displayName}
        userEmail={user?.email || ''}
        userId={user?.uid || 'anonymous'}
        timeLeft={reviewFormTimer}
      />
    )
  }

  // Success screen - shows when all channels joined
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

  // Main modal - channel joining screen
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="max-w-lg w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
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
          </div>

          {/* Progress Indicator */}
          <div className="mb-5">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <AlertCircle className="w-4 h-4" />
                <span>Join both channels to continue</span>
              </div>
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
