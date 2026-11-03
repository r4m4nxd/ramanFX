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
