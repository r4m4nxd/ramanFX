"""Round-3 features (no look-ahead), management math, FDR (python -m unittest discover -s tools/research/arrival_study/tests)."""
import os
import random
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import r2lib as R  # noqa: E402
import round2 as R2  # noqa: E402
import round3 as R3  # noqa: E402

Z = R.Z


def walk(n, seed=1, gran='D1', start='2015-01-05T00:00', px=1.1):
    """A random walk of n bars (D1: one a calendar day; H4 / M15: consecutive)."""
    rnd = random.Random(seed)
    step = {'D1': dict(days=1), 'H4': dict(hours=4), 'M15': dict(minutes=15)}[gran]
    bars, p, t = [], px, start
    for _ in range(n):
        c = p * (1 + rnd.gauss(0, 0.004))
        bars.append(Z.Bar(t, p, max(p, c) * (1 + abs(rnd.gauss(0, 0.002))), min(p, c) * (1 - abs(rnd.gauss(0, 0.002))), c))
        p = c
        t = R.add_time(t, **step)
    return R.TF(gran, bars)


def cut(T, t):
    """The bars of T closed by time t (everything after it removed)."""
    k = T.closed(t)
    return R.TF(T.tf, T.bars[:k], T.ends[:k])


def tf(rows, gran='M15', start='2024-01-08T00:00'):
    return R.TF(gran, [Z.Bar(R.add_time(start, minutes=15 * i), o, h, l, c) for i, (o, h, l, c) in enumerate(rows)])


T0 = '2024-01-07T00:00'
EXP = '2024-01-09T00:00'


class NoLookAhead(unittest.TestCase):
    def test_trend_ignores_the_future(self):
        D = walk(900, 3)
        full = R3.Trend(D)
        for k in (150, 260, 400, 777):
            t = D.ends[k - 1]
            past = R3.Trend(cut(D, t))
            for d in (1, -1):
                self.assertEqual(full.at(t, d), past.at(t, d))
                self.assertEqual(full.at(R.add_time(t, hours=3), d), past.at(R.add_time(t, hours=3), d))   # mid-bar
        # a changed future never changes the value
        D2 = R.TF('D1', D.bars[:500] + [Z.Bar(b.d, b.o * 3, b.h * 3, b.l * 3, b.c * 3) for b in D.bars[500:]], D.ends)
        t = D.ends[499]
        self.assertEqual(R3.Trend(D).at(t, 1), R3.Trend(D2).at(t, 1))

    def test_trend_values(self):
        bars = [Z.Bar(R.add_time('2015-01-05T00:00', days=i), 1 + i * 0.001, 1 + i * 0.001, 1 + i * 0.001, 1 + i * 0.001) for i in range(300)]
        D = R.TF('D1', bars)
        t = D.ends[-1]
        self.assertEqual(R3.Trend(D).at(t, 1), {'mom12': 1, 'sma200': 1})
        self.assertEqual(R3.Trend(D).at(t, -1), {'mom12': -1, 'sma200': -1})
        self.assertEqual(R3.Trend(D).at(D.ends[150], 1), {'mom12': None, 'sma200': None})   # not enough history
        self.assertEqual(R3.Trend(D).at(D.ends[220], 1)['mom12'], None)

    def test_atr_percentile_ignores_the_future(self):
        T = walk(1200, 5, 'H4')
        full = R3.VolPct(T)
        for k in (264, 265, 500, 1100):
            past = R3.VolPct(cut(T, T.ends[k - 1]))
            self.assertEqual(full.pct(k), past.pct(k))
            self.assertAlmostEqual(full.value(k), T.series(k, 420).atr(1))      # = zones.Series ATR14 at placement
        self.assertIsNone(full.pct(200))
        self.assertTrue(0 < full.pct(1100) <= 100)

    def test_swings_known_only_after_confirmation(self):
        T = walk(600, 9, 'H4')
        full = R3.Swings(T)
        t = T.ends[300]
        past = R3.Swings(cut(T, t))
        for side in (1, -1):
            a = [s for s in full.side(side) if s[0] <= t]
            self.assertEqual(a, past.side(side))
            for tk, lv in full.side(side):
                i = T.ends.index(tk)
                self.assertTrue(i >= 2)

    def test_zone_rows_ignore_the_future(self):
        """Features of every zone placed before a cut are the same with the bars after the cut removed."""
        T = walk(3000, 11, 'H4', start='2018-01-01T00:00')
        D = R.TF('D1', [Z.Bar(R.add_time('2016-06-01T00:00', days=i), 1.1, 1.1, 1.1, 1.1) for i in range(560)] +
                 [Z.Bar(b.d, b.o, b.h, b.l, b.c) for b in T.bars[::6]])
        cut_t = T.ends[2400]
        job = {'sym': 'T', 'name': 'T', 'spread': 0.0001, 'ctrl': True}
        full = R3.zone_rows(job, {'H4': T, 'D1': D}, 'H4', 'D1', {}, R3.Trend(D))
        past = R3.zone_rows(job, {'H4': cut(T, cut_t), 'D1': cut(D, cut_t)}, 'H4', 'D1', {}, R3.Trend(cut(D, cut_t)))
        early = lambda rows: {(r['pop'], r['t'], r['dir']): r['f'] for r in rows if r['pop'] == 'zone' and r['fill_t'] < R.add_time(cut_t, days=-30)}  # noqa: E731
        a, b = early(full), early(past)
        self.assertTrue(a)
        self.assertTrue(any(f.get('atr_pct') is not None and f.get('mom12') is not None for f in a.values()))
        self.assertTrue(any(f.get('session') for f in a.values()))
        for key, f in a.items():
            g = b.get(key)
            self.assertIsNotNone(g, key)
            for k in ('mom12', 'sma200', 'atr_pct', 'pattern', 'session'):
                self.assertEqual(f.get(k), g.get(k), (key, k))


