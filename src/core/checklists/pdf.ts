// Checklist PDF, built from the checklist data with jsPDF (lazy-loaded: import this module dynamically).
// Mirrors the print sheet in src/index.css: A4, two columns, numbered stages, tick boxes, grey source tags,
// "differs from Raja" notes, the Never list, "See it on any chart" and the notes. Fonts: built-in Helvetica only,
// so every string goes through `safe()` (Helvetica's WinAnsi set has no ≠, ≥, arrows and so on).
import { jsPDF } from 'jspdf';
import { CHECKLISTS, MENTOR_ORDER, type Checklist, type ChecklistMentor, type Stage } from './index';

export type PdfWhat = ChecklistMentor | 'all';
type RGB = readonly [number, number, number];
type Style = 'normal' | 'bold' | 'italic';

const PT = 0.3528; // mm per point
const PAGE_W = 210, PAGE_H = 297;
const M_X = 10, M_TOP = 11, M_BOTTOM = 13; // the footer sits inside the bottom margin
const GAP = 7;
const COL_W = (PAGE_W - 2 * M_X - GAP) / 2;
const NE = '\u0001'; // placeholder for a drawn "≠"

const INK: RGB = [17, 17, 17], GREY: RGB = [122, 122, 122], MUTED: RGB = [85, 85, 85], NOTE: RGB = [68, 68, 68];
const AMBER: RGB = [180, 83, 9], RED: RGB = [185, 28, 28], VIOLET: RGB = [109, 40, 217];

const BODY = 8.4, SRC = 6.2, HEAD = 9.4, NOTE_PT = 6.8;
const LH = BODY * 1.32 * PT;
const NOTE_LH = NOTE_PT * 1.35 * PT;
const ITEM_GAP = 0.9, STAGE_GAP = 3.2, BOX_INDENT = 4;
const PAD_T = 1.8, PAD_X = 2.2, PAD_B = 1.2;
const HEAD_H = 4.4, HEAD_GAP = 1.3;

