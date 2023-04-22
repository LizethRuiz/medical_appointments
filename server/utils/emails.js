import nodemailer from 'nodemailer';
import path from 'path';
import { MAIL } from '../../config/config';

const fs = require('fs').promises;

const getTemplateCredentials = async (email, password, url) => {
  try {
    const filename = path.join(__dirname, '/templates/credentials.html');

    let emailBody = await fs.readFile(filename, 'utf-8');

    emailBody = emailBody.replace('{%email%}', email);
    emailBody = emailBody.replace('{%password%}', password);
    emailBody = emailBody.replace('{%url%}', url);

    return emailBody;
  } catch (error) {
    throw new Error(error);
  }
};

const getTemplateResetPassword = async (url) => {
  try {
    const filename = path.join(__dirname, '/templates/resetPassword.html');

    let emailBody = await fs.readFile(filename, 'utf-8');

    emailBody = emailBody.replace('{%url%}', url);

    return emailBody;
  } catch (error) {
    throw new Error(error);
  }
};

const sendMail = async (emailTo, subject, body, attachments = []) => {
  try {
    const transport = await nodemailer.createTransport({
      host: MAIL.EMAIL_HOST,
      port: MAIL.EMAIL_PORT,
      secure: MAIL.EMAIL_SECURE,
      auth: {
        user: MAIL.EMAIL,
        pass: MAIL.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: MAIL.EMAIL,
      to: emailTo,
      subject: subject,
      html: body,
      attachments: attachments,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

export { getTemplateCredentials, sendMail, getTemplateResetPassword };
