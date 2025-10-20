const express = require('express');
const router = express.Router();
const CommentReactionModel = require('../models/commentReactions.model');
const verifyToken = require('../middlewares/verifyToken');
const verifyEmail = require('../middlewares/verifyEmail');

router.post('/:commentId/like', verifyToken, verifyEmail, async (req, res) => {
    const { commentId } = req.params;
    const userUuid = req.user.id;

    try {
        const existingReaction = await CommentReactionModel.findOne({ commentId, userId: userUuid });

        if (existingReaction) {
            if (existingReaction.reactionType === 'like') {
                return res.status(400).json({ message: 'You have already liked this comment.' });
            } else {
                existingReaction.reactionType = 'like';
                await existingReaction.save();
                return res.status(200).json({ message: 'Changed reaction to like.' });
            }
        }

        const newReaction = new CommentReactionModel({
            commentId,
            userId: userUuid,
            reactionType: 'like',
        });

        await newReaction.save();
        res.status(201).json({ message: 'Comment liked successfully.' });
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.post('/:commentId/dislike', verifyToken, verifyEmail, async (req, res) => {
    const { commentId } = req.params;
    const userUuid = req.user.id;

    try {
        const existingReaction = await CommentReactionModel.findOne({ commentId, userId: userUuid });

        if (existingReaction) {
            if (existingReaction.reactionType === 'dislike') {
                return res.status(400).json({ message: 'You have already disliked this comment.' });
            } else {
                existingReaction.reactionType = 'dislike';
                await existingReaction.save();
                return res.status(200).json({ message: 'Changed reaction to dislike.' });
            }
        }

        const newReaction = new CommentReactionModel({
            commentId,
            userId: userUuid,
            reactionType: 'dislike',
        });

        await newReaction.save();
        res.status(201).json({ message: 'Comment disliked successfully.' });
    } catch (error) {
        console.error('Error disliking comment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;