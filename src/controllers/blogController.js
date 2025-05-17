import { response } from 'express';
import {
    createBlog as createBlogService,
    getBlogById as getBlogByIdService,
    getAllBlogs as getAllBlogsService,
    updateBlogById as updateBlogByIdService,
    getUsersBlogs as getUsersBlogsService,
    deleteBlogById as deleteBlogByIdService,
    saveCoverImage as saveCoverImageService,
    deleteCoverImage as deleteCoverImageService,
    toggleReaction as toggleReactionService,
    toggleList as toggleListService,
    getUserFeed as getUserFeedService,
    getTrendingBlogs as getTrendingBlogsService,
    getFavList as getFavListService,
    getBlogReactions as getBlogReactionsService
} from '../service/blogService.js'
import { errorResponse, successResponse } from "../utils/response.js";


export const createBlog = async (req, res) => {
    try {
        const blog = await createBlogService({
            title: req.body.title,
            content: req.body.content,
            author: req.user.userId,
            authorName: req.body.authorName.trim(),
            tags: req.body.tags
        });

        return successResponse({
            message: 'Blog created successfully',
            success: true,
            res: res,
            status: 201,
            data: blog
        });

    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await getAllBlogsService();

        return successResponse({
            message: 'Fetched all blogs successfully',
            success: true,
            res: res,
            status: 200,
            data: blogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getBlogById = async (req, res) => {
    try {
        const blog = await getBlogByIdService(req.params.id);

        return successResponse({
            message: 'Fetched blog successfully',
            success: true,
            res: res,
            status: 200,
            data: blog
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateBlogById = async (req, res) => {
    try {
        const blog = await updateBlogByIdService({
            title: req.body.title,
            content: req.body.content,
            blogId: req.params.id,
            authorName: req.body.authorName,
            authorId: req.user.userId,
            tags: req.body.tags
        });

        return successResponse({
            message: 'Updated blog successfully',
            success: true,
            status: 200,
            res: res,
            data: blog
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getUsersBlogs = async (req, res) => {
    try {
        let blogs;
        if(req.body.action.trim().toLowerCase() === 'self') {
            blogs = await getUsersBlogsService(req.user.userId);
        } else if(req.body.action.trim().toLowerCase() === 'other'){
            blogs = await getUsersBlogsService(req.params.id );
        } else {
            return res.status(400).json({
                message: 'Invalid action',
                success: false
            });
        }

        return successResponse({
            message: "Fetched all user's blogs successfully",
            success: true,
            status: 200,
            res: res,
            data: blogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const saveCoverImage = async (req, res) => {
    try {
        const blog = await saveCoverImageService({
            fileUrl: req.body.fileUrl,
            blogId: req.params.id,
            authorId: req.user.userId
        });

        return successResponse({
            message: 'Blog cover image upload successfully',
            success: true,
            status: 200,
            res: res,
            data: blog
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteBlogById = async (req, res) => {
    try {
        const blog = await deleteBlogByIdService({
            blogId: req.params.id,
            authorId: req.user.userId
        });

        return successResponse({
            message: 'Blog deleted successfully',
            success: true,
            status: 200,
            res: res,
            data: blog
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteCoverImage = async (req, res) => {
    try {
        const blog = await deleteCoverImageService({
            blogId: req.params.id,
            authorId: req.user.userId
        });

        return successResponse({
            message: "Blog's cover image delete successfully",
            success: true,
            status: 200,
            res: res,
            data: blog
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleReaction = async(req, res) => {
    try {
        const blogReaction = await toggleReactionService({
            userId: req.user.userId,
            blogId: req.params.id,
            action: req.body.action.trim().toLowerCase()
        });

        return successResponse({
            message: 'Toggled reaction successfully',
            success: true,
            res: res,
            status: 200,
            data: blogReaction
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getBlogReactions = async(req, res) => {
    try {
        const blogReactions = await getBlogReactionsService(req.params.id);
        
        return successResponse({
            message: 'Fetched reactions successfully',
            success: true,
            res: res,
            status: 200,
            data: blogReactions
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleList = async(req, res) => {
    try {
        const favouriteList = await toggleListService({
            userId: req.user.userId,
            blogId: req.params.id
        });

        return successResponse({
            message: 'Toggled favouriteList successfully',
            success: true,
            res: res,
            status: 200,
            data: favouriteList
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getUserFeed = async(req, res) => {
    try {
        const blogs = await getUserFeedService(req.user.userId);

        return successResponse({
            message: 'Fetched feed successfully',
            success: true,
            res: res,
            status: 200,
            data: blogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getTrendingBlogs = async(req, res) => {
    try {
        const trendingBlogs = await getTrendingBlogsService();

        return successResponse({
            message: 'Fetched trending blogs successfully',
            success: true,
            res: res,
            status: 200,
            data: trendingBlogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getFavList = async(req, res) => {
    try {
        const favBlogs = await getFavListService(req.user.userId);

        return successResponse({
            message: 'Fetched favourite blogs successfully',
            success: true,
            res: res,
            status: 200,
            data: favBlogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}