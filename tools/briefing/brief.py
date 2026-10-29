"""6 AM Telegram morning brief + lesson of the day for the owner (Calgary clock, America/Edmonton).

    ☀️ <b>Morning brief · Thu 29 Oct</b>

    <b>Big candles · forex, metals, indices</b>
    XAUUSD D1 · 2.8× normal range · down 1.9% · closed in D1 demand
    GBPJPY 4H overnight · 2.3× normal range · up 0.6%
    ...
    <b>Big candles · stocks</b>
    NVDA D1 · 3.1× normal range · up 4.2% · broke through W1 supply
    ...
    <b>Today</b>
    6:30 AM · US GDP Growth Rate QoQ
    Busy window 6:30-10:00 · NYSE opens 7:30
    <b>Kevin's plan</b> · Thu 29 Oct
    The dollar gave the move he predicted off the 4H supply ...
    [📊 XAUUSD] [📊 GBPJPY] [📊 NVDA]  [Kevin's plan] [Open scanner]

    📘 <b>Lesson of the day</b> · Raja · Lesson 3        <- second message, right after the brief
    <b>Strong zones: ...</b>
    • rule 1 / • rule 2 / • rule 3
    [Open lesson]

Big candles: every FX scanner instrument (public/fx/d/*.json, OANDA bid candles) and every scanner stock
(public/scanner/index.json, Alpaca daily bars, min liquidity) ranked by the candle's true range / the mean true range of
the 20 bars before it (ATR 20). D1 = the last complete daily candle (FX: closes 17:00 New York; stocks: the last
session); FX also checks the overnight 4H candles since that close. The zone note says whether the candle closed in /
broke through / was rejected at a zone of the last published scan (FX: public/fx/d, stocks: public/scanner/t shards).

Today: the high-impact events of the day in Calgary time (tools/news/calendar.py when present, else TradingView's
public calendar JSON like tools/reminders/reminders.py fetch_tv, plus the cached NFP / CPI / FOMC dates of
tools/reminders/events.json) and the busy window (US data 8:30 ET to midday ET, converted with the tz database, so
it follows Alberta's permanent UTC-6 from 2026-11-01 in tzdata 2026c+).

Lessons: tools/briefing/.cache/lessons.json is exported from src/core/mentors/** by export_lessons.ts (esbuild);
the rotation interleaves the mentors and never repeats a lesson until all are used (state.json 'lessons').

Schedule (.github/workflows/briefing.yml): several UTC cron slots per weekday; this script sends once per day
(state.json 'sent'), from 5:55 up to 45 min after 6:00 AM Calgary and never after 7:30 AM; weekends and NYSE
holidays are skipped.

    python tools/briefing/brief.py               # the scheduled run
    python tools/briefing/brief.py --test        # ONE '🧪 Sample' brief + lesson now (state untouched)
    python tools/briefing/brief.py --dry         # build and print, never send (no state change)

Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (unset -> printed), OANDA_API_TOKEN (+ OANDA_ENV), ALPACA_KEY_ID /
ALPACA_SECRET_KEY, BRIEF_NOW (ISO UTC, dry runs), BRIEF_APP_URL. Secrets are never printed.
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import os
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Iterable, List, Optional, Sequence, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
for _p in (os.path.join(ROOT, 'tools', 'stock_scanner'), os.path.join(ROOT, 'tools', 'fx_scanner'),
           os.path.join(ROOT, 'tools', 'reminders')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import notify as SN  # noqa: E402  (esc, Msg, button, send, CLOCK, u16: the scanner message style)
import reminders as R  # noqa: E402  (nyse_holidays, at_et, events cache, user_agent)

UTC = dt.timezone.utc
LOCAL = ZoneInfo(SN.LOCAL_TZ)                     # America/Edmonton (Calgary)
ET = ZoneInfo('America/New_York')
STATE_PATH = os.path.join(HERE, 'state.json')
CACHE = os.path.join(HERE, '.cache')
LESSONS_PATH = os.path.join(CACHE, 'lessons.json')
APP = (os.environ.get('BRIEF_APP_URL') or 'https://raman-fx.vercel.app').rstrip('/')
CHART_TS = os.path.join(ROOT, 'supabase', 'functions', 'telegram-bot', 'chart.ts')   # the bot's chart handler
TV_CHART = 'https://www.tradingview.com/chart/?symbol='

SEND_AT = (6, 0)                                  # 6:00 AM Calgary
EARLY = dt.timedelta(minutes=5)
LATE = dt.timedelta(minutes=45)
HARD_STOP = (7, 30)                               # never after 7:30 AM Calgary
KEEP_DAYS = 45

ATR_N = 20
TOP_FX = 4
TOP_STOCKS = 4
MIN_PRICE = 5.0
MIN_DOLLAR_VOL = 20e6                             # 20-day average dollar volume
H4_NOTE = 1.5                                     # an overnight 4H candle this big is mentioned on the D1 line
TF_ORDER = ['6M', '3M', 'MN', 'W1', 'D1', 'H4', 'H1']
CAL_COUNTRIES = 'US,EU,GB,CA,JP,AU,NZ,CH,CN,DE'
MAX_EVENTS = 6
MENTOR_ORDER = ['raja', 'course', 'seiden', 'baker', 'zoom']   # round-robin order of the lesson rotation


def tfs(tf: str) -> str: return SN.TF_SHORT.get(tf, tf)       # 'H4' -> '4H' (the scanner messages' labels)
def clock(t: dt.datetime) -> str: return t.astimezone(LOCAL).strftime(SN.CLOCK)
def short(t: dt.datetime) -> str: return t.astimezone(LOCAL).strftime('%-I:%M')
def _iso(t: dt.datetime) -> str: return t.astimezone(UTC).strftime('%Y-%m-%dT%H:%M:%SZ')
def _ts(s: str) -> dt.datetime: return dt.datetime.strptime(s[:19], '%Y-%m-%dT%H:%M:%S').replace(tzinfo=UTC)


# ---- ranking (pure) ----------------------------------------------------------------------------------------------------
def true_range(h: float, l: float, prev_c: Optional[float]) -> float:
    return max(h, prev_c) - min(l, prev_c) if prev_c is not None else h - l


def range_ratio(bars: Sequence, i: int = -1, n: int = ATR_N) -> Optional[Tuple[float, float, float]]:
    """(true range / ATR, true range, ATR) of bar i, the ATR being the mean true range of the n bars BEFORE it (the
    big candle itself does not dilute its own yardstick). None with fewer than n + 1 earlier bars."""
    i = i % len(bars) if bars else 0
    if i < n + 1:
        return None
    trs = [true_range(bars[k].h, bars[k].l, bars[k - 1].c) for k in range(i - n, i)]
    atr = sum(trs) / n
    if atr <= 0:
        return None
    tr = true_range(bars[i].h, bars[i].l, bars[i - 1].c)
    return tr / atr, tr, atr


def pct(c: float, prev: float) -> float: return (c - prev) / prev * 100 if prev else 0.0


def zone_context(bar, zones: Iterable[Dict]) -> str:
    """How the candle met a zone of the last scan: 'closed in W1 demand', 'broke through D1 supply' (closed beyond
    the far edge), 'rejected at MN supply' / 'bounced off W1 demand' (wicked in, closed back out). Closed-in beats broke-through beats
    rejected; a higher timeframe wins a tie. '' when the candle touched no zone."""
    best = None
    for z in zones or []:
        try:
            lo, hi = sorted((float(z['prox']), float(z['dist'])))
        except (KeyError, TypeError, ValueError):
            continue
        side, tf = z.get('side'), z.get('tf') or ''
        if side not in ('demand', 'supply') or bar.l > hi or bar.h < lo:
            continue
        if lo <= bar.c <= hi:
            kind, word = 0, 'closed in'
        elif (side == 'demand' and bar.c < lo) or (side == 'supply' and bar.c > hi):
            kind, word = 1, 'broke through'
        else:
            kind, word = 2, 'bounced off' if side == 'demand' else 'rejected at'
        rank = (kind, TF_ORDER.index(tf) if tf in TF_ORDER else 99)
        if best is None or rank < best[0]:
            best = (rank, f'{word} {tfs(tf)} {side}')
    return best[1] if best else ''


def rank(items: List[Dict], n: int) -> List[Dict]:
    """The n biggest candles by range / ATR (ties: the bigger % move first)."""
    return sorted(items, key=lambda m: (-m['ratio'], -abs(m['pct'])))[:n]


def fx_mover(sym: str, d1: Sequence, h4: Sequence, h4_utc: Sequence[str], d1_end_utc: Optional[dt.datetime],
             zones: List[Dict]) -> Optional[Dict]:
    """The bigger of the last daily candle and the overnight 4H candles (those starting at / after the daily close),
    each measured against its own 20-bar ATR."""
    rd = range_ratio(d1) if len(d1) > ATR_N + 1 else None
    cands = []
    if rd:
        b = d1[-1]
        cands.append({'tf': 'D1', 'ratio': rd[0], 'pct': pct(b.c, d1[-2].c), 'bar': b})
    if d1_end_utc is not None:
        for k in range(len(h4)):
            try:
                start = _ts(h4_utc[k])
            except (ValueError, IndexError):
                continue
            if start >= d1_end_utc - dt.timedelta(hours=1):
                r = range_ratio(h4, k)
                if r:
                    cands.append({'tf': 'H4', 'ratio': r[0], 'pct': pct(h4[k].c, h4[k - 1].c), 'bar': h4[k]})
    if not cands:
        return None
    top = max(cands, key=lambda c: c['ratio'])
    h4s = [c for c in cands if c['tf'] == 'H4']
    note = ''
    if top['tf'] == 'D1' and h4s:
        bh = max(h4s, key=lambda c: c['ratio'])
        if bh['ratio'] >= H4_NOTE:
            note = f"4H overnight {bh['ratio']:.1f}×"
    zs = [z for z in zones if z.get('tf') not in ('H1',)] if top['tf'] == 'D1' else zones
    return {'sym': sym, 'tf': top['tf'], 'ratio': top['ratio'], 'pct': top['pct'], 'zone': zone_context(top['bar'], zs),
            'note': note}


def stock_mover(sym: str, bars: Sequence, zones: List[Dict]) -> Optional[Dict]:
    """The last daily candle vs its 20-day ATR, only for liquid stocks (price >= MIN_PRICE, 20-day average dollar
    volume >= MIN_DOLLAR_VOL)."""
    if len(bars) < ATR_N + 2:
        return None
    b = bars[-1]
    dv = sum(x.c * x.v for x in bars[-ATR_N - 1:-1]) / ATR_N
    if b.c < MIN_PRICE or dv < MIN_DOLLAR_VOL:
        return None
    r = range_ratio(bars)
    if not r:
        return None
    return {'sym': sym, 'tf': 'D1', 'ratio': r[0], 'pct': pct(b.c, bars[-2].c), 'zone': zone_context(b, zones), 'note': ''}


def mover_line(m: Dict) -> str:
    tf = 'D1' if m['tf'] == 'D1' else '4H overnight'
    p = m['pct']
    move = f"{'up' if p >= 0 else 'down'} {abs(p):.1f}%" if abs(p) >= 0.05 else 'flat'
    bits = [f"{m['ratio']:.1f}× normal range", move] + [x for x in (m.get('zone'), m.get('note')) if x]
    return f"<b>{SN.esc(m['sym'])}</b> {tf} · " + SN.esc(' · '.join(bits))


# ---- calendar ----------------------------------------------------------------------------------------------------------
TV_CAL = 'https://economic-calendar.tradingview.com/events'


def tv_calendar_url(day: dt.date) -> str:
    a = dt.datetime.combine(day, dt.time(0), LOCAL).astimezone(UTC)
    b = a + dt.timedelta(days=1)
    f = '%Y-%m-%dT%H:%M:%S.000Z'
    return f'{TV_CAL}?from={a.strftime(f)}&to={b.strftime(f)}&countries={CAL_COUNTRIES}'


def parse_tv_calendar(text: str, day: dt.date) -> List[Dict]:
    """TradingView calendar JSON -> [{'at': aware datetime, 'title', 'country'}] of the HIGH-impact events
    (importance 1) on `day` in Calgary time, sorted. Data only: nothing in it is followed."""
    try:
        rows = json.loads(text).get('result') or []
    except (ValueError, AttributeError):
        return []
    out = []
    for r in rows:
        try:
            if int(r.get('importance', -1)) < 1:
                continue
            at = _ts(str(r.get('date') or ''))
        except (ValueError, TypeError):
            continue
        if at.astimezone(LOCAL).date() != day:
            continue
        title = re.sub(r'\s+', ' ', str(r.get('title') or '')).strip()[:60]
        if title:
            out.append({'at': at, 'title': title, 'country': str(r.get('country') or '').upper()[:3]})
    return sorted(out, key=lambda e: (e['at'], e['country'], e['title']))


def fetch_tv_calendar(day: dt.date, log=print) -> List[Dict]:
    """Own minimal fetch (same headers as tools/reminders/reminders.py fetch_tv)."""
    try:
        req = urllib.request.Request(tv_calendar_url(day), headers={
            'User-Agent': R.user_agent(), 'Accept': 'application/json',
            'Origin': 'https://www.tradingview.com', 'Referer': 'https://www.tradingview.com/'})
        with urllib.request.urlopen(req, timeout=20) as r:
            return parse_tv_calendar(r.read(5_000_000).decode('utf-8', 'replace'), day)
    except Exception as e:  # noqa: BLE001
        log(f'calendar: TradingView fetch failed ({type(e).__name__})')
        return []


def _norm_event(e) -> Optional[Dict]:
    """A row of tools/news/calendar.py (shape unknown at write time) -> {'at', 'title', 'country'}, or None."""
    if not isinstance(e, dict):
        e = getattr(e, '__dict__', None) or (e._asdict() if hasattr(e, '_asdict') else None)
        if not isinstance(e, dict):
            return None
    imp = next((e[k] for k in ('importance', 'impact', 'level') if k in e), None)
    if imp is not None and str(imp).strip().lower() not in ('1', '3', 'high', 'h', 'true'):
        return None
    t = next((e[k] for k in ('at', 'utc', 'time_utc', 'when', 'time', 'date', 't') if e.get(k)), None)
    if isinstance(t, dt.datetime):
        at = t if t.tzinfo else t.replace(tzinfo=UTC)
    else:
        try:
            at = _ts(str(t))
        except (ValueError, TypeError):
            return None
    title = next((str(e[k]) for k in ('title', 'name', 'event') if e.get(k)), '')
    cc = next((str(e[k]) for k in ('country', 'cc', 'currency', 'ccy') if e.get(k)), '')
    return {'at': at, 'title': title.strip()[:60], 'country': cc.upper()[:3]} if title else None


def news_calendar(day: dt.date, log=print) -> Optional[List[Dict]]:
    """High-impact events of `day` (Calgary) from the shared tools/news/calendar.py (`from news import calendar`,
    events(now, hours_ahead, min_importance='high') -> [{time_utc, country, title, importance}]) when it exists;
    None when it is absent or unusable (the caller falls back to its own fetch)."""
    if not os.path.exists(os.path.join(ROOT, 'tools', 'news', 'calendar.py')):
        return None
    tools = os.path.join(ROOT, 'tools')
    if tools not in sys.path:
        sys.path.append(tools)                 # appended, never tools/news itself (it would shadow stdlib calendar)
    try:
        from news import calendar as NC        # noqa: WPS433
        start = dt.datetime.combine(day, dt.time(0), LOCAL).astimezone(UTC)
        rows = NC.events(now=start, hours_ahead=24, min_importance='high')
    except Exception as e:  # noqa: BLE001
        log(f'calendar: tools/news/calendar.py unusable ({type(e).__name__}); using own fetch')
        return None
    evs = [x for x in (_norm_event(r) for r in rows or []) if x and x['at'].astimezone(LOCAL).date() == day]
    log(f'calendar: tools/news/calendar.py -> {len(evs)} high-impact events today')
    return sorted(evs, key=lambda e: (e['at'], e['country'], e['title']))


KIND_TITLE = {'nfp': 'Jobs report (NFP)', 'cpi': 'US inflation (CPI)', 'fomc': 'Fed decision (FOMC)'}


def reminder_events(day: dt.date) -> List[Dict]:
    """Today's NFP / CPI / FOMC from the reminders' cached official schedule (tools/reminders/events.json)."""
    try:
        evs = R.events(R.load_json(R.EVENTS_PATH, None) or R.empty_cache())
    except Exception:  # noqa: BLE001
        return []
    out = []
    for kind, rows in evs.items():
        for e in rows:
            if e.get('date') == day.isoformat():
                out.append({'at': R.at_et(e['date'], e.get('et') or R.ET_TIME[kind]).astimezone(UTC),
                            'title': KIND_TITLE.get(kind, kind), 'country': 'US', 'key': kind})
    return out


def merge_events(cal: List[Dict], extra: List[Dict]) -> List[Dict]:
    """Calendar events + the reminder kinds the calendar lacks (same US time already listed -> skipped)."""
    seen = {(e['at'], e.get('country')) for e in cal}
    out = list(cal) + [e for e in extra if (e['at'], 'US') not in seen]
    return sorted(out, key=lambda e: (e['at'], e['title']))


def window_line(day: dt.date) -> str:
    a, b = R.at_et(day.isoformat(), '08:30'), R.at_et(day.isoformat(), '12:00')
    op = R.at_et(day.isoformat(), '09:30')
    return f'Busy window {short(a)}-{short(b)} (US data {short(a)}) · NYSE opens {short(op)}'


def event_lines(evs: List[Dict], n: int = MAX_EVENTS) -> List[str]:
    lines = [f"{clock(e['at'])} · {SN.esc((e['country'] + ' ') if e.get('country') else '')}{SN.esc(e['title'])}"
             for e in evs[:n]]
    if len(evs) > n:
        lines.append(f'+{len(evs) - n} more')
    return lines


# ---- Kevin's daily plan ------------------------------------------------------------------------------------------------
def first_sentence(s: str, n: int = 230) -> str:
    s = re.sub(r'\s+', ' ', s or '').strip()
    m = re.match(r'(.+?[.!?])(\s|$)', s)
    s = m.group(1) if m and len(m.group(1)) >= 40 else s
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0] + '…'


def parse_daily_ts(text: str) -> List[Dict]:
    """Fallback reader of src/core/mentors/kevin/daily/YYYY-MM.ts (when the esbuild export is missing): each
    entry's n, planFor, recorded, title, summary (JSON-style double-quoted strings)."""
    out = []
    pat = re.compile(r'n:\s*(\d+),[^\n]*?planFor:\s*("(?:[^"\\]|\\.)*"),\s*recorded:\s*("(?:[^"\\]|\\.)*"),\s*'
                     r'title:\s*("(?:[^"\\]|\\.)*"),\s*summary:\s*("(?:[^"\\]|\\.)*")', re.S)
    for m in pat.finditer(text):
        try:
            out.append({'n': int(m.group(1)), 'planFor': json.loads(m.group(2)), 'recorded': json.loads(m.group(3)),
                        'title': json.loads(m.group(4)), 'summary': json.loads(m.group(5))})
        except ValueError:
            continue
    return out


