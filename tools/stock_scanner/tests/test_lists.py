"""Zone lists (in / approaching / left, per side), their Telegram messages, the preview of the published files, and
the D1 / W1 / MN timeframe set (MN zones tradeable, nothing below D1)."""
import io
import json
import os
import tempfile
import unittest

import helpers  # noqa: F401
import lists as L
import notify
import scan
import selftest
import zones as Z

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
PUB = os.path.join(ROOT, 'public', 'scanner')


def detail(zones, bars, **kw):
    """A shard detail with packed bars [(o, h, l, c)] on consecutive days."""
    return {'symbol': kw.get('symbol', 'X'), 'name': 'X Co', 'sector': kw.get('sector', 'Energy'), 'home': kw.get('home', ''),
            'price': bars[-1][3], 'direction': kw.get('direction', 'LONG - FULL'), 'signal': kw.get('signal'),
            'check': kw.get('check'), 'zones': zones, 'bars': {'t0': '2026-10-01', 'dt': list(range(len(bars))), 'b': bars}}


def dz(prox, dist, tf='D1', typ='ARR', score=8, touches=0, **kw):
    return {'tf': tf, 'side': 'demand', 'proximal': prox, 'distal': dist, 'type': typ, 'score': score, 'touches': touches, **kw}


def sz(prox, dist, tf='W1', typ='WOW', score=None, touches=0):
    return {'tf': tf, 'side': 'supply', 'proximal': prox, 'distal': dist, 'type': typ, 'score': score, 'touches': touches}


FLAT = [(110, 111, 109, 110)] * 5
LOW = [(90, 91, 89, 90)] * 5


class ClassifyTest(unittest.TestCase):
    def test_demand_buckets(self):
        self.assertEqual(L.classify(detail([dz(100, 95)], FLAT[:-1] + [(99, 99, 97, 98)]))['b'], 'ID')
        near = L.classify(detail([dz(100, 95)], FLAT[:-1] + [(102, 103, 101.5, 102)]))
        self.assertEqual((near['b'], near['section'], round(near['pct'], 2)), ('AD', 'near', 1.96))
        left = L.classify(detail([dz(100, 95, br='curve')], FLAT[:-2] + [(101, 101, 99.5, 100.5), (101, 103, 100.5, 102.5)]))
        self.assertEqual((left['b'], left['status'], left['label']), ('LD', 'curve', 'high on curve'))
        self.assertIsNone(L.classify(detail([dz(100, 95)], FLAT)))            # 9% above: middle

    def test_supply_buckets(self):
        self.assertEqual(L.classify(detail([sz(100, 105)], FLAT[:-1] + [(101, 102, 100, 101)]))['b'], 'IS')
        self.assertEqual(L.classify(detail([sz(100, 105)], LOW[:-1] + [(98, 98.5, 97.5, 98)]))['b'], 'AS')
        rej = L.classify(detail([sz(100, 105)], LOW[:-2] + [(99, 100.5, 98, 99), (99, 99, 96, 96.5)]), near_pct=3)
        self.assertEqual((rej['b'], rej['status']), ('LS', 'dir'))
        self.assertIn('LONG', rej['label'])

    def test_left_window_and_touch_limit(self):
        old_touch = [(100, 100.5, 99, 100)] + [(104, 105, 103.5, 104)] * 3     # touched 4 sessions ago only
        self.assertNotEqual((L.classify(detail([dz(100, 95)], old_touch)) or {}).get('b'), 'LD')
        self.assertIsNone(L.classify(detail([dz(100, 95, touches=4)], FLAT[:-1] + [(99, 99, 97, 98)])))   # 4th touch: out

    def test_only_d1_w1_mn(self):
        bars = FLAT[:-1] + [(99, 99, 97, 98)]
        self.assertIsNone(L.classify(detail([dz(100, 95, tf='H4')], bars)))
        self.assertEqual(L.classify(detail([dz(100, 95, tf='MN')], bars))['tf'], 'MN')

    def test_in_beats_left_beats_near_and_buy_status(self):
        chk = {'kind': 'BUY', 'zone': {'tf': 'W1', 'proximal': 100}}
        d = detail([dz(100, 95, tf='W1', score=6), dz(97.5, 96, score=9)], FLAT[:-1] + [(99, 99, 98, 99)], signal='BUY', check=chk)
        it = L.classify(d)
        self.assertEqual((it['b'], it['tf'], it['status']), ('ID', 'W1', 'BUY'))

    def test_old_format_status_from_check_rules(self):
        chk = {'kind': 'no trade', 'zone': {'tf': 'D1', 'proximal': 100},
               'rules': [{'status': 'fail', 'short': 'near entry'}, {'status': 'fail', 'short': 'HTF align'}]}
        it = L.classify(detail([dz(100, 95)], FLAT[:-1] + [(102, 103, 101.5, 102)], check=chk))
        self.assertEqual(it['label'], 'direction not long')

    def test_zone_lists_and_row_fields(self):
        ds = {f'S{i}': detail([dz(100, 95, score=i % 10)], FLAT[:-1] + [(99, 99, 97, 98)], symbol=f'S{i}') for i in range(20)}
        zl = L.zone_lists(ds)
        self.assertEqual(zl['counts']['demand_in'], 20)
        scores = [r['score'] for r in zl['demand']['in']]
        self.assertEqual(scores, sorted(scores, reverse=True))
        self.assertEqual(L.row_fields(None), {'mb': 'M'})
        rf = L.row_fields(zl['demand']['in'][0])
        self.assertEqual(rf['mb'], 'ID')
        self.assertEqual(len(rf['mz']), 6)


