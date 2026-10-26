"""Owner's top-down rule (zones.location): a W1 zone trades only inside a touched MN zone, an MN zone only inside a
touched 3M zone, 3M is the top (6M context above it only within reach); supply mirrored. 3M / 6M aggregation."""
import unittest

import helpers  # noqa: F401
import data as DATA
import scan
import selftest
import zones as Z
from zones import Bar


def zone(tf, d, prox, dist, made='2020-01-01', sa=50):
    return Z.Zone(tf=tf, dir=d, prox=prox, dist=dist, leg_bar=sa + 1, base_n=1, sa_bar=sa, leg_ratio=2, cont=False,
                  gap=1, leg2=False, base_start=made, made=made)


S0 = Z.Series([Bar('2026-01-0%d' % (i + 1), 100, 101, 99, 100) for i in range(3)])


def row(tf, zones, ok=True):
    return Z.Row(tf=tf, S=S0, ok=ok, zones=zones)


def loc(z, rows, price, touched=(), strong=lambda R, i: True):
    return Z.location(z, rows, price, strong, lambda R, o: o in touched)


class NestingTest(unittest.TestCase):
    def test_untouched_htf_demand_below_blocks(self):
        w = zone('W1', 1, 100, 98)
        mn = zone('MN', 1, 90, 85)
        lc = loc(w, {'W1': row('W1', [w], ok=False), 'MN': row('MN', [mn]), '3M': row('3M', [])}, 103)
        self.assertFalse(lc.ok)
        self.assertEqual(lc.code, 'below')
        self.assertIn('strong MN demand at 90.00–85.00 still below (-12.6%)', lc.text)
        self.assertIn('sells into it first', lc.text)
        self.assertIs(lc.pending, mn)

    def test_touched_and_nested_allowed_with_chain(self):
        w = zone('W1', 1, 100, 98)
        mn = zone('MN', 1, 99, 92)                       # W1 zone sits 1 above the MN proximal (< 25% of 7)
        q = zone('3M', 1, 95, 80)
        rows = {'W1': row('W1', [w], ok=False), 'MN': row('MN', [mn]), '3M': row('3M', [q]), '6M': row('6M', [], ok=False)}
        lc = loc(w, rows, 101, touched=(mn, q))
        self.assertTrue(lc.ok)
        self.assertEqual(lc.code, 'inside')
        self.assertEqual(lc.chain_text, '3M demand 95.00–80.00 touched ✓ → MN demand 99.00–92.00 touched ✓ → W1 entry 100.00–98.00')
        # the same MN zone not touched yet: wait
        lc2 = loc(w, rows, 101, touched=())
        self.assertEqual((lc2.ok, lc2.code), (False, 'untouched'))

    def test_too_far_above_the_htf_zone_is_not_nested(self):
        w = zone('W1', 1, 100, 98)
        mn = zone('MN', 1, 95, 87)                       # 98 > 95 + 0.25 x 8 = 97: not at the MN zone
        lc = loc(w, {'MN': row('MN', [mn]), '3M': row('3M', [])}, 103, touched=(mn,))
        self.assertNotEqual(lc.code, 'inside')
        self.assertFalse(lc.ok)

    def test_no_or_weak_htf_zone(self):
        w = zone('W1', 1, 100, 98)
        mn = zone('MN', 1, 99, 92)
        self.assertEqual(loc(w, {'MN': row('MN', [])}, 101).code, 'none')
        self.assertEqual(loc(w, {'MN': row('MN', [mn])}, 101, touched=(mn,), strong=lambda R, i: False).code, 'none')
        self.assertEqual(loc(w, {'MN': row('MN', [], ok=False)}, 101).code, 'unknown')

    def test_next_level_still_below_blocks(self):
        w = zone('W1', 1, 100, 98)
        mn = zone('MN', 1, 99, 92)
        q = zone('3M', 1, 70, 60)                        # strong untouched 3M demand far below the MN host
        lc = loc(w, {'MN': row('MN', [mn]), '3M': row('3M', [q]), '6M': row('6M', [], ok=False)}, 101, touched=(mn,))
        self.assertFalse(lc.ok)
        self.assertEqual(lc.code, 'below')
        self.assertIn('3M demand at 70.00–60.00 still below', lc.text)

    def test_supply_mirror(self):
        w = zone('W1', -1, 110, 112)
        mn = zone('MN', -1, 120, 125)
        rows = {'W1': row('W1', [w], ok=False), 'MN': row('MN', [mn]), '3M': row('3M', [])}
        lc = loc(w, rows, 108)
        self.assertEqual((lc.ok, lc.code), (False, 'above'))
        self.assertIn('strong MN supply at 120.00–125.00 still above', lc.text)
        self.assertIn('rallies into it first', lc.text)
        host = zone('MN', -1, 111, 116)
        rows['MN'] = row('MN', [host])
        ok = loc(w, rows, 109, touched=(host,))
        self.assertEqual((ok.ok, ok.code), (True, 'inside'))
        self.assertIn('MN supply 111.00–116.00 touched ✓ → W1 entry 110.00–112.00', ok.chain_text)

    def test_3m_top_and_6m_context(self):
        q = zone('3M', 1, 100, 90)
        self.assertEqual(loc(q, {'6M': row('6M', [], ok=False)}, 105).code, 'top')
        self.assertIn('short history', loc(q, {'6M': row('6M', [], ok=False)}, 105).text)
        near = zone('6M', 1, 85, 75)                     # strong untouched 6M demand within reach below
        lc = loc(q, {'6M': row('6M', [near])}, 105)
        self.assertEqual((lc.ok, lc.code), (False, 'below'))
        far = zone('6M', 1, 50, 40)                      # 52% below: out of reach, ignored
        self.assertEqual(loc(q, {'6M': row('6M', [far])}, 105).code, 'top')
        host = zone('6M', 1, 98, 80)
        self.assertEqual(loc(q, {'6M': row('6M', [host])}, 101, touched=(host,)).code, 'inside')


