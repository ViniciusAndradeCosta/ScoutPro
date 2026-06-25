import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { RequireAuth } from './components/auth/RequireAuth';
import { AdminLayout } from './layouts/AdminLayout';
import { ScoutLayout } from './layouts/ScoutLayout';
import {
  AdminOverviewPage,
  AdminPlayersPage,
  AdminAddPlayerPage,
  AdminReportsPage,
  AdminScoutsPage,
  AdminComparePage,
  AdminMessagesPage,
  AdminSettingsPage,
  AdminPlayerProfilePage,
} from './views/admin/AdminPages';
import { ScoutPlayersList } from './views/scout/ScoutPlayersList';
import { ScoutTargets } from './views/scout/ScoutTargets';
import { ScoutReports } from './views/scout/ScoutReports';
import {
  ScoutOverviewPage,
  ScoutMessagesPage,
  ScoutSettingsPage,
  ScoutPlayerProfilePage,
  ScoutReportFormPage,
} from './views/scout/ScoutPages';

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignupPage />} />

      {/* Área do Administrador */}
      <Route element={<RequireAuth role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="jogadores" element={<AdminPlayersPage />} />
          <Route path="jogadores/novo" element={<AdminAddPlayerPage />} />
          <Route path="relatorios" element={<AdminReportsPage />} />
          <Route path="olheiros" element={<AdminScoutsPage />} />
          <Route path="comparar" element={<AdminComparePage />} />
          <Route path="mensagens" element={<AdminMessagesPage />} />
          <Route path="configuracoes" element={<AdminSettingsPage />} />
          <Route path="jogador/:id" element={<AdminPlayerProfilePage />} />
        </Route>
      </Route>

      {/* Área do Olheiro */}
      <Route element={<RequireAuth role="scout" />}>
        <Route path="/olheiro" element={<ScoutLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ScoutOverviewPage />} />
          <Route path="jogadores" element={<ScoutPlayersList />} />
          <Route path="alvos" element={<ScoutTargets />} />
          <Route path="relatorios" element={<ScoutReports />} />
          <Route path="mensagens" element={<ScoutMessagesPage />} />
          <Route path="configuracoes" element={<ScoutSettingsPage />} />
          <Route path="jogador/:id" element={<ScoutPlayerProfilePage />} />
          <Route path="jogador/:id/relatorio" element={<ScoutReportFormPage />} />
        </Route>
      </Route>

      {/* Qualquer outra rota volta para a Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
