import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/icons/logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-fit">
         <Logo className="h-16 w-16" />
        </div>
        <CardTitle className="font-headline text-3xl">Bienvenido</CardTitle>
        <CardDescription>Inicie sesión para gestionar sus resultados médicos.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
