// Shared pieces of the Today page and the Decision Desk: the verdict pill, the four lights, the watchlist editor and
// one market's full read-out. Logic: core/desk.
import { useState } from 'react';
import { cx } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { fxClassLabel } from '@/core/fx';
import { DESK_MAX, HEADLINE, leadOf, RULE_WORD, searchMarkets, spanText, TF_WORD, VERDICT_LABEL, type Chance, type DeskArea, type DeskInst, type Judgement, type Light, type Verdict } from '@/core/desk';

const DOT: Record<Light, string> = { g: 'bg-profit', a: 'bg-warn', r: 'bg-loss', n: 'bg-line2' };
const PILL: Record<Verdict, string> = { ready: 'bg-profit text-on-status', close: 'bg-warn/20 text-warn', wait: 'bg-raised text-ink2', done: 'bg-loss/15 text-loss', closed: 'bg-raised text-ink2' };
export const px = (v: number, digits: number) => v.toLocaleString('en-US', { minimumFractionDigits: Math.min(digits, 5), maximumFractionDigits: Math.min(digits, 5) });

export function VerdictPill({ v, className }: { v: Verdict; className?: string }) {
  return <span className={cx('inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold whitespace-nowrap', PILL[v], className)}>{VERDICT_LABEL[v]}</span>;
}
export function Lights({ j }: { j: Judgement }) {
  const all = [['Time', j.time], ['Place', j.place], ['Rules', j.rules], ['Room left', j.room]] as const;
  return (
    <span className="inline-flex gap-1 shrink-0" role="img" aria-label={all.map(([n, l]) => `${n}: ${l.title}`).join('. ')}>
      {all.map(([n, l]) => <i key={n} title={`${n}: ${l.title}`} className={cx('w-[9px] h-[9px] rounded-full', DOT[l.light])} />)}
    </span>
  );
}

/** "Add a market" box and the current list as removable chips. */
export function WatchEditor({ watch, markets, onAdd, onRemove }: { watch: string[]; markets: { sym: string; cls: string }[]; onAdd: (s: string) => void; onRemove: (s: string) => void }) {
  const [q, setQ] = useState('');
  const hits = searchMarkets(markets, q, watch);
  const full = watch.length >= DESK_MAX;
  const take = (s: string) => { onAdd(s); setQ(''); };
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-1.5">
        {watch.map(s => (
          <span key={s} className="inline-flex items-center h-8 pl-3 pr-1 rounded-full border border-line text-[12.5px] font-semibold">
            {s}
            <button type="button" onClick={() => onRemove(s)} disabled={watch.length <= 1} aria-label={`Remove ${s}`} className="ml-1 w-6 h-6 rounded-full grid place-items-center text-ink3 hover:text-loss hover:bg-raised disabled:opacity-30"><Icon name="x" size={12} /></button>
          </span>
        ))}
      </div>
      {/* the matches are part of the page flow, never a floating layer: a floating list was hidden behind the card below it */}
      <div className="max-w-[340px]">
        <label className="relative block">
          <span className="sr-only">Add a market</span>
          <Icon name="plus" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
          <input className="field w-full h-10 pl-10 text-[16px]" type="search" enterKeyHint="done" autoComplete="off" spellCheck={false} disabled={full}
            placeholder={full ? `List is full (${DESK_MAX})` : 'Add a market: GBPUSD, gold, US30…'} value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && hits[0]) take(hits[0].sym); }} />
        </label>
        {!!q && (
          <ul className="mt-1.5 rounded-xl border border-line bg-raised overflow-hidden" aria-label="Matching markets">
            {hits.map(h => (
              <li key={h.sym}><button type="button" onClick={() => take(h.sym)} className="w-full flex items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-surface border-b border-line last:border-b-0"><span className="font-semibold text-[13.5px]">{h.sym}</span><span className="text-[11.5px] text-ink3">{fxClassLabel(h.cls)}</span></button></li>
            ))}
            {!hits.length && <li className="px-3.5 py-2.5 text-[12.5px] text-ink3">No forex, metal, index or crypto market matches “{q}”.</li>}
          </ul>
        )}
      </div>
    </div>
  );
}

export function AreaLine({ a, digits, word }: { a: DeskArea | null; digits: number; word: 'buy' | 'sell' }) {
  const up = word === 'buy';
  if (!a) return <div className="text-[12.5px] text-ink3"><span className={up ? 'text-profit' : 'text-loss'}>{up ? '▲' : '▼'}</span> No daily or bigger {word} area nearby</div>;
  return (
    <div className="text-[12.5px] text-ink2">
      <span className={up ? 'text-profit' : 'text-loss'}>{up ? '▲' : '▼'}</span> {TF_WORD[a.tf]?.replace(/^./, c => c.toUpperCase())} {word} area <span className="num text-ink">{px(a.lo, digits)}–{px(a.hi, digits)}</span>
      <span className="text-ink3"> · {a.inside ? 'price is inside it' : `${a.pct < 0.095 ? a.pct.toFixed(2) : a.pct.toFixed(1)}% away`}</span>
    </div>
  );
}

