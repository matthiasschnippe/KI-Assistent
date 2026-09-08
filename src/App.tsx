import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { AdminView } from './modules/admin/AdminView';
import { LoginView } from './modules/auth/LoginView';
import { ChatView } from './modules/chat/ChatView';
import { DocumentsView } from './modules/documents/DocumentsView';
import { FaqView } from './modules/faq/FaqView';
import { BarrierefreiheitView, DatenschutzView } from './modules/legal/LegalPages';
import { MeetingView } from './modules/meeting/MeetingView';
import { SessionsView } from './modules/sessions/SessionsView';
import { SettingsView } from './modules/settings/SettingsView';
import { TipDetail } from './modules/tips/TipDetail';
import { TipsView } from './modules/tips/TipsView';
import { NotFoundView } from './modules/legal/NotFoundView';

export default function App() {
  return (
    <Routes>
      <Route path="/anmeldung" element={<LoginView />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/meeting" element={<MeetingView />} />
        <Route path="/protokolle" element={<SessionsView />} />
        <Route path="/dokumente" element={<DocumentsView />} />
        <Route path="/hilfe" element={<FaqView />} />
        <Route path="/faq" element={<Navigate to="/hilfe" replace />} />
        <Route path="/tipps" element={<TipsView />} />
        <Route path="/tipps/:id" element={<TipDetail />} />
        <Route path="/einstellungen" element={<SettingsView />} />
        <Route path="/verwaltung" element={<AdminView />} />
        <Route path="/datenschutz" element={<DatenschutzView />} />
        <Route path="/barrierefreiheit" element={<BarrierefreiheitView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
}
