"""Pinndx-inspired extras: fair value, PZ1-3, Seiden odds score, RFX composite index, watchlist alerts.
None of them may change a BUY: the Raja rules stay the only gate."""
import unittest

import helpers  # noqa: F401
from helpers import bars_from_closes
import data as DATA
import scan
import selftest
import synth
import zones as Z
from zones import Bar


def vol_bars(rows):
    """rows = (low, high, volume); open / close in the middle."""
    return [Bar(f'2026-01-{i + 1:02d}', (l + h) / 2, h, l, (l + h) / 2, v) for i, (l, h, v) in enumerate(rows)]


class FairValueTest(unittest.TestCase):
    def test_value_area_holds_70_percent_around_the_poc(self):
        rows = [(100, 102, 1000)] * 16 + [(90, 110, 100)] * 4          # heavy trading at 100-102, thin wide bars
        fv = Z.fair_value(Z.Series(vol_bars(rows)), 20)
        self.assertEqual(fv.method, 'volume')
        self.assertLessEqual(fv.lo, 100.5)
        self.assertGreaterEqual(fv.hi, 101.5)
        self.assertGreater(fv.lo, 97)                                   # the thin tails are outside the value area
        self.assertLess(fv.hi, 105)
        self.assertTrue(fv.lo <= fv.poc <= fv.hi)

    def test_no_volume_falls_back_to_close_percentiles(self):
        b = bars_from_closes([float(x) for x in range(1, 22)])          # volume 0
        fv = Z.fair_value(Z.Series(b), 20)
        self.assertEqual(fv.method, 'closes')
        self.assertEqual((fv.lo, fv.hi), (7.0, 16.0))                  # closes 2..21 (shift 1..20): 25th / 75th pct

    def test_uses_closed_bars_only(self):
        b = vol_bars([(100, 102, 1000)] * 25)
        S = Z.Series(b, price=500.0)                                     # a wild forming price changes nothing
        self.assertEqual(Z.fair_value(S, 20), Z.fair_value(Z.Series(b), 20))
        self.assertIsNone(Z.fair_value(Z.Series(b[:3]), 20))


class PzTest(unittest.TestCase):
    def test_levels(self):
        fv = Z.FairValue(108.0, 115.0, 110.0, 'volume')
        p = Z.pz_levels(100.0, 98.0, 120.0, fv)                          # risk 2
        self.assertEqual((p['pz1'], p['pz2'], p['pz3']), (108.0, 115.0, 120.0))
        self.assertEqual((p['rr_pz1'], p['rr_pz2'], p['rr_pz3']), (4.0, 7.5, 10.0))
        p = Z.pz_levels(100.0, 98.0, 120.0, Z.FairValue(101.0, 102.0, 101.5, 'volume'))
        self.assertEqual((p['pz1'], p['pz2']), (104.0, 106.0))           # 2R / 3R win when FV is close
        p = Z.pz_levels(100.0, 98.0, 105.0, fv)
        self.assertEqual((p['pz1'], p['pz2'], p['pz3']), (104.0, None, 105.0))   # only levels below the Raja target
        self.assertIsNone(Z.pz_levels(100.0, 98.0, None, fv)['pz1'])


class SeidenTest(unittest.TestCase):
    def zone(self, base_n=2, ratio=3.0):
        return Z.Zone(tf='D1', dir=1, prox=100, dist=98, leg_bar=10, base_n=base_n, sa_bar=9, leg_ratio=ratio, cont=False, gap=1, leg2=False)

    def test_parts_and_cap(self):
        x = Z.DNA(n_tests=0, room_r=3.5, curve_zone=20, gap_away=True)
        full = Z.Direction(side=1, q=2, dir=1)
        s = Z.seiden_score(self.zone(), x, full, 1.5, True)
        self.assertEqual(s['parts'], {'departure': 2, 'time': 1, 'fresh': 2, 'margin': 2, 'trend': 2, 'curve': 1, 'fv_bonus': 1, 'index_bonus': 1})
        self.assertEqual(s['score'], 10)                                 # capped
        x = Z.DNA(n_tests=1, room_r=2.2, curve_zone=40, gap_away=False)
        s = Z.seiden_score(self.zone(base_n=5, ratio=1.5), x, Z.Direction(side=1, q=1, dir=1), 0.2, False)
        self.assertEqual(s['score'], 0 + 0.5 + 1 + 1 + 1 + 0.5)
        s = Z.seiden_score(self.zone(), x, Z.Direction(side=-1, q=2, dir=-1), None, False)
        self.assertEqual(s['parts']['trend'], 0)


