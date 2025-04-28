import { z } from 'zod';

const createRegisterSchema = ({
  minLength = 8,
  requireUppercase = true,
  requireLowercase = true,
  requireNumber = true,
  requireSpecialChar = true,
}) => {
  let passwordSchema = z.string().min(minLength, { message: `Password must be at least ${minLength} characters long`}, { code: 'miniLength-8' });

  if (requireLowercase) {
    passwordSchema = passwordSchema.regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter'}, { code: 'noLowerCase' });
  }
  if (requireUppercase) {
    passwordSchema = passwordSchema.regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter'}, { code: 'noUpperCase' });
  }
  if (requireNumber) {
    passwordSchema = passwordSchema.regex(/[0-9]/, { message: 'Password must contain at least one number'}, { code: 'noNumber' });
  }
  if (requireSpecialChar) {
    passwordSchema = passwordSchema.regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character'} , { code: 'specialCharacter' });
  }

  return z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: passwordSchema,
  });
};

export const registerSchema = createRegisterSchema({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  });