"""Positive and negative rule tests on the hand-built textbook chain (fixtures/textbook_fx.py) + the data fixes of the
2026-10 audits (forming-bar touches, inverted pairs, false cancels, churn, bid bars, alignment, DST, USDX)."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import fxscan as X  # noqa: E402
import oanda as O  # noqa: E402
import textbook_fx as T  # noqa: E402
import watchlist as W  # noqa: E402
import zones as Z  # noqa: E402
from zones import Bar  # noqa: E402

PIP = 0.0001
SPREAD = 0.6 * PIP


def inst(name='EUR_USD', **kw):
    return {'name': name, 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5, 'cls': 'major', **kw}


def analyse(bars=None, side=1, i=None):
    return F.analyse(i or inst(), bars or T.textbook(side), SPREAD)


def entry_zone(an, side=1, tf='H4'):
    return next(z for z in an.rows[tf].zones if z.dir == side and z.zid in an.dna)


def rule(an, z, short):
    return next((r for r in F.zone_rules(an, z, an.dna[z.zid]) if r.short == short), None)


def kinds(an, tf='H4'):
    return [(s['kind'], s.get('watch_kind')) for s in F.signals(an) if s['tf'] == tf]


def redo_dna(an, z):
    """Recompute a zone's DNA after a test changed the rows."""
    an.dna.pop(z.zid, None)
    an.memo.clear()
    r = an.rows[z.tf]
    an.dna[z.zid] = F.dna_of(an, r, r.zones.index(z))


def trend_rows(a, b, n):
    out, p, st = [], a, (b - a) / n
    for _ in range(n):
        c = p + st
        w = 0.1 * abs(st)
        out.append((p, max(p, c) + w, min(p, c) - w, c))
        p = c
    return out


class Textbook(unittest.TestCase):
    """The owner's textbook H4 setup: MN -> W1 -> D1 demand all touched, H4 arrival zone fresh -> BUY (mirror SELL)."""

    def check(self, side):
        an = analyse(side=side)
        sig = [s for s in F.signals(an) if s['kind'] in ('BUY', 'SELL')]
        self.assertEqual(len(sig), 1, [(s['kind'], s['tf']) for s in F.signals(an)])
        s = sig[0]
        self.assertEqual((s['kind'], s['tf'], s['zone_type']), ('BUY' if side > 0 else 'SELL', 'H4', 'ARR'))
        self.assertTrue(all(r['status'] != 'fail' for r in s['rules']))
        self.assertEqual(s['direction'], 'LONG - FULL' if side > 0 else 'SHORT - FULL')
        word = 'demand' if side > 0 else 'supply'
        self.assertEqual([c['tf'] for c in s['chain']], ['MN', 'W1', 'D1', 'H4'])
        self.assertTrue(all(c['touched'] for c in s['chain'][:-1]))
        self.assertIn(f'MN {word}', s['chain_text'])
        self.assertGreaterEqual(s['rr'], 2)
        self.assertEqual(s['touches'], 0)
        # spread on the ask side: buy limit = proximal + spread; sell stop = distal + buffer + spread
        if side > 0:
            self.assertAlmostEqual(s['entry'], s['proximal'] + SPREAD, places=5)
        else:
            self.assertAlmostEqual(s['entry'], s['proximal'], places=5)
            self.assertAlmostEqual(s['stop'], s['distal'] + max(0.15 * abs(s['proximal'] - s['distal']), 3 * PIP) + SPREAD, places=5)
        # the W1 / MN zones of the chain are areas (WATCH), never a limit order
        self.assertTrue(all(x['kind'] == 'WATCH' for x in F.signals(an) if x['tf'] in ('W1', 'MN')))

    def test_buy(self):
        self.check(1)

    def test_sell_mirror(self):
        self.check(-1)


