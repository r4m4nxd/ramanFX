import os, sys, unittest
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import fxnotify as N  # noqa: E402
import fxscan as S  # noqa: E402


class HourlyDigest(unittest.TestCase):
    def test_title_and_schedule(self):
        pub = {'h4': '2026-11-04T16:00', 'h4_close_utc': '2026-11-04T18:00:00Z', 'h1_close_utc': '2026-11-04T21:00:00Z', 'map': [], 'lists': {}}
        self.assertIn('Forex · hourly check', str(N.digest_message(pub, {}, hourly=True)))
        self.assertIn('Forex · 4-hour check', str(N.digest_message(pub, {})))
        st = {'digest_h4': '2026-11-04T20:00'}
        self.assertTrue(S.needs_digest('2026-11-04T21:00', st))     # a new H1 candle -> a new hourly check
        self.assertFalse(S.needs_digest('2026-11-04T20:00', st))    # same candle -> none
        self.assertIn('digest_h4_guests', S.SCHEDULE_KEYS)


if __name__ == '__main__':
    unittest.main()
