"""Experiment variants of the live FX rules: each one = the current rules with ONE change.

Tested by tools/fx_scanner/fx_backtest.py (public/learn/fx_experiments.json, read by tools/learn/learner.py, which adopts a
variant only when it beats `current` out of sample). The live scanner is meant to import these SAME functions once a
variant is adopted, so the adopted rule is exactly the tested code.

Every function here is pure and takes only data known at the moment of the decision:
  * signal-time decisions (select / adjust): the signal candidate dict built from the analysis at that H4 close
    (bars closed at that time, zones of that time);
  * pending-order decisions (stair_approach, cancel_50): the entry-TF bars closed BEFORE the bar being decided, or the
    bar's own extreme for a cancel that takes effect from the next bar on;
  * open-trade decisions (managed_stop, time_exit): the excursion so far (bars up to the one just closed); a new stop
    applies from the NEXT bar.

Candidate dict (fx_backtest.candidates) keys used here: tf, d (+1 / -1), prox, distal, entry, stop, target, rr, cont
(RBR / DBD), fails (set of failing rule short names of fxcore.zone_rules), used_body / used_depth (visits that count
as 'used' under the two freshness readings, only when the current 'fresh' rule fails), nested (continuation zone's
proximal inside a not-removed same-side zone of the next higher TF), mn_pos (price position in the last 24 closed MN
bars, 0 = low, 1 = high), opp_prox (proximals of the not-removed opposite zones of the entry TF and higher, any order),
tp_off, spread, atr (ATR14 of the zone TF at the newest closed bar), atr_hist (ATR14 values of the entry TF, newest
first, up to 250), htf_trend (zones.trend_side of the next higher TF row: +1 up, -1 down, 0 none).
"""
from __future__ import annotations

from typing import Dict, List, Optional, Sequence, Tuple

# ---- variant table ------------------------------------------------------------------------------------------------
VARIANTS: Dict[str, Dict[str, str]] = {
    'current': {'group': 'baseline', 'kind': 'filter', 'desc': 'The live rules unchanged (the baseline every variant is compared with).'},
    # exits
    'be_1r': {'group': 'exit', 'kind': 'exit', 'desc': 'Move the stop to the entry once the trade has been +1R in profit.'},
    'be_2r': {'group': 'exit', 'kind': 'exit', 'desc': 'Move the stop to the entry once the trade has been +2R in profit.'},
    'be_struct': {'group': 'exit', 'kind': 'exit', 'desc': 'After +1.5R, move the stop to the lowest low (buy) / highest high (sell) since the fill, only ever tightening.'},
    'time_stop': {'group': 'exit', 'kind': 'exit', 'desc': 'Close the trade at the bar close if it has not reached +1R within 10 entry-timeframe bars after the fill.'},
    'tp_fixed3': {'group': 'exit', 'kind': 'exit', 'desc': 'Target exactly 3R instead of the next opposite zone.'},
    'tp_zone': {'group': 'exit', 'kind': 'exit', 'desc': 'Target just before the nearest opposite zone of the entry timeframe or higher; skip the trade if that is under 2.5R.'},
    # freshness
    'fresh_body': {'group': 'freshness', 'kind': 'filter', 'desc': 'A zone counts as used only after a candle body went inside it; wick-only touches keep it fresh.'},
    'fresh_depth25': {'group': 'freshness', 'kind': 'filter', 'desc': 'A zone counts as used only after price went at least 25% of the zone height inside it.'},
    # continuation zones
    'cont_off': {'group': 'continuation', 'kind': 'filter', 'desc': 'Never trade continuation zones (rally-base-rally / drop-base-drop).'},
    'cont_nested': {'group': 'continuation', 'kind': 'filter', 'desc': 'Trade a continuation zone only when its proximal lies inside a same-side zone of the next higher timeframe.'},
    'cont_htf': {'group': 'continuation', 'kind': 'filter', 'desc': 'Trade continuation zones only on the daily timeframe and higher.'},
    # stops
    'stop_atr': {'group': 'stop', 'kind': 'exit', 'desc': 'Stop at the wider of the current stop and the distal plus 1x the 14-bar ATR of the zone timeframe.'},
    'stop_tight': {'group': 'stop', 'kind': 'exit', 'desc': 'Remove the volatility floor of the stop.'},
    # filters
    'arrive_stair': {'group': 'filter', 'kind': 'filter', 'desc': 'Skip the trade when price crawled into the zone (small candles or two or more basing pauses in the last 10 bars).'},
    'curve_top3': {'group': 'filter', 'kind': 'filter', 'desc': 'No buys in the top third and no sells in the bottom third of the last 2 years of monthly range.'},
    'cancel_50': {'group': 'filter', 'kind': 'filter', 'desc': 'Cancel the pending order once price has moved half way from the entry to the target without filling.'},
    'volreg_half': {'group': 'size', 'kind': 'size', 'desc': 'Half size when the entry-timeframe ATR is in the top 10% of its last 250 values.'},
    'ct_half': {'group': 'size', 'kind': 'size', 'desc': 'Half size when the trade goes against the trend of the next higher timeframe.'},
    'split_entry': {'group': 'size', 'kind': 'size', 'desc': 'Half the position at the proximal, half at the middle of the zone, same stop and target.'},
}

