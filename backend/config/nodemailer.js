const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // Use an SMTP service or a service like SendGrid
  // For example, using Gmail (not recommended for production)
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

module.exports = transporter;
