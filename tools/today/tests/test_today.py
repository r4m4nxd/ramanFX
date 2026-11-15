"""The daily plan messages of focus mode (tools/today/today.py)."""
import datetime as dt
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import today as T  # noqa: E402

UTC = dt.timezone.utc
D1 = [[f'2026-10-{d:02d}T00:00', 1.10, 1.105, 1.095, 1.10] for d in range(1, 29)] + [['2026-11-12T00:00', 1.10, 1.11, 1.10, 1.105], ['2026-11-13T00:00', 1.105, 1.108, 1.103, 1.104]]
INST = {'price': 1.104, 'digits': 5, 'bars': {'D1': D1},
        'zones': [{'tf': 'W1', 'side': 'demand', 'proximal': 1.096, 'distal': 1.073}, {'tf': 'H1', 'side': 'demand', 'proximal': 1.1035, 'distal': 1.103},
                  {'tf': 'D1', 'side': 'supply', 'proximal': 1.13, 'distal': 1.14}, {'tf': 'D1', 'side': 'supply', 'proximal': 1.12, 'distal': 1.125}],
        'checks': [{'tf': 'W1', 'side': 'demand', 'pips': 5, 'rules': [{'status': 'pass', 'short': 'fresh'}, {'status': 'fail', 'short': 'location'}, {'status': 'fail', 'short': 'room'}]},
                   {'tf': 'H4', 'side': 'supply', 'pips': 1, 'rules': [{'status': 'fail', 'short': 'leg'}] * 3}]}
WEEK = [[100] * 48 for _ in range(5)] + [[None] * 48]
WEEK[0][12] = 250          # Monday 06:00 on the study clock
WEEK[3][9] = 300


class Today(unittest.TestCase):
    def test_nearest_daily_or_bigger_areas_only(self):
        buy, sell = T.nearest(INST)
        self.assertEqual((buy['tf'], round(buy['pct'], 2), buy['inside']), ('W1', 0.72, False))
        self.assertEqual((sell['tf'], sell['lo']), ('D1', 1.12))
        inside, _ = T.nearest({**INST, 'price': 1.09})
        self.assertTrue(inside['inside'])

    def test_rules_take_the_setup_closest_to_passing(self):
        r = T.rules(INST)
        self.assertEqual((r['tf'], r['passed'], r['total']), ('W1', 1, 3))
        self.assertEqual(r['missing'], ['not at a bigger-timeframe area', 'room to target under 2× the risk'])
        self.assertIsNone(T.rules({}))

    def test_day_range_against_a_normal_day(self):
        r = T.day_range(INST)
        self.assertAlmostEqual(r['adr'], 0.01, places=6)
        self.assertAlmostEqual(r['used'], 0.5, places=3)
        self.assertEqual(r['prev'], (1.11, 1.10, 1.105))

    def test_best_time_follows_the_gap_to_new_york(self):
        self.assertEqual(T.best_time(WEEK, 0, 120)['cal_min'], 360)        # 6:00 AM when New York is 2 h ahead
        self.assertEqual(T.best_time(WEEK, 0, 60)['cal_min'], 420)         # 7:00 AM when the gap is 1 h
        self.assertIsNone(T.best_time(WEEK, 0, 60, after_study_min=24 * 60))
        self.assertIsNone(T.best_time(None, 0, 60))

    def test_due_once_a_day_inside_its_window(self):
        sun_8pm = dt.datetime(2026, 7, 13, 2, 0, tzinfo=UTC)          # Sunday 20:00 Calgary (UTC-6)
        self.assertEqual(T.due(sun_8pm, {}), 'evening')
        self.assertIsNone(T.due(sun_8pm, {'evening': '2026-07-12'}))
        self.assertIsNone(T.due(dt.datetime(2026, 7, 11, 2, 0, tzinfo=UTC), {}))          # Friday evening: no plan for Saturday
        mon_615 = dt.datetime(2026, 7, 13, 12, 15, tzinfo=UTC)
        self.assertEqual(T.due(mon_615, {}), 'morning')
        self.assertIsNone(T.due(dt.datetime(2026, 7, 12, 12, 15, tzinfo=UTC), {}))        # Sunday morning
        self.assertIsNone(T.due(dt.datetime(2026, 7, 13, 18, 0, tzinfo=UTC), {}))

    def test_messages_are_plain_and_get_through_focus_mode(self):
        now = dt.datetime(2026, 7, 13, 2, 0, tzinfo=UTC)
        ev = T.build('evening', ['EURUSD', 'NOPE'], {'EURUSD': INST}, {'EURUSD': WEEK}, now)
        self.assertTrue(ev.keep)
        self.assertIn('Plan for Monday', ev)
        self.assertIn('Weekly buy area', ev)
        self.assertIn('Your rules: 1 of 3 pass', ev)
        self.assertIn('Best time Monday: 6:00 AM', ev)
        self.assertIn('No scan data for this market yet', ev)
        mo = T.build('morning', ['EURUSD'], {'EURUSD': INST}, {'EURUSD': WEEK}, dt.datetime(2026, 7, 13, 11, 0, tzinfo=UTC))
        self.assertIn('Today so far: 50% of a normal day · plenty left', mo)
        self.assertIn('Best time today: 6:00 AM, in 1 h', mo)
        for w in ('proximal', 'distal', 'demand', 'supply', 'ATR'):
            self.assertNotIn(w, ev + mo)


if __name__ == '__main__':
    unittest.main()
