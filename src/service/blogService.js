import {
    createBlog as createBlogRepository,
    getBlogById as getBlogByIdRepository,
    getAllBlogs as getAllBlogsRepository,
    updateBlogById as updateBlogByIdRepository,
    getUsersBlogs as getUsersBlogsRepository,
    saveCoverImage as saveCoverImageRepository,
    deleteBlogById as deleteBlogByIdRepository,
    deleteCoverImage as deleteCoverImageRepository
} from '../repository/blogRepository.js';
import { Filter } from "bad-words";

export const createBlog = async ({ title, content, authorName, author }) => {

    const filter = new Filter();

    const cleanTitle = filter.clean(title);
    const cleanContent = filter.clean(content);
    const cleanAuthor = filter.clean(authorName);

    const blog = await createBlogRepository({
        title: cleanTitle, 
        content: cleanContent,  
        author,
        authorName: cleanAuthor 
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

export const updateBlogById = async ({ blogId, title, content, authorName, authorId }) => {

    const filter = new Filter();

    const cleanTitle = filter.clean(title);
    const cleanContent = filter.clean(content);
    const cleanAuthor = filter.clean(authorName);

    const blog = await updateBlogByIdRepository({ 
        blogId, 
        title: cleanTitle, 
        content: cleanContent, 
        authorName: cleanAuthor,
        authorId
    });

    return blog;
}

export const getUsersBlogs = async ({ userId }) => {
    const blogs = await getUsersBlogsRepository({ userId });
    return blogs;
}