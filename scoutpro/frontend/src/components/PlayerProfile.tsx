import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { StatsRadar } from './StatsRadar';
import { ArrowLeft, Calendar, MapPin, TrendingUp, Award, Activity, User, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlayerProfileProps {
  playerId: string;
  onBack: () => void;
  onCreateReport?: () => void;
  userType?: 'admin' | 'scout';
  onSendMessage?: (recipient: string) => void;
}

export function PlayerProfile({ playerId, onBack, onCreateReport, userType, onSendMessage }: PlayerProfileProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados reais do jogador no banco de dados
  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/v1/athletes/${playerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar dados do atleta');
        
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        console.error("Erro ao carregar o jogador:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerInfo();
  }, [playerId]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando dados do atleta...</div>;
  }

  if (!player) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4 hover:bg-accent/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <div className="p-8 text-center text-destructive">Atleta não encontrado.</div>
      </div>
    );
  }

  // Dados dinâmicos baseados no jogador que veio do banco
  const radarData = [
    { attribute: 'Passe', value: player.detailedAttributes?.shortPassing || player.passing || 50, fullMark: 100 },
    { attribute: 'Drible', value: player.detailedAttributes?.dribbling || player.dribbling || 50, fullMark: 100 },
    { attribute: 'Finalização', value: player.detailedAttributes?.finishing || player.finishing || 50, fullMark: 100 },
    { attribute: 'Posicionamento', value: player.detailedAttributes?.positioning || player.positioning || 50, fullMark: 100 },
    { attribute: 'Velocidade', value: player.detailedAttributes?.sprintSpeed || player.pace || 50, fullMark: 100 },
    { attribute: 'Força', value: player.detailedAttributes?.strength || player.strength || 50, fullMark: 100 },
  ];

  const physicalData = [
    { attribute: 'Velocidade', value: player.detailedAttributes?.sprintSpeed || player.pace || 50 },
    { attribute: 'Resistência', value: player.detailedAttributes?.stamina || player.stats?.stamina || 50 },
    { attribute: 'Força', value: player.detailedAttributes?.strength || player.strength || 50 },
    { attribute: 'Agilidade', value: player.detailedAttributes?.agility || 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4 hover:bg-accent/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Player Info Card */}
      <Card className="overflow-hidden bg-card border-border">
        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20">
          {player.image && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url('${player.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="relative px-6 pb-6 -mt-20">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-background bg-muted">
              {player.image ? (
                <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                  <span className="text-4xl text-background font-bold">{player.name?.charAt(0) || '?'}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {player.position || 'Não informada'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {player.age || '--'} anos
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {player.nationality || 'Não informada'}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-background">{player.rating || 0}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Avaliação</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Altura</div>
                  <div className="font-semibold">{player.height || '--'} m</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Peso</div>
                  <div className="font-semibold">{player.weight || '--'} kg</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Clube</div>
                  <div className="font-semibold text-sm truncate">{player.club || 'Sem clube'}</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Pé Dominante</div>
                  <div className="font-semibold">{player.preferredFoot || player.dominantFoot || '--'}</div>
                </div>
              </div>

              {/* Atualizado para mostrar sempre que houver o nome do criador e a opção de mensagem */}
              {(player.createdByName || player.addedBy) && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mb-4 bg-gradient-to-r from-muted/50 to-muted/30 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cadastrado por</div>
                      <div className="font-semibold">{player.createdByName || player.addedBy}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onSendMessage?.(player.createdByName || player.addedBy)}
                    size="sm"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Enviar Mensagem
                  </Button>
                </div>
              )}

              {userType === 'scout' && onCreateReport && (
                <Button
                  onClick={onCreateReport}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Criar Relatório
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/30">
          <TabsTrigger value="overview">Resumo</TabsTrigger>
          <TabsTrigger value="performance">Desempenho</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="lesoes">Lesões</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Atributos Técnicos</h3>
              </div>
              <StatsRadar data={radarData} />
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Capacidades Físicas</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={physicalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#8b92a8' }} />
                  <YAxis dataKey="attribute" type="category" tick={{ fill: '#8b92a8' }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f2e',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#a3ff12" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-6">Estatísticas da Temporada</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Jogos', value: player.matchStats?.matchesPlayed ?? player.matchesPlayed ?? 0 },
                { label: 'Gols', value: player.matchStats?.goals ?? player.goals ?? 0 },
                { label: 'Assistências', value: player.matchStats?.assists ?? player.assists ?? 0 },
                { label: 'Cartões Amarelos', value: player.matchStats?.yellowCards ?? player.yellowCards ?? 0 },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 rounded-lg bg-muted/30"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-4">
            {!player.reports || player.reports.length === 0 ? (
               <Card className="p-6 bg-card border-border text-center text-muted-foreground">
                 Nenhum relatório associado a este atleta.
               </Card>
            ) : (
              player.reports.map((report: any, idx: number) => (
                <Card key={idx} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Relatório Técnico
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="w-3 h-3" /> Olheiro: {report.scoutName || 'Sistema'} • {new Date(report.createdAt || report.matchDate || Date.now()).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Resumo do Relatório (Sem notas) */}
                  <div className="bg-muted/20 p-4 rounded-lg border border-border mt-4">
                    <p className="text-sm text-foreground">
                      {report.summary || report.comments || `Relatório de observação e análise técnica elaborado pelo olheiro responsável. O jogador foi avaliado em campo e os dados foram registrados no sistema.`}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="lesoes" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Histórico de Lesões
            </h3>
            <div className="space-y-4">
              {!player.injuries || player.injuries.length === 0 ? (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/30 text-center">
                  <span className="font-medium text-accent">Nenhuma lesão registrada.</span>
                </div>
              ) : (
                player.injuries.map((injury: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border">
                    <div className="flex-1">
                      <div className="font-medium">{injury.injuryType}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        Data: {new Date(injury.startDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={
                          injury.severity === 'Leve' ? 'bg-accent/10 text-accent border-accent/30' : 
                          injury.severity === 'Moderada' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                          'bg-destructive/10 text-destructive border-destructive/30'
                        }
                      >
                        {injury.severity}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}