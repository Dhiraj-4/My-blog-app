import { AWS_BUCKET_NAME, AWS_REGION } from "../config/serverConfig.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Blog } from "../schema/blog.js";

export const createBlog = async ({ title, content, authorName, author }) => {
    try {
        const blog = await Blog.create({ title, content, authorName, author });
        return blog;
    } catch (error) {
        console.log("Error creating blog", error);
        throw error;
    }
}

export const saveCoverImage = async ({ fileUrl, blogId, authorId }) => {
    try {
        const blog = await Blog.findById(blogId);

        if(!blog) {
            throw {
                message: 'Blog not found, invalid id',
                success: true,
                status: 404
            }
        }

        if(blog.author.toString() !== authorId.toString()) {
            throw {
                message: 'Only author can change his blog',
                success: false,
                status: 403
            }
        }

        const updateBlog = await Blog.findByIdAndUpdate(blogId, { coverImage: fileUrl }, { new: true });
        return updateBlog;
    } catch (error) {
        console.log('This error is from saveCoverImage: ', error);
        throw error;
    }
}


export const deleteBlogById = async ({ blogId, authorId }) => {
    try {
        const s3 = new S3Client({ region: AWS_REGION });

        const blog = await Blog.findById(blogId);

        if (!blog) {
            throw {
                message: 'Blog not found',
                success: false,
                status: 404
            };
        }

        if (blog.author.toString() !== authorId.toString()) {
            throw {
                message: 'Only the author can delete their own blog',
                success: false,
                status: 403
            };
        }

        // Delete the image from S3 if it exists
        if (blog.coverImage) {
            const key = blog.coverImage.split('uploads/')[1];
            if (key) {
                const command = new DeleteObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: `uploads/${key}`
                });

                await s3.send(command);
            }
        }

        // Delete the blog from MongoDB
        await Blog.findByIdAndDelete(blogId);

        return blog;
    } catch (error) {
        console.error('Error in deleteBlogById:', error);
        throw error;
    }
};

export const deleteCoverImage = async ({ blogId, authorId }) => {
    try {
        const s3 = new S3Client({ region: AWS_REGION });

        const blog = await Blog.findById(blogId);

        if(!blog) {
            throw {
                message: 'Blog not found',
                success: false,
                status: 404
            }
        }

        if(blog.author.toString() !== authorId.toString()) {
            throw {
                message: "Only author is allowed to delete his blog's cover image",
                success: false,
                status: 403
            }
        }

        if (blog.coverImage) {
            const key = blog.coverImage.split('uploads/')[1];
            if (key) {
                const command = new DeleteObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: `uploads/${key}`
                });

                await s3.send(command);
            }
        } else {
            throw {
                message: 'The blog does not have a cover image',
                success: false,
                status: 404
            }
        }

        const updateBlog = await Blog.findByIdAndUpdate(blogId, { coverImage: null }, { new: true });

        return updateBlog;
    } catch (error) {
        console.log('This error is from deleteCoverImage: ', error);
        throw error;
    }
}

export const getAllBlogs = async () => {
    try {
        const blogs = await Blog.find();
        return blogs;
    } catch (error) {
        console.log('This is getAllBlogs error: ', error);
        throw error;
    }
}

export const getBlogById = async (blogId) => {
    try {
        const blog = await Blog.findById(blogId);

        if(!blog) {
            throw {
                message: 'Blog not found',
                success: false,
                status: 404
            }
        }
        return blog;
    } catch (error) {
        console.log('This is getBlogById error: ', error);
        throw error;
    }
}

export const updateBlogById = async ({ blogId, title, content, authorName, authorId }) => {
    try {
        const blog = await Blog.findById(blogId);
        
        if(!blog) {
            throw {
                message: 'Blog not found',
                success: false,
                status: 404
            }
        }

        if(blog.author.toString() !== authorId.toString()) {
            throw {
                message: 'Only author is allowed to update his blogs',
                success: false,
                status: 403
            }
        }

        const updateblog = await Blog.findByIdAndUpdate(blogId, { title, content, authorName }, { new: true});
        return updateblog;
    } catch (error) {
        console.log('This is udateBlogById error: ', error);
        throw error;
    }
}

export const getUsersBlogs = async ({ userId }) => {
    try {
        const blogs = Blog.find({ author: { $eq: userId }});
        return blogs || [];
    } catch (error) {
        console.log('This error is from getUsersBlogs: ', error);
        throw error;
    }
}