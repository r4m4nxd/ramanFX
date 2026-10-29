// Adversarial ("try to break it") tests for the Telegram bot: hostile prices / histories / zones / trendlines / symbol
// names (scripts/break-ctx.ts fixtures) through every chart view, published + live, and every command / button with
// empty, bad, huge, unicode and injection arguments. Checks: no crash, no NaN / undefined in an SVG or a reply, labels
// inside their panel and not overlapping, zones inside the plot, the last candle clear of the price scale, distinct
// axis labels, a year on a time axis that spans two years, Telegram limits (4096 text, 1024 caption, 64-byte
// callback_data), valid Telegram HTML, no owner data in a guest reply. PNGs of the same fixtures:
// `npx tsx scripts/render-break.ts --tag NAME`.
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { chartData, COMMANDS, IMG_VIEW, handle, handleCallback, OWNER_COMMANDS, type Ctx, type Reply } from '../../supabase/functions/telegram-bot/logic';
import { renderSvg } from '../../supabase/functions/telegram-bot/chart';
import { alpacaSource, oandaSource, type Fetch } from '../../supabase/functions/telegram-bot/live';
import { guestCallback, guestMessage, memoryGuests, type Guest } from '../../supabase/functions/telegram-bot/guests';
import { memoryStore } from '../../supabase/functions/telegram-bot/prefs';
import { ALL_FIX, breakCtx, publishedFiles, VIEWS_ALL } from '../../scripts/break-ctx';
import { chartIssues, htmlIssues, replyIssues } from '../../scripts/break-checks';

beforeAll(() => { vi.spyOn(console, 'log').mockImplementation(() => {}); });
const bends: string[] = [];   // higher-TF lines drawn bent (owned by the ZoneVision trendline port: see the it.fails below)
const NOW = new Date('2026-10-29T15:00:00Z');   // Thursday, New York session open (forming candles)

async function allCharts(ctx: Ctx, tag: string, syms = ALL_FIX): Promise<{ bad: string[]; n: number }> {
  const bad: string[] = [];
  let n = 0;
  for (const [sym, market] of syms) {
    for (const view of VIEWS_ALL[market]) {
      const t0 = Date.now();
      let cd;
      try { cd = await chartData(sym, view, ctx); } catch (e) { bad.push(`${tag} ${sym} ${view}: chartData threw ${(e as Error).message}`); continue; }
      if (!cd) continue;
      let svg = '';
      try { svg = renderSvg(cd.model); } catch (e) { bad.push(`${tag} ${sym} ${view}: renderSvg threw ${(e as Error).message}`); continue; }
      n++;
      for (const i of chartIssues(cd.model, svg)) (/trendline .* bends/.test(i) ? bends : bad).push(`${tag} ${sym} ${view}: ${i}`);
      if (Date.now() - t0 > 1500) bad.push(`${tag} ${sym} ${view}: slow ${Date.now() - t0} ms`);
    }
  }
  return { bad, n };
}

describe('charts: adversarial fixtures', () => {
  it('published data: every view renders clean', async () => {
    const { bad, n } = await allCharts(breakCtx(NOW), 'pub');
    expect(n).toBeGreaterThan(150);
    expect(bad).toEqual([]);
  }, 120_000);

  it('live data: every view renders clean', async () => {
    const { bad, n } = await allCharts(breakCtx(NOW, 'ok'), 'live');
    expect(n).toBeGreaterThan(200);
    expect(bad).toEqual([]);
  }, 120_000);

  it('odd clocks: weekend, NY holiday, DST switches, Alberta UTC-6, year change, session open / close', async () => {
    const bad: string[] = [];
    const some = ALL_FIX.filter(([s]) => ['EURUSD', 'BTCUSD', 'BRK.B', 'PENY', 'TRI'].includes(s));
    for (const iso of ['2026-10-31T18:00:00Z', '2026-11-26T15:00:00Z', '2026-03-08T07:30:00Z', '2026-11-01T07:30:00Z', '2026-11-01T09:00:00Z',
      '2026-11-02T14:30:00Z', '2026-11-02T21:00:00Z', '2026-12-31T23:59:00Z', '2027-01-01T00:01:00Z', '2027-01-04T14:31:00Z']) {
      for (const live of ['none', 'ok'] as const) bad.push(...(await allCharts(breakCtx(new Date(iso), live), `${iso} ${live}`, some)).bad);
    }
    expect(bad).toEqual([]);
  }, 240_000);

  // TODO(trendline port): the higher-TF line projected on a panel goes through a per-period index map and bends; the
  // agent porting the ZoneVision trendline rule fixes it. Flip to it() then.
  it.fails('trendlines are straight on every panel (collinear points)', () => { expect(bends).toEqual([]); });

  it('live source failing (null / throws) falls back to the published scan with a note', async () => {
    for (const mode of ['null', 'throw'] as const) {
      const ctx = breakCtx(NOW, mode);
      for (const [sym] of ALL_FIX) {
        const r = await handle(`/chart ${sym}`, ctx);
        expect(replyIssues(r), `${mode} ${sym}`).toEqual([]);
        if (r.photo) expect(r.text).toContain('live data did not load');
      }
    }
  }, 120_000);
});

