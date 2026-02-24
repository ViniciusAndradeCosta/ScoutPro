import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  MessageSquare,
  Mail,
  Phone,
  Award,
  FileText,
  Calendar,
  TrendingUp,
  MapPin,
  X,
} from 'lucide-react';

interface Scout {
  id: number;
  name: string;
  email: string;
  phone?: string;
  reports: number;
  avgRating: number;
  lastActive: string;
  status: string;
  specialties: string[];
  region?: string;
  experience?: string;
  joinDate?: string;
}

interface ScoutProfileModalProps {
  scout: Scout | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (scoutName: string) => void;
}

export function ScoutProfileModal({
  scout,
  isOpen,
  onClose,
  onSendMessage,
}: ScoutProfileModalProps) {
  if (!scout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Perfil de {scout.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Detalhes e estatísticas do olheiro {scout.name}
        </DialogDescription>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-semibold text-background">
                {scout.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>

            {/* Info */}
            <div>
              <h2 className="text-2xl font-semibold mb-2">{scout.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant={scout.status === 'Ativo' ? 'default' : 'secondary'}
                  className={
                    scout.status === 'Ativo'
                      ? 'bg-accent/20 text-accent border-accent/30'
                      : ''
                  }
                >
                  {scout.status}
                </Badge>
                {scout.experience && (
                  <span className="text-sm text-muted-foreground">
                    {scout.experience} anos de experiência
                  </span>
                )}
              </div>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{scout.email}</span>
                </div>
                {scout.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{scout.phone}</span>
                  </div>
                )}
                {scout.region && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{scout.region}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Especialidades</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {scout.specialties.map((specialty, idx) => (
              <span
                key={idx}
                className="text-sm px-3 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-muted/30 border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{scout.reports}</p>
                <p className="text-sm text-muted-foreground">Relatórios</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30 border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{scout.avgRating}</p>
                <p className="text-sm text-muted-foreground">Média</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30 border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{scout.lastActive}</p>
                <p className="text-sm text-muted-foreground">Último acesso</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Atividade Recente</h3>
          <Card className="p-4 bg-muted/30 border-border">
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Enviou relatório sobre João Silva</p>
                  <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Atualizou status de Rafael Oliveira</p>
                  <p className="text-xs text-muted-foreground mt-1">Há 5 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Enviou relatório sobre Pedro Santos</p>
                  <p className="text-xs text-muted-foreground mt-1">Ontem</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              onClose();
              onSendMessage?.(scout.name);
            }}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </Button>
          <Button variant="outline" className="flex-1 border-border">
            <Award className="w-4 h-4 mr-2" />
            Ver Relatórios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
