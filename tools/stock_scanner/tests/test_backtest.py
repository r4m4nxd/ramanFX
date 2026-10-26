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
        tr = BT.backtest_ticker('FX', synth.ticker(474), 'Synthetic', None, 5.0)
        self.assertTrue(tr)
        for t in tr:
            if t['status'] == 'filled':
                self.assertGreaterEqual(t['fill_date'], t['signal_date'])
                self.assertGreater(t['fill_date'], t['signal_date'])   # never the signal bar itself


if __name__ == '__main__':
    unittest.main()
