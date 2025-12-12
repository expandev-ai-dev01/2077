/**
 * @summary
 * Type definitions for User entity.
 *
 * @module services/user/userTypes
 */

/**
 * @interface UserEntity
 * @description Represents a user entity in the system
 *
 * @property {string} id - Unique user identifier (UUID)
 * @property {string} username - Username (3-30 chars)
 * @property {string} email - Email address
 * @property {string} passwordHash - Hashed password
 * @property {string} profile - User profile type (iniciante | experiente | administrador)
 * @property {string | null} avatar - Avatar URL (optional)
 * @property {string} status - Account status (ativo | inativo | bloqueado | pendente)
 * @property {number} loginAttempts - Failed login attempts counter
 * @property {string | null} lastLoginAttempt - Last login attempt timestamp
 * @property {string} dateCreated - Creation timestamp
 * @property {string} dateModified - Last modification timestamp
 */
export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  profile: 'iniciante' | 'experiente' | 'administrador';
  avatar: string | null;
  status: 'ativo' | 'inativo' | 'bloqueado' | 'pendente';
  loginAttempts: number;
  lastLoginAttempt: string | null;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface UserRegisterRequest
 * @description Request payload for user registration
 */
export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  profile: 'iniciante' | 'experiente';
}

/**
 * @interface UserLoginRequest
 * @description Request payload for user login
 */
export interface UserLoginRequest {
  username: string;
  password: string;
}

/**
 * @interface UserUpdateRequest
 * @description Request payload for updating user profile
 */
export interface UserUpdateRequest {
  username?: string;
  email?: string;
  profile?: 'iniciante' | 'experiente';
  avatar?: string;
}

/**
 * @interface UserProfileResponse
 * @description Response structure for user profile
 */
export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  profile: string;
  avatar: string | null;
  status: string;
  dateCreated: string;
}

/**
 * @interface UserLoginResponse
 * @description Response structure for user login
 */
export interface UserLoginResponse {
  id: string;
  username: string;
  email: string;
  profile: string;
  token: string;
}
