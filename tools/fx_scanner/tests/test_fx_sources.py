"""Extra data sources (no network: every HTTP answer is mocked): synthetic composition math, crypto aggregation on the
scanner's grid, provider / Yahoo fallbacks, the 24/7 crypto (weekend) scheduling, the committed watchlist coverage."""
import calendar
import contextlib
import datetime as dt
import io
import json
import os
import sys
import tempfile
import unittest
import urllib.parse
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import fxscan as X  # noqa: E402
import sources as SRC  # noqa: E402
import synth_fx  # noqa: E402
import watchlist as W  # noqa: E402
from sources import bars as B  # noqa: E402
from sources import crypto as CR  # noqa: E402
from sources import synthetic as SY  # noqa: E402
from sources import yahoo as YH  # noqa: E402
from zones import Bar  # noqa: E402


def _read(p: str) -> str:
    with open(p) as f:
        return f.read()


def epoch(s: str) -> int:
    return calendar.timegm(dt.datetime.strptime(s, '%Y-%m-%dT%H:%M').timetuple())


def hours(start: str, n: int, p0: float = 100.0):
    """n raw H1 rows from `start` (UTC), a gentle zig-zag, every hour (24/7)."""
    t0, out, p = epoch(start), [], p0
    for k in range(n):
        o = p
        c = p * (1.001 if (k // 7) % 2 == 0 else 0.999)
        out.append([t0 + 3600 * k, o, max(o, c) * 1.0005, min(o, c) * 0.9995, c, 1.0])
        p = c
    return out


class TmpCache(unittest.TestCase):
    def setUp(self):
        self._d = tempfile.TemporaryDirectory()
        self._old = C.CACHE
        C.CACHE = self._d.name

    def tearDown(self):
        C.CACHE = self._old
        self._d.cleanup()


class Synthetic(unittest.TestCase):
    def legs(self):
        a = {'H4': [Bar('2026-10-20T08:00', 1.10, 1.12, 1.09, 1.11)], 'H1': []}
        b = {'H4': [Bar('2026-10-20T08:00', 20.0, 20.5, 19.8, 20.2)], 'H1': []}
        return a, b

    def test_product_open_close_exact_wicks_bound(self):
        a, b = self.legs()
        out = SY.compose({'EUR_USD': a, 'USD_MXN': b}, {'EUR_USD': 1, 'USD_MXN': 1})
        x = out['H4'][0]
        self.assertAlmostEqual(x.o, 1.10 * 20.0)
        self.assertAlmostEqual(x.c, 1.11 * 20.2)
        self.assertAlmostEqual(x.h, 1.12 * 20.5)                 # upper bound: both highs
        self.assertAlmostEqual(x.l, 1.09 * 19.8)

    def test_ratio_uses_the_opposite_extreme(self):
        a, b = self.legs()
        out = SY.compose({'USD_JPY': a, 'USD_NOK': b}, {'USD_JPY': 1, 'USD_NOK': -1})
        x = out['H4'][0]
        self.assertAlmostEqual(x.o, 1.10 / 20.0)
        self.assertAlmostEqual(x.h, 1.12 / 19.8)                 # high = high / low
        self.assertAlmostEqual(x.l, 1.09 / 20.5)
        inv = SY.compose({'SGD_CHF': b}, {'SGD_CHF': -1})['H4'][0]
        self.assertAlmostEqual(inv.h, 1 / 19.8)                  # a pure inverse is exact
        self.assertAlmostEqual(inv.l, 1 / 20.5)

    def test_only_common_labels(self):
        a = {'H4': [Bar('2026-10-20T04:00', 1, 1, 1, 1), Bar('2026-10-20T08:00', 1, 1, 1, 1)]}
        b = {'H4': [Bar('2026-10-20T08:00', 2, 2, 2, 2)]}
        out = SY.compose({'A': a, 'B': b}, {'A': 1, 'B': 1})
        self.assertEqual([x.d for x in out['H4']], ['2026-10-20T08:00'])

    def test_h4_wicks_tightened_by_h1(self):
        # leg A peaks in the 1st hour, leg B in the 4th: the plain H4 bound multiplies both peaks, the H1-built one not
        a1 = [Bar('2026-10-20T08:00', 1.0, 1.10, 1.0, 1.0), Bar('2026-10-20T09:00', 1.0, 1.0, 1.0, 1.0),
              Bar('2026-10-20T10:00', 1.0, 1.0, 1.0, 1.0), Bar('2026-10-20T11:00', 1.0, 1.0, 1.0, 1.0)]
        b1 = [Bar('2026-10-20T08:00', 2.0, 2.0, 2.0, 2.0), Bar('2026-10-20T09:00', 2.0, 2.0, 2.0, 2.0),
              Bar('2026-10-20T10:00', 2.0, 2.0, 2.0, 2.0), Bar('2026-10-20T11:00', 2.0, 2.2, 2.0, 2.0)]
        a = {'H1': a1, 'H4': [Bar('2026-10-20T08:00', 1.0, 1.10, 1.0, 1.0)]}
        b = {'H1': b1, 'H4': [Bar('2026-10-20T08:00', 2.0, 2.2, 2.0, 2.0)]}
        out = SY.compose({'A': a, 'B': b}, {'A': 1, 'B': 1})
        self.assertAlmostEqual(out['H4'][0].h, 2.2)              # max over hours of (1.1 x 2.0, 1.0 x 2.2)
        self.assertLess(out['H4'][0].h, 1.10 * 2.2)
        self.assertAlmostEqual(out['H4'][0].o, 2.0)
        # an incomplete hour set keeps the (conservative) bound
        a['H1'] = a1[:3]
        self.assertAlmostEqual(SY.compose({'A': a, 'B': b}, {'A': 1, 'B': 1})['H4'][0].h, 1.10 * 2.2)

    def test_real_walks_bound_and_exact_bodies(self):
        e = synth_fx.instrument(11, start=1.10)
        m = synth_fx.instrument(12, start=18.0)
        spec = {'legs': {'EUR_USD': 1, 'USD_MXN': 1}}
        out, sp = SY.bars(spec, lambda n: ({'EUR_USD': e, 'USD_MXN': m}[n], 0.0001 if n == 'EUR_USD' else 0.002))
        for tf in ('H1', 'H4', 'D1', 'W1', 'MN'):
            self.assertTrue(out[tf], tf)
            ea, ma = {b.d: b for b in e[tf]}, {b.d: b for b in m[tf]}
            for x in out[tf][-50:]:
                self.assertAlmostEqual(x.c, ea[x.d].c * ma[x.d].c, places=9)
                self.assertGreaterEqual(x.h, max(x.o, x.c))
                self.assertLessEqual(x.h, ea[x.d].h * ma[x.d].h + 1e-12)
        px = out['H4'][-1].c
        self.assertAlmostEqual(sp, px * (0.0001 / e['H4'][-1].c + 0.002 / m['H4'][-1].c))

    def test_cross_ratio_bid_shift(self):
        j = {'H4': [Bar('2026-10-20T08:00', 150, 150, 150, 150)]}
        n = {'H4': [Bar('2026-10-20T08:00', 10, 10, 10, 10)]}
        out, sp = SY.bars({'legs': {'USD_JPY': 1, 'USD_NOK': -1}}, lambda k: ({'USD_JPY': j, 'USD_NOK': n}[k], {'USD_JPY': 0.01, 'USD_NOK': 0.01}[k]))
        self.assertAlmostEqual(out['H4'][0].c, 15 * (1 - 0.001))  # bid / ask: one NOK spread lower
        self.assertAlmostEqual(sp, out['H4'][0].c * (0.01 / 150 + 0.01 / 10))

    def test_registry_crosses(self):
        reg = {x['sym']: x for x in SRC.registry()}
        self.assertEqual(reg['NOKJPY']['legs'], {'USD_JPY': 1, 'USD_NOK': -1})
        self.assertEqual(reg['CHFSGD']['legs'], {'SGD_CHF': -1})
        self.assertEqual(len(SRC.registry()), 35)
        self.assertTrue(reg['EURX']['context_only'] and reg['JPYX']['context_only'])


class CryptoBars(unittest.TestCase):
    NOW = dt.datetime(2026, 10, 29, 13, 30)

    def test_h1_h4_on_server_grid_closed_only(self):
        rows = hours('2026-10-26T00:00', 3 * 24 + 13)             # to 2026-10-29 12:00 UTC
        out = B.chain(rows, [], now=self.NOW)
        self.assertEqual(out['H1'][-1].d, C.label(str(rows[-1][0]), 'H1'))
        for b in out['H4']:
            self.assertEqual(int(b.d[11:13]) % 4, 0)
            self.assertLessEqual(C.h4_close_utc(b.d), self.NOW)
        last = out['H4'][-1]
        g = [h for h in out['H1'] if C.h4_bucket(h.d) == last.d]
        self.assertEqual(len(g), 4)
        self.assertEqual((last.o, last.c, last.h, last.l), (g[0].o, g[-1].c, max(x.h for x in g), min(x.l for x in g)))
        # what fxcore makes of it: the H1 bars after the last closed H4 bar are the forming H4 bar
        self.assertTrue(all(C.h4_bucket(h.d) <= last.d or C.h4_close_utc(C.h4_bucket(h.d)) > self.NOW for h in out['H1']))

    def test_fall_back_hour_merged(self):
        rows = hours('2026-11-01T03:00', 6)          # New York 01:00 EDT and 01:00 EST: the same server-time label
        h1 = B.h1_bars(rows)
        self.assertEqual(len(h1), 5)
        self.assertEqual(len({b.d for b in h1}), 5)

    def test_utc_days_weeks_months(self):
        d1 = [[(dt.date(2026, 8, 1) + dt.timedelta(days=k)).isoformat(), 1, 2, 0.5, 1.5, 1] for k in range(89)]  # to Oct 28
        out = B.chain([], d1, now=self.NOW)
        self.assertEqual(out['D1'][0].d, '2026-08-01T00:00')
        self.assertTrue(all(dt.date.fromisoformat(b.d[:10]).weekday() == 5 for b in out['W1']))   # Saturday weeks
        self.assertEqual(out['W1'][-1].d, '2026-10-17T00:00')     # the week of Oct 24 is still open on Oct 29
        self.assertEqual([b.d for b in out['MN']], ['2026-08-01T00:00', '2026-09-01T00:00'])   # October is open


class Fallbacks(TmpCache):
    NOW = epoch('2026-10-29T13:30') + 0.0

    def coinbase_answer(self, url):
        q = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
        s = int(q['granularity'])
        a = epoch(q['start'][:16])
        b = epoch(q['end'][:16])
        listed = epoch('2026-01-01T00:00')
        rows = [[t, 99.0, 101.0, 100.0, 100.5, 3.0] for t in range(max(a, listed), b + 1, s)]
        return rows[::-1]                                        # newest first, [time, low, high, open, close, vol]

    def test_coinbase_cold_paging_and_columns(self):
        calls = []

        def get(url):
            calls.append(url)
            return self.coinbase_answer(url)
        rec = CR.update({'name': 'BTC_USD', 'sym': 'BTCUSD', 'providers': [['coinbase', 'BTC-USD'], ['kraken', 'XBTUSD']]},
                        get=get, now=self.NOW)
        self.assertEqual(rec['src'], 'coinbase')
        self.assertTrue(all('coinbase' in u for u in calls))
        self.assertEqual(rec['h1'][-1][0], epoch('2026-10-29T12:00'))           # the 13:00 hour is still open
        self.assertEqual(rec['h1'][0][1:5], [100.0, 101.0, 99.0, 100.5])         # o, h, l, c re-ordered
        self.assertEqual(rec['d1'][-1][0], '2026-10-28')
        self.assertEqual(len(rec['h1']), len({r[0] for r in rec['h1']}))
        # incremental: one request per TF from the last cached candle
        calls.clear()
        rec2 = CR.update({'name': 'BTC_USD', 'sym': 'BTCUSD', 'providers': [['coinbase', 'BTC-USD']]}, get=get, now=self.NOW + 3 * 3600)
        self.assertEqual(len(calls), 1)                                          # D1: nothing new can have closed
        self.assertEqual(rec2['h1'][-1][0], epoch('2026-10-29T15:00'))

    def test_fallback_to_kraken_then_cache(self):
        def get(url):
            if 'coinbase' in url:
                raise OSError('blocked')
            iv = int(dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))['interval'])
            t0 = epoch('2026-10-01T00:00')
            rows = [[t, '1', '2', '0.5', '1.5', '1.2', '7', 3] for t in range(t0, int(self.NOW), iv * 60)]
            return {'error': [], 'result': {'XXBTZUSD': rows, 'last': rows[-1][0]}}
        logs = []
        spec = {'name': 'BTC_USD', 'sym': 'BTCUSD', 'providers': [['coinbase', 'BTC-USD'], ['kraken', 'XBTUSD']]}
        rec = CR.update(spec, get=get, now=self.NOW, log=logs.append)
        self.assertEqual(rec['src'], 'kraken')
        self.assertTrue(any('coinbase failed' in m for m in logs))
        self.assertEqual(rec['h1'][-1][5], 7.0)
        # everything down: the cached candles are used, never a crash
        rec3 = CR.update(spec, get=lambda u: (_ for _ in ()).throw(OSError('down')), now=self.NOW + 7200, log=logs.append)
        self.assertEqual(rec3['h1'], rec['h1'])
        with self.assertRaises(RuntimeError):
            CR.update({**spec, 'name': 'ETH_USD'}, get=lambda u: (_ for _ in ()).throw(OSError('down')), now=self.NOW)

    def test_okx_and_binanceus_parsing(self):
        def okx(url):
            q = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
            after = int(q['after']) // 1000
            step = 3600 if q['bar'] == '1H' else 86400
            self.assertIn(q['bar'], ('1H', '1Dutc'))
            start = after // step * step - step
            data = [[str(t * 1000), '600', '610', '590', '605', '9', '0', '0', '1'] for t in range(start, start - 100 * step, -step)
                    if t >= epoch('2026-06-01T00:00')]
            return {'code': '0', 'msg': '', 'data': data}
        rec = CR.update({'name': 'BNB_USD', 'sym': 'BNBUSD', 'providers': [['binanceus', 'BNBUSDT'], ['okx', 'BNB-USDT']]},
                        get=lambda u: okx(u) if 'okx' in u else (_ for _ in ()).throw(OSError('451')), now=self.NOW)
        self.assertEqual(rec['src'], 'okx')
        self.assertEqual(rec['h1'][-1][0], epoch('2026-10-29T12:00'))
        self.assertEqual(rec['d1'][-1][0], '2026-10-28')

        def bus(url):
            q = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
            s = 3600 if q['interval'] == '1h' else 86400
            st = int(q['startTime']) // 1000
            return [[t * 1000, '600', '610', '590', '605', '9', t * 1000 + s * 1000 - 1] for t in range(st // s * s, int(self.NOW) + 1, s)][:1000]
        rec = CR.update({'name': 'BNB2_USD', 'sym': 'BNBUSD', 'providers': [['binanceus', 'BNBUSDT']]}, get=bus, now=self.NOW)
        self.assertEqual(rec['h1'][-1][0], epoch('2026-10-29T12:00'))

    def yahoo_js(self, t0, n, step, gmtoff=-14400, reg=None):
        ts = [t0 + k * step for k in range(n)]
        q = {'open': [10.0] * n, 'high': [11.0] * n, 'low': [9.0] * n, 'close': [10.5] * n, 'volume': [5] * n}
        q['close'][3] = None                                    # Yahoo's null bars are skipped
        meta = {'gmtoffset': gmtoff, 'currentTradingPeriod': {'regular': reg or {}}}
        return {'chart': {'result': [{'timestamp': ts, 'indicators': {'quote': [q]}, 'meta': meta}], 'error': None}}

    def test_yahoo_parse_and_open_session(self):
        now = self.NOW
        js = self.yahoo_js(epoch('2026-10-29T08:30'), 6, 3600)
        rows = YH.parse(js, 'H1', now)
        self.assertEqual([r[0] for r in rows], [epoch('2026-10-29T08:30'), epoch('2026-10-29T09:30'), epoch('2026-10-29T10:30'),
                                                epoch('2026-10-29T12:30')])   # 11:30 null, 13:30 forming
        d = self.yahoo_js(epoch('2026-10-26T13:30'), 4, 86400, reg={'start': epoch('2026-10-29T13:30'), 'end': epoch('2026-10-29T20:00')})
        self.assertEqual([r[0] for r in YH.parse(d, 'D1', now)], ['2026-10-26', '2026-10-27', '2026-10-28'])

    def test_yahoo_blocked_skips_never_fails(self):
        logs = []
        spec = {'name': 'VIX', 'sym': 'VIX', 'yahoo': ['^VIX']}

        def blocked(url):
            raise OSError('HTTP 429')
        with self.assertRaises(RuntimeError):
            YH.update(spec, get=blocked, log=logs.append)
        self.assertTrue(any('Yahoo' in m for m in logs))
        # the scanner records the instrument as an error, the scan goes on
        uni = [{'name': 'VIX', 'sym': 'VIX', 'cls': 'cfd', 'source': 'yahoo', 'type': 'CFD'}]
        with mock.patch.object(SRC.yahoo, 'get_json', blocked):
            res = X.run(uni, X.make_getter(log=logs.append), workers=1, log=None)
        self.assertIn('VIX', res['errors'])
        self.assertEqual(res['analyses'], {})

    def test_yahoo_second_candidate(self):
        def get(url):
            if 'TX60' in urllib.parse.unquote(url):
                raise OSError('404')
            step = 3600 if 'interval=1h' in url else 86400
            return self.yahoo_js(epoch('2026-10-01T13:30'), 20, step)
        rec = YH.update({'name': 'CA60', 'sym': 'CA60', 'yahoo': ['^TX60', 'XIU.TO']}, get=get, now=self.NOW)
        self.assertEqual(rec['src'], 'XIU.TO')


class CryptoScan(TmpCache):
    """A crypto instrument end to end: 24/7 bars, the volatility pip, no weekend-gap rule, cls 'crypto'."""

    def bars(self):
        # 24/7 H1 walk from the synthetic generator's H4 walk, re-timed on every hour of the week
        w = synth_fx.h4_walk(5, n=2500, start=60000.0, vol=0.004)
        rows, t = [], epoch('2025-06-01T00:00')
        for b in w:
            for k, (o, c) in enumerate(((b.o, b.l), (b.l, b.h), (b.h, (b.h + b.c) / 2), ((b.h + b.c) / 2, b.c))):
                rows.append([t, o, max(o, c), min(o, c), c, 1])
                t += 3600
        d1, day = [], {}
        for r in rows:
            k = dt.datetime.fromtimestamp(r[0], dt.timezone.utc).strftime('%Y-%m-%d')
            if k not in day:
                day[k] = [k, r[1], r[2], r[3], r[4], 1]
                d1.append(day[k])
            else:
                x = day[k]
                x[2], x[3], x[4] = max(x[2], r[2]), min(x[3], r[3]), r[4]
        now = dt.datetime.fromtimestamp(rows[-1][0] + 3600, dt.timezone.utc).replace(tzinfo=None)
        return B.chain(rows, d1[:-1], now=now)

    def test_crypto_analysis(self):
        x = SRC.spec('BTCUSD')
        self.assertEqual((x['cls'], x['pip_mode'], x['spread']), ('crypto', 'atr', 34.0))
        bars = self.bars()
        inst = {**SRC.meta(x), 'sym': 'BTCUSD', 'group': 'CRYPTO', 'wl': True}
        an = F.analyse(inst, bars, 34.0)
        d1 = bars['D1']
        tr = [max(b.h, a.c) - min(b.l, a.c) for a, b in zip(d1[-15:-1], d1[-14:])]
        self.assertAlmostEqual(an.pip, sum(tr) / len(tr) / C.ATR_PIP_REF)
        self.assertGreater(an.pip, 1.0)                         # dollars, not 0.0001
        self.assertAlmostEqual(an.p['sl_min'], C.SL_MIN_PIPS * an.pip)
        for z in an.rows['H4'].zones:
            if z.zid in an.dna:
                rules = F.zone_rules(an, z, an.dna[z.zid])
                self.assertNotIn('weekend', {r.short for r in rules})
                self.assertNotIn('market TF', {r.short for r in rules if r.status == F.FAIL})
                break
        f = X.inst_fields(an.inst)
        self.assertEqual((f['cls'], f['src'], f['pip_mode']), ('crypto', 'crypto', 'atr'))
        self.assertNotIn('unofficial', f)

    def test_universe_classes(self):
        wl = W.load(None)
        X.attach_extra(wl, log=None)
        uni = X.universe([], wl, include_cfd=False, extra=X.extra_meta())
        cls = {i['sym']: i['cls'] for i in uni}
        self.assertEqual(cls['SOLUSD'], 'crypto')
        self.assertEqual(cls['EURMXN'], 'exotic')
        self.assertEqual(cls['VIX'], 'cfd')
        vix = next(i for i in uni if i['sym'] == 'VIX')
        self.assertTrue(vix['unofficial'] and vix['context_only'] and vix['tv'] == 'PEPPERSTONE:VIX')
        self.assertTrue(X.inst_fields(vix)['unofficial'])
        self.assertEqual(len(X.crypto_universe()), 15)


class Telegram(unittest.TestCase):
    def test_feed_lines(self):
        import fxnotify as N
        self.assertEqual(N.feed_line({'src': 'yahoo', 'unofficial': True, 'feed': 'Yahoo ^VIX (unofficial feed)'}),
                         'data: unofficial feed (Yahoo ^VIX)')
        self.assertEqual(N.feed_line({'src': 'synthetic', 'feed': 'synthetic: OANDA EUR_USD x USD_MXN'}),
                         'data: synthetic (OANDA EUR_USD x USD_MXN)')
        self.assertTrue(N.feed_line({'src': 'synthetic', 'approx': True, 'feed': 'synthetic: OANDA legs'}).startswith('data: approximate basket'))
        self.assertEqual(N.feed_line({'src': 'crypto', 'feed': 'Coinbase'}), '')
        self.assertEqual(N.feed_line({'sym': 'EURUSD'}), '')
        z = {'sym': 'VIX', 'tf': 'D1', 'side': 'demand', 'sec': 'in', 'prox': 15.2, 'digits': 2, 'src': 'yahoo', 'unofficial': True,
             'feed': 'Yahoo ^VIX (unofficial feed)', 'loc_ok': True, 'status': 'context', 'label': 'context only', 'touches': 0}
        self.assertIn('unofficial feed (Yahoo ^VIX)', N.zone_line(z))


class Coverage(unittest.TestCase):
    def test_committed_watchlist_has_no_unmapped_left(self):
        known = {i['name'] for i in C.load_fallback()} | {'EUR_USD', 'USD_JPY', 'SPX500_USD', 'US30_USD', 'NAS100_USD',
                                                          'US2000_USD', 'DE30_EUR', 'FR40_EUR', 'EU50_EUR', 'UK100_GBP',
                                                          'JP225Y_JPY', 'CHINAH_HKD', 'AU200_AUD', 'HK33_HKD', 'CN50_USD',
                                                          'NL25_EUR', 'ESPIX_EUR', 'CH20_CHF', 'WTICO_USD', 'BCO_USD',
                                                          'NATGAS_USD', 'XCU_USD', 'CORN_USD', 'WHEAT_USD', 'SOYBN_USD', 'SUGAR_USD'}
        old = os.environ.pop('FX_WATCHLIST', None)
        try:
            wl = W.load(known)
        finally:
            if old is not None:
                os.environ['FX_WATCHLIST'] = old
        before = {W.tv_ticker(u['symbol']) for u in wl['unmapped']}
        self.assertEqual(len(before), 35, sorted(before))
        added = X.attach_extra(wl, log=None)
        self.assertEqual(len(added), 35)
        self.assertEqual(wl['unmapped'], [])
        self.assertEqual(before, {x['sym'] for x in SRC.registry()})
        # file order kept: the groups do not split
        secs = [wl['sections'][n] for n in wl['names']]
        seen, prev = set(), None
        for s in secs:
            if s != prev:
                self.assertNotIn(s, seen)
                seen.add(s)
            prev = s


class WeekendSchedule(TmpCache):
    def test_check_runs_crypto_only_when_forex_is_done(self):
        out = os.path.join(self._d.name, 'gh_out')
        pub = os.path.join(self._d.name, 'state.json')
        with open(pub, 'w') as f:
            json.dump({'last_h1': '2026-10-31T00:00', 'last_h1_crypto': '2026-11-01T10:00'}, f)
        env = {**os.environ, 'GITHUB_OUTPUT': out, 'OANDA_API_TOKEN': 'x'}
        with mock.patch.dict(os.environ, env), mock.patch.object(C, 'PUBLIC_STATE', pub), \
                mock.patch.object(X.O, 'latest_h1', return_value='2026-10-31T00:00'), \
                mock.patch.object(X, 'crypto_latest_h1', return_value='2026-11-01T11:00'), \
                contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(X.main(['--check']), 0)
        txt = _read(out)
        self.assertIn('scan=true', txt)
        self.assertIn('crypto=true', txt)
        os.remove(out)
        with mock.patch.dict(os.environ, env), mock.patch.object(C, 'PUBLIC_STATE', pub), \
                mock.patch.object(X.O, 'latest_h1', return_value='2026-10-31T00:00'), \
                mock.patch.object(X, 'crypto_latest_h1', return_value='2026-11-01T10:00'), \
                contextlib.redirect_stdout(io.StringIO()):
            X.main(['--check'])
        self.assertIn('scan=false', _read(out))
        os.remove(out)
        # a new forex candle: the normal full scan (it includes crypto)
        with mock.patch.dict(os.environ, env), mock.patch.object(C, 'PUBLIC_STATE', pub), \
                mock.patch.object(X.O, 'latest_h1', return_value='2026-11-02T01:00'), \
                mock.patch.object(X, 'crypto_latest_h1', return_value='2026-11-02T01:00'), \
                contextlib.redirect_stdout(io.StringIO()):
            X.main(['--check'])
        txt = _read(out)
        self.assertIn('scan=true', txt)
        self.assertIn('crypto=false', txt)

    def test_crypto_latest_label(self):
        t = epoch('2026-10-31T14:00')
        with mock.patch.object(SRC.crypto, 'latest_h1', return_value=t):
            self.assertEqual(X.crypto_latest_h1(), C.label(str(t), 'H1'))
        with mock.patch.object(SRC.crypto, 'latest_h1', return_value=None):
            self.assertIsNone(X.crypto_latest_h1())

    def test_merge_public_replaces_crypto_only(self):
        sig = lambda sym, k, cls: {'sym': sym, 'kind': k, 'wl': True, 'score': 5, 'to_entry_pips': 3, 'cls': cls}  # noqa: E731
        empty = {s: {k: [] for k in F.SECTIONS} for s in ('demand', 'supply')}
        old = {'version': 1, 'generated': 'a', 'h4': 'H4', 'signals': [sig('EURUSD', 'BUY', 'major'), sig('BTCUSD', 'SELL', 'crypto')],
               'watch': [], 'map': [{'sym': 'EURUSD', 'cls': 'major', 'wl': True}, {'sym': 'BTCUSD', 'cls': 'crypto', 'wl': True, 'px': 1},
                                    {'sym': 'ETHUSD', 'cls': 'crypto', 'wl': True, 'px': 2}],
               'lists': empty, 'errors': {'BTCUSD': 'x'}, 'groups': [{'name': 'G', 'symbols': ['EURUSD']}]}
        new = {'version': 1, 'generated': 'b', 'signals': [sig('BTCUSD', 'BUY', 'crypto')], 'watch': [], 'invalidated': [],
               'map': [{'sym': 'BTCUSD', 'cls': 'crypto', 'wl': True, 'px': 3}], 'lists': empty, 'errors': {}, 'crypto_h1': 'C'}
        m = X.merge_public(old, new, {'BTCUSD'})
        self.assertEqual(sorted((s['sym'], s['kind']) for s in m['signals']), [('BTCUSD', 'BUY'), ('EURUSD', 'BUY')])
        self.assertEqual([r['sym'] for r in m['map']], ['EURUSD', 'BTCUSD', 'ETHUSD'])
        self.assertEqual(m['map'][1]['px'], 3)
        self.assertEqual(m['map'][2]['px'], 2)                    # no data this run: the last full-scan row stays
        self.assertEqual((m['h4'], m['generated'], m['crypto_h1'], m['errors']), ('H4', 'b', 'C', {}))
        self.assertEqual(m['counts']['BUY'], 2)


if __name__ == '__main__':
    unittest.main()
