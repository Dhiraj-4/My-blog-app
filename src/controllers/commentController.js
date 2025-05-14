import {
    createComment as createCommentService,
    getComments as getCommentsServic,
    updateComment as updateCommentService,
    deleteComment as deleteCommentService,
    toggleReaction as toggleReactionService,
    createReply as createReplyService,
    getReplies as getRepliesService
} from '../service/commentService.js';

import { errorResponse, successResponse } from './../utils/response.js';

export const createComment = async (req, res) => {
    try {
        const comment = await createCommentService({
            userId: req.user.userId,
            blogId: req.params.id,
            text: req.body.text.trim()
        });

        return successResponse({
            message: 'Comment created successfully',
            success: true, 
            status: 201,
            res: res,
            data: comment
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getComments = async(req, res) => {
    try {
        const comments = await getCommentsServic({
            blogId: req.params.id
        });
        return successResponse({
            message: 'Fetched all comments successfully',
            success: true,
            res: res,
            status: 200,
            data: comments
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateComment = async(req, res) => {
    try {
        const comment = await updateCommentService({
            text: req.body.text.trim(),
            userId: req.user.userId,
            commentId: req.params.id
        });

        return successResponse({
            message: 'Comment updated successfully',
            success: true,
            res: res,
            data: comment,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteComment = async(req, res) => {
    try {
        const comment = await deleteCommentService({
            userId: req.user.userId,
            commentId: req.params.id
        });

        return successResponse({
            message: 'Comment deleted successfully',
            success: true,
            data: comment,
            res: res,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleReaction = async(req, res) => {
    try {
        const comment = await toggleReactionService({
            userId: req.user.userId,
            commentId: req.params.id,
            action: req.body.action
        });

        return successResponse({
            message: 'Reaction toggled successfully',
            success: true,
            status: 200,
            res: res,
            data: comment
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const createReply = async(req, res) => {
    try {
        const reply = await createReplyService({
            userId: req.user.userId,
            parentId: req.params.commentId,
            blogId: req.params.blogId,
            text: req.body.text.trim() 
        });

        return successResponse({
            message: 'Reply created successfully',
            success: true,
            status: 201,
            res: res,
            data: reply
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getReplies = async(req, res) => {
    try {
        const replies = getRepliesService({
            parentId: req.params.id
        });

        return successResponse({
            message: 'Fetched replies successfully',
            success: true,
            status: 200,
            res: res,
            data: replies
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}