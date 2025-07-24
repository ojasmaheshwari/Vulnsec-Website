const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }

    const [result] = await db.execute('SELECT * from users WHERE emailVerificationToken = ?', [token])

    if (result.length === 0) {
        return res.status(400).send('Invalid or old token');
    }

    const user = result[0];

    await db.execute('UPDATE users SET emailVerified = true, emailVerificationToken = NULL WHERE uuid = ?', [user.uuid]);

    res.status(200).send('<html><body><h1>Email Verified!</h1></body></html>');
})

module.exports = router