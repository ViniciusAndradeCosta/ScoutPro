import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Star,
  Activity,
  Zap,
  Target,
  TrendingUp,
  Award,
  Eye,
  Brain,
  Heart,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ReportFormProps {
  playerId: string;
  playerName: string;
  onBack: () => void;
  onSave?: () => void;
}

export function ReportForm({ playerId, playerName, onBack, onSave }: ReportFormProps) {
  const [attributes, setAttributes] = useState({
    passing: 7.5, dribbling: 7.5, shooting: 7.5, firstTouch: 7.5,
    speed: 7.5, strength: 7.5, stamina: 7.5, agility: 7.5,
    positioning: 7.5, vision: 7.5, decision: 7.5, defensiveWork: 7.5,
    mentality: 7.5, leadership: 7.5, workRate: 7.5, discipline: 7.5,
  });

  const [analysis, setAnalysis] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [matchContext, setMatchContext] = useState('');

  const attributeCategories = {
    technical: { label: 'Habilidades Técnicas', icon: Activity, color: 'from-blue-500 to-cyan-500', attributes: { passing: 'Passe', dribbling: 'Drible', shooting: 'Finalização', firstTouch: 'Primeiro Toque' } },
    physical: { label: 'Atributos Físicos', icon: Zap, color: 'from-orange-500 to-yellow-500', attributes: { speed: 'Velocidade', strength: 'Força Física', stamina: 'Resistência', agility: 'Agilidade' } },
    tactical: { label: 'Inteligência Tática', icon: Brain, color: 'from-purple-500 to-pink-500', attributes: { positioning: 'Posicionamento', vision: 'Visão de Jogo', decision: 'Tomada de Decisão', defensiveWork: 'Trabalho Defensivo' } },
    mental: { label: 'Aspectos Mentais', icon: Heart, color: 'from-green-500 to-emerald-500', attributes: { mentality: 'Mentalidade', leadership: 'Liderança', workRate: 'Intensidade', discipline: 'Disciplina' } }
  };

  const handleAttributeChange = (key: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(10, value));
    setAttributes(prev => ({ ...prev, [key]: clampedValue }));
  };

  const handleInputChange = (key: string, inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) handleAttributeChange(key, numValue);
  };

  const incrementAttribute = (key: string) => handleAttributeChange(key, attributes[key as keyof typeof attributes] + 0.5);
  const decrementAttribute = (key: string) => handleAttributeChange(key, attributes[key as keyof typeof attributes] - 0.5);

  const calculateCategoryAverage = (categoryAttributes: Record<string, string>) => {
    const keys = Object.keys(categoryAttributes);
    const sum = keys.reduce((acc, key) => acc + attributes[key as keyof typeof attributes], 0);
    return (sum / keys.length).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('scoutpro_token');
      if (!token) {
        toast.error("Token de autenticação não encontrado!");
        return;
      }

      const technicalRating = parseFloat(calculateCategoryAverage(attributeCategories.technical.attributes));
      const tacticalRating = parseFloat(calculateCategoryAverage(attributeCategories.tactical.attributes));
      const physicalRating = parseFloat(calculateCategoryAverage(attributeCategories.physical.attributes));

      const payload = {
        athleteId: parseInt(playerId),
        technicalRating: Math.round(technicalRating),
        tacticalRating: Math.round(tacticalRating),
        physicalRating: Math.round(physicalRating),
        matchDate: new Date().toISOString(),
        strengths,
        weaknesses,
        notes: analysis
      };

      const res = await fetch('http://localhost:8080/api/v1/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Relatório salvo com sucesso!'); // Pop-up estiloso
        if (onSave) onSave();
      } else {
        toast.error('Erro ao salvar o relatório no banco de dados.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Ocorreu um erro de rede ao tentar salvar o relatório.');
    }
  };

  const overallRating = (Object.values(attributes).reduce((sum, val) => sum + val, 0) / Object.values(attributes).length).toFixed(1);

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-green-400';
    if (rating >= 7.0) return 'text-cyan-400';
    if (rating >= 5.5) return 'text-yellow-400';
    if (rating >= 4.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 8.5) return 'bg-green-400/10 border-green-400/30';
    if (rating >= 7.0) return 'bg-cyan-400/10 border-cyan-400/30';
    if (rating >= 5.5) return 'bg-yellow-400/10 border-yellow-400/30';
    if (rating >= 4.0) return 'bg-orange-400/10 border-orange-400/30';
    return 'bg-red-400/10 border-red-400/30';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 9.0) return 'Excepcional';
    if (rating >= 8.0) return 'Excelente';
    if (rating >= 7.0) return 'Muito Bom';
    if (rating >= 6.0) return 'Bom';
    if (rating >= 5.0) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4 -ml-4 hover:bg-accent/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl mb-2">Relatório de Scouting</h1>
          <p className="text-muted-foreground">Avaliação completa do jogador: <span className="text-foreground font-semibold">{playerName}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="text-lg">Avaliação Geral</h3>
                    <p className="text-sm text-muted-foreground">Média de todos os atributos</p>
                  </div>
                </div>
                <Badge className={`${getRatingColor(parseFloat(overallRating))} bg-background/50 border px-4 py-2 text-sm`}>
                  {getRatingLabel(parseFloat(overallRating))}
                </Badge>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className={`text-8xl ${getRatingColor(parseFloat(overallRating))}`}>
                    {overallRating}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Star className={`w-8 h-8 ${getRatingColor(parseFloat(overallRating))} fill-current`} />
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(attributeCategories).map(([key, category]) => {
                      const avg = calculateCategoryAverage(category.attributes);
                      const Icon = category.icon;
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm">{category.label.split(' ')[0]}</span>
                          </div>
                          <span className={`text-xl ${getRatingColor(parseFloat(avg))}`}>{avg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {Object.entries(attributeCategories).map(([categoryKey, category], index) => {
            const Icon = category.icon;
            const categoryAvg = calculateCategoryAverage(category.attributes);
            return (
              <motion.div key={categoryKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg">{category.label}</h3>
                        <p className="text-xs text-muted-foreground">{Object.keys(category.attributes).length} atributos</p>
                      </div>
                    </div>
                    <div className={`text-2xl ${getRatingColor(parseFloat(categoryAvg))}`}>{categoryAvg}</div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(category.attributes).map(([key, label]) => {
                      const value = attributes[key as keyof typeof attributes];
                      return (
                        <div key={key} className="space-y-2">
                          <Label className="text-sm">{label}</Label>
                          <div className="flex items-center gap-3">
                            <Button type="button" variant="outline" size="icon" onClick={() => decrementAttribute(key)} disabled={value <= 0} className="h-11 w-11 shrink-0 border-border hover:bg-primary/10">
                              <Minus className="w-4 h-4" />
                            </Button>
                            <div className="flex-1 relative">
                              <Input type="number" min="0" max="10" step="0.5" value={value} onChange={(e) => handleInputChange(key, e.target.value)} className={`text-center text-2xl h-14 bg-background border-2 ${getRatingBgColor(value)} ${getRatingColor(value)}`} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">/10</span>
                            </div>
                            <Button type="button" variant="outline" size="icon" onClick={() => incrementAttribute(key)} disabled={value >= 10} className="h-11 w-11 shrink-0 border-border hover:bg-primary/10">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${ i < Math.floor(value) ? (value >= 8.5 ? 'bg-green-400' : value >= 7.0 ? 'bg-cyan-400' : value >= 5.5 ? 'bg-yellow-400' : value >= 4.0 ? 'bg-orange-400' : 'bg-red-400') : 'bg-border' }`} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Eye className="w-5 h-5 text-background" />
            </div>
            <div><h3 className="text-lg">Análise Detalhada</h3><p className="text-sm text-muted-foreground">Observações sobre o desempenho do jogador</p></div>
          </div>
          <div className="space-y-6">
            <div>
              <Label htmlFor="matchContext" className="mb-2 flex items-center gap-2"><Target className="w-4 h-4" />Contexto da Partida</Label>
              <Input id="matchContext" placeholder="Ex: Final do campeonato sub-20..." value={matchContext} onChange={(e) => setMatchContext(e.target.value)} className="bg-input-background border-border" />
            </div>
            <Separator />
            <div>
              <Label htmlFor="strengths" className="mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" />Pontos Fortes</Label>
              <Textarea id="strengths" placeholder="Descreva os principais pontos fortes do jogador..." value={strengths} onChange={(e) => setStrengths(e.target.value)} className="min-h-24 bg-input-background border-border resize-none" />
            </div>
            <div>
              <Label htmlFor="weaknesses" className="mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400" />Áreas de Melhoria</Label>
              <Textarea id="weaknesses" placeholder="Identifique as áreas que precisam de desenvolvimento..." value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} className="min-h-24 bg-input-background border-border resize-none" />
            </div>
            <div>
              <Label htmlFor="analysis" className="mb-2 flex items-center gap-2"><Brain className="w-4 h-4 text-purple-400" />Avaliação Geral do Desempenho</Label>
              <Textarea id="analysis" placeholder="Análise completa do jogador, considerando todos os aspectos..." value={analysis} onChange={(e) => setAnalysis(e.target.value)} className="min-h-32 bg-input-background border-border resize-none" />
            </div>
            <div>
              <Label htmlFor="recommendation" className="mb-2 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" />Recomendação</Label>
              <Textarea id="recommendation" placeholder="Sua recomendação final (contratar, acompanhar, dispensar)..." value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="min-h-24 bg-input-background border-border resize-none" />
            </div>
          </div>
        </Card>
      </form>

      <div className="fixed bottom-0 left-0 md:left-[280px] right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
        <div className="px-6 md:px-8 py-4">
          <div className="flex gap-4 max-w-7xl">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-12 border-border hover:bg-muted">Cancelar</Button>
            <Button type="submit" onClick={handleSubmit} className="flex-1 h-12 bg-gradient-to-r from-accent to-primary text-primary-foreground hover:opacity-90"><Save className="w-4 h-4 mr-2" />Salvar Relatório</Button>
          </div>
        </div>
      </div>
    </div>
  );
}