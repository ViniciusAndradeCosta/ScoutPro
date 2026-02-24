import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { StatsRadar } from '../StatsRadar';
import { 
  Edit, Target, Activity, AlertCircle, Award,
  MapPin, Calendar, Ruler, Weight, Flag, User, ArrowLeft,
  FileText, CheckCircle, XCircle, MessageSquare
} from 'lucide-react';

interface PlayerDetails {
  id: string;
  name: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  nationality: string;
  club: string;
  previousClub?: string;
  dominantFoot?: string;
  rating: number;
  image?: string;
  addedBy?: string;
  stats?: any; 
  matchStats?: any;
  matchesPlayed?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  injuries?: any[];
  passing?: number;
  dribbling?: number;
  finishing?: number;
  shooting?: number;
  positioning?: number;
  pace?: number;
  strength?: number;
  defending?: number;
  stamina?: number;
  birthDate?: string;
}

interface PlayerDetailsModalProps {
  player: PlayerDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onMessage?: (username: string) => void;
}

const formatPosition = (pos: string) => {
  if (!pos) return 'Não definida';
  return pos.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const calculateAge = (birthDateString?: string) => {
  if (!birthDateString) return null;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
};

export function PlayerDetailsModal({ player, isOpen, onClose, onEdit, onMessage }: PlayerDetailsModalProps) {
  const [playerReports, setPlayerReports] = useState<any[]>([]);
  const [calculatedRating, setCalculatedRating] = useState<number>(0);

  useEffect(() => {
    if (isOpen && player) {
      setCalculatedRating(Math.round(player.rating || 0));
      
      const token = localStorage.getItem('scoutpro_token');
      fetch('http://localhost:8080/api/v1/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((r: any) => String(r.athleteId) === String(player.id));
        setPlayerReports(filtered);
        
        if (filtered.length > 0) {
          const sum = filtered.reduce((acc: number, r: any) => acc + ((r.technicalRating + r.tacticalRating + r.physicalRating) / 3), 0);
          setCalculatedRating(Math.round(sum / filtered.length));
        }
      })
      .catch(console.error);
    }
  }, [isOpen, player]);

  if (!player) return null;

  const matches = player.matchStats?.matches ?? player.matchStats?.matchesPlayed ?? player.matchesPlayed ?? 0;
  const goals = player.matchStats?.goals ?? player.goals ?? 0;
  const assists = player.matchStats?.assists ?? player.assists ?? 0;
  const yellowCards = player.matchStats?.yellowCards ?? player.yellowCards ?? 0;
  const pAge = player.age || calculateAge(player.birthDate) || '--';

  const radarData = [
    { attribute: 'Passe', value: player.stats?.passing ?? player.passing ?? 50, fullMark: 100 },
    { attribute: 'Drible', value: player.stats?.dribbling ?? player.dribbling ?? 50, fullMark: 100 },
    { attribute: 'Finalização', value: player.stats?.shooting ?? player.finishing ?? player.shooting ?? 50, fullMark: 100 },
    { attribute: 'Posic.', value: player.stats?.positioning ?? player.positioning ?? 50, fullMark: 100 },
    { attribute: 'Velocid.', value: player.stats?.pace ?? player.pace ?? 50, fullMark: 100 },
    { attribute: 'Força', value: player.stats?.strength ?? player.strength ?? 50, fullMark: 100 },
    { attribute: 'Defesa', value: player.stats?.defending ?? player.defending ?? 50, fullMark: 100 },
    { attribute: 'Resist.', value: player.stats?.stamina ?? player.stamina ?? 50, fullMark: 100 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-none sm:max-w-none w-screen h-screen max-h-screen top-0 left-0 translate-x-0 translate-y-0 p-0 sm:p-0 rounded-none sm:rounded-none border-none flex flex-col bg-background/95 backdrop-blur-sm overflow-hidden z-50 [&>button]:hidden">
        <DialogTitle className="sr-only">Detalhes do Jogador {player.name}</DialogTitle>

        <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
          <div className="flex gap-3">
            {onEdit && (
              <Button onClick={onEdit} className="bg-primary text-primary-foreground hover:opacity-90">
                <Edit className="w-4 h-4 mr-2" /> Editar Jogador
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-muted/10 custom-scrollbar">
          <div className="mx-auto max-w-6xl space-y-8 pb-10">
            
            <Card className="flex flex-col md:flex-row gap-6 p-6 bg-card border-border shadow-md items-start">
              
              {/* IMAGEM COM DIMENSÕES MUITO MAIS LIMITADAS */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted border-2 border-border flex-shrink-0 shadow-sm relative">
                {player.image ? (
                  <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <span className="text-4xl font-bold text-background/50">{player.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between w-full">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                    <div>
                      <h1 className="text-3xl font-black mb-2 text-foreground tracking-tight">{player.name}</h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 uppercase tracking-wider">
                          {formatPosition(player.position)}
                        </Badge>
                        {player.addedBy && player.addedBy !== 'Sistema' && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1.5 bg-muted/30 px-3 py-1 rounded-full">
                            <User className="w-4 h-4"/> Adicionado por {player.addedBy}
                          </span>
                        )}
                        {onMessage && player.addedBy && player.addedBy !== 'Sistema' && (
                          <Button size="sm" variant="ghost" className="h-7 px-3 text-xs border border-border bg-background" onClick={() => onMessage(player.addedBy!)}>
                            <MessageSquare className="w-3 h-3 mr-1.5" /> Enviar Mensagem
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary to-accent border-0 text-primary-foreground px-5 py-3 rounded-xl flex flex-col items-center justify-center shadow-lg transform hover:scale-105 transition-transform cursor-default sm:min-w-[120px]">
                      <div className="text-4xl font-black leading-none mb-1">{calculatedRating}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-90 font-bold">Rating</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/20 p-5 rounded-xl border border-border/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium"><Calendar className="w-4 h-4 text-primary" /> Idade</div>
                      <div className="text-base font-bold">{pAge} anos</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium"><Ruler className="w-4 h-4 text-accent" /> Altura</div>
                      <div className="text-base font-bold">{player.height || '--'} m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium"><Weight className="w-4 h-4 text-yellow-500" /> Peso</div>
                      <div className="text-base font-bold">{player.weight || '--'} kg</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium"><Flag className="w-4 h-4 text-green-500" /> Nacionalidade</div>
                      <div className="text-base font-bold truncate">{player.nationality || '--'}</div>
                    </div>
                    <div className="col-span-2 md:col-span-4 border-t border-border/50 pt-3 mt-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1"><MapPin className="w-4 h-4 text-blue-500" /> Clube Atual</div>
                      <div className="text-lg font-bold">{player.club || '--'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border flex items-center gap-4 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><Target className="w-6 h-6 text-accent" /></div>
                <div><div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Gols</div><div className="text-2xl font-black">{goals}</div></div>
              </Card>
              <Card className="p-4 bg-card border-border flex items-center gap-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Activity className="w-6 h-6 text-primary" /></div>
                <div><div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Assistências</div><div className="text-2xl font-black">{assists}</div></div>
              </Card>
              <Card className="p-4 bg-card border-border flex items-center gap-4 hover:border-yellow-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-yellow-500" /></div>
                <div><div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Cartões</div><div className="text-2xl font-black">{yellowCards}</div></div>
              </Card>
              <Card className="p-4 bg-card border-border flex items-center gap-4 hover:border-green-500/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><Award className="w-6 h-6 text-green-500" /></div>
                <div><div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Partidas</div><div className="text-2xl font-black">{matches}</div></div>
              </Card>
            </div>

            <Tabs defaultValue="resumo" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-muted/50 h-12 p-1 mb-8 rounded-lg shadow-inner">
                <TabsTrigger value="resumo" className="text-sm font-medium">Resumo</TabsTrigger>
                <TabsTrigger value="atletico" className="text-sm font-medium">Físico e Lesões</TabsTrigger>
                <TabsTrigger value="relatorios" className="text-sm font-medium">Relatórios</TabsTrigger>
                <TabsTrigger value="historico" className="text-sm font-medium">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="resumo">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="p-8 bg-card border-border shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Análise Radar</h3>
                    <div className="w-full h-[350px] flex items-center justify-center">
                      <StatsRadar data={radarData} />
                    </div>
                  </Card>
                  <Card className="p-8 bg-card border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Atributos Individuais</h3>
                    <div className="space-y-6 mt-4">
                      {radarData.map((stat) => (
                        <div key={stat.attribute} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">{stat.attribute}</span>
                            <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded">{stat.value}</span>
                          </div>
                          <Progress value={stat.value} className="h-2.5 bg-muted/50" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="atletico">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-8 bg-card border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Biometria</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/20 rounded-xl border border-border"><div className="text-sm text-muted-foreground mb-1">Altura</div><div className="text-2xl font-bold">{player.height || '--'} m</div></div>
                      <div className="p-4 bg-muted/20 rounded-xl border border-border"><div className="text-sm text-muted-foreground mb-1">Peso</div><div className="text-2xl font-bold">{player.weight || '--'} kg</div></div>
                      <div className="p-4 bg-muted/20 rounded-xl border border-border"><div className="text-sm text-muted-foreground mb-1">IMC</div><div className="text-2xl font-bold">{player.weight && player.height ? (Number(player.weight) / (Number(player.height) * Number(player.height))).toFixed(1) : '--'}</div></div>
                      <div className="p-4 bg-muted/20 rounded-xl border border-border"><div className="text-sm text-muted-foreground mb-1">Pé Dominante</div><div className="text-2xl font-bold capitalize">{player.dominantFoot?.replace('_', ' ') || '--'}</div></div>
                    </div>
                  </Card>
                  <Card className="p-8 bg-card border-border shadow-sm">
                    <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Histórico Médico</h3>
                    <div className="space-y-3">
                      {!player.injuries || player.injuries.length === 0 ? (
                         <div className="p-6 bg-muted/20 rounded-xl text-center text-muted-foreground border border-dashed border-border">O atleta não possui registro de lesões no sistema.</div>
                      ) : (
                        player.injuries.map((injury, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-muted/10 rounded-xl border border-border">
                            <div>
                              <div className="font-bold text-base mb-1">{injury.injuryType}</div>
                              <div className="text-sm text-muted-foreground">Início: {new Date(injury.startDate).toLocaleDateString('pt-BR')}</div>
                            </div>
                            <Badge variant="outline" className={`px-3 py-1 ${injury.severity === 'Leve' ? 'bg-accent/10 text-accent border-accent/30' : injury.severity === 'Moderada' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>{injury.severity}</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="relatorios">
                 {playerReports.length === 0 ? (
                   <Card className="p-12 bg-card border-dashed border-border text-center text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Ainda não existem relatórios técnicos detalhados para este jogador.
                   </Card>
                 ) : (
                   <div className="grid md:grid-cols-2 gap-6">
                     {playerReports.map((report) => (
                       <Card key={report.id} className="p-6 bg-card border-border shadow-sm hover:border-primary/50 transition-colors">
                         <div className="flex justify-between items-start mb-4 border-b border-border pb-4">
                           <div>
                             <div className="font-bold text-primary text-base flex items-center gap-2 mb-1">
                               <User className="w-4 h-4" /> Avaliado por: {report.scoutName || 'Sistema'}
                             </div>
                             <div className="text-sm text-muted-foreground">Gerado em {new Date(report.createdAt || report.matchDate).toLocaleDateString('pt-BR')}</div>
                           </div>
                         </div>
                         
                         {/* Resumo do Relatório */}
                         <div className="bg-muted/20 p-4 rounded-lg border border-border">
                           <p className="text-sm text-muted-foreground leading-relaxed">
                             {report.summary || report.comments || `Uma análise técnica e observação em campo foi realizada para este atleta por um olheiro credenciado.`}
                           </p>
                         </div>
                       </Card>
                     ))}
                   </div>
                 )}
              </TabsContent>

              <TabsContent value="historico">
                <Card className="p-8 bg-card border-border shadow-sm">
                  <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Trajetória e Clubes</h3>
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between p-5 bg-primary/5 rounded-xl border border-primary/20">
                      <div>
                        <div className="font-bold text-lg mb-1">{player.club || 'Sem Clube'}</div>
                        <div className="text-sm text-muted-foreground">Clube Atual</div>
                      </div>
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">Atuando</Badge>
                    </div>
                    {player.previousClub && (
                      <div className="flex items-center justify-between p-5 bg-muted/20 rounded-xl border border-border">
                        <div>
                          <div className="font-bold text-lg mb-1">{player.previousClub}</div>
                          <div className="text-sm text-muted-foreground">Clube Anterior</div>
                        </div>
                        <Badge variant="outline" className="text-muted-foreground">Encerrado</Badge>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}