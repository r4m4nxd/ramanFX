"""On-demand scan of one symbol (the bot's /scan SYM): one result card, nothing written."""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
import fxscan as X  # noqa: E402


class OnDemand(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        uni, data, _ = X.selftest_universe()
        cls.uni = uni[:2]
        cls.res = X.run(cls.uni, lambda i: (data[i['name']], 0.6 * C.pip_of(i)), log=None)

    def test_one_card_per_symbol(self):
        msgs = X.ondemand_messages(self.res, self.uni[:1], self.uni[0]['sym'], None, '2026-10-23T16:00')
        self.assertEqual(len(msgs), 1)
        m, sym = msgs[0], self.uni[0]['sym']
        self.assertIn(f'🔄 <b>{sym}</b> · on-demand scan', m)
        self.assertIn('every scanner rule', m)
        self.assertIn('not advice', m)
        self.assertLessEqual(len(m.encode('utf-16-le')) // 2, 4096)
        cbs = [b.get('callback_data') for r in m.buttons for b in r]
        self.assertIn(f'c:{sym}', cbs)
        self.assertIn(f'z:{sym}', cbs)
        self.assertTrue('Zones the scanner located' in m or 'Nearest other zones' in m or 'No BUY' in m)

    def test_unknown_or_missing_symbol(self):
        self.assertIn('not an instrument', X.ondemand_messages(self.res, [], 'NOPE', None, '')[0])
        res = {**self.res, 'analyses': {}, 'errors': {self.uni[0]['sym']: 'too little H4 history'}}
        self.assertIn('too little H4 history', X.ondemand_messages(res, self.uni[:1], 'x', None, '')[0])

    def test_cli_flag_and_workflow(self):
        root = os.path.dirname(os.path.dirname(PKG))
        with open(os.path.join(root, '.github', 'workflows', 'fx-scan.yml')) as f:
            y = f.read()
        self.assertIn('ondemand:', y)
        self.assertIn('ARGS+=(--ondemand --no-write)', y)


if __name__ == '__main__':
    unittest.main()
