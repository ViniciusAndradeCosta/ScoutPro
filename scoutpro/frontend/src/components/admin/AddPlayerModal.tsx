import { useState, useRef } from 'react';
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
import { Upload, Save, X, UserPlus, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

export function AddPlayerModal({ isOpen, onClose, onSave }: AddPlayerModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    position: '',
    nationality: '',
    height: '',
    weight: '',
    club: '',
    previousClub: '',
    contractEnd: '',
    phone: '',
    email: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepara o pacote EXATAMENTE como o novo DTO do Spring Boot pede
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        birthDate: formData.birthDate,
        nationality: formData.nationality,
        height: parseFloat(formData.height) || 0.0,
        weight: parseFloat(formData.weight) || 0.0,
        dominantFoot: "RIGHT", // Valor padrão
        position: formData.position.toUpperCase() || "UNKNOWN",
        club: formData.club,
        previousClub: formData.previousClub || null,
        contractEnd: formData.contractEnd || null,
        phone: formData.phone || null,
        email: formData.email || null,
        notes: formData.notes || null,
        image: null // Implementação futura de upload de imagem
      };

      // CORREÇÃO AQUI: auth_token em vez de token
      const token = localStorage.getItem('scoutpro_token'); 

      // Faz o POST para a rota do Spring Boot
      console.log("TOKEN:", token);
      const response = await fetch('http://localhost:8080/api/v1/athletes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Falha: ${response.status} - ${errorData}`);
      }

      const savedData = await response.json();
      
      onSave?.(savedData);
      onClose();
      resetForm();

    } catch (error) {
      console.error('Erro ao salvar no Spring Boot:', error);
      alert('Erro ao salvar o jogador. Verifique a consola para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', birthDate: '', position: '', nationality: '', height: '', weight: '', club: '', previousClub: '', contractEnd: '', phone: '', email: '', notes: '',
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-background" />
          </div>
          Cadastrar Novo Jogador
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Preencha as informações do jogador para adicioná-lo ao sistema
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="physical">Físico</TabsTrigger>
              <TabsTrigger value="club">Clube</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input id="firstName" placeholder="João" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input id="lastName" placeholder="Silva" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} className="bg-input-background border-border flex w-full" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidade *</Label>
                  <Input id="nationality" placeholder="Brasil" value={formData.nationality} onChange={(e) => handleInputChange('nationality', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="physical" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (m) *</Label>
                  <Input id="height" type="number" step="0.01" placeholder="1.78" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg) *</Label>
                  <Input id="weight" type="number" step="0.1" placeholder="72.5" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posição *</Label>
                  <Select value={formData.position} onValueChange={(value: string) => handleInputChange('position', value)} disabled={isLoading}>
                    <SelectTrigger className="bg-input-background border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOALKEEPER">Goleiro</SelectItem>
                      <SelectItem value="DEFENDER">Lateral Direito</SelectItem>
                      <SelectItem value="DEFENDER">Lateral Esquerdo</SelectItem>
                      <SelectItem value="DEFENDER">Zagueiro</SelectItem>
                      <SelectItem value="MIDFIELDER">Volante</SelectItem>
                      <SelectItem value="MIDFIELDER">Meio-campo</SelectItem>
                      <SelectItem value="MIDFIELDER">Meia Atacante</SelectItem>
                      <SelectItem value="FORWARD">Ponta Direita</SelectItem>
                      <SelectItem value="FORWARD">Ponta Esquerda</SelectItem>
                      <SelectItem value="FORWARD">Atacante</SelectItem>
                      <SelectItem value="FORWARD">Centroavante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Foto do Jogador (Visual apenas)</Label>
                <div onClick={isLoading ? undefined : handlePhotoClick} className={`border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 cursor-pointer'}`}>
                  {photoPreview ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img src={photoPreview} alt="Preview da foto" className="max-h-32 object-contain mb-2 rounded" />
                      <p className="text-xs text-muted-foreground hover:underline">Clique para trocar a foto</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Arraste uma foto ou clique para fazer upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoChange} disabled={isLoading} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="club" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club">Clube Atual *</Label>
                  <Input id="club" placeholder="FC Barcelona B" value={formData.club} onChange={(e) => handleInputChange('club', e.target.value)} className="bg-input-background border-border" required disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousClub">Clube Anterior</Label>
                  <Input id="previousClub" placeholder="Santos FC" value={formData.previousClub} onChange={(e) => handleInputChange('previousClub', e.target.value)} className="bg-input-background border-border" disabled={isLoading} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contractEnd">Fim do Contrato</Label>
                  <Input id="contractEnd" type="date" value={formData.contractEnd} onChange={(e) => handleInputChange('contractEnd', e.target.value)} className="bg-input-background border-border" disabled={isLoading} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="+55 11 99999-9999" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="bg-input-background border-border" disabled={isLoading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="jogador@email.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="bg-input-background border-border" disabled={isLoading} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações Adicionais</Label>
                <Textarea id="notes" placeholder="Informações adicionais sobre o jogador..." value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="min-h-32 bg-input-background border-border resize-none" disabled={isLoading} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-border" disabled={isLoading}>
              <X className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Cadastrar Jogador</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}