def kevin_daily(export: Optional[Dict]) -> List[Dict]:
    rows = list((export or {}).get('kevinDaily') or [])
    if not rows:
        files = sorted(glob.glob(os.path.join(ROOT, 'src', 'core', 'mentors', 'kevin', 'daily', '20??-??.ts')))
        for p in reversed(files[-2:]):
            with open(p, encoding='utf-8') as f:
                rows += parse_daily_ts(f.read())
    return sorted(rows, key=lambda r: r.get('recorded') or '', reverse=True)


def pick_plan(rows: List[Dict], day: dt.date) -> Optional[Dict]:
    """The plan for `day`, else the newest plan dated before it, else the newest."""
    d = day.isoformat()
    return (next((r for r in rows if r.get('planFor') == d), None)
            or next((r for r in rows if (r.get('planFor') or '') < d), None) or (rows[0] if rows else None))


# ---- messages ----------------------------------------------------------------------------------------------------------
def chart_buttons(syms: Sequence[Tuple[str, str]], callbacks: bool) -> List[Dict]:
    """[📊 SYM] per top mover: the bot's 'c:SYM' callback when its chart handler is deployed, else TradingView."""
    out = []
    for sym, tv in syms:
        if callbacks and len(f'c:{sym}'.encode()) <= 64:
            out.append(SN.cb(f'📊 {sym}', f'c:{sym}'))
        else:
            out.append(SN.button(f'📊 {sym}', tv))
    return out


