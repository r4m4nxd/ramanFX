"""Big moves + headlines: '📰 why:' lines under movers (tools/movers/movers.py news_why / build), offline."""
import datetime as dt
import os
import sys
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import movers as M  # noqa: E402

sys.path.append(os.path.join(M.ROOT, 'tools'))
from news import headlines as NH  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 14, 5, tzinfo=UTC)


def item(title, mins, **k):
    d = {'id': f'x:{title}', 't': NOW - dt.timedelta(minutes=mins), 'title': title, 'summary': '', 'url': 'https://e.test/1',
         'source': 'investingLive', 'syms': []}
    d.update(k)
    return d


MOVERS = [{'sym': 'XAUUSD', 'market': 'fx', 'x': 2.6, 'pct': 0.9, 'range_pct': 1.1, 'close': 0.0},
          {'sym': 'EURUSD', 'market': 'fx', 'x': 2.2, 'pct': -0.4, 'range_pct': 0.5, 'close': 0.0},
          {'sym': 'NVDA', 'market': 'stock', 'x': 3.1, 'pct': -2.4, 'range_pct': 2.8, 'close': 0.0}]


class Why(unittest.TestCase):
    def test_latest_headline_of_the_last_3_hours_per_mover(self):
        alp = [item('Nvidia <falls> after export curbs', 30, source='Benzinga', syms=['NVDA'])]
        rss = [item('Gold jumps as the dollar slides', 50), item('Euro area news from yesterday', 60 * 20)]
        calls = []
        with mock.patch.object(NH, 'alpaca', lambda tags, **k: calls.append((tags, k.get('start'))) or alp), \
                mock.patch.object(NH, 'pool', lambda **k: rss):
            why = M.news_why(MOVERS, NOW, log=None)
        self.assertEqual(calls[0][0], ['GLD', 'NVDA'])
        self.assertEqual(calls[0][1], NOW - dt.timedelta(hours=3))
        self.assertEqual(set(why), {'XAUUSD', 'NVDA'})                    # EURUSD: only a 20 h old one
        self.assertEqual(why['NVDA'], '   📰 why: <a href="https://e.test/1">Nvidia &lt;falls&gt; after export curbs</a> · 30m ago')

    def test_failures_never_break_the_message(self):
        def boom(*a, **k):
            raise RuntimeError('down')
        with mock.patch.object(NH, 'alpaca', boom):
            self.assertEqual(M.news_why(MOVERS, NOW, log=None), {})
        self.assertEqual(M.news_why([], NOW, log=None), {})

    def test_build_puts_the_why_line_under_its_mover(self):
        s, e = M.last_hour(NOW)
        msg = M.build(MOVERS[:2], MOVERS[2:], s, e, lambda m: '', why={'NVDA': '   📰 why: x · 30m ago'})
        lines = str(msg).split('\n')
        i = next(k for k, x in enumerate(lines) if x.startswith('<b>NVDA</b>'))
        self.assertEqual(lines[i + 1], '   📰 why: x · 30m ago')
        self.assertEqual(sum('📰' in x for x in lines), 1)
        long = M.build(MOVERS[:2], MOVERS[2:], s, e, lambda m: '', why={'NVDA': 'y' * 5000})
        self.assertNotIn('yyyy', str(long))                              # too long: the moves stay, the why goes


if __name__ == '__main__':
    unittest.main()
