import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
  logOutController,
  changePasswordController,
  sendVerificationController,
  verifyEmailController,
  refreshTokenController,
} from '../controllers/auth.controllers.js';
import { handleValidate, authMiddleware } from '../middlewares/index.js';
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from '../validations/index.js';
import {
  emailLimiter,
  loginLimiter,
  registerLimiter,
  changePasswordLimiter,
  verifyEmailLimiter,
} from '../config/rateLimiter.js';

const router = Router();

router.post('/register', registerLimiter, handleValidate(RegisterSchema), registerController);
router.post('/login', loginLimiter, handleValidate(LoginSchema), loginController);
router.get('/me', authMiddleware, getMeController);
router.post('/logout', authMiddleware, logOutController);
router.post(
  '/change-password',
  changePasswordLimiter,
  authMiddleware,
  handleValidate(ChangePasswordSchema),
  changePasswordController
);
router.post('/send-verification', emailLimiter, authMiddleware, sendVerificationController);
router.get('/verify-email', verifyEmailLimiter, verifyEmailController);
router.get('/refresh', refreshTokenController);

export default router;
