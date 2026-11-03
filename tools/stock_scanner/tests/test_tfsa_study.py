import json
import unittest

import helpers  # noqa: F401
import synth
import tfsa_study as TS
from zones import Bar

FILTER_KEYS = ('sym', 'tf', 'section', 'date', 'ref_date', 'entry', 'prox', 'dist', 'qualified', 'mom12', 'top3')


class TfsaStudyTest(unittest.TestCase):
    def test_events_are_walk_forward(self):
        b = synth.ticker(5)
        evs = TS.ticker_events('S5', b)
        self.assertTrue(evs)
        dates = {x.d: i for i, x in enumerate(b)}
        for e in evs:
            i = dates[e['date']]
            if e['section'] == 'in':
                self.assertLessEqual(e['entry'], e['prox'] + 1e-9)          # limit at the proximal (lower on a gap)
                self.assertLessEqual(b[i].l, e['prox'])
                self.assertEqual(e['ref_date'], b[i - 1].d)               # filters read the previous close
            else:
                self.assertEqual(e['entry'], round(b[i].c, 4))
                self.assertGreater(b[i].c, e['prox'])
            for k, h in TS.HORIZONS.items():
                if k in e['fwd']:
                    self.assertEqual(e['fwd'][k]['exit'], b[i + h].d)
                    self.assertLessEqual(e['fwd'][k]['dd'], 0)

    def test_future_bars_do_not_change_past_events(self):
        b = synth.ticker(5)
        T = len(b) - 300
        cut = b[T].d
        fut = [Bar(x.d, x.o * 0.6, x.h * 0.62, x.l * 0.55, x.c * 0.6) if i >= T else x for i, x in enumerate(b)]
        key = lambda e: tuple(e[k] for k in FILTER_KEYS)  # noqa: E731
        a1 = sorted(key(e) for e in TS.ticker_events('S', b) if e['date'] < cut)
        a2 = sorted(key(e) for e in TS.ticker_events('S', fut) if e['date'] < cut)
        self.assertTrue(a1)
        self.assertEqual(a1, a2)

    def test_summary_schema(self):
        evs = []
        for s in range(6):
            evs += TS.ticker_events(f'T{s}', synth.ticker(s))
        out = TS.summarize(evs, synth.ticker(101), fixture=True)
        json.dumps(out, allow_nan=False)
        self.assertEqual(set(out['by_section']), set(TS.SECTIONS))
        self.assertEqual(set(out['by_tf']), set(TS.TFS))
        self.assertEqual(set(out['filters']), set(TS.FILTERS) | {'all_four'})
        self.assertEqual(set(out['splits']), {'train', 'test', 'tickers_A', 'tickers_B'})
        g = out['by_section']['in']['12m']
        self.assertGreater(g['n'], 30)
        lo, hi = g['ci_excess_spy']
        self.assertLessEqual(lo, g['mean_excess_spy'] + 1e-9)
        self.assertGreaterEqual(hi, g['mean_excess_spy'] - 1e-9)
        self.assertTrue(0 <= g['beat_spy'] <= 1)
        f = out['filters']['market_regime']
        self.assertEqual(f['pass']['12m']['n'] + f['fail']['12m']['n'], g['n'])
        self.assertTrue(out['verdict'])
        self.assertIn('## TFSA study', '\n'.join(TS.render_md(out)))

    def test_dedupe_keeps_the_biggest_timeframe(self):
        e = lambda tf: {'sym': 'A', 'section': 'in', 'date': '2024-01-02', 'tf': tf}  # noqa: E731
        self.assertEqual([x['tf'] for x in TS.dedupe([e('W1'), e('3M'), e('MN')])], ['3M'])


if __name__ == '__main__':
    unittest.main()


class TfsaRowsTest(unittest.TestCase):
    def test_monthly_close_stop(self):
        # entry 100 on 2024-01-30; distal 95: January closes 96 (above), February's last close 94 -> stopped at 94
        days = [f'2024-01-{d:02d}' for d in (29, 30, 31)] + [f'2024-02-{d:02d}' for d in range(1, 30)] + \
            [f'2024-03-{d:02d}' for d in range(1, 32)] + [f'2024-04-{d:02d}' for d in range(1, 31)] * 3
        days = sorted(set(days))
        cl = [100.0] * len(days)
        for i, d in enumerate(days):
            if d == '2024-01-31':
                cl[i] = 96.0
            if d == '2024-02-29':
                cl[i] = 94.0
            if d > '2024-02-29':
                cl[i] = 120.0
        b = [Bar(d, c, c + 1, c - 1, c) for d, c in zip(days, cl)]
        f = TS._forward(b, 1, 100.0, 95.0)
        self.assertTrue(f['3m']['stopped'])
        self.assertAlmostEqual(f['3m']['sret'], -6.0)
        self.assertAlmostEqual(f['3m']['ret'], 20.0)
        self.assertFalse(TS._forward(b, 1, 100.0, 90.0)['3m']['stopped'])

    def test_block_ci_by_month(self):
        rows = [(f'2020-{m:02d}', v) for m in range(1, 13) for v in ([5.0] * 30 if m != 3 else [-80.0] * 5)]
        lo, hi = TS.block_ci(rows)
        self.assertLess(lo, hi)
        self.assertIsNone(TS.block_ci([('2020-01', 1.0), ('2020-01', 2.0)]))

    def test_rows_and_holds(self):
        evs = []
        for s in range(8):
            evs += TS.ticker_events(f'T{s}', synth.ticker(s))
        out = TS.summarize(evs, synth.ticker(101), fixture=True)
        need = {'in', 'tf_W1', 'tf_MN', 'tf_3M', 'all_four', *TS.FILTERS, *(f + '_fail' for f in TS.FILTERS), *TS.COMBOS}
        self.assertEqual(set(out['rows']), need)
        r = out['rows']['in']
        a, tr, te = (r[p]['12m'] for p in ('all', 'train', 'test'))
        self.assertEqual(a['n'], tr['n'] + te['n'])
        self.assertGreater(a['months'], 12)
        self.assertLessEqual(a['months'], a['n'])
        for k in ('ci_excess_random', 'ci_excess_random_time', 'ci_excess_spy_time', 'stop_ret', 'stopped'):
            self.assertIn(k, a)
        self.assertIn(r['all']['12m']['n'], (out['by_section']['in']['12m']['n'],))
        self.assertIn('Survivorship', out['verdict'])
        fake = {p: {'12m': {'n': 50, 'ci_excess_random_time': [0.5, 3.0]}} for p in ('train', 'test')}
        self.assertTrue(TS.holds(fake))
        fake['test']['12m']['ci_excess_random_time'] = [-0.1, 3.0]
        self.assertFalse(TS.holds(fake))
        md = '\n'.join(TS.render_md(out))
        self.assertIn('tf_MN_3M+not_top3', md)
        json.dumps(out, allow_nan=False)
