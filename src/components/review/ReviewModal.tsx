import React, { useState, useEffect } from 'react';
import { Star, X, Send, MessageSquare, ThumbsUp, Heart, Award, Users, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewData) => void;
  userEmail?: string;
  userName?: string;
}

interface ReviewData {
  rating: number;
  message: string;
  name: string;
  email: string;
  category: string;
  wouldRecommend: boolean;
}

const categories = [
  { id: 'ui', label: 'User Interface', icon: Sparkles },
  { id: 'features', label: 'Features', icon: Award },
  { id: 'performance', label: 'Performance', icon: ThumbsUp },
  { id: 'support', label: 'Support', icon: Users },
  { id: 'overall', label: 'Overall Experience', icon: Heart }
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail = '',
  userName = ''
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [category, setCategory] = useState('overall');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating before submitting.');
      return;
    }

    if (message.trim().length < 10) {
      alert('Please provide a more detailed review (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: ReviewData = {
        rating,
        message: message.trim(),
        name: name.trim(),
        email: email.trim(),
        category,
        wouldRecommend
      };

      await onSubmit(reviewData);
      setShowThankYou(true);
      
      // Auto close after showing thank you
      setTimeout(() => {
        onClose();
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === category);
  const CategoryIcon = selectedCategory?.icon || Heart;

  if (!isOpen) return null;

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-200 dark:border-gray-700 animate-pulse">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-xl animate-bounce">
              <Heart className="w-10 h-10 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your feedback helps us improve the experience for everyone.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < rating
                    ? 'text-yellow-400 fill-current animate-pulse'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Closing automatically...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-indigo-600/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              We Value Your Opinion! ⭐
            </h2>
            <p className="text-white/90 text-lg">
              Help us improve your learning experience
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Rating Section */}
          <div className="text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How would you rate your experience?
            </h3>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-2 transition-all duration-300 hover:scale-125 active:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-300 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current drop-shadow-lg scale-110'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {rating === 5 ? '🤩 Excellent!' :
                 rating === 4 ? '😊 Great!' :
                 rating === 3 ? '🙂 Good!' :
                 rating === 2 ? '😐 Fair' :
                 '😞 Needs Improvement'}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              What aspect would you like to review?
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                      category === cat.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium block">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Tell us more about your experience
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts, suggestions, or what you loved most about the app..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400 resize-none
                       transition-all duration-300 shadow-sm hover:shadow-md"
              required
              minLength={10}
            />
            <p className={`text-sm mt-2 ${message.length >= 10 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {message.length >= 10 ? '✓ Perfect!' : `Minimum 10 characters (${message.length}/10)`}
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         transition-all duration-300 shadow-sm hover:shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         transition-all duration-300 shadow-sm hover:shadow-md"
                required
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-700 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Would you recommend this app to others?
            </h4>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWouldRecommend(true)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  wouldRecommend
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-400 shadow-md'
                    : 'border-gray-300 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-500'
                }`}
              >
                <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Yes, definitely!</span>
              </button>
              <button
                type="button"
                onClick={() => setWouldRecommend(false)}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  !wouldRecommend
                    ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-400 shadow-md'
                    : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500'
                }`}
              >
                <X className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Maybe later</span>
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 dark:from-gray-800 dark:via-slate-800 dark:to-gray-900 px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-gray-200 dark:border-gray-700 rounded-b-3xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Your feedback is essential for improving our service 💝
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (rating === 0 || message.trim().length < 10) {
                  alert('Please complete the review form to continue using the app.');
                  return;
                }
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 
                       font-semibold transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || message.trim().length < 10}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                       hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 
                       disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                       text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl 
                       transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
