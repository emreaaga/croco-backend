import { Router } from 'express';
import { createApplicationController } from '../controllers/application.controllers.js';
import { validateCreateApplication } from '../validations/application.validations.js';

const router = Router();

router.post('/', validateCreateApplication, createApplicationController);

export default router;
