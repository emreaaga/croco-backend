import { Router } from 'express';
import { createApplicationController } from '../controllers/application.controllers.js';

const router = Router();

router.post('/', createApplicationController);

export default router;
