import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Card, cx, Page, Segmented, Sheet, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { IN_APP, isPine, PLATFORMS, TOOLS, toolUrl, type Platform, type PresetGroup, type Tool, type ToolFile } from '@/core/tools/manifest';

type Pill = Platform | 'app';
const PILLS: { value: Pill; label: string }[] = [...PLATFORMS, { value: 'app', label: 'In-app' }];
const KEY = 'rfx_tools_pill';
const isPill = (v: string | null): v is Pill => !!v && PILLS.some(p => p.value === v);
const readPill = (): Pill => { try { const v = localStorage.getItem(KEY); return isPill(v) ? v : 'mt5'; } catch { return 'mt5'; } };
const savePill = (v: Pill) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };

const sizeOf = (file: string) => {
  const b = __TOOL_SIZES__[file];
  if (b == null) return '';
  return b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;
};

// ─── Fetch + copy ────────────────────────────────────────────────────
const texts = new Map<string, Promise<string>>();
function fetchText(file: string) {
  let p = texts.get(file);
  if (!p) {
    p = fetch(toolUrl(file)).then(r => { if (!r.ok) throw new Error(String(r.status)); return r.text(); });
    p.catch(() => texts.delete(file));
    texts.set(file, p);
  }
  return p;
}
function legacyCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
  const ok = document.execCommand('copy');
  ta.remove();
  if (!ok) throw new Error('copy failed');
}
/** iPhone Safari drops the tap's permission once a fetch is awaited, so hand the clipboard a promise (ClipboardItem) instead. */
async function copyFile(file: string) {
  const C = (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem;
  if (C && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([new C({ 'text/plain': fetchText(file).then(t => new Blob([t], { type: 'text/plain' })) })]);
      return;
    } catch { /* fall through */ }
  }
  const text = await fetchText(file);
  try { await navigator.clipboard.writeText(text); } catch { legacyCopy(text); }
}
function useCopy() {
  const toast = useToast();
  return useCallback(async (file: string) => {
    try { await copyFile(file); toast(`Copied ${file}`, 'ok'); }
    catch { toast(navigator.onLine ? `Could not copy ${file}. Use View, then select all.` : 'You are offline. Copy needs the file once online.', 'error'); }
  }, [toast]);
}

// ─── Code viewer ─────────────────────────────────────────────────────
function Viewer({ file, onClose }: { file: string | null; onClose: () => void }) {
  const [text, setText] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  const copy = useCopy();
  useEffect(() => {
    if (!file) return;
    let live = true;
    setText(null); setErr(false);
    fetchText(file).then(t => { if (live) setText(t); }, () => { if (live) setErr(true); });
    return () => { live = false; };
  }, [file]);
  return (
    <Sheet open={!!file} onClose={onClose} title={file ?? ''} width={760}>
      {file && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className="btn-primary" onClick={() => void copy(file)}><Icon name="copy" size={14} />Copy code</button>
            <a className="btn" href={toolUrl(file)} download><Icon name="download" size={14} />Download</a>
            <span className="text-xs text-ink3 num ml-auto">{sizeOf(file)}{text ? ` · ${text.split('\n').length.toLocaleString()} lines` : ''}</span>
          </div>
          {err ? <p className="text-sm text-loss">Could not load the file{navigator.onLine ? '.' : ': you are offline.'}</p>
            : text == null ? <div className="skeleton h-64" aria-busy="true" aria-label="Loading" />
            : <pre className="font-mono text-[11.5px] leading-[1.55] text-ink2 bg-raised/60 border border-line rounded-xl p-3 overflow-x-auto whitespace-pre select-text">{text}</pre>}
        </div>
      )}
    </Sheet>
  );
}

// ─── Rows ────────────────────────────────────────────────────────────
function FileRow({ f, onView, compact }: { f: ToolFile; onView: (file: string) => void; compact?: boolean }) {
  const copy = useCopy();
  const pine = isPine(f.file);
  return (
    <li className={cx('flex flex-wrap items-center gap-x-3 gap-y-2', compact ? 'py-2' : 'py-2.5')}>
      <div className="min-w-0 flex-1 basis-[200px]">
        <div className="font-mono text-[12px] text-ink break-all leading-snug">{f.file}</div>
        <div className="text-[11.5px] text-ink3 mt-0.5">{[f.note, sizeOf(f.file)].filter(Boolean).join(' · ')}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {pine && <button type="button" className="btn-primary h-8 px-3 text-xs" onClick={() => void copy(f.file)}><Icon name="copy" size={13} />Copy code</button>}
        <button type="button" className="btn h-8 px-3 text-xs" onClick={() => onView(f.file)} aria-label={`View ${f.file}`}><Icon name="code" size={13} />View</button>
        <a className={cx(pine ? 'btn' : 'btn-primary', 'h-8 px-3 text-xs')} href={toolUrl(f.file)} download aria-label={`Download ${f.file}`}><Icon name="download" size={13} />{compact ? '' : 'Download'}</a>
      </div>
    </li>
  );
}

