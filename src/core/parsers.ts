import type { AccountSnapshot, Deposit, ExitData, OpenPosition, Trade, WorkingOrder } from './types';
import { brokerToLocal, type BrokerClock } from './time';

export interface ParsedReport {
  positions: Trade[];
  openPositions: OpenPosition[];
  workingOrders: WorkingOrder[];
  deposits: Deposit[];
  account: AccountSnapshot;
  accountId: string;
  accountName: string;
  broker: string;
  currency: string | null;
  terminal: 'MT5' | 'MT4';
}

/** MT reports are often UTF-16 with or without a BOM. */
export function decodeReport(buffer: ArrayBuffer): string {
  const b = new Uint8Array(buffer);
  if (b[0] === 0xff && b[1] === 0xfe) return new TextDecoder('utf-16le').decode(buffer);
  if (b[0] === 0xfe && b[1] === 0xff) return new TextDecoder('utf-16be').decode(buffer);
  let zeros = 0;
  for (let i = 1; i < Math.min(400, b.length); i += 2) if (b[i] === 0) zeros++;
  return new TextDecoder(zeros > 50 ? 'utf-16le' : 'utf-8').decode(buffer);
}

const clean = (s: string | null | undefined) => (s ?? '').replace(/ /g, ' ').trim();
const toNum = (s: string) => { const v = parseFloat(s.replace(/[\s,]/g, '')); return isNaN(v) ? 0 : v; };
const numOrNull = (s: string | undefined) => { if (s == null) return null; const v = parseFloat(String(s).replace(/[^0-9.\-]/g, '')); return isNaN(v) ? null : v; };
const side = (s: string): 'buy' | 'sell' => (s.toLowerCase().startsWith('sell') ? 'sell' : 'buy');

export function parseReport(html: string, brokerOffsetHours: BrokerClock, userTz?: string): ParsedReport {
  const isMT5 = /<b>\s*(Positions|Deals|Orders)\s*<\/b>/i.test(html.slice(0, 20000)) || /<b>\s*Positions\s*<\/b>/i.test(html);
  const isMT4 = /Closed Transactions:/i.test(html) || /Ticket.*Open Time.*Type.*Size.*Item/is.test(html.slice(0, 20000));
  return isMT4 && !isMT5 ? parseMT4(html, brokerOffsetHours, userTz) : parseMT5(html, brokerOffsetHours, userTz);
}

