import { useState, useEffect } from 'react';

const REVIEW_MODAL_KEY = 'reviewModalShown';
const REVIEW_DELAY = 30000; // 30 seconds

export const useReviewModal = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    // Check if review modal was already shown
    const hasShownReview = localStorage.getItem(REVIEW_MODAL_KEY);
    
    if (!hasShownReview) {
      const timer = setTimeout(() => {
        setShowReviewModal(true);
      }, REVIEW_DELAY);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseReview = () => {
    setShowReviewModal(false);
    localStorage.setItem(REVIEW_MODAL_KEY, 'true');
  };

  const handleSubmitReview = () => {
    setShowReviewModal(false);
    localStorage.setItem(REVIEW_MODAL_KEY, 'true');
  };

  return {
    showReviewModal,
    handleCloseReview,
    handleSubmitReview
  };
};
