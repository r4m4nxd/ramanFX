import { useEffect, useState } from 'react';
import { useStore } from '@/data/store';
import { Badge, Bar, Card, CardHead, cx, Field, InfoTip, Page, Segmented, Stat, Tabs } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

/* Living design-system reference. Everything here is read from the running app — the CSS tokens via
   getComputedStyle and the real kit components — so it can never drift from what ships. */

const COLORS: [string, string][] = [
  ['bg', 'Page canvas'], ['surface', 'Cards'], ['raised', 'Inputs, hovers'], ['line', 'Hairlines'], ['line2', 'Control borders'],
  ['ink', 'Primary text'], ['ink2', 'Secondary text'], ['ink3', 'Labels, captions'],
  ['accent', 'Actions, focus, selection'], ['profit', 'Gains, wins'], ['loss', 'Losses'], ['warn', 'Caution'], ['on-accent', 'Text on accent fill'],
];
const TEXT = ['ink', 'ink2', 'ink3', 'accent', 'profit', 'loss', 'warn'];
const RADII: [string, string][] = [['radius-xs', 'Checkboxes'], ['radius-control', 'Inputs, small tiles'], ['radius-inner', 'Nested tiles'], ['radius-card', 'Cards'], ['radius-panel', 'Sheets, hero panels']];
const MOTION: [string, string][] = [['motion-fast', 'Hover, press'], ['motion-base', 'Pills, toggles'], ['motion-slow', 'Charts, reveals']];

