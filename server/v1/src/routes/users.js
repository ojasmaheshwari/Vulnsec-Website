const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const [result] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const [rolesResult] = await db.execute(`SELECT * from users U
                                                JOIN user_role UR
                                                ON U.id = UR.user_id
                                                JOIN roles R
                                                ON UR.role_id = R.id
                                                WHERE U.username = ?`, [username]);
        const roles = [];
        for (const role of rolesResult) {
            roles.push(role.name);
        }

        const user = result[0];
        const toSend = {
            user: {
                username: user.username,
                uuid: user.uuid,
                fullName: user.fullName,
                about: user.about,
                profilePictureLink: user.profilePictureLink,
                roles
            }
        };

        return res.status(200).json(toSend);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;