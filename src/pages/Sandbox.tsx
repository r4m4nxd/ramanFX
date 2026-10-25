// The Active Trading Sandbox: a self-contained practice page (src/sandbox/index.html). It is bundled into this
// lazy route and shown via srcdoc / a blob URL, so it has no public URL: only a logged-in user can open it.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Icon } from '@/ui/Icon';
import { useStore } from '@/data/store';
import html from '@/sandbox/index.html?raw';
// ?inline: Vite runs Tailwind on it with the sandbox's own config (see @config in sandbox.css).
import css from '@/sandbox/sandbox.css?inline';
import lucide from '@/sandbox/lucide.min.js?raw';
import p001 from '@/sandbox/charts_p001.json';
import p081 from '@/sandbox/charts_p081.json';
import p161 from '@/sandbox/charts_p161.json';
import p241 from '@/sandbox/charts_p241.json';
import p321 from '@/sandbox/charts_p321.json';
import p401 from '@/sandbox/charts_p401.json';

// inline JSON safely inside a <script> (no "</script>" or "<!--" can end it)
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

/** App design tokens handed to the sandbox, so it renders in the same theme, accent and shapes as the app. */
const TOKENS = [
  'bg', 'surface', 'raised', 'line', 'line2', 'ink', 'ink2', 'ink3', 'accent', 'accent-hi', 'accent-press', 'on-accent',
  'profit', 'loss', 'warn', 'violet', 'on-status', 'pill-on-bg', 'pill-on-edge', 'pill-on-ink',
  'radius-xs', 'radius-control', 'radius-inner', 'radius-card', 'radius-panel', 'ease-out', 'ease-drawer',
  'glass-tint', 'glass-tint-2', 'glass-rim', 'glass-spec', 'pop-tint', 'pop-tint-2', 'lens-tint', 'spec-soft',
  'ctl-hi', 'ctl-hi-hover', 'ctl-lo', 'card-fill', 'card-edge', 'hairline',
];
function tokenCss(): string {
  const cs = getComputedStyle(document.documentElement);
  // :root:root outranks the sandbox's own [data-theme] fallbacks
  return `:root:root{${TOKENS.map(t => { const v = cs.getPropertyValue(`--${t}`).trim(); return v ? `--${t}:${v};` : ''; }).join('')}}`;
}
const themeOf = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

/** `embed`: shown inside the app (the page gets a full-window button); otherwise the standalone full-window copy. */
function buildDoc(embed: boolean): string {
  return html
    .replace('<html lang="en" data-theme="dark">', () => `<html lang="en" data-theme="${themeOf()}"${embed ? ' data-embed' : ''}>`)
    // a blob: document has no usable base URL, so chart images (/lessons/…) resolve against the app's origin
    .replace('<meta charset="utf-8">', () => `<meta charset="utf-8">\n<base href="${location.origin}/">`)
    .replace('<link rel="stylesheet" href="sandbox.css">', () => `<style>${css}</style>`)
    .replace('<script src="lucide.min.js"></script>', () => `<script>${lucide}</script>\n<script>window.__SANDBOX_DATA__ = ${safeJson([p001, p081, p161, p241, p321, p401])};</script>`)
    .replace('</head>', () => `<style id="app-tokens">${tokenCss()}</style>\n</head>`);
}

const MIN_H = 300; // below this the frame stops shrinking and the page scrolls instead
const GAP = 10;    // breathing room above the tab bar / window edge

/**
 * Fit the frame between whatever sits above it (header, large title) and the floating tab bar (or the window
 * edge when there is none), and cancel <main>'s bottom padding so the page itself never scrolls: nothing in the
 * sandbox can slide under the header or the tab bar. Measured with offset* (transforms from page transitions
 * don't count) and re-measured on resize / rotation.
 */
function useFitHeight(ref: RefObject<HTMLElement>) {
  const [box, setBox] = useState<{ h: number; mb: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const measure = () => {
      let top = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) top += n.offsetTop;
      const vh = window.innerHeight;
      const tab = document.querySelector<HTMLElement>('nav.vt-bar-bottom');
      const tabOn = tab && getComputedStyle(tab).display !== 'none' && tab.offsetHeight > 0;
      const bottom = tabOn ? vh - (parseFloat(getComputedStyle(tab).bottom) || 0) - tab.offsetHeight - GAP : vh - 12;
      const main = el.closest('main');
      const pb = main ? parseFloat(getComputedStyle(main).paddingBottom) || 0 : 0;
      const avail = Math.floor(bottom - top);
      const h = Math.max(MIN_H, avail);
      // page height = top + h + mb + pb; make it exactly the viewport when the frame fits
      const mb = h === avail ? Math.min(0, Math.floor(vh - top - h - pb)) : 0;
      setBox(b => (b && b.h === h && b.mb === mb ? b : { h, mb }));
    };
    measure();
    const raf = requestAnimationFrame(measure);
    const late = window.setTimeout(measure, 450); // after the page-enter transition settles
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    const ro = new ResizeObserver(measure);
    const main = el.closest('main'); if (main) ro.observe(main);
    return () => { cancelAnimationFrame(raf); clearTimeout(late); window.removeEventListener('resize', measure); window.removeEventListener('orientationchange', measure); ro.disconnect(); };
  }, [ref]);
  return box;
}

export default function Sandbox() {
  const [ready, setReady] = useState(false);
  const theme = useStore(s => s.theme);
  const doc = useMemo(() => buildDoc(true), []); // built once: a theme change is pushed in live, never reloads the frame
  const frame = useRef<HTMLIFrameElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const box = useFitHeight(wrap);
  const [blobUrl, setBlobUrl] = useState('');

  // Full-window copy (per-session blob URL) in the current theme.
  useEffect(() => {
    const u = URL.createObjectURL(new Blob([buildDoc(false)], { type: 'text/html' }));
    setBlobUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [theme]);

  // Push the theme tokens and the full-window link into the running sandbox.
  useEffect(() => {
    const d = frame.current?.contentDocument;
    if (!ready || !d) return;
    d.documentElement.dataset.theme = themeOf();
    const st = d.getElementById('app-tokens'); if (st) st.textContent = tokenCss();
    const a = d.getElementById('fullBtn'); if (a && blobUrl) a.setAttribute('href', blobUrl);
  }, [ready, theme, blobUrl]);

  return (
    <div ref={wrap} style={box ? { height: box.h, marginBottom: box.mb } : undefined}
      className="relative -mx-1 sm:mx-0 h-[calc(100dvh-13rem)] lg:h-[calc(100dvh-7rem)] rounded-2xl overflow-hidden ring-1 ring-line bg-bg">
      {!ready && <div className="absolute inset-0 grid place-items-center text-ink3 text-[13px]" aria-hidden="true"><span className="inline-flex items-center gap-2"><Icon name="refresh" size={14} className="animate-spin motion-reduce:animate-none" />Loading the sandbox…</span></div>}
      <iframe ref={frame} title="The Active Trading Sandbox" srcDoc={doc} className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-200 ${ready ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setReady(true)} allow="fullscreen" />
    </div>
  );
}
