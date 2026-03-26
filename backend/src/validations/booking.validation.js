import { z } from 'zod';

export const createBookingSchema = z.object({
  item: z.string().trim().min(1, 'Item id is required'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date()
});
