import express from 'express';
import blogRouter from './v1/blog.js';

const router = express.Router();

router.use('/blog', blogRouter);

export default router;