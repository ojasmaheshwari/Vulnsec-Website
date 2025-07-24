const express = require('express')
const router = express.Router()
const validator = require('validator')
const nodemailer = require('nodemailer')
const db = require('../db')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD
    }
});

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || !validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email" })
        }

        const [results] = await db.execute('SELECT username FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(404).json({ error: "No account with email found" })
        }
        const username = results[0].username;

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await db.execute("UPDATE users SET passwordRecoveryToken = ?, recoveryTokenExpireTime = ? WHERE email = ?", [token, expires, email]);

        const resetLink = `${process.env.FRONTEND_URL}/password-reset?token=${token}`;

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
        <p>Hello ${username},</p>
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
</html>
`
        const mailOptions = {
            from: `"VulnSec" <${process.env.MAIL_ADDRESS}>`,
            to: email,
            subject: 'Reset Password',
            html: htmlContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);

                return res.status(500).json({ "error": "Internal server error" });
            }

            return res.status(200).json({ "message": "Sent successfully!" })
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;