SKIPPED: Dict[str, str] = {
    'stop_tight': ('no volatility floor to remove: the stop is distal +/- fxcfg.SL_PCT % of the zone height with a fixed '
                   '3-pip minimum (fxcfg.SL_MIN_PIPS), no ATR term (zones.stop_buffer)'),
}

# ---- parameters (documented in docs/research/FX_Backtest.md) ---------------------------------------------------------
BE_AT = {'be_1r': 1.0, 'be_2r': 2.0}
STRUCT_AT = 1.5
TIME_BARS = 10
H4_PER_BAR = {'H1': 1, 'H4': 1, 'D1': 6, 'W1': 30, 'MN': 130}   # entry-TF bar in H4 bars (time stop on the H4 replay)
FIXED_R = 3.0
TP_ZONE_MIN_R = 2.5
STOP_ATR_X = 1.0
STAIR_N = 10
STAIR_BODY_ATR = 0.5
STAIR_BASES = 2
CURVE_MONTHS = 24
CURVE_MIN_MONTHS = 6
VOL_N = 250
VOL_MIN_N = 50
VOL_Q = 0.90
CANCEL_FRAC = 0.5
ROOM_MIN_R = 2.0                    # the scanner's room rule (fxcore.zone_rules 'room'), re-applied by stop_atr
FRESH_DEPTH = 0.25


def experiment_ids() -> List[str]:
    """The variants the backtest runs (current excluded: it is the baseline 'full')."""
    return [k for k in VARIANTS if k != 'current' and k not in SKIPPED]


# ---- bar helpers ------------------------------------------------------------------------------------------------------
def atr14(bars: Sequence, n: int = 14) -> float:
    """Simple mean true range of the last n bars (oldest first; .o .h .l .c), 0.0 when too short."""
    if len(bars) < n + 1:
        return 0.0
    tr = [max(b.h, a.c) - min(b.l, a.c) for a, b in zip(bars[-n - 1:-1], bars[-n:])]
    return sum(tr) / n


# ---- zone freshness ---------------------------------------------------------------------------------------------------
def zone_used(bars: Sequence, d: int, prox: float, dist: float, how: str) -> int:
    """Visits of a zone that count as 'used'. bars = every closed bar after the zone's stay-away candle (oldest
    first; the zone TF's closed bars, then the lower-TF closed bars of its forming bar). A visit = a run of bars whose
    wick reaches the proximal (the scanner's touch, zones.dna); it counts as used when, within it, a bar
      how='body'   : has its body inside the zone (demand: min(open, close) <= proximal; supply mirrored),
      how='depth25': went >= 25% of the zone height beyond the proximal (demand: low <= proximal - 0.25 x height)."""
    h = abs(prox - dist)
    n, in_t, used = 0, False, False
    for b in bars:
        touch = (b.l <= prox) if d > 0 else (b.h >= prox)
        if not touch:
            in_t, used = False, False
            continue
        if how == 'body':
            q = (min(b.o, b.c) <= prox) if d > 0 else (max(b.o, b.c) >= prox)
        else:
            q = (b.l <= prox - FRESH_DEPTH * h) if d > 0 else (b.h >= prox + FRESH_DEPTH * h)
        if not in_t:
            in_t, used = True, False
        if q and not used:
            used = True
            n += 1
    return n


# ---- signal-time selection (before the scanner's one-per-TF-and-side choice) -----------------------------------------
def select(vid: str, c: Dict) -> bool:
    """Is candidate c a BUY / SELL of variant vid? (current: every rule passes)."""
    fails = c['fails']
    if vid in ('fresh_body', 'fresh_depth25'):
        if not fails:
            return True                       # untouched = fresh under every reading
        key = 'used_body' if vid == 'fresh_body' else 'used_depth'
        return set(fails) == {'fresh'} and c.get(key) == 0
    if fails:
        return False
    if vid == 'cont_off':
        return not c['cont']
    if vid == 'cont_nested':
        return not c['cont'] or bool(c.get('nested'))
    if vid == 'cont_htf':
        return not c['cont'] or c['tf'] not in ('H1', 'H4')
    return True


