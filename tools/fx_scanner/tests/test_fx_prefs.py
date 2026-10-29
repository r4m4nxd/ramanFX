"""Bot preferences (stock_scanner/prefs.py) in the FX scan: mutes, quiet hours, extra watch, price / zone alerts, the
3-row alert keyboard, and the Kevin cross-check (kevin.py) + MN chart bars in the detail shards."""
import datetime as dt
import hashlib
import json
import os
import sys
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxnotify as N  # noqa: E402
import fxscan as X  # noqa: E402
import kevin as K  # noqa: E402
import prefs as P  # noqa: E402

UTC = dt.timezone.utc


class PrefsTest(unittest.TestCase):
    def test_key_is_sha256_of_token_and_suffix(self):
        self.assertEqual(P.key('abc'), hashlib.sha256(b'abc:prefs').hexdigest())

    def test_normalize_accepts_the_bot_shapes(self):
        p = P.normalize({'mutes': [{'sym': 'eurusd', 'until_utc': '2026-11-05T00:00:00Z'}, {'sym': ''}],
                         'alerts': [{'id': 1, 'sym': 'XAUUSD', 'kind': 'price', 'level': 4000, 'dir': 'below'},
                                    {'id': 2, 'sym': 'EURUSD', 'kind': 'pct', 'pct': 0.2},
                                    {'id': 3, 'sym': 'GBPUSD', 'kind': 'zone'},
                                    {'id': 4, 'sym': 'X', 'kind': 'price'},            # no level: dropped
                                    {'id': 5, 'sym': 'Y', 'kind': 'weird'}],
                         'quiet': {'from': '22:00', 'to': '06:00', 'tz': 'America/Edmonton'}, 'watch': ['nzdjpy', 'AAPL']})
        self.assertEqual([m['sym'] for m in p['mutes']], ['EURUSD'])
        self.assertEqual([(a['id'], a['kind'], a['dir']) for a in p['alerts']], [(1, 'price', 'down'), (2, 'zone', None), (3, 'zone', None)])
        self.assertEqual(p['watch'], ['AAPL', 'NZDJPY'])
        self.assertEqual(P.normalize(None), {'mutes': [], 'alerts': [], 'quiet': None, 'watch': []})

    def test_fetch_failure_is_logged_and_none(self):
        logs = []
        with mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': 't'}), \
                mock.patch('urllib.request.urlopen', side_effect=TimeoutError('slow')):
            self.assertIsNone(P.fetch(log=logs.append))
        self.assertTrue(logs[0].startswith('prefs unavailable (TimeoutError)'))
        with mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': ''}):
            self.assertIsNone(P.fetch(log=logs.append))

    def test_fetch_sends_the_key_header(self):
        seen = {}

        class R:
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self): return json.dumps({'mutes': [], 'alerts': [], 'quiet': None, 'watch': ['EURUSD']}).encode()

        def fake(req, timeout):
            seen['url'], seen['key'], seen['timeout'] = req.full_url, req.get_header('X-rfx-key'), timeout
            return R()
        with mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': 'tok'}), mock.patch('urllib.request.urlopen', fake):
            p = P.fetch(log=None)
        self.assertEqual(p['watch'], ['EURUSD'])
        self.assertTrue(seen['url'].endswith('?op=prefs'))
        self.assertEqual(seen['key'], P.key('tok'))
        self.assertEqual(seen['timeout'], 10.0)

    def test_mutes_expire(self):
        p = {'mutes': [{'sym': 'EURUSD', 'until_utc': '2026-11-05T00:00:00Z'}, {'sym': 'GBPUSD', 'until_utc': '2026-10-01T00:00:00Z'}]}
        self.assertEqual(P.muted_set(p, dt.datetime(2026, 10, 29, tzinfo=UTC)), {'EURUSD'})
        self.assertEqual(P.muted_set(None), set())

    def test_quiet_hours_wrap_midnight_in_calgary(self):
        p = {'quiet': {'from': '22:00', 'to': '06:00', 'tz': 'America/Edmonton'}}
        self.assertTrue(P.in_quiet(p, dt.datetime(2026, 10, 29, 5, 0, tzinfo=UTC)))     # 11 PM Calgary
        self.assertTrue(P.in_quiet(p, dt.datetime(2026, 11, 3, 11, 30, tzinfo=UTC)))    # 5:30 AM at UTC-6
        self.assertFalse(P.in_quiet(p, dt.datetime(2026, 11, 3, 12, 30, tzinfo=UTC)))   # 6:30 AM
        self.assertFalse(P.in_quiet(p, dt.datetime(2026, 10, 29, 18, 0, tzinfo=UTC)))   # noon
        self.assertFalse(P.in_quiet({'quiet': None}))
        day = {'quiet': {'from': '09:00', 'to': '17:00', 'tz': 'America/Edmonton'}}
        self.assertTrue(P.in_quiet(day, dt.datetime(2026, 10, 29, 18, 0, tzinfo=UTC)))

    def test_price_alerts_on_the_closed_bar(self):
        bar = {'h': 1.1720, 'l': 1.1650, 'c': 1.1700}
        up = {'id': 1, 'sym': 'EURUSD', 'kind': 'price', 'level': 1.1715, 'dir': 'up', 'pct': None}
        self.assertIsNotNone(P.check_alert(up, bar, [], 1.17))
        self.assertIsNone(P.check_alert({**up, 'level': 1.1730}, bar, [], 1.17))
        down = {**up, 'dir': 'down', 'level': 1.1660}
        self.assertIsNotNone(P.check_alert(down, bar, [], 1.17))
        self.assertIsNone(P.check_alert({**down, 'level': 1.1600}, bar, [], 1.17))
        both = {**up, 'dir': None, 'level': 1.1690}
        self.assertIsNotNone(P.check_alert(both, bar, [], 1.17))
        self.assertIsNone(P.check_alert({**both, 'level': 1.18}, bar, [], 1.17))

    def test_zone_and_pct_alerts(self):
        zones = [{'tf': 'H4', 'side': 'demand', 'prox': 1.1600, 'dist': 1.1580, 'sec': 'near', 'loc_ok': True},
                 {'tf': 'D1', 'side': 'supply', 'prox': 1.1800, 'dist': 1.1830, 'sec': None, 'loc_ok': True}]
        z = {'id': 7, 'sym': 'EURUSD', 'kind': 'zone', 'level': None, 'dir': None, 'pct': None}
        self.assertIsNone(P.check_alert(z, None, zones, 1.1620))                       # not inside
        inside = [{**zones[0], 'sec': 'in'}]
        r = P.check_alert(z, None, inside, 1.1590)
        self.assertIn('entered the 4-hour demand', r['why'])
        pct = {**z, 'pct': 0.2}
        self.assertIsNotNone(P.check_alert(pct, None, zones, 1.1620))                  # 0.17% above the proximal
        self.assertIsNone(P.check_alert(pct, None, zones, 1.1650))                     # 0.43%
        self.assertIsNone(P.check_alert(z, None, [{**zones[0], 'sec': 'in', 'loc_ok': False}], 1.159))

    def test_evaluate_skips_fired_and_unknown(self):
        prefs = {'alerts': [{'id': 1, 'sym': 'EURUSD', 'kind': 'price', 'level': 1.0, 'dir': None, 'pct': None},
                            {'id': 2, 'sym': 'EURUSD', 'kind': 'price', 'level': 1.05, 'dir': 'up', 'pct': None},
                            {'id': 3, 'sym': 'NOPE', 'kind': 'price', 'level': 1.0, 'dir': None, 'pct': None}]}
        per = {'EURUSD': {'bar': {'h': 1.06, 'l': 0.99, 'c': 1.0}, 'zones': [], 'price': 1.0, 'digits': 5}}
        self.assertEqual([f['alert']['id'] for f in P.evaluate(prefs, per)], [1, 2])
        self.assertEqual([f['alert']['id'] for f in P.evaluate(prefs, per, {'1': 'x'})], [2])
        self.assertEqual(P.evaluate(None, per), [])


