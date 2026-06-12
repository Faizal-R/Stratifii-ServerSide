export function interviewerAccountRejectionHtml(interviewerName?: string, reasonForRejection?: string) {
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
                <p>Dear ${interviewerName},</p>
                <p>Thank you for registering as an interviewer on our outsourcing interview platform. We appreciate your interest in joining our network of professional interviewers.</p>
                <p>After careful review by our admin team, we regret to inform you that your interviewer account verification has been <strong>denied</strong> at this time.</p>
            </div>
            
            <div class="reason-section">
                <h3>Verification Decision Details</h3>
                <div class="reason-list">
                    <p><strong>Admin Review Result:</strong> ${reasonForRejection}</p>
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
