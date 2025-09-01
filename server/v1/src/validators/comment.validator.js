const joi = require('joi');

const commentSchema = joi.object({
    content: joi.string().min(1).max(1000).required(),
    replyingTo: joi.string().optional().allow(null, '')
});

module.exports = commentSchema;