class ChainAndTouches(unittest.TestCase):
    def test_strict_chain_gap_blocks(self):
        """P0: a D1 host with no W1 zone above it ends the chain -> blocked (it used to pass with a 1-level chain)."""
        b = T.textbook()
        n = len(b['W1'])
        b['W1'] = T.to_bars('W1', trend_rows(1.40, 1.215, n))           # a W1 history without any zone
        an = analyse(b)
        self.assertEqual(an.rows['W1'].zones, [])
        z = entry_zone(an)
        lc = F.loc_of(an, z)
        self.assertFalse(lc.ok)
        self.assertEqual(lc.code, 'none')
        self.assertNotIn('BUY', [k for k, _ in kinds(an)])
        loose = Z.location(z, an.rows, an.price, lambda R, i: F.host_ok(an, R, i), lambda R, o: F.touched_now(an, R, o),
                           p=an.p, htf_of=C.HTF_OF, soft_tfs=C.CONTEXT_TFS, reach_pct=C.SOFT_REACH_PCT, nd=5)
        self.assertTrue(loose.ok)                                          # stock default (strict_chain=False) unchanged

    def test_forming_bar_touch_is_a_test(self):
        """P0: H4 bars of today reached the D1 proximal; the D1 zone is no longer fresh (closed D1 bars do not show it)."""
        b = T.textbook()
        h4 = b['H4']
        last3 = [(1.2110, 1.2115, 1.2105, 1.2108), (1.2108, 1.2112, 1.2095, 1.2110), (1.2110, 1.2118, 1.2106, 1.2112)]
        b['H4'] = h4[:-3] + [Bar(x.d, *v) for x, v in zip(h4[-3:], last3)]
        an = analyse(b)
        z = entry_zone(an, tf='D1')
        x = an.dna[z.zid]
        self.assertGreater(an.price, z.prox)                              # price outside the D1 zone now
        self.assertEqual(x.n_tests, 0)                                    # what zones.dna sees on the closed D1 bars
        self.assertTrue(F.forming_touched(an, z))
        self.assertEqual(F.tests(an, z, x), 1)
        r = rule(an, z, 'fresh')
        self.assertEqual(r.status, F.FAIL)
        self.assertIn("this day's H4 bars", r.text)

    def test_price_inside_zone_is_not_near_entry(self):
        an = analyse()
        z = entry_zone(an, tf='D1')                                       # price sits inside the D1 zone
        self.assertEqual(rule(an, z, 'near entry').status, F.FAIL)

    def test_host_with_two_earlier_visits_breaks(self):
        """P0: a D1 host visited twice before (this is the 3rd visit) no longer hosts an H4 entry (it used to: <= 3)."""
        px, ds, warm, ef = T.LEVELS['D1']
        h, u = px - ds, px - ds
        rows = T.shape(px, ds, warm, ef)
        last = rows[-1][3]
        for _ in range(2):
            rows += trend_rows(last, px - 0.2 * h, 2) + trend_rows(px - 0.2 * h, px + 3 * u, 3)
            last = px + 3 * u
        rows += trend_rows(last, px + ef * h, 3)
        b = T.textbook()
        b['D1'] = T.to_bars('D1', rows)
        an = analyse(b)
        R = an.rows['D1']
        k, host = next((k, o) for k, o in enumerate(R.zones) if o.dir > 0 and not o.removed and abs(o.prox - px) < 1e-9)
        x = F.dna_of(an, R, k)
        self.assertEqual(x.n_tests, 2)
        self.assertEqual(F.prior_visits(an, R, host, x), 2)
        self.assertFalse(F.host_ok(an, R, k))
        z = entry_zone(an)
        self.assertFalse(F.loc_of(an, z).ok)
        self.assertNotIn('BUY', [kd for kd, _ in kinds(an)])


