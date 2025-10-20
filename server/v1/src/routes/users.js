const express = require('express');
const router = express.Router();
const db = require('../db')
const UserModel = require('../models/user.model')

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const user = await UserModel.findOne({username})
        const toSend = {
            user: {
                username: user.username,
                uuid: user._id,
                fullName: user.fullName,
                about: user.about,
                profilePictureLink: user.profilePictureLink,
                roles: user.roles
            }
        };

        return res.status(200).json(toSend);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;