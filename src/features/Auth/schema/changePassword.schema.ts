import z from "zod";

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1,'Old Password is Required'),
    newPassword:
     z.string()
      .min(10, 'Password must be at least 10 characters long')
      .regex(/[0-9]/, 'Password must contain at least one digit')
      .regex(/[^a-zA-Z0-9]/),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(
    (data)=>{
        data.newPassword === data.newPassword ,{
            message: "Passwords do not match",
    path: ["confirmPassword"],
        }
    }
).refine((data) => data.newPassword !== data.oldPassword, {
    message: "New password cannot be the same as the old password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;