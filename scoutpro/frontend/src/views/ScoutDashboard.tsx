import { useState, useEffect } from 'react';
import { ScoutSidebar } from '../components/scout/ScoutSidebar';
import { MessagesView } from '../components/shared/MessagesView';
import { DashboardScout } from '../components/DashboardScout';
import { PlayerCard } from '../components/PlayerCard';
import { StatCard } from '../components/shared/StatCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter, FileText, Award, TrendingUp, Clock, Star } from 'lucide-react';
import { SettingsPage } from './SettingsPage';

interface ScoutDashboardProps {
  onViewPlayer: (id: string) => void;
  initialView?: string;
  initialMessageRecipient?: string;
}

const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatPosition = (pos: string) => {
  if (!pos) return 'Não definida';
  const positionMap: Record<string, string> = {
    'GOALKEEPER': 'Goleiro',
    'DEFENDER': 'Defensor',
    'MIDFIELDER': 'Meio-campo',
    'FORWARD': 'Atacante',
    'GOLEIRO': 'Goleiro',
    'LATERAL_DIREITO': 'Lateral Direito',
    'LATERAL_ESQUERDO': 'Lateral Esquerdo',
    'ZAGUEIRO': 'Zagueiro',
    'VOLANTE': 'Volante',
    'MEIO_CAMPO': 'Meio-campo',
    'MEIA_ATACANTE': 'Meia Atacante',
    'PONTA_DIREITA': 'Ponta Direita',
    'PONTA_ESQUERDA': 'Ponta Esquerda',
    'ATACANTE': 'Atacante',
    'CENTROAVANTE': 'Centroavante',
    'UNKNOWN': 'Não definida'
  };
  return positionMap[pos.toUpperCase()] || pos.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function ScoutDashboard({ onViewPlayer, initialView, initialMessageRecipient }: ScoutDashboardProps) {
  const [currentView, setCurrentView] = useState(initialView || 'overview');
  const [selectedMessageRecipient, setSelectedMessageRecipient] = useState<string | undefined>(initialMessageRecipient);
  const [searchTerm, setSearchTerm] = useState('');

  const [players, setPlayers] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        let athletesData: any[] = [];
        const playersRes = await fetch('http://localhost:8080/api/v1/athletes', { headers });
        if (playersRes.ok) {
          athletesData = await playersRes.json();
          const formattedPlayers = athletesData.map((a: any) => {
            const baseRating = a.rating || 75; 
            return {
              id: a.id.toString(),
              name: a.name,
              position: formatPosition(a.position),
              rawPosition: a.position,
              age: a.birthDate ? calculateAge(a.birthDate) : (a.age || 0),
              birthDate: a.birthDate,
              height: a.height || 0,
              weight: a.weight || 0,
              nationality: a.nationality || 'Brasil',
              preferredFoot: a.dominantFoot || 'Direito',
              club: a.club || 'Sem clube',
              rating: baseRating,
              addedBy: a.addedBy || 'Sistema',
              image: a.image || null,
              matchStats: { 
                goals: a.goals || 0, 
                assists: a.assists || 0, 
                yellowCards: a.yellowCards || 0, 
                matchesPlayed: a.matchesPlayed || 0 
              },
              injuries: a.injuries || [],
              detailedAttributes: {
                finishing: a.finishing || baseRating, 
                dribbling: a.dribbling || baseRating, 
                positioning: a.positioning || baseRating, 
                pace: a.pace || baseRating,
                strength: a.strength || baseRating, 
                stamina: a.stamina || baseRating, 
                passing: a.passing || baseRating,
                shotPower: baseRating, longShots: baseRating, volleys: baseRating, penalties: baseRating,
                ballControl: baseRating, acceleration: baseRating, sprintSpeed: baseRating, agility: baseRating,
                vision: baseRating, crossing: baseRating, freeKick: baseRating, shortPassing: baseRating, longPassing: baseRating,
                marking: baseRating, standingTackle: baseRating, slidingTackle: baseRating, interceptions: baseRating,
                jumping: baseRating, aggression: baseRating, composure: baseRating, reactions: baseRating
              },
              stats: { 
                passing: a.passing || Math.min(99, Math.max(0, baseRating - 2)), 
                dribbling: a.dribbling || Math.min(99, Math.max(0, baseRating + 1)), 
                shooting: a.finishing || Math.min(99, Math.max(0, baseRating - 1)), 
                positioning: a.positioning || Math.min(99, Math.max(0, baseRating)), 
                pace: a.pace || Math.min(99, Math.max(0, baseRating + 3)), 
                strength: a.strength || Math.min(99, Math.max(0, baseRating - 3))
              },
              recentReports: 0,
            }
          });
          setPlayers(formattedPlayers);
        }

        const reportsRes = await fetch('http://localhost:8080/api/v1/reports', { headers });
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          // Mapeia cruzando com o ID do jogador para puxar o NOME e formatar a DATA
          const formattedReports = reportsData.map((r: any) => {
            const athlete = athletesData.find((a: any) => Number(a.id) === Number(r.athleteId));
            return {
              ...r,
              playerName: athlete?.name || 'Jogador Desconhecido',
              date: r.createdAt 
                ? new Date(r.createdAt).toLocaleDateString('pt-BR') 
                : (r.matchDate ? new Date(r.matchDate).toLocaleDateString('pt-BR') : 'Sem data')
            };
          });
          setMyReports(formattedReports);
        }
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => { if (initialView) setCurrentView(initialView); }, [initialView]);
  useEffect(() => { if (initialMessageRecipient) setSelectedMessageRecipient(initialMessageRecipient); }, [initialMessageRecipient]);

  const [positionFilter, setPositionFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all-ages');
  const [favoritePlayerIds, setFavoritePlayerIds] = useState<string[]>([]);

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = (player.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') || 
                          (player.club?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    
    const matchesPosition = positionFilter === 'all' || 
        (player.rawPosition && player.rawPosition.toUpperCase() === positionFilter.toUpperCase()) || 
        (player.position && player.position.toUpperCase() === formatPosition(positionFilter).toUpperCase());

    let matchesAge = true;
    if (ageFilter === 'under-18') matchesAge = player.age < 18;
    else if (ageFilter === '18-21') matchesAge = player.age >= 18 && player.age <= 21;
    else if (ageFilter === 'over-21') matchesAge = player.age > 21;
    
    return matchesSearch && matchesPosition && matchesAge;
  });

  const favoritePlayers = players.filter(player => favoritePlayerIds.includes(player.id));
  const handleToggleFavorite = (playerId: string) => setFavoritePlayerIds(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view !== 'messages') setSelectedMessageRecipient(undefined);
  };

  const renderContent = () => {
    if (currentView === 'messages') return <MessagesView userType="scout" userName="Olheiro" initialRecipient={selectedMessageRecipient} />;
    
    if (currentView === 'players') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Jogadores Disponíveis</h2>
            <p className="text-muted-foreground">Explore e avalie jogadores cadastrados</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, clube ou posição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-input-background border-border" />
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
              <SelectTrigger className="w-full lg:w-48 bg-input-background border-border"><SelectValue placeholder="Idade" /></SelectTrigger>
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Mostrando {filteredPlayers.length} de {players.length} jogadores</p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48 bg-input-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="rating-high">Maior avaliação</SelectItem>
                <SelectItem value="rating-low">Menor avaliação</SelectItem>
                <SelectItem value="age-young">Mais jovens</SelectItem>
                <SelectItem value="age-old">Mais velhos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredPlayers.length === 0 ? (
            <Card className="p-12 text-center"><p className="text-muted-foreground mb-4">Nenhum jogador encontrado.</p></Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((player) => <PlayerCard key={player.id} {...player} onViewDetails={onViewPlayer} showFavoriteButton={true} isFavorite={favoritePlayerIds.includes(player.id)} onToggleFavorite={handleToggleFavorite} />)}
            </div>
          )}
        </div>
      );
    }

    if (currentView === 'targets') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Jogadores Favoritos</h2>
            <p className="text-muted-foreground">{favoritePlayers.length} {favoritePlayers.length === 1 ? 'jogador favoritado' : 'jogadores favoritados'}</p>
          </div>
          {favoritePlayers.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center"><Star className="w-8 h-8 text-muted-foreground" /></div>
                <div><h3 className="text-lg font-semibold mb-2">Nenhum jogador favoritado</h3><p className="text-muted-foreground">Adicione jogadores clicando na estrela</p></div>
                <Button onClick={() => setCurrentView('players')} className="bg-primary hover:bg-primary/90">Ver Jogadores</Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoritePlayers.map((player) => <PlayerCard key={player.id} {...player} onViewDetails={onViewPlayer} showFavoriteButton={true} isFavorite={true} onToggleFavorite={handleToggleFavorite} />)}
            </div>
          )}
        </div>
      );
    }

    if (currentView === 'reports') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Meus Relatórios</h2>
            <p className="text-muted-foreground">Histórico completo dos relatórios que você criou</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard icon={FileText} label="Total de Relatórios" value={myReports.length.toString()} subtitle="criados" positive={true} />
            <StatCard icon={Award} label="Aprovados" value={myReports.filter(r => r.status === 'approved').length.toString()} subtitle="taxa de aprovação" positive={true} />
            <StatCard icon={Clock} label="Pendentes" value={myReports.filter(r => r.status === 'pending').length.toString()} subtitle="aguardando análise" positive={false} />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-muted/30">
              <TabsTrigger value="all">Todos ({myReports.length})</TabsTrigger>
              <TabsTrigger value="approved">Aprovados ({myReports.filter(r => r.status === 'approved').length})</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({myReports.filter(r => r.status === 'pending').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4">
                {myReports.length === 0 ? <Card className="p-8 text-center text-muted-foreground">Nenhum relatório encontrado no banco de dados.</Card> : myReports.map((report) => (
                  <Card key={report.id} className="p-5 bg-card border-border hover:border-primary/30 transition-all cursor-pointer" onClick={() => onViewPlayer(report.athleteId?.toString() || report.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{report.playerName}</h3>
                          <Badge className={report.status === 'approved' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-chart-3/10 text-chart-3 border-chart-3/20'}>
                            {report.status === 'approved' ? 'Aprovado' : 'Pendente'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> Relatório #{report.id}</div>
                          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {report.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver Jogador</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="mt-6">
              <div className="grid gap-4">
                {myReports.filter(r => r.status === 'approved').map((report) => (
                  <Card key={report.id} className="p-5 bg-card border-border hover:border-primary/30 transition-all cursor-pointer" onClick={() => onViewPlayer(report.athleteId?.toString() || report.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{report.playerName}</h3>
                          <Badge className="bg-accent/10 text-accent border-accent/20">Aprovado</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> Relatório #{report.id}</div>
                          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {report.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver Jogador</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-4">
                {myReports.filter(r => r.status === 'pending').map((report) => (
                  <Card key={report.id} className="p-5 bg-card border-border hover:border-primary/30 transition-all cursor-pointer" onClick={() => onViewPlayer(report.athleteId?.toString() || report.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{report.playerName}</h3>
                          <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">Pendente</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> Relatório #{report.id}</div>
                          <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {report.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver Jogador</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    if (currentView === 'settings') return <SettingsPage userType="scout" />;
    return <DashboardScout onViewPlayer={onViewPlayer} onNavigate={handleNavigate} />;
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <ScoutSidebar 
        currentView={currentView} 
        onNavigate={handleNavigate}
      />

      <div className="flex-1 h-screen w-full bg-background md:ml-[280px] overflow-y-auto">
        <div 
          className={`w-full ${currentView === 'messages' ? 'p-4' : 'p-6'}`}
          style={{ height: currentView === 'messages' ? 'calc(100vh - 64px)' : 'auto', minHeight: 'calc(100vh - 64px)' }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}