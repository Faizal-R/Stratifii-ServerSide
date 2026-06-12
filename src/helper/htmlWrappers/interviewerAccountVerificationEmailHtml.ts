export function interviewerAccountVerificationEmailHtml(interviewerName?: string) {
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
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
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
</body>
</html>`
}
