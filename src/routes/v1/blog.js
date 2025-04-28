import express from 'express';
import { validate } from '../../validators/zodEmailPasswordValidator.js';
import { registerSchema } from '../../validators/zodEmailPasswordSchema.js';
import { createUser, getAllUsers, loginUser } from '../../controllers/usersController.js';

const router = express.Router();

router.post('/signup', validate(registerSchema), createUser);

router.get('/users', getAllUsers);

router.post('/login', validate(registerSchema), loginUser)

export default router;