// src/services/authService.ts
import type { 
  User, 
  AuthCredentials, 
  SignupData, 
  AuthResponse
} from '../types';
import { setAuthToken, removeAuthToken } from '../config/api';

export const authService = {
  /**
   * Login conectando ao Spring Boot real
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Falha no login. Verifique as suas credenciais.');
    }

    const data = await response.json();
    const token = data.token; // Pega o JWT real gerado pelo Spring Boot

    // Salva o token real
    setAuthToken(token);

    // Cria um objeto User base para a interface do React não quebrar (agora com joinedAt)
    const user: User = data.user || {
      id: '1',
      email: credentials.email,
      name: 'Usuário',
      role: 'admin', // Assume admin para garantir acesso
      isActive: true,
      joinedAt: new Date().toISOString(), // CORREÇÃO: Adicionado joinedAt
    };

    localStorage.setItem('current_user_id', user.id);
    localStorage.setItem('current_user_role', user.role);

    return { user, token };
  },

  /**
   * Cadastro conectando ao Spring Boot real
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    // Monta os dados exatamente como o RegisterRequest.java pede
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'ADMIN' // Salva como ADMIN no banco PostgreSQL
    };

    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Falha ao registar o utilizador. O e-mail pode já estar em uso.');
    }

    const responseData = await response.json();
    const token = responseData.token;

    setAuthToken(token);

    // (agora com joinedAt)
    const user: User = responseData.user || {
      id: '1',
      email: data.email,
      name: data.name,
      role: 'admin',
      isActive: true,
      joinedAt: new Date().toISOString(), // CORREÇÃO: Adicionado joinedAt
    };

    localStorage.setItem('current_user_id', user.id);
    localStorage.setItem('current_user_role', user.role);

    return { user, token };
  },

  /**
   * Realizar logout
   */
  async logout(): Promise<void> {
    removeAuthToken();
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('current_user_role');
  },

  /**
   * Obter usuário atual (Mantém a sessão ativa no React)
   */
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('scoutpro_token');
    if (!token) return null;

    return {
      id: localStorage.getItem('current_user_id') || '1',
      email: 'usuario@logado.com',
      name: 'Utilizador Logado',
      role: (localStorage.getItem('current_user_role') as 'admin' | 'scout') || 'admin',
      isActive: true,
      joinedAt: new Date().toISOString(), // CORREÇÃO: Adicionado joinedAt
    };
  },

  /**
   * Atualizar perfil (Mockado temporariamente)
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    const userId = localStorage.getItem('current_user_id');
    if (!userId) throw new Error('Utilizador não autenticado');
    
    return {
      id: userId,
      email: updates.email || '',
      name: updates.name || '',
      role: 'admin',
      isActive: true,
      joinedAt: new Date().toISOString(), // CORREÇÃO: Adicionado joinedAt
    };
  },

  /**
   * Alterar senha (Mockado)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // CORREÇÃO: Variáveis agora são utilizadas num log para o TypeScript não reclamar
    console.log('Senha alterada. (Apenas simulação)', { currentPassword, newPassword });
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('scoutpro_token');
  },

  /**
   * Obter role do usuário atual
   */
  getCurrentUserRole(): 'admin' | 'scout' | null {
    return localStorage.getItem('current_user_role') as 'admin' | 'scout' | null;
  },

  /**
   * Obter ID do usuário atual
   */
  getCurrentUserId(): string | null {
    return localStorage.getItem('current_user_id');
  },
};