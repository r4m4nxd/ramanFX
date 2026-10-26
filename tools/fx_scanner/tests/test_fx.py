"""FX scanner tests (no network: OANDA answers are mocked)."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import fxnotify as N  # noqa: E402
import fxscan as X  # noqa: E402
import oanda as O  # noqa: E402
import synth_fx  # noqa: E402
import watchlist as W  # noqa: E402
from zones import Bar  # noqa: E402

EURUSD = {'name': 'EUR_USD', 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5}


def candle(t, o, h, l, c, complete=True, bid=None, ask=None):
    x = {'time': t, 'complete': complete, 'volume': 10, 'mid': {'o': str(o), 'h': str(h), 'l': str(l), 'c': str(c)}}
    if bid is not None:
        x['bid'] = {'o': str(bid), 'h': str(bid), 'l': str(bid), 'c': str(bid)}
        x['ask'] = {'o': str(ask), 'h': str(ask), 'l': str(ask), 'c': str(ask)}
    return x


class Clock(unittest.TestCase):
    def test_labels_server_time(self):
        # Sunday 17:00 NY (EDT) = the Monday session = Monday 00:00 server time
        self.assertEqual(C.label('2026-10-25T21:00:00.000000000Z', 'D1'), '2026-10-26T00:00')
        self.assertEqual(C.label('2026-10-26T01:00:00.000000000Z', 'H4'), '2026-10-26T04:00')
        # winter (EST): 22:00 UTC is the day start
        self.assertEqual(C.label('2026-11-15T22:00:00Z', 'D1'), '2026-11-16T00:00')
        self.assertEqual(C.label('2026-11-16T02:00:00Z', 'H4'), '2026-11-16T04:00')
        # months / weeks snapped to their start whatever the alignment
        self.assertEqual(C.label('2026-09-30T21:00:00Z', 'MN'), '2026-10-01T00:00')
        self.assertEqual(C.label('2026-10-01T04:00:00Z', 'MN'), '2026-10-01T00:00')
        self.assertEqual(C.label('2026-10-23T21:00:00Z', 'W1'), '2026-10-24T00:00')   # Friday 17:00 NY

    def test_period_keys(self):
        self.assertEqual(C.period_key('W1', '2026-10-26T04:00'), '2026-10-24')
        self.assertEqual(C.period_key('W1', '2026-10-24T00:00'), '2026-10-24')
        self.assertEqual(C.period_key('D1', '2026-10-26T20:00'), '2026-10-26')
        self.assertEqual(C.period_key('MN', '2026-10-26T20:00'), (2026, 10))

    def test_h4_close(self):
        self.assertEqual(C.h4_close_utc('2026-10-23T16:00'), dt.datetime(2026, 10, 23, 17))
        self.assertEqual(C.h4_close_utc('2026-11-16T20:00'), dt.datetime(2026, 11, 16, 22))


class Instruments(unittest.TestCase):
    def test_classes_pips(self):
        self.assertEqual(C.fx_class('EUR_USD'), 'major')
        self.assertEqual(C.fx_class('EUR_GBP'), 'cross')
        self.assertEqual(C.fx_class('USD_ZAR'), 'exotic')
        self.assertEqual(C.fx_class('XAU_AUD', 'METAL'), 'metal')
        self.assertEqual(C.fx_class('US30_USD', 'CFD'), 'cfd')
        jpy = {'name': 'USD_JPY', 'pipLocation': -2, 'displayPrecision': 3}
        self.assertAlmostEqual(C.pips(0.25, jpy), 25.0)
        self.assertAlmostEqual(C.pips(0.0013, EURUSD), 13.0)
        self.assertEqual(C.digits_of({'name': 'XAU_USD', 'displayPrecision': 3}), 2)
        self.assertEqual(C.fmt(1.083401, EURUSD), '1.08340')

    def test_select_and_fallback(self):
        fb = C.load_fallback()
        self.assertGreater(len(fb), 60)
        sel = C.select(fb + [{'name': 'US30_USD', 'type': 'CFD'}], include_cfd=False)
        self.assertNotIn('US30_USD', [i['name'] for i in sel])
        self.assertEqual(sum(i['cls'] == 'major' for i in sel), 7)
        self.assertEqual(sum(i['cls'] == 'cross' for i in sel), 21)
        self.assertIn('XAU_AUD', [i['name'] for i in sel])

    def test_watchlist(self):
        txt = '###FX MAJORS,PEPPERSTONE:EURUSD,OANDA:USDJPY\n###METALS\nTVC:GOLD,PEPPERSTONE:XAUAUD\n###INDICES,PEPPERSTONE:US500,PEPPERSTONE:VIX,PEPPERSTONE:SPOTCRUDE'
        pairs = W.parse(txt)
        self.assertEqual(pairs[0], ('FX MAJORS', 'PEPPERSTONE:EURUSD'))
        self.assertEqual(W.map_symbol('TVC:GOLD'), 'XAU_USD')
        self.assertEqual(W.map_symbol('PEPPERSTONE:SPOTCRUDE'), 'WTICO_USD')
        self.assertEqual(W.map_symbol('PEPPERSTONE:GER40'), 'DE30_EUR')
        self.assertIsNone(W.map_symbol('PEPPERSTONE:VIX'))
        self.assertIsNone(W.map_symbol('FX:USDEUR', {'EUR_USD'}))                 # the reversed pair is never used
        self.assertIsNone(W.map_symbol('PEPPERSTONE:ADAUSD', {'EUR_USD'}))
        self.assertEqual(W.pepper_symbol('WTICO_USD'), 'SPOTCRUDE')
        self.assertEqual(W.pepper_symbol('EUR_USD'), 'EURUSD')
        old = os.environ.get('FX_WATCHLIST')
        os.environ['FX_WATCHLIST'] = txt
        try:
            w = W.load({'EUR_USD', 'USD_JPY', 'XAU_USD', 'XAU_AUD', 'SPX500_USD', 'WTICO_USD'})
        finally:
            os.environ.pop('FX_WATCHLIST') if old is None else os.environ.__setitem__('FX_WATCHLIST', old)
        self.assertEqual(w['source'], 'FX_WATCHLIST')
        self.assertEqual(w['sections']['XAU_AUD'], 'METALS')
        self.assertEqual([u['symbol'] for u in w['unmapped']], ['PEPPERSTONE:VIX'])
        uni = X.universe([EURUSD, {'name': 'SPX500_USD', 'type': 'CFD', 'pipLocation': 0, 'displayPrecision': 1}], w, include_cfd=False)
        us = next(i for i in uni if i['name'] == 'SPX500_USD')
        self.assertEqual((us['sym'], us['tv'], us['wl'], us['cls']), ('US500', 'PEPPERSTONE:US500', True, 'cfd'))

    def test_committed_watchlist_maps(self):
        w = W.load()
        self.assertGreater(len(w['names']), 90)
        self.assertIn('XAU_AUD', w['names'])
        self.assertIn('USDX', w['names'])


class Oanda(unittest.TestCase):
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

    def fake(self, candles):
        def get(url):
            self.urls.append(url)
            return json.dumps({'instrument': 'EUR_USD', 'granularity': 'H4', 'candles': candles}).encode()
        return get

    def test_parse_complete_only_and_spread(self):
        raw = json.dumps({'candles': [candle('2026-10-26T01:00:00.000000000Z', 1.1, 1.2, 1.0, 1.15, bid=1.14995, ask=1.15005),
                                      candle('2026-10-26T05:00:00.000000000Z', 1.15, 1.2, 1.1, 1.12, complete=False)]}).encode()
        rows = O.parse_candles(raw, 'H4')
        self.assertEqual(len(rows), 1)
        lbl, b, sp, utc = rows[0]
        self.assertEqual((lbl, b.c), ('2026-10-26T04:00', 1.14995))              # BID bars (the MT4 / MT5 chart)
        self.assertAlmostEqual(sp, 0.0001)

    def test_url_alignment(self):
        u = urllib.parse.urlsplit(O.candles_url('EUR_USD', 'H4', 10, '2026-10-26T01:00:00Z'))
        q = dict(urllib.parse.parse_qsl(u.query))
        self.assertEqual(u.netloc, 'api-fxpractice.oanda.com')
        self.assertEqual((q['granularity'], q['price'], q['alignmentTimezone'], q['dailyAlignment'], q['weeklyAlignment']),
                         ('H4', 'BA', 'America/New_York', '17', 'Friday'))
        self.assertEqual(q['from'], '2026-10-26T01:00:00Z')
        self.assertEqual(dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(O.candles_url('EUR_USD', 'MN')).query))['granularity'], 'M')
        os.environ['OANDA_ENV'] = 'live'
        try:
            self.assertIn('api-fxtrade.oanda.com', O.candles_url('EUR_USD', 'D1'))
        finally:
            os.environ.pop('OANDA_ENV')

    def test_cold_then_incremental(self):
        c1 = [candle('2020-01-06T22:00:00Z', 1.1, 1.11, 1.09, 1.105), candle('2020-01-07T22:00:00Z', 1.105, 1.12, 1.1, 1.11)]
        bars, rec = O.update('EUR_USD', 'D1', self.fake(c1))
        self.assertEqual([b.d for b in bars], ['2020-01-07T00:00', '2020-01-08T00:00'])
        self.assertNotIn('from=', self.urls[-1])
        c2 = [candle('2020-01-07T22:00:00Z', 1.105, 1.12, 1.1, 1.11), candle('2020-01-08T22:00:00Z', 1.11, 1.13, 1.1, 1.125)]
        bars, rec = O.update('EUR_USD', 'D1', self.fake(c2))
        self.assertIn('from=2020-01-07T22', urllib.parse.unquote(self.urls[-1]))
        self.assertEqual(len(bars), 3)
        self.assertEqual(bars[-1].c, 1.125)
        # overlap mismatch (the cached candle changed) -> a full re-fetch
        c3 = [candle('2020-01-08T22:00:00Z', 1.11, 1.13, 1.1, 1.3)]
        bars, _ = O.update('EUR_USD', 'D1', self.fake(c3))
        self.assertNotIn('from=', self.urls[-1])
        self.assertEqual(len(bars), 1)

    def test_skip_when_nothing_new(self):
        recent = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=1)).strftime('%Y-%m-%dT%H:00:00Z')
        O.save('EUR_USD', 'H4', {'bars': [['2026-10-26T04:00', 1, 1, 1, 1, 0]], 'last_utc': recent, 'price': O.PRICE})
        bars, _ = O.update('EUR_USD', 'H4', self.fake([]))
        self.assertEqual(len(bars), 1)
        self.assertEqual(self.urls, [])

    def test_account_instruments_and_fallback(self):
        def get(url):
            if url.endswith('/v3/accounts'):
                return b'{"accounts":[{"id":"101-001-1-001","tags":[]}]}'
            return json.dumps({'instruments': [{'name': 'EUR_USD', 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5, 'marginRate': '0.02'}]}).encode()
        ins, src = O.account_instruments(get)
        self.assertEqual((src, ins[0]['name'], 'marginRate' in ins[0]), ('oanda', 'EUR_USD', False))
        ins, src = O.account_instruments(get)
        self.assertEqual(src, 'cache')
        os.remove(os.path.join(C.CACHE, 'instruments.json'))

        def bad(url):
            raise OSError('down')
        ins, src = O.account_instruments(bad)
        self.assertEqual(src, 'fallback')
        self.assertGreater(len(ins), 60)

    def test_no_token(self):
        os.environ.pop('OANDA_API_TOKEN', None)
        with self.assertRaises(O.NoToken):
            O.token()


class Rules(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.uni, cls.data, cls.wl = X.selftest_universe()
        cls.res = X.run(cls.uni, lambda i: (cls.data[i['name']], 0.6 * C.pip_of(i)), log=None)

    def test_located_buy_and_stop_rule(self):
        s = next(s for s in self.res['signals'] if s['sym'] == 'EURUSD' and s['kind'] == 'BUY')
        self.assertEqual(s['tf'], 'H4')
        self.assertTrue(s['loc_ok'])
        self.assertEqual(s['loc'], 'inside')
        for tf in ('MN demand', 'W1 demand', 'D1 demand'):
            self.assertIn(tf + ' ', s['chain_text'])
        self.assertEqual(s['chain_text'].count('touched ✓'), 3)
        h = s['proximal'] - s['distal']
        self.assertAlmostEqual(s['stop'], round(s['distal'] - max(0.15 * h, 3 * 0.0001), 5), places=5)   # H4: 15% of the height, min 3 pips
        self.assertAlmostEqual(s['entry'], round(s['proximal'] + 0.6 * 0.0001, 5), places=5)         # buy limit = proximal + spread
        self.assertEqual(s['rules'][0]['short'], 'location')
        self.assertTrue(all(r['status'] != 'fail' for r in s['rules']))
        self.assertTrue(all(x['tf'] in C.SIGNAL_TFS for x in self.res['signals']))   # never a W1 / MN limit

    def test_sell_side(self):
        s = next(s for s in self.res['signals'] if s['kind'] == 'SELL')
        self.assertEqual(s['side'], 'supply')
        self.assertGreater(s['stop'], s['entry'])
        self.assertLess(s['target'], s['entry'])
        self.assertGreater(s['rr'], 2)

    def test_htf_not_reached_blocks(self):
        """A zone whose HTF host is strong but untouched (or still in the way) is blocked by the location rule."""
        seen = 0
        for an in self.res['analyses'].values():
            for c in F.nearest_checks(an):
                loc = next(r for r in c['rules'] if r['short'] == 'location')
                if loc['status'] == 'fail':
                    seen += 1
                    self.assertEqual(c['block'], 'location')
                    self.assertTrue(any(w in loc['text'] for w in ('HTF area not reached', 'not touched yet', 'no strong', 'no ')))
        self.assertGreater(seen, 0)

    def test_gold_usd_h4_blocked(self):
        an = self.res['analyses']['XAUUSD']
        for tf in ('H4',):
            for z in an.rows[tf].zones:
                if z.zid in an.dna:
                    r = next(r for r in F.zone_rules(an, z, an.dna[z.zid]) if r.short == 'gold TF')
                    self.assertEqual(r.status, 'fail')

    def test_spread_filter(self):
        an = self.res['analyses']['EURUSD']
        z = next(z for z in an.rows['W1'].zones if z.zid in an.dna)
        an.spread = 1.0                                   # absurd spread
        an.memo.clear()
        r = next(r for r in F.zone_rules(an, z, an.dna[z.zid]) if r.short == 'spread')
        an.spread = 0.6 * an.pip
        self.assertEqual(r.status, 'fail')

    def test_public_shape(self):
        pub, shards = X.public(self.res, '2026-10-23T16:00', fixture=True)
        for k in ('signals', 'watch', 'lists', 'map', 'classes', 'groups', 'counts'):
            self.assertIn(k, pub)
        self.assertEqual(pub['counts']['instruments'], len(self.uni))
        row = pub['map'][0]
        self.assertIn(row['k'], shards)
        d = shards[row['k']]['instruments'][row['sym']]
        self.assertEqual(len(d['bars']['H4'][0]), 5)
        self.assertLessEqual(len(d['bars']['H4']), 80)
        json.dumps(pub, allow_nan=False)
        self.assertEqual(pub['groups'][0]['name'], 'FX MAJORS')

    def test_events_dedupe(self):
        now = dt.datetime(2026, 10, 23, 21, 5)
        ev, st = X.events(self.res, {'signals': {}}, now)
        self.assertEqual(len(ev['signals']), len(self.res['signals']))
        ev2, st2 = X.events(self.res, st, now + dt.timedelta(hours=4))
        self.assertEqual((ev2['signals'], ev2['gone'], ev2['zones'], ev2['watch']), ([], [], [], []))
        # a signal that disappears -> one cancel alert with a reason
        fake = {**st2, 'signals': {**st2['signals'], 'EURUSD|BUY|H4|demand|2026-01-01T00:00':
                                   {'sym': 'EURUSD', 'kind': 'BUY', 'tf': 'H4', 'side': 'demand', 'base_start': '2026-01-01T00:00',
                                    'entry': 0.5, 'stop': 0.49, 'digits': 5}}}
        ev3, _ = X.events(self.res, fake, now + dt.timedelta(hours=8))
        self.assertEqual(len(ev3['gone']), 1)
        self.assertTrue(ev3['gone'][0]['reason'])
        msgs = N.alert_messages({**ev3, 'h4': '2026-10-23T16:00'})
        self.assertTrue(msgs and 'Cancelled' in msgs[0])

    def test_zone_alerts_watchlist_only(self):
        ev, _ = X.events(self.res, {'signals': {}}, dt.datetime(2026, 10, 23, 21, 5))
        self.assertTrue(all(z['wl'] and z['loc_ok'] for z in ev['zones']))
        self.assertTrue(all(s['wl'] for s in ev['watch']))

    def test_telegram_limits(self):
        pub, _ = X.public(self.res, '2026-10-23T16:00')
        msgs = N.summary_messages(pub)
        self.assertTrue(msgs)
        self.assertTrue(all(N.u16(m) <= 4096 for m in msgs))
        self.assertIn('Chain:', msgs[0])


class Usdx(unittest.TestCase):
    def test_formula(self):
        v = {'EUR_USD': 1.08, 'USD_JPY': 150.0, 'GBP_USD': 1.27, 'USD_CAD': 1.36, 'USD_SEK': 10.5, 'USD_CHF': 0.88}
        parts = {n: {tf: [Bar('2026-10-23T16:00', x, x * 1.001, x * 0.999, x)] for tf in ('H4', 'D1', 'W1', 'MN')} for n, x in v.items()}
        out = X.synth_usdx(parts)
        exp = 50.14348112 * 1.08 ** -0.576 * 150 ** 0.136 * 1.27 ** -0.119 * 1.36 ** 0.091 * 10.5 ** 0.042 * 0.88 ** 0.036
        self.assertAlmostEqual(out['H4'][0].c, exp, places=6)
        self.assertGreater(out['H4'][0].h, out['H4'][0].c)
        self.assertLess(out['H4'][0].l, out['H4'][0].c)


class Selftest(unittest.TestCase):
    def test_selftest(self):
        with tempfile.TemporaryDirectory() as d:
            import contextlib
            import io
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(X.selftest(d), 0)
            self.assertTrue(os.path.exists(os.path.join(d, 'latest.json')))


if __name__ == '__main__':
    unittest.main()
