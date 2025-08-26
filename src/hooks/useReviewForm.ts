import { useState, useEffect } from 'react';
import { hasSubmittedReview } from '../services/reviewService';

interface UseReviewFormReturn {
  showReviewForm: boolean;
  hideReviewForm: () => void;
}

export const useReviewForm = (delayMs: number = 60000): UseReviewFormReturn => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // Don't show if already submitted
    if (hasSubmittedReview()) {
      return;
    }

    // Set timer to show review form after delay
    const timer = setTimeout(() => {
      setShowReviewForm(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const hideReviewForm = () => {
    setShowReviewForm(false);
  };

  return {
    showReviewForm,
    hideReviewForm
  };
};
