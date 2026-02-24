/**
 * EXEMPLO DE COMPONENTE USANDO OS SERVIÇOS
 * 
 * Este é um exemplo de como criar um componente que usa os serviços
 * criados para gerenciar estado e fazer chamadas de API.
 * 
 * Este arquivo serve como referência e pode ser removido.
 */

import { useState, useEffect } from 'react';
import { playerService } from '../../services';
import type { Player, PlayerFilters, PaginatedResponse } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PlayerListExample() {
  // Estado
  const [data, setData] = useState<PaginatedResponse<Player> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PlayerFilters>({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Carregar jogadores quando filtros ou página mudam
  useEffect(() => {
    loadPlayers();
  }, [filters, page]);

  /**
   * Carrega jogadores do serviço
   */
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const response = await playerService.getPlayers(filters, page, pageSize);
      setData(response);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
      toast.error('Erro ao carregar jogadores');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza filtros
   */
  const handleFilterChange = (newFilters: Partial<PlayerFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1); // Reset para primeira página quando filtrar
  };

  /**
   * Limpa filtros
   */
  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  /**
   * Renderiza badge de status com cores
   */
  const renderStatusBadge = (status: Player['status']) => {
    const colors = {
      'Em Alta': 'bg-green-500',
      'Regular': 'bg-blue-500',
      'Em Baixa': 'bg-red-500',
    };
    
    return (
      <Badge className={colors[status]}>
        {status}
      </Badge>
    );
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <Input
              placeholder="Buscar por nome ou clube..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />

            {/* Status */}
            <Select
              value={filters.status?.[0] || ''}
              onValueChange={(value) =>
                handleFilterChange({
                  status: value ? [value as Player['status']] : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Em Alta">Em Alta</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Em Baixa">Em Baixa</SelectItem>
              </SelectContent>
            </Select>

            {/* Posição */}
            <Select
              value={filters.position?.[0] || ''}
              onValueChange={(value) =>
                handleFilterChange({
                  position: value ? [value as Player['position']] : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="Goleiro">Goleiro</SelectItem>
                <SelectItem value="Zagueiro">Zagueiro</SelectItem>
                <SelectItem value="Lateral Direito">Lateral Direito</SelectItem>
                <SelectItem value="Lateral Esquerdo">Lateral Esquerdo</SelectItem>
                <SelectItem value="Volante">Volante</SelectItem>
                <SelectItem value="Meia">Meia</SelectItem>
                <SelectItem value="Atacante">Atacante</SelectItem>
                <SelectItem value="Ponta">Ponta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={loadPlayers} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Jogadores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Jogadores ({data?.total || 0})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((player) => (
              <Card key={player.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {player.age} anos · {player.position}
                      </p>
                    </div>
                    {renderStatusBadge(player.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Clube:</span>
                      <span className="font-medium">{player.club}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Valor:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(player.marketValue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Relatórios:</span>
                      <span className="font-medium">{player.totalReports}</span>
                    </div>
                    {player.averageRating && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Avaliação:</span>
                        <span className="font-medium">
                          {player.averageRating.toFixed(1)}/10
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Cadastrado por: {player.createdByName}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum jogador encontrado
            </CardContent>
          </Card>
        )}

        {/* Paginação */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {page} de {data.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * COMO USAR ESTE COMPONENTE:
 * 
 * 1. Importe e use em qualquer lugar:
 *    import { PlayerListExample } from './components/examples/PlayerListExample';
 * 
 * 2. Renderize:
 *    <PlayerListExample />
 * 
 * 3. O componente já está totalmente funcional com:
 *    - Carregamento de dados
 *    - Filtros (busca, status, posição)
 *    - Paginação
 *    - Loading states
 *    - Error handling
 * 
 * 4. Quando integrar com backend:
 *    - Não precisa alterar este componente
 *    - Apenas ative o modo backend em playerService.ts
 *    - Tudo continuará funcionando!
 */
