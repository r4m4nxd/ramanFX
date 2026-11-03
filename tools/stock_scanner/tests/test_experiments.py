import contextlib
import datetime as dt
import json
import os
import random
import tempfile
import unittest
from types import SimpleNamespace

import helpers  # noqa: F401
from helpers import bars_from_closes
import backtest as BT
import experiments as E
import scan
import synth
from zones import Bar


def bars(rows, start=dt.date(2026, 1, 5)):
    out, d = [], start
    for r in rows:
        while d.weekday() >= 5:
            d += dt.timedelta(days=1)
        out.append(Bar(d.isoformat(), *r))
        d += dt.timedelta(days=1)
    return out


def plan(**kw):
    p = {'entry': 100.0, 'stop': 98.0, 'target': 106.0, 'distal': 98.5, 'size': 1.0, 'split': False, 'cancel_frac': None,
         'stair': False, 'exit_rule': None}
    p.update(kw)
    return p


# ---- a deterministic stand-in for scan.analyse / symbol_signals: a fresh BUY every week, from bars up to d only ----
def _stub_analyse(d1, w1, mn, *a, **k):
    px = d1[-1].c
    sup = SimpleNamespace(dir=-1, removed=False, prox=px * 1.15)
    row = SimpleNamespace(ok=True, zones=[sup])
    return SimpleNamespace(price=px, date=d1[-1].d, bars=d1, w1=row, mn=row, q3=None, index=None)


def _stub_signals(an, earnings=None):
    b = an.bars
    px = an.price
    wk = dt.date.fromisoformat(an.date).isocalendar()[1]
    prox = round(min(x.l for x in b[-15:]) * 0.995, 4)
    if prox >= px:
        return []
    dist = prox * 0.96
    stop = dist * 0.995
    base = {'tf': 'W1', 'base_start': an.date, 'zone_type': 'STR', 'pattern': 'RBR' if wk % 2 else 'DBR',
            'loc': 'inside' if wk % 3 == 0 else 'top', 'entry': prox, 'proximal': prox, 'distal': dist, 'stop': stop,
            'target': prox * 1.3, 'target_kind': 'supply', 'rr': round(0.3 * prox / (prox - stop), 2), 'curve': 20.0,
            'direction': 'UP', 'to_entry_pct': 1.0, 'score': 8, 'made': b[-6].d, 'rules': []}
    tested = {**base, 'kind': 'WATCH', 'watch': 'tested', 'base_start': 'T' + an.date, 'entry': prox * 1.004, 'proximal': prox * 1.004,
              'rules': [{'status': 'FAIL', 'ref': 'L2 · L52'}]}
    return [{**base, 'kind': 'BUY'}, tested]


@contextlib.contextmanager
def stubbed():
    saved = (scan.analyse, scan.symbol_signals, BT.candidates)

    def cand(b, tfs=None, loose=None):
        out = {d: [f'W1:D:{b[d].d}'] for d in BT.week_ends(b) if d >= BT.WARMUP}
        if loose is not None:
            loose.update({d: z + [f'W1:D:T{b[d].d}'] for d, z in out.items()})
        return out
    scan.analyse, scan.symbol_signals, BT.candidates = _stub_analyse, _stub_signals, cand
    try:
        yield
    finally:
        scan.analyse, scan.symbol_signals, BT.candidates = saved


def run_stub(b, spy, bases=('current',)):
    with stubbed():
        return BT.backtest_ticker('STUB', b, 'S', None, 5.0, variants=('current',), slip_bps=5.0, random_k=0,
                                  experiments=E.runnable(), spy_bars=spy, bases=bases)


