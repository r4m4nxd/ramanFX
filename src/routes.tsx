import { lazy, type ComponentType } from 'react';

/**
 * Lazy pages that never flash the skeleton once their code is in memory.
 * React.lazy suspends on its first render even when the chunk is already downloaded (it only learns the promise
 * resolved a microtask later), so every first visit showed the Suspense skeleton for a frame or two. Here, once a
 * page's module has loaded (idle preload, hover/touch prefetch or an earlier visit) the real component renders
 * synchronously and Suspense is never touched.
 */
type Loader = () => Promise<{ default: ComponentType<object> }>;
export type LazyPage = ComponentType<object> & { preload: () => Promise<unknown> };

function lazyPage(load: Loader): LazyPage {
  let Loaded: ComponentType<object> | null = null;
  let pending: Promise<{ default: ComponentType<object> }> | null = null;
  const preload = () => (pending ??= load().then(m => { Loaded = m.default; return m; }, e => { pending = null; throw e; }));
  const Lazy = lazy(preload);
  const Page = (props: object) => (Loaded ? <Loaded {...props} /> : <Lazy {...props} />);
  return Object.assign(Page, { preload });
}

export const Journal = lazyPage(() => import('@/pages/Journal'));
export const Trades = lazyPage(() => import('@/pages/Trades'));
export const TradeDetail = lazyPage(() => import('@/pages/TradeDetail'));
export const Reports = lazyPage(() => import('@/pages/Reports'));
export const DesignSystem = lazyPage(() => import('@/pages/DesignSystem'));
export const Learn = lazyPage(() => import('@/pages/Learn'));
export const ChecklistPage = lazyPage(() => import('@/pages/Checklist'));
export const Ask = lazyPage(() => import('@/pages/Ask'));
export const Sandbox = lazyPage(() => import('@/pages/Sandbox'));
export const BotGuide = lazyPage(() => import('@/pages/BotGuide'));
export const Tools = lazyPage(() => import('@/pages/Tools'));
export const CalendarPage = lazyPage(() => import('@/pages/CalendarPage'));
export const Heatmaps = lazyPage(() => import('@/pages/Heatmaps'));
export const Planner = lazyPage(() => import('@/pages/Planner'));
export const Guru = lazyPage(() => import('@/pages/Guru'));
export const Guide = lazyPage(() => import('@/pages/Guide'));
export const News = lazyPage(() => import('@/pages/News'));
export const ChartPage = lazyPage(() => import('@/pages/ChartPage'));
export const Playbook = lazyPage(() => import('@/pages/Playbook'));
export const Calculator = lazyPage(() => import('@/pages/Calculator'));
export const Risk = lazyPage(() => import('@/pages/Risk'));
export const Strategies = lazyPage(() => import('@/pages/Strategies'));
export const Notebook = lazyPage(() => import('@/pages/Notebook'));
export const Exits = lazyPage(() => import('@/pages/Exits'));
export const Settings = lazyPage(() => import('@/pages/Settings'));

/** First path segment → page, for prefetching on hover / touch-down / focus of a link. */
const BY_PATH: Record<string, LazyPage> = {
  journal: Journal, trades: Trades, reports: Reports, design: DesignSystem, learn: Learn, checklist: ChecklistPage, ask: Ask,
  practice: Sandbox, 'bot-guide': BotGuide, tools: Tools, calendar: CalendarPage, heatmaps: Heatmaps, plan: Planner, guru: Guru,
  guide: Guide, news: News, chart: ChartPage, playbook: Playbook, calculator: Calculator, risk: Risk, strategies: Strategies,
  notebook: Notebook, exits: Exits, settings: Settings,
};

/** Start downloading the page behind `to` (no-op for the dashboard, which ships in the main bundle). */
export function prefetchRoute(to: string) {
  const seg = to.split(/[?#]/)[0].split('/').filter(Boolean);
  const page = seg[0] === 'trades' && seg.length > 1 ? TradeDetail : BY_PATH[seg[0] ?? ''];
  void page?.preload().catch(() => {});
}

/** Spread onto a link/button: fetch its page the moment intent shows (pointer over it, finger down, keyboard focus). */
export const prefetchProps = (to: string) => ({ onPointerEnter: () => prefetchRoute(to), onPointerDown: () => prefetchRoute(to), onFocus: () => prefetchRoute(to) });

/** Idle preload order: the pages a phone user reaches first, then the rest; heavy reading pages last. */
export const PRELOAD: LazyPage[] = [Journal, Trades, TradeDetail, Planner, Reports, CalendarPage, Heatmaps, Guru, Playbook, Calculator, Risk, Strategies, Notebook, Exits, Settings, ChecklistPage, Tools, Guide, News, ChartPage, Ask, BotGuide, Sandbox, Learn];
