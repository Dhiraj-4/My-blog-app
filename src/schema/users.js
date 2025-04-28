import mongoose from 'mongoose';

const usersSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: null
    }
}, { timestamps: true });


export const Users = mongoose.model('users', usersSchema);