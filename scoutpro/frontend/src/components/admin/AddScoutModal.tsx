import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Save, UserPlus } from 'lucide-react';

interface AddScoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function AddScoutModal({ isOpen, onClose, onSave }: AddScoutModalProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    experience: '',
    status: 'Ativo',
  });

  const availableSpecialties = [
    'Atacantes',
    'Meio-campistas',
    'Defensores',
    'Goleiros',
    'Jovens Talentos',
    'Jogadores Experientes',
    'Mercado Sul-Americano',
    'Mercado Europeu',
    'Mercado Africano',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
      specialties: selectedSpecialties,
    };
    onSave?.(fullData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-background" />
          </div>
          Adicionar Novo Olheiro
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Preencha as informações do olheiro para adicioná-lo à equipe
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Pessoais</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome *</Label>
                <Input
                  id="firstName"
                  placeholder="Carlos"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="bg-input-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome *</Label>
                <Input
                  id="lastName"
                  placeholder="Mendes"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="bg-input-background border-border"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="carlos.mendes@scoutpro.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-input-background border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55 11 99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações Profissionais</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Região de Atuação</Label>
                <Input
                  id="region"
                  placeholder="Europa, América do Sul, etc."
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Anos de Experiência</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="5"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="bg-input-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: string) => handleInputChange('status', value)} /* <-- CORREÇÃO AQUI */
              >
                <SelectTrigger className="bg-input-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Especialidades</h3>
            <p className="text-sm text-muted-foreground">
              Selecione as áreas de especialização do olheiro
            </p>
            
            <div className="flex flex-wrap gap-2">
              {availableSpecialties.map((specialty) => (
                <Badge
                  key={specialty}
                  variant={selectedSpecialties.includes(specialty) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all ${
                    selectedSpecialties.includes(specialty)
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-border hover:border-primary'
                  }`}
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Adicionar Olheiro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}