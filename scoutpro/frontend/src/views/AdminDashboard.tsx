import { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { MessagesView } from '../components/shared/MessagesView';
import { OverviewSection } from '../components/admin/OverviewSection';
import { ScoutsSection } from '../components/admin/ScoutsSection';
import { ReportsTable } from '../components/admin/ReportsTable';
import { AddPlayerForm } from '../components/admin/AddPlayerForm';
import { ComparePlayersSection } from '../components/admin/ComparePlayersSection';
import { PlayersManagement } from './PlayersManagement';
import { SettingsPage } from './SettingsPage';

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
  initialSection?: string;
  unreadMessages?: number;
}

export function AdminDashboard({ onNavigate, initialSection, unreadMessages = 0 }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState(initialSection || 'overview');
  const [selectedRecipient, setSelectedRecipient] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialSection) {
      setCurrentSection(initialSection);
    }
  }, [initialSection]);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
  };

  const handleSendMessage = (scoutName: string) => {
    setSelectedRecipient(scoutName);
    setCurrentSection('messages');
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewSection onNavigate={onNavigate} />;
      case 'players':
        return <PlayersManagement onViewPlayer={() => {}} userType="admin" onNavigate={(view) => handleNavigate(view)} />;
      case 'add-player':
        return (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Cadastrar Novo Jogador</h2>
              <p className="text-muted-foreground">Preencha as informações do jogador para adicioná-lo ao sistema</p>
            </div>
            <AddPlayerForm onSave={() => handleNavigate('players')} onCancel={() => handleNavigate('players')} />
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Relatórios de Avaliação</h2>
              <p className="text-muted-foreground">Visualize e gerencie todos os relatórios de scouting</p>
            </div>
            <ReportsTable />
          </div>
        );
      case 'compare':
        return <ComparePlayersSection />;
      case 'scouts':
        // CORREÇÃO: A prop onNavigate é repassada para o ScoutsSection reconhecer o botão de relatórios
        return <ScoutsSection onSendMessage={handleSendMessage} onNavigate={handleNavigate} />;
      case 'messages':
        return <MessagesView userType="admin" userName="Administrador" initialRecipient={selectedRecipient} />;
      case 'settings':
        return <SettingsPage userType="admin" />;
      default:
        return <OverviewSection onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <AdminSidebar currentSection={currentSection} onNavigate={handleNavigate} unreadMessages={unreadMessages} />
      <div className="flex-1 h-screen w-full bg-background md:ml-[280px] overflow-y-auto">
        <div className={`w-full ${currentSection === 'messages' ? 'p-4' : 'p-6'}`}
        style={{ height: currentSection === 'messages' ? 'calc(100vh - 64px)' : 'auto', minHeight: 'calc(100vh - 64px)'}}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}