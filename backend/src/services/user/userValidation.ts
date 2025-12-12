/**
 * @summary
 * Validation schemas for User entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/user/userValidation
 */

import { z } from 'zod';

/**
 * Username validation schema
 * - Min 3 characters
 * - Max 30 characters
 * - Only alphanumeric and underscores
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 * - Min 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Profile type validation schema
 */
export const profileSchema = z.enum(['iniciante', 'experiente', 'administrador']);

/**
 * User registration schema
 */
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  profile: z.enum(['iniciante', 'experiente']),
});

/**
 * User login schema
 */
export const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * User update schema
 */
export const updateSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  profile: z.enum(['iniciante', 'experiente']).optional(),
  avatar: z.string().url('Invalid avatar URL').nullable().optional(),
});

/**
 * ID parameter validation schema
 */
export const paramsSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

/**
 * Email confirmation schema
 */
export const confirmEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * Password reset request schema
 */
export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});

/**
 * Inferred types from schemas
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
export type ConfirmEmailInput = z.infer<typeof confirmEmailSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
