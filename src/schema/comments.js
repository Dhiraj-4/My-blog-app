import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogs',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
        default: null  // null = top-level comment, otherwise it's a reply
    },
    text: {
        type: String,
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
    }
}, { timestamps: true });

export const Comments = new mongoose.model('Comments', commentSchema);