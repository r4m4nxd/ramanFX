/// <reference lib="webworker" />
// Kokoro-82M text-to-speech in a Web Worker, so model loading and inference never block the page.
// kokoro-js (transformers.js + ONNX Runtime Web) is imported dynamically on the first 'load' message; the ONNX
// Runtime .wasm is served from our own origin (no third-party CDN). WebGPU (fp32) when the device has it,
// otherwise WASM (q8). One sentence is synthesised at a time; queued requests can be cancelled or re-prioritised.
import ortWasmUrl from '@ort/ort-wasm-simd-threaded.jsep.wasm?url';
import type { KokoroTTS } from 'kokoro-js';
import { encodeWav, trimSilence } from './queue';
import { MODEL_ID, type FromWorker, type KDevice, type KDtype, type ToWorker } from './protocol';

declare const self: DedicatedWorkerGlobalScope;
const post = (m: FromWorker, transfer: Transferable[] = []) => self.postMessage(m, transfer);

interface Job { id: number; text: string; voice: string }
let tts: KokoroTTS | null = null;
let loading: Promise<void> | null = null;
const pending: Job[] = [];
let busy = false;

const DEVANAGARI = /[ऀ-ॿ]/;

async function load(compact: boolean, force?: KDtype) {
  const t0 = performance.now();
  const { KokoroTTS: K, env } = await import('kokoro-js');
  env.wasmPaths = { wasm: new URL(ortWasmUrl, self.location.href).href } as typeof env.wasmPaths;
  let device: KDevice = 'wasm', note: string | undefined;
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
  if (!compact && gpu) {
    try { if (await gpu.requestAdapter()) device = 'webgpu'; } catch { /* no adapter */ }
  }
  const progress_callback = (p: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (p.status === 'progress' && p.file) post({ type: 'progress', file: p.file, loaded: p.loaded ?? 0, total: p.total ?? 0 });
  };
  let dtype: KDtype = force ?? (device === 'webgpu' ? 'fp32' : 'q8');
  try {
    tts = await K.from_pretrained(MODEL_ID, { dtype, device, progress_callback });
  } catch (err) {
    if (device !== 'webgpu') throw err;
    note = `WebGPU failed (${(err as Error).message}); using the CPU model`;
    device = 'wasm'; dtype = 'q8';
    tts = await K.from_pretrained(MODEL_ID, { dtype, device, progress_callback });
  }
  // Kokoro-js only lists English voices; the Hindi ones exist in the same repo. Treat them as US English for
  // phonemisation of English text (an Indian-English accent); Devanagari text gets Hindi phonemes below.
  const t = tts as KokoroTTS & { _validate_voice: (v: string) => string };
  const orig = t._validate_voice.bind(t);
  t._validate_voice = (v: string) => (/^h[fm]_/.test(v) ? 'a' : orig(v));
  // ONNX Runtime's default: multi-threaded WASM only when the page is cross-origin isolated (SharedArrayBuffer).
  const threads = device === 'wasm' && self.crossOriginIsolated ? Math.min(4, Math.ceil((navigator.hardwareConcurrency || 1) / 2)) : 1;
  post({ type: 'ready', device, dtype, loadMs: Math.round(performance.now() - t0), threads, note });
}

async function synth(job: Job) {
  if (!tts) throw new Error('model not loaded');
  const t0 = performance.now();
  let raw: { audio: Float32Array; sampling_rate: number };
  if (/^h[fm]_/.test(job.voice) && DEVANAGARI.test(job.text)) {
    const { phonemize } = await import('phonemizer');
    const ph = (await phonemize(job.text, 'hi')).join(' ');
    const { input_ids } = tts.tokenizer(ph, { truncation: true });
    raw = await tts.generate_from_ids(input_ids, { voice: job.voice as never, speed: 1 });
  } else {
    raw = await tts.generate(job.text, { voice: job.voice as never, speed: 1 });
  }
  const synthMs = performance.now() - t0;
  const samples = trimSilence(raw.audio, raw.sampling_rate);
  const wav = encodeWav(samples, raw.sampling_rate);
  post({ type: 'audio', id: job.id, wav, sampleRate: raw.sampling_rate, durationMs: (samples.length / raw.sampling_rate) * 1000, synthMs }, [wav]);
}

async function pump() {
  if (busy) return;
  busy = true;
  try {
    while (pending.length) {
      if (loading) { try { await loading; } catch { break; } }
      const job = pending.shift()!;
      try { await synth(job); } catch (err) { post({ type: 'synth-error', id: job.id, message: (err as Error).message || String(err) }); }
    }
  } finally { busy = false; }
}

self.onmessage = (e: MessageEvent<ToWorker>) => {
  const m = e.data;
  if (m.type === 'load') {
    if (!loading) {
      loading = load(m.compact, m.dtype).catch(err => {
        post({ type: 'load-error', message: (err as Error).message || String(err) });
        for (const j of pending.splice(0)) post({ type: 'synth-error', id: j.id, message: 'model failed to load' });
        loading = null;
        throw err;
      });
      loading.then(() => { loading = null; void pump(); }, () => undefined);
    }
  } else if (m.type === 'synth') {
    const job = { id: m.id, text: m.text, voice: m.voice };
    if (m.urgent) pending.unshift(job); else pending.push(job);
    void pump();
  } else if (m.type === 'cancel') {
    if (m.ids === 'all') pending.length = 0;
    else { const drop = new Set(m.ids); for (let i = pending.length - 1; i >= 0; i--) if (drop.has(pending[i].id)) pending.splice(i, 1); }
  }
};