class Session(unittest.TestCase):
    def test_utc_hours(self):
        # winter: forex time = UTC + 2 h; summer (EDT): UTC + 3 h
        self.assertEqual(R3.session_utc('2024-01-08T04:00'), 'asia')       # 02 UTC
        self.assertEqual(R3.session_utc('2024-01-08T12:00'), 'london')     # 10 UTC
        self.assertEqual(R3.session_utc('2024-01-08T16:00'), 'overlap')    # 14 UTC
        self.assertEqual(R3.session_utc('2024-01-08T20:00'), 'ny')         # 18 UTC
        self.assertEqual(R3.session_utc('2024-07-08T16:00'), 'overlap')    # 13 UTC
        self.assertEqual(R3.session_utc('2024-07-08T12:00'), 'london')     # 09 UTC
        self.assertIsNone(R3.session_utc(None))

    def test_fill_bar_start(self):
        self.assertEqual(R3.fill_bar_start('2024-01-08T16:00', 'H4'), '2024-01-08T12:00')
        self.assertEqual(R3.fill_bar_start('2024-01-08T16:15', 'M15'), '2024-01-08T16:00')


class Management(unittest.TestCase):
    def test_break_even_at_2r(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.121, 1.10, 1.12), (1.12, 1.12, 1.085, 1.087)])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.13, be_at=2.0)
        self.assertEqual(r['why'], 'break-even')
        self.assertAlmostEqual(r['R'], 0.0)
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.13)          # without: the stop
        self.assertAlmostEqual(r['R'], -1.0)

    def test_time_stop(self):
        rows = [(1.10, 1.101, 1.099, 1.10)] + [(1.10, 1.105, 1.098, 1.103)] * 5 + [(1.103, 1.13, 1.10, 1.12)]
        f = tf(rows)
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12, time_bars=3, time_r=1.0)
        self.assertEqual(r['why'], 'time stop')
        self.assertAlmostEqual(r['R'], 0.3)
        self.assertEqual(r['exit_t'], f.ends[3])
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12)
        self.assertEqual(r['why'], 'target')
        # +1R reached in time: no time stop
        g = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.111, 1.10, 1.105)] + [(1.105, 1.106, 1.101, 1.104)] * 4 + [(1.104, 1.13, 1.10, 1.12)])
        self.assertEqual(R.simulate(1, 1.10, 1.09, g, T0, EXP, None, 1.092, 0.0, 'fixed', 1.12, time_bars=3)['why'], 'target')

    def test_swing_trail(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.118, 1.10, 1.115), (1.115, 1.12, 1.112, 1.118),
                (1.118, 1.119, 1.104, 1.105)])
        # a swing low at 1.106 confirmed at the close of bar 1 (before the trade reached +1.5R), one at 1.111 confirmed
        # only after the last bar (unknown during the trade)
        sw = [(f.ends[1], 1.106), (R.add_time(f.ends[3], minutes=15), 1.111)]
        r = R.simulate(1, 1.10, 1.09, f, T0, EXP, None, 1.092, 0.0, 'swing', None, swings=sw, swing_after=1.5)
        self.assertEqual(r['why'], 'trail')
        self.assertAlmostEqual(r['R'], 0.6)
        # not yet +1.5R: the stop stays
        g = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.112, 1.10, 1.11), (1.11, 1.111, 1.085, 1.09)])
        self.assertAlmostEqual(R.simulate(1, 1.10, 1.09, g, T0, EXP, None, 1.092, 0.0, 'swing', None, swings=sw)['R'], -1.0)

    def test_short_mirror_be(self):
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.10, 1.079, 1.08), (1.08, 1.101, 1.08, 1.10)])
        r = R.simulate(-1, 1.10, 1.11, f, T0, EXP, None, 1.108, 0.0, 'fixed', 1.07, be_at=2.0)
        self.assertAlmostEqual(r['R'], 0.0)

    def test_run3_stop_width_recomputes_r(self):
        # entry 1.10, distal 1.095, ATR 0.01: stop0.5 = 1.090 (risk 0.010), stop1.0 = 1.085 (risk 0.015)
        f = tf([(1.10, 1.101, 1.099, 1.10), (1.10, 1.10, 1.087, 1.088), (1.088, 1.15, 1.088, 1.14)])
        res = R3.run3(1, 1.10, 1.094, 1.095, 0.01, f, T0, EXP, None, 0.001, 1, [])
        self.assertAlmostEqual(res['stop0.5']['R'], -1.1)                   # stopped: -1R - cost 0.001 / 0.010
        self.assertEqual(res['stop1.0']['why'], 'target')
        self.assertAlmostEqual(res['stop1.0']['R'], 2 - 0.001 / 0.015)       # 2R of the wider risk
        self.assertAlmostEqual(res['stop0.1']['R'], -1 - 0.001 / 0.006)
        self.assertEqual({res[m]['fill_t'] for m in R3.MGMT3}, {f.ends[0]})  # every variant: the same fill
        self.assertEqual(set(res), set(R3.MGMT3))

    def test_second_touch(self):
        # zone 1.10 (prox) .. 1.09 (dist), stop 1.088: price comes back 40% deep, leaves, returns
        S = tf([(1.12, 1.121, 1.11, 1.11), (1.11, 1.111, 1.096, 1.10), (1.10, 1.105, 1.099, 1.104),
                (1.104, 1.11, 1.101, 1.108), (1.108, 1.109, 1.099, 1.10)], gran='H4')
        r = R3.second_touch(1, 1.10, 1.09, 1.088, S, T0, S.ends[-1], S.ends[-1])
        self.assertEqual(r[0], S.ends[3])
        self.assertAlmostEqual(r[1], 0.4)
        # traded through the stop on the first return: no second touch
        S2 = tf([(1.12, 1.121, 1.11, 1.11), (1.11, 1.111, 1.087, 1.095), (1.095, 1.11, 1.101, 1.108)], gran='H4')
        self.assertIsNone(R3.second_touch(1, 1.10, 1.09, 1.088, S2, T0, S2.ends[-1], S2.ends[-1]))


