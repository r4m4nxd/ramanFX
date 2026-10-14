import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useStore } from '@/data/store';
import { Shell } from '@/ui/Shell';
import { ToastProvider } from '@/ui/kit';
import Dashboard from '@/pages/Dashboard';

// Secondary pages are split so the dashboard paints first.
const Journal = lazy(() => import('@/pages/Journal'));
const Trades = lazy(() => import('@/pages/Trades'));
const TradeDetail = lazy(() => import('@/pages/TradeDetail'));
const Reports = lazy(() => import('@/pages/Reports'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const Heatmaps = lazy(() => import('@/pages/Heatmaps'));
const Playbook = lazy(() => import('@/pages/Playbook'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const Risk = lazy(() => import('@/pages/Risk'));
const Strategies = lazy(() => import('@/pages/Strategies'));
const Notebook = lazy(() => import('@/pages/Notebook'));
const Exits = lazy(() => import('@/pages/Exits'));
const Settings = lazy(() => import('@/pages/Settings'));

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
              <Route path="/playbook" element={<Playbook />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/risk" element={<Risk />} />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/notebook" element={<Notebook />} />
              <Route path="/exits" element={<Exits />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </Shell>
      </ToastProvider>
    </BrowserRouter>
  );
}
