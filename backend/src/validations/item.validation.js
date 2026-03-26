import { z } from 'zod';

const imagePathSchema = z
  .string()
  .trim()
  .refine((value) => value.startsWith('/uploads/') || /^https?:\/\//.test(value), {
    message: 'Each image must be a valid URL or uploaded file path'
  });

export const createItemSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  pricePerDay: z.coerce.number().nonnegative('Price per day must be non-negative'),
  securityDeposit: z.coerce.number().nonnegative('Security deposit must be non-negative'),
  category: z.string().trim().min(1, 'Category is required'),
  images: z.array(imagePathSchema).optional().default([])
});

export const updateItemSchema = z
  .object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    description: z.string().trim().min(1, 'Description cannot be empty').optional(),
    pricePerDay: z.coerce.number().nonnegative('Price per day must be non-negative').optional(),
    securityDeposit: z.coerce.number().nonnegative('Security deposit must be non-negative').optional(),
    category: z.string().trim().min(1, 'Category cannot be empty').optional(),
    images: z.array(imagePathSchema).optional()
  });
