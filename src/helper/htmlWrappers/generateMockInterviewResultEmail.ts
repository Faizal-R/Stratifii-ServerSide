interface AIMockResult {
  totalQuestions: number;
  correctAnswers: number;
  scoreInPercentage: number;
}

interface MockInterviewEmailProps {
  candidateName: string;
  companyName: string;
  jobTitle: string;
  aiMockResult: AIMockResult;
}

export function generateMockInterviewResultEmail({
  candidateName,
  companyName,
  jobTitle,
  aiMockResult,
}: MockInterviewEmailProps): string {
  const isPassed = aiMockResult.scoreInPercentage >= 80;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mock Interview Result</title>
  </head>
  <body style="margin:0; padding:0; background: linear-gradient(135deg, #000000, #0a0018, #1e0b4e); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#f9fafb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #000000, #0a0018, #1e0b4e); padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#0f0f1b; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <tr>
              <td align="center" style="background:${isPassed ? "#16a34a" : "#dc2626"}; padding:20px;">
                <h2 style="margin:0; font-size:22px; color:#ffffff; letter-spacing:0.5px;">
                  ${isPassed ? "Mock Interview Passed ✅" : "Mock Interview Result ❌"}
                </h2>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <p style="font-size:16px; color:#e5e7eb; margin:0 0 16px;">Hello <strong>${companyName}</strong>,</p>
                <p style="font-size:15px; line-height:1.7; color:#d1d5db;">
                  We’re writing to inform you that <strong>${candidateName}</strong>, who was evaluated for the <strong>${jobTitle}</strong> position, has ${
                    isPassed
                      ? "<strong style='color:#22c55e;'>successfully passed</strong>"
                      : "<strong style='color:#f87171;'>not cleared</strong>"
                  } the AI-based Mock Interview.
                </p>

                <table width="100%" style="margin-top:25px; border-collapse:collapse; background:#1f1f2e; border-radius:8px;">
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">Total Questions</td>
                    <td style="padding:12px 20px; text-align:right; color:#f9fafb;">${aiMockResult.totalQuestions}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">Correct Answers</td>
                    <td style="padding:12px 20px; text-align:right; color:#f9fafb;">${aiMockResult.correctAnswers}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 20px; color:#9ca3af;">Score Percentage</td>
                    <td style="padding:12px 20px; text-align:right; font-weight:bold; color:${
                      isPassed ? "#22c55e" : "#f87171"
                    };">${aiMockResult.scoreInPercentage}%</td>
                  </tr>
                </table>

                ${
                  isPassed
                    ? `
                    <p style="margin-top:30px; font-size:15px; color:#a7f3d0;">
                      Congratulations! The candidate has cleared the AI Mock Interview and is now eligible for the final technical interview with one of our expert interviewers.
                    </p>`
                    : `
                    <p style="margin-top:30px; font-size:15px; color:#fca5a5;">
                      The candidate did not meet the passing criteria (minimum 80%). They will not proceed to the next interview stage.
                    </p>`
                }

                <div style="margin-top:40px; text-align:center;">
                  <a href="#" style="text-decoration:none; background:#7c3aed; padding:12px 26px; color:white; border-radius:6px; font-size:15px; display:inline-block;">
                    View Candidate Details
                  </a>
                </div>

                <p style="margin-top:40px; font-size:14px; color:#9ca3af; text-align:center;">
                  Regards,<br/>
                  <strong style="color:#c4b5fd;">Outsourcing Interview Platform Team</strong>
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
