import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Search, MapPin, Mail, MessageSquare, Target } from 'lucide-react';
import { Input } from '../ui/input';

interface ScoutsSectionProps {
  onSendMessage: (scoutName: string) => void;
  // CORREÇÃO: Prop para navegação adicionada
  onNavigate?: (view: string) => void;
}

export function ScoutsSection({ onSendMessage, onNavigate }: ScoutsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scouts, setScouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScouts = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        const res = await fetch('http://localhost:8080/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const allUsers = await res.json();
          const onlyScouts = allUsers.filter((u: any) => u.role === 'SCOUT');
          setScouts(onlyScouts);
        }
      } catch (error) {
        console.error("Erro ao buscar olheiros:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScouts();
  }, []);

  const filteredScouts = scouts.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando olheiros do banco de dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Gerenciamento de Olheiros</h2>
          <p className="text-muted-foreground">Visualize todos os olheiros registrados no sistema</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou região..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input-background"
          />
        </div>
      </div>

      {filteredScouts.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <p className="text-muted-foreground mb-4">Nenhum olheiro encontrado no banco de dados.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredScouts.map((scout) => (
            <Card key={scout.id} className="p-6 bg-card border-border hover:border-primary/30 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-2 border-primary/20">
                    {scout.image ? (
                      <img src={scout.image} alt={scout.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-background">
                        {scout.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-card rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">{scout.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    {scout.location || 'Sem região definida'}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {scout.email}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-primary text-primary-foreground"
                  onClick={() => onSendMessage(scout.name)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Mensagem
                </Button>
                {/* CORREÇÃO: Adicionado evento de onClick para navegar para os Relatórios */}
                <Button 
                  variant="outline" 
                  className="flex-1 border-primary text-primary hover:bg-primary/10"
                  onClick={() => onNavigate && onNavigate('reports')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Relatórios
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}