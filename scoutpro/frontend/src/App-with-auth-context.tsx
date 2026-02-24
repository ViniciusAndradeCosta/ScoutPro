/**
 * EXEMPLO DE App.tsx USANDO AUTHCONTEXT
 * * Este arquivo demonstra como o App.tsx poderia ser refatorado
 * para usar o AuthContext. Quando estiver pronto para migrar,
 * renomeie este arquivo para App.tsx (fazendo backup do atual).
 * * BENEFÍCIOS:
 * - Estado de autenticação centralizado
 * - Dados do usuário disponíveis em toda a aplicação
 * - Facilita integração com backend
 * - Melhor separação de responsabilidades
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ScoutSidebar } from './components/scout/ScoutSidebar';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { PlayerProfile } from './components/PlayerProfile';
import { ReportForm } from './components/ReportForm';
import { AdminDashboard } from './views/AdminDashboard';
import { ScoutDashboard } from './views/ScoutDashboard';
import { PlayersManagement } from './views/PlayersManagement';
import { SettingsPage } from './views/SettingsPage';
import { AddPlayerForm } from './components/admin/AddPlayerForm';
import { ReportsTable } from './components/admin/ReportsTable';
import { ThemeProvider } from './utils/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { SignupData } from './types';

type View =
  | 'landing'
  | 'login-admin'
  | 'login-scout'
  | 'signup-admin'
  | 'signup-scout'
  | 'dashboard-admin'
  | 'dashboard-scout'
  | 'players-admin'
  | 'players-scout'
  | 'reports-admin'
  | 'reports-scout'
  | 'chat-admin'
  | 'chat-scout'
  | 'settings'
  | 'player-profile'
  | 'add-player'
  | 'create-report';

function AppContent() {
  const { user, isAuthenticated, login, signup, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scoutDashboardView, setScoutDashboardView] = useState<string>('overview');
  const [messageRecipient, setMessageRecipient] = useState<string | undefined>(undefined);

  const handleLoginClick = (type: 'admin' | 'scout') => {
    setCurrentView(type === 'admin' ? 'login-admin' : 'login-scout');
  };

  const handleSignupClick = (type: 'admin' | 'scout') => {
    setCurrentView(type === 'admin' ? 'signup-admin' : 'signup-scout');
  };

  const handleLogin = async (type: 'admin' | 'scout', email: string, password: string) => {
    try {
      await login({ email, password });
      setCurrentView(type === 'admin' ? 'dashboard-admin' : 'dashboard-scout');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  const handleSignup = async (type: 'admin' | 'scout', data: SignupData) => {
    try {
      await signup(data);
      setCurrentView(type === 'admin' ? 'dashboard-admin' : 'dashboard-scout');
    } catch (err) {
      console.error('Erro no cadastro:', err);
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView('landing');
      setSelectedPlayerId(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  const handleViewPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setCurrentView('player-profile');
  };

  const handleCreateReport = () => {
    setCurrentView('create-report');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
    setSidebarOpen(false);
  };

  const handleBackFromPlayer = () => {
    if (user?.role === 'admin') {
      setCurrentView('players-admin');
    } else {
      setCurrentView('dashboard-scout');
      setScoutDashboardView('overview');
      setMessageRecipient(undefined);
    }
  };

  const handleSaveReport = () => {
    setCurrentView('dashboard-scout');
    setScoutDashboardView('overview');
  };

  const handleSendMessageFromPlayer = (recipient: string) => {
    if (user?.role === 'scout') {
      setScoutDashboardView('messages');
      setMessageRecipient(recipient);
      setCurrentView('dashboard-scout');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onLoginClick={handleLoginClick} />;

      case 'login-admin':
        return (
          <LoginPage
            userType="admin"
            onLogin={() => {
              // Esta função precisa ser adaptada para receber email e senha
              // Por simplicidade, usando credenciais mockadas
              handleLogin('admin', 'admin@scout.com', '123456');
            }}
            onBack={handleBackToLanding}
            onSignupClick={() => handleSignupClick('admin')}
          />
        );

      case 'login-scout':
        return (
          <LoginPage
            userType="scout"
            onLogin={() => {
              handleLogin('scout', 'scout@scout.com', '123456');
            }}
            onBack={handleBackToLanding}
            onSignupClick={() => handleSignupClick('scout')}
          />
        );

      case 'signup-admin':
        return (
          <SignupPage
            onSignup={() => {
              // Adaptação necessária para passar dados completos
              handleSignup('admin', {
                email: 'new@admin.com',
                password: '123456',
                name: 'Novo Admin',
                role: 'admin',
              });
            }}
            onBack={handleBackToLanding}
            onBackToLogin={() => handleLoginClick('admin')}
          />
        );

      case 'signup-scout':
        return (
          <SignupPage
            onSignup={() => {
              handleSignup('scout', {
                email: 'new@scout.com',
                password: '123456',
                name: 'Novo Scout',
                role: 'scout',
              });
            }}
            onBack={handleBackToLanding}
            onBackToLogin={() => handleLoginClick('scout')}
          />
        );

      case 'dashboard-admin':
        return <AdminDashboard onNavigate={handleNavigate} />;

      case 'dashboard-scout':
        return (
          <ScoutDashboard 
            onViewPlayer={handleViewPlayer} 
            initialView={scoutDashboardView}
            initialMessageRecipient={messageRecipient}
          />
        );

      case 'players-scout':
        return <PlayersManagement onViewPlayer={handleViewPlayer} userType="scout" onNavigate={handleNavigate} />;

      case 'players-admin':
        return <PlayersManagement onViewPlayer={handleViewPlayer} userType="admin" onNavigate={handleNavigate} />;

      case 'player-profile':
        return (
          <PlayerProfile
            playerId={selectedPlayerId || '1'}
            onBack={handleBackFromPlayer}
            onCreateReport={handleCreateReport}
            userType={user?.role}
            onSendMessage={handleSendMessageFromPlayer}
          />
        );

      case 'create-report':
        return (
          <ReportForm
            playerId={selectedPlayerId || '1'}
            playerName="João Silva"
            onBack={handleBackFromPlayer}
            onSave={handleSaveReport}
          />
        );

      case 'reports-admin':
      case 'reports-scout':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Relatórios de Avaliação</h1>
              <p className="text-muted-foreground">
                Visualize e gerencie todos os relatórios de scouting
              </p>
            </div>
            <ReportsTable />
          </div>
        );

      case 'settings':
        return <SettingsPage userType={user?.role || 'admin'} />;

      case 'add-player':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Cadastrar Novo Jogador</h1>
              <p className="text-muted-foreground">
                Preencha as informações do jogador para adicioná-lo ao sistema
              </p>
            </div>
            <AddPlayerForm
              onSave={() => handleNavigate('players-admin')}
              onCancel={() => handleNavigate('players-admin')}
            />
          </div>
        );

      default:
        return <LandingPage onLoginClick={handleLoginClick} />;
    }
  };

  const showHeader = currentView !== 'landing';
  const showSidebar = isAuthenticated && !['dashboard-admin', 'dashboard-scout'].includes(currentView);
  const showAdvancedSidebar = ['player-profile', 'create-report'].includes(currentView);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader && (
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          showMenu={showSidebar && !showAdvancedSidebar}
          userType={user?.role || null}
          userName={user?.name || ''}
        />
      )}

      <div className="flex">
        {showAdvancedSidebar && user?.role === 'scout' && (
          <ScoutSidebar
            currentView={currentView}
            onNavigate={handleNavigate}
          />
        )}
        
        {showAdvancedSidebar && user?.role === 'admin' && (
          <AdminSidebar
            currentSection={currentView}
            onNavigate={handleNavigate}
            unreadMessages={3}
          />
        )}

        {showSidebar && !showAdvancedSidebar && user && (
          <Sidebar
            userType={user.role}
            currentView={currentView}
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main
          className={`flex-1 ${
            showHeader ? 'pt-16' : ''
          } ${showAdvancedSidebar ? 'md:ml-[280px]' : showSidebar ? 'lg:ml-0' : ''}`}
        >
          {showSidebar && !showAdvancedSidebar ? (
            <div className="w-full pl-20 pr-8 py-6">{renderContent()}</div>
          ) : showAdvancedSidebar ? (
            <div className="w-full px-6 md:px-8 py-6">{renderContent()}</div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}