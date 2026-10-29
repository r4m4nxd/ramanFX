// Messages between the main thread (client.ts) and the Kokoro Web Worker (kokoro.worker.ts).

export type KDevice = 'webgpu' | 'wasm';
export type KDtype = 'fp32' | 'q8' | 'fp16' | 'q4';

export type ToWorker =
  /** `dtype` overrides the model precision (benchmarks only). */
  | { type: 'load'; compact: boolean; dtype?: KDtype }
  | { type: 'synth'; id: number; text: string; voice: string; urgent: boolean }
  | { type: 'cancel'; ids: number[] | 'all' };

export type FromWorker =
  | { type: 'progress'; file: string; loaded: number; total: number }
  | { type: 'ready'; device: KDevice; dtype: KDtype; loadMs: number; threads: number; note?: string }
  | { type: 'load-error'; message: string }
  | { type: 'audio'; id: number; wav: ArrayBuffer; sampleRate: number; durationMs: number; synthMs: number }
  | { type: 'synth-error'; id: number; message: string };

export const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
/** Approximate first-time download (model + tokenizer + one voice), for the UI before progress events arrive. */
export const DOWNLOAD_MB: Record<KDtype, number> = { q8: 93, fp32: 327, fp16: 164, q4: 306 };
