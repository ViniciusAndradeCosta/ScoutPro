import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { ArrowLeft, Shield, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [userType, setUserType] = useState<'admin' | 'scout'>('scout');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const user = await signup({ name, email, password, role: userType });
      toast.success('Cadastro realizado com sucesso!');
      navigate(user.role === 'admin' ? '/admin' : '/olheiro', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta. O e-mail já pode estar em uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
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
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card className="p-8 bg-card/80 backdrop-blur-sm border-border">
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent items-center justify-center mb-4">
              {userType === 'admin' ? (
                <Shield className="w-8 h-8 text-background" />
              ) : (
                <Target className="w-8 h-8 text-background" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">Criar Conta</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Tipo de Conta</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('scout')}
                  disabled={isLoading}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'scout'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/60'
                  }`}
                >
                  <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Olheiro</p>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  disabled={isLoading}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    userType === 'admin'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/60'
                  }`}
                >
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Admin</p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input-background border-border"
                required
                disabled={isLoading}
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background border-border"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input-background border-border"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Criando Conta...' : 'Criar Conta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={() => navigate(`/login/${userType}`)}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Faça login
              </button>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}