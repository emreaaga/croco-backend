import { Router } from 'express';
import { createApplicationController } from '../controllers/application.controllers.js';
import { ApplicationSchema } from '../validations/application.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';

const router = Router();

router.post('/', handleValidate(ApplicationSchema), createApplicationController);

export default router;
