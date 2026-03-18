import { z } from 'zod';

export const forgotUserIdSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .toLowerCase()
    .email('Invalid email format'),
  pan: z
    .string()
    .trim()
    .length(10, 'PAN must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format'),
});

export type ForgotUserIdFormData = z.infer<typeof forgotUserIdSchema>;