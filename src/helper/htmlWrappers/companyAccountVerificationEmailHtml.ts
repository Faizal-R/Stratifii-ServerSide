export function companyAccountVerificationEmailHtml(companyName?: string) {
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
</html>`
}
