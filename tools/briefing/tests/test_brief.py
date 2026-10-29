"""Offline tests for tools/briefing/brief.py: range / ATR ranking on synthetic bars, zone context, message length and
HTML escaping, the lesson rotation (no repeats until all are used), the 6 AM schedule window, and Calgary local time
from the zone rules (Alberta permanent UTC-6 from 2026-11-01 in tzdata 2026c+)."""
import datetime as dt
import os
import re
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import brief as B  # noqa: E402
from zones import Bar  # noqa: E402  (tools/stock_scanner, put on sys.path by brief)

UTC = dt.timezone.utc


def bars(n=30, rng=1.0, last=None, base=100.0, vol=1e6):
    out = [Bar(f'2026-09-{k + 1:02d}' if k < 30 else f'2026-10-{k - 29:02d}', base, base + rng / 2, base - rng / 2, base, vol)
           for k in range(n)]
    if last:
        out.append(Bar('2026-10-28', *last, vol))
    return out


def tzver():
    try:
        import tzdata
        return tzdata.IANA_VERSION
    except Exception:  # noqa: BLE001
        return ''


class Ranking(unittest.TestCase):
    def test_ratio_uses_prior_bars(self):
        b = bars(25, 1.0, last=(100, 102, 99, 101.5))          # range 3 vs ATR 1
        r, tr, atr = B.range_ratio(b)
        self.assertAlmostEqual(atr, 1.0)
        self.assertAlmostEqual(tr, 3.0)
        self.assertAlmostEqual(r, 3.0)

    def test_gap_counts_in_true_range(self):
        b = bars(25, 1.0, last=(105, 105.5, 104.5, 105))        # range 1 but gapped up 5 from close 100
        self.assertAlmostEqual(B.range_ratio(b)[0], 5.5)

    def test_too_short(self):
        self.assertIsNone(B.range_ratio(bars(10, 1.0)))

    def test_rank_orders_by_ratio(self):
        ms = []
        for sym, big in (('AAA', 1.5), ('BBB', 4.0), ('CCC', 2.5), ('DDD', 0.9)):
            b = bars(25, 1.0, last=(100, 100 + big / 2, 100 - big / 2, 100 + big / 4), vol=1e6)
            ms.append(B.stock_mover(sym, b, []))
        top = B.rank(ms, 3)
        self.assertEqual([m['sym'] for m in top], ['BBB', 'CCC', 'AAA'])
        self.assertEqual(top[0]['tf'], 'D1')
        self.assertAlmostEqual(top[0]['pct'], 1.0)

    def test_liquidity_filter(self):
        self.assertIsNone(B.stock_mover('THIN', bars(25, 1.0, last=(100, 103, 98, 101), vol=1000), []))
        self.assertIsNone(B.stock_mover('PENNY', bars(25, 0.1, last=(2, 2.3, 1.9, 2.2), base=2.0, vol=1e9), []))

    def test_fx_overnight_h4_wins(self):
        d1 = bars(25, 1.0, last=(100, 100.6, 99.6, 100.2))       # 1.0x
        h4 = bars(25, 0.5, last=(100, 101, 99.5, 99.6))          # 3.0x, overnight
        utc = [f'2026-10-27T{(k % 6) * 4:02d}:00:00Z' for k in range(25)] + ['2026-10-28T21:00:00Z']
        m = B.fx_mover('GBPJPY', d1, h4, utc, dt.datetime(2026, 10, 28, 21, tzinfo=UTC), [])
        self.assertEqual(m['tf'], 'H4')
        self.assertAlmostEqual(m['ratio'], 3.0)
        self.assertIn('4H overnight', B.mover_line(m))

    def test_fx_d1_with_h4_note(self):
        d1 = bars(25, 1.0, last=(100, 102, 99, 99.2))            # 3.0x
        h4 = bars(25, 0.5, last=(99, 99.9, 99.0, 99.1))          # TR 100-99 = 2.0x
        utc = ['2026-10-27T00:00:00Z'] * 25 + ['2026-10-28T21:00:00Z']
        m = B.fx_mover('XAUUSD', d1, h4, utc, dt.datetime(2026, 10, 28, 21, tzinfo=UTC), [])
        self.assertEqual((m['tf'], m['note']), ('D1', '4H overnight 2.0×'))


