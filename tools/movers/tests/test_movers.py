"""Hourly big moves (tools/movers/movers.py), offline: fake OANDA / Alpaca answers, the published scan files."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import movers as M  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 14, 5, tzinfo=UTC)        # 8:05 AM Calgary, 10:05 AM New York: hour 13:00-14:00 UTC


def hourly(end: dt.datetime, n: int, big: bool = False, base: float = 100.0):
    """n hourly bars ending with the one that starts at `end` - 1 h; true range 1.0 (0.1% of 100), the last 3.0 when big."""
    out = []
    for k in range(n):
        t = end - dt.timedelta(hours=n - k)
        r = 3.0 if big and k == n - 1 else 1.0
        c = base + (2.0 if big and k == n - 1 else 0.0)
        out.append({'t': t.strftime('%Y-%m-%dT%H:%M:%S'), 'o': base, 'h': base + r / 2 + (1.0 if big and k == n - 1 else 0), 'l': base - r / 2 + (1.0 if big and k == n - 1 else 0), 'c': c})
    return out


def fake_get(big_fx=('XAU_USD',), big_st=('NVDA',), seen=None):
    end = dt.datetime(2026, 10, 29, 14, tzinfo=UTC)

    def get(url, headers):
        if seen is not None:
            seen.append((url, dict(headers)))
        if 'oanda.com' in url:
            name = url.split('/instruments/')[1].split('/')[0]
            bs = hourly(end, 26, name in big_fx)
            cs = [{'complete': True, 'time': b['t'] + '.000000000Z', 'bid': {k: str(b[k]) for k in 'ohlc'}} for b in bs]
            return {'candles': cs + [{'complete': False, 'time': '2026-10-29T14:00:00.000000000Z', 'bid': {'o': '1', 'h': '1', 'l': '1', 'c': '1'}}]}
        syms = url.split('symbols=')[1].split('&')[0].split(',')
        return {'bars': {s: [{**b, 't': b['t'] + 'Z'} for b in hourly(end, 30, s in big_st)] for s in syms}}
    return get


ENV = {'OANDA_API_TOKEN': 'tok', 'ALPACA_KEY_ID': 'id', 'ALPACA_SECRET_KEY': 'sec'}


class Measure(unittest.TestCase):
    def test_multiple_of_the_20_hour_average(self):
        end = dt.datetime(2026, 10, 29, 14, tzinfo=UTC)
        m = M.measure(hourly(end, 26, True), '2026-10-29T13')
        self.assertAlmostEqual(m['x'], 3.0)               # true range 3.0 / the 20-hour average 1.0
        self.assertAlmostEqual(m['pct'], 2.0)
        self.assertIsNone(M.measure(hourly(end, 26), '2026-10-29T14'))   # the hour is not there
        self.assertIsNone(M.measure(hourly(end, 15, True), '2026-10-29T13'))   # too little history

    def test_hours_and_labels(self):
        s, e = M.last_hour(NOW)
        self.assertEqual((s.hour, e.hour), (13, 14))
        self.assertEqual(M.hour_label(s, e), '7:00–8:00 AM')
        self.assertEqual(M.hour_label(dt.datetime(2026, 10, 29, 17, tzinfo=UTC), dt.datetime(2026, 10, 29, 18, tzinfo=UTC)), '11:00 AM–12:00 PM')
        ny = lambda h, d=29: dt.datetime(2026, 10, d, h, tzinfo=UTC)  # noqa: E731  (EDT: New York = UTC - 4)
        self.assertTrue(M.stock_hours(ny(11)))           # 7:00 AM New York: pre-market
        self.assertFalse(M.stock_hours(ny(10)))          # 6:00 AM
        self.assertTrue(M.stock_hours(ny(20)))           # 4:00 PM: the first hour after the close
        self.assertFalse(M.stock_hours(ny(21)))          # 5:00 PM
        self.assertFalse(M.stock_hours(ny(15, 31)))      # Saturday


@mock.patch.dict(os.environ, ENV)
class Run(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.state = os.path.join(self.tmp.name, 'state.json')
        self.sent = []

    def tearDown(self):
        self.tmp.cleanup()

    def go(self, now=NOW, test=False, prefs=None, get=None):
        return M.run(now, get=get or fake_get(), test=test, prefs=prefs, state_path=self.state,
                     send=lambda ms: self.sent.extend(ms) or True, log=lambda *_: None)

    def test_one_message_then_deduped(self):
        seen = []
        m = self.go(get=fake_get(seen=seen))
        self.assertEqual(len(self.sent), 1)
        self.assertIn('<b>⚡ Big moves · last hour (7:00–8:00 AM)</b>', m)
        self.assertIn('<b>XAUUSD</b> 1H · 3.0× normal · ▲2.0%', m)
        self.assertIn('<b>NVDA</b> 1H · 3.0× normal', m)
        self.assertIn('IEX real-time', m)
        self.assertNotIn('EURUSD', m)
        self.assertIn('not advice', m)
        self.assertFalse(m.silent)
        cbs = [b['callback_data'] for r in m.buttons for b in r]
        self.assertIn('c:XAUUSD', cbs)
        self.assertLessEqual(len(cbs), 3)
        self.assertTrue(all(h.get('Authorization') == 'Bearer tok' for u, h in seen if 'oanda' in u))
        self.assertTrue(all('feed=iex' in u for u, _ in seen if 'alpaca' in u))
        self.assertTrue(all('tok' not in u and 'sec' not in u.split('?')[0] for u, _ in seen))   # tokens only in headers
        self.assertIsNone(self.go())                       # same hour again: deduped
        self.assertEqual(len(self.sent), 1)
        with open(self.state) as f:
            self.assertIn('2026-10-29T13', json.load(f)['sent'])

    def test_nothing_qualifies_no_message(self):
        self.assertIsNone(self.go(get=fake_get(big_fx=(), big_st=())))
        self.assertEqual(self.sent, [])

    def test_mute_and_quiet(self):
        prefs = {'mutes': [{'sym': 'XAUUSD', 'until_utc': '2026-11-05T00:00:00Z'}], 'quiet': {'from': '06:00', 'to': '09:00', 'tz': 'America/Edmonton'}}
        m = self.go(prefs=prefs)
        self.assertNotIn('XAUUSD', m)
        self.assertTrue(m.silent)                           # 8:05 AM Calgary is inside 06:00-09:00

    def test_stocks_only_in_us_hours(self):
        m = self.go(now=dt.datetime(2026, 10, 29, 3, 5, tzinfo=UTC), get=fake_get())   # 11 PM New York
        self.assertIsNone(m)                                # the fake FX bars end at 14:00 UTC: nothing at 02:00

    def test_test_mode_sample(self):
        m = self.go(test=True, get=fake_get(big_fx=(), big_st=()))
        self.assertIn('🧪 Sample big moves', m)
        self.assertEqual(sum(1 for x in m.split('\n') if ' 1H · ' in x), 6)   # top 3 FX + top 3 stocks, whatever their size
        self.assertFalse(os.path.exists(self.state))        # no dedupe state touched
        with mock.patch.dict(os.environ, {'OANDA_API_TOKEN': '', 'ALPACA_KEY_ID': ''}):
            s = self.go(test=True)
        self.assertIn('XAUUSD', s)                           # no data at all: the sample lines
        self.assertIn('into W1 demand ⭐', s)


class Context(unittest.TestCase):
    def test_into_and_near(self):
        zs = [{'tf': 'W1', 'side': 'demand', 'proximal': 101.0, 'distal': 99.0}, {'tf': 'H4', 'side': 'demand', 'proximal': 100.5, 'distal': 99.5},
              {'tf': 'D1', 'side': 'supply', 'proximal': 103.3, 'distal': 104.0}]
        self.assertEqual(M._zone_hit(100.0, zs, False), ('into', zs[0]))      # highest TF first
        self.assertEqual(M._zone_hit(102.9, zs, True), ('near', zs[2]))       # 0.4% under a supply, moving up
        self.assertIsNone(M._zone_hit(102.9, zs, False))
        m = {'market': 'fx', 'sym': 'XAUUSD', 'cls': 'metal', 'close': 100.0, 'pct': -1.0}
        shard = {'instruments': {'XAUUSD': {'zones': [], 'hits': [{'tf': 'W1', 'side': 'demand', 'prox': 101.0, 'dist': 99.0, 'kevin': {'n': 1}}]}}}
        ctx = M.context(m, {'signals': [{'sym': 'XAUUSD', 'kind': 'BUY'}]}, {}, lambda p: shard)
        self.assertEqual(ctx, 'into W1 demand ⭐ · BUY setup')

    def test_workflow_and_scheduler(self):
        root = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
        with open(os.path.join(root, '.github', 'workflows', 'movers.yml')) as f:
            y = f.read()
        self.assertIn('python tools/movers/movers.py', y)
        self.assertIn('test:', y)
        with open(os.path.join(root, 'supabase', 'functions', 'trader-coach', 'scheduler.ts')) as f:
            self.assertIn("'movers.yml'", f.read())


if __name__ == '__main__':
    unittest.main()
