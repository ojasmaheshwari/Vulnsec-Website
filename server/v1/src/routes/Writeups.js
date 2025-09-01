const express = require('express')
const router = express.Router()
const validator = require('validator')
const db = require('../db')
const verifyToken = require('../middlewares/verifyToken')
const verifyEmail = require('../middlewares/verifyEmail')
const { getComments } = require('../controllers.js/comments.controller')
const { postComment } = require('../controllers.js/comments.controller')

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
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/me', verifyToken, verifyEmail, async (req, res) => {
    try {
        const userUuid = req.user.uuid;

        const [results] = await db.execute(`SELECT
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
            ON W.author_id = U.id
            WHERE U.uuid = ?`, [userUuid]);

        res.status(200).json({
            data: results,
            message: "Success"
        })

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
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


router.post('/:uuid/like', verifyToken, verifyEmail, async (req, res) => {
    try {
        const uuid = req.params.uuid;

        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            res.status(404).send({ error: "Writeup not found" })
        }
        const writeupId = results[0].id;

        const userUuid = req.user.uuid;
        const [userResults] = await db.execute('SELECT * FROM users WHERE uuid = ?', [userUuid])
        if (userResults.length === 0) {
            return res.status(404).json({ error: "User not found" })
        }

        const userId = userResults[0].id;

        // Check if entry already exists in reactions table
        const [reactionResults] = await db.execute('SELECT * FROM writeup_reactions WHERE writeup_id = ? AND user_id = ?', [writeupId, userId])
        if (reactionResults.length > 0) {
            // If it exists, update the reaction
            await db.execute('UPDATE writeup_reactions SET reaction = "like" WHERE writeup_id = ? AND user_id = ?', [writeupId, userId])
        } else {
            // If it does not exist, insert a new reaction
            await db.execute('INSERT INTO writeup_reactions (writeup_id, user_id, reaction) VALUES (?, ?, "like")', [writeupId, userId])
        }

        res.status(200).json({
            message: "Liked successfully",
        })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/:uuid/dislike', verifyToken, verifyEmail, async (req, res) => {
    try {
        const uuid = req.params.uuid;

        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            res.status(404).send({ error: "Writeup not found" })
        }
        const writeupId = results[0].id;

        const userUuid = req.user.uuid;

        const [userResults] = await db.execute('SELECT * FROM users WHERE uuid = ?', [userUuid])
        if (userResults.length === 0) {
            return res.status(404).json({ error: "User not found" })
        }

        const userId = userResults[0].id;

        // Check if entry already exists in reactions table
        const [reactionResults] = await db.execute('SELECT * FROM writeup_reactions WHERE writeup_id = ? AND user_id = ?', [writeupId, userId])
        if (reactionResults.length > 0) {
            // If it exists, update the reaction
            await db.execute('UPDATE writeup_reactions SET reaction = "dislike" WHERE writeup_id = ? AND user_id = ?', [writeupId, userId])
        } else {
            // If it does not exist, insert a new reaction
            await db.execute('INSERT INTO writeup_reactions (writeup_id, user_id, reaction) VALUES (?, ?, "dislike")', [writeupId, userId])
        }

        res.status(200).json({
            message: "Disliked successfully",
        })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/:uuid/reactions', async (req, res) => {
    try {
        const uuid = req.params.uuid;
        if (!uuid) {
            return res.status(400).json({ error: "uuid is required" })
        }

        const [results] = await db.execute('SELECT * FROM writeups WHERE uuid = ?', [uuid])
        if (results.length === 0) {
            return res.status(404).json({ error: "Writeup not found" })
        }

        const writeupId = results[0].id;

        const [reactions] = await db.execute('SELECT reaction, COUNT(*) as count FROM writeup_reactions WHERE writeup_id = ? GROUP BY reaction', [writeupId]);
        const reactionCounts = reactions.reduce((acc, curr) => {
            acc[curr.reaction] = curr.count;
            return acc;
        }, { LIKE: 0, DISLIKE: 0 });

        res.status(200).json({
            data: {
                likes: reactionCounts.LIKE,
                dislikes: reactionCounts.DISLIKE
            },
            message: "Reactions fetched successfully"
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
});

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
        const [rolesResult] = await db.execute(`SELECT role_id FROM user_role WHERE user_id = ?`, [userId]);
        const roles = [];
        for (const role of rolesResult) {
            roles.push(role.role_id);
        }

        if (!(roles.includes(3) || roles.includes(2))) {
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

router.post('/:uuid/edit', verifyToken, verifyEmail, async (req, res) => {
    try {
        // Check if the user owns the writeup
        const uuid = req.params.uuid;
        const [results] = await db.execute('SELECT U.uuid FROM writeups W JOIN users U on W.author_id = U.id AND W.uuid = ?', [uuid]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Writeup doesn't exist" });
        }

        const isOwner = (results[0].uuid === req.user.uuid);
        let isAdmin = false;
        if (req.user) {
            if (req.user.roles.includes('ROLE_ADMIN')) {
                isAdmin = true;
            }
        }

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "You are not allowed to edit this writeup" });
        }

        let { content, title, description, thumbnail } = req.body;

        if (typeof title !== 'string' || typeof description !== 'string' || typeof thumbnail !== 'string' || typeof content !== 'string') {
            return res.status(400).json({ error: "Bad fields. Title, description, content and thumbnail must be of type string" })
        }

        if (!validator.isURL(thumbnail, { protocols: ['http', 'https'], require_protocol: true })) {
            return res.status(400).json({ error: "Thumbnail is not proper URL" })
        }

        title = validator.escape(title.trim())
        description = validator.escape(description.trim())

        const [result] = await db.execute("UPDATE writeups SET title = ?, description = ?, thumbnail_url = ?, updated_at = NOW(), content = ? WHERE uuid = ?", [
            title, description, thumbnail, JSON.stringify(content), uuid
        ]);

        return res.status(200).json({ message: "Updated successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})

router.delete('/:uuid', verifyToken, verifyEmail, async (req, res) => {
    try {
        // Check if the user owns the writeup
        const uuid = req.params.uuid;
        const [results] = await db.execute('SELECT U.uuid FROM writeups W JOIN users U on W.author_id = U.id AND W.uuid = ?', [uuid]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Writeup doesn't exist" });
        }

        const isOwner = (results[0].uuid === req.user.uuid);
        let isAdmin = false;
        if (req.user) {
            if (req.user.roles.includes('ROLE_ADMIN')) {
                isAdmin = true;
            }
        }
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "You are not allowed to delete this writeup" });
        }

        await db.execute('DELETE FROM writeups WHERE uuid = ?', [uuid]);

        return res.status(200).json({ message: "Deleted successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/:uuid/comments/', getComments);
router.post('/:uuid/comments/', verifyToken, verifyEmail, postComment);

module.exports = router