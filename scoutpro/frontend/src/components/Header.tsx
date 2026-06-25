import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const role = user?.role ?? 'scout';
  const roleLabel = role === 'admin' ? 'Administrador' : 'Olheiro';
  const displayLabel = user?.name?.split(' ')[0] || roleLabel;
  const settingsPath = role === 'admin' ? '/admin/configuracoes' : '/olheiro/configuracoes';

  const handleSettings = () => {
    setIsDropdownOpen(false);
    navigate(settingsPath);
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[200] bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-background" />
              </svg>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ScoutPro
            </span>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-accent/10"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-background" />
            </div>

            <span className="text-sm hidden sm:inline font-semibold">{displayLabel}</span>

            <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-[300] overflow-hidden">
              <div className="p-3 border-b border-border">
                <p className="font-medium text-sm">{displayLabel}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/10 rounded-sm transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-sm transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