# ---- signal-time adjustments (after the choice): the order plan, or None = skip --------------------------------------
def mn_range_pos(mn: Sequence, price: float, n: int = CURVE_MONTHS) -> Optional[float]:
    """Price position in the high-low range of the last n CLOSED MN bars (0 = low, 1 = high), None when < 6 bars."""
    xs = list(mn[-n:])
    if len(xs) < CURVE_MIN_MONTHS:
        return None
    lo, hi = min(b.l for b in xs), max(b.h for b in xs)
    if hi <= lo:
        return None
    return min(1.0, max(0.0, (price - lo) / (hi - lo)))


def curve_top3_ok(d: int, pos: Optional[float]) -> bool:
    if pos is None:
        return True
    return pos <= 2 / 3 if d > 0 else pos >= 1 / 3


def tp_zone_target(d: int, entry: float, stop: float, opp_prox: Sequence[float], tp_off: float, spread: float,
                   min_r: float = TP_ZONE_MIN_R) -> Optional[float]:
    """Target tp_off before the nearest opposite proximal beyond the entry (sell: + spread, hit on the ask), None when
    there is none or it gives < min_r R."""
    ahead = [p for p in opp_prox if d * (p - entry) > 0]
    if not ahead:
        return None
    o = min(ahead, key=lambda p: d * p)
    t = o - d * tp_off + (spread if d < 0 else 0.0)
    risk = d * (entry - stop)
    if risk <= 0 or d * (t - entry) < min_r * risk:
        return None
    return t


def stop_atr_stop(d: int, stop: float, distal: float, atr: float, spread: float) -> float:
    """The wider of the scanner's stop and distal -/+ 1x ATR14 (sell: + spread, the stop is hit on the ask)."""
    if atr <= 0:
        return stop
    alt = distal - STOP_ATR_X * atr if d > 0 else distal + STOP_ATR_X * atr + spread
    return min(stop, alt) if d > 0 else max(stop, alt)


def vol_high(atr_hist: Sequence[float]) -> bool:
    """The newest ATR14 (atr_hist[0], newest first) is >= the 90th percentile (nearest rank) of the last 250 values
    (itself included); False with < 50 values."""
    xs = [a for a in list(atr_hist)[:VOL_N] if a > 0]
    if len(xs) < VOL_MIN_N or atr_hist[0] <= 0:
        return False
    s = sorted(xs)
    return atr_hist[0] >= s[min(len(s) - 1, int(VOL_Q * len(s)))]


def counter_trend(d: int, htf_trend: int) -> bool:
    return htf_trend == -d


def split_entries(d: int, entry: float, prox: float, distal: float) -> List[Tuple[float, float]]:
    """[(limit, weight)]: half at the scanner's entry (proximal, + spread on a buy), half at the zone middle (same
    spread offset)."""
    mid = entry + (prox + distal) / 2 - prox
    return [(entry, 0.5), (mid, 0.5)]


def adjust(vid: str, c: Dict) -> Optional[Dict]:
    """The order plan of variant vid for a selected candidate: {'legs': [(limit, weight)], 'stop', 'target', 'size',
    'rule' (exit rule id or ''), 'cancel50', 'stair'}; None = the variant skips this signal."""
    d, entry, stop, target = c['d'], c['entry'], c['stop'], c['target']
    out = {'legs': [(entry, 1.0)], 'stop': stop, 'target': target, 'size': 1.0, 'rule': '', 'cancel50': False, 'stair': False}
    if vid in ('be_1r', 'be_2r', 'be_struct', 'time_stop'):
        out['rule'] = vid
    elif vid == 'tp_fixed3':
        out['target'] = entry + FIXED_R * (entry - stop)      # entry +/- 3x the risk
    elif vid == 'tp_zone':
        t = tp_zone_target(d, entry, stop, c.get('opp_prox') or (), c.get('tp_off', 0.0), c.get('spread') or 0.0)
        if t is None:
            return None
        out['target'] = t
    elif vid == 'stop_atr':
        s = stop_atr_stop(d, stop, c['distal'], c.get('atr') or 0.0, c.get('spread') or 0.0)
        risk = d * (entry - s)
        if risk <= 0 or d * (target - entry) < ROOM_MIN_R * risk:
            return None                     # the scanner's room rule (>= 2x the stop) on the wider stop
        out['stop'] = s
    elif vid == 'curve_top3':
        if not curve_top3_ok(d, c.get('mn_pos')):
            return None
    elif vid == 'arrive_stair':
        out['stair'] = True
    elif vid == 'cancel_50':
        out['cancel50'] = True
    elif vid == 'volreg_half':
        out['size'] = 0.5 if vol_high(c.get('atr_hist') or [0.0]) else 1.0
    elif vid == 'ct_half':
        out['size'] = 0.5 if counter_trend(d, c.get('htf_trend', 0)) else 1.0
    elif vid == 'split_entry':
        out['legs'] = split_entries(d, entry, c['prox'], c['distal'])
    return out


