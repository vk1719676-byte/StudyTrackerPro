"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, Play, Clock } from "lucide-react"
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
    window.open("https://youtu.be/ne9YlsIMSrI", "_blank")
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

          {/* Tutorial Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 mb-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">YouTube Video Tutorial</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to use Study Tracker</p>
              </div>
            </div>
            
            {/* Embedded YouTube Video */}
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-gray-900">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ne9YlsIMSrI"
                title="Study Tracker Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                📺 Watch to get started quickly
              </p>
              <Button
                onClick={handleTutorial}
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                icon={ExternalLink}
              >
                Open in YouTube
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
    </div>
  )
}
