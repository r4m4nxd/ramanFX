// Every explanation the stock scanner's tap-tips show, in one place. Plain English, matched to how
// tools/stock_scanner (zones.py, scan.py, lists.py, fundamentals.py) computes each number. Static entries for labels,
// builders for the numbers (they compute the % gain, the risk and which score points were earned from the values).
import { BLOCK_LABEL, EXIT_REASON, NEAR_PCT, px, SEIDEN_PARTS, type Bucket, type GaugeState, type RegimeRow, type RuleStatus } from './scanner';

/** One tip: a bold title, a short body, optional bullet lines and the lesson reference. */
export interface TipDoc { title: string; body: string; lines?: string[]; ref?: string }

const f1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
const sign = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '');
const sp = (n: number) => `${sign(n)}${f1(Math.abs(n))}%`;
const ok = (n: number | null | undefined): n is number => n != null && Number.isFinite(n);

// ─── Math (unit-tested) ─────────────────────────────────────────────────────────────────────────────────
/** % move from `from` to `to` (+ = up). */
export const pctGain = (from: number, to: number) => (from > 0 ? (to - from) / from * 100 : 0);
/** Risk of a long as % of the entry: (entry − stop) / entry. */
export const riskPct = (entry: number, stop: number) => (entry > 0 ? (entry - stop) / entry * 100 : 0);
/** R multiple of a level: (level − entry) / (entry − stop). */
export const rMultiple = (entry: number, stop: number, level: number) => (entry > stop ? (level - entry) / (entry - stop) : 0);
/** Owner's stop buffer per timeframe: % of the zone height beyond the distal. */
export const STOP_PCT: Record<string, number> = { W1: 5, MN: 3, '3M': 2, D1: 10 };
/** The stop rule as text: the current timeframes (D1 only for an old scan file). */
const stopRuleText = (tf: string) => Object.entries(STOP_PCT).filter(([k]) => k !== 'D1' || tf === 'D1').map(([k, v]) => `${k} ${v}%`).join(', ');
/** The stop the scanner writes: distal − pct% of the zone height (min 0.03). */
export const stopFrom = (proximal: number, distal: number, tf: string) => distal - Math.max((STOP_PCT[tf] ?? 5) / 100 * Math.abs(proximal - distal), 0.03);

// ─── Static entries ─────────────────────────────────────────────────────────────────────────────────────
const TF: Record<string, TipDoc> = {
  D1: { title: 'D1 · daily', body: 'Daily candles. Older scans drew entry zones on D1 (stop 10% of the zone height); the scanner now uses D1 only for price checks.' },
  W1: { title: 'W1 · weekly zone', body: 'Drawn on weekly candles; counts as made on the close of its stay-away week. Stop buffer: 5% of the zone height. It counts only inside a touched strong MN demand. A tested W1 zone confirms with a W1 close back above the proximal.' },
  MN: { title: 'MN · monthly zone', body: 'Drawn on monthly candles. Stop buffer: 3% of the zone height. It counts only inside a touched strong 3M demand, and it is the area a W1 zone must sit in. A tested MN zone confirms on W1.' },
  '3M': { title: '3M · quarterly zone', body: 'Drawn on quarterly candles (built from closed months): the top tradeable timeframe. Stop buffer: 2% of the zone height. A strong 6M demand within reach must be touched first. A tested 3M zone confirms on MN.' },
  '6M': { title: '6M · half-year context', body: 'Half-year candles, context only: where price sits against the 6M zones and its trend. A strong 6M level within reach can block a 3M zone; short histories show n/a.' },
};
export const tfTip = (tf: string): TipDoc => TF[tf] ?? { title: tf, body: 'Zone timeframe (W1 / MN / 3M). The stop buffer shrinks as the timeframe grows.' };

const TYPE: Record<string, TipDoc> = {
  ARR: { title: 'ARR · Arrival', body: 'A strong zone whose run-out also crossed a trendline with a departure close (body ≥ 0.6 ATR) and removed an opposite zone. Top grade: 4 Raja points; can be bought.', ref: 'Raja L1 · L51' },
  WOW: { title: 'WOW', body: 'Strong, with an open run to the next opposite zone ahead. Top grade: 4 Raja points; can be bought.', ref: 'Raja L50 · L101' },
  STR: { title: 'STR · Strong', body: 'Its run-out removed an opposite zone (closed through a supply). 3 Raja points; can be bought.', ref: 'Raja L1 · L51' },
  OVL: { title: 'OVL · Overlap', body: 'Formed inside or next to an old opposite zone. On the "never set and forget" list: blocks a BUY even when strong.', ref: 'Raja L52' },
  FLP: { title: 'FLP · Flip area', body: 'An old zone of the other side flipped (supply turned demand or the reverse). Never set and forget: blocks a BUY.', ref: 'Raja L52' },
  TST: { title: 'TST · Tested', body: 'Weak type whose zone price already came back into. 0 type points; a BUY needs ARR, WOW or STR.', ref: 'Raja L1 · L51' },
  WK: { title: 'WK · Weak', body: 'Its run-out removed no opposite zone. 0 type points; a BUY needs ARR, WOW or STR.', ref: 'Raja L1 · L51' },
};
export const typeTip = (t: string): TipDoc => TYPE[t] ?? { title: t, body: 'Raja zone type.' };
export const zoneBadgeTip = (tf: string, t: string): TipDoc => ({ title: `${tf} · ${t}`, body: `${tfTip(tf).body} ${typeTip(t).body}`, ref: typeTip(t).ref });

const PATTERN: Record<string, string> = {
  DBR: 'drop-base-rally (a reversal, VP)', RBR: 'rally-base-rally (a continuation, CP)', RBD: 'rally-base-drop (a reversal)', DBD: 'drop-base-drop (a continuation)',
};
/** The card's "STR. DBR demand 497–509.59, 1-candle base, made 2026-10-19." line. */
export function zoneLineTip(z: { tf: string; zone_type: string; pattern: string; proximal: number; distal: number; base_candles?: number; made: string; price?: number }): TipDoc {
  const h = Math.abs(z.proximal - z.distal);
  return {
    title: `${z.tf} ${z.zone_type} demand`, body: `${typeTip(z.zone_type).body}`,
    lines: [
      `${z.pattern}: ${PATTERN[z.pattern] ?? 'zone pattern'}.`,
      `Zone ${px(z.distal)} (distal, lowest wick of base + departure) to ${px(z.proximal)} (proximal, highest base body): height ${px(h)}${z.price ? `, ${f1(h / z.price * 100)}% of price` : ''}. Max 1.5 ATR(14).`,
      ...(z.base_candles ? [`${z.base_candles}-candle base: 1-6 basing candles (body < 50% of their range), then a departure ≥ 1.2x the biggest one.`] : []),
      `Made ${z.made}: the stay-away candle's date${z.tf === 'D1' ? '' : ` (a ${z.tf} zone counts as made when that ${z.tf === 'W1' ? 'week' : z.tf === 'MN' ? 'month' : 'quarter'} closes)`}.`,
    ],
    ref: 'Raja L55 · L1 · L51',
  };
}

