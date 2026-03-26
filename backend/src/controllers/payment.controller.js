import {
  confirmPayment,
  createPayment,
  getPaymentById,
  rejectPayment
} from '../services/payment.service.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createPaymentController = asyncHandler(async (req, res) => {
  const payment = await createPayment(req.body, req.user._id, req.file);

  res.status(201).json({
    message: 'Payment created successfully',
    data: payment
  });
});

export const confirmPaymentController = asyncHandler(async (req, res) => {
  const payment = await confirmPayment(req.params.id, req.user);

  res.status(200).json({
    message: 'Payment confirmed successfully',
    data: payment
  });
});

export const rejectPaymentController = asyncHandler(async (req, res) => {
  const payment = await rejectPayment(req.params.id, req.user);

  res.status(200).json({
    message: 'Payment rejected successfully',
    data: payment
  });
});

export const getPaymentByIdController = asyncHandler(async (req, res) => {
  const payment = await getPaymentById(req.params.id, req.user._id);

  res.status(200).json({
    message: 'Payment fetched successfully',
    data: payment
  });
});
