"""Fresh areas after a big move away (owner 2026-11-18, FTMO account): a NEW buy / sell area on the 15-minute, hourly,
4-hour, daily, weekly or monthly chart whose move away either
    - closed at a new high / low (beyond every bar of the BREAK[tf] bars before the move), or
    - removed at least one opposite area,
on the departure candle or the EXT candles after it. One Telegram message per run with every new one, the markets of
the owner's FTMO list only (ftmo.json), owner only, mutes and quiet hours honoured, no daily cap (he asked for all).

    hourly scan (fxscan.py)      H1 .. MN from the rows the scan already built      state public/fx/fresh.json
    15-minute job (realign.yml)  M15 bars from the Pepperstone feed, 1 request each  state public/fx/fresh15.json

    python tools/fx_scanner/fxfresh.py --m15             run the 15-minute pass (sends; saves the state)
    python tools/fx_scanner/fxfresh.py --m15 --dry-run   print the would-be message, send / write nothing

The first run of each pass only seeds its state. Never raises into the scan. Pure parts: qualify, found, card, message.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
from typing import Dict, List, Optional, Sequence

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import fxcfg as C  # noqa: E402
import zones as Z  # noqa: E402

STATE = os.path.join(C.OUT_DIR, 'fresh.json')
STATE15 = os.path.join(C.OUT_DIR, 'fresh15.json')
TFS = ('H1', 'H4', 'D1', 'W1', 'MN')
BREAK = {'M15': 96, 'H1': 48, 'H4': 30, 'D1': 22, 'W1': 13, 'MN': 6}      # bars a new high / low must beat
SPAN = {'M15': 'a day', 'H1': '2 days', 'H4': 'a week', 'D1': 'a month', 'W1': '3 months', 'MN': '6 months'}
EXT = 3                                # candles after the departure that still belong to the move away
NEW = {'M15': 4, 'H1': 2}              # new = it became true on the newest closed bar (15m / 1h: a missed run is caught up)
KEEP_DAYS = {'M15': 3, 'H1': 7, 'H4': 21, 'D1': 45, 'W1': 90, 'MN': 200}
RANK = {'MN': 0, 'W1': 1, 'D1': 2, 'H4': 3, 'H1': 4, 'M15': 5}
M15_BARS = 400
M15_BUDGET_S = float(os.environ.get('FX_FRESH_BUDGET_S') or 200)


def ftmo() -> Dict[str, str]:
    try:
        with open(os.path.join(HERE, 'ftmo.json')) as f:
            return json.load(f).get('symbols') or {}
    except (OSError, ValueError):
        return {}


def qualify(S: Z.Series, zones: Sequence[Z.Zone], z: Z.Zone, tf: str) -> Optional[Dict]:
    """Why this zone's move away is a big one, None when it is not: {'broke', 'removed', 'known'} (known = the shift
    on which it became true: the zone exists from its stay-away candle on)."""
    L, d = z.leg_bar, z.dir
    if z.removed or z.sa_bar < 1:
        return None
    newest = max(1, L - EXT)
    n = BREAK.get(tf, 30)
    old = range(L + 1, min(S.n, L + 1 + n))
    broke = None
    if len(old) >= n // 2:
        ref = max(S.H[j] for j in old) if d > 0 else min(S.L[j] for j in old)
        broke = next((j for j in range(L, newest - 1, -1) if (S.C[j] > ref if d > 0 else S.C[j] < ref)), None)
    rem = [y for y in zones if y.dir == -d and y.removed and newest <= y.removed_bar <= L]
    if broke is None and not rem:
        return None
    first = max(([broke] if broke is not None else []) + [y.removed_bar for y in rem])   # the earlier of the two
    return {'broke': broke is not None, 'removed': len(rem), 'known': min(z.sa_bar, first)}


def found(sym: str, S: Z.Series, zones: Sequence[Z.Zone], tf: str, nd: int, price: float) -> List[Dict]:
    """The new big-move areas of one timeframe (newest closed bars only)."""
    out = []
    for z in zones:
        if z.leg_bar > NEW.get(tf, 1) + EXT + 1:
            continue
        q = qualify(S, zones, z, tf)
        if q is None or q['known'] > NEW.get(tf, 1):
            continue
        out.append({'id': f'{sym}|{z.zid}', 'sym': sym, 'tf': tf, 'dir': z.dir, 'lo': round(z.lo, nd), 'hi': round(z.hi, nd),
                    'price': round(price, nd), 'digits': nd, 'broke': q['broke'], 'removed': q['removed'], 'made': z.made})
    return out


def _f(v, nd: int) -> str:
    return f'{v:,.{nd}f}'


def card(x: Dict, names: Optional[Dict[str, str]] = None) -> str:
    """<b>Euro vs US dollar</b> (EURUSD) · new 15-minute buy area
    <blockquote>▲ Area <code>1.09520–1.09610</code> · price now <code>1.09890</code>
    ● The price closed at its highest in a day
    ● It broke through 2 sell areas on the way up
    ● Next: wait for the price to come back to it, then do your checks</blockquote>"""
    import notify as SN
    d, nd, tf = x['dir'], x.get('digits', 5), x['tf']
    side, opp = ('demand', 'supply') if d > 0 else ('supply', 'demand')
    alt = (names or {}).get(x['sym']) or ''
    lines = [f"{'▲' if d > 0 else '▼'} Area {SN.code(_f(x['lo'], nd) + '–' + _f(x['hi'], nd))} · price now {SN.code(_f(x['price'], nd))}"]
    if x.get('broke'):
        lines.append(f"● The price closed at its {'highest' if d > 0 else 'lowest'} in {SPAN.get(tf, 'a while')}")
    n = int(x.get('removed') or 0)
    if n:
        lines.append(f"● It broke through {n} {SN.area(opp, n)} on the way {'up' if d > 0 else 'down'}")
    lines.append('● Next: wait for the price to come back to it, then do your checks')
    return (f"{SN.title(x['sym'], alt=alt if alt != x['sym'] else '')} · new {SN.esc(SN.tf_word(tf))} {SN.area(side)}\n"
            + SN.block(lines))


def sort_items(items: Sequence[Dict]) -> List[Dict]:
    return sorted(items, key=lambda x: (RANK.get(x['tf'], 9), -int(x.get('removed') or 0), not x.get('broke'), x['sym']))


def message(items: Sequence[Dict], names: Optional[Dict[str, str]] = None, now: Optional[dt.datetime] = None, cards: int = 4):
    """Every new area of the run in one message: up to `cards` cards (biggest timeframe first), the rest one line each."""
    import notify as SN
    import arrival_alerts as AA
    now = now or dt.datetime.now(dt.timezone.utc)
    its = sort_items(items)
    shown, rest = its[:cards], its[cards:]
    head = ['<b>New areas after a big move</b>'] if len(its) > 1 else []
    detail = [f"{SN.esc(i['sym'])} · {SN.esc(SN.tf_word(i['tf']))} {SN.area('demand' if i['dir'] > 0 else 'supply')} "
              f"{_f(i['lo'], i.get('digits', 5))}–{_f(i['hi'], i.get('digits', 5))}" for i in rest]
    when = SN.local_time(now.strftime('%Y-%m-%dT%H:%M:%S'), SN.CLOCK)
    return SN.compose(head, [card(i, names) for i in shown], detail, AA.buttons([i['sym'] for i in shown]),
                      cap=30, foot=SN.footer('Pepperstone', when))


def _load(path: str) -> Dict:
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def _save(path: str, st: Dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path + '.tmp', 'w') as f:
        json.dump(st, f, separators=(',', ':'))
    os.replace(path + '.tmp', path)


def _prune(seen: Dict[str, str], now: dt.datetime) -> Dict[str, str]:
    out = {}
    for k, t in seen.items():
        tf = k.split('|', 1)[-1].split(':', 1)[0]
        if t >= (now - dt.timedelta(days=KEEP_DAYS.get(tf, 30))).isoformat():
            out[k] = t
    return out


def deliver(items: List[Dict], path: str, prefs: Optional[Dict], send, notify: bool, write: bool, what: str, log=print,
            now: Optional[dt.datetime] = None) -> int:
    """Dedupe against the state, send the new ones in one message, save. Returns the messages sent."""
    import prefs as P
    import notify as SN
    now = now or dt.datetime.now(dt.timezone.utc)
    st = _load(path)
    boot = 'seen' not in st
    seen = st.setdefault('seen', {})
    muted = P.muted_set(prefs)
    new = [x for x in items if x['id'] not in seen]
    todo = [x for x in new if x['sym'] not in muted]
    n = 0
    ok = True
    if todo and not boot:
        msg = SN.kept(message(todo, ftmo(), now))          # the owner's own FTMO alerts: sent in every focus mode
        if P.in_quiet(prefs):
            msg = SN.silenced(msg, True)
        if notify:
            ok = bool(send([msg]))
            n = 1 if ok else 0
        else:
            print(msg)
    if ok or not os.environ.get('TELEGRAM_BOT_TOKEN'):       # not delivered: offered again next run
        for x in new:
            seen[x['id']] = now.isoformat()
    st['seen'] = _prune(seen, now)
    st['last'] = sort_items(todo)[:40] if todo else st.get('last') or []
    st['updated'] = now.strftime('%Y-%m-%dT%H:%M:%SZ')
    if write:
        _save(path, st)
    log(f"fresh areas ({what}): {len(items)} current, {len(new)} new" + (' - first run: seeded' if boot else f', {n} message(s)'))
    return n


def run(res: Dict, prefs: Optional[Dict], send, notify: bool = True, write: bool = True, log=print, path: str = STATE,
        now: Optional[dt.datetime] = None) -> int:
    """The hourly pass: H1 .. MN on the scan's own rows."""
    try:
        want = ftmo()
        items: List[Dict] = []
        for sym, an in (res.get('analyses') or {}).items():
            if sym not in want:
                continue
            for tf in TFS:
                try:
                    r = an.rows.get(tf)
                    if r is not None and getattr(r, 'ok', False):
                        items += found(sym, r.S, r.zones, tf, an.nd, an.price)
                except Exception as e:  # noqa: BLE001
                    log(f'fresh areas: {sym} {tf} skipped ({type(e).__name__})')
        return deliver(items, path, prefs, send, notify, write, 'H1-MN', log, now)
    except Exception as e:  # noqa: BLE001
        log(f'fresh areas: skipped ({type(e).__name__}: {str(e)[:120]})')
        return 0


