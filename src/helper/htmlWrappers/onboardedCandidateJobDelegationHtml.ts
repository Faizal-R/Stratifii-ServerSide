export function onboardedCandidateJobDelegationHtml(
  candidateName: string,
  companyName: string,
  dashboardLink: string
) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Interview Invitation</title>
  </head>
  <body style="margin:0; padding:0; background: linear-gradient(135deg, #000000, #0a0018, #1e0b4e); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#f9fafb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #000000, #0a0018, #1e0b4e); padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f1b; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.3); border: 1px solid #2e1065;">
            <tr>
              <td align="center" style="background:#7c3aed; padding:20px;">
                <h2 style="margin:0; font-size:22px; color:#ffffff; letter-spacing:0.5px;">
                  New Interview Assignment 🚀
                </h2>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <p style="font-size:16px; color:#e5e7eb; margin:0 0 16px;">Hello <strong>${candidateName}</strong>,</p>
                <p style="font-size:15px; line-height:1.7; color:#d1d5db;">
                  You have been assigned to a new interview process by <strong>${companyName}</strong> on <strong>Stratifii Interviews</strong>.
                </p>

                <p style="font-size:15px; line-height:1.7; color:#d1d5db; margin-top:15px;">
                  Since your account is already active, you can skip registration and directly proceed to take your AI mock screening interview:
                </p>

                <table width="100%" style="margin-top:25px; border-collapse:collapse; background:#1f1f2e; border-radius:8px;">
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">• Access your interview dashboard</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">• Attend the required AI mock screening round</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">• Track your application progress with ${companyName}</td>
                  </tr>
                </table>

                <p style="margin-top:30px; font-size:15px; color:#c4b5fd; font-weight:bold;">
                  Important: Please complete your AI mock interview within <strong>2 days</strong> to advance in the selection process.
                </p>

                <div style="margin-top:40px; text-align:center;">
                  <a href="${dashboardLink}" style="text-decoration:none; background:#7c3aed; padding:12px 26px; color:white; border-radius:6px; font-size:15px; display:inline-block; font-weight:bold;">
                    Go to Dashboard
                  </a>
                </div>

                <p style="margin-top:40px; font-size:14px; color:#9ca3af; text-align:center;">
                  Regards,<br/>
                  <strong style="color:#c4b5fd;">Stratifii Interviews Team</strong>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