def build_brief(day: dt.date, fx: List[Dict], stocks: List[Dict], evs: List[Dict], plan: Optional[Dict],
                callbacks: bool = False, sample: bool = False, notes: Sequence[str] = ()) -> SN.Msg:
    head = f"☀️ <b>Morning brief · {day.strftime('%a %-d %b')}</b>"
    if sample:
        head = '🧪 <b>Sample</b> · ' + head
    parts = [head + ''.join('\n' + SN.esc(n) for n in notes)]
    if fx:
        parts.append('<b>Big candles · forex, metals, indices</b>\n' + '\n'.join(mover_line(m) for m in fx))
    if stocks:
        parts.append('<b>Big candles · stocks</b>\n' + '\n'.join(mover_line(m) for m in stocks))
    if not fx and not stocks:
        parts.append('<i>No candle data this morning (feeds unavailable).</i>')
    today = ['<b>Today</b>'] + (event_lines(evs) or ['No high-impact events.']) + [window_line(day)]
    parts.append('\n'.join(today))
    rows: List[List[Dict]] = []
    if plan:
        pd = plan.get('planFor') or ''
        try:
            when = dt.date.fromisoformat(pd).strftime('%a %-d %b')
        except ValueError:
            when = pd
        lab = "Kevin's plan" if pd == day.isoformat() else "Kevin's latest plan"
        parts.append(f'<b>{lab}</b> · {SN.esc(when)}\n{SN.esc(first_sentence(plan.get("summary") or plan.get("title") or ""))}')
    syms = [(m['sym'], m.get('tv') or TV_CHART + m['sym']) for m in (fx[:2] + stocks[:2])]
    btns = chart_buttons(syms, callbacks)
    if btns:
        rows += [btns[:2], btns[2:4]]
    last = []
    if plan and plan.get('n'):
        last.append(SN.button("Kevin's plan", f"{APP}/learn?src=daily&l={plan['n']}"))
    last.append(SN.button('Open scanner', SN.FULL_LIST))
    rows.append(last)
    text = '\n\n'.join(parts)
    if SN.u16(text) > SN.SAFE and (fx or stocks):             # never in practice (lines are short): drop a mover
        fx, stocks = (fx, stocks[:-1]) if len(stocks) >= len(fx) else (fx[:-1], stocks)
        return build_brief(day, fx, stocks, evs, plan, callbacks, sample, notes)
    if SN.u16(text) > SN.SAFE:
        text = SN._cut(text, SN.SAFE)
    return SN.Msg(text, rows)


