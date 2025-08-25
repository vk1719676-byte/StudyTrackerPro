"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, Star, X, CheckCircle, MessageCircle, Mail, Clock } from "lucide-react"
import { Card } from "./Card"
import { Button } from "./Button"
import { useAuth } from "../../contexts/AuthContext"
import emailjs from '@emailjs/browser'

interface TelegramJoinModalProps {
  isOpen: boolean
  onClose: () => void
  onChannelsJoined?: () => void
}

export const TelegramJoinModal: React.FC<TelegramJoinModalProps> = ({ isOpen, onClose, onChannelsJoined }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [suggestion, setSuggestion] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  // Get saved display name or fallback to email username
  const savedDisplayName = user ? localStorage.getItem(`displayName-${user.uid}`) : null
  const displayName = savedDisplayName || user?.displayName || user?.email?.split("@")[0] || "Student"
  const userEmail = user?.email || "anonymous@example.com"

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120)
      setShowCloseButton(false)
      setRating(0)
      setSuggestion("")
      setShowSuccess(false)
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please provide a rating before submitting!")
      return
    }

    setIsSubmitting(true)

    try {
      // Initialize EmailJS (you'll need to set up your own service ID, template ID, and public key)
      emailjs.init("YOUR_PUBLIC_KEY") // Replace with your EmailJS public key

      const templateParams = {
        to_email: "devendrathakur0127@gmail.com",
        from_name: displayName,
        from_email: userEmail,
        rating: rating,
        suggestion: suggestion || "No additional suggestions provided.",
        timestamp: new Date().toLocaleString(),
        stars: "★".repeat(rating) + "☆".repeat(5 - rating)
      }

      // For now, we'll use a simple mailto approach as a fallback
      const subject = `New Review from ${displayName} - ${rating}/5 Stars`
      const body = `
New Review Submission:

From: ${displayName} (${userEmail})
Rating: ${rating}/5 Stars (${templateParams.stars})
Date: ${new Date().toLocaleString()}

Suggestion/Feedback:
${suggestion || "No additional suggestions provided."}

---
Sent from Study Tracker Pro Review System
      `.trim()

      // Create mailto link
      const mailtoLink = `mailto:devendrathakur0127@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Try to open default email client
      window.location.href = mailtoLink

      // Show success after a short delay
      setTimeout(() => {
        setShowSuccess(true)
        onChannelsJoined?.()
        setTimeout(() => {
          onClose()
        }, 3000)
      }, 1000)

    } catch (error) {
      console.error('Error submitting review:', error)
      alert("There was an error submitting your review. Please try again or contact support directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const renderStars = (interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isActive = interactive 
        ? (hoveredRating || rating) >= starValue 
        : rating >= starValue

      return (
        <button
          key={index}
          type="button"
          className={`text-2xl transition-all duration-200 ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${
            isActive 
              ? 'text-yellow-400 drop-shadow-sm' 
              : 'text-gray-300 dark:text-gray-600'
          }`}
          onClick={interactive ? () => setRating(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          disabled={!interactive || isSubmitting}
        >
          <Star className={`w-7 h-7 ${isActive ? 'fill-current' : ''}`} />
        </button>
      )
    })
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Thank You for Your Review! 🌟</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thanks <span className="font-semibold text-blue-600 dark:text-blue-400">{displayName}</span>! 
            Your feedback helps us improve the app for everyone.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3">
            <div className="flex justify-center mb-2">
              {renderStars(false)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">Your {rating}/5 star review has been submitted!</p>
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
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Submit Your Review</h2>
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

          {/* Review Form */}
          <div className="space-y-6">
            {/* Rating Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rate Your Experience
              </h3>
              
              <div className="text-center mb-4">
                <div className="flex justify-center gap-2 mb-3">
                  {renderStars(true)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {rating === 0 && "Click a star to rate"}
                  {rating === 1 && "😞 Poor - Needs major improvements"}
                  {rating === 2 && "😐 Fair - Could be better"}
                  {rating === 3 && "🙂 Good - It's okay"}
                  {rating === 4 && "😊 Great - Really helpful"}
                  {rating === 5 && "🤩 Excellent - Love it!"}
                </p>
              </div>
            </div>

            {/* Suggestion Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                Your Suggestions & Feedback
              </h4>
              
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Share your thoughts, suggestions, or any feedback about the app. What features would you like to see? What can we improve? (Optional)"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={4}
                disabled={isSubmitting}
              />
              
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  💡 Your feedback helps us improve the app
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-600">
                  {suggestion.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmitReview}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={rating === 0 || isSubmitting}
                icon={isSubmitting ? Clock : Send}
              >
                {isSubmitting ? "Submitting Review..." : "Submit Review"}
              </Button>
              
              {rating === 0 && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Please select a rating before submitting
                </p>
              )}
            </div>

            {/* Email Info */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-green-600" />
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Where does this go?</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your review will be sent directly to our development team at{" "}
                <span className="font-mono text-blue-600 dark:text-blue-400">devendrathakur0127@gmail.com</span>
                {" "}to help improve Study Tracker Pro.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              🙏 Thank you for taking the time to share your feedback!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
