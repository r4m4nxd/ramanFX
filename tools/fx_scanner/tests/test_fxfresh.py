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


def run(tail, tf='M15', removed=1, known=1, cross=True):
    """found() on real zones, with the arrival rule (trend line cross + removed areas: tests/test_arrival.py) stubbed:
    every not-removed zone is an arrival that removed `removed` areas and became true on shift `known`."""
    from unittest import mock
    S = A.series_of(bars(tail), tf)
    zones = Z.detect(S, A.FX_P)

    def fake(S_, tf_, p, zs):
        arr = [mock.Mock(zone=z, removed=[object()] * removed, known_bar=known) for z in zs if not z.removed] if cross and removed else []
        return zs, arr
    with mock.patch.object(A, 'find_arrivals', fake):
        return S, zones, FR.found('EURUSD', S, zones, tf, 5, S.C[1])


class Fresh(unittest.TestCase):
    def test_an_arrival_makes_an_item(self):
        _, zones, items = run([BASE, UP, AWAY])
        self.assertTrue(zones)
        self.assertEqual(len(items), 1)
        x = items[0]
        self.assertEqual((x['dir'], x['tf'], x['removed']), (1, 'M15', 1))
        self.assertLess(x['hi'], x['price'])

    def test_a_big_candle_alone_is_not_an_item(self):
        self.assertEqual(run([BASE, UP, AWAY], cross=False)[2], [])       # new high, but no line break
        self.assertEqual(run([BASE, UP, AWAY], removed=0)[2], [])         # no opposite area removed

    def test_old_arrivals_are_not_news(self):
        self.assertEqual(run([BASE, UP, AWAY], known=9)[2], [])
        tail = [BASE, UP, AWAY] + [(1.1075, 1.1080, 1.1070, 1.1076 if i % 2 else 1.1074) for i in range(8)]
        self.assertEqual(run(tail)[2], [])

    def test_the_real_rule_finds_nothing_in_a_flat_market(self):
        S = A.series_of(bars([BASE, UP, AWAY]), 'M15')
        self.assertEqual(FR.found('EURUSD', S, Z.detect(S, A.FX_P), 'M15', 5, S.C[1]), [])   # no trend line, nothing removed

    def test_only_with_the_bigger_picture(self):
        x = {'sym': 'EURUSD', 'tf': 'M15', 'dir': 1, 'lo': 1.0950, 'hi': 1.0960}
        self.assertEqual(FR.head_side('LONG - REDUCED'), (1, 1))
        self.assertEqual(FR.head_side('WAIT - realigning (long side)'), (0, 0))
        self.assertEqual(FR.gate(x, *FR.head_side('LONG - FULL'), ['H4'])['why'], 'trend')
        self.assertIsNone(FR.gate(x, *FR.head_side('SHORT - FULL'), ['H4']))           # against the 4-hour picture
        self.assertIsNone(FR.gate(x, *FR.head_side('WAIT'), ['H4']))                   # picture not clear
        area = {'a': {'sym': 'EURUSD', 'dir': 1, 'tf': 'H4', 'htf': 'D1', 'lo': 1.0940, 'hi': 1.0970, 'confirmed': None}}
        g = FR.gate(x, 0, 0, ['H4'], area)                                             # ... but inside an area to watch
        self.assertEqual((g['why'], g['area_tf']), ('area', 'H4'))
        self.assertIsNone(FR.gate({**x, 'dir': -1}, 0, 0, ['H4'], area))
        self.assertIsNone(FR.gate({**x, 'lo': 1.2, 'hi': 1.21}, 0, 0, ['H4'], area))
        c = FR.card({**g, 'price': 1.0980, 'digits': 5, 'removed': 1})
        self.assertIn('inside the 4-hour area to watch', c)
        self.assertIn('near the daily trend line', c)
        c = FR.card({**FR.gate(x, 1, 1, ['H4', 'D1']), 'price': 1.0980, 'digits': 5, 'removed': 1})
        self.assertIn('Bigger picture (4-hour and daily) points up · reduced size', c)

    def test_card_is_plain_and_names_the_ftmo_symbol(self):
        x = {'id': 'NAS100|M15:D:x', 'sym': 'NAS100', 'tf': 'M15', 'dir': 1, 'lo': 26900.5, 'hi': 26950.0, 'price': 26986.3,
             'digits': 1, 'broke': True, 'removed': 2}
        c = FR.card(x, FR.ftmo())
        self.assertIn('US100.cash', c)
        self.assertIn('new 15-minute buy area', c)
        self.assertIn('closed above the 15-minute downtrend line', c)
        self.assertIn('removed 2 sell areas', c)
        for w in ('proximal', 'distal', 'HTF', 'Raja'):
            self.assertNotIn(w, c)

    def test_ftmo_list(self):
        m = FR.ftmo()
        self.assertEqual(len(m), 83)
        self.assertEqual(m['SPOTCRUDE'], 'USOIL.cash')

    def test_deliver_seeds_then_sends_each_area_once(self):
        _, _, items = run([BASE, UP, AWAY])
        self.assertEqual(len(items), 1)
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
        from unittest import mock
        with mock.patch.object(FR, 'found', lambda sym, *a: [{'sym': sym}]):
            items = FR.scan_m15(bars_of, ['EURUSD', 'USDX'], {'EURUSD': 5}, log=logs.append)
        self.assertEqual([x['sym'] for x in items], ['EURUSD'])
        self.assertTrue(any('USDX' in x for x in logs))


class Mt5Names(unittest.TestCase):
    def test_bot_view_files_also_under_the_ftmo_name(self):
        import fxscan as X
        with tempfile.TemporaryDirectory() as d:
            X.mt5_export({'cfd': {'generated': 'g', 'instruments': {'SPOTCRUDE': {'zones': [], 'tls': {}}, 'EURUSD': {'zones': [], 'tls': {}}}}}, d)
            self.assertEqual(sorted(os.listdir(os.path.join(d, 'mt5'))), ['EURUSD.txt', 'SPOTCRUDE.txt', 'USOIL.txt'])


if __name__ == '__main__':
    unittest.main()
