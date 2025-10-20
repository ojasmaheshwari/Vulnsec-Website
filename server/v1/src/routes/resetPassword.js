const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const UserModel = require('../models/user.model')


router.post('/', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: "Token must be string" })
        }

        if (typeof newPassword !== 'string' || newPassword.length < 8 || newPassword.length > 20) {
            return res.status(400).json({ error: "Password must be between 8 and 20 characters." });
        }

        const user = await UserModel.findOne(
            { passwordRecoveryToken: token }
        )
        if (!user) {
            return res.status(404).json({ error : "Invalid token"});
        }
        if (Date.now() > user.recoveryTokenExpireTime) {
            return res.status(400).json({ error : "Token has been expired"});
        }

        user.passwordRecoveryToken = "";

        const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT_ROUNDS));
        user.passwordHash = hashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password reset successfully" })

    } catch (e) {
        console.error(e)
        return res.status(500).json({ error: "Internal server error" })
    }
})

module.exports = router;