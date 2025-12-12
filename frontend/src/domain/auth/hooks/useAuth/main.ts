import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type {
  RegisterFormOutput,
  LoginFormOutput,
  UpdateProfileFormOutput,
  RequestPasswordResetFormOutput,
  ResetPasswordFormOutput,
} from '../../validations/auth';
import { useAuthStore } from '../../stores/authStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { user, setUser, clearUser } = useAuthStore();

  const { mutateAsync: register, isPending: isRegistering } = useMutation({
    mutationFn: (data: RegisterFormOutput) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const { mutateAsync: login, isPending: isLoggingIn } = useMutation({
    mutationFn: (credentials: LoginFormOutput) => authService.login(credentials),
    onSuccess: (data) => {
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        profile: data.profile,
        status: 'ativo',
        dateCreated: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => (user?.id ? authService.getProfile(user.id) : null),
    enabled: !!user?.id,
  });

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (data: UpdateProfileFormOutput) => {
      if (!user?.id) throw new Error('User not authenticated');
      return authService.updateProfile(user.id, data);
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });

  const { mutateAsync: confirmEmail, isPending: isConfirmingEmail } = useMutation({
    mutationFn: (token: string) => authService.confirmEmail(token),
  });

  const { mutateAsync: requestPasswordReset, isPending: isRequestingReset } = useMutation({
    mutationFn: (data: RequestPasswordResetFormOutput) => authService.requestPasswordReset(data),
  });

  const { mutateAsync: resetPassword, isPending: isResettingPassword } = useMutation({
    mutationFn: (data: ResetPasswordFormOutput) => authService.resetPassword(data),
  });

  const logout = () => {
    authService.logout();
    clearUser();
    queryClient.clear();
  };

  return {
    user,
    profile,
    isLoadingProfile,
    register,
    isRegistering,
    login,
    isLoggingIn,
    updateProfile,
    isUpdatingProfile,
    confirmEmail,
    isConfirmingEmail,
    requestPasswordReset,
    isRequestingReset,
    resetPassword,
    isResettingPassword,
    logout,
    isAuthenticated: !!user,
  };
};
