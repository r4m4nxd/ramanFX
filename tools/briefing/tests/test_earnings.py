"""The 6 AM brief's earnings heads-up (brief.earnings_lines / my_stocks, from public/fundamentals/stocks.json)."""
import datetime as dt
import json
import os
import sys
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import brief as B  # noqa: E402

FUND = {'stocks': {
    'NVDA': {'er_next': '2026-10-29', 'er_kind': 'nasdaq', 'er_time': 'after close'},
    'AAPL': {'er_next': '2026-10-30', 'er_kind': 'nasdaq', 'er_time': 'after close'},
    'MSFT': {'er_next': '2026-10-30', 'er_kind': 'estimated'},
    'TSLA': {'er_next': '2026-10-29'},                 # reports, but not mine
    'AMD': {'er_next': '2026-11-03'},                  # too far
}}


class EarningsHeadsUp(unittest.TestCase):
    def test_lines(self):
        mine = {'NVDA': 'listed', 'AAPL': 'held', 'MSFT': 'watched', 'AMD': 'held'}
        out = B.earnings_lines(dt.date(2026, 10, 29), mine, FUND)
        self.assertEqual(out, ['<b>NVDA</b> today after close · listed', '<b>AAPL</b> tomorrow after close · held',
                               '<b>MSFT</b> tomorrow, estimated · watched'])
        fri = B.earnings_lines(dt.date(2026, 10, 30), {'AMD': 'held'}, {'stocks': {'AMD': {'er_next': '2026-11-02'}}})
        self.assertEqual(fri, ['<b>AMD</b> Mon · held'])                    # Friday: the next weekday is Monday
        self.assertEqual(B.earnings_lines(dt.date(2026, 10, 29), mine, None), [])
        many = {'stocks': {f'S{k}': {'er_next': '2026-10-29'} for k in range(12)}}
        cut = B.earnings_lines(dt.date(2026, 10, 29), {f'S{k}': 'listed' for k in range(12)}, many)
        self.assertEqual(len(cut), 9)
        self.assertIn('+4 more', cut[-1])

    def test_my_stocks_and_brief(self):
        with mock.patch.dict(os.environ, {'WATCHLIST': 'msft, amd', 'HOLDINGS_JSON': json.dumps([{'symbol': 'aapl'}])}):
            m = B.my_stocks()
        self.assertEqual((m['MSFT'], m['AMD'], m['AAPL']), ('watched', 'watched', 'held'))
        msg = B.build_brief(dt.date(2026, 10, 29), [], [], [], None, earnings=['<b>NVDA</b> today after close · listed'])
        self.assertIn('<b>📑 Earnings</b>\n<b>NVDA</b> today after close · listed', str(msg.text if hasattr(msg, 'text') else msg))
        plain = B.build_brief(dt.date(2026, 10, 29), [], [], [], None)
        self.assertNotIn('Earnings', str(plain.text if hasattr(plain, 'text') else plain))


if __name__ == '__main__':
    unittest.main()
