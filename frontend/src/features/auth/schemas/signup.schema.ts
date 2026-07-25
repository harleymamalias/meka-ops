import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(2, 'Enter your first name.'),
    lastName: z.string().trim().min(2, 'Enter your last name.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
