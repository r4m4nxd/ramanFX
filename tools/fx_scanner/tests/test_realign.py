"""FX side of the Raja arrival / realignment alerts: the hourly scan's pass (fxarrival.scan / run: areas, the
'inside' flag the 15-minute job reads, bootstrap, state file), the 15-minute job (realign.py: only the areas price is
in, one candle request each, the confirmation, its own state + the shared cap), and the M15 candle labels."""
import datetime as dt
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
STOCK = os.path.join(os.path.dirname(PKG), 'stock_scanner')
for p in (PKG, STOCK, os.path.join(STOCK, 'tests')):
    if p not in sys.path:
        sys.path.insert(0, p)

import arrival as A  # noqa: E402
import arrival_alerts as AA  # noqa: E402
import fxarrival as FA  # noqa: E402
import fxcfg as C  # noqa: E402
import realign as R  # noqa: E402
import test_arrival as TA  # noqa: E402  (the synthetic charts)
import zones as Z  # noqa: E402

NOW = dt.datetime(2026, 10, 29, 20, 0, tzinfo=dt.timezone.utc)


class Row:
    def __init__(self, S):
        self.S, self.ok, self.zones = S, True, Z.detect(S)


class An:
    def __init__(self, rows, price, sym='EURUSD'):
        self.rows, self.price, self.fine = rows, price, rows['H4'].S
        self.inst = {'sym': sym, 'name': 'EUR_USD', 'wl': True}
        self.nd, self.pip = 4, 0.0001


def analysis(price=None):
    """D1: a supply arrival at the top of an up move (mirror chart); W1: an up trend line (its realignment HTF)."""
    hb, _ = TA.down_trend()
    rows = {'D1': Row(TA.series(TA.mirror(TA.with_arrival(125, 3)), 'D1', price=price)),
            'W1': Row(TA.series(TA.mirror(hb), 'W1', price=price))}
    for tf in ('H1', 'H4', 'MN', '3M'):
        rows[tf] = Row(TA.series(TA.mirror(hb), tf, price=price))
        rows[tf].ok = tf in ('H1', 'H4')
    return An(rows, rows['D1'].S.price)


class HourlyPass(unittest.TestCase):
    def test_area_entered_and_inside_flag(self):
        st = {}
        FA.scan({'analyses': {'EURUSD': analysis()}}, st, NOW, log=lambda *_: None)
        rec = [a for a in st['areas'].values() if a['tf'] == 'D1']
        self.assertEqual(len(rec), 1)
        rec = rec[0]
        self.assertEqual((rec['dir'], rec['ltf'], rec['htf'], rec['oanda']), (1, 'H1', 'W1', 'EUR_USD'))
        self.assertFalse(rec['entered'])
        p = (rec['lo'] + rec['hi']) / 2
        cands = FA.scan({'analyses': {'EURUSD': analysis(p)}}, st, NOW, log=lambda *_: None)
        self.assertEqual([c['kind'] for c in cands['watch']], ['watch'])
        rec = st['areas'][rec['id']]
        self.assertTrue(rec['entered'] and rec['inside'])
        self.assertEqual(R.open_inside(st['areas'], {}), [rec])          # the 15-minute job picks it up
        self.assertEqual(R.open_inside(st['areas'], {rec['id']: 'x'}), [])

    def test_run_bootstraps_then_writes_the_state(self):
        sent = []
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'arrivals.json')
            files = dict(AA.STATE_FILES)
            AA.STATE_FILES.update({k: os.path.join(d, f'x{k}.json') for k in files})
            try:
                with mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': ''}):
                    FA.run({'analyses': {'EURUSD': analysis()}}, None, lambda m: sent.extend(m) or True, now=NOW,
                           log=lambda *_: None, state_path=p)
                    st = AA.load(p)
                    self.assertIn('seen', st)
                    self.assertEqual(sent, [])                          # first run: seeded only
                    rec = next(a for a in st['areas'].values() if a['tf'] == 'D1')
                    q = (rec['lo'] + rec['hi']) / 2
                    FA.run({'analyses': {'EURUSD': analysis(q)}}, None, lambda m: sent.extend(m) or True, now=NOW,
                           log=lambda *_: None, state_path=p)
            finally:
                AA.STATE_FILES.clear()
                AA.STATE_FILES.update(files)
            self.assertEqual(len(sent), 1)
            self.assertIn('🔁 <b>Realignment watch</b>', sent[0])
            self.assertIn('EURUSD', sent[0])
            self.assertEqual(AA.load(p)['sent'][AA.calgary_day(NOW)], 1)

    def test_a_failing_instrument_never_breaks_the_scan(self):
        bad = analysis()
        bad.rows = None
        cands = FA.scan({'analyses': {'BAD': bad, 'EURUSD': analysis()}}, {}, NOW, log=lambda *_: None)
        self.assertEqual(set(cands), {'arrival', 'watch', 'confirm'})
        self.assertEqual(FA.run({'analyses': None}, None, lambda m: True, write=False, log=lambda *_: None), 0)


