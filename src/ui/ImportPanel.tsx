import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { decodeReport, parseExitCSV, parseReport } from '@/core/parsers';
import { decodeText, isBarsCSV, parseBarsCSV } from '@/core/bars';
import { saveBars } from '@/data/bars';
import { useStore } from '@/data/store';
import { Icon } from './Icon';
import { cx, useToast } from './kit';
import { ClockFields } from './ClockFields';

export function ImportPanel({ onDone }: { onDone: () => void }) {
  const importReport = useStore(s => s.importReport);
  const importExit = useStore(s => s.importExit);
  const clock = useStore(s => s.brokerClock), userTz = useStore(s => s.userTz);
  const toast = useToast();
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handle(files: FileList | File[]) {
    setBusy(true);
    const msgs: string[] = [];
    for (const f of Array.from(files)) {
      try {
        const text = /\.csv$/i.test(f.name) ? decodeText(await f.arrayBuffer()) : '';
        if (text && isBarsCSV(text)) {
          const b = parseBarsCSV(text, clock);
          if (!b.bars) { msgs.push(`${f.name}: no candles found`); continue; }
          const r = await saveBars(b.series);
          msgs.push(`${f.name}: ${b.bars.toLocaleString()} candles for ${b.symbols.length} symbols${r.cloud ? ' — uploading to the cloud in the background' : ''}`);
        } else if (text) {
          const r = importExit(parseExitCSV(text));
          if (!r.total) { msgs.push(`${f.name}: not recognised — expected RamanFX_Bars.csv or RamanFX_Excursions.csv from the RamanFX scripts`); continue; }
          msgs.push(`${f.name}: MAE/MFE for ${r.matched} of ${r.total} positions`);
        } else {
          const rep = parseReport(decodeReport(await f.arrayBuffer()), clock, userTz);
          if (!rep.positions.length && !rep.openPositions.length) { msgs.push(`${f.name}: no positions found — is this an MT5/MT4 "Report" (HTML)?`); continue; }
          const r = importReport(rep);
          msgs.push(`${rep.terminal} #${rep.accountId}: ${r.added} new, ${r.updated} updated, ${r.skipped} unchanged`);
        }
      } catch (e) {
        msgs.push(`${f.name}: ${(e as Error).message}`);
      }
    }
    setBusy(false);
    setResult(msgs.join('\n'));
    toast('Import finished');
  }

  return (
    <div className="flex flex-col gap-5">
      <motion.label
        onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); void handle(e.dataTransfer.files); }}
        animate={{ scale: drag ? 1.015 : 1 }}
        className={cx('flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors', drag ? 'border-accent bg-accent/5' : 'border-line2 hover:border-ink3')}>
        <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent grid place-items-center"><Icon name="upload" size={22} /></div>
        <div className="font-semibold">{busy ? 'Reading…' : 'Drop reports here, or click to choose'}</div>
        <div className="text-xs text-ink3 leading-relaxed">MT5 / MT4 account history (.html / .htm) · MAE/MFE and chart-candle CSVs from the RamanFX scripts</div>
        <input ref={fileRef} type="file" multiple accept=".html,.htm,.csv" className="sr-only" onChange={e => { if (e.target.files) void handle(e.target.files); e.target.value = ''; }} />
      </motion.label>

      <ClockFields showUser={false} />

      {result && <pre className="text-xs whitespace-pre-wrap bg-raised border border-line rounded-xl p-3 text-ink2 font-mono">{result}</pre>}

      <div className="text-xs text-ink3 leading-relaxed">
        <div className="font-semibold text-ink2 mb-1">How to export from MT5</div>
        Toolbox → History → right-click → Report → HTML. Re-importing is safe: existing trades are matched by position ID and only changes are applied.
      </div>
      {result && <button className="btn-primary h-10" onClick={onDone}>Done</button>}
    </div>
  );
}
