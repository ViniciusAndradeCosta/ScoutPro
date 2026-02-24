import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { 
  X, Edit, Target, Activity, AlertCircle, Award,
  MapPin, Calendar, Ruler, Weight, Flag, User, MessageSquare, FileText, CheckCircle, XCircle,
  Stethoscope
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
  dominantFoot?: string;
  previousClub?: string;
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

  useEffect(() => {
    if (isOpen && player) {
      const token = localStorage.getItem('scoutpro_token');
      fetch('http://localhost:8080/api/v1/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((r: any) => String(r.athleteId) === String(player.id));
        setPlayerReports(filtered);
      })
      .catch(console.error);
    }
  }, [isOpen, player]);

  if (!player) return null;

  // Garante a captura da lista de lesões de múltiplas fontes possíveis
  const injuryList = Array.isArray(player.injuries) ? player.injuries : 
                   (player.stats && Array.isArray(player.stats.injuries)) ? player.stats.injuries : [];

  const matches = player.matchStats?.matches ?? player.matchStats?.matchesPlayed ?? player.matchesPlayed ?? 0;
  const goals = player.matchStats?.goals ?? player.goals ?? 0;
  const assists = player.matchStats?.assists ?? player.assists ?? 0;
  const yellowCards = player.matchStats?.yellowCards ?? player.yellowCards ?? 0;
  const pAge = player.age || calculateAge(player.birthDate) || '--';

  const attributesData = [
    { attribute: 'Passe', value: player.stats?.passing ?? player.passing ?? 50 },
    { attribute: 'Drible', value: player.stats?.dribbling ?? player.dribbling ?? 50 },
    { attribute: 'Finalização', value: player.stats?.shooting ?? player.finishing ?? player.shooting ?? 50 },
    { attribute: 'Posic.', value: player.stats?.positioning ?? player.positioning ?? 50 },
    { attribute: 'Velocid.', value: player.stats?.pace ?? player.pace ?? 50 },
    { attribute: 'Força', value: player.stats?.strength ?? player.strength ?? 50 },
    { attribute: 'Resist.', value: player.stats?.stamina ?? player.stamina ?? 50 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-[1400px] w-[98vw] h-[94vh] overflow-hidden flex flex-col p-0 bg-card border-border shadow-2xl rounded-xl"
      >
        <DialogHeader className="p-3 border-b border-border flex-shrink-0 bg-muted/20 z-10">
          <DialogTitle className="sr-only">Detalhes do Jogador {player.name}</DialogTitle>
          <DialogDescription className="sr-only">Estatísticas detalhadas e relatórios do jogador {player.name}.</DialogDescription>
          
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" /> Fechar
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                <Edit className="w-3.5 h-3.5" /> Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          
          {/* FOTO REDUZIDA (AVATAR) E NOME */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0 relative shadow-sm">
              {player.image ? (
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <span className="text-3xl font-bold text-primary">{player.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full flex items-center justify-between text-center sm:text-left">
              <div>
                <h2 className="text-2xl font-bold mb-1 leading-tight">{player.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-2.5 py-0.5 text-[11px]">
                    {formatPosition(player.position)}
                  </Badge>
                  
                  {/* NOVO: Nome de quem cadastrou */}
                  {player.addedBy && player.addedBy !== 'Sistema' && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded border border-border">
                      <User className="w-3 h-3" /> Adicionado por {player.addedBy}
                    </span>
                  )}
                  
                  {/* NOVO: Botão de enviar mensagem */}
                  {onMessage && player.addedBy && player.addedBy !== 'Sistema' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 px-2 text-[10px] border border-border bg-background hover:bg-accent/10 hover:text-accent" 
                      onClick={() => onMessage(player.addedBy!)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" /> Mensagem
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-foreground px-4 py-2 rounded-lg flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-primary leading-none">{player.rating || 0}</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold mt-1">Rating</div>
              </div>
            </div>
          </div>

          {/* DADOS TÉCNICOS EM LARGURA TOTAL */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-muted/20 p-4 rounded-lg border border-border/50 text-sm mb-6">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Calendar className="w-3.5 h-3.5" /> Idade</div>
              <div className="font-semibold text-base">{pAge} anos</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Ruler className="w-3.5 h-3.5" /> Altura</div>
              <div className="font-semibold text-base">{player.height || '--'} m</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Weight className="w-3.5 h-3.5" /> Peso</div>
              <div className="font-semibold text-base">{player.weight || '--'} kg</div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Flag className="w-3.5 h-3.5" /> Origem</div>
              <div className="font-semibold text-base truncate">{player.nationality || '--'}</div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-0.5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><MapPin className="w-3.5 h-3.5" /> Clube</div>
              <div className="font-semibold text-base truncate">{player.club || '--'}</div>
            </div>
          </div>

          <Tabs defaultValue="resumo" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/30 h-10 p-1 mb-5 rounded-md">
              <TabsTrigger value="resumo" className="text-xs">Atributos</TabsTrigger>
              <TabsTrigger value="atletico" className="text-xs">Médico</TabsTrigger>
              <TabsTrigger value="relatorios" className="text-xs">Relatórios</TabsTrigger>
              <TabsTrigger value="historico" className="text-xs">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="atletico" className="mt-0 space-y-4">
              <Card className="p-5 bg-card border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
                  <Stethoscope className="w-5 h-5 text-destructive" />
                  <h3 className="font-bold">Histórico Médico e de Lesões</h3>
                </div>
                
                <div className="space-y-3">
                  {injuryList.length === 0 ? (
                    <div className="p-8 bg-muted/10 rounded-md text-center text-sm text-muted-foreground border border-dashed border-border">
                       Nenhuma lesão registada no banco de dados para este jogador.
                    </div>
                  ) : (
                    injuryList.map((injury: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                        <div>
                          <div className="font-bold text-sm">{injury.injuryType || injury.description || 'Lesão Registada'}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Calendar className="w-3 h-3" /> 
                            Início: {injury.startDate ? new Date(injury.startDate).toLocaleDateString('pt-BR') : 'Data N/D'}
                            {injury.endDate && ` • Retorno: ${new Date(injury.endDate).toLocaleDateString('pt-BR')}`}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            injury.severity === 'Grave' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                            injury.severity === 'Moderada' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                            'bg-green-500/10 text-green-500 border-green-500/20'
                          }
                        >
                          {injury.severity || 'Leve'}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="p-4 bg-muted/10">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Pé Dominante</h4>
                <div className="font-medium text-sm capitalize">{player.dominantFoot?.replace('_', ' ') || 'Não informado'}</div>
              </Card>
            </TabsContent>

            <TabsContent value="resumo" className="mt-0">
              <Card className="p-6 bg-card border-border shadow-sm">
                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
                  {attributesData.map((stat) => (
                    <div key={stat.attribute} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{stat.attribute}</span>
                        <span className="font-bold">{stat.value}/100</span>
                      </div>
                      <Progress value={stat.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="relatorios" className="space-y-3 mt-0">
               {playerReports.length === 0 ? (
                 <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">Sem relatórios.</div>
               ) : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {playerReports.map((report) => (
                     <Card key={report.id} className="p-4 border-border">
                       <div className="font-semibold text-xs mb-2">Scout: {report.scoutName || 'Sistema'}</div>
                       <div className="text-xs text-green-500 mb-1">✓ {report.strengths || 'N/A'}</div>
                       <div className="text-xs text-orange-500">✗ {report.weaknesses || 'N/A'}</div>
                     </Card>
                   ))}
                 </div>
               )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}