class FifteenMinuteJob(unittest.TestCase):
    def area(self, **kw):
        return {'sym': 'EURUSD', 'tf': 'D1', 'ltf': 'H1', 'dir': 1, 'lo': 79.0, 'hi': 81.0, 'swing': 120.6, 'digits': 2,
                'id': 'EURUSD|D1:S:x', 'entered': 'x', 'inside': True, 'confirmed': None, 'oanda': 'EUR_USD', 'src': '',
                'pip': 0.01, 't_leg': '2026-01-01', **kw}

    def test_only_inside_low_tf_oanda_areas(self):
        areas = {'a': self.area(), 'b': self.area(ltf='H4'), 'c': self.area(inside=False), 'd': self.area(src='synthetic'),
                 'e': self.area(confirmed='t'), 'f': self.area(entered=None), 'g': self.area(ltf='M15')}
        self.assertEqual(len(R.open_inside(areas, {})), 2)

    def test_confirmation_and_state(self):
        bars = [Z.Bar(f'2026-10-29T{i:04d}', *x) for i, x in enumerate(TA.with_arrival(115, 0))]
        calls = []

        def bars_of(name, tf):
            calls.append((name, tf))
            return bars
        with tempfile.TemporaryDirectory() as d:
            fx, rt = os.path.join(d, 'arrivals.json'), os.path.join(d, 'realign.json')
            AA.save(fx, {'areas': {'EURUSD|D1:S:x': self.area(), 'GBPUSD|D1:S:y': self.area(sym='GBPUSD', inside=False)}})
            sent = []
            files = dict(AA.STATE_FILES)
            AA.STATE_FILES.update({'fx': fx, 'realign': rt, 'stocks': os.path.join(d, 's.json')})
            try:
                with mock.patch.object(A, 'NEW_BARS', {'H1': 9}), mock.patch.dict(os.environ, {'TELEGRAM_BOT_TOKEN': ''}):
                    R.run([], bars_of=bars_of, send=lambda m: sent.extend(m) or True, prefs={}, now=NOW,
                          log=lambda *_: None, fx_state=fx, path=rt)
                    st = AA.load(rt)
                    R.run([], bars_of=bars_of, send=lambda m: sent.extend(m) or True, prefs={}, now=NOW,
                          log=lambda *_: None, fx_state=fx, path=rt)
            finally:
                AA.STATE_FILES.clear()
                AA.STATE_FILES.update(files)
        self.assertEqual(calls, [('EUR_USD', 'H1')])                 # one request, the inside area only; then nothing
        self.assertEqual(len(sent), 1)
        self.assertIn('✅ <b>Confirmation</b>', sent[0])
        self.assertIn('BUY', sent[0])
        self.assertIn('EURUSD|D1:S:x', st['area_confirmed'])
        self.assertEqual(st['sent'][AA.calgary_day(NOW)], 1)

    def test_nothing_inside_no_oanda_call(self):
        with tempfile.TemporaryDirectory() as d:
            fx = os.path.join(d, 'arrivals.json')
            AA.save(fx, {'areas': {}})
            boom = mock.Mock(side_effect=AssertionError('no call'))
            self.assertEqual(R.run([], bars_of=boom, log=lambda *_: None, fx_state=fx, path=os.path.join(d, 'r.json')), 0)
            self.assertFalse(os.path.exists(os.path.join(d, 'r.json')))

    def test_dry_run_writes_nothing(self):
        bars = [Z.Bar(f'2026-10-29T{i:04d}', *x) for i, x in enumerate(TA.with_arrival(115, 0))]
        with tempfile.TemporaryDirectory() as d:
            fx, rt = os.path.join(d, 'arrivals.json'), os.path.join(d, 'realign.json')
            AA.save(fx, {'areas': {'EURUSD|D1:S:x': self.area()}})
            sent = []
            with mock.patch.object(A, 'NEW_BARS', {'H1': 9}):
                R.run(['--dry-run'], bars_of=lambda n, t: bars, send=lambda m: sent.extend(m) or True, prefs={},
                      now=NOW, log=lambda *_: None, fx_state=fx, path=rt)
            self.assertEqual(sent, [])
            self.assertFalse(os.path.exists(rt))


class Labels(unittest.TestCase):
    def test_m15_labels(self):
        # 14:15 UTC on Oct 29 (EDT) = 17:15 server time (New York + 7 h)
        self.assertEqual(C.label('2026-10-29T14:15:00.000000000Z', 'M15'), '2026-10-29T17:15')
        with self.assertRaises(C.Misaligned):
            C.label('2026-10-29T14:20:00.000000000Z', 'M15')
        self.assertEqual(C.GRAN['M15'], 'M15')
        self.assertNotIn('M15', C.ENTRY_TFS)


if __name__ == '__main__':
    unittest.main()
