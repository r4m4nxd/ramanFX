import datetime as dt
import unittest

import helpers  # noqa: F401
from helpers import bars_from_closes
import backtest as BT
import data as DATA
import scan
import synth
from zones import Bar


def sig(entry=100.0, stop=98.0, target=106.0, distal=98.5):
    return {'entry': entry, 'stop': stop, 'target': target, 'distal': distal}


def bars(rows):
    return [Bar(f'2026-01-{i + 1:02d}', *r) for i, r in enumerate(rows)]


class SimulateTest(unittest.TestCase):
    def test_target(self):
        b = bars([(101, 102, 100.5, 101), (101, 101.5, 99.8, 100.5), (100.5, 103, 100.2, 102.8), (103, 106.5, 102.5, 106)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['status'], 'filled')
        self.assertEqual(r['fill'], 100.0)
        self.assertEqual(r['wick_why'], 'target')
        self.assertAlmostEqual(r['wick_r'], 3.0)
        self.assertAlmostEqual(r['close_r'], 3.0)

    def test_wick_vs_close_stop(self):
        b = bars([(101, 102, 100.5, 101), (101, 101, 99.5, 100.2), (100.2, 100.4, 97.5, 98.6), (98.6, 106.5, 98.4, 106)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['wick_why'], 'stop')
        self.assertAlmostEqual(r['wick_r'], -1.0)              # wick through the stop
        self.assertEqual(r['close_why'], 'target')              # the close held above the stop
        self.assertAlmostEqual(r['close_r'], 3.0)

    def test_gap_through_stop(self):
        b = bars([(101, 102, 100.5, 101), (101, 101, 99.5, 100.2), (96.0, 96.5, 95.0, 95.5)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertTrue(r['wick_gap'])
        self.assertAlmostEqual(r['wick_r'], -2.0)
        self.assertAlmostEqual(r['close_r'], -2.25)

    def test_gap_fill_and_cancel(self):
        b = bars([(101, 102, 100.5, 101), (99.0, 99.5, 98.8, 99.2)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['fill'], 99.0)                       # limit filled at the open on a gap down
        b = bars([(101, 102, 100.5, 101), (103, 106.2, 102.5, 106)])
        self.assertEqual(BT.simulate(b, 0, sig(), 0)['status'], 'cancelled_target')

    def test_costs(self):
        b = bars([(101, 102, 100.5, 101), (101, 101.5, 99.8, 100.5), (100.5, 106.5, 100.2, 106)])
        r = BT.simulate(b, 0, sig(), cost_bps=10)
        self.assertAlmostEqual(r['wick_r'], 3.0 - 2 * 10 / 1e4 * 100 / 2)


class StatsTest(unittest.TestCase):
    def test_bootstrap_deterministic(self):
        xs = [1, -1, 2, -1, -1, 3, -1, 0.5]
        self.assertEqual(BT.bootstrap_ci(xs), BT.bootstrap_ci(xs))
        lo, hi = BT.bootstrap_ci(xs)
        self.assertLess(lo, sum(xs) / len(xs))
        self.assertGreater(hi, sum(xs) / len(xs))

    def test_summary_and_verdict(self):
        tr = [{'status': 'filled', 'signal_date': f'2020-01-{i % 28 + 1:02d}' if i < 70 else f'2024-01-{i % 28 + 1:02d}', 'wick_r': (2 if i % 3 == 0 else -1),
               'close_r': (2 if i % 3 == 0 else -1), 'zone_type': 'STR', 'tf': 'D1', 'sector': 'X'} for i in range(100)]
        for i, x in enumerate(tr):
            x['indexes'] = 'SPX,NDX' if i % 2 else 'RUT'
        s = BT.summarize(tr)
        self.assertEqual(s['filled'], 100)
        self.assertEqual(set(s['close']['by_universe']), {'SPX', 'NDX', 'RUT'})
        self.assertEqual(s['close']['by_universe']['RUT']['trades'], 50)
        self.assertEqual(s['close']['out_of_sample']['trades'], 30)
        self.assertIn('NOT proven', BT.verdict(s))
        self.assertIn('NOT ENOUGH', BT.verdict(BT.summarize(tr[:20])))


class NoLookAheadTest(unittest.TestCase):
    def test_htf_buckets_closed_only(self):
        b = synth.ticker(5)
        w1, upto = BT.htf_index(b, 'W1')
        for d in (400, 401, 402, 403, 404, 1000):
            closed = w1[:upto[d]]
            self.assertTrue(all(x.d <= b[d].d for x in closed))
            self.assertEqual([x.d for x in closed], [x.d for x in DATA.closed_htf(b[:d + 1], 'W1')])
            self.assertEqual([round(x.c, 6) for x in closed], [round(x.c, 6) for x in DATA.closed_htf(b[:d + 1], 'W1')])

    def test_prefilter_matches_a_daily_scan(self):
        """The pre-filtered walk-forward finds the same first BUY day per zone as scanning every single day."""
        b = synth.ticker(474)[-700:]
        w1, wu = BT.htf_index(b, 'W1')
        mn, mu = BT.htf_index(b, 'MN')
        daily = {}
        for d in range(BT.WARMUP, len(b)):
            an = scan.analyse(b[:d + 1], w1[:wu[d]], mn[:mu[d]])
            for s in scan.symbol_signals(an):
                if s['kind'] == 'BUY':
                    daily.setdefault(f"{s['tf']}:D:{s['base_start']}", b[d].d)
        cand = BT.candidates(b)
        found = {}
        for d in sorted(cand):
            an = scan.analyse(b[:d + 1], w1[:wu[d]], mn[:mu[d]])
            for s in scan.symbol_signals(an):
                if s['kind'] == 'BUY':
                    found.setdefault(f"{s['tf']}:D:{s['base_start']}", b[d].d)
        self.assertEqual(daily, found)

    def test_signal_unchanged_by_future_bars(self):
        b = synth.ticker(693)
        d = len(b) - 30
        a1 = scan.analyse(b[:d + 1], DATA.closed_htf(b[:d + 1], 'W1'), DATA.closed_htf(b[:d + 1], 'MN'))
        w1, wu = BT.htf_index(b, 'W1')
        mn, mu = BT.htf_index(b, 'MN')
        a2 = scan.analyse(b[:d + 1], w1[:wu[d]], mn[:mu[d]])
        self.assertEqual(scan.symbol_signals(a1), scan.symbol_signals(a2))

    def test_backtest_runs_on_a_fixture(self):
        tr = BT.backtest_ticker('FX', synth.ticker(11132), 'Synthetic', None, 5.0)
        self.assertTrue(tr)
        for t in tr:
            if t['status'] == 'filled':
                self.assertGreaterEqual(t['fill_date'], t['signal_date'])
                self.assertGreater(t['fill_date'], t['signal_date'])   # never the signal bar itself


class WalkForwardRulesTest(unittest.TestCase):
    def test_htf_aggregation_ignores_future_bars(self):
        """The closed W1 / MN candles at day d are the same whether the history ends at d or years later, and the
        forming week / month is never among them."""
        b = synth.ticker(11)
        for tf in ('W1', 'MN'):
            full, upto = BT.htf_index(b, tf)
            for d in (500, 503, 777, 1201, len(b) - 3):
                cut, cut_upto = BT.htf_index(b[:d + 1], tf)
                n = upto[d]
                self.assertEqual(n, cut_upto[d])
                self.assertEqual([(x.d, x.o, x.h, x.l, x.c) for x in full[:n]], [(x.d, x.o, x.h, x.l, x.c) for x in cut[:n]])
                key = lambda x: BT.Z.period_key(tf, x)  # noqa: E731
                if d + 1 < len(b) and key(b[d + 1].d) == key(b[d].d):   # day d's bucket is still forming ...
                    self.assertNotEqual(key(full[n - 1].d), key(b[d].d))  # ... so it is not visible
                    self.assertEqual(key(full[n].d), key(b[d].d))

    def test_mid_week_sees_last_week_only(self):
        b = bars_from_closes([100 + i * 0.1 for i in range(30)], start=dt.date(2026, 1, 5))   # Monday 5 Jan
        w1, upto = BT.htf_index(b, 'W1')
        wed = next(i for i, x in enumerate(b) if x.d == '2026-01-14')
        fri = next(i for i, x in enumerate(b) if x.d == '2026-01-16')
        self.assertEqual(upto[wed], 1)                 # week of 5 Jan closed, week of 12 Jan still forming
        self.assertEqual(upto[fri], 2)                 # Friday close: that week is closed
        self.assertIn(fri, BT.week_ends(b))
        self.assertNotIn(wed, BT.week_ends(b))

    def test_touch_is_not_a_fill(self):
        b = bars([(101, 102, 100.5, 101), (101, 101.5, 100.0, 100.6), (100.6, 101, 100.2, 100.8)])
        self.assertEqual(BT.simulate(b, 0, sig(), 0)['status'], 'pending')   # low == entry: not traded through

    def test_gap_through_stop_on_the_fill_bar(self):
        b = bars([(101, 102, 100.5, 101), (97.0, 97.5, 96.0, 96.5), (96.5, 107, 96.4, 106)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['fill'], 97.0)              # limit filled at the open below the stop ...
        self.assertTrue(r['gap_fill'])
        self.assertEqual(r['wick_why'], 'stop')        # ... and the stop order exits at that open
        self.assertTrue(r['wick_gap'])
        self.assertEqual(r['wick_exit'], 97.0)
        self.assertEqual(r['wick_exit_date'], b[1].d)

    def test_same_bar_stop_and_target_takes_the_stop(self):
        b = bars([(101, 102, 100.5, 101), (101, 101, 99.5, 100.2), (100.2, 106.5, 97.5, 104)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['wick_why'], 'stop')
        self.assertAlmostEqual(r['wick_r'], -1.0)
        # the fill bar never takes the target, even when its high is above it
        b = bars([(101, 102, 100.5, 101), (101, 106.5, 99.5, 106), (106, 106.2, 104, 105)])
        r = BT.simulate(b, 0, sig(), cost_bps=0)
        self.assertEqual(r['wick_exit_date'], b[2].d)

    def test_time_exit_after_52_weeks(self):
        cl = [101.0, 99.9] + [100.6 + 0.001 * i for i in range(400)]
        b = bars_from_closes(cl, wick=0.2)
        r = BT.simulate(b, 0, sig(stop=90.0, target=150.0, distal=91.0), cost_bps=0)
        self.assertEqual(r['wick_why'], 'time')
        days = (dt.date.fromisoformat(r['wick_exit_date']) - dt.date.fromisoformat(r['fill_date'])).days
        self.assertTrue(358 <= days <= 364)

    def test_random_baseline_deterministic(self):
        b = synth.ticker(21)
        t = {'status': 'filled', 'entry': 50.0, 'stop': 48.0, 'target': 56.0, 'signal_date': b[900].d, 'tf': 'W1'}
        days = sorted(d for d in BT.week_ends(b) if d >= BT.WARMUP)
        a1 = BT.random_entries('ABC', b, t, days, 5.0, seed=7)
        a2 = BT.random_entries('ABC', b, t, days, 5.0, seed=7)
        self.assertEqual(a1, a2)
        self.assertEqual(len(a1), BT.RANDOM_K)
        self.assertNotEqual([x['signal_date'] for x in a1], [x['signal_date'] for x in BT.random_entries('ABC', b, t, days, 5.0, seed=8)])
        for x in a1:                                  # same geometry: stop 4% / target 12% of the entry
            self.assertGreater(x['fill_date'], x['signal_date'])
            if x['wick_why'] == 'stop' and not x['wick_gap']:
                self.assertAlmostEqual(x['wick_exit'] / x['fill'], 0.96, places=3)

    def test_rule_variants_restore_the_live_functions(self):
        f_ath, f_loc = BT.Z.ath_curve_ok, scan.loc_of
        with BT.rule_variant('no_ath'):
            self.assertIsNot(BT.Z.ath_curve_ok, f_ath)
        with BT.rule_variant('no_nesting'):
            self.assertIsNot(scan.loc_of, f_loc)
        self.assertIs(BT.Z.ath_curve_ok, f_ath)
        self.assertIs(scan.loc_of, f_loc)

    def test_metrics(self):
        tr = [{'status': 'filled', 'wick_r': r, 'wick_ret': r * 2, 'wick_weeks': 10, 'wick_exit_date': f'2020-01-{i + 1:02d}', 'wick_why': 'x'}
              for i, r in enumerate([2, -1, -1, -1, 3, -1])]
        m = BT.metrics(tr, 'wick')
        self.assertEqual(m['losing_streak'], 3)
        self.assertEqual(m['max_dd_r'], 3.0)
        self.assertAlmostEqual(m['avg_r'], 1 / 6, places=3)


if __name__ == '__main__':
    unittest.main()