class Opposite(unittest.TestCase):
    def supply(self, tf, prox, dist, tested=True):
        an_tf = {'D1': '2026-10-13T00:00', 'MN': '2026-08-01T00:00'}[tf]
        return Z.Zone(tf=tf, dir=-1, prox=prox, dist=dist, leg_bar=5, base_n=1, sa_bar=4, leg_ratio=2.5, cont=False,
                      gap=0.1, leg2=False, tested=tested, tested_bar=3 if tested else -1, base_start=an_tf, made=an_tf)

    def test_tested_htf_supply_overhead_cuts_the_room(self):
        """P1: the target is the NEAREST not-removed opposite zone of any TF, tested ones included, 7 pips before it."""
        an = analyse()
        z = entry_zone(an)
        an.rows['D1'].zones.append(self.supply('D1', 1.2115, 1.2125))
        redo_dna(an, z)
        pl = F.plan(an, z, an.dna[z.zid])
        self.assertEqual(pl['target_kind'], 'zone')
        self.assertAlmostEqual(pl['next_zone'], 1.2115, places=5)
        self.assertAlmostEqual(pl['target'], round(1.2115 - 7 * PIP, 5), places=5)
        self.assertLess(pl['rr'], 2)
        self.assertEqual(rule(an, z, 'room').status, F.FAIL)
        self.assertNotIn('BUY', [k for k, _ in kinds(an)])

    def test_mn_supply_next_to_the_zone_vetoes(self):
        """P1: the opposite-zone veto looks at every higher TF (an MN supply, not only the D1 one level up)."""
        an = analyse()
        z = entry_zone(an)
        an.rows['MN'].zones.append(self.supply('MN', 1.2088, 1.2300))
        redo_dna(an, z)
        self.assertTrue(an.dna[z.zid].next_opp_htf)
        r = rule(an, z, 'HTF opposite')
        self.assertEqual(r.status, F.FAIL)
        self.assertNotIn('BUY', [k for k, _ in kinds(an)])

    def test_plus1_row_reduces(self):
        """P1: Raja's +1 row (MN for an H4 entry): an MN trend against the side makes the direction REDUCED."""
        S = Series = Z.Series([Bar('2026-01-01T00:00', 1, 1, 1, 1)] * 3, 1.0, 'MN')
        e = Z.Row(tf='H4', S=S, ok=True, st=Z.DST_TREND, side=1)
        i = Z.Row(tf='D1', S=S, ok=True, st=Z.DST_TREND, side=1)
        h = Z.Row(tf='W1', S=S, ok=True, st=Z.DST_TREND, side=1)
        mn = Z.Row(tf='MN', S=Series, ok=True, st=Z.DST_TREND, side=-1)
        cv = Z.Curve(ok=True, value=10.0)
        self.assertEqual(Z.dir_combine(e, i, h, cv).q, 2)               # the old call (stock scanner) is unchanged
        D = Z.dir_combine(e, i, h, cv, p1=mn)
        self.assertEqual((D.dir, D.q), (1, 1))
        mn.st, mn.side, mn.in_z = Z.DST_RANGE, 0, -1                       # price inside a fresh MN supply: locks short
        self.assertEqual(Z.dir_combine(e, i, h, Z.Curve(), p1=mn).lock, -1)

    def test_reduced_direction_is_watch_only(self):
        an = analyse()
        z = entry_zone(an)
        an.dirs['H4'].q = 1
        self.assertEqual(rule(an, z, 'reduced').status, F.FAIL)
        self.assertEqual(kinds(an), [('WATCH', 'confirm')])


