// Look-ahead synthesis queue for the natural (Kokoro) narrator. Pure logic, no DOM or worker: the synthesiser is
// injected, so it is unit-tested with a fake. The player asks for sentence i; the queue starts i first (urgent), then
// keeps `ahead` sentences synthesising behind it, and cancels anything that falls outside the window (a seek or a
// lesson change), so a long lesson never waits on more than one sentence.

export interface Clip {
  /** A ready-to-play WAV file. */
  wav: ArrayBuffer;
  sampleRate: number;
  /** Audio length at 1x. */
  durationMs: number;
  /** Time the model spent on this sentence (excluding time waiting in the queue). */
  synthMs: number;
}
export interface SynthJob { promise: Promise<Clip>; cancel: () => void }
/** `urgent` = the listener is waiting for this one right now: put it at the front of the line. */
export type Synthesize = (text: string, voice: string, urgent: boolean) => SynthJob;

export class Cancelled extends Error { constructor() { super('cancelled'); this.name = 'Cancelled'; } }

interface Entry { key: string; job: SynthJob; clip?: Clip }

export interface QueueOptions { ahead?: number; keepBehind?: number; onClip?: (i: number, clip: Clip) => void }

export class SynthQueue {
  private entries = new Map<number, Entry>();
  private texts: readonly string[] = [];
  private voice = '';
  readonly ahead: number;
  readonly keepBehind: number;
  private onClip?: (i: number, clip: Clip) => void;

  constructor(private synth: Synthesize, opts: QueueOptions = {}) {
    this.ahead = opts.ahead ?? 2;
    this.keepBehind = opts.keepBehind ?? 1;
    this.onClip = opts.onClip;
  }

  /** Set the lesson script and voice. Anything synthesised for a different script or voice is dropped. */
  setScript(texts: readonly string[], voice: string) {
    const same = voice === this.voice && texts.length === this.texts.length && texts.every((t, i) => t === this.texts[i]);
    this.texts = texts;
    if (same) return;
    this.voice = voice;
    this.clear();
  }

  private key(i: number) { return `${this.voice}\u0000${this.texts[i]}`; }

  /** The clip for sentence i. Also starts the next `ahead` sentences and cancels work outside the window. */
  get(i: number): Promise<Clip> {
    if (i < 0 || i >= this.texts.length) return Promise.reject(new RangeError(`no sentence ${i}`));
    this.trim(i);
    const e = this.ensure(i, true);
    for (let k = 1; k <= this.ahead; k++) if (i + k < this.texts.length) this.ensure(i + k, false);
    return e.clip ? Promise.resolve(e.clip) : e.job.promise;
  }

  /** True when sentence i is already synthesised (no wait). */
  ready(i: number) { const e = this.entries.get(i); return !!e?.clip && e.key === this.key(i); }

  /** Indices currently held (ready or in flight), for tests and debugging. */
  held() { return [...this.entries.keys()].sort((a, b) => a - b); }

  private ensure(i: number, urgent: boolean): Entry {
    const key = this.key(i);
    const old = this.entries.get(i);
    if (old && old.key === key) return old;
    old?.job.cancel();
    const job = this.synth(this.texts[i], this.voice, urgent);
    const e: Entry = { key, job };
    this.entries.set(i, e);
    job.promise.then(
      clip => { if (this.entries.get(i) === e) { e.clip = clip; this.onClip?.(i, clip); } },
      () => { if (this.entries.get(i) === e) this.entries.delete(i); }, // failed or cancelled: retry on next get()
    );
    return e;
  }

  private trim(i: number) {
    for (const [k, e] of this.entries) {
      if (k < i - this.keepBehind || k > i + this.ahead) { if (!e.clip) e.job.cancel(); this.entries.delete(k); }
    }
  }

  /** Cancel everything in flight and forget all clips (stop, lesson change, voice change). */
  clear() {
    for (const e of this.entries.values()) if (!e.clip) e.job.cancel();
    this.entries.clear();
  }
}

// ─── Is this device fast enough? ──────────────────────────────────────

export interface SpeedSample { synthMs: number; durationMs: number }
/**
 * Real-time factor = synthesis time / audio time (below 1 = faster than real time). The first sentence carries the
 * model warm-up (WebGPU shader compile, WASM JIT), so it is skipped once there is more to go on. `slow` means the
 * synthesiser cannot keep ahead of playback at this speed, so the listener would hear gaps.
 */
export function assessSpeed(samples: readonly SpeedSample[], rate = 1, max = 4): { rtf: number | null; slow: boolean; n: number } {
  const use = (samples.length >= 2 ? samples.slice(1) : samples).slice(0, max);
  const audio = use.reduce((a, s) => a + s.durationMs, 0);
  if (!use.length || audio <= 0) return { rtf: null, slow: false, n: 0 };
  const rtf = use.reduce((a, s) => a + s.synthMs, 0) / audio;
  // Need some headroom: the queue only stays ahead if synthesis is clearly quicker than playback.
  return { rtf, slow: use.length >= 2 && rtf * rate > 0.9, n: use.length };
}

// ─── WAV encoding (used in the worker; here so it is testable) ────────

export function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const n = samples.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0, o = 44; i < n; i++, o += 2) {
    const x = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7fff, true);
  }
  return buf;
}

/** Trim near-silent samples off both ends, keeping a short natural tail (Kokoro pads each sentence). */
export function trimSilence(a: Float32Array, sampleRate: number, threshold = 0.004, keepMs = 60): Float32Array {
  let s = 0, e = a.length - 1;
  while (s < a.length && Math.abs(a[s]) < threshold) s++;
  while (e > s && Math.abs(a[e]) < threshold) e--;
  if (s >= e) return a;
  const pad = Math.round((keepMs / 1000) * sampleRate);
  return a.subarray(Math.max(0, s - Math.round(pad / 3)), Math.min(a.length, e + pad));
}
