"""Round-4 benchmark strategies: no look-ahead, sizing math, RSI / SMA / ATR, costs, portfolio statistics
(python -m unittest discover -s tools/research/arrival_study/tests)."""
import contextlib
import datetime as dt
import io
import json
import math
import os
import random
import statistics
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import r2lib as R  # noqa: E402
import round4 as R4  # noqa: E402

Z = R.Z


def d1(n, seed=1, start=dt.date(2006, 1, 2), px=100.0, drift=0.0, vol=0.01):
    """n weekday D1 bars (a random walk; drift per bar)."""
    rnd = random.Random(seed)
    out, p, day = [], px, start
    while len(out) < n:
        if day.weekday() < 5:
            o = p * (1 + rnd.gauss(0, vol / 5))
            c = o * (1 + drift + rnd.gauss(0, vol))
            out.append(Z.Bar(day.isoformat() + 'T00:00', o, max(o, c) * (1 + abs(rnd.gauss(0, vol / 3))),
                             min(o, c) * (1 - abs(rnd.gauss(0, vol / 3))), c))
            p = c
        day += dt.timedelta(days=1)
    return out


def closes(cs, start=dt.date(2015, 1, 5)):
    """Flat bars (o = h = l = c) on consecutive calendar days."""
    return [Z.Bar((start + dt.timedelta(days=i)).isoformat() + 'T00:00', c, c, c, c) for i, c in enumerate(cs)]


def shock(bars, k, f=1.5):
    """The bars from k on multiplied by f (a different future)."""
    return bars[:k] + [Z.Bar(b.d, b.o * f, b.h * f, b.l * f, b.c * f) for b in bars[k:]]


def early(ev, k):
    return {j: x for j, x in ev.items() if j < k}


class NoLookAhead(unittest.TestCase):
    def setUp(self):
        self.bars = d1(1500, 3, drift=0.0004)

    def test_tsmom_fills_ignore_the_future(self):
        for months, lo in ((12, False), (6, False), (3, False), (12, True)):
            full, _ = R4.tsmom(self.bars, months, long_only=lo)
            for k in (400, 777, 1200):
                cut, _ = R4.tsmom(self.bars[:k], months, long_only=lo)
                other, _ = R4.tsmom(shock(self.bars, k), months, long_only=lo)
                self.assertEqual(early(full, k), early(cut, k))
                self.assertEqual(early(full, k), early(other, k))
            self.assertTrue(full)

    def test_tsmom_fills_at_the_next_open_after_month_end(self):
        ev, first = R4.tsmom(self.bars, 12)
        dates = [b.d[:10] for b in self.bars]
        for j, fills in ev.items():
            self.assertNotEqual(dates[j - 1][:7], dates[j][:7])      # j = the first bar of a new month
            self.assertEqual(fills[0][0], self.bars[j].o)
        self.assertEqual(first, min(ev))

    def test_tsmom_sign(self):
        up = closes([100 * 1.001 ** i * (1 + 0.003 * (-1) ** i) for i in range(500)])
        ev, _ = R4.tsmom(up, 12)
        self.assertTrue(ev and all(x[0][1] > 0 for x in ev.values()))
        dn = closes([100 * 0.999 ** i * (1 + 0.003 * (-1) ** i) for i in range(500)])
        ev, _ = R4.tsmom(dn, 12)
        self.assertTrue(ev and all(x[0][1] < 0 for x in ev.values()))
        ev, _ = R4.tsmom(dn, 12, long_only=True)
        self.assertTrue(all(x[0][1] == 0 for x in ev.values()))

    def test_donchian_ignores_the_future(self):
        ev, trades, _ = R4.donchian(self.bars, 0.01, 'T')
        self.assertTrue(len(trades) > 10)
        for k in (300, 900, 1400):
            ev2, tr2, _ = R4.donchian(self.bars[:k], 0.01, 'T')
            ev3, tr3, _ = R4.donchian(shock(self.bars, k), 0.01, 'T')
            self.assertEqual(early(ev, k), early(ev2, k))
            self.assertEqual(early(ev, k), early(ev3, k))
            done = lambda ts: [t for t in ts if t['outcome'] != 'open' and t['exit_t'] < self.bars[k].d[:10]]  # noqa: E731
            self.assertEqual(done(trades), done(tr2))

    def test_donchian_entry_next_open_and_stop(self):
        cs = [100.0] * 60 + [101.0, 101.5, 101.2, 95.0, 95.0]
        bars = closes(cs)
        bars[61] = Z.Bar(bars[61].d, 100.8, 101.6, 100.75, 101.5)     # the fill bar's open differs from the close
        ev, trades, _ = R4.donchian(bars, 0.0, 'T')
        self.assertIn(61, ev)                                          # signal at the close of bar 60, fill at the open of 61
        self.assertEqual(ev[61][0][0], 100.8)
        t = trades[0]
        self.assertEqual(t['dir'], 1)
        self.assertEqual(t['entry'], 100.8)
        self.assertEqual(t['why'], 'stop')
        risk = 2 * R4.atr(bars)[60]
        # the stop gapped through: filled at the open (95 < stop), R below -1
        self.assertAlmostEqual(t['exit'], 95.0)
        self.assertAlmostEqual(t['R'], (95.0 - 100.8) / risk)
        self.assertLess(t['R'], -1)

    def test_connors_ignores_the_future(self):
        for d in (1, -1):
            for at_open in (False, True):
                ev, trades, _ = R4.connors(self.bars, 0.01, d, 'T', at_open)
                self.assertTrue(trades)
                for k in (500, 1100):
                    ev2, _, _ = R4.connors(self.bars[:k], 0.01, d, 'T', at_open)
                    ev3, _, _ = R4.connors(shock(self.bars, k), 0.01, d, 'T', at_open)
                    self.assertEqual(early(ev, k), early(ev2, k))
                    self.assertEqual(early(ev, k), early(ev3, k))

    def test_connors_rules(self):
        bars = d1(3000, 8, drift=0.0003)
        c = [b.c for b in bars]
        S200, S5, RS = R4.sma(c, 200), R4.sma(c, 5), R4.rsi(c, 2)
        ev, trades, _ = R4.connors(bars, 0.0, 1, 'T')
        idx = {b.d[:10]: i for i, b in enumerate(bars)}
        self.assertTrue(len(trades) > 20)
        for t in trades:
            e, x = idx[t['t']], idx[t['exit_t']]
            self.assertTrue(c[e] > S200[e] and RS[e] < 10)
            self.assertEqual(t['entry'], c[e])                       # at the signal close
            if t['outcome'] == 'open':
                continue
            self.assertTrue(0 < x - e <= 10)
            self.assertTrue(c[x] > S5[x] or x - e == 10)
            self.assertTrue(all(c[j] <= S5[j] for j in range(e + 1, x)))