class ZoneQuality(unittest.TestCase):
    def test_departure_under_2x_is_watch_only(self):
        an = analyse(T.textbook(dep_x={'H4': 1.6}))
        z = entry_zone(an)
        self.assertLess(z.leg_ratio, 2.0)
        self.assertEqual(rule(an, z, 'leg').status, F.FAIL)
        self.assertNotIn('BUY', [k for k, _ in kinds(an)])

    def test_plain_strong_zone_needs_confirmation(self):
        """P1: limit orders only at an arrival, a real WOW or a zone right at its trendline (Raja L104)."""
        an = analyse()
        z = entry_zone(an)
        an.dna[z.zid].code = 'STR'
        self.assertEqual(rule(an, z, 'blind').status, F.FAIL)
        self.assertEqual(kinds(an), [('WATCH', 'confirm')])

    def line(self, an, level, touches):
        t = Z.TLine(dir=1, a=60, b=20, pa=level, pb=level, removed=False, removed_bar=-1, conf=True)
        an.rows['H4'].tl.up, an.rows['H4'].tl.up_touches = t, touches

    def test_trendline_4th_touch_and_far_zone(self):
        an = analyse()
        z = entry_zone(an)
        self.line(an, z.lo - 5 * PIP, 1)
        self.assertEqual(rule(an, z, 'trendline').status, F.PASS)        # 5 pips above a fresh line: the best zone
        self.line(an, z.lo - 5 * PIP, 3)
        self.assertEqual(rule(an, z, 'trendline').status, F.FAIL)        # 3 touches: the next is the 4th
        self.line(an, z.lo - 40 * PIP, 1)
        r = rule(an, z, 'trendline')
        self.assertEqual(r.status, F.FAIL)                               # > 25 pips from the line
        self.assertIn('40 pips', r.text)

    def test_out_of_trendline(self):
        an = analyse()
        z = entry_zone(an)
        L = z.leg_bar
        an.rows['H4'].tl.lines.append(Z.TLine(dir=1, a=L + 10, b=L + 3, pa=1.2000, pb=1.2050, removed=True, removed_bar=L - 2,
                                              conf=True, cross_bar=L - 2))
        self.assertEqual(rule(an, z, 'out of TL').status, F.FAIL)
        self.assertNotIn('BUY', [k for k, _ in kinds(an)])


class Markets(unittest.TestCase):
    def test_index_and_try_not_on_h4(self):
        for i in (inst('US30_USD', type='CFD', cls='cfd'), inst('USD_TRY', cls='exotic')):
            an = analyse(i=i)
            self.assertEqual(rule(an, entry_zone(an), 'market TF').status, F.FAIL, i['name'])
            self.assertNotIn('BUY', [k for k, _ in kinds(an)])

    def test_context_only_instruments(self):
        for name in ('USDX', 'BCO_USD', 'CORN_USD'):
            an = analyse(i=inst(name, cls='cfd', type='CFD'))
            self.assertFalse([s for s in F.signals(an) if s['kind'] in ('BUY', 'SELL')], name)

    def test_weekend(self):
        an = analyse(T.textbook(end='2026-10-23T12:00'))                 # Friday 12:00-16:00 bar
        self.assertEqual(rule(an, entry_zone(an), 'weekend').status, F.FAIL)
        self.assertEqual(kinds(an), [('WATCH', 'confirm')])

    def test_metal_pips_like_mt5(self):
        self.assertEqual(C.pip_of({'name': 'XAU_USD', 'pipLocation': -2}), 0.1)
        self.assertEqual(C.pip_of({'name': 'XAU_AUD', 'pipLocation': -2}), 0.1)
        self.assertEqual(C.pip_of({'name': 'XAG_USD', 'pipLocation': -4}), 0.01)
        self.assertEqual(C.pip_of({'name': 'XAU_JPY', 'pipLocation': 1}), 10.0)
        self.assertEqual(C.pip_of({'name': 'USD_JPY', 'pipLocation': -2}), 0.01)
        gold = {'name': 'XAU_USD', 'type': 'METAL', 'pipLocation': -2, 'displayPrecision': 3}
        self.assertAlmostEqual(F.params(gold)['sl_min'], 0.3)                # 3 pips = $0.30 (was $0.03)
        self.assertAlmostEqual(C.TP_OFFSET_PIPS * C.pip_of(gold), 0.7)       # ZoneVision: $0.70


