import express from 'express';

import {
  confirmPaymentController,
  createPaymentController,
  getPaymentByIdController,
  rejectPaymentController
} from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import allowRoles from '../middlewares/role.middleware.js';
import { uploadPaymentScreenshot } from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createPaymentSchema } from '../validations/payment.validation.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', uploadPaymentScreenshot, validate(createPaymentSchema), createPaymentController);
router.patch('/:id/confirm', allowRoles('owner', 'admin'), confirmPaymentController);
router.patch('/:id/reject', allowRoles('owner', 'admin'), rejectPaymentController);
router.get('/:id', getPaymentByIdController);

export default router;
