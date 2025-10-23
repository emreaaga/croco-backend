import { Router } from 'express';
import {
  createApplicationController,
  getApplicationsController,
} from '../controllers/application.controllers.js';
import { ApplicationSchema } from '../validations/application.validations.js';
import { handleValidate } from '../middlewares/handleValidate.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import PaginateValidation from '../validations/query.validations.js';
import { createApplicatonLimiter } from '../config/rateLimiter.js';

const router = Router();

router.post(
  '/',
  createApplicatonLimiter,
  handleValidate(ApplicationSchema),
  createApplicationController
);
router.get(
  '/',
  authMiddleware,
  handleValidate(PaginateValidation, true),
  getApplicationsController
);

export default router;
