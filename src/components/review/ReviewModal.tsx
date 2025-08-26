import React, { useState } from 'react';
import { X, Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => Promise<void>;
}

export interface ReviewData {
  rating: number;
  experience: string;
  recommendation: string;
  improvements: string;
  features: string[];
  email?: string;
  name?: string;
  timestamp: string;
}

const experienceOptions = [
  'Excellent - Exceeded expectations',
  'Very Good - Met expectations',
  'Good - Mostly satisfied',
  'Fair - Some issues',
  'Poor - Many issues'
];

const featureOptions = [
  'Study Timer',
  'Exam Countdown',
  'Analytics Dashboard',
  'Dark Mode',
  'Premium Features',
  'User Interface',
  'Performance Tracking',
  'Notifications'
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<ReviewData>({
    rating: 0,
    experience: '',
    recommendation: '',
    improvements: '',
    features: [],
    email: '',
    name: '',
    timestamp: new Date().toISOString()
  });

  const handleRatingSelect = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleExperienceSelect = (experience: string) => {
    setFormData(prev => ({ ...prev, experience }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleInputChange = (field: keyof ReviewData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setFormData({
      rating: 0,
      experience: '',
      recommendation: '',
      improvements: '',
      features: [],
      email: '',
      name: '',
      timestamp: new Date().toISOString()
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.rating > 0;
      case 2: return formData.experience.length > 0;
      case 3: return formData.features.length > 0;
      case 4: return formData.recommendation.length > 0;
      default: return false;
    }
  };

  if (isSubmitted) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Thank You! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your feedback has been submitted successfully and will help us improve the app.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Share Your Experience</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      num <= step ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-white/80 mt-2">Step {step} of 4</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        How would you rate your experience?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your rating helps us understand how we're doing
                      </p>
                    </div>
                    
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingSelect(rating)}
                          className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                            formData.rating >= rating
                              ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 shadow-lg'
                              : 'text-gray-300 hover:text-yellow-300 bg-gray-50 dark:bg-gray-700'
                          }`}
                        >
                          <Star className={`w-8 h-8 ${formData.rating >= rating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    
                    {formData.rating > 0 && (
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {formData.rating === 5 ? 'Excellent! 🌟' :
                           formData.rating === 4 ? 'Great! 👍' :
                           formData.rating === 3 ? 'Good 👌' :
                           formData.rating === 2 ? 'Fair 😐' : 'Needs Work 🔧'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        How was your overall experience?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Tell us more about your experience with the app
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {experienceOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleExperienceSelect(option)}
                          className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-md ${
                            formData.experience === option
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                          }`}
                        >
                          <div className="font-semibold">{option.split(' - ')[0]}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {option.split(' - ')[1]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Which features do you use most?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Select all features that you find valuable
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {featureOptions.map((feature) => (
                        <button
                          key={feature}
                          onClick={() => handleFeatureToggle(feature)}
                          className={`p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-md text-sm font-medium ${
                            formData.features.includes(feature)
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                              : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
                          }`}
                        >
                          {feature}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Final thoughts and details
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help us improve with your feedback
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Would you recommend this app to others? *
                        </label>
                        <textarea
                          value={formData.recommendation}
                          onChange={(e) => handleInputChange('recommendation', e.target.value)}
                          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
                          rows={3}
                          placeholder="Tell us why you would or wouldn't recommend this app..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          What could we improve?
                        </label>
                        <textarea
                          value={formData.improvements}
                          onChange={(e) => handleInputChange('improvements', e.target.value)}
                          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none"
                          rows={3}
                          placeholder="Share your suggestions for improvement..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 p-6 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-2xl transition-colors"
              >
                Back
              </button>
              
              <div className="flex gap-3">
                {step < 4 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 flex items-center gap-2"
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
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
