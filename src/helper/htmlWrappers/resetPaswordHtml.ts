export function resetPaswordHtml(resetLink: string) {
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

// For backwards compatibility, export as wrapHtml too
export const wrapHtml = resetPaswordHtml;
