import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthCredentials, SignupData } from '../types';
import { authService } from '../services/authService';

/**
 * Contexto de Autenticação
 * 
 * Gerencia o estado de autenticação da aplicação de forma centralizada.
 * Fornece funções para login, logout, signup e atualização de perfil.
 */

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário ao iniciar a aplicação
  useEffect(() => {
    loadUser();
  }, []);

  /**
   * Carrega o usuário atual do backend
   */
  async function loadUser() {
    try {
      setIsLoading(true);
      
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      // Se houver erro, limpar autenticação
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Realizar login
   */
  async function login(credentials: AuthCredentials) {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Realizar cadastro
   */
  async function signup(data: SignupData) {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Realizar logout
   */
  async function logout() {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async function updateProfile(updates: Partial<User>) {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Recarregar dados do usuário
   */
  async function refreshUser() {
    await loadUser();
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

/**
 * Hook para verificar se o usuário tem uma role específica
 */
export function useRole(requiredRole: 'admin' | 'scout') {
  const { user } = useAuth();
  return user?.role === requiredRole;
}

/**
 * Hook para obter informações do usuário atual
 */
export function useCurrentUser() {
  const { user } = useAuth();
  return user;
}
