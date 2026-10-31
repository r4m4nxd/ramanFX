"""Holders (tools/holders), offline: the 13F data-set reader (small TSV slices in tests/fixtures, zipped here), the CUSIP map
(OpenFIGI faked), 13D / 13G -> 5%+ holders with the change vs the filer's previous filing (the insiders fixtures), Form 4
holdings, shares outstanding, the shard files and one full run on fake SEC answers."""
import datetime as dt
import json
import os
import sys
import tempfile
import unittest
import urllib.error
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
TOOLS = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, os.path.join(TOOLS, 'insiders'))

import f13 as T  # noqa: E402
import form4 as F  # noqa: E402
import holders as H  # noqa: E402
import insiders as I  # noqa: E402
import sched13 as S13  # noqa: E402

UTC = dt.timezone.utc
NOW = dt.datetime(2026, 10, 30, 14, 0, tzinfo=UTC)      # Fri 10:00 New York
TODAY = dt.date(2026, 10, 30)
FIX = os.path.join(HERE, 'fixtures')
INS_FIX = os.path.join(TOOLS, 'insiders', 'tests', 'fixtures')


def read(d, name, mode='rb'):
    with open(os.path.join(d, name), mode) as f:
        return f.read()


def make_zip(path, which):
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as z:
        for t in ('SUBMISSION', 'COVERPAGE', 'INFOTABLE'):
            z.writestr(f'{t}.tsv', read(FIX, f'{t}_{which}.tsv'))


class FakeCtx(I.Context):
    def __init__(self, rows, fund):
        self.rows, self.fund, self._d = rows, fund, {}
        self._ck, self._csv = None, os.devnull


UNI = [{'s': 'XYZ', 'n': 'XYZ Corp', 'cik': '111111'}, {'s': 'BRK-B', 'n': 'Berkshire Hathaway Inc.', 'cik': '1067983'}, {'s': 'OTH', 'n': 'Other Co', 'cik': ''}]