class Indicators(unittest.TestCase):
    def test_sma(self):
        self.assertEqual(R4.sma([1, 2, 3, 4, 5], 3), [None, None, 2.0, 3.0, 4.0])

    def test_rsi_wilder(self):
        c = [10, 11, 10.5, 12, 11, 11]
        r = R4.rsi(c, 2)
        self.assertIsNone(r[1])
        # first: changes +1, -0.5 -> ag 0.5, al 0.25 -> RS 2 -> 66.67
        self.assertAlmostEqual(r[2], 100 - 100 / 3)
        # +1.5: ag (0.5 + 1.5) / 2 = 1.0, al 0.25 / 2 = 0.125 -> RS 8
        self.assertAlmostEqual(r[3], 100 - 100 / 9)
        # -1: ag 0.5, al (0.125 + 1) / 2 = 0.5625
        self.assertAlmostEqual(r[4], 100 - 100 / (1 + 0.5 / 0.5625))
        # 0: ag 0.25, al 0.28125
        self.assertAlmostEqual(r[5], 100 - 100 / (1 + 0.25 / 0.28125))
        self.assertEqual(R4.rsi([1, 2, 3, 4], 2)[3], 100.0)
        self.assertEqual(R4.rsi([1, 1, 1, 1], 2)[3], 50.0)

    def test_atr(self):
        bars = closes([10, 11, 13, 12])
        a = R4.atr(bars, 2)
        self.assertIsNone(a[1])
        self.assertAlmostEqual(a[2], (1 + 2) / 2)
        self.assertAlmostEqual(a[3], (2 + 1) / 2)


