const CommentModel = require('../models/comment.model.js');
const db = require('../db.js');
const CommentReactionModel = require('../models/commentReactions.model.js');

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
        const toSend = []
        const comments = await CommentModel.find({writeupId: writeupUuid});

        // Get user information for each comment from MySQL
        
        for (let i = 0; i < comments.length; i++) {
            const [user] = await db.execute('SELECT username, profilePictureLink FROM users WHERE uuid = ?', [comments[i].authorId]);
            const newObj = comments[i].toObject();

            // Get reactions for the comment
            const reactions = await CommentReactionModel.find({ commentId: comments[i]._id });
            const likes = reactions.filter(r => r.reactionType === 'like').length;
            const dislikes = reactions.filter(r => r.reactionType === 'dislike').length;
            newObj['likes'] = likes;
            newObj['dislikes'] = dislikes;

            newObj['author'] = user[0] || { username: 'Unknown', profilePictureLink: '' };
            toSend.push(newObj);
        }
        res.status(200).json(toSend);
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

    const userUuid = req.user.uuid;

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