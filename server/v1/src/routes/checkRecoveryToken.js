const express = require('express')
const router = express.Router()
const db = require('../db');
const UserModel = require('../models/user.model');

router.post('/', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: "Token must be string" })
        }

        const user = await UserModel.findOne({ passwordRecoveryToken: token });

        if (!user) {
            return res.status(404).json({ error: "Invalid token" });
        }
        if (Date.now() > user.recoveryTokenExpireTime) {
            return res.status(400).json({ error: "Token has expired" });
        }

        return res.status(200).json({ message: "Valid token" })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error : "Internal server error"})
    }

})

module.exports = router