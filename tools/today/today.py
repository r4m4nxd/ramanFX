"""The two daily plan messages of focus mode (the owner's /focus): an evening plan and a morning check for a few markets.

    python today.py                 # sends whichever message is due by the Calgary clock (once each, state.json)
    python today.py --kind evening  # print / send that one now (--print: print only)

Evening (about 8 PM Calgary, Sunday to Thursday): for each market where price is against its bigger buy and sell
areas, how the owner's rules stand, yesterday's high and low, and tomorrow's best time. He decides tonight.
Morning (about 6:15 AM, Monday to Friday): one look before work: where price is now, how much of a normal day's move
is already done, and when the best time starts.

Everything comes from files the scanners already publish (public/fx/d/*.json, public/research/market_hours_by_symbol.json);
nothing is fetched. The symbols come from the bot's prefs (focus.syms); the messages are marked keep, so focus mode
lets them through. No trade is suggested: it reports conditions, in plain words.
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import os
import sys
from typing import Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools', 'stock_scanner'))
import notify as SN  # noqa: E402
import prefs as P  # noqa: E402

STATE_PATH = os.path.join(HERE, 'state.json')
FX_DIR = os.path.join(ROOT, 'public', 'fx', 'd')
HOURS = os.path.join(ROOT, 'public', 'research', 'market_hours_by_symbol.json')
CAL, NY = ZoneInfo('America/Edmonton'), ZoneInfo('America/New_York')
DEFAULT = ['EURUSD', 'XAUUSD', 'NAS100']
APP = os.environ.get('RFX_APP_URL', 'https://raman-fx.vercel.app')
TFW = {'H1': 'hourly', 'H4': '4-hour', 'D1': 'daily', 'W1': 'weekly', 'MN': 'monthly'}
BIG = ('D1', 'W1', 'MN')
DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
RULE = {'location': 'not at a bigger-timeframe area', 'no 3rd CP': 'third try in a row', 'not used': 'area already used',
        'market TF': 'wrong timeframe for this market', 'trendline': 'trend line disagrees', 'blind': 'no confirmation yet',
        'HTF opposite': 'a bigger area is in the way', 'near entry': 'price not near the entry', 'direction': 'trend direction disagrees',
        'clean': 'area overlaps an old one', 'strong': 'weak type of area', 'leg': 'weak move away from it',
        'weekend': 'right before the weekend', 'sideways': 'market is sideways', 'out of TL': 'inside the trend line',
        'room': 'room to target under 2× the risk', 'fresh': 'area already touched', 'curve': 'wrong side of the range',
        'spread': 'spread too wide', 'reduced': 'reduced-size direction', 'area': 'not inside a bigger area',
        'context': '3-month picture disagrees', 'gold TF': 'gold timeframe rule'}
# the evening message goes out 19:45-22:30 Calgary, the morning one 6:00-8:30 (a late cron still counts)
WINDOWS = {'evening': (19 * 60 + 45, 22 * 60 + 30), 'morning': (6 * 60, 8 * 60 + 30)}


def _read(path: str) -> Dict:
    try:
        with open(path) as f:
            v = json.load(f)
        return v if isinstance(v, dict) else {}
    except (OSError, ValueError):
        return {}


def load_instruments(fx_dir: str = FX_DIR) -> Dict[str, Dict]:
    out: Dict[str, Dict] = {}
    for p in sorted(glob.glob(os.path.join(fx_dir, '*.json'))):
        out.update((_read(p).get('instruments') or {}))
    return out


def load_week(path: str = HOURS) -> Dict[str, List]:
    """{symbol: 'pw' rows Mon..Fri + Sun, x100} from the market-hours study."""
    return {s['s']: s['pw'] for s in (_read(path).get('symbols') or []) if isinstance(s, dict) and s.get('pw')}


def fmt(v: Optional[float], digits: int) -> str:
    return 'n/a' if v is None else f'{v:,.{min(int(digits or 2), 5)}f}'


def clock(minutes: float) -> str:
    m = int(round(minutes)) % 1440
    h = m // 60
    return f'{h % 12 or 12}:{m % 60:02d} {"AM" if h < 12 else "PM"}'


def span(minutes: float) -> str:
    m = max(0, int(round(minutes)))
    return f'{m} min' if m < 60 else (f'{m // 60} h {m % 60} min' if m % 60 else f'{m // 60} h')


def nearest(inst: Dict) -> Tuple[Optional[Dict], Optional[Dict]]:
    """(nearest daily-or-bigger buy area at or below price, nearest sell area at or above): {tf, lo, hi, pct, inside}."""
    px = inst.get('price')
    best: Dict[str, Optional[Dict]] = {'demand': None, 'supply': None}
    for z in inst.get('zones') or []:
        if z.get('tf') not in BIG or z.get('proximal') is None or z.get('distal') is None or not px:
            continue
        lo, hi = min(z['proximal'], z['distal']), max(z['proximal'], z['distal'])
        side = z.get('side')
        if lo <= px <= hi:
            d = 0.0
        elif side == 'demand' and px > hi:
            d = (px - hi) / px * 100
        elif side == 'supply' and px < lo:
            d = (lo - px) / px * 100
        else:
            continue
        cur = best.get(side)
        if cur is None or d < cur['pct'] or (d == cur['pct'] and BIG.index(z['tf']) > BIG.index(cur['tf'])):
            best[side] = {'tf': z['tf'], 'lo': lo, 'hi': hi, 'pct': d, 'inside': d == 0.0}
    return best['demand'], best['supply']


def rules(inst: Dict) -> Optional[Dict]:
    """The scanner's own rule check of the setup closest to passing: {tf, side, passed, total, missing: [plain words]}."""
    cks = inst.get('checks') or []
    if not cks:
        return None
    fails = lambda c: [r for r in c.get('rules') or [] if r.get('status') == 'fail']  # noqa: E731
    c = min(cks, key=lambda c: (len(fails(c)), c.get('pips') or 0))
    f = fails(c)
    return {'tf': c.get('tf'), 'side': c.get('side'), 'total': len(c.get('rules') or []), 'passed': len(c.get('rules') or []) - len(f),
            'missing': [RULE.get(r.get('short'), str(r.get('short'))) for r in f]}