class Sizing(unittest.TestCase):
    def test_realized_vol_and_weight(self):
        x = 0.01
        cs = [100.0]
        for i in range(400):
            cs.append(cs[-1] * (1 + (x if i % 2 else -x)))
        bars = closes(cs, dt.date(2015, 1, 5))
        dates = [b.d[:10] for b in bars]
        v = R4.realized_vol(cs, dates, 399)
        rs = [cs[k] / cs[k - 1] - 1 for k in range(340, 400)]
        ppy = 365                                                   # consecutive calendar-day bars
        self.assertAlmostEqual(v, statistics.stdev(rs) * math.sqrt(ppy))
        self.assertAlmostEqual(R4.vol_weight(1, v), 0.10 / v)
        self.assertAlmostEqual(R4.vol_weight(-1, 0.05), -2.0)
        self.assertAlmostEqual(R4.vol_weight(1, 0.001), R4.LEV_CAP)  # the cap
        self.assertEqual(R4.vol_weight(1, None), 0.0)
        self.assertIsNone(R4.realized_vol(cs, dates, 30))

    def test_realized_vol_weekdays(self):
        bars = d1(400, 5)
        cs, dates = [b.c for b in bars], [b.d[:10] for b in bars]
        rs = [cs[k] / cs[k - 1] - 1 for k in range(340, 400)]
        ratio = R4.realized_vol(cs, dates, 399) / statistics.stdev(rs)
        self.assertTrue(math.sqrt(259) <= ratio <= math.sqrt(262), ratio)     # ~261 weekday bars a year

    def test_risk_weight(self):
        # 1% risk at a 2-unit stop on a 100 price: 0.005 x E units -> notional 0.5 x E
        self.assertAlmostEqual(R4.risk_weight(1, 100.0, 2.0), 0.5)
        self.assertAlmostEqual(R4.risk_weight(-1, 100.0, 2.0), -0.5)
        self.assertAlmostEqual(R4.risk_weight(1, 100.0, 0.01), R4.LEV_CAP)
        # a full stop-out loses 1% of capital: w x (risk / price)
        self.assertAlmostEqual(R4.risk_weight(1, 100.0, 2.0) * 2.0 / 100.0, 0.01)


class Costs(unittest.TestCase):
    def test_round_trip_costs_the_spread(self):
        bars = closes([100.0] * 10)
        ev = {2: [(100.0, 1.0)], 6: [(100.0, 0.0)]}
        rs = R4.stream(bars, ev, spread=0.02)
        self.assertAlmostEqual(sum(r[1] for r in rs), 0.0)            # flat price: no gross P&L
        self.assertAlmostEqual(sum(r[0] for r in rs), -0.02 / 100)    # one spread on the notional
        self.assertAlmostEqual(rs[2][0], -0.01 / 100)
        # a reversal +1 -> -1 trades 2 units: two half-spreads
        rs = R4.stream(bars, {2: [(100.0, 1.0)], 5: [(100.0, -1.0)]}, spread=0.02)
        self.assertAlmostEqual(rs[5][0], -2 * 0.01 / 100)

    def test_returns_through_fills(self):
        bars = closes([100.0, 100.0, 110.0, 121.0])
        bars[2] = Z.Bar(bars[2].d, 105.0, 110.0, 105.0, 110.0)
        rs = R4.stream(bars, {2: [(105.0, 2.0)]}, spread=0.0)
        self.assertAlmostEqual(rs[2][1], 2 * (110 / 105 - 1))        # from the fill (the open) to the close only
        self.assertAlmostEqual(rs[3][1], 2 * (121 / 110 - 1))

    def test_trade_r_net_of_spread(self):
        bars = closes([100.0, 103.0])
        t = R4._trade('T', bars, 1, 0, 100.0, 1, 103.0, 2.0, 0.1, 'x')
        self.assertAlmostEqual(t['R'], 1.5 - 0.05)
        t = R4._trade('T', bars, -1, 0, 100.0, 1, 103.0, 2.0, 0.1, 'x')
        self.assertAlmostEqual(t['R'], -1.5 - 0.05)
        self.assertEqual(t['outcome'], 'loss')


