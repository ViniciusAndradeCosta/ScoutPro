import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface RequireAuthProps {
  role: UserRole;
}

/**
 * Protege uma área por papel. Enquanto a sessão carrega exibe um estado de
 * carregamento; depois redireciona quem não está autenticado para a tela de
 * login correta e quem tem o papel errado para a sua própria área.
 */
export function RequireAuth({ role }: RequireAuthProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/olheiro'} replace />;
  }

  return <Outlet />;
}
