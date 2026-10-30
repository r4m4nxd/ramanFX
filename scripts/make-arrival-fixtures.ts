// Writes tools/telegram_bot/parity/arrival_fixtures.json: the shared parity fixture of the ARRIVAL rules
// (supabase/functions/telegram-bot/arrival.ts, the canonical TS implementation) for the Python alert side.
//   npx tsx scripts/make-arrival-fixtures.ts           # rewrite
//   npx tsx scripts/make-arrival-fixtures.ts --check   # exit 1 when the file is out of date
// Cases: the hand-built scenarios of scripts/arrival-scenarios.ts (one per approved rule) + real published bars
// (public/fx/d/*.json, public/scanner/t/*.json) where the rules fire. Each case: inputs (market, tf, htf, ltf, price,
// CLOSED bars oldest first as [time, o, h, l, c]) and the expected outputs (zvLines with FitAnchor + arrivalTf).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { arrivalTf, CONFIRM_TF, HIGHER_TF, type ArrivalTf } from '../supabase/functions/telegram-bot/arrival.ts';
import { closedHtf, FX_PARAMS, RAJA, Series, type ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';
import { zvLines } from '../supabase/functions/telegram-bot/zvTrend.ts';
import { packedBars } from '../supabase/functions/telegram-bot/logic.ts';
import { SCEN } from './arrival-scenarios.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'tools/telegram_bot/parity/arrival_fixtures.json');

type Row = [string, number, number, number, number];
const rows = (b: ZBar[]): Row[] => b.map(x => [x.d, x.o, x.h, x.l, x.c]);
const lineOut = (bars: ZBar[], price: number, tf: string) => {
  const r = zvLines(new Series(bars, price, tf));
  const o = (t: typeof r.up) => (t ? { a: t.a, b: t.b, pa: t.pa, pb: t.pb } : null);
  return { up: o(r.up), dn: o(r.dn), why: r.why };
};
const expected = (a: ArrivalTf) => ({
  arrivals: a.arrivals, current: a.current ? a.arrivals.indexOf(a.current) : -1, plan: a.plan, confirm: a.confirm, pending: a.pending,
});

interface Case { name: string; about: string; market: 'fx' | 'stock'; tf: string; htf: string | null; ltf: string | null; price: number; bars: Record<string, Row[]>; expected: unknown }
const cases: Case[] = [];
function add(name: string, about: string, market: 'fx' | 'stock', tf: string, price: number, bars: ZBar[], htf: string | null, hb: ZBar[] | null, ltf: string | null, lb: ZBar[] | null) {
  const p = market === 'fx' ? FX_PARAMS : RAJA;
  const a = arrivalTf(bars, tf, price, p, hb, lb, htf, ltf);
  const b: Record<string, Row[]> = { [tf]: rows(bars) };
  if (htf && hb) b[htf] = rows(hb);
  if (ltf && lb) b[ltf] = rows(lb);
  cases.push({ name, about, market, tf, htf: htf && hb ? htf : null, ltf: ltf && lb ? ltf : null, price, bars: b,
    expected: { lines: lineOut(bars, bars[bars.length - 1].c, tf), ...expected(a) } });
  return a;
}

for (const [name, s] of Object.entries(SCEN)) add(name, s.about, s.market, s.tf, s.price, s.bars, s.htfTf ?? null, s.htf ?? null, s.ltfTf ?? null, s.ltf ?? null);

// ---- real published bars ----------------------------------------------------------------------------------------
const toZ = (v: unknown): ZBar[] => (Array.isArray(v) ? v : []).filter(r => Array.isArray(r) && r.length >= 5).map(r => ({ d: String(r[0]), o: +r[1], h: +r[2], l: +r[3], c: +r[4] }));
const real: { name: string; about: string; market: 'fx' | 'stock'; tf: string; price: number; get: (t: string) => ZBar[] }[] = [];
for (const f of readdirSync(join(ROOT, 'public/fx/d')).sort()) {
  const ins = JSON.parse(readFileSync(join(ROOT, 'public/fx/d', f), 'utf8')).instruments ?? {};
  for (const sym of Object.keys(ins).sort()) {
    const d = ins[sym], price = Number(d.price);
    if (!(price > 0)) continue;
    for (const tf of ['H1', 'H4', 'D1', 'W1']) real.push({ name: `${sym}_${tf}`, about: `published ${sym} ${tf} bars`, market: 'fx', tf, price, get: t => toZ(d.bars?.[t]) });
  }
}
for (const f of readdirSync(join(ROOT, 'public/scanner/t')).sort().slice(0, 40)) {
  const tk = JSON.parse(readFileSync(join(ROOT, 'public/scanner/t', f), 'utf8')).tickers ?? {};
  for (const sym of Object.keys(tk).sort()) {
    const d = tk[sym], price = Number(d.price), daily = packedBars(d.bars).map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c }));
    if (!(price > 0) || daily.length < 60) continue;
    const hb = (t: string) => { const r = packedBars(d.hb?.[t]).map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c })); return r.length ? r : closedHtf(daily, t as 'W1'); };
    real.push({ name: `${sym}_W1`, about: `published ${sym} W1 (stock zones >= W1; H4 confirmation not in the shard)`, market: 'stock', tf: 'W1', price, get: t => (t === 'D1' ? daily : hb(t)) });
  }
}
const want = { arrival: 6, plan: 4, none: 2 };
let nA = 0, nP = 0, nN = 0;
for (const r of real) {
  const bars = r.get(r.tf);
  if (bars.length < 40) continue;
  const htf = HIGHER_TF[r.tf] ?? null, ltf = CONFIRM_TF[r.tf] ?? null;
  const hb = htf ? r.get(htf) : null, lb = ltf ? r.get(ltf) : null;
  const a = arrivalTf(bars, r.tf, r.price, r.market === 'fx' ? FX_PARAMS : RAJA, hb?.length ? hb : null, lb?.length ? lb : null, htf, ltf);
  const take = a.plan && (a.plan.realign || a.plan.capped || a.confirm) ? nP++ < want.plan : a.arrivals.length ? nA++ < want.arrival : nN++ < want.none;
  if (take) add(r.name, r.about, r.market, r.tf, r.price, bars, htf, hb?.length ? hb : null, ltf, lb?.length ? lb : null);
}

