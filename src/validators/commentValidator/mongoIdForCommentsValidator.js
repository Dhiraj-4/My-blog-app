import mongoose from "mongoose";

export const mongoIdForCommentsValidator = (req, res, next) => {
    const { blogId, commentId } = req.params;

    if (!blogId || !mongoose.isValidObjectId(blogId)) {
        return res.status(400).json({
            message: 'Missing or invalid blogId',
            success: false
        });
    }

    if (!commentId || !mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({
            message: 'Missing or invalid commentId',
            success: false
        });
    }

    next();
};