class ExitRulesTest(unittest.TestCase):
    def test_no_rule_is_the_live_wick_exit(self):
        rnd = random.Random(3)
        b = synth.ticker(77)
        for _ in range(200):
            fi = rnd.randrange(300, len(b) - 5)
            fill = b[fi].l + (b[fi].h - b[fi].l) * rnd.random()
            stop, target = fill * (1 - rnd.uniform(0.02, 0.1)), fill * (1 + rnd.uniform(0.05, 0.4))
            self.assertEqual(E.run_exit(b, fi, fill, stop, target, fill - stop)[:3], BT.run_exit(b, fi, fill, stop, target, 'wick')[:3])

    def test_break_even(self):
        # fill 100, 1R = 2: day 2 high 102.5 (> +1R) -> stop at 100 from day 3; day 3 low 99.5 exits at 100
        b = bars([(101, 102, 100.5, 101), (100.5, 101, 99.5, 100.4), (100.4, 102.5, 100.2, 102), (101, 101.2, 99.5, 100)])
        self.assertEqual(E.run_exit(b, 1, 100.0, 98.0, 106.0, 2.0, 'be_1r')[:3], (3, 100.0, 'trail'))
        self.assertEqual(E.run_exit(b, 1, 100.0, 98.0, 106.0, 2.0, 'be_2r')[2], 'open')       # +2R never reached
        s = E.simulate(b, 0, plan(exit_rule='be_1r'), cost_side=0.001)
        self.assertAlmostEqual(s['r'], -2 * 0.001 * 100 / 2)                                  # only the costs lost

    def test_trigger_bar_itself_keeps_the_old_stop(self):
        # the trigger is read at the close: the same bar's low below the fill is not a break-even exit
        b = bars([(101, 102, 100.5, 101), (100.5, 101, 99.5, 100.4), (100.4, 102.5, 99.0, 102), (102, 103, 101, 102.5)])
        self.assertEqual(E.run_exit(b, 1, 100.0, 98.0, 106.0, 2.0, 'be_1r')[2], 'open')

    def test_be_struct(self):
        b = bars([(101, 102, 100.5, 101), (100.5, 101, 99.0, 100.4), (100.4, 103.5, 100.2, 103), (103, 103.2, 98.9, 99)])
        i, px, why, _ = E.run_exit(b, 1, 100.0, 98.0, 110.0, 2.0, 'be_struct')
        self.assertEqual((i, px, why), (3, 99.0, 'trail'))      # lowest low since the fill (99.0) > stop 98

    def test_time_stop(self):
        cl = [101.0, 99.9] + [100.3 + 0.01 * k for k in range(40)]
        b = bars_from_closes(cl, wick=0.2)
        i, px, why, _ = E.run_exit(b, 1, 99.9, 98.0, 120.0, 1.9, 'time_stop')
        self.assertEqual((i, why), (21, 'time_stop'))
        self.assertEqual(px, b[21].c)

    def test_excursions(self):
        b = bars([(101, 102, 100.5, 101), (100.5, 101, 99.0, 100.4), (100.4, 103, 100.2, 102.8), (103, 106.5, 102.5, 106)])
        s = E.simulate(b, 0, plan(), 0.0)
        self.assertEqual(s['why'], 'target')
        self.assertAlmostEqual(s['mfe_r'], 3.0)
        self.assertAlmostEqual(s['mae_r'], 0.5)
        self.assertEqual(s['bars'], 2)


class OrderRulesTest(unittest.TestCase):
    def test_cancel_half_way(self):
        b = bars([(101, 102, 100.5, 101), (101, 103.2, 100.5, 103), (102, 102, 99, 100)])
        self.assertEqual(E.place_order(b, 0, 100.0, 106.0, 98.5, cancel_frac=0.5)[0], 'cancelled_half')
        self.assertEqual(E.place_order(b, 0, 100.0, 106.0, 98.5)[0], 'filled')

    def test_stair_definition(self):
        base = [(100 + k * 0.01, 101 + k * 0.01 + 1.0, 99 + k * 0.01 - 1.0, 100 + k * 0.01) for k in range(20)]   # wide bars
        fast = [(97.5, 103, 97, 102.5) if k % 2 else (102.5, 103, 97, 97.5) for k in range(10)]
        slow = [(100 - 0.1 * k, 100.2 - 0.1 * k, 99.7 - 0.1 * k, 99.9 - 0.1 * k) for k in range(10)]
        self.assertFalse(E.stair_approach(bars(base + fast)))
        self.assertTrue(E.stair_approach(bars(base + slow)))

    def test_split_entry(self):
        # zone 100 / 98.5: middle 99.25; both halves fill, then the target
        b = bars([(101, 102, 100.5, 101), (100.5, 101, 99.0, 100.4), (100.4, 103, 100.2, 102.8), (103, 106.5, 102.5, 106)])
        s = E.simulate(b, 0, plan(split=True), 0.0)
        self.assertAlmostEqual(s['r'], 0.5 * 3.0 + 0.5 * (106 - 99.25) / 2.0)
        b2 = bars([(101, 102, 100.5, 101), (100.5, 101, 99.6, 100.4), (100.4, 103, 100.2, 102.8), (103, 106.5, 102.5, 106)])
        self.assertAlmostEqual(E.simulate(b2, 0, plan(split=True), 0.0)['r'], 1.5)            # second half never filled


