import mongoose from 'mongoose';

import Booking from '../models/Booking.model.js';
import Item from '../models/Item.model.js';
import Payment from '../models/Payment.model.js';
import ApiError from '../utils/ApiError.js';

const ensureValidObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
};

const getScreenshotPath = (file) => {
  if (!file) {
    throw new ApiError(400, 'Screenshot is required');
  }

  return `/uploads/payments/${file.filename}`;
};

export const createPayment = async ({ booking, amount, transactionRef }, userId, file) => {
  ensureValidObjectId(booking, 'Booking id');

  const bookingData = await Booking.findById(booking);
  if (!bookingData) {
    throw new ApiError(404, 'Booking not found');
  }

  if (String(bookingData.user) !== String(userId)) {
    throw new ApiError(403, 'You can only pay for your own booking');
  }

  const existingPayment = await Payment.findOne({
    booking,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingPayment) {
    throw new ApiError(409, 'Payment already exists for this booking');
  }

  if (Number(amount) !== Number(bookingData.totalPrice)) {
    throw new ApiError(400, 'Amount must match booking total price');
  }

  const screenshot = getScreenshotPath(file);

  const payment = await Payment.create({
    booking,
    amount: Number(amount),
    status: 'pending',
    screenshot,
    transactionRef,
    payer: userId
  });

  return payment;
};

export const confirmPayment = async (paymentId, actingUser) => {
  ensureValidObjectId(paymentId, 'Payment id');

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  const booking = await Booking.findById(payment.booking);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const item = await Item.findById(booking.item);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  const isItemOwner = String(item.owner) === String(actingUser.id);
  const isAdmin = actingUser.role === 'admin';

  if (!isItemOwner && !isAdmin) {
    throw new ApiError(403, 'Only item owner can confirm payment');
  }

  payment.status = 'confirmed';
  await payment.save();

  booking.status = 'confirmed';
  await booking.save();

  return payment;
};

export const rejectPayment = async (paymentId, actingUser) => {
  ensureValidObjectId(paymentId, 'Payment id');

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  const booking = await Booking.findById(payment.booking);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const item = await Item.findById(booking.item);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  const isItemOwner = String(item.owner) === String(actingUser.id);
  const isAdmin = actingUser.role === 'admin';

  if (!isItemOwner && !isAdmin) {
    throw new ApiError(403, 'Only item owner can reject payment');
  }

  payment.status = 'failed';
  await payment.save();

  booking.status = 'cancelled';
  await booking.save();

  return payment;
};

export const getPaymentById = async (paymentId, userId) => {
  ensureValidObjectId(paymentId, 'Payment id');

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  const booking = await Booking.findById(payment.booking);
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const item = await Item.findById(booking.item);
  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  const isBookingUser = String(booking.user) === String(userId);
  const isItemOwner = String(item.owner) === String(userId);

  if (!isBookingUser && !isItemOwner) {
    throw new ApiError(403, 'You are not allowed to access this payment');
  }

  return payment;
};