const MAP: Record<string, string> = {
  '≠': '!=', '≥': '>=', '≤': '<=', '→': '->', '←': '<-', '↑': 'up', '↓': 'down', '–': '-', '—': '-', '‑': '-', '−': '-',
  '‘': "'", '’': "'", '‚': "'", '“': '"', '”': '"', '„': '"', '…': '...', '•': '·', '◉': 'o', '✓': 'v', '✗': 'x',
  ' ': ' ', ' ': ' ', ' ': ' ', '​': '',
};
/** Text Helvetica can draw: known symbols mapped to ASCII, anything else outside Latin-1 dropped. */
export function safe(s: string): string {
  return s.replace(/[^\x20-\x7e¡-ÿ]/g, ch => MAP[ch] ?? (ch === NE ? NE : ''));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dateStr = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

interface Run { text: string; size: number; style: Style; color: RGB; /** never break inside (source tags) */ keep?: boolean }
interface Piece { x: number; text: string; run: Run }

function setFont(doc: jsPDF, r: Pick<Run, 'size' | 'style'>) { doc.setFont('helvetica', r.style); doc.setFontSize(r.size); }
const width = (doc: jsPDF, r: Run, t: string) => { setFont(doc, r); return doc.getTextWidth(t.split(NE).join('=')); };

/** Greedy word wrap of mixed-size runs (bullet text, then the small source tag and diff note inline). */
function wrapRuns(doc: jsPDF, runs: Run[], maxW: number): Piece[][] {
  const lines: Piece[][] = [[]];
  let x = 0;
  for (const run of runs) {
    if (/^\s/.test(run.text) && x > 0) x += width(doc, run, ' ');
    for (const word of run.keep ? [run.text.trim()] : run.text.trim().split(/\s+/).filter(Boolean)) {
      const w = width(doc, run, word);
      if (x > 0 && x + w > maxW) { lines.push([]); x = 0; }
      lines[lines.length - 1].push({ x, text: word, run });
      x += w + width(doc, run, ' ');
    }
  }
  return lines;
}

function drawText(doc: jsPDF, text: string, x: number, y: number, run: Run) {
  setFont(doc, run);
  doc.setTextColor(...run.color);
  const parts = text.split(NE);
  let cx = x;
  parts.forEach((p, i) => {
    if (p) { doc.text(p, cx, y); cx += doc.getTextWidth(p); }
    if (i < parts.length - 1) {
      const w = doc.getTextWidth('=');
      doc.text('=', cx, y);
      const h = run.size * PT;
      doc.setDrawColor(...run.color);
      doc.setLineWidth(0.18);
      doc.line(cx + w * 0.22, y + h * 0.02, cx + w * 0.78, y - h * 0.66);
      cx += w;
    }
  });
}

function drawLines(doc: jsPDF, lines: Piece[][], x: number, top: number, lh: number, baseOff: number) {
  // Consecutive words of one run are drawn as one string, so the viewer's own spacing and kerning apply.
  lines.forEach((ln, i) => {
    const groups: Piece[] = [];
    ln.forEach(p => { const g = groups[groups.length - 1]; if (g && g.run === p.run) g.text += ' ' + p.text; else groups.push({ ...p }); });
    groups.forEach(p => drawText(doc, p.text, x + p.x, top + i * lh + baseOff, p.run));
  });
}

interface Block { kind: Stage['kind'] | 'notes'; mark: string; title: string; rows: { lines: Piece[][]; h: number }[] }

function blocksOf(doc: jsPDF, l: Checklist): Block[] {
  const textW = COL_W - BOX_INDENT;
  const out: Block[] = l.stages.map(s => {
    const boxed = s.kind !== 'stage';
    const w = textW - (boxed ? 2 * PAD_X : 0);
    return {
      kind: s.kind,
      mark: s.kind === 'never' ? '!' : s.kind === 'visual' ? '' : String(s.n),
      title: safe(s.title),
      rows: s.items.map(it => {
        const runs: Run[] = [{ text: safe(it.text), size: BODY, style: 'normal', color: INK }, { text: ' ' + safe(it.src), size: SRC, style: 'normal', color: GREY, keep: true }];
        if (it.diff) runs.push({ text: ` (${NE} ${safe(it.diff)})`, size: SRC, style: 'italic', color: AMBER });
        const lines = wrapRuns(doc, runs, w);
        return { lines, h: lines.length * LH + ITEM_GAP };
      }),
    };
  });
  if (l.notes.length) {
    out.push({
      kind: 'notes', mark: '', title: 'Notes',
      rows: l.notes.map(n => {
        const lines = wrapRuns(doc, [{ text: safe(n.replace(/≠/g, NE)), size: NOTE_PT, style: 'normal', color: NOTE }], COL_W);
        return { lines, h: lines.length * NOTE_LH + ITEM_GAP };
      }),
    });
  }
  return out;
}

const accent = (k: Block['kind']): RGB => (k === 'never' ? RED : k === 'visual' ? VIOLET : INK);

function drawHeadRow(doc: jsPDF, b: Block, x: number, y: number, cont: boolean) {
  let tx = x;
  if (b.kind !== 'notes') {
    const r = HEAD_H / 2, cx = x + r, cy = y + r;
    doc.setFillColor(...accent(b.kind));
    doc.circle(cx, cy, r, 'F');
    if (b.kind === 'visual') {
      doc.setDrawColor(255, 255, 255); doc.setLineWidth(0.35); doc.circle(cx, cy, r * 0.5, 'S');
      doc.setFillColor(255, 255, 255); doc.circle(cx, cy, r * 0.2, 'F');
    } else {
      setFont(doc, { size: 6.8, style: 'bold' });
      doc.setTextColor(255, 255, 255);
      doc.text(b.mark, cx, cy + 6.8 * PT * 0.36, { align: 'center' });
    }
    tx = x + HEAD_H + 1.8;
  }
  setFont(doc, { size: HEAD, style: 'bold' });
  doc.setTextColor(...(b.kind === 'notes' ? NOTE : INK));
  doc.text(b.title + (cont ? ' (cont.)' : ''), tx, y + HEAD_H / 2 + HEAD * PT * 0.36);
}

function drawRow(doc: jsPDF, b: Block, row: Block['rows'][number], x: number, y: number) {
  if (b.kind === 'notes') { drawLines(doc, row.lines, x, y, NOTE_LH, NOTE_LH * 0.74); return; }
  const base = LH * 0.74;
  doc.setDrawColor(68, 68, 68); doc.setLineWidth(0.25);
  doc.roundedRect(x, y + base - 2.25, 2.4, 2.4, 0.45, 0.45, 'S');
  drawLines(doc, row.lines, x + BOX_INDENT, y, LH, base);
}

/** Lay one mentor's blocks into the two-column flow. Returns nothing; pages are added as needed. */
function renderMentor(doc: jsPDF, l: Checklist, first: boolean, today: string) {
  if (!first) doc.addPage();
  // Header
  const metaRun = (t: string): Run => ({ text: t, size: 6.8, style: 'normal', color: [102, 102, 102] });
  const meta = [`RamanFX · ${today}`, `${l.count} points · cradle to grave`];
  const metaW = Math.max(...meta.map(t => width(doc, metaRun(t), t)));
  const leftW = PAGE_W - 2 * M_X - metaW - 6;
  let titleSize = 15;
  const title = safe(`${l.name} · trade checklist`);
  setFont(doc, { size: titleSize, style: 'bold' });
  while (doc.getTextWidth(title) > leftW && titleSize > 11) { titleSize -= 0.5; doc.setFontSize(titleSize); }
  let y = M_TOP + titleSize * PT * 0.8;
  doc.setTextColor(...INK);
  doc.text(title, M_X, y);
  setFont(doc, { size: 7.8, style: 'normal' });
  doc.setTextColor(...MUTED);
  const tag = doc.splitTextToSize(safe(l.tagline), leftW) as string[];
  tag.forEach(t => { y += 7.8 * PT * 1.3; doc.text(t, M_X, y); });
  const bottom = y + 0.6;
  meta.forEach((t, i) => drawText(doc, t, PAGE_W - M_X - width(doc, metaRun(t), t), bottom - (meta.length - 1 - i) * 6.8 * PT * 1.35, metaRun(t)));
  doc.setDrawColor(...INK); doc.setLineWidth(1.4 * PT);
  doc.line(M_X, bottom + 2, PAGE_W - M_X, bottom + 2);

  const colTopFirst = bottom + 2 + 3.2;
  const colTopCont = M_TOP + 6;
  const limit = PAGE_H - M_BOTTOM;
  let colTop = colTopFirst;
  let col = 0;
  y = colTop;
  const nextCol = () => {
    if (col === 0) { col = 1; y = colTop; return; }
    doc.addPage();
    col = 0; colTop = colTopCont; y = colTop;
    setFont(doc, { size: 7, style: 'normal' }); doc.setTextColor(...GREY);
    doc.text(safe(`${l.name} · trade checklist (continued)`), M_X, M_TOP + 2.4);
    doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.25); doc.line(M_X, M_TOP + 3.6, PAGE_W - M_X, M_TOP + 3.6);
  };
  const colX = () => M_X + col * (COL_W + GAP);

  for (const b of blocksOf(doc, l)) {
    const boxed = b.kind === 'never' || b.kind === 'visual';
    const padT = boxed ? PAD_T : 0, padB = boxed ? PAD_B : 0, padX = boxed ? PAD_X : 0;
    const total = padT + HEAD_H + HEAD_GAP + b.rows.reduce((a, r) => a + r.h, 0) + padB;
    if (y > colTop && y + total > limit) {
      // Keep the stage whole: move it on if it fits in a fresh column; a stage too tall for any column splits,
      // but only once its heading and two bullets fit here.
      const fresh = limit - (col === 0 ? colTop : colTopCont);
      const minPart = padT + HEAD_H + HEAD_GAP + b.rows.slice(0, 2).reduce((a, r) => a + r.h, 0) + padB;
      if (total <= fresh || y + minPart > limit) nextCol();
    }
    let i = 0;
    let cont = false;
    while (i < b.rows.length) {
      const start = y;
      y += padT;
      drawHeadRow(doc, b, colX() + padX, y, cont);
      y += HEAD_H + HEAD_GAP;
      while (i < b.rows.length && (y + b.rows[i].h + padB <= limit || y === start + padT + HEAD_H + HEAD_GAP)) {
        drawRow(doc, b, b.rows[i], colX() + padX, y);
        y += b.rows[i].h;
        i++;
      }
      y += padB;
      if (boxed) {
        doc.setDrawColor(...accent(b.kind)); doc.setLineWidth(0.8 * PT);
        doc.roundedRect(colX(), start, COL_W, y - start, 2, 2, 'S');
      }
      if (i < b.rows.length) { nextCol(); cont = true; }
    }
    y += STAGE_GAP;
  }
}

export interface ChecklistPdf { file: File; blob: Blob; name: string; title: string; pages: number }

export function buildChecklistPdf(what: PdfWhat, now = new Date()): ChecklistPdf {
  const lists = what === 'all' ? MENTOR_ORDER.map(m => CHECKLISTS[m]) : [CHECKLISTS[what]];
  const label = what === 'all' ? 'All' : CHECKLISTS[what].short;
  const title = what === 'all' ? 'RamanFX checklists - all mentors' : `RamanFX checklist - ${CHECKLISTS[what].short}`;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  doc.setProperties({ title, author: 'RamanFX', subject: 'Cradle to grave trade checklist', creator: 'RamanFX' });
  const today = dateStr(now);
  lists.forEach((l, k) => renderMentor(doc, l, k === 0, today));
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    setFont(doc, { size: 6.8, style: 'normal' });
    doc.setTextColor(...GREY);
    doc.text(`RamanFX · page ${p}/${pages}`, PAGE_W / 2, PAGE_H - 6, { align: 'center' });
  }
  const blob = doc.output('blob');
  const name = `RamanFX-checklist-${label}.pdf`;
  const file = new File([blob], name, { type: 'application/pdf', lastModified: now.getTime() });
  return { file, blob, name, title, pages };
}
