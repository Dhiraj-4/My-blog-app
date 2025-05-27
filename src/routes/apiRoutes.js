import express from 'express';
import blogRouter from './v1/blog.js';
import authRouter from './v1/auth.js';
import searchRouter from './v1/search.js'

const router = express.Router();

router.use('/blog', blogRouter);

router.use('/auth', authRouter);

router.use('/search', searchRouter);

export default router;