class VisitTouchTest(unittest.TestCase):
    def test_current_visit(self):
        mn = zone('MN', 1, 100, 95, made='2025-01-01', sa=30)
        S_h = Z.Series([Bar('2025-0%d-01' % m, 110, 112, 108, 110) for m in range(1, 10)], tf='MN')

        def d1(lows):
            return Z.Series([Bar('2026-01-%02d' % (i + 1), l + 1, l + 2, l, l + 1) for i, l in enumerate(lows)], tf='D1')
        self.assertTrue(Z.visit_touched(mn, d1([108, 104, 99.5, 102]), S_h))          # touched, still near
        self.assertFalse(Z.visit_touched(mn, d1([99, 120, 115, 105]), S_h))           # touched, left (> 2 heights), back
        self.assertFalse(Z.visit_touched(mn, d1([108, 104, 102]), S_h))
        sup = zone('MN', -1, 100, 105, made='2025-01-01', sa=30)
        self.assertTrue(Z.visit_touched(sup, d1([96, 98.5, 97]), S_h))                # a high (98.5 + 2) reached it


class PeriodBarsTest(unittest.TestCase):
    def test_quarters_and_halves(self):
        mn = [Bar(f'{y}-{m:02d}-01', m, m + 1, m - 1, m, 1) for y in (2016, 2017) for m in range(1, 13)][1:-1]
        q = Z.to_quarters(mn)
        self.assertEqual([b.d for b in q], ['2016-04-01', '2016-07-01', '2016-10-01', '2017-01-01', '2017-04-01', '2017-07-01'])
        self.assertEqual((q[0].o, q[0].h, q[0].l, q[0].c, q[0].v), (4, 7, 3, 6, 3))   # Apr-Jun
        h = Z.to_halves(mn)
        self.assertEqual([(b.d, b.o, b.h, b.l, b.c) for b in h], [('2016-07-01', 7, 13, 6, 12), ('2017-01-01', 1, 7, 0, 6)])

    def test_closed_htf_from_daily(self):
        import synth
        b = synth.ticker(3, selftest.END)                 # ends 2026-10-23: Q4 and H2 2026 are still forming
        q = DATA.closed_htf(b, '3M')
        self.assertEqual(q[-1].d[:7], '2026-07')
        self.assertEqual(DATA.closed_htf(b, '6M')[-1].d[:7], '2026-01')
        self.assertEqual(Z.period_key('3M', '2026-11-05'), (2026, 3))


class ScanIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.res = selftest.run_fixture()

    def test_signals_carry_location_and_no_d1(self):
        sigs = self.res['signals']
        self.assertTrue(sigs)
        for s in sigs:
            self.assertIn(s['tf'], ('W1', 'MN', '3M'))
            self.assertTrue(s['loc_ok'], s['symbol'])
            self.assertIn(s['loc'], ('inside', 'top'))
            self.assertTrue(s['chain_text'].endswith(f"{s['tf']} entry {s['proximal']:.2f}–{s['distal']:.2f}"))
            self.assertTrue(s['ctx6'].startswith('6M: '))
            loc_rule = s['rules'][0]
            self.assertEqual((loc_rule['short'], loc_rule['status']), ('location', 'pass'))
            if s['tf'] == 'W1':
                self.assertIn('MN demand', s['chain_text'])
                self.assertIn('touched ✓', s['chain_text'])

    def test_details_and_lists_carry_location(self):
        for d in self.res['details'].values():
            self.assertEqual(d['tfs'], ['W1', 'MN', '3M'])
            self.assertIn('text', d['ctx6'])
            for z in d['zones']:
                self.assertNotEqual(z['tf'], 'D1')
        zl = self.res['zone_lists']
        self.assertEqual(zl['tfs'], ['W1', 'MN', '3M'])
        rows = [r for side in ('demand', 'supply') for sec in ('in', 'left', 'near') for r in zl[side][sec]]
        self.assertTrue(any(r.get('loc') for r in rows))
        for r in self.res['index']:
            if 'ml' in r:
                self.assertEqual(len(r['ml']), 2)

    def test_blocked_reason_names_the_htf_area(self):
        reasons = {r['rule'] for r in self.res['blocked']['reasons']}
        self.assertTrue(reasons)
        for c in self.res['closest']:
            if c['rule'] == 'location':
                self.assertTrue(c['loc_text'])
                self.assertIn(c['loc'], ('below', 'above', 'untouched', 'none', 'unknown'))

    def test_telegram_shows_chain_and_tags(self):
        import notify
        msgs = notify.build_messages(self.res)
        txt = '\n'.join(msgs)
        self.assertIn('Location: ', txt)
        self.assertIn('Context: 6M', txt)
        self.assertIn('W1 / MN / 3M zones', txt)
        self.assertNotIn(' D1 ', txt.replace('200D', ''))


if __name__ == '__main__':
    unittest.main()
