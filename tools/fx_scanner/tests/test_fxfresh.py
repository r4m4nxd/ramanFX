"""fxfresh.py: new areas after a big move away (pure parts + the delivery state)."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
for p in (os.path.dirname(HERE), os.path.join(os.path.dirname(os.path.dirname(HERE)), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import arrival as A  # noqa: E402
import fxfresh as FR  # noqa: E402
import zones as Z  # noqa: E402


def bars(closes_tail, n=140, base=1.1000):
    """A flat, slightly noisy market, then the given (o, h, l, c) candles (oldest first)."""
    out = []
    t = dt.datetime(2026, 11, 2)
    for i in range(n):
        o = base + (0.0004 if i % 2 else -0.0004)
        c = base - (0.0004 if i % 2 else -0.0004)
        out.append(Z.Bar((t + dt.timedelta(minutes=15 * i)).strftime('%Y-%m-%dT%H:%M'), o, max(o, c) + 0.0003, min(o, c) - 0.0003, c))
    for k, (o, h, l, c) in enumerate(closes_tail):
        out.append(Z.Bar((t + dt.timedelta(minutes=15 * (n + k))).strftime('%Y-%m-%dT%H:%M'), o, h, l, c))
    return out


BASE = (1.1000, 1.1006, 1.0994, 1.1001)             # a small-body base candle
UP = (1.1001, 1.1062, 1.1000, 1.1060)               # the move away: closes above everything before it
AWAY = (1.1060, 1.1080, 1.1052, 1.1075)             # the stay-away candle
SMALL = (1.0990, 1.1006, 1.0989, 1.1005)            # a move that makes no new high
SMALL2 = (1.1005, 1.1007, 1.1002, 1.1006)


def run(tail, tf='M15'):
    S = A.series_of(bars(tail), tf)
    zones = Z.detect(S, A.FX_P)
    return S, zones, FR.found('EURUSD', S, zones, tf, 5, S.C[1])


class Fresh(unittest.TestCase):
    def test_new_high_makes_an_item(self):
        _, zones, items = run([BASE, UP, AWAY])
        self.assertTrue(zones)
        self.assertEqual(len(items), 1)
        x = items[0]
        self.assertEqual((x['dir'], x['tf'], x['broke']), (1, 'M15', True))
        self.assertLess(x['hi'], x['price'])

    def test_no_item_without_a_new_high_or_a_removed_area(self):
        S, zones, items = run([BASE, SMALL, SMALL2])
        self.assertTrue(any(z.sa_bar == 1 for z in zones))
        self.assertEqual(items, [])

    def test_old_areas_are_not_news(self):
        tail = [BASE, UP, AWAY] + [(1.1075, 1.1080, 1.1070, 1.1076 if i % 2 else 1.1074) for i in range(8)]
        _, _, items = run(tail)
        self.assertEqual(items, [])

    def test_sell_side_mirror(self):
        dn = (1.0999, 1.1000, 1.0938, 1.0940)
        away = (1.0940, 1.0948, 1.0920, 1.0925)
        _, _, items = run([(1.1000, 1.1006, 1.0994, 1.0999), dn, away])
        self.assertEqual([(x['dir'], x['broke']) for x in items], [(-1, True)])

    def test_card_is_plain_and_names_the_ftmo_symbol(self):
        x = {'id': 'NAS100|M15:D:x', 'sym': 'NAS100', 'tf': 'M15', 'dir': 1, 'lo': 26900.5, 'hi': 26950.0, 'price': 26986.3,
             'digits': 1, 'broke': True, 'removed': 2}
        c = FR.card(x, FR.ftmo())
        self.assertIn('US100.cash', c)
        self.assertIn('new 15-minute buy area', c)
        self.assertIn('highest in a day', c)
        self.assertIn('2 sell areas', c)
        for w in ('proximal', 'distal', 'HTF', 'Raja'):
            self.assertNotIn(w, c)

    def test_ftmo_list(self):
        m = FR.ftmo()
        self.assertEqual(len(m), 83)
        self.assertEqual(m['SPOTCRUDE'], 'USOIL.cash')

    def test_deliver_seeds_then_sends_each_area_once(self):
        _, _, items = run([BASE, UP, AWAY])
        sent = []
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, 'fresh.json')
            send = lambda ms: sent.extend(ms) or True   # noqa: E731
            self.assertEqual(FR.deliver(items, path, None, send, True, True, 't', log=lambda *_: None), 0)   # seed
            self.assertEqual(sent, [])
            other = [{**items[0], 'id': 'EURUSD|M15:D:new'}]
            self.assertEqual(FR.deliver(items + other, path, None, send, True, True, 't', log=lambda *_: None), 1)
            self.assertEqual(len(sent), 1)
            self.assertEqual(FR.deliver(items + other, path, None, send, True, True, 't', log=lambda *_: None), 0)
            with open(path) as f:
                self.assertEqual(len(json.load(f)['seen']), 2)

    def test_m15_pass_skips_unlisted_markets(self):
        def bars_of(sym):
            if sym == 'USDX':
                raise KeyError(sym)
            return bars([BASE, UP, AWAY])
        logs = []
        items = FR.scan_m15(bars_of, ['EURUSD', 'USDX'], {'EURUSD': 5}, log=logs.append)
        self.assertEqual([x['sym'] for x in items], ['EURUSD'])
        self.assertTrue(any('USDX' in x for x in logs))


if __name__ == '__main__':
    unittest.main()
