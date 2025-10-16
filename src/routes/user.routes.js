import { Router } from 'express';
import { getUsersController } from '../controllers/user.controolers.js';
import { authMe } from '../middlewares/authMe.js';
import PaginateValidation from '../validations/query.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';

const router = Router();
router.get('/', authMe, handleValidate(PaginateValidation, true), getUsersController);

export default router;
