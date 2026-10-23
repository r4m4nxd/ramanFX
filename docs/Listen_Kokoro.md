# Listen player: natural narration with Kokoro-82M

The lesson Listen bar can read with two engines:

- **Device voice** (default). This is the Web Speech API, as before.
- **Natural (Kokoro)**. This is [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) (Apache-2.0), using the ONNX build [onnx-community/Kokoro-82M-v1.0-ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX) through `kokoro-js`. It is synthesised **on the listener's device** in a Web Worker. No audio and no text leave the device. Nothing is pre-rendered on our side.

## How to use

1. Open a lesson, then press **Voice** (the microphone toggle) in the Listen bar.
2. Under **Voice engine**, pick **Natural (Kokoro)**.
3. Pick a voice. Press **Preview** to hear it. The first preview or the first Play downloads the model; a progress bar shows the MB.
4. Press **Play**. Speed, skip, chapters, follow-along, the lock-screen / headphone controls and resume-where-you-left-off all work as before.

Choices are saved in `localStorage` (`rfx_listen_engine`, `rfx_listen_kvoice`, `rfx_listen_kcompact`), and every read or write is wrapped in try/catch.

Voices (a short curated list):

| Voice | Use |
|---|---|
| `af_heart`, `af_bella` | US English, female |
| `am_michael`, `am_fenrir` | US English, male |
| `bf_emma`, `bm_george` | British English |
| `hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi` | Hindi, for later Hindi lessons |

Hindi voices behave as follows:

- On Devanagari text they use espeak-ng Hindi phonemes (the `phonemizer` package).
- On English text they read with an Indian-English accent.

## How it works

| Piece | File |
|---|---|
| Sentence splitting (shared with the device engine) | `src/ui/listen/useSpeech.ts` `segmentChapters` (≤ 160 chars per chunk) |
| Look-ahead queue, speed check, WAV encode | `src/ui/listen/kokoro/queue.ts` (pure, unit-tested) |
| Worker: loads kokoro-js lazily, WebGPU fp32 or WASM q8, one sentence at a time, cancellable | `src/ui/listen/kokoro/kokoro.worker.ts` |
| Main-thread client: worker lifecycle, download progress, real-time-factor store | `src/ui/listen/kokoro/client.ts` |
| Player integration (`naturalAt`, resume, rate, fallback) | `src/ui/listen/useSpeech.ts` `Narrator` |
| UI: engine picker, voice list + Preview, progress, slow-device hint | `src/ui/listen/ListenBar.tsx` |

### Streaming playback