class CompositeIndexTest(unittest.TestCase):
    def test_equal_weight_normalised(self):
        a = [Bar('2026-01-01', 10, 11, 9, 10), Bar('2026-01-02', 10, 12, 10, 12), Bar('2026-01-05', 1, 1, 1, 1)]
        b = [Bar('2026-01-01', 50, 50, 50, 50), Bar('2026-01-02', 50, 60, 45, 45)]
        c = scan.composite_bars({'A': a, 'B': b})
        self.assertEqual([x.d for x in c], ['2026-01-01', '2026-01-02'])  # common dates only
        self.assertAlmostEqual(c[0].c, 100)
        self.assertAlmostEqual(c[1].c, (120 + 90) / 2)
        self.assertAlmostEqual(c[1].h, (120 + 120) / 2)
        self.assertEqual(scan.composite_bars({'A': a, 'B': []}), [])

    def test_index_context_and_alignment(self):
        comp = scan.composite_bars({k: synth.ticker(s) for k, s in zip(scan.INDEX_PARTS, (101, 102, 103, 104))})
        ix = scan.index_context(comp)
        self.assertIn(ix['state'], ('demand', 'supply', 'middle'))
        self.assertEqual(ix['aligned'], scan.index_aligned(ix))
        self.assertTrue(scan.index_aligned({'state': 'demand', 'price': 100}))
        self.assertFalse(scan.index_aligned({'state': 'supply', 'price': 100, 'demand': {'pct': 1, 'height': 1}}))
        self.assertTrue(scan.index_aligned({'state': 'middle', 'price': 100, 'demand': {'pct': 2.5, 'height': 1}}))
        self.assertFalse(scan.index_aligned({'state': 'middle', 'price': 100, 'demand': {'pct': 5, 'height': 1}}))
        self.assertIsNone(scan.index_context(comp[:100]))


class NeverAGateTest(unittest.TestCase):
    def test_buys_do_not_depend_on_the_extras(self):
        b = synth.ticker(7496, selftest.END)
        an = scan.analyse(b, DATA.closed_htf(b, 'W1'), DATA.closed_htf(b, 'MN'))
        base = [s['entry'] for s in scan.symbol_signals(an) if s['kind'] == 'BUY']
        self.assertTrue(base)
        for ix in ({'state': 'supply', 'price': 1, 'demand': None, 'supply': None}, {'state': 'demand', 'price': 1}, None):
            an.index = ix
            got = scan.symbol_signals(an)
            self.assertEqual([s['entry'] for s in got if s['kind'] == 'BUY'], base)
            for s in got:
                self.assertFalse([r for r in s['rules'] if r['short'] in ('FV', 'index') and r['status'] == 'fail'])
        an.index = {'state': 'supply', 'price': 1}
        s = scan.symbol_signals(an)[0]
        self.assertEqual(next(r for r in s['rules'] if r['short'] == 'index')['status'], 'warn')
        self.assertEqual(s['rr_pz3'], s['rr'])
        self.assertEqual(s['pz3'], s['target'])
        self.assertTrue(s['pz1'] is None or s['entry'] < s['pz1'] < s['target'])


class WatchAlertTest(unittest.TestCase):
    def test_approach_in_zone_and_dedupe(self):
        b = synth.zone_series()                                         # demand 99.1-100.3, last close 103.2
        an = scan.analyse(b, b, [])                                     # the same bars as W1 (no D1 zones)
        self.assertEqual(scan.watch_alerts('X', an, b[-1], pct=5)[0]['kind'], 'APPROACH')
        self.assertEqual(scan.watch_alerts('X', an, b[-1], pct=1), [])
        touch = b + [Bar('2026-12-01', 103.2, 103.4, 100.1, 101.0)]
        an2 = scan.analyse(touch, touch, [])
        a = scan.watch_alerts('X', an2, touch[-1])
        self.assertEqual(a[0]['kind'], 'IN ZONE')
        st = {}
        self.assertEqual(len(scan.dedupe_alerts(a, st, '2026-12-01')), 1)
        self.assertEqual(scan.dedupe_alerts(a, st, '2026-12-03'), [])   # same zone within 5 days: once
        self.assertEqual(len(scan.dedupe_alerts(a, st, '2026-12-09')), 1)

    def test_watchlist_env(self):
        import os
        os.environ['WATCHLIST'] = 'aapl, msft;NVDA  aapl'
        try:
            self.assertEqual(scan.load_watchlist(), ['AAPL', 'MSFT', 'NVDA'])
        finally:
            del os.environ['WATCHLIST']

    def test_selftest_alerts_stay_private(self):
        import json
        res = selftest.run_fixture()
        self.assertTrue(res['watch_alerts'])
        pub = json.dumps(scan.public_json(res, fixture=True))
        self.assertNotIn('watch_alerts', pub)
        self.assertIn('rfx_index', pub)


if __name__ == '__main__':
    unittest.main()
