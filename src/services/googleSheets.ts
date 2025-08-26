// Google Sheets integration service
export interface ReviewData {
  name: string;
  email: string;
  rating: number;
  feedback: string;
  timestamp: string;
  userAgent: string;
  platform: string;
}

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx6cxSlNdGaZvpP5qSppw6jrpJC-D-lEWY3cRHULjDS4FWarx6q5gaLGMtHtO4OVQnL7g/exec';

export const submitReviewToGoogleSheets = async (reviewData: ReviewData): Promise<boolean> => {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'submitReview',
        data: reviewData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error submitting review to Google Sheets:', error);
    // Fallback: store locally if Google Sheets fails
    localStorage.setItem(`review_backup_${Date.now()}`, JSON.stringify(reviewData));
    return false;
  }
};

export const generateGoogleAppsScript = (): string => {
  return `
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'submitReview') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Reviews') || 
                   SpreadsheetApp.getActiveSpreadsheet().insertSheet('Reviews');
      
      // Add headers if sheet is empty
      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          'Timestamp',
          'Name', 
          'Email',
          'Rating',
          'Feedback',
          'User Agent',
          'Platform'
        ]);
      }
      
      // Add the review data
      sheet.appendRow([
        data.data.timestamp,
        data.data.name,
        data.data.email,
        data.data.rating,
        data.data.feedback,
        data.data.userAgent,
        data.data.platform
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
};
