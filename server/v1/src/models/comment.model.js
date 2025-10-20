const mongoose = require('mongoose');
const { type } = require('../validators/login.validator');
const { ref } = require('joi');

const CommentSchema = new mongoose.Schema({
    writeupId: {
        type: String,
        required: true,
        ref : "Writeup"
    },
    authorId: {
        type: String,
        required: true,
        ref : "User"
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
    },
    likes : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    dislikes : {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;