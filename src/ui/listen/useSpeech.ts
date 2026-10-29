// Read-aloud engine for lessons: sentence queue, natural-sounding variation, resume position, Media Session
// (lock screen / headphone buttons). Two voices behind one player:
//  - "Device voice": the Web Speech API, with its browser quirks handled (Chrome's long-utterance cutoff, lost onend
//    events, Safari's user-gesture rule, voices that load late).
//  - "Natural": Kokoro-82M synthesised on-device in a Web Worker (./kokoro), a few sentences ahead of an <audio>
//    element, so speed changes are instant (playbackRate with preservesPitch) and the lock screen sees real media.
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { PAUSE_RE, type NarrationChapter } from '@/core/narration';
import { currentVoice, getPrefs, getVoices, safeStorage, setPrefs, speechSupported, subscribePrefs, subscribeVoices, type Engine } from './voices';
import { disposeKokoro, ensureKokoro, getKokoroStatus, kokoroSupported, noteFallback, setPlaybackRate, subscribeKokoro, synthesize } from './kokoro/client';
import { Cancelled, SynthQueue, type Clip } from './kokoro/queue';

// ─── Segmenting ───────────────────────────────────────────────────────

export interface Segment {
  text: string; chapter: number; words: number;
  /** Multipliers on the listener's base rate / pitch. */
  rate: number; pitch: number;
  /** Silence after this sentence (ms at 1x). */
  gapAfter: number;
  firstOfChapter: boolean;
}

const MAX_CHARS = 160; // keeps every utterance well under Chrome's ~15 s cutoff, even at 0.8x

function splitLong(s: string): string[] {
  if (s.length <= MAX_CHARS) return [s];
  const mid = s.length / 2;
  let best = -1;
  const re = /[;:,]\s|\s(?:and|but|so|then|while|which|because)\s/g;
  for (let m; (m = re.exec(s));) { const at = m.index + 1; if (best < 0 || Math.abs(at - mid) < Math.abs(best - mid)) best = at; }
  if (best < 20 || best > s.length - 20) {
    best = s.lastIndexOf(' ', Math.min(s.length - 1, MAX_CHARS));
    if (best < 20) return [s];
  }
  return [...splitLong(s.slice(0, best).trim()), ...splitLong(s.slice(best).trim())];
}

