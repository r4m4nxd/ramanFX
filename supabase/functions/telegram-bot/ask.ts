// /ask from Telegram: keyword (BM25) search over the app's lesson passages (public/ask/passages.json, the same file the
// Ask page uses; no model download on the edge). Pure: the index is built once per instance from the loaded JSON.
// The answer is the mentors' own words: the top 2-3 passages with mentor + lesson and an [Open lesson] button.

export interface AskLesson { src: string; n: number; title: string }
export interface AskPassage { l: number; h: string; t: string }
export interface AskIndex { lessons: AskLesson[]; passages: AskPassage[]; post: Map<string, [number, number][]>; len: Float32Array; avg: number }
export interface AskHit { p: AskPassage; lesson: AskLesson; score: number }

const STOP = new Set(('a an and are as at be been but by can could do does did for from has have he her his how i if in into is it its ' +
  'me my of on or our she should so than that the their them then there these they this to was we were what when where which who why ' +
  'will with would you your about use using used get make kevin raja seiden baker sam mentor mentors say says said tell explain ' +
  'mean means meaning instead vs versus ask question').split(' '));
const stem = (w: string) => (w.length > 4 && w.endsWith('ies') ? `${w.slice(0, -3)}y` : w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);
export function terms(s: string): string[] {
  const words = s.toLowerCase().match(/[a-z0-9][a-z0-9'-]*[a-z0-9]|[a-z0-9]/g) ?? [];
  return words.filter(w => w.length >= 2 && !STOP.has(w)).map(stem);
}

export function buildIndex(js: unknown): AskIndex | null {
  const o = js as { lessons?: AskLesson[]; passages?: AskPassage[] } | null;
  if (!o || !Array.isArray(o.lessons) || !Array.isArray(o.passages) || !o.passages.length) return null;
  const post = new Map<string, [number, number][]>();
  const len = new Float32Array(o.passages.length);
  let total = 0;
  o.passages.forEach((p, i) => {
    const ts = terms(`${p.h ?? ''} ${p.t ?? ''}`);
    len[i] = ts.length;
    total += ts.length;
    const tf = new Map<string, number>();
    for (const t of ts) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const [t, n] of tf) {
      let l = post.get(t);
      if (!l) { l = []; post.set(t, l); }
      l.push([i, n]);
    }
  });
  return { lessons: o.lessons, passages: o.passages, post, len, avg: total / o.passages.length || 1 };
}

/** BM25 (k1 1.2, b 0.75) + a bonus when two query words sit next to each other in the passage. */
export function search(ix: AskIndex, q: string, k = 3): AskHit[] {
  const qs = [...new Set(terms(q))];
  if (!qs.length) return [];
  const N = ix.passages.length, sc = new Map<number, number>();
  for (const t of qs) {
    const l = ix.post.get(t);
    if (!l) continue;
    const idf = Math.log(1 + (N - l.length + 0.5) / (l.length + 0.5));
    for (const [i, tf] of l) sc.set(i, (sc.get(i) ?? 0) + idf * (tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * ix.len[i] / ix.avg)));
  }
  const top = [...sc.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
  const pairs = qs.slice(1).map((t, j) => `${qs[j]} ${t}`);
  const out = top.map(([i, s]) => {
    const p = ix.passages[i];
    const words = terms(`${p.h} ${p.t}`).join(' ');
    const bonus = pairs.filter(pr => words.includes(pr)).length * 1.5;
    return { p, lesson: ix.lessons[p.l] ?? { src: 'course', n: 0, title: '' }, score: s + bonus };
  }).sort((a, b) => b.score - a.score);
  const seen = new Set<string>(), hits: AskHit[] = [];
  for (const h of out) {                       // one passage per lesson, max k
    const key = `${h.lesson.src}:${h.lesson.n}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push(h);
    if (hits.length >= k) break;
  }
  return hits;
}

const MENTOR: Record<string, string> = { course: 'Kevin · course', zoom: 'Kevin · Sunday live', daily: 'Kevin · daily', raja: 'Raja', seiden: 'Sam Seiden', baker: 'Kevin Baker', glossary: 'Glossary' };
export const mentorOf = (src: string) => MENTOR[src] ?? src;
/** The app's Learn URL for a lesson (same as src/core/ask/sources.ts askHref). */
export function lessonPath(src: string, n: number): string {
  if (src === 'glossary') return '/learn?src=glossary';
  if (src === 'course') return `/learn?l=${n}`;
  return `/learn?src=${encodeURIComponent(src)}&l=${n}`;
}

/** ~n chars of a passage around its best-matching sentence (most distinct query terms), with … where it was cut. */
export function bestQuote(text: string, q: string, n = 300): string {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const qs = new Set(terms(q));
  const sents = s.match(/[^.!?]+(?:[.!?]+["”’)]*\s*|$)/g) ?? [s];
  const score = (x: string) => new Set(terms(x).filter(t => qs.has(t))).size;
  let best = 0;
  sents.forEach((x, i) => { if (score(x) > score(sents[best])) best = i; });
  let a = best, b = best + 1, len = sents[best].length;
  for (;;) {                                     // grow forward first (the explanation usually follows), then back
    if (b < sents.length && len + sents[b].length <= n) { len += sents[b++].length; continue; }
    if (a > 0 && len + sents[a - 1].length <= n) { len += sents[--a].length; continue; }
    break;
  }
  let out = sents.slice(a, b).join('').trim(), tail = b < sents.length;
  if (out.length > n) {                          // one long sentence: cut at a word
    const cut = out.slice(0, n);
    out = cut.slice(0, Math.max(cut.lastIndexOf(' '), n - 20)).replace(/[,;:\s]+$/, '');
    tail = true;
  }
  return `${a > 0 ? '…' : ''}${out}${tail ? '…' : ''}`;
}
