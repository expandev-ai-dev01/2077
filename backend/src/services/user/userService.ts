/**
 * @summary
 * Business logic for User entity.
 * Handles user registration, authentication, and profile management.
 * All validation and business logic is centralized here.
 *
 * @module services/user/userService
 */

import { userStore } from '@/instances';
import { ServiceError } from '@/utils';
import { UserEntity, UserProfileResponse, UserLoginResponse } from './userTypes';
import {
  registerSchema,
  loginSchema,
  updateSchema,
  paramsSchema,
  confirmEmailSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from './userValidation';
import { hashPassword, comparePassword, generateToken } from '@/utils/auth';

/**
 * @summary
 * Registers a new user in the system.
 *
 * @function userRegister
 * @module services/user
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<UserProfileResponse>} The newly created user profile
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} DUPLICATE_USERNAME (409) - When username already exists
 * @throws {ServiceError} DUPLICATE_EMAIL (409) - When email already exists
 */
export async function userRegister(body: unknown): Promise<UserProfileResponse> {
  const validation = registerSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Check for duplicate username
  if (userStore.findByUsername(params.username)) {
    throw new ServiceError('DUPLICATE_USERNAME', 'Username already exists', 409);
  }

  // Check for duplicate email
  if (userStore.findByEmail(params.email)) {
    throw new ServiceError('DUPLICATE_EMAIL', 'Email already exists', 409);
  }

  const now = new Date().toISOString();
  const id = userStore.generateId();
  const passwordHash = await hashPassword(params.password);

  const newUser: UserEntity = {
    id,
    username: params.username,
    email: params.email,
    passwordHash,
    profile: params.profile,
    avatar: null,
    status: 'pendente',
    loginAttempts: 0,
    lastLoginAttempt: null,
    dateCreated: now,
    dateModified: now,
  };

  userStore.add(newUser);

  // TODO: Send email confirmation (integration pending)

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    profile: newUser.profile,
    avatar: newUser.avatar,
    status: newUser.status,
    dateCreated: newUser.dateCreated,
  };
}

/**
 * @summary
 * Authenticates a user and returns a JWT token.
 *
 * @function userLogin
 * @module services/user
 *
 * @param {unknown} body - Raw request body to validate
 * @returns {Promise<UserLoginResponse>} User profile with authentication token
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails validation
 * @throws {ServiceError} INVALID_CREDENTIALS (401) - When credentials are incorrect
 * @throws {ServiceError} ACCOUNT_PENDING (403) - When account email is not confirmed
 * @throws {ServiceError} ACCOUNT_BLOCKED (403) - When account is blocked
 */
export async function userLogin(body: unknown): Promise<UserLoginResponse> {
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;

  // Find user by username or email
  const user = userStore.findByUsername(params.username) || userStore.findByEmail(params.username);

  if (!user) {
    throw new ServiceError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
  }

  // Check if account is blocked
  if (user.status === 'bloqueado') {
    const blockTime = user.lastLoginAttempt ? new Date(user.lastLoginAttempt).getTime() : 0;
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    if (now - blockTime < thirtyMinutes) {
      throw new ServiceError(
        'ACCOUNT_BLOCKED',
        'Account is temporarily blocked. Try again later or reset your password',
        403
      );
    } else {
      // Unblock account after 30 minutes
      userStore.update(user.id, {
        status: 'ativo',
        loginAttempts: 0,
        lastLoginAttempt: null,
      });
    }
  }

  // Check if account is pending email confirmation
  if (user.status === 'pendente') {
    throw new ServiceError('ACCOUNT_PENDING', 'Please confirm your email before logging in', 403);
  }

  // Verify password
  const isPasswordValid = await comparePassword(params.password, user.passwordHash);

  if (!isPasswordValid) {
    // Increment login attempts
    const newAttempts = user.loginAttempts + 1;
    const now = new Date().toISOString();

    if (newAttempts >= 3) {
      // Block account after 3 failed attempts
      userStore.update(user.id, {
        loginAttempts: newAttempts,
        lastLoginAttempt: now,
        status: 'bloqueado',
      });
      throw new ServiceError(
        'ACCOUNT_BLOCKED',
        'Account blocked due to multiple failed login attempts. Try again in 30 minutes',
        403
      );
    } else {
      userStore.update(user.id, {
        loginAttempts: newAttempts,
        lastLoginAttempt: now,
      });
      throw new ServiceError('INVALID_CREDENTIALS', 'Invalid username or password', 401);
    }
  }

  // Reset login attempts on successful login
  userStore.update(user.id, {
    loginAttempts: 0,
    lastLoginAttempt: null,
  });

  // Generate JWT token
  const token = generateToken({
    id: user.id,
    username: user.username,
    profile: user.profile,
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: user.profile,
    token,
  };
}

/**
 * @summary
 * Retrieves a user profile by ID.
 *
 * @function userGetProfile
 * @module services/user
 *
 * @param {unknown} params - Raw request params containing user ID
 * @returns {Promise<UserProfileResponse>} User profile data
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When user does not exist
 */
export async function userGetProfile(params: unknown): Promise<UserProfileResponse> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid user ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const user = userStore.getById(id);

  if (!user) {
    throw new ServiceError('NOT_FOUND', 'User not found', 404);
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: user.profile,
    avatar: user.avatar,
    status: user.status,
    dateCreated: user.dateCreated,
  };
}

