/**
 * @summary
 * API controller for User entity.
 * Handles user registration, authentication, and profile management.
 *
 * @module api/internal/user/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  userRegister,
  userLogin,
  userGetProfile,
  userUpdateProfile,
  userConfirmEmail,
  userRequestPasswordReset,
  userResetPassword,
} from '@/services/user';

/**
 * @api {post} /api/internal/user/register Register User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiBody {String} username Username (3-30 chars, alphanumeric and underscores)
 * @apiBody {String} email Valid email address
 * @apiBody {String} password Password (min 8 chars, uppercase, number, special char)
 * @apiBody {String} profile User profile type (iniciante | experiente)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id User UUID
 * @apiSuccess {String} data.username Username
 * @apiSuccess {String} data.email Email address
 * @apiSuccess {String} data.profile Profile type
 * @apiSuccess {String} data.status Account status (pendente)
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | DUPLICATE_USERNAME | DUPLICATE_EMAIL)
 * @apiError {String} error.message Error message
 */
export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userRegister(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/user/login Login User
 * @apiName LoginUser
 * @apiGroup User
 *
 * @apiBody {String} username Username or email
 * @apiBody {String} password Password
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id User UUID
 * @apiSuccess {String} data.username Username
 * @apiSuccess {String} data.email Email address
 * @apiSuccess {String} data.profile Profile type
 * @apiSuccess {String} data.token JWT authentication token
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (INVALID_CREDENTIALS | ACCOUNT_BLOCKED | ACCOUNT_PENDING)
 * @apiError {String} error.message Error message
 */
export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await userLogin(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/user/profile Get User Profile
 * @apiName GetUserProfile
 * @apiGroup User
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id User UUID
 * @apiSuccess {String} data.username Username
 * @apiSuccess {String} data.email Email address
 * @apiSuccess {String} data.profile Profile type
 * @apiSuccess {String|null} data.avatar Avatar URL
 * @apiSuccess {String} data.status Account status
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | UNAUTHORIZED)
 * @apiError {String} error.message Error message
 */
export async function getProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userGetProfile(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/user/profile Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup User
 *
 * @apiBody {String} [username] Username (3-30 chars)
 * @apiBody {String} [email] Email address
 * @apiBody {String} [profile] Profile type (iniciante | experiente)
 * @apiBody {String} [avatar] Avatar URL
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id User UUID
 * @apiSuccess {String} data.username Username
 * @apiSuccess {String} data.email Email address
 * @apiSuccess {String} data.profile Profile type
 * @apiSuccess {String|null} data.avatar Avatar URL
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | DUPLICATE_USERNAME | DUPLICATE_EMAIL)
 * @apiError {String} error.message Error message
 */
export async function updateProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userUpdateProfile(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/user/confirm-email Confirm Email
 * @apiName ConfirmEmail
 * @apiGroup User
 *
 * @apiBody {String} token Email confirmation token
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (INVALID_TOKEN | TOKEN_EXPIRED)
 * @apiError {String} error.message Error message
 */
export async function confirmEmailHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userConfirmEmail(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/user/request-password-reset Request Password Reset
 * @apiName RequestPasswordReset
 * @apiGroup User
 *
 * @apiBody {String} email Email address
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND)
 * @apiError {String} error.message Error message
 */
export async function requestPasswordResetHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userRequestPasswordReset(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/user/reset-password Reset Password
 * @apiName ResetPassword
 * @apiGroup User
 *
 * @apiBody {String} token Password reset token
 * @apiBody {String} newPassword New password (min 8 chars, uppercase, number, special char)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (INVALID_TOKEN | TOKEN_EXPIRED | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function resetPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userResetPassword(req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
