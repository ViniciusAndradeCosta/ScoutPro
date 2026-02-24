import type { Player, PlayerFormData, PlayerFilters, PaginatedResponse } from '../types';
import { API_ENDPOINTS, apiRequest } from '../config/api';

// MAPEAMENTO SALVADOR: Converte atributos na raiz para o objeto `stats` e preenche fallback de rating
const mapToPlayer = (data: any): Player => ({
  ...data,
  rating: data.rating || Math.round(((data.finishing || 50) + (data.dribbling || 50) + (data.pace || 50)) / 3),
  stats: {
    passing: data.passing || 50,
    dribbling: data.dribbling || 50,
    shooting: data.finishing || 50,
    positioning: data.positioning || 50,
    pace: data.pace || 50,
    strength: data.strength || 50,
    defending: 50,
    stamina: data.stamina || 50
  },
  matchStats: {
    matchesPlayed: data.matchesPlayed || 0,
    goals: data.goals || 0,
    assists: data.assists || 0,
    yellowCards: data.yellowCards || 0
  }
});

export const playerService = {
  async getPlayers(filters?: PlayerFilters, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Player>> {
    try {
      const response = await apiRequest<any>(API_ENDPOINTS.PLAYERS.LIST, {
        method: 'GET',
        params: { ...filters, page, pageSize },
      });

      if (Array.isArray(response)) {
        const mappedData = response.map(mapToPlayer);
        return {
          data: mappedData,
          total: mappedData.length,
          page: 1,
          pageSize: mappedData.length > 0 ? mappedData.length : 10,
          totalPages: 1
        };
      }
      return response;
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      throw error;
    }
  },

  async getPlayerById(id: string): Promise<Player | null> {
    try {
      const data = await apiRequest<any>(API_ENDPOINTS.PLAYERS.GET(id), { method: 'GET' });
      return data ? mapToPlayer(data) : null;
    } catch (error) {
      console.error('Erro ao buscar jogador:', error);
      return null;
    }
  },

  async createPlayer(data: PlayerFormData): Promise<Player> {
    return await apiRequest<Player>(API_ENDPOINTS.PLAYERS.CREATE, { method: 'POST', body: data });
  },

  async updatePlayer(id: string, data: Partial<PlayerFormData>): Promise<Player> {
    return await apiRequest<Player>(API_ENDPOINTS.PLAYERS.UPDATE(id), { method: 'PUT', body: data });
  },

  async deletePlayer(id: string): Promise<void> {
    await apiRequest(API_ENDPOINTS.PLAYERS.DELETE(id), { method: 'DELETE' });
  },

  async searchPlayers(query: string): Promise<Player[]> {
    return await apiRequest<Player[]>(API_ENDPOINTS.PLAYERS.SEARCH, { method: 'GET', params: { q: query } });
  },

  async getPlayerStats(): Promise<any> {
    try {
      return await apiRequest(API_ENDPOINTS.PLAYERS.STATS, { method: 'GET' });
    } catch (error) {
      console.error('Erro ao buscar estatísticas. Retornando zerado:', error);
      return { total: 0, byStatus: {}, averageAge: 0, totalValue: 0 };
    }
  }
};