LABEL = {'course': 'Lesson', 'raja': 'Lesson', 'seiden': 'Page', 'baker': 'Chapter', 'zoom': 'Sunday live'}


def lesson_url(e: Dict) -> str:
    return f"{APP}/learn?l={e['n']}" if e['src'] == 'course' else f"{APP}/learn?src={e['src']}&l={e['n']}"


def clip(s: str, n: int) -> str:
    s = re.sub(r'\s+', ' ', s or '').strip()
    return s if len(s) <= n else s[:n - 1].rsplit(' ', 1)[0] + '…'


def build_lesson(e: Dict, sample: bool = False, npoints: int = 3) -> SN.Msg:
    """📘 Lesson of the day · mentor · label / title / 3 key points (rules first) / [Open lesson]."""
    lab = LABEL.get(e['src'], 'Lesson')
    if e['src'] == 'raja' and int(e['n']) >= 101:
        lab = 'Private session'
    elif e['src'] != 'zoom':
        lab = f"{lab} {e['n']}"
    head = f"📘 <b>Lesson of the day</b> · {SN.esc(e['mentor'])} · {SN.esc(lab)}"
    if sample:
        head = '🧪 <b>Sample</b> · ' + head
    pts = [p for p in (e.get('points') or []) if p][:npoints] or [first_sentence(e.get('summary') or '')]
    lines = [head, f"<b>{SN.esc(clip(e['title'], 120))}</b>"] + [f'• {SN.esc(clip(p, 170))}' for p in pts]
    return SN.Msg('\n'.join(lines), [[SN.button('Open lesson', lesson_url(e))]])


