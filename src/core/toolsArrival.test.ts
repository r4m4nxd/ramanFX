// The owner-approved trend-line + ARRIVAL rules in the downloadable trading tools (public/tools): MT5 ZoneVision 2.13 /
// ZoneBot 1.65 (RFX_ZoneCore.mqh), MT4 ZoneVision 2.00 / ZoneBot 1.63, TradingView ZoneVision Arrival 2.13 and Zone
// Strategy 1.1. MetaTrader and TradingView cannot run here, so:
//  1. the shared code blocks are byte-identical in every file that carries them (scripts/sync-arrival-mql.mjs);
//  2. conformance: tools/telegram_bot/parity/mql_port.py (a mechanical Python port of the MQL engine block, MQL index
//     semantics, out-of-range = error) and pine_port.py (a machine translation of the Pine engine block itself) replay
//     the shared fixture (arrival_fixtures.json), seeded random cases and jittered fixture copies, every number compared
//     with the canonical TypeScript (arrival.ts / zvTrend.ts, incl. Kevin's momentum line);
//  3. static checks of what the compilers would catch first: versions = manifest, ASCII, balanced brackets, presets
//     only name real inputs, the inputs / alerts the rules need are there.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOOLS } from './tools/manifest';
import { jitterCases, randomCases } from '../../scripts/arrival-random';

const T = (f: string) => readFileSync(join('public/tools', f), 'utf8');
const block = (text: string, name: string) => {
  const a = text.indexOf(`// ==== ${name} BEGIN ====`), e = `// ==== ${name} END ====`, b = text.indexOf(e);
  return a < 0 || b < a ? null : text.slice(a, b + e.length);
};
const BLOCKS: [string, string, string[]][] = [
  ['RFX_ARRIVAL_ENGINE', 'RFX_ZoneCore.mqh', ['RamanFX_ZoneVision.mq4', 'RamanFX_ZoneBot.mq4']],
  ['RFX_ARRIVAL_CHART', 'RamanFX_ZoneVision.mq5', ['RamanFX_ZoneVision.mq4']],
  ['RFX_ARRIVAL_BOT', 'RamanFX_ZoneBot.mq5', ['RamanFX_ZoneBot.mq4']],
  ['RFX_ARRIVAL_PINE', 'RamanFX_ZoneVision_Arrival.pine', ['RamanFX_ZoneStrategy.pine']],
];
const MQL = ['RFX_ZoneCore.mqh', 'RamanFX_ZoneVision.mq5', 'RamanFX_ZoneBot.mq5', 'RamanFX_ZoneVision.mq4', 'RamanFX_ZoneBot.mq4'];
const PINE = ['RamanFX_ZoneVision.pine', 'RamanFX_ZoneVision_Direction.pine', 'RamanFX_ZoneVision_Arrival.pine', 'RamanFX_ZoneStrategy.pine'];

describe('tool arrival blocks', () => {
  for (const [name, src, dst] of BLOCKS) it(`${name} is identical in ${dst.join(', ')}`, () => {
    const a = block(T(src), name);
    expect(a, `${src} has no ${name}`).toBeTruthy();
    for (const f of dst) expect(block(T(f), name), `${f}: run node scripts/sync-arrival-mql.mjs`).toBe(a);
  });
});

const py = spawnSync('python3', ['-c', 'print(1)'], { encoding: 'utf8' });
const hasPy = py.status === 0;
function runPort(script: string, args: string[]) {
  const r = spawnSync('python3', [join('tools/telegram_bot/parity', script), ...args, '--json'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  if (r.status !== 0 && !r.stdout) throw new Error(r.stderr);
  return JSON.parse(r.stdout) as { bad: number; errors: string[]; momentum: Record<string, unknown> };
}
const sameNum = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a));
function momentumDiff(cases: { name: string; momentum: Record<string, number> | null }[], got: Record<string, unknown>) {
  return cases.filter(c => {
    const g = got[c.name] as Record<string, number> | null;
    if (!c.momentum || !g) return !!c.momentum !== !!g;
    return Object.keys(c.momentum).some(k => !sameNum(c.momentum![k], g[k]));
  }).map(c => c.name);
}

