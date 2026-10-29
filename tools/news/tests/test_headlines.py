"""tools/news/headlines.py offline: untrusted feed parsing, symbol keywords, ranking, formatting, mocked fetches."""
import datetime as dt
import json
import os
import sys
import unittest
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
from news import headlines as NH  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 29, 16, 30, tzinfo=UTC)
RSS = """<?xml version="1.0"?><rss version="2.0"><channel><title>investingLive</title>
<item><title><![CDATA[ECB holds rates, Lagarde says <b>risks</b> are balanced]]></title><pubDate>Thu, 29 Oct 2026 13:15:12 GMT</pubDate>
<link>https://investinglive.com/news/ecb-holds/</link><description><![CDATA[<p>The ECB left rates unchanged. More.</p><script>x()</script>]]></description></item>
<item><title>Evil &lt;script&gt;alert(1)&lt;/script&gt; title &amp; more</title><pubDate>Thu, 29 Oct 2026 12:00:00 GMT</pubDate><link>javascript:alert(1)</link></item>
<item><title>No date</title></item></channel></rss>"""
INV = """<rss version="2.0"><channel><item><title>Canadian dollar strengthens as traders assess BoC hike</title>
<pubDate>2026-10-29 15:32:09</pubDate><link>https://www.investing.com/news/forex-news/cad-1</link></item></channel></rss>"""
ALP = {'news': [
    {'id': 1, 'headline': 'Nvidia Shares Jump After Record Revenue', 'summary': '<p>Nvidia beat estimates on data-center demand. Strong.</p>',
     'created_at': '2026-10-29T15:00:00Z', 'url': 'https://www.benzinga.com/1', 'source': 'benzinga', 'symbols': ['NVDA']},
    {'id': 2, 'headline': 'Bitcoin Tops $120,000 As ETF Demand Builds', 'created_at': '2026-10-29T14:00:00Z',
     'url': 'https://www.benzinga.com/2', 'source': 'benzinga', 'symbols': ['BTCUSD']},
    {'id': 3, 'headline': 'no date'}]}


def h(title, hours_ago, **k):
    d = {'id': f"{k.get('source', 'x')}:{title}", 't': NOW - dt.timedelta(hours=hours_ago), 'title': title, 'summary': '',
         'url': 'https://example.com/a', 'source': 'investingLive', 'syms': []}
    d.update(k)
    return d


class Parse(unittest.TestCase):
    def test_rss(self):
        items = NH.parse_rss(RSS, 'investingLive')
        self.assertEqual([i['title'] for i in items], ['ECB holds rates, Lagarde says risks are balanced', 'Evil title & more'])
        self.assertEqual(items[0]['summary'], 'The ECB left rates unchanged.')
        self.assertEqual(items[0]['t'], dt.datetime(2026, 10, 29, 13, 15, 12, tzinfo=UTC))
        self.assertEqual(items[1]['url'], '')
        self.assertEqual(NH.parse_rss(INV, 'Investing.com')[0]['t'], dt.datetime(2026, 10, 29, 15, 32, 9, tzinfo=UTC))
        self.assertEqual(NH.parse_rss('<html>Just a moment</html>', 'x'), [])
        self.assertEqual(NH.parse_rss(None, 'x'), [])

    def test_alpaca(self):
        a = NH.parse_alpaca(ALP)
        self.assertEqual(len(a), 2)
        self.assertEqual((a[0]['source'], a[0]['syms'], a[0]['summary']), ('Benzinga', ['NVDA'], 'Nvidia beat estimates on data-center demand.'))
        self.assertEqual(NH.parse_alpaca('x'), [])


