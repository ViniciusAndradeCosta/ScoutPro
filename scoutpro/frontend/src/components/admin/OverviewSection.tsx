import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Target, TrendingUp, Users, Activity, Award } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface OverviewSectionProps {
  onNavigate?: (view: string) => void;
}

const COLORS = ['#00d9ff', '#a3ff12', '#ffb800', '#ff4757', '#9b59b6'];

const parseDate = (dateVal: any) => {
  if (!dateVal) return new Date();
  if (Array.isArray(dateVal)) {
    return new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0);
  }
  return new Date(dateVal);
};

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  const [stats, setStats] = useState({ totalPlayers: 0, totalScouts: 0, totalReports: 0, approvedReports: 0 });
  const [topPlayers, setTopPlayers] = useState<any[]>([]);
  const [positionData, setPositionData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [playersRes, usersRes, reportsRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/athletes', { headers }).catch(() => null),
          fetch('http://localhost:8080/api/v1/users', { headers }).catch(() => null),
          fetch('http://localhost:8080/api/v1/reports', { headers }).catch(() => null)
        ]);

        const players = playersRes && playersRes.ok ? await playersRes.json() : [];
        const users = usersRes && usersRes.ok ? await usersRes.json() : [];
        const reports = reportsRes && reportsRes.ok ? await reportsRes.json() : [];

        const scouts = users.filter((u: any) => u.role === 'SCOUT');
        const approved = reports.filter((r: any) => r.status === 'approved' || r.status === null); 

        setStats({
          totalPlayers: players.length,
          totalScouts: scouts.length,
          totalReports: reports.length,
          approvedReports: approved.length
        });

        const playerRatings: Record<string, { sum: number, count: number, name: string, position: string, image: string, club: string }> = {};
        
        reports.forEach((r: any) => {
          const rating = Math.round((r.technicalRating + r.tacticalRating + r.physicalRating) / 3);
          if (!playerRatings[r.athleteId]) {
            const athlete = players.find((p: any) => String(p.id) === String(r.athleteId));
            playerRatings[r.athleteId] = { 
              sum: 0, count: 0, 
              name: athlete?.name || 'Desconhecido', 
              position: athlete?.position || 'ND',
              image: athlete?.image || '',
              club: athlete?.club || 'Sem clube'
            };
          }
          playerRatings[r.athleteId].sum += rating;
          playerRatings[r.athleteId].count += 1;
        });

        const sortedTop = Object.values(playerRatings)
          .map(p => ({ ...p, avgRating: Math.round(p.sum / p.count) }))
          .sort((a, b) => b.avgRating - a.avgRating)
          .slice(0, 4);

        setTopPlayers(sortedTop);

        const posCount: Record<string, number> = {};
        players.forEach((a: any) => {
          const pos = a.position ? a.position.replace(/_/g, ' ') : 'Outros';
          posCount[pos] = (posCount[pos] || 0) + 1;
        });

        setPositionData(Object.entries(posCount).map(([name, value], idx) => ({
          name, 
          value,
          fill: COLORS[idx % COLORS.length]
        })));

        const monthsCount: Record<string, { reports: number, players: number }> = {};
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentMonth = new Date().getMonth();
        
        // Inicializa os últimos 6 meses com zero
        for (let i = 5; i >= 0; i--) {
          let mIndex = currentMonth - i;
          if (mIndex < 0) mIndex += 12;
          monthsCount[monthNames[mIndex]] = { reports: 0, players: 0 };
        }

        reports.forEach((r: any) => {
          const dateVal = r.createdAt || r.matchDate;
          if(dateVal) {
            const mStr = monthNames[parseDate(dateVal).getMonth()];
            if (monthsCount[mStr]) monthsCount[mStr].reports += 1;
          }
        });

        players.forEach((a: any) => {
          // CORREÇÃO DEFINITIVA: NUNCA usar a.birthDate. 
          // Usa a data de criação real, ou assume "agora" como segurança se for nulo
          const dateVal = a.createdAt || new Date(); 
          
          if(dateVal) {
            const mStr = monthNames[parseDate(dateVal).getMonth()];
            if (monthsCount[mStr]) {
              monthsCount[mStr].players += 1;
            }
          }
        });

        setMonthlyData(Object.entries(monthsCount).map(([month, data]) => ({
          month,
          reports: data.reports,
          players: data.players
        })));

      } catch (error) {
        console.error("Erro ao buscar visão geral", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div><p className="text-sm text-muted-foreground mb-1">Total de Atletas</p><h3 className="text-3xl font-bold">{stats.totalPlayers}</h3></div>
        </Card>
        
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"><Target className="w-5 h-5 text-accent" /></div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div><p className="text-sm text-muted-foreground mb-1">Scouts Ativos</p><h3 className="text-3xl font-bold">{stats.totalScouts}</h3></div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center"><Activity className="w-5 h-5 text-yellow-500" /></div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div><p className="text-sm text-muted-foreground mb-1">Relatórios Gerados</p><h3 className="text-3xl font-bold">{stats.totalReports}</h3></div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center"><Award className="w-5 h-5 text-green-500" /></div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div><p className="text-sm text-muted-foreground mb-1">Relatórios Aprovados</p><h3 className="text-3xl font-bold">{stats.approvedReports}</h3></div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border w-full">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Atividade Mensal (Últimos 6 meses)
        </h3>
        <div style={{ width: '100%', height: '350px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#8b92a8' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: '#8b92a8' }} axisLine={false} tickLine={false} allowDecimals={false} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="reports" stroke="#00d9ff" strokeWidth={3} dot={{ fill: '#00d9ff', r: 4, strokeWidth: 2, stroke: '#1a1f2e' }} activeDot={{ r: 6 }} name="Novos Relatórios" />
              <Line type="monotone" dataKey="players" stroke="#a3ff12" strokeWidth={3} dot={{ fill: '#a3ff12', r: 4, strokeWidth: 2, stroke: '#1a1f2e' }} activeDot={{ r: 6 }} name="Novos Jogadores" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Jogadores em Alta</h3>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">Melhores Avaliações</span>
          </div>
          <div className="space-y-4 flex-1">
            {topPlayers.length === 0 ? (
              <div className="h-full flex items-center justify-center min-h-[250px]">
                <p className="text-sm text-muted-foreground py-4 text-center">Ainda não existem avaliações suficientes.</p>
              </div>
            ) : topPlayers.map((player, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold relative shadow-inner">
                    {player.image ? <img src={player.image} alt={player.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-muted-foreground">{player.name.charAt(0)}</span>}
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] text-primary-foreground font-bold shadow-lg border-2 border-background z-10">{i + 1}º</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{player.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{player.position.toLowerCase().replace(/_/g, ' ')} • {player.club}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-primary/10 text-primary font-bold text-lg border-primary/20 px-3 py-1">{player.avgRating}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Distribuição por Posição
          </h3>
          <div style={{ width: '100%', height: '300px' }} className="flex items-center justify-center">
            {positionData.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">Sem dados registrados.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={positionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {positionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}