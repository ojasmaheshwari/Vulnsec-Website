const express = require('express');
const router = express.Router();
const validator = require('validator');
const crypto = require('crypto');
const UserModel = require('../models/user.model');
const db = require('../db');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (typeof email !== "string" || !validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate token and expiry
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await UserModel.findOneAndUpdate(
            { _id: user._id },
            { $set: { passwordRecoveryToken: token, recoveryTokenExpireTime: expires } }
        );

        const resetLink = `${process.env.FRONTEND_URL}/password-reset?token=${token}`;

        // HTML email template
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Recovery</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            color: #333;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            background-color: #ffffff;
            padding: 30px;
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        h2 {
            color: #111827;
        }
        p {
            margin-bottom: 20px;
        }
        a.button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.username},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <p>
            <a href="${resetLink}" class="button">Reset Your Password</a>
        </p>
        <p>If you did not request a password reset, please ignore this email. This link will expire shortly for your security.</p>
        <div class="footer">
            &copy; 2025 Your Company. All rights reserved.
        </div>
    </div>
</body>
</html>`;

        // SendGrid email data
        const msg = {
            to: email,
            from: {
                email: process.env.MAIL_ADDRESS,
                name: 'VulnSec'
            },
            subject: 'Reset Password',
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
