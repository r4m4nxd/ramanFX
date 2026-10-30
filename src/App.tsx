import { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useStore } from '@/data/store';
import { Shell } from '@/ui/Shell';
import SignIn from '@/pages/SignIn';
import { DATA_MODE } from '@/data/derived';
import { ToastProvider } from '@/ui/kit';
import Dashboard from '@/pages/Dashboard';

// Secondary pages are split so the dashboard paints first (src/routes.tsx: lazy pages that skip the skeleton once loaded).
import { Ask, BotGuide, Calculator, CalendarPage, ChartPage, ChecklistPage, DesignSystem, Exits, Guide, Guru, Heatmaps, Journal, Learn, News, Notebook, Planner, Playbook, PRELOAD, Reports, Risk, Sandbox, Scanner, Stock, Fx, MarketHours, Moves, Insiders, Settings, Strategies, Tools, TradeDetail, Trades, Train, Zones } from '@/routes';

function Loading() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-20" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[0, 1, 2, 3].map(i => <div key={i} className="skeleton h-28" />)}</div>
      <div className="skeleton h-72" />
    </div>
  );
}

export default function App() {
  const initCloud = useStore(s => s.initCloud);
  useEffect(() => { void initCloud(); }, [initCloud]);
  useEffect(() => {
    // Fetch every page in the background once the app is idle, so taps never wait on a download (or flash a skeleton).
    const go = () => PRELOAD.forEach((p, i) => setTimeout(() => void p.preload().catch(() => {}), i * 120));
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
    if (ric) ric(go); else setTimeout(go, 1200);
  }, []);
  const auth = useStore(s => s.auth);
  // Signed-out visitors only ever see the sign-in screen; nothing of the journal renders.
  // Dev stress fixtures (?data=…, never in production builds) render without an account.
  if (DATA_MODE === 'real') {
    if (auth === 'checking') return null;
    if (auth === 'out') return <SignIn />;
  }
  return (
    <BrowserRouter>
      <ToastProvider>
        <Shell>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/trades" element={<Trades />} />
              <Route path="/trades/:id" element={<TradeDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/heatmaps" element={<Heatmaps />} />
              <Route path="/guru" element={<Guru />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/bot-guide" element={<BotGuide />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/news" element={<News />} />
              <Route path="/chart" element={<ChartPage />} />
              <Route path="/plan" element={<Planner />} />
              <Route path="/plan/:id" element={<Planner />} />
              <Route path="/playbook" element={<Playbook />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/exits" element={<Exits />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/design" element={<DesignSystem />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/checklist" element={<ChecklistPage />} />
              <Route path="/ask" element={<Ask />} />
              <Route path="/practice" element={<Sandbox />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/scanner/fx" element={<Fx />} />
              <Route path="/fx" element={<Navigate to="/scanner/fx" replace />} />
              <Route path="/scanner/:ticker" element={<Stock />} />
              <Route path="/market-hours" element={<MarketHours />} />
              <Route path="/moves" element={<Moves />} />
              <Route path="/insiders" element={<Insiders />} />
              <Route path="/train" element={<Train />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </Shell>
      </ToastProvider>
    </BrowserRouter>
  );
}
