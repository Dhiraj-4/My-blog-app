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
    newPassword: passwordSchema
  });
};

export const zodPasswordSchema = createRegisterSchema({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
});