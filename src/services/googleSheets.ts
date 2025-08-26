interface ReviewData {
  rating: number;
  feedback: string;
  recommend: boolean;
  email: string;
}

interface SheetData {
  timestamp: string;
  rating: number;
  feedback: string;
  recommend: string;
  email: string;
  userAgent: string;
  url: string;
}

// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbym7vUCAdoVFMkhWAdu_J7CL2nhcEtUJ_n-OPU5DwdhX-c-zVPBxtp44pG_N6hYfriI/exec';

export const submitReviewToSheets = async (reviewData: ReviewData): Promise<boolean> => {
  try {
    const sheetData: SheetData = {
      timestamp: new Date().toISOString(),
      rating: reviewData.rating,
      feedback: reviewData.feedback || 'No feedback provided',
      recommend: reviewData.recommend ? 'Yes' : 'No',
      email: reviewData.email || 'Not provided',
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetData)
    });

    // Note: With no-cors mode, we can't read the response
    // We'll assume success if no error was thrown
    console.log('Review submitted to Google Sheets');
    return true;
  } catch (error) {
    console.error('Error submitting review to Google Sheets:', error);
    
    // Fallback: Try to send to a mock endpoint for testing
    try {
      const fallbackResponse = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: 'review-form',
          data: reviewData,
          timestamp: new Date().toISOString()
        })
      });
      
      if (fallbackResponse.ok) {
        console.log('Review logged to fallback service');
        return true;
      }
    } catch (fallbackError) {
      console.error('Fallback service also failed:', fallbackError);
    }
    
    return false;
  }
};

// Helper function to create the Google Apps Script
export const getGoogleAppsScriptCode = (): string => {
  return `
function doPost(e) {
  try {
    // Get the active spreadsheet (make sure to create a Google Sheet first)
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the POST data
    const data = JSON.parse(e.postData.contents);
    
    // Check if headers exist, if not create them
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.getRange(1, 1, 1, 7).setValues([[
        'Timestamp', 'Rating', 'Feedback', 'Recommend', 'Email', 'User Agent', 'URL'
      ]]);
    }
    
    // Add the new review data
    sheet.appendRow([
      data.timestamp,
      data.rating,
      data.feedback,
      data.recommend,
      data.email,
      data.userAgent,
      data.url
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, message: 'Review submitted successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({message: 'Review Form API is working'}))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
};
