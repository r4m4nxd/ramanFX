"""fxexperiments + the experiment path of fx_backtest: synthetic data, no network."""
import dataclasses
import json
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
for p in (PKG, os.path.join(PKG, 'fixtures'), os.path.join(os.path.dirname(PKG), 'stock_scanner')):
    if p not in sys.path:
        sys.path.insert(0, p)

import fx_backtest as B  # noqa: E402
import fxcore as F  # noqa: E402
import fxexperiments as X  # noqa: E402
import synth_fx  # noqa: E402
import textbook_fx as T  # noqa: E402
from zones import Bar  # noqa: E402

EURUSD = {'name': 'EUR_USD', 'type': 'CURRENCY', 'pipLocation': -4, 'displayPrecision': 5, 'sym': 'EURUSD', 'cls': 'major'}
SP = 0.0002


def q(d, o, h, l, c, sp=SP):
    return B.quote_from_mid(Bar(d, o, h, l, c), sp)


def buy(**kw):
    o = dict(inst='EUR_USD', sym='EURUSD', cls='majors', wl=True, tf='H4', d=1, entry=1.1000, stop=1.0980, target=1.1060,
             distal=1.0983, signal='2024-01-01T00:00', expires='2024-01-20T00:00')
    o.update(kw)
    return B.Order(**o)


def H(k):
    """Label of the k-th H4 bar after 2024-01-01T00:00 (weekdays only matter to nothing here)."""
    return B.add_days('2024-01-01T00:00', k / 6)


def ALL():
    """What a default run evaluates: the ablations + every experiment on every base."""
    return B.args_variants(type('A', (), {'no_ablations': False, 'no_experiments': False})())


def synth(n=2400, seed=15):
    h4 = synth_fx.h4_walk(seed, n=n)
    return [B.quote_from_mid(b, SP) for b in h4], {tf: synth_fx.aggregate(h4, tf) for tf in ('D1', 'W1', 'MN')}


