import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/data/store';
import { cx } from './kit';

/**
 * Any of TradingView's official embed widgets (s3.tradingview.com/external-embedding/<script>).
 * Never transparent: a transparent iframe is painted white by the browser in dark mode.
 * `fit`: pass the box's measured pixel size — some widgets collapse when told "100%".
 */
export function TvEmbed({ script, config, className, title, fit = false }: { script: string; config: Record<string, unknown>; className?: string; title: string; fit?: boolean }) {
  const theme = useStore(st => st.theme);
  const outer = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
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
    const w = document.createElement('div');
    w.className = 'tradingview-widget-container__widget';
    const s = document.createElement('script');
    s.src = `https://s3.tradingview.com/external-embedding/${script}`;
    s.async = true;
    s.type = 'text/javascript';
    s.textContent = JSON.stringify({ colorTheme: theme, theme, isTransparent: false, locale: 'en', ...sized });
    el.append(w, s);
    return () => { el.innerHTML = ''; };
  }, [script, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={outer} aria-label={title} className={cx('relative overflow-hidden', className)} style={{ colorScheme: theme }}>
      <div ref={box} className={cx('tradingview-widget-container', fit ? 'absolute inset-0' : 'w-full h-full')} />
    </div>
  );
}