- The player asks the queue for sentence *i*. The queue synthesises *i* first (urgent, front of the worker's line) and keeps **2 sentences ahead** in flight.
- On a seek, a skip, a stop, a voice change or a lesson change, everything outside the window is cancelled (`SynthQueue.trim` / `clear` → worker `cancel`). A sentence already inside ONNX Runtime finishes, but no one hears it.
- Each clip is trimmed of Kokoro's padding silence and encoded to WAV **in the worker**. It plays through one reused `<audio>` element.
- Speed changes are instant: `playbackRate` with `preservesPitch`. They apply to the sentence that is playing and do not re-synthesise.
- Pause and resume continue from the exact audio position.
- Sentence and chapter skip, the progress bar, and the chapter list are unchanged. Media Session handlers are unchanged too. The real `<audio>` element gives the lock screen a genuine media session.
- Follow-along word highlight comes from the audio clock: characters are proportional to time. Kokoro-js exposes no word timestamps.

### Lazy loading and bundle impact

- The main app gains only the client, the queue and the UI: about 3.4 kB minified (1.6 kB gzip) plus the panel markup.
- `new Worker(new URL('./kokoro.worker.ts', import.meta.url))` runs only after the listener picks Natural and presses Play or Preview.
- Inside the worker, `import('kokoro-js')` and `import('phonemizer')` are dynamic. This adds the following chunks, fetched only on that first use:
  - `kokoro-*.js`: 887 kB (kokoro-js + transformers.js + ORT glue)
  - `phonemizer-*.js`: 1.3 MB (espeak-ng)
  - `ort-wasm-simd-threaded.jsep-*.wasm`: 21.6 MB
- The `.wasm` is served from our own origin: `env.wasmPaths` is pointed at the Vite asset (the `@ort` alias in `vite.config.ts`). The jsDelivr CDN that transformers.js uses by default is not used. `worker.format: 'es'` is needed for the worker's code-splitting.

### Device choice

- **Desktop with WebGPU**: fp32 on WebGPU (`model.onnx`, about 327 MB) is preferred, as the kokoro-webgpu demo does. q8 is slow or unsupported on WebGPU.
  - If WebGPU fails, the worker falls back to WASM q8 by itself.
  - The panel offers **"Use the compact model"**, which forces WASM q8.
- **Phones, tablets, and browsers without WebGPU**: always WASM q8 (`model_quantized.onnx`, 92.4 MB).
- The UI never blocks: the model and all synthesis run in the worker. The main thread only creates a Blob URL per sentence.

### Performance safety

- `assessSpeed` measures synthesis time divided by audio time on the first sentences. It skips the warm-up sentence and needs at least 2 samples, and it takes the playback rate into account.
- If synthesis is not clearly faster than playback (`rtf × rate > 0.9`), the card shows: *"The natural voice is slower than real time on this device … [Use device voice]"*.
- If the device is slow **and** playback actually stalls waiting for synthesis (more than 2.5 s, twice), the player switches to the device voice by itself. It continues the same sentence and says why ("Try natural again" is offered).
- If the model fails to load (offline, out of memory, no WebAssembly), the player also falls back to the device voice and says so.
- Switching to the device voice terminates the worker, which frees the model's memory.

## Measured here (4-vCPU container, headless Chromium, WASM)

`node scripts/kokoro-bench.mjs` starts Vite, opens `scripts/kokoro-harness.html` in Playwright Chromium, and synthesises 3 lesson sentences (18 s of audio) through the real worker and queue.

**Caveat:** the container was shared with other heavy jobs (Whisper, ffmpeg, LightGBM) at a load average of 12-30 on 4 cores. The bench therefore also reports **CPU-seconds per audio-second** for the browser process tree, which is roughly what an idle core would take.

| Run | Threads | Download | Load | First audio | Wall RTF (synth / audio) | CPU-s per audio-s |
|---|---|---|---|---|---|---|
| WASM q8, first load (load avg ~25) | 1 | 92.4 MB | 43 s | 94 s | 12.6 | n/a |
| WASM q8, cached reload | 1 | 0 (Cache API) | **5.3 s** | 67 s | 9.9 | 6.2 |
| WASM q8 (load avg ~12) | 1 | 92.4 MB | 15.6 s | 34 s | **5.4** | **4.2** |
| WASM q8, cross-origin isolated (COOP/COEP) | 2 | 92.4 MB | 17.7 s | 45 s | 6.6 | 4.9 |
| WASM fp32 | 1 | 325.5 MB | 26 s | 36 s | 6.0 | 4.0 |
| Node, onnxruntime-node native, 4 threads, q8 / fp32 (for reference) | 4 | | 7.5 s / 17 s | | 8.3 / 5.5 | |

What this means:

- **On this CPU, Kokoro on WASM is about 4-6× slower than real time**, even after allowing for the noisy neighbours. The native Node runtime is no better here, so the CPU itself is slow for this model; it is not the browser. A sentence of about 6 s takes about 30 s to synthesise.
- This is exactly the case the slow-device logic is for. The hint appears after the third sentence, and the automatic switch to the device voice happens after the second real stall.
- int8 (q8) is **not** faster than fp32 on WASM: about 4.2 vs 4.0 CPU-s per audio-s. It is 3.5× smaller to download, so it stays the CPU default.
- Multi-threaded WASM needs cross-origin isolation (COOP/COEP). That would break YouTube embeds and other third-party iframes in the app, so we do not enable it. On this busy box, the second thread did not help anyway.
- Smooth natural narration needs **WebGPU** (recent desktop Chrome/Edge, Safari 26+) or a fast CPU. Typical reports for Kokoro on WebGPU are well under real time. **This was not measurable here**: the container has no GPU.
- The fp32 model (325 MB) **could not be stored in the Cache API** in the headless profile ("Unexpected internal error", quota). It would re-download each visit there. Normal desktop Chrome profiles have a much larger quota, but the risk is one more reason to keep q8 as the CPU default.

E2E (`node scripts/listen-e2e.mjs`): the real ListenBar on a 390 px-wide page, in `scripts/listen-harness.html`. All 17 checks passed in 384 s:

- **Before download**: the on-device note and the download size are shown.
- **Saved choices**: the engine and voice are saved to localStorage.
- **During download**: the progress bar shows on the card.
- **First natural audio after 76 s** on this slow CPU. That includes the 92 MB download and synthesising the first sentence.
- **Playback**: a WAV blob plays with `preservesPitch`, and the word highlight moves with the audio ("Lesson > one: > Intro > to > Supply > and > Demand.").
- **Speed**: 1.5× is applied instantly. The `playbackRate` was 1.395, which is 1.5 × the sentence's 0.93 emphasis rate.
- **Pause / resume**: the clip resumes from its position (0.08 s → 0.46 s) without re-synthesising.
- **Skip forward**: it works.
- **Slow device**: the hint appeared. After stalls, the player **switched to the device voice by itself** ("…so the device voice took over"), and the natural audio stopped.
- **No page errors.**

## Known limits

- **iPhone / iPad Safari**:
  - **WebGPU** ships only in Safari 26 (iOS 26). Phones always get WASM q8 by design, because the fp32 WebGPU model is 327 MB of download plus about 1 GB of GPU/heap memory.
  - **WASM is single-threaded**, because the app is not cross-origin isolated. Expect the slower-than-real-time hint on most iPhones, and the device voice (Enhanced/Premium Siri voices) will often be the better choice there.
  - **Memory**: the q8 model plus ORT is about 300-500 MB in the worker. iOS kills tabs well below desktop limits; jetsam limits on 4-6 GB devices are about 1-1.5 GB per tab. A crash surfaces as a worker error, and the player then falls back to the device voice.
  - **Background / lock screen**: iOS suspends page JavaScript and workers soon after the screen locks. Only the sentences already synthesised (up to 2 ahead) keep playing. The device voice has similar limits on iOS.
  - **Storage**: Safari may evict Cache API storage after about 7 days without a visit (ITP) for sites not added to the Home Screen. The 92 MB would then download again.
  - **Autoplay**: the `<audio>` element is unlocked with a silent blip inside the Play/Preview tap, so the later programmatic `play()` calls are allowed.
- **First audio**: one sentence of latency on a fast device; tens of seconds on a slow CPU like this one. The model download comes first on the first use.
- **Highlight**: word highlighting is estimated (proportional to characters), not exact.
- **Pitch**: the pitch slider applies to the device voice only. Kokoro has none.
- **Pronunciation**: there is no custom lexicon yet. Trading terms come out as the narration script spells them (`src/core/narration.ts` already expands "RR", "DBR" and similar).
- **Hindi**: Hindi voices are wired up, but the Hindi phonemisation path (Devanagari → espeak `hi`) has not been checked by a Hindi listener.

## Files to re-run

```
npm test                                   # includes src/ui/listen/kokoro/queue.test.ts (queue, speed check, WAV, sentence splitter)
node scripts/kokoro-bench.mjs [--coi] [--dtype=fp32] [--voice=bm_george]
node scripts/listen-e2e.mjs                # full Listen bar flow in headless Chromium (slow: real synthesis)
npx vite  → http://localhost:5173/scripts/kokoro-harness.html  and  /scripts/listen-harness.html (manual, with sound)
```
