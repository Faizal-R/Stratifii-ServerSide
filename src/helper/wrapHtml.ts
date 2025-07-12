export function wrapHtml(resetLink: string) {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .logo {
                width: 100px;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                background: #007bff;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 20px;
                border-radius: 5px;
                font-size: 16px;
                margin-top: 20px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #888888;
            }
            .footer a {
                color: #007bff;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://yourwebsite.com/logo.png" alt="Company Logo" class="logo">
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
            <a href=${resetLink} class="button">Reset Password</a>
            <p>If you did not request a password reset, you can ignore this email.</p>
            <div class="footer">
                <p>Need help? <a href="https://yourwebsite.com/support">Contact Support</a></p>
                <p>© 2025 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function createPasswordHtml(
  candidateName: string,
  companyName: string,
  passwordCreationLink: string
) {
  return `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">

  <style>
    .feature-list {
      padding-left: 0;
      list-style: none;
    }
    .feature-list li {
      margin-bottom: 10px;
      padding-left: 24px;
      position: relative;
    }
    .feature-list li::before {
      content: "✔️";
      position: absolute;
      left: 0;
      color: #0b5ed7;
      font-size: 14px;
    }
    .button {
      background-color: #0b5ed7;
      color: #fff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #0846a4;
    }
    .note {
      color: #d9534f;
      font-weight: bold;
    }
  </style>

  <p style="font-size: 18px; margin-bottom: 20px;">Hi ${candidateName},</p>

  <p>
    You have been nominated by <strong>${companyName}</strong> to proceed with the interview process through our official interview management platform — <strong>Stratifii Interviews</strong>.
  </p>

  <p>
    To continue with your interview journey, please set up your account by creating a password. Your account will enable you to:
  </p>

  <ul class="feature-list">
    <li>Access your interview dashboard</li>
    <li>View interview schedules & updates</li>
    <li>Join mock & final interviews</li>
    <li>Receive feedback and results</li>
  </ul>

  <p class="note">
    Important: You have <strong>2 days</strong> to complete your account setup. Failure to do so may result in delays or cancellation of your interview process.
  </p>

  <button style="text-align: center; margin: 30px 0;">
    <a href="${passwordCreationLink}" class="button">
      Create My Password
    </a>
  </button>

  <p>
    Completing this step is mandatory to move forward with the interview process initiated by <strong>${companyName}</strong>.
  </p>

  <p>
    If you did not expect this email or require any assistance, feel free to contact us at <a href="mailto:support@stratifii.com" style="color: #0b5ed7; text-decoration: none;">support@stratifii.com</a>.
  </p>

  <p style="margin-top: 40px;">
    Regards,<br/>
    <strong>Stratifii Interviews Team</strong>
  </p>

</div>
`;
}

export function otpVerificationHtml(otp:string){
  return `<!DOCTYPE html>
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
    </html>`;
}








export function interviewerAccountRejectionHtml(interviewerName?:string,reasonForRejection?:string){
 return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Application Update</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            text-align: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            background: white;
            padding: 40px;
            position: relative;
        }
        
        .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .main-message {
            font-size: 18px;
            line-height: 1.7;
            color: #2d3748;
            margin-bottom: 30px;
        }
        
        .reason-section {
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            border-left: 4px solid #667eea;
            padding: 25px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .reason-section h3 {
            color: #2d3748;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .reason-section h3::before {
            content: "ℹ️";
            margin-right: 10px;
            font-size: 18px;
        }
        
        .reason-list {
            color: #4a5568;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .next-steps {
            background: linear-gradient(135deg, #e6fffa, #b2f5ea);
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
            border: 1px solid #81e6d9;
        }
        
        .next-steps h3 {
            color: #234e52;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        
        .next-steps h3::before {
            content: "🚀";
            margin-right: 10px;
            font-size: 18px;
        }
        
        .next-steps p {
            color: #2d3748;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .footer {
            background: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            color: #718096;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            color: #4a5568;
            font-size: 14px;
            text-decoration: none;
        }
        
        .contact-item:hover {
            color: #667eea;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .main-message {
                font-size: 16px;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">
                <span class="logo-text">IP</span>
            </div>
            <h1>Account Verification Status</h1>
            <p>Your interviewer account verification update</p>
        </div>
        
        <div class="content">
            <div class="status-badge">
                Account Verification Denied
            </div>
            
            <div class="main-message">
                <p>Dear [INTERVIEWER_NAME],</p>
                <p>Thank you for registering as an interviewer on our outsourcing interview platform. We appreciate your interest in joining our network of professional interviewers.</p>
                <p>After careful review by our admin team, we regret to inform you that your interviewer account verification has been <strong>denied</strong> at this time.</p>
            </div>
            
            <div class="reason-section">
                <h3>Verification Decision Details</h3>
                <div class="reason-list">
                    <p><strong>Admin Review Result:</strong> [ADMIN_REASON]</p>
                    <p>Common reasons for denial may include: incomplete profile information, insufficient experience verification, documentation issues, or platform requirements not met.</p>
                </div>
            </div>
            
            <div class="next-steps">
                <h3>Next Steps Available</h3>
                <p><strong>Reapplication Process:</strong> You may reapply for verification after addressing the issues mentioned above. Please ensure all required documents and information are complete.</p>
                <p><strong>Support Available:</strong> If you need clarification on the verification requirements or have questions about the decision, our admin team is available to help.</p>
                <p><strong>Timeline:</strong> You can submit a new verification request after 30 days from this notification.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
                We maintain high standards for our interviewer network to ensure quality service for our clients. We appreciate your understanding and encourage you to reapply once you've addressed the verification requirements.
            </p>
            
            <a href="mailto:admin@interviewplatform.com" class="cta-button">Contact Admin Team</a>
        </div>
        
        <div class="footer">
            <p><strong>Interview Platform Admin Team</strong></p>
            <p>This is an automated notification from our verification system.</p>
            
            <div class="contact-info">
                <a href="mailto:admin@interviewplatform.com" class="contact-item">
                    📧 admin@interviewplatform.com
                </a>
                <a href="mailto:support@interviewplatform.com" class="contact-item">
                    🎧 support@interviewplatform.com
                </a>
                <a href="https://interviewplatform.com/help" class="contact-item">
                    📚 Help Center
                </a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
                © 2025 Interview Platform. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`
}
