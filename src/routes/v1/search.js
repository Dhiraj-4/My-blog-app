import express from 'express';
import { accessTokenValidator } from '../../validators/tokenValidators/accessTokenValidator.js';
import { getBlogs, getUsers } from '../../controllers/searchController.js';


const router = express.Router();

//expects accessToken, returns blogs that matches the queries
router.get(
    '/blogs',
    accessTokenValidator,
    getBlogs
);

//expects accessToken, returns users that matches the queries
router.get(
    '/users',
    accessTokenValidator,
    getUsers
);



export default router;