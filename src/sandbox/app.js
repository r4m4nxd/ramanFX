// The sandbox page's own script (moved out of index.html: the app's CSP blocks inline scripts, 2026-11-12).
// The exercise data arrives as JSON in <script type="application/json" id="sandbox-data"> (data, not code).
(function () {
  var d = document.getElementById('sandbox-data');
  if (d && !window.__SANDBOX_DATA__) window.__SANDBOX_DATA__ = JSON.parse(d.textContent);
})();

(() => {
'use strict';
// ─────────── utilities ───────────
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
};
const icons = () => { try { window.lucide && window.lucide.createIcons(); } catch { /* icons are decoration */ } };
// phone / narrow-frame layout (same breakpoint as the CSS)
const compactMq = matchMedia('(max-width: 899px) and (min-height: 481px), (max-width: 639px)');
const compact = () => compactMq.matches;
// filters live in a bottom sheet on phones in either orientation
const filterSheetMq = matchMedia('(max-width: 899px) and (min-height: 481px), (max-width: 639px), (max-height: 480px) and (min-width: 640px) and (max-width: 1099px)');
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const FILES = ['charts_p001.json', 'charts_p081.json', 'charts_p161.json', 'charts_p241.json', 'charts_p321.json', 'charts_p401.json'];
const BASE = '/sandbox/';
const K_ATT = 'rfx_sandbox_attempts', K_BEST = 'rfx_sandbox_match_best', K_PREF = 'rfx_sandbox_prefs';
const MENTOR = { seiden: 'Sam Seiden', kevin: 'Kevin', raja: 'Raja', baker: 'Kevin Baker' };
const PATTERN_LABEL = { DBR: 'Drop-Base-Rally', RBR: 'Rally-Base-Rally', RBD: 'Rally-Base-Drop', DBD: 'Drop-Base-Drop', 'novice-gap': 'Novice gap', 'pro-gap': 'Pro gap', 'bull-trap': 'Bull trap', 'bear-trap': 'Bear trap', 'breakout-retest': 'Breakout & retest', 'failed-level': 'Failed level', 'stacked-levels': 'Stacked levels', other: 'Other' };
const COLORS = ['#38bdf8', '#f59e0b', '#22c55e', '#ef4444', '#c084fc', '#e6edf7'];
const EMOS = [['calm', 'Calm', 'leaf'], ['fomo', 'FOMO', 'zap'], ['fear', 'Fear', 'shield-alert'], ['greed', 'Greed', 'gem'], ['revenge', 'Revenge', 'flame'], ['unsure', 'Unsure', 'circle-help']];
const FIB = [0, 0.382, 0.5, 0.618, 1];

const valid = x => x && typeof x.id === 'string' && typeof x.src === 'string' && Array.isArray(x.path) && x.path.length >= 2 && x.truth && typeof x.maskX === 'number' && x.plot;

// ─────────── state ───────────
let EX = [];
const S = {
  tab: 'blind', list: [], ex: null, tool: 'hline', color: COLORS[0],
  shapes: [], undo: [], draft: null, drag: null, hover: null, drawings: new Map(),
  trade: { side: null, entry: null, sl: null, tp: null }, pick: null,
  revealed: false, revealP: 0, res: null, mres: null, attemptId: null, emos: new Set(),
};
const W = () => stage.clientWidth, H = () => stage.clientHeight;
const stage = $('#stage'), img = $('#chartImg'), cv = $('#cv'), ctx = cv.getContext('2d'), mask = $('#mask');

// ─────────── price <-> y (image fractions, 0 = top) ───────────
const hasAxis = ex => !!(ex && ex.axis && ex.axis.y1 !== ex.axis.y2);
const priceAt = (ex, y) => { const a = ex.axis; return a.p1 + (y - a.y1) * (a.p2 - a.p1) / (a.y2 - a.y1); };
const yAtPrice = (ex, p) => { const a = ex.axis; return a.y1 + (p - a.p1) * (a.y2 - a.y1) / (a.p2 - a.p1); };
const decimals = ex => { if (!hasAxis(ex)) return 1; const d = Math.abs(ex.axis.p1 - ex.axis.p2) || 1; return clamp(Math.ceil(-Math.log10(d / 300)), 0, 5); };
const pctAt = (ex, y) => (ex.plot.y1 - y) / ((ex.plot.y1 - ex.plot.y0) || 1) * 100;
const yAtPct = (ex, p) => ex.plot.y1 - p / 100 * (ex.plot.y1 - ex.plot.y0);
const fmtY = (ex, y) => y == null ? '' : hasAxis(ex) ? priceAt(ex, y).toFixed(decimals(ex)) : pctAt(ex, y).toFixed(1) + '%';
const fmtVal = (ex, y) => y == null ? '' : hasAxis(ex) ? priceAt(ex, y).toFixed(decimals(ex)) : pctAt(ex, y).toFixed(1);
const parseVal = (ex, v) => { const n = parseFloat(String(v).replace(',', '.').replace('%', '')); if (!isFinite(n)) return null; return hasAxis(ex) ? yAtPrice(ex, n) : yAtPct(ex, n); };
const dist = (ex, ya, yb) => hasAxis(ex) ? Math.abs(priceAt(ex, ya) - priceAt(ex, yb)).toFixed(decimals(ex)) : (Math.abs(pctAt(ex, ya) - pctAt(ex, yb))).toFixed(1) + '%';

// ─────────── trade evaluation against the hidden path ───────────
// path[] = y fractions of price from the "now" line to the end of the chart; straight segments between them.
function evaluate(ex, side, E, SL, TP) {
  if (!side || side === 'none') return { kind: 'none' };
  if (E == null || SL == null || TP == null) return { kind: 'invalid', why: 'Set entry, stop and target.' };
  const P = ex.path.map(y => -y), e = -E, s = -SL, t = -TP, dir = side === 'buy' ? 1 : -1;
  if (dir * (t - e) <= 0 || dir * (e - s) <= 0) return { kind: 'invalid', why: side === 'buy' ? 'For a BUY the stop must be below the entry and the target above it.' : 'For a SELL the stop must be above the entry and the target below it.' };
  // TOL: a touch within ~1.2% of chart height counts (the path is hand-digitised from the image).
  const risk = Math.abs(e - s), rr = Math.abs(t - e) / risk, TOL = 0.012;
  const sT = s + dir * TOL, tT = t - dir * TOL;
  let filled = Math.abs(P[0] - e) <= TOL, fillAt = filled ? 0 : null, type = filled ? 'market' : (dir * (e - P[0]) < 0 ? 'limit' : 'stop');
  for (let i = 0; i < P.length - 1; i++) {
    const A = P[i], B = P[i + 1], mn = Math.min(A, B), mx = Math.max(A, B); let a = A;
    const at = lvl => i + (B === A ? 0 : clamp((lvl - A) / (B - A), 0, 1));
    if (!filled) { if (e >= mn - TOL && e <= mx + TOL) { filled = true; a = clamp(e, mn, mx); fillAt = at(a); } else continue; }
    const lo = Math.min(a, B), hi = Math.max(a, B);
    const hs = sT >= lo && sT <= hi, ht = tT >= lo && tT <= hi;
    if (hs && ht) { return Math.abs(sT - a) <= Math.abs(tT - a) ? { kind: 'loss', R: -1, rr, type, fillAt, at: at(sT) } : { kind: 'win', R: rr, rr, type, fillAt, at: at(tT) }; }
    if (hs) return { kind: 'loss', R: -1, rr, type, fillAt, at: at(sT) };
    if (ht) return { kind: 'win', R: rr, rr, type, fillAt, at: at(tT) };
  }
  if (!filled) return { kind: 'nofill', R: 0, rr, type };
  return { kind: 'open', R: dir * (P[P.length - 1] - e) / risk, rr, type, fillAt, at: P.length - 1 };
}
const RES_TXT = {
  win: r => `Target hit first: +${r.R.toFixed(2)}R`, loss: () => 'Stopped out: −1R', nofill: () => 'Not filled: price never reached your entry',
  open: r => `Still open at the chart's end: ${r.R >= 0 ? '+' : ''}${r.R.toFixed(2)}R`, none: () => 'No trade', invalid: r => r.why,
};

// ─────────── loading ───────────
async function load() {
  // data is inlined by the app (src/pages/Sandbox.tsx); the page has no public URL
  const res = window.__SANDBOX_DATA__ || await Promise.all(FILES.map(f => fetch(BASE + f, { cache: 'no-cache' }).then(r => r.ok ? r.json() : []).catch(() => [])));
  const seen = new Set();
  EX = res.flat().filter(valid).filter(x => !seen.has(x.id) && seen.add(x.id));
  EX.sort((a, b) => (a.lesson - b.lesson) || a.id.localeCompare(b.id));
  const ok = res.filter(r => Array.isArray(r) && r.length).length;
  const info = EX.length ? `${EX.length} charts from ${ok} of ${FILES.length} packs · ${new Set(EX.map(x => x.mentor)).size} mentor${new Set(EX.map(x => x.mentor)).size > 1 ? 's' : ''}` : 'No exercises found. Add charts_*.json to /sandbox.';
  $('#dataInfo').textContent = info; $('#dataInfo2').textContent = info;
}

// ─────────── filters ───────────
function opts(sel, items, keep) { const cur = keep ?? sel.value; sel.innerHTML = items.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join(''); if (items.some(([v]) => v === cur)) sel.value = cur; }
function refreshFilters(keepChart) {
  const m = $('#fMentor').value || 'all', p = $('#fPattern').value || 'all';
  opts($('#fMentor'), [['all', 'All mentors'], ...[...new Set(EX.map(x => x.mentor))].map(k => [k, MENTOR[k] || k])]);
  const byM = EX.filter(x => m === 'all' || x.mentor === m);
  const pc = {}; byM.forEach(x => { pc[x.pattern] = (pc[x.pattern] || 0) + 1; });
  opts($('#fPattern'), [['all', `All patterns (${byM.length})`], ...Object.keys(pc).sort().map(k => [k, `${PATTERN_LABEL[k] || k} (${pc[k]})`])]);
  const byP = byM.filter(x => p === 'all' || x.pattern === p);
  const ls = [...new Set(byP.map(x => x.lesson))].sort((a, b) => a - b);
  opts($('#fLesson'), [['all', 'All lessons'], ...ls.map(n => [String(n), `Lesson ${n}`])]);
  const l = $('#fLesson').value || 'all';
  S.list = byP.filter(x => l === 'all' || String(x.lesson) === l);
  opts($('#fChart'), S.list.map(x => [x.id, `${x.title}`]), keepChart);
}
function onFilter() { refreshFilters(); if (S.list.length) loadEx(S.list.includes(S.ex) ? S.ex : S.list[0]); else showEmpty('No charts match these filters.'); }
['#fMentor', '#fPattern', '#fLesson'].forEach(id => $(id).addEventListener('change', onFilter));
$('#fChart').addEventListener('change', e => { const x = EX.find(x => x.id === e.target.value); if (x) loadEx(x); });
const step = d => { if (!S.list.length) return; const i = S.list.indexOf(S.ex); loadEx(S.list[(i + d + S.list.length) % S.list.length]); };
$('#prevBtn').onclick = () => step(-1);
$('#nextBtn').onclick = () => step(1);
$('#randBtn').onclick = () => { if (!S.list.length) return; const pool = S.list.length > 1 ? S.list.filter(x => x !== S.ex) : S.list; loadEx(pool[Math.floor(Math.random() * pool.length)]); };
function showEmpty(t) { $('#stageEmpty').textContent = t; $('#stageEmpty').classList.remove('hidden'); stage.style.visibility = 'hidden'; }

// ─────────── load one exercise ───────────
function loadEx(ex) {
  if (S.ex) S.drawings.set(S.ex.id, S.shapes);
  S.ex = ex; S.shapes = S.drawings.get(ex.id) || []; S.undo = []; S.draft = null; S.pick = null;
  S.trade = { side: null, entry: null, sl: null, tp: null }; S.revealed = false; S.revealP = 0; S.res = S.mres = null; S.attemptId = null; S.emos = new Set();
  $('#fChart').value = ex.id;
  $('#exTitle').textContent = ex.title;
  $('#exMeta').textContent = `${MENTOR[ex.mentor] || ex.mentor} · lesson ${ex.lesson} · ${hasAxis(ex) ? 'price scale calibrated' : 'no price scale (levels in % of chart height)'}`;
  $('#pickTitle').textContent = ex.title; $('#pickMeta').textContent = `${MENTOR[ex.mentor] || ex.mentor} · lesson ${ex.lesson} · ${S.list.indexOf(ex) + 1} of ${S.list.length}`;
  $('#unitNote').textContent = hasAxis(ex) ? 'prices' : '% of chart height';
  ['#inEntry', '#inSl', '#inTp'].forEach(s => { $(s).value = ''; $(s).placeholder = hasAxis(ex) ? 'price' : '% (0 = bottom)'; });
  mask.style.transition = 'none'; mask.style.left = (ex.maskX * 100) + '%'; void mask.offsetWidth; mask.style.transition = '';
  $('#critique').classList.add('hidden'); $('#critique').classList.remove('flex');
  $('#psych').classList.add('hidden'); $('#psych').classList.remove('flex');
  setSheet(false); $('#tsBody').scrollTop = 0;
  $('#tradePanel').querySelectorAll('input,button.side,button.pick').forEach(el => { el.disabled = false; });
  $$('.side').forEach(b => b.setAttribute('aria-checked', 'false')); $('#levels').style.opacity = '1'; setPick(null);
  $('#stageEmpty').textContent = 'Loading chart…'; $('#stageEmpty').classList.remove('hidden');
  stage.style.visibility = 'hidden';
  img.onload = () => { $('#stageEmpty').classList.add('hidden'); stage.style.visibility = 'visible'; fit(); };
  img.onerror = () => showEmpty('This chart image could not be loaded.');
  img.alt = `Chart: ${ex.title} (outcome hidden)`;
  img.src = ex.src;
  syncTrade(); savePrefs();
}

// ─────────── stage sizing ───────────
function fit() {
  if (!img.naturalWidth) return;
  // the chart fills whatever room its card has (the card flexes to the frame height)
  const wrap = $('#stageWrap'), pad = filterSheetMq.matches ? 8 : 20, aw = wrap.clientWidth - pad, ah = wrap.clientHeight - pad;
  if (aw <= 0 || ah <= 0) return;
  const s = Math.min(aw / img.naturalWidth, ah / img.naturalHeight);
  stage.style.width = Math.round(img.naturalWidth * s) + 'px'; stage.style.height = Math.round(img.naturalHeight * s) + 'px';
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.round(W() * dpr); cv.height = Math.round(H() * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}
try { new ResizeObserver(() => fit()).observe($('#stageWrap')); } catch { window.addEventListener('resize', fit); }

// ─────────── drawing ───────────
function line(x1, y1, x2, y2, c, w = 1.6, dash) { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; if (dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }
function tag(x, y, text, bg, fg = '#04131d', align = 'right') {
  ctx.save(); ctx.font = '600 10.5px Inter, system-ui, sans-serif'; const w = ctx.measureText(text).width + 10, h = 16;
  const X = align === 'right' ? x - w : x, Y = clamp(y - h / 2, 0, H() - h);
  ctx.fillStyle = bg; ctx.beginPath(); (ctx.roundRect ? ctx.roundRect(X, Y, w, h, 4) : ctx.rect(X, Y, w, h)); ctx.fill();
  ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(text, X + 5, Y + h / 2 + 0.5); ctx.restore();
}
function drawShape(sh, ghost) {
  const w = W(), h = H(), c = sh.c; ctx.save(); if (ghost) ctx.globalAlpha = 0.8;
  if (sh.t === 'hline') { line(0, sh.y * h, w, sh.y * h, c, 1.6); tag(w - 2, sh.y * h, fmtY(S.ex, sh.y), c); }
  else if (sh.t === 'trend') { const dx = sh.x2 - sh.x1, dy = sh.y2 - sh.y1; line(sh.x1 * w, sh.y1 * h, sh.x2 * w, sh.y2 * h, c, 1.8); if (Math.abs(dx) > 1e-4) { const k = (1 - sh.x2) / dx; if (k > 0) line(sh.x2 * w, sh.y2 * h, w, (sh.y2 + dy * k) * h, c, 1, [4, 4]); } }
  else if (sh.t === 'rect') { const x = Math.min(sh.x1, sh.x2) * w, y = Math.min(sh.y1, sh.y2) * h, rw = Math.abs(sh.x2 - sh.x1) * w, rh = Math.abs(sh.y2 - sh.y1) * h; ctx.fillStyle = c + '2e'; ctx.fillRect(x, y, rw, rh); ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.strokeRect(x, y, rw, rh); }
  else if (sh.t === 'fib') {
    const xa = Math.min(sh.x1, sh.x2) * w; line(sh.x1 * w, sh.y1 * h, sh.x2 * w, sh.y2 * h, c, 1, [3, 3]);
    FIB.forEach(r => { const y = (sh.y2 + (sh.y1 - sh.y2) * r) * h; line(xa, y, w, y, c, r === 0.5 || r === 0.618 ? 1.6 : 1, r === 0 || r === 1 ? null : [6, 3]); ctx.save(); ctx.font = '600 10px Inter, system-ui'; ctx.fillStyle = c; ctx.fillText(`${r} · ${fmtY(S.ex, y / h)}`, xa + 4, y - 3); ctx.restore(); });
    const y5 = (sh.y2 + (sh.y1 - sh.y2) * 0.5) * h, y6 = (sh.y2 + (sh.y1 - sh.y2) * 0.618) * h; ctx.fillStyle = c + '1f'; ctx.fillRect(xa, Math.min(y5, y6), w - xa, Math.abs(y6 - y5));
  }
  else if (sh.t === 'pen' && sh.pts.length > 1) { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.lineJoin = ctx.lineCap = 'round'; ctx.beginPath(); sh.pts.forEach(([x, y], i) => i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)); ctx.stroke(); }
  ctx.restore();
}
function pathXY(ex) { const n = ex.path.length, x0 = ex.maskX, x1 = Math.max(ex.plot.x1 || 1, x0 + 0.05); return ex.path.map((y, i) => [x0 + (x1 - x0) * (n > 1 ? i / (n - 1) : 0), y]); }
function ptAt(ex, t) { const pts = pathXY(ex), i = clamp(Math.floor(t), 0, pts.length - 1), f = t - i; if (i >= pts.length - 1) return pts[pts.length - 1]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
function drawTrade(tr, opt) {
  const ex = S.ex, w = W(), h = H(), x0 = opt.x0 * w, lbl = opt.label;
  const col = { entry: opt.entryC, sl: '#ef4444', tp: '#22c55e' };
  if (tr.side && tr.side !== 'none' && tr.entry != null) {
    if (tr.sl != null) { ctx.fillStyle = 'rgba(239,68,68,.12)'; ctx.fillRect(x0, Math.min(tr.entry, tr.sl) * h, w - x0, Math.abs(tr.sl - tr.entry) * h); }
    if (tr.tp != null) { ctx.fillStyle = 'rgba(34,197,94,.10)'; ctx.fillRect(x0, Math.min(tr.entry, tr.tp) * h, w - x0, Math.abs(tr.tp - tr.entry) * h); }
  }
  [['entry', 'Entry'], ['sl', 'Stop'], ['tp', 'Target']].forEach(([k, n]) => { if (tr[k] == null) return; const y = tr[k] * h; line(opt.full ? 0 : x0, y, w, y, col[k], opt.width || 1.8, opt.dash); tag(opt.right ? w - 2 : x0 + 2, y, `${lbl}${n} ${fmtY(ex, tr[k])}`, col[k], '#04131d', opt.right ? 'right' : 'left'); });
}
function draw() {
  const ex = S.ex; if (!ex) return; const w = W(), h = H(); ctx.clearRect(0, 0, w, h);
  // "now" line
  line(ex.maskX * w, 0, ex.maskX * w, h, '#f59e0b', 1.2, [5, 4]); if (!S.revealed) tag(ex.maskX * w - 3, 12, 'NOW', '#f59e0b');
  // revealed: mentor zone, outcome path, mentor trade
  if (S.revealed) {
    const t = ex.truth, a = S.revealP;
    if (ex.zone) { const zx = (ex.zone.x0 ?? 0) * w; ctx.fillStyle = 'rgba(192,132,252,.16)'; ctx.fillRect(zx, ex.zone.y0 * h, w - zx, (ex.zone.y1 - ex.zone.y0) * h); ctx.strokeStyle = 'rgba(192,132,252,.7)'; ctx.setLineDash([4, 3]); ctx.strokeRect(zx, ex.zone.y0 * h, w - zx, (ex.zone.y1 - ex.zone.y0) * h); ctx.setLineDash([]); }
    const pts = pathXY(ex), upto = a * (pts.length - 1);
    ctx.save(); ctx.strokeStyle = '#fde047'; ctx.lineWidth = 2.4; ctx.shadowColor = 'rgba(253,224,71,.5)'; ctx.shadowBlur = 6; ctx.beginPath();
    for (let i = 0; i <= Math.ceil(upto) && i < pts.length; i++) { const [x, y] = i <= upto ? pts[i] : ptAt(ex, upto); i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h); }
    ctx.stroke(); ctx.restore();
    if (a >= 1) {
      drawTrade({ side: t.side === 'none' ? 'none' : t.side, entry: t.entry, sl: t.sl, tp: t.tp }, { x0: Math.max(0, (ex.zone?.x0 ?? ex.maskX - 0.15)), label: 'S·', entryC: '#c084fc', dash: [7, 4], width: 1.4, right: false });
      const marks = [[S.res, '#38bdf8'], [S.mres, '#c084fc']];
      marks.forEach(([r, c]) => { if (!r || r.at == null) return; const [x, y] = ptAt(ex, r.at); ctx.beginPath(); ctx.arc(x * w, y * h, 6, 0, Math.PI * 2); ctx.fillStyle = r.kind === 'win' ? '#22c55e' : r.kind === 'loss' ? '#ef4444' : '#94a3b8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.stroke(); });
      if (S.res && S.res.fillAt != null) { const [x, y] = ptAt(ex, S.res.fillAt); ctx.beginPath(); ctx.arc(x * w, y * h, 4, 0, Math.PI * 2); ctx.fillStyle = '#38bdf8'; ctx.fill(); }
    }
  }
  S.shapes.forEach(s => drawShape(s)); if (S.draft) drawShape(S.draft, true);
  drawTrade(S.trade, { x0: ex.maskX, label: '', entryC: '#38bdf8', right: true, full: false });
  if (S.hover && (S.pick || ['hline', 'trend', 'rect', 'fib'].includes(S.tool))) { line(0, S.hover.y * h, w, S.hover.y * h, 'rgba(230,237,247,.35)', 1, [2, 3]); line(S.hover.x * w, 0, S.hover.x * w, h, 'rgba(230,237,247,.18)', 1, [2, 3]); }
}

// ─────────── pointer input on the canvas ───────────
const pos = e => { const r = cv.getBoundingClientRect(); return { x: clamp((e.clientX - r.left) / r.width, 0, 1), y: clamp((e.clientY - r.top) / r.height, 0, 1) }; };
const segD = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy; const t = L ? clamp(((px - ax) * dx + (py - ay) * dy) / L, 0, 1) : 0; return Math.hypot(px - ax - t * dx, py - ay - t * dy); };
function hitShape(p) {
  const w = W(), h = H(), px = p.x * w, py = p.y * h, TH = 8;
  for (let i = S.shapes.length - 1; i >= 0; i--) {
    const s = S.shapes[i];
    if (s.t === 'hline' && Math.abs(s.y * h - py) < TH) return i;
    if (s.t === 'trend' && segD(px, py, s.x1 * w, s.y1 * h, s.x2 * w, s.y2 * h) < TH) return i;
    if (s.t === 'rect' && px >= Math.min(s.x1, s.x2) * w - TH && px <= Math.max(s.x1, s.x2) * w + TH && py >= Math.min(s.y1, s.y2) * h - TH && py <= Math.max(s.y1, s.y2) * h + TH) return i;
    if (s.t === 'fib' && px >= Math.min(s.x1, s.x2) * w - TH && FIB.some(r => Math.abs((s.y2 + (s.y1 - s.y2) * r) * h - py) < TH)) return i;
    if (s.t === 'pen' && s.pts.some((q, k) => k && segD(px, py, s.pts[k - 1][0] * w, s.pts[k - 1][1] * h, q[0] * w, q[1] * h) < TH)) return i;
  }
  return -1;
}
const pushUndo = () => { S.undo.push(JSON.stringify(S.shapes)); if (S.undo.length > 100) S.undo.shift(); };
function erase(p) { const i = hitShape(p); if (i >= 0) { pushUndo(); S.shapes.splice(i, 1); draw(); } }
cv.addEventListener('pointerdown', e => {
  if (!S.ex || (e.button !== 0 && e.pointerType === 'mouse')) return;
  cv.setPointerCapture(e.pointerId); const p = pos(e); cv.focus({ preventScroll: true });
  if (S.pick) { setLevel(S.pick, p.y); const order = ['entry', 'sl', 'tp']; const nx = order.find(k => S.trade[k] == null); setPick(nx && S.trade.side !== 'none' ? nx : null); return; }
  if (S.tool === 'cursor') { if (S.revealed) return; const h = H(); const k = ['entry', 'sl', 'tp'].find(k => S.trade[k] != null && Math.abs(S.trade[k] * h - p.y * h) < 8); if (k) S.drag = k; return; }
  if (S.tool === 'eraser') { S.draft = { t: 'eraser' }; erase(p); return; }
  if (S.tool === 'hline') S.draft = { t: 'hline', y: p.y, c: S.color };
  else if (S.tool === 'pen') S.draft = { t: 'pen', pts: [[p.x, p.y]], c: S.color };
  else S.draft = { t: S.tool, x1: p.x, y1: p.y, x2: p.x, y2: p.y, c: S.color };
  draw();
});
cv.addEventListener('pointermove', e => {
  if (!S.ex) return; const p = pos(e); S.hover = p;
  const ro = $('#readout'); ro.classList.remove('hidden'); ro.textContent = (hasAxis(S.ex) ? 'Price ' : 'Height ') + fmtY(S.ex, p.y);
  if (S.drag) { setLevel(S.drag, p.y); return; }
  const d = S.draft;
  if (d) { if (d.t === 'eraser') erase(p); else if (d.t === 'hline') d.y = p.y; else if (d.t === 'pen') { const L = d.pts[d.pts.length - 1]; if (Math.hypot(L[0] - p.x, L[1] - p.y) > 0.003) d.pts.push([p.x, p.y]); } else { d.x2 = p.x; d.y2 = p.y; } }
  if (S.tool === 'cursor' && !S.revealed) { const h = H(); cv.style.cursor = ['entry', 'sl', 'tp'].some(k => S.trade[k] != null && Math.abs(S.trade[k] * h - p.y * h) < 8) ? 'ns-resize' : 'default'; }
  else cv.style.cursor = S.tool === 'eraser' ? 'cell' : 'crosshair';
  draw();
});
const endPtr = () => {
  if (S.drag) { S.drag = null; return; }
  const d = S.draft; S.draft = null; if (!d || d.t === 'eraser') { draw(); return; }
  const tiny = (d.t === 'trend' || d.t === 'rect' || d.t === 'fib') && Math.hypot((d.x2 - d.x1) * W(), (d.y2 - d.y1) * H()) < 6;
  if (!tiny && !(d.t === 'pen' && d.pts.length < 2)) { pushUndo(); S.shapes.push(d); }
  draw();
};
cv.addEventListener('pointerup', e => { endPtr(); if (e.pointerType === 'touch') { S.hover = null; $('#readout').classList.add('hidden'); draw(); } }); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('pointerleave', () => { S.hover = null; $('#readout').classList.add('hidden'); draw(); });

// ─────────── tools ───────────
function setTool(t) { S.tool = t; $$('.tool[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === t))); setPick(null); savePrefs(); }
$$('.tool[data-tool]').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));
const COLOR_NAME = { '#38bdf8': 'sky', '#f59e0b': 'amber', '#22c55e': 'green', '#ef4444': 'red', '#c084fc': 'violet', '#e6edf7': 'white' };
$('#colors').innerHTML = COLORS.map(c => `<button class="swatch" role="radio" aria-checked="false" aria-label="Colour ${COLOR_NAME[c] || c}" data-c="${c}"><span style="background:${c}"></span></button>`).join('');
function setColor(c) { S.color = c; $$('#colors [data-c]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.c === c))); savePrefs(); }
$$('#colors [data-c]').forEach(b => b.addEventListener('click', () => setColor(b.dataset.c)));
const undo = () => { if (!S.undo.length) return; S.shapes = JSON.parse(S.undo.pop()); draw(); };
$('#undoBtn').onclick = undo;
$('#clearBtn').onclick = () => { if (!S.shapes.length) return; pushUndo(); S.shapes = []; draw(); };

// ─────────── trade panel ───────────
const IN = { entry: $('#inEntry'), sl: $('#inSl'), tp: $('#inTp') };
function setLevel(k, y) { S.trade[k] = y; IN[k].value = fmtVal(S.ex, y); syncTrade(); }
function setSide(s) {
  if (S.revealed) return; S.trade.side = s;
  $$('.side').forEach(b => b.setAttribute('aria-checked', String(b.dataset.s === s)));
  $('#levels').style.opacity = s === 'none' ? '.4' : '1';
  if (s !== 'none' && S.trade.entry == null) setPick('entry'); else setPick(null);
  syncTrade();
}
function setPick(k) {
  S.pick = k; $$('.pick').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pick === k)));
  if (k && compact()) setSheet(false);
  const hint = $('#pickHint'); if (k) { hint.textContent = `${matchMedia('(pointer: coarse)').matches ? 'Tap' : 'Click'} the chart to set your ${k === 'sl' ? 'stop' : k === 'tp' ? 'target' : 'entry'}`; hint.classList.remove('hidden'); } else hint.classList.add('hidden');
  cv.style.cursor = k ? 'crosshair' : ''; draw();
}
$$('.side').forEach(b => b.addEventListener('click', () => setSide(b.dataset.s)));
$$('.pick').forEach(b => b.addEventListener('click', () => setPick(S.pick === b.dataset.pick ? null : b.dataset.pick)));
Object.entries(IN).forEach(([k, el]) => el.addEventListener('input', () => { S.trade[k] = el.value.trim() ? parseVal(S.ex, el.value) : null; syncTrade(); }));
function syncTrade() {
  const ex = S.ex, t = S.trade; if (!ex) return;
  let msg = '', ok = false;
  if (!t.side) msg = 'Pick BUY, SELL or NO TRADE.';
  else if (t.side === 'none') { msg = 'You are passing on this chart. Reveal to see if the mentor agreed.'; ok = true; }
  else {
    const r = (t.entry != null && t.sl != null && t.tp != null) ? evaluate({ path: [0, 0] }, t.side, t.entry, t.sl, t.tp) : null;
    if (!r) msg = 'Set entry, stop and target: click “Set” then the chart, or type them.';
    else if (r.kind === 'invalid') msg = r.why;
    else { ok = true; msg = r.rr < 3 ? `R:R ${r.rr.toFixed(2)} is below the 3:1 Seiden asks for.` : 'Plan is complete. Ready to reveal.'; }
  }
  const has = t.entry != null && t.sl != null && t.side && t.side !== 'none';
  $('#oRisk').textContent = has ? dist(ex, t.entry, t.sl) : '—';
  $('#oRew').textContent = has && t.tp != null ? dist(ex, t.entry, t.tp) : '—';
  const rr = has && t.tp != null && Math.abs(t.entry - t.sl) > 1e-6 ? Math.abs(t.tp - t.entry) / Math.abs(t.entry - t.sl) : null;
  const o = $('#oRR'); o.textContent = rr ? rr.toFixed(2) : '—'; o.className = 'num text-[16px] font-bold mt-0.5 ' + (rr == null ? '' : rr >= 3 ? 'text-buy' : rr >= 2 ? 'text-gold' : 'text-sell');
  $('#tradeMsg').textContent = S.revealed ? '' : msg;
  $('#revealBtn').disabled = !ok || S.revealed;
  draw();
}
$('#resetBtn').onclick = () => { if (S.ex) { S.drawings.delete(S.ex.id); const ex = S.ex; S.ex = null; loadEx(ex); } };

// ─────────── reveal & critique ───────────
$('#revealBtn').onclick = reveal;
function reveal() {
  const ex = S.ex; if (!ex || S.revealed) return;
  const t = S.trade; S.res = evaluate(ex, t.side, t.entry, t.sl, t.tp); if (S.res.kind === 'invalid') return;
  S.mres = evaluate(ex, ex.truth.side, ex.truth.entry, ex.truth.sl, ex.truth.tp);
  S.revealed = true; setPick(null); $('#revealBtn').disabled = true;
  $('#tradePanel').querySelectorAll('input,button.side,button.pick').forEach(el => { el.disabled = true; });
  img.alt = `Chart: ${ex.title} (outcome revealed)`;
  mask.style.left = '100%';
  const dur = reduceMotion() ? 0 : 1500, t0 = performance.now();
  const tick = now => { S.revealP = dur ? clamp((now - t0) / dur, 0, 1) : 1; draw(); if (S.revealP < 1) requestAnimationFrame(tick); else finish(); };
  requestAnimationFrame(tick);
}
function finish() {
  const ex = S.ex, t = S.trade, tr = ex.truth, r = S.res, m = S.mres;
  const agree = t.side === tr.side;
  const att = { id: 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ts: Date.now(), chart: ex.id, title: ex.title, pattern: ex.pattern, lesson: ex.lesson, mentor: ex.mentor,
    side: t.side, entry: t.entry, sl: t.sl, tp: t.tp, entryTxt: fmtY(ex, t.entry), slTxt: fmtY(ex, t.sl), tpTxt: fmtY(ex, t.tp),
    rr: r.rr ?? null, result: r.kind, R: r.kind === 'none' ? null : r.R, agree, mentorSide: tr.side, mentorResult: m.kind, mentorR: m.R ?? null,
    noTradeCorrect: t.side === 'none' ? (tr.side === 'none' || m.kind === 'loss' || m.kind === 'nofill') : null, emotions: [], confidence: null, note: '' };
  const list = store.get(K_ATT, []); list.unshift(att); store.set(K_ATT, list.slice(0, 1000)); S.attemptId = att.id;
  renderCritique(att); openPsych();
  if (compact()) setSheet(true);
  requestAnimationFrame(() => { const b = $('#tsBody'); b.scrollTo({ top: Math.max(0, b.scrollTop + $('#critique').getBoundingClientRect().top - b.getBoundingClientRect().top - 8), behavior: reduceMotion() ? 'auto' : 'smooth' }); });
}
function bullets(items) { return `<ul class="flex flex-col gap-1.5">${items.map(([tone, txt]) => `<li class="flex gap-2 text-[12.5px] leading-relaxed text-ink2"><span class="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${tone === 'good' ? 'bg-buy' : tone === 'bad' ? 'bg-sell' : 'bg-gold'}"></span><span>${txt}</span></li>`).join('')}</ul>`; }
function coach(ex) {
  const t = S.trade, tr = ex.truth, z = ex.zone, out = [];
  const sideTxt = s => s === 'buy' ? 'BUY' : s === 'sell' ? 'SELL' : 'NO TRADE';
  out.push(t.side === tr.side ? ['good', `Same call as ${esc(MENTOR[ex.mentor] || ex.mentor)}: ${sideTxt(tr.side)}.`] : ['bad', `You chose ${sideTxt(t.side)}; ${esc(MENTOR[ex.mentor] || ex.mentor)} chose ${sideTxt(tr.side)}.`]);
  if (t.side === 'buy' || t.side === 'sell') {
    if (tr.entry != null && Math.abs(t.entry - tr.entry) < 0.004) out.push(['good', 'Your entry matches his.']);
    else if (tr.entry != null) out.push(['tip', `Your entry was ${dist(ex, t.entry, tr.entry)} ${(-t.entry > -tr.entry) ? 'above' : 'below'} his${t.side === tr.side ? '' : ' (opposite side)'}.`]);
    if (z) {
      const prox = t.side === 'buy' ? z.y0 : z.y1, distal = t.side === 'buy' ? z.y1 : z.y0, beyond = t.side === 'buy' ? t.sl > distal : t.sl < distal;
      out.push(beyond ? ['good', 'Stop is beyond the distal line of the zone, where the idea is proven wrong.'] : ['bad', 'Stop sits inside the zone. Seiden places it just beyond the distal line, otherwise normal noise at the level stops you out.']);
      const inZone = t.entry >= z.y0 - 0.01 && t.entry <= z.y1 + 0.01;
      const chasing = t.side === 'buy' ? t.entry < z.y0 - 0.01 : t.entry > z.y1 + 0.01;
      out.push(inZone ? ['good', 'Entry is at the zone (proximal line): you bought/sold where the unfilled orders are.'] : chasing ? ['bad', `Entry is away from the zone, ${dist(ex, t.entry, prox)} ${t.side === 'buy' ? 'above demand' : 'below supply'}: that is chasing and shrinks the profit margin.`] : ['tip', 'Entry is beyond the zone; the order would only fill if the level is already failing.']);
    }
    const rr = S.res.rr; if (rr) out.push(rr >= 3 ? ['good', `R:R ${rr.toFixed(2)}: meets the 3:1 rule.`] : ['bad', `R:R ${rr.toFixed(2)}: under 3:1. Either the stop is too wide or the target is short of the opposing level.`]);
  }
  if (t.side === 'none') out.push(tr.side === 'none' ? ['good', 'He passed too: no edge is a valid answer.'] : (S.mres.kind === 'win' ? ['bad', `His trade won ${S.mres.R.toFixed(1)}R. Look again at what made the level tradable.`] : ['tip', `His trade ${S.mres.kind === 'loss' ? 'lost' : 'did not fill'}, so standing aside cost you nothing here.`]));
  return out;
}
function renderCritique(att) {
  const ex = S.ex, r = S.res, m = S.mres, el = $('#critique');
  const tone = r.kind === 'win' ? 'text-buy' : r.kind === 'loss' ? 'text-sell' : 'text-ink';
  const yours = r.kind === 'none' ? (att.noTradeCorrect ? 'No trade: correct call' : 'No trade: you missed his trade') : RES_TXT[r.kind](r);
  const his = ex.truth.side === 'none' ? 'He passed on this chart' : `${ex.truth.side.toUpperCase()} at ${fmtY(ex, ex.truth.entry)}, stop ${fmtY(ex, ex.truth.sl)}, target ${fmtY(ex, ex.truth.tp)} → ${RES_TXT[m.kind](m)}`;
  el.innerHTML = `
    <div class="flex items-center justify-between"><div class="label">Result</div><span class="text-[11.5px] font-semibold px-2.5 py-1 rounded-full ${att.agree ? 'bg-buy/15 text-buy' : 'bg-sell/15 text-sell'}">${att.agree ? 'Agrees with mentor' : 'Differs from mentor'}</span></div>
    <div class="pop"><div class="text-[19px] font-bold h-title ${tone}">${esc(yours)}</div>${r.type ? `<div class="text-[11.5px] text-ink3 mt-0.5">${r.type === 'market' ? 'Filled at once (entry at the current price)' : r.type === 'limit' ? 'Limit order: price had to come back to your entry' : 'Stop order: price had to break through your entry'}</div>` : ''}</div>
    <div class="rounded-2xl border border-mentor/30 bg-mentor/10 p-3.5">
      <div class="flex items-center gap-2 text-[12px] font-bold text-mentor"><i data-lucide="graduation-cap" class="w-4 h-4"></i>${esc(MENTOR[ex.mentor] || ex.mentor)}'s trade</div>
      <div class="text-[12.5px] text-ink mt-1 num">${esc(his)}</div>
      <p class="text-[12.5px] text-ink2 leading-relaxed mt-2">${esc(ex.truth.why)}</p>
      <div class="text-[11px] text-ink3 mt-2">Pattern: ${esc(PATTERN_LABEL[ex.pattern] || ex.pattern)} · purple dashed lines and box on the chart · yellow line = what price did</div>
    </div>
    <div><div class="label mb-1.5">Critique</div>${bullets(coach(ex))}</div>`;
  el.classList.remove('hidden'); el.classList.add('flex'); icons();
}
function openPsych() {
  S.emos = new Set(); $('#conf').value = 50; $('#confOut').textContent = '50%'; $('#note').value = ''; $('#saveMsg').textContent = '';
  $('#emoChips').innerHTML = EMOS.map(([k, l, ic]) => `<button class="chip" data-e="${k}" aria-pressed="false"><i data-lucide="${ic}"></i>${l}</button>`).join('');
  $$('#emoChips [data-e]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.e; S.emos.has(k) ? S.emos.delete(k) : S.emos.add(k); b.setAttribute('aria-pressed', String(S.emos.has(k))); }));
  const p = $('#psych'); p.classList.remove('hidden'); p.classList.add('flex'); icons();
}
$('#conf').addEventListener('input', e => { $('#confOut').textContent = e.target.value + '%'; });
$('#saveLog').onclick = () => {
  const list = store.get(K_ATT, []), a = list.find(x => x.id === S.attemptId);
  if (!a) { $('#saveMsg').textContent = 'Could not find this attempt (storage may be blocked).'; return; }
  a.emotions = [...S.emos]; a.confidence = +$('#conf').value; a.note = $('#note').value.trim().slice(0, 2000);
  $('#saveMsg').textContent = store.set(K_ATT, list) ? 'Saved to your sandbox journal.' : 'Storage is blocked in this browser, so it was not saved.';
};
$('#nextAfter').onclick = () => $('#randBtn').click();

// ─────────── keyboard ───────────
document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (S.tab === 'blind' && !$('#filters').classList.contains('open')) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { v: 'cursor', h: 'hline', t: 'trend', r: 'rect', f: 'fib', p: 'pen', e: 'eraser' }, k = e.key.toLowerCase();
    if (map[k]) { setTool(map[k]); return; }
    if (k === 'b') setSide('buy'); else if (k === 's') setSide('sell'); else if (k === 'n') setSide('none');
    else if (k === '1' || k === '2' || k === '3') { if (!S.revealed) setPick(['entry', 'sl', 'tp'][+k - 1]); }
    else if (e.key === 'Escape') { setPick(null); S.draft = null; draw(); }
    else if (e.key === 'ArrowRight' && e.target === cv) step(1); else if (e.key === 'ArrowLeft' && e.target === cv) step(-1);
  }
  if (e.key === 'Escape' && !$('#preview').classList.contains('hidden')) closePreview();
  if (e.key === 'Escape' && $('#filters').classList.contains('open')) closeFilters(true);
});