export function parseMT5(html: string, off: BrokerClock, userTz?: string): ParsedReport {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let accountId: string | null = null, accountName: string | null = null, broker: string | null = null, currency: string | null = null;
  const ths = Array.from(doc.querySelectorAll('th'));
  ths.forEach((th, i) => {
    const t = clean(th.textContent);
    const next = clean(ths[i + 1]?.textContent);
    if (t === 'Account:' && next) {
      accountId = /^(\d+)/.exec(next)?.[1] ?? null;
      broker = /,\s*([^,]+?)-MT/.exec(next)?.[1]?.trim() ?? broker;
      currency = /\(([A-Z]{3}),/.exec(next)?.[1] ?? currency;
    }
    if (t === 'Name:' && next) accountName = next;
  });
  const conv = (s: string) => brokerToLocal(s, off, userTz);
  const positions: Trade[] = [], openPositions: OpenPosition[] = [], workingOrders: WorkingOrder[] = [], deposits: Deposit[] = [];
  const summary: Record<string, string> = {};
  const SECTIONS = ['Positions', 'Orders', 'Deals', 'Open Positions', 'Working Orders'];
  let section: string | null = null;

  for (const tr of Array.from(doc.querySelectorAll('tr'))) {
    const hb = tr.querySelector('th div b');
    if (hb && tr.querySelectorAll('td').length === 0) {
      const name = clean(hb.textContent);
      if (SECTIONS.includes(name)) { section = name; continue; }
    }
    if (tr.getAttribute('bgcolor') === '#E5F0FC') continue;
    const tds = Array.from(tr.children).filter(c => c.tagName === 'TD') as HTMLElement[];
    const vis = tds.filter(td => !(td.className || '').includes('hidden'));
    const txt = (i: number) => clean(vis[i]?.textContent);
    const num = (i: number) => toNum(txt(i));

    if (/(Balance|Equity|Floating P\/L|Free Margin|Margin Level|Credit Facility):/.test(tr.textContent ?? '') && tds.length) {
      tds.forEach((td, i) => {
        const label = clean(td.textContent).replace(':', '');
        if (/^(Balance|Equity|Floating P\/L|Free Margin|Margin|Margin Level|Credit Facility)$/i.test(label)) {
          for (let j = i + 1; j < tds.length; j++) { const b = tds[j].querySelector('b'); if (b) { summary[label] = clean(b.textContent); break; } }
        }
      });
    }
    const id = txt(1);
    if (section === 'Positions' && vis.length >= 13 && /^\d+$/.test(id)) {
      positions.push({ id, account: accountId ?? 'default', openTime: conv(txt(0)), symbol: txt(2), type: side(txt(3)), volume: num(4), openPrice: num(5), sl: txt(6), tp: txt(7), closeTime: conv(txt(8)), closePrice: num(9), commission: num(10), swap: num(11), profit: num(12) });
    } else if (section === 'Open Positions' && vis.length >= 10 && /^\d+$/.test(id)) {
      openPositions.push({ id, account: accountId ?? 'default', openTime: conv(txt(0)), symbol: txt(2), type: side(txt(3)), volume: num(4), openPrice: num(5), sl: txt(6), tp: txt(7), currentPrice: num(8), swap: num(9), floatingPnL: num(10) });
    } else if (section === 'Working Orders' && vis.length >= 9 && /^\d+$/.test(id)) {
      workingOrders.push({ id, account: accountId ?? 'default', openTime: conv(txt(0)), symbol: txt(2), type: txt(3).toLowerCase(), volume: parseFloat(txt(4).split('/')[0]) || 0, price: num(5), sl: txt(6), tp: txt(7), expiry: txt(8), state: (txt(9) || 'placed').toLowerCase() });
    } else if (section === 'Deals' && vis.length >= 6 && txt(3).toLowerCase() === 'balance') {
      deposits.push({ time: conv(txt(0)), amount: num(vis.length - 3), balance: num(vis.length - 2), comment: txt(vis.length - 1), account: accountId ?? 'default' });
    }
  }
  return {
    positions, openPositions, workingOrders, deposits,
    account: { balance: numOrNull(summary['Balance']), equity: numOrNull(summary['Equity']), floatingPnL: numOrNull(summary['Floating P/L']), freeMargin: numOrNull(summary['Free Margin']), margin: numOrNull(summary['Margin']), marginLevel: summary['Margin Level'] ?? null, credit: numOrNull(summary['Credit Facility']) },
    accountId: accountId ?? 'default', accountName: accountName ?? 'Account', broker: broker ?? 'MT5', currency, terminal: 'MT5',
  };
}

export function parseMT4(html: string, off: BrokerClock, userTz?: string): ParsedReport {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('tr'));
  let accountId: string | null = null, accountName: string | null = null, currency: string | null = null;
  for (const c of Array.from(rows[0]?.querySelectorAll('td') ?? []).map(td => clean(td.textContent))) {
    accountId = /^Account:\s*(\d+)/.exec(c)?.[1] ?? accountId;
    accountName = /^Name:\s*(.+)/.exec(c)?.[1]?.trim() ?? accountName;
    currency = /^Currency:\s*([A-Z]{3})/.exec(c)?.[1] ?? currency;
  }
  const conv = (s: string) => brokerToLocal(s, off, userTz);
  const positions: Trade[] = [], openPositions: OpenPosition[] = [], workingOrders: WorkingOrder[] = [], deposits: Deposit[] = [];
  const summary: Record<string, string> = {};
  let section: string | null = null;
  const ORDER_TYPES = ['buy limit', 'sell limit', 'buy stop', 'sell stop'];

  for (const tr of rows) {
    const cells = Array.from(tr.querySelectorAll('td')).map(td => clean(td.textContent));
    if (!cells.length) continue;
    const rowText = cells.join(' ').toLowerCase();
    if (cells.length <= 2) {
      if (rowText.includes('closed transactions')) { section = 'closed'; continue; }
      if (rowText.includes('open trades')) { section = 'open'; continue; }
      if (rowText.includes('working orders')) { section = 'orders'; continue; }
      if (rowText.includes('summary')) { section = 'summary'; continue; }
    }
    if (section === 'summary') {
      for (let i = 0; i < cells.length - 1; i++) {
        const label = cells[i].replace(':', '').trim();
        if (/^(Balance|Equity|Floating P\/L|Free Margin|Margin|Credit Facility)$/i.test(label) && !isNaN(parseFloat(cells[i + 1]))) summary[label] = cells[i + 1];
      }
      continue;
    }
    if (!/^\d+$/.test(cells[0] ?? '')) continue;
    const num = (i: number) => toNum(cells[i] ?? '');
    const type = (cells[2] ?? '').toLowerCase();
    const acct = accountId ?? 'default';
    if (section === 'closed') {
      if (type === 'balance') { deposits.push({ time: conv(cells[1]), amount: num(cells.length - 1) || num(4), balance: null, comment: cells[3] ?? '', account: acct }); continue; }
      if ((type !== 'buy' && type !== 'sell') || cells[9] === 'cancelled' || !cells[8] || !cells[9]) continue;
      positions.push({ id: cells[0], account: acct, openTime: conv(cells[1]), symbol: cells[4].toUpperCase(), type: side(type), volume: num(3), openPrice: num(5), sl: cells[6] || '0', tp: cells[7] || '0', closeTime: conv(cells[8]), closePrice: num(9), commission: num(10), swap: num(12), profit: num(13) });
    } else if (section === 'open' && (type === 'buy' || type === 'sell')) {
      openPositions.push({ id: cells[0], account: acct, openTime: conv(cells[1]), symbol: cells[4].toUpperCase(), type: side(type), volume: num(3), openPrice: num(5), sl: cells[6] || '0', tp: cells[7] || '0', currentPrice: num(9), swap: num(12), floatingPnL: num(13) });
    } else if (section === 'orders' && ORDER_TYPES.includes(type)) {
      workingOrders.push({ id: cells[0], account: acct, openTime: conv(cells[1]), symbol: cells[4].toUpperCase(), type, volume: num(3), price: num(5), sl: cells[6] || '0', tp: cells[7] || '0', expiry: '', state: 'placed' });
    }
  }
  return {
    positions, openPositions, workingOrders, deposits,
    account: { balance: numOrNull(summary['Balance']), equity: numOrNull(summary['Equity']), floatingPnL: numOrNull(summary['Floating P/L']), freeMargin: numOrNull(summary['Free Margin']), margin: numOrNull(summary['Margin']), marginLevel: null, credit: numOrNull(summary['Credit Facility']) },
    accountId: accountId ?? 'default', accountName: accountName ?? 'Account', broker: 'MT4', currency, terminal: 'MT4',
  };
}

