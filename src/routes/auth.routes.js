import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
} from '../controllers/auth.controllers.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { authMe } from '../middlewares/authMe.js';
import { RegisterSchema, LoginSchema } from '../validations/auth.validations.js';
import { checkOriginAndReferer } from '../middlewares/checkOrigin.js';

const router = Router();

router.post('/register', handleValidate(RegisterSchema), registerController);
router.post('/login', checkOriginAndReferer, handleValidate(LoginSchema), loginController);
router.get('/me', authMe, getMeController);

export default router;
