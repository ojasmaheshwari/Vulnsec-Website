const mongoose = require('mongoose')

const ReactionSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    writeupId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Writeup"
    },
    reaction : {
        type: String,
        enum : ["like", "dislike"],
        required : true
    }
})

ReactionSchema.index({ userId : 1, writeupId : 1}, { unique: true })

const ReactionModel = mongoose.model("Reaction", ReactionSchema);

module.exports = ReactionModel