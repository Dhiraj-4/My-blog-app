import { z } from 'zod';

const createRegisterSchema = ({
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumber = true,
  requireSpecialChar = true,
}) => {
  let passwordSchema = z
    .string()
    .min(minLength, { message: `Password must be at least ${minLength} characters long` });

  if (requireLowercase) {
    passwordSchema = passwordSchema.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' });
  }
  if (requireUppercase) {
    passwordSchema = passwordSchema.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' });
  }
  if (requireNumber) {
    passwordSchema = passwordSchema.regex(/[0-9]/, { message: 'Password must contain at least one number' });
  }
  if (requireSpecialChar) {
    passwordSchema = passwordSchema.regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });
  }

  return z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordSchema,
    userName: z.string().min(1).max(20),
    newEmail: z.string().email({ message: 'Invalid email address' }).optional(),
    newPassword: passwordSchema.optional()
  });
};

export const registerSchema = createRegisterSchema({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
});