const SLOW = /^(Rule number|Watch out|Another trap|And finally, a big one|And this one catches|Here's the one idea|If you remember just one)/;
const QUOTE = /^(In his words|As he puts it|He says:|He sums it up|Or, in his words|And this one:)/;
const COUNT = /^(One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty[a-z-]*):/;
const hash = (n: number) => { let x = (n + 1) * 2654435761; x ^= x >>> 13; return (x >>> 0) % 997; };

export function segmentChapters(chapters: NarrationChapter[]): Segment[] {
  const out: Segment[] = [];
  chapters.forEach((ch, ci) => {
    let first = true;
    const parts = ch.text.split(PAUSE_RE); // [text, ms, text, ms, ...]
    parts.forEach((part, pi) => {
      if (pi % 2 === 1) { if (out.length && out[out.length - 1].chapter === ci) out[out.length - 1].gapAfter += Number(part) || 0; return; }
      const sents = part.trim().split(/(?<=[.!?])\s+(?=\S)/).flatMap(splitLong).map(s => s.trim()).filter(s => /[a-z0-9]/i.test(s));
      for (const text of sents) {
        const i = out.length;
        let rate = 1, pitch = 1 + ((hash(i) % 5) - 2) * 0.008; // a hair of variation so it never drones
        if (/\?$/.test(text)) pitch += 0.06;
        else if (/!$/.test(text)) pitch += 0.04;
        if (SLOW.test(text)) rate *= 0.93;
        if (QUOTE.test(text)) { rate *= 0.95; pitch -= 0.02; }
        if (COUNT.test(text)) rate *= 1.03;
        if (/^Quick question/.test(text)) pitch += 0.05;
        if (first) pitch += 0.03;
        out.push({ text, chapter: ci, words: text.split(/\s+/).length, rate, pitch, gapAfter: /[,;:]$/.test(text) ? 60 : 120, firstOfChapter: first });
        first = false;
      }
    });
    if (out.length && out[out.length - 1].chapter === ci) out[out.length - 1].gapAfter += 750; // breath between chapters
  });
  return out;
}

/** Spoken words per minute at 1x (natural voices sit around here). */
const WPM = 165;
const CPS = 14.5; // characters per second at 1x, for word-highlight estimates when a voice gives no boundary events

// ─── Ownership: only one thing speaks at a time ───────────────────────

let ownerSeq = 0, owner = 0;
const ownerSubs = new Set<(o: number) => void>();
/** Take the speaker. `mine` runs before anyone is told, so the caller can recognise its own id. */
function claim(mine?: (id: number) => void) { owner = ++ownerSeq; const id = owner; mine?.(id); ownerSubs.forEach(f => f(id)); return id; }

// ─── Silent media element: lets Media Session controls show and keeps the tab "playing" ───

const isIOS = () => typeof navigator !== 'undefined' && (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
let silent: HTMLAudioElement | null = null;
let silentSrc = '';
function silentUrl() {
  if (silentSrc) return silentSrc;
  // 1 s of 8 kHz 8-bit mono silence.
  const n = 8000, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return (silentSrc = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
}
function keepAlive(on: boolean) {
  if (isIOS()) return; // iOS ducks/stops speech when another audio session starts
  try {
    if (on) {
      if (!silent) { silent = new Audio(silentUrl()); silent.loop = true; silent.volume = 0.01; }
      void silent.play().catch(() => undefined);
    } else silent?.pause();
  } catch { /* ignore */ }
}

// ─── Engine ───────────────────────────────────────────────────────────

export type Status = 'idle' | 'playing' | 'paused' | 'ended';
export interface WordRange { start: number; end: number; estimated: boolean }
export interface NarratorState {
  status: Status; index: number; word: WordRange | null; blocked: boolean;
  /** Natural voice: playing, but waiting for the model to download or the sentence to be synthesised. */
  buffering: boolean;
}

/** The word under character position `pos` of `text`. */
function wordAt(text: string, pos: number): { start: number; end: number } {
  const start = text.lastIndexOf(' ', Math.max(0, Math.min(text.length - 1, pos))) + 1;
  const endAt = text.indexOf(' ', start);
  return { start, end: endAt < 0 ? text.length : endAt };
}
const STALL_MS = 2500;
const natural = () => getPrefs().engine === 'kokoro' && kokoroSupported();

const posKey = (id: string) => `rfx_listen_pos:${id}`;

class Narrator {
  segs: Segment[] = [];
  id = '';
  meta = { title: '', artist: '', album: '' };
  chapterTitles: string[] = [];
  state: NarratorState = { status: 'idle', index: 0, word: null, blocked: false, buffering: false };
  private subs = new Set<() => void>();
  private token = 0;
  private me = 0;
  utter: SpeechSynthesisUtterance | null = null; // strong ref: Chrome drops onend for GC'd utterances
  private gapTimer = 0;
  private estTimer = 0;
  private watch = 0;
  private startedAt = 0;
  private lastChar = 0;  // last word boundary reached in the current sentence
  private boundarySeen = false;
  private offs: (() => void)[] = [];
  private onVis = () => { if (!document.hidden) this.checkAlive(); };
  // Natural (Kokoro) playback
  private texts: string[] = [];
  private queue: SynthQueue | null = null;
  private audio: HTMLAudioElement | null = null;
  private audioUrl = '';
  private unlocked = false;
  /** The sentence the <audio> element holds (for resume after pause), -1 if none. */
  private kIndex = -1;
  private fromAdvance = false;
  private stalls = 0;

  /** Listen for other speakers, preference changes and tab visibility (mount). */
  attach() {
    this.detachListeners();
    const f = (o: number) => { if (o !== this.me && this.state.status === 'playing') this.halt('paused'); };
    ownerSubs.add(f);
    let last = getPrefs();
    const offPrefs = subscribePrefs(() => {
      const p = getPrefs(), was = last;
      last = p;
      const playing = this.state.status === 'playing';
      if (p.engine !== was.engine) {
        this.silenceOutputs();
        this.kIndex = -1;
        if (p.engine === 'device') { this.queue?.clear(); disposeKokoro(); } // free the model's memory
        if (playing) this.speakAt(this.state.index);
        return;
      }
      if (!playing) return;
      if (p.engine === 'kokoro') {
        if (p.kokoroVoice !== was.kokoroVoice || p.kokoroCompact !== was.kokoroCompact) this.speakAt(this.state.index);
        else if (p.rate !== was.rate) this.applyRate();
      } else if (p.rate !== was.rate || p.pitch !== was.pitch || p.voiceURI !== was.voiceURI) this.speakAt(this.state.index, this.lastChar); // apply mid-sentence
    });
    document.addEventListener('visibilitychange', this.onVis);
    this.offs = [() => { ownerSubs.delete(f); }, offPrefs, () => document.removeEventListener('visibilitychange', this.onVis)];
  }
  private detachListeners() { this.offs.forEach(o => o()); this.offs = []; }

  subscribe = (f: () => void) => { this.subs.add(f); return () => { this.subs.delete(f); }; };
  getState = () => this.state;
  private set(p: Partial<NarratorState>) { this.state = { ...this.state, ...p }; this.subs.forEach(f => f()); }

  load(id: string, segs: Segment[], chapterTitles: string[], meta: { title: string; artist: string; album: string }) {
    const same = id === this.id && segs.length === this.segs.length;
    this.segs = segs; this.chapterTitles = chapterTitles; this.meta = meta;
    if (same) return;
    // Runs during render: change state silently (no notify); the hook reads it straight after.
    if (this.state.status === 'playing') {
      this.token++; this.clearTimers();
      this.silenceOutputs();
      keepAlive(false);
    }
    this.texts = segs.map(s => s.text);
    this.queue?.clear(); // a different lesson: cancel any synthesis in flight
    this.kIndex = -1;
    this.id = id;
    let index = 0;
    try {
      const saved = JSON.parse(safeStorage.get(posKey(id)) || 'null') as { i: number; n: number } | null;
      if (saved && saved.n === segs.length && saved.i > 0 && saved.i < segs.length) index = saved.i;
    } catch { /* ignore */ }
    this.lastChar = 0;
    this.state = { status: 'idle', index, word: null, blocked: false, buffering: false };
  }

  private save(i: number) { if (this.id) safeStorage.set(posKey(this.id), JSON.stringify({ i, n: this.segs.length, t: Date.now() })); }
  private clearTimers() { window.clearTimeout(this.gapTimer); window.clearInterval(this.estTimer); window.clearInterval(this.watch); this.gapTimer = this.estTimer = this.watch = 0; }

  /** Stop whatever is making sound (both engines), without touching state. */
  private silenceOutputs() {
    if (speechSupported() && owner === this.me) window.speechSynthesis.cancel();
    try { this.audio?.pause(); } catch { /* ignore */ }
  }

  /** Stop the voice but keep the position. */
  private halt(status: Status) {
    this.token++;
    this.clearTimers();
    this.silenceOutputs();
    keepAlive(false);
    this.save(this.state.index);
    this.set({ status, word: null, buffering: false });
    this.media();
  }

  /** Must be called straight from a click/keypress the first time (iOS/Safari). */
  speakAt(i: number, fromChar = 0) {
    const cont = this.fromAdvance;
    this.fromAdvance = false;
    if (natural()) { this.naturalAt(i, cont); return; }
    this.deviceAt(i, fromChar);
  }

  private deviceAt(i: number, fromChar = 0) {
    if (!speechSupported() || !this.segs.length) return;
    const synth = window.speechSynthesis;
    i = Math.max(0, Math.min(this.segs.length - 1, i));
    this.clearTimers();
    const tok = ++this.token;
    claim(id => { this.me = id; });
    synth.cancel();
    try { this.audio?.pause(); } catch { /* ignore */ }
    this.kIndex = -1;
    const seg = this.segs[i];
    // Resume from the start of the word we were on.
    const from = fromChar > 0 && fromChar < seg.text.length - 3 ? Math.max(0, seg.text.lastIndexOf(' ', fromChar) + 1) : 0;
    this.lastChar = from; this.boundarySeen = false;
    const u = new SpeechSynthesisUtterance(seg.text.slice(from));
    const p = getPrefs(), voice = currentVoice();
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
    u.rate = Math.min(2.4, Math.max(0.5, p.rate * seg.rate));
    u.pitch = Math.min(2, Math.max(0.1, p.pitch * seg.pitch));
    u.volume = 1;
    u.onstart = () => {
      if (tok !== this.token) return;
      this.startedAt = performance.now();
      if (!this.boundarySeen) this.startEstimate(tok, seg.text, from, u.rate);
    };
    u.onboundary = e => {
      if (tok !== this.token || (e.name && e.name !== 'word')) return;
      this.boundarySeen = true;
      window.clearInterval(this.estTimer);
      const start = from + e.charIndex;
      const len = (e as SpeechSynthesisEvent & { charLength?: number }).charLength || (seg.text.slice(start).match(/^\S+/)?.[0].length ?? 1);
      this.lastChar = start;
      this.set({ word: { start, end: start + len, estimated: false } });
    };
    u.onend = () => { if (tok === this.token) this.advance(i); };
    u.onerror = e => {
      if (tok !== this.token) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (e.error === 'not-allowed') { this.halt('paused'); this.set({ blocked: true }); return; } // needs a tap first (iOS)
      this.advance(i);
    };
    this.utter = u;
    synth.speak(u);
    if (synth.paused) synth.resume(); // Chrome can stay stuck paused after a pause() elsewhere
    keepAlive(true);
    this.startedAt = performance.now();
    this.set({ status: 'playing', index: i, word: null, blocked: false, buffering: false });
    this.media();
    // Watchdog: some engines lose onend (Chrome GC bug, Safari after a lock). If nothing is speaking, move on.
    const expected = (seg.text.length - from) / (CPS * u.rate) * 1000;
    this.watch = window.setInterval(() => {
      if (tok !== this.token) return;
      const quiet = !synth.speaking && !synth.pending;
      const t = performance.now() - this.startedAt;
      if ((quiet && t > 1200) || t > expected * 3 + 8000) this.advance(i);
    }, 1000);
  }

  private startEstimate(tok: number, text: string, from: number, rate: number) {
    window.clearInterval(this.estTimer);
    const t0 = performance.now();
    let lastStart = -1;
    this.estTimer = window.setInterval(() => {
      if (tok !== this.token || this.boundarySeen) { window.clearInterval(this.estTimer); return; }
      const w = wordAt(text, from + ((performance.now() - t0) / 1000) * CPS * rate);
      if (w.start === lastStart) return;
      lastStart = w.start;
      this.lastChar = w.start;
      this.set({ word: { ...w, estimated: true } });
    }, 90);
  }

  // ── Natural voice (Kokoro) ──

  private audioEl() {
    if (!this.audio) {
      const a = new Audio();
      a.preload = 'auto';
      a.preservesPitch = true;
      (a as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
      this.audio = a;
    }
    return this.audio;
  }

  /** iOS only lets an element play later if it first played inside a tap: play a blip of silence now. */
  private unlock(a: HTMLAudioElement) {
    if (this.unlocked) return;
    this.unlocked = true;
    try { a.src = silentUrl(); a.volume = 1; void a.play().catch((e: DOMException) => { if (e?.name === 'NotAllowedError') this.unlocked = false; }); } catch { /* ignore */ }
  }

  private ensureQueue() {
    if (!this.queue) this.queue = new SynthQueue(synthesize, { ahead: 2, keepBehind: 1 });
    this.queue.setScript(this.texts, getPrefs().kokoroVoice);
    return this.queue;
  }

  private applyRate() {
    const a = this.audio, seg = this.segs[this.state.index];
    const r = getPrefs().rate;
    setPlaybackRate(r);
    if (!a) return;
    const v = Math.min(3, Math.max(0.5, r * (seg?.rate ?? 1)));
    try { a.defaultPlaybackRate = v; a.playbackRate = v; } catch { /* ignore */ }
  }

  private naturalAt(i: number, continuing: boolean) {
    if (!this.segs.length) return;
    i = Math.max(0, Math.min(this.segs.length - 1, i));
    this.clearTimers();
    const tok = ++this.token;
    claim(id => { this.me = id; });
    if (speechSupported()) window.speechSynthesis.cancel();
    keepAlive(false);
    const a = this.audioEl();
    this.unlock(a);
    try { a.pause(); } catch { /* ignore */ }
    this.kIndex = -1;
    const p = getPrefs();
    const q = this.ensureQueue();
    const wasReady = q.ready(i);
    const t0 = performance.now();
    this.set({ status: 'playing', index: i, word: null, blocked: false, buffering: !wasReady });
    this.media();
    ensureKokoro(p.kokoroCompact).then(() => (tok === this.token ? q.get(i) : Promise.reject(new Cancelled()))).then(
      clip => {
        if (tok !== this.token) return;
        if (continuing && !wasReady && performance.now() - t0 > STALL_MS) this.onStall();
        if (tok === this.token) this.playClip(tok, i, clip);
      },
      (err: unknown) => {
        if (tok !== this.token || err instanceof Cancelled) return;
        const st = getKokoroStatus();
        if (st.phase === 'error') this.fallBack(`The natural voice could not start (${st.error ?? 'unknown error'}), so the device voice is reading instead.`);
        else this.advance(i); // one sentence failed: skip it rather than stop
      },
    );
  }

  private playClip(tok: number, i: number, clip: Clip) {
    const a = this.audioEl();
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
    this.audioUrl = URL.createObjectURL(new Blob([clip.wav], { type: 'audio/wav' }));
    a.src = this.audioUrl;
    this.kIndex = i;
    this.applyRate(); // after src: loading resets playbackRate
    a.onended = () => { if (tok === this.token) this.advance(i); };
    a.onerror = () => { if (tok === this.token) this.advance(i); };
    this.set({ buffering: false });
    this.startAudio(tok, i);
  }

  private startAudio(tok: number, i: number) {
    const a = this.audio!;
    const pr = a.play();
    pr?.catch((err: DOMException) => {
      if (tok !== this.token) return;
      if (err?.name === 'NotAllowedError') { this.halt('paused'); this.set({ blocked: true }); }
    });
    // Kokoro gives no word timings: follow the audio clock through the sentence (characters ~ time).
    const text = this.segs[i].text;
    let lastStart = -1;
    window.clearInterval(this.estTimer);
    this.estTimer = window.setInterval(() => {
      if (tok !== this.token) { window.clearInterval(this.estTimer); return; }
      const d = a.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const w = wordAt(text, (a.currentTime / d) * text.length);
      if (w.start === lastStart) return;
      lastStart = w.start;
      this.lastChar = w.start;
      this.set({ word: { ...w, estimated: true } });
    }, 90);
  }

  /** Pick up a paused natural sentence exactly where it stopped. */
  private resumeNatural() {
    const a = this.audio!, i = this.kIndex;
    this.clearTimers();
    const tok = ++this.token;
    claim(id => { this.me = id; });
    if (speechSupported()) window.speechSynthesis.cancel();
    a.onended = () => { if (tok === this.token) this.advance(i); };
    a.onerror = () => { if (tok === this.token) this.advance(i); };
    this.applyRate();
    this.set({ status: 'playing', word: null, blocked: false, buffering: false });
    this.media();
    this.startAudio(tok, i);
  }

  private onStall() {
    this.stalls++;
    if (getKokoroStatus().slow && this.stalls >= 2) this.fallBack('The natural voice was slower than real time on this device, so the device voice took over.');
  }

  private fallBack(reason: string) {
    this.stalls = 0;
    noteFallback(reason);
    setPrefs({ engine: 'device' }); // the prefs listener restarts this sentence with the device voice
  }

  private advance(i: number) {
    const tok = ++this.token;
    this.clearTimers();
    const next = i + 1;
    if (next >= this.segs.length) {
      safeStorage.set(posKey(this.id), JSON.stringify({ i: 0, n: this.segs.length, t: Date.now() }));
      keepAlive(false);
      this.set({ status: 'ended', index: this.segs.length - 1, word: null });
      this.media();
      return;
    }
    this.save(next);
    this.lastChar = 0;
    const gap = this.segs[i].gapAfter / Math.max(0.8, getPrefs().rate);
    // Background tabs throttle timers hard: skip the breathing gaps there and chain straight on.
    if (gap < 40 || (typeof document !== 'undefined' && document.hidden)) { this.fromAdvance = true; this.speakAt(next); return; }
    this.set({ index: next, word: null });
    this.gapTimer = window.setTimeout(() => { if (tok === this.token) { this.fromAdvance = true; this.speakAt(next); } }, gap);
  }

  private checkAlive() {
    if (this.state.status !== 'playing' || this.gapTimer || !speechSupported() || natural()) return;
    const s = window.speechSynthesis;
    if (!s.speaking && !s.pending) this.speakAt(this.state.index, this.lastChar);
  }

  // ── Public controls ──
  play() {
    if (this.state.status === 'playing') return;
    if (this.state.status === 'ended') { this.speakAt(0); return; }
    const a = this.audio;
    if (natural() && a && this.kIndex === this.state.index && a.currentTime > 0 && !a.ended) { this.resumeNatural(); return; }
    this.speakAt(this.state.index, this.lastChar);
  }
  pause() { if (this.state.status === 'playing') this.halt('paused'); }
  toggle() { if (this.state.status === 'playing') this.pause(); else this.play(); }
  stop() { this.halt('idle'); this.lastChar = 0; this.kIndex = -1; this.queue?.clear(); }
  seek(i: number, autoplay = this.state.status === 'playing') {
    i = Math.max(0, Math.min(this.segs.length - 1, i));
    this.lastChar = 0;
    this.kIndex = -1;
    if (autoplay) this.speakAt(i);
    else { this.token++; this.clearTimers(); this.silenceOutputs(); this.set({ index: i, word: null, buffering: false, status: this.state.status === 'ended' ? 'paused' : this.state.status === 'idle' ? 'idle' : 'paused' }); this.save(i); this.media(); }
  }
  next() { this.seek(this.state.index + 1); }
  prev() { this.seek(this.lastChar > 12 ? this.state.index : this.state.index - 1); }
  chapterStart(c: number) { return Math.max(0, this.segs.findIndex(s => s.chapter === c)); }
  seekChapter(c: number, autoplay = true) { this.seek(this.chapterStart(Math.max(0, Math.min(this.chapterTitles.length - 1, c))), autoplay); }
  nextChapter() { const c = this.segs[this.state.index]?.chapter ?? 0; if (c + 1 < this.chapterTitles.length) this.seekChapter(c + 1, this.state.status === 'playing'); }
  prevChapter() {
    const c = this.segs[this.state.index]?.chapter ?? 0;
    const start = this.chapterStart(c);
    this.seekChapter(this.state.index - start <= 1 && c > 0 ? c - 1 : c, this.state.status === 'playing');
  }

  // ── Media Session ──
  private mediaBound = false;
  private media() {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      const ch = this.chapterTitles[this.segs[this.state.index]?.chapter ?? 0] ?? '';
      if (typeof MediaMetadata !== 'undefined') ms.metadata = new MediaMetadata({ title: ch ? `${ch} · ${this.meta.title}` : this.meta.title, artist: this.meta.artist, album: this.meta.album });
      ms.playbackState = this.state.status === 'playing' ? 'playing' : this.state.status === 'paused' ? 'paused' : 'none';
      if (!this.mediaBound) {
        this.mediaBound = true;
        const h: [MediaSessionAction, () => void][] = [
          ['play', () => this.play()], ['pause', () => this.pause()], ['stop', () => this.stop()],
          ['nexttrack', () => this.nextChapter()], ['previoustrack', () => this.prevChapter()],
          ['seekforward', () => this.next()], ['seekbackward', () => this.prev()],
        ];
        for (const [a, f] of h) { try { ms.setActionHandler(a, f); } catch { /* unsupported action */ } }
      }
    } catch { /* ignore */ }
  }

  /** Unmount: stop speaking (keeping the place), drop listeners and lock-screen controls. */
  detach() {
    if (this.state.status === 'playing') this.halt('paused'); else { this.token++; this.clearTimers(); }
    this.queue?.clear();
    this.kIndex = -1;
    if (this.audioUrl) { URL.revokeObjectURL(this.audioUrl); this.audioUrl = ''; }
    this.detachListeners();
    this.mediaBound = false;
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      for (const a of ['play', 'pause', 'stop', 'nexttrack', 'previoustrack', 'seekforward', 'seekbackward'] as MediaSessionAction[]) { try { navigator.mediaSession.setActionHandler(a, null); } catch { /* ignore */ } }
      try { navigator.mediaSession.metadata = null; navigator.mediaSession.playbackState = 'none'; } catch { /* ignore */ }
    }
  }
}

// ─── React hook ───────────────────────────────────────────────────────

export function useKokoroStatus() {
  return useSyncExternalStore(subscribeKokoro, getKokoroStatus, getKokoroStatus);
}
export function useVoiceList() {
  return useSyncExternalStore(subscribeVoices, getVoices, getVoices);
}
export function usePrefs() {
  return useSyncExternalStore(subscribePrefs, getPrefs, getPrefs);
}

export interface UseSpeechOptions { id: string; chapters: NarrationChapter[]; title: string; artist: string; album?: string }

export function useSpeech({ id, chapters, title, artist, album }: UseSpeechOptions) {
  const supported = speechSupported();
  const ref = useRef<Narrator | null>(null);
  if (!ref.current && supported) ref.current = new Narrator(); // created once; listeners attach in an effect
  const n = ref.current;
  const segs = useMemo(() => segmentChapters(chapters), [chapters]);
  const titles = useMemo(() => chapters.map(c => c.title), [chapters]);
  if (n) n.load(id, segs, titles, { title, artist, album: album ?? title }); // sync load so the first render shows the resume point

  const empty: NarratorState = useMemo(() => ({ status: 'idle', index: 0, word: null, blocked: false, buffering: false }), []);
  const state = useSyncExternalStore(n ? n.subscribe : noopSub, n ? n.getState : () => empty, () => empty);
  const prefs = usePrefs();
  const voices = useVoiceList();
  const kokoro = useKokoroStatus();
  useEffect(() => { if (!n) return; n.attach(); return () => n.detach(); }, [n]);

  // Timing, from word counts.
  const cum = useMemo(() => { const c: number[] = [0]; segs.forEach(s => c.push(c[c.length - 1] + s.words)); return c; }, [segs]);
  const totalWords = cum[cum.length - 1] || 1;
  const gapsAfter = useMemo(() => { const g: number[] = new Array(segs.length + 1).fill(0); for (let i = segs.length - 1; i >= 0; i--) g[i] = g[i + 1] + segs[i].gapAfter; return g; }, [segs]);
  const i = state.index;
  const wordsLeft = totalWords - cum[i];
  const remainingSec = Math.round(wordsLeft / (WPM * prefs.rate) * 60 + gapsAfter[i] / 1000 / prefs.rate);
  const totalSec = Math.round(totalWords / (WPM * prefs.rate) * 60 + gapsAfter[0] / 1000 / prefs.rate);
  const progress = state.status === 'ended' ? 1 : cum[i] / totalWords;
  const chapter = segs[i]?.chapter ?? 0;

  return {
    supported, segments: segs, chapters, state, status: state.status, index: i, chapter, word: state.word,
    progress, remainingSec, totalSec, prefs, voices, kokoro, buffering: state.buffering,
    started: state.status !== 'idle' || i > 0,
    play: () => n?.play(), pause: () => n?.pause(), toggle: () => n?.toggle(), stop: () => n?.stop(),
    seek: (k: number, autoplay?: boolean) => n?.seek(k, autoplay), next: () => n?.next(), prev: () => n?.prev(),
    nextChapter: () => n?.nextChapter(), prevChapter: () => n?.prevChapter(), seekChapter: (c: number, autoplay?: boolean) => n?.seekChapter(c, autoplay),
    /** Jump to a fraction of the lesson (0..1), by words. */
    seekFraction: (f: number, autoplay?: boolean) => { const w = f * totalWords; let k = 0; while (k < segs.length - 1 && cum[k + 1] <= w) k++; n?.seek(k, autoplay); },
    chapterFraction: (c: number) => { const k = segs.findIndex(s => s.chapter === c); return k < 0 ? 0 : cum[k] / totalWords; },
    setRate: (rate: number) => setPrefs({ rate }), setPitch: (pitch: number) => setPrefs({ pitch }), setVoice: (voiceURI: string | null) => setPrefs({ voiceURI }),
    setEngine: (engine: Engine) => { if (engine === 'kokoro') noteFallback(null); setPrefs({ engine }); },
    setKokoroVoice: (kokoroVoice: string) => setPrefs({ kokoroVoice }),
    setKokoroCompact: (kokoroCompact: boolean) => setPrefs({ kokoroCompact }),
  };
}
const noopSub = () => () => undefined;

// ─── One-off playback (e.g. a speaker icon next to the ELI5 story) ────

let oneOffToken = 0;
const oneOffSubs = new Set<() => void>();
let oneOffActive = 0;
const setOneOff = (t: number) => { oneOffActive = t; oneOffSubs.forEach(f => f()); };
export const subscribeOneOff = (f: () => void) => { oneOffSubs.add(f); return () => { oneOffSubs.delete(f); }; };
export const getOneOff = () => oneOffActive;

/**
 * Speak a short text once with the listener's chosen voice and speed. Stops anything else that is speaking
 * (including a lesson, which pauses and keeps its place). Call it from a click. Returns a stop function.
 */
export function speak(text: string, opts: { rate?: number; pitch?: number; onEnd?: () => void } = {}): () => void {
  if (!speechSupported()) { opts.onEnd?.(); return () => undefined; }
  const synth = window.speechSynthesis;
  const me = claim();
  const tok = ++oneOffToken;
  synth.cancel();
  const segs = segmentChapters([{ id: 'x', title: '', text }]);
  const p = getPrefs(), voice = currentVoice();
  let k = 0, done = false;
  const keep: SpeechSynthesisUtterance[] = [];
  const finish = () => { if (done) return; done = true; if (oneOffActive === tok) setOneOff(0); opts.onEnd?.(); };
  const off = (() => { const f = (o: number) => { if (o !== me) { finish(); } }; ownerSubs.add(f); return () => { ownerSubs.delete(f); }; })();
  const say = () => {
    if (done || tok !== oneOffToken) return;
    const seg = segs[k];
    if (!seg) { off(); finish(); return; }
    const u = new SpeechSynthesisUtterance(seg.text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
    u.rate = Math.min(2.4, Math.max(0.5, (opts.rate ?? p.rate) * seg.rate));
    u.pitch = Math.min(2, Math.max(0.1, (opts.pitch ?? p.pitch) * seg.pitch));
    u.onend = () => { k++; say(); };
    u.onerror = e => { if (e.error === 'interrupted' || e.error === 'canceled') { off(); finish(); return; } k++; say(); };
    keep.push(u);
    synth.speak(u);
  };
  setOneOff(tok);
  say();
  return () => { if (tok === oneOffToken && !done) { oneOffToken++; synth.cancel(); } off(); finish(); };
}
export function stopSpeaking() { if (speechSupported()) { claim(); oneOffToken++; window.speechSynthesis.cancel(); } }

/**
 * Preview a natural (Kokoro) voice: downloads the model on first use, pauses anything else speaking.
 * Call it from a click. Returns a stop function.
 */
export function previewNatural(text: string, voice: string, opts: { compact?: boolean; onStart?: () => void; onEnd?: (err?: string) => void } = {}): () => void {
  const me = claim();
  if (speechSupported()) window.speechSynthesis.cancel();
  const a = new Audio();
  a.preservesPitch = true;
  try { a.src = silentUrl(); void a.play().then(() => a.pause(), () => undefined); } catch { /* unlock for iOS */ }
  let done = false, url = '', job: { cancel: () => void } | null = null;
  const finish = (err?: string) => { if (done) return; done = true; off(); job?.cancel(); try { a.pause(); } catch { /* ignore */ } if (url) URL.revokeObjectURL(url); opts.onEnd?.(err); };
  const off = (() => { const f = (o: number) => { if (o !== me) finish(); }; ownerSubs.add(f); return () => { ownerSubs.delete(f); }; })();
  ensureKokoro(opts.compact).then(() => {
    if (done) return;
    const j = synthesize(text, voice, true);
    job = j;
    return j.promise.then(clip => {
      if (done) return;
      url = URL.createObjectURL(new Blob([clip.wav], { type: 'audio/wav' }));
      a.src = url;
      a.playbackRate = getPrefs().rate;
      a.onended = () => finish();
      opts.onStart?.();
      return a.play();
    });
  }).catch((e: unknown) => { if (!(e instanceof Cancelled)) finish(getKokoroStatus().error ?? (e as Error)?.message ?? 'failed'); });
  return () => finish();
}
export { speechSupported } from './voices';
