"""Calm Telegram reminders before the big US event times (docs/research/Market_Hours.md), on the owner's Calgary clock.

    ⏰ <b>Jobs report today · 6:30 AM</b>                   <- NFP / CPI days: sent 45 min before 8:30 ET
    Big moves likely on forex, gold and US indices.
    Plan before 6:30, not during the first minutes.
    [Open scanner]

    ⏰ <b>Fed decision today · 12:00 PM, press conference 12:30 PM</b>   <- FOMC days: sent 30 min before 14:00 ET

    ☀️ <b>Main window 6:30-10:00 today</b>                 <- optional weekday nudge 20 min before 8:30 ET
                                                          (REMINDER_DAILY, default off)

All times are computed from the US Eastern release time into Calgary time with the IANA tz database, so they follow
both DST systems. NOTE: tzdata 2026c+ has Alberta on permanent UTC-6 from 2026-11-01, so in the US winter 8:30 ET is
7:30 AM Calgary (sent 6:45) and 14:00 ET is 1:00 PM (the workflow installs the current tzdata from PyPI).
Run by .github/workflows/reminders.yml on a UTC cron that covers both Calgary DST states; this script decides by the
Calgary local time. A reminder is sent once (tools/reminders/state.json), from its send time up to 40 minutes late
(GitHub cron delays), and never once its event has started.

Event dates: the official schedules (federalreserve.gov FOMC calendar, bls.gov Employment Situation and CPI release
schedules) are fetched at most every REFRESH_DAYS and cached in tools/reminders/events.json; a failed fetch keeps the
last good list; with no cached list a kind falls back to FALLBACK below (from memory, NOT verified). Fetched pages are
data only: dates are pulled out with regular expressions, nothing in them is followed or executed.

    python tools/reminders/reminders.py              # the scheduled run: refresh if stale, send what is due
    python tools/reminders/reminders.py --test       # send ONE '🧪 Reminder test' preview of the next reminder
    python tools/reminders/reminders.py --list       # print the upcoming reminders (no sending)
    python tools/reminders/reminders.py --refresh    # force a schedule fetch

Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (unset -> printed instead), REMINDER_DAILY (on/off, default off),
REMINDER_NOW (ISO UTC time, for dry runs), REMINDER_CONTACT (an email for the fetch User-Agent;
bls.gov may refuse anonymous automated requests), SCANNER_APP_URL.
"""
from __future__ import annotations

import argparse
import datetime as dt
import html as htmllib
import json
import os
import re
import sys
import urllib.error
import urllib.request
from typing import Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'stock_scanner'))
import notify as SN  # noqa: E402  (esc, Msg, keyboard, send, CLOCK - the scanner message style)

EVENTS_PATH = os.path.join(HERE, 'events.json')
STATE_PATH = os.path.join(HERE, 'state.json')
LOCAL = ZoneInfo(SN.LOCAL_TZ)            # America/Edmonton (Calgary)
ET = ZoneInfo('America/New_York')
UTC = dt.timezone.utc
REFRESH_DAYS = 3
LATE = dt.timedelta(minutes=40)          # send up to 40 min after the send time (cron delays), never after the event
KEEP_DAYS = 45                           # sent-state and past events older than this are pruned

URLS = {'fomc': 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
        'nfp': 'https://www.bls.gov/schedule/news_release/empsit.htm',
        'cpi': 'https://www.bls.gov/schedule/news_release/cpi.htm'}
ICS = 'https://www.bls.gov/schedule/news_release/bls.ics'   # BLS's own release calendar: tried when a page fails
TITLE = {'nfp': 'Employment Situation', 'cpi': 'Consumer Price Index'}
ET_TIME = {'nfp': '08:30', 'cpi': '08:30', 'fomc': '14:00'}        # release / statement time, US Eastern
LEAD = {'morning': dt.timedelta(minutes=45), 'fomc': dt.timedelta(minutes=30)}   # 6:30 -> 5:45, 12:00 -> 11:30
DAILY_LEAD = dt.timedelta(minutes=20)    # 8:30 ET - 20 min (6:10 AM Calgary when Calgary is ET-2)
DAILY_WINDOW = ('08:30', '12:00')        # ET: US data 8:30 ET (6:30 Calgary) to midday ET (10:00 Calgary)

