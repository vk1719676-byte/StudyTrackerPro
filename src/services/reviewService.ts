import { ReviewData } from '../components/review/ReviewForm';

const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyImxC-cRfRdnXSm6M9s_18nsq5NeETMp4iZ-v5wSGGVSo5ipSvX6TTlr1JTIWpYU4d/exec';

export const submitReview = async (reviewData: ReviewData): Promise<void> => {
  try {
    const formData = new FormData();
    
    // Add all review data to form
    formData.append('rating', reviewData.rating.toString());
    formData.append('features', reviewData.features.join(', '));
    formData.append('npsScore', reviewData.npsScore.toString());
    formData.append('feedback', reviewData.feedback);
    formData.append('timestamp', reviewData.timestamp);
    formData.append('userAgent', reviewData.userAgent);
    
    // Add additional metadata
    formData.append('url', window.location.href);
    formData.append('referrer', document.referrer);
    formData.append('screenResolution', `${screen.width}x${screen.height}`);
    formData.append('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    formData.append('language', navigator.language);

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Required for Google Apps Script
    });

    // Since we're using no-cors mode, we can't check the response
    // We'll assume success if no error is thrown
    console.log('Review submitted successfully');
    
    // Store submission in localStorage to prevent re-showing
    localStorage.setItem('reviewSubmitted', 'true');
    localStorage.setItem('reviewSubmittedAt', new Date().toISOString());
    
  } catch (error) {
    console.error('Failed to submit review:', error);
    throw new Error('Failed to submit review. Please try again.');
  }
};

export const hasSubmittedReview = (): boolean => {
  return localStorage.getItem('reviewSubmitted') === 'true';
};

export const getReviewSubmissionDate = (): Date | null => {
  const dateString = localStorage.getItem('reviewSubmittedAt');
  return dateString ? new Date(dateString) : null;
};

// Clear review submission (for testing purposes)
export const clearReviewSubmission = (): void => {
  localStorage.removeItem('reviewSubmitted');
  localStorage.removeItem('reviewSubmittedAt');
};
