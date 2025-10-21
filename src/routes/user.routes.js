import { Router } from 'express';
import { getUsersController } from '../controllers/user.controolers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import PaginateValidation from '../validations/query.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';

const router = Router();
router.get('/', authMiddleware, handleValidate(PaginateValidation, true), getUsersController);

export default router;
