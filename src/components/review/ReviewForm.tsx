import React, { useState } from 'react';
import { Star, Heart, Zap, Target, Award, Send, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  isVisible: boolean;
  onSubmit: (data: ReviewData) => Promise<void>;
}

export interface ReviewData {
  rating: number;
  features: string[];
  npsScore: number;
  feedback: string;
  timestamp: string;
  userAgent: string;
}

const features = [
  { id: 'ui', label: 'User Interface', icon: Heart },
  { id: 'performance', label: 'Performance', icon: Zap },
  { id: 'features', label: 'Features', icon: Target },
  { id: 'overall', label: 'Overall Experience', icon: Award }
];

const npsLabels = [
  'Very Unlikely', 'Unlikely', 'Somewhat Unlikely', 'Neutral', 'Somewhat Likely',
  'Likely', 'Very Likely', 'Extremely Likely', 'Highly Likely', 'Definitely'
];

export const ReviewForm: React.FC<ReviewFormProps> = ({ isVisible, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [npsScore, setNpsScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const reviewData: ReviewData = {
        rating,
        features: selectedFeatures,
        npsScore,
        feedback,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      await onSubmit(reviewData);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 animate-scale-in">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              How was your experience?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your feedback helps us improve
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Rate your overall experience
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-all duration-200 hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-200 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                </p>
              )}
            </div>

            {/* Feature Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                What did you like most? (Optional)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`p-3 rounded-2xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{feature.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NPS Score */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                How likely are you to recommend us? (0-10)
              </p>
              <div className="flex justify-between gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsScore(score)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                      npsScore === score
                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              {npsScore > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {npsScore <= 6 ? 'Detractor' : npsScore <= 8 ? 'Passive' : 'Promoter'}
                </p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Additional feedback (Optional)
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us more about your experience..."
                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-indigo-500 focus:outline-none transition-colors duration-200 resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {feedback.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
