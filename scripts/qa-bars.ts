// Long-history QA bars for the chart render harness (qa-bars.yml writes them to the `data` branch, qa/bars/<SYM>/<TF>.json;
// tools/fx_scanner/qa_bars.py has the format). BID OHLC from OANDA, labelled in Pepperstone MT5 server time
// ('YYYY-MM-DDTHH:MM', New York + 7 h = GMT+2 / GMT+3), the same ZBar shape as the published shards ({ d, o, h, l, c }).
//
//   git worktree add ../rfx-data origin/data          # once (git -C ../rfx-data pull / checkout origin/data to refresh)
//   import { loadQaBars } from './qa-bars.ts';
//   const w = loadQaBars('XAUUSD', 'W1', { from: '2023-01-01', mt5Labels: true });   // MT5's W1 window since early 2023
//   const h4 = loadQaBars('XAU_USD', 'H4', { last: 250, closedOnly: true });
//
// Root (first that exists): opts.root, $QA_BARS_ROOT, ../rfx-data, ../wt-data (a checkout of the data branch; the
// qa/bars folder inside it is found). With none of them, the file is read straight from git (`git show origin/data:...`).
// mt5Labels: W1 bars are labelled Saturday 00:00 (scanner convention: Friday 17:00 New York); MT5 stamps the same week
// Sunday 00:00 -> +1 day. Every other TF already carries the MT5 bar time.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface QaBar { d: string; o: number; h: number; l: number; c: number }
export type QaTf = 'MN' | 'W1' | 'D1' | 'H4' | 'H1' | 'M15';
export interface QaBarSet {
  sym: string; oanda: string; tf: QaTf; price: 'bid'; clock: string; generated: string;
  /** the last bar of the FILE is the forming candle (dropped when closedOnly) */
  forming: boolean;
  misaligned: number;
  bars: QaBar[];
}
export interface QaOpts {
  root?: string;
  /** first / last bar label to keep (inclusive; a prefix such as '2023-01' works) */
  from?: string; to?: string;
  /** keep only the newest N bars (after from / to) */
  last?: number;
  /** drop the forming candle */
  closedOnly?: boolean;
  /** W1 labels on the MT5 Sunday instead of the scanner's Saturday */
  mt5Labels?: boolean;
  /** git ref for the fallback read (default origin/data) */
  ref?: string;
}

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ALIAS: Record<string, string> = { DJI: 'US30', US30USD: 'US30', NAS100USD: 'NAS100', US100: 'NAS100', NDX: 'NAS100', GOLD: 'XAUUSD', SILVER: 'XAGUSD' };
const TF_ALIAS: Record<string, QaTf> = { M: 'MN', MN: 'MN', MN1: 'MN', W: 'W1', W1: 'W1', D: 'D1', D1: 'D1', H4: 'H4', H1: 'H1', M15: 'M15' };

/** 'XAU_USD' / 'XAU/USD' / 'PEPPERSTONE:XAUUSD' / 'US30_USD' -> the MT5 name used in qa/bars ('XAUUSD', 'US30'). */
export function qaSym(sym: string): string {
  const s = sym.toUpperCase().replace(/^[A-Z]+:/, '').replace(/[_/]/g, '');
  return ALIAS[s] ?? s;
}
export function qaTf(tf: string): QaTf {
  const t = TF_ALIAS[tf.toUpperCase()];
  if (!t) throw new Error(`qa-bars: unknown timeframe ${tf} (MN, W1, D1, H4, H1, M15)`);
  return t;
}

function barsDir(root?: string): string | null {
  for (const r of [root, process.env.QA_BARS_ROOT, join(REPO, '../rfx-data'), join(REPO, '../wt-data')]) {
    if (!r) continue;
    for (const d of [join(r, 'qa/bars'), r]) if (existsSync(join(d, 'index.json'))) return d;
  }
  return null;
}

function readRaw(rel: string, o: QaOpts): string {
  const dir = barsDir(o.root);
  if (dir) return readFileSync(join(dir, rel), 'utf8');
  if (o.root || process.env.QA_BARS_ROOT) throw new Error(`qa-bars: no qa/bars/index.json under ${o.root ?? process.env.QA_BARS_ROOT}`);
  return execFileSync('git', ['-C', REPO, 'show', `${o.ref ?? 'origin/data'}:qa/bars/${rel}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
}

const addDay = (d: string) => { const t = new Date(`${d}:00Z`); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 16); };

/** The QA bar set of sym / tf, oldest first (see the header). Throws when the file is not there. */
export function loadQaBars(sym: string, tf: string, opts: QaOpts = {}): QaBarSet {
  const s = qaSym(sym), t = qaTf(tf);
  const j = JSON.parse(readRaw(`${s}/${t}.json`, opts));
  let bars: QaBar[] = (j.bars as [string, number, number, number, number][]).map(([d, o, h, l, c]) => ({ d, o, h, l, c }));
  if (opts.closedOnly && j.forming) bars = bars.slice(0, -1);
  if (opts.mt5Labels && t === 'W1') bars = bars.map(b => ({ ...b, d: addDay(b.d) }));
  const formingD = j.forming && !opts.closedOnly ? bars[bars.length - 1]?.d : undefined;
  if (opts.from) bars = bars.filter(b => b.d >= opts.from!);
  if (opts.to) bars = bars.filter(b => b.d.slice(0, opts.to!.length) <= opts.to!);
  if (opts.last && opts.last > 0) bars = bars.slice(-opts.last);
  const forming = formingD !== undefined && bars[bars.length - 1]?.d === formingD;
  return { sym: s, oanda: j.oanda, tf: t, price: 'bid', clock: j.clock, generated: j.generated, forming, misaligned: j.misaligned ?? 0, bars };
}

/** qa/bars/index.json: which symbols / TFs exist, with n / first / last. */
export function qaBarsIndex(opts: QaOpts = {}): { generated: string; symbols: Record<string, { oanda: string; tfs: Record<string, { n: number; first: string; last: string; forming: boolean }> }>; errors: string[] } {
  return JSON.parse(readRaw('index.json', opts));
}

// npx tsx scripts/qa-bars.ts [SYM TF]: the index table, or one set's range
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [sym, tf] = process.argv.slice(2);
  if (sym && tf) {
    const b = loadQaBars(sym, tf);
    console.log(`${b.sym} ${b.tf}: ${b.bars.length} bars ${b.bars[0]?.d} -> ${b.bars[b.bars.length - 1]?.d}${b.forming ? ' (last forming)' : ''}`);
  } else {
    const ix = qaBarsIndex();
    console.log(`qa/bars @ ${ix.generated}`);
    for (const [s, e] of Object.entries(ix.symbols))
      console.log(s.padEnd(7), Object.entries(e.tfs).map(([t, x]) => `${t} ${x.n} ${x.first.slice(0, 10)}..${x.last.slice(0, 10)}`).join(' | '));
    if (ix.errors.length) console.log('errors:', ix.errors);
  }
}
