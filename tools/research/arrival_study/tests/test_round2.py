"""Round-2 simulator / filters / Kevin helpers (python -m unittest discover -s tools/research/arrival_study/tests)."""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import r2lib as R  # noqa: E402
import kevin_calls as KC  # noqa: E402
import round2 as R2  # noqa: E402

Z = R.Z


def tf(rows, gran='M15', start='2024-01-08T00:00'):
    """rows = [(o, h, l, c)] -> TF of consecutive bars."""
    bars = []
    for i, (o, h, l, c) in enumerate(rows):
        bars.append(Z.Bar(R.add_time(start, minutes=15 * i), o, h, l, c))
    return R.TF(gran, bars)


T0 = '2024-01-07T00:00'
EXP = '2024-01-09T00:00'


class Simulate(unittest.TestCase):
    def test_fixed_win(self):
        f = tf([(1.10, 1.105, 1.099, 1.10), (1.10, 1.101, 1.095, 1.097), (1.097, 1.12, 1.096, 1.115)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['outcome'], 'win')
        self.assertAlmostEqual(r['R'], 2.0)

    def test_cost_in_R(self):
        f = tf([(1.10, 1.105, 1.099, 1.10), (1.10, 1.121, 1.10, 1.12)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.001, 'fixed', 1.12)
        self.assertAlmostEqual(r['R'], 1.9)

    def test_stop_first_in_one_bar(self):
        f = tf([(1.10, 1.105, 1.099, 1.10), (1.10, 1.125, 1.085, 1.11)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['outcome'], 'loss')
        self.assertAlmostEqual(r['R'], -1.0)

    def test_fill_bar_never_reaches_target(self):
        f = tf([(1.11, 1.125, 1.099, 1.12), (1.12, 1.121, 1.11, 1.115)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['outcome'], 'win')               # reached on bar 2, not on the fill bar
        self.assertEqual(r['exit_t'], f.ends[1])

    def test_gap_through_stop_exits_at_open(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.08, 1.085, 1.07, 1.08)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertAlmostEqual(r['R'], -2.0)

    def test_cancel_zone_removed_and_missed(self):
        f = tf([(1.11, 1.111, 1.105, 1.106), (1.106, 1.107, 1.101, 1.101), (1.10, 1.10, 1.08, 1.085)])
        # the close of bar 3 is below the distal, but bar 3 touches the entry first -> filled, stopped
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['outcome'], 'loss')
        g = tf([(1.11, 1.111, 1.101, 1.091)])
        self.assertEqual(R.simulate(1, 1.10, 1.09, g, T0, EXP, None, 1.092, 0, 'fixed', 1.12)['why'], 'zone removed')
        h = tf([(1.11, 1.125, 1.101, 1.12)])
        self.assertEqual(R.simulate(1, 1.10, 1.09, h, T0, EXP, None, 1.092, 0, 'fixed', 1.12)['why'], 'missed (target first)')
        self.assertEqual(R.simulate(1, 1.10, 1.09, h, T0, EXP, None, 1.092, 0, 'fixed', 1.12, cancel_at=1.13)['why'], 'no data')

    def test_expiry(self):
        f = tf([(1.11, 1.111, 1.105, 1.106)] * 20)
        r = R.simulate(1, 1.10, 1.09, f, T0, f.ends[3], None, 1.092, 0, 'fixed', 1.12)
        self.assertEqual(r['outcome'], 'cancelled')

    def test_partial_then_break_even(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.111, 1.10, 1.108), (1.108, 1.109, 1.099, 1.10)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'partial', 1.13)
        self.assertEqual(r['why'], 'break-even')
        self.assertAlmostEqual(r['R'], 0.5)

    def test_partial_target(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.111, 1.10, 1.108), (1.108, 1.131, 1.105, 1.13)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'partial', 1.13)
        self.assertAlmostEqual(r['R'], 0.5 + 1.5)

    def test_trail(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.13, 1.10, 1.13), (1.13, 1.13, 1.115, 1.116)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'trail', None, cancel_at=1.13)
        self.assertEqual(r['why'], 'trail')
        self.assertAlmostEqual(r['R'], 2.0)                 # best 3R, trailing 1R behind

    def test_short_mirror(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.10, 1.079, 1.08)])
        r = R.simulate(-1, 1.10, 1.11, f, T0, EXP, None, 1.108, 0.0, 'fixed', 1.08)
        self.assertAlmostEqual(r['R'], 2.0)

    def test_time_exit(self):
        f = tf([(1.10, 1.101, 1.099, 1.10)] + [(1.10, 1.103, 1.098, 1.102)] * 10)
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, f.ends[4], 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['why'], 'time')
        self.assertAlmostEqual(r['R'], 0.2)

    def test_stats_and_drawdown(self):
        ts = [{'outcome': 'win', 'R': 2.0, 'exit_t': '2024-01-01', 't': '2024-01-01'},
              {'outcome': 'loss', 'R': -1.0, 'exit_t': '2024-01-02', 't': '2024-01-02'},
              {'outcome': 'loss', 'R': -1.0, 'exit_t': '2024-01-03', 't': '2024-01-03'},
              {'outcome': 'cancelled', 'R': None, 't': '2024-01-04'}]
        s = R.stats(ts)
        self.assertEqual((s['n'], s['filled'], s['closed']), (4, 3, 3))
        self.assertAlmostEqual(s['avg_R'], 0.0)
        self.assertAlmostEqual(s['pf'], 1.0)
        self.assertAlmostEqual(s['dd'], 2.0)


