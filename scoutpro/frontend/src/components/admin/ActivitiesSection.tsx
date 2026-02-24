import { useState, useEffect } from 'react';
import { ActivityFeed } from '../shared/ActivityFeed';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar, Filter, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Activity {
  id: string;
  type: 'report' | 'message' | 'player_added' | 'achievement' | 'performance';
  title: string;
  description: string;
  time: string;
  user?: string;
  metadata?: {
    rating?: number;
    playerName?: string;
    badge?: string;
  };
}

export function ActivitiesSection() {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const res = await fetch('http://localhost:8080/api/v1/activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAllActivities(data);
        }
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const reportActivities = allActivities.filter((a) => a.type === 'report');
  const playerActivities = allActivities.filter((a) => a.type === 'player_added');
  const messageActivities = allActivities.filter((a) => a.type === 'message');

  // Conta quantas atividades ocorreram hoje (simplificado verificando se a string contém 'min' ou 'h')
  const activitiesToday = allActivities.filter((a) => a.time.includes('min') || a.time.includes('h')).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p>Carregando atividades do servidor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Atividades</h2>
          <p className="text-muted-foreground mt-1">
            Acompanhe todas as atividades do sistema em tempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filtrar por Data
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/30">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="players">Jogadores</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="p-6 bg-card border-border">
            {allActivities.length === 0 ? (
               <p className="text-center text-muted-foreground py-8">Nenhuma atividade registrada.</p>
            ) : (
               <ActivityFeed activities={allActivities} maxHeight="700px" showAll />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <ActivityFeed activities={reportActivities} maxHeight="700px" showAll />
          </Card>
        </TabsContent>

        <TabsContent value="players" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <ActivityFeed activities={playerActivities} maxHeight="700px" showAll />
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <ActivityFeed activities={messageActivities} maxHeight="700px" showAll />
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <ActivityFeed
              activities={allActivities.filter(
                (a) => a.type === 'achievement' || a.type === 'performance'
              )}
              maxHeight="700px"
              showAll
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Atividades Hoje</div>
          <div className="text-2xl font-semibold text-primary">{activitiesToday}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="text-sm text-muted-foreground mb-1">Novos Relatórios</div>
          <div className="text-2xl font-semibold text-accent">{reportActivities.length}</div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
          <div className="text-sm text-muted-foreground mb-1">Mensagens</div>
          <div className="text-2xl font-semibold" style={{ color: '#ffb800' }}>
            {messageActivities.length}
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
          <div className="text-sm text-muted-foreground mb-1">Jogadores Adicionados</div>
          <div className="text-2xl font-semibold text-destructive">{playerActivities.length}</div>
        </Card>
      </div>
    </div>
  );
}