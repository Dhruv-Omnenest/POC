import * as z from 'zod';

export const loginSchema = z.object({
    username: z.string()
        .min(1, "User ID is required")
        .toUpperCase(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[A-Z]/, "Password must contain at least one uppercase character")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
}).superRefine((data, ctx) => {
    if (data.username && data.password.toLowerCase().includes(data.username.toLowerCase())) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password cannot contain User ID",
            path: ["password"]
        });
    }
});

export const otpSchema = z.object({
    otp: z.string()
        .length(4, "OTP must be exactly 4 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
