import { useState } from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { 
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoutSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function ScoutSidebar({ 
  currentView, 
  onNavigate,
}: ScoutSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Visão geral'
    },
    { 
      id: 'players', 
      label: 'Jogadores', 
      icon: Users,
      description: 'Buscar jogadores'
    },
    { 
      id: 'reports', 
      label: 'Relatórios', 
      icon: FileText,
      description: 'Meus relatórios'
    },
    { 
      id: 'messages', 
      label: 'Mensagens', 
      icon: MessageSquare,
      description: 'Comunicação'
    },
    { 
      id: 'targets', 
      label: 'Alvos', 
      icon: Target,
      description: 'Jogadores favoritos'
    },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-[calc(100vh-4rem)] bg-gradient-to-b from-card to-muted/30 border-r border-border flex flex-col fixed left-0 top-16 z-40 hidden md:flex"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-background" />
                </div>
                <div>
                  <div className="font-bold">Scout Pro</div>
                  <div className="text-xs text-muted-foreground">Olheiro</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent/10"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              variant={isActive ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 h-12 ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' 
                  : 'hover:bg-accent/10'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between flex-1"
                  >
                    <span className="font-medium">{item.label}</span>
                    {/* Badge removido para não mostrar números */}
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <Button
          onClick={() => onNavigate('settings')}
          variant="ghost"
          className={`w-full justify-start gap-3 h-12 hover:bg-accent/10 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Configurações</span>}
        </Button>
      </div>
    </motion.aside>
  );
}