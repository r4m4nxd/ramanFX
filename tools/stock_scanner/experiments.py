"""Experiment variants of the stock scanner's BUY plan: `current` with ONE change each, tested walk-forward by
backtest.py (public/learn/stock_experiments.json) and read by the auto-learner (tools/learn/learner.py). The live
scanner may later import these SAME functions, so an adopted rule is exactly the tested code.

Every function here is pure and takes only data known when its decision is made:
  * signal-time decisions (filters, a changed stop / target, the size) get the daily bars up to and including the
    evaluation day d (`Known.bars`), the CLOSED weekly bars as of d, SPY's closes up to d and the supply zones of
    scan.analyse() on day d (built from closed bars only);
  * order decisions (cancel_50, arrive_stair) at session i read bars[:i] (and bar i itself only for what bar i shows
    by its close: its high / low / close, exactly like the fill rule);
  * exit decisions (be_*, time_stop) are taken at a session's close and act from the next session on.
Stocks are LONG ONLY: every plan here is a BUY (limit at the proximal, stop under the distal, target above).
"""
from __future__ import annotations

import datetime as dt
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Sequence, Tuple

import zones as Z
from zones import Bar

ORDER_LIFE = 40          # sessions a limit order lives (backtest.ORDER_LIFE)
HOLD_DAYS = 364          # 52 weeks in a trade at most
TP_OFFSET = 0.005        # target 0.5% before a supply's proximal (scan.TP_OFFSET)
MIN_RR = 2.0             # the scanner's room rule: below 2x the stop = no trade

BE_TRIGGER = {'be_1r': 1.0, 'be_2r': 2.0}
STRUCT_TRIGGER_R = 1.5
TIME_STOP_SESSIONS, TIME_STOP_R = 20, 1.0
TP_FIXED_R = 3.0
TP_ZONE_MIN_R = 2.5
FRESH_DEPTH = 0.25
STOP_ATR_X = 1.0
STAIR_BARS, STAIR_BODY_X, STAIR_BASE_RANGE_X, STAIR_BASES = 10, 0.5, 0.6, 2
RANGE_BARS = 504         # ~2 years of sessions
REGIME_SMA = 200
VOL_WINDOW, VOL_PCTL = 250, 0.90
CANCEL_FRAC = 0.5

VARIANTS: Dict[str, Dict[str, str]] = {
    'current': {'group': 'baseline', 'kind': 'filter', 'desc': 'The live rules unchanged (the baseline every variant is compared with).'},
    'be_1r': {'group': 'exit', 'kind': 'exit', 'desc': 'Move the stop to the fill price once a daily high has reached +1R.'},
    'be_2r': {'group': 'exit', 'kind': 'exit', 'desc': 'Move the stop to the fill price once a daily high has reached +2R.'},
    'be_struct': {'group': 'exit', 'kind': 'exit',
                  'desc': 'After +1.5R, raise the stop to the lowest daily low since the fill (it only ever tightens).'},
    'time_stop': {'group': 'exit', 'kind': 'exit',
                  'desc': 'Sell at the close of the 20th session after the fill if price has not reached +1R by then.'},
    'tp_fixed3': {'group': 'exit', 'kind': 'exit', 'desc': 'Take profit at exactly 3R instead of the next supply / projection.'},
    'tp_zone': {'group': 'exit', 'kind': 'exit',
                'desc': 'Take profit just below the nearest not-removed supply zone above (W1, MN or 3M, tested ones too); skip the trade if that is under 2.5R.'},
    'fresh_body': {'group': 'freshness', 'kind': 'filter',
                   'desc': 'A zone counts as used only once a daily candle CLOSED inside it (wick-only touches keep it fresh).'},
    'fresh_depth25': {'group': 'freshness', 'kind': 'filter',
                      'desc': 'A zone counts as used only once price went at least 25% of the zone height inside it.'},
    'cont_off': {'group': 'continuation', 'kind': 'filter', 'desc': 'Never buy continuation (rally-base-rally) zones.'},
    'cont_nested': {'group': 'continuation', 'kind': 'filter',
                    'desc': 'Buy a rally-base-rally zone only when it sits inside a touched higher-timeframe demand zone.'},
    'stop_atr': {'group': 'stop', 'kind': 'exit',
                 'desc': 'Stop at the wider of the current stop and the distal minus one weekly ATR14 (R recomputed; under 2R room = no trade).'},
    'arrive_stair': {'group': 'filter', 'kind': 'filter',
                     'desc': 'Skip the trade when the last 10 sessions before the first touch were a slow stair-step approach.'},
    'curve_top3': {'group': 'filter', 'kind': 'filter', 'desc': 'No buy when the entry sits in the top third of the last 2 years\' range.'},
    'cancel_50': {'group': 'filter', 'kind': 'filter',
                  'desc': 'Cancel the waiting order once price has gone half way to the target without filling it.'},
    'market_regime': {'group': 'filter', 'kind': 'filter', 'desc': 'No new buy while SPY closes below its 200-day average.'},
    'earnings_skip': {'group': 'filter', 'kind': 'filter',
                      'desc': 'Skip a trade whose fill would hold through an earnings date within 10 sessions.'},
    'volreg_half': {'group': 'size', 'kind': 'size',
                    'desc': 'Half size when the daily ATR14 is in the top 10% of its last 250 values.'},
    'split_entry': {'group': 'size', 'kind': 'size',
                    'desc': 'Buy half at the proximal and half at the middle of the zone (same stop and target).'},
}

