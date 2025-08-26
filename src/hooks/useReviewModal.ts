import { useState, useEffect } from 'react';

export const useReviewModal = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    // Check if user has already submitted a review
    const hasSubmittedReview = localStorage.getItem('hasSubmittedReview') === 'true';
    const reviewSubmittedAt = localStorage.getItem('reviewSubmittedAt');
    
    // Don't show if already submitted recently (within 30 days)
    if (hasSubmittedReview && reviewSubmittedAt) {
      const submittedDate = new Date(parseInt(reviewSubmittedAt));
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (submittedDate > thirtyDaysAgo) {
        return;
      }
    }

    // Check if modal was dismissed recently (within 24 hours)
    const dismissedAt = localStorage.getItem('reviewModalDismissedAt');
    if (dismissedAt) {
      const dismissedDate = new Date(parseInt(dismissedAt));
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      
      if (dismissedDate > twentyFourHoursAgo) {
        return;
      }
    }

    // Show modal after 1 minute (60000ms)
    const timer = setTimeout(() => {
      if (!hasShownModal && !hasSubmittedReview) {
        setShowReviewModal(true);
        setHasShownModal(true);
      }
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, [hasShownModal]);

  const handleCloseModal = () => {
    setShowReviewModal(false);
    // Store dismissal timestamp
    localStorage.setItem('reviewModalDismissedAt', Date.now().toString());
  };

  const handleSubmitReview = () => {
    setShowReviewModal(false);
    // Review submission is handled in the modal component
  };

  return {
    showReviewModal,
    handleCloseModal,
    handleSubmitReview
  };
};
