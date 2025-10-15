import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
} from '../controllers/auth.controllers.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { RegisterSchema, LoginSchema } from '../validations/auth.validations.js';

const router = Router();

router.post('/register', handleValidate(RegisterSchema), registerController);
router.post('/login', handleValidate(LoginSchema), loginController);
router.get('/me', getMeController);

export default router;
