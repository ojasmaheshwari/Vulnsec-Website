const express = require('express')
const router = express.Router()
const db = require('../../db')

router.get('/', async (req, res) => {
    try {
        const { writeupUuid, ownerUuid } = req.query;

        if (!writeupUuid) {
            return res.status(404).json({ error: "writeupUuid not provided" })
        }
        if (!ownerUuid) {
            return res.status(404).json({ error: "ownerUuid not provided" })
        }

        // Fetch author_id from writeups
        const [results] = await db.execute('SELECT U.uuid FROM writeups W JOIN users U on U.id = W.author_id AND W.uuid = ?', [writeupUuid]);
        if (results.length === 0) {
            return res.status(404).json({ error: "No writeup found" });
        }

        const isOwner = (results[0].uuid === ownerUuid);

        if (isOwner) {
            return res.status(200).json({ message: "User is owner" });
        } else {
            return res.status(403).json({ error: "User is not the owner" });
        }
    } catch (err) {
        return res.status(500).json({ "error": "Internal server error" });
    }

})

module.exports = router