export const G = {
  price: (p: number, cur = 'USD', date?: string): TipDoc => ({ title: `Last close ${px(p)} ${cur}`, body: `The last daily close${date ? ` (${date})` : ''}, split and dividend adjusted. Every % on this card is measured from it; the scan reads closed sessions only.` }),
  listing: (t: string): TipDoc => ({ title: t, body: 'A Canadian company scanned through its US listing (NYSE / Nasdaq, prices in USD). The TradingView link opens the TSX chart; zones can differ slightly from it.' }),
  index: (code: string, label?: string): TipDoc => ({ title: `${code}${label ? ` · ${label}` : ''}`, body: `A member of the ${label ?? code} index. The index pills above filter by membership; one stock can sit in several indexes.` }),
  sector: (s: string): TipDoc => ({ title: s, body: 'GICS sector from the index list. The sector pills filter by it.' }),
  watchNew: { title: 'WATCH · new zone, price far', body: 'A strong fresh zone made in the last 5 sessions that passes every rule except the approach: price is still too far above. Wait for it to come back.', ref: 'Raja L52 · L101' },
  watchTested: (touches: number, tf: string): TipDoc => ({ title: `Touch ${touches + 1} · confirm`, body: `A strong zone on its ${touches === 1 ? '2nd' : '3rd'} touch that passes everything but freshness. No set and forget: confirm one timeframe lower (${tf === '3M' ? '3M → MN' : tf === 'MN' ? 'MN → W1' : tf === 'W1' ? 'W1: a W1 close back above the proximal (nothing below W1)' : 'D1: a D1 close back above the proximal'}: trendline cross + opposite zone removed).`, ref: 'Raja L52 · L101' }),
  signal: (s: 'BUY' | 'WATCH' | string): TipDoc => s === 'BUY'
    ? { title: 'BUY', body: 'A fresh ARR / WOW / STR demand that passes every Raja rule today: limit at the proximal, stop and target set in the market (set and forget).', ref: 'Raja first, Kevin second' }
    : { title: 'WATCH', body: 'A strong zone that passes everything but one thing: price is still far (a new zone), or it is a 2nd / 3rd touch that needs a lower-timeframe confirmation.', ref: 'Raja L52 · L101' },
  proxDist: { title: 'Proximal · distal', body: 'Proximal = the highest base body: the entry edge. Distal = the lowest wick of the base + departure: the far edge. A zone is removed only by a close below the distal, never by a wick.', ref: 'Raja L55 · L4 · L50' },
  stopRule: (pct: number, tf: string): TipDoc => ({ title: `Stop: distal − ${pct}%`, body: `The owner's stop rule: ${pct}% of the zone height below the distal for a ${tf} zone (${stopRuleText(tf)}; min 0.03).`, ref: 'ZV 2.10 · owner' }),
  earnings: (d: string): TipDoc => ({ title: `Earnings ${d}`, body: 'Next earnings date (Yahoo, best effort). A BUY needs no earnings within the next 10 trading days; unknown shows "?": check it yourself.', ref: 'Kevin L12' }),
  rulesSummary: (pass: number, total: number, fail: number): TipDoc => ({ title: `${pass}/${total} pass${fail ? ` · ${fail} fail` : ''}`, body: 'Every BUY rule checked on this zone. A BUY needs zero ✗. ! = allowed but flagged, ? = unknown (check yourself), · = context only. The last lines (fair value, RFX index) never fail.' }),
  fundHead: { title: 'Fundamentals · context only', body: 'From SEC EDGAR filings (XBRL companyfacts), refreshed at most weekly per company. Not part of the supply and demand rules: a signal never depends on them.' },
  fundCA: { title: 'n/a (Canadian filer)', body: 'Canadian issuers file 40-F / 6-K reports with IFRS numbers, so SEC companyfacts has no US-GAAP figures to show.' },
  star: (on: boolean): TipDoc => ({ title: on ? 'On your watchlist' : 'Add to watchlist', body: 'Starred stocks show in the ★ tab with their zone gauge. Kept on this device only. For Telegram alerts (approach within 3%, in zone, in supply) add the ticker to the WATCHLIST secret.' }),
  planIt: { title: 'Plan it', body: 'Opens a new trade plan prefilled with the entry, stop, target, zone edges, curve, base and the next supply. Nothing goes to a broker; check the chart first.' },
  tv: { title: 'TradingView', body: 'Opens the stock on TradingView in a new tab (the TSX chart for interlisted Canadian names). Prices there are unadjusted, so old zones can sit slightly higher.' },
  zonesBtn: { title: 'Zones', body: "Opens this stock's page: every active W1 / MN / 3M zone, the gauge, fundamentals and the full rule check." },
  chart: (tf?: string, hasPz?: boolean): TipDoc => ({
    title: 'Zone chart', body: `Last daily bars, split and dividend adjusted. Tap the chart to enlarge it (~6 months).`,
    lines: [`Green band: the ${tf ?? ''} demand zone of the plan.`.replace('  ', ' '), 'Red band: the next supply (the target zone).', 'Amber band FV: fair value, the 20-bar 70% value area.', `Dashed: entry E, stop S, target ${hasPz ? 'PZ3' : 'T'}.${hasPz ? ' Dotted: PZ1 / PZ2.' : ''}`, 'P: the last close. Dotted bands (stock page): other active zones.'],
  }),
  updated: (ago: string): TipDoc => ({ title: `Updated ${ago}`, body: 'When the scan file was written. It runs on weekdays after the US close (21:45 UTC) and also sends the Telegram lists.' }),
  scanned: (date: string, n: number, of: number): TipDoc => ({ title: `Close of ${date}`, body: `The last closed session the rules read. ${n.toLocaleString()} of ${of.toLocaleString()} stocks in the universe had price data; with under half the scan writes nothing.` }),
  intraday: { title: 'Ran during market hours', body: "The scan ran while the US market was open, so today's unfinished candle was left out: every rule reads closed sessions only." },
  uncovered: (n: number, list: string): TipDoc => ({ title: `${n} TSX-only names`, body: `These index members have no US listing, so they need a TSX data feed (paid, switched off) and are not scanned: ${list}.` }),
  fixture: { title: 'Sample data', body: 'A synthetic fixture for the demo, not real prices. The daily scan replaces it.' },
  views: { title: 'Signals · Market map', body: 'Signals: today\'s BUY / WATCH setups with their full plan. Market map: every stock by where its close sits against its zones (in, approaching within 3%, just left), whatever the rules say.' },
  pills: (b: number, w: number, e: number, s: number): TipDoc => ({ title: 'Signal lists', body: 'Counts for the index and sector picked.', lines: [`Buy ${b}: zones that pass every rule today.`, `Watch ${w}: strong zones waiting for price or a confirmation.`, `Exit ${e}: warnings on your holdings (stop hit, demand broken, near / in supply).`, `★ ${s}: your watchlist, kept on this device.`] }),
  indexFilter: { title: 'Index', body: 'Shows only members of one index (S&P 500, Nasdaq-100, Dow 30, TSX 60, TSX Composite). TSX names are scanned through their US listing.' },
  sort: { title: 'Sort', body: 'Order of the cards.', lines: ['Raja: Raja lens score, highest first.', 'Seiden: Seiden odds score (display only).', 'Nearest: smallest distance from price to the entry.', 'R:R: biggest reward to risk.'] },
  sectors: { title: 'Sectors', body: 'Filter by GICS sector. The number is the BUY count in that sector today.' },
  side: { title: 'Demand · Middle · Supply', body: 'Each stock lands in one of seven lists by its close: in > just left > approaching, on the demand or the supply side; the rest is Middle. Fresh or tested zones (≤ 3 touches), W1 / MN / 3M.' },
  strongFresh: { title: 'Strong + fresh', body: 'Highlighted rows: the zone is ARR / WOW / STR and untouched (the kind a BUY needs).' },
  showAll: { title: 'Show all', body: 'The first 60 rows are shown, strongest zone first (score, then the nearest).' },
  closest: { title: 'Closest setups', body: 'The 10 candidates nearest to their entry. Each badge is the first rule that blocks a BUY (HTF location → curve → direction → monthly supply → sideways → zone type → fresh → overlap / flip → did its job → 3rd CP → room → earnings → near entry).' },
  exitEmpty: { title: 'Exit warnings', body: 'Your holdings (HOLDINGS_JSON secret) are checked each scan. Entries, stops and sizes go only to Telegram.' },
  regime: (r: RegimeRow): TipDoc => ({
    title: `${r.symbol} market regime`,
    body: `${r.symbol} closed ${px(r.close)}${r.sma200 != null ? `, ${r.above200 ? 'above' : 'below'} its 200-day average ${px(r.sma200)} (${sp(pctGain(r.sma200, r.close))})` : ' (no 200-day average yet)'}. Context only: it never blocks a signal.`,
    lines: [`MN curve ${r.curve != null ? `${Math.round(r.curve)}%` : '—'}: ${curveWords(r.curve)}`, `Direction ${r.direction}: ${dirWords(r.direction)}`],
  }),
  above200: (r: RegimeRow): TipDoc => ({ title: r.above200 ? '▲ above the 200-day' : r.above200 === false ? '▼ below the 200-day' : 'No 200-day average', body: `The close against the simple average of the last 200 daily closes${r.sma200 != null ? ` (${px(r.sma200)}, close ${px(r.close)}: ${sp(pctGain(r.sma200, r.close))})` : ''}. Above = the broad trend is up.` }),
};

