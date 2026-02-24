import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Trash2, Plus, Upload } from 'lucide-react';
import type { PlayerInjury, PlayerDetailedAttributes, PlayerMatchStats } from '../types';

interface PlayerFormProps {
  initialData?: any; 
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PlayerForm({ initialData, onSubmit, onCancel }: PlayerFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  
  const [position, setPosition] = useState<string>(
    initialData?.position && initialData.position !== 'Não definida' 
      ? initialData.position.toUpperCase().replace(' ', '_').replace('-', '_') 
      : 'ATACANTE'
  );
  
  const getSafeDate = (dateStr: string | undefined) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
      return d.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const [birthDate, setBirthDate] = useState<string>(getSafeDate(initialData?.birthDate));
  
  const [club, setClub] = useState(initialData?.club || '');
  const [nationality, setNationality] = useState(initialData?.nationality || 'Brasil');
  const [height, setHeight] = useState<number>(initialData?.height || 1.75);
  const [weight, setWeight] = useState<number>(initialData?.weight || 70);
  
  const [dominantFoot, setDominantFoot] = useState<string>(
    initialData?.preferredFoot === 'Esquerdo' ? 'LEFT' 
    : initialData?.preferredFoot === 'Ambidestro' ? 'AMBIDEXTROUS' 
    : initialData?.dominantFoot || 'RIGHT'
  );
  
  const [base64Image, setBase64Image] = useState<string>(initialData?.image || '');

  const [previousClub, setPreviousClub] = useState(initialData?.previousClub || '');
  const [contractEnd, setContractEnd] = useState<string>(
    initialData?.contractEnd ? getSafeDate(initialData.contractEnd) : ''
  );
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [matchStats, setMatchStats] = useState<PlayerMatchStats>(initialData?.matchStats || {
    goals: 0, assists: 0, yellowCards: 0, matchesPlayed: 0
  });

  const [attributes, setAttributes] = useState<PlayerDetailedAttributes>(initialData?.detailedAttributes || {
    finishing: 50, shotPower: 50, longShots: 50, volleys: 50, penalties: 50,
    dribbling: 50, ballControl: 50, acceleration: 50, sprintSpeed: 50, agility: 50,
    positioning: 50, vision: 50, crossing: 50, freeKick: 50, shortPassing: 50, longPassing: 50,
    marking: 50, standingTackle: 50, slidingTackle: 50, interceptions: 50,
    strength: 50, stamina: 50, jumping: 50, aggression: 50, composure: 50, reactions: 50,
    passing: 50, pace: 50
  });

  const [injuries, setInjuries] = useState<PlayerInjury[]>(initialData?.injuries || []);

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

  const handleAttributeChange = (field: keyof PlayerDetailedAttributes, value: number) => {
    setAttributes(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name, 
      position, 
      birthDate: birthDate || null,
      club, 
      nationality, 
      height, 
      weight, 
      dominantFoot, 
      image: base64Image, 
      previousClub,
      contractEnd: contractEnd || null,
      phone,
      email,
      notes,
      
      matchesPlayed: matchStats.matchesPlayed,
      goals: matchStats.goals,
      assists: matchStats.assists,
      yellowCards: matchStats.yellowCards,

      finishing: attributes.finishing,
      dribbling: attributes.dribbling,
      positioning: attributes.positioning,
      pace: attributes.pace,
      strength: attributes.strength,
      stamina: attributes.stamina,
      passing: attributes.passing,

      injuries: injuries
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      <Tabs defaultValue="basico" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="basico">Dados</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="atributos">Atributos</TabsTrigger>
          <TabsTrigger value="lesoes">Lesões</TabsTrigger>
          <TabsTrigger value="foto">Foto</TabsTrigger>
        </TabsList>

        <TabsContent value="basico" className="space-y-4">
          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Posição</label>
              <select required value={position} onChange={e => setPosition(e.target.value)} className="w-full p-2.5 rounded-md border bg-background">
                <option value="GOLEIRO">Goleiro</option>
                <option value="LATERAL_DIREITO">Lateral Direito</option>
                <option value="LATERAL_ESQUERDO">Lateral Esquerdo</option>
                <option value="ZAGUEIRO">Zagueiro</option>
                <option value="VOLANTE">Volante</option>
                <option value="MEIO_CAMPO">Meio-campo</option>
                <option value="MEIA_ATACANTE">Meia Atacante</option>
                <option value="PONTA_DIREITA">Ponta Direita</option>
                <option value="PONTA_ESQUERDA">Ponta Esquerda</option>
                <option value="ATACANTE">Atacante</option>
                <option value="CENTROAVANTE">Centroavante</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Data de Nascimento</label>
              <input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Clube Atual</label>
              <input required value={club} onChange={e => setClub(e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Nacionalidade</label>
              <input required value={nationality} onChange={e => setNationality(e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Pé Dominante</label>
              <select value={dominantFoot} onChange={e => setDominantFoot(e.target.value)} className="w-full p-2.5 rounded-md border bg-background">
                <option value="RIGHT">Direito</option>
                <option value="LEFT">Esquerdo</option>
                <option value="AMBIDEXTROUS">Ambidestro</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Altura (m)</label>
              <input type="number" step="0.01" required value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Peso (kg)</label>
              <input type="number" step="0.1" required value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Partidas</label>
              <input type="number" value={matchStats.matchesPlayed} onChange={e => setMatchStats({...matchStats, matchesPlayed: Number(e.target.value)})} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Gols</label>
              <input type="number" value={matchStats.goals} onChange={e => setMatchStats({...matchStats, goals: Number(e.target.value)})} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Assistências</label>
              <input type="number" value={matchStats.assists} onChange={e => setMatchStats({...matchStats, assists: Number(e.target.value)})} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">C. Amarelos</label>
              <input type="number" value={matchStats.yellowCards} onChange={e => setMatchStats({...matchStats, yellowCards: Number(e.target.value)})} className="w-full p-2.5 rounded-md border bg-background" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="atributos">
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['finishing', 'passing', 'dribbling', 'positioning', 'pace', 'strength', 'stamina'].map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium uppercase text-muted-foreground">{key}</label>
                  <input 
                    type="number" min="1" max="99" 
                    value={(attributes as any)[key]} 
                    onChange={e => handleAttributeChange(key as keyof PlayerDetailedAttributes, Number(e.target.value))} 
                    className="w-full p-2 rounded-md border bg-background" 
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="lesoes">
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Histórico de Lesões</h3>
              <Button type="button" onClick={addInjury} variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Adicionar Lesão
              </Button>
            </div>
            
            {injuries.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">Nenhuma lesão registrada.</p>
            ) : (
              injuries.map((injury, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-5 border rounded-xl bg-muted/10">
                  <div className="md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <input required value={injury.injuryType} onChange={e => updateInjury(index, 'injuryType', e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Data Início</label>
                    <input type="date" required value={injury.startDate} onChange={e => updateInjury(index, 'startDate', e.target.value)} className="w-full p-2.5 rounded-md border bg-background" />
                  </div>
                  <div className="flex gap-2 col-span-2">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Gravidade</label>
                      <select value={injury.severity} onChange={e => updateInjury(index, 'severity', e.target.value)} className="w-full p-2.5 rounded-md border bg-background">
                        <option value="Leve">Leve</option>
                        <option value="Moderada">Moderada</option>
                        <option value="Grave">Grave</option>
                      </select>
                    </div>
                    <Button type="button" onClick={() => removeInjury(index)} variant="destructive" className="mb-[2px] px-3 h-11">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </TabsContent>

        <TabsContent value="foto">
          <Card className="p-8 flex flex-col items-center justify-center space-y-4">
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-muted border-2 border-dashed flex items-center justify-center relative group cursor-pointer hover:border-primary transition-colors">
              {base64Image ? (
                <img src={base64Image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="w-10 h-10 mx-auto mb-3 opacity-50 group-hover:text-primary group-hover:opacity-100 transition-colors" />
                  <span className="text-sm font-medium">Upload da Foto</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t border-border mt-8">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8">
          Salvar Jogador
        </Button>
      </div>
    </form>
  );
}