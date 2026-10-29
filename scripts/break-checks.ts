// Geometry / text checks on a rendered bot chart SVG (chart.ts renderSvg) and on bot replies (logic.ts Reply). Shared by
// src/core/botBreak.test.ts and scripts/render-break.ts. Text boxes are approximated (Inter ~0.56 em per character).
import { boxes, SIZE, textW as chartW, type ChartModel } from '../supabase/functions/telegram-bot/chart.ts';
import type { Reply } from '../supabase/functions/telegram-bot/logic.ts';

const num = (s: string, k: string) => { const m = new RegExp(`(?:^|\\s)${k}="([^"]*)"`).exec(s); return m ? Number(m[1]) : NaN; };
export interface TBox { s: string; x0: number; x1: number; y0: number; y1: number; cls: string }
/** Width factor per character for Inter (digits / caps ~0.6, lower case ~0.52, spaces / dots narrower). */
const textW = (s: string, fs: number, _bold: boolean) => chartW(s, fs);
export function texts(svgPart: string): TBox[] {
  const out: TBox[] = [];
  for (const m of svgPart.matchAll(/<text ([^>]*)>(.*?)<\/text>/g)) {
    const a = m[1], s = m[2].replace(/<[^>]+>/g, '').replace(/&[a-z]+;|&#\d+;/g, '&');
    const fs = num(a, 'font-size'), x = num(a, 'x'), y = num(a, 'y'), w = textW(s, fs, /font-weight="600"/.test(a));
    const anchor = /text-anchor="(\w+)"/.exec(a)?.[1] ?? 'start';
    const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
    out.push({ s, x0, x1: x0 + w, y0: y - fs * 0.74, y1: y + fs * 0.2, cls: /class="([^"]*)"/.exec(a)?.[1] ?? '' });
  }
  return out;
}
export interface PanelSvg { tf: string; body: string; plot: { x: number; y: number; w: number; h: number } }
export function panels(svg: string): PanelSvg[] {
  return svg.split('<g class="panel"').slice(1).map(raw => {
    const body = raw.slice(0, raw.lastIndexOf('</g>'));
    const r = /<clipPath id="c\d+"><rect ([^>]*)\/>/.exec(body)![1];
    return { tf: /data-tf="([^"]*)"/.exec(body)![1], body, plot: { x: num(r, 'x'), y: num(r, 'y'), w: num(r, 'width'), h: num(r, 'height') } };
  });
}

