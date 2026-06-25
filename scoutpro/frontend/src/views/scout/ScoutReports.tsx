import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/shared/StatCard';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FileText, Award, Clock } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

interface ScoutReport {
  id: string | number;
  athleteId: string | number;
  playerName: string;
  date: string;
  status: string;
}

export function ScoutReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ScoutReport[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [athletes, rawReports] = await Promise.all([
          apiRequest<any[]>(API_ENDPOINTS.PLAYERS.LIST),
          apiRequest<any[]>(API_ENDPOINTS.REPORTS.LIST),
        ]);

        setReports(
          (rawReports || []).map((r: any) => {
            const athlete = (athletes || []).find((a: any) => Number(a.id) === Number(r.athleteId));
            return {
              ...r,
              playerName: athlete?.name || 'Jogador Desconhecido',
              date: r.createdAt
                ? new Date(r.createdAt).toLocaleDateString('pt-BR')
                : r.matchDate
                  ? new Date(r.matchDate).toLocaleDateString('pt-BR')
                  : 'Sem data',
            };
          }),
        );
      } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
      }
    };
    load();
  }, []);

  const approved = reports.filter((r) => r.status === 'approved');
  const pending = reports.filter((r) => r.status === 'pending');

  const renderList = (list: ScoutReport[]) => (
    <div className="grid gap-4">
      {list.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">Nenhum relatório encontrado.</Card>
      ) : (
        list.map((report) => (
          <Card
            key={report.id}
            className="p-5 bg-card border-border hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => navigate(`/olheiro/jogador/${report.athleteId ?? report.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{report.playerName}</h3>
                  <Badge
                    className={
                      report.status === 'approved'
                        ? 'bg-accent/10 text-accent border-accent/20'
                        : 'bg-chart-3/10 text-chart-3 border-chart-3/20'
                    }
                  >
                    {report.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" /> Relatório #{report.id}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {report.date}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Ver Jogador
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Meus Relatórios</h2>
        <p className="text-muted-foreground">Histórico completo dos relatórios que você criou</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={FileText} label="Total de Relatórios" value={reports.length.toString()} subtitle="criados" positive />
        <StatCard icon={Award} label="Aprovados" value={approved.length.toString()} subtitle="taxa de aprovação" positive />
        <StatCard icon={Clock} label="Pendentes" value={pending.length.toString()} subtitle="aguardando análise" positive={false} />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="all">Todos ({reports.length})</TabsTrigger>
          <TabsTrigger value="approved">Aprovados ({approved.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendentes ({pending.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">{renderList(reports)}</TabsContent>
        <TabsContent value="approved" className="mt-6">{renderList(approved)}</TabsContent>
        <TabsContent value="pending" className="mt-6">{renderList(pending)}</TabsContent>
      </Tabs>
    </div>
  );
}
