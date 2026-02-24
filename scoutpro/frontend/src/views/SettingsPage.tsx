import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { User, Lock, Palette, Save, Moon, Sun, Camera } from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import { toast } from 'sonner';

interface SettingsPageProps {
  userType: 'admin' | 'scout';
}

export function SettingsPage({ userType }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();

  // 1. ESTADOS DO PERFIL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    club: '',
    location: '',
    bio: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 2. ESTADOS DA SENHA
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 3. BUSCAR DADOS
  useEffect(() => {
    const fetchMySettings = async () => {
      try {
        const token = localStorage.getItem('scoutpro_token');
        if (!token) return;

        const response = await fetch('http://localhost:8080/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const myData = await response.json();
          setFormData(prev => ({
            ...prev,
            name: myData.name || '',
            email: myData.email || '',
            phone: myData.phone || '',
            club: myData.club || '',
            location: myData.location || '',
            bio: myData.bio || ''
          }));
          // Se tiver imagem salva no banco (Base64), carrega aqui:
          if (myData.image) setAvatarPreview(myData.image);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    fetchMySettings();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  // 4. FUNÇÃO PARA ESCOLHER A FOTO (Converte para Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Isso transforma a imagem num texto longo (Base64) que o banco de dados entende
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
      };
      
      // Lê o ficheiro e dispara o onloadend acima
      reader.readAsDataURL(file);
    }
  };

  // FUNÇÃO PARA SALVAR O PERFIL COMPLETO (Foto e textos)
  const submitProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('scoutpro_token');
      
      // Junta os textos com a imagem Base64
      const payload = {
        ...formData,
        image: avatarPreview || ''
      };

      const response = await fetch('http://localhost:8080/api/v1/users/update-profile', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Informações salva com Sucesso!'); // FRASE EXATA
      } else {
        toast.error('Erro ao salvar as informações.');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor.');
    }
  };

  // 5. FUNÇÃO PARA ATUALIZAR A SENHA NO JAVA
  const submitPasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Preencha todos os campos de senha!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("A nova senha e a confirmação não coincidem.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const token = localStorage.getItem('scoutpro_token');
      const response = await fetch('http://localhost:8080/api/v1/users/change-password', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });

      if (response.ok) {
        toast.success("Senha Alterada com Sucesso!"); // FRASE EXATA
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Limpa os campos
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Senha atual incorreta.");
      }
    } catch (error) {
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/30 max-w-2xl">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        {/* --- ABA PERFIL --- */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-5 h-5 text-background" />
              </div>
              <h3 className="text-lg font-semibold">Informações Pessoais</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-background">
                      {getInitials(formData.name)}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {/* INPUT INVISÍVEL PARA UPLOAD */}
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handlePhotoUpload} 
                  />
                  {/* BOTÃO QUE CLICA NO INPUT */}
                  <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-md text-sm font-medium hover:bg-primary/10 transition-colors">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG ou GIF. Tamanho máximo de 5MB
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="bg-input-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={formData.email} disabled className="bg-input-background opacity-70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+55 11 99999-9999" className="bg-input-background" />
                </div>
                {userType === 'admin' && (
                  <div className="space-y-2">
                    <Label htmlFor="club">Clube</Label>
                    <Input id="club" value={formData.club} onChange={(e) => handleChange('club', e.target.value)} className="bg-input-background" />
                  </div>
                )}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="bg-input-background" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} placeholder="Conte um pouco sobre sua experiência..." className="bg-input-background min-h-[100px] resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-6">
                <Button onClick={submitProfileUpdate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Informações
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* --- ABA SEGURANÇA (Apenas Troca de Senha) --- */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Lock className="w-5 h-5 text-background" />
              </div>
              <h3 className="text-lg font-semibold">Alterar Senha</h3>
            </div>

            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="bg-input-background" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="bg-input-background" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="bg-input-background" 
                />
              </div>
              <div className="pt-2">
                <Button onClick={submitPasswordChange} className="bg-primary text-primary-foreground">
                  Atualizar Senha
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* --- ABA PREFERÊNCIAS --- */}
        <TabsContent value="preferences" className="space-y-6 mt-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Palette className="w-5 h-5 text-background" />
              </div>
              <h3 className="text-lg font-semibold">Aparência e Idioma</h3>
            </div>

            <div className="space-y-6 max-w-xl">
              <div className="space-y-4">
                <Label>Tema da Interface</Label>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      theme === 'dark' ? 'bg-slate-900 border-2 border-slate-700' : 'bg-amber-100 border-2 border-amber-300'
                    }`}>
                      {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'dark' ? 'Interface com tema escuro ativado' : 'Interface com tema claro ativado'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>Alternar</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="pt-br">
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}