/** Problems found in one chart (empty = clean). */
export function chartIssues(model: ChartModel, svg: string): string[] {
  const bad: string[] = [];
  if (/NaN|undefined|Infinity|null/.test(svg)) bad.push('NaN / undefined / Infinity / null in the SVG');
  const bx = boxes(model.layout, model.panels.length, model.verdict ? 104 : 72);
  const ps = panels(svg);
  // every text inside the canvas; panel texts inside their panel box
  for (const t of texts(svg)) if (t.x0 < -1 || t.x1 > SIZE + 1 || t.y0 < -1 || t.y1 > SIZE + 1) bad.push(`text off the image: "${t.s}"`);
  ps.forEach((p, i) => {
    const b = bx[i];
    const ts = texts(p.body);
    for (const t of ts) if (t.x0 < b.x - 1 || t.x1 > b.x + b.w + 1 || t.y0 < b.y - 1 || t.y1 > b.y + b.h + 1) bad.push(`${p.tf}: text outside its panel: "${t.s}" [${t.x0.toFixed(0)}..${t.x1.toFixed(0)}] box [${b.x.toFixed(0)}..${(b.x + b.w).toFixed(0)}]`);
    for (let a = 0; a < ts.length; a++) for (let c = a + 1; c < ts.length; c++) {
      const [u, v] = [ts[a], ts[c]];
      const ox = Math.min(u.x1, v.x1) - Math.max(u.x0, v.x0), oy = Math.min(u.y1, v.y1) - Math.max(u.y0, v.y0);
      if (ox > 3 && oy > 3) bad.push(`${p.tf}: labels overlap "${u.s}" x "${v.s}"`);
    }
    // zones inside the plot
    for (const m of p.body.matchAll(/<rect class="zone[^"]*"([^>]*)\/>/g)) {
      const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(k => num(m[1], k));
      if (x < p.plot.x - 0.5 || x + w > p.plot.x + p.plot.w + 0.5 || y < p.plot.y - 0.5 || y + h > p.plot.y + p.plot.h + 0.5) bad.push(`${p.tf}: zone rect outside the plot`);
    }
    // trendlines are straight on the panel (a straight line in price / time must not bend on the chart)
    for (const m of p.body.matchAll(/<path class="tl ([^"]*)"[^>]* d="([^"]*)"/g)) {
      const pts = [...m[2].matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map(q => [Number(q[1]), Number(q[2])]);
      if (pts.length < 3) continue;
      const [[x0, y0], [x1, y1]] = [pts[0], pts[pts.length - 1]], len = Math.hypot(x1 - x0, y1 - y0) || 1;
      const dev = Math.max(...pts.map(([x, y]) => Math.abs((x1 - x0) * (y0 - y) - (x0 - x) * (y1 - y0)) / len));
      if (dev > 1.5) bad.push(`${p.tf}: trendline (${m[1]}) bends ${dev.toFixed(1)} px`);
    }
    // candles inside the plot, the last one >= 12 px from the price scale
    const cs = [...p.body.matchAll(/<rect class="candle"([^>]*)\/>/g)].map(m => ({ x: num(m[1], 'x'), w: num(m[1], 'width'), y: num(m[1], 'y'), h: num(m[1], 'height') }));
    for (const c of cs) if (c.y < p.plot.y - 1 || c.y + c.h > p.plot.y + p.plot.h + 1) { bad.push(`${p.tf}: candle outside the plot`); break; }
    if (cs.length) { const right = Math.max(...cs.map(c => c.x + c.w)); if (p.plot.x + p.plot.w - right < 12) bad.push(`${p.tf}: last candle ${(p.plot.x + p.plot.w - right).toFixed(1)} px from the price scale`); }
    // the price-axis labels: distinct
    const ax = ts.filter(t => t.cls === 'tick').map(t => t.s);
    if (new Set(ax).size < ax.length) bad.push(`${p.tf}: duplicate axis labels ${ax.join(' | ')}`);
    // dates: a panel spanning two calendar years shows a year somewhere on its time axis
    const pm = model.panels[i];
    if (pm?.bars.length > 1) {
      const y0 = pm.bars[0].t.slice(0, 4), y1 = pm.bars[pm.bars.length - 1].t.slice(0, 4);
      const tl = ts.filter(t => t.cls === 'date').map(t => t.s);
      if (y0 !== y1 && !['MN', '3M', 'H4', 'H1', 'M15'].includes(pm.tf) && !tl.some(s => /\b\d{4}\b|'\d{2}/.test(s))) bad.push(`${p.tf}: spans ${y0}-${y1} but no year on the time axis (${tl.join(' | ')})`);
    }
  });
  return bad;
}

// ---- replies ---------------------------------------------------------------------------------------------------------
const TAGS = new Set(['b', 'strong', 'i', 'em', 'u', 'ins', 's', 'strike', 'del', 'a', 'code', 'pre', 'tg-spoiler', 'blockquote', 'span']);
/** Telegram HTML parse_mode: only its tags, balanced; '&' only as an entity; no stray '<' / '>'. */
export function htmlIssues(s: string): string[] {
  const bad: string[] = [];
  const stack: string[] = [];
  for (const m of s.matchAll(/<(\/?)([a-zA-Z-]+)([^>]*)>|<|>|&(?!(?:lt|gt|amp|quot|#\d+|#x[0-9a-fA-F]+);)/g)) {
    if (m[0] === '<' || m[0] === '>') { bad.push(`stray '${m[0]}' at ${m.index}: …${s.slice(Math.max(0, m.index! - 20), m.index! + 20)}…`); continue; }
    if (m[0] === '&') { bad.push(`bare '&' at ${m.index}: …${s.slice(Math.max(0, m.index! - 20), m.index! + 20)}…`); continue; }
    const [, close, tag] = m;
    if (!TAGS.has(tag.toLowerCase())) { bad.push(`unsupported tag <${tag}>`); continue; }
    if (close) { if (stack.pop() !== tag) bad.push(`unbalanced </${tag}>`); } else stack.push(tag);
  }
  if (stack.length) bad.push(`unclosed <${stack.join('>, <')}>`);
  return bad;
}
export function replyIssues(r: Reply): string[] {
  const bad: string[] = [];
  if (typeof r.text !== 'string' || !r.text.trim()) bad.push('empty text');
  if (/\b(NaN|undefined|Infinity|null)\b|\[object/.test(r.text)) bad.push(`NaN / undefined / null in the text: ${r.text.match(/.{0,30}\b(NaN|undefined|Infinity|null)\b.{0,30}|.{0,20}\[object.{0,20}/)?.[0]}`);
  if (/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(r.text)) bad.push('lone surrogate (half an emoji) in the text');
  if (r.photo ? r.text.length > 1024 : r.text.length > 4096) bad.push(`${r.photo ? 'caption' : 'text'} too long: ${r.text.length}`);
  bad.push(...htmlIssues(r.text));
  for (const row of r.buttons ?? []) if (row.length > 8) bad.push(`button row of ${row.length} (Telegram: 8 max)`);
  for (const row of r.buttons ?? []) for (const b of row) {
    if ('callback_data' in b) {
      const n = new TextEncoder().encode(b.callback_data).length;
      if (n < 1 || n > 64) bad.push(`callback_data ${n} bytes: ${b.callback_data.slice(0, 80)}`);
    } else if (!/^https:\/\//.test(b.url)) bad.push(`button url: ${b.url}`);
    if (!b.text || b.text.length > 64) bad.push(`button text: ${b.text}`);
  }
  if ((r.buttons?.length ?? 0) > 100) bad.push('too many button rows');
  return bad;
}
