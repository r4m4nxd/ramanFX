/// <reference lib="webworker" />
// Parses one research CSV off the main thread, streaming it in chunks so a multi-hundred-MB 2023 run never sits
// in memory as one string. Posts progress (bytes read) and, at the end, the compact typed-array trades.
import { NotResearchError, ResearchParser, COL_NAMES } from './research';
import type { WorkerIn, WorkerOut } from './client';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (e: MessageEvent<WorkerIn>) => {
  const { file, symbols, tfs, keys } = e.data;
  const post = (m: WorkerOut, tr?: Transferable[]) => self.postMessage(m, tr ?? []);
  try {
    const p = new ResearchParser({ symbols, tfs, keys });
    // MT5 writes FILE_ANSI: Windows-1252. Symbol names and the header are ASCII anyway.
    const dec = new TextDecoder('windows-1252');
    const reader = file.stream().getReader();
    let read = 0, lastPost = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      read += value.byteLength;
      p.push(dec.decode(value, { stream: true }));
      if (read - lastPost > 2_000_000 || read === file.size) { lastPost = read; post({ kind: 'progress', read, total: file.size, zones: p.zones }); }
    }
    p.push(dec.decode());
    p.end();
    const cols = p.cols();
    post({ kind: 'done', cols, symbols: p.symbols, tfs: p.tfs, newKeys: p.newKeys, info: p.info(file.name), zones: p.zones },
      COL_NAMES.map(c => (cols[c] as unknown as { buffer: ArrayBuffer }).buffer));
  } catch (err) {
    post({ kind: 'error', message: err instanceof NotResearchError ? err.message : `Could not read ${file.name}: ${(err as Error)?.message ?? err}`, notResearch: err instanceof NotResearchError });
  }
};
