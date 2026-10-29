"""Offline tests for tools/reminders/reminders.py: schedule-page parsing, Calgary local-time windows across DST (and
Alberta's permanent UTC-6 from 2026-11-01 in tzdata 2026c+), the 40-minute late window, dedupe, cache fallback."""
import datetime as dt
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import reminders as R  # noqa: E402

UTC = dt.timezone.utc

FED = """<html><head><script>var x='2019 FOMC Meetings';</script></head><body>
<div class="panel panel-default"><div class="panel-heading"><h4><a id="1">2026 FOMC Meetings</a></h4></div>
<div class="row fomc-meeting"><div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
<div class="fomc-meeting__date col-xs-4">27-28</div><div>Statement: <a>PDF</a></div></div>
<div class="row fomc-meeting"><div class="fomc-meeting__month"><strong>Apr/May</strong></div>
<div class="fomc-meeting__date">30-1*</div></div>
<div class="row fomc-meeting"><div class="fomc-meeting__month"><strong>October</strong></div>
<div class="fomc-meeting__date">27-28</div></div>
<div class="row fomc-meeting"><div class="fomc-meeting__month"><strong>November</strong></div>
<div class="fomc-meeting__date">5 (unscheduled)</div></div>
<div class="row fomc-meeting"><div class="fomc-meeting__month"><strong>December</strong></div>
<div class="fomc-meeting__date">8-9*</div></div></div>
<div class="panel"><h4>2027 FOMC Meetings</h4>
<div><strong>January</strong></div><div>26-27</div>
<div><strong>Decided</strong></div><div>3-4</div>
</div><p>* Meeting associated with a Summary of Economic Projections.</p></body></html>"""

BLS_EMP = """<html><title>Schedule of Releases for The Employment Situation</title><table class="release-list">
<thead><tr><th>Reference Month</th><th>Release Date</th><th>Release Time</th></tr></thead><tbody>
<tr><td>September 2026</td><td>Oct. 02, 2026</td><td>08:30 AM</td></tr>
<tr><td>October 2026</td><td>Nov. 06, 2026</td><td>08:30&nbsp;AM</td></tr>
<tr><td>November 2026</td><td>Dec. 04, 2026</td><td>08:30 AM</td></tr>
<tr><td>December 2026</td><td>Jan. 08, 2027</td><td>08:30 AM</td></tr>
</tbody></table></html>"""

BLS_CPI = """<h1>Consumer Price Index</h1><table><tr><td>October 2026</td><td>Nov. 10, 2026</td>
<td>08:30 AM</td></tr><tr><td>August 2026</td><td>Sept. 11, 2026</td><td>8:30 A.M.</td></tr></table>"""


def utc(s):
    return dt.datetime.strptime(s, '%Y-%m-%d %H:%M').replace(tzinfo=UTC)


class Parsing(unittest.TestCase):
    def test_fomc(self):
        self.assertEqual(R.parse_fomc(FED), ['2026-01-28', '2026-05-01', '2026-10-28', '2026-12-09', '2027-01-27'])

    def test_fomc_garbage(self):
        self.assertEqual(R.parse_fomc('<html>Access Denied</html>'), [])

    def test_bls(self):
        self.assertEqual(R.parse_bls(BLS_EMP, 'Employment Situation'),
                         [('2026-10-02', '08:30'), ('2026-11-06', '08:30'), ('2026-12-04', '08:30'), ('2027-01-08', '08:30')])
        self.assertEqual(R.parse_bls(BLS_CPI, 'Consumer Price Index'), [('2026-09-11', '08:30'), ('2026-11-10', '08:30')])

    def test_bls_wrong_page(self):
        self.assertEqual(R.parse_bls(BLS_EMP, 'Consumer Price Index'), [])

    def test_ics(self):
        ics = ('BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART;TZID=US-Eastern:20261106T083000\r\n'
               'SUMMARY:Employment Situation for Oc\r\n tober 2026\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\n'
               'DTSTART;TZID=US-Eastern:20261110T083000\r\nSUMMARY:Consumer Price Index for October 2026\r\n'
               'END:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;TZID=US-Eastern:20261112T083000\r\n'
               'SUMMARY:Producer Price Index for October 2026\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n')
        self.assertEqual(R.parse_ics(ics, 'Employment Situation'), [('2026-11-06', '08:30')])
        self.assertEqual(R.parse_kind('cpi', ics), [{'date': '2026-11-10', 'et': '08:30'}])

    def test_page_fails_ics_used(self):
        ics = ('BEGIN:VCALENDAR\nBEGIN:VEVENT\nDTSTART:20261106T083000\nSUMMARY:Employment Situation for October 2026'
               '\nEND:VEVENT\nEND:VCALENDAR\n')

        def fetcher(url):
            if url == R.ICS:
                return ics
            raise OSError('403')
        cache = R.empty_cache()
        R.refresh(cache, dt.datetime(2026, 10, 29, 18, tzinfo=UTC), fetcher=fetcher, log=lambda *_: None)
        self.assertEqual([e['date'] for e in cache['kinds']['nfp']['events']], ['2026-11-06'])
        self.assertEqual(cache['kinds']['nfp']['source'], R.ICS)
        self.assertIn('no dates parsed', cache['kinds']['cpi']['error'])

    def test_plausible(self):
        today = dt.date(2026, 10, 29)
        self.assertTrue(R.plausible('nfp', ['2026-11-06', '2026-12-04'], today))
        self.assertFalse(R.plausible('nfp', ['2026-11-07'], today))                 # a Saturday
        self.assertFalse(R.plausible('nfp', ['2026-10-02'], today))                 # nothing upcoming
        self.assertFalse(R.plausible('fomc', [], today))


