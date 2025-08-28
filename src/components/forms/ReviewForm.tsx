import React, { useState } from 'react';
import { Star, Send, MessageCircle, TrendingUp, X, ChevronRight, Heart, Zap } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (data: ReviewData) => void;
  onClose?: () => void;
}

interface ReviewData {
  rating: number;
  experience: string;
  mostUseful: string;
  features: string[];
  recommendation: number;
  email: string;
  feedback: string;
}

const features = [
  { name: 'Study Timer', icon: '⏰' },
  { name: 'Exam Countdown', icon: '📅' },
  { name: 'Dashboard Analytics', icon: '📊' },
  { name: 'Session Tracking', icon: '📈' },
  { name: 'Performance Insights', icon: '💡' },
  { name: 'User Interface', icon: '🎨' },
  { name: 'Mobile Experience', icon: '📱' },
  { name: 'Data Export', icon: '📤' }
];

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    experience: '',
    mostUseful: '',
    features: [],
    recommendation: 0,
    email: '',
    feedback: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [hoveredStar, setHoveredStar] = useState(0);
  const totalSteps = 2;

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleRecommendationChange = (recommendation: number) => {
    setFormData(prev => ({ ...prev, recommendation }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const submitData = {
      timestamp: new Date().toISOString(),
      ...formData,
      features: formData.features.join(', ')
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbw6RbtGLLoYoQM0R55yWj-Or79RYe20_EO_ex4o5A7mh6QF__UgOuftrufx0KUwea7l/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting review:', error);
      onSubmit(formData);
    }
    
    setIsSubmitting(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.rating > 0 && formData.experience.trim().length > 10 && formData.mostUseful.trim().length > 5;
      case 2:
        return formData.features.length > 0 && formData.recommendation > 0 && formData.email.includes('@') && formData.feedback.trim().length > 5;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      5: { text: "Absolutely amazing! 🌟", color: "text-emerald-600" },
      4: { text: "Really great! 👍", color: "text-blue-600" },
      3: { text: "Pretty good! 😊", color: "text-yellow-600" },
      2: { text: "Needs work 😐", color: "text-orange-600" },
      1: { text: "Poor experience 😔", color: "text-red-600" }
    };
    return labels[rating as keyof typeof labels];
  };

  const getRecommendationLabel = (score: number) => {
    if (score >= 9) return { text: "Promoter 🚀", color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20" };
    if (score >= 7) return { text: "Passive 😐", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" };
    return { text: "Detractor 😔", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" };
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4 sm:p-6 text-white">
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">We Value Your Feedback!</h2>
                <p className="text-white/90 text-sm sm:text-base">Help us improve your experience</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i + 1 <= currentStep
                      ? 'bg-white shadow-lg flex-1'
                      : 'bg-white/30 flex-1'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-white/80 font-medium">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Step 1: Experience & Rating */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl inline-block">
                    <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    How was your experience?
                  </h3>
                </div>
                
                {/* Star Rating */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center items-center gap-1 sm:gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className={`p-2 sm:p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                          star <= (hoveredStar || formData.rating)
                            ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-md'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                        }`}
                      >
                        <Star 
                          className="w-6 h-6 sm:w-7 sm:h-7" 
                          fill={star <= (hoveredStar || formData.rating) ? 'currentColor' : 'none'} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  {formData.rating > 0 && (
                    <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${getRatingLabel(formData.rating)?.color} bg-gray-100 dark:bg-gray-800`}>
                      {getRatingLabel(formData.rating)?.text}
                    </div>
                  )}
                </div>

                {/* Experience Text */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Tell us about your overall experience
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                      rows={3}
                      placeholder="What did you like? What could be better? Share your thoughts..."
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.experience.length}/500 characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Which feature helped you the most?
                    </label>
                    <textarea
                      value={formData.mostUseful}
                      onChange={(e) => setFormData(prev => ({ ...prev, mostUseful: e.target.value }))}
                      className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                      rows={2}
                      placeholder="Study timer, analytics, exam countdown..."
                      maxLength={200}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Features, Recommendation & Feedback */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl inline-block">
                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                    Features & Recommendations
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {/* Features Used */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Which features do you use? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {features.map((feature) => (
                        <button
                          key={feature.name}
                          onClick={() => handleFeatureToggle(feature.name)}
                          className={`p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 text-left text-xs sm:text-sm ${
                            formData.features.includes(feature.name)
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 shadow-sm'
                              : 'border-gray-200 dark:border-gray-600 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{feature.icon}</span>
                            <span className="font-medium">{feature.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation Score */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      How likely are you to recommend us? (0-10)
                    </label>
                    <div className="grid grid-cols-6 sm:grid-cols-11 gap-1 sm:gap-2">
                      {[...Array(11)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecommendationChange(i)}
                          className={`aspect-square rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${
                            i === formData.recommendation
                              ? 'bg-violet-600 text-white shadow-lg scale-110'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/20 hover:text-violet-600'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>Not likely</span>
                      <span className="hidden sm:inline">Neutral</span>
                      <span>Very likely</span>
                    </div>
                    {formData.recommendation > 0 && (
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRecommendationLabel(formData.recommendation).color} ${getRecommendationLabel(formData.recommendation).bg}`}>
                        {getRecommendationLabel(formData.recommendation).text}
                      </div>
                    )}
                  </div>

                  {/* Contact & Feedback */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email (optional, for follow-up)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Any suggestions for improvement?
                      </label>
                      <textarea
                        value={formData.feedback}
                        onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                        rows={3}
                        placeholder="New features, improvements, bug reports..."
                        maxLength={300}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold transition-all duration-200 text-sm sm:text-base"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next Step
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    isStepValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