/** The "have I missed it" bar: today's move against a normal day. */
export function MissedMeter({ i, j }: { i: DeskInst; j: Judgement }) {
  const u = j.used == null ? 0 : Math.min(1.3, j.used);
  return (
    <div>
      <div className="relative h-3.5 rounded-full bg-raised overflow-hidden"><i className={cx('absolute inset-y-0 left-0 rounded-full transition-[width] duration-500', DOT[j.room.light === 'n' ? 'n' : j.room.light])} style={{ width: `${(u / 1.3) * 100}%` }} /></div>
      <div className="flex justify-between text-[10.5px] text-ink3 mt-1 num"><span>0%</span><span>50%</span><span>100% = a normal day</span><span>130%</span></div>
      <p className="text-[11.5px] text-ink3 mt-1.5">{j.used == null || j.high == null || j.low == null || !i.adr ? 'No candles yet today.' : `${Math.round(j.used * 100)}% used: ${px(j.high - j.low, i.digits)} travelled of a usual ${px(i.adr, i.digits)}.`}</p>
    </div>
  );
}

const Sec = ({ children }: { children: React.ReactNode }) => <div className="text-[11px] uppercase tracking-wide text-ink3 font-medium mb-2">{children}</div>;

/** One market in full: verdict, missed-it meter, the four lights in words, next chance, the rules, yesterday's levels. */
export function MarketDetail({ i, j, chance }: { i: DeskInst; j: Judgement; chance: Chance | null }) {
  const lights = [['Good time?', j.time], ['At an area?', j.place], ['Rules pass?', j.rules], ['Room left today?', j.room]] as const;
  const order = { f: 0, w: 1, u: 2, p: 3 } as const;
  const rules = i.check ? [...i.check.rules].sort((a, b) => order[a.status] - order[b.status]) : [];
  return (
    <div className="flex flex-col gap-4 min-w-0" aria-live="polite">
      <div className="clock-swap" key={`${i.sym}-${j.verdict}`}>
        <VerdictPill v={j.verdict} />
        <h3 className="text-[22px] leading-tight font-semibold tracking-tight mt-1.5 text-balance">{i.sym}: {HEADLINE[j.verdict]}</h3>
        <p className="text-[13.5px] text-ink2 mt-1 leading-relaxed">{leadOf(i, j)}</p>
      </div>
      <div><Sec>Have I missed it? · today's move against a normal day</Sec><MissedMeter i={i} j={j} /></div>
      <div>
        <Sec>Before you click</Sec>
        <div className="grid gap-2">
          {lights.map(([q, l]) => (
            <div key={q} className="grid grid-cols-[14px_minmax(0,1fr)] gap-2.5 items-start">
              <i className={cx('w-3 h-3 rounded-full mt-[3px]', DOT[l.light])} />
              <div><div className="text-[13px] font-semibold">{q} {l.title}</div><div className="text-[12px] text-ink3 leading-snug">{l.text}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Sec>Next chance</Sec>
        <p className="text-[13.5px]">{chance ? <><b>{chance.text}</b>, in {spanText(chance.inMin)}</> : '–'}</p>
        {chance && <p className="text-[11.5px] text-ink3 mt-1">{chance.x != null ? `That half-hour usually runs ${chance.x.toFixed(2)}× typical for ${i.sym}. ` : ''}The move comes back; you do not have to take this one.</p>}
      </div>
      <div className="grid gap-1"><Sec>Nearest areas, daily or bigger</Sec><AreaLine a={i.buy} digits={i.digits} word="buy" /><AreaLine a={i.sell} digits={i.digits} word="sell" /></div>
      {i.check && (
        <div>
          <Sec>Your rules on the nearest {TF_WORD[i.check.tf] ?? i.check.tf} {i.check.side === 'D' ? 'buy' : 'sell'} area</Sec>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
            {rules.map((r, k) => (
              <div key={k} className={cx('flex items-baseline gap-2 min-w-0', r.status === 'p' ? 'text-ink3' : 'text-ink')}>
                <i className={cx('shrink-0 w-[7px] h-[7px] rounded-full relative -top-px', DOT[r.status === 'p' ? 'g' : r.status === 'f' ? 'r' : r.status === 'w' ? 'a' : 'n'])} />{RULE_WORD[r.short] ?? r.short}
              </div>
            ))}
          </div>
        </div>
      )}
      {i.prev && (
        <div>
          <Sec>Yesterday's map</Sec>
          <div className="grid grid-cols-3 gap-2">
            {([['High', i.prev.high], ['Low', i.prev.low], ['Close', i.prev.close]] as const).map(([n, v]) => <div key={n} className="rounded-xl bg-raised px-2.5 py-2"><div className="text-[10.5px] text-ink3">{n}</div><div className="num text-[13px] font-semibold">{px(v, i.digits)}</div></div>)}
          </div>
        </div>
      )}
    </div>
  );
}