def digits_map(out_dir: str = C.OUT_DIR) -> Dict[str, int]:
    m = _load(os.path.join(out_dir, 'latest.json')).get('map') or []
    return {x['sym']: int(x.get('digits', 5)) for x in m if isinstance(x, dict) and x.get('sym')}


def guess_digits(px: float) -> int:
    return 5 if px < 10 else (3 if px < 1000 else 2)


def scan_m15(bars_of, syms: Sequence[str], digits: Dict[str, int], log=print, budget_s: float = M15_BUDGET_S) -> List[Dict]:
    """The 15-minute pass over `syms` (pure apart from bars_of and the clock)."""
    import arrival as A
    t0, items, skipped, errors = time.time(), [], [], 0
    for sym in syms:
        if time.time() - t0 > budget_s:
            log(f'fresh areas (15m): time budget spent, {len(syms) - syms.index(sym)} market(s) next run')
            break
        try:
            bars = bars_of(sym)
        except KeyError:
            skipped.append(sym)
            continue
        except Exception as e:  # noqa: BLE001
            errors += 1
            if errors <= 3:
                log(f'fresh areas (15m): {sym} bars unavailable ({type(e).__name__}: {str(e)[:60]})')
            if errors >= 8:
                log('fresh areas (15m): feed is failing, stopping this run')
                break
            continue
        if len(bars) < 60:
            continue
        S = A.series_of(bars, 'M15')
        zones = Z.detect(S, A.FX_P)
        items += found(sym, S, zones, 'M15', digits.get(sym) or guess_digits(bars[-1].c), bars[-1].c)
    if skipped:
        log(f"fresh areas (15m): no 15-minute bars for {', '.join(skipped)}")
    return items


def main(argv=None, bars_of=None, send=None, prefs=None, log=print) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--m15', action='store_true', help='the 15-minute pass')
    ap.add_argument('--dry-run', action='store_true', help='print the would-be message; send and write nothing')
    a = ap.parse_args(argv)
    if not a.m15:
        ap.error('only --m15 runs on its own (H1 .. MN run inside fxscan.py)')
    try:
        if bars_of is None:
            import sources.ctrader_feed as CTF
            if not CTF.enabled():
                log('fresh areas (15m): the Pepperstone feed is not configured, nothing to do')
                return 0

            def bars_of(sym: str):
                return CTF.recent(sym, 'M15', M15_BARS)
        items = scan_m15(bars_of, list(ftmo()), digits_map(), log)
        if send is None:
            import fxnotify as N
            send = N.send
        if prefs is None and not a.dry_run:
            import prefs as P
            prefs = P.fetch(log=log)
        deliver(items, STATE15, prefs, send, not a.dry_run, not a.dry_run, '15m', log)
    except Exception as e:  # noqa: BLE001  (never fails the realignment job)
        log(f'fresh areas (15m): skipped ({type(e).__name__}: {str(e)[:120]})')
    return 0


if __name__ == '__main__':
    sys.exit(main())
