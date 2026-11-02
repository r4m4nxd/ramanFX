import os
import sys
import unittest
from types import SimpleNamespace as NS

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(HERE)), 'stock_scanner'))
import fxtrend as FT  # noqa: E402
import zones as Z  # noqa: E402


def row(tf, st, T, t_bar, rm):
    return NS(ok=True, tf=tf, st=st, T=T, t_bar=t_bar, rm=rm, S=NS(T=[f'2026-10-{20 + i:02d}T00:00' for i in range(30)]))


def res(*rows_by_sym):
    return {'analyses': {s: NS(inst={'wl': True}, rows=rows, price=1.1, nd=5) for s, rows in rows_by_sym}}


class DirectionChange(unittest.TestCase):
    def test_stages(self):
        self.assertEqual(FT.stage_of(row('D1', Z.DST_TURN, 1, 2, 0))['stage'], 'break')
        self.assertEqual(FT.stage_of(row('D1', Z.DST_PULL, 1, 2, 1))['stage'], 'removed1')
        self.assertEqual(FT.stage_of(row('W1', Z.DST_CHG, -1, 3, 2))['stage'], 'changed')
        self.assertIsNone(FT.stage_of(row('D1', Z.DST_TREND, 1, 2, 0)))
        self.assertIsNone(FT.stage_of(row('D1', Z.DST_TURN, 1, 25, 0)))          # an old cross is not news

    def test_each_stage_once_and_message(self):
        st = {}
        r1 = res(('EURUSD', {'D1': row('D1', Z.DST_TURN, 1, 2, 0)}))
        self.assertEqual(len(FT.advances(FT.current(r1), st)), 1)
        self.assertEqual(FT.advances(FT.current(r1), st), [])                    # same stage: not again
        r2 = res(('EURUSD', {'D1': row('D1', Z.DST_CHG, 1, 2, 2)}))
        new = FT.advances(FT.current(r2), st)
        self.assertEqual([x['stage'] for x in new], ['changed'])
        self.assertIn('CHANGED up', FT.message(new))


if __name__ == '__main__':
    unittest.main()
