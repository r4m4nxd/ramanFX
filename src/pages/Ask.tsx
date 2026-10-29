// "Ask your mentors": semantic search over every lesson, on-device. The passages were embedded at build time
// (scripts/build-ask-index.mjs); here only the question is embedded, with the same model, via transformers.js (WASM).
// transformers.js and the model load lazily, only on this page, and the browser caches the model after the first visit.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Card, cx, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ASK_SOURCE, ASK_SOURCES, askHref, type AskSourceId } from '@/core/ask/sources';
import { ASK_DTYPE, ASK_MODEL, keywords, parseIndex, queryText, search, type AskHit, type AskIndex, type AskMeta } from '@/core/ask/search';

const MODEL_FILE = `https://huggingface.co/${ASK_MODEL}/resolve/main/onnx/model_quantized.onnx`;
const EXAMPLES = ['What is a proximal line?', 'When should I use a confirmation entry instead of a limit?', 'Raja high curve low curve', 'How does Kevin remove a zone?', 'How many base candles?', 'Seiden odds enhancers'];

type Embed = (q: string) => Promise<Float32Array>;
type ModelState = { phase: 'idle' } | { phase: 'loading'; loaded: number; total: number } | { phase: 'ready' } | { phase: 'error'; message: string };

// Module-level so the index and the model survive leaving and re-opening the page.
let indexP: Promise<AskIndex> | null = null;
let embedP: Promise<Embed> | null = null;

function loadIndex(): Promise<AskIndex> {
  indexP ??= Promise.all([
    fetch('/ask/passages.json').then(r => { if (!r.ok) throw new Error(`passages.json ${r.status}`); return r.json() as Promise<AskMeta>; }),
    fetch('/ask/index.bin').then(r => { if (!r.ok) throw new Error(`index.bin ${r.status}`); return r.arrayBuffer(); }),
  ]).then(([meta, bin]) => parseIndex(bin, meta)).catch(e => { indexP = null; throw e; });
  return indexP;
}

function loadModel(onProgress: (loaded: number, total: number) => void): Promise<Embed> {
  embedP ??= (async () => {
    const tf = await import('@huggingface/transformers');
    tf.env.allowLocalModels = false;
    const files = new Map<string, { loaded: number; total: number }>();
    const fe = await tf.pipeline('feature-extraction', ASK_MODEL, {
      dtype: ASK_DTYPE, device: 'wasm',
      progress_callback: (p: { status: string; file?: string; loaded?: number; total?: number }) => {
        if (p.status !== 'progress' || !p.file) return;
        files.set(p.file, { loaded: p.loaded ?? 0, total: p.total ?? 0 });
        let l = 0, t = 0;
        files.forEach(f => { l += f.loaded; t += f.total; });
        onProgress(l, t);
      },
    });
    return async (q: string) => {
      const out = await fe(queryText(q), { pooling: 'mean', normalize: true });
      return out.data as Float32Array;
    };
  })().catch(e => { embedP = null; throw e; });
  return embedP;
}

/** True when the model is already in the browser cache (so it is safe to load it without asking). */
async function modelCached(): Promise<boolean> {
  try { return !!(await (await caches.open('transformers-cache')).match(MODEL_FILE)); } catch { return false; }
}

function highlight(text: string, terms: string[]): ReactNode {
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i} className="bg-accent/20 text-ink rounded px-0.5">{part}</mark> : part));
}

const mb = (n: number) => (n / 1024 / 1024).toFixed(0);

