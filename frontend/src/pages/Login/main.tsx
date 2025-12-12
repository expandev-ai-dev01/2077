import { LoginForm } from '@/domain/auth/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';

function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
          <CardDescription>Faça login para acessar seus quizzes e estatísticas</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

export { LoginPage };