class Test13F(unittest.TestCase):
    def test_zip_names_and_page(self):
        self.assertEqual(T.zip_end('01sep2025-30nov2025_form13f.zip'), dt.date(2025, 11, 30))
        self.assertEqual(T.zip_end('01dec2025-28feb2026_form13f.zip'), dt.date(2026, 2, 28))
        self.assertEqual(T.zip_end('2023q4_form13f.zip'), dt.date(2023, 12, 31))
        self.assertEqual(T.zip_end('2024q2_form13f.zip'), dt.date(2024, 6, 30))
        self.assertIsNone(T.zip_end('readme.zip'))
        links = T.zip_links(read(FIX, 'datasets_page.html', 'r'))
        self.assertEqual([u.rsplit('/', 1)[1] for u, _ in links], ['01sep2026-30nov2026_form13f.zip', '01jun2026-31aug2026_form13f.zip', '01mar2026-31may2026_form13f.zip', '2023q4_form13f.zip'])
        self.assertTrue(links[0][0].startswith('https://www.sec.gov/files/structureddata/data/form-13f-data-sets/'))
        self.assertEqual(T.zip_links('<html>nothing</html>'), [])

    def test_meta_period_and_amendments(self):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'new.zip')
            make_zip(p, 'new')
            with zipfile.ZipFile(p) as z:
                meta = T.read_meta(z)
        self.assertNotIn('0008-26-000010', meta)                                   # a 13F-NT notice: no holdings
        self.assertEqual(T.dominant_period(meta), dt.date(2026, 6, 30))            # the Q1 straggler is the minority
        self.assertEqual(meta['0001-26-000001']['name'], 'VANGUARD GROUP INC')
        self.assertEqual(meta['0001-26-000001']['filed'], dt.date(2026, 8, 14))
        self.assertEqual(meta['0006-26-000007']['amend'], 'RESTATEMENT')
        accs = T.pick_accessions(meta, dt.date(2026, 6, 30))
        self.assertNotIn('0006-26-000006', accs)                                   # replaced by its restatement
        self.assertIn('0006-26-000007', accs)
        self.assertEqual({a for a, c in accs.items() if c == '3333333'}, {'0007-26-000008', '0007-26-000009'})   # original + new holdings
        self.assertNotIn('0009-26-000011', accs)                                   # another quarter

    def test_rows_top_holders_and_change(self):
        with tempfile.TemporaryDirectory() as d:
            pn, po = os.path.join(d, 'n.zip'), os.path.join(d, 'o.zip')
            make_zip(pn, 'new'); make_zip(po, 'old')
            with zipfile.ZipFile(pn) as zn, zipfile.ZipFile(po) as zo:
                mn, mo = T.read_meta(zn), T.read_meta(zo)
                issuers = T.issuer_names(zn)
                self.assertEqual(issuers['98765A103']['name'], 'XYZ CORP')
                self.assertNotIn('98765AAA1', issuers)                              # a bond (PRN): not shares
                a1, a0 = T.pick_accessions(mn, T.dominant_period(mn)), T.pick_accessions(mo, T.dominant_period(mo))
                cur = T.holdings_of(zn, a1, {'98765A103'})['98765A103']
                prev = T.holdings_of(zo, a0, {'98765A103'})['98765A103']
        self.assertEqual(cur['102909'], (24_800_000.0, 3_000_000_000.0))           # two rows summed, the put row left out
        self.assertEqual(cur['2222222'][0], 1_000_000)                              # the restatement, not the original
        self.assertEqual(cur['3333333'][0], 750_000)
        names = {m['cik']: m['name'] for m in list(mo.values()) + list(mn.values()) if m['name']}
        blk = T.top_holders(cur, prev, names, set(a1.values()), 180_000_000.0)
        top = {r['cik']: r for r in blk['top']}
        self.assertEqual([r['cik'] for r in blk['top']][:3], ['102909', '1364742', '315066'])
        self.assertEqual((top['102909']['ch'], top['102909']['dsh']), ('add', 1_800_000))
        self.assertEqual(top['102909']['pct'], round(24.8 / 180 * 100, 3))
        self.assertEqual(top['1364742']['ch'], 'cut')
        self.assertEqual(top['315066']['ch'], 'same')
        self.assertEqual(top['1111111']['ch'], 'new')
        self.assertEqual(top['1067983']['ch'], 'add')
        self.assertTrue(top['102909'].get('idx') and top['1364742'].get('idx'))      # Vanguard, BlackRock: index
        self.assertFalse(top['315066'].get('idx'))                                   # FMR files active + index together
        self.assertEqual(top['102909']['f'], 'Vanguard Group Inc')
        self.assertEqual(top['1364742']['f'], 'BlackRock Inc')
        self.assertEqual(blk['n'], 7)
        self.assertEqual([x['f'] for x in blk['ex']], ['Exited Fund LP'])           # filed this quarter, holds none now; the late / absent ones are not 'exited'
        self.assertEqual(blk['tot'], 24_800_000 + 20_500_000 + 8_300_000 + 5_000_000 + 1_080_000 + 1_000_000 + 750_000)

    def test_names_and_index_tags(self):
        self.assertEqual(T.pretty('JPMORGAN CHASE & CO'), 'JPMorgan Chase & Co')
        self.assertEqual(T.pretty('Already Mixed Case LLC'), 'Already Mixed Case LLC')
        for n in ('VANGUARD GROUP INC', 'BlackRock, Inc.', 'STATE STREET CORP', 'GEODE CAPITAL MANAGEMENT, LLC', 'NORTHERN TRUST CORP',
                  'Charles Schwab Investment Management', 'DIMENSIONAL FUND ADVISORS LP', 'iShares Trust'):
            self.assertTrue(T.is_index(n), n)
        for n in ('FMR LLC', 'CAPITAL WORLD INVESTORS', 'T. Rowe Price Associates', 'Renaissance Technologies'):
            self.assertFalse(T.is_index(n), n)