// ─── Direction, curve, states ───────────────────────────────────────────────────────────────────────────
export function dirWords(head: string): string {
  if (head.startsWith('LONG - FULL')) return 'long side at full size: the top row (3M) in control, MN aligned, W1 agrees. A BUY needs LONG.';
  if (head.startsWith('LONG - REDUCED')) return 'long side at reduced size: one row disagrees (W1 against, the 3M trend against, curve disagrees or a 3rd CP). Still allows a BUY.';
  if (head.startsWith('SHORT')) return 'short side: the scanner never shorts, so the direction rule fails for every buy.';
  if (head.includes('realigning')) return 'W1 is pulling back or turning against the side: wait for it to realign. No BUY.';
  if (head.startsWith('WAIT')) return 'no tradeable side yet. No BUY.';
  return 'Raja direction from W1 → MN → 3M.';
}
export const directionTip = (head: string, notes?: string): TipDoc => ({ title: `Direction ${head}`, body: `Raja direction table, W1 → MN → 3M (older scans D1 → W1 → MN): ${dirWords(head)}`, lines: notes ? [notes] : undefined, ref: 'Raja L7 · L8 · L3' });

export function stateWords(s: string): string {
  const up = s.endsWith('UP') ? 'up' : s.endsWith('DOWN') ? 'down' : '';
  if (s.startsWith('TREND')) return `swings (HH + HL or LH + LL) and the trendline agree: trend ${up}.`;
  if (s.startsWith('CHANGED')) return `the newest trendline was crossed and 2 opposite zones were removed since: direction clearly ${up} (L3).`;
  if (s.startsWith('TURNING')) return `the newest trendline was crossed ${up}, but fewer than 2 opposite zones removed yet: not confirmed.`;
  if (s.startsWith('PULLBACK')) return 'a trendline crossed against the swing trend, not yet confirmed by 2 removed zones: a pullback.';
  if (s.startsWith('RANGE')) return 'no swing trend and no trendline cross (or both lines in force): sideways.';
  return 'not enough bars to read.';
}
export const tfStateTip = (label: string, value: string): TipDoc => {
  const parts = value.split('·').map(x => x.trim());
  const tfs = label.split('·').map(x => x.trim());
  return { title: `${label} ${value}`, body: 'State of each timeframe from its swings and trendlines.', lines: parts.map((v, i) => `${tfs[i] ?? ''} ${v}: ${stateWords(v)}`.trim()), ref: 'Raja L3 · L4' };
};