class Symbols(unittest.TestCase):
    def test_same_table_as_the_bot(self):
        with open(os.path.join(os.path.dirname(NH.__file__), 'headline_terms.json')) as f:
            self.assertEqual(json.load(f)['terms'], NH.TERMS)
        self.assertEqual(NH.sym_map('EURUSD')['kind'], 'fx')
        self.assertEqual(NH.sym_map('XAUUSD')['tags'], ['GLD'])
        self.assertEqual(NH.sym_map('US500')['tags'], ['SPY'])
        self.assertEqual(NH.sym_map('BTCUSD')['tags'], ['BTCUSD'])
        self.assertEqual(NH.sym_map('NVDA')['kind'], 'stock')
        self.assertEqual(NH.tags_for(['EURUSD', 'NVDA', 'XAUUSD']), ['GLD', 'NVDA'])

    def test_relevance(self):
        eu = NH.sym_map('EURUSD')
        self.assertEqual(NH.relevance(h('EUR/USD climbs', 1), eu), 3)
        self.assertEqual(NH.relevance(h('ECB holds rates', 1), eu), 2.5)
        self.assertEqual(NH.relevance(h('Powell says the Fed can wait', 1), eu), 1)
        self.assertEqual(NH.relevance(h('Federated Hermes earnings', 1), eu), 0)
        self.assertEqual(NH.relevance(h('Gold hits a record', 1), NH.sym_map('XAUUSD')), 2.5)
        self.assertEqual(NH.relevance(h('Stocks slip', 1, syms=['NVDA']), NH.sym_map('NVDA')), 3)


class Rank(unittest.TestCase):
    LIST = [h('Fed cuts rates by 25 bp, Powell signals pause', 2, source='CNBC'),
            h('ECB holds rates, Lagarde says risks are balanced', 3),
            h('Nvidia shares jump after record revenue', 1, source='Benzinga', syms=['NVDA']),
            h("10 Stocks Moving In Thursday's Pre-Market Session", 0.5, source='Benzinga', syms=list('ABCDEFG')),
            h('Fed cuts rates by 25 bp; Powell signals a pause', 2.1, source='Investing.com'),
            h('Old dollar news', 40)]

    def test_top_and_symbol(self):
        top = [x['title'] for x in NH.top(self.LIST, NOW)]
        self.assertEqual(top[0], 'Fed cuts rates by 25 bp, Powell signals pause')
        self.assertNotIn("10 Stocks Moving In Thursday's Pre-Market Session", top)
        self.assertEqual(sum('Fed cuts' in t for t in top), 1)
        self.assertNotIn('Old dollar news', top)
        self.assertEqual(NH.for_symbol(self.LIST, 'EURUSD', NOW)[0]['title'], 'ECB holds rates, Lagarde says risks are balanced')
        self.assertEqual(NH.latest_for(self.LIST, 'NVDA', NOW, hours=3)['title'], 'Nvidia shares jump after record revenue')
        self.assertIsNone(NH.latest_for(self.LIST, 'NVDA', NOW, hours=0.5))

    def test_format_escaped(self):
        x = h('A <b>bold</b> & move', 2, url='https://x.test/?a=1&b=2')
        self.assertEqual(NH.line_for(x, NOW), '<a href="https://x.test/?a=1&amp;b=2">A &lt;b&gt;bold&lt;/b&gt; &amp; move</a> · 2h ago · investingLive')
        self.assertEqual(NH.line_for(h('t', 1, url=''), NOW, source=False), 't · 1h ago')
        self.assertEqual(NH.ago(NOW - dt.timedelta(minutes=5), NOW), '5m ago')


class Network(unittest.TestCase):
    def test_pool_and_alpaca_with_mocked_fetch(self):
        seen = []

        def fetch(url, headers):
            seen.append((url, headers))
            if 'alpaca' in url:
                return json.dumps(ALP)
            return RSS if 'investinglive' in url else (INV if 'news_1.rss' in url else None)
        NH._POOL.clear()
        items = NH.pool(fetch, log=None)
        self.assertEqual(len(items), 3)
        n = len(seen)
        NH.pool(fetch, log=None)
        self.assertEqual(len(seen), n)                       # cached
        with mock.patch.dict(os.environ, {'ALPACA_KEY_ID': 'kid', 'ALPACA_SECRET_KEY': 'sec'}):
            a = NH.alpaca(['NVDA', 'BTCUSD'], fetch, log=None, start=NOW)
        self.assertEqual(len(a), 2)
        url, hd = seen[-1]
        self.assertIn('symbols=BTCUSD%2CNVDA', url)
        self.assertIn('start=2026-10-29T16%3A30%3A00Z', url)
        self.assertEqual(hd['APCA-API-KEY-ID'], 'kid')
        with mock.patch.dict(os.environ, {'ALPACA_KEY_ID': '', 'ALPACA_SECRET_KEY': ''}):
            self.assertEqual(NH.alpaca(['NVDA'], fetch, log=None), [])
        NH._POOL.clear()


if __name__ == '__main__':
    unittest.main()