class TestCusipMap(unittest.TestCase):
    ISS = {'98765A103': {'name': 'XYZ CORP', 'title': 'COM', 'val': 5e9}, '11111B104': {'name': 'OTHER CO', 'title': 'COM', 'val': 1e9},
           '02079K305': {'name': 'ALPHABET INC', 'title': 'CAP STK CL A', 'val': 9e9}, '02079K107': {'name': 'ALPHABET INC', 'title': 'CAP STK CL C', 'val': 8e9},
           '99999Z109': {'name': 'ZZZ UNKNOWN LTD', 'title': 'COM', 'val': 7e9}}
    UNI = [{'s': 'XYZ', 'n': 'XYZ Corporation', 'cik': ''}, {'s': 'GOOGL', 'n': 'Alphabet Inc.', 'cik': ''}, {'s': 'GOOG', 'n': 'Alphabet Inc.', 'cik': ''}, {'s': 'BRK-B', 'n': 'Berkshire Hathaway Inc.', 'cik': ''}]

    def test_name_normalisation_and_candidates(self):
        self.assertEqual(T.norm_name('APPLE INC'), 'apple')
        self.assertEqual(T.norm_name('Apple Inc.'), 'apple')
        self.assertEqual(T.norm_name('Berkshire Hathaway Inc. Class B'), 'berkshire hathaway b')
        self.assertEqual(T.norm_name('AT&T Inc.'), 'at and t')
        c = T.name_candidates(self.ISS, self.UNI, set())
        self.assertEqual(sorted(c), ['02079K107', '02079K305', '98765A103'])        # not OTHER CO, not an unknown name; biggest dollars first
        self.assertEqual(c[0], '02079K305')
        self.assertEqual(T.name_candidates(self.ISS, self.UNI, {'98765A103'}).count('98765A103'), 0)

    def test_openfigi_flow_cache_and_limits(self):
        asked = []

        def post(jobs):
            asked.append([j['idValue'] for j in jobs])
            out = []
            for j in jobs:
                t = {'98765A103': 'XYZ', '02079K305': 'GOOGL', '02079K107': 'GOOG'}.get(j['idValue'])
                out.append({'data': [{'ticker': t, 'marketSector': 'Equity', 'exchCode': 'US'}]} if t else {'warning': 'No identifier found.'})
            return out
        with tempfile.TemporaryDirectory() as d:
            cm = T.CusipMap(os.path.join(d, 'cusip.json'))
            r = T.resolve(cm, self.ISS, self.UNI, {'11111B104': 'OTH'}, post, 1_000_000.0, sleep=lambda s: None)
            self.assertEqual(asked, [['02079K305', '02079K107', '98765A103']])        # ONE request of three (a batch holds up to 10)
            self.assertEqual((r['seeded'], r['figi'], r['requests']), (1, 3, 1))
            self.assertEqual(cm.symbols(), {'11111B104': 'OTH', '98765A103': 'XYZ', '02079K305': 'GOOGL', '02079K107': 'GOOG'})
            cm.save()
            cm2 = T.CusipMap(os.path.join(d, 'cusip.json'))
            asked.clear()
            T.resolve(cm2, self.ISS, self.UNI, {}, post, 1_000_000.0 + 86400, sleep=lambda s: None)
            self.assertEqual(asked, [])                                              # cached: nothing asked again
            # a CUSIP OpenFIGI cannot map is cached as 'none' and asked again after 30 days only
            iss = dict(self.ISS, **{'12345N104': {'name': 'XYZ CORP', 'title': 'WT', 'val': 1e3}})
            T.resolve(cm2, iss, self.UNI, {}, post, 1_000_000.0, sleep=lambda s: None)
            self.assertEqual(asked, [['12345N104']])
            asked.clear()
            T.resolve(cm2, iss, self.UNI, {}, post, 1_000_000.0 + 86400 * 5, sleep=lambda s: None)
            self.assertEqual(asked, [])
            T.resolve(cm2, iss, self.UNI, {}, post, 1_000_000.0 + 86400 * 31, sleep=lambda s: None)
            self.assertEqual(asked, [['12345N104']])

    def test_budget_rate_limit_and_no_post(self):
        many = {f'{i:08d}1': {'name': 'XYZ CORP', 'title': 'COM', 'val': 1e3 + i} for i in range(25)}
        calls = []
        cm = T.CusipMap('')
        T.resolve(cm, many, self.UNI, {}, lambda jobs: calls.append(len(jobs)) or [{} for _ in jobs], 1.0, max_requests=2, sleep=lambda s: None)
        self.assertEqual(calls, [10, 10])                                            # the request budget caps it (25 a minute on the free tier)
        def limited(jobs):
            raise urllib.error.HTTPError('u', 429, 'Too Many Requests', {}, None)
        cm2 = T.CusipMap('')
        r = T.resolve(cm2, many, self.UNI, {}, limited, 1.0, sleep=lambda s: None, log=lambda *a: None)
        self.assertEqual(r['requests'], 0)                                           # a 429 stops the run: tried again next time
        self.assertEqual(cm2.m, {})
        self.assertEqual(T.resolve(T.CusipMap(''), many, self.UNI, {'1': 'X'}, None, 1.0)['asked'], 0)    # no network: seeds only

    def test_key_goes_in_a_header_not_the_log(self):
        seen = {}
        import urllib.request
        class R:
            def __enter__(s): return s
            def __exit__(s, *a): return False
            def read(s): return b'[]'
        orig = urllib.request.urlopen
        urllib.request.urlopen = lambda req, timeout=0: seen.setdefault('h', dict(req.header_items())) and R() or R()
        try:
            T.openfigi_poster('RamanFX-holders/1.0', 'SECRETKEY')([{'idType': 'ID_CUSIP', 'idValue': 'x'}])
        finally:
            urllib.request.urlopen = orig
        self.assertEqual(seen['h'].get('X-openfigi-apikey'), 'SECRETKEY')
        self.assertNotIn('@', seen['h'].get('User-agent', ''))                       # no contact goes to OpenFIGI


