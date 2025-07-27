const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [result] = await db.execute('SELECT * from users where username = ?', [username]);
        if (result.length === 0) {
            console.log(result);
            return res.status(400).json({ error: "Incorrect username or password" });
        }

        // Check if password is correct
        const user = result[0];
        const passwordHash = user.passwordHash;
        const isMatch = await bcrypt.compare(password, passwordHash);

        if (!isMatch) {
            console.log();
            return res.status(400).json({ error: "Incorrect username or password" });
        }

        // Get roles of user
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

        // User is valid, serve JWT
        const jwtPayload = {
            uuid: user.uuid,
            email: user.email,
            username,
            roles,
            emailVerified: user.emailVerified
        }
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: 3600000 })

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
            message: "Logged in",
        }

        res.status(200).cookie('jwt', token, { sameSite: "None", secure:true, httpOnly: true, maxAge: 3600000 }).json(toSend)

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
