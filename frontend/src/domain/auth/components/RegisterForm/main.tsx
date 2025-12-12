import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { registerSchema } from '../../validations/auth';
import type { RegisterFormInput, RegisterFormOutput } from '../../validations/auth';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { toast } from 'sonner';
import { useNavigation } from '@/core/hooks/useNavigation';

function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const { navigate } = useNavigation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInput, any, RegisterFormOutput>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      profile: 'iniciante',
    },
  });

  const onSubmit = async (data: RegisterFormOutput) => {
    try {
      const sanitizedData = {
        ...data,
        username: DOMPurify.sanitize(data.username),
        email: DOMPurify.sanitize(data.email),
      };

      await registerUser(sanitizedData);
      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar.');
      navigate('/login');
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || 'Erro ao realizar cadastro';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Nome de Usuário</Label>
        <Input
          id="username"
          {...register('username')}
          aria-invalid={!!errors.username}
          placeholder="Digite seu nome de usuário"
        />
        {errors.username && (
          <span className="text-destructive text-sm">{errors.username.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          placeholder="Digite seu email"
        />
        {errors.email && <span className="text-destructive text-sm">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          aria-invalid={!!errors.password}
          placeholder="Digite sua senha"
        />
        {errors.password && (
          <span className="text-destructive text-sm">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="profile">Perfil</Label>
        <Select
          onValueChange={(value) => setValue('profile', value as 'iniciante' | 'experiente')}
          defaultValue="iniciante"
        >
          <SelectTrigger id="profile" aria-invalid={!!errors.profile}>
            <SelectValue placeholder="Selecione seu perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="iniciante">Iniciante</SelectItem>
            <SelectItem value="experiente">Experiente</SelectItem>
          </SelectContent>
        </Select>
        {errors.profile && (
          <span className="text-destructive text-sm">{errors.profile.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isRegistering} className="w-full">
        {isRegistering ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  );
}

export { RegisterForm };
