// Schematic chart diagrams for the video-lesson notes. Pure SVG, theme tokens only, no data.
// Prices are 0..100 in each panel; candles are [open, high, low, close].
import type { ReactNode } from 'react';

export type DiagramKey =
  | 'zone-anatomy' | 'qualify' | 'draw' | 'mtf' | 'trend-momentum' | 'entry-stop-tp' | 'sequence' | 'trend-trading'
  | 'trendline' | 'zone-removed' | 'remove-limit' | 'confirmation' | 'quality' | 'low-odds' | 'mindset';

type C = [number, number, number, number];
const UP = 'rgb(var(--profit))', DN = 'rgb(var(--loss))', INK = 'rgb(var(--ink2))', MUTE = 'rgb(var(--ink3))', ACC = 'rgb(var(--accent))', LINE = 'rgb(var(--line2))';

/** Panel: maps price 0..100 into a box at (x, y, w, h). */
function panel(_x: number, y: number, h: number) { return (p: number) => y + h - (p / 100) * h; }

function Candles({ data, x, Y, w = 7, gap = 4 }: { data: C[]; x: number; Y: (p: number) => number; w?: number; gap?: number }) {
  return (
    <g>
      {data.map(([o, h, l, c], i) => {
        const cx = x + i * (w + gap), up = c >= o, col = up ? UP : DN;
        const top = Y(Math.max(o, c)), bot = Y(Math.min(o, c));
        return (
          <g key={i}>
            <line x1={cx + w / 2} x2={cx + w / 2} y1={Y(h)} y2={Y(l)} stroke={col} strokeWidth={1.2} />
            <rect x={cx} y={top} width={w} height={Math.max(1.5, bot - top)} rx={1} fill={col} />
          </g>
        );
      })}
    </g>
  );
}
const cx = (x: number, i: number, w = 7, gap = 4) => x + i * (w + gap);

