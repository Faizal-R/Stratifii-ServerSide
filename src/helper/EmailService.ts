import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:"smtp.gmail.com" , // e.g., "smtp.gmail.com"
  port: 587, // Use 465 for SSL
  secure:false, // true for 465, false for others
  auth: {
    user:'stratifiii@gmail.com',
    pass: 'olkk cpfw bdgd uxsj',
  },
});

export const sendEmail = async (to: string,data:string,html='') => {
  


  try {
    const mailOptions = {
      from: process.env.SMTP_FROM, 
      to,
      subject:"Email Verification Code Inside – Don’t Share It!",
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
