import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { StatCard } from './shared/StatCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  FileText, Award, Clock, Star, Target, Calendar, ArrowRight, Trophy, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

interface DashboardScoutProps {
  onViewPlayer: (id: string) => void;
  onNavigate?: (view: string) => void;
}

const COLORS = ['#00d9ff', '#a3ff12', '#ff6b6b', '#ffd93d', '#9b59b6', '#f1c40f'];

export function DashboardScout({ onViewPlayer, onNavigate }: DashboardScoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [myStats, setMyStats] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [positionData, setPositionData] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<any>({
    reports: { current: 0, target: 12, label: 'Relatórios' },
    players: { current: 0, target: 10, label: 'Novos Jogadores' },
  });

  useEffect(() => {
    const fetchScoutData = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        if (!token || token === 'undefined') {
          setIsLoading(false);
          return;
        }

        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const [athletesRes, reportsRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/athletes', { headers }),
          fetch('http://localhost:8080/api/v1/reports', { headers })
        ]);

        if (!athletesRes.ok || !reportsRes.ok) throw new Error("Erro");

        const athletes = await athletesRes.json();
        const reports = await reportsRes.json();

        setMyStats([
          { icon: FileText, label: 'Total de Relatórios', value: reports.length.toString(), subtitle: 'criados por você', positive: reports.length > 0 },
          { icon: Award, label: 'Aprovados', value: reports.filter((r: any) => r.status === 'approved' || !r.status).length.toString(), subtitle: 'avaliações aceitas', positive: true },
          { icon: Clock, label: 'Pendentes', value: reports.filter((r: any) => r.status === 'pending').length.toString(), subtitle: 'aguardando análise', positive: false },
        ]);

        const sortedReports = [...reports].sort((a, b) => new Date(b.createdAt || b.matchDate || 0).getTime() - new Date(a.createdAt || a.matchDate || 0).getTime());

        setRecentReports(sortedReports.slice(0, 6).map(r => {
          // CORREÇÃO: Procura garantindo conversão numérica, evita "Desconhecido"
          const athlete = athletes.find((a: any) => Number(a.id) === Number(r.athleteId));
          return {
            id: r.id.toString(),
            athleteId: r.athleteId.toString(), // Salvo para redirecionar certo no click
            playerName: athlete?.name || 'Jogador Desconhecido',
            date: new Date(r.createdAt || r.matchDate).toLocaleDateString('pt-BR'),
            rating: parseFloat(((r.technicalRating + r.tacticalRating + r.physicalRating) / 3).toFixed(1)),
            status: r.status || 'approved',
            position: athlete?.position || 'ND'
          };
        }));

        // (Lógica simplificada dos Top Players)
        const playerRatings: any = {};
        reports.forEach((r: any) => {
          const rating = (r.technicalRating + r.tacticalRating + r.physicalRating) / 3;
          if (!playerRatings[r.athleteId]) playerRatings[r.athleteId] = { sum: 0, count: 0 };
          playerRatings[r.athleteId].sum += rating;
          playerRatings[r.athleteId].count += 1;
        });

        const top = Object.entries(playerRatings).map(([id, data]: any) => ({ athleteId: parseInt(id), avg: data.sum / data.count }))
          .sort((a, b) => b.avg - a.avg).slice(0, 3).map(entry => {
            const athlete = athletes.find((a: any) => Number(a.id) === entry.athleteId);
            return {
              id: entry.athleteId.toString(),
              name: athlete?.name || 'Desconhecido',
              position: athlete?.position || 'ND',
              rating: entry.avg.toFixed(1),
              club: athlete?.club || 'Sem Clube'
            };
          });
        setTopPlayers(top);

        const posCount: any = {};
        athletes.forEach((a: any) => { posCount[a.position || 'Outro'] = (posCount[a.position || 'Outro'] || 0) + 1; });
        setPositionData(Object.entries(posCount).map(([name, value], idx) => ({ name, value, color: COLORS[idx % COLORS.length] })));

        const monthsData: any = {};
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentMonthIdx = new Date().getMonth();
        let reportsThisMonth = 0;
        const uniqueAthletes = new Set();

        reports.forEach((r: any) => {
          uniqueAthletes.add(r.athleteId);
          const d = new Date(r.createdAt || r.matchDate);
          if (d.getMonth() === currentMonthIdx) reportsThisMonth++;
          if (!monthsData[monthNames[d.getMonth()]]) monthsData[monthNames[d.getMonth()]] = { count: 0, ratingSum: 0 };
          monthsData[monthNames[d.getMonth()]].count += 1;
          monthsData[monthNames[d.getMonth()]].ratingSum += (r.technicalRating + r.tacticalRating + r.physicalRating) / 3;
        });

        const chartData = monthNames.filter(m => monthsData[m]).map(m => ({ month: m, reports: monthsData[m].count }));
        setMonthlyData(chartData.length ? chartData : [{ month: monthNames[currentMonthIdx], reports: 0 }]);
        setMonthlyGoals({ reports: { current: reportsThisMonth, target: 12, label: 'Relatórios' }, players: { current: uniqueAthletes.size, target: 10, label: 'Jogadores' }});
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScoutData();
  }, []);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Carregando painel do olheiro...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl mb-2">Painel do Scout</h1><p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo do seu desempenho</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myStats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /><h3 className="text-lg">Evolução Mensal</h3></div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate?.('players')} className="text-primary hover:text-primary/80">Ver Todos <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs><linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d9ff" stopOpacity={0.3} /><stop offset="95%" stopColor="#00d9ff" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#8b92a8' }} /><YAxis tick={{ fill: '#8b92a8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="reports" stroke="#00d9ff" strokeWidth={2} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-accent" /><h3 className="text-lg">Relatórios Recentes</h3></div>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => onNavigate?.('reports')}>Ver Todos <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </div>
            <div className="space-y-3">
              {recentReports.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Nenhum relatório encontrado.</p> : recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => onViewPlayer(report.athleteId)} // CORREÇÃO: O clique direciona pelo athleteId do relatório
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><h4 className="font-semibold">{report.playerName}</h4><Badge variant="outline" className="text-xs bg-muted/50">{report.position}</Badge></div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{report.date}</div><Badge className={report.status === 'approved' ? 'bg-accent/10 text-accent' : 'bg-chart-3/10 text-chart-3'}>{report.status === 'approved' ? 'Aprovado' : 'Pendente'}</Badge></div>
                  </div>
                  <div className="text-right"><div className={`text-2xl ${report.rating >= 8 ? 'text-green-400' : report.rating >= 6 ? 'text-yellow-400' : 'text-red-400'}`}>{report.rating}</div></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-2 mb-6"><Target className="w-5 h-5 text-primary" /><h3 className="text-lg">Metas do Mês</h3></div>
            <div className="space-y-4">
              {Object.entries(monthlyGoals).map(([key, goal]: [string, any]) => {
                const percentage = Math.min((goal.current / goal.target) * 100, 100);
                return <div key={key}><div className="flex items-center justify-between mb-2"><span className="text-sm">{goal.label}</span><span className="text-sm">{goal.current}/{goal.target}</span></div><Progress value={percentage} className="h-2" /></div>;
              })}
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-2 mb-6"><Star className="w-5 h-5 text-accent" /><h3 className="text-lg">Top Avaliações</h3></div>
            <div className="space-y-3">
              {topPlayers.length === 0 ? <p className="text-sm text-center py-4">Nenhum jogador avaliado.</p> : topPlayers.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border hover:border-primary/30 cursor-pointer" onClick={() => onViewPlayer(player.id)}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-background font-bold text-sm">{index + 1}</div>
                  <div className="flex-1 min-w-0"><div className="font-semibold truncate">{player.name}</div><div className="text-xs text-muted-foreground truncate">{player.position} · {player.club}</div></div>
                  <div className="text-lg text-primary font-bold">{player.rating}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}