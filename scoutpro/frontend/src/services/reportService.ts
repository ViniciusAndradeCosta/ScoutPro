import type { 
  Report, 
  ReportFormData, 
  ReportFilters,
  PaginatedResponse,
  ReportStatus,
} from '../types';
import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Serviço de Relatórios
 */

// ============================================
// DADOS MOCKADOS
// ============================================

const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    playerId: '1',
    playerName: 'João Silva',
    scoutId: '2',
    scoutName: 'Carlos Scout',
    type: 'Avaliação Técnica',
    status: 'Aprovado',
    date: '2024-02-01T10:00:00Z',
    matchDetails: {
      opponent: 'Corinthians',
      competition: 'Campeonato Paulista',
      result: '2-1',
    },
    performance: {
      rating: 9,
      summary: 'Excelente atuação. Mostrou muita velocidade e finalizou bem.',
      strengths: ['Velocidade', 'Finalização', 'Drible'],
      weaknesses: ['Jogo aéreo'],
    },
    technicalAnalysis: {
      passing: 7,
      dribbling: 9,
      shooting: 8,
      defending: 5,
      positioning: 8,
    },
    recommendation: 'Contratar',
    notes: 'Jogador com grande potencial. Recomendo observação contínua.',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '2',
    playerId: '2',
    playerName: 'Pedro Henrique',
    scoutId: '2',
    scoutName: 'Carlos Scout',
    type: 'Avaliação Técnica',
    status: 'Em Análise',
    date: '2024-02-05T15:00:00Z',
    matchDetails: {
      opponent: 'São Paulo',
      competition: 'Campeonato Paulista',
      result: '1-1',
    },
    performance: {
      rating: 9,
      summary: 'Dominou o meio-campo. Excelente visão de jogo.',
      strengths: ['Passe', 'Visão de jogo', 'Controle'],
      weaknesses: ['Força física'],
    },
    technicalAnalysis: {
      passing: 9,
      dribbling: 8,
      shooting: 7,
      defending: 6,
      positioning: 9,
    },
    recommendation: 'Contratar',
    notes: 'Um dos melhores meio-campistas jovens que já observei.',
    createdAt: '2024-02-05T15:00:00Z',
    updatedAt: '2024-02-05T15:00:00Z',
  },
  {
    id: '3',
    playerId: '3',
    playerName: 'Lucas Martins',
    scoutId: '2',
    scoutName: 'Carlos Scout',
    type: 'Análise Física',
    status: 'Pendente',
    date: '2024-02-10T11:00:00Z',
    performance: {
      rating: 7,
      summary: 'Boa capacidade física. Precisa melhorar aspectos técnicos.',
      strengths: ['Resistência', 'Marcação'],
      weaknesses: ['Passe longo', 'Velocidade'],
    },
    physicalAnalysis: {
      speed: 7,
      stamina: 9,
      strength: 8,
      agility: 7,
    },
    recommendation: 'Monitorar',
    notes: 'Jogador confiável mas sem grande potencial de evolução.',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
];

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// SERVIÇO DE RELATÓRIOS
// ============================================

