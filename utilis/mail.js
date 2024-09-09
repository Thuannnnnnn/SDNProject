import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, 'template/email/index.html');
let htmlContent = fs.readFileSync(templatePath, 'utf-8');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
async function SendEmail(email, subject, title, content) {
  try {
    const data = {
      title: title,
      content: content,
    };
    htmlContent = htmlContent.replace('{{title}}', data.title);
    htmlContent = htmlContent.replace('{{content}}', data.content);
    await transporter.sendMail({
      from: `SDNGR5" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default SendEmail;