class Stats(unittest.TestCase):
    def test_bh(self):
        p = [0.001, 0.008, 0.039, 0.041, 0.042, 0.06, 0.074, 0.205, 0.212, 0.216]
        self.assertEqual(R3.bh(p, 0.05), [True, True] + [False] * 8)
        self.assertEqual(R3.bh([0.01, 0.02, 0.03], 0.05), [True, True, True])
        self.assertEqual(R3.bh([None, 0.001], 0.05), [False, True])
        self.assertEqual(R3.bh([0.5, 0.6], 0.05), [False, False])

    def test_bonferroni(self):
        self.assertEqual(R3.bonferroni([0.001, 0.02, None], 0.05), [True, False, False])

    def test_p_value(self):
        rnd = random.Random(4)
        pos = [{'t': R.add_time('2021-01-04T00:00', days=i), 'R': 0.5 + rnd.gauss(0, 1), 'outcome': 'win'} for i in range(400)]
        s = R3.sstats(pos)
        self.assertLess(s['p'], 0.001)
        self.assertTrue(s['ci'][0] > 0)
        neg = [dict(t, R=-t['R']) for t in pos]
        self.assertGreater(R3.sstats(neg)['p'], 0.99)
        self.assertIsNone(R3.sstats(pos[:10])['p'])

    def test_block_boot_unchanged(self):
        rnd = random.Random(2)
        ts = [{'t': R.add_time('2021-01-04T00:00', hours=13 * i), 'R': rnd.gauss(0, 1)} for i in range(300)]
        # reference: the round-2 implementation (resampling the week lists)
        blocks = {}
        for t in ts:
            blocks.setdefault(R.week_of(t['t']), []).append(t['R'])
        bl = list(blocks.values())
        r2 = random.Random(11)
        ms = []
        for _ in range(1000):
            s = c = 0
            for _ in bl:
                x = r2.choice(bl)
                s += sum(x)
                c += len(x)
            ms.append(s / c)
        ms.sort()
        self.assertEqual(R._block_boot(ts, 'R'), (ms[25], ms[974]))

    def test_halves(self):
        syms = [f'S{i}' for i in range(29)]
        a, b = R3.halves(syms)
        self.assertEqual(a | b, set(syms))
        self.assertFalse(a & b)
        self.assertEqual((a, b), R3.halves(list(reversed(syms))))           # seeded: order does not matter

    def test_evaluate_survival_rules(self):
        rnd = random.Random(8)
        rows = []
        for i in range(4000):
            sym = f'S{i % 10}'
            t = R.add_time('2012-01-02T00:00', hours=29 * i)
            mom = 1 if i % 2 else -1
            r = (0.6 if mom == 1 else -0.6) + rnd.gauss(0, 1)
            rows.append({'pop': 'zone', 'sym': sym, 'tf': 'H4', 'dir': 1, 't': t, 'fill_t': t,
                         'f': {'mom12': mom, 'sma200': -1, 'pattern': 'rev', 'atr_pct': 50.0, 'session': 'london'},
                         'res': {m: {'outcome': 'win' if r > 0 else 'loss', 'R': r, 'fill_t': t} for m in R3.MGMT3}})
        H, meta = R3.evaluate(rows)
        by = {h['key']: h for h in H}
        self.assertTrue(by['zone:mom12:2R']['survives'])
        self.assertFalse(by['zone:sma200:2R']['survives'])                  # no trades
        self.assertFalse(by['zone:anti-mom12:2R']['survives'])              # reference rows never survive
        self.assertFalse(by['zone:all:2R']['counted'])
        self.assertEqual(meta['n_hypotheses'], sum(1 for h in H if h['counted']))
        self.assertEqual(len(R3.learn_json(H)), len(H))
        j = R3.learn_json(H)['zone:mom12:2R']
        self.assertEqual(set(j['train']), {'n', 'win', 'exp_r', 'ci', 'p'})
        self.assertEqual(len(j['halves']), 2)


if __name__ == '__main__':
    unittest.main()
