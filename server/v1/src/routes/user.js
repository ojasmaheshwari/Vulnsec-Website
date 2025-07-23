const express = require('express')
const router = express.Router()
const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, (req, res) => {
    const toSend = {
        username: req.user.username,
        email: req.user.email
    }

    return res.status(200).json(toSend);
})

module.exports = router;