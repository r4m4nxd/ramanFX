import datetime as dt
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
from news import calendar as N  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 11, 10, 13, 10, tzinfo=UTC)
PAGE = json.dumps({'status': 'ok', 'result': [
    {'title': 'CPI (YoY)', 'country': 'US', 'currency': 'USD', 'importance': 1, 'date': '2026-11-10T13:30:00.000Z'},
    {'title': 'Retail Sales', 'country': 'AU', 'currency': 'AUD', 'importance': 0, 'date': '2026-11-10T00:30:00.000Z'},
    {'title': 'ECB Rate Decision', 'country': 'EU', 'currency': 'EUR', 'importance': 1, 'date': '2026-11-10T13:00:00.000Z'},
    {'title': 'Housing Starts', 'country': 'JP', 'currency': 'JPY', 'importance': -1, 'date': '2026-11-10T05:00:00.000Z'},
    {'title': 'bad row', 'country': 'US', 'importance': 'x', 'date': 'nope'},
]})


class CalendarTest(unittest.TestCase):
    def setUp(self):
        N._mem.clear()

    def test_parse_and_filter(self):
        evs = N.events(NOW, hours_ahead=2, fetcher=lambda url: PAGE)
        self.assertEqual([e['title'] for e in evs], ['CPI (YoY)'])
        evs = N.events(NOW, hours_ahead=2, hours_back=1, fetcher=lambda url: PAGE)
        self.assertEqual([e['country'] for e in evs], ['EU', 'US'])
        self.assertEqual(set(evs[0]), {'time_utc', 'country', 'title', 'importance', 'currency'})
        med = N.events(NOW, hours_ahead=24, hours_back=24, min_importance='medium', countries=['AU'], fetcher=lambda url: PAGE)
        self.assertEqual([e['title'] for e in med], ['Retail Sales'])

    def test_failure_is_empty(self):
        def boom(url):
            raise OSError('403')
        self.assertEqual(N.events(NOW, fetcher=boom), [])

    def test_countries_and_warning(self):
        self.assertEqual(N.countries_of('EURUSD'), ['EU', 'US'])
        self.assertEqual(N.countries_of('XAUUSD'), ['US'])
        self.assertEqual(N.countries_of('GER40'), ['EU'])
        self.assertEqual(N.countries_of('NVDA', 'stock'), ['US'])
        evs = N.parse(PAGE)
        self.assertEqual(N.warning('USDJPY', evs, NOW), '⚠️ US CPI in 20 min')
        self.assertEqual(N.warning('EURGBP', evs, NOW), '⚠️ EU ECB Rate Decision 10 min ago')
        self.assertEqual(N.warning('AUDNZD', evs, NOW), '')
        self.assertEqual(N.warning('NVDA', evs, NOW, market='stock'), '⚠️ US CPI in 20 min')
        self.assertEqual(N.warning('USDJPY', evs, NOW + dt.timedelta(hours=2)), '')


if __name__ == '__main__':
    unittest.main()
