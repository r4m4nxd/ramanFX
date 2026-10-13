import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/data/store';
import type { NotebookEntry } from '@/core/types';
import { Card, cx, Empty, Page, useToast } from '@/ui/kit';
import { Icon, type IconName } from '@/ui/Icon';

type View = { kind: 'folder'; id: string } | { kind: 'all' } | { kind: 'favorites' } | { kind: 'days' } | { kind: 'trades' };

export default function Notebook() {
  const entries = useStore(s => s.notebook);
  const folders = useStore(s => s.notebookFolders);
  const dayNotes = useStore(s => s.dayNotes);
  const notes = useStore(s => s.notes);
  const trades = useStore(s => s.trades);
  const save = useStore(s => s.saveNotebook), del = useStore(s => s.deleteNotebook), saveFolder = useStore(s => s.saveFolder);
  const toast = useToast();
  const [view, setView] = useState<View>({ kind: 'all' });
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<NotebookEntry | null>(null);

  const allFolders = useMemo(() => [{ id: 'my-notes', name: 'My notes' }, ...folders.filter(f => f.id !== 'my-notes')], [folders]);
  const list = useMemo(() => {
    const ql = q.toLowerCase();
    let pool = entries;
    if (view.kind === 'favorites') pool = entries.filter(e => e.favorite);
    if (view.kind === 'folder') pool = entries.filter(e => (e.folderId || 'my-notes') === view.id);
    return pool.filter(e => !ql || e.title.toLowerCase().includes(ql) || e.body.toLowerCase().includes(ql)).sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [entries, view, q]);

  const nav: { v: View; label: string; icon: IconName; n: number }[] = [
    { v: { kind: 'all' }, label: 'All notes', icon: 'notebook', n: entries.length },
    { v: { kind: 'favorites' }, label: 'Favorites', icon: 'star', n: entries.filter(e => e.favorite).length },
    { v: { kind: 'days' }, label: 'Day reviews', icon: 'calendar', n: Object.keys(dayNotes).length },
    { v: { kind: 'trades' }, label: 'Trade notes', icon: 'trades', n: Object.values(notes).filter(n => n.note?.trim()).length },
  ];
  const same = (a: View, b: View) => a.kind === b.kind && (a.kind !== 'folder' || (b.kind === 'folder' && a.id === b.id));

  const create = () => {
    const folderId = view.kind === 'folder' ? view.id : 'my-notes';
    const tpl = folders.find(f => f.id === folderId)?.template ?? '';
    const e: NotebookEntry = { id: `nb_${Date.now()}`, title: '', body: tpl, folderId, createdAt: Date.now(), updatedAt: Date.now() };
    save(e); setSel(e);
  };

  return (
    <Page>
      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-4 items-start">
        <Card className="p-2 lg:sticky lg:top-20">
          <nav aria-label="Notebook folders" className="flex lg:flex-col gap-0.5 overflow-x-auto">
            {nav.map(n => (
              <button key={n.label} onClick={() => { setView(n.v); setSel(null); }} className={cx('flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] whitespace-nowrap', same(view, n.v) ? 'bg-raised text-ink font-medium' : 'text-ink2 hover:bg-raised/60')}>
                <Icon name={n.icon} size={15} />{n.label}<span className="ml-auto text-xs text-ink3 num">{n.n}</span>
              </button>
            ))}
            <div className="label px-3 pt-3 pb-1 hidden lg:block">Folders</div>
            {allFolders.map(f => (
              <button key={f.id} onClick={() => { setView({ kind: 'folder', id: f.id }); setSel(null); }} className={cx('flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] whitespace-nowrap', same(view, { kind: 'folder', id: f.id }) ? 'bg-raised text-ink font-medium' : 'text-ink2 hover:bg-raised/60')}>
                <Icon name="folder" size={15} />{f.name}<span className="ml-auto text-xs text-ink3 num">{entries.filter(e => (e.folderId || 'my-notes') === f.id).length}</span>
              </button>
            ))}
            <button className="flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px] text-accent whitespace-nowrap" onClick={() => { const name = prompt('Folder name'); if (name?.trim()) saveFolder({ id: `f_${Date.now()}`, name: name.trim() }); }}><Icon name="plus" size={15} />New folder</button>
          </nav>
        </Card>

        <div className="flex flex-col gap-4 min-w-0">
          {view.kind === 'days' ? (
            <Card>
              {Object.keys(dayNotes).length ? Object.entries(dayNotes).sort((a, b) => b[0].localeCompare(a[0])).map(([d, t]) => (
                <Link key={d} to={`/journal?day=${d}`} className="block py-3 border-t border-line first:border-0 hover:bg-raised/40 -mx-2 px-2 rounded-lg">
                  <div className="text-sm font-medium">{new Date(d + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <p className="text-[13px] text-ink2 mt-1 line-clamp-2 whitespace-pre-line">{t}</p>
                </Link>
              )) : <Empty icon="calendar" title="No day reviews yet">Write them on the Daily journal page.</Empty>}
            </Card>
          ) : view.kind === 'trades' ? (
            <Card>
              {Object.entries(notes).filter(([, n]) => n.note?.trim()).sort((a, b) => (b[1].updatedAt ?? 0) - (a[1].updatedAt ?? 0)).map(([id, n]) => {
                const t = trades.find(x => x.id === id);
                return (
                  <Link key={id} to={`/trades/${id}`} className="block py-3 border-t border-line first:border-0 hover:bg-raised/40 -mx-2 px-2 rounded-lg">
                    <div className="text-sm font-medium font-mono">{t ? `${t.symbol} · ${t.closeTime.slice(0, 10)}` : `#${id}`}</div>
                    <p className="text-[13px] text-ink2 mt-1 line-clamp-2">{n.note}</p>
                  </Link>
                );
              })}
            </Card>
          ) : sel ? (
            <Editor key={sel.id} entry={sel} folders={allFolders} onBack={() => setSel(null)} onSave={e => save(e)} onDelete={() => { if (confirm('Delete this note?')) { del(sel.id); setSel(null); toast('Note deleted'); } }} />
          ) : (<>
            <div className="flex gap-2">
              <div className="relative flex-1"><Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" /><input aria-label="Search notes" className="field pl-9" placeholder="Search notes" value={q} onChange={e => setQ(e.target.value)} /></div>
              <button className="btn-primary" onClick={create}><Icon name="plus" size={15} />New note</button>
            </div>
            {list.length ? (
              <div className="grid sm:grid-cols-2 gap-3">
                <AnimatePresence>
                  {list.map(e => (
                    <motion.button layout key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => setSel(e)} className="card p-4 text-left hover:border-line2 transition-colors">
                      <div className="flex items-start gap-2"><h3 className="font-semibold truncate flex-1">{e.title || 'Untitled'}</h3>{e.favorite && <Icon name="star" size={14} className="text-warn" fill="currentColor" />}</div>
                      <p className="text-[13px] text-ink3 mt-1.5 line-clamp-3 whitespace-pre-line">{e.body || 'Empty note'}</p>
                      <div className="text-[11px] text-ink3 mt-3">{e.updatedAt ? new Date(e.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            ) : <Card><Empty icon="notebook" title="No notes here" action={<button className="btn-primary" onClick={create}>Write one</button>}>Plans, market reads, lessons — anything worth keeping.</Empty></Card>}
          </>)}
        </div>
      </div>
    </Page>
  );
}

function Editor({ entry, folders, onBack, onSave, onDelete }: { entry: NotebookEntry; folders: { id: string; name: string }[]; onBack: () => void; onSave: (e: NotebookEntry) => void; onDelete: () => void }) {
  const [e, setE] = useState(entry);
  const [state, setState] = useState<'saved' | 'saving'>('saved');
  useEffect(() => {
    if (e === entry) return;
    setState('saving');
    const h = setTimeout(() => { onSave(e); setState('saved'); }, 600);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e]);
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button className="btn-ghost -ml-2 text-accent" onClick={onBack}><Icon name="chevronLeft" size={15} />Notes</button>
        <span className="text-xs text-ink3">{state === 'saving' ? 'Saving…' : 'Saved'}</span>
        <select aria-label="Folder" className="field w-auto h-8 text-xs ml-auto" value={e.folderId || 'my-notes'} onChange={x => setE({ ...e, folderId: x.target.value })}>{folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
        <button className={cx('btn h-8 w-8 px-0', e.favorite && 'text-warn')} aria-label="Favorite" aria-pressed={!!e.favorite} onClick={() => setE({ ...e, favorite: !e.favorite })}><Icon name="star" size={14} fill={e.favorite ? 'currentColor' : 'none'} /></button>
        <button className="btn h-8 w-8 px-0 text-loss" aria-label="Delete note" onClick={onDelete}><Icon name="trash" size={14} /></button>
      </div>
      <input aria-label="Title" className="w-full text-xl font-semibold bg-transparent border-0 px-0 focus:ring-0" placeholder="Title" value={e.title} onChange={x => setE({ ...e, title: x.target.value })} autoFocus={!e.title} />
      <textarea aria-label="Note" className="w-full mt-3 min-h-[50vh] bg-transparent border-0 px-0 focus:ring-0 text-[15px] leading-relaxed resize-none" placeholder="Start writing…" value={e.body} onChange={x => setE({ ...e, body: x.target.value })} />
    </Card>
  );
}
