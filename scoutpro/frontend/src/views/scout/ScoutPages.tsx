import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { DashboardScout } from '../../components/DashboardScout';
import { MessagesView } from '../../components/shared/MessagesView';
import { PlayerProfile } from '../../components/PlayerProfile';
import { ReportForm } from '../../components/ReportForm';
import { SettingsPage } from '../SettingsPage';
import { API_ENDPOINTS, apiRequest } from '../../config/api';

export function ScoutOverviewPage() {
  const navigate = useNavigate();
  return (
    <DashboardScout
      onViewPlayer={(id) => navigate(`/olheiro/jogador/${id}`)}
      onNavigate={(view) => navigate(view === 'reports' ? '/olheiro/relatorios' : '/olheiro/jogadores')}
    />
  );
}

export function ScoutMessagesPage() {
  const location = useLocation();
  const recipient = (location.state as { recipient?: string } | null)?.recipient;
  return <MessagesView userType="scout" userName="Olheiro" initialRecipient={recipient} />;
}

export function ScoutSettingsPage() {
  return <SettingsPage userType="scout" />;
}

export function ScoutPlayerProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <PlayerProfile
      playerId={id || '1'}
      userType="scout"
      onBack={() => navigate('/olheiro/jogadores')}
      onCreateReport={() => navigate(`/olheiro/jogador/${id}/relatorio`)}
      onSendMessage={(recipient) => navigate('/olheiro/mensagens', { state: { recipient } })}
    />
  );
}

export function ScoutReportFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playerName, setPlayerName] = useState('Jogador');

  useEffect(() => {
    if (!id) return;
    apiRequest<any>(API_ENDPOINTS.PLAYERS.GET(id))
      .then((data) => {
        if (data?.name) setPlayerName(data.name);
      })
      .catch((error) => console.error('Erro ao carregar o jogador:', error));
  }, [id]);

  return (
    <ReportForm
      playerId={id || '1'}
      playerName={playerName}
      onBack={() => navigate(`/olheiro/jogador/${id}`)}
      onSave={() => navigate('/olheiro/relatorios')}
    />
  );
}
