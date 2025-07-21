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

        // User is valid, serve JWT
        const jwtPayload = {
            email: user.email,
            username,
            roles: ['ROLE_USER']
        }
        const token = jwt.sign(jwtPayload, "jkdds7e398zdjhkdisu32", { expiresIn: 3600000 })

        res.status(200).cookie('jwt', token, { sameSite: "strict", secure: false, httpOnly: true, maxAge: 3600000 }).json({ "message": "Logged in" })

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;