# UNVERIFIED fallback, from memory of the published 2026 schedules (could not be checked against the official pages
# when written, 2026-10-29). Used only for a kind with no fetched / cached dates. 2027 is left out on purpose: the
# fetch has to supply it (the run warns when a kind has nothing in the next 45 days).
FALLBACK = {
    'nfp': ['2026-11-06', '2026-12-04'],
    'cpi': ['2026-11-10', '2026-12-10'],
    'fomc': ['2026-12-09'],
}

MONTHS = {m: i + 1 for i, m in enumerate(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
                                           'september', 'october', 'november', 'december'])}
MON3 = {k[:3]: v for k, v in MONTHS.items()}


# ---- parsing (pure, offline-testable) ----------------------------------------------------------------------------------
def page_lines(page: str) -> List[str]:
    """HTML -> visible text lines (tags become line breaks, entities decoded, blanks dropped)."""
    page = re.sub(r'(?is)<(script|style|noscript)\b.*?</\1>', ' ', page)
    page = re.sub(r'(?s)<!--.*?-->', ' ', page)
    text = htmllib.unescape(re.sub(r'<[^>]+>', '\n', page)).replace('\xa0', ' ')
    return [ln for ln in (re.sub(r'\s+', ' ', x).strip() for x in text.split('\n')) if ln]


def _month(word: str) -> Optional[int]:
    w = word.strip().strip('.').lower()
    return MONTHS.get(w) or MON3.get(w) or (9 if w == 'sept' else None)


def parse_fomc(page: str) -> List[str]:
    """Fed FOMC calendar page -> decision days (the 2nd day of each scheduled 2-day meeting), ISO, sorted.
    Layout: a '2026 FOMC Meetings' heading, then per meeting a month line ('January', 'Apr/May') and a day line
    ('27-28', '16-17*', '30-1'). Single-day items (unscheduled calls, notation votes) are skipped."""
    year, out = None, set()
    lines = page_lines(page)
    for i, ln in enumerate(lines):
        m = re.match(r'^(\d{4}) FOMC Meetings$', ln, re.I)
        if m:
            year = int(m.group(1))
            continue
        if year is None or i + 1 >= len(lines):
            continue
        mm = re.match(r'^([A-Za-z]{3,9})(?:\.?\s*/\s*([A-Za-z]{3,9}))?\.?$', ln)
        dd = re.match(r'^(\d{1,2})\s*[-–]\s*(\d{1,2})\s*\*?$', lines[i + 1])
        if not (mm and dd):
            continue
        m1 = _month(mm.group(1))
        m2 = _month(mm.group(2)) if mm.group(2) else m1
        if not (m1 and m2):
            continue
        d1, d2 = int(dd.group(1)), int(dd.group(2))
        mon = m2 if (mm.group(2) or d2 >= d1) else None
        if mon is None:
            continue
        y = year + 1 if (m2 < m1) else year            # 'Dec/Jan' would roll over
        try:
            out.add(dt.date(y, mon, d2).isoformat())
        except ValueError:
            continue
    return sorted(out)


DATE_RE = re.compile(r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),\s+(\d{4})\b')
TIME_RE = re.compile(r'\b(\d{1,2}):(\d{2})\s*([AP])\.?\s?M\.?', re.I)


def parse_bls(page: str, title: str) -> List[Tuple[str, str]]:
    """BLS release-schedule page -> [(ISO release date, 'HH:MM' ET)], sorted. Each table row holds the reference month
    ('October 2026', no day), the release date ('Nov. 06, 2026') and the time ('08:30 AM'). `title` must appear in
    the page (an error / captcha page then parses as nothing)."""
    if title.lower() not in page.lower():
        return []
    rows = re.findall(r'(?is)<tr\b.*?</tr>', page) or [page]
    out = {}
    for row in rows:
        text = ' '.join(page_lines(row))
        dm = DATE_RE.search(text)
        if not dm:
            continue
        try:
            d = dt.date(int(dm.group(3)), MON3[dm.group(1)[:3].lower()], int(dm.group(2)))
        except ValueError:
            continue
        tm = TIME_RE.search(text[dm.end():]) or TIME_RE.search(text)
        hhmm = '08:30'
        if tm:
            h = int(tm.group(1)) % 12 + (12 if tm.group(3).upper() == 'P' else 0)
            hhmm = f'{h:02d}:{int(tm.group(2)):02d}'
        out[d.isoformat()] = hhmm
    return sorted(out.items())


