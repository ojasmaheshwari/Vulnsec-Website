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

        const toSend = {
            data: {
                title: writeup.title,
                description: writeup.description,
                thumbnail: writeup.thumbnail_url,
                userId: userUuid,
                content: writeup.content
            }
        }

        return res.status(200).json(toSend)
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

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