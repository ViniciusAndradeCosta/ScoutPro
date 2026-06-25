import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Jogadores', icon: Users, path: '/admin/jogadores' },
  { label: 'Novo Jogador', icon: UserPlus, path: '/admin/jogadores/novo' },
  { label: 'Relatórios', icon: FileText, path: '/admin/relatorios' },
  { label: 'Olheiros', icon: Target, path: '/admin/olheiros' },
  { label: 'Mensagens', icon: MessageSquare, path: '/admin/mensagens' },
];

const SETTINGS_PATH = '/admin/configuracoes';

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-[calc(100vh-4rem)] bg-gradient-to-b from-card to-muted/30 border-r border-border flex flex-col fixed left-0 top-16 z-40 hidden md:flex"
    >
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
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-6 h-6 text-background" />
                </div>
                <div>
                  <div className="font-bold">Scout Pro</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              variant={active ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 h-12 ${
                active ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' : 'hover:bg-accent/10'
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
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4 space-y-2">
        <Button
          onClick={() => navigate(SETTINGS_PATH)}
          variant={isActive(SETTINGS_PATH) ? 'default' : 'ghost'}
          className={`w-full justify-start gap-3 h-12 hover:bg-accent/10 ${
            isActive(SETTINGS_PATH) ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg' : ''
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Configurações</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
