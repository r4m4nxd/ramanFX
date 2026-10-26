"""Textbook W1-in-MN-in-3M BUY (must fire) and one negative per rule fixed in the stock-audit pass: forming-period
touches, departure < 2x, fresh-and-in-reach blockers, strict nesting, ATH rows + overhead supply, 3M curve on 6M,
6M room / veto for 3M, direction REDUCED / CHANGED, holdings (currency, L3 trail, trend change), IEX banner,
interlisted chart links. Hand-built rows: every value below is what the rules read, nothing random."""
import dataclasses
import datetime as dt
import unittest

import helpers  # noqa: F401
import scan
import synth
import zones as Z
from zones import Bar

S0 = Z.Series([Bar('2026-10-%02d' % (i + 19), 100, 101, 99, 100) for i in range(5)], tf='W1')


def zone(tf, d, prox, dist, made='2025-01-06', ratio=2.5):
    return Z.Zone(tf=tf, dir=d, prox=prox, dist=dist, leg_bar=51, base_n=2, sa_bar=50, leg_ratio=ratio, cont=False,
                  gap=1, leg2=False, base_start=made, made=made)


def row(tf, zones, ok=True, st=Z.DST_TREND, side=1):
    return Z.Row(tf=tf, S=S0, ok=ok, st=st, side=side, zones=zones)


def textbook(price=101.5, **kw):
    """3M demand 99-85 touched -> MN demand 100.5-92 touched -> W1 ARR demand 100-97 (fresh, 2.5x departure), next
    W1 supply 120 (R:R ~6), Raja curve 20% on 3M, W1 / MN / 3M trending up, 6M n/a. kw overrides pieces."""
    w1z = kw.get('w1z') or zone('W1', 1, 100.0, 97.0, made='2026-09-28', ratio=kw.get('ratio', 2.5))
    sup = zone('W1', -1, 120.0, 123.0, made='2026-03-02')
    mnz = kw.get('mnz') or zone('MN', 1, 100.5, 92.0, made='2025-06-02')
    q3z = kw['q3z'] if 'q3z' in kw else zone('3M', 1, 99.0, 85.0, made='2023-04-03')
    w1 = row('W1', [w1z, sup] + kw.get('w1_more', []), st=kw.get('w1_st', Z.DST_TREND), side=kw.get('w1_side', 1))
    mn = row('MN', [mnz] + kw.get('mn_more', []))
    q3 = row('3M', ([q3z] if q3z is not None else []) + kw.get('q3_more', []))
    h6 = kw.get('h6') or row('6M', [], ok=False)
    d1 = Z.Row(tf='D1', S=Z.Series([Bar('2026-10-%02d' % (i + 19), price, price + 0.5, price - 0.5, price) for i in range(5)]))
    cv = kw.get('curve') or Z.Curve(ok=True, raja=True, value=20.0, pd=90, ps=140, tf='3M')
    D = kw.get('direction') or Z.Direction(side=1, q=2, dir=1)
    an = scan.Analysis(price=price, date='2026-10-23', d1=d1, w1=w1, mn=mn, direction=D, curve=cv, q3=q3, h6=h6,
                       dirs={'W1': D, 'MN': D, '3M': D}, crow=q3, d1_dates=[f'2026-10-{d}' for d in (19, 20, 21, 22, 23)],
                       curves={'W1': cv, 'MN': cv, '3M': cv}, crows={'W1': q3, 'MN': q3, '3M': None})
    an.memo[('ath',)] = {'W1': False, 'MN': False, '3M': False}
    an.dna[w1z.zid] = kw.get('x') or Z.DNA(code='ARR', n_tests=0, curve_zone=20.0, has_opp=True, opp=120.0, opp_dist=123.0,
                                            stop_buf=Z.stop_buffer(3.0, 'W1'), cp_run=1, rm_opp_move=1, strong=True, arrival=True)
    for o in [mnz, q3z] + kw.get('mn_more', []) + kw.get('q3_more', []):
        if o is None:
            continue
        an.dna[o.zid] = Z.DNA(code='STR', n_tests=kw.get('host_tests', {}).get(o.zid, 1), strong=True, stop_buf=0.1)
        an.memo[('touch', o.zid)] = kw.get('touched', {}).get(o.zid, o in (mnz, q3z))
    return an, w1z


def w1_buy(an):
    return [s for s in scan.symbol_signals(an) if s['kind'] == 'BUY' and s['tf'] == 'W1']


def rule(an, z, short):
    return next(r for r in scan.zone_rules(an, z, an.dna[z.zid], None) if r.short == short)


