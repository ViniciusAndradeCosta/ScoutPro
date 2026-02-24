import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Users, FileText, MessageSquare, TrendingUp, Activity, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Athlete {
  id: number;
  name: string;
  position: string;
}

interface Report {
  id: number;
  athleteId: number;
  scoutId: number;
  matchDate: string;
  createdAt: string;
  technicalRating: number;
  tacticalRating: number;
  physicalRating: number;
}

interface User {
  id: number;
  name: string;
}

const parseDate = (dateVal: any) => {
  if (!dateVal) return new Date();
  if (Array.isArray(dateVal)) {
    return new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0);
  }
  return new Date(dateVal);
};

export function DashboardAdmin() {
  const [statsData, setStatsData] = useState({ athletes: 0, reports: 0 });
  const [positionData, setPositionData] = useState<{ position: string; count: number }[]>([]);
  const [activityData, setActivityData] = useState<{ month: string; reports: number }[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [athletesRes, reportsRes, usersRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/athletes', { headers }),
          fetch('http://localhost:8080/api/v1/reports', { headers }),
          fetch('http://localhost:8080/api/v1/users', { headers })
        ]);

        if (!athletesRes.ok || !reportsRes.ok || !usersRes.ok) {
          throw new Error("Erro ao buscar dados do servidor");
        }

        const athletes: Athlete[] = await athletesRes.json();
        const reports: Report[] = await reportsRes.json();
        const users: User[] = await usersRes.json();

        setStatsData({
          athletes: athletes.length,
          reports: reports.length
        });

        const positionsCount: Record<string, number> = {};
        athletes.forEach(a => {
          const pos = a.position || 'Não Definido';
          positionsCount[pos] = (positionsCount[pos] || 0) + 1;
        });
        setPositionData(Object.keys(positionsCount).map(key => ({
          position: key,
          count: positionsCount[key]
        })));

        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const currentMonth = new Date().getMonth();
        const last6Months: { month: string, reports: number }[] = [];
        
        for (let i = 5; i >= 0; i--) {
          let mIndex = currentMonth - i;
          if (mIndex < 0) mIndex += 12;
          last6Months.push({ month: monthNames[mIndex], reports: 0 });
        }

        reports.forEach(r => {
          const dateVal = r.matchDate || r.createdAt;
          if (dateVal) {
            const mStr = monthNames[parseDate(dateVal).getMonth()];
            const monthEntry = last6Months.find(m => m.month === mStr);
            if (monthEntry) monthEntry.reports += 1;
          }
        });
        
        setActivityData(last6Months);

        const sortedReports = [...reports].sort((a, b) => {
          return parseDate(b.createdAt || 0).getTime() - parseDate(a.createdAt || 0).getTime();
        }).slice(0, 3);

        const mappedRecentReports = sortedReports.map(report => {
          const athlete = athletes.find(a => a.id === report.athleteId);
          const scout = users.find(u => u.id === report.scoutId);
          
          const averageRating = (
            (report.technicalRating + report.tacticalRating + report.physicalRating) / 3
          ).toFixed(1);

          return {
            id: report.id,
            player: athlete ? athlete.name : 'Jogador Desconhecido',
            scout: scout ? scout.name : 'Olheiro Desconhecido',
            rating: averageRating,
            date: parseDate(report.createdAt || report.matchDate).toLocaleDateString('pt-BR'),
          };
        });

        setRecentReports(mappedRecentReports);

      } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Total de Jogadores',
      value: isLoading ? '...' : statsData.athletes,
      positive: true,
    },
    {
      icon: FileText,
      label: 'Relatórios Recentes',
      value: isLoading ? '...' : statsData.reports,
      positive: true,
    },
    {
      icon: MessageSquare,
      label: 'Mensagens Pendentes',
      value: '0', 
      change: '-5%',
      positive: false,
    },
    {
      icon: Award,
      label: 'Jogadores Destacados',
      value: isLoading ? '...' : Math.floor(statsData.athletes * 0.2), 
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon className="w-6 h-6 text-background" />
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      stat.positive
                        ? 'bg-accent/10 text-accent'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Distribuição por Posição</h3>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="position" tick={{ fill: '#8b92a8' }} />
                <YAxis tick={{ fill: '#8b92a8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#00d9ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold">Relatórios Mensais</h3>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#8b92a8' }} />
                <YAxis tick={{ fill: '#8b92a8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="#a3ff12"
                  strokeWidth={3}
                  dot={{ fill: '#a3ff12', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Relatórios Recentes</h3>
          </div>
          <button className="text-sm text-primary hover:underline">Ver todos</button>
        </div>

        <div className="space-y-4">
          {recentReports.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              Nenhum relatório encontrado.
            </div>
          ) : (
            recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-sm font-semibold text-background">
                      {report.player.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{report.player}</div>
                    <div className="text-sm text-muted-foreground">
                      Avaliado por {report.scout}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent">{report.rating}</div>
                    <div className="text-xs text-muted-foreground">Nota</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{report.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}