def day_range(inst: Dict) -> Dict:
    """Today's move against a normal day (the average range of the 14 days before): {used, adr, prev: (high, low, close)}."""
    d1 = (inst.get('bars') or {}).get('D1') or []
    if len(d1) < 16:
        return {'used': None, 'adr': None, 'prev': None}
    adr = sum(b[2] - b[3] for b in d1[-15:-1]) / 14
    today, prev = d1[-1], d1[-2]
    return {'used': (today[2] - today[3]) / adr if adr > 0 else None, 'adr': adr, 'prev': (prev[2], prev[3], prev[4]), 'day': today[0][:10]}


def best_time(week: Optional[List], weekday: int, ahead_min: int, after_study_min: Optional[int] = None) -> Optional[Dict]:
    """The busiest half-hour of a weekday (0 = Monday) as a Calgary clock time. The study's clock is New York minus 2 h,
    so the Calgary time is shifted by the live gap. after_study_min: only half-hours still to come today."""
    if not week or weekday > 4:
        return None
    row = week[weekday]
    cand = [(v, i) for i, v in enumerate(row) if v is not None and (after_study_min is None or i * 30 > after_study_min)]
    if not cand:
        return None
    v, i = max(cand)
    return {'cal_min': i * 30 + 120 - ahead_min, 'x': v / 100, 'study_min': i * 30}