export function curveWords(c: number | null | undefined): string {
  if (!ok(c)) return 'not measurable.';
  if (c <= 25) return 'low curve, buyers only.';
  if (c < 50) return 'below 50%: confirmation side, buys flagged.';
  if (c < 75) return 'upper half: no buys (unless the owner ATH rule applies).';
  return 'high curve: sellers only, no buys (unless the owner ATH rule applies).';
}
export const curveTip = (c: number | null | undefined, raja?: boolean, tf = 'MN'): TipDoc => ({
  title: `Curve ${ok(c) ? `${Math.round(c)}%` : '—'}`,
  body: `Where price sits between the nearest fresh strong ${tf} demand (0%) and ${tf} supply (100%), proximal to proximal${raja === false ? `. No such ${tf} pair here, so the 100-bar ${tf} range is used` : raja ? '' : `; without that pair, the 100-bar ${tf} range`}. Newer scans measure it on 3M (MN fallback). ${ok(c) ? `Now: ${curveWords(c)}` : ''}`.trim(),
  lines: ['≤ 25% ✓ low curve · 25-50% ! flagged · ≥ 50% ✗ no buys.', 'Owner ATH rule: no strong supply overhead and the next two timeframes both TREND / CHANGED UP → allowed, flagged.'],
  ref: 'Raja L4 · owner',
});

// ─── Plan numbers ───────────────────────────────────────────────────────────────────────────────────────
export interface PlanLike { tf: string; proximal: number; distal: number; entry: number; stop: number; target?: number | null; rr?: number | null; target_kind?: 'supply' | 'projection' | null; next_supply?: number | null; stop_pct_of_height?: number; price?: number }

export function entryTip(p: PlanLike): TipDoc {
  const away = p.price ? pctGain(p.entry, p.price) : null;
  return {
    title: `Entry ${px(p.entry)}`,
    body: `Limit buy at ${px(p.entry)}, the proximal of the ${p.tf} demand (${px(p.distal)}–${px(p.proximal)}). Set and forget: the order rests in the market until price comes back.`,
    lines: away != null ? [away >= 0 ? `Price is ${f1(away)}% above it now.` : `Price is inside the zone (${f1(-away)}% below the proximal).`] : undefined,
    ref: 'Raja L2 · L52',
  };
}
export function stopTip(p: PlanLike): TipDoc {
  const h = Math.abs(p.proximal - p.distal), pct = p.stop_pct_of_height ?? STOP_PCT[p.tf] ?? 5, buf = p.distal - p.stop;
  return {
    title: `Stop ${px(p.stop)}`,
    body: `${px(p.stop)} = distal ${px(p.distal)} − ${pct}% of the zone height ${px(h)} (${buf.toFixed(2)}). The ${p.tf} rule: ${stopRuleText(p.tf)}.`,
    lines: [`Risk ${f1(riskPct(p.entry, p.stop))}% from the entry (${px(p.entry - p.stop)} per share).`, 'Exit warnings use a close below it, never a wick.'],
    ref: 'Owner rule · ZV 2.10',
  };
}
export function targetTip(p: PlanLike): TipDoc {
  if (!ok(p.target)) return { title: 'No target', body: 'No supply above and no 250% projection (no correction to measure, or the run-out already reached it): no known target, no BUY.', ref: 'Raja L101 · L5' };
  const g = pctGain(p.entry, p.target);
  const now = p.price ? pctGain(p.price, p.target) : null;
  const how = p.target_kind === 'projection'
    ? `Raja's 250% projection (no supply above): the correction from the last higher high before the base down to the distal, × 2.5 from the distal (100% + 100% + half).`
    : `0.5% before the next supply's proximal ${px(p.next_supply)}: exit just before the opposite zone.`;
  return {
    title: `Target ${px(p.target)}`, body: `${px(p.target)} = ${how}`,
    lines: [`+${f1(g)}% from the entry${ok(p.rr) ? ` · R:R ${f1(p.rr)}` : ''}.`, ...(now != null ? [now >= 0 ? `+${f1(now)}% from today's close.` : `Price is already ${f1(-now)}% above it.`] : [])],
    ref: p.target_kind === 'projection' ? 'Raja L5 (Feb 18) · L101' : 'Raja L7 · L106',
  };
}
export function rrTip(p: PlanLike): TipDoc {
  if (!ok(p.target) || !ok(p.rr)) return { title: 'R:R —', body: 'Reward to risk needs a target. Without one there is no BUY.' };
  return {
    title: `R:R ${f1(p.rr)}`,
    body: `(target − entry) ÷ (entry − stop) = ${px(p.target - p.entry)} ÷ ${px(p.entry - p.stop)}. You aim to make ${f1(p.rr)}x what you risk.`,
    lines: ['A BUY needs ≥ 2 (≥ 3 good, 2-3 flagged).'], ref: 'Raja L7 · L53',
  };
}

/** PZ1 / PZ2 / PZ3: the % gain each profit zone aims for, its R:R and which candidate set it. */
export function pzTip(k: 'pz1' | 'pz2' | 'pz3', v: number, s: { entry?: number | null; stop?: number | null; price?: number | null; fv_lo?: number | null; fv_hi?: number | null; rr?: number | null; target_kind?: string | null }): TipDoc {
  const name = k.toUpperCase();
  const lines: string[] = [];
  if (ok(s.entry) && ok(s.stop) && s.entry > s.stop) {
    const r = rMultiple(s.entry, s.stop, v);
    lines.push(`+${f1(pctGain(s.entry, v))}% from the entry ${px(s.entry)} · R:R ${f1(r)}.`);
    if (ok(s.price)) { const n = pctGain(s.price, v); lines.push(n >= 0 ? `+${f1(n)}% from today's close.` : `Price is already ${f1(-n)}% above it.`); }
    const near = (a?: number | null) => ok(a) && Math.abs(a - v) < 0.011;
    const src = k === 'pz3' ? (s.target_kind === 'projection' ? "the Raja target: the 250% projection (no supply above)" : "the Raja target, 0.5% before the next supply")
      : near(s.fv_lo) ? `the fair value's low edge ${px(s.fv_lo)}` : near(s.fv_hi) ? `the fair value's high edge ${px(s.fv_hi)}`
      : near(s.entry + (k === 'pz1' ? 2 : 3) * (s.entry - s.stop)) ? `${k === 'pz1' ? '2R' : '3R'} (entry + ${k === 'pz1' ? 2 : 3} × risk)` : 'its rule below';
    lines.push(`= ${src}.`);
  }
  const body = k === 'pz1' ? 'Profit zone 1: the higher of the fair value edge just above the entry and 2R, kept below PZ3. Raja: close half here, hold the rest to PZ3 (no breakeven stop).'
    : k === 'pz2' ? 'Profit zone 2: the higher of the fair value far edge and 3R, above PZ1 and below PZ3.'
    : 'Profit zone 3 = the Raja target: 0.5% before the next supply, or the 250% projection when none is above.';
  return { title: `${name} ${px(v)}`, body, lines, ref: k === 'pz3' ? 'Raja L5 · L7' : 'Pinndx-inspired · Raja L7 · L103' };
}