class TestSchedule13Holders(unittest.TestCase):
    def recs(self):
        out = []
        for name, acc, cik in (('schedule13g.txt', '0000102909-26-000200', '102909'), ('sc13g_old.txt', '0000102909-24-000050', '102909')):
            raw = read(INS_FIX, name)
            doc = S13.parse_submission(raw)
            out.append(S13.record(doc, {'acc': acc}, f'https://www.sec.gov/{acc}', I.accepted_utc(doc['accepted']), 'XYZ'))
        return out

    def test_latest_per_filer_with_the_change_vs_the_previous_filing(self):
        rs = self.recs()
        rs.append(dict(rs[0], acc='z1', filer='VANGUARD GROUP INC', filer_cik='102910', pct=11.2, shares=20_000_000, filed='2026-02-10T12:00:00Z'))
        rs.append(dict(rs[0], acc='z2', filer='Small Holder LP', filer_cik='555', pct=3.1, shares=5_000_000, filed='2026-05-01T12:00:00Z'))      # fell below 5%
        rs.append(dict(rs[0], acc='z3', filer='Old Exit LP', filer_cik='556', pct=2.0, shares=3_000_000, filed='2023-01-01T12:00:00Z'))          # an old exit: not listed
        rs.append({'bad': True, 'cik': '111111', 'filed': '2026-01-01'})
        h5, h5x = H.five_percent(rs, TODAY)
        self.assertEqual([r['f'] for r in h5], ['Vanguard Group Inc', 'Example Index Group Inc'])
        self.assertTrue(h5[0]['idx'])
        ex = h5[1]
        self.assertEqual((ex['form'], ex['d'], ex['ev'], ex['pct'], ex['sh']), ('13G/A', '2026-10-14', '2026-09-30', 9.57, 17_220_000.0))
        self.assertEqual(ex['chg'], {'pct': 0.37, 'sh': 680_000, 'prev': '2024-02-13'})          # 9.57% vs 9.2% on the old SC 13G/A text
        self.assertNotIn('chg', h5[0])                                                           # no earlier filing of theirs
        self.assertEqual([r['f'] for r in h5x], ['Small Holder LP'])

    def test_phase_reads_submissions_and_the_daily_index(self):
        st = H.load_state('/nonexistent')
        subs = {'cik': '111111', 'filings': {'recent': {'accessionNumber': ['0000102909-26-000200', '0000102909-24-000050', '0001111111-26-000102', '0000009999-26-000001'],
                                                          'form': ['SCHEDULE 13G/A', 'SC 13G/A', '4', 'SCHEDULE 13D'], 'filingDate': ['2026-10-14', '2024-02-13', '2026-10-29', '2020-01-01']}}}
        refs = H.submissions_refs(subs, '2023-10-30')
        self.assertEqual([r['acc'] for r in refs], ['0000102909-26-000200', '0000102909-24-000050'])    # 13D / 13G only, inside the lookback
        calls = []

        def get(url):
            calls.append(url)
            if '/submissions/' in url:
                return json.dumps(subs).encode()
            if 'daily-index' in url:
                if 'form.20261029' in url:
                    return b'SCHEDULE 13G/A  XYZ Corp   111111   20261029   edgar/data/111111/0000102909-26-000210.txt\nSCHEDULE 13G/A  OTHER   999   20261029   edgar/data/999/0000102909-26-000211.txt\n'
                raise urllib.error.HTTPError(url, 404, 'nf', {}, None)
            acc = url.rsplit('/', 1)[1][:-4]
            if acc == '0000102909-24-000050':
                return read(INS_FIX, 'sc13g_old.txt')
            return read(INS_FIX, 'schedule13g.txt').replace(b'0000102909-26-000200', acc.encode())
        s = H.phase_g13(st, [{'s': 'XYZ', 'n': 'XYZ Corp', 'cik': '111111'}], get, TODAY, 10 ** 12, NOW.timestamp())
        self.assertEqual((s['issuers'], s['new'], s['parsed']), (1, 3, 3))
        self.assertEqual(set(st['g13']), {'0000102909-26-000200', '0000102909-24-000050', '0000102909-26-000210'})    # the unrelated company's one is not read
        self.assertEqual(st['g13']['0000102909-26-000210']['sym'], 'XYZ')
        self.assertEqual(st['g13']['0000102909-24-000050']['cusip'], '98765A103')
        n = len(calls)
        H.phase_g13(st, [{'s': 'XYZ', 'n': 'XYZ Corp', 'cik': '111111'}], get, TODAY, 10 ** 12, NOW.timestamp() + 3600)
        self.assertFalse(any(u.endswith('.txt') for u in calls[n:]))                              # nothing read twice; the company list waits a day


