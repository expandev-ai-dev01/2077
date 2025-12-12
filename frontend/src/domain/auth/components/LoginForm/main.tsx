import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import { loginSchema } from '../../validations/auth';
import type { LoginFormInput, LoginFormOutput } from '../../validations/auth';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';
import { Label } from '@/core/components/label';
import { toast } from 'sonner';
import { useNavigation } from '@/core/hooks/useNavigation';

function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const { navigate } = useNavigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput, any, LoginFormOutput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormOutput) => {
    try {
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        password: data.password,
      };

      await login(sanitizedData);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || 'Erro ao realizar login';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Nome de Usuário ou Email</Label>
        <Input
          id="username"
          {...register('username')}
          aria-invalid={!!errors.username}
          placeholder="Digite seu nome de usuário ou email"
        />
        {errors.username && (
          <span className="text-destructive text-sm">{errors.username.message}</span>
        )}
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

      <Button type="submit" disabled={isLoggingIn} className="w-full">
        {isLoggingIn ? 'Entrando...' : 'Entrar'}
      </Button>

      <div className="flex flex-col gap-2 text-center text-sm">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-primary hover:underline"
        >
          Esqueceu sua senha?
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-muted-foreground hover:text-foreground"
        >
          Não tem uma conta? Cadastre-se
        </button>
      </div>
    </form>
  );
}

export { LoginForm };
