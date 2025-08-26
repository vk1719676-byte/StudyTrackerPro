import React, { useState } from 'react';
import { X, Star, Send, Sparkles, Heart, MessageSquare, Clock, User } from 'lucide-react';

export interface ReviewData {
  rating: number;
  feedback: string;
  email?: string;
  timeSpent: number;
  timestamp: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewData) => Promise<void>;
  timeSpent: number;
  forceSubmit?: boolean;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  timeSpent,
  forceSubmit = false
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        feedback: feedback.trim(),
        email: email.trim(),
        timeSpent,
        timestamp: new Date().toISOString()
      });
      
      // Reset form
      setRating(0);
      setFeedback('');
      setEmail('');
      setHoveredStar(0);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border border-gray-200/50 dark:border-gray-700/50">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Quick Feedback
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              You've explored for {formatTime(timeSpent)}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
              How would you rate your experience?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-2 rounded-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      star <= (hoveredStar || rating)
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating === 0 && (
              <p className="text-xs text-red-500 text-center mt-2">
                Please select a rating to continue
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Share your thoughts (optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What did you like? Any suggestions?"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-none text-sm"
                rows={3}
                maxLength={200}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
              {feedback.length}/200
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email (optional)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-lg ${
              rating === 0 || isSubmitting
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review to Continue
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Your feedback helps us improve Study Tracker Pro
          </p>
        </form>
      </div>
    </div>
  );
};
