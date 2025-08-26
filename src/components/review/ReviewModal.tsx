import React, { useState, useEffect } from 'react';
import { Star, Send, X, Heart, ThumbsUp, Gift, Sparkles, Trophy, CheckCircle } from 'lucide-react';
import { submitReviewToGoogleSheets, ReviewData } from '../../services/googleSheets';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [step, setStep] = useState(1);
  const [dismissAttempts, setDismissAttempts] = useState(0);
  const { user } = useAuth();

  // Initialize user data if available
  useEffect(() => {
    if (user) {
      const savedDisplayName = localStorage.getItem(`displayName-${user.uid}`);
      setName(savedDisplayName || user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleClose = () => {
    if (step === 1 && dismissAttempts < 2) {
      setDismissAttempts(prev => prev + 1);
      return; // Don't close on first two attempts
    }
    onClose();
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (value >= 4) {
      // High rating - advance to feedback
      setTimeout(() => setStep(2), 500);
    } else {
      // Lower rating - show feedback immediately
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !name.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);

    const reviewData: ReviewData = {
      name: name.trim(),
      email: email.trim(),
      rating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };

    try {
      await submitReviewToGoogleSheets(reviewData);
      setShowThankYou(true);
      
      // Store that user has reviewed to prevent showing again
      localStorage.setItem('hasSubmittedReview', 'true');
      localStorage.setItem('reviewSubmittedAt', Date.now().toString());
      
      setTimeout(() => {
        onSubmit();
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Still mark as submitted to prevent repeated attempts
      localStorage.setItem('hasSubmittedReview', 'true');
      setShowThankYou(true);
      
      setTimeout(() => {
        onSubmit();
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (showThankYou) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center transform animate-pulse">
          <div className="mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Thank You! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your feedback has been submitted successfully. We truly appreciate your time and insights!
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-bold">
            <Heart className="w-4 h-4 fill-current" />
            <span>Your review helps us improve</span>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-t-3xl p-6 text-white">
          <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">We Value Your Opinion!</h2>
                <p className="text-white/90 text-sm">Help us make Study Tracker Pro even better</p>
              </div>
            </div>
            {dismissAttempts >= 2 && (
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {dismissAttempts < 2 && (
            <div className="mt-4 p-3 bg-yellow-400/20 backdrop-blur-sm rounded-xl text-yellow-100 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>Help us improve - it only takes 30 seconds! 🌟</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="text-center space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  How would you rate your experience?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your honest feedback helps thousands of students
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="group p-2 transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingClick(value)}
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-200 ${
                        value <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400 scale-110'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {rating > 0 && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4">
                  <p className="text-indigo-700 dark:text-indigo-400 font-bold">
                    {rating === 5 && "Excellent! 🌟 You're amazing!"}
                    {rating === 4 && "Great! 👏 We're glad you like it!"}
                    {rating === 3 && "Good! 👍 Help us make it even better!"}
                    {rating === 2 && "We can do better! 💪 Tell us how!"}
                    {rating === 1 && "We're sorry! 😔 How can we improve?"}
                  </p>
                </div>
              )}

              {dismissAttempts > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <p className="text-orange-800 dark:text-orange-300 font-medium">
                      Just a quick rating would mean the world to us! 🙏
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`w-6 h-6 ${
                        value <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Tell us more about your experience
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder={
                    rating >= 4
                      ? "What do you love most about Study Tracker Pro? Any suggestions for improvement?"
                      : "How can we make Study Tracker Pro better for you? What features would you like to see?"
                  }
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || rating === 0}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