class SignalRulesTest(unittest.TestCase):
    def sig(self, **kw):
        s = {'tf': 'W1', 'entry': 100.0, 'proximal': 100.0, 'distal': 96.0, 'stop': 95.8, 'target': 115.0, 'made': '2026-01-05',
             'pattern': 'RBR', 'loc': 'top', 'kind': 'BUY'}
        s.update(kw)
        return s

    def test_freshness_definitions(self):
        b = bars([(102, 103, 101, 102)] * 5 + [(101, 101.5, 99.5, 100.5)] + [(101, 102, 100.5, 101.5)])
        self.assertFalse(E.zone_used(b, self.sig(), 'fresh_body'))        # wick only
        self.assertFalse(E.zone_used(b, self.sig(), 'fresh_depth25'))     # 0.5 of 4 = 12.5% deep
        b2 = b + [Bar('2026-01-14', 100.5, 100.6, 98.8, 99.9)]
        self.assertTrue(E.zone_used(b2, self.sig(), 'fresh_body'))
        self.assertTrue(E.zone_used(b2, self.sig(), 'fresh_depth25'))
        w = self.sig(kind='WATCH', watch='tested', entry=101.0, rules=[{'status': 'FAIL', 'ref': 'L2 · L52'}])
        self.assertEqual(E.promote_fresh([self.sig(), w], b, 'fresh_body')[0]['entry'], 101.0)   # nearest per TF
        self.assertEqual(E.promote_fresh([self.sig(), w], b2, 'fresh_body')[0]['entry'], 100.0)

    def test_plans(self):
        k = E.Known(bars([(100, 101, 99, 100)] * 30), w1=bars([(100, 104, 96, 100)] * 20), spy_closes=[100.0] * 199 + [90.0],
                    supplies=[112.0, 130.0])
        self.assertIsNone(E.plan_for('cont_off', self.sig(), k))
        self.assertIsNone(E.plan_for('cont_nested', self.sig(), k))
        self.assertIsNotNone(E.plan_for('cont_nested', self.sig(loc='inside'), k))
        self.assertIsNotNone(E.plan_for('cont_off', self.sig(pattern='DBR'), k))
        self.assertIsNone(E.plan_for('market_regime', self.sig(), k))
        self.assertAlmostEqual(E.plan_for('tp_fixed3', self.sig(), k)['target'], 100 + 3 * 4.2)
        self.assertAlmostEqual(E.plan_for('tp_zone', self.sig(), k)['target'], 112 * 0.995)    # 2.67R: kept
        self.assertIsNone(E.plan_for('tp_zone', self.sig(), E.Known(k.bars, supplies=[109.0])))
        self.assertAlmostEqual(E.plan_for('stop_atr', self.sig(target=130.0), k)['stop'], 96.0 - 8.0)   # distal - weekly ATR
        self.assertIsNone(E.plan_for('stop_atr', self.sig(), k))                              # room 1.25R with the wider stop
        self.assertIsNone(E.plan_for('curve_top3', self.sig(entry=100.8), k))
        self.assertIsNotNone(E.plan_for('curve_top3', self.sig(entry=99.5), k))
        self.assertEqual(E.plan_for('volreg_half', self.sig(), k)['size'], 1.0)
        with self.assertRaises(ValueError):
            E.plan_for('earnings_skip', self.sig(), k)

    def test_high_vol(self):
        calm = [(100, 101, 99, 100)] * 270
        self.assertFalse(E.high_vol(bars(calm)))
        self.assertTrue(E.high_vol(bars(calm + [(100, 108, 92, 100)])))