def market_block(sym: str, inst: Optional[Dict], week: Optional[List], kind: str, now: dt.datetime) -> List[str]:
    if not inst or not inst.get('price'):
        return [f'<b>{SN.esc(sym)}</b>', '● No scan data for this market yet']
    dg = inst.get('digits') or 2
    px = inst['price']
    cal, ny = now.astimezone(CAL), now.astimezone(NY)
    ahead = int(((ny.hour * 60 + ny.minute) - (cal.hour * 60 + cal.minute)) % 1440)
    buy, sell = nearest(inst)
    rg = day_range(inst)
    rl = rules(inst)
    lines = [f'<b>{SN.esc(sym)}</b> · {SN.code(fmt(px, dg))}']

    def area(z: Optional[Dict], word: str, arrow: str) -> str:
        if not z:
            return f'{arrow} No daily or bigger {word} area nearby'
        where = 'price is inside it' if z['inside'] else f"{z['pct']:.1f}% away"
        return f"{arrow} {TFW[z['tf']].capitalize()} {word} area {SN.code(fmt(z['lo'], dg) + '–' + fmt(z['hi'], dg))} · {where}"
    lines += [area(buy, 'buy', '▲'), area(sell, 'sell', '▼')]
    if kind == 'evening':
        if rl:
            miss = '; '.join(rl['missing'][:2])
            lines.append(f"● Your rules: {rl['passed']} of {rl['total']} pass" + (f' (missing: {SN.esc(miss)}' + ('…' if len(rl['missing']) > 2 else '') + ')' if miss else ''))
        if rg['prev']:
            lines.append(f"● Last day: high {SN.code(fmt(rg['prev'][0], dg))} · low {SN.code(fmt(rg['prev'][1], dg))}")
        tomorrow = (cal.weekday() + 1) % 7
        while tomorrow > 4:
            tomorrow = (tomorrow + 1) % 7
        bt = best_time(week, tomorrow, ahead)
        if bt:
            lines.append(f"● Best time {DAYS[tomorrow]}: {clock(bt['cal_min'])} ({bt['x']:.1f}× a normal half-hour)")
    else:
        if rg['used'] is not None:
            u = round(rg['used'] * 100)
            word = 'most of the move is done: do not chase' if u >= 90 else 'over half done' if u >= 60 else 'plenty left'
            lines.append(f'● Today so far: {u}% of a normal day · {word}')
        study_now = (ny.hour * 60 + ny.minute - 120) % 1440
        bt = best_time(week, cal.weekday(), ahead, study_now) if cal.weekday() <= 4 else None
        if bt:
            lines.append(f"● Best time today: {clock(bt['cal_min'])}, in {span(bt['study_min'] - study_now)} ({bt['x']:.1f}×)")
    return lines


def build(kind: str, syms: List[str], insts: Dict[str, Dict], weeks: Dict[str, List], now: dt.datetime) -> SN.Msg:
    cal = now.astimezone(CAL)
    if kind == 'evening':
        nxt = (cal.weekday() + 1) % 7
        while nxt > 4:
            nxt = (nxt + 1) % 7
        head = f'🌙 <b>Plan for {DAYS[nxt]}</b> · {len(syms)} markets'
        tail = ('Decide tonight for each one: buy at a price, sell at a price, or nothing. Place the orders, then you are done.\n'
                'The move comes back at the same time tomorrow. Nothing is missed by waiting.')
    else:
        head = f'☀️ <b>Morning check</b> · {DAYS[cal.weekday()]}'
        tail = 'One look. If last night\'s plan still holds, leave it alone. Then go to work.'
    parts = [head]
    for s in syms:
        parts.append(SN.block(market_block(s, insts.get(s), weeks.get(s), kind, now)))
    text = '\n'.join(parts) + '\n' + tail + '\n' + SN.footer('Pepperstone')
    return SN.Msg(text, [[SN.button('Open the clock', f'{APP}/market-hours')]], keep=True)


def due(now: dt.datetime, state: Dict) -> Optional[str]:
    """'evening' (Sun-Thu) / 'morning' (Mon-Fri) when inside its Calgary window and not sent today; else None."""
    cal = now.astimezone(CAL)
    m, day, wd = cal.hour * 60 + cal.minute, cal.date().isoformat(), cal.weekday()
    for kind, (a, b) in WINDOWS.items():
        ok_day = wd in (6, 0, 1, 2, 3) if kind == 'evening' else wd <= 4
        if ok_day and a <= m <= b and state.get(kind) != day:
            return kind
    return None


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--kind', choices=['evening', 'morning'])
    ap.add_argument('--print', dest='print_only', action='store_true')
    ap.add_argument('--syms', default='')
    a = ap.parse_args(argv)
    now = dt.datetime.now(dt.timezone.utc)
    state = _read(STATE_PATH)
    kind = a.kind or due(now, state)
    if not kind:
        print('today: nothing due')
        return 0
    prefs = None if a.print_only else P.fetch(log=print)
    focus = (prefs or {}).get('focus') or {}
    if not a.kind and prefs is not None and not focus.get('on'):
        print('today: focus mode is off, the plan messages are part of focus mode: nothing sent')
        return 0
    syms = [s.strip().upper() for s in a.syms.split(',') if s.strip()] or focus.get('syms') or DEFAULT
    msg = build(kind, syms[:5], load_instruments(), load_week(), now)
    if a.print_only:
        print(msg)
        return 0
    if SN.send([msg]) and not a.kind:
        state[kind] = now.astimezone(CAL).date().isoformat()
        with open(STATE_PATH, 'w') as f:
            json.dump(state, f)
    return 0


if __name__ == '__main__':
    sys.exit(main())