// ─── Distances, gauge ───────────────────────────────────────────────────────────────────────────────────
/** The card's "x% above entry" / "x% in the zone". */
export function toEntryTip(pct: number, entry: number): TipDoc {
  return {
    title: pct >= 0 ? `${f1(pct)}% above the entry` : `${f1(-pct)}% in the zone`,
    body: pct >= 0 ? `The close has to fall ${f1(pct)}% to fill the limit buy at ${px(entry)} (distance = (close − entry) ÷ close).` : `The close is below the proximal ${px(entry)}, inside the demand: a resting limit would have filled.`,
    lines: ['A BUY needs price within max(1x the zone height, 3% of price) above the proximal, or inside the zone. Accent colour = within 3%.'],
    ref: 'Scanner (InpApproach)',
  };
}
/** "x% to demand" style distances (demand below / supply above the close). */
export function distTip(pct: number, side: 'demand' | 'supply', zone?: { tf?: string; type?: string; proximal?: number; distal?: number }): TipDoc {
  const where = side === 'demand' ? 'below' : 'above';
  const z = zone?.tf ? `${zone.tf}${zone.type ? ` ${zone.type}` : ''} ${side}` : `nearest fresh ${side}`;
  return {
    title: pct < 0 ? `Inside the ${side}` : `${f1(pct)}% ${side === 'demand' ? 'to demand' : 'to supply'}`,
    body: pct < 0 ? `The close sits inside the ${z}${zone?.proximal != null ? ` (${px(Math.min(zone.proximal, zone.distal ?? zone.proximal))}–${px(Math.max(zone.proximal, zone.distal ?? zone.proximal))})` : ''}.`
      : `The ${z}${zone?.proximal != null ? ` (proximal ${px(zone.proximal)})` : ''} is ${f1(pct)}% ${where} the close: % of the close to the proximal. Within ${NEAR_PCT}% = approaching.`,
  };
}
export function gaugeTip(g: { demand?: { pct: number; tf?: string; proximal?: number; distal?: number } | null; supply?: { pct: number; tf?: string; proximal?: number; distal?: number } | null; state: GaugeState }): TipDoc {
  const d = g.demand, s = g.supply;
  return {
    title: `Zone gauge · ${g.state === 'demand' ? 'In demand' : g.state === 'supply' ? 'In supply' : 'Middle'}`,
    body: 'Left block: the nearest fresh W1 / MN / 3M demand below; right block: the nearest fresh supply above. The dot is the close, placed by distance; a lit block = price inside that zone.',
    lines: [
      d ? (d.pct < 0 ? `Inside the demand${d.proximal != null ? ` (proximal ${px(d.proximal)})` : ''}.` : `Demand${d.tf ? ` ${d.tf}` : ''}${d.proximal != null ? ` ${px(d.proximal)}` : ''}: ${f1(d.pct)}% below the close.`) : 'No fresh demand below.',
      s ? (s.pct < 0 ? 'Inside the supply.' : `Supply${s.tf ? ` ${s.tf}` : ''}${s.proximal != null ? ` ${px(s.proximal)}` : ''}: ${f1(s.pct)}% above the close.`) : 'No fresh supply above (target: the 250% projection).',
    ],
  };
}

// ─── Scores ─────────────────────────────────────────────────────────────────────────────────────────────
/** Raja lens score parts: type (ARR / WOW 4, STR 3) + fresh (2, 2nd touch 1) + curve (≤ 25% 2, < 75% 1) + room (≥ 3x 2, ≥ 2x 1). */
export function rajaParts(score: number, type: string, touches: number | null | undefined, curve: number | null | undefined) {
  const t = type === 'ARR' || type === 'WOW' ? 4 : type === 'STR' ? 3 : 0;
  const f = touches == null ? null : touches === 0 ? 2 : touches === 1 ? 1 : 0;
  const c = !ok(curve) ? null : curve <= 25 ? 2 : curve >= 75 ? 0 : 1;
  const room = f != null && c != null ? Math.max(0, Math.min(2, score - t - f - c)) : null;
  return { type: t, fresh: f, curve: c, room };
}
export function rajaTip(score: number, z?: { type?: string; touches?: number | null; curve?: number | null }): TipDoc {
  const p = z?.type ? rajaParts(score, z.type, z.touches, z.curve) : null;
  return {
    title: `Raja ${score}/10`,
    body: 'Raja lens score: zone type + freshness + curve + room. It ranks setups (sort "Raja"); the rules alone decide a BUY.',
    lines: p ? [
      `Type ${z!.type}: ${p.type}/4 (ARR / WOW 4, STR 3).`,
      p.fresh != null ? `Freshness: ${p.fresh}/2 (fresh 2, 2nd touch 1).` : 'Freshness: fresh 2, 2nd touch 1.',
      p.curve != null ? `Curve ${Math.round(z!.curve!)}%: ${p.curve}/2 (≤ 25% 2, below 75% 1).` : 'Curve: ≤ 25% 2, below 75% 1.',
      p.room != null ? `Room to target: ${p.room}/2 (≥ 3x the stop 2, ≥ 2x 1).` : 'Room: ≥ 3x the stop 2, ≥ 2x 1.',
    ] : ['Type ARR / WOW 4, STR 3 · fresh 2 (2nd touch 1) · curve ≤ 25% 2 (below 75% 1) · room ≥ 3x 2 (≥ 2x 1).'],
    ref: 'Raja lens (LensRun)',
  };
}
/** A zone row's "score n/10" (supply zones: the same score mirrored, high curve and room below). */
export const zoneScoreTip = (score: number, side: 'demand' | 'supply'): TipDoc => side === 'demand' ? rajaTip(score)
  : { title: `Score ${score}/10`, body: 'The Raja score mirrored for a supply (ranking only, the scanner never sells): type ARR / WOW 4, STR 3 · fresh 2 (2nd touch 1) · high curve ≥ 75% 2 (middle 1) · room below ≥ 3x 2 (≥ 2x 1).' };

