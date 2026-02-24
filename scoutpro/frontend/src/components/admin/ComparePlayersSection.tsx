import { useState, useEffect } from 'react';
import { PlayerComparison } from '../shared/PlayerComparison';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

export function ComparePlayersSection() {
  const [players, setPlayers] = useState<any[]>([]);
  const [player1Id, setPlayer1Id] = useState<string>('');
  const [player2Id, setPlayer2Id] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Busca os jogadores do banco de dados ao carregar a página
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const response = await fetch('http://localhost:8080/api/v1/athletes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Formata os dados para o padrão que o componente de comparação exige
          const formattedPlayers = data.map((p: any) => ({
            id: p.id.toString(),
            name: p.name || 'Sem Nome',
            position: p.position || 'ND',
            age: p.age || 0, // Se o backend retornar data de nascimento, pode ser necessário calcular a idade
            club: p.club || 'Sem Clube',
            rating: p.rating || (Math.random() * (9 - 6) + 6).toFixed(1), // Se não houver rating, cria um fallback
            
            // Se o backend já tiver essas estatísticas, ele usa. Se não, gera valores aleatórios provisórios para o gráfico funcionar
            stats: p.stats || {
              passing: Math.floor(Math.random() * 40) + 50,
              dribbling: Math.floor(Math.random() * 40) + 50,
              shooting: Math.floor(Math.random() * 40) + 50,
              positioning: Math.floor(Math.random() * 40) + 50,
              speed: Math.floor(Math.random() * 40) + 50,
              strength: Math.floor(Math.random() * 40) + 50,
            },
          }));

          setPlayers(formattedPlayers);

          // Seleciona automaticamente os dois primeiros jogadores da lista, se existirem
          if (formattedPlayers.length >= 2) {
            setPlayer1Id(formattedPlayers[0].id);
            setPlayer2Id(formattedPlayers[1].id);
          } else if (formattedPlayers.length === 1) {
            setPlayer1Id(formattedPlayers[0].id);
            setPlayer2Id(formattedPlayers[0].id);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar jogadores para comparação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const player1 = players.find((p) => p.id === player1Id);
  const player2 = players.find((p) => p.id === player2Id);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando jogadores para comparação...</div>;
  }

  if (players.length === 0) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Comparar Jogadores</h2>
          <p className="text-muted-foreground">Compare estatísticas e desempenho entre diferentes jogadores</p>
        </div>
        <Card className="p-12 text-center border-dashed flex flex-col items-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1">Nenhum jogador encontrado</h3>
          <p className="text-muted-foreground">Você precisa ter jogadores cadastrados no banco de dados para poder compará-los.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Comparar Jogadores</h2>
        <p className="text-muted-foreground">
          Compare estatísticas e desempenho entre diferentes jogadores
        </p>
      </div>

      {/* Player Selection */}
      <Card className="p-6 bg-card border-border">
        <h3 className="font-semibold mb-4">Selecione os Jogadores</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Jogador 1</label>
            <Select value={player1Id} onValueChange={setPlayer1Id}>
              <SelectTrigger className="bg-input-background border-border">
                <SelectValue placeholder="Selecione um jogador" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      <Badge variant="outline" className="text-xs ml-2">
                        {player.position}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Jogador 2</label>
            <Select value={player2Id} onValueChange={setPlayer2Id}>
              <SelectTrigger className="bg-input-background border-border">
                <SelectValue placeholder="Selecione um jogador" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <span>{player.name}</span>
                      <Badge variant="outline" className="text-xs ml-2">
                        {player.position}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Comparison */}
      {player1 && player2 && (
        <PlayerComparison player1={player1} player2={player2} />
      )}
    </div>
  );
}