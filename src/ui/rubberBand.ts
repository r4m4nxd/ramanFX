// iOS-style overscroll for browsers that don't do it natively (Android, desktop wheel/trackpad).
// Pulling past the top or bottom stretches the page with rising resistance (follows the finger like SwiftUI's
// .interactiveSpring); letting go settles it back critically damped (.smooth, no bounce). A fling that hits an edge
// spends its leftover momentum as a small stretch-and-settle instead of stopping dead.

const SETTLE = 'cubic-bezier(0.22, 1, 0.36, 1)';
/** Apple's rubber-band curve: displacement grows ever slower the further you pull, never past `dim`. */
const rubber = (x: number, dim: number) => Math.sign(x) * (1 - 1 / ((Math.abs(x) * 0.55) / dim + 1)) * dim;

export function installRubberBand(el: HTMLElement) {
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  // iOS Safari has the real thing natively (index.css re-enables it there).
  if (CSS.supports('-webkit-touch-callout', 'none')) return () => {};
  const doc = document.scrollingElement ?? document.documentElement;
  const atTop = () => doc.scrollTop <= 0;
  const atBottom = () => doc.scrollTop + window.innerHeight >= doc.scrollHeight - 1;
  let offset = 0, y0 = 0, pulling = false, touching = false, wheelRaw = 0, wheelIdle = 0;
  const set = (px: number) => { offset = px; el.style.transition = 'none'; el.style.transform = px ? `translate3d(0, ${px.toFixed(1)}px, 0)` : ''; };
  const settle = (ms = 520) => {
    if (!offset) return;
    el.style.transition = `transform ${ms}ms ${SETTLE}`; el.style.transform = ''; offset = 0;
  };

  // Touch: stretch while pulling past an edge.
  const start = (e: TouchEvent) => { if (e.touches.length !== 1) return; touching = true; pulling = false; y0 = e.touches[0].clientY; };
  const move = (e: TouchEvent) => {
    if (!touching || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - y0;
    if (!pulling) {
      if ((dy > 0 && atTop()) || (dy < 0 && atBottom())) { pulling = true; y0 = e.touches[0].clientY; el.getAnimations().forEach(a => a.cancel()); }
      else { y0 = e.touches[0].clientY; return; }
    }
    const d = e.touches[0].clientY - y0;
    // Pushed back past the start: hand control back to normal scrolling.
    if ((offset >= 0 && d < 0 && atTop() && !atBottom()) || (offset <= 0 && d > 0 && atBottom() && !atTop())) { set(0); pulling = false; y0 = e.touches[0].clientY; return; }
    set(rubber(d, window.innerHeight));
  };
  const end = () => { touching = false; pulling = false; settle(); };

  // Wheel / trackpad: same stretch, settles once the wheel goes quiet.
  const wheel = (e: WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const pushingUp = e.deltaY < 0 && atTop(), pushingDown = e.deltaY > 0 && atBottom();
    if (!pushingUp && !pushingDown) { if (offset) { wheelRaw = 0; settle(260); } return; }
    wheelRaw += -e.deltaY * (e.deltaMode === 1 ? 16 : 1) * 0.6;
    if ((pushingUp && wheelRaw < 0) || (pushingDown && wheelRaw > 0)) wheelRaw = 0;
    set(rubber(wheelRaw, window.innerHeight * 0.6));
    clearTimeout(wheelIdle);
    wheelIdle = window.setTimeout(() => { wheelRaw = 0; settle(); }, 110);
  };

  // Fling into an edge: convert the remaining scroll velocity into a short stretch, then settle.
  let lastY = doc.scrollTop, lastT = performance.now(), v = 0;
  const scroll = () => {
    const now = performance.now(), y = doc.scrollTop, dt = Math.max(1, now - lastT);
    v = 0.6 * v + 0.4 * ((y - lastY) / dt); lastY = y; lastT = now;
    if (touching || offset || Math.abs(v) < 0.8) return;
    const edge = (v < 0 && atTop()) ? 1 : (v > 0 && atBottom()) ? -1 : 0;
    if (!edge) return;
    const amp = edge * Math.min(64, Math.abs(v) * 22);
    v = 0;
    el.animate([
      { transform: 'translate3d(0,0,0)', easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: `translate3d(0, ${amp.toFixed(1)}px, 0)`, offset: 0.3, easing: SETTLE },
      { transform: 'translate3d(0,0,0)' },
    ], { duration: 640 });
  };

  window.addEventListener('touchstart', start, { passive: true });
  window.addEventListener('touchmove', move, { passive: true });
  window.addEventListener('touchend', end); window.addEventListener('touchcancel', end);
  window.addEventListener('wheel', wheel, { passive: true });
  window.addEventListener('scroll', scroll, { passive: true });
  return () => {
    window.removeEventListener('touchstart', start); window.removeEventListener('touchmove', move);
    window.removeEventListener('touchend', end); window.removeEventListener('touchcancel', end);
    window.removeEventListener('wheel', wheel); window.removeEventListener('scroll', scroll); clearTimeout(wheelIdle);
  };
}
