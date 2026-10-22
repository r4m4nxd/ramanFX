// Loads the (large) interactive lesson data on demand, once, as its own chunk.
import { useEffect, useState } from 'react';

type Mod = typeof import('@/core/interactive');
let mod: Mod | null = null;
let pending: Promise<Mod> | null = null;
export function loadInteractive(): Promise<Mod> {
  if (mod) return Promise.resolve(mod);
  pending ??= import('@/core/interactive').then(m => (mod = m));
  return pending;
}
/** The interactive module, or null while it loads (or if it failed to load). */
export function useInteractiveData(enabled = true): Mod | null {
  const [m, setM] = useState<Mod | null>(mod);
  useEffect(() => {
    if (!enabled || m) return;
    let live = true;
    loadInteractive().then(x => { if (live) setM(x); }, () => { /* offline: the notes still work */ });
    return () => { live = false; };
  }, [enabled, m]);
  return m;
}
