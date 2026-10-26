import unittest

import helpers  # noqa: F401  (sys.path)
from helpers import bars_from_closes, path

import synth
import zones as Z
from zones import Bar, RAJA


def demand_case():
    b = synth.zone_series()
    S = Z.Series(b, b[-1].c, 'D1')
    zs = Z.detect(S)
    i = next(k for k, z in enumerate(zs) if z.dir > 0 and abs(z.prox - 100.3) < 1e-9 and abs(z.dist - 99.1) < 1e-9)
    return b, S, zs, i


class SeriesTest(unittest.TestCase):
    def test_shift_order_and_phantom(self):
        b = bars_from_closes([10, 11, 12, 13])
        S = Z.Series(b, 13.5)
        self.assertEqual(S.n, 5)
        self.assertEqual(S.C[0], 13.5)          # phantom forming bar
        self.assertEqual(S.C[1], 13)            # newest closed
        self.assertEqual(S.C[4], 10)

    def test_atr_is_simple_average_of_true_range(self):
        b = bars_from_closes([100 + (i % 3) for i in range(40)], wick=0.5)
        S = Z.Series(b)
        tr = [max(S.H[i], S.C[i + 1]) - min(S.L[i], S.C[i + 1]) for i in range(1, 15)]
        self.assertAlmostEqual(S.atr(1), sum(tr) / 14)
        self.assertEqual(S.atr(S.n - 5), 0.0)   # not enough history


class DetectTest(unittest.TestCase):
    def test_textbook_demand(self):
        b, S, zs, i = demand_case()
        z = zs[i]
        self.assertEqual((z.dir, z.base_n, z.pattern), (1, 2, 'DBR'))
        self.assertAlmostEqual(z.prox, 100.3)    # proximal on the base bodies
        self.assertAlmostEqual(z.dist, 99.1)     # distal on the lowest wick
        self.assertFalse(z.tested)
        self.assertFalse(z.removed)
        self.assertEqual(z.made, b[-(z.sa_bar)].d)

    def test_supply_removed_by_the_departure_close(self):
        b, S, zs, i = demand_case()
        sup = [z for z in zs if z.dir < 0]
        self.assertEqual(len(sup), 1)
        self.assertTrue(sup[0].removed)
        self.assertEqual(sup[0].removed_bar, zs[i].leg_bar)
        self.assertAlmostEqual(sup[0].prox, 104.6)
        self.assertAlmostEqual(sup[0].dist, 105.6)

    def test_removal_by_close_only(self):
        b = synth.zone_series()
        wick = b + [Bar('2026-12-01', 103.2, 103.4, 98.9, 100.5)]          # wick below the distal, close inside
        zs = Z.detect(Z.Series(wick))
        z = next(z for z in zs if z.dir > 0 and abs(z.dist - 99.1) < 1e-9)
        self.assertFalse(z.removed)
        self.assertTrue(z.tested)
        z0 = next(z for z in Z.detect(Z.Series(wick), dict(RAJA, removal_mode=0)) if z.dir > 0 and abs(z.dist - 99.1) < 1e-9)
        self.assertTrue(z0.removed)                                          # v1 mode: a wick removes
        closed = wick + [Bar('2026-12-02', 100.5, 100.6, 98.0, 98.4)]        # close below the distal
        z2 = next(z for z in Z.detect(Z.Series(closed)) if z.dir > 0 and abs(z.dist - 99.1) < 1e-9)
        self.assertTrue(z2.removed)

    def test_fresh_at_allows_the_ongoing_visit(self):
        b = synth.zone_series() + [Bar('2026-12-01', 103.2, 103.4, 100.0, 100.6)]
        S = Z.Series(b)
        z = next(z for z in Z.detect(S) if z.dir > 0 and abs(z.dist - 99.1) < 1e-9)
        self.assertTrue(z.tested)
        self.assertTrue(Z.fresh_at(S, z))
        b2 = b + [Bar('2026-12-02', 100.6, 104.0, 101.5, 103.5)]           # left the zone: no longer fresh
        S2 = Z.Series(b2)
        z2 = next(z for z in Z.detect(S2) if z.dir > 0 and abs(z.dist - 99.1) < 1e-9)
        self.assertFalse(Z.fresh_at(S2, z2))

    def test_too_big_zone_rejected(self):
        b, S, zs, i = demand_case()
        zs_small = Z.detect(S, dict(RAJA, max_zone_atr=0.3))
        self.assertFalse(any(abs(z.dist - 99.1) < 1e-9 and z.dir > 0 for z in zs_small))


