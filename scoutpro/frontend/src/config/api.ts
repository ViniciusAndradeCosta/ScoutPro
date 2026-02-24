/**
 * Configuração centralizada da API
 */

// ============================================
// CONFIGURAÇÕES DE API
// ============================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// ============================================
// ENDPOINTS DA API
// ============================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/password',
  },
  
  PLAYERS: {
    LIST: '/athletes',
    GET: (id: string) => `/athletes/${id}`,
    CREATE: '/athletes',
    UPDATE: (id: string) => `/athletes/${id}`,
    DELETE: (id: string) => `/athletes/${id}`,
    STATS: '/athletes/stats',
    SEARCH: '/athletes/search',
  },
  
  REPORTS: {
    LIST: '/reports',
    GET: (id: string) => `/reports/${id}`,
    CREATE: '/reports',
    UPDATE: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    BY_PLAYER: (playerId: string) => `/reports/player/${playerId}`,
    BY_SCOUT: (scoutId: string) => `/reports/scout/${scoutId}`,
    UPDATE_STATUS: (id: string) => `/reports/${id}/status`,
  },
  
  MESSAGES: {
    LIST: '/messages',
    GET: (id: string) => `/messages/${id}`,
    SEND: '/messages',
    CONVERSATIONS: '/messages/conversations',
    WITH_USER: (userId: string) => `/messages/conversation/${userId}`,
    MARK_READ: (id: string) => `/messages/${id}/read`,
    UNREAD_COUNT: '/messages/unread-count',
  },
  
  NOTIFICATIONS: {
    LIST: '/notifications',
    GET: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    UNREAD_COUNT: '/notifications/unread-count',
    DELETE: (id: string) => `/notifications/${id}`,
  },
  
  SCOUTS: {
    LIST: '/scouts',
    GET: (id: string) => `/scouts/${id}`,
    CREATE: '/scouts',
    UPDATE: (id: string) => `/scouts/${id}`,
    DELETE: (id: string) => `/scouts/${id}`,
    STATS: (id: string) => `/scouts/${id}/stats`,
  },
  
  ACTIVITIES: {
    LIST: '/activities',
    RECENT: '/activities/recent',
  },
  
  DASHBOARD: {
    STATS: '/dashboard/stats',
    ADMIN_STATS: '/dashboard/admin/stats',
    SCOUT_STATS: '/dashboard/scout/stats',
  },
};

// ============================================
// FUNÇÃO HELPER PARA FAZER REQUISIÇÕES
// ============================================

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = config;
  
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  const token = localStorage.getItem('scoutpro_token');
  
  const requestHeaders: Record<string, string> = {
    ...API_CONFIG.HEADERS,
    ...headers,
  };
  
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'omit',
  };
  
  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Fallback para o erro padrão
      }
      throw new Error(errorMessage);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
    
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// ============================================
// FUNÇÃO PARA CONFIGURAR TOKEN
// ============================================

export function setAuthToken(token: string): void {
  localStorage.setItem('scoutpro_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('scoutpro_token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('scoutpro_token');
}