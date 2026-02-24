import { useState, useEffect } from 'react'; // <-- Adicionado useEffect
import { Button } from './ui/button';
import { Card } from './ui/card';

import {
  Target,
  BarChart3,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
  Trophy,
  Zap,
  Eye,
  CheckCircle2,
  ArrowRight,
  Star,
  Globe,
  Github,   
  Linkedin, 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react'; 
import heroBackground from 'figma:asset/ffe701c157ebb33d2177c416621151f725679384.png';

interface LandingPageProps {
  onLoginClick: (type: 'admin' | 'scout') => void;
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  // Estado para controlar a exibição dos links de contato
  const [showContact, setShowContact] = useState(false);

  // Estado para armazenar as estatísticas do banco de dados
  const [statsData, setStatsData] = useState([
    { value: '...', label: 'Jogadores' },
    { value: '...', label: 'Clubes' },
    { value: '...', label: 'Relatórios' },
    { value: '...', label: 'Olheiros' },
  ]);

  // Efeito para buscar as estatísticas assim que a página carregar
 useEffect(() => {
    fetch('http://localhost:8080/api/dashboard/stats')
      .then((response) => response.json())
      .then((data) => {
        // Agora pega o número exato. Se não tiver nada no banco, mostra 0.
        setStatsData([
          { value: String(data.totalAthletes || 0), label: 'Jogadores' },
          { value: String(data.totalClubs || 0), label: 'Clubes' },
          { value: String(data.totalReports || 0), label: 'Relatórios' },
          { value: String(data.totalScouts || 0), label: 'Olheiros' },
        ]);
      })
      .catch((error) => {
        console.error("Erro ao buscar estatísticas do banco de dados:", error);
      });
  }, []);
  
  const features = [
    {
      icon: Target,
      title: 'Identificação de Talentos',
      description: 'Sistema avançado para descobrir e avaliar jovens talentos do futebol',
    },
    {
      icon: BarChart3,
      title: 'Análise Detalhada',
      description: 'Métricas técnicas, físicas e táticas com visualização em tempo real',
    },
    {
      icon: MessageSquare,
      title: 'Comunicação Direta',
      description: 'Chat integrado entre olheiros e administradores para feedback ágil',
    },
    {
      icon: Shield,
      title: 'Gestão Profissional',
      description: 'Controle total sobre o banco de jogadores e relatórios de scouting',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('${heroBackground}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="container relative mx-auto px-4 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary">Plataforma Profissional de Scouting</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              O Futuro do Scouting de Talentos
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Conecte olheiros, administradores e jogadores em uma plataforma moderna. 
              Transforme dados em decisões estratégicas para o seu clube.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => onLoginClick('admin')}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 h-14"
              >
                <Shield className="w-5 h-5 mr-2" />
                Entrar como Administrador
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onLoginClick('scout')}
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-lg px-8 h-14"
              >
                <Target className="w-5 h-5 mr-2" />
                Entrar como Olheiro
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto">
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-4 bg-card/50 backdrop-blur-sm border-border">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em uma <span className="text-primary">única plataforma</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ferramentas profissionais para transformar o processo de identificação e análise de talentos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card border-border hover:border-primary/50 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como <span className="text-accent">funciona</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Cadastre Jogadores',
                description: 'Administradores adicionam jogadores ao sistema com todas as informações relevantes',
                icon: Users,
              },
              {
                step: '02',
                title: 'Olheiros Avaliam',
                description: 'Scouts analisam jogadores e criam relatórios detalhados sobre desempenho técnico e tático',
                icon: Target,
              },
              {
                step: '03',
                title: 'Tome Decisões',
                description: 'Visualize dados, compare atletas e tome decisões estratégicas baseadas em informações concretas',
                icon: TrendingUp,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <Card className="p-6 bg-card border-border text-center">
                    <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o <span className="text-primary">ScoutPro</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Uma plataforma completa desenvolvida por profissionais do scouting
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'Rápido e Eficiente',
                description:
                  'Otimize seu tempo com ferramentas intuitivas e automaões inteligentes',
                color: 'from-chart-3 to-chart-3/50',
              },
              {
                icon: Eye,
                title: 'Visão 360°',
                description:
                  'Tenha uma visão completa do jogador com dados técnicos, físicos e táticos',
                color: 'from-primary to-primary/50',
              },
              {
                icon: Globe,
                title: 'Acesso Global',
                description:
                  'Trabalhe de qualquer lugar com sincronização em tempo real',
                color: 'from-chart-2 to-chart-2/50',
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card border-border hover:border-primary/50 transition-all group">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 text-background" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-background"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-background"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-background"
                  />
                </svg>
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ScoutPro
              </span>
              <span className="ml-2">© 2026 - Todos os direitos reservados</span>
            </div>

            {/* Nova seção de contatos animada */}
            <div className="flex items-center gap-6">
              <AnimatePresence>
                {showContact && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 mr-2"
                  >
                    <a 
                      href="https://github.com/ViniciusAndradeCosta" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/vinícius-andrade-4a4b33250/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => setShowContact(!showContact)}
                className={`transition-colors font-medium ${showContact ? 'text-primary' : 'hover:text-primary'}`}
              >
                {showContact ? 'Ocultar Contato' : 'Contato'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}