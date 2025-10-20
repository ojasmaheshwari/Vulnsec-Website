const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyEmail = require('../middlewares/verifyEmail');
const CommentModel = require('../models/comment.model');
const { message } = require('../validators/login.validator');

router.post('/:commentId/like', verifyToken, verifyEmail, async (req, res) => {
    const { commentId } = req.params;
    const userUuid = req.user.id;

    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error : "Comment does not exist" });
        }
        if (comment.likes.includes(userUuid)) {
            // User had already liked the comment before
            return res.status(200).json({ message: "Already liked" })
        }

        comment.likes.push(userUuid);

        await comment.save();

        res.status(200).json({ message : "Comment liked successfully!" })
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/:commentId/dislike', verifyToken, verifyEmail, async (req, res) => {
    const { commentId } = req.params;
    const userUuid = req.user.id;

    try {
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error : "Comment does not exist" });
        }
        if (comment.dislikes.includes(userUuid)) {
            // User had already liked the comment before
            return res.status(200).json({ message: "Already disliked" })
        }

        comment.dislikes.push(userUuid);

        await comment.save();

        res.status(200).json({ message : "Comment disliked successfully!" })
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;