function Zone({ x1, x2, top, bot, kind, label }: { x1: number; x2: number; top: number; bot: number; kind: 'demand' | 'supply' | 'muted'; label?: string }) {
  const col = kind === 'demand' ? UP : kind === 'supply' ? DN : MUTE;
  return (
    <g>
      <rect x={x1} y={top} width={x2 - x1} height={bot - top} fill={col} fillOpacity={0.14} stroke={col} strokeOpacity={0.55} strokeDasharray="3 3" />
      {label && <text x={x2 - 3} y={top + 9} textAnchor="end" fontSize={8} fill={col} fontWeight={600}>{label}</text>}
    </g>
  );
}
function T({ x, y, children, c = INK, a = 'start', s = 8.5, b }: { x: number; y: number; children: ReactNode; c?: string; a?: 'start' | 'middle' | 'end'; s?: number; b?: boolean }) {
  return <text x={x} y={y} fontSize={s} fill={c} textAnchor={a} fontWeight={b ? 650 : 450}>{children}</text>;
}
function HLine({ x1, x2, y, c = INK, dash, label, la = 'end' }: { x1: number; x2: number; y: number; c?: string; dash?: boolean; label?: string; la?: 'start' | 'end' }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={c} strokeWidth={1} strokeDasharray={dash ? '4 3' : undefined} />
      {label && <text x={la === 'end' ? x2 : x1} y={y - 3} fontSize={8} fill={c} textAnchor={la} fontWeight={600}>{label}</text>}
    </g>
  );
}
function Arrow({ x1, y1, x2, y2, c = ACC }: { x1: number; y1: number; x2: number; y2: number; c?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 5;
  return (
    <g stroke={c} strokeWidth={1.4} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M${x2 - h * Math.cos(a - 0.5)} ${y2 - h * Math.sin(a - 0.5)} L${x2} ${y2} L${x2 - h * Math.cos(a + 0.5)} ${y2 - h * Math.sin(a + 0.5)}`} />
    </g>
  );
}
const Path = ({ pts, c = INK, dash }: { pts: [number, number][]; c?: string; dash?: boolean }) =>
  <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={1.6} strokeLinejoin="round" strokeDasharray={dash ? '4 3' : undefined} />;
const Tick = ({ x, y, ok }: { x: number; y: number; ok: boolean }) => (
  <g>
    <circle cx={x} cy={y} r={7} fill={ok ? UP : DN} fillOpacity={0.15} stroke={ok ? UP : DN} />
    <path d={ok ? `M${x - 3} ${y} l2 2.5 l4 -5` : `M${x - 2.8} ${y - 2.8} l5.6 5.6 M${x + 2.8} ${y - 2.8} l-5.6 5.6`} stroke={ok ? UP : DN} strokeWidth={1.6} fill="none" />
  </g>
);

// Reusable candle runs.
const dropIn: C[] = [[88, 90, 80, 82], [82, 84, 72, 74], [74, 76, 62, 64], [64, 66, 52, 55]];
const base: C[] = [[55, 58, 47, 51], [51, 56, 48, 53], [53, 55, 49, 50]];
const legUp: C[] = [[50, 72, 49, 71], [71, 90, 70, 88]];

function ZoneAnatomy() {
  const Y = panel(0, 14, 140); const x = 14;
  const y = (p: number) => Y(p);
  return (
    <>
      <Candles data={[...dropIn, ...base, ...legUp]} x={x} Y={Y} />
      <Zone x1={cx(x, 4) - 3} x2={300} top={y(56)} bot={y(47)} kind="demand" />
      <HLine x1={cx(x, 4) - 3} x2={300} y={y(56)} c={UP} />
      <T x={300} y={y(56) - 4} a="end" c={UP}>proximal (body)</T>
      <HLine x1={cx(x, 4) - 3} x2={300} y={y(47)} c={UP} dash />
      <T x={300} y={y(47) + 10} a="end" c={UP}>distal (wick)</T>
      <T x={cx(x, 4)} y={y(40)} c={MUTE}>basing</T>
      <T x={cx(x, 9) + 4} y={y(95)} b>strong leg out</T>
      <Arrow x1={cx(x, 7) + 10} y1={y(60)} x2={cx(x, 7) + 10} y2={y(84)} c={UP} />
      <Path pts={[[cx(x, 9) + 6, y(86)], [200, y(80)], [240, y(68)], [262, y(58)]]} c={MUTE} dash />
      <T x={236} y={y(78)} a="middle" c={MUTE}>return</T>
      <T x={cx(x, 4) - 3} y={y(56) - 4} c={UP} b>DEMAND ZONE</T>
    </>
  );
}
function Qualify() {
  const L = panel(0, 18, 120), R = panel(0, 18, 120);
  return (
    <>
      <Candles data={[...base, [50, 75, 49, 74], [74, 95, 73, 93]]} x={20} Y={L} />
      <Zone x1={18} x2={150} top={L(58)} bot={L(47)} kind="demand" />
      <T x={20} y={155} b>Fast, explosive move away</T><T x={20} y={166} c={MUTE}>fresh — price has not returned</T>
      <Tick x={140} y={22} ok />
      <Candles data={[...base, [50, 56, 49, 55], [55, 59, 53, 54], [54, 61, 53, 60], [60, 64, 57, 59], [59, 66, 58, 65]]} x={180} Y={R} />
      <Zone x1={178} x2={310} top={R(58)} bot={R(47)} kind="muted" />
      <T x={180} y={155} b>Slow grind away</T><T x={180} y={166} c={MUTE}>weak imbalance — not a zone</T>
      <Tick x={300} y={22} ok={false} />
    </>
  );
}
function Draw() {
  const Y = panel(0, 10, 150); const x = 70, w = 18, gap = 10;
  const b: C[] = [[60, 66, 40, 55], [55, 62, 44, 58], [58, 63, 46, 52]];
  return (
    <>
      <Candles data={[[86, 88, 60, 62], ...b, [52, 92, 51, 90]]} x={x - (w + gap)} Y={Y} w={w} gap={gap} />
      <HLine x1={30} x2={300} y={Y(60)} c={UP} label="proximal: highest body in the base" />
      <HLine x1={30} x2={300} y={Y(40)} c={UP} dash label="distal: lowest wick in the base" />
      <rect x={30} y={Y(60)} width={270} height={Y(40) - Y(60)} fill={UP} fillOpacity={0.1} />
      <T x={30} y={172} c={MUTE}>Include the wicks; do not cut through candle bodies.</T>
    </>
  );
}
function Mtf() {
  const rows = [
    { t: 'HTF — direction & the big zone', top: 50, bot: 30 },
    { t: 'ITF — zone inside the HTF zone', top: 46, bot: 36 },
    { t: 'LTF / ETF — refined entry', top: 43, bot: 38 },
  ];
  return (
    <>
      {rows.map((r, i) => {
        const Y = panel(0, 6 + i * 58, 50);
        return (
          <g key={i}>
            <rect x={10} y={6 + i * 58} width={300} height={50} rx={6} fill="none" stroke={LINE} />
            <T x={16} y={18 + i * 58} b>{r.t}</T>
            <Zone x1={120} x2={300} top={Y(r.top)} bot={Y(r.bot)} kind="demand" />
            <Path pts={[[130, Y(80)], [170, Y(60)], [200, Y(r.top + 2)], [230, Y(70)], [270, Y(55)], [295, Y(r.top)]]} />
          </g>
        );
      })}
    </>
  );
}
function TrendMomentum() {
  const Y = panel(0, 20, 120);
  return (
    <>
      <Path pts={[[14, Y(10)], [44, Y(40)], [64, Y(26)], [94, Y(60)], [114, Y(46)], [144, Y(85)]]} />
      {[[44, 40, 'HH'], [94, 60, 'HH'], [144, 85, 'HH']].map(([x, p, l]) => <T key={`${x}`} x={x as number} y={Y(p as number) - 5} a="middle" c={UP} s={7.5} b>{l}</T>)}
      {[[64, 26, 'HL'], [114, 46, 'HL']].map(([x, p, l]) => <T key={`${x}`} x={x as number} y={Y(p as number) + 12} a="middle" c={UP} s={7.5} b>{l}</T>)}
      <T x={14} y={165} b>Trend: higher highs & higher lows</T>
      <Candles data={[[20, 24, 18, 22], [22, 26, 20, 21], [21, 50, 20, 48], [48, 78, 47, 76], [76, 92, 74, 90]]} x={200} Y={Y} w={9} gap={6} />
      <T x={185} y={165} b>Momentum: speed & size of the move</T>
    </>
  );
}
function EntryStopTp() {
  const Y = panel(0, 12, 150);
  return (
    <>
      <Zone x1={20} x2={300} top={Y(96)} bot={Y(86)} kind="supply" label="opposing supply" />
      <HLine x1={20} x2={300} y={Y(78)} c={UP} label="TP — before the opposing zone" la="start" />
      <Zone x1={20} x2={300} top={Y(30)} bot={Y(20)} kind="demand" />
      <HLine x1={20} x2={300} y={Y(30)} c={ACC} label="limit BUY at proximal" la="start" />
      <HLine x1={20} x2={300} y={Y(14)} c={DN} dash label="stop beyond distal" />
      <Path pts={[[30, Y(60)], [80, Y(70)], [130, Y(45)], [170, Y(31)], [220, Y(55)], [270, Y(79)]]} c={MUTE} dash />
      <T x={30} y={Y(52)} c={MUTE}>reward</T><T x={30} y={Y(19)} c={MUTE}>risk</T>
    </>
  );
}
function Sequence() {
  const Y = panel(0, 16, 130);
  return (
    <>
      <Path pts={[[14, Y(70)], [50, Y(20)], [90, Y(55)], [120, Y(35)], [170, Y(85)], [210, Y(58)], [250, Y(95)], [300, Y(70)]]} />
      <Zone x1={40} x2={300} top={Y(26)} bot={Y(16)} kind="demand" label="1" />
      <Zone x1={112} x2={300} top={Y(40)} bot={Y(31)} kind="demand" label="2" />
      <Zone x1={200} x2={300} top={Y(63)} bot={Y(54)} kind="demand" label="3" />
      <T x={14} y={166} c={MUTE}>Each fresh zone the move leaves behind is the next link in the sequence.</T>
    </>
  );
}
function TrendTrading() {
  const Y = panel(0, 16, 130);
  const pts: [number, number][] = [[14, Y(10)], [60, Y(45)], [86, Y(30)], [140, Y(68)], [166, Y(52)], [220, Y(88)], [246, Y(74)], [300, Y(98)]];
  return (
    <>
      <Path pts={pts} />
      <Zone x1={76} x2={110} top={Y(34)} bot={Y(26)} kind="demand" />
      <Zone x1={156} x2={190} top={Y(56)} bot={Y(48)} kind="demand" />
      <Zone x1={236} x2={270} top={Y(78)} bot={Y(70)} kind="demand" />
      {[86, 166, 246].map(x => <Arrow key={x} x1={x} y1={Y(10) + 6} x2={x} y2={Y(10) - 14} c={UP} />)}
      <T x={14} y={166} c={MUTE}>With the trend: buy pullbacks into demand, don't fade the move.</T>
    </>
  );
}
function Trendline() {
  const Y = panel(0, 12, 140);
  return (
    <>
      <Path pts={[[20, Y(20)], [60, Y(55)], [90, Y(34)], [140, Y(70)], [170, Y(48)], [230, Y(88)], [260, Y(66)]]} />
      <line x1={14} y1={Y(14)} x2={300} y2={Y(78)} stroke={ACC} strokeWidth={1.3} />
      <Zone x1={252} x2={300} top={Y(70)} bot={Y(62)} kind="demand" />
      <T x={300} y={Y(78) + 14} a="end" c={ACC}>zone + trendline confluence</T>
      <T x={20} y={166} c={MUTE}>Trendline drawn through the swing lows.</T>
    </>
  );
}
function ZoneRemoved() {
  const Y = panel(0, 12, 140);
  return (
    <>
      <Candles data={[...base, ...legUp, [88, 90, 70, 72], [72, 74, 58, 60], [60, 62, 44, 46], [46, 48, 36, 38]]} x={16} Y={Y} />
      <Zone x1={14} x2={300} top={Y(56)} bot={Y(47)} kind="muted" />
      <line x1={14} y1={Y(56)} x2={300} y2={Y(47)} stroke={DN} strokeWidth={1.2} />
      <line x1={14} y1={Y(47)} x2={300} y2={Y(56)} stroke={DN} strokeWidth={1.2} />
      <T x={300} y={Y(36)} a="end" c={DN} b>closed through the zone → removed</T>
    </>
  );
}
function RemoveLimit() {
  const Y = panel(0, 12, 140);
  return (
    <>
      <Zone x1={20} x2={300} top={Y(30)} bot={Y(20)} kind="demand" />
      <HLine x1={20} x2={300} y={Y(30)} c={ACC} label="pending limit buy" />
      <Zone x1={20} x2={300} top={Y(92)} bot={Y(84)} kind="supply" label="target area" />
      <Path pts={[[24, Y(40)], [80, Y(60)], [130, Y(50)], [200, Y(86)]]} />
      <circle cx={200} cy={Y(86)} r={4} fill={ACC} />
      <T x={206} y={Y(70)} c={ACC} b>target hit before the fill</T>
      <T x={206} y={Y(70) + 11} c={ACC}>→ cancel the order</T>
    </>
  );
}
function Confirmation() {
  const L = panel(0, 18, 120), R = panel(0, 18, 120);
  return (
    <>
      <Zone x1={14} x2={150} top={L(40)} bot={L(25)} kind="demand" />
      <HLine x1={14} x2={150} y={L(40)} c={ACC} label="limit at proximal" />
      <Path pts={[[20, L(80)], [70, L(55)], [100, L(39)], [140, L(75)]]} />
      <T x={14} y={155} b>Set & forget</T><T x={14} y={166} c={MUTE}>order waits at the zone</T>
      <Zone x1={170} x2={306} top={R(40)} bot={R(25)} kind="demand" />
      <Path pts={[[176, R(80)], [210, R(50)], [226, R(30)], [240, R(42)], [252, R(32)], [272, R(56)], [300, R(80)]]} />
      <line x1={232} x2={300} y1={R(42)} y2={R(42)} stroke={ACC} strokeDasharray="3 3" />
      <T x={300} y={R(42) - 4} a="end" c={ACC}>LTF shift</T>
      <T x={170} y={155} b>Confirmation</T><T x={170} y={166} c={MUTE}>enter after a lower-timeframe shift</T>
    </>
  );
}
function Quality() {
  const L = panel(0, 18, 120), R = panel(0, 18, 120);
  return (
    <>
      <Candles data={[[55, 58, 48, 50], [50, 76, 49, 75], [75, 96, 74, 94]]} x={30} Y={L} w={9} gap={6} />
      <Zone x1={26} x2={150} top={L(55)} bot={L(48)} kind="demand" />
      <T x={20} y={155} b>High quality</T><T x={20} y={166} c={MUTE}>few basing candles, big leg out</T>
      <Tick x={140} y={22} ok />
      <Candles data={[[55, 58, 48, 52], [52, 57, 49, 54], [54, 58, 50, 51], [51, 57, 49, 55], [55, 59, 50, 53], [53, 63, 52, 62], [62, 68, 60, 66]]} x={180} Y={R} w={8} gap={4} />
      <Zone x1={176} x2={310} top={R(58)} bot={R(48)} kind="muted" />
      <T x={180} y={155} b>Low quality</T><T x={180} y={166} c={MUTE}>long base, weak move away</T>
      <Tick x={300} y={22} ok={false} />
    </>
  );
}
function LowOdds() {
  const Y = panel(0, 16, 120);
  const pts: [number, number][] = Array.from({ length: 14 }, (_, i) => [16 + i * 21, Y(i % 2 ? 62 : 38)]);
  return (
    <>
      <Zone x1={14} x2={306} top={Y(66)} bot={Y(56)} kind="muted" />
      <Zone x1={14} x2={306} top={Y(44)} bot={Y(34)} kind="muted" />
      <Path pts={pts} c={MUTE} />
      <T x={14} y={160} b>Low odds: choppy, overlapping zones</T>
      <T x={14} y={171} c={MUTE}>no clean imbalance to trade from</T>
    </>
  );
}
function Mindset() {
  const steps = ['Plan', 'Execute', 'Journal', 'Review'];
  return (
    <>
      {steps.map((s, i) => {
        const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2, x = 160 + Math.cos(a) * 62, y = 90 + Math.sin(a) * 62;
        return <g key={s}><circle cx={x} cy={y} r={24} fill="rgb(var(--raised))" stroke={ACC} /><T x={x} y={y + 3} a="middle" b>{s}</T></g>;
      })}
      <circle cx={160} cy={90} r={62} fill="none" stroke={LINE} strokeDasharray="3 4" />
      <T x={160} y={93} a="middle" c={MUTE}>process</T>
    </>
  );
}

const MAP: Record<DiagramKey, () => JSX.Element> = {
  'zone-anatomy': ZoneAnatomy, qualify: Qualify, draw: Draw, mtf: Mtf, 'trend-momentum': TrendMomentum, 'entry-stop-tp': EntryStopTp,
  sequence: Sequence, 'trend-trading': TrendTrading, trendline: Trendline, 'zone-removed': ZoneRemoved, 'remove-limit': RemoveLimit,
  confirmation: Confirmation, quality: Quality, 'low-odds': LowOdds, mindset: Mindset,
};
export const hasDiagram = (k: string): k is DiagramKey => k in MAP;

export function LessonDiagram({ k, caption }: { k: DiagramKey; caption?: string }) {
  const D = MAP[k];
  return (
    <figure className="rounded-xl border border-line bg-raised/40 p-3">
      <svg viewBox="0 0 320 180" className="w-full h-auto" role="img" aria-label={caption ?? k} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}><D /></svg>
      {caption && <figcaption className="text-[12px] text-ink3 mt-2 leading-snug">{caption}</figcaption>}
    </figure>
  );
}
