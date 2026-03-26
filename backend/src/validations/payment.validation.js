import { z } from 'zod';

export const createPaymentSchema = z.object({
  booking: z.string().trim().min(1, 'Booking id is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  transactionRef: z.string().trim().min(1).optional()
});