function QuoteCard({ hit, terms }: { hit: AskHit; terms: string[] }) {
  const s = ASK_SOURCE[hit.lesson.src];
  const gloss = hit.lesson.src === 'glossary';
  return (
    <Card className="p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Badge tone="accent">{s.mentor}</Badge>
        {!gloss && <Badge>{s.label}</Badge>}
        {!gloss && <Badge>{hit.lesson.src === 'seiden' ? `Page ${hit.lesson.n}` : `${hit.lesson.src === 'zoom' || hit.lesson.src === 'daily' ? 'Session' : 'Lesson'} ${hit.lesson.n}`}</Badge>}
      </div>
      <div className="text-[14px] font-semibold leading-snug">{gloss ? hit.passage.h : hit.lesson.title}</div>
      {!gloss && <div className="text-[12px] text-ink3 mt-0.5">{hit.passage.h}</div>}
      <blockquote className="border-l-2 border-accent pl-3 mt-3 text-[14px] leading-relaxed text-ink2 break-words">{highlight(hit.passage.t, terms)}</blockquote>
      <div className="flex items-center justify-between gap-3 mt-3">
        <span className="num text-[11px] text-ink3" title="cosine similarity + keyword boost">match {(hit.score * 100).toFixed(0)}</span>
        {s.linkable === false
          ? <span className="text-[11.5px] text-ink3">Not in Lessons yet</span>
          : <Link to={askHref(hit.lesson.src, hit.lesson.n)} className="btn h-8 px-3 text-[12.5px]">{gloss ? 'Open glossary' : 'Open lesson'}<Icon name="chevronRight" size={13} /></Link>}
      </div>
    </Card>
  );
}