class Mapping(unittest.TestCase):
    def test_inverse_pair_never_used(self):
        self.assertIsNone(W.map_symbol('PEPPERSTONE:CHFSGD', {'SGD_CHF', 'EUR_USD'}))
        self.assertEqual(W.map_symbol('PEPPERSTONE:CHFSGD', {'CHF_SGD'}), 'CHF_SGD')
        old = os.environ.get('FX_WATCHLIST')
        os.environ['FX_WATCHLIST'] = '###X,PEPPERSTONE:CHFSGD,PEPPERSTONE:JPN225,PEPPERSTONE:CHINAH'
        try:
            w = W.load({'SGD_CHF', 'JP225Y_JPY', 'JP225_USD', 'CHINAH_HKD'})
        finally:
            os.environ.pop('FX_WATCHLIST') if old is None else os.environ.__setitem__('FX_WATCHLIST', old)
        self.assertIn('inverse', w['unmapped'][0]['note'])
        self.assertEqual(w['names'], ['JP225Y_JPY', 'CHINAH_HKD'])          # Pepperstone JPN225 is quoted in JPY
        self.assertEqual(W.pepper_symbol('JP225Y_JPY'), 'JPN225')


def one(name, sym, bars):
    i = {**inst(name), 'sym': sym, 'tv': 'PEPPERSTONE:' + sym, 'group': 'FX MAJORS', 'wl': True}
    return X.run([i], lambda _i: (bars, SPREAD), log=None)


class Events(unittest.TestCase):
    NOW = dt.datetime(2026, 10, 21, 13, 5)

    def setUp(self):
        self.res = one('EUR_USD', 'EURUSD', T.textbook())
        self.ev, self.st = X.events(self.res, {'signals': {}}, self.NOW)
        self.key = X.sig_key(self.res['signals'][0])

    def test_missing_data_is_not_a_cancel(self):
        """P0: an instrument with no data this run (error, budget, --only) is carried over silently."""
        st = {**self.st, 'signals': {**self.st['signals'], 'GBPUSD|SELL|H4|supply|x':
                                     {'sym': 'GBPUSD', 'kind': 'SELL', 'tf': 'H4', 'side': 'supply', 'base_start': 'x'}},
              'watch': ['GBPUSD|WATCH|D1|supply|y'], 'zones_now': ['GBPUSD|in|D1:S:y']}
        ev, new = X.events(self.res, st, self.NOW + dt.timedelta(hours=4))
        self.assertEqual(ev['gone'], [])
        self.assertIn('GBPUSD|SELL|H4|supply|x', new['signals'])
        self.assertIn('GBPUSD|WATCH|D1|supply|y', new['watch'])
        self.assertIn('GBPUSD|in|D1:S:y', new['zones_now'])
        empty = {**self.res, 'analyses': {}, 'signals': [], 'watch': [], 'hits': {}}
        ev, new = X.events(empty, self.st, self.NOW + dt.timedelta(hours=4))
        self.assertEqual(ev['gone'], [])
        self.assertIn(self.key, new['signals'])

    def test_drift_away_keeps_the_order(self):
        """P1: price moving more than 1x the zone away is not a cancel (and no NEW again when it comes back)."""
        b = T.textbook()
        x = b['H4'][-1]
        b['H4'][-1] = Bar(x.d, x.o, 1.2116, x.l, 1.2113)                 # 33 pips above a 15-pip zone
        res = one('EUR_USD', 'EURUSD', b)
        self.assertFalse(res['signals'])
        ev, new = X.events(res, self.st, self.NOW + dt.timedelta(hours=4))
        self.assertEqual(ev['gone'], [])
        self.assertIn(self.key, new['signals'])
        ev2, _ = X.events(self.res, new, self.NOW + dt.timedelta(hours=8))
        self.assertEqual(ev2['signals'], [])

    def test_cancel_then_cooldown(self):
        st = {**self.st, 'signals': {}, 'cancelled': {self.key: (self.NOW - dt.timedelta(hours=2)).isoformat()}}
        ev, new = X.events(self.res, st, self.NOW)
        self.assertEqual(ev['signals'], [])
        self.assertNotIn(self.key, new['signals'])
        ev, new = X.events(self.res, st, self.NOW + dt.timedelta(hours=C.DEDUPE_HOURS))
        self.assertEqual(len(ev['signals']), 1)

    def test_failed_send_keeps_the_old_alert_state(self):
        old = {'signals': {}, 'watch': [], 'zones_now': [], 'zones_sent': {}, 'last_h4': 'a', 'summary_d1': 'd0'}
        new = {**self.st, 'last_h4': 'b', 'summary_d1': 'd1'}
        kept = X.unsent_state(new, old)
        self.assertEqual(kept['signals'], {})
        self.assertEqual((kept['last_h4'], kept['summary_d1']), ('b', 'd0'))
        ev, _ = X.events(self.res, kept, self.NOW + dt.timedelta(hours=4))
        self.assertEqual(len(ev['signals']), 1)                            # re-sent next run


