// Dump lesson narrations (buildNarration, exactly what the Listen player speaks) to JSON for offline TTS (render.py / batch.py).
// Run from the repo root:
//   node tools/narration/dump-narration.mjs                      -> tools/narration/out/narrations.json (all sources)
//   node tools/narration/dump-narration.mjs course 1 out.json    -> one lesson (legacy single-lesson format)
// Sources and mentor names mirror SRC in src/pages/Learn.tsx; listed in render order.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createServer } from 'vite';

const SOURCES = [
  ['course', '/src/core/mentors/kevin/index.ts', 'KEVIN_COURSE', 'Kevin'],
  ['raja', '/src/core/mentors/raja/index.ts', 'RAJA_LESSONS', 'Raja'],
  ['zoom', '/src/core/mentors/kevin/zoom.ts', 'KEVIN_ZOOM', 'Kevin'],
  ['baker', '/src/core/mentors/baker/index.ts', 'BAKER_LESSONS', 'Kevin Baker'],
  ['daily', '/src/core/mentors/kevin/daily/index.ts', 'KEVIN_DAILY', 'Kevin'],
  ['seiden', '/src/core/mentors/seiden/index.ts', 'SEIDEN_LESSONS', 'Sam Seiden'],
];
const [onlySrc, onlyN, outArg] = process.argv.slice(2);
const server = await createServer({ logLevel: 'warn', server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom' });
const wc = t => t.replace(/\[\[pause:\d+\]\]/g, ' ').split(/\s+/).filter(Boolean).length;
try {
  const { buildNarration } = await server.ssrLoadModule('/src/core/narration.ts');
  const all = [];
  for (const [source, mod, exp, mentor] of SOURCES) {
    if (onlySrc && onlySrc !== source) continue;
    let list;
    try { list = (await server.ssrLoadModule(mod))[exp]; } catch (e) { list = undefined; console.error(`${source}: ${e.message}`); }
    if (!Array.isArray(list)) { // module path guess failed: resolve by alias directory index
      list = (await server.ssrLoadModule(mod.replace(/\.ts$/, '/index.ts')))[exp];
    }
    for (const l of list) {
      if (onlyN && l.n !== +onlyN) continue;
      all.push({ source, mentor, n: l.n, title: l.title, chapters: buildNarration(l, mentor) });
    }
    const mine = all.filter(x => x.source === source);
    console.log(`${source}: ${mine.length} lessons, ${mine.reduce((a, d) => a + d.chapters.reduce((b, c) => b + wc(c.text), 0), 0)} words`);
  }
  const out = outArg ?? (onlyN ? `tools/narration/out/${onlySrc}_${onlyN}.json` : 'tools/narration/out/narrations.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(onlyN ? all[0] : all, null, 1));
  console.log(`wrote ${out}`);
} finally { await server.close(); }
