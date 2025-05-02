import express from 'express';
import { accessTokenValidator } from '../../validators/tokenValidators/accessTokenValidator.js';
import { blogZodSchema } from '../../validators/blogValidators/blogZodSchema.js';
import { zodBlogValidator } from '../../validators/blogValidators/zodBlogValidator.js';
import { createBlog, deleteBlogById, deleteCoverImage, getAllBlogs, getBlogById,
     getUsersBlogs, saveCoverImage, updateBlogById, 
} from '../../controllers/blogController.js';
import { mongoIdValidator } from '../../validators/mongoIdvalidator/mongoIdValidator.js';
import { fileTypeValidator } from '../../validators/fileTypeValidator.js';
import { preSignedUrl } from '../../controllers/usersController.js';
import { isFileUrlValid } from '../../validators/isFileUrlValid.js';

const router = express.Router();

//expects nothing, returns all Blogs, cleared
router.get('/', getAllBlogs);

//expects accessToken(for access and authorId), returns all author's blogs, cleared
router.get('/users', accessTokenValidator, getUsersBlogs);

//expects blogId and accessToken, returns blog, cleared
router.get(
    '/:id', 
    accessTokenValidator, 
    mongoIdValidator, 
    getBlogById
);

//expects accessToken and fileType, returns uploadUrl and fileUrl, cleared
router.post(
    '/coverImage-upload-url', 
    accessTokenValidator,
    fileTypeValidator,
    preSignedUrl
);

//expects accesToken(for access and to verify author),
//  blogId and fileUrl, saves fileUrl in blog, cleared
router.put(
    '/coverImage/:id',
    accessTokenValidator,
    mongoIdValidator,
    isFileUrlValid,
    saveCoverImage
);

//expects accessToken(for access and to verify author) and blogId,
//deletes blog and image from aws, cleared
router.delete(
    '/:id',
    accessTokenValidator,
    mongoIdValidator,
    deleteBlogById
);

//expects blogId and authorId(takes it from accessToken),
//deletes blog's coverImage, cleared
router.delete(
    '/coverImage/:id',
    accessTokenValidator,
    mongoIdValidator,
    deleteCoverImage
);

//expects blogId and accessToken(for access and to verify author),
// title, authorName and content, updates the blog with given details, cleared
router.put(
    '/:id', 
    accessTokenValidator, 
    mongoIdValidator, 
    zodBlogValidator(blogZodSchema), 
    updateBlogById
);

//expects accessToken(for access and author),
// title, authorName and content, creates blog with given details, cleared
router.post(
    '/', 
    accessTokenValidator,  
    zodBlogValidator(blogZodSchema),
    createBlog
);

export default router;