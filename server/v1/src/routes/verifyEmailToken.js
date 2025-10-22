const express = require('express')
const router = express.Router()
const UserModel = require('../models/user.model')

router.get('/', async (req, res) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(400).json({ error: 'Token is missing' });
        }

        const user = await UserModel.findOneAndUpdate(
            { emailVerificationToken: token },
            { $set: { emailVerified: true, emailVerificationToken: null } },
            {new : true}
        )

        if (!user) {
            return res.status(400).send("<html><body><h1>Invalid or Expired token, please try again.</h1></body></html>");
        }

        res.status(200).send('<html><body><h1>Email Verified! Please <a href="https://vulnsec.netlify.app/login">login</a> again!</h1></body></html>');
    } catch (e) {
        console.error(e);
        return res.status(500).send("<html><body><h1>Missing/Invalid/Expired token, please try again.</h1></body></html>")
    }
})

module.exports = router