class TestForm4Holdings(unittest.TestCase):
    def test_latest_per_person_and_the_list(self):
        st = H.load_state('/nonexistent')
        doc = F.parse_submission(read(INS_FIX, 'form4_sale_open.txt'))
        h = F.holdings(doc)
        self.assertTrue(H.add_holding(st, '0000111111', h, 'a1', '2026-10-29T21:15:30Z'))
        self.assertFalse(H.add_holding(st, '111111', dict(h, date='2026-10-01', after=1.0), 'a0', '2026-10-02T00:00:00Z'))    # an older trade: ignored
        d2 = F.parse_submission(read(INS_FIX, 'form4_sale_plan.txt'))
        H.add_holding(st, '111111', F.holdings(d2), 'a2', '2026-10-29T20:12:05Z')
        H.add_holding(st, '999', dict(h, owner_cik='5', owner='Zed', after=9e9), 'a3', '')                                      # another company
        H.add_holding(st, '111111', dict(h, owner_cik='6', owner='Sold Out', after=0.0), 'a4', '')                               # no shares left
        rows = H.insiders_of(st, '111111', 180_000_000.0)
        self.assertEqual([(r['w'], r['own'], r['code'], r['mv'], r['d']) for r in rows], [('Doe Jane', 480_000, 'S', -20_000, '2026-10-27'), ('Roe Richard', 83_000, 'S', -12_000, '2026-10-28')])
        self.assertEqual(rows[0]['pct'], round(480_000 / 180e6 * 100, 3))
        self.assertEqual(rows[0]['px'], 120.0)

    def test_phase_reads_universe_filings_only(self):
        st = H.load_state('/nonexistent')
        idx = ('4   XYZ Corp   111111   20261029   edgar/data/111111/0001111111-26-000102.txt\n4   Roe Richard   333333   20261029   edgar/data/333333/0001111111-26-000102.txt\n'
               '4   OTHER INC   999   20261029   edgar/data/999/0000000999-26-000001.txt\n')

        def get(url):
            if 'daily-index' in url:
                if 'form.20261029' in url:
                    return idx.encode()
                raise urllib.error.HTTPError(url, 404, 'nf', {}, None)
            assert url.endswith('0001111111-26-000102.txt'), url
            return read(INS_FIX, 'form4_sale_open.txt')
        s = H.phase_f4(st, [{'s': 'XYZ', 'n': 'XYZ Corp', 'cik': '111111'}], get, TODAY, 10 ** 12)
        self.assertEqual(s['read'], 1)
        self.assertEqual(list(st['f4_holds']), ['111111:333333'])
        self.assertIn('20261029', st['f4_days'])


