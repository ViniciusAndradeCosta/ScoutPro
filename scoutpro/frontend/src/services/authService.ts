// src/services/authService.ts
import type {
  User,
  UserRole,
  AuthCredentials,
  SignupData,
  AuthResponse,
} from '../types';
import {
  API_ENDPOINTS,
  apiRequest,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from '../config/api';

/**
 * Serviço de autenticação — conversa diretamente com o backend Spring Boot.
 *
 * Contrato real do backend:
 *  - POST /auth/login e /auth/register retornam apenas { token }.
 *  - GET  /users/me retorna o usuário autenticado (com role "ADMIN"/"SCOUT").
 */

/** Converte a role vinda do backend ("ADMIN"/"SCOUT"/"ROLE_ADMIN") para o tipo do front. */
function normalizeRole(role: unknown): UserRole {
  return String(role ?? '').toUpperCase().includes('ADMIN') ? 'admin' : 'scout';
}

/** Mapeia a resposta de /users/me para o tipo User do frontend. */
function mapUser(data: any): User {
  return {
    id: String(data.id ?? ''),
    email: data.email ?? '',
    name: data.name ?? '',
    role: normalizeRole(data.role),
    avatar: data.image ?? undefined,
    phone: data.phone ?? undefined,
    bio: data.bio ?? undefined,
    specialization: data.specialization ?? undefined,
    joinedAt: data.joinedAt ?? '',
    isActive: data.isActive ?? true,
  };
}

/** Persiste dados auxiliares usados por outros serviços (ex.: messageService). */
function rememberUser(user: User): void {
  localStorage.setItem('current_user_id', user.id);
  localStorage.setItem('current_user_role', user.role);
}

export const authService = {
  /** Busca o usuário autenticado no backend a partir do token salvo. */
  async getCurrentUser(): Promise<User | null> {
    if (!getAuthToken()) return null;
    const data = await apiRequest<any>(API_ENDPOINTS.USERS.ME, { method: 'GET' });
    const user = mapUser(data);
    rememberUser(user);
    return user;
  },

  /** Realiza login: obtém o token e carrega o perfil real. */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const data = await apiRequest<{ token: string }>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: credentials,
    });

    if (!data?.token) {
      throw new Error('O servidor não retornou um token de acesso.');
    }

    setAuthToken(data.token);
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Não foi possível carregar o perfil do usuário.');

    return { user, token: data.token };
  },

  /** Realiza o cadastro e já autentica o usuário. */
  async signup(payload: SignupData): Promise<AuthResponse> {
    const data = await apiRequest<{ token: string }>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role.toUpperCase(),
      },
    });

    // Alguns backends não devolvem token no register; nesse caso, faz login.
    let token = data?.token;
    if (!token) {
      const login = await this.login({ email: payload.email, password: payload.password });
      return login;
    }

    setAuthToken(token);
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Não foi possível carregar o perfil do usuário.');

    return { user, token };
  },

  /** Encerra a sessão local. */
  async logout(): Promise<void> {
    removeAuthToken();
    localStorage.removeItem('current_user_id');
    localStorage.removeItem('current_user_role');
  },

  /** Atualiza o perfil e retorna o usuário recarregado. */
  async updateProfile(updates: Partial<User>): Promise<User> {
    await apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, {
      method: 'PUT',
      body: {
        name: updates.name,
        phone: updates.phone,
        bio: updates.bio,
        image: updates.avatar,
      },
    });
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Não foi possível recarregar o perfil.');
    return user;
  },

  /** Altera a senha do usuário autenticado. */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiRequest(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },

  /** Indica se há um token salvo. */
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },

  getCurrentUserRole(): UserRole | null {
    return (localStorage.getItem('current_user_role') as UserRole) || null;
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem('current_user_id');
  },
};
