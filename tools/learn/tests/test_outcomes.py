"""Live outcome tracker tests (tools/learn/outcomes.py): synthetic candles, no network, no clock."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import outcomes as O  # noqa: E402

NOW = dt.datetime(2026, 11, 3, 12, 0, tzinfo=dt.timezone.utc)
NOW_ISO = '2026-11-03T12:00:00Z'


def H(i):
    """H1 label i hours after 2026-11-02T00:00 (server time)."""
    t = dt.datetime(2026, 11, 2) + dt.timedelta(hours=i)
    return t.strftime('%Y-%m-%dT%H:%M')


def bars(*ohlc, start=1):
    return [(H(start + k), *b) for k, b in enumerate(ohlc)]


def long_idea(tf='H1', target=1.1100, kind='BUY', **kw):
    # entry 1.1000, stop 1.0950 (risk 50 pips), distal 1.0960
    return O.make_idea('fx', 'EURUSD', kind, tf, 1, 1.1000, 1.0950, target, 1.0960, 5, 'H1:D:x', H(0), NOW_ISO,
                       watch=kind == 'WATCH', **kw)


def short_idea(target=1.0900):
    return O.make_idea('fx', 'EURUSD', 'SELL', 'H1', -1, 1.1000, 1.1050, target, 1.1040, 5, 'H1:S:x', H(0), NOW_ISO)


class Resolver(unittest.TestCase):
    def test_fill_then_target(self):
        e = long_idea()
        O.resolve(e, bars((1.1020, 1.1030, 1.0995, 1.1010),     # fill (low 1.0995 <= 1.1000)
                          (1.1010, 1.1060, 1.1000, 1.1050),     # +1.2R
                          (1.1050, 1.1105, 1.1040, 1.1100)), NOW_ISO)   # target 1.1100 = +2R
        self.assertEqual(e['outcome'], 'target')
        self.assertTrue(e['filled'])
        self.assertEqual(e['fill_t'], H(1))
        self.assertAlmostEqual(e['r'], 2.0)
        self.assertAlmostEqual(e['mfe_r'], 2.0)                  # capped at the target's R
        self.assertAlmostEqual(e['mae_r'], 0.1)                  # 1.0995: 5 pips under the entry / 50
        self.assertTrue(e['hit_1r'])
        self.assertEqual(e['bars_held'], 2)

    def test_no_fill_expires_after_30_bars(self):
        e = long_idea()
        away = [(1.1030, 1.1050, 1.1010, 1.1040)] * 40
        O.resolve(e, bars(*away), NOW_ISO)
        self.assertEqual(e['outcome'], 'expired')
        self.assertFalse(e['filled'])
        self.assertEqual(e['n'], 30)
        self.assertIsNone(e['r'])

    def test_expiry_counts_entry_tf_bars(self):
        e = long_idea(tf='H4')                                   # 30 H4 bars = 120 H1 path bars
        away = [(1.1030, 1.1050, 1.1010, 1.1040)] * 130
        O.resolve(e, bars(*away), NOW_ISO)
        self.assertEqual(e['n'], 120)
        self.assertEqual(e['outcome'], 'expired')

    def test_stop_first_on_the_same_bar(self):
        e = long_idea()
        O.resolve(e, bars((1.1020, 1.1030, 1.0998, 1.1010),
                          (1.1010, 1.1110, 1.0940, 1.1000)), NOW_ISO)   # target AND stop in one bar
        self.assertEqual(e['outcome'], 'stop')
        self.assertEqual(e['r'], -1.0)
        self.assertEqual(e['mae_r'], 1.0)                        # capped at the stop
        self.assertFalse(e['hit_1r'])

    def test_stop_on_the_fill_bar(self):
        e = long_idea()
        O.resolve(e, bars((1.1020, 1.1030, 1.0940, 1.0950)), NOW_ISO)
        self.assertEqual(e['outcome'], 'stop')
        self.assertTrue(e['filled'])
        self.assertEqual(e['bars_held'], 0)

    def test_target_not_counted_on_the_fill_bar(self):
        e = long_idea()
        O.resolve(e, bars((1.1020, 1.1120, 1.0990, 1.1080)), NOW_ISO)   # fills and touches the target in one bar
        self.assertEqual(e['status'], 'open')
        self.assertTrue(e['hit_1r'])
        O.resolve(e, bars((1.1080, 1.1090, 1.1060, 1.1070), start=2), NOW_ISO)
        self.assertEqual(e['status'], 'open')

    def test_cancel_when_target_reached_before_fill(self):
        e = long_idea()
        O.resolve(e, bars((1.1020, 1.1050, 1.1010, 1.1040),
                          (1.1040, 1.1110, 1.1030, 1.1100),     # target, entry never touched
                          (1.1100, 1.1100, 1.0900, 1.0920)), NOW_ISO)
        self.assertEqual(e['outcome'], 'cancelled')
        self.assertEqual(e['why'], 'target')
        self.assertFalse(e['filled'])
        self.assertEqual(e['exit_t'], H(2))

    def test_cancel_on_a_gap_past_the_distal(self):
        e = long_idea()
        O.resolve(e, bars((1.0955, 1.0970, 1.0900, 1.0910)), NOW_ISO)   # opens under the distal 1.0960
        self.assertEqual(e['outcome'], 'cancelled')
        self.assertEqual(e['why'], 'distal')

    def test_open_trade_expires_after_60_bars_scored_at_close(self):
        e = long_idea(target=1.1500)
        flat = [(1.1010, 1.1030, 1.0990, 1.1015)] + [(1.1010, 1.1030, 1.0990, 1.1020)] * 70
        O.resolve(e, bars(*flat), NOW_ISO)
        self.assertEqual(e['outcome'], 'expired')
        self.assertTrue(e['filled'])
        self.assertAlmostEqual(e['r'], 0.4)                      # (1.1020 - 1.1000) / 0.0050
        self.assertEqual(e['bars_held'], 60)
        self.assertAlmostEqual(e['mfe_r'], 0.6)
        self.assertAlmostEqual(e['mae_r'], 0.2)

    def test_short_mfe_mae(self):
        e = short_idea()
        O.resolve(e, bars((1.0980, 1.1010, 1.0975, 1.0990),     # fill (high 1.1010 >= 1.1000), MAE 0.2R
                          (1.0990, 1.1020, 1.0930, 1.0940),     # MAE 0.4R, MFE 1.4R
                          (1.0940, 1.0950, 1.0895, 1.0900)), NOW_ISO)   # target 1.0900 = +2R
        self.assertEqual(e['outcome'], 'target')
        self.assertAlmostEqual(e['mae_r'], 0.4)
        self.assertAlmostEqual(e['r'], 2.0)

    def test_no_target_only_stop_or_expiry(self):
        e = long_idea(target=None, kind='WATCH')
        self.assertTrue(e['watch'])
        O.resolve(e, bars((1.1020, 1.1030, 1.0995, 1.1010), (1.1010, 1.2000, 1.1000, 1.1900)), NOW_ISO)
        self.assertEqual(e['status'], 'open')
        self.assertAlmostEqual(e['mfe_r'], 20.0)

    def test_bars_before_publication_ignored_and_incremental_resume(self):
        e = long_idea()
        before = [(H(-1), 1.0, 1.2, 0.9, 1.0)]                  # would fill + stop: before the idea, ignored
        O.resolve(e, before + bars((1.1030, 1.1050, 1.1010, 1.1040)), NOW_ISO)
        self.assertEqual(e['status'], 'pending')
        self.assertEqual(e['n'], 1)
        # next run: the window no longer reaches back to asof, continues after 'last'
        O.resolve(e, bars((1.1030, 1.1050, 1.1010, 1.1040), (1.1040, 1.1045, 1.0990, 1.1000), start=1), NOW_ISO)
        self.assertEqual(e['n'], 2)
        self.assertEqual(e['status'], 'open')
        self.assertNotIn('gap', e)
        # a run whose bars start after 'last': gap flagged, still advanced
        O.resolve(e, bars((1.1000, 1.1010, 1.0940, 1.0950), start=10), NOW_ISO)
        self.assertTrue(e['gap'])
        self.assertEqual(e['outcome'], 'stop')

    def test_recompute_is_idempotent(self):
        e = long_idea()
        b = bars((1.1020, 1.1030, 1.0995, 1.1010), (1.1010, 1.1060, 1.1000, 1.1050))
        O.resolve(e, [(H(0), 1, 1, 1, 1)] + b, NOW_ISO)
        first = dict(e)
        O.resolve(e, [(H(0), 1, 1, 1, 1)] + b, NOW_ISO)
        self.assertEqual(first, e)

    def test_bad_plans_rejected(self):
        self.assertIsNone(O.make_idea('fx', 'X', 'BUY', 'H1', 1, 1.0, 1.0, None, None, 5, '', H(0), NOW_ISO))
        self.assertIsNone(O.make_idea('fx', 'X', 'BUY', 'H1', 1, 1.0, 1.1, None, None, 5, '', H(0), NOW_ISO))
        self.assertIsNone(O.make_idea('fx', 'X', 'BUY', 'H1', 1, None, 0.9, None, None, 5, '', H(0), NOW_ISO))
        it = O.make_idea('fx', 'X', 'BUY', 'H1', 1, 1.0, 0.9, 0.95, None, 5, '', H(0), NOW_ISO)
        self.assertIsNone(it['target'])                          # target on the wrong side dropped

    def test_stock_ratios(self):
        e = O.make_idea('stock', 'AAPL', 'BUY', 'W1', 1, 100.0, 95.0, 120.0, 96.0, 2, 'W1:D:x', '2026-10-01', NOW_ISO)
        self.assertEqual(O.path_bars(e, 30), 150)
        days = [((dt.date(2026, 10, 1) + dt.timedelta(days=k + 1)).isoformat(), 105.0, 106.0, 104.0, 105.0) for k in range(200)]
        O.resolve(e, days, NOW_ISO)
        self.assertEqual(e['outcome'], 'expired')
        self.assertEqual(e['n'], 150)


def fx_latest(signals, watch=(), h1=H(0)):
    return {'generated': '2026-11-03T11:05:00Z', 'h1': h1, 'crypto_h1': h1, 'signals': list(signals), 'watch': list(watch)}


SIG = {'kind': 'BUY', 'sym': 'EURUSD', 'tf': 'H1', 'side': 'demand', 'entry': 1.1, 'stop': 1.095, 'target': 1.11,
       'distal': 1.096, 'zid': 'H1:D:2026-11-01T10:00', 'digits': 5, 'cls': 'major', 'zone_type': 'ARR', 'pattern': 'DBR',
       'direction': 'LONG - REDUCED', 'score': 9, 'loc': 'inside', 'loc_ok': True}


class Ledger(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        os.makedirs(os.path.join(self.root, 'public', 'fx', 'd'))
        self.write_fx(fx_latest([SIG], [dict(SIG, kind='WATCH', watch_kind='new', tf='H4')]), [])

    def tearDown(self):
        self.tmp.cleanup()

    def write_fx(self, latest, h1_rows, arrivals=None):
        fx = os.path.join(self.root, 'public', 'fx')
        with open(os.path.join(fx, 'latest.json'), 'w') as f:
            json.dump(latest, f)
        with open(os.path.join(fx, 'd', 'major.json'), 'w') as f:
            json.dump({'instruments': {'EURUSD': {'cls': 'major', 'bars': {'H1': [list(b) for b in h1_rows]}}}}, f)
        if arrivals is not None:
            with open(os.path.join(fx, 'arrivals.json'), 'w') as f:
                json.dump(arrivals, f)

    def ledger(self):
        return O.load_json(os.path.join(self.root, 'public', 'learn', 'ledger-fx.json'))

    def test_dedupe_across_runs(self):
        st = O.run('fx', self.root, NOW, log=None)
        self.assertEqual(st['added'], 2)
        st = O.run('fx', self.root, NOW + dt.timedelta(hours=1), log=None)
        self.assertEqual(st['added'], 0)
        # same zone, entry moved by less than the rounding: same idea; a new kind is a new idea
        self.write_fx(fx_latest([dict(SIG, entry=1.100001), dict(SIG, kind='SELL', side='supply', entry=1.12, stop=1.125,
                                                                 target=1.1, distal=1.124, zid='H1:S:z')]), [])
        st = O.run('fx', self.root, NOW + dt.timedelta(hours=2), log=None)
        self.assertEqual(st['added'], 1)
        keys = sorted(self.ledger()['entries'])
        self.assertEqual(len(keys), 3)
        self.assertIn('fx|EURUSD|BUY|H1|long|1.10000|H1:D:2026-11-01T10:00', keys)
        e = self.ledger()['entries']['fx|EURUSD|BUY|H1|long|1.10000|H1:D:2026-11-01T10:00']
        self.assertEqual(e['first_seen'], '2026-11-03T11:05:00Z')
        self.assertEqual(e['risk'], 0.005)
        self.assertTrue(e['tags']['ct'])
        self.assertEqual(e['tags']['zone_type'], 'ARR')

    def test_run_resolves_and_summarises(self):
        O.run('fx', self.root, NOW, log=None)
        rows = [(H(0), 1.1, 1.1, 1.1, 1.1)] + bars((1.1020, 1.1030, 1.0995, 1.1010), (1.1010, 1.1110, 1.1000, 1.1100))
        self.write_fx(fx_latest([SIG], [], h1=H(2)), rows)
        O.run('fx', self.root, NOW + dt.timedelta(hours=2), log=None)
        out = O.load_json(os.path.join(self.root, 'public', 'learn', 'outcomes.json'))
        self.assertEqual(out['schema'], 1)
        g = out['windows']['90d']['fx|BUY|H1|long']
        self.assertEqual(g, {'n': 1, 'filled': 1, 'win': 1.0, 'exp_r': 2.0, 'avg_mfe_r': 2.0, 'avg_mae_r': 0.1, 'hit_1r': 1.0})
        self.assertEqual(out['groups'], out['windows']['all'])
        self.assertIn('fx|BUY|H1|long|ct', out['tags']['all'])
        self.assertIn('fx|BUY|H1|long|zone_type:ARR', out['tags']['all'])
        self.assertTrue(all(k.count('|') == 3 for k in out['windows']['90d']))
        self.assertEqual(out['recent'][0]['outcome'], 'target')
        self.assertEqual(out['recent'][0]['r'], 2.0)
        self.assertEqual(out['counts']['closed'], 2)             # the H4 watch too (same bars)
        self.assertTrue(out['windows']['all']['fx|WATCH|H4|long']['n'] == 1)

    def test_confirmations_from_arrivals(self):
        arr = {'last_items': {'at': '2026-11-03T11:04:00Z', 'items': [
            {'kind': 'confirm', 'sym': 'EURUSD', 'tf': 'W1', 'ltf': 'H4', 'dir': 1, 'entry': 1.09, 'stop': 1.085,
             'target': 1.12, 'lo': 1.086, 'hi': 1.09, 'n_removed': 2, 'digits': 5, 'id': 'EURUSD|W1:a|H4:b'},
            {'kind': 'arrival', 'sym': 'EURUSD', 'tf': 'H1', 'dir': 1, 'entry': 1.09, 'stop': 1.085, 'digits': 5, 'id': 'q'}]}}
        self.write_fx(fx_latest([]), [], arrivals=arr)
        O.run('fx', self.root, NOW, log=None)
        ent = list(self.ledger()['entries'].values())
        self.assertEqual([(e['kind'], e['tf'], e['tags'].get('area'), e['tags'].get('removed')) for e in ent],
                         [('CONFIRM', 'H4', 'W1', '2+')])
        self.assertEqual(ent[0]['distal'], 1.086)
        # a stale list (a run whose arrival pass failed) is not re-read as new
        arr['last_items']['at'] = '2026-11-02T00:00:00Z'
        arr['last_items']['items'][0]['id'] = 'other'
        self.write_fx(fx_latest([]), [], arrivals=arr)
        self.assertEqual(O.run('fx', self.root, NOW, log=None)['added'], 0)

    def test_bounded_ledger_keeps_all_time_counts(self):
        led = {'entries': {}}
        old = (NOW - dt.timedelta(days=4 * 365)).strftime('%Y-%m-%dT%H:%M:%SZ')
        for i in range(5):
            e = long_idea()
            O.resolve(e, bars((1.1020, 1.1030, 1.0995, 1.1010), (1.1010, 1.1110, 1.1000, 1.1100)), old if i < 3 else NOW_ISO)
            led['entries'][f'k{i}'] = e
        led['entries']['open'] = long_idea()
        self.assertEqual(O.bound(led, NOW), 3)
        self.assertEqual(sorted(led['entries']), ['k3', 'k4', 'open'])
        self.assertEqual(led['archive']['n'], 3)
        s = O.summary([led], NOW)
        self.assertEqual(s['windows']['all']['fx|BUY|H1|long']['n'], 5)
        self.assertEqual(s['windows']['90d']['fx|BUY|H1|long']['n'], 2)
        self.assertEqual(s['counts']['archived'], 3)
        # hard cap: oldest closed first, open ones kept
        self.assertEqual(O.bound(led, NOW, max_entries=2), 1)
        self.assertIn('open', led['entries'])
        self.assertEqual(O.summary([led], NOW)['windows']['all']['fx|BUY|H1|long']['n'], 5)

    def test_never_raises(self):
        with open(os.path.join(self.root, 'public', 'fx', 'latest.json'), 'w') as f:
            f.write('{broken')
        self.assertEqual(O.main(['--market', 'fx', '--root', self.root]), 0)
        self.assertEqual(O.main(['--market', 'stocks', '--root', os.path.join(self.root, 'nowhere')]), 0)


class Stocks(unittest.TestCase):
    def test_stock_ideas_and_cache_bars(self):
        with tempfile.TemporaryDirectory() as root:
            sc = os.path.join(root, 'public', 'scanner')
            cache = os.path.join(root, 'cache')
            os.makedirs(os.path.join(cache, 'daily'))
            os.makedirs(sc)
            latest = {'date': '2026-10-01', 'generated_at': '2026-10-01T20:40:00Z', 'signals': [
                {'kind': 'BUY', 'symbol': 'AAPL', 'tf': 'W1', 'entry': 100.0, 'stop': 95.0, 'target': 110.0, 'distal': 96.0,
                 'base_start': '2026-08-03', 'zone_type': 'WOW', 'direction': 'LONG - FULL', 'indexes': ['SPX']}]}
            arr = {'updated': '2026-10-01T20:39:00Z', 'weekly_turns': [
                {'sym': 'MSFT', 'w1_cross': '2026-09-26', 'w1_state': 'turning', 'w1_removed': 1, 'd1_lo': 400.0, 'd1_hi': 410.0}]}
            def put(n, js):
                with open(os.path.join(sc, n), 'w') as f:
                    json.dump(js, f)
            put('latest.json', latest)
            put('arrivals.json', arr)
            days = [('2026-09-30', 1, 1, 1, 1), ('2026-10-01', 1, 1, 1, 1), ('2026-10-02', 101, 102, 99.5, 101),
                    ('2026-10-05', 101, 111, 100.5, 110), ('2026-10-06', 50, 50, 50, 50)]   # 10-06: after the scan date
            for sym in ('AAPL', 'MSFT'):
                with open(os.path.join(cache, 'daily', f'{sym}.json'), 'w') as f:
                    json.dump({'bars': [list(d) + [0] for d in days]}, f)
            os.environ['SCANNER_CACHE'] = cache
            try:
                st = O.run('stock', root, dt.datetime(2026, 10, 1, 21, tzinfo=dt.timezone.utc), log=None)
                self.assertEqual(st['added'], 2)
                self.assertEqual(st['closed_now'], 0)             # no bar after the scan date yet
                put('latest.json', dict(latest, date='2026-10-05', generated_at='2026-10-05T20:40:00Z'))
                st = O.run('stock', root, dt.datetime(2026, 10, 5, 21, tzinfo=dt.timezone.utc), log=None)
            finally:
                os.environ.pop('SCANNER_CACHE', None)
            self.assertEqual(st['added'], 0)
            led = O.load_json(os.path.join(root, 'public', 'learn', 'ledger-stock.json'))['entries']
            a = led['stock|AAPL|BUY|W1|long|100.00|2026-08-03']
            self.assertEqual(a['outcome'], 'target')
            self.assertEqual(a['fill_t'], '2026-10-02')
            self.assertAlmostEqual(a['r'], 2.0)
            t = led['stock|MSFT|TURN|D1|long|410.00|W1x2026-09-26']
            self.assertEqual((t['outcome'], t['why']), ('cancelled', 'distal'))   # opened at 101, under the 400 distal
            self.assertEqual(a['exit_t'], '2026-10-05')            # 10-06 (after the scan date) never read
            out = O.load_json(os.path.join(root, 'public', 'learn', 'outcomes.json'))
            self.assertIn('stock|BUY|W1|long', out['windows']['all'])


if __name__ == '__main__':
    unittest.main()