# The exact rule of each variant (docs/research/Stock_Backtest.md prints these). R = entry - stop of the plan.
DEFINITIONS: Dict[str, str] = {
    'current': 'scan.analyse() + scan.symbol_signals() as live; limit at the proximal, wick stop and target in the market, '
               '52-week time exit, one position per ticker.',
    'be_1r': 'At the close of a session after the fill bar whose high reached fill + 1R, the stop becomes the fill price from the '
             'next session on (a gap below it exits at the open).',
    'be_2r': 'As be_1r with the trigger at fill + 2R.',
    'be_struct': 'At the close of a session once a high after the fill bar reached fill + 1.5R, the stop becomes the lowest daily '
                 'low from the fill bar up to that session, if that is higher than the stop (only tightens), from the next session on.',
    'time_stop': 'If no high of the 20 sessions after the fill bar reached fill + 1R, exit at the close of the 20th session.',
    'tp_fixed3': 'Target = entry + 3 x (entry - stop); the order is also cancelled when that target trades first.',
    'tp_zone': 'Target = 0.5% under the nearest proximal above the entry among the not-removed supply zones of the W1, MN and 3M '
               'rows of the signal-day analysis (tested ones and lower-TF ones too); no trade when that is < 2.5R; no supply above '
               '= the live target (250% projection).',
    'fresh_body': 'The freshness rule (L2 · L52) is replaced: a zone is used only once a daily close <= its proximal happened after '
                  'its stay-away period. Tested zones (1-2 wick touches, not removed) whose ONLY failed rule is freshness become BUYs; '
                  'one BUY per timeframe, the nearest.',
    'fresh_depth25': 'As fresh_body, but used = a daily low <= proximal - 25% of the zone height.',
    'cont_off': 'No BUY on a zone whose pattern is RBR (rally-base-rally continuation).',
    'cont_nested': 'An RBR zone gives a BUY only when its top-down location code is "inside" (inside a touched MN demand for W1, '
                   'a touched 3M demand for MN); "top" (3M, or no HTF in reach) does not count as nested.',
    'stop_atr': 'Stop = min(live stop, distal - 1.0 x weekly ATR14) with ATR14 = mean true range of the last 14 CLOSED weekly '
                'bars; R and R:R use the new stop; no trade when the room falls under 2R (the live room rule).',
    'arrive_stair': 'At the first session that touches the proximal (low <= entry) the order is withdrawn when the 10 sessions '
                    'before it were a stair-step approach: mean |close - open| < 0.5 x ATR14, or >= 2 small-range bases (runs of '
                    '>= 2 consecutive bars each with high - low < 0.6 x ATR14); ATR14 = mean true range of the 14 sessions before '
                    'the touch. A withdrawn first touch ends the setup.',
    'curve_top3': 'No BUY when the entry >= low + 2/3 x (high - low) of the last 504 daily bars up to the signal day.',
    'cancel_50': 'Cancel the waiting order at the close of a session (before any fill) whose high reached entry + 50% of '
                 '(target - entry).',
    'market_regime': 'No BUY when SPY\'s close on the signal day is below the mean of its last 200 closes (fewer than 200 = allowed).',
    'earnings_skip': 'Skip a signal whose fill would hold through an earnings date within 10 sessions.',
    'volreg_half': 'Half size (R x 0.5) when the daily ATR14 on the signal day is higher than at least 90% of its last 250 values.',
    'split_entry': 'Half the shares at the proximal, half at the zone middle (proximal - 50% of the height), same stop / target; the '
                   'second order lives while the first half is open (order life 40 sessions, a close under the distal cancels '
                   'it). R is in units of the full position at the proximal: 0.5 x R1 + 0.5 x R2 (R2 = 0 when not filled).',
}