class TextbookBuyTest(unittest.TestCase):
    def test_w1_in_mn_in_3m_buy_fires(self):
        an, z = textbook()
        b = w1_buy(an)
        self.assertEqual(len(b), 1, [r.text for r in scan.zone_rules(an, z, an.dna[z.zid], None) if r.status == 'fail'])
        s = b[0]
        self.assertEqual((s['loc'], s['entry'], s['stop'], s['target']), ('inside', 100.0, 96.85, 119.4))
        self.assertEqual(s['chain_text'], '3M demand 99.00–85.00 touched ✓ → MN demand 100.50–92.00 touched ✓ → W1 entry 100.00–97.00')
        self.assertGreaterEqual(s['rr'], 3)
        self.assertNotIn('fail', {r['status'] for r in s['rules']})


class FormingTouchTest(unittest.TestCase):
    """P0: a D1 session of the forming week / month / quarter that reached the proximal is a touch (limit filled)."""

    def _setup(self, forming_low):
        rows = synth.zone_series()
        mon = dt.date(2025, 1, 6)
        wk = [Bar((mon + dt.timedelta(weeks=i)).isoformat(), b.o, b.h, b.l, b.c) for i, b in enumerate(rows)]
        last = dt.date.fromisoformat(wk[-1].d)
        d1 = [Bar((last + dt.timedelta(days=7 + k)).isoformat(), 103.5, 104, lo, 103.4) for k, lo in enumerate((forming_low, 103.0))]
        px = d1[-1].c
        S = Z.Series(wk, px, 'W1')
        r = Z.Row(tf='W1', S=S, ok=True, zones=Z.detect(S), tl=Z.trendlines(S))
        i = max((k for k, z in enumerate(r.zones) if z.dir > 0 and not z.removed), key=lambda k: r.zones[k].leg_ratio)
        self.assertEqual((round(r.zones[i].prox, 2), r.zones[i].tested), (100.3, False))
        an = scan.Analysis(price=px, date=d1[-1].d, d1=Z.Row(tf='D1', S=Z.Series(d1, px, 'D1')), w1=r, mn=row('MN', [], ok=False),
                           direction=Z.Direction(), curve=Z.Curve())
        return an, r, i

    def test_forming_week_touch_counts(self):
        an, r, i = self._setup(100.1)                       # Monday of the forming week dips to the proximal 100.3
        x = scan.zone_dna(an, r, i, [])
        self.assertEqual(x.n_tests, 1)
        self.assertTrue(getattr(x, 'forming_touch', False))
        self.assertFalse(r.zones[i].removed)                # a touch, never a removal

    def test_no_forming_touch_stays_fresh(self):
        an, r, i = self._setup(101.5)
        self.assertEqual(scan.zone_dna(an, r, i, []).n_tests, 0)

    def test_fresh_rule_fails_after_a_forming_touch(self):
        an, z = textbook(x=Z.DNA(code='ARR', n_tests=1, curve_zone=20.0, has_opp=True, opp=120.0, stop_buf=0.15, cp_run=1))
        self.assertEqual(rule(an, z, 'fresh').status, scan.FAIL)
        self.assertFalse(w1_buy(an))


class DepartureTest(unittest.TestCase):
    def test_under_2x_fails(self):
        an, z = textbook(ratio=1.6)
        r = rule(an, z, 'leg')
        self.assertEqual((r.status, r.ref), (scan.FAIL, 'L55'))
        self.assertFalse(w1_buy(an))
        self.assertEqual(rule(textbook(ratio=2.0)[0], textbook(ratio=2.0)[1], 'leg').status, scan.PASS)


class BlockerTest(unittest.TestCase):
    """P1: only a FRESH strong HTF zone within 25% of price is 'an area left to be sold first'; a tested one is
    context. Case: W1 inside a touched MN demand that has no 3M host, a strong 3M demand 88-84 (-13%) below."""

    def _an(self, prox, tests):
        far = zone('3M', 1, prox, prox - 4, made='2022-01-03')
        return textbook(q3z=None, q3_more=[far], host_tests={far.zid: tests}, touched={far.zid: False})

    def test_tested_htf_zone_below_is_context(self):
        an, z = self._an(88.0, 2)
        self.assertTrue(w1_buy(an))
        self.assertIn('no strong 3M demand within reach', scan.loc_of(an, an.mn.zones[0]).text)

    def test_fresh_htf_zone_in_reach_blocks(self):
        an, z = self._an(88.0, 0)
        lc = scan.loc_of(an, z)
        self.assertEqual((lc.ok, lc.code), (False, 'below'))
        self.assertIn('3M demand at 88.00–84.00 still below', lc.text)
        self.assertFalse(w1_buy(an))

    def test_fresh_htf_zone_beyond_reach_is_ignored(self):
        an, z = self._an(74.0, 0)                                   # -27%: beyond the 25% reach
        self.assertTrue(w1_buy(an))


