const { ref } = require('joi');
const mongoose = require('mongoose')

const WriteupSchema = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    authorId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    thumbnail_url : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    content_text : {
        type: String
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
}, {timestamps : true})

const WriteupModel = mongoose.model("Writeup", WriteupSchema);

module.exports = WriteupModel;