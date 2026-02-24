import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MessageSquare, TrendingUp, FileText, Award, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ScoutsManagementProps {
  onAddScout: () => void;
  onViewScout: (scoutId: string) => void;
  onMessageScout: (scoutName: string) => void;
}

export function ScoutsManagement({ onAddScout, onViewScout, onMessageScout }: ScoutsManagementProps) {
  const [scouts, setScouts] = useState<any[]>([]);
  const [scoutPerformance, setScoutPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScoutsAndReports = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Busca Usuários e Relatórios
        const [usersRes, reportsRes] = await Promise.all([
          fetch('http://localhost:8080/api/v1/admin/users', { headers }),
          fetch('http://localhost:8080/api/v1/reports', { headers })
        ]);

        if (usersRes.ok && reportsRes.ok) {
          const allUsers = await usersRes.json();
          const allReports = await reportsRes.json();

          // Filtra apenas os usuários que são Scouts
          const scoutUsers = allUsers.filter((u: any) => u.role === 'SCOUT');

          const formattedScouts = scoutUsers.map((scout: any) => {
            // Pega todos os relatórios feitos por este scout
            const myReports = allReports.filter((r: any) => r.scoutId === scout.id);
            
            // Calcula a média das notas
            let totalRating = 0;
            myReports.forEach((r: any) => {
              totalRating += (r.technicalRating + r.tacticalRating + r.physicalRating) / 3;
            });
            const avgRating = myReports.length > 0 ? (totalRating / myReports.length).toFixed(1) : '0';

            return {
              id: scout.id.toString(),
              name: scout.name,
              email: scout.email,
              reports: myReports.length,
              avgRating: parseFloat(avgRating),
              lastActive: new Date(scout.createdAt).toLocaleDateString('pt-BR'), // Como não há lastLogin, usamos createdAt temporariamente
              status: 'Ativo',
              specialties: ['Geral'], // Mock: backend não retorna especialidades no DTO UserResponse
            };
          });

          setScouts(formattedScouts);

          // Prepara os dados pro gráfico (Top 5 Scouts por quantidade de relatórios)
          const performanceData = [...formattedScouts]
            .sort((a, b) => b.reports - a.reports)
            .slice(0, 5)
            .map(s => ({
              name: s.name.split(' ')[0], // Pega só o primeiro nome pro gráfico não ficar exprimido
              reports: s.reports,
              avgRating: s.avgRating
            }));

          setScoutPerformance(performanceData);
        }
      } catch (error) {
        console.error("Erro ao carregar Scouts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScoutsAndReports();
  }, []);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Carregando olheiros...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olheiros</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe o desempenho dos olheiros
          </p>
        </div>
        <Button 
          onClick={onAddScout}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar Olheiro
        </Button>
      </div>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Desempenho dos Olheiros (Top 5)
        </h3>
        {scoutPerformance.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum relatório criado ainda.</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={scoutPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: '#8b92a8' }} />
              <YAxis yAxisId="left" tick={{ fill: '#8b92a8' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#8b92a8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="avgRating"
                fill="#00d9ff"
                radius={[8, 8, 0, 0]}
                name="Média de Avaliação"
              />
              <Bar
                yAxisId="right"
                dataKey="reports"
                fill="#a3ff12"
                radius={[8, 8, 0, 0]}
                name="Qtd. Relatórios"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-6">Lista de Olheiros</h3>
        <div className="space-y-4">
          {scouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum olheiro encontrado.</div>
          ) : (
            scouts.map((scout) => (
              <div
                key={scout.id}
                className="p-5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all border border-border/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-background">
                        {scout.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{scout.name}</h4>
                        <Badge
                          variant={scout.status === 'Ativo' ? 'default' : 'secondary'}
                          className={scout.status === 'Ativo' ? 'bg-accent/20 text-accent border-accent/30' : ''}
                        >
                          {scout.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{scout.email}</p>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            {scout.reports} relatórios
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-accent" />
                          <span className="text-muted-foreground">
                            Média {scout.avgRating}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          Membro desde: {scout.lastActive}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => onMessageScout(scout.name)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Mensagem
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewScout(scout.id)}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}