class Cache(unittest.TestCase):
    NOW = utc('2026-10-29 18:00')

    def test_fetch_ok_then_fail_keeps_last_good(self):
        pages = {R.URLS['fomc']: FED, R.URLS['nfp']: BLS_EMP, R.URLS['cpi']: BLS_CPI}
        cache = R.empty_cache()
        self.assertTrue(R.refresh(cache, self.NOW, fetcher=pages.__getitem__, log=lambda *_: None))
        ev = R.events(cache)
        self.assertIn('2026-11-06', [e['date'] for e in ev['nfp']])
        self.assertTrue(all(e['verified'] for e in ev['nfp']))

        def boom(url):
            raise OSError('down')
        later = self.NOW + dt.timedelta(days=4)
        R.refresh(cache, later, fetcher=boom, log=lambda *_: None)
        self.assertEqual([e['date'] for e in R.events(cache)['nfp']], [e['date'] for e in ev['nfp']])
        self.assertIn('fetch failed', cache['kinds']['nfp']['error'])

    def test_not_stale_no_fetch(self):
        cache = R.empty_cache()
        for k in cache['kinds'].values():
            k['tried_at'] = R._iso(self.NOW - dt.timedelta(days=1))
        self.assertFalse(R.refresh(cache, self.NOW, fetcher=lambda u: 1 / 0, log=lambda *_: None))

    def test_implausible_parse_keeps_cache(self):
        cache = R.empty_cache()
        R.refresh(cache, self.NOW, fetcher=lambda u: '<html>nothing</html>', log=lambda *_: None)
        self.assertEqual(cache['kinds']['fomc']['events'], [])
        ev = R.events(cache)                                    # -> unverified fallback
        self.assertEqual([e['date'] for e in ev['fomc']], R.FALLBACK['fomc'])
        self.assertFalse(ev['fomc'][0]['verified'])


class Times(unittest.TestCase):
    def test_summer_calgary_is_et_minus_2(self):
        t = R.at_et('2026-07-02', '08:30')                     # MDT
        self.assertEqual((t.hour, t.minute), (6, 30))
        self.assertEqual(t.astimezone(UTC).hour, 12)
        self.assertEqual(R.clock(R.at_et('2026-09-16', '14:00')), '12:00 PM')

    def test_et_dst_switch_alone(self):
        # US clocks change Nov 1 2026; 8:30 ET goes from 12:30 to 13:30 UTC whatever Alberta does
        self.assertEqual(R.at_et('2026-10-30', '08:30').astimezone(UTC).hour, 12)
        self.assertEqual(R.at_et('2026-11-06', '08:30').astimezone(UTC).hour, 13)

    def test_winter_local_follows_tzdata(self):
        t = R.at_et('2026-12-04', '08:30')
        off = t.utcoffset().total_seconds() / 3600
        self.assertIn(off, (-6, -7))                            # -6 with tzdata 2026c+ (Alberta permanent UTC-6)
        self.assertEqual(t.hour, 6 if off == -7 else 7)


