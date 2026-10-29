// Builds the "Ask your mentors" index: collects every lesson passage, embeds it with Xenova/multilingual-e5-small (q8 ONNX,
// the same model the browser uses for the query) and writes public/ask/index.bin (int8 vectors) + public/ask/passages.json.
//   npm run ask:index            rebuild the index (re-run whenever lessons change; commit the output)
//   npm run ask:index -- --dry   only collect and count passages
//   npm run ask:eval             run the test questions in scripts/ask/questions.json against the built index
// The lesson modules are loaded through Vite's SSR loader so '@/...' aliases and import.meta.glob work unchanged.
import { createServer } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Behind an HTTPS proxy, Node's fetch (used for the model download) only honours it with NODE_USE_ENV_PROXY: re-run with it set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
  process.exit(r.status ?? 1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/ask');
const args = new Set(process.argv.slice(2));

const vite = await createServer({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), logLevel: 'error', appType: 'custom', server: { middlewareMode: true, hmr: false, watch: null }, optimizeDeps: { noDiscovery: true, include: [] } });
const search = await vite.ssrLoadModule('/src/core/ask/search.ts');

async function embedder() {
  const { pipeline } = await import('@huggingface/transformers');
  let last = '';
  const fe = await pipeline('feature-extraction', search.ASK_MODEL, {
    dtype: search.ASK_DTYPE,
    // One ORT thread without spin-waiting: on a busy machine this was 4x faster than the default thread pool.
    // Set ASK_THREADS=4 on an idle machine to use more cores.
    session_options: { intraOpNumThreads: Number(process.env.ASK_THREADS ?? 1), interOpNumThreads: 1, extra: { session: { intra_op: { allow_spinning: '0' } } } },
    progress_callback: p => { if (p.status === 'progress' && p.file?.endsWith('.onnx')) { const s = `${Math.round(p.progress)}%`; if (s !== last) { last = s; process.stdout.write(`\r[ask] downloading ${p.file} ${s}   `); } } },
  });
  if (last) process.stdout.write('\n');
  return async texts => {
    const out = await fe(texts, { pooling: 'mean', normalize: true });
    const dim = out.dims[1];
    return texts.map((_, i) => out.data.slice(i * dim, (i + 1) * dim));
  };
}

try {
  if (args.has('--eval')) await evaluate();
  else await build();
} finally {
  await vite.close();
}

async function build() {
  const { collectPassages } = await vite.ssrLoadModule('/scripts/ask/collect.ts');
  const { lessons, passages, report } = await collectPassages();
  for (const r of report) console.log(`[ask] ${r.src.padEnd(8)} ${String(r.lessons).padStart(4)} lessons  ${String(r.passages).padStart(6)} passages${r.note ? `  (${r.note})` : ''}`);
  const chars = passages.reduce((a, p) => a + p.t.length, 0);
  console.log(`[ask] total ${passages.length} passages, avg ${Math.round(chars / passages.length)} chars`);
  if (args.has('--dry')) return;

  const embed = await embedder();
  const texts = passages.map(p => search.passageText(lessons[p.l], p));
  const vectors = new Array(texts.length);
  // Batch texts of similar length together (less padding = much faster on CPU).
  const order = texts.map((_, i) => i).sort((a, b) => texts[a].length - texts[b].length);
  const B = 16, t0 = Date.now();
  for (let i = 0; i < texts.length; i += B) {
    const ids = order.slice(i, i + B);
    (await embed(ids.map(j => texts[j]))).forEach((v, k) => { vectors[ids[k]] = v; });
    const done = Math.min(i + B, texts.length), s = (Date.now() - t0) / 1000;
    process.stdout.write(`\r[ask] embedded ${done}/${texts.length} (${Math.round(done / s)}/s, eta ${Math.round((texts.length - done) / (done / s))}s)   `);
  }
  process.stdout.write('\n');
  const dim = vectors[0].length;
  const bin = search.encodeIndex(vectors, dim);
  const meta = { model: search.ASK_MODEL, dim, count: passages.length, built: new Date().toISOString(), lessons, passages };
  const json = JSON.stringify(meta);
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, 'index.bin'), bin);
  await writeFile(path.join(OUT, 'passages.json'), json);
  const mb = n => (n / 1024 / 1024).toFixed(2);
  console.log(`[ask] wrote public/ask/index.bin ${mb(bin.byteLength)} MB + passages.json ${mb(Buffer.byteLength(json))} MB = ${mb(bin.byteLength + Buffer.byteLength(json))} MB`);
}

async function evaluate() {
  const meta = JSON.parse(await readFile(path.join(OUT, 'passages.json'), 'utf8'));
  const bin = await readFile(path.join(OUT, 'index.bin'));
  const idx = search.parseIndex(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength), meta);
  const questions = JSON.parse(await readFile(path.join(ROOT, 'scripts/ask/questions.json'), 'utf8'));
  const embed = await embedder();
  const k = Number([...args].find(a => a.startsWith('--k='))?.slice(4) ?? 3);
  const boost = Number([...args].find(a => a.startsWith('--boost='))?.slice(8) ?? 0.06);
  const { ASK_SOURCE } = await vite.ssrLoadModule('/src/core/ask/sources.ts');
  const lines = [];
  for (const q of questions) {
    const t0 = performance.now();
    const [v] = await embed([search.queryText(q)]);
    const t1 = performance.now();
    const hits = search.search(idx, v, q, { k, boost });
    const t2 = performance.now();
    lines.push(`### "${q}"`, '', `<sub>embed ${Math.round(t1 - t0)} ms · rank ${Math.round(t2 - t1)} ms</sub>`, '');
    hits.forEach((h, r) => {
      const t = h.passage.t.length > 260 ? `${h.passage.t.slice(0, 257)}…` : h.passage.t;
      lines.push(`${r + 1}. **${ASK_SOURCE[h.lesson.src].label} · ${h.lesson.src === 'glossary' ? 'Glossary' : `${h.lesson.n}. ${h.lesson.title}`}** — *${h.passage.h}* (score ${h.score.toFixed(3)} = cos ${h.cos.toFixed(3)} + kw ${h.boost.toFixed(3)})  `, `   ${t}`);
    });
    lines.push('');
  }
  console.log(lines.join('\n'));
}