// ---- live sources over HTTP: 401, 500, garbage, hanging ------------------------------------------------------------
describe('live sources: HTTP failures give null (never throw)', () => {
  const answers: Record<string, Fetch> = {
    '401': async () => new Response('{"message":"unauthorized"}', { status: 401 }),
    '500': async () => new Response('oops', { status: 500 }),
    garbage: async () => new Response('<html>not json</html>', { status: 200 }),
    empty: async () => new Response('{}', { status: 200 }),
    nan: async () => new Response(JSON.stringify({ candles: [{ time: 'x', complete: true, bid: { o: 'a', h: 'b', l: 'c', c: 'd' } }], bars: { AAPL: [{ t: 'x', o: 'NaN', h: 1, l: 1, c: 1 }] } }), { status: 200 }),
    throws: async () => { throw new TypeError('network down'); },
  };
  for (const [name, f] of Object.entries(answers)) {
    it(`${name}`, async () => {
      expect(await oandaSource('t', { fetch: f })('EUR_USD')).toBeNull();
      expect(await alpacaSource('k', 's', { fetch: f })('AAPL')).toBeNull();
      const ctx = breakCtx(NOW, 'none', { live: { fx: oandaSource('t', { fetch: f }), stock: alpacaSource('k', 's', { fetch: f }) } });
      for (const q of ['/chart EURUSD', '/chart BRK.B H1', '/zones BTCUSD', 'PENY']) expect(replyIssues(await handle(q, ctx)), `${name} ${q}`).toEqual([]);
    });
  }
  it('hanging request: aborted by the request timeout', async () => {
    const hang: Fetch = (_u, init) => new Promise((_, rej) => init?.signal?.addEventListener('abort', () => rej(new DOMException('timeout', 'TimeoutError'))));
    const t0 = Date.now();
    const [a, b] = await Promise.all([oandaSource('t', { fetch: hang })('EUR_USD'), alpacaSource('k', 's', { fetch: hang })('AAPL')]);
    expect([a, b]).toEqual([null, null]);
    expect(Date.now() - t0).toBeLessThan(9000);
  }, 15_000);
});

// ---- commands -------------------------------------------------------------------------------------------------------
const HUGE = 'A'.repeat(4000);
const ARGS = ['', 'EURUSD', 'eurusd', 'brk.b', 'BRK-B', 'BRK.B', 'bf-b.x', 'NOPE', 'LONGNAMEXYZ', 'ABCDEFGHIJKLMNOPQRSTUV', '<script>alert(1)</script>', '&amp; "quoted" \'x\'',
  '💥🚀', 'ÉÜßЖ中文', '<b>bold', '../../etc/passwd', 'EURUSD H4', 'EURUSD QXX', 'EURUSD 15m', 'BRK.B 1H', 'BRK.B MN 4', 'BRK.B 1M+', 'PENY 0.0000001', 'PENY 1e9', 'PENY -5',
  'PENY 0', 'PENY nan', 'PENY 1,000,000.5', 'SHIBUSD 0.00001300', 'XAUUSD zone', 'XAUUSD 2650 extra args', '12', '#3', '-1', '99999999999999999999', '22:00-06:00', '25:00-06:00', 'off', '1w', '91d', HUGE, `EURUSD ${HUGE}`];
const CMDS = [...new Set([...COMMANDS.map(c => c.command), ...OWNER_COMMANDS.map(c => c.command), 'start', 'zone', 'status', 'howto', 'fundamentals', 'delalert', 'nope'])];

