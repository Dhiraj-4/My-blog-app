import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true},
    content: { type: String, required: true },
    coverImage: { type: String, default: null},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    tags : {
        type: [String],
        required: true,
        index: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        }
    ],
    likesCount: {
        type: Number,
        default: 0
    },
    dislikesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    authorName: { type: String, required: true, index: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Blog = new mongoose.model('Blogs', blogSchema);