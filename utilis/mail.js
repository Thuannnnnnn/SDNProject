import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, 'template/email/index.html');

const originalHtmlContent = fs.readFileSync(templatePath, 'utf-8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function SendEmail(email, subject, title, content) {
  try {
    let htmlContent = originalHtmlContent;
    const finalContent = htmlContent.replace('{{title}}', title).replace('{{content}}', content);
    await transporter.sendMail({
      from: `SDNGR5 <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: subject,
      html: finalContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default SendEmail;
