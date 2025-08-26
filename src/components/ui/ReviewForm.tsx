import type React from "react"
import { useState } from "react"
import { Send, Star, CheckCircle, ThumbsUp, AlertCircle, Clock, MessageSquare } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"

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

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
  displayName: string
  userEmail: string
  userId: string
  timeLeft: number
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  displayName,
  userEmail,
  userId,
  timeLeft
}) => {
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  const [reviewCategory, setReviewCategory] = useState<string>('overall')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  const [reviewerName, setReviewerName] = useState<string>(displayName)
  const [reviewerEmail, setReviewerEmail] = useState<string>(userEmail)

  const reviewCategories = [
    { value: 'overall', label: '💫 Overall' },
    { value: 'features', label: '⚡ Features' },
    { value: 'design', label: '🎨 Design' },
    { value: 'performance', label: '🚀 Speed' },
  ]

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
      userId: userId || 'anonymous',
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
              <span>{formatTime(timeLeft)} left</span>
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
                  Skip review (closes in {formatTime(timeLeft)})
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