class TestSharesAndFiles(unittest.TestCase):
    def test_shares_outstanding(self):
        js = {'units': {'shares': [{'end': '2026-04-20', 'val': 170e6, 'accn': 'a', 'filed': '2026-04-25'},
                                   {'end': '2026-10-20', 'val': 150e6, 'accn': 'b', 'filed': '2026-10-28'}, {'end': '2026-10-20', 'val': 30e6, 'accn': 'b', 'filed': '2026-10-28'}]}}
        self.assertEqual(H.parse_shares(js), {'so': 180e6, 'end': '2026-10-20', 'n': 2})      # two classes of the latest cover page
        self.assertIsNone(H.parse_shares({'units': {}}))

    def test_shard_rule(self):
        self.assertEqual([H.shard_of(s) for s in ('AAPL', 'brk-b', 'BRK.B', '3M', '', 'Z')], ['A', 'B', 'B', '_', '_', 'Z'])

    def synthetic(self, n=1000):
        uni, st = [], H.load_state('/nonexistent')
        for k in range(n):
            s = f'{chr(65 + k % 26)}{k:03d}'
            uni.append({'s': s, 'n': f'Company Number {k} Holdings Inc', 'cik': str(100000 + k)})
            st['so'][str(100000 + k)] = {'so': 1.5e8 + k, 'end': '2026-10-20', 'at': 1, 'n': 1}
            for j in range(8):
                st['g13'][f'{k}-{j}'] = {'acc': f'{k}-{j}', 'cik': str(100000 + k), 'filer': f'INVESTMENT MANAGER NUMBER {j} LLC', 'filer_cik': str(7000 + j), 'form': 'SCHEDULE 13G/A',
                                         'pct': 5.5 + j, 'shares': 8e6 + j, 'event': '2026-09-30', 'filed': '2026-10-14T12:00:00Z', 'url': ''}
                st['f4_holds'][f'{100000 + k}:{j}'] = {'w': f'Insider Person {j}', 'ocik': str(j), 'role': 'CEO · Director', 'own': 1e6 + j, 'd': '2026-10-01', 'code': 'S', 'mv': -5000, 'px': 99.5, 'ten': False}
        blk = {'top': [{'f': f'Investment Management Company {j}', 'cik': str(1000 + j), 'sh': 12_345_678 + j, 'v': 1_234_567_890, 'ch': 'add', 'dsh': 123456, 'pct': 4.123, 'idx': True} for j in range(10)],
               'n': 4000, 'tot': 99_999_999, 'tot_pct': 61.23, 'ex': [{'f': 'Exited Fund LP', 'cik': '9', 'sh': 1000}]}
        f13 = {u['s']: blk for u in uni}
        f13['_meta'] = {'q': '2026-06-30', 'pq': '2026-03-31'}
        return uni, st, f13

    def test_shard_files_and_their_size(self):
        uni, st, f13 = self.synthetic()
        files = H.build_files(uni, st, TODAY, NOW, f13, True)
        t = {p: json.dumps(v, separators=(',', ':')) for p, v in files.items()}
        shards = [p for p in t if p.startswith('t/')]
        total = sum(len(v) for v in t.values())
        biggest = max(len(t[p]) for p in shards)
        print(f'\n[size] {len(uni)} stocks: {total / 1e6:.2f} MB in {len(shards)} shards, biggest {biggest / 1e3:.0f} KB, {total / len(uni) / 1e3:.1f} KB a stock', end=' ')
        self.assertEqual(len(shards), 26)
        self.assertLess(total / len(uni), 6500)                                           # compact: a full card is ~5 KB
        self.assertLess(biggest, 400_000)
        rec = files['t/A.json']['stocks']['A000']
        self.assertEqual((len(rec['h5']), len(rec['ins']), len(rec['f13']['top'])), (8, 8, 10))
        self.assertEqual(files['index.json']['with'], {'h5': 1000, 'ins': 1000, 'f13': 1000})
        self.assertEqual(files['index.json']['f13']['q'], '2026-06-30')

    def test_write_only_what_changed_and_drop_stale_shards(self):
        uni, st, f13 = self.synthetic(60)
        with tempfile.TemporaryDirectory() as d:
            files = H.build_files(uni, st, TODAY, NOW, f13, True)
            self.assertEqual(H.write_files(files, d), len(files))
            again = H.build_files(uni, st, TODAY, NOW + dt.timedelta(hours=3), f13, True)
            self.assertEqual(H.write_files(again, d), 0)                                  # only 'generated' differs: no commit
            gone = [u for u in uni if not u['s'].startswith('A')]
            H.write_files(H.build_files(gone, st, TODAY, NOW, f13, True), d)
            self.assertFalse(os.path.exists(os.path.join(d, 't', 'A.json')))


