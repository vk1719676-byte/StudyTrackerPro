import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, MessageSquare, Clock, ThumbsUp, AlertCircle, Heart, Zap, Trophy, Gift, Sparkles } from "lucide-react"
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
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [backgroundTimer, setBackgroundTimer] = useState(0)
  const [reviewFormTimer, setReviewFormTimer] = useState(120) // 2 minutes for review form
  const [allChannelsJoined, setAllChannelsJoined] = useState(false)
  const { user } = useAuth()

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [reviewCategory, setReviewCategory] = useState<string>('overall')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [reviewerName, setReviewerName] = useState<string>('')
  const [reviewerEmail, setReviewerEmail] = useState<string>('')

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

  const reviewCategories = [
    { value: 'overall', label: '💫 Overall' },
    { value: 'features', label: '⚡ Features' },
    { value: 'design', label: '🎨 Design' },
    { value: 'performance', label: '🚀 Speed' },
  ]

  // Background timer effect - runs after all channels are joined
  useEffect(() => {
    if (!allChannelsJoined) return

    const timer = setInterval(() => {
      setBackgroundTimer((prev) => {
        const newTime = prev + 1
        // Show review form after 3-4 minutes (180-240 seconds)
        if (newTime >= 200 && !showReviewForm && !reviewSubmitted) { // 3 minutes 20 seconds
          setShowReviewForm(true)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [allChannelsJoined, showReviewForm, reviewSubmitted])

  // Review form timer - 2 minutes to close after review form appears
  useEffect(() => {
    if (!showReviewForm) return

    const timer = setInterval(() => {
      setReviewFormTimer((prev) => {
        if (prev <= 1) {
          // Auto close if no review submitted
          if (!reviewSubmitted) {
            onClose()
          }
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showReviewForm, reviewSubmitted, onClose])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setJoinedChannels([])
      setShowSuccess(false)
      setShowReviewForm(false)
      setBackgroundTimer(0)
      setReviewFormTimer(120)
      setAllChannelsJoined(false)
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

  const submitReviewToGoogleSheets = async (reviewData: ReviewData) => {
    try {
      const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbze5FxAwtudMk6l9hkZuxtrSpHzzmYwe5qswo9IyUIP31m0xfbM7cTy_u2JBahETpAE/exec'
      
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    // Validation
    if (reviewRating === 0) return setSubmitError('Please rate our app')
    if (reviewComment.trim().length < 10) return setSubmitError('Please share at least 10 characters of feedback')
    if (!reviewerName.trim()) return setSubmitError('Name is required')
    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) return setSubmitError('Valid email is required')
    if (wouldRecommend === null) return setSubmitError('Would you recommend us?')

    setIsSubmittingReview(true)
    setSubmitError('')

    const reviewData: ReviewData = {
      name: reviewerName.trim(),
      email: reviewerEmail.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      timestamp: new Date().toISOString(),
      userId: user?.uid || 'anonymous',
      category: reviewCategory,
      wouldRecommend: wouldRecommend
    }

    const result = await submitReviewToGoogleSheets(reviewData)
    setIsSubmittingReview(false)

    if (result.success) {
      setReviewSubmitted(true)
      // Close after 3 seconds
      setTimeout(() => onClose(), 3000)
    } else {
      setSubmitError(result.error || 'Failed to submit review')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const StarRating = () => (
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
            className={`w-6 h-6 transition-all duration-200 ${
              star <= (hoveredStar || reviewRating)
                ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  )

  if (!isOpen) return null

  // Success screen - shows when all channels joined
  if (showSuccess && !showReviewForm) {
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

  // Review form screen - shows after background timer
  if (showReviewForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <Card className="max-w-lg w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
          <div className="relative p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 via-orange-600 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Quick Review</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Hey <span className="font-semibold text-orange-600 dark:text-orange-400">{displayName}</span>! 👋
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                <Clock className="w-3 h-3" />
                <span>{formatTime(reviewFormTimer)} left</span>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <ThumbsUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Thank You! 🎉</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Your feedback has been submitted.</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Closing automatically...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Intro */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                    Help us improve Study Tracker Pro with your feedback! ⭐
                  </p>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => {
                      setReviewerName(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="Your name"
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400"
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmittingReview}
                  />
                </div>

                {/* Star Rating */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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

                {/* Category & Recommendation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Review focus</label>
                    <select
                      value={reviewCategory}
                      onChange={(e) => setReviewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      disabled={isSubmittingReview}
                    >
                      {reviewCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Recommend?</label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setWouldRecommend(true)
                          setSubmitError('')
                        }}
                        className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium border transition-all ${
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
                        className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium border transition-all ${
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
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
                      <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleReviewSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all"
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

                {/* Skip option */}
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    Skip review (closes in {formatTime(reviewFormTimer)})
                  </button>
                </div>
              </div>
            )}
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
}
