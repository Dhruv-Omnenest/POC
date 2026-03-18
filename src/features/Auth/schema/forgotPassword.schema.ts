import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  // Rename 'pan' to 'panNumber' to match your data
  pan: z
    .string()
    .trim()
    .length(10, 'PAN must be 10 characters')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'Invalid PAN format'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;