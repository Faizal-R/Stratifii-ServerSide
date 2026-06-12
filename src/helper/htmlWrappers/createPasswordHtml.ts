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
