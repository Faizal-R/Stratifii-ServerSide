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
                <p>Dear Interviewer,</p>
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


export function companyAccountRejectionHtml(companyName?:string,reasonForRejection?:string){
 return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Application Update - ${companyName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            line-height: 1.6;
            background: linear-gradient(to bottom right, #000000 0%, #000000 50%, #2d1b69 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1);
            overflow: hidden;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #2d1b69 50%, #7c3aed 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
            position: relative;
            z-index: 1;
            font-weight: 300;
        }
        
        .content {
            padding: 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        .status-alert {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 127, 0.1) 100%);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-left: 4px solid #ef4444;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .status-alert h3 {
            color: #dc2626;
            font-size: 20px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .status-alert p {
            color: #991b1b;
            font-size: 15px;
        }
        
        .message {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        
        .reason-box {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .reason-box h4 {
            color: #4c1d95;
            margin-bottom: 12px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .reason-box p {
            color: #6b21a8;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .next-steps {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-left: 4px solid #22c55e;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .next-steps h4 {
            color: #15803d;
            margin-bottom: 12px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .next-steps p {
            color: #166534;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .footer {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .footer p {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .contact-info {
            color: #555;
            font-size: 14px;
        }
        
        .signature {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .signature h5 {
            color: #333;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Stratifii Interviews</h1>
            <p>Outsourcing Interview Solutions</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${companyName},
            </div>
            
            <div class="message">
                Thank you for registering with InterviewPro and showing interest in our outsourcing interview platform.
            </div>
            
            <div class="status-alert">
                <h3>Registration Status: Not Approved</h3>
                <p>Unfortunately, we cannot approve your company registration at this time.</p>
            </div>
            
            <div class="reason-box">
                <h4>Reason for Rejection:</h4>
                <p>${reasonForRejection}</p>
            </div>
            
            <div class="message">
                We understand this may be disappointing. Our platform maintains strict quality standards to ensure the best experience for all our partner companies and candidates.
            </div>
            
            <div class="next-steps">
                <h4>What's Next?</h4>
                <p>You can address the mentioned issues and reapply for registration. We encourage you to review our company requirements and submit a new application when ready.</p>
            </div>
            
            <div class="message">
                If you have any questions about this decision or need clarification on our requirements, please feel free to contact our support team.
            </div>
        </div>
        
        <div class="footer">
            <p>Need help? Contact our support team</p>
            
            <div class="contact-info">
                <p>📧 support@interviewpro.com</p>
                <p>📞 +1 (555) 123-4567</p>
            </div>
            
            <div class="signature">
                <h5>Best regards,</h5>
                <p>InterviewPro Admin Team<br>
                Quality Interview Solutions</p>
            </div>
        </div>
    </div>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'971f2d4e245106bb',t:'MTc1NTY2NDQ1My4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
`;  
};



export function companyAccountVerificationEmailHtml(companyName?:string){
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified - Stratifii Interviews</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            line-height: 1.6;
            background: #f2f2f7;
            min-height: 100vh;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 6px 20px rgba(124, 58, 237, 0.15);
            overflow: hidden;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #2d1b69 50%, #7c3aed 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
            font-weight: 300;
        }
        
        .content {
            padding: 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        .success-alert {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #22c55e;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        
        .success-alert h3 {
            color: #15803d;
            font-size: 22px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .success-alert p {
            color: #166534;
            font-size: 16px;
        }
        
        .checkmark {
            margin-bottom: 20px;
        }
        
        .message {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        
        .features-box {
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .features-box h4 {
            color: #4c1d95;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .features-list {
            list-style: none;
            padding: 0;
        }
        
        .features-list li {
            color: #6b21a8;
            font-size: 15px;
            margin-bottom: 12px;
            line-height: 1.5;
            display: flex;
            align-items: center;
        }
        
        .features-list img {
            margin-right: 10px;
        }
        
        .cta-section {
            background: #f5f3ff;
            border: 1px solid #ddd6fe;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
        }
        
        .cta-section h4 {
            color: #4c1d95;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
        }
        
        .cta-button:hover {
            opacity: 0.9;
        }
        
        .support-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
        }
        
        .support-box h4 {
            color: #1d4ed8;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
        }
        
        .support-box p {
            color: #1e40af;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer {
            background: #fafafa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .contact-info {
            color: #555;
            font-size: 14px;
        }
        
        .signature {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .signature h5 {
            color: #333;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Stratifii Platform</h1>
            <p>Outsourcing Interview Solutions</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Congratulations ${companyName}!
            </div>
            
            <div class="success-alert">
                <div class="checkmark">
                    <img src="https://img.icons8.com/ios-filled/50/22c55e/checkmark.png" alt="Success" width="50" height="50" />
                </div>
                <h3>Account Successfully Verified</h3>
                <p>Your company registration has been approved and your account is now active.</p>
            </div>
            
            <div class="message">
                Welcome to Stratifii! We're excited to have you as our partner. Your company profile has been thoroughly reviewed and approved by our admin team.
            </div>
            
            <div class="features-box">
                <h4>What You Can Do Now:</h4>
                <ul class="features-list">
                    <li><img src="https://img.icons8.com/ios-filled/20/7c3aed/arrow.png" width="16" height="16" alt="arrow"> Submit candidate profiles for professional interviews</li>
                    <li><img src="https://img.icons8.com/ios-filled/20/7c3aed/arrow.png" width="16" height="16" alt="arrow"> Access our comprehensive interview assessment reports</li>
                    <li><img src="https://img.icons8.com/ios-filled/20/7c3aed/arrow.png" width="16" height="16" alt="arrow"> Track interview progress and candidate performance</li>
                    <li><img src="https://img.icons8.com/ios-filled/20/7c3aed/arrow.png" width="16" height="16" alt="arrow"> Receive quality-filtered candidates back to your team</li>
                    <li><img src="https://img.icons8.com/ios-filled/20/7c3aed/arrow.png" width="16" height="16" alt="arrow"> Manage your company dashboard and settings</li>
                </ul>
            </div>
            
            <div class="message">
                Our platform is designed to streamline your hiring process by providing professional interview services that save you time while ensuring you get the best candidates.
            </div>
            
            <div class="support-box">
                <h4>Need Assistance?</h4>
                <p>Our support team is here to help you get the most out of Stratifii. Don't hesitate to reach out if you have any questions about using the platform or submitting your first candidates.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for choosing InterviewPro for your interview outsourcing needs!</p>
            
            <div class="contact-info">
                <p>📧 support@interviewpro.com</p>
                <p>📞 +1 (555) 123-4567</p>
            </div>
            
            <div class="signature">
                <h5>Best regards,</h5>
                <p>Stratifiii Admin Team<br>
                Quality Interview Solutions</p>
            </div>
        </div>
    </div>
</body>
</html>
`
}


export function interviewerAccountVerificationEmailHtml(interviewerName?:string){
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interviewer Account Verified - Stratifii Interviews</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            line-height: 1.6;
            background: linear-gradient(to bottom right, #000000 0%, #000000 50%, #2d1b69 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1);
            overflow: hidden;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .header {
            background: linear-gradient(135deg, #000000 0%, #2d1b69 50%, #7c3aed 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
            font-weight: 700;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
            position: relative;
            z-index: 1;
            font-weight: 300;
        }
        
        .content {
            padding: 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        
        .success-alert {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-left: 4px solid #22c55e;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.1);
            backdrop-filter: blur(5px);
            text-align: center;
        }
        
        .success-alert h3 {
            color: #15803d;
            font-size: 22px;
            margin-bottom: 12px;
            font-weight: 600;
        }
        
        .success-alert p {
            color: #166534;
            font-size: 16px;
        }
        
        .checkmark {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        }
        
        .checkmark::after {
            content: '✓';
            color: white;
            font-size: 28px;
            font-weight: bold;
        }
        
        .message {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
        }
        
        .role-box {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
            border: 1px solid rgba(139, 92, 246, 0.2);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .role-box h4 {
            color: #4c1d95;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .role-list {
            list-style: none;
            padding: 0;
        }
        
        .role-list li {
            color: #6b21a8;
            font-size: 15px;
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
            line-height: 1.5;
        }
        
        .role-list li::before {
            content: '→';
            color: #7c3aed;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        
        .cta-section {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
            border: 1px solid rgba(139, 92, 246, 0.3);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .cta-section h4 {
            color: #4c1d95;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 600;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
        }
        
        .guidelines-box {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
            border: 1px solid rgba(245, 158, 11, 0.2);
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .guidelines-box h4 {
            color: #d97706;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
        }
        
        .guidelines-box p {
            color: #92400e;
            font-size: 14px;
            line-height: 1.6;
        }
        
        .footer {
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .footer p {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .contact-info {
            color: #555;
            font-size: 14px;
        }
        
        .signature {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .signature h5 {
            color: #333;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Stratifii Platform</h1>
            <p>Professional Interview Services</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Welcome to the team, ${interviewerName}!
            </div>
            
            <div class="success-alert">
                <div class="checkmark">
                    <img src="https://img.icons8.com/ios-filled/50/22c55e/checkmark.png" alt="Success" width="50" height="50" />
                </div>
                <h3>Interviewer Account Verified</h3>
                <p>Your profile has been approved and you're now part of our expert interview team.</p>
            </div>
            
            <div class="message">
                Congratulations! Your interviewer application has been thoroughly reviewed and approved by our admin team. We're excited to have you join our network of professional interviewers.
            </div>
            
            <div class="role-box">
                <h4>Your Role as an Stratifii Interviewer:</h4>
                <ul class="role-list">
                    <li>Conduct professional interviews for candidates submitted by partner companies</li>
                    <li>Evaluate candidates based on technical skills and cultural fit</li>
                    <li>Provide detailed assessment reports and recommendations</li>
                    <li>Maintain high standards of professionalism and confidentiality</li>
                    <li>Help companies find quality candidates efficiently</li>
                </ul>
            </div>
            
            <div class="cta-section">
                <h4>Ready to Start Interviewing?</h4>
                <a href="#" class="cta-button">Access Interviewer Dashboard</a>
            </div>
            
            <div class="message">
                As a verified interviewer, you'll receive interview assignments based on your expertise and availability. Each interview you conduct helps companies make better hiring decisions while building your professional reputation.
            </div>
            
            <div class="guidelines-box">
                <h4>Important Guidelines:</h4>
                <p>Please review our interviewer guidelines and code of conduct in your dashboard. Maintaining quality standards and professional behavior is essential for the success of our platform and all stakeholders involved.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>Thank you for joining our team of professional interviewers!</p>
            
            <div class="contact-info">
                <p>📧 interviewers@interviewpro.com</p>
                <p>📞 +1 (555) 123-4567</p>
            </div>
            
            <div class="signature">
                <h5>Best regards,</h5>
                <p>Stratifii Admin Team<br>
                Quality Interview Solutions</p>
            </div>
        </div>
    </div>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'971f3d4c51def242',t:'MTc1NTY2NTEwOC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
`
};