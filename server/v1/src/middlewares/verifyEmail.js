const verifyEmail = (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ error: "Unauthorized. User must be authorized before verifying email" });
    }

    if (user.emailVerifed === true) {
        next();
    } else {
        return res.status(401).json({ error: "Resource cannot be accessed by unverified users. Please verify email first." })
    }
}

module.exports = verifyEmail;