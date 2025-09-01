const mongoose = require('mongoose')

const commentReactionsSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    reactionType: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  { timestamps: true }
)

commentReactionsSchema.index({ commentId: 1, userId: 1 }, { unique: true })

const CommentReaction = mongoose.model(
  'CommentReaction',
  commentReactionsSchema
)

module.exports = CommentReaction