class Features(unittest.TestCase):
    def test_location_orientation(self):
        bars = [Z.Bar(f'2024-01-{i + 1:02d}T00:00', 1.0 + i * 0.01, 1.005 + i * 0.01, 0.995 + i * 0.01, 1.0 + i * 0.01) for i in range(20)]
        S = R.A.series_of(bars, 'D1')
        self.assertLess(R.location(S, 1.0, 1), 5)          # the bottom of the range = cheap for a buy
        self.assertGreater(R.location(S, 1.0, -1), 95)     # ... expensive for a sell

    def test_filters(self):
        f = {'htf_struct': 1, 'loc_htf': 30.0, 'leg_body_atr': 1.5, 'opp_rr': 3.0}
        self.assertTrue(R2.filt('HTF struct + discount + strong leg')(f))
        self.assertFalse(R2.filt('with HTF trend line')(f))
        self.assertTrue(R2.filt('room >= 2R to opposite zone')(f))

    def test_buckets(self):
        self.assertEqual(R.bucket_of('loc_htf', 10), '<= 25')
        self.assertEqual(R.bucket_of('loc_htf', 60), '50 – 75')
        self.assertEqual(R.bucket_of('nested', True), 'yes')

    def test_models(self):
        rows = [{'x': float(i), 'R': (1.0 if i > 50 else -1.0)} for i in range(100)]
        tree = R.stump_tree(rows, ['x'], 'R', depth=1, min_leaf=10)
        self.assertEqual(tree['key'], 'x')
        self.assertGreater(R.tree_apply(tree, {'x': 90}), 0)
        m = R.logit_fit([[r['x']] for r in rows], [1 if r['R'] > 0 else 0 for r in rows])
        self.assertGreater(R.auc([R.logit_prob(m, [r['x']]) for r in rows], [1 if r['R'] > 0 else 0 for r in rows]), 0.95)


class Kevin(unittest.TestCase):
    def test_times(self):
        self.assertEqual(KC.place_time('2026-07-08_1643'), '2026-07-08T23:43')
        self.assertEqual(KC.trading_day_end('2026-07-10', 0), '2026-07-11T00:00')     # Friday
        self.assertEqual(KC.trading_day_end('2026-07-10', 2), '2026-07-15T00:00')     # + Mon, Tue

    def test_tf_of(self):
        self.assertEqual(KC.tf_of({'zone_tf': '4H', 'timeframes': ['1H']}), 'H4')
        self.assertEqual(KC.tf_of({'zone_tf': None, 'timeframes': ['1H', '5m']}), 'H1')

    def test_run_call_synthetic(self):
        import random
        rnd = random.Random(3)
        m5, p = [], 1.1000
        t = '2026-06-01T00:00'
        for i in range(20000):
            o = p
            p = p + rnd.gauss(0, 0.0003)
            m5.append(Z.Bar(R.add_time(t, minutes=5 * i), o, max(o, p) + 0.0001, min(o, p) - 0.0001, p))
        D = {'M5': R.TF('M5', m5), '_spread': [0.00008] * len(m5)}
        for g, k in (('H1', 12), ('H4', 48), ('D1', 288)):
            agg = []
            for j in range(0, len(m5) - k + 1, k):
                ch = m5[j:j + k]
                agg.append(Z.Bar(ch[0].d, ch[0].o, max(b.h for b in ch), min(b.l for b in ch), ch[-1].c))
            D[g] = R.TF(g, agg)
        fi = D['M5'].closed(KC.place_time('2026-07-20_1650'))
        px = m5[fi - 1].c
        c = {'session': '2026-07-20_1650', 'plan_for': '2026-07-21', 'symbol': 'EURUSD', 'direction': 'long', 'zone_tf': '1H',
             'timeframes': ['1H'], 'proximal': round(px - 0.0010, 5), 'distal': round(px - 0.0025, 5), 'entry_type': 'limit at proximal'}
        row = KC.run_call(c, D, {})
        self.assertEqual(row['status'], 'traded')
        self.assertIn(row['res']['2R']['outcome'], ('win', 'loss', 'flat', 'open', 'cancelled'))
        self.assertLess(row['stop'], c['distal'])
        far = dict(c, proximal=px * 0.9, distal=px * 0.89)
        self.assertEqual(KC.run_call(far, D, {})['status'], 'price off')


if __name__ == '__main__':
    unittest.main()
