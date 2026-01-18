import { z } from 'zod';

// Password must contain at least one lowercase, uppercase, digit, and special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/;

const passwordRequirements = {
  message:
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => passwordRegex.test(val), passwordRequirements),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => passwordRegex.test(val), passwordRequirements),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => passwordRegex.test(val), passwordRequirements),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((val) => passwordRegex.test(val), passwordRequirements),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
