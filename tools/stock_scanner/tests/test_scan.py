import json
import unittest

import helpers  # noqa: F401
import data as DATA
import scan
import selftest
import synth
import zones as Z
from zones import Bar


def analysis_of(seed):
    b = synth.ticker(seed, selftest.END)
    return b, scan.analyse(b, DATA.closed_htf(b, 'W1'), DATA.closed_htf(b, 'MN'))


class PlanTest(unittest.TestCase):
    def test_entry_stop_target(self):
        z = Z.Zone(tf='MN', dir=1, prox=100.0, dist=98.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        x = Z.DNA(has_opp=True, opp=120.0, has_opp_htf=True, opp_htf=130.0, stop_buf=Z.stop_buffer(2.0, 'MN'))
        p = scan.plan(z, x)
        self.assertEqual(p['entry'], 100.0)
        self.assertEqual(p['stop'], 97.94)                      # distal - 3% of the 2.0 height (MN)
        self.assertEqual(p['target'], round(120 * 0.995, 2))    # 0.5% before the NEAREST supply
        self.assertAlmostEqual(p['rr'], round((119.4 - 100) / 2.06, 2))
        zw = Z.Zone(tf='W1', dir=1, prox=100.0, dist=98.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        self.assertEqual(scan.plan(zw, Z.DNA(has_opp=False, stop_buf=Z.stop_buffer(2.0, 'W1')))['stop'], 97.9)
        self.assertIsNone(scan.plan(zw, Z.DNA(has_opp=False, stop_buf=0.1))['target'])

    def test_trading_days(self):
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-10-26'), 1)   # Fri -> Mon
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-11-06'), 10)
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-10-01'), -1)


class AthCurveRuleTest(unittest.TestCase):
    """Owner rule: no MN supply above (Raja curve not measurable) + W1 / MN trend up -> the curve does not block."""

    def _an(self, w1_st, mn_st, raja=False, cv=92.0, mn_side=1):
        S = Z.Series([Bar('2026-01-0%d' % (i + 1), 100, 101, 99, 100) for i in range(3)])
        row = lambda tf, st, side: Z.Row(tf=tf, S=S, ok=True, st=st, side=side)
        w1, mn = row('W1', w1_st, 1), row('MN', mn_st, mn_side)
        curve = Z.Curve(ok=True, raja=raja, value=cv, pd=50 if raja else 0, ps=105 if raja else 0)
        D = Z.dir_combine(row('D1', Z.DST_TREND, 1), w1, mn, curve)
        return scan.Analysis(price=100.0, date='2026-01-03', d1=row('D1', Z.DST_TREND, 1), w1=w1, mn=mn, direction=D, curve=curve)

    def _rule(self, an, short, curve_zone=92.0):
        z = Z.Zone(tf='W1', dir=1, prox=99.0, dist=97.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        x = Z.DNA(code='STR', curve_zone=curve_zone, stop_buf=Z.stop_buffer(2.0, 'W1'), proj=150.0)
        return next(r for r in scan.zone_rules(an, z, x, None) if r.short == short)

    def test_ath_trend_up_passes(self):
        an = self._an(Z.DST_TREND, Z.DST_TREND)
        r = self._rule(an, 'curve')
        self.assertEqual(r.status, scan.WARN)
        self.assertIn('No MN supply overhead (ATH area)'.lower(), r.text.lower())
        self.assertIn('owner rule', r.text)
        self.assertEqual(self._rule(an, 'HTF align').status, scan.PASS)      # the fallback curve casts no sell vote
        self.assertEqual(self._an(Z.DST_CHG, Z.DST_TREND).direction.dir, 1)  # CHANGED UP counts as up

    def test_ath_mn_not_up_fails(self):
        for mn_st, side in ((Z.DST_TURN, 1), (Z.DST_PULL, 1), (Z.DST_RANGE, 0), (Z.DST_TREND, -1)):
            an = self._an(Z.DST_TREND, mn_st, mn_side=side)
            r = self._rule(an, 'curve')
            self.assertEqual(r.status, scan.FAIL, mn_st)
            self.assertIn('upper half, no buys', r.text)

    def test_measurable_curve_unchanged(self):
        an = self._an(Z.DST_TREND, Z.DST_TREND, raja=True, cv=80)
        self.assertEqual(self._rule(an, 'curve', 80).status, scan.FAIL)
        self.assertNotEqual(an.direction.dir, 1)
        self.assertEqual(self._rule(an, 'curve', 30).status, scan.WARN)
        self.assertEqual(self._rule(an, 'curve', 20).status, scan.PASS)

    def test_projection_target_and_room(self):
        z = Z.Zone(tf='W1', dir=1, prox=100.0, dist=98.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        x = Z.DNA(has_opp=False, stop_buf=Z.stop_buffer(2.0, 'W1'), proj=98.0 + 2.5 * (110.0 - 98.0))
        p = scan.plan(z, x)
        self.assertEqual((p['target'], p['target_kind'], p['next_supply']), (128.0, 'projection', None))
        self.assertAlmostEqual(p['rr'], round(28.0 / 2.1, 2))
        r = self._rule(self._an(Z.DST_TREND, Z.DST_TREND), 'room')
        self.assertIn('250% projection target', r.text)
        self.assertIn('(no supply above, L5)', r.text)
        # a supply above still wins over the projection
        x2 = Z.DNA(has_opp=True, opp=120.0, stop_buf=x.stop_buf, proj=128.0)
        self.assertEqual(scan.plan(z, x2)['target_kind'], 'supply')


class RulesTest(unittest.TestCase):
    def test_every_buy_passes_every_rule(self):
        res = selftest.run_fixture()
        buys = [s for s in res['signals'] if s['kind'] == 'BUY']
        self.assertTrue(buys)
        for s in buys:
            st = {r['status'] for r in s['rules']}
            self.assertNotIn('fail', st, s['symbol'])
            self.assertGreaterEqual(s['rr'], 2.0)
            self.assertLess(s['curve'], 50)
            self.assertIn(s['zone_type'], ('ARR', 'WOW', 'STR'))
            self.assertTrue(s['stop'] < s['distal'] < s['entry'] < s['target'])
            self.assertTrue(s['chart'].startswith('https://www.tradingview.com/chart/?symbol='))

    def test_watch_kinds(self):
        res = selftest.run_fixture()
        kinds = {s.get('watch') for s in res['signals'] if s['kind'] == 'WATCH'}
        self.assertIn('tested', kinds)                           # no synthetic seed gives a located 'new' zone
        self.assertLessEqual(kinds, {'new', 'tested'})
        for s in res['signals']:
            if s.get('watch') == 'tested':
                self.assertIn(s['touches'], (1, 2))
                fails = [r for r in s['rules'] if r['status'] == 'fail']
                self.assertTrue(all(r['ref'] in ('L2 · L52', 'Scanner') for r in fails))

    def test_earnings_rule_blocks(self):
        b, an = analysis_of(2259)
        ok = [s for s in scan.symbol_signals(an, None) if s['kind'] == 'BUY']
        self.assertTrue(ok)
        blocked = [s for s in scan.symbol_signals(an, '2026-10-28') if s['kind'] == 'BUY']
        self.assertFalse(blocked)                                # earnings in 3 trading days -> no BUY
        r = [x for x in scan.zone_rules(an, an.w1.zones[0], an.dna.get(an.w1.zones[0].zid) or Z.DNA(), None) if x.ref == 'Kevin L12']
        self.assertEqual(r[0].status, 'unknown')

    def test_rules_carry_references(self):
        b, an = analysis_of(2259)
        for s in scan.symbol_signals(an, None):
            self.assertGreaterEqual(len(s['rules']), 12)
            for r in s['rules']:
                self.assertIn(r['status'], ('pass', 'fail', 'warn', 'unknown'))
                self.assertTrue(r['ref'])

    def test_short_history_gives_wait(self):
        b = synth.zone_series()
        an = scan.analyse(b, DATA.closed_htf(b, 'W1'), DATA.closed_htf(b, 'MN'))
        self.assertEqual(an.direction.dir, 0)
        self.assertFalse([s for s in scan.symbol_signals(an) if s['kind'] == 'BUY'])


class ExitTest(unittest.TestCase):
    def test_stop_hit_by_close(self):
        b, an = analysis_of(3)
        ex = scan.holding_exits(an, {'symbol': 'X', 'entry': an.price * 1.05, 'stop': an.price * 1.01})
        self.assertIn('stop', [e['reason'] for e in ex])
        ex = scan.holding_exits(an, {'symbol': 'X', 'entry': an.price * 1.05, 'stop': an.price * 0.99})
        self.assertNotIn('stop', [e['reason'] for e in ex])

    def test_near_supply(self):
        b, an = analysis_of(3513)
        ex = scan.holding_exits(an, {'symbol': 'X', 'entry': an.price * 0.92, 'stop': an.price * 0.85})
        self.assertIn('near_supply', [e['reason'] for e in ex])

    def test_demand_broken_since_entry_date(self):
        bars = synth.zone_series()
        bars = bars + [Bar('2026-12-01', 103.2, 103.4, 98.6, 98.8)]
        an = scan.analyse(bars, bars, [])                       # the hand-made bars as W1 (no D1 zones)
        ex = scan.holding_exits(an, {'symbol': 'X', 'entry': 100.3, 'stop': 98.9, 'date': '2026-03-01'})
        self.assertEqual({e['reason'] for e in ex}, {'stop', 'demand_broken'})


class OutputTest(unittest.TestCase):
    def test_public_json_has_no_position_details(self):
        res = selftest.run_fixture()
        pub = scan.public_json(res, fixture=True)
        txt = json.dumps(pub)
        self.assertTrue(pub['exits'])
        for e in pub['exits']:
            self.assertEqual(set(e), {'symbol', 'sector', 'indexes', 'reasons'})
        held = selftest.holdings_fixture({fx['symbol']: synth.ticker(fx['seed'], selftest.END) for fx in selftest.FIXTURES})
        for h in held:
            self.assertNotIn(f'"entry": {h["entry"]}', txt)
            self.assertNotIn(f'"stop": {h["stop"]}', txt)
        self.assertNotIn('"warnings"', txt)
        self.assertEqual(pub['counts']['EXIT'], len(res['exits']))
        self.assertIn('not financial advice', pub['disclaimer'])

    def test_selftest_ok(self):
        import contextlib
        import io
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            self.assertEqual(selftest.main(), 0)
        out = buf.getvalue()
        self.assertIn('BUY <b>SYN', out)
        self.assertIn('Not financial advice', out)


if __name__ == '__main__':
    unittest.main()


class SearchOutputTest(unittest.TestCase):
    def setUp(self):
        import os
        import tempfile
        self.dir = tempfile.mkdtemp()
        self.res = selftest.run_fixture()
        scan.write_outputs(self.res, self.dir, fixture=True, history=False)
        with open(os.path.join(self.dir, 'index.json')) as f:
            self.idx = json.load(f)
        self.os = os

    def shard(self, k):
        with open(self.os.path.join(self.dir, 't', f'{k}.json')) as f:
            return json.load(f)['tickers']

    def test_every_universe_ticker_is_searchable(self):
        syms = {r['s'] for r in self.idx['tickers']}
        self.assertEqual(syms, {fx['symbol'] for fx in selftest.FIXTURES if not fx.get('feed')})   # TSX-only: uncovered
        self.assertEqual([u['symbol'] for u in self.res['uncovered']], ['SYI'])
        cad = next(r for r in self.idx['tickers'] if r['s'] == 'SYNE')
        self.assertEqual(cad['h'], 'TSX:SYE')
        self.assertEqual(self.shard(cad['k'])['SYNE']['country'], 'CA')
        self.assertIn('TSX:SYE', self.shard(cad['k'])['SYNE']['chart'])
        for r in self.idx['tickers']:
            self.assertEqual(r['k'], scan.shard_of(r['s']))
            d = self.shard(r['k'])[r['s']]
            self.assertEqual(d['symbol'], r['s'])
            self.assertEqual(len(d['bars']['b']), len(d['bars']['dt']))
            self.assertLessEqual(len(d['bars']['b']), scan.DETAIL_BARS)
            for z in d['zones']:
                self.assertIn(z['side'], ('demand', 'supply'))
                self.assertIn(z['type'], ('ARR', 'WOW', 'STR', 'OVL', 'FLP', 'TST', 'WK'))

    def test_detail_check_matches_the_signal(self):
        buys = {s['symbol'] for s in self.res['signals'] if s['kind'] == 'BUY'}
        for r in self.idx['tickers']:
            d = self.shard(r['k'])[r['s']]
            if r['s'] in buys:
                self.assertEqual(r['sig'], 'BUY')
                self.assertEqual(d['check']['kind'], 'BUY')
                self.assertGreaterEqual(len(d['check']['rules']), 12)
            if d['nearest_demand']:
                self.assertLess(d['nearest_demand']['distal'], d['price'])
            if d['nearest_supply']:
                self.assertGreater(d['nearest_supply']['distal'], d['price'])

    def test_no_holdings_in_details(self):
        txt = json.dumps(self.idx) + ''.join(open(self.os.path.join(self.dir, 't', n)).read() for n in self.os.listdir(self.os.path.join(self.dir, 't')))
        self.assertNotIn('"shares": 10', txt)
        self.assertNotIn('"warnings"', txt)

    def test_stale_shards_removed(self):
        open(self.os.path.join(self.dir, 't', '63x.json'), 'w').write('{}')
        scan.write_outputs(self.res, self.dir, fixture=True, history=False)
        self.assertNotIn('63x.json', self.os.listdir(self.os.path.join(self.dir, 't')))

    def test_shard_and_bars(self):
        self.assertEqual(scan.shard_of('AAPL'), scan.shard_of('AAPL'))
        self.assertTrue(all(0 <= scan.shard_of(s) < scan.SHARDS for s in ('A', 'BRK.B', 'ZZZZ')))
        b = synth.zone_series()
        p = scan.pack_bars(b, 10)
        self.assertEqual(p['t0'], b[-10].d)
        self.assertEqual(p['dt'][0], 0)
        self.assertEqual(p['b'][-1], [round(b[-1].o, 2), round(b[-1].h, 2), round(b[-1].l, 2), round(b[-1].c, 2)])
