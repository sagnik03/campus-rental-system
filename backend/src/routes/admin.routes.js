import express from 'express';

import {
    deleteAdminItemController,
    getAdminBookingsController,
    getAdminItemsController,
    getAdminPaymentsController,
    getAdminUsersController
} from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import allowRoles from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(authMiddleware, allowRoles('admin'));

router.get('/users', getAdminUsersController);
router.get('/items', getAdminItemsController);
router.delete('/items/:id', deleteAdminItemController);
router.get('/bookings', getAdminBookingsController);
router.get('/payments', getAdminPaymentsController);

export default router;
