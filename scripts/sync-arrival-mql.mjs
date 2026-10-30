// Keeps the shared MQL arrival blocks identical in every tool file (MetaTrader has no shared include for MT4, and the
// MT4 tools ship as a single file each):
//   RFX_ARRIVAL_ENGINE  source public/tools/RFX_ZoneCore.mqh  -> RamanFX_ZoneVision.mq4, RamanFX_ZoneBot.mq4
//   RFX_ARRIVAL_CHART   source public/tools/RamanFX_ZoneVision.mq5 -> RamanFX_ZoneVision.mq4
//   RFX_ARRIVAL_BOT     source public/tools/RamanFX_ZoneBot.mq5    -> RamanFX_ZoneBot.mq4
// Pine: the arrival engine section of RamanFX_ZoneVision_Arrival.pine (RFX_ARRIVAL_PINE) -> RamanFX_ZoneStrategy.pine.
//   node scripts/sync-arrival-mql.mjs           copy the blocks
//   node scripts/sync-arrival-mql.mjs --check   exit 1 when a copy differs (src/core/toolsArrival.test.ts does the same)
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'tools');
export const BLOCKS = [
  { name: 'RFX_ARRIVAL_ENGINE', lead: '// ', src: 'RFX_ZoneCore.mqh', dst: ['RamanFX_ZoneVision.mq4', 'RamanFX_ZoneBot.mq4'] },
  { name: 'RFX_ARRIVAL_CHART', lead: '// ', src: 'RamanFX_ZoneVision.mq5', dst: ['RamanFX_ZoneVision.mq4'] },
  { name: 'RFX_ARRIVAL_BOT', lead: '// ', src: 'RamanFX_ZoneBot.mq5', dst: ['RamanFX_ZoneBot.mq4'] },
  { name: 'RFX_ARRIVAL_PINE', lead: '// ', src: 'RamanFX_ZoneVision_Arrival.pine', dst: ['RamanFX_ZoneStrategy.pine'] },
];
export function block(text, name, lead = '// ') {
  const a = text.indexOf(`${lead}==== ${name} BEGIN ====`), e = `${lead}==== ${name} END ====`, b = text.indexOf(e);
  if (a < 0 || b < a) return null;
  return text.slice(a, b + e.length);
}
const check = process.argv.includes('--check');
let bad = 0;
for (const B of BLOCKS) {
  const src = block(readFileSync(join(dir, B.src), 'utf8'), B.name, B.lead);
  if (!src) { console.error(`${B.src}: no ${B.name} block`); bad++; continue; }
  for (const f of B.dst) {
    const p = join(dir, f), t = readFileSync(p, 'utf8'), cur = block(t, B.name, B.lead);
    if (!cur) { console.error(`${f}: no ${B.name} block (insert the BEGIN / END markers once by hand)`); bad++; continue; }
    if (cur === src) continue;
    if (check) { console.error(`${f}: ${B.name} differs from ${B.src}`); bad++; continue; }
    writeFileSync(p, t.replace(cur, () => src));
    console.log(`${f}: ${B.name} updated from ${B.src}`);
  }
}
process.exit(bad ? 1 : 0);
