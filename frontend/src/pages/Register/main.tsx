import { RegisterForm } from '@/domain/auth/components/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/card';

function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para começar a testar seus conhecimentos sobre Naruto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}

export { RegisterPage };
