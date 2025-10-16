import { Router } from 'express';
import { getUsersController } from '../controllers/user.controolers.js';
import { authMe } from '../middlewares/authMe.js';

const router = Router();
router.get('/', authMe, getUsersController);

export default router;