const rgb = (v: string) => v.trim().split(/\s+/).map(Number);
function lum([r, g, b]: number[]) {
  const c = [r, g, b].map(x => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

function useTokens() {
  const theme = useStore(s => s.theme);
  const [t, setT] = useState<Record<string, string>>({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = [...COLORS.map(c => c[0]), ...RADII.map(r => r[0]), ...MOTION.map(m => m[0]), 'shadow-card'];
    setT(Object.fromEntries(names.map(n => [n, cs.getPropertyValue('--' + n).trim()])));
  }, [theme]);
  return t;
}

export default function DesignSystem() {
  const t = useTokens();
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a');
  const [tab, setTab] = useState<'x' | 'y'>('x');
  const surface = t.surface ? rgb(t.surface) : null;
  return (
    <Page>
      <Card>
        <CardHead title="Design system" sub="Live reference generated from the app's own tokens and components. Switch theme to see both sets." />
        <p className="text-[13px] text-ink2 max-w-[70ch]">Rule of use: components reference semantic tokens (e.g. <code className="text-accent">accent</code>, <code className="text-accent">radius-card</code>), never raw hex or pixel values. Change a token in <code>src/index.css</code> and every screen follows.</p>
      </Card>

      <Card>
        <CardHead title="Colour tokens" sub="Semantic colours. Text tokens show their contrast on a card; WCAG AA needs 4.5:1 for body text." />
        <ul className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {COLORS.map(([n, use]) => {
            const v = t[n];
            const ratio = v && surface && TEXT.includes(n) ? contrast(rgb(v), surface) : null;
            return (
              <li key={n} className="rounded-xl border border-line overflow-hidden">
                <div className="h-14 border-b border-line" style={{ background: v ? `rgb(${v})` : undefined }} />
                <div className="p-2.5">
                  <div className="text-[13px] font-semibold">{n}</div>
                  <div className="text-[11.5px] text-ink3">{use}</div>
                  <div className="num text-[11.5px] text-ink2 mt-1">rgb({v})</div>
                  {ratio != null && <Badge className="mt-1.5" tone={ratio >= 4.5 ? 'profit' : 'loss'}>{ratio.toFixed(2)}:1 {ratio >= 4.5 ? 'AA' : 'FAIL'}</Badge>}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHead title="Shape" sub="Radius tokens — Tailwind rounded-md / lg / xl / 2xl / 3xl map to these" />
          <ul className="grid grid-cols-5 gap-3">
            {RADII.map(([n, use]) => (
              <li key={n} className="text-center">
                <div className="h-16 bg-raised border border-line2" style={{ borderRadius: `var(--${n})` }} />
                <div className="text-[11.5px] font-semibold mt-2">{n.replace('radius-', '')}</div>
                <div className="num text-[11px] text-ink3">{t[n]}</div>
                <div className="text-[11px] text-ink3">{use}</div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead title="Motion" sub="Duration tokens — duration-fast / base / slow" />
          <ul className="flex flex-col gap-3">
            {MOTION.map(([n, use]) => (
              <li key={n} className="flex items-center gap-3">
                <span className="w-28 text-[13px] font-semibold">{n.replace('motion-', '')}</span>
                <span className="num text-[12px] text-ink3 w-16">{t[n]}</span>
                <span className="text-[12px] text-ink2">{use}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHead title="Typography" sub="Inter. Numbers use tabular figures (.num) so columns line up." />
        <div className="flex flex-col gap-3">
          <div className="num text-[28px] font-bold tracking-tight">$12,480.50 <span className="text-[12px] font-normal text-ink3">Hero figure · 28 bold</span></div>
          <div className="text-[17px] font-semibold">Page title <span className="text-[12px] font-normal text-ink3">17 semibold</span></div>
          <div className="text-[15px] font-semibold">Card title <span className="text-[12px] font-normal text-ink3">15 semibold</span></div>
          <div className="text-[13px]">Body text for notes and descriptions <span className="text-[12px] text-ink3">13 regular</span></div>
          <div className="label">Label / table head <span className="normal-case tracking-normal font-normal">11 caps</span></div>
        </div>
      </Card>

      <Card>
        <CardHead title="Components" sub="The shared kit. Use these instead of hand-rolled variants." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section aria-label="Buttons" className="flex flex-col gap-2">
            <div className="label">Buttons</div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" type="button"><Icon name="plus" size={14} />Primary</button>
              <button className="btn" type="button">Secondary</button>
              <button className="btn-ghost" type="button">Ghost</button>
              <button className="btn" type="button" disabled>Disabled</button>
            </div>
          </section>
          <section aria-label="Badges" className="flex flex-col gap-2">
            <div className="label">Badges</div>
            <div className="flex flex-wrap gap-2"><Badge tone="profit">BUY</Badge><Badge tone="loss">SELL</Badge><Badge tone="profit">WIN</Badge><Badge tone="loss">LOSS</Badge><Badge>BE</Badge><Badge tone="warn">CAUTION</Badge><Badge tone="accent">NEW</Badge></div>
          </section>
          <section aria-label="Selectors" className="flex flex-col gap-2">
            <div className="label">Segmented / tabs</div>
            <Segmented label="Example" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Days' }, { value: 'b', label: 'Weeks' }, { value: 'c', label: 'Months' }]} />
            <Tabs label="Example tabs" value={tab} onChange={setTab} options={[{ value: 'x', label: 'Overview' }, { value: 'y', label: 'Details' }]} />
          </section>
          <section aria-label="Inputs" className="flex flex-col gap-2">
            <div className="label">Inputs</div>
            <Field label="Symbol" hint="Helper text sits under the field"><input className="field" placeholder="XAUUSD" /></Field>
          </section>
          <section aria-label="Progress and stats" className="flex flex-col gap-3">
            <div className="label flex items-center gap-1.5">Progress & stats <InfoTip text="Tooltips explain a metric; they open on hover, tap or keyboard focus." /></div>
            <Bar value={0.62} /><Bar value={0.4} tone="loss" />
            <div className="grid grid-cols-3 gap-3"><Stat label="Trades" value="386" /><Stat label="Win rate" value="46.9%" /><Stat label="PF" value="0.68" /></div>
          </section>
          <section aria-label="Cards" className="grid grid-cols-2 gap-3">
            <div className="card p-4"><div className="label">Card</div><div className="num text-[22px] font-semibold mt-1">0.76</div></div>
            <div className="card-hero p-4"><div className="label !text-white/80">Hero card</div><div className="num text-[22px] font-bold mt-1">+$1,204</div></div>
          </section>
        </div>
        <div className="mt-6">
          <div className="label mb-2">Table</div>
          <table className="w-full">
            <thead className="pillhead"><tr><th className="th">Symbol</th><th className="th">Side</th><th className="th">Result</th><th className="th text-right">Net</th></tr></thead>
            <tbody>
              {[['XAUUSD', 'buy', 145.39], ['NAS100', 'sell', -39.11]].map(([s, side, n]) => (
                <tr key={s as string} className="hover:bg-raised/60">
                  <td className="td font-medium pl-4">{s}</td>
                  <td className="td"><Badge tone={side === 'buy' ? 'profit' : 'loss'}>{side === 'buy' ? 'BUY' : 'SELL'}</Badge></td>
                  <td className="td"><Badge tone={(n as number) > 0 ? 'profit' : 'loss'}>{(n as number) > 0 ? 'WIN' : 'LOSS'}</Badge></td>
                  <td className={cx('td num text-right font-semibold pr-4', (n as number) > 0 ? 'text-profit' : 'text-loss')}>{(n as number) > 0 ? '+' : '−'}${Math.abs(n as number).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHead title="Accessibility baseline" sub="A component ships only if it passes" />
        <ul className="text-[13px] text-ink2 flex flex-col gap-1.5 list-disc pl-5">
          <li>WCAG 2.2 AA: text contrast ≥ 4.5:1 (checked live above), targets ≥ 24px, every control labelled.</li>
          <li>Keyboard: every action reachable with Tab, visible focus ring in the accent colour, Esc closes sheets.</li>
          <li>Automated: <code>node scripts/a11y.mjs</code> runs axe-core on the main pages in both themes and fails on any violation.</li>
        </ul>
      </Card>
    </Page>
  );
}
