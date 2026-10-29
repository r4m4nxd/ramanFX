"""Morning brief + headlines: the '📰 Overnight headlines' block (tools/briefing/brief.py headline_block), offline."""
import datetime as dt
import os
import sys
import types
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import brief as B  # noqa: E402

sys.path.append(os.path.join(B.ROOT, 'tools'))
from news import headlines as NH  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 12, 0, tzinfo=UTC)          # 6:00 AM Calgary


def item(title, hours, **k):
    d = {'id': f"{k.get('source', 'investingLive')}:{title}", 't': NOW - dt.timedelta(hours=hours), 'title': title, 'summary': '',
         'url': 'https://e.test/1', 'source': 'investingLive', 'syms': []}
    d.update(k)
    return d


def fake_nh(general, rss, tagged):
    m = types.SimpleNamespace(**{k: getattr(NH, k) for k in ('top', 'latest_for', 'line_for', 'tags_for')})
    m.pool = lambda **k: rss
    m.alpaca = lambda tags, **k: tagged if tags else general
    return m


class Block(unittest.TestCase):
    def test_top_and_your_symbols(self):
        rss = [item('Fed holds rates, Powell says inflation still sticky', 5, source='CNBC'),
               item('ECB holds rates, Lagarde cautious on the euro', 8)]
        general = [item('Apple earnings beat, shares jump in late trade', 10, source='Benzinga', syms=['AAPL'])]
        tagged = [item('Nvidia <wins> new AI contract', 3, source='Benzinga', syms=['NVDA'])]
        prefs = {'watch': ['NVDA', 'EURUSD'], 'open': ['XAUUSD']}
        block = B.headline_block(NOW, log=None, prefs=prefs, NH=fake_nh(general, rss, tagged))
        lines = block.split('\n')
        self.assertEqual(lines[0], '📰 <b>Overnight headlines</b>')
        self.assertTrue(any('Fed holds rates' in x for x in lines[1:3]))
        self.assertIn('<b>Your symbols</b>', lines)
        self.assertTrue(any(x.startswith('<b>NVDA</b> · <a href="https://e.test/1">Nvidia &lt;wins&gt; new AI contract</a> · 3h ago') for x in lines))
        self.assertEqual(sum(x.count('ECB holds') for x in lines), 1)      # never twice (top + EURUSD)
        self.assertEqual(B.my_symbols(prefs), ['XAUUSD', 'NVDA', 'EURUSD'])

    def test_nothing_or_failure_gives_no_block(self):
        self.assertEqual(B.headline_block(NOW, log=None, prefs={}, NH=fake_nh([], [], [])), '')
        bad = types.SimpleNamespace(pool=lambda **k: 1 / 0)
        self.assertEqual(B.headline_block(NOW, log=None, prefs={}, NH=bad), '')

    def test_inserted_before_today_and_dropped_when_too_long(self):
        msg = B.SN.Msg('☀️ head\n\n<b>Big candles</b>\nx\n\n<b>Today</b>\nNo events.', [[{'text': 'a', 'url': 'https://a'}]])
        out = B.with_headlines(msg, '📰 <b>Overnight headlines</b>\n• y')
        self.assertEqual(str(out), '☀️ head\n\n<b>Big candles</b>\nx\n\n📰 <b>Overnight headlines</b>\n• y\n\n<b>Today</b>\nNo events.')
        self.assertEqual(out.buttons, msg.buttons)
        self.assertIs(B.with_headlines(msg, ''), msg)
        self.assertEqual(str(B.with_headlines(msg, 'z' * 5000)), str(msg))


if __name__ == '__main__':
    unittest.main()