class Zones(unittest.TestCase):
    Z = [{'tf': 'W1', 'side': 'demand', 'prox': 100.0, 'dist': 98.0}, {'tf': 'D1', 'side': 'supply', 'prox': 105, 'dist': 107},
         {'tf': 'MN', 'side': 'demand', 'prox': 99.5, 'dist': 97.0}]

    def test_closed_in_prefers_higher_tf(self):
        self.assertEqual(B.zone_context(Bar('d', 101, 102, 98.5, 99.0), self.Z), 'closed in MN demand')

    def test_broke_through(self):
        self.assertEqual(B.zone_context(Bar('d', 104, 108, 103.5, 107.5), self.Z), 'broke through D1 supply')

    def test_rejected(self):
        self.assertEqual(B.zone_context(Bar('d', 104, 106, 103.5, 104.2), self.Z), 'rejected at D1 supply')

    def test_bounced(self):
        self.assertEqual(B.zone_context(Bar('d', 101, 101.5, 99.8, 101.2), self.Z[:2]), 'bounced off W1 demand')

    def test_untouched(self):
        self.assertEqual(B.zone_context(Bar('d', 102, 103, 101, 102.5), self.Z), '')


DAY = dt.date(2026, 10, 29)


def plan():
    return {'n': 63, 'planFor': '2026-10-29', 'title': 'Daily plan for Thu, Oct 29',
            'summary': 'The dollar <b>moved</b> off the 4H supply & confirms the weekly supply; next sign is a break. More text.'}


class Messages(unittest.TestCase):
    def movers(self, n, sym='A<B>&C'):
        return [{'sym': f'{sym}{k}', 'tf': 'D1', 'ratio': 3 - k * 0.1, 'pct': -1.2, 'zone': 'closed in W1 demand',
                 'note': '', 'tv': 'https://www.tradingview.com/chart/?symbol=X'} for k in range(n)]

    def test_escaped_and_short(self):
        evs = [{'at': dt.datetime(2026, 10, 29, 12, 30, tzinfo=UTC), 'title': 'GDP <QoQ> & more', 'country': 'US'}] * 9
        m = B.build_brief(DAY, self.movers(5), self.movers(5), evs, plan(), callbacks=True)
        self.assertLess(B.SN.u16(m), 4096)
        self.assertIn('A&lt;B&gt;&amp;C0', m)
        self.assertIn('GDP &lt;QoQ&gt; &amp; more', m)
        self.assertIn('&lt;b&gt;moved&lt;/b&gt;', m)
        self.assertNotIn('<QoQ>', m)
        self.assertTrue(m.startswith('☀️ <b>Morning brief · Thu 29 Oct</b>'))
        self.assertIn('+3 more', m)
        tags = re.findall(r'</?([a-z]+)[^>]*>', m)
        self.assertTrue(set(tags) <= {'b', 'i'}, tags)
        self.assertEqual(m.count('<b>'), m.count('</b>'))
        cbs = [b['callback_data'] for r in m.buttons for b in r if 'callback_data' in b]
        self.assertEqual(cbs[:2], ['c:A<B>&C0', 'c:A<B>&C1'])
        urls = [b['url'] for r in m.buttons for b in r if 'url' in b]
        self.assertIn('https://raman-fx.vercel.app/learn?src=daily&l=63', urls)
        self.assertIn(B.SN.FULL_LIST, urls)

    def test_tv_buttons_without_chart_handler(self):
        m = B.build_brief(DAY, self.movers(3, 'EURUSD'), [], [], None, callbacks=False)
        self.assertTrue(all('url' in b for r in m.buttons for b in r))

    def test_huge_input_still_fits(self):
        mv = self.movers(5, 'X' * 900)
        m = B.build_brief(DAY, mv, mv, [], plan(), sample=True)
        self.assertLessEqual(B.SN.u16(m), B.SN.SAFE)
        self.assertTrue(m.startswith('🧪 <b>Sample</b>'))

    def test_window_line_is_local(self):
        self.assertEqual(B.window_line(DAY), 'Busy window 6:30-10:00 (US data 6:30) · NYSE opens 7:30')

    def test_lesson_message(self):
        e = {'key': 'raja:3', 'src': 'raja', 'n': 3, 'mentor': 'Raja', 'title': 'Curve <and> location',
             'points': ['Rule one & two', 'Rule <b>three</b>', 'r4', 'r5'], 'summary': ''}
        m = B.build_lesson(e, sample=True)
        lines = m.split('\n')
        self.assertTrue(4 <= len(lines) <= 6)
        self.assertIn('Curve &lt;and&gt; location', m)
        self.assertIn('Rule &lt;b&gt;three&lt;/b&gt;', m)
        self.assertLess(B.SN.u16(m), 4096)
        self.assertEqual(m.buttons, [[{'text': 'Open lesson', 'url': 'https://raman-fx.vercel.app/learn?src=raja&l=3'}]])
        c = B.build_lesson(dict(e, src='course', key='course:3'))
        self.assertEqual(c.buttons[0][0]['url'], 'https://raman-fx.vercel.app/learn?l=3')


