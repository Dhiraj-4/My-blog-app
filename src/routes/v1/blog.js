
import { accessTokenValidator } from '../../validators/tokenValidators/accessTokenValidator.js';
import { blogZodSchema } from '../../validators/blogValidators/blogZodSchema.js';
import { zodBlogValidator } from '../../validators/blogValidators/zodBlogValidator.js';
import { createBlog, deleteBlogById, deleteCoverImage, getAllBlogs, getBlogById,
     getUsersBlogs, saveCoverImage, toggleList, toggleReaction, updateBlogById, 
} from '../../controllers/blogController.js';
import { mongoIdValidator } from '../../validators/mongoIdvalidator/mongoIdValidator.js';
import { fileTypeValidator } from '../../validators/fileTypeValidator.js';
import { preSignedUrl } from '../../controllers/usersController.js';
import { isFileUrlValid } from '../../validators/isFileUrlValid.js';
import { commentValidator } from './../../validators/commentValidator/commentValidator.js';
import { createComment, createReply, deleteComment, getComments, getReplies, updateComment } from './../../controllers/commentController.js';

const router = express.Router();

//expects nothing, returns all Blogs, cleared
router.get('/', getAllBlogs);

//expects accessToken(for access and authorId), action => 'self' , returns all author's blogs, cleared
router.get('/users', accessTokenValidator, getUsersBlogs);

//expects accessToken, action=> 'other', returns all blog's of that user
router.get(
    '/users/:id',
    accessTokenValidator,
    mongoIdValidator,
    getUsersBlogs
)
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
// title, authorName,tags and content, updates the blog with given details, cleared
router.put(
    '/:id', 
    accessTokenValidator, 
    mongoIdValidator, 
    zodBlogValidator(blogZodSchema), 
    updateBlogById
);

//expects accessToken(for access and author),
// title, authorName, tags and content, creates blog with given details, cleared
router.post(
    '/', 
    accessTokenValidator,  
    zodBlogValidator(blogZodSchema),
    createBlog
);

//expects accessToken, blogId, and action,
//toggles likes and dislikes, returns blog
router.put(
    '/toggleReaction/:id',
    accessTokenValidator,
    mongoIdValidator,
    toggleReaction
);

//comments router starts here XXXXXXXXXXX

// Create comment on blog
// expects accessToken, blogId, 
router.post(
    '/:id/comments',
    accessTokenValidator,
    mongoIdValidator,
    commentValidator,
    createComment
);

// Get comments on blog
router.get(
    '/:blogId/comments',
    accessTokenValidator,
    mongoIdValidator,
    getComments
);

// Update comment or reply
router.put(
    '/comments/:commentId',
    accessTokenValidator,
    mongoIdValidator,
    commentValidator,
    updateComment
);

// Delete comment or reply
router.delete(
    '/comments/:commentId',
    accessTokenValidator,
    mongoIdValidator,
    deleteComment
);

// Like or dislike comment or reply
router.put(
    '/comments/:commentId/reactions',
    accessTokenValidator,
    mongoIdValidator,
    toggleReaction
);

// Create a reply to a comment
router.post(
    '/comments/:commentId/replies',
    accessTokenValidator,
    mongoIdValidator,
    commentValidator,
    createReply
);

// Get replies to a comment
router.get(
    '/comments/:commentId/replies',
    accessTokenValidator,
    mongoIdValidator,
    getReplies
);

//toggles the blogId in favourite list
router.put(
    '/toggleList/:id',
    accessTokenValidator,
    mongoIdValidator,
    toggleList
);

export default router;