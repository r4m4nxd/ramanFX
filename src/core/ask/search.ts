// "Ask your mentors" retrieval core, shared by the browser (src/pages/Ask.tsx) and the Node build / eval script.
// Index format (public/ask/index.bin, little-endian):
//   bytes 0-3 "ASK1" | uint32 count | uint32 dim | uint32 reserved
//   float32 scale[count]          (vector i ≈ int8[i] * scale[i]; vectors are L2-normalised before quantising)
//   int8 vec[count * dim]
// public/ask/passages.json holds the text (AskMeta below); passage i matches vector i.
import type { AskSourceId } from './sources';

export const ASK_MODEL = 'Xenova/multilingual-e5-small';
export const ASK_DTYPE = 'q8';

export interface AskLesson { src: AskSourceId; n: number; title: string }
/** l = index into lessons, h = heading, t = the passage as written in the lesson. */
export interface AskPassage { l: number; h: string; t: string }
export interface AskMeta { model: string; dim: number; count: number; built: string; lessons: AskLesson[]; passages: AskPassage[] }

export interface AskIndex extends AskMeta { vecs: Int8Array; scales: Float32Array; lower: string[] }

export interface AskHit { i: number; score: number; cos: number; boost: number; passage: AskPassage; lesson: AskLesson }

/** What gets embedded for a passage (the lesson title and heading give a short point its context). */
export const passageText = (lesson: AskLesson, p: AskPassage) => `passage: ${lesson.title}. ${p.h}. ${p.t}`;
export const queryText = (q: string) => `query: ${q.trim()}`;

export function encodeIndex(vectors: Float32Array[], dim: number): Uint8Array {
  const n = vectors.length;
  const buf = new ArrayBuffer(16 + 4 * n + n * dim);
  const dv = new DataView(buf);
  dv.setUint8(0, 65); dv.setUint8(1, 83); dv.setUint8(2, 75); dv.setUint8(3, 49); // "ASK1"
  dv.setUint32(4, n, true); dv.setUint32(8, dim, true); dv.setUint32(12, 0, true);
  const scales = new Float32Array(buf, 16, n);
  const q = new Int8Array(buf, 16 + 4 * n, n * dim);
  vectors.forEach((v, i) => {
    let m = 0;
    for (let d = 0; d < dim; d++) m = Math.max(m, Math.abs(v[d]));
    const s = m > 0 ? m / 127 : 1;
    scales[i] = s;
    for (let d = 0; d < dim; d++) q[i * dim + d] = Math.max(-127, Math.min(127, Math.round(v[d] / s)));
  });
  return new Uint8Array(buf);
}

export function parseIndex(bin: ArrayBuffer, meta: AskMeta): AskIndex {
  const dv = new DataView(bin);
  const magic = String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3));
  if (magic !== 'ASK1') throw new Error('Not an Ask index');
  const count = dv.getUint32(4, true), dim = dv.getUint32(8, true);
  if (count !== meta.passages.length || dim !== meta.dim) throw new Error('Index and passages are out of sync; run npm run ask:index');
  return {
    ...meta, count, dim,
    scales: new Float32Array(bin, 16, count),
    vecs: new Int8Array(bin, 16 + 4 * count, count * dim),
    lower: meta.passages.map(p => `${p.h} ${p.t}`.toLowerCase()),
  };
}

// Words that carry no search meaning; everything else in the query is a keyword candidate.
const STOP = new Set(('a an and are as at be been but by can could do does did for from has have he her his how i if in into is it its ' +
  'me my of on or our she should so than that the their them then there these they this to was we were what when where which who why ' +
  'will with would you your about use using used get make kevin raja seiden baker sam mentor mentors say says said tell explain ' +
  'mean means meaning instead vs versus').split(' '));

/** Query keywords: lower-case words of 2+ characters that are not stop words. */
export function keywords(q: string): string[] {
  const words = q.toLowerCase().match(/[a-z0-9][a-z0-9:'/-]*[a-z0-9]|[a-z0-9]/g) ?? [];
  return [...new Set(words.filter(w => w.length >= 2 && !STOP.has(w)))];
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface SearchOpts {
  k?: number;
  sources?: ReadonlySet<AskSourceId>;
  /** Weight of the keyword boost (added to cosine, which for e5 sits around 0.75-0.9). */
  boost?: number;
  /** At most this many hits from one lesson, so one long lesson does not fill the page. */
  perLesson?: number;
}

/**
 * Hybrid ranking: cosine(query, passage) on the int8 vectors, plus a keyword boost =
 * boost × (idf-weighted share of the query keywords the passage contains, as word prefixes) + a bonus for adjacent keyword pairs.
 * Rare terms ("proximal", "wow", "realignment") weigh most, so an exact term match lifts a passage above near-synonyms.
 */
export function search(idx: AskIndex, qvec: ArrayLike<number>, query: string, opts: SearchOpts = {}): AskHit[] {
  const { k = 8, sources, boost = 0.06, perLesson = 2 } = opts;
  const { count, dim, vecs, scales, lower, passages, lessons } = idx;
  const allow = sources && sources.size ? sources : null;
  const terms = keywords(query);
  const res = terms.map(t => new RegExp(`(^|[^a-z0-9])${esc(t)}`));
  // idf over the whole index (cheap: a few regex tests per passage)
  const hasTerm = terms.map(() => new Uint8Array(count));
  const idf = terms.map((_, j) => {
    let df = 0;
    const t = terms[j];
    for (let i = 0; i < count; i++) if (lower[i].includes(t) && res[j].test(lower[i])) { hasTerm[j][i] = 1; df++; }
    return df ? Math.log(1 + count / df) : 0;
  });
  const idfSum = idf.reduce((a, b) => a + b, 0);
  const pairs = terms.slice(1).map((t, j) => `${terms[j]} ${t}`);
  const q = Float32Array.from(qvec as ArrayLike<number>);
  const scored: { i: number; score: number; cos: number; boost: number }[] = [];
  for (let i = 0; i < count; i++) {
    if (allow && !allow.has(lessons[passages[i].l].src)) continue;
    let dot = 0;
    const off = i * dim;
    for (let d = 0; d < dim; d++) dot += q[d] * vecs[off + d];
    const cos = dot * scales[i];
    let b = 0;
    if (idfSum > 0) {
      let m = 0;
      for (let j = 0; j < terms.length; j++) if (hasTerm[j][i]) m += idf[j];
      b = boost * (m / idfSum);
      for (const p of pairs) if (lower[i].includes(p)) b += boost * 0.25;
    }
    scored.push({ i, score: cos + b, cos, boost: b });
  }
  scored.sort((a, b) => b.score - a.score);
  const out: AskHit[] = [];
  const per = new Map<number, number>();
  for (const s of scored) {
    const l = passages[s.i].l;
    const c = per.get(l) ?? 0;
    if (c >= perLesson) continue;
    per.set(l, c + 1);
    out.push({ ...s, passage: passages[s.i], lesson: lessons[l] });
    if (out.length >= k) break;
  }
  return out;
}
