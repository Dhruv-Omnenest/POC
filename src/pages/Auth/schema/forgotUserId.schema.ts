import { z } from 'zod';

export const forgotUserIdSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .pipe(z.email('Invalid email format')),
    
  pan: z
    .string()
    .trim()
    .toUpperCase()
    .length(10, 'PAN must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
});

export type ForgotUserIdFormData = z.infer<typeof forgotUserIdSchema>;