describe.skipIf(!hasPy)('tool arrival conformance (Python ports of the MQL / Pine engines vs the TS)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rfx-arr-'));
  const rnd = randomCases(140, 20261030), jit = jitterCases(JSON.parse(readFileSync('tools/telegram_bot/parity/arrival_fixtures.json', 'utf8')), 4, 7);
  writeFileSync(join(dir, 'rnd.json'), JSON.stringify(rnd));
  writeFileSync(join(dir, 'jit.json'), JSON.stringify(jit));
  it('the random / jittered cases reach every rule (arrival, strong, weak, realign, HTF-host stop, ceiling / extension, confirmation)', () => {
    const all = [...rnd.cases, ...jit.cases].map(c => c.expected as { arrivals: { strong: boolean }[]; plan: Record<string, unknown> | null; confirm: unknown });
    const n = (f: (e: (typeof all)[number]) => unknown) => all.filter(f).length;
    expect(n(e => e.arrivals.length)).toBeGreaterThan(50);
    expect(n(e => e.arrivals.some(a => a.strong))).toBeGreaterThan(20);
    expect(n(e => (e.plan?.weak as unknown[] | undefined)?.length)).toBeGreaterThan(20);
    expect(n(e => e.plan?.realign)).toBeGreaterThan(5);
    expect(n(e => e.plan?.basis === 'htf')).toBeGreaterThan(5);
    expect(n(e => e.plan?.capped || e.plan?.extended)).toBeGreaterThan(5);
    expect(n(e => e.confirm)).toBeGreaterThan(2);
  });
  for (const [label, script, pre] of [['MQL engine', 'mql_port.py', []], ['Pine engine', 'pine_port.py', ['public/tools/RamanFX_ZoneVision_Arrival.pine']]] as const) {
    it(`${label}: the shared fixture`, () => {
      const r = runPort(script, [...pre, ...(pre.length ? ['tools/telegram_bot/parity/arrival_fixtures.json'] : [])]);
      expect(r.errors).toEqual([]);
      expect(r.bad).toBe(0);
    });
    it(`${label}: ${rnd.cases.length} random + ${jit.cases.length} jittered cases, momentum lines included`, () => {
      for (const [f, set] of [['rnd.json', rnd], ['jit.json', jit]] as const) {
        const r = runPort(script, [...pre, join(dir, f)]);
        expect(r.errors, f).toEqual([]);
        expect(r.bad, f).toBe(0);
        expect(momentumDiff(set.cases as never, r.momentum), f).toEqual([]);
      }
    }, 60000);
  }
});

