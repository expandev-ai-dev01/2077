import { z } from 'zod';

const profileOptions = ['iniciante', 'experiente'] as const;

export const registerSchema = z.object({
  username: z
    .string('Nome de usuário é obrigatório')
    .min(3, 'Nome de usuário deve ter no mínimo 3 caracteres')
    .max(30, 'Nome de usuário deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores'),
  email: z.string('Email é obrigatório').email('Email inválido'),
  password: z
    .string('Senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  profile: z.enum(profileOptions, 'Selecione um perfil válido'),
});

export const loginSchema = z.object({
  username: z.string('Nome de usuário ou email é obrigatório').min(1, 'Campo obrigatório'),
  password: z.string('Senha é obrigatória').min(1, 'Campo obrigatório'),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Nome de usuário deve ter no mínimo 3 caracteres')
    .max(30, 'Nome de usuário deve ter no máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscores')
    .optional(),
  email: z.string().email('Email inválido').optional(),
  profile: z.enum(profileOptions, 'Selecione um perfil válido').optional(),
  avatar: z.string().url('URL de avatar inválida').optional(),
});

export const requestPasswordResetSchema = z.object({
  email: z.string('Email é obrigatório').email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string('Token é obrigatório').min(1, 'Token inválido'),
  newPassword: z
    .string('Nova senha é obrigatória')
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
});

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;
export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;
export type UpdateProfileFormInput = z.input<typeof updateProfileSchema>;
export type UpdateProfileFormOutput = z.output<typeof updateProfileSchema>;
export type RequestPasswordResetFormInput = z.input<typeof requestPasswordResetSchema>;
export type RequestPasswordResetFormOutput = z.output<typeof requestPasswordResetSchema>;
export type ResetPasswordFormInput = z.input<typeof resetPasswordSchema>;
export type ResetPasswordFormOutput = z.output<typeof resetPasswordSchema>;
