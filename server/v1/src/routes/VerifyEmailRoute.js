const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const crypto = require('crypto');
const UserModel = require('../models/user.model');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', verifyToken, async (req, res) => {
  try {
    const { user } = req;

    // Check if email already verified
    if (user.emailVerified) {
      return res.status(200).json({ message: "Email is already verified" });
    }

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    await UserModel.findOneAndUpdate(
      { _id: user.id },
      { $set: { emailVerificationToken: token } }
    );

    const url = `${process.env.SERVER_URL}/verify-token-email?token=${token}`;

    // Email HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email - VulnSec</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
      }
      .logo {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #4a90e2;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background-color: #4a90e2;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">VulnSec</div>
      <div class="content">
        <p>Hello <b>${user.username}</b>,</p>
        <p>Thank you for signing up with <strong>VulnSec</strong>.</p>
        <p>To complete your registration and verify your email address, please click the button below:</p>
        <p>
          <a href="${url}" class="button">Verify My Email</a>
        </p>
        <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
        <p><a href="${url}">${url}</a></p>
        <p>If you did not create an account with VulnSec, please ignore this email.</p>
      </div>
      <div class="footer">
        &copy; 2025 VulnSec. All rights reserved.
      </div>
    </div>
  </body>
</html>`;

    // SendGrid message configuration
    const msg = {
      to: user.email,
      from: {
        email: process.env.MAIL_ADDRESS,
        name: 'VulnSec'
      },
      subject: 'Verify your account',
      html: htmlContent
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "Sent successfully!" });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