function Presets({ g, onView }: { g: PresetGroup; onView: (file: string) => void }) {
  const list = <ul className="divide-y divide-line">{g.files.map(f => <FileRow key={f.file} f={f} onView={onView} compact />)}</ul>;
  if (g.collapsed) {
    return (
      <details className="group rounded-xl border border-line px-3">
        <summary className="flex items-center gap-2 py-2.5 cursor-pointer list-none text-[13px] font-semibold select-none">
          <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3" /><span className="whitespace-nowrap">{g.title}</span>
          <span className="text-ink3 font-normal text-xs">{g.files.length}</span>
        </summary>
        {g.note && <p className="text-[11.5px] text-ink3 -mt-1">{g.note}</p>}
        {list}
      </details>
    );
  }
  return (
    <div>
      <div className="flex items-baseline gap-2 flex-wrap"><h4 className="label">{g.title}</h4>{g.note && <span className="text-[11.5px] text-ink3">{g.note}</span>}</div>
      {list}
    </div>
  );
}

function ToolCard({ t, onView }: { t: Tool; onView: (file: string) => void }) {
  const multi = t.files.length > 1;
  return (
    <Card aria-label={`${t.name} ${t.version}`}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name={t.kind === 'Script' ? 'download' : t.kind === 'Expert Advisor' ? 'target' : t.kind === 'Strategy' ? 'reports' : 'layers'} size={18} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[15px] font-semibold">{t.name}</h3>
            <Badge tone="accent" className="num">{/^\d/.test(t.version) ? `v${t.version}` : t.version}</Badge>
            <Badge>{t.kind}</Badge>
            {t.demoOnly && <Badge tone="warn">Demo only</Badge>}
          </div>
          <p className="text-[13px] text-ink2 leading-relaxed mt-1">{t.purpose}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="label">{multi ? 'Files · keep them in the same folder' : 'File'}</h4>
        <ul className="divide-y divide-line">{t.files.map(f => <FileRow key={f.file} f={f} onView={onView} />)}</ul>
      </div>

      <div className="mt-3">
        <h4 className="label mb-2">Install</h4>
        <ol className="flex flex-col gap-1.5">
          {t.install.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink2">
              <span className="num w-5 h-5 rounded-full grid place-items-center text-[10.5px] font-semibold shrink-0 bg-accent/10 text-accent mt-px">{i + 1}</span>
              <span className="min-w-0">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {t.presets?.length ? <div className="mt-4 flex flex-col gap-3">{t.presets.map(g => <Presets key={g.title} g={g} onView={onView} />)}</div> : null}

      {t.guide && <div className="mt-4"><Link to={t.guide.to} className="btn-ghost h-8 px-3 text-accent -ml-3"><Icon name="info" size={14} />{t.guide.label}<Icon name="chevronRight" size={14} /></Link></div>}
    </Card>
  );
}

export default function Tools() {
  const [sp] = useSearchParams();
  const qp = sp.get('p');
  const [pill, setPillState] = useState<Pill>(() => (isPill(qp) ? qp : readPill()));
  const setPill = (v: Pill) => { setPillState(v); savePill(v); };
  const [view, setView] = useState<string | null>(null);
  const tools = TOOLS.filter(t => t.platform === pill);

  // Warm the Pine scripts while the TradingView pill is open, so Copy is instant (and keeps the tap's clipboard permission).
  useEffect(() => {
    if (pill !== 'tv') return;
    const h = setTimeout(() => tools.forEach(t => t.files.forEach(f => { if (isPine(f.file)) void fetchText(f.file).catch(() => {}); })), 400);
    return () => clearTimeout(h);
  }, [pill]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Page>
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-ink3 max-w-[60ch]">Every script, indicator and preset in one place. Download on a computer; on a phone, copy the Pine code straight into TradingView.</p>
        <div className="overflow-x-auto -mx-1 px-1 pb-0.5"><Segmented label="Platform" value={pill} onChange={setPill} options={PILLS} swap="page" /></div>
      </div>

      {pill === 'app' ? (
        <Card aria-label="In-app tools">
          <p className="text-[13px] text-ink3 mb-3">Built into RamanFX, nothing to install.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {IN_APP.map(a => (
              <Link key={a.to} to={a.to} className="rounded-xl border border-line hover:border-accent bg-raised/40 p-3.5 flex items-center gap-3 transition-colors">
                <span className="min-w-0 flex-1"><span className="font-semibold block text-[14px]">{a.label}</span><span className="text-[12.5px] text-ink3 block">{a.hint}</span></span>
                <Icon name="chevronRight" size={16} className="text-ink3" />
              </Link>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
          {tools.map(t => <ToolCard key={t.id} t={t} onView={setView} />)}
        </div>
      )}
      <Viewer file={view} onClose={() => setView(null)} />
    </Page>
  );
}
