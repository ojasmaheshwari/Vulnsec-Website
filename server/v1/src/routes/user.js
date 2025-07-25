const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const db = require('../db')
const validator = require('validator')

router.get('/', verifyToken, async (req, res) => {
    const [result] = await db.execute('SELECT * FROM users WHERE uuid = ?', [req.user.uuid])
    if (result.length === 0) {
        return res.status(401).json({ error: "User doesn't exist" })
    }

    const user = result[0];

    const toSend = {
        user: {
            username: user.username,
            email: user.email,
            uuid: user.uuid,
            emailVerified: user.emailVerified,
            fullName: user.fullName,
            about: user.about,
            profilePictureLink: user.profilePictureLink,
            roles: req.user.roles
        }
    }

    return res.status(200).json(toSend);
})

router.patch('/', verifyToken, async (req, res) => {
    try {
        let { fullName, about, profilePictureLink } = req.body;

        if (typeof fullName !== 'string' || typeof about !== 'string' || typeof profilePictureLink !== 'string') {
            return res.status(400).json({ error: 'Invalid input types. All fields must be strings.' });
        }

        fullName = validator.escape(fullName.trim());
        about = validator.escape(about.trim());

        profilePictureLink = profilePictureLink.trim();
        if (profilePictureLink !== "" && !validator.isURL(profilePictureLink, { protocols: ['http', 'https'], require_protocol: true })) {
            return res.status(400).json({ error: 'Invalid profile picture URL' });
        }

        const [result] = await db.execute('UPDATE users SET fullName = ?, about = ?, profilePictureLink = ? WHERE uuid = ?',
            [fullName, about, profilePictureLink, req.user.uuid]
        )

        const [updatedResult] = await db.execute('SELECT * FROM users WHERE uuid = ?', [req.user.uuid]);
        if (updatedResult.length === 0) {
            return res.status(404).json({ error: "User not found after update" });
        }

        const user = updatedResult[0];

        const toSend = {
            user: {
                username: user.username,
                email: user.email,
                uuid: user.uuid,
                emailVerified: user.emailVerified,
                fullName: user.fullName,
                about: user.about,
                profilePictureLink: user.profilePictureLink
            },
            message: "Updated successfully"
        }

        return res.status(200).json(toSend)
    } catch (e) {
        console.error(e);
        return res.status(500).json({ "error": "Internal server error" });
    }
})

module.exports = router;