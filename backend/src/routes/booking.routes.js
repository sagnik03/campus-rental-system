import express from 'express';

import {
  createBookingController,
  getBookingByIdController,
  getMyBookingsController
} from '../controllers/booking.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createBookingSchema } from '../validations/booking.validation.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(createBookingSchema), createBookingController);
router.get('/', getMyBookingsController);
router.get('/:id', getBookingByIdController);

export default router;