SKIPPED: Dict[str, str] = {
    'earnings_skip': ('no historical earnings dates in the cached data: data.fetch_earnings only knows the NEXT date and '
                      'the fundamentals cache keeps only the last 16 10-Q / 10-K filing dates (filed days to weeks after '
                      'the release, about 4 years), so most of the test period would have no dates and the rest a proxy'),
}


def runnable() -> List[str]:
    return [v for v in VARIANTS if v not in SKIPPED]


# ---- data known on the evaluation day -----------------------------------------------------------------------------
@dataclass
class Known:
    """What a signal-time decision may read: daily bars up to and including the evaluation day, the CLOSED weekly
    bars, SPY's closes up to that day, and the proximals of the not-removed supply zones of that day's analysis."""
    bars: Sequence[Bar]
    w1: Sequence[Bar] = ()
    spy_closes: Sequence[float] = ()
    supplies: Sequence[float] = ()
    memo: Dict = field(default_factory=dict)


def true_ranges(bars: Sequence[Bar]) -> List[float]:
    return [max(b.h, a.c) - min(b.l, a.c) for a, b in zip(bars, bars[1:])]


def atr_last(bars: Sequence[Bar], n: int = 14) -> float:
    """Simple mean of the last n true ranges (MT5 iATR, like zones.Series); 0 when too short."""
    tr = true_ranges(bars[-(n + 1):])
    return sum(tr) / n if len(tr) >= n else 0.0


def atr_series(bars: Sequence[Bar], n: int = 14) -> List[float]:
    """ATR14 at each bar of `bars` (0 until n true ranges exist); value k reads bars[:k + 1] only."""
    tr = true_ranges(bars)
    out = [0.0] * len(bars)
    s = 0.0
    for k, x in enumerate(tr):
        s += x
        if k >= n:
            s -= tr[k - n]
        if k + 1 >= n:
            out[k + 1] = s / n
    return out


# ---- signal-time decisions ----------------------------------------------------------------------------------------
def _period_end_idx(bars: Sequence[Bar], tf: str, made: str) -> int:
    """First index of `bars` after the zone's stay-away period (the zone is known from the session after it)."""
    try:
        key = Z.period_key(tf, made)
    except (ValueError, TypeError):
        key = None
    i = len(bars)
    while i > 0 and bars[i - 1].d > made and (key is None or Z.period_key(tf, bars[i - 1].d) != key):
        i -= 1
    return i


def zone_used(bars: Sequence[Bar], sig: Dict, mode: str) -> bool:
    """fresh_body: a daily close at / below the proximal since the zone became known; fresh_depth25: a daily low at
    least 25% of the zone height under the proximal. bars = daily bars up to the decision day."""
    prox, dist = sig['proximal'], sig['distal']
    h = prox - dist
    start = _period_end_idx(bars, sig['tf'], sig.get('made') or '')
    for b in bars[start:]:
        if mode == 'fresh_body' and b.c <= prox:
            return True
        if mode == 'fresh_depth25' and b.l <= prox - FRESH_DEPTH * h:
            return True
    return False


def promote_fresh(sigs: List[Dict], bars: Sequence[Bar], mode: str) -> List[Dict]:
    """The day's BUYs under a looser freshness rule: the live BUYs plus the 'tested' WATCH zones whose ONLY failed
    rule is freshness (L2 · L52) and that are not used under `mode`; then one BUY per timeframe, the nearest
    (highest entry), like scan.symbol_signals. Limits: scan only reports tested zones with 1-2 touches that are not
    removed, so a zone with 3+ wick touches stays out."""
    buys = [s for s in sigs if s.get('kind') == 'BUY']
    for s in sigs:
        if s.get('kind') != 'WATCH' or s.get('watch') != 'tested':
            continue
        fails = [r for r in s.get('rules') or [] if r.get('status') == 'FAIL']
        if fails and all(r.get('ref') == 'L2 · L52' for r in fails) and not zone_used(bars, s, mode):
            buys.append({**s, 'kind': 'BUY', 'promoted': mode})
    best: Dict[str, Dict] = {}
    for s in buys:
        if s['tf'] not in best or s['entry'] > best[s['tf']]['entry']:
            best[s['tf']] = s
    return list(best.values())