class KevinTest(unittest.TestCase):
    CALLS = [
        {'session': '2026-10-28_1656', 'plan_for': '2026-10-29', 'symbol': 'XAUUSD', 'direction': 'long', 'zone_type': 'demand',
         'zone_tf': '1H', 'proximal': 4041.203, 'distal': 4024.665},
        {'session': '2026-10-28_1656', 'plan_for': '2026-10-29', 'symbol': 'DXY', 'direction': 'short', 'zone_type': 'supply',
         'zone_tf': '4H', 'proximal': 102.391, 'distal': 102.589},
        {'session': '2026-10-27_1650', 'plan_for': '2026-10-28', 'symbol': 'EURUSD', 'direction': 'long', 'zone_type': 'demand',
         'zone_tf': '4H', 'proximal': 1.11359, 'distal': 1.11129},
        {'session': '2026-10-26_1650', 'plan_for': '2026-10-27', 'symbol': 'GBPUSD', 'direction': 'long', 'zone_type': 'demand',
         'zone_tf': '4H', 'proximal': 1.31654, 'distal': None},
        {'session': '2026-10-20_1650', 'plan_for': '2026-10-21', 'symbol': 'AUDUSD', 'direction': 'long', 'zone_type': 'demand',
         'zone_tf': '4H', 'proximal': 0.69, 'distal': 0.68},                                    # older than 3 plan days
        {'session': '2026-10-28_1656', 'plan_for': '2026-10-29', 'symbol': 'EURUSD', 'direction': 'long', 'proximal': None},
        {'session': '2026-10-28_1656', 'plan_for': '2026-10-29', 'symbol': 'USDJPY', 'direction': 'long', 'zone_type': 'demand',
         'zone_tf': '15m', 'proximal': 152.1, 'distal': 151.9},                                # below 1H: ignored
    ]

    def test_only_1h_and_higher(self):
        self.assertIsNone(K.match(self.lv(), 'USDJPY', 'demand', 152.0, 151.95))
        self.assertTrue(all(x['tf'] in ('1H', '4H', 'D1', 'W1', 'MN') for x in K.load(today=dt.date(2026, 10, 29))))

    def lv(self):
        return K.levels(self.CALLS, dt.date(2026, 10, 29))

    def test_last_three_plan_days_with_prices(self):
        lv = self.lv()
        self.assertEqual({x['sym'] for x in lv}, {'XAUUSD', 'USDX', 'EURUSD', 'GBPUSD'})
        self.assertEqual(lv[0]['session'][:10], '2026-10-28')

    def test_label_like_the_card(self):
        m = K.match(self.lv(), 'XAUUSD', 'demand', 4040.0, 4030.0, 4050.0)
        self.assertEqual(K.label(m), 'Oct 28: 1H demand 4024–4041')
        self.assertEqual(K.label(K.match(self.lv(), 'GBPUSD', 'demand', 1.3170, 1.3150)), 'Oct 26: 4H demand 1.31654')

    def test_overlap_within_a_tenth_of_a_percent_same_side(self):
        lv = self.lv()
        self.assertIsNotNone(K.match(lv, 'USDX', 'supply', 102.60, 102.70, 102.5))       # 0.01 above his distal
        self.assertIsNone(K.match(lv, 'USDX', 'supply', 102.80, 102.95, 102.5))          # 0.2% away
        self.assertIsNone(K.match(lv, 'USDX', 'demand', 102.40, 102.50, 102.5))          # other side
        self.assertIsNone(K.match(lv, 'AUDUSD', 'demand', 0.69, 0.68))                   # too old
        self.assertIsNotNone(K.match(lv, 'EURUSD', 'demand', 1.1146, 1.1140, 1.115))     # 1.1146 within 0.1% of 1.11359

    def test_repo_calls_load(self):
        self.assertIsInstance(K.load(today=dt.date(2026, 10, 29)), list)
        self.assertEqual(K.load('/nonexistent.json'), [])


class FxIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        uni, data, wl = X.selftest_universe()
        cls.data, cls.uni, cls.wl = data, uni, wl
        cls.res = X.run(uni, lambda i: (data[i['name']], 0.6 * X.C.pip_of(i)), log=None)

    def test_mn_bars_in_the_detail_shards(self):
        an = next(iter(self.res['analyses'].values()))
        d = X.detail(an, [], [])
        self.assertIn('MN', d['bars'])
        self.assertGreater(len(d['bars']['MN']), 12)
        self.assertLessEqual(len(d['bars']['MN']), 60)
        self.assertEqual(len(d['bars']['MN'][0]), 5)

    def test_kevin_marks_signals_and_hits(self):
        s = self.res['signals'][0]
        lv = [{'sym': s['sym'], 'side': s['side'], 'lo': min(s['proximal'], s['distal']), 'hi': max(s['proximal'], s['distal']),
               'tf': '4H', 'session': '2026-10-28_1656', 'plan_for': '2026-10-29'}]
        res = {**self.res, 'signals': [dict(x) for x in self.res['signals']], 'watch': [dict(x) for x in self.res['watch']],
               'hits': {k: [dict(h) for h in v] for k, v in self.res['hits'].items()}}
        self.assertGreaterEqual(X.mark_kevin(res, lv), 1)
        card = N.signal_card(res['signals'][0])
        self.assertIn("⭐ also in Kevin's plan (Oct 28: 4H ", card)

    def test_alert_message_mutes_orders_and_keyboard(self):
        sig = [dict(s) for s in self.res['signals']]
        self.assertGreaterEqual(len(sig), 2)
        sig[1]['kevin'] = 'Oct 28: 4H supply 1.2'
        ev = {'signals': sig, 'gone': [], 'watch': [], 'zones': [], 'h4': '2026-10-23T16:00'}
        m = N.alert_messages(ev)[0]
        vis = N.SN.visible(m)
        self.assertLess(vis.index(f"<b>{sig[1]['sym']}</b>"), vis.index(f"<b>{sig[0]['sym']}</b>"))   # Kevin first
        self.assertLessEqual(len(m.buttons), 3)
        datas = [b.get('callback_data') for r in m.buttons for b in r]
        self.assertIn(f"m:{sig[0]['sym']}:7", datas)
        self.assertIn(f"r:{sig[0]['sym']}:0.2", datas)
        muted = N.alert_messages(ev, muted={sig[0]['sym']})[0]
        self.assertNotIn(f"<b>{sig[0]['sym']}</b>", N.SN.visible(muted))
        self.assertEqual(N.alert_messages({**ev, 'signals': sig[:1]}, muted={sig[0]['sym']}), [])
        self.assertTrue(N.urgent(ev))
        self.assertFalse(N.urgent(ev, muted={s['sym'] for s in sig}))

    def test_alert_inputs_and_fired_message(self):
        per = X.alert_inputs(self.res)
        sym, info = next(iter(per.items()))
        self.assertTrue(info['bar'] and info['price'])
        lvl = info['bar']['l']
        fired = P.evaluate({'alerts': [{'id': 9, 'sym': sym, 'kind': 'price', 'level': lvl, 'dir': 'down', 'pct': None}]}, per)
        self.assertEqual(len(fired), 1)
        m = N.fired_messages(fired)[0]
        self.assertTrue(m.startswith(f'🔔 <b>{sym}</b> reached your level'))
        self.assertIn('<i>why: ', m)
        self.assertEqual(m.buttons, [[{'text': f'📊 {sym} chart', 'callback_data': f'c:{sym}'}]])

    def test_merge_watch_only_known_instruments(self):
        wl = {'names': ['EUR_USD'], 'sections': {'EUR_USD': 'FX'}, 'items': []}
        added = X.merge_watch(wl, ['NZDJPY', 'AAPL', 'EURUSD'], {'EUR_USD', 'NZD_JPY'})
        self.assertEqual(added, ['NZD_JPY'])
        self.assertEqual(wl['sections']['NZD_JPY'], 'BOT WATCH')
        self.assertEqual(X.merge_watch(wl, ['GBPUSD'], None), [])


if __name__ == '__main__':
    unittest.main()