def fake_cands(bars):
    """Deterministic candidates from the CLOSED bars only (every 9th H4 close), with every key the experiments use."""
    h4 = bars['H4']
    k = int((B._p(h4[-1].d) - B._p('2000-01-03T00:00')).total_seconds() // 14400)   # bar number from the label
    if k % 9:
        return []
    last = h4[-1]
    atr = X.atr14(h4[-20:]) or 0.001
    d = 1 if (k // 9) % 2 else -1
    prox = last.c - d * 0.4 * atr
    dist = prox - d * 0.8 * atr
    entry = prox + (SP if d > 0 else 0.0)
    stop = dist - d * 0.1 * atr + (SP if d < 0 else 0.0)
    target = entry + d * 4.5 * abs(entry - stop)
    fresh_fail = (k // 9) % 3 == 0
    loc = (k // 9) % 4 == 1                      # fails the location rule (no_nesting / loose bases only)
    spr = (k // 9) % 6 == 5                      # + the spread rule (loose base only)
    fails = ({'fresh'} if fresh_fail else set()) | ({'location'} if loc or spr else set()) | ({'spread'} if spr else set())
    return [{'kind': 'BUY' if d > 0 else 'SELL', 'tf': 'H4' if (k // 9) % 4 else 'D1', 'side': 'demand' if d > 0 else 'supply',
             'base_start': last.d, 'd': d, 'entry': entry, 'stop': stop, 'target': target, 'rr': 3.2, 'prox': prox,
             'distal': dist, 'zone_type': 'STR', 'pattern': 'RBR' if (k // 9) % 2 else 'DBR', 'cont': (k // 9) % 5 < 2,
             'score': 8, 'to_entry_pips': 0.4 * atr / 0.0001, 'fails': frozenset(fails),
             'used_body': 0, 'used_depth': 1, 'nested': (k // 9) % 7 < 3,
             'mn_pos': X.mn_range_pos(bars['MN'], last.c), 'opp_prox': [entry + d * 2.7 * abs(entry - stop), entry + d * 5 * abs(entry - stop)],
             'tp_off': 0.0001, 'spread': SP, 'atr': atr, 'atr_hist': [atr] * 60, 'htf_trend': (1 if (k // 9) % 3 else -1)}]


def fake_fn(inst, bars, spread, variants):
    return B.variant_signals(fake_cands(bars), variants)


def run(h4, htf, start, **kw):
    return B.run_instrument(EURUSD, h4, htf, start, variants=ALL(), signal_fn=fake_fn, warmup=300, **kw)


def by_variant(res):
    out = {}
    for v, o in res['orders']:
        out.setdefault(v, []).append(o)
    return out


class Definitions(unittest.TestCase):
    def test_table(self):
        want = {'be_1r', 'be_2r', 'be_struct', 'time_stop', 'tp_fixed3', 'tp_zone', 'fresh_body', 'fresh_depth25',
                'cont_off', 'cont_nested', 'cont_htf', 'stop_atr', 'stop_tight', 'arrive_stair', 'curve_top3', 'cancel_50',
                'volreg_half', 'ct_half', 'split_entry', 'current'}
        self.assertEqual(set(X.VARIANTS), want)
        for vid, m in X.VARIANTS.items():
            self.assertIn(m['kind'], ('filter', 'exit', 'size'), vid)
            self.assertIn(m['group'], B.GROUPS_OK, vid)
            self.assertTrue(m['desc'].endswith('.'), vid)
            self.assertIn(vid, X.DEFINITIONS)
        self.assertEqual(set(X.experiment_ids()) | {'current'} | set(X.SKIPPED), want)


class SharedSignals(unittest.TestCase):
    """The shared candidate path gives exactly fxcore.signals' BUY / SELL (current and the ablations)."""
    def key(self, ss):
        return sorted((s['kind'], s['tf'], s['base_start'], s['entry'], s['stop'], s['target']) for s in ss)

    def test_textbook_equals_live_signals(self):
        for side in (1, -1):
            an = F.analyse(EURUSD, T.textbook(side), 0.0001)
            got = B.variant_signals(B.candidates(an), ALL())
            live = [s for s in F.signals(an) if s['kind'] in ('BUY', 'SELL')]
            self.assertTrue(live)
            self.assertEqual(self.key(got['full']), self.key(live))
            for v, ign in (('no_nesting', ('location',)), ('no_spread', ('spread',))):
                self.assertEqual(self.key(got[v]), self.key([s for s in B.signals_with(an, ign) if s['kind'] in ('BUY', 'SELL')]))
            for v in X.experiment_ids():
                self.assertLessEqual(len(got[B.exp_key('current', v)]), len(live) + 1, v)
            for b, (k, ign) in B.BASES.items():                # a base = its ablation
                self.assertEqual(self.key(got[k]), self.key([s for s in B.signals_with(an, ign) if s['kind'] in ('BUY', 'SELL')]))

    def test_synthetic_walk_equals_live_signals(self):
        h4, htf = synth(n=2200)
        checked = []

        def both(inst, bars, spread, variants):
            an = F.analyse(inst, bars, spread)
            got = B.variant_signals(B.candidates(an), {'full': (), 'no_nesting': ('location',)})
            for v, ign in (('full', ()), ('no_nesting', ('location',))):
                self.assertEqual(self.key(got[v]), self.key([s for s in B.signals_with(an, ign) if s['kind'] in ('BUY', 'SELL')]))
            checked.append(1)
            return got
        B.run_instrument(EURUSD, h4, htf, h4[1900].d, variants={'full': (), 'no_nesting': ('location',)}, signal_fn=both,
                         warmup=300, step_n=15)
        self.assertGreater(len(checked), 10)


class Exits(unittest.TestCase):
    def test_be_1r_and_excursions(self):
        o, base = buy(rule='be_1r'), buy()
        bars = [q(H(1), 1.1010, 1.1012, 1.0999, 1.1005),          # fill (ask low 1.1000); bid low 1.0998 -> MAE 0.1R
                q(H(2), 1.1005, 1.1025, 1.1003, 1.1020),          # bid high 1.1024 -> MFE 1.2R -> stop to entry
                q(H(3), 1.1015, 1.1016, 1.0990, 1.0995)]          # bid low 1.0989: BE stop (current: still open)
        for b in bars:
            B.step(o, b)
            B.step(base, b)
        self.assertEqual((o.status, o.r), ('stop', 0.0))
        self.assertAlmostEqual(o.mfe, 1.2)
        self.assertAlmostEqual(o.mae, 0.1)
        self.assertEqual(o.bars, 2)
        self.assertEqual(base.status, 'open')
        self.assertAlmostEqual(base.stop, 1.0980)

    def test_be_trigger_bar_is_not_stopped_at_be(self):
        o = buy(rule='be_1r')
        B.step(o, q(H(1), 1.1010, 1.1012, 1.0999, 1.1005))
        B.step(o, q(H(2), 1.1005, 1.1030, 1.0990, 1.1000))          # +1.4R and back below entry in ONE bar
        self.assertEqual(o.status, 'open')                          # the stop moves after the bar, not inside it
        self.assertAlmostEqual(o.stop, 1.1000)

    def test_be_struct(self):
        o = buy(rule='be_struct')
        B.step(o, q(H(1), 1.1010, 1.1012, 1.0999, 1.1005))          # fill; bid low 1.0998
        B.step(o, q(H(2), 1.1005, 1.1010, 1.0992, 1.1008))          # bid low 1.0991 (lowest since the fill)
        self.assertAlmostEqual(o.stop, 1.0980)
        B.step(o, q(H(3), 1.1008, 1.1032, 1.1006, 1.1030))          # bid high 1.1031 = +1.55R
        self.assertAlmostEqual(o.stop, 1.0991)
        B.step(o, q(H(4), 1.1030, 1.1040, 1.1020, 1.1035))
        self.assertAlmostEqual(o.stop, 1.0991)                      # never loosens / never moves up on its own

    def test_time_stop(self):
        o = buy(rule='time_stop')
        B.step(o, q(H(1), 1.1010, 1.1012, 1.0999, 1.1005))
        for k in range(2, 11):
            B.step(o, q(H(k), 1.1005, 1.1015, 1.0995, 1.1008))
            self.assertEqual(o.status, 'open', k)
        B.step(o, q(H(11), 1.1008, 1.1015, 1.0995, 1.1006))         # 10th bar after the fill: exit at the bid close
        self.assertEqual(o.status, 'time')
        self.assertAlmostEqual(o.r, (1.1006 - SP / 2 - 1.1000) / 0.0020)
        d1 = buy(rule='time_stop', tf='D1')
        B.step(d1, q(H(1), 1.1010, 1.1012, 1.0999, 1.1005))
        for k in range(2, 13):
            B.step(d1, q(H(k), 1.1005, 1.1015, 1.0995, 1.1008))
        self.assertEqual(d1.status, 'open')                         # D1 entry: 60 H4 bars
        self.assertFalse(X.time_exit('time_stop', 'H4', 10, 1.0))   # +1R reached: no time exit

    def test_targets_and_stops(self):
        c = {'d': 1, 'entry': 1.1000, 'stop': 1.0980, 'target': 1.1100, 'distal': 1.0985, 'prox': 1.0998,
             'opp_prox': [1.1040, 1.1200, 1.0900], 'tp_off': 0.0007, 'spread': SP, 'atr': 0.0010}
        self.assertAlmostEqual(X.adjust('tp_fixed3', c)['target'], 1.1060)
        self.assertIsNone(X.adjust('tp_zone', c))                   # 1.1033 = 1.65R < 2.5R: skipped
        c2 = {**c, 'opp_prox': [1.1080]}
        self.assertAlmostEqual(X.adjust('tp_zone', c2)['target'], 1.1073)
        s = {**c, 'd': -1, 'entry': 1.1000, 'stop': 1.1020, 'target': 1.0900, 'distal': 1.1015, 'opp_prox': [1.0920]}
        self.assertAlmostEqual(X.adjust('tp_zone', s)['target'], 1.0920 + 0.0007 + SP)
        self.assertAlmostEqual(X.adjust('tp_fixed3', s)['target'], 1.0940)
        self.assertAlmostEqual(X.adjust('stop_atr', c)['stop'], 1.0975)          # distal - 1 ATR is wider
        self.assertAlmostEqual(X.adjust('stop_atr', {**c, 'atr': 0.0001})['stop'], 1.0980)
        self.assertIsNone(X.adjust('stop_atr', {**c, 'atr': 0.0050}))           # wider stop: room < 2x -> skipped
        self.assertAlmostEqual(X.adjust('stop_atr', s)['stop'], 1.1015 + 0.0010 + SP)
        self.assertAlmostEqual(B.Order(**{**dataclasses.asdict(buy()), 'stop': 1.0975, 'risk0': 0.0}).risk0, 0.0025)

    def test_split_entry_r(self):
        legs = X.split_entries(1, 1.1002, 1.1000, 1.0980)
        self.assertEqual(legs, [(1.1002, 0.5), (1.1002 + (1.1000 + 1.0980) / 2 - 1.1000, 0.5)])
        a = buy(entry=1.1000, stop=1.0970, target=1.1060, group='g', weight=0.5)
        b = buy(entry=1.0990, stop=1.0970, target=1.1060, group='g', weight=0.5)
        a.status, a.r, a.exit_t = 'target', 2.0, H(5)
        b.status = 'missed'
        (t,) = B.exp_trades([a, b])
        self.assertAlmostEqual(t['r'], 0.5 * 0.0060 / (0.5 * 0.0030 + 0.5 * 0.0020))
        b.status, b.r, b.exit_t = 'stop', -1.0, H(4)
        a.status, a.r = 'stop', -1.0
        (t,) = B.exp_trades([a, b])
        self.assertAlmostEqual(t['r'], -1.0)                         # both halves stopped = exactly -1R
        b.status = 'open'
        self.assertEqual(B.exp_trades([a, b]), [])                  # a leg still open: not closed yet

    def test_half_size(self):
        c = {'d': 1, 'entry': 1.1, 'stop': 1.09, 'target': 1.13, 'htf_trend': -1, 'atr_hist': [2.0] + [1.0] * 99}
        self.assertEqual(X.adjust('ct_half', c)['size'], 0.5)
        self.assertEqual(X.adjust('ct_half', {**c, 'htf_trend': 0})['size'], 1.0)
        self.assertEqual(X.adjust('volreg_half', c)['size'], 0.5)
        self.assertEqual(X.adjust('volreg_half', {**c, 'atr_hist': [1.0] * 100})['size'], 0.5)   # ties = top decile
        self.assertEqual(X.adjust('volreg_half', {**c, 'atr_hist': [0.5] + [1.0] * 99})['size'], 1.0)
        self.assertEqual(X.adjust('volreg_half', {**c, 'atr_hist': [2.0] * 10})['size'], 1.0)   # < 50 values
        o = buy(size=0.5)
        o.status, o.r, o.exit_t = 'stop', -1.0, H(3)
        self.assertEqual(B.exp_trades([o])[0]['r'], -0.5)


class PendingFilters(unittest.TestCase):
    def test_cancel_50(self):
        o, base = buy(cancel50=True), buy()
        b = q(H(1), 1.1022, 1.1036, 1.1020, 1.1025)                 # bid high 1.1035 > 50% of 1.1000 -> 1.1060
        B.step(o, b)
        B.step(base, b)
        self.assertEqual(o.status, 'cancelled')
        self.assertEqual(base.status, 'pending')
        o2 = buy(cancel50=True)
        B.step(o2, q(H(1), 1.1010, 1.1040, 1.0999, 1.1020))         # fills in the same bar: a fill
        self.assertEqual(o2.status, 'open')

    def test_stair_definition(self):
        def bars(n, body, rng, drift=0.0, start=1.1):
            out, p = [], start
            for k in range(n):
                o = p
                c = p + body
                out.append(Bar(H(k), o, max(o, c) + (rng - abs(body)) / 2, min(o, c) - (rng - abs(body)) / 2, c))
                p = c + drift
            return out
        fast = bars(15, 0.0010, 0.0012) + bars(10, -0.0015, 0.0018, start=1.115)
        self.assertFalse(X.stair_approach(fast))
        slow = bars(15, 0.0010, 0.0012) + bars(10, -0.0002, 0.0010, start=1.115)    # mean body 0.2 x ATR
        self.assertTrue(X.stair_approach(slow))
        two_bases = (bars(15, 0.0010, 0.0012) + bars(2, -0.0015, 0.0018, start=1.115) + bars(2, 0.0002, 0.0012, start=1.112)
                     + bars(2, -0.0015, 0.0018, start=1.112) + bars(2, 0.0002, 0.0012, start=1.109) + bars(2, -0.0015, 0.0018, start=1.109))
        self.assertTrue(X.stair_approach(two_bases))
        self.assertFalse(X.stair_approach(slow[-20:]))              # too short: no decision, no filter

    def test_stair_cancels_instead_of_filling(self):
        o = buy(stair=True)
        b = q(H(1), 1.1010, 1.1012, 1.0999, 1.1005)
        B.step(o, b, lambda _o: True)
        self.assertEqual(o.status, 'filtered')
        o2 = buy(stair=True)
        B.step(o2, b, lambda _o: False)
        self.assertEqual(o2.status, 'open')


class Freshness(unittest.TestCase):
    def test_zone_used(self):
        prox, dist = 1.1000, 1.0980
        wick = [Bar('a', 1.1010, 1.1012, 1.0997, 1.1008)]           # wick into the zone, body above
        body = [Bar('a', 1.1010, 1.1012, 1.0997, 1.0998)]           # close inside
        deep = [Bar('a', 1.1010, 1.1012, 1.0994, 1.1008)]           # 30% of the height deep, body above
        self.assertEqual([X.zone_used(b, 1, prox, dist, 'body') for b in (wick, body, deep)], [0, 1, 0])
        self.assertEqual([X.zone_used(b, 1, prox, dist, 'depth25') for b in (wick, body, deep)], [0, 0, 1])
        away = Bar('b', 1.1020, 1.1030, 1.1015, 1.1025)
        self.assertEqual(X.zone_used(body + [away] + body + body, 1, prox, dist, 'body'), 2)      # 2 visits
        sup = [Bar('a', 1.0990, 1.1003, 1.0988, 1.1002)]            # supply 1.1000-1.1020: body above the proximal
        self.assertEqual(X.zone_used(sup, -1, 1.1000, 1.1020, 'body'), 1)

    def test_select(self):
        c = {'fails': frozenset({'fresh'}), 'used_body': 0, 'used_depth': 1, 'cont': True, 'tf': 'H4', 'nested': False}
        self.assertTrue(X.select('fresh_body', c))
        self.assertFalse(X.select('fresh_depth25', c))
        self.assertFalse(X.select('be_1r', c))
        self.assertFalse(X.select('fresh_body', {**c, 'fails': frozenset({'fresh', 'location'})}))
        ok = {**c, 'fails': frozenset()}
        self.assertTrue(X.select('fresh_depth25', ok))
        self.assertFalse(X.select('cont_off', ok))
        self.assertFalse(X.select('cont_nested', ok))
        self.assertTrue(X.select('cont_nested', {**ok, 'nested': True}))
        self.assertFalse(X.select('cont_htf', ok))
        self.assertTrue(X.select('cont_htf', {**ok, 'tf': 'D1'}))
        self.assertTrue(X.select('cont_off', {**ok, 'cont': False}))

    def test_curve(self):
        mn = [Bar(f'2024-{m:02d}-01T00:00', 1.0, 1.3 if m == 5 else 1.2, 1.0 if m == 3 else 1.1, 1.15) for m in range(1, 13)]
        self.assertAlmostEqual(X.mn_range_pos(mn, 1.25), 0.25 / 0.3)
        self.assertFalse(X.curve_top3_ok(1, X.mn_range_pos(mn, 1.25)))
        self.assertTrue(X.curve_top3_ok(-1, X.mn_range_pos(mn, 1.25)))
        self.assertFalse(X.curve_top3_ok(-1, X.mn_range_pos(mn, 1.05)))
        self.assertIsNone(X.mn_range_pos(mn[:5], 1.1))
        self.assertTrue(X.curve_top3_ok(1, None))


class EndToEnd(unittest.TestCase):
    def test_every_variant_runs_and_the_json_validates(self):
        h4, htf = synth()
        start = h4[1500].d
        res = run(h4, htf, start)
        orders = by_variant(res)
        end = res['last']
        period = {'start': res['first'], 'end': end, 'split': B.split_label(res['first'], end)}
        ex, ex_all = B.build_experiments(orders, period, ran=ALL(), with_all=True)
        self.assertEqual(B.validate_experiments(ex), [])
        self.assertEqual(B.validate_all(ex_all), [])
        json.dumps(ex, allow_nan=False)
        json.dumps(ex_all, allow_nan=False)
        self.assertEqual(set(ex['bases']), set(B.BASES))
        self.assertEqual(set(ex_all['sets']), set(B.BASES))
        n = {b: st['is']['n'] + st['oos']['n'] for b, st in ex['bases'].items()}
        self.assertLess(n['current'], n['no_nesting'])
        self.assertLess(n['no_nesting'], n['loose'])
        bl = ex['baseline']
        self.assertEqual((bl, ex['base_rules']), (B.choose_base(ex['bases']),) * 2)
        self.assertEqual(ex['variants'], ex_all['sets'][bl]['variants'])
        for b, st in ex_all['sets'].items():
            self.assertEqual(st['baseline'], b)
            self.assertEqual(set(st['variants']) | set(st['skipped']), set(X.VARIANTS) - {'current'} | {b})
            self.assertEqual(st['variants'][b]['group'], 'baseline')
            self.assertEqual({k: st['variants'][b][k] for k in ('is', 'oos')}, ex['bases'][b])
            self.assertEqual(st['excursions']['n'], n[b])
            cur = st['variants'][b]
            for vid, v in st['variants'].items():
                self.assertGreater(v['is']['n'] + v['oos']['n'], 0, (b, vid))
            diff = [vid for vid, v in st['variants'].items() if vid != b and (v['is'], v['oos']) != (cur['is'], cur['oos'])]
            self.assertGreaterEqual(len(diff), 15, (b, diff))       # nearly every change changes the result
            self.assertTrue(any(o.status == 'cancelled' for o in orders[B.exp_key(b, 'cancel_50')]))
            self.assertTrue(any(o.status == 'time' for o in orders[B.exp_key(b, 'time_stop')]))
            self.assertTrue(any(o.group for o in orders[B.exp_key(b, 'split_entry')]))
        md = '\n'.join(B.experiments_md(ex))
        for vid in X.VARIANTS:
            self.assertIn(f'### `{vid}`', md)
        bad = json.loads(json.dumps(ex))
        bad['variants']['be_1r']['oos']['win'] = 1.5
        del bad['variants'][bl]['is']['pf']
        self.assertEqual(len(B.validate_experiments(bad)), 2)
        bad = json.loads(json.dumps(ex))
        bad['base_rules'] = 'other'
        self.assertTrue(B.validate_experiments(bad))

    def test_choose_base(self):
        st = lambda i, o: {'is': {'n': i}, 'oos': {'n': o}}  # noqa: E731
        self.assertEqual(B.choose_base({'current': st(150, 10), 'no_nesting': st(400, 90), 'loose': st(900, 99)}), 'current')
        self.assertEqual(B.choose_base({'current': st(10, 2), 'no_nesting': st(160, 50), 'loose': st(900, 99)}), 'no_nesting')
        self.assertEqual(B.choose_base({'current': st(10, 2), 'no_nesting': st(60, 50), 'loose': st(90, 99)}), 'loose')
        self.assertEqual(B.choose_base({'current': st(0, 0), 'no_nesting': st(0, 0), 'loose': st(0, 0)}), 'current')

    def test_future_bars_do_not_change_past_decisions(self):
        """Every order (all variants) resolved before the cut is identical when every bar from the cut on changes."""
        h4, htf = synth()
        start, cut = h4[1500].d, 2000
        a = by_variant(run(h4, htf, start))
        now = B.bar_end(h4[cut - 1].d, 'H4')
        h4b = h4[:cut] + [B.quote_from_mid(Bar(x.d, x.mid.o * 1.03, x.mid.h * 1.04, x.mid.l * 0.97, x.mid.c * 0.98), 0.0009)
                          for x in h4[cut:]]
        htfb = {tf: [b if B.bar_end(b.d, tf) <= now else Bar(b.d, b.o * 1.03, b.h * 1.04, b.l * 0.97, b.c) for b in bs]
                for tf, bs in htf.items()}
        b = by_variant(run(h4b, htfb, start))
        cutd = h4[cut].d
        n = 0
        for v in ALL():
            pa = sorted((dataclasses.asdict(o) for o in a.get(v, []) if o.exit_t and o.exit_t < cutd), key=str)
            pb = sorted((dataclasses.asdict(o) for o in b.get(v, []) if o.exit_t and o.exit_t < cutd), key=str)
            self.assertEqual(pa, pb, v)
            n += len(pa)
        self.assertGreater(n, 100)

    def test_stair_uses_only_bars_closed_before_the_fill_bar(self):
        h4, htf = synth()
        seen = []
        orig_ap, orig_step = X.stair_approach, B.step

        def spy_ap(bars):
            seen.append(bars[-1] if bars else None)
            return orig_ap(bars)

        def spy_step(o, qq, pre=None):
            def pre2(oo):
                k = len(seen)
                out = pre(oo)
                for bar in seen[k:]:
                    if bar is not None:
                        self.assertLessEqual(B.bar_end(bar.d, oo.tf if oo.tf in ('H4', 'D1') else 'H4'), qq.d)
                        checks.append(oo.tf)
                return out
            return orig_step(o, qq, pre2 if pre else None)
        checks = []
        X.stair_approach, B.step = spy_ap, spy_step
        try:
            B.run_instrument(EURUSD, h4, htf, h4[1500].d, variants={'arrive_stair': None}, signal_fn=fake_fn, warmup=300)
        finally:
            X.stair_approach, B.step = orig_ap, orig_step
        self.assertIn('H4', checks)
        self.assertIn('D1', checks)


if __name__ == '__main__':
    unittest.main()
