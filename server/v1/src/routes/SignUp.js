const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {defaultProfilePictureLink} = require('../config/defaultFields')

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

        // Check if username already exists
        let temp = await UserModel.find({ username });
        if (temp.length > 0) {
            return res.status(409).json({ error : "Username already exists"});
        }

        // Check if email already exists
        temp = await UserModel.find({ email})
        if (temp.length > 0) {
            return res.status(409).json({ error : "Email already exists"});
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await UserModel.create({
            username,
            email,
            passwordHash,
            fullName: username,
            about: "Hey, I am on VulnSec Platform",
            profilePictureLink : defaultProfilePictureLink
        })

        return res.status(200).json({ message: "User created successfully!" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})


module.exports = router