def parse_ics(text: str, title: str) -> List[Tuple[str, str]]:
    """BLS release calendar (iCalendar) -> [(ISO date, 'HH:MM' ET)] of the events whose SUMMARY starts with `title`
    ('Employment Situation for October 2026'); 'Consumer Price Index' excludes other price indexes by the prefix."""
    text = re.sub(r'\r?\n[ \t]', '', text)                    # unfold continuation lines
    out = {}
    for ev in re.findall(r'(?s)BEGIN:VEVENT(.*?)END:VEVENT', text):
        sm = re.search(r'(?m)^SUMMARY[^:]*:(.*)$', ev)
        dm = re.search(r'(?m)^DTSTART[^:]*:(\d{8})(?:T(\d{2})(\d{2}))?', ev)
        if not (sm and dm) or not sm.group(1).strip().lower().startswith(title.lower() + ' for '):
            continue
        d = dm.group(1)
        out[f'{d[:4]}-{d[4:6]}-{d[6:]}'] = f'{dm.group(2)}:{dm.group(3)}' if dm.group(2) else '08:30'
    return sorted(out.items())


def plausible(kind: str, dates: List[str], today: dt.date) -> bool:
    """A sanity check on a parsed list: weekdays only, near today, a sensible count per year, something upcoming."""
    if not dates:
        return False
    ds = [dt.date.fromisoformat(x) for x in dates]
    if any(d.weekday() >= 5 or abs((d - today).days) > 800 for d in ds):
        return False
    per_year: Dict[int, int] = {}
    for d in ds:
        per_year[d.year] = per_year.get(d.year, 0) + 1
    cap = 10 if kind == 'fomc' else 14
    return max(per_year.values()) <= cap and any(d >= today for d in ds)


# ---- fetching + cache --------------------------------------------------------------------------------------------------
def user_agent() -> str:
    """An honest, identifying User-Agent (bls.gov asks automated clients for contact details: set the repo variable
    REMINDER_CONTACT to an email to add one)."""
    contact = (os.environ.get('REMINDER_CONTACT') or '').strip()
    return 'RamanFX-reminders/1.0 (+https://github.com/r4m4nxd/ramanFX' + (f'; {contact}' if contact else '') + ')'