class NestingTest(unittest.TestCase):
    """P1: a W1 zone inside an MN zone needs that MN zone located exactly like a direct MN entry: its 3M area
    touched, or no strong 3M demand in reach. Short 3M history = cannot locate = no trade."""

    def test_mn_host_with_an_untouched_3m_area_blocks(self):
        q = zone('3M', 1, 99.0, 85.0, made='2023-04-03')
        an, z = textbook(q3z=q, touched={q.zid: False})
        lc = scan.loc_of(an, z)
        self.assertEqual((lc.ok, lc.code), (False, 'untouched'))
        self.assertFalse(w1_buy(an))
        self.assertEqual(scan.loc_of(an, an.mn.zones[0]).code, 'untouched')     # the same verdict as the MN directly

    def test_no_3m_history_blocks_w1_and_mn(self):
        an, z = textbook()
        an.q3 = row('3M', [], ok=False)
        an.memo = {k: v for k, v in an.memo.items() if k[0] != 'loc'}
        self.assertEqual(scan.loc_of(an, z).code, 'unknown')
        self.assertFalse(w1_buy(an))

    def test_mn_host_without_3m_zone_in_reach_is_located(self):
        an, z = textbook(q3z=None)
        self.assertTrue(scan.loc_of(an, an.mn.zones[0]).ok)
        self.assertTrue(w1_buy(an))


class AthTest(unittest.TestCase):
    def _rows(self, w1_st=Z.DST_TREND, mn_st=Z.DST_TREND, q3_side=-1, sup=None):
        S = S0
        r = lambda tf, st, side, zs=(): Z.Row(tf=tf, S=S, ok=True, st=st, side=side, zones=list(zs))
        return (r('W1', w1_st, 1), r('MN', mn_st, 1, [sup] if sup else []), r('3M', Z.DST_TREND, q3_side), r('6M', Z.DST_RANGE, 0))

    def test_w1_entry_reads_w1_and_mn(self):
        cv = Z.Curve(ok=True, raja=False, value=90, tf='3M')
        w1, mn, q3, h6 = self._rows(q3_side=-1)                    # 3M down does not matter for a W1 entry
        self.assertTrue(scan.ath_ok(w1, mn, q3, h6, cv, 'W1', 100.0))
        w1, mn, q3, h6 = self._rows(w1_st=Z.DST_TURN)               # W1 only turning: not up
        self.assertFalse(scan.ath_ok(w1, mn, q3, h6, cv, 'W1', 100.0))
        w1, mn, q3, h6 = self._rows()
        self.assertFalse(scan.ath_ok(w1, mn, q3, h6, cv, 'MN', 100.0))   # MN entry needs 3M up too

    def test_strong_fresh_supply_overhead_in_reach_denies(self):
        cv = Z.Curve(ok=True, raja=False, value=90, tf='3M')
        old = zone('MN', 1, 96.0, 93.0, made='2023-01-02')         # a demand the supply's drop removed
        old.removed, old.removed_bar = True, 40                     # removed in the supply's run-out -> strong
        sup = Z.Zone(tf='MN', dir=-1, prox=112.0, dist=116.0, leg_bar=45, base_n=1, sa_bar=44, leg_ratio=3, cont=False,
                     gap=1, leg2=False, tested=False, base_start='2024-01-01', made='2024-02-01')
        w1, mn, q3, h6 = self._rows()
        mn.zones = [old, sup]
        self.assertTrue(Z.raja_strong_row(mn.zones, sup))
        self.assertFalse(scan.ath_ok(w1, mn, q3, h6, cv, 'W1', 100.0))  # +12%: in reach, not an ATH area
        self.assertTrue(scan.ath_ok(w1, mn, q3, h6, cv, 'W1', 80.0))    # +40% above: out of reach


class CurveMappingTest(unittest.TestCase):
    def test_3m_never_measured_on_3m_and_mn_on_6m(self):
        b = synth.ticker(7496)
        import data as DATA
        an = scan.analyse(b, DATA.closed_htf(b, 'W1'), DATA.closed_htf(b, 'MN'))
        self.assertIn(an.curves['W1'].tf, ('3M', 'MN'))
        self.assertEqual(an.curves['MN'].tf, '6M' if an.h6.ok else '3M')
        self.assertNotEqual(an.curves['3M'].tf, '3M')
        self.assertEqual(an.curves['3M'].ok, an.h6.ok)

    def test_3m_curve_unknown_fails(self):
        q = zone('3M', 1, 100.0, 97.0, made='2026-04-01')
        an, _ = textbook()
        an.curves['3M'] = Z.Curve()
        an.dna[q.zid] = Z.DNA(code='ARR', curve_zone=50.0, has_opp=True, opp=150, stop_buf=0.1, cp_run=1)
        self.assertEqual(next(r for r in scan.zone_rules(an, q, an.dna[q.zid], None) if r.short == 'curve').status, scan.FAIL)


