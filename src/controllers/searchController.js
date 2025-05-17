import { Blog } from "../schema/blog";
import { Users } from "../schema/users";
import { errorResponse, successResponse } from "../utils/response";


export const getUsers = async(req, res) => {
    try {
        const q = req.query.q;
        if (!q) return res.status(400).json({ error: 'Query is required' });

        const users = await Users.find({
            userName: { $regex: q, $options: 'i' }
        }).select('userName profileImg');

        return successResponse({
            message: 'Fetched matching users successfully',
            succses: true,
            res: res,
            status: 200,
            data: users
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getBlogs = async(req, res) => {
    try {
        const q = req.query.q;
        if (!q) return res.status(400).json({ error: 'Query is required' });

        const blogs = await Blog.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },
                { $authorName: { $regex: q, $options: 'i' } }
            ]
        });

        return successResponse({
            message: 'Fetched matching blogs successfully',
            success: true,
            status: 200,
            res: res,
            data: blogs
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}