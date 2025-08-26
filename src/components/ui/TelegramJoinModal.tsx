import type React from "react"
import { useState, useEffect } from "react"
import { Send, Users, Star, X, ExternalLink, CheckCircle, MessageSquare, Clock, ThumbsUp, AlertCircle, Heart, Zap, Trophy, Gift, Sparkles } from "lucide-react"

// Simple Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

// Simple Button Component
const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<any>;
}> = ({ children, onClick, className = '', disabled, size = 'md', icon: Icon }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
}

// Mock Auth Hook
const useAuth = () => ({
  user: {
    uid: 'user123',
    email: 'student@example.com',
    displayName: 'Student'
  }
})

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
  const [timeLeft, setTimeLeft] = useState(120)
  const [canClose, setCanClose] = useState(false)
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
      setTimeLeft(120)
      setShowCloseButton(false)
      setJoinedChannels([])
      setShowSuccess(false)
      setCanClose(false)
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

  // Check if user can close
  useEffect(() => {
    const allChannelsJoined = joinedChannels.length >= channels.length
    setCanClose(allChannelsJoined || reviewSubmitted)
  }, [joinedChannels.length, reviewSubmitted, channels.length])

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
    // Compact validation
    if (reviewRating === 0) return setSubmitError('⭐ Rate us first!')
    if (reviewComment.trim().length < 5) return setSubmitError('✏️ Add a short comment (5+ chars)')
    if (!reviewerName.trim()) return setSubmitError('👤 Name required')
    if (!reviewerEmail.trim() || !reviewerEmail.includes('@')) return setSubmitError('📧 Valid email needed')
    if (wouldRecommend === null) return setSubmitError('👍 Would you recommend us?')

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
            className={`w-5 h-5 transition-all duration-200 ${
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

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full mx-4 p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
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
      <Card className="max-w-md w-full mx-4 max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="relative p-4">
          {/* Compact Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <Send className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Join Our Community</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">Hey {displayName}! 👋</p>
              </div>
            </div>

            {(showCloseButton || canClose) ? (
              <button
                onClick={onClose}
                className="p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          {/* Compact Progress Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-center">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
                canClose ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              }`}>
                {canClose ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Ready to close!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Join channels OR review to close</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Compact Review Form */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-lg p-3 mb-3 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Quick Review</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Help us improve Study Tracker Pro</p>
              </div>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-green-700 dark:text-green-300 text-sm mb-1">Thank You! 🎉</h4>
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Feedback submitted successfully</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Closing automatically...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Compact Personal Info */}
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => {
                      setReviewerName(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="Your name"
                    className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmittingReview}
                  />
                  <input
                    type="email"
                    value={reviewerEmail}
                    onChange={(e) => {
                      setReviewerEmail(e.target.value)
                      setSubmitError('')
                    }}
                    placeholder="email@domain.com"
                    className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={isSubmittingReview}
                  />
                </div>

                {/* Compact Star Rating */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rate our app
                  </label>
                  <StarRating />
                  {reviewRating > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {reviewRating <= 2 && "We'll improve! 😔"}
                      {reviewRating === 3 && "Thanks! 🙂"}  
                      {reviewRating >= 4 && "Awesome! 😊"}
                    </p>
                  )}
                </div>

                {/* Compact Category & Recommendation Row */}
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={reviewCategory}
                    onChange={(e) => setReviewCategory(e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                    disabled={isSubmittingReview}
                  >
                    {reviewCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(true)
                        setSubmitError('')
                      }}
                      className={`flex-1 py-1.5 px-1 rounded-md text-xs font-medium border transition-all ${
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👍
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWouldRecommend(false)
                        setSubmitError('')
                      }}
                      className={`flex-1 py-1.5 px-1 rounded-md text-xs font-medium border transition-all ${
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                      }`}
                      disabled={isSubmittingReview}
                    >
                      👎
                    </button>
                  </div>
                </div>

                {/* Compact Comment */}
                <textarea
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value)
                    setSubmitError('')
                  }}
                  placeholder="Share your thoughts... (optional but helpful!)"
                  className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  rows={2}
                  maxLength={300}
                  disabled={isSubmittingReview}
                />

                {/* Compact Error */}
                {submitError && (
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                    <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Compact Submit Button */}
                <Button
                  onClick={handleReviewSubmit}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-1.5 shadow-lg hover:shadow-xl transition-all text-xs"
                  disabled={isSubmittingReview || reviewRating === 0}
                  icon={isSubmittingReview ? undefined : Send}
                >
                  {isSubmittingReview ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Compact Divider */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Compact Channels Section */}
          <div className="space-y-2 mb-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Join Telegram Channels
            </h3>

            {channels.map((channel) => (
              <div
                key={channel.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 bg-gradient-to-r ${channel.color} rounded-md text-white text-sm shadow-md`}>
                    {channel.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs">{channel.name}</h4>
                      <Button
                        onClick={() => handleJoinChannel(channel.id, channel.url)}
                        size="sm"
                        className={`bg-gradient-to-r ${channel.color} hover:shadow-md transition-all font-medium text-xs px-2 py-1`}
                        icon={joinedChannels.includes(channel.id) ? CheckCircle : ExternalLink}
                        disabled={joinedChannels.includes(channel.id)}
                      >
                        {joinedChannels.includes(channel.id) ? "✓" : "Join"}
                      </Button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{channel.description}</p>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{channel.members}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Benefits */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-lg p-2.5 mb-3 border border-green-200 dark:border-green-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 text-sm">
              <Gift className="w-3 h-3 text-yellow-500" />
              What You'll Get
            </h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                { label: "Daily motivation", icon: "💪" },
                { label: "App updates", icon: "🚀" },
                { label: "Study tips", icon: "💡" },
                { label: "Community", icon: "👥" },
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-1 text-gray-700 dark:text-gray-300 p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                  <span className="text-xs">{benefit.icon}</span>
                  <span className="font-medium text-xs">{benefit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              Find these channels later in Settings
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function App() {
  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const [hasShownModal, setHasShownModal] = useState(false)

  // Show telegram modal after 90 seconds
  useEffect(() => {
    // Check if modal was already shown in this session
    const modalShown = sessionStorage.getItem('telegram-modal-shown')
    
    if (!modalShown && !hasShownModal) {
      const timer = setTimeout(() => {
        setShowTelegramModal(true)
        setHasShownModal(true)
        sessionStorage.setItem('telegram-modal-shown', 'true')
      }, 90000) // 90 seconds

      return () => clearTimeout(timer)
    }
  }, [hasShownModal])

  const handleModalClose = () => {
    setShowTelegramModal(false)
  }

  const handleChannelsJoined = () => {
    console.log('User joined channels!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Study Tracker Pro
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your academic success companion. The Telegram join popup will appear automatically after 90 seconds, or you can trigger it manually.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowTelegramModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              icon={Send}
            >
              Join Community Now
            </Button>
            
            <Button
              onClick={() => {
                sessionStorage.removeItem('telegram-modal-shown')
                setHasShownModal(false)
              }}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 border border-gray-300 dark:border-gray-600"
              icon={Clock}
            >
              Reset Auto-popup Timer
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
            <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              The popup will show automatically in 90 seconds after page load
            </p>
          </div>
        </Card>
      </div>

      <TelegramJoinModal
        isOpen={showTelegramModal}
        onClose={handleModalClose}
        onChannelsJoined={handleChannelsJoined}
      />
    </div>
  )
}

export default App
