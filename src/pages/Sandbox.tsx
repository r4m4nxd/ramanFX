// The Active Trading Sandbox: a self-contained practice page (public/sandbox/index.html), framed full-height in the app.
import { useState } from 'react';
import { Icon } from '@/ui/Icon';

export default function Sandbox() {
  const [ready, setReady] = useState(false);
  return (
    <div className="relative -mx-1 sm:mx-0 h-[calc(100dvh-9rem)] min-h-[520px] lg:h-[calc(100dvh-7rem)] rounded-2xl overflow-hidden ring-1 ring-line bg-[#0b0f17]">
      {!ready && <div className="absolute inset-0 grid place-items-center text-ink3 text-[13px]" aria-hidden="true"><span className="inline-flex items-center gap-2"><Icon name="refresh" size={14} className="animate-spin motion-reduce:animate-none" />Loading the sandbox…</span></div>}
      <iframe title="The Active Trading Sandbox" src="/sandbox/index.html" className="absolute inset-0 w-full h-full border-0" onLoad={() => setReady(true)} allow="fullscreen" />
      <a href="/sandbox/index.html" target="_blank" rel="noopener noreferrer" className="absolute top-2 right-2 btn h-8 px-3 text-[12px] opacity-80 hover:opacity-100 max-sm:hidden"><Icon name="link" size={13} />Open full window</a>
    </div>
  );
}
