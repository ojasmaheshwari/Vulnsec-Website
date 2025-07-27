const express = require('express')
const router = express.Router()
const validator = require('validator')
const db = require('../db')
const verifyToken = require('../middlewares/verifyToken')
const verifyEmail = require('../middlewares/verifyEmail')

router.get('/', async (req, res) => {
    try {
        const [results] = await db.execute(`
            SELECT
                W.uuid as writeUpUuid,
                W.title,
                W.description,
                W.thumbnail_url,
                W.created_at as writeUpCreationDate,
                W.updated_at,
                W.content,
                U.uuid as authorUuid,
                U.username as authorUsername
            FROM writeups W
            JOIN users U
            on W.author_id = U.id`)

        res.status(200).json({
            data: results,
            message: "Success"
        })

    } catch (e) {
        return res.status(500).json({ error: "Inernal server error" })
    }
})

router.get('/:uuid', async (req, res) => {
    try {
        const uuid = req.params.uuid;

        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            res.status(404).send({ error: "Writeup not found" })
        }
        const writeup = results[0]

        const [userResults] = await db.execute('SELECT * FROM users WHERE id = ?', [writeup.author_id])
        const userUuid = userResults[0].uuid;
        const username = userResults[0].username;
        const userProfilePic = userResults[0].profilePictureLink;

        const toSend = {
            data: {
                title: writeup.title,
                description: writeup.description,
                thumbnail: writeup.thumbnail_url,
                userId: userUuid,
                content: writeup.content,
                authorUsername: username,
                writeUpUuid: writeup.uuid,
                updated_at: writeup.updated_at,
                created_at: writeup.created_at,
                authorProfilePic: userProfilePic,
                // likes: writeup.likes,
                // dislikes: writeup.dislikes
            }
        }

        return res.status(200).json(toSend)
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

/*
router.post('/:uuid/like', async (req, res) => {
    try {
        const uuid = req.params.uuid;

        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            res.status(404).send({ error: "Writeup not found" })
        }

        await db.execute('UPDATE writeups SET likes = likes + 1 WHERE uuid = ?', [uuid])

        const toSend = {
            message: "Liked successfully",
        }

        return res.status(200).json(toSend)
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/:uuid/dislike', async (req, res) => {
    try {
        const uuid = req.params.uuid;

        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            res.status(404).send({ error: "Writeup not found" })
        }

        await db.execute('UPDATE writeups SET dislikes = dislikes + 1 WHERE uuid = ?', [uuid])

        const toSend = {
            message: "Disliked successfully",
        }

        return res.status(200).json(toSend)
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})
*/

router.post('/', verifyToken, verifyEmail, async (req, res) => {
    try {
        let { content, title, description, thumbnail } = req.body;

        if (typeof title !== 'string' || typeof description !== 'string' || typeof thumbnail !== 'string' || typeof content !== 'string') {
            return res.status(400).json({ error: "Bad fields. Title, description, content and thumbnail must be of type string" })
        }

        if (!validator.isURL(thumbnail, { protocols: ['http', 'https'], require_protocol: true })) {
            return res.status(400).json({ error: "Thumbnail is not proper URL" })
        }

        title = validator.escape(title.trim())
        description = validator.escape(description.trim())

        const [results] = await db.execute('SELECT * FROM users WHERE uuid = ?', [req.user.uuid])
        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" })
        }

        const userId = results[0].id;

        // Get roles of user
        const [rolesResult] = await db.execute(`SELECT * from users U
                                                JOIN user_role UR
                                                ON U.id = UR.user_id
                                                JOIN roles R
                                                ON UR.role_id = R.id
                                                WHERE U.id = ?`, [userId]);
        const roles = [];
        for (const role of rolesResult) {
            roles.push(role.name);
        }

        if (!(roles.includes("ROLE_ADMIN") || roles.includes("ROLE_VULNSEC_MEMBER"))) {
            return res.status(403).json({ error: "You do not have permission to post writeups" })
        }

        const [insertResult] = await db.execute('INSERT INTO writeups (title, description, author_id, thumbnail_url, content) VALUES (?, ?, ?, ?, ?)',
            [title, description, userId, thumbnail, JSON.stringify(content)]
        )
        const writeupId = insertResult.insertId;

        const [writeUpResults] = await db.execute('SELECT * FROM writeups WHERE id = ?', [writeupId])
        const writeup = writeUpResults[0]

        const toSend = {
            data: {
                uuid: writeup.uuid,
                title: writeup.title,
                description: writeup.description,
                thumbnail: writeup.thumbnail_url,
            },
            message: "Posted successfully"
        }

        return res.status(200).json(toSend)

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }

})

module.exports = router