def top_third(bars: Sequence[Bar], entry: float, n: int = RANGE_BARS) -> bool:
    w = bars[-n:]
    if len(w) < 2:
        return False
    lo, hi = min(b.l for b in w), max(b.h for b in w)
    return hi > lo and entry >= lo + 2.0 / 3.0 * (hi - lo)


def spy_below_sma(closes: Sequence[float], n: int = REGIME_SMA) -> bool:
    """SPY's last close below its n-day average. Unknown (fewer than n closes) = not below."""
    if len(closes) < n:
        return False
    return closes[-1] < sum(closes[-n:]) / n


def high_vol(bars: Sequence[Bar], window: int = VOL_WINDOW, pctl: float = VOL_PCTL) -> bool:
    """Daily ATR14 on the last bar in the top 10% of its last `window` values: at least 90% of them are lower."""
    a = [x for x in atr_series(bars[-(window + 15):])[-window:] if x > 0]
    if len(a) < window // 2:
        return False
    return sum(1 for x in a if x < a[-1]) >= pctl * len(a)


def stair_approach(bars: Sequence[Bar]) -> bool:
    """bars = the daily bars BEFORE the first touch session (that session excluded). Over the last 10: mean body
    |close - open| < 0.5 x ATR14 (ATR14 = mean true range of the 14 sessions ending with the last of these bars), or
    at least 2 small-range bases = runs of >= 2 consecutive bars each with a range (high - low) < 0.6 x ATR14."""
    if len(bars) < STAIR_BARS + 15:
        return False
    a = atr_last(bars)
    if a <= 0:
        return False
    w = bars[-STAIR_BARS:]
    if sum(abs(b.c - b.o) for b in w) / len(w) < STAIR_BODY_X * a:
        return True
    bases = run = 0
    for b in w:
        if b.h - b.l < STAIR_BASE_RANGE_X * a:
            run += 1
            if run == 2:
                bases += 1
        else:
            run = 0
    return bases >= STAIR_BASES


def tp_zone_target(sig: Dict, supplies: Sequence[float]) -> Tuple[Optional[float], bool]:
    """(target, ok): just before the nearest supply proximal above the entry; ok False when that is under 2.5R.
    No supply above: the live target (the 250% projection) is kept."""
    entry, stop = sig['entry'], sig['stop']
    above = [p for p in supplies if p * (1 - TP_OFFSET) > entry]
    if not above:
        return sig['target'], True
    t = min(above) * (1 - TP_OFFSET)
    return t, (t - entry) / (entry - stop) >= TP_ZONE_MIN_R


def weekly_atr(w1: Sequence[Bar], n: int = 14) -> float:
    return atr_last(w1, n)


def plan_for(vid: str, sig: Dict, k: Known) -> Optional[Dict]:
    """The order plan of variant `vid` for a live BUY signal (None = no trade today; the zone may be re-checked next
    week). Keys: entry, stop, target, distal, size, split, cancel_frac, stair, exit_rule."""
    p = {'entry': sig['entry'], 'stop': sig['stop'], 'target': sig['target'], 'distal': sig['distal'], 'size': 1.0,
         'split': False, 'cancel_frac': None, 'stair': False, 'exit_rule': None}
    if vid in BE_TRIGGER or vid in ('be_struct', 'time_stop'):
        p['exit_rule'] = vid
    elif vid == 'tp_fixed3':
        p['target'] = p['entry'] + TP_FIXED_R * (p['entry'] - p['stop'])
    elif vid == 'tp_zone':
        t, ok = tp_zone_target(sig, k.supplies)
        if not ok:
            return None
        p['target'] = t
    elif vid == 'cont_off':
        if sig.get('pattern') == 'RBR':
            return None
    elif vid == 'cont_nested':
        if sig.get('pattern') == 'RBR' and sig.get('loc') != 'inside':
            return None
    elif vid == 'stop_atr':
        a = weekly_atr(k.w1)
        if a > 0:
            p['stop'] = min(p['stop'], p['distal'] - STOP_ATR_X * a)
        if not p['target'] or (p['target'] - p['entry']) / (p['entry'] - p['stop']) < MIN_RR:
            return None
    elif vid == 'arrive_stair':
        p['stair'] = True
    elif vid == 'curve_top3':
        if top_third(k.bars, p['entry']):
            return None
    elif vid == 'cancel_50':
        p['cancel_frac'] = CANCEL_FRAC
    elif vid == 'market_regime':
        if spy_below_sma(k.spy_closes):
            return None
    elif vid == 'volreg_half':
        if high_vol(k.bars):
            p['size'] = 0.5
    elif vid == 'split_entry':
        p['split'] = True
    elif vid not in ('current', 'fresh_body', 'fresh_depth25'):
        raise ValueError(f'unknown or skipped variant {vid}')
    return p


