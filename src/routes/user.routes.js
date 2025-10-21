import { Router } from 'express';
import { getUsersController, changeUserStatusController } from '../controllers/user.controolers.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import PaginateValidation from '../validations/query.validations.js';
import UserPatchSchema from '../validations/user.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';

const router = Router();
router.get('/', authMiddleware, handleValidate(PaginateValidation, true), getUsersController);
router.patch('/:id', authMiddleware, handleValidate(UserPatchSchema), changeUserStatusController);

export default router;
