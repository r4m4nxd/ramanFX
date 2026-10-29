"""H1 (hourly scan) tests: the H1 nesting inside a touched H4 zone, the H1 clock, --check on H1 closes, the H4 digest
only once per H4 candle, and the regression guard that H4 / D1 / W1 / MN results are unchanged at an H4 close."""
import contextlib
import io
import os
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import fxscan as X  # noqa: E402
import oanda as O  # noqa: E402
import synth_fx  # noqa: E402
import textbook_fx as T  # noqa: E402

SPREAD = 0.6 * 0.0001
EURUSD = {'name': 'EUR_USD', 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5, 'cls': 'major'}


def h1_kinds(an):
    return [(s['kind'], s.get('watch_kind')) for s in F.signals(an) if s['tf'] == 'H1']


class H1Clock(unittest.TestCase):
    def test_labels_and_buckets(self):
        # Monday 00:00 server time = Sunday 17:00 New York (EDT, 21:00 UTC); the next hour
        self.assertEqual(C.label('2026-10-25T21:00:00Z', 'H1'), '2026-10-26T00:00')
        self.assertEqual(C.label('2026-10-26T02:00:00Z', 'H1'), '2026-10-26T05:00')
        with self.assertRaises(C.Misaligned):
            C.label('2026-10-26T02:30:00Z', 'H1')
        self.assertEqual(C.h4_bucket('2026-10-26T07:00'), '2026-10-26T04:00')
        self.assertEqual(C.h4_bucket('2026-10-26T08:00'), '2026-10-26T08:00')
        self.assertEqual(C.period_key('H1', '2026-10-26T07:00'), '2026-10-26T07:00')
        self.assertEqual(C.h1_close_utc('2026-10-23T16:00'), C.h4_close_utc('2026-10-23T16:00') - __import__('datetime').timedelta(hours=3))

    def test_config(self):
        self.assertEqual(C.ENTRY_TFS[0], 'H1')
        self.assertIn('H1', C.SIGNAL_TFS)
        self.assertEqual(C.HTF_OF['H1'], 'H4')
        self.assertEqual(C.LOWER_OF['H4'], 'H1')
        self.assertEqual(C.DIR_CHAIN['H1'], ('H1', 'H4', 'D1', 'W1'))
        self.assertEqual(C.GRAN['H1'], 'H1')
        self.assertGreater(C.SL_PCT['H1'], C.SL_PCT['H4'])           # one step looser than H4
        self.assertIn('granularity=H1', O.candles_url('EUR_USD', 'H1'))
        self.assertIn('count=2000', O.candles_url('EUR_USD', 'H1'))


class H1Nesting(unittest.TestCase):
    """An H1 zone trades only inside a touched strong H4 zone (strict top-down chain, like every other level)."""

    def test_h1_inside_touched_h4_trades(self):
        for side, kind in ((1, 'BUY'), (-1, 'SELL')):
            an = F.analyse(EURUSD, T.with_h1(side), SPREAD)
            self.assertEqual(an.asof, '2026-10-21T13:00')               # the analysis base = the newest H1 bar
            self.assertIn((kind, None), h1_kinds(an))
            s = next(s for s in F.signals(an) if s['tf'] == 'H1')
            self.assertTrue(s['loc_ok'])
            self.assertEqual(s['chain_text'].count('touched ✓'), 4)     # MN -> W1 -> D1 -> H4 -> H1 entry
            self.assertIn('H4 ' + ('demand' if side > 0 else 'supply'), s['chain_text'])
            h = abs(s['proximal'] - s['distal'])
            self.assertAlmostEqual(abs(s['stop'] - s['distal']) - (SPREAD if side < 0 else 0), max(0.20 * h, 3 * 0.0001), places=5)
            # the H4 zone was touched by this 4-hour bar's H1 bars: no longer fresh (WATCH tested, no H4 limit)
            self.assertNotIn(('BUY' if side > 0 else 'SELL', None),
                             [(x['kind'], x.get('watch_kind')) for x in F.signals(an) if x['tf'] == 'H4'])

    def test_h1_inside_untouched_h4_blocked(self):
        an = F.analyse(EURUSD, T.with_h1(touch_h4=False), SPREAD)
        self.assertEqual(h1_kinds(an), [])
        z = next(z for z in an.rows['H1'].zones if z.dir > 0 and z.zid in an.dna)
        loc = next(r for r in F.zone_rules(an, z, an.dna[z.zid]) if r.short == 'location')
        self.assertEqual(loc.status, F.FAIL)
        self.assertIn('not touched yet', loc.text)

    def test_h1_outside_h4_blocked(self):
        an = F.analyse(EURUSD, T.with_h1(level=T.H1_OUT), SPREAD)
        self.assertNotIn(('BUY', None), h1_kinds(an))
        z = next(z for z in an.rows['H1'].zones if z.dir > 0 and z.zid in an.dna)
        r = F.zone_rules(an, z, an.dna[z.zid])
        self.assertEqual(r[0].short, 'location')
        self.assertEqual(r[0].status, F.FAIL)
        self.assertEqual(F.first_block(r), 'location')

    def test_no_h1_bars_is_the_h4_analysis(self):
        an = F.analyse(EURUSD, T.textbook(), SPREAD)
        self.assertFalse(an.rows['H1'].ok)
        self.assertEqual((an.asof, an.asof_h), (an.date, 4))
        self.assertIn(('BUY', None), [(s['kind'], s.get('watch_kind')) for s in F.signals(an) if s['tf'] == 'H4'])

    def test_stale_h1_ignored(self):
        b = T.with_h1()
        b['H1'] = [x for x in b['H1'] if x.d < '2026-10-21T04:00']     # ends before the newest H4 bar
        an = F.analyse(EURUSD, b, SPREAD)
        self.assertFalse(an.rows['H1'].ok)
        self.assertEqual(an.price, b['H4'][-1].c)


