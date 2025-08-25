"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, MessageSquare, Clock, ThumbsUp, AlertCircle, Heart, Zap, Trophy, Gift, Sparkles, Camera, Mail, User } from "lucide-react"
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
  favoriteFeature: string
  improvement: string
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
  
  // Enhanced review form fields
  const [reviewCategory, setReviewCategory] = useState<string>('')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [favoriteFeature, setFavoriteFeature] = useState<string>('')
  const [improvementSuggestion, setImprovementSuggestion] = useState<string>('')
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
    { value: 'ui-design', label: '🎨 UI/Design', icon: Sparkles },
    { value: 'features', label: '⚡ Features', icon: Zap },
    { value: 'performance', label: '🚀 Performance', icon: Trophy },
    { value: 'usability', label: '👤 Usability', icon: User },
    { value: 'overall', label: '💫 Overall Experience', icon: Heart },
  ]

  const favoriteFeatures = [
    'Study Timer & Pomodoro',
    'Progress Tracking',
    'Goal Setting',
    'Statistics & Analytics',
    'Dark Mode',
    'Notifications',
    'Study Sessions',
    'Habit Tracking',
    'Calendar Integration',
    'Export Features'
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
      setReviewCategory('')
      setWouldRecommend(null)
      setFavoriteFeature('')
      setImprovementSuggestion('')
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
    // Validation
    if (reviewRating === 0) {
      setSubmitError('Please select a rating')
      return
    }

    if (reviewComment.trim().length < 10) {
      setSubmitError('Please provide at least 10 characters of feedback')
      return
    }

    if (!reviewerName.trim()) {
      setSubmitError('Please enter your name')
      return
    }

    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) {
      setSubmitError('Please enter a valid email address')
      return
    }

    if (!reviewCategory) {
      setSubmitError('Please select a review category')
      return
    }

    if (wouldRecommend === null) {
      setSubmitError('Please let us know if you would recommend our app')
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
      category: reviewCategory,
      wouldRecommend: wouldRecommend,
      favoriteFeature: favoriteFeature || 'Not specified',
      improvement: improvementSuggestion.trim() || 'No suggestions'
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
              className={`w-8 h-8 transition-all duration-200 ${
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
      <Card className="max-w-2xl w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="relative p-6">
          {/* Header with close button and timer */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <Send className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Join Our Community</h2>
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

          {/* Enhanced Review Form Section */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-700 shadow-inner">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Rate Our App</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your feedback helps us improve Study Tracker Pro</p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                  <ThumbsUp className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Thank You! 🎉</h4>
                <p className="text-green-600 dark:text-green-400 mb-2">Your detailed feedback has been submitted successfully.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">This popup will close automatically in a few seconds...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => {
                        setReviewerName(e.target.value)
                        setSubmitError('')
                      }}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                               placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      disabled={isSubmittingReview}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={reviewerEmail}
                      onChange={(e) => {
                        setReviewerEmail(e.target.value)
                        setSubmitError('')
                      }}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                               placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      disabled={isSubmittingReview}
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                    How would you rate Study Tracker Pro? *
                  </label>
                  <StarRating />
                  {reviewRating > 0 && (
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">
                      {reviewRating === 1 && "We'll work harder to improve! 😔"}
                      {reviewRating === 2 && "Thanks for the feedback! 🤔"}
                      {reviewRating === 3 && "Good to know, we'll keep improving! 🙂"}
                      {reviewRating === 4 && "Great! We're glad you like it! 😊"}
                      {reviewRating === 5 && "Awesome! Thanks for the love! 🎉"}
                    </p>
                  )}
                </div>

                {/* Review Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What aspect are you reviewing? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {reviewCategories.map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setReviewCategory(category.value)
                          setSubmitError('')
                        }}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          reviewCategory === category.value
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600'
                        }`}
                        disabled={isSubmittingReview}
                      >
                        <category.icon className="w-4 h-4 mx-auto mb-1" />
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Would you recommend Study Tracker Pro to others? *
                  </label>
                  <div className="flex gap-4 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(true)
                        setSubmitError('')
                      }}
                      className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👍 Yes, definitely!
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(false)
                        setSubmitError('')
                      }}
                      className={`px-6 py-3 rounded-lg border-2 transition-all font-medium ${
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👎 Not really
                    </button>
                  </div>
                </div>

                {/* Favorite Feature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What's your favorite feature? (Optional)
                  </label>
                  <select
                    value={favoriteFeature}
                    onChange={(e) => setFavoriteFeature(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    disabled={isSubmittingReview}
                  >
                    <option value="">Select a feature...</option>
                    {favoriteFeatures.map((feature) => (
                      <option key={feature} value={feature}>{feature}</option>
                    ))}
                  </select>
                </div>

                {/* Main Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share your detailed thoughts *
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => {
                      setReviewComment(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="What do you like most? How has the app helped you? Any specific experiences you'd like to share?"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             placeholder-gray-500 dark:placeholder-gray-400
                             resize-none transition-colors"
                    rows={4}
                    maxLength={1000}
                    disabled={isSubmittingReview}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {reviewComment.length}/1000 characters
                    </span>
                    {reviewComment.length >= 10 && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Great feedback!
                      </span>
                    )}
                  </div>
                </div>

                {/* Improvement Suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Any suggestions for improvement? (Optional)
                  </label>
                  <textarea
                    value={improvementSuggestion}
                    onChange={(e) => setImprovementSuggestion(e.target.value)}
                    placeholder="What features would you like to see? Any bugs or issues you've encountered?"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                             placeholder-gray-500 dark:placeholder-gray-400
                             resize-none transition-colors"
                    rows={3}
                    maxLength={500}
                    disabled={isSubmittingReview}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">
                    {improvementSuggestion.length}/500 characters
                  </span>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleReviewSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isSubmittingReview || reviewRating === 0}
                  icon={isSubmittingReview ? undefined : Send}
                >
                  {isSubmittingReview ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Your Review...
                    </div>
                  ) : (
                    'Submit Detailed Review'
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  🙏 Your detailed feedback helps us build better study tools for everyone!
                </p>
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
            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-lg">
              <Send className="w-5 h-5" />
              Join Telegram Channels
            </h3>

            {channels.map((channel) => (
              <div
                key={channel.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 bg-gradient-to-r ${channel.color} rounded-xl text-white text-2xl flex-shrink-0 shadow-lg`}>
                    {channel.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{channel.name}</h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-lg transition-all duration-200 font-semibold`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "Joined ✓" : "Join Now"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3">{channel.description}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{channel.members}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Benefits Section */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 mb-4 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-yellow-500" />
              What You'll Get
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Daily motivation", color: "bg-green-500", icon: "💪" },
                { label: "App updates", color: "bg-blue-500", icon: "🚀" },
                { label: "Study tips", color: "bg-purple-500", icon: "💡" },
                { label: "Study buddies", color: "bg-orange-500", icon: "👥" },
                { label: "Contests & rewards", color: "bg-red-500", icon: "🏆" },
                { label: "Priority support", color: "bg-indigo-500", icon: "⚡" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className={`w-8 h-8 ${benefit.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                    {benefit.icon}
                  </div>
                  <span className="font-medium">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              You can find these channels later in Settings → Contact Us
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
