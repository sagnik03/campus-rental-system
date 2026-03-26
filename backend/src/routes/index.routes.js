import express from 'express';

import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import bookingRoutes from './booking.routes.js';
import itemRoutes from './item.routes.js';
import paymentRoutes from './payment.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/bookings', bookingRoutes);
router.use('/items', itemRoutes);
router.use('/payments', paymentRoutes);

export default router;