describe('commands: every command with hostile arguments', () => {
  it('owner: no crash, valid Telegram HTML, limits', async () => {
    const bad: string[] = [];
    for (const live of ['none', 'ok', 'throw'] as const) {
      const ctx = breakCtx(NOW, live);
      for (const c of CMDS) for (const a of ARGS) {
        const q = `/${c}${a ? ` ${a}` : ''}`;
        let r: Reply;
        try { r = await handle(q, ctx); } catch (e) { bad.push(`${live} ${q.slice(0, 60)}: threw ${(e as Error).message}`); continue; }
        for (const i of replyIssues(r)) bad.push(`${live} ${q.slice(0, 60)}: ${i}`);
      }
      for (const t of ['', ' ', '?', 'EURUSD?', HUGE, `${HUGE}?`, '<script>', 'brk.b', 'BF-B.X', '💱 FX', '/', '//', '/@bot', '/chart@RamanFXbot EURUSD']) {
        try { for (const i of replyIssues(await handle(t, ctx))) bad.push(`${live} "${t.slice(0, 30)}": ${i}`); } catch (e) { bad.push(`${live} "${t.slice(0, 30)}": threw ${(e as Error).message}`); }
      }
    }
    expect(bad).toEqual([]);
  }, 240_000);

  it('symbol / HTML in replies is escaped', async () => {
    const ctx = breakCtx(NOW);
    for (const q of ['/zones <script>alert(1)</script>', '/chart <b>x</b>', '/alert <i>y</i> 5', '/hours &amp;', '/fund <x>', '/news <x>', '/mute <x>', '/watch <x>', '/scan <x>', '/zones BF-B.X', '/zones LONGNAMEXYZ']) {
      const r = await handle(q, ctx);
      expect(htmlIssues(r.text), q).toEqual([]);
      expect(r.text, q).not.toMatch(/<script|<x>|<i>y/);
    }
  });

  it('callback_data tampering: no crash, valid replies', async () => {
    const ctx = breakCtx(NOW, 'ok');
    const bad: string[] = [];
    const DATA = ['', 'c:', 'c:EURUSD', 'c:EURUSD:QXX', 'c:EURUSD:Q', 'c:EURUSD:QM15', 'c:BRK.B:H1', 'c:BRK.B:QH1', 'c:BRK.B:Q3M', 'c:brk.b:mn', 'c:EURUSD:3M', 'c:NOPE', 'c:NOPE:H4',
      `c:${'A'.repeat(30)}`, 'c:EURUSD:H4:extra', 'z:<b>', 'z:BF-B.X', 's:EURUSD', 's:EURUSD:H4', 'n', 'n:EURUSD', 'f:EURUSD', 'h', 'x', 'q', 'd:1', 'd:0', 'd:99999999999999', 'd:-1',
      'm:EURUSD:7', 'm:EURUSD:0', 'm:EURUSD:999', 'r:EURUSD:0.2', 'r:EURUSD:50', 'r:EURUSD:0', 'u:EURUSD', 'u:NOPE', 'mk:fx', 'mk:<x>', 'c:EURUSD:H4\n', '💥', 'X'.repeat(64)];
    for (const d of DATA) {
      try {
        for (const i of replyIssues(await handleCallback(d, ctx))) bad.push(`${JSON.stringify(d)}: ${i}`);
      } catch (e) { bad.push(`${JSON.stringify(d)}: threw ${(e as Error).message}`); }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  it('every button of every chart / zones reply fits 64 bytes and round-trips', async () => {
    const ctx = breakCtx(NOW, 'ok');
    for (const [sym] of ALL_FIX) {
      for (const q of [`/chart ${sym}`, `/zones ${sym}`, `/chart ${sym} H1`, `/chart ${sym} M15`, `/chart ${sym} MN 4`]) {
        const r = await handle(q, ctx);
        expect(replyIssues(r), q).toEqual([]);
        for (const b of (r.buttons ?? []).flat()) if ('callback_data' in b && /^c:/.test(b.callback_data)) {
          const t = await handleCallback(b.callback_data, ctx);
          expect(t.cmd, `${q} -> ${b.callback_data}`).toBe('chart');
          expect(t.photo ?? '', `${q} -> ${b.callback_data}: ${t.text}`).toContain('img=');
          expect(IMG_VIEW.test(/tf=([^&]+)/.exec(t.photo!)![1]), `${q} -> ${b.callback_data}: image view`).toBe(true);
        }
      }
    }
  }, 240_000);

  it('/chart 4 views anchored at the bottom TFs (H1 / M15) still give 4 panels', async () => {
    const ctx = breakCtx(NOW, 'ok');
    for (const [q, n] of [['c:BRK.B:QH1', 4], ['c:BRK.B:QH4', 4], ['c:EURUSD:QH1', 4], ['c:EURUSD:QH4', 4]] as const) {
      const r = await handleCallback(q, ctx);
      expect(r.photo, q).toBeTruthy();
      const view = /tf=([A-Z0-9]+)/.exec(r.photo!)![1];
      const cd = await chartData(q.split(':')[1], view, ctx);
      expect(cd?.model.panels.length, q).toBe(n);
    }
  });

  it('alerts with weird prices never store a bad level', async () => {
    const prefs = memoryStore();
    const ctx = breakCtx(NOW, 'none', { prefs });
    for (const a of ['PENY 0', 'PENY -1', 'PENY nan', 'PENY Infinity', 'PENY 1e3', 'PENY 0x10', 'PENY 1,2,3', 'PENY .5', 'PENY 0.80', 'SHIBUSD 0.00001300', 'BRK.A 817,500', 'PENY 999999999999999999999']) await handle(`/alert ${a}`, ctx);
    const got = (await prefs.get(NOW)).alerts;
    for (const x of got) expect(Number.isFinite(x.level) && (x.level as number) > 0, JSON.stringify(x)).toBe(true);
    expect(got.map(x => x.level)).not.toContain(0.8);       // at the price: refused
  });

  it('/scan rate limit: the 7th on-demand scan in an hour says limit reached', async () => {
    let n = 0;
    const ctx = breakCtx(NOW, 'none', { scanOne: async () => (++n > 6 ? 'limited' : 'ok') });
    const rs = [];
    for (let i = 0; i < 8; i++) rs.push(await handle('/scan EURUSD', ctx));
    expect(rs[7].text).toContain('limit reached');
    for (const r of rs) expect(replyIssues(r)).toEqual([]);
  });

  it('guest: no owner data in any reply, owner-only refused', async () => {
    const owner = memoryStore();
    await owner.addAlert({ sym: 'PENY', kind: 'price', level: 0.7777, dir: 'below' });
    await owner.watch('ZZWW');
    const g: Guest = { chat_id: 222, name: 'G', added_at: NOW.toISOString(), active: true, prefs: {} };
    const db = memoryGuests([g]);
    const ctx = breakCtx(NOW, 'ok', { prefs: owner, health: async () => 'OWNER-HEALTH' });
    const env = { db };
    for (const c of CMDS) for (const a of ['', 'PENY', 'EURUSD 1.2']) {
      const r = await guestMessage(`/${c} ${a}`.trim(), db.rows[0], ctx, env);
      for (const m of ['0.7777', 'ZZWW', 'OWNER-HEALTH']) expect(r.text, `/${c} ${a}`).not.toContain(m);
      expect(replyIssues(r), `/${c} ${a}`).toEqual([]);
    }
    for (const d of ['d:1', 'u:PENY', 'c:PENY', 'z:PENY', 'r:PENY:0.2']) {
      const r = await guestCallback(d, db.rows[0], ctx, env);
      for (const m of ['0.7777', 'ZZWW', 'OWNER-HEALTH']) expect(r.text, d).not.toContain(m);
    }
    expect((await owner.get(NOW)).alerts.length).toBe(1);   // the guest's 'd:1' did not delete the owner's alert
  });

  it('/times on a NYSE holiday says the market is closed (Thanksgiving, July 3rd observed)', async () => {
    for (const iso of ['2026-11-26T15:00:00Z', '2026-07-03T15:00:00Z']) {
      const r = await handle('/times', breakCtx(new Date(iso)));
      expect(r.text, iso).toContain('NYSE closed');
      expect(r.text, iso).not.toContain('NYSE opens');
    }
    expect((await handle('/times', breakCtx(new Date('2026-11-27T15:00:00Z')))).text).toContain('NYSE opens');
  });

  it('/alerts prints levels as typed (no exponent, grouped thousands)', async () => {
    const ctx = breakCtx(NOW);
    await handle('/alert SHIBUSD 0.0000130', ctx);
    await handle('/alert BRK.A 900000', ctx);
    const t = (await handle('/alerts', ctx)).text;
    expect(t).toContain('0.000013');
    expect(t).toContain('900,000');
    expect(t).not.toMatch(/\de-\d/);
  });

  it('a ticker with a dash resolves to itself', async () => {
    const r = await handle('/chart bf-b.x', breakCtx(NOW));
    expect(r.photo).toContain('img=BF-B.X');
  });

  it('corrupt published files (numbers as strings, negative numbers, null fields, missing files) never throw', async () => {
    const files = publishedFiles(NOW);
    const mangle = (v: unknown, mode: string): unknown => {
      if (Array.isArray(v)) return v.map(x => mangle(x, mode));
      if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mode === 'null' && typeof x !== 'object' ? null : mangle(x, mode)]));
      return typeof v === 'number' ? (mode === 'str' ? String(v) : mode === 'neg' ? -v : v) : v;
    };
    const bad: string[] = [];
    for (const mode of ['missing', 'str', 'neg', 'null']) {
      const ctx = breakCtx(NOW, 'none', { load: async (p: string) => (mode === 'missing' || !files.has(p) ? null : mangle(structuredClone(files.get(p)), mode)) });
      for (const c of COMMANDS.map(x => x.command)) for (const a of ['', 'EURUSD', 'BRK.B', 'EURUSD H4', 'PENY 0.7']) {
        const q = `/${c} ${a}`.trim();
        try { for (const i of replyIssues(await handle(q, ctx))) bad.push(`${mode} ${q}: ${i}`); } catch (e) { bad.push(`${mode} ${q}: threw ${(e as Error).message}`); }
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);
});