/**
 * @summary
 * Updates a user profile.
 *
 * @function userUpdateProfile
 * @module services/user
 *
 * @param {unknown} params - Raw request params containing user ID
 * @param {unknown} body - Raw request body with update data
 * @returns {Promise<UserProfileResponse>} Updated user profile
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} NOT_FOUND (404) - When user does not exist
 * @throws {ServiceError} DUPLICATE_USERNAME (409) - When username already exists
 * @throws {ServiceError} DUPLICATE_EMAIL (409) - When email already exists
 */
export async function userUpdateProfile(
  params: unknown,
  body: unknown
): Promise<UserProfileResponse> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Invalid user ID',
      400,
      paramsValidation.error.errors
    );
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const updateData = bodyValidation.data;

  const user = userStore.getById(id);

  if (!user) {
    throw new ServiceError('NOT_FOUND', 'User not found', 404);
  }

  // Check for duplicate username if changing
  if (updateData.username && updateData.username !== user.username) {
    const existingUser = userStore.findByUsername(updateData.username);
    if (existingUser) {
      throw new ServiceError('DUPLICATE_USERNAME', 'Username already exists', 409);
    }
  }

  // Check for duplicate email if changing
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = userStore.findByEmail(updateData.email);
    if (existingUser) {
      throw new ServiceError('DUPLICATE_EMAIL', 'Email already exists', 409);
    }
  }

  const updated = userStore.update(id, {
    ...updateData,
    dateModified: new Date().toISOString(),
  });

  return {
    id: updated!.id,
    username: updated!.username,
    email: updated!.email,
    profile: updated!.profile,
    avatar: updated!.avatar,
    status: updated!.status,
    dateCreated: updated!.dateCreated,
  };
}

/**
 * @summary
 * Confirms user email with token.
 *
 * @function userConfirmEmail
 * @module services/user
 *
 * @param {unknown} body - Raw request body containing confirmation token
 * @returns {Promise<{ message: string }>} Confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When token is invalid
 * @throws {ServiceError} INVALID_TOKEN (400) - When token does not match any user
 */
export async function userConfirmEmail(body: unknown): Promise<{ message: string }> {
  const validation = confirmEmailSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid token', 400, validation.error.errors);
  }

  // TODO: Implement token verification logic
  // For now, simplified implementation
  throw new ServiceError('INVALID_TOKEN', 'Email confirmation not yet implemented', 400);
}

/**
 * @summary
 * Requests a password reset for a user.
 *
 * @function userRequestPasswordReset
 * @module services/user
 *
 * @param {unknown} body - Raw request body containing email
 * @returns {Promise<{ message: string }>} Confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When email is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When user does not exist
 */
export async function userRequestPasswordReset(body: unknown): Promise<{ message: string }> {
  const validation = requestPasswordResetSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid email', 400, validation.error.errors);
  }

  const { email } = validation.data;
  const user = userStore.findByEmail(email);

  if (!user) {
    throw new ServiceError('NOT_FOUND', 'User not found', 404);
  }

  // TODO: Send password reset email (integration pending)

  return { message: 'Password reset email sent' };
}

/**
 * @summary
 * Resets user password with token.
 *
 * @function userResetPassword
 * @module services/user
 *
 * @param {unknown} body - Raw request body containing token and new password
 * @returns {Promise<{ message: string }>} Confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} INVALID_TOKEN (400) - When token is invalid
 */
export async function userResetPassword(body: unknown): Promise<{ message: string }> {
  const validation = resetPasswordSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  // TODO: Implement token verification and password reset logic
  throw new ServiceError('INVALID_TOKEN', 'Password reset not yet implemented', 400);
}