def fetch(url: str, timeout: int = 25) -> str:
    req = urllib.request.Request(url, headers={
        'User-Agent': user_agent(),
        'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.8'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read(3_000_000).decode('utf-8', 'replace')


def parse_kind(kind: str, page: str) -> List[Dict]:
    if kind == 'fomc':
        return [{'date': d, 'et': ET_TIME['fomc']} for d in parse_fomc(page)]
    rows = parse_ics(page, TITLE[kind]) if 'BEGIN:VCALENDAR' in page[:2000] else parse_bls(page, TITLE[kind])
    return [{'date': d, 'et': t} for d, t in rows]


def _why(e: Exception) -> str:
    return f'HTTP {e.code}' if isinstance(e, urllib.error.HTTPError) else type(e).__name__


def load_json(path: str, default):
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def save_json(path: str, obj) -> None:
    with open(path, 'w') as f:
        json.dump(obj, f, indent=1, sort_keys=True, ensure_ascii=False)
        f.write('\n')


def empty_cache() -> Dict:
    return {'kinds': {k: {'events': [], 'source': None, 'fetched_at': None, 'tried_at': None, 'error': None}
                      for k in URLS}}


def refresh(cache: Dict, now: dt.datetime, force: bool = False, fetcher=fetch, log=print) -> bool:
    """Fetch each kind whose last attempt is older than REFRESH_DAYS (or all with force). A good parse replaces the
    cached list (past dates within KEEP_DAYS kept); a failed one keeps the last good list. True when anything changed."""
    changed = False
    today = now.astimezone(LOCAL).date()
    ics_page: Dict[str, object] = {}
    for kind, url in URLS.items():
        k = cache['kinds'].setdefault(kind, {'events': [], 'source': None, 'fetched_at': None, 'tried_at': None, 'error': None})
        tried = k.get('tried_at')
        if not force and tried and now - _ts(tried) < dt.timedelta(days=REFRESH_DAYS):
            continue
        k['tried_at'] = _iso(now)
        changed = True
        evs, errs = [], []
        for src in ([url] + ([ICS] if kind in TITLE else [])):
            try:
                if src == ICS:
                    if 'page' not in ics_page:
                        ics_page['page'] = fetcher(ICS)
                    page = ics_page['page']
                else:
                    page = fetcher(src)
                evs = parse_kind(kind, page)
            except Exception as e:  # noqa: BLE001
                if src == ICS:
                    ics_page['page'] = ''
                errs.append(f'{src.rsplit("/", 1)[-1]}: {_why(e)}')
                continue
            if evs:
                url = src
                break
            errs.append(f'{src.rsplit("/", 1)[-1]}: no dates parsed')
        if not evs and errs:
            k['error'] = 'fetch failed: ' + '; '.join(errs)
            log(f'{kind}: {k["error"]} - keeping {len(k["events"])} cached dates')
            continue
        lo, hi = (today - dt.timedelta(days=400)).isoformat(), (today + dt.timedelta(days=800)).isoformat()
        evs = [e for e in evs if lo <= e['date'] <= hi]          # the Fed page also lists past years
        if not plausible(kind, [e['date'] for e in evs], today):
            k['error'] = f'parse gave {len(evs)} dates (implausible)'
            log(f'{kind}: {k["error"]} - keeping {len(k["events"])} cached dates')
            continue
        cutoff = (today - dt.timedelta(days=KEEP_DAYS)).isoformat()
        old = {e['date']: e for e in k['events'] if e['date'] < min(e2['date'] for e2 in evs) and e['date'] >= cutoff}
        k['events'] = sorted(list(old.values()) + [dict(e, verified=True) for e in evs], key=lambda e: e['date'])
        k.update(source=url, fetched_at=_iso(now), error=None)
        diff = sorted(set(FALLBACK.get(kind, [])) - {e['date'] for e in evs})
        log(f'{kind}: {len(evs)} dates from {url}; next {[e["date"] for e in evs if e["date"] >= today.isoformat()][:3]}'
            + (f'; fallback dates NOT in the official list: {diff}' if diff else ''))
    return changed


def events(cache: Dict) -> Dict[str, List[Dict]]:
    """kind -> [{'date', 'et', 'verified'}]: the cached (fetched) list, else the unverified FALLBACK."""
    out = {}
    for kind in URLS:
        evs = ((cache.get('kinds') or {}).get(kind) or {}).get('events') or []
        out[kind] = evs or [{'date': d, 'et': ET_TIME[kind], 'verified': False} for d in FALLBACK.get(kind, [])]
    return out


# ---- reminders ---------------------------------------------------------------------------------------------------------
def at_et(day: str, hhmm: str) -> dt.datetime:
    h, m = map(int, hhmm.split(':'))
    return dt.datetime.fromisoformat(day).replace(hour=h, minute=m, tzinfo=ET).astimezone(LOCAL)


def clock(t: dt.datetime) -> str: return t.strftime(SN.CLOCK)          # '6:30 AM'
def short(t: dt.datetime) -> str: return t.strftime('%-I:%M')           # '6:30'


def nyse_holidays(year: int) -> set:
    """NYSE full-day holidays (rule-based): used only to skip the plain daily nudge."""
    def nth(month, wd, n):            # n-th weekday (n=-1: last)
        if n > 0:
            d = dt.date(year, month, 1)
            d += dt.timedelta(days=(wd - d.weekday()) % 7)
            return d + dt.timedelta(weeks=n - 1)
        d = dt.date(year, month + 1, 1) - dt.timedelta(days=1) if month < 12 else dt.date(year, 12, 31)
        return d - dt.timedelta(days=(d.weekday() - wd) % 7)

    def observed(d):
        return d - dt.timedelta(days=1) if d.weekday() == 5 else d + dt.timedelta(days=1) if d.weekday() == 6 else d
    a = year % 19; b, c = divmod(year, 100); d_, e = divmod(b, 4); f = (b + 8) // 25; g = (b - f + 1) // 3  # noqa: E702
    h = (19 * a + b - d_ - g + 15) % 30; i, k = divmod(c, 4); l_ = (32 + 2 * e + 2 * i - h - k) % 7  # noqa: E702
    m = (a + 11 * h + 22 * l_) // 451; mon = (h + l_ - 7 * m + 114) // 31; day = (h + l_ - 7 * m + 114) % 31 + 1  # noqa: E702
    out = {nth(1, 0, 3), nth(2, 0, 3), dt.date(year, mon, day) - dt.timedelta(days=2), nth(5, 0, -1),
           observed(dt.date(year, 6, 19)), observed(dt.date(year, 7, 4)), nth(9, 0, 1), nth(11, 3, 4),
           observed(dt.date(year, 12, 25))}
    ny = dt.date(year, 1, 1)
    if ny.weekday() != 5:              # a Saturday New Year's Day is not observed on the Friday before
        out.add(observed(ny))
    return out


LINE_MOVES = 'Big moves likely on forex, gold and US indices.'


def build(kinds: List[str], day: str, et_time: str) -> SN.Msg:
    t = at_et(day, et_time)
    if kinds == ['fomc']:
        pc = t + dt.timedelta(minutes=30)
        head = f'⏰ <b>Fed decision today · {clock(t)}, press conference {clock(pc)}</b>'
        lines = [head, LINE_MOVES, f'The press conference at {short(pc)} usually moves most. Plan before {short(t)}.']
    else:
        name = ' + '.join({'nfp': 'Jobs report', 'cpi': 'US inflation (CPI)'}[k] for k in kinds)
        lines = [f'⏰ <b>{SN.esc(name)} today · {clock(t)}</b>', LINE_MOVES,
                 f'Plan before {short(t)}, not during the first minutes.']
    return SN.Msg('\n'.join(lines), SN.keyboard([], 'Open scanner', SN.FULL_LIST))


def build_daily(day: str) -> SN.Msg:
    a, b = (at_et(day, x) for x in DAILY_WINDOW)
    open_ = at_et(day, '09:30')
    lines = [f'☀️ <b>Main window {short(a)}-{short(b)} today</b>',
             f'US data {short(a)} · NYSE opens {short(open_)} · forex and gold busiest around {short(a + dt.timedelta(minutes=90))}.']
    return SN.Msg('\n'.join(lines), SN.keyboard([], 'Open scanner', SN.FULL_LIST))


def schedule(evs: Dict[str, List[Dict]], start: dt.date, end: dt.date, daily: bool = False) -> List[Dict]:
    """The reminders with an event day in [start, end]: {'id', 'send_at', 'deadline', 'event_at', 'msg', 'verified'},
    sorted by send time. Morning events (NFP, CPI) on one day share one message."""
    out = []
    morning: Dict[str, List[Tuple[str, Dict]]] = {}
    for kind in ('nfp', 'cpi'):
        for e in evs.get(kind, []):
            if start.isoformat() <= e['date'] <= end.isoformat():
                morning.setdefault(e['date'], []).append((kind, e))
    for day, items in morning.items():
        et_time = min(e.get('et') or '08:30' for _, e in items)
        t = at_et(day, et_time)
        send_at = t - LEAD['morning']
        out.append({'id': f'{day}:morning', 'send_at': send_at, 'deadline': min(send_at + LATE, t), 'event_at': t,
                    'msg': build([k for k, _ in items], day, et_time),
                    'verified': all(e.get('verified') for _, e in items), 'kinds': [k for k, _ in items]})
    for e in evs.get('fomc', []):
        if start.isoformat() <= e['date'] <= end.isoformat():
            t = at_et(e['date'], e.get('et') or '14:00')
            send_at = t - LEAD['fomc']
            out.append({'id': f'{e["date"]}:fomc', 'send_at': send_at, 'deadline': min(send_at + LATE, t), 'event_at': t,
                        'msg': build(['fomc'], e['date'], e.get('et') or '14:00'), 'verified': bool(e.get('verified')),
                        'kinds': ['fomc']})
    if daily:
        d = start
        while d <= end:
            if d.weekday() < 5 and d.isoformat() not in morning and d not in nyse_holidays(d.year):
                send_at = at_et(d.isoformat(), DAILY_WINDOW[0]) - DAILY_LEAD
                out.append({'id': f'{d.isoformat()}:daily', 'send_at': send_at, 'deadline': send_at + LATE,
                            'event_at': send_at + LATE, 'msg': build_daily(d.isoformat()), 'verified': True,
                            'kinds': ['daily']})
            d += dt.timedelta(days=1)
    return sorted(out, key=lambda r: r['send_at'])


def due(rems: List[Dict], now: dt.datetime, sent: Dict[str, str]) -> Tuple[List[Dict], List[Dict]]:
    """(to send now, missed): a reminder is due from its send time up to its deadline (40 min late, never past the
    event); one that is not yet sent and past its deadline is reported as missed."""
    now = now.astimezone(LOCAL)
    go = [r for r in rems if r['id'] not in sent and r['send_at'] <= now < r['deadline']]
    missed = [r for r in rems if r['id'] not in sent and r['deadline'] <= now and now - r['deadline'] < dt.timedelta(hours=12)]
    return go, missed


def prune(sent: Dict[str, str], today: dt.date) -> Dict[str, str]:
    cut = (today - dt.timedelta(days=KEEP_DAYS)).isoformat()
    return {k: v for k, v in sent.items() if k[:10] >= cut}


def _iso(t: dt.datetime) -> str: return t.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')
def _ts(s: str) -> dt.datetime: return dt.datetime.strptime(s[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)


def truthy(v: Optional[str]) -> bool: return (v or '').strip().lower() in ('1', 'on', 'true', 'yes', 'y')


def describe(r: Dict) -> str:
    s = r['send_at']
    return (f"{r['id']:<18} send {s.strftime('%a %d %b %Y')} {clock(s)} Calgary ({_iso(s)})"
            + ('' if r['verified'] else '  [UNVERIFIED fallback date]'))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--test', action='store_true', help="send one '🧪 Reminder test' preview of the next reminder")
    ap.add_argument('--list', action='store_true', help='print the upcoming reminders, send nothing')
    ap.add_argument('--refresh', action='store_true', help='fetch the official schedules now')
    ap.add_argument('--no-fetch', action='store_true', help='never fetch (offline)')
    a = ap.parse_args(argv)

    now = _ts(os.environ['REMINDER_NOW']) if os.environ.get('REMINDER_NOW') else dt.datetime.now(UTC)
    today = now.astimezone(LOCAL).date()
    cache = load_json(EVENTS_PATH, None) or empty_cache()
    if not a.no_fetch:
        refresh(cache, now, force=a.refresh)
        save_json(EVENTS_PATH, cache)
    evs = events(cache)
    try:
        import tzdata
        tzv = 'tzdata ' + tzdata.IANA_VERSION
    except Exception:  # noqa: BLE001
        tzv = 'system tz'
    probe = at_et(today.isoformat(), '08:30')
    print(f'{tzv}: 8:30 ET today = {clock(probe)} Calgary (UTC{probe.utcoffset().total_seconds() / 3600:+.0f})')
    for kind in URLS:
        k = cache['kinds'].get(kind) or {}
        nxt = [e['date'] for e in evs[kind] if e['date'] >= today.isoformat()]
        src = 'fetched ' + (k.get('fetched_at') or '')[:10] if k.get('events') else 'UNVERIFIED fallback'
        print(f'{kind}: {src}; next {nxt[:3]}' + (f"; last error: {k['error']}" if k.get('error') else ''))
        if not any(x <= (today + dt.timedelta(days=45)).isoformat() for x in nxt):
            print(f'::warning::reminders: no {kind} date in the next 45 days (schedule fetch failing?)')

    daily = truthy(os.environ.get('REMINDER_DAILY'))
    rems = schedule(evs, today, today + dt.timedelta(days=400), daily)

    if a.list or a.test:
        for r in rems[:12]:
            print(describe(r))
    if a.list:
        return 0
    if a.test:
        nxt = next((r for r in rems if r['kinds'] != ['daily'] and r['send_at'] > now.astimezone(LOCAL)), None)
        if not nxt:
            print('no upcoming event reminder to preview')
            return 1
        s = nxt['send_at']
        head = (f"🧪 <b>Reminder test</b> · this is how it will look on {s.strftime('%a %-d %b')}, sent ~{clock(s)}"
                + ('' if nxt['verified'] else ' (date not yet verified)'))
        msg = SN.Msg(head + '\n\n' + str(nxt['msg']), nxt['msg'].buttons)
        ok = SN.send([msg])
        print('test reminder', 'sent' if ok else 'NOT sent')
        return 0 if ok else 1

    state = load_json(STATE_PATH, {'sent': {}})
    sent = state.setdefault('sent', {})
    go, missed = due(rems, now, sent)
    for r in missed:
        print(f'missed (cron too late, event passed or window closed): {r["id"]}')
    for r in go:
        print('due:', describe(r))
        if SN.send([r['msg']]):
            sent[r['id']] = _iso(now)
            print('sent', r['id'])
        else:
            print('NOT sent', r['id'], '(will retry next tick while in the window)')
    state['sent'] = prune(sent, today)
    save_json(STATE_PATH, state)
    if not go:
        nxt = next((r for r in rems if r['send_at'] > now.astimezone(LOCAL)), None)
        print('nothing due now' + (f'; next: {describe(nxt)}' if nxt else ''))
    return 0


if __name__ == '__main__':
    sys.exit(main())
