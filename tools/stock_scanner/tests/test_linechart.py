"""linechart.py: the owner's line-chart trend-line rule, on the real candles he drew his own lines on."""
import json
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import arrival as A  # noqa: E402
import linechart as LC  # noqa: E402
import zones as Z  # noqa: E402

with open(os.path.join(HERE, 'fixtures', 'linechart.json')) as f:
    FX = json.load(f)


def series(key, tf, flip=False):
    rows = FX[key]
    if flip:                                   # the mirror market: every price negated (highs <-> lows)
        rows = [[r[0], -r[1], -r[3], -r[2], -r[4]] for r in rows]
    return A.series_of([Z.Bar(*r) for r in rows], tf)


class LineChart(unittest.TestCase):
    def test_gold_h4_is_the_owners_red_line(self):
        S = series('xauusd_h4', 'H4')
        L = LC.lines(S)
        dn = L[-1]
        self.assertIsNotNone(dn)
        self.assertTrue(dn.live)
        self.assertAlmostEqual(dn.pa, 4148.45, places=1)      # the peak the drop started from
        self.assertAlmostEqual(dn.pb, 3689.78, places=1)      # the last pullback peak (not the small bump at 4,067)
        self.assertIsNone(L[1])                               # a downtrend: no real valley, no up line

    def test_gold_aud_weekly_skips_the_spike_top(self):
        S = series('xauaud_w1', 'W1')
        dn = LC.lines(S)[-1]
        self.assertTrue(dn is not None and dn.live)
        self.assertAlmostEqual(dn.pa, 7686.26, places=1)      # the second peak, not the 7,940 wick
        self.assertAlmostEqual(dn.pb, 6560.82, places=1)

    def test_gold_m15_keeps_the_line_and_skips_the_spike(self):
        S = series('xauusd_m15', 'M15')
        piv = LC.pivots(S)
        spike = next(p for p in piv if abs(p.p - 3689.8) < 1.5 and p.t > 0)
        self.assertFalse(spike.real)                          # the first return high: its fall held above the last valley
        dn = LC.line(S, piv, -1)
        self.assertTrue(dn.live)
        self.assertAlmostEqual(dn.pa, 3678.21, places=1)      # the lower peak after the spike
        self.assertAlmostEqual(dn.pb, 3646.65, places=1)      # the next real lower peak
        self.assertGreaterEqual(sum(1 for p in piv if p.t > 0 and p.real and p.bar < dn.b), 3)   # later, smaller peaks do not move it
        up = LC.line(S, piv, 1)
        self.assertTrue(up is not None and not up.live)       # the up line of the rally: broken by the drop

    def test_mirror_gives_the_up_line(self):
        S = series('xauusd_h4', 'H4', flip=True)
        L = LC.lines(S)
        self.assertIsNone(L[-1])
        self.assertAlmostEqual(L[1].pa, -4148.45, places=1)
        self.assertAlmostEqual(L[1].pb, -3689.78, places=1)

    def test_pivots_alternate_and_no_close_cuts_the_line(self):
        S = series('xauusd_h4', 'H4')
        piv = LC.pivots(S)
        self.assertTrue(all(a.t == -b.t for a, b in zip(piv, piv[1:])))
        t = LC.line(S, piv, -1)
        self.assertFalse(any(S.C[j] > t.at(j) for j in range(t.a - 1, 0, -1) if j != t.b))

    def test_too_few_bars(self):
        S = A.series_of([Z.Bar(*r) for r in FX['xauusd_h4'][-15:]], 'H4')
        self.assertEqual(LC.pivots(S), [])
        self.assertEqual(LC.lines(S), {1: None, -1: None})


if __name__ == '__main__':
    unittest.main()
