// "Cradle to grave" trade checklists, one per mentor: the whole trade life cycle as short imperative bullets,
// grouped into stages, plus a hard "Never" list and the visual cues to recognise on any bare chart.
// Every bullet cites the lesson it comes from (L7 = lesson 7 in that mentor's notes in Learn; dates = Raja's live sessions).
// Key words for the memorize (cloze) drill are wrapped in {braces} inside the text.
import { RAJA_CHECKLIST } from './raja';
import { KEVIN_CHECKLIST } from './kevin';
import { SEIDEN_CHECKLIST } from './seiden';
import { BAKER_CHECKLIST } from './baker';

export type ChecklistMentor = 'raja' | 'kevin' | 'seiden' | 'baker';

/** [text, source tag, optional "differs from Raja" note]. */
export type RawItem = readonly [text: string, src: string, diff?: string];
export interface RawStage { title: string; goal?: string; items: readonly RawItem[] }
export interface ChecklistDef {
  name: string;
  short: string;
  /** One line under the title: who this is and how they rank for the owner. */
  tagline: string;
  stages: readonly RawStage[];
  never: readonly RawItem[];
  visual: readonly RawItem[];
  /** Notes printed at the foot of the sheet (rule conflicts and how they were settled). */
  notes?: readonly string[];
}

export interface CheckItem {
  /** Stable per position: mentor.stage.index (ticks and recall scores are stored under it). */
  id: string;
  /** Plain text with the cloze braces removed. */
  text: string;
  /** Text split into plain and key parts, for the cloze drill. */
  parts: { t: string; key: boolean }[];
  src: string;
  diff?: string;
}
export interface Stage { id: string; n: number | null; title: string; goal?: string; kind: 'stage' | 'never' | 'visual'; items: CheckItem[] }
export interface Checklist { id: ChecklistMentor; name: string; short: string; tagline: string; stages: Stage[]; notes: readonly string[]; count: number }

const RAW: Record<ChecklistMentor, ChecklistDef> = { raja: RAJA_CHECKLIST, kevin: KEVIN_CHECKLIST, seiden: SEIDEN_CHECKLIST, baker: BAKER_CHECKLIST };
export const MENTOR_ORDER: ChecklistMentor[] = ['raja', 'kevin', 'seiden', 'baker'];

/** Split "Trade {strong} zones" into parts; with no braces, the longest word or two become the keys. */
function partsOf(raw: string): CheckItem['parts'] {
  if (raw.includes('{')) {
    const out: CheckItem['parts'] = [];
    raw.split(/(\{[^}]+\})/).forEach(s => { if (!s) return; const key = s.startsWith('{') && s.endsWith('}'); out.push({ t: key ? s.slice(1, -1) : s, key }); });
    return out;
  }
  const words = raw.split(/(\s+)/);
  const ranked = words.map((w, i) => ({ w: w.replace(/[^A-Za-z0-9%:.-]/g, ''), i })).filter(x => x.w.length >= 5).sort((a, b) => b.w.length - a.w.length).slice(0, 2).map(x => x.i);
  return words.map((t, i) => ({ t, key: ranked.includes(i) }));
}

function item(m: ChecklistMentor, sid: string, i: number, [text, src, diff]: RawItem): CheckItem {
  const parts = partsOf(text);
  return { id: `${m}.${sid}.${i}`, text: parts.map(p => p.t).join(''), parts, src, diff };
}

function build(m: ChecklistMentor): Checklist {
  const d = RAW[m];
  const stages: Stage[] = d.stages.map((s, k) => ({ id: `s${k}`, n: k, title: s.title, goal: s.goal, kind: 'stage', items: s.items.map((x, i) => item(m, `s${k}`, i, x)) }));
  stages.push({ id: 'never', n: null, title: 'Never', goal: 'Hard no-trade rules. One yes here and the trade is off.', kind: 'never', items: d.never.map((x, i) => item(m, 'never', i, x)) });
  stages.push({ id: 'visual', n: null, title: 'See it on any chart', goal: 'Recognise these on a bare chart, no indicator or bot needed.', kind: 'visual', items: d.visual.map((x, i) => item(m, 'visual', i, x)) });
  return { id: m, name: d.name, short: d.short, tagline: d.tagline, stages, notes: d.notes ?? [], count: stages.reduce((a, s) => a + s.items.length, 0) };
}

export const CHECKLISTS: Record<ChecklistMentor, Checklist> = { raja: build('raja'), kevin: build('kevin'), seiden: build('seiden'), baker: build('baker') };
export const isChecklistMentor = (v: string | null | undefined): v is ChecklistMentor => v === 'raja' || v === 'kevin' || v === 'seiden' || v === 'baker';
