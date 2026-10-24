// One shared <audio> per recorded lesson. The lesson page's player and the book reader's narration pill both
// call useRecordedAudio(key, rec) and see the same element and state, so they never play over each other.
import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { nearestSpeed } from './ListenBar';
import { savedBlob, streamUrl, type Recorded } from './recorded';
import { safeStorage } from './voices';

const K_RATE = 'rfx_rec_rate', K_POS = 'rfx_rec_pos:';
export interface AudioMeta { title: string; artist: string; album: string }
export interface AudioState { playing: boolean; loading: boolean; t: number; rate: number; err: string | null }

class Ctl {
  a: HTMLAudioElement | null = null;
  blobUrl: string | null = null;
  refs = 0;
  meta: AudioMeta | null = null;
  st: AudioState;
  subs = new Set<() => void>();
  constructor(readonly k: string, readonly rec: Recorded) {
    this.st = { playing: false, loading: false, t: Number(safeStorage.get(K_POS + k)) || 0, rate: nearestSpeed(Number(safeStorage.get(K_RATE)) || 1), err: null };
  }
  set(p: Partial<AudioState>) { this.st = { ...this.st, ...p }; this.subs.forEach(f => f()); }
  sub = (f: () => void) => { this.subs.add(f); return () => { this.subs.delete(f); }; };
  get = () => this.st;
  get dur() { return this.rec.s; }
  /** Creates the <audio> on first play: the saved copy if there is one, else the stream. */
  async ensure(): Promise<HTMLAudioElement> {
    if (this.a) return this.a;
    const { k, rec } = this, a = new Audio();
    a.preload = 'auto';
    const blob = await savedBlob(k, rec.h);
    if (this.a) return this.a; // another caller won the race
    if (blob) { this.blobUrl = URL.createObjectURL(blob); a.src = this.blobUrl; } else a.src = await streamUrl(k);
    a.playbackRate = this.st.rate;
    let retried = false;
    a.ontimeupdate = () => { this.set({ t: a.currentTime }); if (Math.round(a.currentTime) % 5 === 0) safeStorage.set(K_POS + k, String(a.currentTime)); };
    a.onplay = () => this.set({ playing: true, err: null });
    a.onpause = () => { this.set({ playing: false }); safeStorage.set(K_POS + k, String(a.currentTime)); };
    a.onwaiting = () => this.set({ loading: true });
    a.onplaying = a.oncanplay = () => this.set({ loading: false });
    a.onended = () => { this.set({ playing: false }); safeStorage.set(K_POS + k, '0'); };
    a.onerror = async () => {
      this.set({ loading: false });
      if (this.blobUrl || retried) { this.set({ playing: false, err: navigator.onLine ? 'Could not play the recording. Try again, or use the device voice.' : 'You are offline and this lesson is not saved on this device.' }); return; }
      retried = true; // the stream link carries a sign-in token that expires: get a fresh one and carry on
      const at = a.currentTime || this.st.t;
      a.src = await streamUrl(k); a.currentTime = at; a.play().catch(() => this.set({ playing: false }));
    };
    if ('mediaSession' in navigator && this.meta) {
      navigator.mediaSession.metadata = new MediaMetadata(this.meta);
      const ms = navigator.mediaSession;
      ms.setActionHandler('play', () => a.play());
      ms.setActionHandler('pause', () => a.pause());
      ms.setActionHandler('seekbackward', () => { a.currentTime = Math.max(0, a.currentTime - 15); });
      ms.setActionHandler('seekforward', () => { a.currentTime = Math.min(this.dur, a.currentTime + 30); });
      ms.setActionHandler('previoustrack', () => this.jumpChapter(-1));
      ms.setActionHandler('nexttrack', () => this.jumpChapter(1));
    }
    this.a = a;
    a.currentTime = this.st.t >= this.dur - 2 ? 0 : this.st.t;
    return a;
  }
  toggle = async () => {
    this.set({ err: null });
    if (!this.a) this.set({ loading: true });
    const a = await this.ensure();
    if (a.paused) a.play().catch(e => { this.set({ loading: false }); if (e?.name !== 'AbortError') this.set({ err: 'Tap play again to start.' }); });
    else a.pause();
  };
  pause = () => { this.a?.pause(); };
  seek = async (s: number, play = false) => {
    s = Math.min(Math.max(0, s), this.dur - 0.5);
    this.set({ t: s }); safeStorage.set(K_POS + this.k, String(s));
    if (!this.a && !play) return;
    const a = await this.ensure(); a.currentTime = s;
    if (play && a.paused) a.play().catch(() => {});
  };
  curT = () => this.a?.currentTime ?? this.st.t;
  jumpChapter = (d: number) => {
    const c = this.rec.c, now = this.curT();
    let i = 0; c.forEach(([s], j) => { if (s <= now + 0.25) i = j; });
    // "previous" restarts the current chapter unless we're right at its start
    const target = d < 0 && now - c[i][0] > 3 ? i : Math.min(c.length - 1, Math.max(0, i + d));
    this.seek(c[target][0], true);
  };
  setRate = (r: number) => { this.set({ rate: r }); safeStorage.set(K_RATE, String(r)); if (this.a) this.a.playbackRate = r; };
  dispose() {
    this.a?.pause();
    if (this.a) { this.a.onpause = this.a.ontimeupdate = this.a.onerror = null; this.a.removeAttribute('src'); this.a.load(); }
    this.a = null;
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = null;
    if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
  }
}

const ctls = new Map<string, Ctl>();
const ctlFor = (k: string, rec: Recorded) => {
  let c = ctls.get(k);
  if (!c || c.rec.h !== rec.h) { c?.dispose(); c = new Ctl(k, rec); ctls.set(k, c); }
  return c;
};

/** Shared audio for one recorded lesson; disposed once the last user unmounts. */
export function useRecordedAudio(k: string, rec: Recorded, meta: AudioMeta) {
  const c = useMemo(() => ctlFor(k, rec), [k, rec]);
  c.meta ??= meta;
  useEffect(() => {
    c.refs++;
    return () => {
      // deferred, so a quick unmount/remount (StrictMode, a key change) keeps playing
      if (--c.refs === 0) setTimeout(() => { if (c.refs === 0 && ctls.get(c.k) === c) { c.dispose(); ctls.delete(c.k); } }, 0);
    };
  }, [c]);
  const st = useSyncExternalStore(c.sub, c.get);
  const chapters = rec.c;
  const ch = useMemo(() => { let i = 0; chapters.forEach(([s], j) => { if (s <= st.t + 0.25) i = j; }); return i; }, [chapters, st.t]);
  return { ...st, ch, dur: rec.s, chapters, hasAudio: () => !!c.a, toggle: c.toggle, pause: c.pause, seek: c.seek, curT: c.curT, jumpChapter: c.jumpChapter, setRate: c.setRate, setErr: (err: string | null) => c.set({ err }) };
}
