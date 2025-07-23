const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Access token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
}

module.exports = verifyToken;