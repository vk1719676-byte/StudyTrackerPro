// EmailJS Setup Instructions
// 
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Create a new email service (Gmail, Outlook, etc.)
// 3. Create an email template with these variables:
//    - {{to_email}} - Your email address
//    - {{from_name}} - User's display name
//    - {{user_email}} - User's email
//    - {{rating}} - Star rating
//    - {{experience}} - User experience
//    - {{features}} - Liked features
//    - {{recommendation}} - Recommendation score
//    - {{comments}} - Additional comments
//    - {{timestamp}} - Submission time
//    - {{user_id}} - User ID
//
// 4. Get your Service ID, Template ID, and Public Key
// 5. Replace the placeholders in TelegramJoinModal.tsx:
//    - YOUR_SERVICE_ID
//    - YOUR_TEMPLATE_ID  
//    - YOUR_PUBLIC_KEY
//    - your-email@example.com

export const EMAIL_CONFIG = {
  SERVICE_ID: 'service_6o4qhqo',
  TEMPLATE_ID: 'template_t63mr47',
  PUBLIC_KEY: 'R7FjYtFyj3Ah7_LbA',
  TO_EMAIL: 'archanakumariak117@gmail.com'
}

// Example email template:
/*
Subject: New Study Tracker Review from {{from_name}}

Hello,

You have received a new review for Study Tracker:

User Details:
- Name: {{from_name}}
- Email: {{user_email}}
- User ID: {{user_id}}
- Submitted: {{timestamp}}

Review Details:
- Overall Rating: {{rating}}
- Experience: {{experience}}
- Liked Features: {{features}}
- Recommendation Score: {{recommendation}}/10
- Comments: {{comments}}

Best regards,
Study Tracker Review System
*/
