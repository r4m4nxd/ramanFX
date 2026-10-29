"""fixtures.json is what the Python engines give today (else the TS parity test compares against stale zones)."""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import make_fixtures  # noqa: E402


class Fixtures(unittest.TestCase):
    def test_up_to_date(self):
        self.assertEqual(make_fixtures.main(['--check']), 0, 'run python tools/telegram_bot/parity/make_fixtures.py')


if __name__ == '__main__':
    unittest.main()
