const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')
const UserModel = require('../models/user.model')
const validator = require('validator')
const { error } = require('../validators/login.validator')

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const toSend = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                emailVerified: user.emailVerified,
                fullName: user.fullName,
                about: user.about,
                profilePictureLink: user.profilePictureLink,
                roles: user.roles
            }
        }

        return res.status(200).json(toSend);
    } catch (e) {
        res.status(500).json({ error: "Internal server error" })
    }
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

        const user = await UserModel.findOneAndUpdate(
            { _id: req.user.id },
            {
                $set: {
                    fullName,
                    about,
                    profilePictureLink
                }
            },
            { new: true }
        )
        const toSend = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
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