class TelegramListsTest(unittest.TestCase):
    def test_every_section_capped_and_short(self):
        ds = {}
        for i in range(60):
            bars = FLAT[:-1] + [(99, 99, 97, 98)] if i % 2 else LOW[:-1] + [(101, 102, 100, 101)]
            zs = [dz(100, 95)] if i % 2 else [sz(100, 105)]
            ds[f'T{i:02d}'] = detail(zs, bars, symbol=f'T{i:02d}', sector=['Energy', 'Financials', 'Utilities'][i % 3],
                                     home='TSX:T' if i == 1 else '')
        msgs = notify.list_messages(L.zone_lists(ds), cap=15)
        txt = '\n'.join(msgs)
        for head in ('In demand now', 'Approaching demand', 'Left demand', 'In supply', 'Approaching supply', 'Left supply'):
            self.assertIn(head, txt)
        self.assertIn('+15 more on the app', txt)
        self.assertIn('none today', txt)
        self.assertIn('(TSX:T)', txt)
        self.assertTrue(all(notify.u16(m) < notify.SAFE for m in msgs))
        self.assertEqual(txt.count('<b>') - txt.count('</b>'), 0)

    def test_preview_of_the_published_scan(self):
        if not os.path.exists(os.path.join(PUB, 'latest.json')):
            self.skipTest('no published scan')
        out = io.StringIO()
        msgs = notify.preview(PUB, out=out)
        self.assertTrue(all(notify.u16(m) < notify.SAFE for m in msgs))
        txt = out.getvalue()
        self.assertIn('In demand now', txt)
        self.assertIn('Left supply', txt)
        self.assertIn('----- message 1/', txt)

    def test_scan_writes_lists_into_both_files(self):
        res = selftest.run_fixture()
        with tempfile.TemporaryDirectory() as d:
            with open(scan.write_outputs(res, d, fixture=True, history=False)) as f:
                pub = json.load(f)
            with open(os.path.join(d, 'index.json')) as f:
                rows = {r['s']: r for r in json.load(f)['tickers']}
        zl = pub['zone_lists']
        self.assertEqual(set(zl['demand']), {'in', 'left', 'near'})
        for side in ('demand', 'supply'):
            for sec, items in zl[side].items():
                for it in items:
                    self.assertEqual(rows[it['s']]['mb'], L.BUCKET[(side, sec)])      # the app and Telegram agree
        for r in rows.values():
            self.assertIn(r['mb'], L.BUCKET_ORDER)


class TimeframeTest(unittest.TestCase):
    def test_mn_stop_is_three_percent(self):
        self.assertAlmostEqual(Z.stop_buffer(10.0, 'MN'), 0.3)
        self.assertAlmostEqual(Z.stop_buffer(10.0, 'W1'), 0.5)
        self.assertAlmostEqual(Z.stop_buffer(10.0, 'D1'), 1.0)

    def test_no_sub_daily_tf(self):
        self.assertEqual(scan.TRADE_TFS, ('D1', 'W1', 'MN'))
        self.assertTrue(all('H1' not in v and 'H4' not in v for v in scan.LOWER_CONFIRM.values()))
        res = selftest.run_fixture()
        for d in res['details'].values():
            for z in d['zones']:
                self.assertIn(z['tf'], scan.TRADE_TFS)
        for s in res['signals']:
            self.assertIn(s['tf'], scan.TRADE_TFS)

    def test_mn_zones_get_dna_and_rules(self):
        import data as DATA
        import synth
        b = synth.ticker(3, selftest.END)
        an = scan.analyse(b, DATA.closed_htf(b, 'W1'), DATA.closed_htf(b, 'MN'))
        self.assertEqual([r.tf for r, _ in scan.stack(an)], ['D1', 'W1', 'MN'])
        mn_dem = [z for z in an.mn.zones if z.dir > 0 and not z.removed and z.dist < an.price] if an.mn.ok else []
        for z in mn_dem:
            self.assertIn(z.zid, an.dna)
            p = scan.plan(z, an.dna[z.zid])
            self.assertEqual(p['stop_pct_of_height'], 3.0)

    def test_known_date_of_an_mn_zone(self):
        an = scan.Analysis(price=1, date='2026-10-23', d1=None, w1=None, mn=None, direction=None, curve=None,
                           d1_dates=['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-23'])
        z = Z.Zone(tf='MN', dir=1, prox=1, dist=0.9, leg_bar=2, base_n=1, sa_bar=1, leg_ratio=2, cont=False, gap=0, leg2=False)
        z.made = '2026-09-01'
        self.assertEqual(scan.known_date(an, z), '2026-09-30')


if __name__ == '__main__':
    unittest.main()
