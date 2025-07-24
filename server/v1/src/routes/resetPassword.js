const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')


router.post('/', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (typeof token !== 'string') {
            return res.status(400).json({ error: "Token must be string" })
        }

        if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 20) {
            return res.status(400).json({ error: "Password must be between 8 and 20 characters." });
        }

        const [results] = await db.execute('SELECT uuid FROM users WHERE passwordRecoveryToken = ? AND recoveryTokenExpireTime > NOW()',
            [token]
        )

        if (results.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
        await db.execute("UPDATE users SET passwordHash = ?, passwordRecoveryToken = NULL, recoveryTokenExpireTime = NULL WHERE passwordRecoveryToken = ?", [hashedPassword, token]);

        return res.status(200).json({ message: "Password reset successfully" })

    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router;