const header = (f: string) => readFileSync(join(ROOT, f), 'utf8').split('\n').filter(l => l.startsWith('//')).map(l => l.slice(3));
const src = readFileSync(join(ROOT, 'supabase/functions/telegram-bot/zvTrend.ts'), 'utf8');
const fit = src.slice(src.indexOf('/** MQL FitAnchor'), src.indexOf('/** The chart\'s two lines'));
const doc = {
  rules: { arrival_ts_header: header('supabase/functions/telegram-bot/arrival.ts').slice(0, 80), zvTrend_header: header('supabase/functions/telegram-bot/zvTrend.ts').slice(0, 24), fitAnchor_ts: fit,
    maps: { HIGHER_TF, CONFIRM_TF } },
  note: 'generated by scripts/make-arrival-fixtures.ts from supabase/functions/telegram-bot/arrival.ts (canonical). '
    + 'Rules: see the header of arrival.ts (A: zvTrend.zvLines with FitAnchor; B: arrival zones; C: weak / realignment / LTF confirmation). '
    + 'Bars = CLOSED bars, oldest first, [time, o, h, l, c]; shifts: 1 = newest closed bar (bars[-1]), larger = older; price = the live price '
    + '(arrivalTf: the HTF lines use it as the phantom bar; the TF itself uses its newest close). params: fx = FX_PARAMS (base_strict, emo_touch), stock = RAJA. '
    + 'expected.lines = zvLines on the TF bars (phantom = newest close): shifts a (older anchor, after FitAnchor) / b, prices pa / pb. '
    + 'expected.arrivals = every arrival, newest first (zone.legBar ascending); current = index into it (-1 none); plan / confirm / pending as arrivalTf. '
    + 'Compare numbers with |x - y| <= 1e-9 * max(1, |x|).',
  cases,
};
const text = `${JSON.stringify(doc)}\n`;
if (process.argv.includes('--check')) {
  let cur = '';
  try { cur = readFileSync(OUT, 'utf8'); } catch { /* missing */ }
  if (cur !== text) { console.error('arrival_fixtures.json is out of date: npx tsx scripts/make-arrival-fixtures.ts'); process.exit(1); }
  console.log('arrival_fixtures.json up to date');
} else {
  writeFileSync(OUT, text);
  console.log(`wrote ${OUT}: ${cases.length} cases (${cases.map(c => c.name).join(', ')}), ${(text.length / 1024).toFixed(0)} KB`);
}
