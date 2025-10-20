const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const UserModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const validate = require('../middlewares/validate')
const loginSchema = require('../validators/login.validator')

router.post('/', validate(loginSchema), async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserModel.findOne({username});
        if (!user) {
            return res.status(400).json({ error : "Incorrect username or password"});
        }

        const passwordHash = user.passwordHash;

        const isMatch = await bcrypt.compare(password, passwordHash);

        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect username or password" });
        }

        // User is valid, serve JWT
        const jwtPayload = {
            id: user._id,
            email: user.email,
            username,
            roles : user.roles,
            emailVerified: user.emailVerified
        }
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: 3600000 })

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
            },
            message: "Logged in",
        }

        res.status(200).cookie('jwt', token, { sameSite: "None", secure: true, httpOnly: true, maxAge: 3600000 }).json(toSend)

    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
