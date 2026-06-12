export function companyAccountRejectionHtml(companyName?: string, reasonForRejection?: string) {
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
</body>
</html>`
}