// ─────────── tabs ───────────
function setTab(t) {
  S.tab = t;
  $$('[data-tab]').forEach(b => { const on = b.dataset.tab === t; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
  ['blind', 'match', 'hist'].forEach(k => { $('#view-' + k).hidden = k !== t; });
  moveThumb($('#modeSeg')); moveThumb($('#countSeg')); closeFilters();
  if (t === 'hist') renderHistory(); if (t === 'match' && !M.items.length) newRound(); if (t === 'blind') fit();
  savePrefs();
}
$$('[data-tab]').forEach(b => { b.addEventListener('click', () => setTab(b.dataset.tab)); b.addEventListener('keydown', e => { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; const tabs = $$('[data-tab]'), i = tabs.indexOf(b), n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); setTab(n.dataset.tab); }); });

// ─────────── history & stats ───────────
function renderHistory() {
  const list = store.get(K_ATT, []);
  const trades = list.filter(a => a.side === 'buy' || a.side === 'sell');
  const closed = trades.filter(a => a.result === 'win' || a.result === 'loss');
  const wins = closed.filter(a => a.result === 'win').length;
  const filled = trades.filter(a => a.result !== 'nofill' && typeof a.R === 'number');
  const avgR = filled.length ? filled.reduce((s, a) => s + a.R, 0) / filled.length : null;
  const agree = list.length ? list.filter(a => a.agree).length / list.length : null;
  const nt = list.filter(a => a.side === 'none'), ntOk = nt.filter(a => a.noTradeCorrect).length;
  const card = (l, v, sub, tone = '') => `<div class="card p-3.5 sm:p-4 min-w-0"><div class="label truncate">${l}</div><div class="num text-[22px] font-bold h-title mt-1 ${tone}">${v}</div><div class="text-[11.5px] text-ink3 mt-0.5 leading-snug">${sub}</div></div>`;
  $('#statCards').innerHTML = [
    card('Attempts', list.length, `${trades.length} trades · ${nt.length} passes`),
    card('Win rate', closed.length ? Math.round(wins / closed.length * 100) + '%' : '—', `${wins} of ${closed.length} closed trades`, closed.length ? (wins / closed.length >= 0.5 ? 'text-buy' : 'text-sell') : ''),
    card('Avg R', avgR == null ? '—' : (avgR >= 0 ? '+' : '') + avgR.toFixed(2) + 'R', `over ${filled.length} filled trades`, avgR == null ? '' : avgR >= 0 ? 'text-buy' : 'text-sell'),
    card('Agree with mentor', agree == null ? '—' : Math.round(agree * 100) + '%', 'same side (or same pass)'),
    card('Good passes', nt.length ? `${ntOk}/${nt.length}` : '—', 'no-trade calls that saved R'),
  ].join('');
  $('#histList').innerHTML = list.length ? list.slice(0, 200).map(a => {
    const tone = a.result === 'win' ? 'text-buy' : a.result === 'loss' ? 'text-sell' : 'text-ink2';
    const res = a.result === 'none' ? (a.noTradeCorrect ? 'Pass ✓' : 'Pass ✗') : a.result === 'nofill' ? 'Not filled' : a.result === 'open' ? `Open ${a.R >= 0 ? '+' : ''}${a.R.toFixed(2)}R` : a.result === 'win' ? `+${a.R.toFixed(2)}R` : '−1R';
    return `<button class="press w-full text-left px-2.5 py-3 min-h-[48px] hover:bg-panel2 rounded-xl grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5" data-open="${esc(a.chart)}">
      <span class="text-[13px] font-medium truncate">${esc(a.title)}</span><span class="num text-[13px] font-bold ${tone}">${esc(res)}</span>
      <span class="text-[11.5px] text-ink3 truncate">${new Date(a.ts).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · ${esc((a.side || '').toUpperCase())}${a.rr ? ' · ' + a.rr.toFixed(1) + ':1' : ''} · ${a.agree ? 'agreed' : 'differed'}${a.emotions && a.emotions.length ? ' · ' + a.emotions.map(esc).join(', ') : ''}${a.confidence != null ? ' · ' + a.confidence + '% sure' : ''}</span><span class="text-[11.5px] text-ink3">${esc(PATTERN_LABEL[a.pattern] || a.pattern)}</span>
      ${a.note ? `<span class="col-span-2 text-[12px] text-ink2 italic truncate">“${esc(a.note)}”</span>` : ''}</button>`;
  }).join('') : '<p class="p-3 text-[13px] text-ink3">No attempts yet. Take a blind test and reveal it to start your journal.</p>';
  $$('#histList [data-open]').forEach(b => b.addEventListener('click', () => { const x = EX.find(x => x.id === b.dataset.open); if (!x) return; ['#fMentor', '#fPattern', '#fLesson'].forEach(s => { $(s).value = 'all'; }); refreshFilters(); setTab('blind'); loadEx(x); }));
  const by = {}; list.forEach(a => (a.emotions || []).forEach(k => { if (typeof a.R !== 'number' || a.result === 'nofill') return; (by[k] = by[k] || []).push(a.R); }));
  $('#emoStats').innerHTML = EMOS.map(([k, l]) => { const v = by[k]; if (!v) return ''; const m = v.reduce((s, x) => s + x, 0) / v.length; const w = clamp(Math.abs(m) / 3 * 100, 4, 100);
    return `<div class="grid grid-cols-[72px_1fr_64px] items-center gap-2"><span class="text-ink2">${l}</span><span class="h-2 rounded-full bg-panel2 overflow-hidden"><span class="block h-full rounded-full ${m >= 0 ? 'bg-buy' : 'bg-sell'}" style="width:${w}%"></span></span><span class="num text-right ${m >= 0 ? 'text-buy' : 'text-sell'}">${m >= 0 ? '+' : ''}${m.toFixed(2)}R <span class="text-ink3">·${v.length}</span></span></div>`; }).join('') || '<p class="text-ink3 text-[12.5px]">Tag emotions in the psychology log to see this.</p>';
  icons();
}
$('#exportBtn').onclick = () => { const blob = new Blob([JSON.stringify(store.get(K_ATT, []), null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sandbox-journal.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
$('#wipeBtn').onclick = () => { if (confirm('Delete every saved sandbox attempt? This cannot be undone.')) { store.set(K_ATT, []); renderHistory(); } };

// ─────────── pattern matcher ───────────
const DEFS = [
  { k: 'DBR', name: 'Drop-Base-Rally (DBR)', kind: 'Demand · reversal', s: 'Price falls into a small base (1-6 candles), then rallies hard away from it. The base is where buy orders overwhelmed sellers.', r: 'Buy the first return at the proximal line, stop just under the distal. Highest R:R when it is low on the curve; against the HTF trend it needs more confirmation.' },
  { k: 'RBR', name: 'Rally-Base-Rally (RBR)', kind: 'Demand · continuation', s: 'Rally, a brief pause, then a second rally. The pause left unfilled buy orders inside an uptrend.', r: 'With-trend buy on the pullback into the base; higher win rate but often a smaller margin, so check the 3:1 room to the next supply.' },
  { k: 'RBD', name: 'Rally-Base-Drop (RBD)', kind: 'Supply · reversal', s: 'Price rallies into a small base, then drops sharply. Sellers overwhelmed buyers at the base.', r: 'Sell the first return at the proximal (base low), stop above the distal. Best high on the curve, where the buyer is a novice buying after a rally into supply.' },
  { k: 'DBD', name: 'Drop-Base-Drop (DBD)', kind: 'Supply · continuation', s: 'Decline, a short pause, then a further decline. The pause holds unfilled sell orders inside a downtrend.', r: 'With-trend short on the rally back into the base; stop above the base, target the next demand.' },
  { k: 'novice-gap', name: 'Novice gap', kind: 'Gap · fade it', s: 'A gap after a move, in the direction of that move, straight into an opposing level (gap up after a rally into supply). It comes at the end of moves.', r: 'Fade it: sell the gap into supply / buy the gap into demand, stop beyond the level, target the gap fill and the origin. The crowd is on the wrong side.' },
  { k: 'pro-gap', name: 'Pro gap', kind: 'Gap · join it', s: 'A gap after a move, against that move, away from a level. It starts new moves and leaves a fresh zone at the gap origin.', r: 'Do not fade it. Trade with it on the first return to the gap origin; stop beyond the origin base.' },
  { k: 'bull-trap', name: 'Bull trap', kind: 'Trap · sell', s: 'A breakout above an obvious high (prior day / Globex high) that runs straight into fresh supply, drawing in breakout buyers.', r: 'Pre-place the short at the supply above the high; trapped buyers\' stops fuel the drop. Stop above the supply distal, margin to demand below.' },
  { k: 'bear-trap', name: 'Bear trap', kind: 'Trap · buy', s: 'A break below an obvious low or pivot line that runs into real demand just under it, drawing in breakout sellers.', r: 'Buy the demand below the bait line from the late sellers, stop under the demand distal; their stops add fuel to the rally.' },
  { k: 'breakout-retest', name: 'Breakout & retest', kind: 'Flip · origin', s: 'A level is broken with a strong move (removed). Price comes back to the origin of the breakout, where the old level has switched side.', r: 'Prefer the return to the origin over chasing the break. Stop beyond the new zone; Kevin\'s breakout entry goes beyond the removed opposing zone.' },
  { k: 'failed-level', name: 'Failed / low-odds level', kind: 'Skip it', s: 'A level with weak departure, repeated touches, a pocket of opposing orders nearby or a candle close through the distal: motion into mass has used it up.', r: 'Pass, or wait for it to flip. A no-trade here is a winning decision; trading it is paying for hope.' },
  { k: 'stacked-levels', name: 'Stacked levels', kind: 'Levels on top of levels', s: 'Two same-side zones sitting right on top of each other (a proximal and a distal level).', r: 'Seiden: stacking raises the odds; Kevin: about 50/50. Enter at the inner level with the stop beyond the outer one, or split the size between both.' },
];
const M = { items: [], placed: new Map(), sel: null, score: 0, t0: 0, timer: null, done: false };
function newRound() {
  const n = +$('#mCount').value, by = {};
  EX.filter(x => DEFS.some(d => d.k === x.pattern)).forEach(x => (by[x.pattern] = by[x.pattern] || []).push(x));
  const pools = shuffle(Object.keys(by)).map(k => shuffle(by[k])), out = [];
  while (out.length < n && pools.some(p => p.length)) pools.forEach(p => { if (p.length && out.length < n) out.push(p.pop()); });
  M.items = shuffle(out); M.placed = new Map(); M.sel = null; M.score = 0; M.done = false; M.t0 = Date.now();
  clearInterval(M.timer); M.timer = setInterval(tickTime, 500); tickTime(); renderMatch();
}
function tickTime() { if (M.done) return; const s = Math.floor((Date.now() - M.t0) / 1000); $('#mTime').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
const bestKey = () => K_BEST + '_' + $('#mCount').value;
function renderMatch() {
  const left = M.items.filter(x => !M.placed.has(x.id));
  $('#mScore').textContent = M.score; $('#mLeft').textContent = left.length;
  $('#selNote').textContent = M.sel && M.items.some(x => x.id === M.sel) ? 'Now tap the matching card' : '';
  const best = store.get(bestKey(), null); $('#mBest').textContent = best ? best.score : '—';
  $('#tray').innerHTML = left.length ? left.map(x => `<div class="relative shrink-0"><button class="thumb block w-[150px] rounded-xl overflow-hidden ring-1 ring-edge bg-panel2 touch-none ${M.sel === x.id ? 'ring-[3px] ring-acc -translate-y-0.5' : ''}" role="option" aria-selected="${M.sel === x.id}" data-id="${esc(x.id)}" aria-label="${esc(x.title)}. Press Enter to pick it up, then choose a card."><img src="${esc(x.src)}" alt="" loading="lazy" draggable="false" class="w-full h-[100px] object-cover object-left pointer-events-none"><span class="block px-2 py-1.5 text-[11.5px] text-ink2 truncate text-left">${esc(x.title)}</span></button><button class="zoom press absolute top-0 right-0 w-11 h-11 grid place-items-center" data-z="${esc(x.id)}" aria-label="Preview ${esc(x.title)}"><span class="w-7 h-7 grid place-items-center rounded-full bg-black/60 text-white"><i data-lucide="zoom-in" class="!w-3.5 !h-3.5"></i></span></button></div>`).join('')
    : `<div class="w-full grid place-items-center text-center py-4"><div><div class="text-[16px] font-bold text-buy">Round complete: ${M.score} points</div><div class="text-[12.5px] text-ink2 mt-1">${esc($('#mTime').textContent)} · ${esc(M.summary || '')}</div></div></div>`;
  const present = new Set(M.items.map(x => x.pattern));
  $('#defs').innerHTML = DEFS.map(d => {
    const got = M.items.filter(x => M.placed.get(x.id) === d.k);
    return `<button class="def card p-4 text-left flex flex-col gap-1.5 ${M.sel ? 'hover:border-acc ring-1 ring-acc/30' : ''}" data-pat="${d.k}" aria-label="${esc(d.name)}${M.sel ? ': drop the selected chart here' : ''}">
      <span class="flex items-center justify-between gap-2"><span class="text-[14px] font-semibold">${esc(d.name)}</span><span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-panel2 text-ink3 whitespace-nowrap">${esc(d.kind)}</span></span>
      <span class="text-[12.5px] text-ink2 leading-relaxed"><b class="text-ink font-semibold">Structure:</b> ${esc(d.s)}</span>
      <span class="text-[12.5px] text-ink2 leading-relaxed"><b class="text-ink font-semibold">Risk profile:</b> ${esc(d.r)}</span>
      ${got.length ? `<span class="flex flex-wrap gap-1 mt-1">${got.map(x => `<img src="${esc(x.src)}" alt="${esc(x.title)}" title="${esc(x.title)}" class="pop w-14 h-10 object-cover object-left rounded ring-1 ring-buy/60">`).join('')}</span>` : ''}
      ${!present.has(d.k) ? '<span class="text-[10.5px] text-ink3 mt-auto">Not in this round</span>' : ''}</button>`;
  }).join('');
  bindMatch(); icons();
}
function tryPlace(id, k) {
  const x = M.items.find(x => x.id === id), card = $(`#defs [data-pat="${CSS.escape(k)}"]`); if (!x || M.done) return;
  if (x.pattern === k) {
    M.placed.set(id, k); M.score += 10; M.sel = null;
    if (M.placed.size === M.items.length) {
      M.done = true; clearInterval(M.timer); const secs = Math.floor((Date.now() - M.t0) / 1000); const bonus = Math.max(0, M.items.length * 10 - secs); M.score += bonus;
      M.summary = `time bonus +${bonus}`; const best = store.get(bestKey(), null);
      if (!best || M.score > best.score) { store.set(bestKey(), { score: M.score, secs, ts: Date.now() }); M.summary += ' · new best!'; }
    }
    renderMatch();
  } else {
    M.score -= 3; $('#mScore').textContent = M.score;
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake', 'border-sell'); setTimeout(() => card.classList.remove('border-sell'), 600); }
  }
}
function bindMatch() {
  $$('#tray .thumb').forEach(b => {
    let start = null, ghost = null;
    b.addEventListener('pointerdown', e => { if (e.button !== 0 && e.pointerType === 'mouse') return; start = { x: e.clientX, y: e.clientY }; b.setPointerCapture(e.pointerId); });
    b.addEventListener('pointermove', e => {
      if (!start) return;
      if (!ghost && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) { ghost = b.cloneNode(true); ghost.classList.add('ghost'); ghost.style.width = '150px'; document.body.appendChild(ghost); b.style.opacity = '.35'; }
      if (ghost) { ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-pat]'); $$('#defs [data-pat]').forEach(c => c.classList.toggle('drop-hot', c === t)); }
    });
    const end = e => {
      if (!start) return; const wasDrag = !!ghost; start = null;
      if (ghost) { ghost.remove(); ghost = null; b.style.opacity = ''; $$('#defs .drop-hot').forEach(c => c.classList.remove('drop-hot')); const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-pat]'); if (t) tryPlace(b.dataset.id, t.dataset.pat); }
      if (!wasDrag) { M.sel = M.sel === b.dataset.id ? null : b.dataset.id; renderMatch(); const nb = $(`#tray [data-id="${CSS.escape(b.dataset.id)}"]`); nb && nb.focus(); }
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', () => { start = null; if (ghost) { ghost.remove(); ghost = null; b.style.opacity = ''; } });
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); M.sel = M.sel === b.dataset.id ? null : b.dataset.id; renderMatch(); const f = M.sel ? $('#defs [data-pat]') : $(`#tray [data-id="${CSS.escape(b.dataset.id)}"]`); f && f.focus(); } });
  });
  $$('#defs [data-pat]').forEach(c => c.addEventListener('click', () => { if (M.sel) { const id = M.sel; tryPlace(id, c.dataset.pat); if (M.placed.has(id)) { const n = $('#tray .thumb'); n && n.focus(); } } }));
  $$('#tray [data-z]').forEach(b => b.addEventListener('click', () => { const x = EX.find(x => x.id === b.dataset.z); if (x) openPreview(x); }));
}
$('#mNew').onclick = newRound;
$$('#countSeg [data-count]').forEach(b => b.addEventListener('click', () => { setCount(b.dataset.count); newRound(); }));
function setCount(n) { $('#mCount').value = n; $$('#countSeg [data-count]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.count === n))); moveThumb($('#countSeg')); }
let prevFocus = null;
function openPreview(x) { prevFocus = document.activeElement; $('#previewImg').src = x.src; $('#previewImg').alt = x.title; const p = $('#preview'); p.classList.remove('hidden'); p.classList.add('flex'); $('#previewClose').focus(); }
function closePreview() { const p = $('#preview'); p.classList.add('hidden'); p.classList.remove('flex'); prevFocus && prevFocus.focus && prevFocus.focus(); }
$('#previewClose').onclick = closePreview;
$('#preview').addEventListener('click', e => { if (e.target.id === 'preview') closePreview(); });

// ─────────── app chrome: segmented thumbs, filter sheet, trade sheet, full window ───────────
function moveThumb(seg) {
  if (!seg) return; const th = seg.querySelector('.seg-thumb'), on = seg.querySelector('[aria-selected="true"], [aria-checked="true"]');
  if (!th || !on || !on.offsetWidth) return;
  th.style.width = on.offsetWidth + 'px'; th.style.transform = `translateX(${on.offsetLeft}px)`;
}
try { new ResizeObserver(() => { moveThumb($('#modeSeg')); moveThumb($('#countSeg')); }).observe(document.body); } catch { /* thumbs re-measure on tab change */ }
// Filters: inline on wide screens, a modal bottom sheet on phones.
let filterReturn = null;
function openFilters() { if (!filterSheetMq.matches) return; filterReturn = document.activeElement; const f = $('#filters'); f.classList.add('open'); f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); $('#scrim').classList.add('on'); $('#filtersBtn').setAttribute('aria-expanded', 'true'); setTimeout(() => $('#fMentor').focus({ preventScroll: true }), 60); }
function closeFilters(restore) { const f = $('#filters'); if (!f.classList.contains('open')) return; f.classList.remove('open'); f.removeAttribute('role'); f.removeAttribute('aria-modal'); $('#scrim').classList.remove('on'); $('#filtersBtn').setAttribute('aria-expanded', 'false'); if (restore && filterReturn && filterReturn.focus) filterReturn.focus({ preventScroll: true }); }
$('#filtersBtn').onclick = openFilters;
$('#filtersDone').onclick = () => closeFilters(true);
$('#scrim').onclick = () => closeFilters(true);
// Trade sheet (phones): a peek with the side picker and Reveal; drag or tap the handle for the rest.
const sheet = $('#tradeSheet');
function setSheet(open) {
  sheet.dataset.open = String(!!open); sheet.style.transform = '';
  const h = $('#sheetToggle'); h.setAttribute('aria-expanded', String(!!open)); h.setAttribute('aria-label', open ? 'Hide trade details' : 'Show trade details');
}
(() => {
  const h = $('#sheetToggle'); let d = null;
  const closedY = () => { const peek = $('.ts-peek'); return Math.max(0, sheet.offsetHeight - (peek.offsetTop + peek.offsetHeight + 12)); };
  h.addEventListener('pointerdown', e => {
    if (!compact() || (e.pointerType === 'mouse' && e.button)) return;
    h.setPointerCapture(e.pointerId);
    const y0 = sheet.dataset.open === 'true' ? 0 : closedY();
    d = { id: e.pointerId, sy: e.clientY, y0, y: y0, moved: false, hist: [[e.clientY, performance.now()]] };
  });
  h.addEventListener('pointermove', e => {
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.sy; if (!d.moved && Math.abs(dy) < 6) return;
    if (!d.moved) { d.moved = true; sheet.style.transition = 'none'; }
    const max = closedY(); let y = d.y0 + dy;
    if (y < 0) y = -Math.sqrt(-y) * 2;            // rubber band past fully open
    if (y > max) y = max + (y - max) * 0.25;      // and past the peek
    d.y = y; sheet.style.transform = `translateY(${y}px)`;
    d.hist.push([e.clientY, performance.now()]); if (d.hist.length > 5) d.hist.shift();
  });
  const end = e => {
    if (!d || d.id !== e.pointerId) return; const was = d; d = null;
    sheet.style.transition = '';
    if (!was.moved) { setSheet(sheet.dataset.open !== 'true'); return; }
    const a = was.hist[0], b = was.hist[was.hist.length - 1], v = (b[0] - a[0]) / Math.max(1, b[1] - a[1]) * 1000; // px/s
    setSheet(was.y + v * 0.18 < closedY() / 2); // project the flick, then snap to the nearer state
  };
  h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
})();
try { [compactMq, filterSheetMq].forEach(m => m.addEventListener('change', () => { closeFilters(); setSheet(false); fit(); })); } catch { /* old Safari: layout still follows CSS */ }
// The app sets the full-window link (a per-session blob URL) when it embeds this page; standalone it stays hidden.
(() => { const f = $('#fullBtn'); const sync = () => { f.hidden = !f.getAttribute('href'); }; try { new MutationObserver(sync).observe(f, { attributes: true, attributeFilter: ['href'] }); } catch { /* static */ } sync(); })();

// ─────────── prefs ───────────
function savePrefs() { store.set(K_PREF, { tool: S.tool, color: S.color, tab: S.tab, chart: S.ex && S.ex.id }); }

// ─────────── boot ───────────
(async () => {
  icons();
  const pref = store.get(K_PREF, {}) || {};
  setColor(COLORS.includes(pref.color) ? pref.color : COLORS[0]);
  setTool(['cursor', 'hline', 'trend', 'rect', 'fib', 'pen', 'eraser'].includes(pref.tool) ? pref.tool : 'hline');
  await load();
  refreshFilters();
  if (!EX.length) { showEmpty('No exercises found.'); return; }
  const want = new URLSearchParams(location.search).get('chart') || pref.chart;
  loadEx(EX.find(x => x.id === want) || S.list[Math.floor(Math.random() * S.list.length)]);
  setTab(['blind', 'match', 'hist'].includes(pref.tab) ? pref.tab : 'blind');
  requestAnimationFrame(() => { moveThumb($('#modeSeg')); moveThumb($('#countSeg')); });
})();
})();
