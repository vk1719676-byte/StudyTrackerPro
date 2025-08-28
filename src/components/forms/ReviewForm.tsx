import React, { useState } from 'react';
import { Star, Send, MessageCircle, TrendingUp, Clock } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (data: ReviewData) => void;
}

interface ReviewData {
  rating: number;
  experience: string;
  improvements: string;
  features: string[];
  recommendation: number;
  email: string;
  studyHabits: string;
  mostUseful: string;
  feedback: string;
}

const features = [
  'Study Timer',
  'Exam Countdown',
  'Dashboard Analytics',
  'Session Tracking',
  'Performance Insights',
  'User Interface',
  'Mobile Experience',
  'Data Export'
];

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    experience: '',
    improvements: '',
    features: [],
    recommendation: 0,
    email: '',
    studyHabits: '',
    mostUseful: '',
    feedback: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
    
    // Format data for Google Sheets
    const submitData = {
      timestamp: new Date().toISOString(),
      ...formData,
      features: formData.features.join(', ')
    };

    try {
      // Submit to Google Sheets
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
      onSubmit(formData); // Still proceed to close form
    }
    
    setIsSubmitting(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.rating > 0;
      case 2:
        return formData.experience.trim().length > 0 && formData.mostUseful.trim().length > 0;
      case 3:
        return formData.features.length > 0 && formData.recommendation > 0;
      case 4:
        return formData.email.includes('@') && formData.feedback.trim().length > 0;
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-black">Help Us Improve!</h2>
                <p className="text-white/90 font-medium">Your feedback shapes our future</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-2">
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i + 1 <= currentStep
                      ? 'bg-white shadow-md flex-1'
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

        <div className="p-8">
          {/* Step 1: Overall Rating */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl inline-block">
                  <TrendingUp className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  How would you rate your overall experience?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your honest feedback helps us create better study tools
                </p>
              </div>
              
              <div className="flex justify-center items-center gap-4 py-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                      star <= formData.rating
                        ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 shadow-lg'
                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                    }`}
                  >
                    <Star className="w-8 h-8" fill={star <= formData.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              
              {formData.rating > 0 && (
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formData.rating === 5 && "Amazing! 🌟"}
                    {formData.rating === 4 && "Great! 👍"}
                    {formData.rating === 3 && "Good! 😊"}
                    {formData.rating === 2 && "Okay 😐"}
                    {formData.rating === 1 && "Needs work 😔"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Experience Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl inline-block">
                  <MessageCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Tell us about your experience
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    What has been your overall experience using our study app?
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                    rows={4}
                    placeholder="Share your thoughts about the app's usability, design, features..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Which feature has been most useful for your studies?
                  </label>
                  <textarea
                    value={formData.mostUseful}
                    onChange={(e) => setFormData(prev => ({ ...prev, mostUseful: e.target.value }))}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                    rows={3}
                    placeholder="Study timer, exam countdown, analytics dashboard..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features & Recommendation */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl inline-block">
                  <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Features & Recommendations
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    Which features do you use regularly? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                          formData.features.includes(feature)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                        }`}
                      >
                        <span className="font-medium text-sm">{feature}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                    How likely are you to recommend our app to a friend? (0-10)
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    {[...Array(11)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleRecommendationChange(i)}
                        className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                          i === formData.recommendation
                            ? 'bg-indigo-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span>Not likely</span>
                    <span>Extremely likely</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Final Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl inline-block">
                  <Send className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Almost done! Final details
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Email (for follow-up if needed)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Tell us about your study habits
                  </label>
                  <textarea
                    value={formData.studyHabits}
                    onChange={(e) => setFormData(prev => ({ ...prev, studyHabits: e.target.value }))}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                    rows={3}
                    placeholder="How many hours do you study daily? What subjects? Any specific routines?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    What improvements would you like to see?
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                    rows={4}
                    placeholder="Suggest new features, improvements, or report any issues..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-bold transition-all duration-300"
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isStepValid() && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
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
                      Submit Review
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