class Rotation(unittest.TestCase):
    POOL = [{'key': f'{s}:{n}', 'src': s, 'n': n, 'title': f'{s} {n}'} for s, k in
            (('raja', 3), ('course', 2), ('seiden', 5), ('baker', 1), ('zoom', 2)) for n in range(1, k + 1)]

    def test_no_repeats_then_cycle(self):
        st, seen = {}, []
        for k in range(len(self.POOL)):
            e = B.next_lesson(self.POOL, st)
            B.mark_used(st, e, DAY + dt.timedelta(days=k))
            seen.append(e['key'])
        self.assertEqual(len(set(seen)), len(self.POOL))
        self.assertEqual(seen[:5], ['raja:1', 'course:1', 'seiden:1', 'baker:1', 'zoom:1'])
        e = B.next_lesson(self.POOL, st)
        self.assertEqual((e['key'], st['cycle'], st['used']), ('raja:1', 2, []))

    def test_deterministic_and_new_lessons_join(self):
        a = [e['key'] for e in B.rotation(self.POOL)]
        self.assertEqual(a, [e['key'] for e in B.rotation(list(reversed(self.POOL)))])
        st = {'used': a[:4]}
        pool = self.POOL + [{'key': 'baker:2', 'src': 'baker', 'n': 2, 'title': 'b2'}]
        self.assertNotIn(B.next_lesson(pool, st)['key'], a[:4])


class Schedule(unittest.TestCase):
    def at(self, day, hh, mm):
        return dt.datetime.combine(day, dt.time(hh, mm), B.LOCAL).astimezone(UTC)

    def test_window(self):
        d = DAY
        self.assertEqual(B.decide(self.at(d, 5, 50), {})[0], 'early')
        self.assertEqual(B.decide(self.at(d, 5, 56), {})[0], 'send')
        self.assertEqual(B.decide(self.at(d, 6, 44), {})[0], 'send')
        self.assertEqual(B.decide(self.at(d, 6, 46), {})[0], 'late')
        self.assertEqual(B.decide(self.at(d, 7, 31), {})[0], 'late')
        self.assertEqual(B.decide(self.at(d, 6, 10), {'2026-10-29': 'x'})[0], 'sent')
        self.assertEqual(B.decide(self.at(dt.date(2026, 10, 31), 6, 5), {})[0], 'weekend')
        self.assertEqual(B.decide(self.at(dt.date(2026, 11, 26), 6, 5), {})[0], 'holiday')   # Thanksgiving

    def test_local_time_from_zone_rules(self):
        # summer 2026: MDT, UTC-6
        self.assertEqual(B.local_at(DAY, (6, 0)).astimezone(UTC).hour, 12)
        self.assertEqual(B.decide(dt.datetime(2026, 10, 29, 12, 20, tzinfo=UTC), {})[0], 'send')
        # winter 2025 (old rules, before the change): MST, UTC-7
        self.assertEqual(B.local_at(dt.date(2025, 12, 15), (6, 0)).utcoffset(), dt.timedelta(hours=-7))
        w = B.local_at(dt.date(2026, 11, 2), (6, 0)).utcoffset()
        if tzver() >= '2026c':
            self.assertEqual(w, dt.timedelta(hours=-6))          # permanent UTC-6 from 2026-11-01
            self.assertEqual(B.local_at(dt.date(2027, 1, 15), (6, 0)).utcoffset(), dt.timedelta(hours=-6))
            # US winter: 8:30 ET (UTC-5) = 7:30 AM Calgary
            self.assertEqual(B.window_line(dt.date(2026, 11, 3)), 'Busy window 7:30-11:00 (US data 7:30) · NYSE opens 8:30')
        else:
            self.assertIn(w, (dt.timedelta(hours=-6), dt.timedelta(hours=-7)))

    def test_cron_covers_both_offsets(self):
        with open(os.path.join(B.ROOT, '.github', 'workflows', 'briefing.yml')) as f:
            crons = re.findall(r"cron:\s*'([^']+)'", f.read())
        slots = set()
        for c in crons:
            mins, hrs = c.split()[:2]
            for h in hrs.split(','):
                for m in mins.split(','):
                    slots.add(int(h) * 60 + int(m))
        for off in (6, 7):                                       # UTC-6 and UTC-7
            target = (6 + off) * 60
            ok = [s for s in slots if target - 5 <= s <= target + 45]
            self.assertGreaterEqual(len(ok), 3, f'UTC-{off}: {sorted(slots)}')


