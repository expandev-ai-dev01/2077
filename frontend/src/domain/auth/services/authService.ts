/**
 * @service AuthService
 * @domain auth
 * @type REST
 *
 * Authentication service for user registration, login, and profile management.
 */

import { publicClient, authenticatedClient } from '@/core/lib/api';
import type { User, AuthResponse } from '../types/user';
import type {
  RegisterFormOutput,
  LoginFormOutput,
  UpdateProfileFormOutput,
  RequestPasswordResetFormOutput,
  ResetPasswordFormOutput,
} from '../validations/auth';

export const authService = {
  async register(data: RegisterFormOutput): Promise<User> {
    const response = await publicClient.post('/user/register', data);
    return response.data.data;
  },

  async login(credentials: LoginFormOutput): Promise<AuthResponse> {
    const response = await publicClient.post('/user/login', credentials);
    const authData = response.data.data;
    if (authData.token) {
      localStorage.setItem('auth_token', authData.token);
    }
    return authData;
  },

  async getProfile(userId: string): Promise<User> {
    const response = await authenticatedClient.get(`/user/profile/${userId}`);
    return response.data.data;
  },

  async updateProfile(userId: string, data: UpdateProfileFormOutput): Promise<User> {
    const response = await authenticatedClient.put(`/user/profile/${userId}`, data);
    return response.data.data;
  },

  async confirmEmail(token: string): Promise<{ message: string }> {
    const response = await publicClient.post('/user/confirm-email', { token });
    return response.data.data;
  },

  async requestPasswordReset(data: RequestPasswordResetFormOutput): Promise<{ message: string }> {
    const response = await publicClient.post('/user/request-password-reset', data);
    return response.data.data;
  },

  async resetPassword(data: ResetPasswordFormOutput): Promise<{ message: string }> {
    const response = await publicClient.post('/user/reset-password', data);
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
  },
};
