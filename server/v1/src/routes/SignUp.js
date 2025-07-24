const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken')

const saltRounds = 10;

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Username validation: max 10 chars, only letters/numbers/underscore, no spaces
        const usernameRegex = /^[A-Za-z0-9_]{1,10}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ error: "Invalid username. Max 10 characters, only letters, numbers, and underscores allowed. No spaces." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email address." });
        }

        if (typeof password !== 'string' || password.length < 8 || password.length > 20) {
            return res.status(400).json({ error: "Password must be between 8 and 20 characters." });
        }

        const [userResult] = await db.execute('SELECT id FROM users where username = ?', [username]);
        if (userResult.length > 0) {
            return res.status(400).json({
                error:
                    "Duplicate username! Please choose another"
            })
        }

        const [emailResult] = await db.execute('SELECT id FROM users where email = ?', [email]);
        if (emailResult.length > 0) {
            return res.status(400).json({
                error:
                    "Duplicate email! Please choose another"
            })
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const [result] = await db.execute('INSERT INTO users (username, email, passwordHash, fullName, about, profilePictureLink) VALUES (?, ?, ?, ?, "", "")', [username, email, passwordHash, username]);
        // Only add ROLE_USER by default
        await db.execute('INSERT INTO user_role (user_id, role_id) VALUES (?, 1)', [result.insertId]);

        return res.status(200).json({ message: "User created successfully!" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})


module.exports = router