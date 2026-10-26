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
        z = Z.Zone(tf='D1', dir=1, prox=100.0, dist=98.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        x = Z.DNA(has_opp=True, opp=120.0, has_opp_htf=True, opp_htf=130.0, stop_buf=Z.stop_buffer(2.0, 'D1'))
        p = scan.plan(z, x)
        self.assertEqual(p['entry'], 100.0)
        self.assertEqual(p['stop'], 97.8)                       # distal - 10% of the 2.0 height
        self.assertEqual(p['target'], round(120 * 0.995, 2))    # 0.5% before the NEAREST supply
        self.assertAlmostEqual(p['rr'], round((119.4 - 100) / 2.2, 2))
        zw = Z.Zone(tf='W1', dir=1, prox=100.0, dist=98.0, leg_bar=10, base_n=2, sa_bar=9, leg_ratio=3, cont=False, gap=1, leg2=False)
        self.assertEqual(scan.plan(zw, Z.DNA(has_opp=False, stop_buf=Z.stop_buffer(2.0, 'W1')))['stop'], 97.9)
        self.assertIsNone(scan.plan(zw, Z.DNA(has_opp=False, stop_buf=0.1))['target'])

    def test_trading_days(self):
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-10-26'), 1)   # Fri -> Mon
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-11-06'), 10)
        self.assertEqual(scan.trading_days_until('2026-10-23', '2026-10-01'), -1)


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
        self.assertEqual(kinds, {'new', 'tested'})
        for s in res['signals']:
            if s.get('watch') == 'tested':
                self.assertIn(s['touches'], (1, 2))
                fails = [r for r in s['rules'] if r['status'] == 'fail']
                self.assertTrue(all(r['ref'] in ('L2 · L52', 'Scanner') for r in fails))

    def test_earnings_rule_blocks(self):
        b, an = analysis_of(693)
        ok = [s for s in scan.symbol_signals(an, None) if s['kind'] == 'BUY']
        self.assertTrue(ok)
        blocked = [s for s in scan.symbol_signals(an, '2026-10-28') if s['kind'] == 'BUY']
        self.assertFalse(blocked)                                # earnings in 3 trading days -> no BUY
        r = [x for x in scan.zone_rules(an, an.d1.zones[0], an.dna.get(an.d1.zones[0].zid) or Z.DNA(), None) if x.ref == 'Kevin L12']
        self.assertEqual(r[0].status, 'unknown')

    def test_rules_carry_references(self):
        b, an = analysis_of(693)
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
        b, an = analysis_of(16)
        ex = scan.holding_exits(an, {'symbol': 'X', 'entry': an.price * 0.92, 'stop': an.price * 0.85})
        self.assertIn('near_supply', [e['reason'] for e in ex])

    def test_demand_broken_since_entry_date(self):
        bars = synth.zone_series()
        bars = bars + [Bar('2026-12-01', 103.2, 103.4, 98.6, 98.8)]
        an = scan.analyse(bars, [], [])
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