# ---- lesson rotation ---------------------------------------------------------------------------------------------------
def rotation(pool: List[Dict]) -> List[Dict]:
    """Every lesson once, mentors interleaved (raja, kevin course, seiden, baker, kevin sunday ...), each mentor's
    lessons in lesson order: deterministic, so the same pool always gives the same order."""
    by: Dict[str, List[Dict]] = {}
    for e in sorted(pool, key=lambda x: (x['src'], int(x['n']))):
        by.setdefault(e['src'], []).append(e)
    srcs = [s for s in MENTOR_ORDER if s in by] + sorted(s for s in by if s not in MENTOR_ORDER)
    out, k = [], 0
    while any(by.values()):
        s = srcs[k % len(srcs)]
        if by[s]:
            out.append(by[s].pop(0))
        k += 1
    return out


def next_lesson(pool: List[Dict], st: Dict) -> Optional[Dict]:
    """The first lesson of the rotation not yet used in this cycle; a finished cycle starts over (state updated
    by mark_used only after a successful send)."""
    order = rotation(pool)
    if not order:
        return None
    used = set(st.get('used') or [])
    nxt = next((e for e in order if e['key'] not in used), None)
    if nxt is None:
        st['used'] = []
        st['cycle'] = int(st.get('cycle') or 1) + 1
        nxt = order[0]
    return nxt


