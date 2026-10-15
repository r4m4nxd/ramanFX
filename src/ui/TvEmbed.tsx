import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/data/store';
import { cx } from './kit';

/**
 * Any of TradingView's official embed widgets (s3.tradingview.com/external-embedding/<script>).
 * Never transparent: a transparent iframe is painted white by the browser in dark mode.
 * `fit`: pass the box's measured pixel size — some widgets collapse when told "100%".
 * `auto`: the widget sets its own height (ticker tape); otherwise it fills the box.
 */
export function TvEmbed({ script, config, className, title, fit = false, auto = false }: { script: string; config: Record<string, unknown>; className?: string; title: string; fit?: boolean; auto?: boolean }) {
  const theme = useStore(st => st.theme);
  const outer = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!fit || !outer.current) return;
    const el = outer.current;
    let t = 0;
    const measure = () => { const r = el.getBoundingClientRect(); const w = Math.floor(r.width), h = Math.floor(r.height); setSize(s => (s && Math.abs(s.w - w) < 8 && Math.abs(s.h - h) < 8 ? s : { w, h })); };
    measure();
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(measure, 250); });
    ro.observe(el);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [fit]);
  const sized = fit ? (size && size.w > 50 && size.h > 50 ? { ...config, width: size.w, height: size.h, autosize: false } : null) : config;
  const key = JSON.stringify(sized) + theme;
  useEffect(() => {
    const el = box.current;
    if (!el || !sized) return;
    el.innerHTML = '';
    setReady(false); setFailed(false);
    // The widget's iframe paints over the placeholder; we only need to know when it exists.
    const mo = new MutationObserver(() => { if (el.querySelector('iframe')) { setReady(true); mo.disconnect(); } });
    mo.observe(el, { childList: true, subtree: true });
    const slow = window.setTimeout(() => { if (!el.querySelector('iframe')) setFailed(true); }, 15000);
    const w = document.createElement('div');
    w.className = 'tradingview-widget-container__widget';
    w.style.cssText = auto ? 'width:100%' : 'height:100%;width:100%';
    const s = document.createElement('script');
    s.src = `https://s3.tradingview.com/external-embedding/${script}`;
    s.async = true;
    s.type = 'text/javascript';
    s.onerror = () => setFailed(true);
    s.textContent = JSON.stringify({ colorTheme: theme, theme, isTransparent: false, locale: 'en', ...sized });
    el.append(w, s);
    return () => { mo.disconnect(); clearTimeout(slow); el.innerHTML = ''; };
  }, [script, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={outer} role="region" aria-label={title} aria-busy={!ready && !failed} className={cx(className?.includes('absolute') ? '' : 'relative', 'overflow-hidden', className)} style={{ colorScheme: theme }}>
      {!auto && !ready && (
        <div className={cx('absolute inset-0 grid place-items-center bg-raised/40 text-center px-6', !failed && 'motion-safe:animate-pulse')} aria-hidden={!failed}>
          <div className="text-[12.5px] text-ink3 max-w-[320px]">
            {failed ? <><span className="text-ink2 font-medium block">{title} didn't load</span>TradingView may be blocked by a content blocker or the network. Allow s3.tradingview.com, then reload.</> : <>Loading {title} from TradingView…</>}
          </div>
        </div>
      )}
      <div ref={box} className={cx('tradingview-widget-container', auto ? 'w-full' : 'absolute inset-0')} />
    </div>
  );
}
