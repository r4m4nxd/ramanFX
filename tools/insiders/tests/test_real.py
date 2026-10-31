"""The readers on REAL SEC filings captured on 2026-10-30 / 31 (tests/fixtures/real_*), by tools/insiders/grab_fixtures.py running
on a GitHub runner: Form 144, Form 4 sales (10b5-1 checkbox, footnote only, none), Schedule 13D/A and 13G/A XML (schema X0202), the old
SC 13G/A and SC 13D/A text of Feb 2024. real_form4_sale_box.txt is trimmed to its first sales (valid XML). The other fixtures are
reconstructions with made-up companies (test_forms.py)."""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import form144 as F144  # noqa: E402
import form4 as F  # noqa: E402
import insiders as I  # noqa: E402
import sched13 as S13  # noqa: E402


def fx(name: str) -> bytes:
    with open(os.path.join(HERE, 'fixtures', name), 'rb') as f:
        return f.read()


class TestRealFilings(unittest.TestCase):
    def test_form_144(self):
        d = F144.parse_submission(fx('real_form144.txt'))
        self.assertEqual(d['issuer'], {'cik': '1144215', 'name': 'ACUITY INC. (DE)'})
        self.assertEqual((d['seller'], d['rel'], d['shares'], d['value'], d['outstanding']), ('ASHE NEIL', 'Officer', 9217.0, 2936682.43, 29695521.0))
        self.assertEqual((d['sale_date'], d['plan_dates'], d['broker'], d['form']), ('2026-10-30', ['2026-07-01'], 'Merrill Lynch', '144'))
        self.assertRegex(d['accepted'], r'^2026-10-30T\d\d:\d\d:\d\d$')
        rec = F144.record(d, {'acc': 'x'}, 'u', '2026-10-30T13:00:00Z', 'AYI')
        self.assertEqual((rec['sym'], rec['plan'], round(rec['price'], 2)), ('AYI', True, 318.62))
        st = I.load_state('/nonexistent')
        self.assertEqual(I.ingest(st, {'acc': '0001193485-26-000001', 'cik': '1193485', 'form': '144'}, fx('real_form144.txt'), {'AYI'}, {'1144215': 'AYI'}), 1)
        self.assertEqual(I.ingest(st, {'acc': 'y', 'cik': '1', 'form': '144'}, fx('real_form144.txt'), {'AYI'}, {'999': 'ZZZ'}), 0)         # not a scanner stock

    def test_form4_10b5_1_checkbox_note_and_none(self):
        box = F.parse_submission(fx('real_form4_sale_box.txt'))
        self.assertTrue(box['plan'])                                                      # <aff10b5One>1</aff10b5One>
        s = F.filing_trades(box, 'S')
        self.assertEqual((s['plan'], s['cover'], s['ceo'], s['top'], s['sym']), (True, False, True, True, 'AYI'))
        self.assertGreater(s['value'], 5_000_000)
        self.assertIsNone(I.sell_check(dict(s, acc='b'), I.CFG, lambda sym: None))        # a $7M CEO sale, but under a plan: no alert
        note = F.parse_submission(fx('real_form4_sale_note.txt'))
        self.assertFalse(note['plan'])                                                    # the box is 0 ...
        n = F.filing_trades(note, 'S')
        self.assertTrue(n['plan'] and n['cover'])                                         # ... the footnote names Rule 10b5-1(c)(1)(i)(B) and tax withholding
        self.assertEqual((n['role'], n['cfo']), ('CFO', True))
        self.assertIsNone(I.sell_check(dict(n, acc='n'), I.CFG, lambda sym: None))
        op = F.parse_submission(fx('real_form4_sale_open.txt'))
        self.assertEqual((op['plan'], F.filing_trades(op, 'S')['plan']), (False, False))   # 'false' text in the checkbox
        o = F.filing_trades(op, 'S')
        self.assertEqual((o['role'], o['n_tx'], o['shares'], o['sym']), ('Director', 2, 750.0, 'AGYS'))
        h = F.holdings(op)
        self.assertEqual((h['after'], h['date'], h['code'], h['moved']), (31627.0, '2026-10-29', 'S', -750.0))
        # the same sale by a CEO of a big company would alert: the only thing missing here is the role and the size
        self.assertIsNotNone(I.sell_check(dict(o, acc='o', ceo=True, value=2e6), I.CFG, lambda sym: None))

    def test_schedule_13d_and_13g_xml(self):
        d = S13.parse_submission(fx('real_schedule13d_a.txt'))
        self.assertEqual((d['form'], d['kind'], d['amend']), ('SCHEDULE 13D/A', 'D', True))
        self.assertEqual(d['subject'], {'cik': '1529274', 'name': 'ALKAMI TECHNOLOGY, INC.', 'cusip': '01644J108'})
        self.assertEqual((d['filer'], d['pct'], d['shares'], d['event']), ('JANA Partners Management, LP', 4.98, 5335707.0, '2026-10-28'))
        self.assertTrue(d['purpose'].startswith('The Reporting Person reduced its'))                 # (after the 'is hereby amended and supplemented as follows:' lead-in)
        g = S13.parse_submission(fx('real_schedule13g_a.txt'))
        self.assertEqual((g['form'], g['kind'], g['filer'], g['pct'], g['shares'], g['event'], g['purpose']), ('SCHEDULE 13G/A', 'G', 'Vanguard Capital Management', 4.99, 3624539.0, '2026-09-30', ''))
        self.assertEqual(g['subject'], {'cik': '1580808', 'name': 'A10 Networks Inc', 'cusip': '002121101'})
        self.assertEqual(g['filer_cik'], '2100119')

    def test_old_text_forms(self):
        g = S13.parse_submission(fx('real_sc13g_a_old.txt'))
        self.assertEqual((g['form'], g['filer'], g['pct'], g['shares']), ('SC 13G/A', 'VANGUARD GROUP INC', 8.65, 9011332.0))
        self.assertEqual(g['subject'], {'cik': '1770787', 'name': '10x Genomics, Inc.', 'cusip': '88025U109'})
        d = S13.parse_submission(fx('real_sc13d_a_old.txt'))
        self.assertEqual((d['kind'], d['filer'], d['pct'], d['shares'], d['event']), ('D', 'POWER JOHN C /CA/', 8.38, 11867238.0, '2024-01-17'))
        # (the fixture is cut at 16 KB, before Item 4: on the whole document the same reader returned 'The securities of the Company were
        # acquired by Mr. Power for investment. Mr. Power reserves the right to acquire/dispose of additional shares ...')


if __name__ == '__main__':
    unittest.main()