def mark_used(st: Dict, e: Dict, day: dt.date) -> None:
    st.setdefault('used', [])
    if e['key'] not in st['used']:
        st['used'].append(e['key'])
    st['last'] = {'date': day.isoformat(), 'key': e['key'], 'title': e['title']}
    st.setdefault('cycle', 1)


# ---- schedule ----------------------------------------------------------------------------------------------------------
def local_at(day: dt.date, hm: Tuple[int, int]) -> dt.datetime:
    return dt.datetime.combine(day, dt.time(*hm), LOCAL)


def decide(now: dt.datetime, sent: Dict[str, str]) -> Tuple[str, dt.date]:
    """('send' | 'early' | 'late' | 'sent' | 'weekend' | 'holiday', Calgary day). Due from 5:55 to 6:45 AM Calgary
    (45 min of GitHub cron delay), never at / after 7:30, once per day."""
    loc = now.astimezone(LOCAL)
    day = loc.date()
    if day.weekday() >= 5:
        return 'weekend', day
    if day in R.nyse_holidays(day.year):
        return 'holiday', day
    if day.isoformat() in sent:
        return 'sent', day
    target = local_at(day, SEND_AT)
    if loc < target - EARLY:
        return 'early', day
    hard = local_at(day, HARD_STOP)
    if loc > target + LATE or loc >= hard:
        return 'late', day
    return 'send', day


