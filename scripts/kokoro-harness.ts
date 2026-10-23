// Drives the real narrator engine (worker + queue) on three lesson-style sentences and reports timings.
import { ensureKokoro, getKokoroStatus, speedSamples, subscribeKokoro, synthesize } from '../src/ui/listen/kokoro/client';
import { SynthQueue, assessSpeed, type Clip } from '../src/ui/listen/kokoro/queue';

const q = new URLSearchParams(location.search);
const voice = q.get('voice') || 'af_heart';
const compact = q.get('gpu') !== '1';
const dtype = (q.get('dtype') || undefined) as 'fp32' | 'q8' | undefined;
const SENTENCES = [
  'Welcome back. Today we look at how a demand zone forms, and why the first touch matters most.',
  'A drop-base-rally starts with a strong move down, a short pause, and then a strong move up.',
  'Put your entry at the proximal line, your stop just beyond the distal line, and aim for one to three risk to reward.',
];
const log = (s: string) => { document.getElementById('log')!.textContent += s + '\n'; console.log(s); };
const clips: Clip[] = [];

async function run() {
  const t0 = performance.now();
  let lastPct = -10;
  const off = subscribeKokoro(() => {
    const s = getKokoroStatus();
    const pct = s.total ? Math.round((s.loaded / s.total) * 100) : 0;
    if (s.phase === 'loading' && pct >= lastPct + 10) { lastPct = pct; log(`download ${pct}% (${(s.loaded / 1e6).toFixed(1)} / ${(s.total / 1e6).toFixed(1)} MB)`); }
  });
  await ensureKokoro(compact, dtype);
  off();
  const st = getKokoroStatus();
  const loadMs = performance.now() - t0;
  log(`ready: ${st.device} ${st.dtype}, threads ${st.threads}, load ${Math.round(loadMs)} ms, downloaded ${(st.total / 1e6).toFixed(1)} MB${st.note ? ' · ' + st.note : ''}`);

  // Through the real look-ahead queue, as the player uses it: time-to-first-audio and per-sentence timings.
  const queue = new SynthQueue(synthesize, { ahead: 2 });
  queue.setScript(SENTENCES, voice);
  const tq = performance.now();
  const w = window as unknown as { __phase: string };
  w.__phase = 'synth';
  for (let i = 0; i < SENTENCES.length; i++) {
    const c = await queue.get(i);
    clips.push(c);
    if (i === 0) log(`first audio after ${Math.round(performance.now() - tq)} ms`);
    log(`#${i + 1}: audio ${(c.durationMs / 1000).toFixed(2)} s, synth ${Math.round(c.synthMs)} ms, rtf ${(c.synthMs / c.durationMs).toFixed(2)}`);
  }
  w.__phase = 'done';
  const all = speedSamples();
  const a = assessSpeed(all);
  const total = all.reduce((x, s) => x + s.synthMs, 0) / all.reduce((x, s) => x + s.durationMs, 0);
  const result = {
    device: st.device, dtype: st.dtype, threads: st.threads, crossOriginIsolated: self.crossOriginIsolated,
    hardwareConcurrency: navigator.hardwareConcurrency, loadMs: Math.round(loadMs), downloadedMB: +(st.total / 1e6).toFixed(1),
    files: undefined as unknown, rtfAll: +total.toFixed(3), rtfWarm: a.rtf && +a.rtf.toFixed(3), slowAt1x: a.slow,
    samples: all.map(s => ({ synthMs: Math.round(s.synthMs), audioMs: Math.round(s.durationMs) })),
  };
  log(JSON.stringify(result, null, 1));
  (window as unknown as { __result: unknown }).__result = result;
  (document.getElementById('play') as HTMLButtonElement).disabled = false;
}

document.getElementById('go')!.onclick = () => { run().catch(e => { log('ERROR ' + (e as Error).message); (window as unknown as { __result: unknown }).__result = { error: String(e) }; }); };
document.getElementById('play')!.onclick = async () => {
  for (const c of clips) {
    const a = new Audio(URL.createObjectURL(new Blob([c.wav], { type: 'audio/wav' })));
    await a.play(); await new Promise(r => { a.onended = r; });
  }
};
if (q.get('auto') === '1') document.getElementById('go')!.click();
