import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input'; // <-- CORREÇÃO: Importação do Input adicionada
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Trash2, Plus, Upload, Loader2, Save, X, Activity, User, HeartPulse, Trophy, Image as ImageIcon } from 'lucide-react';
import type { PlayerInjury } from '../../types';

interface AddPlayerFormProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function AddPlayerForm({ onSave, onCancel }: AddPlayerFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Informações Básicas
  const [name, setName] = useState('');
  const [position, setPosition] = useState<string>('ATACANTE');
  const [birthDate, setBirthDate] = useState<string>('');
  const [club, setClub] = useState('');
  const [nationality, setNationality] = useState('Brasil');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [dominantFoot, setDominantFoot] = useState<string>('RIGHT'); 
  const [base64Image, setBase64Image] = useState<string>('');

  // Estatísticas e Atributos começam vazios
  const [matchStats, setMatchStats] = useState<Record<string, number | ''>>({ 
    goals: '', assists: '', yellowCards: '', matchesPlayed: '' 
  });
  const [attributes, setAttributes] = useState<Record<string, number | ''>>({ 
    finishing: '', dribbling: '', positioning: '', pace: '', strength: '', stamina: '', passing: '' 
  });
  const [injuries, setInjuries] = useState<PlayerInjury[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addInjury = () => setInjuries([...injuries, { injuryType: '', startDate: '', severity: 'Leve' }]);
  
  const updateInjury = (index: number, field: keyof PlayerInjury, value: string) => {
    const newInjuries = [...injuries];
    if (field === 'severity') {
      newInjuries[index] = { ...newInjuries[index], [field]: value as 'Leve' | 'Moderada' | 'Grave' };
    } else {
      newInjuries[index] = { ...newInjuries[index], [field]: value };
    }
    setInjuries(newInjuries);
  };
  
  const removeInjury = (index: number) => setInjuries(injuries.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name, birthDate: birthDate || null, nationality, dominantFoot, position, club,
        height: Number(height) || 1.70,
        weight: Number(weight) || 70,
        image: base64Image, 
        matchesPlayed: Number(matchStats.matchesPlayed) || 0, 
        goals: Number(matchStats.goals) || 0,
        assists: Number(matchStats.assists) || 0, 
        yellowCards: Number(matchStats.yellowCards) || 0, 
        finishing: Number(attributes.finishing) || 50,
        dribbling: Number(attributes.dribbling) || 50, 
        positioning: Number(attributes.positioning) || 50, 
        pace: Number(attributes.pace) || 50,
        strength: Number(attributes.strength) || 50, 
        stamina: Number(attributes.stamina) || 50, 
        passing: Number(attributes.passing) || 50, 
        injuries
      };

      const token = localStorage.getItem('scoutpro_token'); 
      const response = await fetch('http://localhost:8080/api/v1/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Falha: ${response.status}`);
      const savedData = await response.json();
      onSave?.(savedData);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o jogador.');
    } finally {
      setIsLoading(false);
    }
  };

  // CORREÇÃO: Utilizando (e: any) para evitar qualquer erro de inferência rígida do Typescript
  return (
    <Card className="bg-card border-border shadow-xl overflow-hidden rounded-xl">
      <form onSubmit={handleSubmit}>
        <div className="p-8 space-y-8">
          <Tabs defaultValue="basico" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-14 bg-muted/40 rounded-xl p-1.5 mb-8 shadow-sm">
              <TabsTrigger value="basico" className="rounded-lg gap-2"><User className="w-4 h-4"/> Dados Pessoais</TabsTrigger>
              <TabsTrigger value="stats" className="rounded-lg gap-2"><Trophy className="w-4 h-4"/> Estatísticas</TabsTrigger>
              <TabsTrigger value="atributos" className="rounded-lg gap-2"><Activity className="w-4 h-4"/> Atributos</TabsTrigger>
              <TabsTrigger value="lesoes" className="rounded-lg gap-2"><HeartPulse className="w-4 h-4"/> Histórico Médico</TabsTrigger>
              <TabsTrigger value="foto" className="rounded-lg gap-2"><ImageIcon className="w-4 h-4"/> Fotografia</TabsTrigger>
            </TabsList>

            <TabsContent value="basico" className="animate-in fade-in-50 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50">
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Nome Completo do Atleta</label>
                  <Input required placeholder="Ex: Gabriel Barbosa" value={name} onChange={(e: any) => setName(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80 focus-visible:ring-primary" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Posição em Campo</label>
                  <select required value={position} onChange={(e: any) => setPosition(e.target.value)} disabled={isLoading} className="h-12 w-full px-3 rounded-md border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="GOLEIRO">Goleiro</option><option value="LATERAL_DIREITO">Lateral Direito</option><option value="LATERAL_ESQUERDO">Lateral Esquerdo</option><option value="ZAGUEIRO">Zagueiro</option><option value="VOLANTE">Volante</option><option value="MEIO_CAMPO">Meio-campo</option><option value="MEIA_ATACANTE">Meia Atacante</option><option value="PONTA_DIREITA">Ponta Direita</option><option value="PONTA_ESQUERDA">Ponta Esquerda</option><option value="ATACANTE">Atacante</option><option value="CENTROAVANTE">Centroavante</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Data de Nascimento</label>
                  <Input type="date" required value={birthDate} onChange={(e: any) => setBirthDate(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Clube Atual</label>
                  <Input required placeholder="Nome da equipe atual" value={club} onChange={(e: any) => setClub(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Nacionalidade</label>
                  <Input required placeholder="País de origem" value={nationality} onChange={(e: any) => setNationality(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Pé Dominante</label>
                  <select value={dominantFoot} onChange={(e: any) => setDominantFoot(e.target.value)} disabled={isLoading} className="h-12 w-full px-3 rounded-md border border-border/80 bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="RIGHT">Direito</option><option value="LEFT">Esquerdo</option><option value="AMBIDEXTROUS">Ambidestro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Altura (m)</label>
                  <Input type="number" placeholder="Ex: 1.85" step="0.01" required value={height} onChange={(e: any) => setHeight(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-foreground/90">Peso (kg)</label>
                  <Input type="number" placeholder="Ex: 75.5" step="0.1" required value={weight} onChange={(e: any) => setWeight(e.target.value)} disabled={isLoading} className="h-12 bg-background shadow-sm border-border/80" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="animate-in fade-in-50 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-muted/10 rounded-2xl border border-border/50">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-foreground/80 text-center tracking-wide uppercase">Partidas</label>
                  <Input type="number" placeholder="0" value={matchStats.matchesPlayed} onChange={(e: any) => setMatchStats({...matchStats, matchesPlayed: e.target.value})} disabled={isLoading} className="h-16 rounded-xl border-border/80 bg-background text-center text-2xl font-bold placeholder:text-muted-foreground/40 shadow-sm" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-foreground/80 text-center tracking-wide uppercase">Gols</label>
                  <Input type="number" placeholder="0" value={matchStats.goals} onChange={(e: any) => setMatchStats({...matchStats, goals: e.target.value})} disabled={isLoading} className="h-16 rounded-xl border-border/80 bg-background text-center text-2xl font-bold text-accent placeholder:text-muted-foreground/40 shadow-sm" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-foreground/80 text-center tracking-wide uppercase">Assistências</label>
                  <Input type="number" placeholder="0" value={matchStats.assists} onChange={(e: any) => setMatchStats({...matchStats, assists: e.target.value})} disabled={isLoading} className="h-16 rounded-xl border-border/80 bg-background text-center text-2xl font-bold text-primary placeholder:text-muted-foreground/40 shadow-sm" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-foreground/80 text-center tracking-wide uppercase">Cartões</label>
                  <Input type="number" placeholder="0" value={matchStats.yellowCards} onChange={(e: any) => setMatchStats({...matchStats, yellowCards: e.target.value})} disabled={isLoading} className="h-16 rounded-xl border-border/80 bg-background text-center text-2xl font-bold text-yellow-500 placeholder:text-muted-foreground/40 shadow-sm" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="atributos" className="animate-in fade-in-50 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 p-6 bg-muted/10 rounded-2xl border border-border/50">
                {Object.keys(attributes).map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{key}</label>
                    <Input type="number" placeholder="1-99" min="1" max="99" value={attributes[key as keyof typeof attributes]} onChange={(e: any) => setAttributes(prev => ({ ...prev, [key]: e.target.value }))} disabled={isLoading} className="h-12 bg-background border-border/80 shadow-sm font-medium text-lg placeholder:text-muted-foreground/40" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lesoes" className="animate-in fade-in-50 duration-500">
              <div className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border/50 min-h-[300px]">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Registro Médico</h3>
                    <p className="text-sm text-muted-foreground">Adicione informações sobre o histórico de lesões do atleta</p>
                  </div>
                  <Button type="button" onClick={addInjury} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10 shadow-sm" disabled={isLoading}>
                    <Plus className="w-4 h-4" /> Registrar Lesão
                  </Button>
                </div>
                {injuries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border/60 rounded-xl bg-background/50">
                    <HeartPulse className="w-10 h-10 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">Nenhuma lesão médica registrada.</p>
                  </div>
                ) : injuries.map((injury, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-5 border border-border/60 rounded-xl bg-background shadow-sm relative group">
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Tipo de Lesão</label>
                      <Input required placeholder="Ex: Torção no tornozelo" value={injury.injuryType} onChange={(e: any) => updateInjury(index, 'injuryType', e.target.value)} disabled={isLoading} className="h-11 border-border/80" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Data Ocorrida</label>
                      <Input type="date" required value={injury.startDate} onChange={(e: any) => updateInjury(index, 'startDate', e.target.value)} disabled={isLoading} className="h-11 border-border/80" />
                    </div>
                    <div className="flex gap-3 col-span-2">
                      <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Gravidade</label>
                        <select value={injury.severity} onChange={(e: any) => updateInjury(index, 'severity', e.target.value)} disabled={isLoading} className="h-11 w-full px-3 rounded-md border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                          <option value="Leve">Leve</option><option value="Moderada">Moderada</option><option value="Grave">Grave</option>
                        </select>
                      </div>
                      <Button type="button" onClick={() => removeInjury(index)} variant="destructive" className="h-11 w-11 p-0 shrink-0 shadow-sm" disabled={isLoading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="foto" className="animate-in fade-in-50 duration-500">
              <div className="p-10 flex flex-col items-center justify-center bg-muted/10 rounded-2xl border border-border/50">
                <div className="mb-6 text-center">
                  <h3 className="font-semibold text-lg text-foreground mb-1">Fotografia do Atleta</h3>
                  <p className="text-sm text-muted-foreground">Formatos suportados: JPG, PNG (Max 5MB)</p>
                </div>
                <div className="w-64 h-64 rounded-2xl overflow-hidden bg-background border-2 border-dashed border-border/80 flex items-center justify-center relative group cursor-pointer hover:border-primary/50 transition-all shadow-sm">
                  {base64Image ? (
                    <img src={base64Image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                        <Upload className="w-6 h-6 opacity-70 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-semibold group-hover:text-primary transition-colors">Selecionar Arquivo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-4 p-6 bg-muted/30 border-t border-border mt-auto">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="h-12 px-6 border-border/80 font-semibold bg-background hover:bg-muted/50">
            <X className="w-4 h-4 mr-2"/> Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20">
            {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando...</> : <><Save className="w-5 h-5 mr-2"/> Cadastrar Atleta Oficialmente</>}
          </Button>
        </div>
      </form>
    </Card>
  );
}