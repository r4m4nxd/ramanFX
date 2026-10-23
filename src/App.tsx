import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useStore } from '@/data/store';
import { Shell } from '@/ui/Shell';
import SignIn from '@/pages/SignIn';
import { DATA_MODE } from '@/data/derived';
import { ToastProvider } from '@/ui/kit';
import Dashboard from '@/pages/Dashboard';

// Secondary pages are split so the dashboard paints first.
const Journal = lazy(() => import('@/pages/Journal'));
const Trades = lazy(() => import('@/pages/Trades'));
const TradeDetail = lazy(() => import('@/pages/TradeDetail'));
const Reports = lazy(() => import('@/pages/Reports'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));
const Learn = lazy(() => import('@/pages/Learn'));
const Ask = lazy(() => import('@/pages/Ask'));
const Sandbox = lazy(() => import('@/pages/Sandbox'));
const BotGuide = lazy(() => import('@/pages/BotGuide'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Heatmaps = lazy(() => import('@/pages/Heatmaps'));
const Planner = lazy(() => import('@/pages/Planner'));
const Guru = lazy(() => import('@/pages/Guru'));
const Guide = lazy(() => import('@/pages/Guide'));
const News = lazy(() => import('@/pages/News'));
const ChartPage = lazy(() => import('@/pages/ChartPage'));
const Playbook = lazy(() => import('@/pages/Playbook'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const Risk = lazy(() => import('@/pages/Risk'));
const Strategies = lazy(() => import('@/pages/Strategies'));
const Notebook = lazy(() => import('@/pages/Notebook'));
const Exits = lazy(() => import('@/pages/Exits'));
const Settings = lazy(() => import('@/pages/Settings'));

// Fetch every page in the background once the app is idle, so taps never wait on a download.
const PRELOAD = [() => import('@/pages/Guide'), () => import('@/pages/News'), () => import('@/pages/ChartPage'), () => import('@/pages/Journal'), () => import('@/pages/Trades'), () => import('@/pages/TradeDetail'), () => import('@/pages/Reports'), () => import('@/pages/CalendarPage'), () => import('@/pages/Heatmaps'), () => import('@/pages/Planner'), () => import('@/pages/Guru'), () => import('@/pages/Playbook'), () => import('@/pages/Calculator'), () => import('@/pages/Risk'), () => import('@/pages/Strategies'), () => import('@/pages/Notebook'), () => import('@/pages/Exits'), () => import('@/pages/Settings')];

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
    const go = () => PRELOAD.forEach((f, i) => setTimeout(() => void f().catch(() => {}), i * 120));
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
              <Route path="/ask" element={<Ask />} />
              <Route path="/practice" element={<Sandbox />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </Shell>
      </ToastProvider>
    </BrowserRouter>
  );
}