const SEIDEN_MAX: Record<string, number> = { departure: 2, time: 1, fresh: 2, margin: 2, trend: 2, curve: 1, fv_bonus: 1, index_bonus: 1 };
const SEIDEN_WHY: Record<string, string> = {
  departure: 'How price left the base: a gap away 2, a departure candle ≥ 2x the biggest base candle 1.',
  time: 'Time at the level: 1-3 base candles 1, 4-6 half a point. Less time = more unfilled orders.',
  fresh: 'Freshness: untouched 2, 2nd touch 1, later 0.',
  margin: 'Profit margin: room to the target ≥ 3x the risk 2, ≥ 2x 1.',
  trend: "Trend: Raja's direction on the zone's side, FULL 2, REDUCED 1.",
  curve: 'Curve: ≤ 25% 1, ≤ 50% half a point (a demand low on the curve).',
  fv_bonus: 'Bonus: the zone sits ≥ 1 ATR below fair value (not at equilibrium).',
  index_bonus: 'Bonus: the RFX index sits in or just above a fresh demand.',
};
export const seidenPartTip = (k: string, v: number): TipDoc => ({ title: `${SEIDEN_PARTS[k] ?? k}: ${v} of ${SEIDEN_MAX[k] ?? '?'}`, body: SEIDEN_WHY[k] ?? 'Seiden odds enhancer.', ref: 'Seiden odds enhancers' });
export function seidenTip(score: number, parts?: Record<string, number>): TipDoc {
  const e = Object.entries(parts ?? {});
  return {
    title: `Seiden odds ${score % 1 ? f1(score) : score}/10`,
    body: "Sam Seiden's odds enhancers, scored 0-10. Display and sort only: Raja's rules alone decide a BUY. Tap the chip for each part.",
    lines: e.length ? [`Earned: ${e.filter(([, v]) => v > 0).map(([k, v]) => `${k.replace('_', ' ')} ${v}`).join(', ') || 'nothing'}.`, `Missed: ${e.filter(([k, v]) => v < (SEIDEN_MAX[k] ?? 0)).map(([k]) => k.replace('_', ' ')).join(', ') || 'nothing'}.`] : undefined,
    ref: 'Seiden · Pinndx-inspired',
  };
}

// ─── Context flags ──────────────────────────────────────────────────────────────────────────────────────
export const fvBandTip = (lo: number, hi: number, price?: number): TipDoc => ({
  title: `Fair value ${px(lo)}–${px(hi)}`,
  body: "The value area of the last 20 closed daily bars: each bar's volume spread over its range, widened from the busiest price until it holds 70% of the volume (no volume: the 25th-75th percentile of closes).",
  lines: price ? [price > hi ? `The close is ${f1(pctGain(hi, price))}% above it.` : price < lo ? `The close is ${f1(-pctGain(lo, price))}% below it.` : 'The close is inside it.'] : undefined,
  ref: 'Seiden L46 · L89',
});
export const flagTip = {
  fvInside: { title: 'Inside fair value', body: "The zone's proximal sits inside the 20-bar value area: equilibrium, where Seiden says not to buy. A flag only; it never blocks a BUY.", ref: 'Seiden L46 · L89' } as TipDoc,
  fvBelow: (atr: number): TipDoc => ({ title: `${f1(atr)} ATR below fair value`, body: `The zone's proximal is ${f1(atr)} ATR(14, daily) below the fair value low. ≥ 1 ATR = a discount: +1 Seiden bonus point.`, ref: 'Seiden L46 · L89' }),
  aligned: { title: 'RFX index aligned', body: 'The RFX index (equal-weight SPY, QQQ, IWM, DIA) sits in a fresh demand or within the approach distance above one: the market agrees. +1 Seiden point; never blocks.', ref: 'Pinndx-inspired' } as TipDoc,
  indexSupply: { title: 'RFX index in supply', body: 'The broad market index sits inside a supply zone: an opposite-zone warning on buys. A flag only; it never blocks.', ref: 'Pinndx-inspired' } as TipDoc,
};
export function rfxTip(ix: { price: number; state: GaugeState; direction: string; aligned: boolean; curve?: number | null; w1?: string; mn?: string }): TipDoc {
  return {
    title: `RFX index ${px(ix.price)}`,
    body: 'An equal-weight composite of SPY, QQQ, IWM and DIA (100 on their first common date), analysed like any stock with its own zones. Context for every buy; it never blocks one.',
    lines: [`State: ${ix.state === 'demand' ? 'in a demand' : ix.state === 'supply' ? 'in a supply (warning flag on buys)' : 'between zones'}${ix.aligned ? ', aligned: +1 Seiden point on buys' : ''}.`, `Direction ${ix.direction}: ${dirWords(ix.direction)}`, ...(ix.curve != null ? [`MN curve ${Math.round(ix.curve)}%: ${curveWords(ix.curve)}`] : [])],
    ref: 'Pinndx-inspired',
  };
}