export default function Ask() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const [only, setOnly] = useState<Set<AskSourceId>>(new Set());
  const [idx, setIdx] = useState<AskIndex | null>(null);
  const [idxErr, setIdxErr] = useState<string | null>(null);
  const [model, setModel] = useState<ModelState>({ phase: 'idle' });
  const [qvec, setQvec] = useState<{ q: string; v: Float32Array } | null>(null);
  const [busy, setBusy] = useState(false);
  const embedRef = useRef<Embed | null>(null);

  useEffect(() => { loadIndex().then(setIdx, e => setIdxErr(String(e.message ?? e))); }, []);
  useEffect(() => { setDraft(q); }, [q]);

  const startModel = useCallback(() => {
    if (embedRef.current) return Promise.resolve(embedRef.current);
    setModel(m => (m.phase === 'loading' ? m : { phase: 'loading', loaded: 0, total: 0 }));
    return loadModel((loaded, total) => setModel({ phase: 'loading', loaded, total })).then(
      e => { embedRef.current = e; setModel({ phase: 'ready' }); return e; },
      e => { setModel({ phase: 'error', message: String(e?.message ?? e) }); return null; },
    );
  }, []);

  // Already downloaded once? Warm the model up straight away.
  useEffect(() => { void modelCached().then(c => { if (c) void startModel(); }); }, [startModel]);

  // Embed the question whenever it (or the model) changes.
  useEffect(() => {
    if (!q.trim()) { setQvec(null); return; }
    let live = true;
    setBusy(true);
    void startModel().then(async e => {
      if (!e || !live) return;
      const v = await e(q);
      if (live) setQvec({ q, v });
    }).finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [q, startModel]);

  const terms = useMemo(() => keywords(q), [q]);
  const semantic = !!qvec && qvec.q === q;
  const hits = useMemo(() => {
    if (!idx || !q.trim()) return [];
    // Until the model is ready (or if it failed), rank on keywords alone.
    const v = semantic ? qvec!.v : new Float32Array(idx.dim);
    return search(idx, v, q, { k: 8, sources: only });
  }, [idx, q, qvec, semantic, only]);

  const ask = (text: string) => { const t = text.trim(); setSp(t ? { q: t } : {}); };
  const submit = (e: FormEvent) => { e.preventDefault(); ask(draft); };
  const toggle = (id: AskSourceId) => setOnly(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const pct = model.phase === 'loading' && model.total ? Math.min(100, (model.loaded / model.total) * 100) : 0;

  return (
    <Page className="max-w-3xl w-full mx-auto">
      <Card>
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name="sparkles" size={18} /></span>
          <div className="min-w-0">
            <h1 className="text-[20px] font-semibold tracking-tight">Ask your mentors</h1>
            <p className="text-[13.5px] text-ink2 mt-1 leading-relaxed">Search every lesson by meaning: Kevin's course, Sunday and daily sessions, Raja, Sam Seiden, Kevin Baker and the glossary. You get their own words, with a link to the lesson. Nothing is made up.</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex gap-2 mt-4" role="search">
          <input className="field flex-1 min-w-0 h-11 text-[16px]" type="search" enterKeyHint="search" placeholder="e.g. when do I use a confirmation entry?" aria-label="Your question" value={draft} onChange={e => setDraft(e.target.value)} />
          <button type="submit" className="btn-primary h-11" disabled={!draft.trim()}><Icon name="search" size={15} />Ask</button>
        </form>
        <div className="flex flex-wrap gap-1.5 mt-3" role="group" aria-label="Only search">
          <button type="button" aria-pressed={!only.size} onClick={() => setOnly(new Set())} className={cx('px-2.5 h-7 touch:h-9 touch:px-3 rounded-full text-[12px] font-medium transition-colors', !only.size ? 'bg-accent/15 text-ink ring-1 ring-accent/40' : 'text-ink2 hover:bg-raised/60')}>All</button>
          {ASK_SOURCES.filter(s => !idx || idx.lessons.some(l => l.src === s.id)).map(s => (
            <button key={s.id} type="button" aria-pressed={only.has(s.id)} onClick={() => toggle(s.id)} className={cx('px-2.5 h-7 touch:h-9 touch:px-3 rounded-full text-[12px] font-medium transition-colors', only.has(s.id) ? 'bg-accent/15 text-ink ring-1 ring-accent/40' : 'text-ink2 hover:bg-raised/60')}>{s.label}</button>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-line bg-raised/40 p-3 text-[12.5px] text-ink2 leading-relaxed" aria-live="polite">
          {model.phase === 'loading' ? (
            <>
              <div className="flex justify-between gap-2"><span>Downloading the search model (once; then it is cached)…</span><span className="num shrink-0">{model.total ? `${mb(model.loaded)} / ${mb(model.total)} MB` : 'starting'}</span></div>
              <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><div className="h-full bg-accent rounded-full transition-[width] duration-300" style={{ width: `${pct}%` }} /></div>
              <div className="mt-1.5 text-ink3">Meanwhile, results below are keyword matches only.</div>
            </>
          ) : model.phase === 'ready' ? (
            <span className="inline-flex items-center gap-1.5"><Icon name="check" size={13} className="text-profit" />Runs on your device. Your question never leaves this browser.</span>
          ) : model.phase === 'error' ? (
            <span className="text-warn">The search model could not load ({model.message}). Showing keyword matches only.</span>
          ) : (
            <span>Runs on your device: your first question downloads a ~120 MB model from Hugging Face (once, then cached). Your questions never leave this browser.</span>
          )}
        </div>
      </Card>

      {idxErr && <Card><p className="text-[13.5px] text-loss">Could not load the lesson index ({idxErr}). Run <code>npm run ask:index</code> and redeploy.</p></Card>}

      {!q && (
        <Card>
          <div className="label mb-2">Try</div>
          <div className="flex flex-wrap gap-2">{EXAMPLES.map(x => <button key={x} type="button" className="btn h-auto min-h-[36px] touch:min-h-[44px] py-2 px-3 text-[12.5px] leading-snug whitespace-normal text-left shrink max-w-full" onClick={() => ask(x)}>{x}</button>)}</div>
        </Card>
      )}

      {q && idx && (
        <div className="flex flex-col gap-3" aria-busy={busy}>
          <div className="flex items-baseline justify-between gap-2 px-1">
            <div className="label">{semantic ? 'Closest passages' : 'Keyword matches'}{only.size ? ` · ${[...only].map(s => ASK_SOURCE[s].label).join(', ')}` : ''}</div>
            {busy && <span className="text-[12px] text-ink3">thinking…</span>}
          </div>
          {hits.length ? hits.map(h => <QuoteCard key={h.i} hit={h} terms={terms} />) : <Card><p className="text-[13.5px] text-ink3">No passages match yet{only.size ? ' in the selected sources' : ''}.</p></Card>}
          <p className="text-[11.5px] text-ink3 px-1">{idx.count.toLocaleString()} passages from {idx.lessons.length - 1} lessons, built {new Date(idx.built).toLocaleDateString()}.</p>
        </div>
      )}
    </Page>
  );
}
