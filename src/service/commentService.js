import {
    createComment as createCommentRepository,
    getComments as getCommentsRepository,
    updateComment as updateCommentRepository,
    deleteComment as deleteCommentRepository,
    toggleReaction as toggleReactionRepository,
    createReply as createReplyRepository,
    getReplies as getRepliesRepository
} from '../repository/commentRepository.js'
import filter from 'leo-profanity';

export const createComment = async({ userId, blogId, text }) => {
    const newText = filter.clean(text);
    const comment = await createCommentRepository({ userId, blogId, text: newText });
    return comment;
}

export const getComments = async({ blogId }) => {
    const comments = await getCommentsRepository({ blogId });
    return comments;
}

export const updateComment = async({ userId, commentId, text }) => {
    const newText = filter.clean(text);
    const comment = await updateCommentRepository({ userId, commentId, text: newText });
    return comment;
}

export const deleteComment = async({ userId, commentId }) => {
    const comment = await deleteCommentRepository({ userId, commentId });
    return comment;
}

export const toggleReaction = async({ userId, commentId, action }) => {
    const comment = await toggleReactionRepository({ userId, commentId, action });
    return comment;
}

export const createReply = async({ userId, parentId, blogId, text }) => {
    const newText = filter.clean(text);
    const reply = await createReplyRepository({ userId, parentId, blogId, text: newText });
    return reply;
}

export const getReplies = async({ parentId }) => {
    const replies = await getRepliesRepository({ parentId });
    return replies;
}