class DnaTest(unittest.TestCase):
    def test_strong_zone(self):
        b, S, zs, i = demand_case()
        x = Z.dna(S, zs, i, Z.trendlines(S), [], [], Z.Curve(), None)
        self.assertEqual(x.rm_opp_move, 1)
        self.assertTrue(x.strong)
        self.assertFalse(x.arrival)
        self.assertEqual(x.code, 'STR')
        self.assertEqual(x.n_tests, 0)

    def test_arrival_needs_a_trendline_cross_in_the_run_out(self):
        b, S, zs, i = demand_case()
        z = zs[i]
        line = Z.TLine(dir=-1, a=z.leg_bar + 20, b=z.leg_bar + 5, pa=110, pb=106, removed=True, removed_bar=z.leg_bar, conf=True, cross_bar=z.leg_bar)
        x = Z.dna(S, zs, i, Z.TLState(lines=[line]), [], [], Z.Curve(), None)
        self.assertTrue(x.arrival)
        self.assertEqual(x.code, 'ARR')
        line.cross_bar = z.leg_bar + 3                                       # crossed before the departure: no
        x2 = Z.dna(S, zs, i, Z.TLState(lines=[line]), [], [], Z.Curve(), None)
        self.assertFalse(x2.arrival)

    def test_htf_opposite_zone_veto(self):
        b, S, zs, i = demand_case()
        z = zs[i]
        htf_sup = Z.Zone(tf='MN', dir=-1, prox=z.hi + 0.5 * z.h, dist=z.hi + 3 * z.h, leg_bar=5, base_n=1, sa_bar=4, leg_ratio=2, cont=False, gap=1, leg2=False)
        x = Z.dna(S, zs, i, Z.TLState(), [], [htf_sup], Z.Curve(), None)
        self.assertTrue(x.next_opp_htf)
        far = Z.Zone(tf='MN', dir=-1, prox=z.hi + 5 * z.h, dist=z.hi + 8 * z.h, leg_bar=5, base_n=1, sa_bar=4, leg_ratio=2, cont=False, gap=1, leg2=False)
        self.assertFalse(Z.dna(S, zs, i, Z.TLState(), [], [far], Z.Curve(), None).next_opp_htf)

    def test_stop_buffer_owner_rule(self):
        self.assertAlmostEqual(Z.stop_buffer(2.0, 'D1'), 0.2)
        self.assertAlmostEqual(Z.stop_buffer(2.0, 'W1'), 0.1)
        self.assertAlmostEqual(Z.stop_buffer(0.1, 'D1'), 0.03)               # minimum 3 points


class TrendlineTest(unittest.TestCase):
    def setUp(self):
        cl = path([100, 100.5, 99.5, 100.5, 99.5, 100, 120, 108, 116, 104, 112, 100, 108, 96, 104]) + [104, 112, 113, 114, 115]
        self.S = Z.Series(bars_from_closes(cl))

    def test_down_line_through_the_peaks_is_crossed_by_the_breakout(self):
        tl = Z.trendlines(self.S)
        down = [t for t in tl.lines if t.dir < 0]
        self.assertTrue(down)
        t = down[-1]
        self.assertGreater(t.a, t.b)
        self.assertLess(t.pb, t.pa)                                          # lower highs
        self.assertGreaterEqual(t.cross_bar, 1)
        self.assertLessEqual(t.cross_bar, 5)                                 # the jump to 112
        self.assertTrue(Z.tl_cross_in(tl, -1, 1, 10))

    def test_htf_trend_swings(self):
        self.assertEqual(Z.htf_trend(self.S), -1)
        up = Z.Series(bars_from_closes(path([50, 60, 55, 65, 60, 70, 65, 75, 70, 80, 76])))
        self.assertEqual(Z.htf_trend(up), 1)


class SidewaysCurveDirectionTest(unittest.TestCase):
    def test_sideways(self):
        flat = Z.Series(bars_from_closes(path([102, 99.5, 105.5, 99, 106, 100, 105, 102])))
        self.assertTrue(Z.sideways(flat))
        up = Z.Series(bars_from_closes(path([50, 60, 55, 65, 60, 70, 65, 75, 70, 80, 76])))
        self.assertFalse(Z.sideways(up))

    def test_curve_math(self):
        c = Z.Curve(ok=True, raja=True, pd=100, ps=200)
        self.assertAlmostEqual(c.at(125), 25)
        self.assertAlmostEqual(c.at(150), 50)
        S = Z.Series(bars_from_closes(path([100, 200, 150])))
        self.assertAlmostEqual(Z.curve_v1(S, 150), 100 * (150 - S.L[S.lowest(100, 1)]) / (S.H[S.highest(100, 1)] - S.L[S.lowest(100, 1)]))

    def _row(self, tf, st, side, in_z=0, cp=0, cp_dir=0):
        S = Z.Series(bars_from_closes([1, 2, 3]))
        return Z.Row(tf=tf, S=S, ok=True, st=st, side=side, in_z=in_z, cp=cp, cp_dir=cp_dir)

    def test_dir_combine_rules(self):
        mid = Z.Curve(ok=True, value=40)
        up = lambda tf: self._row(tf, Z.DST_TREND, 1)
        d = Z.dir_combine(up('D1'), up('W1'), up('MN'), mid)
        self.assertEqual((d.dir, d.q), (1, 2))                               # 3-TF confluence: full
        d = Z.dir_combine(self._row('D1', Z.DST_PULL, -1), up('W1'), up('MN'), mid)
        self.assertEqual((d.dir, d.q), (1, 1))                               # ETF against: reduced
        d = Z.dir_combine(up('D1'), self._row('W1', Z.DST_TURN, -1), up('MN'), mid)
        self.assertEqual((d.dir, d.realign), (0, True))                      # ITF turning against: wait to realign
        d = Z.dir_combine(up('D1'), up('W1'), up('MN'), Z.Curve(ok=True, value=80))
        self.assertEqual((d.dir, d.blocked, d.q), (-1, 1, 1))                # high curve: sells only, buys blocked
        d = Z.dir_combine(up('D1'), up('W1'), self._row('MN', Z.DST_TREND, -1), Z.Curve(ok=True, value=10))
        self.assertEqual((d.side, d.q), (1, 1))                              # low curve gives buys only, HTF against: reduced
        d = Z.dir_combine(self._row('D1', Z.DST_TREND, 1, cp=3, cp_dir=1), up('W1'), up('MN'), mid)
        self.assertEqual(d.q, 1)                                             # 3rd CP in a row: one step down


if __name__ == '__main__':
    unittest.main()
