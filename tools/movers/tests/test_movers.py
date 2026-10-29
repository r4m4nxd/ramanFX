"""Big moves on every timeframe (tools/movers/movers.py), offline: fake OANDA / Alpaca / crypto answers, the
published scan files."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
import urllib.parse
from types import SimpleNamespace
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import movers as M  # noqa: E402

UTC = dt.timezone.utc
FRI = dt.datetime(2026, 10, 30, 21, 5, tzinfo=UTC)        # Friday 17:05 New York (EDT), 3:05 PM Calgary: 1H+4H+1D+1W
THU = dt.datetime(2026, 10, 29, 14, 5, tzinfo=UTC)        # Thursday 10:05 New York: 1H only
ENV = {'OANDA_API_TOKEN': 'tok', 'ALPACA_KEY_ID': 'id', 'ALPACA_SECRET_KEY': 'sec'}
GRAN = {'H1': 'H1', 'H4': 'H4', 'D': 'D1', 'W': 'W1'}
ATF = {'1Hour': 'H1', '1Day': 'D1', '1Week': 'W1'}


def series(last_start: dt.datetime, span_h: float, n: int, big: bool, base: float = 100.0):
    """n candles, the last starting at last_start, true range 1.0 (1% of 100); the last one 8.0 and +5 when big."""
    out = []
    for k in range(n):
        t = last_start - dt.timedelta(hours=span_h * (n - 1 - k))
        last = big and k == n - 1
        r, c = (8.0, base + 5.0) if last else (1.0, base)
        out.append({'t': t.strftime('%Y-%m-%dT%H:%M:%S'), 'o': base, 'h': max(base, c) + (r - abs(c - base)) / 2,
                    'l': min(base, c) - (r - abs(c - base)) / 2, 'c': c})
    return out


def fake(now, big_fx=('XAU_USD',), big_st=('NVDA',), big_crypto=('BTC-USD',), seen=None):
    """A getter for OANDA + Alpaca and a crypto provider module, candles on each family's grid for `now`."""
    def get(url, headers):
        if seen is not None:
            seen.append((url, dict(headers)))
        q = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
        if 'oanda.com' in url:
            name = url.split('/instruments/')[1].split('/')[0]
            tf = GRAN[q['granularity']]
            c = M.latest_close(tf, 'fx', now)
            first = c - dt.timedelta(hours=M.SPAN_H[tf] if tf != 'W1' else 168)
            bs = series(first, M.SPAN_H[tf], 26, name in big_fx)
            cs = [{'complete': True, 'time': b['t'] + '.000000000Z', 'bid': {k: str(b[k]) for k in 'ohlc'}} for b in bs]
            return {'candles': cs + [{'complete': False, 'time': '2030-01-01T00:00:00.000000000Z', 'bid': {'o': '1', 'h': '1', 'l': '1', 'c': '1'}}]}
        tf = ATF[q['timeframe']]
        c = M.latest_close(tf, 'stock', now)
        first = {'H1': c - dt.timedelta(hours=1), 'D1': c - dt.timedelta(hours=17), 'W1': c - dt.timedelta(hours=113)}[tf]
        syms = q['symbols'].split(',')
        return {'bars': {s: [{**b, 't': b['t'] + 'Z'} for b in series(first, {'H1': 1, 'D1': 24, 'W1': 168}[tf], 30, s in big_st)] for s in syms}}

    def coinbase(pid, tf, since, ts, g):
        step = 3600 if tf == 'H1' else 86400
        end = int(ts // step * step) - step                 # the newest complete candle
        n = int((end - since) // step)
        bs = series(dt.datetime.fromtimestamp(end, UTC), step / 3600, n, pid in big_crypto and tf == 'H1')
        if pid in big_crypto and tf == 'D1':
            bs = series(dt.datetime.fromtimestamp(end, UTC), 24, n, True)
        return [[int(M._t(b['t']).timestamp()), b['o'], b['h'], b['l'], b['c'], 1.0] for b in bs] + [[end + step, 1, 1, 1, 1, 1]]
    mod = SimpleNamespace(PROVIDERS={'coinbase': coinbase, 'kraken': coinbase, 'binanceus': coinbase, 'okx': coinbase})
    return get, mod


class Closes(unittest.TestCase):
    def ev(self, now, sent=None, test=False):
        return {M.ekey(*e) for e in M.due_events(now, sent or {}, test)}

    def at(self, now):
        """Only the closes of this very hour (earlier ones in their catch-up window are due too on an empty state)."""
        return {k for k in self.ev(now) if k.endswith(now.strftime('%Y-%m-%dT%H'))}

    def test_friday_new_york_close_is_every_timeframe(self):
        got = self.ev(FRI)
        for k in ('W1:fx:2026-10-30T21', 'D1:fx:2026-10-30T21', 'H4:fx:2026-10-30T21', 'H1:fx:2026-10-30T21',
                  'W1:stock:2026-10-30T21', 'D1:stock:2026-10-30T21', 'H1:stock:2026-10-30T21',
                  'H4:crypto:2026-10-30T21', 'H1:crypto:2026-10-30T21'):
            self.assertIn(k, got)
        self.assertFalse(any(k.startswith(('D1:crypto', 'W1:crypto', 'H4:stock')) for k in got))   # no stock 4H

    def test_h4_grid_new_york_17_21_01_05_09_13(self):
        self.assertEqual(self.at(THU), {'H1:fx:2026-10-29T14', 'H1:crypto:2026-10-29T14', 'H1:stock:2026-10-29T14'})
        h4 = self.at(dt.datetime(2026, 10, 29, 13, 5, tzinfo=UTC))           # 09:00 New York
        self.assertIn('H4:fx:2026-10-29T13', h4)
        self.assertIn('H4:crypto:2026-10-29T13', h4)
        closes = [h for h in range(24) if M.is_close('H4', 'fx', dt.datetime(2026, 10, 28, h, tzinfo=UTC))]
        self.assertEqual(closes, [1, 5, 9, 13, 17, 21])                         # UTC in EDT = NY 21, 01, 05, 09, 13, 17
        winter = [h for h in range(24) if M.is_close('H4', 'fx', dt.datetime(2026, 11, 4, h, tzinfo=UTC))]
        self.assertEqual(winter, [2, 6, 10, 14, 18, 22])                        # EST

    def test_crypto_utc_day_and_saturday_week_and_weekend(self):
        sat = self.at(dt.datetime(2026, 10, 31, 0, 5, tzinfo=UTC))
        self.assertIn('D1:crypto:2026-10-31T00', sat)
        self.assertIn('W1:crypto:2026-10-31T00', sat)                            # Saturday 00:00 UTC
        self.assertFalse(any(k.split(':')[1] in ('fx', 'stock') for k in sat))   # forex closed, no US session
        sun = self.ev(dt.datetime(2026, 11, 1, 0, 5, tzinfo=UTC))
        self.assertIn('D1:crypto:2026-11-01T00', sun)
        self.assertNotIn('W1:crypto:2026-11-01T00', sun)
        # EST week: Friday 17:00 New York = 22:00 UTC, the first forex candle of Sunday closes 18:00 New York
        self.assertIn('W1:fx:2026-11-06T22', self.ev(dt.datetime(2026, 11, 6, 22, 5, tzinfo=UTC)))
        self.assertNotIn('H1:fx:2026-11-01T22', self.ev(dt.datetime(2026, 11, 1, 22, 5, tzinfo=UTC)))
        self.assertIn('H1:fx:2026-11-01T23', self.ev(dt.datetime(2026, 11, 1, 23, 5, tzinfo=UTC)))

    def test_a_missed_run_still_catches_the_daily_once(self):
        later = dt.datetime(2026, 10, 30, 23, 10, tzinfo=UTC)
        got = self.ev(later)
        self.assertIn('D1:fx:2026-10-30T21', got)
        self.assertIn('W1:stock:2026-10-30T21', got)
        self.assertNotIn('H1:fx:2026-10-30T21', got)                             # 1H: only the last hour
        self.assertNotIn('D1:fx:2026-10-30T21', self.ev(later, {'D1:fx:2026-10-30T21': 'x'}))
        self.assertNotIn('D1:fx:2026-10-29T21', self.ev(dt.datetime(2026, 10, 30, 18, 5, tzinfo=UTC)))   # > 20 h

    def test_test_mode_takes_the_last_closed_bars(self):
        got = self.ev(dt.datetime(2026, 10, 31, 12, 5, tzinfo=UTC), test=True)   # Saturday noon
        self.assertIn('W1:fx:2026-10-30T21', got)
        self.assertIn('D1:stock:2026-10-30T21', got)
        self.assertIn('W1:crypto:2026-10-31T00', got)

    def test_labels(self):
        s, e = M.last_hour(THU)
        self.assertEqual(M.hour_label(s, e), '7:00–8:00 AM')
        c = dt.datetime(2026, 10, 30, 21, tzinfo=UTC)
        self.assertEqual(M.span_label('W1', c, ['fx', 'stock']), 'week closed Fri 3:00 PM')
        self.assertEqual(M.span_label('H4', c, ['fx']), '11:00 AM–3:00 PM')
        self.assertEqual(M.span_label('D1', dt.datetime(2026, 10, 31, tzinfo=UTC), ['crypto']), 'day (UTC) closed Fri 6:00 PM')


class Measure(unittest.TestCase):
    def test_multiple_and_window(self):
        c = dt.datetime(2026, 10, 29, 14, tzinfo=UTC)
        m = M.measure(series(c - dt.timedelta(hours=1), 1, 26, True), c, 1)
        self.assertAlmostEqual(m['x'], 8.0)
        self.assertAlmostEqual(m['pct'], 5.0)
        self.assertIsNone(M.measure(series(c - dt.timedelta(hours=2), 1, 26, True), c, 1))   # the hour is not there
        self.assertIsNone(M.measure(series(c - dt.timedelta(hours=1), 1, 15, True), c, 1))   # too little history
        fri = dt.datetime(2026, 10, 30, 21, tzinfo=UTC)
        self.assertIsNotNone(M.measure(series(fri - dt.timedelta(hours=168), 168, 26, True), fri, 168))   # OANDA Friday label
        self.assertIsNotNone(M.measure(series(fri - dt.timedelta(hours=113), 168, 26, True), fri, 168))   # Alpaca Monday label
        self.assertIsNone(M.measure(series(fri - dt.timedelta(hours=40), 24, 26, True), fri, 24))         # yesterday (holiday)

    def test_crypto_h4_and_w1_grids(self):
        now = dt.datetime(2026, 10, 29, 14, 5, tzinfo=UTC)
        h1 = series(dt.datetime(2026, 10, 29, 13, tzinfo=UTC), 1, 30, False)
        h4 = M.h4_from_h1(h1, now)
        self.assertEqual(h4[-1]['t'], '2026-10-29T09:00:00')                   # 05:00-09:00 NY bucket closed at 13:00Z
        self.assertEqual(h4[-1]['n'], 4)
        d1 = series(dt.datetime(2026, 10, 30, tzinfo=UTC), 24, 30, False)
        w1 = M.w1_from_d1(d1, dt.datetime(2026, 10, 31, 0, 5, tzinfo=UTC))
        self.assertEqual(w1[-1]['t'], '2026-10-24T00:00:00')                   # Saturday start, closed Saturday 00:00 UTC

    def test_thresholds_per_timeframe_and_group(self):
        base = {'x': 2.5, 'pct': 1.0, 'body_x': 0, 'body_pct': 0, 'gap_pct': 0}
        self.assertTrue(M.qualifies({**base, 'group': 'fx', 'tf': 'D1', 'range_pct': 0.7})[0])
        self.assertFalse(M.qualifies({**base, 'group': 'fx', 'tf': 'W1', 'range_pct': 0.7})[0])        # W1 needs 1.2%
        self.assertFalse(M.qualifies({**base, 'group': 'crypto', 'tf': 'D1', 'range_pct': 2.0})[0])    # crypto D1 3%
        self.assertFalse(M.qualifies({**base, 'x': 1.9, 'group': 'idx', 'tf': 'H4', 'range_pct': 5})[0])
        ok, tags = M.qualifies({**base, 'x': 1.2, 'group': 'stock', 'tf': 'D1', 'range_pct': 2, 'gap_pct': -3.4})
        self.assertTrue(ok)
        self.assertEqual(tags, ['gap ▼3.4%'])
        ok, tags = M.qualifies({**base, 'x': 1.5, 'group': 'stock', 'tf': 'D1', 'range_pct': 4, 'body_x': 2.4, 'body_pct': 3.5})
        self.assertEqual((ok, tags), (True, ['big body']))
        self.assertFalse(M.qualifies({**base, 'x': 1.5, 'group': 'stock', 'tf': 'H1', 'range_pct': 4, 'gap_pct': 9})[0])


def row(sym, group, tf, x=2.5, pct=1.2, ctx='', **k):
    return {'sym': sym, 'group': group, 'tf': tf, 'x': x, 'pct': pct, 'range_pct': 2.0, 'ctx': ctx,
            'market': 'stock' if group == 'stock' else 'fx', 'tags': [], **k}


class Message(unittest.TestCase):
    C = '2026-10-30T21:00:00+00:00'

    def sec(self, tf, rows, fams=('fx',), close=None, feed=''):
        return {'tf': tf, 'close': close or self.C, 'fams': list(fams), 'feed': feed, 'rows': rows}

    def test_sections_highest_first_grouped_one_line_each(self):
        secs = [self.sec('W1', [row('XAUUSD', 'fx', 'W1', ctx='into W1 demand ⭐'), row('NVDA', 'stock', 'W1', pct=-6.4, tags=['gap ▼3.1%'])], ('fx', 'stock'), feed='SIP'),
                self.sec('D1', [row('GBPJPY', 'fx', 'D1', x=2.6, ctx='into D1 supply'), row('US500', 'idx', 'D1', pct=-0.42)]),
                self.sec('H4', [row('BTCUSD', 'crypto', 'H4', x=3.0)], ('fx', 'crypto')),
                self.sec('H1', [row('AAPL', 'stock', 'H1')], ('fx', 'stock'), feed='IEX real-time')]
        m = M.build(secs)
        t = str(m)
        self.assertTrue(t.startswith('<b>⚡ Big moves · 1W · 1D · 4H · 1H</b>'))
        pos = [t.index(h) for h in ('🟪 1W', '🟦 1D', '🟩 4H', '⬜ 1H')]
        self.assertEqual(pos, sorted(pos))
        self.assertIn('<b>🟪 1W</b> · week closed Fri 3:00 PM', t)
        self.assertIn('▲ <b>GBPJPY</b> +1.2% · 2.6× · into D1 supply', t)
        self.assertIn('▼ <b>US500</b> -0.42% · 2.5×', t)
        self.assertIn('▼ <b>NVDA</b> -6.4% · 2.5× · gap ▼3.1%', t)
        self.assertIn('<i>Stocks</i> · SIP', t)
        lines = t.split('\n')
        self.assertLess(lines.index('<i>Forex &amp; metals</i>') if '<i>Forex &amp; metals</i>' in lines else lines.index('<i>Forex & metals</i>'),
                        lines.index('<i>Stocks</i> · SIP'))
        self.assertIn('<i>Indices & commodities</i>', t)
        self.assertIn('<i>Crypto</i>', t)
        self.assertIn('⭐ Kevin zone', t)
        self.assertIn('Calgary time · not advice', t)
        cbs = [b['callback_data'] for r in m.buttons for b in r]
        self.assertEqual(cbs, ['c:XAUUSD', 'c:NVDA', 'c:GBPJPY'])            # top 3, highest timeframe first

    def test_long_group_top_8_then_more_link_and_always_fits(self):
        rows = [row(f'S{i:03d}', 'stock', 'D1', x=10 - i / 100) for i in range(12)]
        t = str(M.build([self.sec('D1', rows, ('stock',))]))
        self.assertEqual(sum(1 for x in t.split('\n') if '<b>S0' in x), 8)
        self.assertIn('+4 more → <a href="https://raman-fx.vercel.app/moves#d1">app</a>', t)
        many = [self.sec(tf, [row(f'{g[:2].upper()}{i:03d}', g, tf, why={'line': '   📰 why: ' + 'w' * 80}) for g in M.GROUPS for i in range(40)])
                for tf in ('W1', 'D1', 'H4', 'H1')]
        big = M.build(many)
        self.assertLessEqual(M.SN.u16(str(big)), M.SN.SAFE)
        self.assertIn('more → ', str(big))
        for h in ('🟪 1W', '🟦 1D', '🟩 4H', '⬜ 1H'):
            self.assertIn(h, str(big))                                         # every timeframe survives the trim

    def test_h1_only_keeps_the_hour_title_and_nothing_means_no_message(self):
        t = str(M.build([self.sec('H1', [row('EURUSD', 'fx', 'H1')], close='2026-10-29T14:00:00+00:00')]))
        self.assertTrue(t.startswith('<b>⚡ Big moves · last hour (7:00–8:00 AM)</b>'))
        self.assertIsNone(M.build([self.sec('H1', [])]))
        s = str(M.build([self.sec('D1', [row('EURUSD', 'fx', 'D1')])], test=True))
        self.assertTrue(s.startswith('<b>🧪 Sample big moves (all timeframes)'))


@mock.patch.dict(os.environ, ENV)
class Run(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.state = os.path.join(self.tmp.name, 'state.json')
        self.latest = os.path.join(self.tmp.name, 'latest.json')
        self.sent = []

    def tearDown(self):
        self.tmp.cleanup()

    def seed(self, now):
        """State as after the previous runs: every earlier close handled."""
        keys = {M.ekey(*e): 'x' for e in M.due_events(now, {}) if e[2] < now.replace(minute=0)}
        with open(self.state, 'w') as f:
            json.dump({'sent': keys}, f)

    def go(self, now=FRI, test=False, prefs=None, seen=None, **k):
        get, mod = fake(now, seen=seen, **k)
        with mock.patch.object(M, '_crypto_mod', lambda: mod):
            return M.run(now, get=get, test=test, prefs=prefs, state_path=self.state, latest_path=self.latest,
                         send=lambda ms: self.sent.extend(ms) or True, log=lambda *_: None)

    def test_friday_close_one_message_all_timeframes_then_deduped(self):
        seen = []
        m = self.go(seen=seen)
        self.assertEqual(len(self.sent), 1)
        t = str(m)
        for h in ('🟪 1W', '🟦 1D', '🟩 4H', '⬜ 1H'):
            self.assertIn(f'<b>{h}</b>', t)
        self.assertIn('▲ <b>XAUUSD</b> +5.0% · 8.0×', t)
        self.assertIn('▲ <b>NVDA</b> +5.0% · 8.0×', t)
        self.assertIn('▲ <b>BTCUSD</b>', t)
        self.assertNotIn('EURUSD', t)
        self.assertIn('<i>Stocks</i> · SIP', t)
        self.assertIn('<i>Stocks</i> · IEX real-time', t)
        self.assertFalse(m.silent)
        self.assertTrue(all(h.get('Authorization') == 'Bearer tok' for u, h in seen if 'oanda' in u))
        self.assertTrue(all('alignmentTimezone=America%2FNew_York' in u for u, _ in seen if 'oanda' in u))
        self.assertTrue(any('granularity=W' in u for u, _ in seen))
        self.assertTrue(any('feed=sip' in u and 'timeframe=1Week' in u for u, _ in seen))
        self.assertTrue(all('feed=iex' in u for u, _ in seen if '1Hour' in u))
        self.assertTrue(all('tok' not in u and 'sec' not in u.split('?')[0] for u, _ in seen))   # tokens only in headers
        self.assertIsNone(self.go())                                            # same closes again: deduped
        self.assertEqual(len(self.sent), 1)
        with open(self.state) as f:
            st = json.load(f)
        self.assertIn('W1:fx:2026-10-30T21', st['sent'])
        self.assertEqual(st['last_msg_hour'], '2026-10-30T21')
        with open(self.latest) as f:
            app = json.load(f)
        tfs = [s['tf'] for s in app['sections']]
        self.assertEqual(tfs, sorted(tfs, key=lambda x: -M.RANK[x]))
        w1 = next(s for s in app['sections'] if s['tf'] == 'W1')
        self.assertIn('XAUUSD', [r['sym'] for r in w1['rows']])
        self.assertEqual(w1['label'], 'week closed Fri 3:00 PM')

    def test_nothing_qualifies_no_message_but_marked(self):
        self.seed(THU)
        self.assertIsNone(self.go(now=THU, big_fx=(), big_st=(), big_crypto=()))
        self.assertEqual(self.sent, [])
        with open(self.state) as f:
            self.assertIn('H1:fx:2026-10-29T14', json.load(f)['sent'])
        self.assertFalse(os.path.exists(self.latest))                           # a quiet 1H hour: no app file change

    def test_mutes(self):
        m = self.go(prefs={'mutes': [{'sym': 'XAUUSD', 'until_utc': '2026-11-05T00:00:00Z'}], 'quiet': None})
        self.assertNotIn('XAUUSD', str(m))
        self.assertIn('NVDA', str(m))

    def test_quiet_hours_hold_the_higher_timeframes_until_they_end(self):
        quiet = {'mutes': [], 'quiet': {'from': '14:00', 'to': '16:00', 'tz': 'America/Edmonton'}}   # 3:05 PM Calgary
        m = self.go(prefs=quiet)
        self.assertTrue(m.silent)
        t = str(m)
        self.assertIn('last hour', t)                                           # the 1H part goes out silently
        self.assertNotIn('🟪 1W', t)
        with open(self.state) as f:
            st = json.load(f)
        self.assertEqual(sorted(s['tf'] for s in st['held'])[-3:], ['D1', 'H4', 'W1'])
        self.assertIn('W1:fx:2026-10-30T21', st['sent'])                         # handled: held, never re-measured
        later = dt.datetime(2026, 10, 30, 22, 5, tzinfo=UTC)                     # 4:05 PM Calgary: quiet over
        m2 = self.go(now=later, prefs=quiet, big_fx=(), big_st=(), big_crypto=())
        self.assertEqual(len(self.sent), 2)
        t2 = str(m2)
        self.assertFalse(m2.silent)
        self.assertIn('<b>🟪 1W</b> · week closed Fri 3:00 PM · held over quiet hours', t2)
        self.assertIn('<b>🟦 1D</b>', t2)
        self.assertIn('XAUUSD', t2)
        with open(self.state) as f:
            self.assertEqual(json.load(f)['held'], [])
        self.assertIsNone(self.go(now=dt.datetime(2026, 10, 30, 23, 5, tzinfo=UTC), prefs=quiet, big_fx=(), big_st=(), big_crypto=()))

    def test_never_two_messages_in_one_hour(self):
        self.seed(THU)
        self.go(now=THU)
        self.assertEqual(len(self.sent), 1)
        with open(self.state) as f:
            st = json.load(f)
        st['sent'] = {k: v for k, v in st['sent'].items() if not k.startswith('H1:fx')}   # pretend a late close
        with open(self.state, 'w') as f:
            json.dump(st, f)
        self.assertIsNone(self.go(now=THU.replace(minute=40)))
        self.assertEqual(len(self.sent), 1)

    def test_sample_all_timeframes_touches_no_state(self):
        m = self.go(now=dt.datetime(2026, 10, 31, 12, 5, tzinfo=UTC), test=True, big_fx=(), big_st=(), big_crypto=())
        t = str(m)
        self.assertTrue(t.startswith('<b>🧪 Sample big moves (all timeframes)'))
        for h in ('🟪 1W', '🟦 1D', '🟩 4H', '⬜ 1H'):
            self.assertIn(h, t)
        self.assertFalse(os.path.exists(self.state))
        self.assertFalse(os.path.exists(self.latest))
        with mock.patch.dict(os.environ, {'OANDA_API_TOKEN': '', 'ALPACA_KEY_ID': ''}):
            get, _ = fake(FRI)
            with mock.patch.object(M, '_crypto_mod', lambda: (_ for _ in ()).throw(ImportError())):
                s = M.run(FRI, get=get, test=True, state_path=self.state, latest_path=self.latest,
                          send=lambda ms: True, log=lambda *_: None)
        self.assertIn('into W1 demand ⭐', str(s))                               # no data at all: the sample lines


class Context(unittest.TestCase):
    def test_into_broke_near(self):
        zs = [{'tf': 'W1', 'side': 'demand', 'proximal': 101.0, 'distal': 99.0}, {'tf': 'H4', 'side': 'demand', 'proximal': 100.5, 'distal': 99.5},
              {'tf': 'D1', 'side': 'supply', 'proximal': 103.3, 'distal': 104.0}]
        self.assertEqual(M._zone_hit(100.0, zs, False), ('into', zs[0]))      # highest TF first
        self.assertEqual(M._zone_hit(102.9, zs, True), ('near', zs[2]))       # 0.4% under a supply, moving up
        self.assertIsNone(M._zone_hit(102.9, zs, False))
        self.assertEqual(M._zone_hit(104.5, zs, True, o=102.0), ('broke', zs[2]))   # opened below, closed through
        self.assertEqual(M._zone_hit(98.0, zs, False, o=101.5), ('broke', zs[0]))
        m = {'market': 'fx', 'sym': 'XAUUSD', 'cls': 'metal', 'close': 100.0, 'pct': -1.0}
        shard = {'instruments': {'XAUUSD': {'zones': [], 'hits': [{'tf': 'W1', 'side': 'demand', 'prox': 101.0, 'dist': 99.0, 'kevin': {'n': 1}}]}}}
        ctx = M.context(m, {'signals': [{'sym': 'XAUUSD', 'kind': 'BUY'}]}, {}, lambda p: shard)
        self.assertEqual(ctx, 'into W1 demand ⭐ · BUY setup')

    def test_synthetic_compose(self):
        a = [{'t': 'x', 'o': 2.0, 'h': 2.2, 'l': 1.8, 'c': 2.1}]
        b = [{'t': 'x', 'o': 4.0, 'h': 4.4, 'l': 3.6, 'c': 4.0}]
        c = M.compose({'A': a, 'B': b}, {'A': 1, 'B': -1})[0]
        self.assertAlmostEqual(c['o'], 0.5)
        self.assertAlmostEqual(c['c'], 2.1 / 4.0)
        self.assertAlmostEqual(c['h'], 2.2 / 3.6)                             # upper bound: high / the other's low
        self.assertEqual(M.compose({'A': a, 'B': []}, {'A': 1, 'B': -1}), [])

    def test_groups(self):
        self.assertEqual(M.group_of({'cls': 'metal', 'group': ''}), 'fx')
        self.assertEqual(M.group_of({'cls': 'cfd', 'group': 'METALS'}), 'fx')         # copper with the metals
        self.assertEqual(M.group_of({'cls': 'cfd', 'group': 'INDICES'}), 'idx')
        self.assertEqual(M.group_of({'cls': 'crypto', 'group': 'CRYPTO 2'}), 'crypto')

    def test_workflow_and_scheduler(self):
        root = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
        with open(os.path.join(root, '.github', 'workflows', 'movers.yml')) as f:
            y = f.read()
        self.assertIn('python tools/movers/movers.py', y)
        self.assertIn('test:', y)
        self.assertIn('git add public/movers', y)
        with open(os.path.join(root, 'supabase', 'functions', 'trader-coach', 'scheduler.ts')) as f:
            self.assertIn("'movers.yml'", f.read())


if __name__ == '__main__':
    unittest.main()