class TestRun(unittest.TestCase):
    def get(self, calls):
        subs = {'cik': '111111', 'filings': {'recent': {'accessionNumber': ['0000102909-26-000200', '0000102909-24-000050'], 'form': ['SCHEDULE 13G/A', 'SC 13G/A'],
                                                          'filingDate': ['2026-10-14', '2024-02-13']}}}
        concept = {'units': {'shares': [{'end': '2026-10-20', 'val': 180_000_000, 'accn': '0000111111-26-000300', 'filed': '2026-10-28', 'form': '10-Q'}]}}
        idx = '4   XYZ Corp   111111   20261029   edgar/data/111111/0001111111-26-000102.txt\n'

        def get(url):
            calls.append(url)
            if '/submissions/CIK0000111111' in url:
                return json.dumps(subs).encode()
            if '/companyconcept/CIK0000111111' in url:
                return json.dumps(concept).encode()
            if url == T.PAGE:
                return read(FIX, 'datasets_page.html')
            if 'daily-index' in url:
                if 'form.20261029' in url:
                    return idx.encode()
                raise urllib.error.HTTPError(url, 404, 'nf', {}, None)
            acc = url.rsplit('/', 1)[1][:-4]
            return {'0000102909-26-000200': read(INS_FIX, 'schedule13g.txt'), '0000102909-24-000050': read(INS_FIX, 'sc13g_old.txt'),
                    '0001111111-26-000102': read(INS_FIX, 'form4_sale_open.txt')}[acc]
        return get

    def test_full_run_cache_and_published_fallback(self):
        calls, dl = [], []
        ctx = FakeCtx({'XYZ': {'s': 'XYZ', 'n': 'XYZ Corp', 'k': 1}, 'ABC': {'s': 'ABC', 'n': 'Abc Inc', 'k': 2}}, {'XYZ': {'cik': '111111'}})

        def fetch(url, dest, ua):
            dl.append(url.rsplit('/', 1)[1])
            make_zip(dest, 'new' if len(dl) == 1 else 'old')
            return os.path.getsize(dest)
        with tempfile.TemporaryDirectory() as d:
            kw = dict(ctx=ctx, state_path=os.path.join(d, 'c', 'state.json'), out=os.path.join(d, 'out'), cache_dir=os.path.join(d, 'c'), fetch=fetch, post=lambda jobs: self.fail('seeded from the 13G'))
            files = H.run(NOW, self.get(calls), 'RamanFX holders test', **kw)
            self.assertEqual(dl, ['01sep2026-30nov2026_form13f.zip', '01jun2026-31aug2026_form13f.zip'])
            x = files['t/X.json']['stocks']['XYZ']
            self.assertEqual((x['cik'], x['so'], x['so_end']), ('111111', 180_000_000, '2026-10-20'))
            self.assertEqual([(r['f'], r['pct'], r['chg']['pct']) for r in x['h5']], [('Example Index Group Inc', 9.57, 0.37)])
            self.assertEqual([(r['w'], r['own']) for r in x['ins']], [('Roe Richard', 83000)])
            self.assertEqual(x['f13']['top'][0]['f'], 'Vanguard Group Inc')
            self.assertEqual((x['f13']['top'][0]['ch'], x['f13']['top'][0]['idx']), ('add', True))
            self.assertEqual(files['index.json']['f13']['q'], '2026-06-30')
            self.assertEqual(files['index.json']['f13']['lag_days'], 45)
            self.assertNotIn('f13', files['t/A.json']['stocks']['ABC'])                  # no CIK, no CUSIP: just its name
            self.assertTrue(os.path.exists(os.path.join(d, 'out', 't', 'X.json')))
            self.assertEqual(json.loads(read(os.path.join(d, 'out'), 'index.json', 'r'))['stocks'], 2)
            # the next day: nothing downloaded again (the 13F check is weekly), the filings already read are not read again
            calls.clear(); dl.clear()
            H.run(NOW + dt.timedelta(days=1), self.get(calls), 'x', **kw)
            self.assertEqual(dl, [])
            self.assertFalse(any(u.endswith('.txt') for u in calls))
            self.assertNotIn(T.PAGE, calls)
            # a week later the page is read once; same newest data set: still no download
            calls.clear()
            H.run(NOW + dt.timedelta(days=8), self.get(calls), 'x', **kw)
            self.assertEqual(calls.count(T.PAGE), 1)
            self.assertEqual(dl, [])
            # the cache evicted: the 13F blocks come back from the published files, no download
            import shutil
            shutil.rmtree(os.path.join(d, 'c'))
            files2 = H.run(NOW + dt.timedelta(days=9), None, '', **kw)
            self.assertEqual(files2['t/X.json']['stocks']['XYZ']['f13']['top'][0]['f'], 'Vanguard Group Inc')
            self.assertFalse(files2['index.json']['sec'])

    def test_no_user_agent_requests_nothing(self):
        ctx = FakeCtx({'XYZ': {'s': 'XYZ', 'n': 'XYZ Corp', 'k': 1}}, {'XYZ': {'cik': '111111'}})
        with tempfile.TemporaryDirectory() as d:
            files = H.run(NOW, None, '', ctx=ctx, state_path=os.path.join(d, 's.json'), out=os.path.join(d, 'out'), cache_dir=os.path.join(d, 'c'))
            self.assertEqual(files['t/X.json']['stocks']['XYZ'], {'n': 'XYZ Corp', 'cik': '111111'})


if __name__ == '__main__':
    unittest.main()
