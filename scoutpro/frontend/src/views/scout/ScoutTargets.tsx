import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerCard } from '../../components/PlayerCard';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Star } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { calculateAge, formatPosition } from '../../utils/playerFormat';
import { getFavorites, toggleFavorite } from '../../utils/favorites';

interface CardPlayer {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  image?: string;
  rating: number;
}

export function ScoutTargets() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<CardPlayer[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavorites());

  useEffect(() => {
    apiRequest<any[]>(API_ENDPOINTS.PLAYERS.LIST)
      .then((data) => {
        setPlayers(
          (data || []).map((a: any) => ({
            id: a.id.toString(),
            name: a.name,
            position: formatPosition(a.position),
            age: a.birthDate ? calculateAge(a.birthDate) : a.age || 0,
            club: a.club || 'Sem clube',
            image: a.image || undefined,
            rating: a.rating || 75,
          })),
        );
      })
      .catch((error) => console.error('Erro ao carregar jogadores:', error));
  }, []);

  const handleToggleFavorite = (id: string) => setFavoriteIds(toggleFavorite(id));

  const favoritePlayers = players.filter((player) => favoriteIds.includes(player.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Jogadores Favoritos</h2>
        <p className="text-muted-foreground">
          {favoritePlayers.length} {favoritePlayers.length === 1 ? 'jogador favoritado' : 'jogadores favoritados'}
        </p>
      </div>

      {favoritePlayers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Star className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Nenhum jogador favoritado</h3>
              <p className="text-muted-foreground">Adicione jogadores clicando na estrela</p>
            </div>
            <Button onClick={() => navigate('/olheiro/jogadores')} className="bg-primary hover:bg-primary/90">
              Ver Jogadores
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritePlayers.map((player) => (
            <PlayerCard
              key={player.id}
              {...player}
              onViewDetails={(id) => navigate(`/olheiro/jogador/${id}`)}
              showFavoriteButton
              isFavorite
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