/**
 * CSV from the MQL5 "Advanced Trade History Exporter" script (#72326). Values are in POINTS.
 * Partial fills share a Position ID and are merged: profits summed, MFE/forward max, MAE min.
 */
export function parseExitCSV(text: string): Record<string, ExitData> {
  const out: Record<string, ExitData> = {};
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim());
  if (lines.length < 2) return out;
  const headers = lines[0].split(',').map(h => h.trim());
  const ix = (n: string) => headers.indexOf(n);
  const iPos = ix('Position ID') >= 0 ? ix('Position ID') : ix('Ticket');
  if (iPos < 0) return out;
  const col = { sym: ix('Symbol'), type: ix('Type'), open: ix('Open Time'), close: ix('Close Time'), dur: ix('Duration (Hrs)'), pd: ix('Profit ($)'), pp: ix('Profit (Pts)'), mae: ix('MAE (Pts)'), mfe: ix('MFE (Pts)'), t30m: ix('T+30m (Pts)'), t1h: ix('T+1h (Pts)'), t4h: ix('T+4h (Pts)'), t12h: ix('T+12h (Pts)'), t1d: ix('T+1d (Pts)'), t1w: ix('T+1w (Pts)'), t1wMin: ix('T+1w MIN (Pts)'), isl: ix('Initial SL'), itp: ix('Initial TP'), tmfe: ix('Minutes to MFE'), tmae: ix('Minutes to MAE'), src: ix('Source'),
    entry: ix('Entry'), exit: ix('Exit'), reason: ix('Exit Reason'), closes: ix('Closes'), exits: ix('Exits'), order: ix('Entry Order'), req: ix('Requested'), slip: ix('Slippage (Pts)'), placed: ix('Order Placed'),
    mbm: ix('MAE before MFE (Pts)'), h05: ix('Hit +0.5R'), h1: ix('Hit +1R'), h2: ix('Hit +2R'), h3: ix('Hit +3R'), hm05: ix('Hit -0.5R'), hsl: ix('Hit SL'), be05: ix('BE after +0.5R'), be1: ix('BE after +1R'), half: ix('-0.5R after +1R'),
    after: ix('After Exit'), afterMin: ix('After Exit Min'), max1d: ix('Max After 1d (Pts)'), max1w: ix('Max After 1w (Pts)') };
  const str = (c: string[], i: number) => (i < 0 ? null : (c[i] ?? '').trim() || null);
  const n = (c: string[], i: number) => { if (i < 0) return null; const t = (c[i] ?? '').trim(); if (!t || t.toLowerCase() === 'n/a') return null; const v = parseFloat(t); return isNaN(v) ? null : v; };
  const mx = (a: number | null, b: number | null) => (a == null ? b : b == null ? a : Math.max(a, b));
  const mn = (a: number | null, b: number | null) => (a == null ? b : b == null ? a : Math.min(a, b));
  for (const line of lines.slice(1)) {
    const c = line.split(',').map(s => s.trim());
    if (c.length < headers.length) continue;
    const pos = c[iPos];
    if (!pos) continue;
    const row: ExitData = {
      positionId: pos, fillCount: 1, symbol: c[col.sym] || null, type: c[col.type]?.toLowerCase() || null, openTime: c[col.open] || null, closeTime: c[col.close] || null,
      durationHrs: n(c, col.dur), profitDol: n(c, col.pd), profitPts: n(c, col.pp), mae: n(c, col.mae), mfe: n(c, col.mfe),
      t30m: n(c, col.t30m), t1h: n(c, col.t1h), t4h: n(c, col.t4h), t12h: n(c, col.t12h), t1d: n(c, col.t1d), t1w: n(c, col.t1w), t1wMin: n(c, col.t1wMin),
      initSl: n(c, col.isl), initTp: n(c, col.itp), minToMfe: n(c, col.tmfe), minToMae: n(c, col.tmae), source: col.src >= 0 ? c[col.src] || null : null,
    };
    if (col.reason >= 0) {
      const after = str(c, col.after);
      Object.assign(row, {
        entryPrice: n(c, col.entry), exitPrice: n(c, col.exit), exitReason: str(c, col.reason), closes: n(c, col.closes), exits: str(c, col.exits),
        entryOrder: str(c, col.order), reqPrice: n(c, col.req), slipPts: n(c, col.slip), placedAt: str(c, col.placed), maeBeforeMfe: n(c, col.mbm),
        touch: col.h1 >= 0 ? { p05: n(c, col.h05), p1: n(c, col.h1), p2: n(c, col.h2), p3: n(c, col.h3), m05: n(c, col.hm05), sl: n(c, col.hsl), be05: n(c, col.be05), be1: n(c, col.be1), h05: n(c, col.half) } : null,
        afterExit: after === 'tp' || after === 'sl' || after === 'none' ? after : null, afterExitMin: n(c, col.afterMin), max1d: n(c, col.max1d), max1w: n(c, col.max1w),
      } satisfies Partial<ExitData>);
    }
    const e = out[pos];
    if (!e) { out[pos] = row; continue; }
    e.fillCount = (e.fillCount ?? 1) + 1;
    if (row.profitDol != null) e.profitDol = (e.profitDol ?? 0) + row.profitDol;
    if (row.profitPts != null) e.profitPts = (e.profitPts ?? 0) + row.profitPts;
    e.mfe = mx(e.mfe, row.mfe); e.mae = mn(e.mae, row.mae);
    e.t30m = mx(e.t30m, row.t30m); e.t1h = mx(e.t1h, row.t1h); e.t4h = mx(e.t4h, row.t4h); e.t12h = mx(e.t12h, row.t12h); e.t1d = mx(e.t1d, row.t1d); e.t1w = mx(e.t1w, row.t1w);
    e.t1wMin = mn(e.t1wMin, row.t1wMin); e.durationHrs = mx(e.durationHrs, row.durationHrs);
    if (row.openTime && (!e.openTime || row.openTime < e.openTime)) e.openTime = row.openTime;
    if (row.closeTime && (!e.closeTime || row.closeTime > e.closeTime)) e.closeTime = row.closeTime;
  }
  const ratios: Record<string, number[]> = {};
  for (const e of Object.values(out)) {
    if (e.mfe != null && e.profitPts != null && e.mfe < e.profitPts) { e.suspectMFE = true; e.mfe = e.profitPts; }
    if (e.mae != null && e.profitPts != null && e.mae > Math.min(0, e.profitPts)) { e.suspectMAE = true; e.mae = Math.min(0, e.profitPts); }
    if (e.profitDol != null && e.profitPts && e.symbol) {
      const r = Math.abs(e.profitDol / e.profitPts);
      if (isFinite(r) && r > 0) (ratios[e.symbol] ??= []).push(r);
    }
  }
  for (const e of Object.values(out)) {
    if (e.profitDol != null && e.profitPts) e.dollarPerPt = Math.abs(e.profitDol / e.profitPts);
    else if (e.symbol && ratios[e.symbol]) { const a = ratios[e.symbol].sort((x, y) => x - y); e.dollarPerPt = a[a.length >> 1]; }
    else e.dollarPerPt = null;
  }
  return out;
}
