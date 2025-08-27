import React, { useState } from 'react';
import { Star, X, Send, Mail, User, MessageSquare, AlertCircle, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewPopup: React.FC<ReviewPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    subject: '',
    message: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_da4r6nj';
  const EMAILJS_TEMPLATE_ID = 'template_bqvwpnl';
  const EMAILJS_PUBLIC_KEY = 'WYXQh1BJu91-ldVqM';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please share your feedback';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Initialize EmailJS
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        to_email: 'devendrathakur0127@gmail.com',
        subject: formData.subject || `${formData.rating}-Star Review from ${formData.name}`,
        rating: formData.rating,
        rating_stars: '★'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating),
        message: formData.message,
        timestamp: new Date().toLocaleString(),
        user_agent: navigator.userAgent
      };

      // Send email
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            rating: 0,
            subject: '',
            message: ''
          });
          setErrors({});
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-t-3xl text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 rounded-t-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Share Your Experience</h2>
                <p className="text-white/90">We'd love to hear your feedback!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Thank you! Your review has been sent successfully.</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Failed to send review. Please try again.</span>
            </div>
          )}

          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                <User className="w-4 h-4" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                    : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400'
                } focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.email 
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                    : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400'
                } focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
              <Sparkles className="w-4 h-4" />
              Rate Your Experience
            </label>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      star <= (hoveredRating || formData.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                {formData.rating > 0 && (
                  <>
                    {formData.rating === 1 && "Poor"}
                    {formData.rating === 2 && "Fair"}
                    {formData.rating === 3 && "Good"}
                    {formData.rating === 4 && "Very Good"}
                    {formData.rating === 5 && "Excellent"}
                  </>
                )}
              </span>
            </div>
            {errors.rating && <p className="text-red-500 text-sm mt-2">{errors.rating}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <MessageSquare className="w-4 h-4" />
              Subject (Optional)
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a category</option>
              <option value="General Feedback">General Feedback</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="User Experience">User Experience</option>
              <option value="Performance">Performance</option>
              <option value="Design">Design</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <MessageSquare className="w-4 h-4" />
              Your Feedback
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none ${
                errors.message 
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
                  : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400'
              } focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50`}
              placeholder="Tell us about your experience, suggestions, or any issues you encountered..."
            />
            {errors.message && <p className="text-red-500 text-sm mt-2">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-bold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