# ---- order + exit simulation (walk-forward: a decision at session i reads bars up to i only) ----------------------
def place_order(bars: Sequence[Bar], d: int, entry: float, target: float, distal: float, life: int = ORDER_LIFE,
                cancel_frac: Optional[float] = None, stair: bool = False) -> Tuple[str, int, float, str]:
    """(status, fill index, fill price, cancel date) of a limit BUY at `entry` placed for session d + 1 on. Same rules
    as backtest.simulate (target first = cancel, filled only when traded THROUGH, at the open on a gap down, a close
    below the distal = cancel) plus: cancel_frac = cancel once a session's high went that share of the way to the
    target without a fill; stair = the order is withdrawn for any session after a stair-step approach (the 10
    sessions before it, stair_approach), and a first touch while withdrawn ends the setup."""
    n = len(bars)
    half = entry + cancel_frac * (target - entry) if cancel_frac else None
    touched = False
    for i in range(d + 1, min(n, d + 1 + life)):
        b = bars[i]
        if b.h >= target and b.l >= entry:
            return 'cancelled_target', -1, 0.0, b.d
        if stair and not touched and b.l <= entry:
            touched = True
            if stair_approach(bars[max(0, i - 40):i]):
                return 'cancelled_stair', -1, 0.0, b.d
        if b.l < entry:
            return 'filled', i, min(entry, b.o), ''
        if half is not None and b.h >= half:
            return 'cancelled_half', -1, 0.0, b.d
        if b.c < distal:
            return 'cancelled_removed', -1, 0.0, b.d
    return ('expired' if d + life < n else 'pending'), -1, 0.0, ''


def hold_end(bars: Sequence[Bar], fill_i: int, days: int = HOLD_DAYS) -> int:
    last = (dt.date.fromisoformat(bars[fill_i].d) + dt.timedelta(days=days)).isoformat()
    j = fill_i
    while j < len(bars) and bars[j].d <= last:
        j += 1
    return j


def run_exit(bars: Sequence[Bar], fill_i: int, fill: float, stop: float, target: float, risk: float,
             rule: Optional[str] = None, hold_days: int = HOLD_DAYS) -> Tuple[int, float, str, bool]:
    """Wick stop in the market (the live plan): (exit index, exit price, why, gap). rule None = backtest.run_exit
    'wick' exactly. be_1r / be_2r: once a high after the fill bar reached fill + kR, the stop is the fill price from
    the next session; be_struct: once +1.5R, the stop is raised to the lowest low since the fill (never lowered);
    time_stop: out at the close of the 20th session after the fill when no high reached +1R by then."""
    n = len(bars)
    end = hold_end(bars, fill_i, hold_days)
    cur, peak, low = stop, fill, fill
    moved = False
    for i in range(fill_i, end):
        b = bars[i]
        why = 'trail' if moved else 'stop'
        if i == fill_i:
            if fill <= cur:
                return i, fill, why, True
            if b.l <= cur:
                return i, cur, why, False
        else:
            if b.o <= cur:
                return i, b.o, why, True
            if b.l <= cur:
                return i, cur, why, False
            if b.o >= target:
                return i, b.o, 'target', False
            if b.h >= target:
                return i, target, 'target', False
            peak = max(peak, b.h)
        low = min(low, b.l)
        # decisions at this session's close, in force from the next session
        if rule in BE_TRIGGER and peak >= fill + BE_TRIGGER[rule] * risk and fill > cur:
            cur, moved = fill, True
        elif rule == 'be_struct' and peak >= fill + STRUCT_TRIGGER_R * risk and low > cur:
            cur, moved = low, True
        elif rule == 'time_stop' and i - fill_i == TIME_STOP_SESSIONS and peak < fill + TIME_STOP_R * risk:
            return i, b.c, 'time_stop', False
    i = end - 1
    still = end >= n and bars[-1].d < (dt.date.fromisoformat(bars[fill_i].d) + dt.timedelta(days=hold_days)).isoformat()
    return i, bars[i].c, 'open' if still else 'time', False


