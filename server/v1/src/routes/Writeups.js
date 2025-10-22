const express = require('express')
const router = express.Router()
const validator = require('validator')
const db = require('../db')
const verifyToken = require('../middlewares/verifyToken')
const verifyEmail = require('../middlewares/verifyEmail')
const { getComments } = require('../controllers.js/comments.controller')
const { postComment } = require('../controllers.js/comments.controller')
const WriteupModel = require('../models/writeup.model')
const UserModel = require('../models/user.model')
const ReactionModel = require('../models/reaction.model')

router.get('/', async (req, res) => {
    try {
        const writeups = await WriteupModel.find().populate('authorId', 'username');

        return res.status(200).json({
            message: "Success",
            data: writeups
        })

    } catch (e) {
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.get('/me', verifyToken, verifyEmail, async (req, res) => {
    try {
        const userUuid = req.user.id;

        const writeups = await WriteupModel.find({ authorId: userUuid })

        return res.status(200).json({
            message: "success",
            data: writeups
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

        const writeUp = await WriteupModel.findById(uuid).populate("authorId", "username profilePictureLink")

        return res.status(200).json({
            message: "success",
            data: writeUp
        })
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

        await ReactionModel.updateOne(
            { userId: req.user.id, writeupId: uuid },
            { $set: { reaction: "like" } },
            { upsert: true }
        )

        const reactions = await ReactionModel.find({ writeupId: uuid })

        return res.status(200).json({
            message: "success",
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

        await ReactionModel.updateOne(
            { userId: req.user.id, writeupId: uuid },
            { $set: { reaction: "dislike" } },
            { upsert: true }
        )

        const reactions = await ReactionModel.find({ writeupId: uuid })

        return res.status(200).json({
            message: "success",
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

        const reactions = await ReactionModel.find({ writeupId: uuid });
        const likes = reactions.reduce((a, r) => (r.reaction === "like") ? a + 1 : a, 0)
        const dislikes = reactions.reduce((a, r) => (r.reaction === "dislike") ? a + 1 : a, 0)

        return res.status(200).json({
            message: "success",
            data: {
                likes,
                dislikes
            }
        })
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

        // Check user permissions
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!(user.roles.includes("VULNSEC_MEMBER") || user.roles.includes("ADMIN"))) {
            return res.status(403).json({ error: "You do not have sufficient permissions to post a writeup" });
        }

        const writeup = await WriteupModel.create({
            title,
            description,
            authorId: req.user.id,
            thumbnail_url: thumbnail,
            content
        })

        return res.status(201).json({ message: "Success", data: writeup });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" })
    }
})

router.post('/:uuid/edit', verifyToken, verifyEmail, async (req, res) => {
    try {
        // Check if the user owns the writeup
        const uuid = req.params.uuid;
        const writeup = await WriteupModel.findById(uuid);

        const isOwner = (writeup.authorId === req.user.id);
        let isAdmin = false;
        if (req.user) {
            if (req.user.roles.includes('ADMIN')) {
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

        await WriteupModel.updateOne(
            { _id: uuid },
            {
                $set: {
                    title,
                    description,
                    authorId: req.user.id,
                    thumbnail_url: thumbnail,
                    content
                }
            }
        )

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
        const writeup = await WriteupModel.findById(uuid);
        const isOwner = (writeup.authorId === req.user.id);
        const isAdmin = req.user.roles.includes("ADMIN");

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: "You do not have sufficient permissions to remove this writeup" });
        }

        await WriteupModel.deleteOne({ _id : uuid });

        return res.status(200).json({ message: "Deleted successfully" })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/:uuid/comments/', getComments);
router.post('/:uuid/comments/', verifyToken, verifyEmail, postComment);

module.exports = router