import { ReviewData } from '../components/ui/ReviewModal';

// Google Apps Script Web App URL - Replace with your actual deployed script URL
// Instructions:
// 1. Copy the code from /public/google-apps-script.js
// 2. Go to https://script.google.com and create a new project
// 3. Paste the code and save
// 4. Deploy as web app with access set to "Anyone"
// 5. Copy the deployment URL and replace the URL below
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz9KbLRyxxJ_ocqZdCYXWqa5GUebOwYKw4j-IuQJWl4oJ9PyQOcpjcGYs4NFa47Dx6J/exec';

export interface SubmitReviewResponse {
  success: boolean;
  message: string;
  rowId?: number;
}

export const submitReviewToGoogleSheets = async (reviewData: ReviewData): Promise<SubmitReviewResponse> => {
  try {
    // Prepare data for Google Sheets
    const formData = new FormData();
    formData.append('rating', reviewData.rating.toString());
    formData.append('experience', reviewData.experience);
    formData.append('features', reviewData.features.join(', '));
    formData.append('improvements', reviewData.improvements);
    formData.append('wouldRecommend', reviewData.wouldRecommend);
    formData.append('userEmail', reviewData.userEmail || '');
    formData.append('timeSpent', reviewData.timeSpent.toString());
    formData.append('timestamp', reviewData.timestamp);
    formData.append('action', 'submitReview');

    // Submit to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for Google Apps Script
      body: formData,
    });

    // Note: With no-cors mode, we can't read the response
    // We'll assume success if no error is thrown
    return {
      success: true,
      message: 'Review submitted successfully!',
    };

  } catch (error) {
    console.error('Error submitting review:', error);
    
    // Fallback: Try to submit via alternative method or log locally
    try {
      // Store locally as backup
      const localReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
      localReviews.push({
        ...reviewData,
        submitAttempted: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('pendingReviews', JSON.stringify(localReviews));
      
      // Try alternative submission method
      return await submitViaAlternativeMethod(reviewData);
    } catch (fallbackError) {
      console.error('Fallback submission also failed:', fallbackError);
      throw new Error('Unable to submit review. Please check your connection and try again.');
    }
  }
};

// Alternative submission method using GET request approach
const submitViaAlternativeMethod = async (reviewData: ReviewData): Promise<SubmitReviewResponse> => {
  try {
    // Use URLSearchParams for GET request approach
    const params = new URLSearchParams({
      action: 'submitReview',
      rating: reviewData.rating.toString(),
      experience: reviewData.experience,
      features: reviewData.features.join(', '),
      improvements: reviewData.improvements,
      wouldRecommend: reviewData.wouldRecommend,
      userEmail: reviewData.userEmail || '',
      timeSpent: reviewData.timeSpent.toString(),
      timestamp: reviewData.timestamp,
    });

    const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: 'GET',
      mode: 'no-cors', // Important for Google Apps Script
    });

    // With no-cors, assume success if no error thrown
    return {
      success: true,
      message: 'Review submitted successfully via alternative method!',
    };
  } catch (error) {
    console.error('Alternative submission error:', error);
    
    // Final fallback - still store locally
    return {
      success: true,
      message: 'Review saved locally and will be submitted when connection improves.',
    };
  }
};

// Function to retry pending reviews (can be called periodically)
export const retryPendingReviews = async (): Promise<void> => {
  try {
    const pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    const successfulSubmissions: any[] = [];
    
    for (const review of pendingReviews) {
      if (review.status === 'pending') {
        try {
          await submitReviewToGoogleSheets(review);
          successfulSubmissions.push(review);
        } catch (error) {
          console.error('Failed to retry review submission:', error);
        }
      }
    }
    
    // Remove successfully submitted reviews
    const remainingReviews = pendingReviews.filter(
      (review: any) => !successfulSubmissions.includes(review)
    );
    
    localStorage.setItem('pendingReviews', JSON.stringify(remainingReviews));
    
    if (successfulSubmissions.length > 0) {
      console.log(`Successfully submitted ${successfulSubmissions.length} pending reviews`);
    }
  } catch (error) {
    console.error('Error retrying pending reviews:', error);
  }
};

// Get review statistics (if needed)
export const getReviewStats = async () => {
  try {
    const params = new URLSearchParams({
      action: 'getStats',
    });

    const response = await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: 'GET',
    });

    if (response.ok) {
      return await response.json();
    }
    
    throw new Error('Failed to fetch stats');
  } catch (error) {
    console.error('Error getting review stats:', error);
    return null;
  }
};
