import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  FileText,
  Award,
  MessageSquare,
  Activity,
  Target,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface ScoutProfilePageProps {
  scoutId: string;
  onBack: () => void;
  onMessage: (scoutName: string) => void;
}

export function ScoutProfilePage({ scoutId, onBack, onMessage }: ScoutProfilePageProps) {
  // Mock data - em produção viria do backend
  const scout = {
    id: scoutId,
    name: 'Carlos Mendes',
    email: 'carlos.mendes@scoutpro.com',
    phone: '+55 11 98765-4321',
    location: 'São Paulo, SP',
    joinDate: 'Março 2024',
    bio: 'Scout profissional com 8 anos de experiência em identificação de talentos. Especialista em avaliação de atacantes e meio-campistas jovens. Trabalhou anteriormente com clubes da Série A e B do Campeonato Brasileiro.',
    status: 'Ativo',
    specialties: ['Atacantes', 'Meio-campistas', 'Jovens Talentos'],
    stats: {
      totalReports: 45,
      avgRating: 8.2,
      playersDiscovered: 12,
      successRate: 73,
    },
  };

  const monthlyReports = [
    { month: 'Jan', reports: 8 },
    { month: 'Fev', reports: 6 },
    { month: 'Mar', reports: 9 },
    { month: 'Abr', reports: 7 },
    { month: 'Mai', reports: 8 },
    { month: 'Jun', reports: 7 },
  ];

  const ratingTrend = [
    { month: 'Jan', rating: 7.8 },
    { month: 'Fev', rating: 8.0 },
    { month: 'Mar', rating: 8.1 },
    { month: 'Abr', rating: 8.3 },
    { month: 'Mai', rating: 8.2 },
    { month: 'Jun', rating: 8.2 },
  ];

  const recentReports = [
    {
      id: 1,
      player: 'João Silva',
      date: '2 dias atrás',
      rating: 8.5,
      status: 'Aprovado',
    },
    {
      id: 2,
      player: 'Pedro Santos',
      date: '5 dias atrás',
      rating: 7.8,
      status: 'Em Revisão',
    },
    {
      id: 3,
      player: 'Lucas Ferreira',
      date: '1 semana atrás',
      rating: 8.2,
      status: 'Aprovado',
    },
    {
      id: 4,
      player: 'Rafael Costa',
      date: '1 semana atrás',
      rating: 7.5,
      status: 'Aprovado',
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6 bg-card border-border">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-background text-2xl">
                    {scout.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-2xl font-bold mb-1">{scout.name}</h2>
                <Badge
                  className={
                    scout.status === 'Ativo'
                      ? 'bg-accent/20 text-accent border-accent/30 mb-4'
                      : 'mb-4'
                  }
                >
                  {scout.status}
                </Badge>

                <p className="text-sm text-muted-foreground mb-6">
                  {scout.bio}
                </p>

                <Button
                  onClick={() => onMessage(scout.name)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </div>
            </Card>

            {/* Contact Info */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4">Informações de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{scout.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{scout.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{scout.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Membro desde {scout.joinDate}
                  </span>
                </div>
              </div>
            </Card>

            {/* Specialties */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {scout.specialties.map((specialty, idx) => (
                  <Badge
                    key={idx}
                    className="bg-primary/20 text-primary border-primary/30"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scout.stats.totalReports}</p>
                    <p className="text-xs text-muted-foreground">Relatórios</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scout.stats.avgRating}</p>
                    <p className="text-xs text-muted-foreground">Média</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scout.stats.playersDiscovered}</p>
                    <p className="text-xs text-muted-foreground">Descobertos</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-card border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{scout.stats.successRate}%</p>
                    <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Relatórios por Mês
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyReports}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" tick={{ fill: '#8b92a8' }} />
                    <YAxis tick={{ fill: '#8b92a8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1f2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="reports" fill="#00d9ff" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Tendência de Avaliação
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ratingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" tick={{ fill: '#8b92a8' }} />
                    <YAxis domain={[7, 9]} tick={{ fill: '#8b92a8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1f2e',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rating"
                      stroke="#a3ff12"
                      strokeWidth={2}
                      dot={{ fill: '#a3ff12', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="p-6 bg-card border-border">
              <h3 className="font-semibold mb-4">Relatórios Recentes</h3>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{report.player}</h4>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Nota: {report.rating}</p>
                        <Badge
                          variant={
                            report.status === 'Aprovado' ? 'default' : 'secondary'
                          }
                          className={
                            report.status === 'Aprovado'
                              ? 'bg-accent/20 text-accent border-accent/30'
                              : ''
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
