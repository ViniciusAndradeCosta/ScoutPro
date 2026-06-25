import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { OverviewSection } from '../../components/admin/OverviewSection';
import { ScoutsSection } from '../../components/admin/ScoutsSection';
import { ReportsTable } from '../../components/admin/ReportsTable';
import { ComparePlayersSection } from '../../components/admin/ComparePlayersSection';
import { AddPlayerForm } from '../../components/admin/AddPlayerForm';
import { MessagesView } from '../../components/shared/MessagesView';
import { PlayerProfile } from '../../components/PlayerProfile';
import { PlayersManagement } from '../PlayersManagement';
import { SettingsPage } from '../SettingsPage';

export function AdminOverviewPage() {
  return <OverviewSection />;
}

export function AdminPlayersPage() {
  const navigate = useNavigate();
  return (
    <PlayersManagement
      userType="admin"
      onViewPlayer={(id) => navigate(`/admin/jogador/${id}`)}
      onNavigate={() => navigate('/admin/mensagens')}
    />
  );
}

export function AdminAddPlayerPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Cadastrar Novo Jogador</h2>
        <p className="text-muted-foreground">
          Preencha as informações do jogador para adicioná-lo ao sistema
        </p>
      </div>
      <AddPlayerForm
        onSave={() => navigate('/admin/jogadores')}
        onCancel={() => navigate('/admin/jogadores')}
      />
    </div>
  );
}

export function AdminReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Relatórios de Avaliação</h2>
        <p className="text-muted-foreground">Visualize e gerencie todos os relatórios de scouting</p>
      </div>
      <ReportsTable />
    </div>
  );
}

export function AdminScoutsPage() {
  const navigate = useNavigate();
  return (
    <ScoutsSection
      onSendMessage={(name) => navigate('/admin/mensagens', { state: { recipient: name } })}
      onNavigate={() => navigate('/admin/relatorios')}
    />
  );
}

export function AdminComparePage() {
  return <ComparePlayersSection />;
}

export function AdminMessagesPage() {
  const location = useLocation();
  const recipient = (location.state as { recipient?: string } | null)?.recipient;
  return <MessagesView userType="admin" userName="Administrador" initialRecipient={recipient} />;
}

export function AdminSettingsPage() {
  return <SettingsPage userType="admin" />;
}

export function AdminPlayerProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <PlayerProfile
      playerId={id || '1'}
      userType="admin"
      onBack={() => navigate('/admin/jogadores')}
      onSendMessage={(recipient) => navigate('/admin/mensagens', { state: { recipient } })}
    />
  );
}
