import { Router } from 'express';
import {
  createApplicationController,
  getApplicationsController,
} from '../controllers/application.controllers.js';
import { ApplicationSchema } from '../validations/application.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { authMe } from '../middlewares/authMe.js';

const router = Router();

router.post('/', handleValidate(ApplicationSchema), createApplicationController);
router.get('/', authMe, getApplicationsController);

export default router;