// ─── Rules (by the rule's short key) ────────────────────────────────────────────────────────────────────
const RULE: Record<string, { title: string; body: string }> = {
  leg: { title: 'Zone quality', body: '1-6 basing candles (body < 50% of their range), then a departure ≥ 1.2x the biggest base candle (ZoneVision). ✓ at ≥ 2x, the lesson\'s ask; ! between. Never blocks.' },
  fresh: { title: 'Fresh', body: 'Price has not come back to the proximal since the zone formed: the first touch, set and forget. A tested zone is WATCH only and needs a lower-timeframe confirmation.' },
  strong: { title: 'Zone type', body: 'Must be ARR, WOW or STR on W1, MN or 3M. OVL, FLP, TST and WK fail.' },
  'HTF align': { title: 'Direction', body: 'Raja direction from W1 → MN → 3M must be LONG (FULL or REDUCED).' },
  curve: { title: 'Curve', body: 'Below 50% of the MN curve (≤ 25% best, 25-50% flagged). Owner ATH rule: no MN supply overhead and W1 + MN both trending up → allowed, flagged.' },
  'no HTF supply': { title: 'No monthly supply on top', body: 'The zone must not sit inside or next to a monthly supply (it gets removed), and price must not be inside a fresh monthly supply.' },
  room: { title: 'Room', body: 'Room to the target ≥ 2x the stop distance (≥ 3x good, 2-3x flagged). The target is the next supply, else the 250% projection.' },
  'not sideways': { title: 'Not sideways', body: 'The last 3 swing highs and lows must not overlap in one band (no HH + HL or LH + LL) on the zone timeframe or MN. Never trade a meshing market.' },
  'no 3rd CP': { title: 'Not the 3rd CP', body: 'CP = a continuation zone (RBR). The 3rd continuation in a row is not traded: the move is late.' },
  'not used': { title: 'Has not done its job', body: 'If the run-out already reached the next supply before price came back, the zone did its job: confirmation only.' },
  clean: { title: 'Not overlap / flip', body: 'Overlap and flip zones are on the never-set-and-forget list, even when strong.' },
  'near entry': { title: 'Near the entry', body: 'Price within max(1x the zone height, 3% of price) above the proximal, or inside the zone. Further away = WATCH (new zone) or no signal.' },
  location: { title: 'HTF location', body: "Owner's top-down rule: a W1 demand trades only inside a touched strong MN demand, an MN demand only inside a touched 3M demand; a 3M demand is the top (unless a strong 6M demand within reach is still untouched). A strong untouched area still below = price likely sells into it first: blocked. Supply mirrored." },
  earnings: { title: 'Earnings', body: 'No earnings in the next 10 trading days. Unknown date = ? (check it yourself before the order).' },
  FV: { title: 'Fair value (context)', body: 'Where the zone sits against the 20-bar 70% value area. Inside = equilibrium flag; ≥ 1 ATR below = +1 Seiden. Never fails.' },
  index: { title: 'RFX index (context)', body: 'The broad-market composite: in / near a fresh demand = aligned (+1 Seiden); in a supply = warning. Never fails.' },
};
const RULE_REF: Record<string, string> = {
  location: 'owner · L7',
  leg: 'L55', fresh: 'L2 · L52', strong: 'L1 · L51', 'HTF align': 'L7 · L8 · L3', curve: 'L4 · owner', 'no HTF supply': 'L50 · L52', room: 'L7 · L53 · L5',
  'not sideways': 'L8 · L101', 'no 3rd CP': 'L8 · Kevin L13', 'not used': 'L5 · Feb 18', clean: 'L52', 'near entry': 'Scanner (InpApproach)', earnings: 'Kevin L12',
  FV: 'Seiden L46 · L89', index: 'Pinndx-inspired',
};
const STATUS: Record<RuleStatus, string> = { pass: '✓ pass', fail: '✗ fail: blocks a BUY', warn: '! allowed, flagged', unknown: '? unknown: check it yourself', info: '· context only' };
/** Guess the rule key from its text when the file has no `short` (older scans). */
export function ruleKey(r: { short?: string; text: string; ref?: string }): string {
  if (r.short) return r.short;
  const t = r.text;
  return /^Zone:/.test(t) ? 'leg' : /^(Fresh|Tested)/.test(t) ? 'fresh' : /^Zone type/.test(t) ? 'strong' : /^Direction/.test(t) ? 'HTF align' : /^Curve/.test(t) ? 'curve'
    : /monthly supply/.test(t) ? 'no HTF supply' : /^(Room|No supply zone above)/.test(t) ? 'room' : /[Ss]ideways/.test(t) ? 'not sideways' : /CP/.test(t) ? 'no 3rd CP'
    : /job/.test(t) ? 'not used' : /(Overlap|Flip|overlap)/.test(t) ? 'clean' : /^Price .* from the entry/.test(t) ? 'near entry' : /[Ee]arnings/.test(t) ? 'earnings'
    : /^HTF location/.test(t) ? 'location' : /^Fair value/.test(t) ? 'FV' : /^RFX/.test(t) ? 'index' : '';
}
export function ruleTip(r: { status: RuleStatus; text: string; ref: string; short?: string }): TipDoc {
  const k = ruleKey(r), d = RULE[k];
  return { title: `${d?.title ?? 'Rule'} · ${STATUS[r.status]}`, body: d?.body ?? r.text, lines: d ? [`Here: ${r.text}`] : undefined, ref: r.ref || RULE_REF[k] };
}
/** A blocking rule (map tag, closest-setup badge, "Top reasons"). */
export function blockTip(key: string, fails?: string[]): TipDoc {
  const d = RULE[key];
  const label = BLOCK_LABEL[key] ?? key;
  return {
    title: label.charAt(0).toUpperCase() + label.slice(1),
    body: `The first Raja rule that blocks a BUY on this zone. ${d?.body ?? ''}`.trim(),
    lines: fails?.length ? [`Also fails: ${fails.filter(f => f !== key).map(f => BLOCK_LABEL[f] ?? f).join(', ') || 'nothing else'}.`] : undefined,
    ref: RULE_REF[key],
  };
}
/** The map's small tag: today's signal, "rules pass" or the blocking rule. */
export function mapTagTip(raw: string | undefined, text: string): TipDoc {
  if (text === 'BUY' || text === 'WATCH') return G.signal(text);
  if (text === 'rules pass') return { title: 'Rules pass', body: 'This zone passes every Raja rule, but it is not today\'s signal (another zone of the stock is nearer, or the signal sits on another timeframe).' };
  return blockTip(raw ?? Object.keys(BLOCK_LABEL).find(k => BLOCK_LABEL[k] === text) ?? text);
}
export const exitTip = (r: string): TipDoc => ({ title: EXIT_REASON[r] ?? r, body: r === 'stop' ? 'A daily close at or below your stop: close the position.' : r === 'demand_broken' ? 'A close below the distal of the demand under your entry (since the holding date, else the last 5 sessions): the zone is gone.' : r === 'near_supply' ? 'The close is within one zone height of the next supply\'s proximal: exit before the opposite zone.' : 'The close sits inside a supply zone.', ref: 'Raja L7 · L106' });

