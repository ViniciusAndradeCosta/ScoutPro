import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AddScoutFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export function AddScoutForm({ onSave, onCancel }: AddScoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState('');

  const availableSpecialties = [
    'Atacantes',
    'Meio-campistas',
    'Defensores',
    'Goleiros',
    'Jovens Talentos',
    'Jogadores Experientes',
    'Laterais',
    'Volantes',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (specialties.length === 0) {
      toast.error('Adicione pelo menos uma especialidade');
      return;
    }

    toast.success('Olheiro cadastrado com sucesso!');
    setTimeout(() => {
      onSave();
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSpecialty = (specialty: string) => {
    if (!specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
    }
    setSpecialtyInput('');
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const handleSpecialtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && specialtyInput.trim()) {
      e.preventDefault();
      addSpecialty(specialtyInput.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: João Silva"
              className="bg-input-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Ex: joao@scoutpro.com"
              className="bg-input-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ex: +55 11 98765-4321"
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Ex: São Paulo, SP"
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Biografia / Experiência</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Descreva a experiência profissional do olheiro..."
              className="bg-input-background min-h-[100px]"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Especialidades *</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Especialidades Selecionadas</Label>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-md bg-muted/30 border border-border">
              {specialties.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma especialidade selecionada
                </p>
              ) : (
                specialties.map((specialty) => (
                  <Badge
                    key={specialty}
                    className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 gap-1"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Adicionar Especialidade</Label>
            <div className="flex gap-2">
              <Input
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={handleSpecialtyKeyDown}
                placeholder="Digite ou selecione abaixo"
                className="bg-input-background"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => specialtyInput.trim() && addSpecialty(specialtyInput.trim())}
                disabled={!specialtyInput.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Especialidades Sugeridas</Label>
            <div className="flex flex-wrap gap-2">
              {availableSpecialties
                .filter((s) => !specialties.includes(s))
                .map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/50"
                    onClick={() => addSpecialty(specialty)}
                  >
                    + {specialty}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold mb-4">Credenciais de Acesso *</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="bg-input-background"
              minLength={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Digite a senha novamente"
              className="bg-input-background"
              minLength={6}
              required
            />
          </div>
        </div>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Cadastrar Olheiro
        </Button>
      </div>
    </form>
  );
}
