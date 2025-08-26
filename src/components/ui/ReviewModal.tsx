import React, { useState } from 'react';
import { X, Star, Send, Clock, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  timeSpent: number;
}

export interface ReviewData {
  rating: number;
  experience: string;
  features: string[];
  improvements: string;
  wouldRecommend: string;
  userEmail?: string;
  timeSpent: number;
  timestamp: string;
}

const features = [
  'Study Timer',
  'Exam Countdown',
  'Progress Tracking',
  'Premium Features',
  'Dashboard Design',
  'Performance Analytics',
  'AI Insights',
  'User Interface'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  timeSpent 
}) => {
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [improvements, setImprovements] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const formatTime = (minutes: number) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating before submitting!');
      return;
    }

    if (!experience.trim()) {
      alert('Please describe your experience!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reviewData: ReviewData = {
        rating,
        experience,
        features: selectedFeatures,
        improvements,
        wouldRecommend,
        userEmail,
        timeSpent,
        timestamp: new Date().toISOString()
      };

      await onSubmit(reviewData);
      setShowThankYou(true);
      
      // Auto close after showing thank you
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setAttempt(prev => prev + 1);
      
      if (attempt < 2) {
        alert('Failed to submit review. Please try again!');
      } else {
        alert('Unable to submit review. Your feedback is important to us - please try again later!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForcefulClose = () => {
    if (rating > 0 || experience.trim()) {
      const confirmClose = window.confirm(
        'Are you sure you want to close? Your feedback helps us improve the app!'
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-pulse">
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Thank You! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your feedback has been submitted successfully!
          </p>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4">
            <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">
              Your input helps us make Study Tracker Pro better! ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Feedback</h2>
                <p className="text-indigo-100 text-sm">Help us improve your experience!</p>
              </div>
            </div>
            <button
              onClick={handleForcefulClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Time spent indicator */}
          <div className="mt-4 flex items-center gap-2 text-indigo-100 bg-white/10 rounded-xl px-4 py-2 w-fit">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Explored for {formatTime(timeSpent)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              How would you rate your experience? *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    star <= rating
                      ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 scale-110 shadow-lg'
                      : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                  }`}
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                {rating === 5 ? 'Excellent! 🌟' : rating === 4 ? 'Great! 👍' : rating === 3 ? 'Good 👌' : rating === 2 ? 'Okay 🤔' : 'Needs improvement 💭'}
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Describe your experience *
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="What did you like most? What stood out to you?"
              className="w-full h-24 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Which features impressed you most?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleFeatureToggle(feature)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    selectedFeatures.includes(feature)
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              What could we improve?
            </label>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="Any suggestions for making the app better?"
              className="w-full h-20 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Would you recommend Study Tracker Pro?
            </label>
            <div className="flex gap-4">
              {['Definitely', 'Probably', 'Maybe', 'Probably not'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWouldRecommend(option)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    wouldRecommend === option
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Email (optional)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              We'll only use this to follow up on your feedback if needed
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !experience.trim()}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
              isSubmitting || rating === 0 || !experience.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Feedback
              </>
            )}
          </button>

          {attempt > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Having trouble submitting? Your feedback is valuable - please try again!
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