class H4Unchanged(unittest.TestCase):
    """At an H4 close the H1 addition must not change any H4 / D1 / W1 / MN result (rules, plan, touches, lists)."""

    def test_regression_with_and_without_h1(self):
        for seed in (827, 63, 506, 636):
            bars = synth_fx.instrument(seed)
            no_h1 = {k: v for k, v in bars.items() if k != 'H1'}
            a, b = F.analyse(EURUSD, bars, SPREAD), F.analyse(EURUSD, no_h1, SPREAD)
            self.assertTrue(a.rows['H1'].ok)
            self.assertEqual(a.price, b.price)
            strip = lambda xs: [{k: v for k, v in x.items() if k != 'states'} for x in xs if x['tf'] != 'H1']  # noqa: E731
            self.assertEqual(strip(F.signals(a)), strip(F.signals(b)))
            self.assertEqual([h for h in F.zone_hits(a) if h['tf'] != 'H1'], F.zone_hits(b))
            for tf in ('H4', 'D1', 'W1', 'MN'):
                for z in a.rows[tf].zones:
                    if z.zid in a.dna:
                        ra = [r.as_dict() for r in F.zone_rules(a, z, a.dna[z.zid])]
                        zb = next(y for y in b.rows[tf].zones if y.zid == z.zid)
                        self.assertEqual(ra, [r.as_dict() for r in F.zone_rules(b, zb, b.dna[zb.zid])])
                        self.assertEqual(F.plan(a, z, a.dna[z.zid]), F.plan(b, zb, b.dna[zb.zid]))


class HourlySchedule(unittest.TestCase):
    def test_check_on_h1_closes(self):
        with tempfile.TemporaryDirectory() as d:
            old = C.CACHE, C.PUBLIC_STATE
            C.CACHE, C.PUBLIC_STATE = os.path.join(d, 'cache'), os.path.join(d, 'state.json')
            out = os.path.join(d, 'gh_out')
            try:
                X.save_state({'last_h1': '2026-10-26T13:00', 'last_h4': '2026-10-26T12:00'})
                env = {'OANDA_API_TOKEN': 'x', 'GITHUB_OUTPUT': out}
                for newest, want in (('2026-10-26T13:00', 'false'), ('2026-10-26T14:00', 'true')):
                    open(out, 'w').close()
                    with mock.patch.dict(os.environ, env), mock.patch.object(O, 'latest_h1', return_value=newest), \
                            mock.patch.object(X, 'crypto_latest_h1', return_value=None), \
                            contextlib.redirect_stdout(io.StringIO()):   # no network: crypto check off here (test_fx_sources)
                        self.assertEqual(X.main(['--check']), 0)
                    with open(out) as f:
                        self.assertIn(f'scan={want}', f.read())
            finally:
                C.CACHE, C.PUBLIC_STATE = old

    def test_scan_and_digest_gating(self):
        st = {'last_h1': '2026-10-26T13:00', 'last_h4': '2026-10-26T08:00', 'digest_h4': '2026-10-26T08:00'}
        self.assertTrue(X.needs_scan('2026-10-26T14:00', st, 'last_h1'))     # a new H1 bar inside the same H4 bar
        self.assertFalse(X.needs_scan('2026-10-26T13:00', st, 'last_h1'))
        self.assertFalse(X.needs_digest('2026-10-26T08:00', st))             # hourly scan, same H4 bar: no digest
        self.assertTrue(X.needs_digest('2026-10-26T12:00', st))              # a new H4 candle: one digest
        self.assertTrue(X.needs_digest('2026-10-26T08:00', st, force=True))  # manual run
        self.assertIn('last_h1', X.SCHEDULE_KEYS)

    def test_alert_names_the_hourly_candle(self):
        import fxnotify as N
        z = [{'sym': 'EURUSD', 'tf': 'H1', 'side': 'demand', 'sec': 'in', 'prox': 1.1, 'dist': 1.09, 'digits': 5, 'pips': 0,
              'tv': 'PEPPERSTONE:EURUSD', 'px': 1.1, 'wl': True, 'loc_ok': True}]
        hourly = N.SN.visible(N.alert_messages({'zones': z, 'h4': '2026-10-26T08:00', 'h1': '2026-10-26T09:00'})[0])
        at_h4 = N.SN.visible(N.alert_messages({'zones': z, 'h4': '2026-10-26T08:00', 'h1': '2026-10-26T11:00'})[0])
        self.assertIn('FX · 1H candle', hourly)
        self.assertIn('FX · 4H candle', at_h4)

    def test_public_carries_h1(self):
        uni, data, wl = X.selftest_universe()
        res = X.run(uni, lambda i: (data[i['name']], SPREAD), log=None)
        pub, shards = X.public(res, '2026-10-23T16:00', fixture=True, h1='2026-10-23T19:00')
        self.assertEqual(pub['h1'], '2026-10-23T19:00')
        self.assertEqual(pub['h1_close_utc'], '2026-10-23T17:00:00Z')
        self.assertEqual(pub['config']['chain'][-1], 'H1')
        self.assertIn('H1', pub['config']['signal_tfs'])
        row = next(r for r in pub['map'] if r['sym'] == 'GBPJPY')
        self.assertIn('H1', row['dir'])
        self.assertIn('H1', shards[row['k']]['instruments']['GBPJPY']['bars'])


if __name__ == '__main__':
    unittest.main()