describe('tool files (static checks; compile in MetaEditor / TradingView)', () => {
  const ver = (id: string) => TOOLS.find(t => t.id === id)!.version;
  it('versions in the files = the manifest', () => {
    const prop = (f: string) => T(f).match(/#property version\s+"([\d.]+)"/)![1];
    expect(prop('RamanFX_ZoneVision.mq5')).toBe(ver('zv5'));
    expect(prop('RamanFX_ZoneBot.mq5')).toBe(ver('bot5'));
    expect(prop('RamanFX_ZoneVision.mq4')).toBe(ver('zv4'));
    expect(prop('RamanFX_ZoneBot.mq4')).toBe(ver('bot4'));
    const title = (f: string) => T(f).match(/indicator\("RamanFX ZoneVision ([\d.]+)/)![1];
    expect(title('RamanFX_ZoneVision.pine')).toBe(ver('zvtv'));
    expect(title('RamanFX_ZoneVision_Direction.pine')).toBe(ver('zvdirtv'));
    expect(title('RamanFX_ZoneVision_Arrival.pine')).toBe(ver('zvarrtv'));
  });
  it('ASCII only, brackets balanced outside strings / comments', () => {
    for (const f of [...MQL, ...PINE]) {
      const t = T(f);
      expect(/[^\x00-\x7F]/.test(t), `${f} has a non-ASCII character`).toBe(false);
      const code = t.replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""').replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const [o, c] of [['(', ')'], ['[', ']'], ['{', '}']]) expect(code.split(o).length, `${f} ${o}${c}`).toBe(code.split(c).length);
    }
  });
  it('the inputs, alerts and hooks of the rules are there (defaults: drawing on, alerts for arrival + confirmation)', () => {
    for (const f of ['RamanFX_ZoneVision.mq5', 'RamanFX_ZoneVision.mq4']) {
      const t = T(f);
      for (const [k, v] of [['InpArrShow', 'true'], ['InpArrShowRemoved', 'true'], ['InpArrShowWeak', 'true'], ['InpArrShowRealign', 'true'], ['InpArrShowPlan', 'true'],
        ['InpArrShowConfirm', 'true'], ['InpArrShowMomentum', 'true'], ['InpArrAlertNew', 'true'], ['InpArrAlertConfirm', 'true'], ['InpArrAlertRealign', 'false'], ['InpTLTwoPivot', 'true']])
        expect(t, `${f} ${k}`).toMatch(new RegExp(`^input bool\\s+${k}\\s*=\\s*${v};`, 'm'));
      expect(t).toMatch(/RxaTick\(false\)/);
    }
    expect(T('RamanFX_ZoneVision.mq5')).toMatch(/ZvTwoPivot = InpTLTwoPivot;/);
    for (const f of ['RamanFX_ZoneBot.mq5', 'RamanFX_ZoneBot.mq4']) {
      const t = T(f);
      for (const k of ['InpArrLimit', 'InpArrRealign', 'InpArrOnly', 'InpArrBlockWeak']) expect(t, `${f} ${k}`).toMatch(new RegExp(`^input bool\\s+${k}\\s*=\\s*false;`, 'm'));
      expect(t).toMatch(/ArrScan\(s, k\);/);
    }
    const a = T('RamanFX_ZoneVision_Arrival.pine');
    for (const c of ['new ARRIVAL zone', 'realignment area entered', 'LTF confirmation']) expect(a).toContain(`"ZoneVision: ${c}"`);
    expect((a.replace(/\/\/[^\n]*/g, '').match(/alertcondition\(/g) ?? []).length).toBe(3);
    expect(a).toMatch(/^\/\/@version=6$/m);
    // HTF data only through the closed-bar pack or [1] offsets; the LTF only through request.security_lower_tf
    for (const f of ['RamanFX_ZoneVision_Arrival.pine', 'RamanFX_ZoneStrategy.pine'])
      for (const m of T(f).matchAll(/request\.security\(([^\n]*)\)/g)) expect(m[1], f).toMatch(/f_apack\(\)|\[time\[1\], open\[1\], high\[1\], low\[1\], close\[1\]\]|\[f_trend\(\)\[1\]/);
    expect(T('RamanFX_ZoneStrategy.pine')).toMatch(/arrMode\s*=\s*input\.string\("Off"/);
  });
  it('the .set presets only name inputs the EA has, and switch the arrival entries on', () => {
    const inputs = (f: string) => new Set([...T(f).matchAll(/^input\s+\S+\s+(\w+)/gm)].map(m => m[1]));
    for (const [set, ea] of [['MT5_ZoneBot_ArrivalLimit.set', 'RamanFX_ZoneBot.mq5'], ['MT5_ZoneBot_ArrivalRealign.set', 'RamanFX_ZoneBot.mq5'],
      ['RamanFX_ZoneBot_ArrivalLimit.set', 'RamanFX_ZoneBot.mq4'], ['RamanFX_ZoneBot_ArrivalRealign.set', 'RamanFX_ZoneBot.mq4']]) {
      const keys = T(set).split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith(';')).map(l => l.split('=')[0]);
      const have = inputs(ea);
      expect(keys.filter(k => !have.has(k)), set).toEqual([]);
      const val = (k: string) => T(set).match(new RegExp(`^${k}=([^|\\r\\n]*)`, 'm'))?.[1];
      expect(val('InpArrOnly'), set).toBe('true');
      expect(val(set.includes('Limit') ? 'InpArrLimit' : 'InpArrRealign'), set).toBe('true');
    }
  });
});
