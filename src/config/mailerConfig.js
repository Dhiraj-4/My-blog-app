import nodemailer from 'nodemailer';
import { APP_PASSWORD, MY_MAIL } from './serverConfig.js';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MY_MAIL,
      pass: APP_PASSWORD
    }
  });