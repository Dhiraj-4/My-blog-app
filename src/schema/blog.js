import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: null},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    tags : {
        type: [String],
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: []
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: []
    },
    authorName: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Blog = new mongoose.model('Blogs', blogSchema);