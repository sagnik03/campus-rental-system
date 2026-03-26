import express from 'express';

import { loginController, signupController } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, signupSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signupController);
router.post('/login', validate(loginSchema), loginController);

export default router;
