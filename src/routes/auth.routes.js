import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
  logOutController,
} from '../controllers/auth.controllers.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { RegisterSchema, LoginSchema } from '../validations/auth.validations.js';
import { checkOriginAndReferer } from '../middlewares/checkOrigin.js';

const router = Router();

router.post('/register', checkOriginAndReferer, handleValidate(RegisterSchema), registerController);
router.post('/login', checkOriginAndReferer, handleValidate(LoginSchema), loginController);
router.get('/me', authMiddleware, getMeController);
router.post('/logout', checkOriginAndReferer, logOutController);

export default router;
