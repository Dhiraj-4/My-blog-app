import mongoose from 'mongoose';

const usersSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    userName: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: []
    },
    favouriteList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Blogs',
        default: []
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: null
    },
    expiresAt: {
        type: String,
        default: null
    }
}, { timestamps: true });


export const Users = mongoose.model('Users', usersSchema);