class SyntheticUsdx(unittest.TestCase):
    def fake(self, name):
        import fxscan as X
        base = {'EUR_USD': 1.10, 'USD_JPY': 150.0, 'GBP_USD': 1.30, 'USD_CAD': 1.38, 'USD_SEK': 10.5, 'USD_CHF': 0.88}[name]
        d = [(f'2026-10-{k + 1:02d}T00:00', Bar(f'2026-10-{k + 1:02d}T00:00', base, base * 1.004, base * 0.996, base * (1 + k / 1000)),
              None, f'2026-10-{k + 1:02d}T21:00:00Z') for k in range(25)]
        h = [(f'2026-10-25T{4 * k:02d}:00', Bar(f'2026-10-25T{4 * k:02d}:00', base, base * 1.001, base * 0.999, base), None,
              f'2026-10-25T{4 * k + 1:02d}:00:00Z') for k in range(6)]
        return d, h

    def test_built_from_parts(self):
        d, h = B.synthetic('USDX', self.fake)
        self.assertEqual(len(d), 25)
        self.assertEqual(len(h), 6)
        self.assertTrue(80 < d[-1][1].c < 120)                   # a dollar-index level
        self.assertEqual(d[-1][3], '2026-10-25T21:00:00Z')

    def test_missing_part_raises(self):
        def broken(name):
            if name == 'USD_SEK':
                raise OSError('HTTP 404')
            return self.fake(name)
        with self.assertRaises(OSError):
            B.synthetic('USDX', broken)


class Calendar(unittest.TestCase):
    TV = ('{"status":"ok","result":['
          '{"title":"GDP Growth Rate QoQ","country":"US","importance":1,"date":"2026-10-29T12:30:00.000Z"},'
          '{"title":"Minor thing","country":"US","importance":0,"date":"2026-10-29T13:00:00.000Z"},'
          '{"title":"ECB Interest Rate Decision","country":"EU","importance":1,"date":"2026-10-29T12:15:00.000Z"},'
          '{"title":"Tomorrow","country":"JP","importance":1,"date":"2026-10-30T07:00:00.000Z"}]}')

    def test_parse_and_lines(self):
        evs = B.parse_tv_calendar(self.TV, DAY)
        self.assertEqual([e['title'] for e in evs], ['ECB Interest Rate Decision', 'GDP Growth Rate QoQ'])
        self.assertEqual(B.event_lines(evs), ['6:15 AM · EU ECB Interest Rate Decision', '6:30 AM · US GDP Growth Rate QoQ'])
        self.assertEqual(B.parse_tv_calendar('<html>', DAY), [])

    def test_merge_reminder_kinds(self):
        evs = B.parse_tv_calendar(self.TV, DAY)
        nfp = {'at': dt.datetime(2026, 10, 29, 12, 30, tzinfo=UTC), 'title': 'Jobs report (NFP)', 'country': 'US'}
        fomc = {'at': dt.datetime(2026, 10, 29, 18, 0, tzinfo=UTC), 'title': 'Fed decision (FOMC)', 'country': 'US'}
        out = B.merge_events(evs, [nfp, fomc])
        self.assertEqual([e['title'] for e in out], ['ECB Interest Rate Decision', 'GDP Growth Rate QoQ', 'Fed decision (FOMC)'])

    def test_norm_news_row(self):
        e = B._norm_event({'time_utc': '2026-10-29T12:30:00Z', 'country': 'US', 'title': 'CPI', 'importance': 'high'})
        self.assertEqual((e['title'], e['at'].hour), ('CPI', 12))
        self.assertIsNone(B._norm_event({'time_utc': '2026-10-29T12:30:00Z', 'title': 'x', 'importance': 'low'}))


class KevinPlan(unittest.TestCase):
    TS = '''export const KD: KevinDailyLesson[] = [
  {
    n: 63, kind: 'zoom', planFor: "2026-10-29", recorded: "2026-10-28_1656",
    title: "Daily plan for Thu, Oct 29",
    summary: "The dollar gave the \\"move\\" he predicted off the 4H supply. Then more.",
    sections: [] },
  {
    n: 62, kind: 'zoom', planFor: "2026-10-28", recorded: "2026-10-27_1700",
    title: "Daily plan for Wed, Oct 28",
    summary: "Older plan.",
  }];'''

    def test_ts_fallback_and_pick(self):
        rows = B.parse_daily_ts(self.TS)
        self.assertEqual([r['n'] for r in rows], [63, 62])
        self.assertEqual(B.pick_plan(rows, DAY)['n'], 63)
        self.assertEqual(B.pick_plan(rows, dt.date(2026, 10, 30))['n'], 63)
        self.assertEqual(B.pick_plan(rows, dt.date(2026, 10, 28))['n'], 62)
        self.assertEqual(B.first_sentence(rows[0]['summary']), 'The dollar gave the "move" he predicted off the 4H supply.')

    def test_real_file_parses(self):
        p = os.path.join(B.ROOT, 'src', 'core', 'mentors', 'kevin', 'daily', '2026-10.ts')
        if os.path.exists(p):
            with open(p, encoding='utf-8') as f:
                self.assertGreater(len(B.parse_daily_ts(f.read())), 5)


if __name__ == '__main__':
    unittest.main()
