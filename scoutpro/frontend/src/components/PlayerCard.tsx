import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, User, Star } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

interface PlayerCardProps {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  rating?: number;
  image?: string;
  addedBy?: string;
  isFavorite?: boolean;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  showFavoriteButton?: boolean;
}

// CORREÇÃO: Remove totalmente os underscores e aplica Title Case corretamente
const formatPosition = (pos: string) => {
  if (!pos) return 'Não definida';
  return pos.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export function PlayerCard({
  id, name, position, age, club, rating, image, addedBy,
  isFavorite = false, onViewDetails, onToggleFavorite, showFavoriteButton = false,
}: PlayerCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="flex w-full h-full">
      <Card className="flex flex-col w-full h-full overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
        
        <div className="relative w-full aspect-[4/3] shrink-0 overflow-hidden bg-muted">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl text-primary">{name.charAt(0)}</span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          
          {/* CORREÇÃO: Bolinha verde do rating com a seta para cima foi totalmente removida */}

          {showFavoriteButton && (
            <div className="absolute top-3 left-3">
              <Button size="sm" variant="ghost" className={`h-8 w-8 p-0 rounded-full backdrop-blur-sm shadow-sm ${isFavorite ? 'bg-accent/90 text-accent-foreground hover:bg-accent' : 'bg-background/60 text-muted-foreground hover:bg-background/80'}`} onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onToggleFavorite?.(id); }}>
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1" title={name}>{name}</h3>
            <div className="flex items-center gap-2 overflow-hidden">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
                {formatPosition(position)}
              </Badge>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{age} anos</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground truncate" title={club}>{club}</p>

          {addedBy && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg truncate">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">Cadastrado por: <span className="font-medium text-foreground">{addedBy}</span></span>
            </div>
          )}

          <Button onClick={() => onViewDetails?.(id)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto shrink-0" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}