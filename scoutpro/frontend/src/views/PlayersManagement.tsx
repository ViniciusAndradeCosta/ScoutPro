import { useState, useEffect, useCallback } from 'react';
import { PlayerCard } from '../components/PlayerCard';
import { PlayerComparison } from '../components/shared/PlayerComparison';
import { PlayerDetailsModal } from './PlayerDetailsPage'; 
import { PlayerForm } from '../components/PlayerForm';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Grid3x3, List, GitCompare } from 'lucide-react';

interface PlayersManagementProps {
  onViewPlayer: (id: string) => void;
  userType: 'admin' | 'scout';
  onNavigate?: (view: string) => void;
}

const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const formatPosition = (pos: string) => {
  if (!pos) return 'Não definida';
  return pos.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function PlayersManagement({ userType, onNavigate }: PlayersManagementProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState<any>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAthletes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('scoutpro_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch('http://localhost:8080/api/v1/athletes', { headers });

      if (res.ok) {
        const data = await res.json();

        const formattedPlayers = data.map((a: any) => {
          // CORREÇÃO DO RATING: Média exata dos 7 atributos de 1 a 100
          const attrAvg = Math.round(
            ((a.passing || 50) + 
             (a.dribbling || 50) + 
             (a.finishing || 50) + 
             (a.positioning || 50) + 
             (a.pace || 50) + 
             (a.strength || 50) + 
             (a.stamina || 50)) / 7
          );

          return {
            id: a.id.toString(),
            name: a.name,
            position: a.position,
            age: a.birthDate ? calculateAge(a.birthDate) : 0,
            birthDate: a.birthDate,
            height: a.height || 0,
            weight: a.weight || 0,
            nationality: a.nationality || 'Brasil',
            club: a.club || 'Sem clube',
            rating: attrAvg, // Rating baseado na média
            addedBy: a.addedBy || 'Sistema',
            image: a.image || null,
            matchStats: { goals: a.goals || 0, assists: a.assists || 0, yellowCards: a.yellowCards || 0, matchesPlayed: a.matchesPlayed || 0 },
            injuries: a.injuries || [], // Lesões mapeadas
            dominantFoot: a.dominantFoot || '--', // Pé Dominante Mapeado
            stats: { passing: a.passing || 50, dribbling: a.dribbling || 50, shooting: a.finishing || 50, positioning: a.positioning || 50, pace: a.pace || 50, strength: a.strength || 50, stamina: a.stamina || 50 },
          }
        });
        setPlayers(formattedPlayers);
      }
    } catch (error) { 
      console.error("Erro ao carregar jogadores", error); 
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { fetchAthletes(); }, [fetchAthletes]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) return prev.filter((id) => id !== playerId);
      if (prev.length < 2) return [...prev, playerId];
      return prev;
    });
  };

  const handleUpdatePlayer = async (data: any) => {
    try {
      const token = localStorage.getItem('scoutpro_token');
      const res = await fetch(`http://localhost:8080/api/v1/athletes/${editingPlayer.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { 
        setEditingPlayer(null); 
        fetchAthletes(); 
      }
    } catch (error) { 
      console.error("Erro na atualização", error); 
    }
  };

  const filteredPlayers = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPosition = positionFilter === 'all' || p.position.toUpperCase() === formatPosition(positionFilter).toUpperCase();
    return matchSearch && matchPosition;
  });

  const selectedPlayerData = players.filter((p) => selectedPlayers.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Jogadores</h1>
          <p className="text-muted-foreground">{players.length} jogadores cadastrados no sistema</p>
        </div>
      </div>

      {!showComparison && (
        <Card className="p-4 bg-card border-border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar jogadores..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-input-background border-border" />
            </div>

            <div className="flex gap-2">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-48 bg-input-background border-border">
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

              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-primary' : ''}><Grid3x3 className="w-4 h-4" /></Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-primary' : ''}><List className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>

          {selectedPlayers.length > 0 && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2"><Checkbox checked={true} /><span className="text-sm">{selectedPlayers.length} jogador(es) selecionado(s)</span></div>
              <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelectedPlayers([])}>Limpar</Button><Button size="sm" onClick={() => setShowComparison(true)} disabled={selectedPlayers.length !== 2} className="bg-primary"><GitCompare className="w-4 h-4 mr-2" /> Comparar</Button></div>
            </div>
          )}
        </Card>
      )}

      {showComparison && selectedPlayerData.length === 2 && <PlayerComparison player1={selectedPlayerData[0]} player2={selectedPlayerData[1]} onClose={() => { setShowComparison(false); setSelectedPlayers([]); }} />}

      {isLoading && !showComparison && (
        <div className="text-center py-12 text-muted-foreground">Carregando jogadores...</div>
      )}

      {!isLoading && !showComparison && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredPlayers.length === 0 ? <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum jogador encontrado para este filtro.</div> : filteredPlayers.map((player) => (
            <div key={player.id} className="relative">
              {viewMode === 'grid' ? (
                <>
                  <div className="absolute top-4 left-4 z-10"><Checkbox checked={selectedPlayers.includes(player.id)} onCheckedChange={() => handlePlayerSelect(player.id)} className="bg-background border-2" /></div>
                  <PlayerCard {...player} position={formatPosition(player.position)} onViewDetails={(id) => { setSelectedPlayerDetails(players.find(p=>p.id===id)); setIsModalOpen(true); }} />
                </>
              ) : (
                <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                    <Checkbox checked={selectedPlayers.includes(player.id)} onCheckedChange={() => handlePlayerSelect(player.id)} />
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center font-bold text-xl">
                      {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-cover" /> : player.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{player.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/10 text-primary">{formatPosition(player.position)}</Badge>
                        <span className="text-sm text-muted-foreground">{player.age} anos</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{player.club}</span>
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-accent">{player.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <Button onClick={() => { setSelectedPlayerDetails(player); setIsModalOpen(true); }} variant="outline" className="border-primary text-primary">
                      Ver Perfil
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      )}

      <PlayerDetailsModal 
        player={selectedPlayerDetails} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEdit={() => { setIsModalOpen(false); setEditingPlayer(selectedPlayerDetails); }} 
        onMessage={(username) => { setIsModalOpen(false); if(onNavigate) onNavigate('messages'); }} 
      />

      <Dialog open={!!editingPlayer} onOpenChange={(open: boolean) => !open && setEditingPlayer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-card border-border flex flex-col">
          <DialogHeader className="p-6 border-b"><DialogTitle className="text-2xl font-bold">Editar Jogador: {editingPlayer?.name}</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">{editingPlayer && <PlayerForm initialData={editingPlayer} onSubmit={handleUpdatePlayer} onCancel={() => setEditingPlayer(null)} />}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}