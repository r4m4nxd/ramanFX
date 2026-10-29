// Main-thread side of the research import: run the worker per file, merge, persist in IndexedDB.
import { emptyDataset, mergeInto, type Dataset, type FileInfo, type TradeCols } from './research';

export interface WorkerIn { file: File; symbols: string[]; tfs: string[]; keys: string[] }
export type WorkerOut =
  | { kind: 'progress'; read: number; total: number; zones: number }
  | { kind: 'done'; cols: TradeCols; symbols: string[]; tfs: string[]; newKeys: string[]; info: FileInfo; zones: number }
  | { kind: 'error'; message: string; notResearch: boolean };

export type Progress = { file: string; index: number; count: number; read: number; total: number; zones: number };

/** Parse files one after another (each in a fresh worker), merging into `base`. Errors per file are collected, not thrown. */
export async function importFiles(files: File[], base: Dataset, onProgress: (p: Progress) => void): Promise<{ ds: Dataset; errors: string[] }> {
  let ds = base;
  const errors: string[] = [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    onProgress({ file: file.name, index, count: files.length, read: 0, total: file.size, zones: 0 });
    const out = await new Promise<Exclude<WorkerOut, { kind: 'progress' }>>(resolve => {
      const w = new Worker(new URL('./research.worker.ts', import.meta.url), { type: 'module', name: 'zone-research' });
      w.onmessage = (e: MessageEvent<WorkerOut>) => {
        const m = e.data;
        if (m.kind === 'progress') onProgress({ file: file.name, index, count: files.length, read: m.read, total: m.total, zones: m.zones });
        else { w.terminate(); resolve(m); }
      };
      w.onerror = e => { w.terminate(); resolve({ kind: 'error', message: `Could not read ${file.name}: ${e.message || 'worker failed'}`, notResearch: false }); };
      const msg: WorkerIn = { file, symbols: ds.symbols, tfs: ds.tfs, keys: ds.keys };
      w.postMessage(msg);
    });
    if (out.kind === 'error') { errors.push(`${file.name}: ${out.message}`); continue; }
    if (!out.zones) { errors.push(`${file.name}: no new zones (${out.info.dup ? `all ${out.info.dup} were already imported` : 'the file has a header only'}).`); continue; }
    ds = mergeInto(ds, out);
  }
  return { ds, errors };
}

// ─── persistence: one IndexedDB record (typed arrays clone natively); every access guarded ─────────────────────
const DB = 'rfx_zone_research', STORE = 'ds', KEY = 'current';
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    } catch (e) { rej(e); }
  });
}
async function run<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await open();
  try {
    return await new Promise<T>((res, rej) => { const q = f(d.transaction(STORE, mode).objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  } finally { d.close(); }
}
export async function loadDataset(): Promise<Dataset | null> {
  try { const v = await run<Dataset | undefined>('readonly', s => s.get(KEY)); return v && v.version === 1 && v.cols ? v : null; } catch { return null; }
}
export async function saveDataset(ds: Dataset): Promise<boolean> {
  try { await run('readwrite', s => s.put(ds, KEY)); return true; } catch { return false; }
}
export async function clearDataset(): Promise<void> {
  try { await run('readwrite', s => s.delete(KEY)); } catch { /* storage blocked: nothing stored either */ }
}
export { emptyDataset };
