import { Router } from 'express';
import { getUsersController, changeUserStatusController } from '../controllers/user.controolers.js';
import { authMiddleware, handleValidate, isAdminMiddleware } from '../middlewares/index.js';
import { PaginateValidation, UserPatchSchema } from '../validations/index.js';

const router = Router();
router.get(
  '/',
  authMiddleware,
  isAdminMiddleware,
  handleValidate(PaginateValidation, true),
  getUsersController
);
router.patch(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  handleValidate(UserPatchSchema),
  changeUserStatusController
);

export default router;