const LOC_WORD: Record<string, string> = {
  inside: '✓ inside a touched higher-timeframe area: tradeable.',
  top: '✓ top tradeable timeframe: no higher area to wait for.',
  below: '✗ a strong untouched higher-timeframe demand still lies below: price likely sells into it first.',
  above: '✗ a strong untouched higher-timeframe supply still lies above: price likely rallies into it first.',
  untouched: '✗ the higher-timeframe area exists but price has not reached it yet.',
  none: '✗ no strong higher-timeframe zone at this zone: no area to trade from.',
  unknown: '✗ not enough higher-timeframe history to locate it.',
};
/** The top-down location of a zone (loc code + loc_text + chain_text from newer scans); null when the file has none. */
export function locTip(loc?: string | null, text?: string | null, chain?: string | null): TipDoc | null {
  if (!loc && !text && !chain) return null;
  return {
    title: chain ? `Chain: ${chain}` : `HTF location${loc ? `: ${loc}` : ''}`,
    body: RULE.location.body,
    lines: [...(loc && LOC_WORD[loc] ? [LOC_WORD[loc]] : []), ...(text ? [`Here: ${text}.`] : []), ...(chain ? ['Read the chain left to right: the higher area first (✓ touched / ✗ not yet), then the entry zone.'] : [])],
    ref: 'owner · L7',
  };
}
export const locOk = (loc?: string | null, ok?: boolean | null) => (ok != null ? ok : loc === 'inside' || loc === 'top');
/** 6M context: a string ("6M: middle · trend UP", "n/a (short history)") or the detail's object. */
export function ctx6Text(c: unknown): string | null {
  if (c == null || c === '') return null;
  if (typeof c === 'string') return c;
  if (typeof c === 'object' && 'text' in (c as object)) return String((c as { text: unknown }).text);
  return null;
}
export const ctx6Tip = (t: string): TipDoc => ({ title: t, body: 'Half-year (6M) context: where price sits against the 6M zones and the 6M trend. Context only, except that a strong 6M demand within reach must be touched before a 3M zone trades.', ref: 'owner' });

// ─── Fundamentals rows ──────────────────────────────────────────────────────────────────────────────────
const FUND: Record<string, string> = {
  'Revenue TTM': 'Revenue of the last four reported quarters (trailing twelve months), with the change against the twelve months before and the period end (year-month).',
  'EPS TTM': 'Earnings per share over the last four quarters, with the change against the year before.',
  'Net margin': 'Net income ÷ revenue, trailing twelve months: how much of each dollar of sales is profit.',
  'OCF / FCF': 'Operating cash flow and free cash flow (operating cash flow − capital spending), trailing twelve months.',
  'Debt / equity': "Total debt ÷ shareholders' equity on the latest balance sheet. Above 2 = heavily borrowed.",
  Shares: 'Shares outstanding and the change over one year (negative = buybacks, positive = dilution).',
  'P/E': 'Last close ÷ EPS TTM. "neg" = losses over the last year.',
  'Market cap': 'Last close × shares outstanding.',
  '52w range': 'Where the close sits in its 52-week low-high range: 0% at the low, 100% at the high.',
  'From ATH': 'How far the close is below its all-time high.',
};
export const fundTip = (k: string, v: string): TipDoc => ({ title: `${k}: ${v}`, body: FUND[k] ?? 'From SEC filings.', lines: ['Context only: never part of a signal.'], ref: 'SEC EDGAR XBRL' });

// ─── Market map ─────────────────────────────────────────────────────────────────────────────────────────
const BUCKET_TEXT: Record<Bucket, string> = {
  in_supply: 'The close is inside a supply zone (proximal ≤ close ≤ distal).',
  near_supply: `The close is at most ${NEAR_PCT}% below a supply's proximal: approaching it from below.`,
  left_supply: 'A supply was touched in the last 3 sessions (high ≥ proximal) and the close is back below it: rejected.',
  middle: 'Not in, approaching or just off a zone on either side.',
  left_demand: 'A demand was touched in the last 3 sessions (low ≤ proximal) and the close is back above it: it bounced.',
  near_demand: `The close is at most ${NEAR_PCT}% above a demand's proximal: approaching it.`,
  in_demand: 'The close is inside a demand zone (distal ≤ close ≤ proximal).',
};
export const bucketTip = (label: string, b: Bucket, n?: number): TipDoc => ({ title: `${label}${n != null ? ` · ${n.toLocaleString()}` : ''}`, body: BUCKET_TEXT[b], lines: ['Each stock lands in one list: in > left > approaching. Fresh or tested zones (≤ 3 touches) on W1 / MN / 3M. Same lists as Telegram.'], ref: 'lists.py' });
export function mapZoneTip(z: { tf: string; type: string; score: number | null; touches: number; side: 'demand' | 'supply' }): TipDoc {
  return { title: `${z.tf} · ${z.type}${z.score != null ? ` · ${z.score}` : ''}`, body: `The ${z.side} this list is about. ${typeTip(z.type).body}`, lines: [tfTip(z.tf).body, ...(z.score != null ? [`${z.score} = its Raja score out of 10 (type + freshness + curve + room).`] : [])] };
}
export const freshTip = (touches: number): TipDoc => touches === 0
  ? { title: 'Fresh', body: 'Untouched since it formed: price has not come back to the proximal. Only a fresh zone can be a BUY (set and forget).', ref: 'Raja L2 · L52' }
  : { title: `${touches}× tested`, body: `Price came back to the proximal ${touches} time${touches > 1 ? 's' : ''}. A 2nd / 3rd touch is WATCH only (confirm one timeframe lower); after the 3rd it leaves the lists.`, ref: 'Raja L52' };
export function whereTip(b: Bucket, pct: number | null | undefined): TipDoc {
  if (b === 'in_demand' || b === 'in_supply') return { title: 'In zone', body: BUCKET_TEXT[b] };
  if (pct == null) return { title: '—', body: 'No zone distance.' };
  const side = b.endsWith('demand') ? 'demand' : 'supply';
  return { title: `${f1(Math.abs(pct))}% ${side === 'demand' ? 'above' : 'below'}`, body: `The close is ${f1(Math.abs(pct))}% ${side === 'demand' ? 'above the demand' : 'below the supply'}'s proximal (% of the close). ${BUCKET_TEXT[b]}` };
}