def excursion(bars: Sequence[Bar], fill_i: int, ex_i: int, fill: float, ex: float, why: str, risk: float) -> Tuple[float, float]:
    """(MFE, MAE) in R from the fill to the exit, both >= 0 (MAE = the adverse move's size), price only (no costs).
    The fill bar's high is left out (it may have printed before the fill), as is the exit bar's beyond a stop exit."""
    stopped = why in ('stop', 'trail')
    highs = [bars[j].h for j in range(fill_i + 1, ex_i)] + [ex]
    lows = [bars[j].l for j in range(fill_i, ex_i)]
    if ex_i > fill_i and not stopped and why != 'target':
        highs.append(bars[ex_i].h)
    lows.append(ex if stopped else bars[ex_i].l)
    mfe = max(0.0, (max(highs) - fill) / risk)
    mae = max(0.0, (fill - min(lows)) / risk)
    return round(mfe, 3), round(mae, 3)


def r_of(ex: float, fill: float, risk: float, cost_side: float) -> float:
    return (ex - fill) / risk - 2 * cost_side * fill / risk


def simulate(bars: Sequence[Bar], d: int, p: Dict, cost_side: float) -> Optional[Dict]:
    """One variant's trade from its plan: order, exit (wick stop), R after costs, MFE / MAE, sessions held. R is in
    units of the plan's risk (entry - stop) for a full position at the entry; size and split scale it."""
    entry, stop, target = p['entry'], p['stop'], p['target']
    risk = entry - stop
    if risk <= 0 or not target or target <= entry:
        return None
    st, fi, fill, cdate = place_order(bars, d, entry, target, p['distal'], cancel_frac=p.get('cancel_frac'), stair=p.get('stair'))
    if st != 'filled':
        return {'status': st, 'cancel_date': cdate} if cdate else {'status': st}
    ex_i, ex, why, gap = run_exit(bars, fi, fill, stop, target, risk, p.get('exit_rule'))
    r = r_of(ex, fill, risk, cost_side)
    last_i = ex_i
    out = {'status': 'filled', 'fill_date': bars[fi].d, 'fill': round(fill, 4), 'stop': round(stop, 4), 'target': round(target, 4)}
    if p.get('split'):
        mid = entry - 0.5 * (entry - p['distal'])
        r = 0.5 * r
        fb, fbp = -1, 0.0
        # the second half's limit lives while the first half is open (not on a target bar: the order of the moves
        # inside that bar is unknown), at most the order life; a close below the distal cancels it like the first
        lim = min(len(bars), d + 1 + ORDER_LIFE, ex_i + (0 if why == 'target' else 1))
        for i in range(fi, lim):
            b = bars[i]
            if b.l < mid:
                fb, fbp = i, min(mid, b.o)
                break
            if b.c < p['distal']:
                break
        out['second_fill'] = bars[fb].d if fb >= 0 else None
        if fb >= 0:
            e2, x2, why2, _ = run_exit(bars, fb, fbp, stop, target, risk)
            if why2 == 'open' or why == 'open':
                why = 'open'
            r += 0.5 * r_of(x2, fbp, risk, cost_side)
            last_i = max(last_i, e2)
    r *= p.get('size', 1.0)
    mfe, mae = excursion(bars, fi, ex_i, fill, ex, why, risk)
    out.update({'exit_date': bars[last_i].d, 'exit_i': last_i, 'why': why, 'gap': gap, 'r': round(r, 4),
                'mfe_r': mfe, 'mae_r': mae, 'bars': ex_i - fi, 'size': p.get('size', 1.0)})
    return out