export const reportService = {
  /**
   * Listar relatórios com filtros
   */
  async getReports(
    filters?: ReportFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<Report>> {
    await delay(500);
    
    // MODO MOCK
    let filteredReports = [...MOCK_REPORTS];
    
    if (filters) {
      if (filters.playerId) {
        filteredReports = filteredReports.filter(r => r.playerId === filters.playerId);
      }
      
      if (filters.scoutId) {
        filteredReports = filteredReports.filter(r => r.scoutId === filters.scoutId);
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredReports = filteredReports.filter(r => 
          filters.status!.includes(r.status)
        );
      }
      
      if (filters.type && filters.type.length > 0) {
        filteredReports = filteredReports.filter(r => 
          filters.type!.includes(r.type)
        );
      }
      
      if (filters.dateFrom) {
        filteredReports = filteredReports.filter(r => 
          new Date(r.date) >= new Date(filters.dateFrom!)
        );
      }
      
      if (filters.dateTo) {
        filteredReports = filteredReports.filter(r => 
          new Date(r.date) <= new Date(filters.dateTo!)
        );
      }
    }
    
    const total = filteredReports.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredReports.slice(start, end);
    
    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<PaginatedResponse<Report>>(
    //   API_ENDPOINTS.REPORTS.LIST,
    //   {
    //     method: 'GET',
    //     params: { ...filters, page, pageSize },
    //   }
    // );
  },

  /**
   * Obter relatório por ID
   */
  async getReportById(id: string): Promise<Report | null> {
    await delay(300);
    
    // MODO MOCK
    const report = MOCK_REPORTS.find(r => r.id === id);
    return report || null;
    
    // MODO BACKEND (Descomentar quando integrar)
    // try {
    //   return await apiRequest<Report>(API_ENDPOINTS.REPORTS.GET(id));
    // } catch (error) {
    //   return null;
    // }
  },

  /**
   * Obter relatórios de um jogador
   */
  async getReportsByPlayer(playerId: string): Promise<Report[]> {
    await delay(400);
    
    // MODO MOCK
    return MOCK_REPORTS.filter(r => r.playerId === playerId);
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Report[]>(
    //   API_ENDPOINTS.REPORTS.BY_PLAYER(playerId)
    // );
  },

  /**
   * Obter relatórios de um scout
   */
  async getReportsByScout(scoutId: string): Promise<Report[]> {
    await delay(400);
    
    // MODO MOCK
    return MOCK_REPORTS.filter(r => r.scoutId === scoutId);
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Report[]>(
    //   API_ENDPOINTS.REPORTS.BY_SCOUT(scoutId)
    // );
  },

  /**
   * Criar novo relatório
   */
  async createReport(data: ReportFormData): Promise<Report> {
    await delay(800);
    
    // MODO MOCK
    const currentUserId = localStorage.getItem('current_user_id') || '2';
    const currentUserName = 'Carlos Scout';
    
    // Buscar nome do jogador (em produção viria do backend)
    const playerName = 'Jogador'; // Placeholder
    
    const newReport: Report = {
      id: `${Date.now()}`,
      ...data,
      playerName,
      scoutId: currentUserId,
      scoutName: currentUserName,
      status: 'Pendente',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_REPORTS.push(newReport);
    return newReport;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Report>(
    //   API_ENDPOINTS.REPORTS.CREATE,
    //   {
    //     method: 'POST',
    //     body: data,
    //   }
    // );
  },

  /**
   * Atualizar relatório
   */
  async updateReport(id: string, data: Partial<ReportFormData>): Promise<Report> {
    await delay(800);
    
    // MODO MOCK
    const index = MOCK_REPORTS.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Relatório não encontrado');
    }
    
    const updatedReport = {
      ...MOCK_REPORTS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_REPORTS[index] = updatedReport;
    return updatedReport;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Report>(
    //   API_ENDPOINTS.REPORTS.UPDATE(id),
    //   {
    //     method: 'PUT',
    //     body: data,
    //   }
    // );
  },

  /**
   * Atualizar status do relatório (Admin only)
   */
  async updateReportStatus(id: string, status: ReportStatus): Promise<Report> {
    await delay(500);
    
    // MODO MOCK
    const index = MOCK_REPORTS.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Relatório não encontrado');
    }
    
    const updatedReport = {
      ...MOCK_REPORTS[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_REPORTS[index] = updatedReport;
    return updatedReport;
    
    // MODO BACKEND (Descomentar quando integrar)
    // return await apiRequest<Report>(
    //   API_ENDPOINTS.REPORTS.UPDATE_STATUS(id),
    //   {
    //     method: 'PATCH',
    //     body: { status },
    //   }
    // );
  },

  /**
   * Deletar relatório
   */
  async deleteReport(id: string): Promise<void> {
    await delay(500);
    
    // MODO MOCK
    const index = MOCK_REPORTS.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Relatório não encontrado');
    }
    
    MOCK_REPORTS.splice(index, 1);
    
    // MODO BACKEND (Descomentar quando integrar)
    // await apiRequest(
    //   API_ENDPOINTS.REPORTS.DELETE(id),
    //   {
    //     method: 'DELETE',
    //   }
    // );
  },

  /**
   * Obter dados mockados
   */
  getMockReports(): Report[] {
    return [...MOCK_REPORTS];
  },
};
