import type { 
  User,
  Activity,
  DashboardStats,
} from '../types';
import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Serviço de Scouts (Admin only)
 */

// ============================================
// DADOS MOCKADOS
// ============================================

const MOCK_SCOUTS: User[] = [
  {
    id: '2',
    email: 'scout@scout.com',
    name: 'Carlos Scout',
    role: 'scout',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=scout',
    phone: '+55 11 99999-2222',
    bio: 'Scout especializado em jovens talentos',
    specialization: 'Meio-campistas ofensivos',
    joinedAt: '2023-03-10T00:00:00Z',
    isActive: true,
  },
  {
    id: '3',
    email: 'maria.scout@scout.com',
    name: 'Maria Oliveira',
    role: 'scout',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    phone: '+55 11 99999-3333',
    bio: 'Scout com experiência em Europa',
    specialization: 'Atacantes e pontas',
    joinedAt: '2023-05-20T00:00:00Z',
    isActive: true,
  },
  {
    id: '4',
    email: 'joao.scout@scout.com',
    name: 'João Pedro',
    role: 'scout',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    phone: '+55 11 99999-4444',
    bio: 'Scout focado em categorias de base',
    specialization: 'Defensores',
    joinedAt: '2023-08-15T00:00:00Z',
    isActive: true,
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'report_submitted',
    userId: '2',
    userName: 'Carlos Scout',
    userRole: 'scout',
    description: 'Enviou relatório sobre João Silva',
    metadata: {
      playerId: '1',
      playerName: 'João Silva',
      reportId: '1',
    },
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '2',
    type: 'player_added',
    userId: '1',
    userName: 'Carlos Administrador',
    userRole: 'admin',
    description: 'Adicionou novo jogador Gabriel Santos',
    metadata: {
      playerId: '5',
      playerName: 'Gabriel Santos',
    },
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    type: 'report_reviewed',
    userId: '1',
    userName: 'Carlos Administrador',
    userRole: 'admin',
    description: 'Aprovou relatório sobre João Silva',
    metadata: {
      reportId: '1',
      playerId: '1',
      playerName: 'João Silva',
    },
    createdAt: '2024-02-20T11:00:00Z',
  },
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// SERVIÇO DE SCOUTS
// ============================================

export const scoutService = {
  /**
   * Listar todos os scouts
   */
  async getScouts(): Promise<User[]> {
    await delay(400);
    
    // MODO MOCK
    return [...MOCK_SCOUTS];
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<User[]>(API_ENDPOINTS.SCOUTS.LIST);
  },

  /**
   * Obter scout por ID
   */
  async getScoutById(id: string): Promise<User | null> {
    await delay(300);
    
    // MODO MOCK
    const scout = MOCK_SCOUTS.find(s => s.id === id);
    return scout || null;
    
    // MODO BACKEND (Descomentar quando integrar)
    // try {
    //   return await apiRequest<User>(API_ENDPOINTS.SCOUTS.GET(id));
    // } catch (error) {
    //   return null;
    // }
  },

  /**
   * Criar novo scout
   */
  async createScout(data: {
    email: string;
    name: string;
    phone?: string;
    bio?: string;
    specialization?: string;
  }): Promise<User> {
    await delay(800);
    
    // MODO MOCK
    const newScout: User = {
      id: `${Date.now()}`,
      ...data,
      role: 'scout',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      joinedAt: new Date().toISOString(),
      isActive: true,
    };
    
    MOCK_SCOUTS.push(newScout);
    return newScout;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<User>(
    //   API_ENDPOINTS.SCOUTS.CREATE,
    //   {
    //     method: 'POST',
    //     body: data,
    //   }
    // );
  },

  /**
   * Atualizar scout
   */
  async updateScout(id: string, data: Partial<User>): Promise<User> {
    await delay(600);
    
    // MODO MOCK
    const index = MOCK_SCOUTS.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Scout não encontrado');
    }
    
    const updatedScout = {
      ...MOCK_SCOUTS[index],
      ...data,
    };
    
    MOCK_SCOUTS[index] = updatedScout;
    return updatedScout;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<User>(
    //   API_ENDPOINTS.SCOUTS.UPDATE(id),
    //   {
    //     method: 'PUT',
    //     body: data,
    //   }
    // );
  },

  /**
   * Deletar scout
   */
  async deleteScout(id: string): Promise<void> {
    await delay(500);
    
    // MODO MOCK
    const index = MOCK_SCOUTS.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Scout não encontrado');
    }
    
    MOCK_SCOUTS.splice(index, 1);
    
    // MODO BACKEND (Descomentar quando integrar)
    // await apiRequest(
    //   API_ENDPOINTS.SCOUTS.DELETE(id),
    //   {
    //     method: 'DELETE',
    //   }
    // );
  },

  /**
   * Obter estatísticas de um scout
   */
  async getScoutStats(id: string): Promise<{
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
    rejectedReports: number;
    playersEvaluated: number;
    averageRating: number;
  }> {
    await delay(400);
    
    // MODO MOCK
    // Em produção, esses dados viriam do backend
    return {
      totalReports: 15,
      approvedReports: 12,
      pendingReports: 2,
      rejectedReports: 1,
      playersEvaluated: 10,
      averageRating: 8.2,
    };
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest(API_ENDPOINTS.SCOUTS.STATS(id));
  },

  /**
   * Desativar/Ativar scout
   */
  async toggleScoutStatus(id: string, isActive: boolean): Promise<User> {
    await delay(400);
    
    // MODO MOCK
    const index = MOCK_SCOUTS.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error('Scout não encontrado');
    }
    
    MOCK_SCOUTS[index].isActive = isActive;
    return MOCK_SCOUTS[index];
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<User>(
    //   API_ENDPOINTS.SCOUTS.UPDATE(id),
    //   {
    //     method: 'PATCH',
    //     body: { isActive },
    //   }
    // );
  },

  /**
   * Obter dados mockados
   */
  getMockScouts(): User[] {
    return [...MOCK_SCOUTS];
  },
};

// ============================================
// SERVIÇO DE ATIVIDADES
// ============================================

export const activityService = {
  /**
   * Obter atividades recentes
   */
  async getRecentActivities(limit: number = 20): Promise<Activity[]> {
    await delay(300);
    
    // MODO MOCK
    return MOCK_ACTIVITIES
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Activity[]>(
    //   API_ENDPOINTS.ACTIVITIES.RECENT,
    //   {
    //     method: 'GET',
    //     params: { limit },
    //   }
    // );
  },

  /**
   * Obter todas as atividades
   */
  async getActivities(page: number = 1, pageSize: number = 20): Promise<Activity[]> {
    await delay(400);
    
    // MODO MOCK
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return MOCK_ACTIVITIES
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(start, end);
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Activity[]>(
    //   API_ENDPOINTS.ACTIVITIES.LIST,
    //   {
    //     method: 'GET',
    //     params: { page, pageSize },
    //   }
    // );
  },

  /**
   * Obter dados mockados
   */
  getMockActivities(): Activity[] {
    return [...MOCK_ACTIVITIES];
  },
};

// ============================================
// SERVIÇO DE DASHBOARD
// ============================================

export const dashboardService = {
  /**
   * Obter estatísticas do dashboard (Admin)
   */
  async getAdminStats(): Promise<DashboardStats> {
    await delay(400);
    
    // MODO MOCK
    return {
      totalPlayers: 5,
      totalReports: 15,
      activeScouts: 3,
      pendingReports: 2,
      playersThisMonth: 2,
      reportsThisMonth: 8,
      playersInHigh: 2,
      playersInLow: 1,
    };
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<DashboardStats>(
    //   API_ENDPOINTS.DASHBOARD.ADMIN_STATS
    // );
  },

  /**
   * Obter estatísticas do dashboard (Scout)
   */
  async getScoutStats(): Promise<{
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
    reportsThisMonth: number;
    playersEvaluated: number;
    averageRating: number;
  }> {
    await delay(400);
    
    // MODO MOCK
    return {
      totalReports: 15,
      approvedReports: 12,
      pendingReports: 2,
      reportsThisMonth: 8,
      playersEvaluated: 10,
      averageRating: 8.2,
    };
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest(
    //   API_ENDPOINTS.DASHBOARD.SCOUT_STATS
    // );
  },
};
