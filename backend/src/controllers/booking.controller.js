import {
  createBooking,
  getBookingById,
  getBookingsForUser
} from '../services/booking.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createBookingController = asyncHandler(async (req, res) => {
  const booking = await createBooking(req.body, req.user._id);

  res.status(201).json({
    message: 'Booking created successfully',
    data: booking
  });
});

export const getMyBookingsController = asyncHandler(async (req, res) => {
  const bookings = await getBookingsForUser(req.user._id);

  res.status(200).json({
    message: 'Bookings fetched successfully',
    data: bookings
  });
});

export const getBookingByIdController = asyncHandler(async (req, res) => {
  const booking = await getBookingById(req.params.id, req.user._id);

  res.status(200).json({
    message: 'Booking fetched successfully',
    data: booking
  });
});