# ---- pending-order decisions ------------------------------------------------------------------------------------------
def stair_approach(bars: Sequence) -> bool:
    """A slow / stair-step approach. bars = the entry-TF bars CLOSED before the bar that touches the entry (oldest
    first, >= 25 for the ATR). Over the last 10 of them: mean |close - open| < 0.5 x ATR14 (ATR14 measured on the
    14 bars before those 10), or >= 2 bases, a base = a run of >= 2 consecutive basing candles (body < 50% of the
    range, the Raja base candle) or inside bars (high <= previous high and low >= previous low). False when there
    are not enough bars."""
    if len(bars) < STAIR_N + 15:
        return False
    win = list(bars[-STAIR_N:])
    atr = atr14(list(bars[:-STAIR_N]))
    if atr <= 0:
        return False
    if sum(abs(b.c - b.o) for b in win) / STAIR_N < STAIR_BODY_ATR * atr:
        return True
    prev = bars[-STAIR_N - 1]
    bases, run = 0, 0
    for b in win:
        rng = b.h - b.l
        basing = rng <= 0 or abs(b.c - b.o) / rng < 0.5
        inside = b.h <= prev.h and b.l >= prev.l
        if basing or inside:
            run += 1
            if run == 2:
                bases += 1
        else:
            run = 0
        prev = b
    return bases >= STAIR_BASES


def cancel_50(d: int, entry: float, target: float, fav: float) -> bool:
    """Price (fav = the bar's high on a buy / low on a sell, the target-side quote) moved >= 50% of the way from the
    entry to the target."""
    return d * (fav - entry) >= CANCEL_FRAC * d * (target - entry) > 0


# ---- open-trade decisions ---------------------------------------------------------------------------------------------
def managed_stop(rule: str, d: int, entry: float, stop: float, mfe_r: float, ext: Optional[float]) -> float:
    """The stop for the next bar. mfe_r = the best excursion so far in R (exit-side quotes, the fill bar's
    favourable side not counted); ext = the lowest exit-side low (buy) / highest exit-side high (sell) since the fill.
    Only ever tightens."""
    new = stop
    if rule in BE_AT and mfe_r >= BE_AT[rule]:
        new = entry
    elif rule == 'be_struct' and mfe_r >= STRUCT_AT and ext is not None:
        new = ext
    return max(stop, new) if d > 0 else min(stop, new)


def time_exit(rule: str, tf: str, bars_after_fill: int, mfe_r: float) -> bool:
    """time_stop: True at the close of the 10th entry-TF bar after the fill bar when +1R was never reached."""
    return rule == 'time_stop' and bars_after_fill >= TIME_BARS * H4_PER_BAR.get(tf, 1) and mfe_r < 1.0


