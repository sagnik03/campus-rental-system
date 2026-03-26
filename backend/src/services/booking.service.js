import mongoose from 'mongoose';

import Booking from '../models/Booking.model.js';
import Item from '../models/Item.model.js';
import ApiError from '../utils/ApiError.js';

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const ensureValidObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const ensureValidDate = (date, fieldName) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const calculateNumberOfDays = (startDate, endDate) => {
  return Math.ceil((endDate - startDate) / MILLISECONDS_IN_A_DAY);
};

export const createBooking = async ({ item, startDate, endDate }, userId) => {
  ensureValidObjectId(item, 'Item id');

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  ensureValidDate(parsedStartDate, 'startDate');
  ensureValidDate(parsedEndDate, 'endDate');

  if (parsedStartDate >= parsedEndDate) {
    throw new ApiError(400, 'Start date must be before end date');
  }

  const itemData = await Item.findById(item);
  if (!itemData) {
    throw new ApiError(404, 'Item not found');
  }

  if (String(itemData.owner) === String(userId)) {
    throw new ApiError(400, 'You cannot book your own item');
  }

  const overlappingBooking = await Booking.findOne({
    item,
    status: { $in: ['pending', 'confirmed'] },
    startDate: { $lte: parsedEndDate },
    endDate: { $gte: parsedStartDate }
  });

  if (overlappingBooking) {
    throw new ApiError(409, 'Item is already booked for selected dates');
  }

  const numberOfDays = calculateNumberOfDays(parsedStartDate, parsedEndDate);

  if (numberOfDays <= 0) {
    throw new ApiError(400, 'Invalid booking duration');
  }

  const totalPrice = itemData.pricePerDay * numberOfDays;

  const booking = await Booking.create({
    item,
    user: userId,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    totalPrice,
    status: 'pending'
  });

  return booking;
};

export const getBookingsForUser = async (userId) => {
  return Booking.find({ user: userId }).sort({ createdAt: -1 });
};

export const getBookingById = async (bookingId, userId) => {
  ensureValidObjectId(bookingId, 'Booking id');

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (String(booking.user) !== String(userId)) {
    throw new ApiError(403, 'You are not allowed to access this booking');
  }

  return booking;
};
