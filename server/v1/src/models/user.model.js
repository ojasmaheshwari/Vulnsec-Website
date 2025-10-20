const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true
    },
    passwordHash : {
        type: String,
        required: true
    },
    emailVerified : {
        type: Boolean,
        required: true,
        default: false
    },
    emailVerificationToken : {
        type: String,
    },
    fullName : {
        type: String
    },
    about : {
        type: String
    },
    profilePictureLink : {
        type: String
    },
    passwordRecoveryToken : {
        type: String
    },
    recoveryTokenExpireTime : {
        type: Date
    },
    roles : {
        type: ["USER", "VULNSEC_MEMBER", "ADMIN"],
        required: true,
        default: "USER"
    }
}, { timestamps: true })

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel;