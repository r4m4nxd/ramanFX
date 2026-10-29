import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { decodeReport, parseExitCSV, parseReport } from '@/core/parsers';
import { decodeText, isBarsCSV, parseBarsCSV } from '@/core/bars';
import { saveBars } from '@/data/bars';
import { useStore } from '@/data/store';
import { Icon } from './Icon';
import { cx, useToast } from './kit';
import { ClockFields } from './ClockFields';

type Row = { file: string; ok: boolean; text: string; added?: number };

export function ImportPanel({ onDone }: { onDone: () => void }) {
  const importReport = useStore(s => s.importReport);
  const importExit = useStore(s => s.importExit);
  const clock = useStore(s => s.brokerClock), userTz = useStore(s => s.userTz);
  const toast = useToast();
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handle(files: FileList | File[]) {
    if (busy) return;
    setBusy(true);
    const out: Row[] = [];
    for (const f of Array.from(files)) {
      try {
        const text = /\.csv$/i.test(f.name) ? decodeText(await f.arrayBuffer()) : '';
        if (text && isBarsCSV(text)) {
          const b = parseBarsCSV(text, clock);
          if (!b.bars) { out.push({ file: f.name, ok: false, text: 'No candles found' }); continue; }
          const r = await saveBars(b.series);
          out.push({ file: f.name, ok: true, text: `${b.bars.toLocaleString()} candles · ${b.symbols.length} symbols${r.cloud ? ' · uploading in the background' : ''}` });
        } else if (text) {
          const r = importExit(parseExitCSV(text));
          if (!r.total) { out.push({ file: f.name, ok: false, text: 'Not recognised — expected RamanFX_Bars.csv or RamanFX_Excursions.csv from the RamanFX scripts' }); continue; }
          out.push({ file: f.name, ok: true, text: `MAE/MFE for ${r.matched} of ${r.total} positions` });
        } else {
          const rep = parseReport(decodeReport(await f.arrayBuffer()), clock, userTz);
          if (!rep.positions.length && !rep.openPositions.length) { out.push({ file: f.name, ok: false, text: 'No positions found — is this an MT5/MT4 "Report" (HTML)?' }); continue; }
          const r = importReport(rep);
          out.push({ file: `${rep.terminal} #${rep.accountId}`, ok: true, added: r.added, text: `${r.added} new · ${r.updated} updated · ${r.skipped} unchanged` });
        }
      } catch (e) {
        out.push({ file: f.name, ok: false, text: (e as Error).message });
      }
    }
    setBusy(false);
    setRows(out);
    const added = out.reduce((a, r) => a + (r.added ?? 0), 0);
    if (out.length && out.every(r => !r.ok)) toast(out.length > 1 ? 'Import failed — see details' : `Import failed: ${out[0].text}`, 'error');
    else if (added) toast(`${added} new trade${added === 1 ? '' : 's'} imported`, 'ok');
    else toast(out.some(r => r.added === 0) ? 'No new trades — journal is up to date' : 'Import finished', 'info');
  }
  const added = rows?.reduce((a, r) => a + (r.added ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <motion.label
        onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); void handle(e.dataTransfer.files); }}
        animate={{ scale: drag ? 1.015 : 1 }} aria-busy={busy}
        className={cx('flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors focus-within:border-accent', drag ? 'border-accent bg-accent/5' : 'border-line2 hover:border-ink3', busy && 'pointer-events-none opacity-60')}>
        <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent grid place-items-center"><Icon name={busy ? 'refresh' : 'upload'} size={22} className={cx(busy && 'animate-spin motion-reduce:animate-none')} /></div>
        <div className="font-semibold">{busy ? 'Reading…' : <><span className="touch:hidden">Drop reports here, or click to choose</span><span className="hidden touch:inline">Tap to choose a report</span></>}</div>
        <div className="text-xs text-ink3 leading-relaxed">MT5 / MT4 account history (.html / .htm) · MAE/MFE and chart-candle CSVs from the RamanFX scripts</div>
        <input ref={fileRef} type="file" multiple accept=".html,.htm,.csv" className="sr-only" disabled={busy} onChange={e => { if (e.target.files) void handle(e.target.files); e.target.value = ''; }} />
      </motion.label>

      {rows && (
        <ul className="flex flex-col rounded-xl border border-line bg-raised/50 px-3" aria-label="Import results">
          {rows.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 py-2.5 border-t border-line first:border-0 text-[13px]">
              <span className={cx('w-2 h-2 rounded-full shrink-0 mt-1.5', r.ok ? 'bg-profit' : 'bg-loss')} aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-medium truncate">{r.file}<span className="sr-only">{r.ok ? ' — imported' : ' — failed'}</span></div>
                <div className={cx('text-xs mt-0.5', r.ok ? 'num text-ink2' : 'text-loss')}>{r.text}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {rows && (
        <div className="flex gap-2">
          {added > 0 && <Link to="/trades" className="btn-primary h-10 flex-1" onClick={onDone}>View trades</Link>}
          <button className={cx(added > 0 ? 'btn' : 'btn-primary', 'h-10 flex-1')} onClick={onDone}>Done</button>
        </div>
      )}

      <ClockFields showUser={false} />

      <div className="text-xs text-ink3 leading-relaxed">
        <div className="font-semibold text-ink2 mb-1">How to export from MT5</div>
        Toolbox → History → right-click → Report → HTML. Re-importing is safe: existing trades are matched by position ID and only changes are applied.
      </div>
    </div>
  );
}
