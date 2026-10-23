// Main-thread side of the natural narrator: owns the Kokoro worker (created only when the listener picks
// "Natural"), tracks download progress and device speed for the UI, and hands out cancellable synthesis jobs.
// This file is tiny and has no model code; the worker chunk (kokoro-js, transformers.js, ONNX Runtime) loads lazily.
import { Cancelled, assessSpeed, type Clip, type SpeedSample, type SynthJob } from './queue';
import { DOWNLOAD_MB, type FromWorker, type KDevice, type KDtype, type ToWorker } from './protocol';

export interface KokoroStatus {
  phase: 'off' | 'loading' | 'ready' | 'error';
  /** Bytes downloaded / expected so far (0 when served from the cache). */
  loaded: number; total: number;
  device: KDevice | null; dtype: KDtype | null; threads: number;
  loadMs: number | null;
  error: string | null; note: string | null;
  /** Synthesis time / audio time from the first sentences (null until measured). */
  rtf: number | null;
  slow: boolean;
  /** Set when the player gave up on Kokoro and went back to the device voice. */
  fellBack: string | null;
}

const initial: KokoroStatus = { phase: 'off', loaded: 0, total: 0, device: null, dtype: null, threads: 1, loadMs: null, error: null, note: null, rtf: null, slow: false, fellBack: null };
let status: KokoroStatus = initial;
const subs = new Set<() => void>();
const set = (p: Partial<KokoroStatus>) => { status = { ...status, ...p }; subs.forEach(f => f()); };
export const getKokoroStatus = () => status;
export const subscribeKokoro = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const kokoroSupported = () => typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
export const hasWebGPU = () => typeof navigator !== 'undefined' && 'gpu' in navigator;
/** Phones and tablets: WebGPU fp32 is a 327 MB download and a lot of memory, so they get the compact model. */
export const isMobile = () => typeof navigator !== 'undefined' && (/Android|iP(hone|ad|od)|Mobile/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
/** Expected first download in MB for the model this device will use. */
export const expectedDownloadMB = (compact: boolean) => DOWNLOAD_MB[compact || isMobile() || !hasWebGPU() ? 'q8' : 'fp32'];

let worker: Worker | null = null;
let ready: Promise<void> | null = null;
let seq = 0;
const jobs = new Map<number, { resolve: (c: Clip) => void; reject: (e: unknown) => void }>();
const files = new Map<string, { loaded: number; total: number }>();
let samples: SpeedSample[] = [];
let rate = 1;

function onMessage(e: MessageEvent<FromWorker>) {
  const m = e.data;
  if (m.type === 'progress') {
    files.set(m.file, { loaded: m.loaded, total: m.total });
    let loaded = 0, total = 0;
    for (const f of files.values()) { loaded += f.loaded; total += f.total; }
    set({ loaded, total });
  } else if (m.type === 'ready') {
    set({ phase: 'ready', device: m.device, dtype: m.dtype, loadMs: m.loadMs, threads: m.threads, note: m.note ?? null, error: null });
  } else if (m.type === 'load-error') {
    set({ phase: 'error', error: m.message });
  } else if (m.type === 'audio') {
    const j = jobs.get(m.id);
    jobs.delete(m.id);
    if (samples.length < 6) { samples.push({ synthMs: m.synthMs, durationMs: m.durationMs }); measure(); }
    j?.resolve({ wav: m.wav, sampleRate: m.sampleRate, durationMs: m.durationMs, synthMs: m.synthMs });
  } else if (m.type === 'synth-error') {
    const j = jobs.get(m.id);
    jobs.delete(m.id);
    j?.reject(new Error(m.message));
  }
}

function measure() { const a = assessSpeed(samples, rate); set({ rtf: a.rtf, slow: a.slow }); }
/** Tell the speed check the listener's playback rate (faster playback needs faster synthesis). */
export function setPlaybackRate(r: number) { if (r !== rate) { rate = r; if (samples.length) measure(); } }
export const speedSamples = () => samples.slice();

/** Start the worker and the model download (idempotent). Resolves when the model is ready. */
let loadedCompact: boolean | null = null;
export function ensureKokoro(compact = false, dtype?: KDtype): Promise<void> {
  compact = compact || isMobile();
  if (ready && status.phase !== 'error' && compact === loadedCompact) return ready;
  if (ready) for (const j of jobs.values()) j.reject(new Cancelled());
  jobs.clear();
  loadedCompact = compact;
  samples = [];
  if (!kokoroSupported()) { set({ phase: 'error', error: 'This browser cannot run the natural voice (no Web Worker / WebAssembly).' }); return Promise.reject(new Error(status.error!)); }
  worker?.terminate();
  files.clear();
  set({ ...initial, phase: 'loading', fellBack: status.fellBack });
  const w = new Worker(new URL('./kokoro.worker.ts', import.meta.url), { type: 'module', name: 'kokoro-tts' });
  worker = w;
  w.onmessage = onMessage;
  w.onerror = e => { set({ phase: 'error', error: e.message || 'The voice worker crashed (out of memory?).' }); failAll(new Error('worker crashed')); };
  ready = new Promise<void>((resolve, reject) => {
    const off = subscribeKokoro(() => {
      if (status.phase === 'ready') { off(); resolve(); }
      else if (status.phase === 'error') { off(); reject(new Error(status.error ?? 'load failed')); }
    });
  });
  ready.catch(() => undefined);
  post({ type: 'load', compact, dtype });
  return ready;
}

function post(m: ToWorker) { worker?.postMessage(m); }
function failAll(err: unknown) { for (const j of jobs.values()) j.reject(err); jobs.clear(); }

/** Synthesise one sentence. Cancelling drops it from the worker's queue (a sentence already running finishes, unheard). */
export function synthesize(text: string, voice: string, urgent = false): SynthJob {
  const id = ++seq;
  let settled = false;
  const promise = new Promise<Clip>((resolve, reject) => {
    jobs.set(id, { resolve: c => { settled = true; resolve(c); }, reject: e => { settled = true; reject(e); } });
  });
  promise.catch(() => undefined);
  post({ type: 'synth', id, text, voice, urgent });
  return {
    promise,
    cancel: () => {
      if (settled) return;
      const j = jobs.get(id);
      jobs.delete(id);
      post({ type: 'cancel', ids: [id] });
      j?.reject(new Cancelled());
    },
  };
}

export function cancelAll() { post({ type: 'cancel', ids: 'all' }); for (const j of jobs.values()) j.reject(new Cancelled()); jobs.clear(); }

/** Record that the player fell back to the device voice (shown once in the Listen bar). */
export function noteFallback(reason: string | null) { set({ fellBack: reason }); }

/** Shut the worker down and free the model's memory. */
export function disposeKokoro() {
  cancelAll();
  worker?.terminate();
  worker = null; ready = null; samples = []; loadedCompact = null;
  set({ ...initial, fellBack: status.fellBack });
}
