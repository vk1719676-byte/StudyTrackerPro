"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, MessageCircle, Clock, Heart, Zap } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"
import emailjs from '@emailjs/browser'
import { EMAIL_CONFIG } from '../../utils/emailSetup'

interface TelegramJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onChannelsJoined?: () => void
}

interface ReviewForm {
  rating: number
  experience: string
  features: string[]
  recommendation: number
  comments: string
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [joinedChannels, setJoinedChannels] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const { user } = useAuth()

  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    experience: '',
    features: [],
    recommendation: 0,
    comments: ''
  })

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

  const experienceOptions = [
    { value: 'excellent', label: 'Excellent - Exceeded expectations', icon: '🌟' },
    { value: 'good', label: 'Good - Met expectations', icon: '👍' },
    { value: 'average', label: 'Average - Some room for improvement', icon: '👌' },
    { value: 'poor', label: 'Poor - Needs significant improvement', icon: '👎' }
  ]

  const featureOptions = [
    { value: 'ui-design', label: 'Beautiful UI/UX Design', icon: '🎨' },
    { value: 'functionality', label: 'Core Functionality', icon: '⚡' },
    { value: 'performance', label: 'App Performance', icon: '🚀' },
    { value: 'ease-of-use', label: 'Easy to Use', icon: '✨' },
    { value: 'study-tools', label: 'Study Tools', icon: '📚' },
    { value: 'progress-tracking', label: 'Progress Tracking', icon: '📊' }
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
      setReviewSubmitted(false)
      setReviewForm({
        rating: 0,
        experience: '',
        features: [],
        recommendation: 0,
        comments: ''
      })
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

  const handleRatingClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }))
  }

  const handleRecommendationClick = (recommendation: number) => {
    setReviewForm(prev => ({ ...prev, recommendation }))
  }

  const handleFeatureToggle = (feature: string) => {
    setReviewForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmitReview = async () => {
    try {
      // Create review data
      const reviewData = {
        user: {
          uid: user?.uid,
          email: user?.email,
          displayName: displayName
        },
        review: reviewForm,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }

      console.log('Review submitted:', reviewData)

      // Send email using EmailJS
      const emailParams = {
        to_email: EMAIL_CONFIG.TO_EMAIL,
        from_name: displayName,
        user_email: user?.email || 'Anonymous',
        rating: '⭐'.repeat(reviewForm.rating),
        experience: reviewForm.experience,
        features: reviewForm.features.join(', '),
        recommendation: reviewForm.recommendation,
        comments: reviewForm.comments || 'No additional comments',
        timestamp: new Date().toLocaleString(),
        user_id: user?.uid || 'Anonymous'
      }

      // Send email using your EmailJS configuration
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        emailParams,
        EMAIL_CONFIG.PUBLIC_KEY
      )

      setReviewSubmitted(true)
      
      // Show success message
      setTimeout(() => {
        setReviewSubmitted(false)
      }, 3000)

    } catch (error) {
      console.error('Error submitting review:', error)
      // Show error message to user
      alert('Failed to submit review. Please try again.')
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

          {/* Review Form Section */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 border border-pink-200 dark:border-pink-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Share Your Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Help us improve Study Tracker</p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Thank You! 💜</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your review has been submitted successfully.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= reviewForm.rating
                            ? 'text-yellow-400 hover:text-yellow-500'
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How was your experience?
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {experienceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setReviewForm(prev => ({ ...prev, experience: option.value }))}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          reviewForm.experience === option.value
                            ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What did you like most? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {featureOptions.map((feature) => (
                      <button
                        key={feature.value}
                        onClick={() => handleFeatureToggle(feature.value)}
                        className={`p-2 rounded-lg border text-left transition-all text-xs ${
                          reviewForm.features.includes(feature.value)
                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className="mr-1">{feature.icon}</span>
                        <span>{feature.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How likely are you to recommend Study Tracker? (0-10)
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {[...Array(11)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecommendationClick(i)}
                        className={`w-8 h-8 rounded-lg border text-sm transition-colors ${
                          reviewForm.recommendation === i
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    value={reviewForm.comments}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Share any additional thoughts or suggestions..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitReview}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg"
                  icon={Heart}
                  disabled={reviewForm.rating === 0}
                >
                  Submit Review
                </Button>
              </div>
            )}
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