class BacktestExperimentsTest(unittest.TestCase):
    def test_every_variant_runs_and_json_schema(self):
        b, spy = synth.ticker(42), synth.ticker(101)
        tr = run_stub(b, spy, BT.BASES)
        got = {tuple(t['variant'].split(':')[1:]) for t in tr if t['variant'].startswith('x:')}
        self.assertEqual(got, {(bk, v) for bk in BT.BASES for v in E.runnable()})
        for t in tr:
            if t.get('status') == 'filled':
                self.assertGreater(t['fill_date'], t['signal_date'])
        exp, allj = BT.experiments_outputs(tr, E.runnable(), BT.BASES)
        self.assertEqual(set(exp), {'schema', 'market', 'generated_at', 'period', 'baseline', 'variants', 'skipped', 'excursions',
                                    'base_rules', 'bases', 'base_choice'})
        self.assertEqual((exp['schema'], exp['market'], exp['baseline']), (1, 'stock', 'current'))   # stub: every base the same
        self.assertEqual(set(exp['bases']), set(BT.BASES))
        self.assertEqual(set(allj['sets']), set(BT.BASES))
        self.assertEqual(allj['chosen'], 'current')
        self.assertIn('loose', allj['sets']['loose']['variants'])
        self.assertNotIn('current', allj['sets']['loose']['variants'])
        dt.datetime.strptime(exp['generated_at'], '%Y-%m-%dT%H:%M:%SZ')
        for k in ('start', 'end', 'split'):
            dt.date.fromisoformat(exp['period'][k])
        self.assertEqual(set(exp['variants']) | set(exp['skipped']), set(E.VARIANTS))
        json.dumps(allj, allow_nan=False)
        self.assertIn('earnings_skip', exp['skipped'])
        keys = {'n', 'win', 'exp_r', 'ci', 'pf', 'avg_mfe_r', 'avg_mae_r', 'avg_bars', 'max_dd_r'}
        for vid, v in exp['variants'].items():
            self.assertEqual(set(v), {'group', 'desc', 'is', 'oos'})
            self.assertIn(v['group'], ('baseline', 'exit', 'freshness', 'continuation', 'stop', 'filter', 'size'))
            for half in ('is', 'oos'):
                self.assertEqual(set(v[half]), keys, vid)
        cur = exp['variants']['current']
        self.assertGreater(cur['is']['n'], 10)
        self.assertGreater(cur['oos']['n'], 3)
        s = cur['oos']
        self.assertTrue(0 <= s['win'] <= 1)
        self.assertLessEqual(s['ci'][0], s['exp_r'])
        self.assertGreaterEqual(s['ci'][1], s['exp_r'])
        self.assertEqual(set(exp['excursions']), {'mfe_r', 'mae_r', 'n'})
        self.assertEqual(set(exp['excursions']['mfe_r']), {'p25', 'p50', 'p75', 'p90'})
        json.dumps(exp, allow_nan=False)
        md = BT.render_experiments(exp)
        for vid in E.VARIANTS:
            self.assertIn(f'### `{vid}`', '\n'.join(md))
        # variants really differ from current where they should
        by = {v: [t for t in tr if t['variant'] == 'x:current:' + v] for v in E.runnable()}
        self.assertLess(len(by['cont_off']), len(by['current']))
        self.assertTrue(any(t.get('promoted') for t in by['fresh_body']))
        self.assertTrue(any(t['status'] == 'cancelled_half' for t in by['cancel_50']))

    def test_choose_base(self):
        mk = lambda n_is: {'variants': {'x': {'is': {'n': n_is}, 'oos': {'n': 10}}}}  # noqa: E731
        sets = {b: {'variants': {b: {'is': {'n': n}, 'oos': {'n': 5}}}} for b, n in zip(BT.BASES, (20, 160, 400))}
        self.assertEqual(BT.choose_base(sets), 'no_nesting')                    # the strictest with >= 150 in sample
        sets['no_nesting']['variants']['no_nesting']['is']['n'] = 100
        self.assertEqual(BT.choose_base(sets), 'loose')
        sets['loose']['variants']['loose']['is']['n'] = 30
        self.assertEqual(BT.choose_base(sets), 'no_nesting')                    # none qualifies: most trades
        self.assertIsNotNone(mk)

    def test_loose_base_switches_off_only_its_gates(self):
        orig = scan.zone_rules
        an = scan.analyse(*(lambda b: (b, BT.DATA.closed_htf(b, 'W1'), BT.DATA.closed_htf(b, 'MN')))(synth.ticker(693)))
        r, z = next((r, z) for r in scan.zone_rows(an) if r.ok for z in r.zones if z.zid in an.dna)
        live = {k.ref: k.status for k in scan.zone_rules(an, z, an.dna[z.zid], None)}
        with BT.rule_variant('loose'):
            loose = {k.ref: k.status for k in scan.zone_rules(an, z, an.dna[z.zid], None)}
        self.assertIs(scan.zone_rules, orig)
        for ref, st in live.items():
            if ref in BT.LOOSE_REFS and st == scan.FAIL:
                self.assertEqual(loose[ref], scan.WARN)
            else:
                self.assertEqual(loose[ref], st, ref)

    def test_no_look_ahead(self):
        """Changing the bars after day T never changes a decision taken before T: the same rows exist for every signal
        before T (filters / plans read data up to the signal day), and rows settled before T are identical."""
        b, spy = synth.ticker(42), synth.ticker(101)
        T = len(b) - 260
        cut = b[T].d
        fut = [Bar(x.d, x.o * 1.3, x.h * 1.35, x.l * 1.25, x.c * 1.3) if i >= T else x for i, x in enumerate(b)]
        spy2 = [Bar(x.d, x.o * 0.5, x.h * 0.5, x.l * 0.5, x.c * 0.5) if x.d >= cut else x for x in spy]
        r1, r2 = run_stub(b, spy), run_stub(fut, spy2)

        def key(t):
            return t['variant'], t['signal_date'], t['tf']

        def settled(t):
            last = t.get('exit_date') or t.get('wick_exit_date') or t.get('cancel_date')
            return last is not None and last < cut
        before1 = {key(t): t for t in r1 if t['signal_date'] < cut}
        before2 = {key(t): t for t in r2 if t['signal_date'] < cut}
        self.assertEqual(set(before1), set(before2))
        n = 0
        for k, t in before1.items():
            if settled(t):
                n += 1
                self.assertEqual(t, before2[k], k)
        self.assertGreater(n, 50)

    def test_order_and_exit_rules_read_only_the_past(self):
        b = synth.ticker(9)
        for d in range(400, len(b) - 120, 37):
            p = plan(entry=b[d].c * 0.98, stop=b[d].c * 0.94, target=b[d].c * 1.12, distal=b[d].c * 0.945, stair=True, cancel_frac=0.5)
            for rule in (None, 'be_1r', 'be_2r', 'be_struct', 'time_stop'):
                full = E.simulate(b, d, {**p, 'exit_rule': rule, 'split': rule is None}, 0.001)
                if not full or full['status'] != 'filled' or full.get('why') == 'open':
                    continue
                cut = full['exit_i'] + 1
                trunc = E.simulate(b[:cut] + [Bar(x.d, x.o * 3, x.h * 3, x.l * 3, x.c * 3) for x in b[cut:]], d,
                                   {**p, 'exit_rule': rule, 'split': rule is None}, 0.001)
                self.assertEqual(full, trunc)

    def test_fixture_cli_writes_the_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = os.path.join(tmp, 'learn', 'stock_experiments.json')
            BT.main(['--fixture', '--limit', '2', '--out', os.path.join(tmp, 'o'), '--experiments-json', out,
                     '--experiments-all-json', os.path.join(tmp, 'learn', 'all.json'), '--tfsa-json', os.path.join(tmp, 'learn', 't.json'),
                     '--md', os.path.join(tmp, 'x.md')])
            with open(out) as f:
                js = json.load(f)
            self.assertEqual(js['market'], 'stock')
            self.assertIn(js['baseline'], BT.BASES)
            self.assertIn(js['baseline'], js['variants'])
            with open(os.path.join(tmp, 'learn', 'all.json')) as f:
                self.assertEqual(json.load(f)['chosen'], js['baseline'])
            with open(os.path.join(tmp, 'learn', 't.json')) as f:
                self.assertIn('verdict', json.load(f))
            with open(os.path.join(tmp, 'x.md')) as f:
                md = f.read()
            self.assertIn('## Experiments', md)
            self.assertIn('## TFSA study', md)


if __name__ == '__main__':
    unittest.main()