class Data(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self._cache = C.CACHE
        C.CACHE = self.tmp.name
        os.environ['OANDA_API_TOKEN'] = 'test-token'
        self.urls = []

    def tearDown(self):
        C.CACHE = self._cache
        os.environ.pop('OANDA_API_TOKEN', None)
        self.tmp.cleanup()

    def get(self, url):
        self.urls.append(url)
        return json.dumps({'candles': []}).encode()

    def test_misaligned_candles_raise(self):
        with self.assertRaises(C.Misaligned):
            C.label('2026-10-26T02:00:00Z', 'H4')                          # 05:00 server time
        with self.assertRaises(C.Misaligned):
            C.label('2026-10-22T21:00:00Z', 'W1')                          # a Thursday
        with self.assertRaises(C.Misaligned):
            C.label('2026-10-15T21:00:00Z', 'MN')
        self.assertEqual(C.label('2026-10-26T02:00:00Z', 'H4', strict=False), '2026-10-26T04:00')

    def test_dst_week_does_not_skip_the_close(self):
        """P1: the week New York changes its clock is 1 h shorter: 7.5 h after an H4 start the next close may exist."""
        last = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=7.5)).strftime('%Y-%m-%dT%H:%M:%SZ')
        O.save('EUR_USD', 'H4', {'bars': [['2026-10-26T04:00', 1, 1, 1, 1, 0]], 'last_utc': last, 'price': O.PRICE})
        O.update('EUR_USD', 'H4', self.get)
        self.assertEqual(len(self.urls), 1)

    def test_old_mid_cache_is_refetched(self):
        recent = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=1)).strftime('%Y-%m-%dT%H:00:00Z')
        O.save('EUR_USD', 'H4', {'bars': [['2026-10-26T04:00', 1, 1, 1, 1, 0]], 'last_utc': recent})   # no 'price'
        O.update('EUR_USD', 'H4', self.get)
        self.assertEqual(len(self.urls), 1)
        self.assertNotIn('from=', self.urls[0])
        self.assertIn('price=BA', self.urls[0])

    def test_usdx_htf_wicks_from_h4(self):
        v = {'EUR_USD': 1.08, 'USD_JPY': 150.0, 'GBP_USD': 1.27, 'USD_CAD': 1.36, 'USD_SEK': 10.5, 'USD_CHF': 0.88}
        parts = {}
        for n, x in v.items():
            # two H4 bars; each part makes its high in a DIFFERENT bar than the others' lows
            h4 = [Bar('2026-10-21T00:00', x, x * 1.002, x * 0.9995, x), Bar('2026-10-21T04:00', x, x * 1.0005, x * 0.998, x)]
            parts[n] = {'H4': h4, 'D1': [Bar('2026-10-21T00:00', x, x * 1.002, x * 0.998, x)], 'W1': [], 'MN': []}
        out = X.synth_usdx(parts)
        bound = 50.14348112
        for n, w in X.USDX_PARTS.items():
            bound *= (v[n] * (1.002 if w > 0 else 0.998)) ** w
        self.assertLess(out['D1'][0].h, bound)                             # tighter than the product of extremes
        self.assertAlmostEqual(out['D1'][0].h, max(b.h for b in out['H4']), places=9)


