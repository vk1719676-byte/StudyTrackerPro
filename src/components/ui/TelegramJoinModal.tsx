"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, MessageSquare, Clock, ThumbsUp, AlertCircle, Heart, Zap, Trophy, Gift, Sparkles, User, Mail } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"

interface TelegramJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onChannelsJoined?: () => void
}

interface ReviewData {
  name: string
  email: string
  rating: number
  comment: string
  timestamp: string
  userId: string
  category: string
  wouldRecommend: boolean
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [joinedChannels, setJoinedChannels] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [canClose, setCanClose] = useState(false)
  const { user } = useAuth()

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [reviewCategory, setReviewCategory] = useState<string>('')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [reviewerName, setReviewerName] = useState<string>('')
  const [reviewerEmail, setReviewerEmail] = useState<string>('')

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

  const reviewCategories = [
    { value: 'overall', label: '💫 Overall', icon: Heart },
    { value: 'features', label: '⚡ Features', icon: Zap },
    { value: 'design', label: '🎨 Design', icon: Sparkles },
    { value: 'performance', label: '🚀 Speed', icon: Trophy },
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
      setTimeLeft(180)
      setShowCloseButton(false)
      setJoinedChannels([])
      setShowSuccess(false)
      setCanClose(false)
      // Reset review form
      setReviewRating(0)
      setReviewComment('')
      setReviewSubmitted(false)
      setSubmitError('')
      setReviewCategory('overall')
      setWouldRecommend(null)
      setReviewerName(displayName)
      setReviewerEmail(user?.email || '')
    }
  }, [isOpen, displayName, user?.email])

  // Check if user can close (either joined channels or submitted review)
  useEffect(() => {
    const allChannelsJoined = joinedChannels.length >= channels.length
    setCanClose(allChannelsJoined || reviewSubmitted)
  }, [joinedChannels.length, reviewSubmitted, channels.length])

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
        }, 2500)
      }, 1000)
    }
  }

  const submitReviewToGoogleSheets = async (reviewData: ReviewData) => {
    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbze5FxAwtudMk6l9hkZuxtrSpHzzmYwe5qswo9IyUIP31m0xfbM7cTy_u2JBahETpAE/exec'
      
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
        mode: 'no-cors'
      })

      return { success: true }
    } catch (error) {
      console.error('Error submitting review:', error)
      return { success: false, error: 'Failed to submit review. Please try again.' }
    }
  }

  const handleReviewSubmit = async () => {
    // Compact validation
    if (reviewRating === 0) {
      setSubmitError('Please rate our app')
      return
    }

    if (reviewComment.trim().length < 10) {
      setSubmitError('Please share at least 10 characters of feedback')
      return
    }

    if (!reviewerName.trim()) {
      setSubmitError('Name is required')
      return
    }

    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) {
      setSubmitError('Valid email is required')
      return
    }

    if (wouldRecommend === null) {
      setSubmitError('Would you recommend us?')
      return
    }

    setIsSubmittingReview(true)
    setSubmitError('')

    const reviewData: ReviewData = {
      name: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      timestamp: new Date().toISOString(),
      userId: user?.uid || 'anonymous',
      category: reviewCategory || 'overall',
      wouldRecommend: wouldRecommend
    }

    const result = await submitReviewToGoogleSheets(reviewData)

    setIsSubmittingReview(false)

    if (result.success) {
      setReviewSubmitted(true)
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose()
      }, 3000)
    } else {
      setSubmitError(result.error || 'Failed to submit review')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const StarRating = () => {
    return (
      <div className="flex items-center gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setReviewRating(star)
              setSubmitError('')
            }}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1"
            disabled={isSubmittingReview}
          >
            <Star
              className={`w-7 h-7 transition-all duration-200 ${
                star <= (hoveredStar || reviewRating)
                  ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  if (!isOpen) return null

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to the Community! 🎉</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks for joining, <span className="font-semibold text-blue-600 dark:text-blue-400">{displayName}</span>!
            You'll receive updates and connect with fellow students.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
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
      <Card className="max-w-xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="relative p-6">
          {/* Header with close button and timer */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Join Our Community</h2>
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
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                canClose ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              }`}>
                {canClose ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Ready to close!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Join channels OR submit review to close</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Compact Review Form */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl p-5 mb-6 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Review</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Help us improve Study Tracker Pro</p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-green-700 dark:text-green-300 mb-1">Thank You! 🎉</h4>
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Your feedback has been submitted.</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Closing automatically...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Compact Personal Info */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => {
                      setReviewerName(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="Your name"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmittingReview}
                  />
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => {
                      setReviewerEmail(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="your@email.com"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmittingReview}
                  />
                </div>

                {/* Star Rating */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rate Study Tracker Pro
                  </label>
                  <StarRating />
                  {reviewRating > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {reviewRating <= 2 && "We'll work harder! 😔"}
                      {reviewRating === 3 && "Thanks for the feedback! 🙂"}
                      {reviewRating >= 4 && "Awesome! Thanks! 😊"}
                    </p>
                  )}
                </div>

                {/* Compact Category & Recommendation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Review focus
                    </label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      disabled={isSubmittingReview}
                    >
                      {reviewCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recommend?
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setWouldRecommend(true)
                          setSubmitError('')
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          wouldRecommend === true
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                        }`}
                        disabled={isSubmittingReview}
                      >
                        👍 Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setWouldRecommend(false)
                          setSubmitError('')
                        }}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          wouldRecommend === false
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                        }`}
                        disabled={isSubmittingReview}
                      >
                        👎 No
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => {
                      setReviewComment(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="Share your experience... What do you like? Any suggestions?"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    rows={3}
                    maxLength={500}
                    disabled={isSubmittingReview}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{reviewComment.length}/500</span>
                    {reviewComment.length >= 10 && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Great!
                      </span>
                    )}
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs text-red-700 dark:text-red-300">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleReviewSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-2.5 shadow-lg hover:shadow-xl transition-all"
                  disabled={isSubmittingReview || reviewRating === 0}
                  icon={isSubmittingReview ? undefined : Send}
                >
                  {isSubmittingReview ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
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
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-gradient-to-r ${channel.color} rounded-lg text-white text-xl shadow-md`}>
                    {channel.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{channel.name}</h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-md transition-all font-medium`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "Joined" : "Join"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{channel.description}</p>

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
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-4 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
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
                  <span className="text-sm">{benefit.icon}</span>
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
