// Pre-rendered lesson narration (studio-quality male voice), streamed from the owner's Google Drive through the
// signed-in-only `lesson-audio` edge function, and optionally saved on this device for offline listening.
import { supa } from '@/data/cloud';

export interface Recorded { s: number; h: string; b: number; c: [number, string][] }
let index: Promise<Record<string, Recorded>> | null = null;
/** Lazy: the index (~100 KB) only loads when a lesson page asks for it. */
export const recordedIndex = () => (index ??= import('@/core/narration/recorded.json').then(m => m.default as unknown as Record<string, Recorded>));

const FN = 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/lesson-audio';
const CACHE = 'rfx-lesson-audio';
const cacheKey = (key: string, h: string) => `https://rfx-audio.local/${key.replace(':', '/')}?h=${h}`;

async function token(): Promise<string> {
  const { data } = await supa().auth.getSession();
  return data.session?.access_token ?? '';
}
export async function streamUrl(key: string) {
  return `${FN}?k=${encodeURIComponent(key)}&t=${encodeURIComponent(await token())}`;
}

const caches_ = () => (typeof caches !== 'undefined' ? caches.open(CACHE) : Promise.reject(new Error('no cache storage')));

export async function savedBlob(key: string, h: string): Promise<Blob | null> {
  try { const r = await (await caches_()).match(cacheKey(key, h)); return r ? await r.blob() : null; } catch { return null; }
}
export async function isSaved(key: string, h: string) {
  try { return !!(await (await caches_()).match(cacheKey(key, h))); } catch { return false; }
}
/** Drops every saved copy of this lesson (any version). */
export async function removeSaved(key: string) {
  try {
    const c = await caches_();
    const pre = cacheKey(key, '').replace(/\?h=$/, '?');
    for (const r of await c.keys()) if (r.url.startsWith(pre)) await c.delete(r);
  } catch { /* nothing saved */ }
}
/** All saved lesson keys with their size, for the "on this device" summary. */
export async function savedList(): Promise<{ key: string; h: string }[]> {
  try {
    return (await (await caches_()).keys()).map(r => {
      const u = new URL(r.url); const [, src, n] = u.pathname.split('/');
      return { key: `${src}:${n}`, h: u.searchParams.get('h') ?? '' };
    });
  } catch { return []; }
}

/** Downloads the whole file in 4 MB ranges (what the edge function serves per request) and stores it on this device. */
export async function saveOffline(key: string, rec: Recorded, onProgress?: (f: number) => void, signal?: AbortSignal) {
  const parts: BlobPart[] = [];
  let got = 0, total = rec.b;
  const t = await token();
  while (got < total) {
    const r = await fetch(`${FN}?k=${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${t}`, Range: `bytes=${got}-` }, signal });
    if (r.status === 401) throw new Error('Sign in again to download.');
    if (!r.ok) throw new Error(r.status === 404 ? 'This recording is not on Drive yet.' : `Download failed (${r.status}).`);
    const m = /\/(\d+)$/.exec(r.headers.get('content-range') ?? '');
    if (m) total = +m[1];
    const b = await r.arrayBuffer();
    if (!b.byteLength) break;
    parts.push(b); got += b.byteLength; onProgress?.(Math.min(1, got / total));
  }
  await removeSaved(key);
  await (await caches_()).put(cacheKey(key, rec.h), new Response(new Blob(parts, { type: 'audio/mp4' }), { headers: { 'Content-Type': 'audio/mp4' } }));
  try { await navigator.storage?.persist?.(); } catch { /* best effort */ }
}
