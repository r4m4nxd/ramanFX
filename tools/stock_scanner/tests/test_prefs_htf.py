"""Stock scan: the bot prefs inputs (alert_inputs) and the higher-TF chart bars (hb) in the detail shards."""
import os
import sys
import unittest

import helpers  # noqa: F401
from helpers import bars_from_closes
import prefs as P
import scan as S
import selftest


class HtfBarsTest(unittest.TestCase):
    def test_weeks_months_quarters_from_daily(self):
        bars = bars_from_closes([100 + (i % 17) for i in range(600)])
        hb = S.htf_bars(bars)
        self.assertEqual(set(hb), {'W1', 'MN', '3M'})
        self.assertEqual(len(hb['W1']['b']), 104)
        self.assertLessEqual(len(hb['MN']['b']), 60)
        self.assertGreater(len(hb['3M']['b']), 6)
        last_m = [b for b in bars if b.d[:7] == bars[-1].d[:7]]       # the forming month is included
        o, h, l, c = hb['MN']['b'][-1]
        self.assertEqual((o, h, l, c), (round(last_m[0].o, 2), round(max(b.h for b in last_m), 2),
                                        round(min(b.l for b in last_m), 2), round(last_m[-1].c, 2)))

    def test_only_listed_tickers_carry_hb(self):
        res = selftest.run_fixture()
        listed = {r['s'] for side in ('demand', 'supply') for sec in ('in', 'left', 'near') for r in res['zone_lists'][side][sec]}
        listed |= {s['symbol'] for s in res['signals']}
        for sym, d in res['details'].items():
            self.assertEqual('hb' in d, sym in listed, sym)


class AlertInputsTest(unittest.TestCase):
    def test_inputs_and_a_fired_price_alert(self):
        res = selftest.run_fixture()
        per = S.alert_inputs(res)
        self.assertTrue(per)
        sym, info = next(iter(per.items()))
        self.assertEqual(set(info), {'bar', 'zones', 'price', 'digits'})
        for z in info['zones']:
            self.assertTrue(z['loc_ok'])
        a = {'id': 3, 'sym': sym, 'kind': 'price', 'level': info['bar']['h'], 'dir': 'up', 'pct': None}
        fired = P.evaluate({'alerts': [a]}, per)
        self.assertEqual(len(fired), 1)
        import notify
        m = notify.fired_alert_message(fired[0], 'stock', 'last daily close')
        self.assertIn('last daily close', m)
        self.assertEqual(m.buttons[0][0]['callback_data'], f'c:{sym}')


if __name__ == '__main__':
    unittest.main()
