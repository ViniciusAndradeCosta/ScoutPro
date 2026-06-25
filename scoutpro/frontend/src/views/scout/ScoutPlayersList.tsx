import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerCard } from '../../components/PlayerCard';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Search, Filter } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import { calculateAge, formatPosition } from '../../utils/playerFormat';
import { getFavorites, toggleFavorite } from '../../utils/favorites';

interface CardPlayer {
  id: string;
  name: string;
  rawPosition: string;
  position: string;
  age: number;
  club: string;
  image?: string;
  rating: number;
}

export function ScoutPlayersList() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<CardPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all-ages');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavorites());

  useEffect(() => {
    apiRequest<any[]>(API_ENDPOINTS.PLAYERS.LIST)
      .then((data) => {
        setPlayers(
          (data || []).map((a: any) => {
            const rating = a.rating || 75;
            return {
              id: a.id.toString(),
              name: a.name,
              rawPosition: a.position,
              position: formatPosition(a.position),
              age: a.birthDate ? calculateAge(a.birthDate) : a.age || 0,
              club: a.club || 'Sem clube',
              image: a.image || undefined,
              rating,
            };
          }),
        );
      })
      .catch((error) => console.error('Erro ao carregar jogadores:', error));
  }, []);

  const handleToggleFavorite = (id: string) => setFavoriteIds(toggleFavorite(id));

  const filteredPlayers = players.filter((player) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      player.name.toLowerCase().includes(term) || player.club.toLowerCase().includes(term);

    const matchesPosition =
      positionFilter === 'all' || player.rawPosition?.toUpperCase() === positionFilter.toUpperCase();

    let matchesAge = true;
    if (ageFilter === 'under-18') matchesAge = player.age < 18;
    else if (ageFilter === '18-21') matchesAge = player.age >= 18 && player.age <= 21;
    else if (ageFilter === 'over-21') matchesAge = player.age > 21;

    return matchesSearch && matchesPosition && matchesAge;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Jogadores Disponíveis</h2>
        <p className="text-muted-foreground">Explore e avalie jogadores cadastrados</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, clube ou posição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input-background border-border"
          />
        </div>

        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-full lg:w-48 bg-input-background border-border">
            <SelectValue placeholder="Todas posições" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas posições</SelectItem>
            <SelectItem value="GOLEIRO">Goleiro</SelectItem>
            <SelectItem value="LATERAL_DIREITO">Lateral Direito</SelectItem>
            <SelectItem value="LATERAL_ESQUERDO">Lateral Esquerdo</SelectItem>
            <SelectItem value="ZAGUEIRO">Zagueiro</SelectItem>
            <SelectItem value="VOLANTE">Volante</SelectItem>
            <SelectItem value="MEIO_CAMPO">Meio-campo</SelectItem>
            <SelectItem value="MEIA_ATACANTE">Meia Atacante</SelectItem>
            <SelectItem value="PONTA_DIREITA">Ponta Direita</SelectItem>
            <SelectItem value="PONTA_ESQUERDA">Ponta Esquerda</SelectItem>
            <SelectItem value="ATACANTE">Atacante</SelectItem>
            <SelectItem value="CENTROAVANTE">Centroavante</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ageFilter} onValueChange={setAgeFilter}>
          <SelectTrigger className="w-full lg:w-48 bg-input-background border-border">
            <SelectValue placeholder="Idade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-ages">Todas as idades</SelectItem>
            <SelectItem value="under-18">Até 18 anos</SelectItem>
            <SelectItem value="18-21">18-21 anos</SelectItem>
            <SelectItem value="over-21">Acima de 21</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          <Filter className="w-4 h-4 mr-2" /> Mais Filtros
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Mostrando {filteredPlayers.length} de {players.length} jogadores
      </p>

      {filteredPlayers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Nenhum jogador encontrado.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.name}
              position={player.position}
              age={player.age}
              club={player.club}
              image={player.image}
              rating={player.rating}
              onViewDetails={(id) => navigate(`/olheiro/jogador/${id}`)}
              showFavoriteButton
              isFavorite={favoriteIds.includes(player.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
