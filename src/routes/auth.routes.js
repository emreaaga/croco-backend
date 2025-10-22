import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
  logOutController,
  changePasswordController,
} from '../controllers/auth.controllers.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  RegisterSchema,
  LoginSchema,
  ChangePasswordSchema,
} from '../validations/auth.validations.js';

const router = Router();

router.post('/register', handleValidate(RegisterSchema), registerController);
router.post('/login', handleValidate(LoginSchema), loginController);
router.get('/me', authMiddleware, getMeController);
router.post('/logout', authMiddleware, logOutController);
router.post(
  '/change-password',
  authMiddleware,
  handleValidate(ChangePasswordSchema),
  changePasswordController
);

export default router;
