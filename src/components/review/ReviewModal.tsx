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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
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
                    ? 'text-yellow-400 fill-current'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
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

        {/* Content */}
        <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Rating Section */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                How would you rate your experience?
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-2 transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current drop-shadow-lg scale-110'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        category === cat.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
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
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400 resize-none
                         transition-all duration-300"
                required
                minLength={10}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Minimum 10 characters ({message.length}/10)
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400
                           transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                Would you recommend this app to others?
              </h4>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                    wouldRecommend
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Yes, definitely!</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
                    !wouldRecommend
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                  }`}
                >
                  <X className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Maybe later</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Your feedback is essential for improving our service 💝
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (rating === 0 || message.trim().length < 10) {
                  alert('Please complete the review form to continue using the app.');
                  return;
                }
                onClose();
              }}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 
                       font-medium transition-all duration-300"
              disabled={isSubmitting}
            >
              Skip for now
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || message.trim().length < 10}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                       hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500
                       text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl 
                       transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