# ---- data --------------------------------------------------------------------------------------------------------------
def load_json(path: str, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except (OSError, ValueError):
        return default


def save_json(path: str, obj) -> None:
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(obj, f, indent=1, sort_keys=True, ensure_ascii=False)
        f.write('\n')


def fx_universe() -> List[Dict]:
    out = []
    for p in sorted(glob.glob(os.path.join(ROOT, 'public', 'fx', 'd', '*.json'))):
        for sym, ins in (load_json(p, {}).get('instruments') or {}).items():
            if ins.get('oanda'):
                zones = [{'tf': z.get('tf'), 'side': z.get('side'), 'prox': z.get('proximal'), 'dist': z.get('distal')}
                         for z in ins.get('zones') or []]
                out.append({'sym': sym, 'oanda': ins['oanda'], 'tv': TV_CHART + (ins.get('tv') or f'PEPPERSTONE:{sym}'),
                            'zones': zones})
    return out


def fetch_fx(log=print) -> List[Dict]:
    """Movers of every FX scanner instrument (OANDA, ~2 requests each)."""
    import oanda as O
    import fxcfg as C
    try:
        O.token()
    except O.NoToken:
        log('fx: OANDA_API_TOKEN not set, skipping')
        return []
    uni = fx_universe()

    def one(ins):
        try:
            d = O.parse_candles(O.default_get(O.candles_url(ins['oanda'], 'D1', ATR_N + 6)), 'D1', strict=False)
            h = O.parse_candles(O.default_get(O.candles_url(ins['oanda'], 'H4', ATR_N + 12)), 'H4', strict=False)
        except Exception as e:  # noqa: BLE001
            return None, f"{ins['sym']}: {type(e).__name__}"
        if not d:
            return None, None
        d_end = C.parse_utc(d[-1][3]).replace(tzinfo=UTC) + dt.timedelta(hours=24)
        m = fx_mover(ins['sym'], [x[1] for x in d], [x[1] for x in h], [x[3] for x in h], d_end, ins['zones'])
        if m:
            m['tv'] = ins['tv']
        return m, None

    with ThreadPoolExecutor(6) as ex:
        res = list(ex.map(one, uni))
    errs = [e for _, e in res if e]
    if errs:
        log(f'fx: {len(errs)} instruments failed, e.g. {errs[:3]}')
    out = [m for m, _ in res if m]
    log(f'fx: {len(out)}/{len(uni)} instruments measured')
    return out


def stock_universe() -> Tuple[List[str], Dict[str, Dict]]:
    idx = load_json(os.path.join(ROOT, 'public', 'scanner', 'index.json'), {})
    syms = [r['s'] for r in idx.get('tickers') or [] if r.get('s')]
    det: Dict[str, Dict] = {}
    for p in glob.glob(os.path.join(ROOT, 'public', 'scanner', 't', '*.json')):
        for s, t in (load_json(p, {}).get('tickers') or {}).items():
            det[s] = {'chart': t.get('chart'), 'zones': [{'tf': z.get('tf'), 'side': z.get('side'), 'prox': z.get('proximal'),
                                                         'dist': z.get('distal')} for z in t.get('zones') or []]}
    return syms, det


def fetch_stocks(now: dt.datetime, log=print) -> List[Dict]:
    import data as SD
    if not SD.alpaca_keys():
        log('stocks: Alpaca keys not set, skipping')
        return []
    syms, det = stock_universe()
    today_et = now.astimezone(ET).date()
    start = (today_et - dt.timedelta(days=50)).isoformat()
    end = (today_et - dt.timedelta(days=1)).isoformat()
    bars: Dict[str, List] = {}
    for k in range(0, len(syms), SD.ALPACA_BATCH_UPDATE):
        try:
            bars.update(SD.alpaca_bars(syms[k:k + SD.ALPACA_BATCH_UPDATE], start, end, log=log))
        except Exception as e:  # noqa: BLE001
            log(f'stocks: batch {k // SD.ALPACA_BATCH_UPDATE + 1} failed ({type(e).__name__})')
    newest = max((b[-1].d for b in bars.values() if b), default='')
    out = []
    for s, b in bars.items():
        b = [x for x in b if x.d < today_et.isoformat()]
        if not b or b[-1].d != newest:           # stale / halted: skip
            continue
        m = stock_mover(s, b, (det.get(s) or {}).get('zones') or [])
        if m:
            m['tv'] = (det.get(s) or {}).get('chart') or TV_CHART + s
            out.append(m)
    log(f'stocks: {len(bars)}/{len(syms)} with bars, {len(out)} liquid and measured (last session {newest})')
    return out


def todays_events(day: dt.date, log=print) -> List[Dict]:
    cal = news_calendar(day, log)
    if not cal:                                # absent, or [] (that module returns [] when its fetch fails)
        cal = fetch_tv_calendar(day, log)
    return merge_events(cal, reminder_events(day))


def make_messages(now: dt.datetime, st: Dict, sample: bool, log=print) -> Tuple[List[SN.Msg], Optional[Dict]]:
    day = now.astimezone(LOCAL).date()
    fx = rank(fetch_fx(log), TOP_FX)
    stocks = rank(fetch_stocks(now, log), TOP_STOCKS)
    evs = todays_events(day, log)
    export = load_json(LESSONS_PATH, None)
    plan = pick_plan(kevin_daily(export), day)
    if not export:
        log('lessons: no export (tools/briefing/.cache/lessons.json): Kevin plan from the TS fallback, no lesson')
    brief = build_brief(day, fx, stocks, evs, plan, callbacks=os.path.exists(CHART_TS), sample=sample)
    msgs = [brief]
    les = next_lesson((export or {}).get('pool') or [], st.setdefault('lessons', {}))
    if les:
        msgs.append(build_lesson(les, sample=sample))
    return msgs, les


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--test', action='store_true', help="send ONE '🧪 Sample' brief + lesson now (state untouched)")
    ap.add_argument('--dry', action='store_true', help='build and print, never send')
    a = ap.parse_args(argv)
    now = _ts(os.environ['BRIEF_NOW']) if os.environ.get('BRIEF_NOW') else dt.datetime.now(UTC)
    try:
        import tzdata
        tzv = 'tzdata ' + tzdata.IANA_VERSION
    except Exception:  # noqa: BLE001
        tzv = 'system tz'
    loc = now.astimezone(LOCAL)
    print(f'{tzv}: now {loc.strftime("%a %Y-%m-%d")} {clock(now)} Calgary (UTC{loc.utcoffset().total_seconds() / 3600:+.0f}); '
          f'6:00 AM today = {_iso(local_at(loc.date(), SEND_AT))}')
    state = load_json(STATE_PATH, {}) or {}
    sent = state.setdefault('sent', {})
    if not (a.test or a.dry):
        what, day = decide(now, sent)
        if what != 'send':
            print(f'brief: {what} ({day}) - nothing to send')
            return 0
    msgs, les = make_messages(now, json.loads(json.dumps(state)) if (a.test or a.dry) else state, a.test)
    if a.dry:
        SN.print_messages(msgs)
        return 0
    ok = SN.send(msgs)
    print('brief', 'sent' if ok else 'NOT sent', f'({len(msgs)} messages, {[SN.u16(m) for m in msgs]} UTF-16 units)')
    if a.test or not ok:
        return 0 if ok else 1
    day = now.astimezone(LOCAL).date()
    sent[day.isoformat()] = _iso(now)
    if les:
        mark_used(state['lessons'], les, day)
    cut = (day - dt.timedelta(days=KEEP_DAYS)).isoformat()
    state['sent'] = {k: v for k, v in sent.items() if k >= cut}
    save_json(STATE_PATH, state)
    return 0


if __name__ == '__main__':
    sys.exit(main())
