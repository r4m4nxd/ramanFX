// Living cards: press any .card and it sinks a little, tilting toward the finger with a soft light under it; release and
// it bumps back with a small overshoot. One delegated listener for the whole app; transforms are written per card.

const INTERACTIVE = 'button, a, input, select, textarea, label, [role="slider"], [role="tab"], [role="radio"], [role="checkbox"], [contenteditable="true"], canvas, .recharts-wrapper';
const BUMP = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // gentle overshoot for the release

export function installLiveCards() {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  let card: HTMLElement | null = null, id = -1, x0 = 0, y0 = 0, pending = 0, live = false;

  const tilt = (e: PointerEvent) => {
    if (!card) return;
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    // Big cards barely move; small ones respond more, so it always reads as the same physical material.
    const big = r.height > 320 || r.width > 640;
    const deg = big ? 1.2 : 3, s = big ? 0.992 : 0.975;
    card.style.transform = `perspective(900px) rotateX(${(-ny * deg).toFixed(2)}deg) rotateY(${(nx * deg).toFixed(2)}deg) scale(${s})`;
    card.style.setProperty('--gx', `${(e.clientX - r.left).toFixed(0)}px`);
    card.style.setProperty('--gy', `${(e.clientY - r.top).toFixed(0)}px`);
  };
  const press = (e: PointerEvent) => {
    if (!card) return;
    live = true;
    card.getAnimations().forEach(a => a.cancel());
    card.style.transition = 'transform 160ms cubic-bezier(0.23, 1, 0.32, 1)';
    card.style.setProperty('--glare', '1');
    tilt(e);
  };
  const release = () => {
    const el = card; card = null; clearTimeout(pending);
    if (!el || !live) return;
    live = false;
    const from = el.style.transform;
    el.style.transition = ''; el.style.transform = ''; el.style.setProperty('--glare', '0');
    // The bump: from the pressed pose, past rest by a hair, and settle.
    el.animate([{ transform: from }, { transform: 'perspective(900px) scale(1.012)', offset: 0.45 }, { transform: 'none' }], { duration: 520, easing: BUMP });
  };
  const down = (e: PointerEvent) => {
    if (e.button || card) return;
    const t = e.target as HTMLElement;
    const c = t.closest<HTMLElement>('.card, .card-hero');
    if (!c) return;
    const inner = t.closest(INTERACTIVE);
    if (inner && inner !== c && c.contains(inner)) return; // the control inside has its own press feedback
    card = c; id = e.pointerId; x0 = e.clientX; y0 = e.clientY;
    // Touch waits a beat so the start of a scroll never squishes a card (iOS does the same with list highlights).
    if (e.pointerType === 'mouse') press(e); else pending = window.setTimeout(() => press(e), 90);
  };
  const move = (e: PointerEvent) => {
    if (!card || e.pointerId !== id) return;
    if (!live) { if (Math.hypot(e.clientX - x0, e.clientY - y0) > 8) { clearTimeout(pending); card = null; } return; }
    tilt(e);
  };
  const up = (e: PointerEvent) => { if (e.pointerId === id) release(); };
  window.addEventListener('pointerdown', down, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  window.addEventListener('scroll', release, { passive: true });
  return () => {
    window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); window.removeEventListener('scroll', release);
  };
}
