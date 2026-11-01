"""Fill, stop, target, trailing and filter rules of sim.py on hand-made bars (no data files)."""
import datetime as dt
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import sim as S  # noqa: E402
import tvsdlib as L  # noqa: E402


def days(n, start='2020-01-06'):
    d = dt.date.fromisoformat(start)
    out = []
    while len(out) < n:
        if d.weekday() < 5:
            out.append(d.isoformat())
        d += dt.timedelta(days=1)
    return out


def mkt(bars, sym='EURUSD'):
    ds = days(len(bars))
    return {sym: S.mkt_from_rows(sym, [[d + 'T00:00', *b] for d, b in zip(ds, bars)])}, ds


def flat(n, px=1.1):
    return [[px, px + 0.002, px - 0.002, px]] * n


class SimTest(unittest.TestCase):
    cost = L.COST['EURUSD']

    def order(self, ds, sig, d=1, entry=1.1000, stop=1.0950, target=1.1100, tf='D1'):
        return {'sym': 'EURUSD', 'sig': ds[sig], 'tf': tf, 'd': d, 'entry': entry, 'stop': stop, 'target': target,
                'distal': stop + 0.0010 * d, 'zid': 'z', 'code': 'ARR', 'rr': 2.0}

    def test_limit_fill_then_target(self):
        bars = flat(5) + [[1.1050, 1.1060, 1.0990, 1.1040], [1.1040, 1.1120, 1.1030, 1.1100]]
        mk, ds = mkt(bars)
        r = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0])
        t = r['trades'][0]
        self.assertEqual((t['in'], t['out'], t['why']), (ds[5], ds[6], 'target'))
        self.assertAlmostEqual(t['R'], (1.1100 - 1.1000 - self.cost) / (0.0050 + self.cost), places=9)

    def test_stop_on_the_fill_bar_and_gap_through_stop(self):
        bars = flat(5) + [[1.1050, 1.1060, 1.0940, 1.0990]]      # touches the limit, then the stop: stopped, -1R
        mk, ds = mkt(bars)
        t = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0])['trades'][0]
        self.assertEqual(t['why'], 'stop')
        self.assertAlmostEqual(t['R'], -1.0, places=9)
        bars = flat(5) + [[1.0900, 1.0910, 1.0890, 1.0900]]      # opens below the stop: exits at the open, worse than -1R
        mk, ds = mkt(bars)
        t = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0])['trades'][0]
        self.assertEqual((t['why'], t['exit']), ('gap', 1.0900))
        self.assertLess(t['R'], -1.5)

    def test_target_not_credited_on_the_fill_bar(self):
        bars = flat(5) + [[1.1050, 1.1130, 1.0990, 1.1120], [1.1120, 1.1130, 1.1100, 1.1110]]
        mk, ds = mkt(bars)
        t = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0])['trades'][0]
        self.assertEqual((t['in'], t['out']), (ds[5], ds[6]))
        t = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0], fillbar_target=True)['trades'][0]
        self.assertEqual((t['in'], t['out']), (ds[5], ds[5]))

    def test_unfilled_order_cancelled_when_target_trades_first(self):
        bars = flat(5) + [[1.1050, 1.1120, 1.1020, 1.1100]] + [[1.1100, 1.1110, 1.0990, 1.1000]]
        mk, ds = mkt(bars)
        r = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0])
        self.assertEqual(r['trades'], [])
        self.assertEqual(r['skipped']['cancelled'], 1)

    def test_trend_filter_blocks_the_fill_in_c(self):
        bars = flat(130) + [[1.1050, 1.1060, 1.0990, 1.1040], [1.1040, 1.1120, 1.1030, 1.1100]]
        mk, ds = mkt(bars)
        o = self.order(ds, 129)
        self.assertEqual(len(S.simulate('A', mk, [o], start=ds[0])['trades']), 1)
        r = S.simulate('C', mk, [o], start=ds[0])
        self.assertEqual(r['trades'], [])                         # flat market: no 50-day-high regime, the order is not taken
        self.assertGreaterEqual(r['skipped']['filter'], 1)

    def test_b_enters_next_open_and_exits_on_the_trailing_stop(self):
        up = [[1.10 + 0.002 * i, 1.10 + 0.002 * i + 0.003, 1.10 + 0.002 * i - 0.001, 1.10 + 0.002 * i + 0.002] for i in range(1, 41)]
        crash = [[1.18, 1.181, 1.12, 1.125]] * 3
        mk, ds = mkt(flat(130) + up + crash)
        r = S.simulate('B', mk, start=ds[0])
        t = [t for t in r['trades'] if t['d'] == 1][0]
        m = mk['EURUSD']
        sig = next(i for i in range(130, len(ds)) if m.c[i] > m.sma[i] and m.c[i] > m.hi_prev[i])
        self.assertEqual(t['in'], ds[sig + 1])
        self.assertAlmostEqual(t['entry'], m.o[sig + 1])
        self.assertAlmostEqual(t['stop'], m.o[sig + 1] - 3 * m.atr[sig])
        self.assertEqual(t['why'], 'trail')
        self.assertGreater(t['R'], 0)

    def test_open_risk_cap(self):
        bars = flat(5) + [[1.1050, 1.1060, 1.0990, 1.1040]] * 3
        mk, ds = mkt(bars)
        r = S.simulate('A', mk, [self.order(ds, 4)], start=ds[0], risk=0.06)       # one trade of 6% is already over the 5% cap
        self.assertEqual(r['trades'], [])
        self.assertEqual(r['skipped']['cap'], 1)


if __name__ == '__main__':
    unittest.main()