class HistoricalDst(unittest.TestCase):
    """Before 2007 US DST ended on the last Sunday of October (and began on the first Sunday of April): old candles
    are aligned at 17:00 New York with THOSE rules (live run 40421601450 failed 102 instruments on 2002 / 2004 weeks)."""

    def test_pre_2007_weeks_and_days(self):
        for t in ('2002-11-01T22:00:00Z', '2004-11-05T22:00:00Z', '2006-11-03T22:00:00Z'):   # Friday 17:00 EST
            lbl = C.label(t, 'W1')
            self.assertEqual(dt.date.fromisoformat(lbl[:10]).weekday(), 5, t)
            self.assertEqual(lbl[11:], '00:00')
        self.assertEqual(C.label('2006-10-27T21:00:00Z', 'W1'), '2006-10-28T00:00')          # last EDT week of 2006
        self.assertEqual(C.label('2006-04-02T21:00:00Z', 'D1'), '2006-04-03T00:00')          # 1st Sunday of April: EDT
        self.assertEqual(C.label('2006-03-12T22:00:00Z', 'D1'), '2006-03-13T00:00')          # still EST in 2006
        self.assertEqual(C.label('2006-11-01T22:00:00Z', 'H4'), '2006-11-02T00:00')

    def test_2007_change(self):
        self.assertEqual(C.label('2007-03-11T21:00:00Z', 'D1'), '2007-03-12T00:00')          # 2nd Sunday of March: EDT
        self.assertEqual(C.label('2007-11-02T21:00:00Z', 'W1'), '2007-11-03T00:00')          # 1st Sunday of Nov 2007
        self.assertEqual(C.label('2007-11-09T22:00:00Z', 'W1'), '2007-11-10T00:00')
        for y, u, off in ((2002, dt.datetime(2002, 10, 28, 12), -5), (2006, dt.datetime(2006, 11, 1, 12), -5),
                          (2007, dt.datetime(2007, 11, 1, 12), -4), (2007, dt.datetime(2007, 3, 20, 12), -4),
                          (2006, dt.datetime(2006, 3, 20, 12), -5)):
            self.assertEqual(C.ny_offset(u), off, u)

    def test_rule_fallback_matches_the_tz_database(self):
        ny = C._NY
        try:
            got = []
            for u in (dt.datetime(2002, 11, 1, 22), dt.datetime(2006, 4, 3, 1), dt.datetime(2007, 3, 12, 1),
                      dt.datetime(2026, 11, 1, 5), dt.datetime(2026, 11, 1, 7)):
                C._NY = ny
                a = C.ny_offset(u)
                C._NY = None
                got.append((a, C.ny_offset(u)))
        finally:
            C._NY = ny
        self.assertTrue(all(a == b for a, b in got), got)

    def test_old_misaligned_candle_dropped_recent_fails(self):
        def raw(*times):
            return json.dumps({'candles': [{'time': t, 'complete': True, 'volume': 1,
                                            'bid': {'o': '1', 'h': '1', 'l': '1', 'c': '1'}} for t in times]}).encode()
        O.DROPPED.clear()
        rows = O.parse_candles(raw('2003-01-03T20:00:00Z', '2003-01-10T22:00:00Z'), 'W1', name='EUR_USD')
        self.assertEqual([r[0] for r in rows], ['2003-01-11T00:00'])
        self.assertEqual(O.DROPPED, {'EUR_USD W1': 1})
        recent = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=10)).strftime('%Y-%m-%dT%H:30:00Z')
        with self.assertRaises(C.Misaligned):
            O.parse_candles(raw(recent), 'H4')


class Backwards(unittest.TestCase):
    """zones.py changes are opt-in: the stock scanner's defaults behave as before."""

    def test_defaults(self):
        self.assertNotIn('room_any', Z.RAJA)
        self.assertNotIn('emo_touch', Z.RAJA)
        self.assertNotIn('base_strict', Z.RAJA)


if __name__ == '__main__':
    unittest.main()
