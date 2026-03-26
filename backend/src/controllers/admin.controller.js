import mongoose from 'mongoose';

import {
    deleteAnyItemByAdmin,
    getAllBookings,
    getAllItems,
    getAllPayments,
    getAllUsers
} from '../services/admin.service.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAdminUsersController = asyncHandler(async (_req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
        message: 'Users fetched successfully',
        data: users
    });
});

export const getAdminItemsController = asyncHandler(async (_req, res) => {
    const items = await getAllItems();

    res.status(200).json({
        message: 'Items fetched successfully',
        data: items
    });
});

export const deleteAdminItemController = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ApiError(400, 'Item id is invalid');
    }

    const deletedItem = await deleteAnyItemByAdmin(req.params.id);

    if (!deletedItem) {
        throw new ApiError(404, 'Item not found');
    }

    res.status(200).json({
        message: 'Item deleted successfully'
    });
});

export const getAdminBookingsController = asyncHandler(async (_req, res) => {
    const bookings = await getAllBookings();

    res.status(200).json({
        message: 'Bookings fetched successfully',
        data: bookings
    });
});

export const getAdminPaymentsController = asyncHandler(async (_req, res) => {
    const payments = await getAllPayments();

    res.status(200).json({
        message: 'Payments fetched successfully',
        data: payments
    });
});
