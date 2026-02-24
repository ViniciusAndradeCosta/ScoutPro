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
import { AddPlayerForm } from './components/admin/AddPlayerForm';
import { ReportsTable } from './components/admin/ReportsTable';
import { ThemeProvider } from './utils/ThemeContext';
import { Toaster } from './components/ui/sonner';

type UserType = 'admin' | 'scout' | null;
type View = 'landing' | 'login-admin' | 'login-scout' | 'signup-admin' | 'signup-scout' | 'dashboard-admin' | 'dashboard-scout' | 'players-admin' | 'players-scout' | 'reports-admin' | 'reports-scout' | 'chat-admin' | 'chat-scout' | 'player-profile' | 'add-player' | 'create-report';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardInitialSection, setDashboardInitialSection] = useState<string | undefined>(undefined);
  const [messageRecipient, setMessageRecipient] = useState<string | undefined>(undefined);

  const handleLoginClick = (type: 'admin' | 'scout') => setCurrentView(type === 'admin' ? 'login-admin' : 'login-scout');
  const handleSignupClick = (type: 'admin' | 'scout') => setCurrentView(type === 'admin' ? 'signup-admin' : 'signup-scout');
  const handleLogin = (type: 'admin' | 'scout') => { setUserType(type); setCurrentView(type === 'admin' ? 'dashboard-admin' : 'dashboard-scout'); };
  const handleSignup = (type: 'admin' | 'scout') => { setUserType(type); setCurrentView(type === 'admin' ? 'dashboard-admin' : 'dashboard-scout'); };
  const handleBackToLanding = () => { setCurrentView('landing'); setUserType(null); };

  const handleOpenSettings = () => {
    setDashboardInitialSection('settings');
    setCurrentView(userType === 'admin' ? 'dashboard-admin' : 'dashboard-scout');
  };

  const handleLogout = () => {
    setCurrentView('landing'); setUserType(null); setSelectedPlayerId(null); setDashboardInitialSection(undefined);
  };

  const handleNavigate = (view: string) => {
    if (view === 'settings') {
      handleOpenSettings();
      setSidebarOpen(false);
      return;
    }
    setCurrentView(view as View);
    setSidebarOpen(false);
    setDashboardInitialSection(undefined);
  };

  const handleBackFromPlayer = () => {
    if (userType === 'admin') {
      setCurrentView('players-admin');
    } else {
      setCurrentView('dashboard-scout');
      setDashboardInitialSection(messageRecipient ? 'messages' : 'overview');
      setMessageRecipient(undefined);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onLoginClick={handleLoginClick} />;
      case 'login-admin': return <LoginPage userType="admin" onLogin={handleLogin} onBack={handleBackToLanding} onSignupClick={() => handleSignupClick('admin')} />;
      case 'login-scout': return <LoginPage userType="scout" onLogin={handleLogin} onBack={handleBackToLanding} onSignupClick={() => handleSignupClick('scout')} />;
      case 'signup-admin': return <SignupPage onSignup={handleSignup} onBack={handleBackToLanding} onBackToLogin={() => handleLoginClick('admin')} />;
      case 'signup-scout': return <SignupPage onSignup={handleSignup} onBack={handleBackToLanding} onBackToLogin={() => handleLoginClick('scout')} />;
      
      case 'dashboard-admin': return <AdminDashboard onNavigate={handleNavigate} initialSection={dashboardInitialSection} />;
      case 'dashboard-scout': return <ScoutDashboard onViewPlayer={(id) => { setSelectedPlayerId(id); setCurrentView('player-profile'); }} initialView={dashboardInitialSection} initialMessageRecipient={messageRecipient} />;
      
      case 'players-scout': return <PlayersManagement onViewPlayer={(id) => { setSelectedPlayerId(id); setCurrentView('player-profile'); }} userType="scout" onNavigate={handleNavigate} />;
      case 'players-admin': return <PlayersManagement onViewPlayer={(id) => { setSelectedPlayerId(id); setCurrentView('player-profile'); }} userType="admin" onNavigate={handleNavigate} />;
      case 'player-profile': return <PlayerProfile playerId={selectedPlayerId || '1'} onBack={handleBackFromPlayer} onCreateReport={() => setCurrentView('create-report')} userType={userType || undefined} onSendMessage={(r) => { setMessageRecipient(r); setDashboardInitialSection('messages'); setCurrentView('dashboard-scout'); }} />;
      case 'create-report': return <ReportForm playerId={selectedPlayerId || '1'} playerName="Jogador" onBack={() => setCurrentView('dashboard-scout')} onSave={() => { setCurrentView('dashboard-scout'); setDashboardInitialSection('overview'); }} />;
      
      case 'reports-admin':
      case 'reports-scout':
        return <div className="space-y-6"><div><h1 className="text-3xl font-bold mb-2">Relatórios de Avaliação</h1><p className="text-muted-foreground">Visualize e gerencie todos os relatórios de scouting</p></div><ReportsTable /></div>;
      
      case 'add-player':
        return <div className="space-y-6"><div><h1 className="text-3xl font-bold mb-2">Cadastrar Novo Jogador</h1><p className="text-muted-foreground">Preencha as informações do jogador para adicioná-lo ao sistema</p></div><AddPlayerForm onSave={() => handleNavigate('players-admin')} onCancel={() => handleNavigate('players-admin')} /></div>;
      default: return <LandingPage onLoginClick={handleLoginClick} />;
    }
  };

  const showHeader = currentView !== 'landing';
  const showAdvancedSidebar = ['player-profile', 'create-report'].includes(currentView);
  const isDashboardView = ['dashboard-admin', 'dashboard-scout'].includes(currentView);
  const showSimpleSidebar = userType !== null && !isDashboardView && !showAdvancedSidebar;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {showHeader && (
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} showMenu={showSimpleSidebar} userType={userType} userName={userType === 'admin' ? 'Administrador' : 'Olheiro'} onSettingsClick={handleOpenSettings} />
        )}

        <div className="flex h-screen pt-16">
          {/* MUDANÇA AQUI: Propriedades de unreadMessages e pendingReports removidas do ScoutSidebar */}
          {showAdvancedSidebar && userType === 'scout' && <ScoutSidebar currentView={currentView} onNavigate={handleNavigate} />}
          {showAdvancedSidebar && userType === 'admin' && <AdminSidebar currentSection={currentView} onNavigate={handleNavigate} unreadMessages={undefined} />}
          {showSimpleSidebar && <Sidebar userType={userType} currentView={currentView} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

          <main className={`flex-1 h-full overflow-y-auto ${showAdvancedSidebar ? 'md:ml-[280px]' : showSimpleSidebar ? 'lg:ml-0' : ''}`}>
            {showSimpleSidebar ? (
              <div className="w-full h-full pl-20 pr-8 py-6">{renderContent()}</div>
            ) : showAdvancedSidebar ? (
              <div className="w-full h-full px-6 md:px-8 py-6">{renderContent()}</div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}