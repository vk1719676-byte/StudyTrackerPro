import emailjs from '@emailjs/browser';

// EmailJS configuration
const SERVICE_ID = 'service_da4r6nj'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_bqvwpnl'; // Replace with your EmailJS template ID
const USER_ID = 'WYXQh1BJu91-ldVqM'; // Replace with your EmailJS user ID

export interface ReviewData {
  name: string;
  email: string;
  rating: number;
  feedback: string;
  recommendation: string;
  features: string[];
}

export const sendReviewEmail = async (reviewData: ReviewData): Promise<void> => {
  try {
    const templateParams = {
      to_email: 'devendrathakur0127@gmail.com', // Replace with your email
      from_name: reviewData.name,
      from_email: reviewData.email,
      rating: reviewData.rating,
      rating_stars: '⭐'.repeat(reviewData.rating),
      feedback: reviewData.feedback,
      recommendation: reviewData.recommendation,
      features: reviewData.features.join(', '),
      timestamp: new Date().toLocaleString(),
      subject: `New App Review from ${reviewData.name} (${reviewData.rating}/5 stars)`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      USER_ID
    );

    console.log('Review email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending review email:', error);
    throw error;
  }
};

// Alternative: Send to webhook endpoint (if you prefer server-side handling)
export const sendReviewToWebhook = async (reviewData: ReviewData): Promise<void> => {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...reviewData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        page: window.location.pathname
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send review');
    }

    const result = await response.json();
    console.log('Review sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending review:', error);
    throw error;
  }
};
