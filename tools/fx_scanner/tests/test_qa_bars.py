"""qa_bars.py (qa-bars.yml): from / to paging under OANDA's 5000-candle cap, de-duplication, BID bars, server-time
labels (D1 00:00 = 17:00 New York, W1 Saturday, MN the 1st), the forming candle and the files written."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import qa_bars as Q  # noqa: E402

NOW = dt.datetime(2026, 10, 30, 12, 0)


def ny17(day: dt.date) -> dt.datetime:
    """UTC time of 17:00 New York on `day`."""
    import fxcfg as C
    t = dt.datetime.combine(day, dt.time(21))
    return t if C.ny_offset(t) == -4 else t + dt.timedelta(hours=1)


class FakeOanda:
    """Serves synthetic H1 candles on the hour (weekdays) or D candles at 17:00 NY, honouring from / to / count."""

    def __init__(self, tf: str, start: dt.datetime):
        self.tf, self.calls = tf, []
        self.times = []
        t = start
        while t < NOW:
            if self.tf == 'H1':
                if t.weekday() < 5:
                    self.times.append(t)
                t += dt.timedelta(hours=1)
            else:
                d = ny17(t.date())
                if t.weekday() < 5 and d < NOW:
                    self.times.append(d)
                t += dt.timedelta(days=1)

    def __call__(self, url: str) -> bytes:
        q = dict(urllib.parse.parse_qsl(urllib.parse.urlparse(url).query))
        self.calls.append(q)
        assert q['price'] == 'BA' and q['alignmentTimezone'] == 'America/New_York' and q['dailyAlignment'] == '17'
        assert 'count' not in q or 'to' not in q
        frm = dt.datetime.strptime(q['from'], '%Y-%m-%dT%H:%M:%SZ')
        sel = [t for t in self.times if t >= frm]
        if 'to' in q:
            to = dt.datetime.strptime(q['to'], '%Y-%m-%dT%H:%M:%SZ')
            sel = [t for t in sel if t <= to]          # inclusive: the boundary candle comes twice
            assert len(sel) <= 5000
        else:
            sel = sel[:int(q['count'])]
        out = []
        for i, t in enumerate(sel):
            px = {'o': '1.10000', 'h': '1.10100', 'l': '1.09900', 'c': f'1.1{i % 10}000'}
            mid = {k: '9.9' for k in px}
            out.append({'time': t.strftime('%Y-%m-%dT%H:%M:%S.000000000Z'), 'complete': t + dt.timedelta(hours=1) <= NOW,
                        'bid': px, 'ask': px, 'mid': mid})
        return json.dumps({'candles': out}).encode()


class QaBarsTest(unittest.TestCase):
    def test_paging_dedup_and_labels(self):
        old = Q.WINDOW
        Q.WINDOW = 1000                                    # several from / to windows + the final count page
        try:
            start = NOW - dt.timedelta(days=183)
            g = FakeOanda('H1', start)
            cs, pages = Q.fetch('EUR_USD', 'H1', start, NOW, g)
        finally:
            Q.WINDOW = old
        self.assertGreater(pages, 3)
        self.assertTrue(any('to' in c for c in g.calls) and 'count' in g.calls[-1])
        self.assertEqual(len(cs), len(g.times))            # every candle once, despite the inclusive window edges
        bars, forming, off = Q.to_bars(cs, 'H1')
        self.assertEqual(off, 0)
        self.assertEqual(len(bars), len(g.times))
        self.assertEqual([b[0] for b in bars], sorted(b[0] for b in bars))
        self.assertTrue(all(b[0].endswith(':00') for b in bars))
        self.assertEqual(bars[0][1:4], [1.1, 1.101, 1.099])  # BID, not mid

    def test_daily_is_server_midnight(self):
        start = dt.datetime(2026, 6, 1)
        cs, _ = Q.fetch('XAU_USD', 'D1', start, NOW, FakeOanda('D1', start))
        bars, _, off = Q.to_bars(cs, 'D1')
        self.assertEqual(off, 0)
        self.assertTrue(all(b[0].endswith('T00:00') for b in bars))
        lbls = {b[0] for b in bars}
        self.assertIn('2026-07-03T00:00', lbls)          # Thursday 17:00 NY (EDT, 21:00 UTC) -> Friday 00:00 server
        self.assertIn('2026-10-29T00:00', lbls)   # Wed 17:00 NY -> Thu (EDT till Nov 1)

    def test_forming_and_files(self):
        start = NOW - dt.timedelta(days=3)
        g = FakeOanda('H1', start)
        g.times.append(NOW)                                # the candle in progress (complete false)
        with tempfile.TemporaryDirectory() as d:
            idx = Q.run(d, ['EURUSD'], ['H1'], now=NOW, get=g)
            with open(os.path.join(d, 'EURUSD', 'H1.json')) as f:
                rec = json.load(f)
            self.assertTrue(rec['forming'])
            self.assertEqual(rec['n'], len(rec['bars']))
            self.assertEqual(rec['price'], 'bid')
            self.assertEqual(idx['symbols']['EURUSD']['tfs']['H1']['n'], rec['n'])
            self.assertEqual(idx['errors'], [])
            self.assertTrue(os.path.exists(os.path.join(d, 'index.json')))

    def test_errors_do_not_stop_the_rest(self):
        def bad(url):
            if 'XAU_USD' in url:
                raise RuntimeError('boom')
            return FakeOanda('H1', NOW - dt.timedelta(days=2))(url)
        with tempfile.TemporaryDirectory() as d:
            idx = Q.run(d, ['XAUUSD', 'EURUSD'], ['H1'], now=NOW, get=bad)
            self.assertEqual(len(idx['errors']), 1)
            self.assertIn('H1', idx['symbols']['EURUSD']['tfs'])
            self.assertEqual(Q.main(['--syms', 'NOPE']), 2)


if __name__ == '__main__':
    unittest.main()
