"""FX 2 (owner pick 2026-11-02): early warning of a daily / weekly direction change, Raja's rule (L3): a trend line
broken by a close = TURNING, then the opposite zones removed one by one, 2 removed = CHANGED (direction clear).

Per analysed instrument (the rows the hourly scan already built: zones.eval_row, no extra requests), for D1 and W1:
    break      the newest trend line cross is recent and no opposite zone is removed yet   ⚠️
    removed1   1 opposite zone removed since the cross                                      🟡
    changed    2+ removed: CHANGED (Raja's 'direction clear')                               🔄
One Telegram message per run with every advance (a cross moves break -> removed1 -> changed, each stage once), owner
only, mutes and quiet hours honoured. State + the current list: public/fx/trendchg.json (data branch; the bot's /turns
and the app read 'current'). The first run only seeds the state. Never raises into the scan.
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
from typing import Dict, List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import zones as Z  # noqa: E402

STATE = os.path.join(C.OUT_DIR, 'trendchg.json')
TFS = ('D1', 'W1')
RECENT = {'D1': 15, 'W1': 8}                  # a cross older than this many bars is not news any more
STAGES = ('break', 'removed1', 'changed')
ICON = {'break': '⚠️', 'removed1': '🟡', 'changed': '🔄'}
KEEP_DAYS = 120


def stage_of(r) -> Optional[Dict]:
    """The direction-change stage of one row, None when there is no recent cross."""
    if r is None or not getattr(r, 'ok', False) or not r.T or r.t_bar < 1 or r.t_bar > RECENT.get(r.tf, 10):
        return None
    if r.st == Z.DST_CHG:
        st = 'changed'
    elif r.st in (Z.DST_TURN, Z.DST_PULL):
        st = 'removed1' if r.rm >= 1 else 'break'
    else:
        return None
    return {'stage': st, 'side': r.T, 'rm': r.rm, 'cross': r.S.T[r.t_bar], 'bars': r.t_bar}


def current(res: Dict) -> List[Dict]:
    out = []
    for sym, an in (res.get('analyses') or {}).items():
        inst = getattr(an, 'inst', {}) or {}
        if not (inst.get('wl') or inst.get('source') == 'ctrader'):
            continue
        for tf in TFS:
            try:
                s = stage_of(an.rows.get(tf))
            except Exception:  # noqa: BLE001
                s = None
            if s:
                out.append({'sym': sym, 'tf': tf, **s, 'price': round(an.price, an.nd)})
    return sorted(out, key=lambda x: (-STAGES.index(x['stage']), x['tf'] != 'W1', x['sym']))


def message(items: List[Dict]) -> str:
    word = lambda s: 'up' if s > 0 else 'down'                               # noqa: E731
    lines = ['🧭 <b>Direction change</b> · daily / weekly (Raja: line broken by a close, then 2 opposite zones removed)', '']
    for x in items:
        opp = 'supply' if x['side'] > 0 else 'demand'
        tfw = 'Weekly' if x['tf'] == 'W1' else 'Daily'
        if x['stage'] == 'break':
            what = f"{tfw} {'down' if x['side'] > 0 else 'up'} trend line broken by a close ({x['cross'][:10]}): turning {word(x['side'])} - 0 of 2 {opp} zones removed"
        elif x['stage'] == 'removed1':
            what = f"{tfw}: 1 of 2 {opp} zones removed since the break - turning {word(x['side'])}"
        else:
            what = f"{tfw} direction CHANGED {word(x['side'])}: {x['rm']} {opp} zones removed (direction clear)"
        lines.append(f"{ICON[x['stage']]} <b>{x['sym']}</b> · {what}")
    lines += ['', 'Next: trade it from a fresh zone in the new direction (/areas, /zones SYM). Not advice.']
    return '\n'.join(lines)


def advances(cur: List[Dict], st: Dict) -> List[Dict]:
    """The items whose stage moved on since the last run (each cross: every stage once). Updates st['seen']."""
    seen = st.setdefault('seen', {})
    out = []
    for x in cur:
        k = f"{x['sym']}|{x['tf']}|{x['side']}|{x['cross']}"
        prev = seen.get(k)
        if prev is None or STAGES.index(x['stage']) > STAGES.index(prev.get('stage', 'break')):
            out.append(x)
            seen[k] = {'stage': x['stage'], 't': dt.datetime.now(dt.timezone.utc).isoformat()}
    cut = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=KEEP_DAYS)).isoformat()
    st['seen'] = {k: v for k, v in seen.items() if v.get('t', '') >= cut}
    return out


def run(res: Dict, prefs: Optional[Dict], send, notify: bool = True, write: bool = True, log=print, path: str = STATE) -> int:
    try:
        import prefs as P
        import notify as SN
        try:
            with open(path) as f:
                st = json.load(f)
        except (OSError, ValueError):
            st = {}
        boot = 'seen' not in st
        cur = current(res)
        new = advances(cur, st)
        muted = P.muted_set(prefs)
        new = [x for x in new if x['sym'] not in muted]
        st['current'] = cur
        st['updated'] = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        n = 0
        if new and not boot:
            msg = SN.silenced(message(new), P.in_quiet(prefs))
            if notify:
                n = 1 if send([msg]) else 0
            else:
                print(msg)
        if write:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path + '.tmp', 'w') as f:
                json.dump(st, f, separators=(',', ':'))
            os.replace(path + '.tmp', path)
        log(f"direction change: {len(cur)} current (D1 / W1), {len(new)} new stage(s)" + (' - first run: seeded' if boot else f', {n} message(s)'))
        return n
    except Exception as e:  # noqa: BLE001
        log(f'direction change: skipped ({type(e).__name__}: {str(e)[:120]})')
        return 0
