// Google Sheets Service for sending review data
export interface ReviewSubmission {
  rating: number;
  experience: string;
  recommendation: string;
  improvements: string;
  features: string[];
  email?: string;
  name?: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzy3AJVCpn6pbxx2TNhS-FP9JMHkXSpZYags84wf_PEzIMkFtm3JXLEz4KpfOTILEw/exec';

export const submitReviewToGoogleSheets = async (data: ReviewSubmission): Promise<void> => {
  try {
    // Prepare the data for Google Sheets
    const payload = {
      ...data,
      features: data.features.join(', '), // Convert array to comma-separated string
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('Review data sent to Google Sheets');
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error);
    throw error;
  }
};

// Alternative method using fetch with credentials (if needed)
export const submitReviewWithAuth = async (data: ReviewSubmission): Promise<void> => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, value.join(', '));
      } else {
        formData.append(key, String(value));
      }
    });

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    console.log('Review submitted with form data');
  } catch (error) {
    console.error('Error submitting review with auth:', error);
    throw error;
  }
};
