const CommentModel = require('../models/comment.model.js');
const db = require('../db.js');
const CommentReactionModel = require('../models/commentReactions.model.js');
const UserModel = require('../models/user.model.js')

console.log(CommentModel);

async function getComments(req, res) {
    const writeupUuid = req.params.uuid;

    if (!writeupUuid) {
        return res.status(400).json({ error: 'Writeup UUID is required' });
    }
    if (typeof writeupUuid !== 'string' || writeupUuid.trim() === '') {
        return res.status(400).json({ error: 'Invalid Writeup UUID' });
    }

    try {
        const comments = await CommentModel.find({writeupId: writeupUuid}).populate("authorId", "username profilePictureLink")

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function postComment(req, res) {
    const writeupUuid = req.params.uuid;

    if (!writeupUuid) {
        return res.status(400).json({ error: 'Writeup UUID is required' });
    }
    if (typeof writeupUuid !== 'string' || writeupUuid.trim() === '') {
        return res.status(400).json({ error: 'Invalid Writeup UUID' });
    }

    const userUuid = req.user.id;

    const { content } = req.body;

    const replyingTo = req.body.replyingTo || null;

    try {
        const newComment = new CommentModel({
            writeupId: writeupUuid,
            authorId: userUuid,
            content,
            replyingTo
        });

        await newComment.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = { getComments, postComment };