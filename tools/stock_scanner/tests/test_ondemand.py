"""On-demand scan of one ticker (the bot's /scan SYM): one result card, nothing written."""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import notify  # noqa: E402
import scan  # noqa: E402

DET = {'symbol': 'NVDA', 'price': 181.48, 'date': '2026-10-28', 'chart': 'https://www.tradingview.com/chart/?symbol=NASDAQ:NVDA',
       'w1': 'UP', 'mn': 'TURNING UP', 'm3': 'n/a',
       'zones': [{'tf': 'W1', 'side': 'demand', 'proximal': 175.2, 'distal': 168.0, 'fresh': True, 'touches': 0, 'br': 'location'},
                 {'tf': 'MN', 'side': 'demand', 'proximal': 150.0, 'distal': 140.0, 'fresh': False, 'touches': 2},
                 {'tf': 'W1', 'side': 'supply', 'proximal': 190.0, 'distal': 196.0, 'fresh': True, 'touches': 0},
                 {'tf': 'W1', 'side': 'supply', 'proximal': 120.0, 'distal': 125.0, 'fresh': True, 'touches': 0}]}


class OnDemand(unittest.TestCase):
    def test_card(self):
        m = notify.ondemand_card(DET, [], 'NVDA')
        self.assertIn('🔄 <b>NVDA</b> · on-demand scan', m)
        self.assertIn('Wed Oct 28 close', m)
        self.assertIn('No BUY / WATCH', m)
        self.assertIn('weekly demand 175.20–168.00', m)
        self.assertIn('blocked: bigger zone not reached yet', m)
        self.assertIn('weekly supply 190.00–196.00', m)
        self.assertNotIn('120.00', m)                       # a supply below price is not "above"
        self.assertIn('Trend: W1 up · MN turning up', m)
        cbs = [b.get('callback_data') for r in m.buttons for b in r]
        self.assertEqual(cbs[-2:], ['c:NVDA', 'z:NVDA'])

    def test_messages_from_result(self):
        sig = {'symbol': 'NVDA', 'kind': 'BUY', 'tf': 'W1', 'entry': 175.2, 'stop': 166.0, 'target': 220.0, 'rr': 4.9, 'score': 9}
        res = {'details': {'NVDA': DET}, 'signals': [sig], 'errors': ['XYZ: no data']}
        msgs = scan.ondemand_messages(res, ['NVDA', 'XYZ'], notify)
        self.assertEqual(len(msgs), 2)
        self.assertIn('BUY', msgs[0])
        self.assertNotIn('No BUY', msgs[0])
        self.assertIn('No result: no data', msgs[1])

    def test_workflow(self):
        root = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
        with open(os.path.join(root, '.github', 'workflows', 'stock-scan.yml')) as f:
            y = f.read()
        self.assertIn('ondemand:', y)
        self.assertIn('--ondemand', y)


if __name__ == '__main__':
    unittest.main()
