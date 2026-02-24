import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  rating: number;
  image?: string;
  stats: {
    passing: number;
    dribbling: number;
    shooting: number;
    positioning: number;
    pace: number;
    strength: number;
  };
}

interface PlayerComparisonProps {
  player1: Player;
  player2: Player;
  onClose?: () => void;
}

export function PlayerComparison({ player1, player2, onClose }: PlayerComparisonProps) {
  const attributes = [
    { key: 'passing', label: 'Passe' },
    { key: 'dribbling', label: 'Drible' },
    { key: 'shooting', label: 'Finalização' },
    { key: 'positioning', label: 'Posicionamento' },
    { key: 'pace', label: 'Velocidade' },
    { key: 'strength', label: 'Força' },
  ];

  const getComparison = (val1: number, val2: number) => {
    const diff = val1 - val2;
    if (Math.abs(diff) < 5) return 'equal';
    return diff > 0 ? 'higher' : 'lower';
  };

  const ComparisonIcon = ({ comparison }: { comparison: 'higher' | 'lower' | 'equal' }) => {
    if (comparison === 'higher')
      return <TrendingUp className="w-4 h-4 text-accent" />;
    if (comparison === 'lower')
      return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const calculateFallbackRating = (stats: any) => {
    if (!stats) return 0;
    const values = Object.values(stats) as number[];
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  // Garante que o rating será calculado se vier zerado do backend
  const p1Rating = player1.rating > 0 ? player1.rating : calculateFallbackRating(player1.stats);
  const p2Rating = player2.rating > 0 ? player2.rating : calculateFallbackRating(player2.stats);

  return (
    <Card className="bg-card border-border shadow-xl">
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
        <h2 className="text-xl font-bold">Comparação de Jogadores</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Players Header */}
      <div className="grid grid-cols-2 gap-6 p-6 border-b border-border">
        {[
          { player: player1, rating: p1Rating }, 
          { player: player2, rating: p2Rating }
        ].map(({ player, rating }, idx) => (
          <div key={player.id} className={`text-center ${idx === 0 ? 'border-r border-border pr-6' : 'pl-6'}`}>
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background bg-muted shadow-md">
              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                  <span className="text-3xl font-bold text-background">
                    {player.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1">{player.name}</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">{player.position}</Badge>
              <span className="text-sm text-muted-foreground font-medium">{player.age} anos</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{player.club}</p>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 shadow-sm">
              <span className="text-2xl font-bold text-foreground">{rating}</span>
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Rating</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Comparison */}
      <div className="p-6 space-y-5">
        {attributes.map(({ key, label }) => {
          const val1 = player1.stats[key as keyof typeof player1.stats] || 50;
          const val2 = player2.stats[key as keyof typeof player2.stats] || 50;
          const comparison = getComparison(val1, val2);

          return (
            <div key={key} className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ComparisonIcon comparison={comparison} />
                  <span className="font-medium text-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-8 bg-muted/40 px-3 py-1 rounded-md">
                  <span className="text-primary font-bold min-w-[2rem] text-right">
                    {val1}
                  </span>
                  <span className="text-accent font-bold min-w-[2rem] text-left">
                    {val2}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Progress value={val1} className="h-2.5 bg-muted" />
                <Progress value={val2} className="h-2.5 bg-muted [&>div]:bg-accent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-6 bg-muted/30 border-t border-border rounded-b-xl">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground font-medium mb-1">Média Atributos</div>
            <div className="text-3xl font-bold text-primary">
              {calculateFallbackRating(player1.stats)}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium mb-1">Média Atributos</div>
            <div className="text-3xl font-bold text-accent">
              {calculateFallbackRating(player2.stats)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}