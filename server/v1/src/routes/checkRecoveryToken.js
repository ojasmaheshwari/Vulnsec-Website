const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/', async (req, res) => {
    const { token } = req.body;

    if (typeof token !== 'string') {
        return res.status(400).json({ error: "Token must be string" })
    }

    const [results] = await db.execute('SELECT uuid FROM users WHERE passwordRecoveryToken = ? AND recoveryTokenExpireTime > NOW()',
        [token]
    )

    if (results.length === 0) {
        return res.status(400).json({ error: "Invalid or expired token" })
    }

    return res.status(200).json({ message: "Valid token" })
})

module.exports = router