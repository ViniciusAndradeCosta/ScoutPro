import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Shield, Target, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { login, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Garante que a rota só aceite os papéis válidos.
  if (role !== 'admin' && role !== 'scout') {
    return <Navigate to="/" replace />;
  }
  const userType: 'admin' | 'scout' = role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login({ email, password });

      // Garante que a conta corresponde à área escolhida.
      if (user.role !== userType) {
        await logout();
        setError(
          user.role === 'admin'
            ? 'Esta conta pertence a um Administrador. Volte e faça login na área correta.'
            : 'Esta conta pertence a um Olheiro. Volte e faça login na área correta.',
        );
        return;
      }

      navigate(user.role === 'admin' ? '/admin' : '/olheiro', { replace: true });
    } catch (err: any) {
      setError(err.message || 'E-mail ou senha incorretos.');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = userType === 'admin' ? Shield : Target;
  const title = userType === 'admin' ? 'Administrador' : 'Olheiro';
  const subtitle = userType === 'admin' 
    ? 'Gerencie jogadores e acompanhe relatórios' 
    : 'Avalie talentos e crie relatórios profissionais';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1677119966332-8c6e9fb0efab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBhY3Rpb258ZW58MXx8fHwxNzYwMzg5ODY5fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 bg-card/80 backdrop-blur-sm border-border">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Login como {title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-destructive/15 flex items-start gap-3 text-destructive text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background border-border"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked: boolean) => setRemember(checked)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Lembrar-me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </motion.div>
    </div>
  );
}