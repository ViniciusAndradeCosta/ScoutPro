import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ScoutSidebar } from '../components/scout/ScoutSidebar';

export function ScoutLayout() {
  const location = useLocation();
  const isMessages = location.pathname.startsWith('/olheiro/mensagens');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex pt-16">
        <ScoutSidebar />
        <main className="flex-1 md:ml-[280px] h-[calc(100vh-4rem)] overflow-y-auto">
          <div
            className={`w-full ${isMessages ? 'p-4' : 'p-6'}`}
            style={{
              height: isMessages ? 'calc(100vh - 4rem)' : 'auto',
              minHeight: 'calc(100vh - 4rem)',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
