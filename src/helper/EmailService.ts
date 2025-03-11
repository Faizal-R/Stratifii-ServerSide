import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com" , // e.g., "smtp.gmail.com"
  port: 587, // Use 465 for SSL
  secure:false, // true for 465, false for others
  auth: {
    user:'stratifiii@gmail.com',
    pass: 'olkk cpfw bdgd uxsj',
  },
});

export const sendEmail = async (to: string,otp:string) => {
  
  const html=`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 20px;
      }
      
      .container {
        max-width: 500px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .header {
        background: linear-gradient(to bottom, #000000, #1e1b4b);
        padding: 24px;
        text-align: center;
      }
      
      .icon-container {
        background-color: #1e1b4b;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 8px;
      }
      
      .header-title {
        color: #ffffff;
        font-size: 20px;
        font-weight: bold;
        margin: 0;
      }
      
      .date {
        padding: 16px 24px 0;
        font-size: 12px;
        color: #6b7280;
      }
      
      .content {
        padding: 24px;
      }
      
      .greeting, .message {
        color: #374151;
        margin-bottom: 24px;
      }
      
      .code-container {
        background-color: #f3f4f6;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
        text-align: center;
      }
      
      .code {
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 0.2em;
        color: #1e1b4b;
      }
      
      .expiry {
        font-size: 12px;
        color: #6b7280;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .warning-box {
        background-color: #fffbeb;
        border: 1px solid #fef3c7;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 24px;
        display: flex;
      }
      
      .security-box {
        background-color: #f5f3ff;
        border: 1px solid #ede9fe;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 24px;
        display: flex;
      }
      
      .box-text {
        font-size: 14px;
        color: #374151;
        margin: 0;
        margin-left: 8px;
      }
      
      .thanks {
        color: #374151;
        margin-bottom: 8px;
      }
      
      .team {
        color: #374151;
        font-weight: 600;
        margin-bottom: 24px;
      }
      
      .details-button {
        color: #8b5cf6;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
      }
      
      .details-section {
        margin-top: 16px;
        border-top: 1px solid #e5e7eb;
        padding-top: 16px;
      }
      
      .details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .details-title {
        font-weight: 500;
        color: #374151;
        margin: 0;
      }
      
      .hide-details {
        color: #8b5cf6;
        font-size: 12px;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
      }
      
      .details-text {
        font-size: 14px;
        color: #4b5563;
        margin-bottom: 16px;
      }
      
      .details-info {
        background-color: #f9fafb;
        padding: 12px;
        border-radius: 6px;
      }
      
      .info-row {
        display: flex;
        margin-bottom: 8px;
      }
      
      .info-row:last-child {
        margin-bottom: 0;
      }
      
      .info-label {
        width: 96px;
        font-size: 12px;
        color: #6b7280;
      }
      
      .info-value {
        font-size: 12px;
        color: #374151;
      }
      
      .help-section {
        background-color: #f9fafb;
        padding: 16px;
        border-top: 1px solid #e5e7eb;
      }
      
      .help-title {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }
      
      .help-link {
        color: #8b5cf6;
        font-size: 14px;
        display: flex;
        align-items: center;
        text-decoration: none;
      }
      
      .footer {
        border-top: 1px solid #e5e7eb;
        padding: 16px;
        background-color: #f9fafb;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      
      .footer p {
        margin: 0 0 8px;
      }
      
      .footer p:last-child {
        margin-bottom: 0;
      }
      
      .icon {
        display: inline-block;
        vertical-align: middle;
      }
      
      .icon-sm {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
      
      .icon-xs {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Email Header -->
      <div class="header">
        <div class="icon-container">
          <svg class="icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
            <path d="m5 8 7 4 7-4"></path>
          </svg>
        </div>
        <h1 class="header-title">Verification Code</h1>
      </div>
      
      <!-- Email Date -->
      <div class="date">
        Monday, January 1, 2025
      </div>
      
      <!-- Email Body -->
      <div class="content">
        <p class="greeting">
          Hello,
        </p>
        
        <p class="message">
          We received a request to verify your account. Please use the verification code below to complete the process:
        </p>
        
        <!-- OTP Code Display -->
        <div class="code-container">
          <div class="code">${otp}</div>
          <div class="expiry">
            <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            This code will expire in 10 minutes.
          </div>
        </div>
        
        <div class="security-box">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p class="box-text">
            For your security, never share this code with anyone.
          </p>
        </div>
        
        <p class="thanks">
          Thank you,
        </p>
        <p class="team">
          The Security Team
        </p>
        
        <!-- Details Section (Expanded) -->
        <div class="details-section">
          <div class="details-header">
            <h3 class="details-title">Why am I receiving this?</h3>
            <button class="hide-details">Hide details</button>
          </div>
          <p class="details-text">
            You received this email because someone (hopefully you) is trying to access your account. This verification code helps us ensure it's really you.
          </p>
          
      
      
      <!-- Email Footer -->
      <div class="footer">
        <p>This is an automated message, please do not reply.</p>
        <p>© 2025 Your Company. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM, 
      to,
      subject:"Email Verification Code Inside – Don’t Share It!",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