def evs(**kw):
    return {k: [{'date': d, 'et': R.ET_TIME[k], 'verified': True} for d in kw.get(k, [])] for k in R.URLS}


class Windows(unittest.TestCase):
    E = evs(nfp=['2026-07-02'], cpi=['2026-07-14', '2026-07-02'], fomc=['2026-07-29'])

    def rems(self, daily=False):
        return R.schedule(self.E, dt.date(2026, 6, 29), dt.date(2026, 7, 31), daily)

    def test_one_combined_morning_message(self):
        r = [x for x in self.rems() if x['id'] == '2026-07-02:morning']
        self.assertEqual(len(r), 1)
        self.assertIn('Jobs report + US inflation (CPI) today · 6:30 AM', r[0]['msg'])
        self.assertEqual(R.clock(r[0]['send_at']), '5:45 AM')

    def test_window(self):
        rems = self.rems()
        for now, want in (('2026-07-14 11:40', []),                     # 5:40 too early
                          ('2026-07-14 11:45', ['2026-07-14:morning']),  # 5:45 on time
                          ('2026-07-14 12:20', ['2026-07-14:morning']),  # 6:20 late but before 6:25/6:30
                          ('2026-07-14 12:25', []),                     # 6:25: 40 min late -> skip
                          ('2026-07-14 12:40', []),                     # event passed
                          ('2026-07-29 17:30', ['2026-07-29:fomc']),     # 11:30 Calgary
                          ('2026-07-29 17:59', ['2026-07-29:fomc']),
                          ('2026-07-29 18:00', [])):                    # statement out -> skip
            go, _ = R.due(rems, utc(now), {})
            self.assertEqual([r['id'] for r in go], want, now)

    def test_dedupe(self):
        rems = self.rems()
        sent = {}
        go, _ = R.due(rems, utc('2026-07-14 11:46'), sent)
        sent[go[0]['id']] = 'x'
        self.assertEqual(R.due(rems, utc('2026-07-14 11:56'), sent)[0], [])

    def test_missed_reported(self):
        _, missed = R.due(self.rems(), utc('2026-07-14 12:45'), {})
        self.assertEqual([r['id'] for r in missed], ['2026-07-14:morning'])

    def test_daily_off_by_default_and_skips_event_days_and_holidays(self):
        self.assertFalse(any(r['kinds'] == ['daily'] for r in self.rems()))
        days = {r['id'][:10] for r in self.rems(daily=True) if r['kinds'] == ['daily']}
        self.assertIn('2026-06-29', days)
        self.assertNotIn('2026-07-02', days)        # NFP + CPI morning
        self.assertNotIn('2026-07-03', days)        # NYSE closed (Independence Day observed)
        self.assertNotIn('2026-07-04', days)        # Saturday
        d = [r for r in self.rems(daily=True) if r['id'] == '2026-06-29:daily'][0]
        self.assertEqual(R.clock(d['send_at']), '6:10 AM')
        self.assertIn('Main window 6:30-10:00 today', d['msg'])

    def test_fomc_text_and_button(self):
        f = [r for r in self.rems() if r['id'] == '2026-07-29:fomc'][0]
        self.assertTrue(f['msg'].startswith('⏰ <b>Fed decision today · 12:00 PM, press conference 12:30 PM</b>'))
        self.assertLessEqual(len(f['msg'].split('\n')), 4)
        self.assertEqual(f['msg'].buttons, [[{'text': 'Open scanner', 'url': R.SN.FULL_LIST}]])
        for bad in ('profit', 'guarantee', 'win'):
            self.assertNotIn(bad, f['msg'].lower())

    def test_prune(self):
        self.assertEqual(R.prune({'2026-01-01:morning': 'x', '2026-07-01:fomc': 'y'}, dt.date(2026, 7, 14)),
                         {'2026-07-01:fomc': 'y'})

    def test_holidays(self):
        self.assertEqual(sorted(x.isoformat() for x in R.nyse_holidays(2026)),
                         ['2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25', '2026-06-19',
                          '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25'])
        self.assertIn(dt.date(2027, 3, 26), R.nyse_holidays(2027))   # Good Friday 2027
        self.assertNotIn(dt.date(2021, 12, 31), R.nyse_holidays(2022))


if __name__ == '__main__':
    unittest.main()
