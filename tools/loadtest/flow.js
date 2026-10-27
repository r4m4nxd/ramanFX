// k6 load test: simulated visitors opening the app and the scanner data (read-only, public files only).
// Run by .github/workflows/load-test.yml against the live site; VUS / DURATION come from the workflow inputs.
import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'https://raman-fx.vercel.app';
const VUS = Number(__ENV.VUS || 1000);

export const options = {
  scenarios: {
    visitors: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: Math.round(VUS / 4) },
        { duration: '2m', target: VUS },
        { duration: __ENV.HOLD || '3m', target: VUS },
        { duration: '30s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{kind:page}': ['p(95)<1500'],
    'http_req_duration{kind:data}': ['p(95)<1500'],
  },
  summaryTrendStats: ['avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

// Browsers cache the app bundle, so each visitor downloads it once (first iteration); data files are compressed.
const H = { headers: { 'Accept-Encoding': 'gzip, br' } };
let assets = null;
let cached = false;

export default function () {
  group('open app', () => {
    const r = http.get(`${BASE}/`, { ...H, tags: { kind: 'page' } });
    check(r, { 'page 200': x => x.status === 200 });
    if (!assets && r.status === 200) assets = (r.body.match(/\/assets\/[^"']+\.(?:js|css)/g) || []).slice(0, 3);
    if (!cached) for (const a of assets || []) check(http.get(`${BASE}${a}`, { ...H, tags: { kind: 'asset' } }), { 'asset 200': x => x.status === 200 });
    cached = true;
  });
  sleep(1 + Math.random() * 2);
  group('scanner', () => {
    const r = http.get(`${BASE}/scanner/latest.json`, { ...H, tags: { kind: 'data' } });
    check(r, { 'stocks json': x => x.status === 200 && x.body.length > 1000 });
    check(http.get(`${BASE}/scanner/index.json`, { ...H, tags: { kind: 'data' } }), { 'index 200': x => x.status === 200 });
    check(http.get(`${BASE}/scanner/t/${Math.floor(Math.random() * 64)}.json`, { ...H, tags: { kind: 'data' } }), { 'ticker shard 200': x => x.status === 200 });
  });
  sleep(1 + Math.random() * 3);
  group('forex', () => {
    check(http.get(`${BASE}/fx/latest.json`, { ...H, tags: { kind: 'data' } }), { 'fx json': x => x.status === 200 });
    check(http.get(`${BASE}/scanner/fx`, { ...H, tags: { kind: 'page' } }), { 'deep link 200': x => x.status === 200 });
  });
  sleep(2 + Math.random() * 4);
}
