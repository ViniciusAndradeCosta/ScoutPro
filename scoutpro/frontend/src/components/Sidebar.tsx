import { Home, Users, FileText, MessageSquare, Settings, UserPlus, X, Target } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  userType: 'admin' | 'scout';
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userType, currentView, onNavigate, isOpen = true, onClose }: SidebarProps) {
  const adminMenuItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard-admin' },
    { icon: Users, label: 'Jogadores', view: 'players-admin' },
    { icon: Target, label: 'Olheiros', view: 'scouts-management' },
    { icon: FileText, label: 'Relatórios', view: 'reports-admin' },
    { icon: MessageSquare, label: 'Chat', view: 'chat-admin' },
    { icon: Settings, label: 'Configurações', view: 'settings' },
  ];

  const scoutMenuItems = [
    { icon: Home, label: 'Dashboard', view: 'dashboard-scout' },
    { icon: Users, label: 'Jogadores', view: 'players-scout' },
    { icon: FileText, label: 'Meus Relatórios', view: 'reports-scout' },
    { icon: MessageSquare, label: 'Chat', view: 'chat-scout' },
    { icon: Settings, label: 'Configurações', view: 'settings' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : scoutMenuItems;

  const handleNavigate = (view: string) => {
    onNavigate(view);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]"
          >
            <div className="flex flex-col h-full p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-2 top-2 lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>

              <nav className="space-y-2 flex-1 mt-8 lg:mt-0">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.view;

                  return (
                    <Button
                      key={item.view}
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        isActive
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-sidebar-accent'
                      }`}
                      onClick={() => handleNavigate(item.view)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              {userType === 'admin' && (
                <Button
                  onClick={() => handleNavigate('add-player')}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Cadastrar Jogador
                </Button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