# ---- exact definitions (the per-variant sections of docs/research/FX_Backtest.md) -------------------------------------
DEFINITIONS: Dict[str, str] = {
    'current': 'fxcore.signals unchanged: every rule passes, one BUY / SELL per (TF, side) = the zone nearest to price, '
               'limit at the proximal (+ spread on a buy), the scanner\'s stop and target.',
    'be_1r': 'Once the best exit-side excursion since the fill (bars after the fill bar) reaches +1.0R, the stop moves '
             'to the entry (exit at R = 0, a gap through it exits at the open). Checked at each H4 close, applies from '
             'the next bar; the bar that reaches +1R cannot also be stopped at break-even (unknown intra-bar order).',
    'be_2r': 'As be_1r with the trigger at +2.0R.',
    'be_struct': 'Once the excursion reached +1.5R, the stop moves to the lowest bid low (buy) / highest ask high (sell) '
                 'of the H4 bars since the fill (the fill bar included: its low comes at / after the fill), only ever '
                 'tightening. The extreme of the entry-TF bars since the fill equals the extreme of their H4 bars, so '
                 'H4 bars are used for every entry TF.',
    'time_stop': 'If +1R was never reached, the trade closes at the bid (buy) / ask (sell) close of the 10th entry-TF '
                 'bar after the fill bar (H4 entry 10 H4 bars, D1 entry 60 H4 bars = 10 forex days); stop / target '
                 'are checked first in that bar.',
    'tp_fixed3': 'Target = entry + 3 x (entry - stop) (sell mirrored); the pending order is "missed" when that target '
                 'trades first, as for the scanner target.',
    'tp_zone': 'Target = 7 pips (fxcfg.TP_OFFSET_PIPS) before the nearest not-removed opposite zone of the entry TF or '
               'higher (H4 entry: H4, D1, W1, MN, 3M; a D1 entry ignores H4 zones) whose proximal is beyond the entry '
               '(sell: + spread), from the zones at signal time; no such zone or < 2.5R -> the signal is skipped.',
    'fresh_body': 'The fresh rule (fxcore "fresh") counts a visit (a run of bars whose wick reaches the proximal) as a '
                  'test only when a bar of it has its body inside the zone (demand: min(open, close) <= proximal), '
                  'on the zone TF\'s closed bars after the stay-away candle plus the H4 bars of its forming bar. '
                  'Applies to the entry zone only (the HTF host checks keep the scanner\'s count).',
    'fresh_depth25': 'As fresh_body, but a visit counts only when a bar of it went >= 25% of the zone height beyond '
                     'the proximal (demand: low <= proximal - 0.25 x height).',
    'cont_off': 'Signals on RBR / DBD (continuation) zones are dropped before the one-per-TF-and-side choice.',
    'cont_nested': 'An RBR / DBD zone is kept only when its proximal lies inside (low..high) a not-removed same-side '
                   'zone of the next higher TF (H4 -> D1, D1 -> W1), stricter than the location rule\'s overlap with '
                   'a tolerance band.',
    'cont_htf': 'RBR / DBD zones are kept only on D1 and higher (H1 / H4 continuation zones dropped).',
    'stop_atr': 'Stop = the wider of the scanner\'s stop and distal -/+ 1.0 x ATR14 of the zone TF at signal time '
                '(sell: + spread). The target price is kept; 1R = the new entry-to-stop distance, and the scanner\'s '
                'room rule (target >= 2x the stop) is re-applied to the wider stop (else skipped).',
    'stop_tight': 'Skipped: the scanner has no volatility floor on the stop.',
    'arrive_stair': 'At the H4 bar that would fill, the entry-TF bars closed BEFORE that bar are checked (H4 bars for '
                    'an H4 entry, D1 bars for a D1 entry): over the last 10, mean |close - open| < 0.5 x ATR14 (ATR '
                    'of the 14 bars before those 10), or >= 2 bases, a base = >= 2 consecutive basing candles (body < '
                    '50% of the range) or inside bars. If so the order is cancelled instead of filled. Equivalent to a '
                    'trader pulling the order while the approach is a stair and cancelling once price traded through '
                    'it: the decision uses closed bars only.',
    'curve_top3': 'No BUY when price is in the top third (> 2/3) and no SELL in the bottom third (< 1/3) of the '
                  'high-low range of the last 24 closed MN bars at signal time (fewer than 6 MN bars: no filter).',
    'cancel_50': 'A pending order is cancelled after an H4 bar in which the target-side quote (bid high on a buy, ask '
                 'low on a sell) moved >= 50% of the way from the entry to the target without filling (a bar that '
                 'fills counts as a fill, like the scanner\'s "missed" rule).',
    'volreg_half': 'Half size (R x 0.5) when the entry TF\'s ATR14 at signal time is >= the 90th percentile (nearest '
                   'rank) of its last 250 ATR14 values (fewer than 50 values: full size). MFE / MAE stay in price R.',
    'ct_half': 'Half size (R x 0.5) when the next higher TF row\'s trend (zones.trend_side: TREND / CHANGED / TURN '
               'side of the D1 row for an H4 entry, W1 for D1) is against the signal.',
    'split_entry': 'Two limit orders of half size: the scanner\'s entry and the zone middle (+ spread on a buy), same '
                   'stop, target and expiry. Trade R = sum(0.5 x leg PnL) / sum(0.5 x leg risk) over both legs (1R = '
                   'the loss when both fill and stop); a trade exists when the first leg filled. MFE / MAE / bars from '
                   'the proximal leg.',
}
