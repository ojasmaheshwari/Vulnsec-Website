const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    writeupId: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    replyingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;