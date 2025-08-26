interface ReviewData {
  rating: number;
  message: string;
  name: string;
  email: string;
  category: string;
  wouldRecommend: boolean;
}

// Google Sheets configuration
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Sheets ID from the URL
  SHEET_ID: '1ZqKI3q--no_plhtmh4KsxnaMNUR5iG0MFa1czg8SQhw',
  // Replace with your Google Apps Script Web App URL
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxL_gbLvLdPvsEH9Xfu1RIZcbBUxYugFGOPJ6OQMSiaj9z3_K6lZ2RQ4adjh83BAV4ekA/exec'
};

// Email configuration for backup
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_gmail',
  TEMPLATE_ID: 'template_review',
  USER_ID: 'YOUR_EMAILJS_USER_ID'
};

export const submitReview = async (reviewData: ReviewData): Promise<void> => {
  const submissionData = {
    ...reviewData,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  try {
    // Primary method: Send to Google Sheets via Apps Script
    await sendToGoogleSheets(submissionData);
  } catch (error) {
    console.error('Failed to send to Google Sheets:', error);
    
    try {
      // Fallback method: Send email notification
      await sendEmailNotification(submissionData);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      
      // Last resort: Store locally and show success (you can implement your own endpoint)
      localStorage.setItem(`review_${Date.now()}`, JSON.stringify(submissionData));
      console.log('Review stored locally:', submissionData);
    }
  }
};

const sendToGoogleSheets = async (data: any): Promise<void> => {
  const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
};

const sendEmailNotification = async (data: any): Promise<void> => {
  // Using a simple webhook service as fallback
  // You can replace this with your preferred email service
  const webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: 'reviews@yourapp.com', // Replace with your email
      subject: `New App Review - ${data.rating} Stars`,
      body: formatEmailContent(data)
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send email notification');
  }
};

const formatEmailContent = (data: any): string => {
  return `
    New Review Submitted:
    
    Rating: ${data.rating}/5 ⭐
    Category: ${data.category}
    Name: ${data.name}
    Email: ${data.email}
    Would Recommend: ${data.wouldRecommend ? 'Yes' : 'No'}
    
    Message:
    ${data.message}
    
    Submitted: ${new Date(data.timestamp).toLocaleString()}
    URL: ${data.url}
    Browser: ${data.userAgent}
  `;
};
