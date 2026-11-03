import json
import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import learner as L  # noqa: E402


def st(n, e, lo=None, dd=5.0, win=0.4):
    return {'n': n, 'exp_r': e, 'ci': [lo if lo is not None else e - 0.1, e + 0.1], 'win': win, 'pf': 1.2, 'max_dd_r': dd}


def exp(variants, market='fx'):
    v = {'current': {'group': 'base', 'is': st(400, 0.10), 'oos': st(150, 0.10)}}
    v.update(variants)
    return {'schema': 1, 'market': market, 'generated_at': '2026-11-02T00:00:00Z', 'baseline': 'current', 'variants': v, 'skipped': {}}


class Learner(unittest.TestCase):
    def setUp(self):
        self.d = tempfile.mkdtemp()

    def write(self, name, js):
        with open(os.path.join(self.d, name), 'w') as f:
            json.dump(js, f)

    def test_strong_variant_adopted_weak_waits_bad_rejected(self):
        self.write('fx_experiments.json', exp({
            'be_2r': {'group': 'exit', 'desc': 'break-even at 2R', 'is': st(400, 0.20), 'oos': st(150, 0.25, lo=0.15)},     # strong
            'fresh_body': {'group': 'freshness', 'desc': 'body close', 'is': st(380, 0.18), 'oos': st(140, 0.17, lo=0.02)},  # qualifies
            'curve_top3': {'group': 'filter', 'desc': 'curve', 'is': st(300, 0.30), 'oos': st(30, 0.40, lo=0.3)},           # too few
            'tp_fixed3': {'group': 'target', 'desc': 'fixed 3R', 'is': st(400, 0.05), 'oos': st(150, 0.30, lo=0.2)},        # worse in-sample
        }))
        p, ch = L.run(self.d, mode='auto', now='2026-11-03T00:00:00Z')
        fx = p['markets']['fx']
        self.assertEqual([a['id'] for a in fx['adopted']], ['be_2r'])
        self.assertEqual([c['id'] for c in fx['candidates']], ['fresh_body'])
        self.assertIn('curve_top3', [r['id'] for r in fx['rejected']])
        self.assertIn('tp_fixed3', [r['id'] for r in fx['rejected']])
        self.assertEqual([c['change'] for c in ch], ['adopt'])
        # a second run confirms the candidate; the adopted one stays
        p2, ch2 = L.run(self.d, mode='auto', now='2026-12-03T00:00:00Z')
        self.assertEqual(sorted(a['id'] for a in p2['markets']['fx']['adopted']), ['be_2r', 'fresh_body'])
        self.assertEqual([c['id'] for c in ch2], ['fresh_body'])

    def test_one_rule_per_group_and_drop_when_no_longer_better(self):
        self.write('fx_experiments.json', exp({
            'be_1r': {'group': 'exit', 'desc': '1R', 'is': st(400, 0.2), 'oos': st(150, 0.2, lo=0.15)},
            'be_2r': {'group': 'exit', 'desc': '2R', 'is': st(400, 0.3), 'oos': st(150, 0.3, lo=0.2)},
        }))
        p, _ = L.run(self.d, now='a')
        self.assertEqual([a['id'] for a in p['markets']['fx']['adopted']], ['be_2r'])
        self.write('fx_experiments.json', exp({'be_2r': {'group': 'exit', 'desc': '2R', 'is': st(400, 0.1), 'oos': st(150, 0.09)}}))
        p, ch = L.run(self.d, now='b')
        self.assertEqual(p['markets']['fx']['adopted'], [])
        self.assertEqual(ch[0]['change'], 'drop')

    def test_filter_that_kills_most_profit_is_rejected(self):
        self.write('stock_experiments.json', exp({'market_regime': {'group': 'filter', 'desc': 'x', 'is': st(120, 0.4), 'oos': st(45, 0.2, lo=0.15)}}, 'stock'))
        p, _ = L.run(self.d, now='a')
        self.assertEqual(p['markets']['stock']['adopted'], [])
        self.assertIn('too little', p['markets']['stock']['rejected'][0]['why'])

    def test_mode_off_adopts_nothing_and_live_losses_mean_half_size(self):
        self.write('fx_experiments.json', exp({'be_2r': {'group': 'exit', 'desc': '2R', 'is': st(400, 0.3), 'oos': st(150, 0.3, lo=0.2)}}))
        self.write('outcomes.json', {'windows': {'90d': {'fx|BUY|H4|demand': {'n': 40, 'filled': 35, 'win': 0.2, 'exp_r': -0.4}}}})
        p, _ = L.run(self.d, mode='off', now='a')
        self.assertEqual(p['markets']['fx']['adopted'], [])
        self.assertTrue(p['markets']['fx']['half_size'])
        self.assertFalse(p['markets']['stock']['half_size'])

    def test_no_results_yet_keeps_previous_and_writes_report(self):
        p, ch = L.run(self.d, now='a')
        self.assertEqual(ch, [])
        self.assertTrue(os.path.exists(os.path.join(self.d, 'report.md')))
        self.assertEqual(p['markets']['fx']['note'], 'no backtest results yet')
        msg = L.message(p, [{'change': 'adopt', 'market': 'fx', 'desc': 'a & b', 'gain_r': 0.1}])
        self.assertIn('a &amp; b', msg)


if __name__ == '__main__':
    unittest.main()
