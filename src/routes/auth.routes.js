import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
} from '../controllers/auth.controllers.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', getMeController);

export default router;
