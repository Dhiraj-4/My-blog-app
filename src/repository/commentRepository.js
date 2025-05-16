import { Blog } from "../schema/blog.js";
import { Comments } from "../schema/comments.js"

export const createComment = async({ userId, blogId, text, }) => {
    try {
        const comment = await Comments.create({ userId, blogId, text });
        const blog = await Blog.findById(blogId).select('commentsCount');
        blog.commentsCount++;
        await blog.save();
        return comment;
    } catch (error) {
        console.log('This error is from createComments: ', error);
        throw error;
    }
}

export const getComments = async({ blogId }) => {
    try {
        const comments = await Comments.find({ blogId })
        .populate('userId', 'username profileImage');
        
        return comments;
    } catch (error) {
        console.log('This error is from getComments: ', error);
        throw error;
    }
}

export const updateComment = async({ userId, text, commentId }) => {
    try {
        const comment = await Comments.findById(commentId);

        if(!comment) {
            throw {
                message: 'Comment not found',
                success: false,
                status: 404
            }
        }

        if(userId.toString() !== comment.userId.toString()) {
            throw {
                message: 'Not authorized to update the comment',
                success: false,
                status: 403
            }
        }

        const updatedComment = await Comments.findByIdAndUpdate(
            commentId, 
            { text }, 
            { new: true }
        );

        return updatedComment;
    } catch (error) {
        console.log('This error is from updateComment: ', error);
        throw error;
    }
}

export const deleteComment = async({ userId, commentId }) => {
    try {
        const comment = await Comments.findById(commentId);

        if(!comment) {
            throw {
                message: 'Comment not found',
                success: false,
                status: 404
            }
        }

        if(userId.toString() !== comment.userId.toString()) {
            throw {
                message: 'Not authorized to delete the comment',
                success: false,
                status: 403
            }
        }

        const blog = await Blog.findById(comment.blogId);
        blog.commentsCount--;
        await blog.save();

        const deleteComment = await Comments.findByIdAndDelete(commentId);

        return deleteComment;
    } catch (error) {
        console.log('This error is from deleteComment: ', error);
        throw error;
    }
}

export const toggleReaction = async({ userId, commentId, action }) => {
    try {
        const comment = await Comments.findById(commentId);

        if(!comment) {
            throw {
                message: 'Comment not found',
                success: false,
                status: 404
            }
        }

        const hasLiked = comment.likes.some(id => id.toString() === userId.toString());
        const hasDisliked = comment.dislikes.some(id => id.toString() === userId.toString());

        if(action === 'like') {
            if(hasLiked) {
                comment.likes.pull(userId);
            } else{
                comment.likes.push(userId);
                if(hasDisliked) comment.dislikes.pull(userId);
            }
        } else if(action === 'dislike' ) {
            if(hasDisliked) {
                comment.dislikes.pull(userId);
            } else {
                comment.dislikes.push(userId);
                if(hasLiked) comment.likes.pull(userId);
            }
        } else {
            throw {
                message: 'Invalid action',
                success: false,
                status: 400
            }
        }

        await comment.save();

        return {
        liked: comment.likes.some(id => id.toString() === userId),
        disliked: comment.dislikes.some(id => id.toString() === userId),
        };
    } catch (error) {
        console.log('This error is from toggleReaction: ', error);
        throw error;
    }
}

export const createReply = async({ userId, blogId, text, parentId }) => {
    try {
        const reply = await Comments.create({ userId, blogId, text, parentId });
        return reply;
    } catch (error) {
        console.log('This error is from createReply: ', error);
        throw error;
    }
}

export const getReplies = async({ parentId }) => {
    try {
        const replies = await Comments.find({ parentId });
        return replies;
    } catch (error) {
        console.log('This error is from getReplies: ', error);
        throw error;
    }
}