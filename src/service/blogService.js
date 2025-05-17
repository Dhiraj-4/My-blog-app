import {
    createBlog as createBlogRepository,
    getBlogById as getBlogByIdRepository,
    getAllBlogs as getAllBlogsRepository,
    updateBlogById as updateBlogByIdRepository,
    getUsersBlogs as getUsersBlogsRepository,
    saveCoverImage as saveCoverImageRepository,
    deleteBlogById as deleteBlogByIdRepository,
    deleteCoverImage as deleteCoverImageRepository,
    toggleReaction as toggleReactionRepository,
    toggleList as toggleListRepository,
    getUserFeed as getUserFeedRepository,
    getTrendingBlogs as getTrendingBlogsRepository,
    getFavList as getFavListRepository,
    getBlogReactions as getBlogReactionsRepository
} from '../repository/blogRepository.js';
import { checkProfanity } from '../utils/blogProfanity.js';

export const createBlog = async ({ title, content, authorName, author, tags }) => {
    
    const {cleanContent, newTags} = checkProfanity({ title, content, authorName, tags });

    const blog = await createBlogRepository({
        title,
        content: cleanContent,  
        author,
        authorName,
        tags: newTags
    });

    return blog;
}

export const saveCoverImage = async ({ fileUrl, blogId, authorId }) => {
    const blog = await saveCoverImageRepository({ fileUrl, blogId, authorId });
    return blog;
}

export const deleteBlogById = async ({ blogId, authorId }) => {
    const blog = await deleteBlogByIdRepository({ blogId, authorId });
    return blog;
}

export const deleteCoverImage = async ({ blogId, authorId }) => {
    const blog = await deleteCoverImageRepository({ blogId, authorId });
    return blog;
}

export const getAllBlogs = async () => {
    const blogs = await getAllBlogsRepository();
    return blogs
}

export const getBlogById = async (blogId) => {
    const blog = await getBlogByIdRepository(blogId);
    return blog;
}

export const updateBlogById = async ({ blogId, title, content, authorName, authorId, tags }) => {

    const {cleanContent, newTags} = checkProfanity({ title, content, authorName, tags });

    const blog = await updateBlogByIdRepository({ 
        blogId, 
        title, 
        content: cleanContent, 
        authorName,
        authorId,
        tags: newTags
    });

    return blog;
}

export const getUsersBlogs = async (userId) => {
    const blogs = await getUsersBlogsRepository(userId);
    return blogs;
}

export const toggleReaction = async ({ userId, blogId, action }) => {
    const blogReaction = await toggleReactionRepository({ userId, blogId, action });
    return blogReaction;
}

export const getBlogReactions = async(blogId) => {
    const blogReactions = await getBlogReactionsRepository(blogId);
    return blogReactions;
}

export const toggleList = async({ userId, blogId }) => {
    const favouriteList = await toggleListRepository({ userId, blogId });
    return favouriteList;
}

export const getUserFeed = async(userId) => {
    const blogs = await getUserFeedRepository(userId);
    return blogs;
}

export const getTrendingBlogs = async() => {
    const trendingBlogs = await getTrendingBlogsRepository();
    return trendingBlogs;
}

export const getFavList = async(userId) => {
    const favBlogs = getFavListRepository(userId);
    return favBlogs
}