class Portfolio(unittest.TestCase):
    def test_sharpe_and_drawdown(self):
        rs = [0.01, -0.005] * 50
        self.assertAlmostEqual(R4.sharpe(rs, 252), statistics.fmean(rs) / statistics.pstdev(rs) * math.sqrt(252))
        self.assertAlmostEqual(R4.max_drawdown([0.1, -0.5, 0.2]), 0.5)
        self.assertIsNone(R4.sharpe([0.0] * 10, 252))

    def test_month_blocks_and_bootstrap(self):
        ser = [((dt.date(2015, 1, 1) + dt.timedelta(days=i)).isoformat(), 0.001) for i in range(400)]
        bl = R4.month_blocks(ser)
        self.assertEqual(bl[0][0], 31)
        self.assertAlmostEqual(bl[0][3], 1.001 ** 31 - 1)
        rnd = random.Random(2)
        ser = [(d, rnd.gauss(0.0005, 0.01)) for d, _ in ser]
        a = R4.block_boot(R4.month_blocks(ser), 252)
        b = R4.block_boot(R4.month_blocks(ser), 252)
        self.assertEqual(a, b)                                          # seeded
        self.assertEqual(len(a[0]), R4.N_BOOT)
        self.assertIsNone(R4.block_boot(R4.month_blocks(ser[:200]), 252))

    def test_portfolio_average_and_pstats(self):
        rows = [{'sym': 'A', 'group': 'fx', 'streams': {'s': {'start': '2015-01-01', 'end': '2015-01-03',
                                                               'ret': {'2015-01-01': (0.02, 0.03), '2015-01-03': (0.01, 0.01)}}}},
                {'sym': 'B', 'group': 'index', 'streams': {'s': {'start': '2015-01-02', 'end': '2015-01-03',
                                                                  'ret': {'2015-01-02': (0.04, 0.04)}}}}]
        p = R4.portfolio(rows, 's')
        self.assertEqual(p, [('2015-01-01', 0.02, 0.03), ('2015-01-02', 0.02, 0.02), ('2015-01-03', 0.005, 0.005)])
        self.assertEqual(R4.portfolio(rows, 's', group='idxmet'), [('2015-01-02', 0.04, 0.04)])
        self.assertEqual(R4.portfolio(rows, 's', syms={'A'}), [('2015-01-01', 0.02, 0.03), ('2015-01-03', 0.01, 0.01)])

    def test_pstats_years(self):
        rnd = random.Random(5)
        ser = []
        day = dt.date(2010, 1, 1)
        while day.year < 2013:
            r = rnd.gauss(0.001 if day.year != 2011 else -0.002, 0.005)
            ser.append((day.isoformat(), r, r + 0.0001))
            day += dt.timedelta(days=1)
        s = R4.pstats(ser, 365, 1.0)
        self.assertEqual(s['years'], 3)
        self.assertEqual(s['years_up'], 2)
        self.assertAlmostEqual(s['cost_drag'], 0.0001 * 365)
        self.assertTrue(s['sharpe_ci'][0] < s['sharpe'] < s['sharpe_ci'][1])
        self.assertTrue(0 <= s['p'] <= 1)
        s2 = R4.pstats(ser, 365, 2.0)
        self.assertAlmostEqual(s2['sharpe'], s['sharpe'])               # leverage does not change the Sharpe
        self.assertGreater(s2['max_dd'], s['max_dd'])

    def test_asset_groups(self):
        self.assertEqual(R4.asset_group('EUR_USD'), 'fx')
        self.assertEqual(R4.asset_group('USD_TRY'), 'fx')
        self.assertEqual(R4.asset_group('XAU_AUD'), 'metal')
        self.assertEqual(R4.asset_group('SPX500_USD'), 'index')
        self.assertEqual(R4.asset_group('DE30_EUR'), 'index')
        self.assertEqual(R4.asset_group('BCO_USD'), 'commodity')
        self.assertEqual(R4.asset_group('XCU_USD'), 'commodity')


class ZoneReference(unittest.TestCase):
    def test_reads_round3_json_and_falls_back(self):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'r3.json')
            js = {k: {'train': {'n': 5, 'exp_r': -0.1}, 'test': {'n': 4, 'exp_r': -0.2, 'ci': [-0.3, -0.1]}, 'halves': []}
                  for k in ('zone:all:2R', 'arrival:all:2R')}
            with open(p, 'w') as f:
                json.dump(js, f)
            z = R4.zone_reference([os.path.join(d, 'missing.json'), p])
            self.assertEqual(z['rows']['zone:all:2R']['test']['exp_r'], -0.2)
            z = R4.zone_reference([os.path.join(d, 'missing.json')])
            self.assertIn('Round3.md', z['source'])
            self.assertLess(z['rows']['zone:all:2R']['test']['exp_r'], 0)


class SelfTest(unittest.TestCase):
    def test_selftest_end_to_end(self):
        with tempfile.TemporaryDirectory() as d:
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(R4.main(['--selftest', '--workers', '1', '--out', d, '--json', os.path.join(d, 'l.json')]), 0)
            with open(os.path.join(d, 'Round4.md')) as f:
                self.assertIn('SELFTEST', f.read())
            with open(os.path.join(d, 'l.json')) as f:
                js = json.load(f)
            self.assertEqual(js['meta']['n_variants'], sum(1 for v in R4.VARIANTS if v['counted']))
            self.assertIn('A.tsmom12', js['strategies'])
            self.assertIn('zone:all:2R', js['zone_reference']['rows'])


if __name__ == '__main__':
    unittest.main()
