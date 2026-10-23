// The Active Trading Sandbox: a self-contained practice page (src/sandbox/index.html). It is bundled into this
// lazy route and shown via srcdoc / a blob URL, so it has no public URL: only a logged-in user can open it.
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/ui/Icon';
import html from '@/sandbox/index.html?raw';
import css from '@/sandbox/sandbox.css?raw';
import lucide from '@/sandbox/lucide.min.js?raw';
import p001 from '@/sandbox/charts_p001.json';
import p081 from '@/sandbox/charts_p081.json';
import p161 from '@/sandbox/charts_p161.json';
import p241 from '@/sandbox/charts_p241.json';
import p321 from '@/sandbox/charts_p321.json';
import p401 from '@/sandbox/charts_p401.json';

// inline JSON safely inside a <script> (no "</script>" or "<!--" can end it)
const safeJson = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

function buildDoc(): string {
  return html
    .replace('<link rel="stylesheet" href="sandbox.css">', () => `<style>${css}</style>`)
    .replace('<script src="lucide.min.js"></script>', () => `<script>${lucide}</script>\n<script>window.__SANDBOX_DATA__ = ${safeJson([p001, p081, p161, p241, p321, p401])};</script>`);
}

export default function Sandbox() {
  const [ready, setReady] = useState(false);
  const doc = useMemo(buildDoc, []);
  const [blobUrl, setBlobUrl] = useState('');
  useEffect(() => {
    const u = URL.createObjectURL(new Blob([doc], { type: 'text/html' }));
    setBlobUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [doc]);
  return (
    <div className="relative -mx-1 sm:mx-0 h-[calc(100dvh-9rem)] min-h-[520px] lg:h-[calc(100dvh-7rem)] rounded-2xl overflow-hidden ring-1 ring-line bg-[#0b0f17]">
      {!ready && <div className="absolute inset-0 grid place-items-center text-ink3 text-[13px]" aria-hidden="true"><span className="inline-flex items-center gap-2"><Icon name="refresh" size={14} className="animate-spin motion-reduce:animate-none" />Loading the sandbox…</span></div>}
      <iframe title="The Active Trading Sandbox" srcDoc={doc} className="absolute inset-0 w-full h-full border-0" onLoad={() => setReady(true)} allow="fullscreen" />
      {blobUrl && <a href={blobUrl} target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 btn h-8 px-3 text-[12px] opacity-80 hover:opacity-100 max-sm:hidden"><Icon name="link" size={13} />Open full window</a>}
    </div>
  );
}
