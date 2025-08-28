import React, { useState } from 'react';
import { Star, Send, User, Mail, MessageCircle, ThumbsUp, Heart, Lightbulb } from 'lucide-react';

interface ReviewFormProps {
  isOpen: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    favoriteFeature: '',
    improvements: '',
    wouldRecommend: '',
    additionalComments: '',
    usageFrequency: '',
    userType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Google Sheets integration via Google Forms
      const formId = '1Pg__vzhfOTZ8jKXUO2qptuY8qP3gGuPxIdjuZ3OSbOo'; // Replace with your actual Google Form ID
      const formData2 = new FormData();
      
      // Map form fields to Google Form entry IDs (you'll need to inspect your form to get these)
      formData2.append('entry.123456789', formData.name); // Replace with actual entry IDs
      formData2.append('entry.987654321', formData.email);
      formData2.append('entry.456789123', formData.rating.toString());
      formData2.append('entry.789123456', formData.favoriteFeature);
      formData2.append('entry.321654987', formData.improvements);
      formData2.append('entry.654987321', formData.wouldRecommend);
      formData2.append('entry.147258369', formData.additionalComments);
      formData2.append('entry.963852741', formData.usageFrequency);
      formData2.append('entry.852741963', formData.userType);

      // Submit to Google Form
      await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
        method: 'POST',
        body: formData2,
        mode: 'no-cors'
      });

      setIsSubmitted(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.rating > 0 && 
           formData.favoriteFeature && 
           formData.wouldRecommend;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Thank You! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              Your feedback means the world to us. We're constantly improving based on reviews like yours.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting in 3 seconds...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                We'd Love Your Feedback!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help us make this the best study app ever. Your insights drive our improvements.
              </p>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* User Type and Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                    You are a...
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select your type</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="professional">Working Professional</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
                    How often do you use our app?
                  </label>
                  <select
                    name="usageFrequency"
                    value={formData.usageFrequency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Few times a week</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="first-time">First time using</option>
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 block">
                  Overall, how would you rate your experience? *
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="group transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 transition-all duration-200 ${
                          star <= formData.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600 group-hover:text-yellow-300'
                        }`}
                      />
                    </button>
                  ))}
                  {formData.rating > 0 && (
                    <span className="ml-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                      {formData.rating === 5 ? 'Excellent!' :
                       formData.rating === 4 ? 'Very Good' :
                       formData.rating === 3 ? 'Good' :
                       formData.rating === 2 ? 'Fair' : 'Needs Improvement'}
                    </span>
                  )}
                </div>
              </div>

              {/* Favorite Feature */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Heart className="w-4 h-4" />
                  What do you like most about our app? *
                </label>
                <textarea
                  name="favoriteFeature"
                  value={formData.favoriteFeature}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-20"
                  placeholder="Tell us about your favorite features, design, or functionality..."
                  required
                />
              </div>

              {/* Improvements */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  What could we improve or add?
                </label>
                <textarea
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-20"
                  placeholder="Share your ideas for new features, bug fixes, or enhancements..."
                />
              </div>

              {/* Recommendation */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  <ThumbsUp className="w-4 h-4" />
                  Would you recommend this app to others? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'definitely', label: 'Definitely!', color: 'from-green-500 to-emerald-500' },
                    { value: 'probably', label: 'Probably', color: 'from-blue-500 to-indigo-500' },
                    { value: 'maybe', label: 'Maybe', color: 'from-yellow-500 to-orange-500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: option.value }))}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 font-bold text-center ${
                        formData.wouldRecommend === option.value
                          ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg scale-105`
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <MessageCircle className="w-4 h-4" />
                  Any additional thoughts or comments?
                </label>
                <textarea
                  name="additionalComments"
                  value={formData.additionalComments}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-24"
                  placeholder="Share anything else you'd like us to know..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                  isFormValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting Your Review...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit My Review
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                Your feedback will be sent directly to our team and stored securely.
                <br />
                * Required fields must be completed to submit.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