class SixMonthRoomTest(unittest.TestCase):
    def test_3m_gets_6m_room_and_veto(self):
        sup6 = zone('6M', -1, 110.0, 118.0, made='2022-01-03')
        far6 = zone('6M', -1, 170.0, 180.0, made='2021-01-04')
        an, _ = textbook(h6=row('6M', [sup6, far6]))
        st = {r.tf: [h.tf for h in hs] for r, hs in scan.stack(an)}
        self.assertEqual(st['3M'], ['6M'])
        self.assertEqual(st['W1'], ['MN', '3M', '6M'])
        self.assertEqual(scan.htf_opp(an, an.q3), [sup6])          # the 6M veto only within reach (30%)


class DirectionRuleTest(unittest.TestCase):
    def test_reduced_is_a_warning_and_entry_changed_down_fails(self):
        an, z = textbook(direction=Z.Direction(side=1, q=1, dir=1))
        self.assertEqual(rule(an, z, 'HTF align').status, scan.WARN)
        an, z = textbook(w1_st=Z.DST_CHG, w1_side=-1)
        self.assertEqual(rule(an, z, 'HTF align').status, scan.FAIL)
        self.assertFalse(w1_buy(an))


class HoldingsTest(unittest.TestCase):
    def test_tsx_holding_needs_explicit_currency(self):
        an, _ = textbook(price=90.0)
        u = {'home': 'TSX:XYZ'}
        ex = scan.holding_exits(an, {'symbol': 'XYZ', 'entry': 120, 'stop': 110}, u)   # CAD-looking levels, no currency
        reasons = [w['reason'] for w in ex]
        self.assertIn('currency', reasons)
        self.assertNotIn('stop', reasons)                          # never compared raw
        ex = scan.holding_exits(an, {'symbol': 'XYZ', 'entry': 95, 'stop': 92, 'currency': 'USD'}, u)
        self.assertIn('stop', [w['reason'] for w in ex])
        ex = scan.holding_exits(an, {'symbol': 'XYZ', 'entry': 130, 'stop': 125, 'currency': 'CAD'}, u)
        self.assertEqual([w['reason'] for w in ex if w['reason'] in ('stop', 'currency')], ['currency'])
        ex = scan.holding_exits(an, {'symbol': 'AAA', 'entry': 95, 'stop': 92}, {})   # US symbol: USD by default
        self.assertIn('stop', [w['reason'] for w in ex])

    def test_trail_and_trend_change(self):
        an, z = textbook(price=108.0)                              # W1 demand 100-97 made 2026-09-28, price above
        ex = scan.holding_exits(an, {'symbol': 'AAA', 'entry': 90, 'stop': 85, 'date': '2026-06-01'})
        tr = [w for w in ex if w['reason'] == 'trail']
        self.assertEqual(len(tr), 1)
        self.assertAlmostEqual(tr[0]['stop'], 96.85)
        an.w1.st, an.w1.side = Z.DST_CHG, -1
        self.assertIn('trend_change', [w['reason'] for w in scan.holding_exits(an, {'symbol': 'AAA', 'entry': 90, 'stop': 85})])

    def test_trail_demand_broken(self):
        a = zone('W1', 1, 100.0, 97.0, made='2026-07-06')
        b = zone('W1', 1, 104.0, 102.0, made='2026-08-03')
        for k, zz in enumerate((a, b)):
            zz.removed, zz.removed_bar = True, 1 + k
        an, _ = textbook(price=95.0, w1_more=[a, b])
        ex = scan.holding_exits(an, {'symbol': 'AAA', 'entry': 90, 'stop': 85, 'date': '2026-06-01'})
        tb = [w for w in ex if w['reason'] == 'trail_broken']
        self.assertTrue(tb)
        self.assertIn('close the position', tb[0]['text'])


class DataBannerTest(unittest.TestCase):
    def test_iex_feed_sets_the_banner(self):
        bars = synth.ticker(7496)

        def get_bars(s):
            if s != 'SYNA':
                raise KeyError(s)
            return bars, {'exchange': 'NYQ', 'feed': 'iex'}
        res = scan.run([{'symbol': 'SYNA', 'name': 'A', 'sector': '', 'cik': '', 'indexes': 'SPX'}], get_bars,
                       lambda c: None, lambda s: None, [], log=None)
        pub = scan.public_json(res)
        self.assertTrue(pub['feed_iex'])
        self.assertIn('IEX', pub['data_warning'])
        self.assertEqual((pub['adjustment'], pub['history_from']), ('split', '2016'))


if __name__ == '__main__':
    unittest.main()
