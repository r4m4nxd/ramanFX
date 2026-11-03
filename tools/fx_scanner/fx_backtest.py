"""Walk-forward backtest of the live FX rules on real OANDA history (no look-ahead).

    python tools/fx_scanner/fx_backtest.py                         # every scanned instrument, max history
    python tools/fx_scanner/fx_backtest.py --instruments watchlist # the owner's watchlist only
    python tools/fx_scanner/fx_backtest.py --instruments EURUSD,XAUAUD --years 5 --max-instruments 10
    python tools/fx_scanner/fx_backtest.py --selftest              # synthetic data, no network

How it works
  * Data: OANDA H4 (bid + ask OHLC, mid = their average), D, W, M (mid) since 2005, paged 5000 candles per request,
    cached in <FX_CACHE>/bt (actions/cache in .github/workflows/fx-backtest.yml).
  * At every H4 close t of the test period the SAME functions the live scanner calls (fxcore.analyse + fxcore.signals)
    run on the bars that were CLOSED at t (H4 / D1 / W1 / MN, capped at the scanner's KEEP_BARS) and the typical
    spread of the last 50 H4 closes up to t. A BUY / SELL whose zone (tf, side, base start) has not signalled before
    becomes a limit order at the proximal, with the scanner's stop and target.
  * Fill / exit on the following H4 bars with bid / ask prices (mid +- half the spread when a side is missing):
    BUY fills when the ask trades at / through the entry; its stop triggers on the bid low, its target on the bid
    high (SELL mirrored). The spread is thus paid on entry and exit. Conservative: the fill bar checks only the stop
    (stop first, the target is not credited in the fill bar); a gap through the stop exits at the open; fills are at
    the limit price even when the market opened better.
  * A pending order is cancelled when it is not filled within the expiry (per entry TF), when a mid close goes
    beyond the zone's distal (zone removed) or when price reaches the target first (missed).
  * Ablations: full rules, without the top-down nesting rule ('location'), without the spread filter, and the
    full-rule trades of the watchlist majors only. fxcore.analyse runs ONCE per H4 close and fxcore.zone_rules once
    per zone (candidates(): every zone that fails at most the 'location' / 'spread' / 'fresh' rules, with its failing
    rules); a variant = the zones whose failing rules it ignores, then fxcore.signals' one-per-(TF, side) choice
    (nearest to price). For the full rules this is exactly fxcore.signals' BUY / SELL list (tests check it).
  * Experiments (fxexperiments.py, one change each vs the current rules: exits, freshness, continuation zones, stops,
    filters, size): the same shared candidates, filtered / re-planned by fxexperiments.select / adjust at signal time
    and simulated with the same fill rules (+ the exit / pending-order rules of fxexperiments.py, causal per bar).
    MFE / MAE (R) and bars held are recorded per trade. The whole matrix runs on three BASES (BASES: current,
    no_nesting = location ignored, loose = location + spread ignored); the strictest base with >= 150 in-sample
    trades (else the one with the most) is written to public/learn/fx_experiments.json (schema 1, read by
    tools/learn/learner.py; 'baseline' / 'base_rules' = that base, 'bases' = every base's stats), all three to
    public/learn/fx_experiments_all.json ('sets'), + an experiments section in the report. --no-experiments skips them.
  * Stats per variant x (class / entry TF / zone type / pattern / Raja score / side), in-sample (older 70% of the
    test period) vs out-of-sample (recent 30%), bootstrap 95% CI of the expectancy (R per trade).

Outputs: public/fx/backtest.json (summary), public/learn/fx_experiments.json (experiments) and
docs/research/FX_Backtest.md (report); the summary tables are printed.
"""
from __future__ import annotations

import argparse
import bisect
import datetime as dt
import json
import math
import os
import random
import sys
import time
from dataclasses import asdict, dataclass
from typing import Callable, Dict, Iterable, List, Optional, Sequence, Tuple

HERE = os.path.dirname(os.path.abspath(__file__))
STOCK = os.path.join(os.path.dirname(HERE), 'stock_scanner')
for _p in (HERE, STOCK, os.path.join(HERE, 'fixtures')):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import data as SD  # noqa: E402
import fxexperiments as X  # noqa: E402
import fxcfg as C  # noqa: E402
import fxcore as F  # noqa: E402
import oanda as O  # noqa: E402
import watchlist as W  # noqa: E402
import zones as Z  # noqa: E402
from zones import Bar  # noqa: E402

BT_CACHE = os.path.join(C.CACHE, 'bt')
OUT_JSON = os.path.join(C.OUT_DIR, 'backtest.json')
OUT_MD = os.path.join(C.ROOT, 'docs', 'research', 'FX_Backtest.md')
OUT_EXP = os.path.join(C.ROOT, 'public', 'learn', 'fx_experiments.json')
OUT_EXP_ALL = os.path.join(C.ROOT, 'public', 'learn', 'fx_experiments_all.json')
HISTORY_START = '2005-01-01T00:00:00Z'
EXPIRY_DAYS = {'H1': 2, 'H4': 5, 'D1': 15, 'W1': 45, 'MN': 120}   # H1: the live scanner only (H4-based replay)
VARIANTS = {'full': (), 'no_nesting': ('location',), 'no_spread': ('spread',), 'loose': ('location', 'spread')}
# experiment bases (strictest first): the rules every experiment variant changes ONE thing of; key = its order list
BASES = {'current': ('full', ()), 'no_nesting': ('no_nesting', ('location',)), 'loose': ('loose', ('location', 'spread'))}
BASE_DESC = {'current': 'The live rules unchanged (the baseline every variant is compared with).',
             'no_nesting': 'The live rules with the top-down nesting (location) rule ignored.',
             'loose': 'The live rules with the top-down nesting (location) and spread rules ignored.'}
BASE_MIN_IS = 150                                  # the strictest base with >= this many in-sample trades is chosen
VARIANT_LABEL = {'full': '(a) full rules', 'no_nesting': '(b) without top-down nesting', 'loose': '(e) without nesting + spread',
                 'no_spread': '(c) without spread filter', 'watchlist_majors': '(d) watchlist majors only'}
IS_FRAC = 0.70
BOOT_N = 2000
CLOSED = ('target', 'stop', 'time')
FILLED = ('target', 'stop', 'time', 'open')
RELAX = frozenset(('location', 'spread', 'fresh'))  # rules a candidate may fail (ablations / freshness variants)
MINORS = ('EUR', 'GBP', 'JPY', 'CHF')
BONDS = ('USB', 'DE10YB', 'UK10YB')


# ---- instrument classes --------------------------------------------------------------------------------------------
def bt_class(inst: Dict) -> str:
    """majors (USD vs G8), minors (crosses of EUR / GBP / JPY / CHF), crosses (other G8 crosses), exotics, metals,
    indices, commodities (other CFDs)."""
    name = inst['name']
    c = inst.get('cls') or C.fx_class(name, inst.get('type') or 'CURRENCY')
    if c == 'major':
        return 'majors'
    if c == 'cross':
        a, _, b = name.partition('_')
        return 'minors' if a in MINORS and b in MINORS else 'crosses'
    if c == 'exotic':
        return 'exotics'
    if c == 'metal':
        return 'metals'
    base = name.partition('_')[0]
    return 'indices' if any(ch.isdigit() for ch in base) and not base.startswith(BONDS) else 'commodities'


# ---- quotes (H4 bid / ask) -----------------------------------------------------------------------------------------
@dataclass
class Q:
    """One H4 bar: label (forex-time start), bid OHLC, ask OHLC."""
    d: str
    bo: float
    bh: float
    bl: float
    bc: float
    ao: float
    ah: float
    al: float
    ac: float

    @property
    def mid(self) -> Bar:
        return Bar(self.d, (self.bo + self.ao) / 2, (self.bh + self.ah) / 2, (self.bl + self.al) / 2, (self.bc + self.ac) / 2)

    @property
    def bid(self) -> Bar:
        return Bar(self.d, self.bo, self.bh, self.bl, self.bc)

    @property
    def spread(self) -> float:
        return self.ac - self.bc


def quote_from_mid(b: Bar, spread: float) -> Q:
    """mid +- half the spread (when the feed has no bid / ask)."""
    h = spread / 2
    return Q(b.d, b.o - h, b.h - h, b.l - h, b.c - h, b.o + h, b.h + h, b.l + h, b.c + h)


# ---- clock: when a bar of each TF is closed ---------------------------------------------------------------------------
def _p(lbl: str) -> dt.datetime:
    return dt.datetime.strptime(lbl[:16], '%Y-%m-%dT%H:%M')


def _s(t: dt.datetime) -> str:
    return t.strftime('%Y-%m-%dT%H:%M')


def bar_end(lbl: str, tf: str) -> str:
    """Forex-time label at which the bar starting at lbl closes."""
    t = _p(lbl)
    if tf == 'H4':
        return _s(t + dt.timedelta(hours=4))
    if tf == 'D1':
        return _s(t + dt.timedelta(days=1))
    if tf == 'W1':
        return _s(t + dt.timedelta(days=7))
    y, m = (t.year + 1, 1) if t.month == 12 else (t.year, t.month + 1)
    return f'{y:04d}-{m:02d}-01T00:00'


def add_days(lbl: str, days: float) -> str:
    return _s(_p(lbl) + dt.timedelta(days=days))


# ---- orders / fills ------------------------------------------------------------------------------------------------
@dataclass
class Order:
    inst: str
    sym: str
    cls: str
    wl: bool
    tf: str
    d: int                              # +1 BUY, -1 SELL
    entry: float
    stop: float
    target: float
    distal: float
    signal: str                         # label of the H4 bar at whose close the signal appeared
    expires: str                        # a bar starting at / after this label cancels a pending order
    zone_type: str = ''
    pattern: str = ''
    score: int = 0
    rr: float = 0.0
    spread_pips: Optional[float] = None
    status: str = 'pending'             # pending, open, target, stop, expired, invalidated, missed
    fill: Optional[str] = None
    exit_t: Optional[str] = None
    exit_px: Optional[float] = None
    r: Optional[float] = None
    # experiments (fxexperiments.py): exit rule, size, pending-order filters, split legs; excursions of the trade
    rule: str = ''                      # exit rule id ('' = the scanner's fixed stop / target)
    size: float = 1.0                   # position size (R counted x size)
    cancel50: bool = False
    stair: bool = False
    group: str = ''                     # split_entry: the legs of one trade share a group
    weight: float = 1.0                 # split_entry: the leg's share of the position
    risk0: float = 0.0                  # the planned risk (entry to the initial stop): 1R, also after a stop move
    mfe: float = 0.0                    # max favourable excursion in R, fill to exit (exit-side quotes)
    mae: float = 0.0                    # max adverse excursion in R (positive = against), fill to exit
    bars: int = 0                       # H4 bars held after the fill bar
    ext: Optional[float] = None         # lowest exit-side low (buy) / highest high (sell) since the fill

    def __post_init__(self):
        if not self.risk0:
            self.risk0 = self.d * (self.entry - self.stop)

    @property
    def risk(self) -> float:
        return self.d * (self.entry - self.stop)

    def _close(self, q: Q, px: float, why: str) -> None:
        self.status, self.exit_t, self.exit_px = why, q.d, px
        self.r = self.d * (px - self.entry) / self.risk0 if self.risk0 > 0 else 0.0


def step(o: Order, q: Q, stair_before: Optional[Callable[[Order], bool]] = None) -> None:
    """Advance one order by one H4 bar (bars strictly after the signal bar). Conservative intra-bar order:
    fill bar -> stop only; open trade -> stop before target; a gap through the stop exits at the open.
    Experiments (fxexperiments.py): o.stair -> a bar that would fill cancels the order instead when stair_before(o) (the
    entry-TF bars closed BEFORE this bar) says the approach was a stair; o.cancel50 -> cancelled after a bar that
    moved half way to the target without filling (a bar that also fills counts as a fill, like 'missed'); o.rule ->
    the stop for the next bar / a time exit at this bar's close, from the excursion up to this bar.
    Excursions: MAE counts the fill bar's adverse side (the low of a buy's fill bar comes at / after the fill), MFE
    starts on the bar after the fill (the fill bar's high may come before the fill); a stop exit bar adds only the
    realised loss to MAE, a target bar caps MFE at the target."""
    d, E, S, T = o.d, o.entry, o.stop, o.target
    R0 = o.risk0 if o.risk0 > 0 else 1.0
    if o.status == 'pending':
        if q.d >= o.expires:
            o.status, o.exit_t = 'expired', q.d
            return
        filled = q.al <= E if d > 0 else q.bh >= E
        if filled:
            if o.stair and stair_before is not None and stair_before(o):
                o.status, o.exit_t = 'filtered', q.d
                return
            o.status, o.fill = 'open', q.d
            adv = q.bl if d > 0 else q.ah
            o.ext = adv
            if (q.bl <= S) if d > 0 else (q.ah >= S):
                o._close(q, min(S, q.bo) if d > 0 else max(S, q.ao), 'stop')
                o.mae = max(0.0, -o.r)
            else:
                o.mae = max(0.0, d * (E - adv) / R0)
            return
        mid_c = (q.bc + q.ac) / 2
        if d * (mid_c - o.distal) < 0:
            o.status, o.exit_t = 'invalidated', q.d
        elif (q.bh >= T) if d > 0 else (q.al <= T):
            o.status, o.exit_t = 'missed', q.d
        elif o.cancel50 and X.cancel_50(d, E, T, q.bh if d > 0 else q.al):
            o.status, o.exit_t = 'cancelled', q.d
        return
    if o.status == 'open':
        o.bars += 1
        adv, fav = (q.bl, q.bh) if d > 0 else (q.ah, q.al)
        if (adv <= S) if d > 0 else (adv >= S):
            o._close(q, min(S, q.bo) if d > 0 else max(S, q.ao), 'stop')
            o.mae = max(o.mae, -o.r)
            return
        o.mae = max(o.mae, d * (E - adv) / R0)
        if (fav >= T) if d > 0 else (fav <= T):
            o._close(q, T, 'target')
            o.mfe = max(o.mfe, o.r)
            return
        o.mfe = max(o.mfe, d * (fav - E) / R0)
        o.ext = adv if o.ext is None else (min(o.ext, adv) if d > 0 else max(o.ext, adv))
        if o.rule:
            if X.time_exit(o.rule, o.tf, o.bars, o.mfe):
                o._close(q, q.bc if d > 0 else q.ac, 'time')
                return
            o.stop = X.managed_stop(o.rule, d, E, o.stop, o.mfe, o.ext)


def mark_open(o: Order, last: Q) -> None:
    """Unrealised R of a trade still open at the end of the data (reported, not counted in the stats)."""
    if o.status == 'open' and o.risk0 > 0:
        px = last.bc if o.d > 0 else last.ac
        o.r = o.d * (px - o.entry) / o.risk0


# ---- the signal function (live code) with optional rule switches -------------------------------------------------------
def signals_with(an: F.FxAnalysis, ignore: Sequence[str] = ()) -> List[Dict]:
    """fxcore.signals(an); rules whose short name is in `ignore` cannot fail (FAIL -> INFO)."""
    if not ignore:
        return F.signals(an)
    orig = F.zone_rules

    def patched(a, z, x):
        return [F.Rule(F.INFO, r.text, r.ref, r.short) if r.short in ignore and r.status == F.FAIL else r
                for r in orig(a, z, x)]
    F.zone_rules = patched
    try:
        return F.signals(an)
    finally:
        F.zone_rules = orig


def _zone_bars_after(an: F.FxAnalysis, z: Z.Zone) -> List[Bar]:
    """The closed bars after the zone's stay-away candle (oldest first): the zone TF's closed bars, then the H4 bars
    of its forming bar (D1 / W1 / MN zones; an H4 zone's forming bar has none in the H4 replay)."""
    S = an.rows[z.tf].S
    out = [Bar(S.T[j], S.O[j], S.H[j], S.L[j], S.C[j]) for j in range(z.sa_bar - 1, 0, -1)]
    if z.tf not in ('H1', 'H4') and S.n > 1:
        last = C.period_key(z.tf, S.T[1])
        fine = an.fine
        k = 1
        while k < fine.n and C.period_key(z.tf, fine.T[k]) > last:
            k += 1
        out += [Bar(fine.T[j], fine.O[j], fine.H[j], fine.L[j], fine.C[j]) for j in range(k - 1, 0, -1)]
    return out


def candidates(an: F.FxAnalysis) -> List[Dict]:
    """Every zone fxcore.signals would turn into a BUY / SELL if at most the RELAX rules were switched off, with its
    failing rules and what the experiments need, all from this analysis (= the bars closed now). One
    fxcore.zone_rules call per zone, exactly as fxcore.signals: the ablations and experiments then only filter."""
    out: List[Dict] = []
    px = an.price
    for tf in C.ENTRY_TFS:
        r = an.rows[tf]
        if not r.ok:
            continue
        for z in r.zones:
            x = an.dna.get(z.zid)
            if x is None:
                continue
            rules = F.zone_rules(an, z, x)
            fails = frozenset(k.short for k in rules if k.status == F.FAIL)
            if not fails <= RELAX:
                continue
            pl = F.plan(an, z, x)
            d = z.dir
            c = {'kind': F.KIND[d], 'tf': tf, 'side': F.SIDE[d], 'base_start': z.base_start, 'd': d,
                 'entry': pl['entry'], 'stop': pl['stop'], 'target': pl['target'], 'rr': pl['rr'],
                 'prox': z.prox, 'distal': round(z.dist, an.nd), 'zone_type': x.code, 'pattern': z.pattern,
                 'cont': bool(z.cont), 'score': F.score(x, F.tests(an, z, x), d),
                 'to_entry_pips': round(d * (px - z.prox) / an.pip, 1), 'fails': fails}
            if fails == {'fresh'}:
                zb = _zone_bars_after(an, z)
                c['used_body'] = X.zone_used(zb, d, z.prox, z.dist, 'body')
                c['used_depth'] = X.zone_used(zb, d, z.prox, z.dist, 'depth25')
            if fails <= {'fresh'}:
                htf = C.HTF_OF.get(tf)
                H = an.rows.get(htf) if htf else None
                c['nested'] = bool(H is not None and H.ok and any(
                    o.dir == d and not o.removed and o.lo <= z.prox <= o.hi for o in H.zones))
                M = an.rows['MN'].S                  # closed MN bars (shift 0 = the phantom forming bar)
                c['mn_pos'] = X.mn_range_pos([Bar(M.T[j], M.O[j], M.H[j], M.L[j], M.C[j])
                                              for j in range(min(M.n - 1, X.CURVE_MONTHS), 0, -1)], px)
                k = F.ROW_TFS.index(tf)
                c['opp_prox'] = [o.prox for t in F.ROW_TFS[k:] if an.rows[t].ok for o in an.rows[t].zones
                                 if o.dir == -d and not o.removed]
                c['tp_off'] = F.tp_off(an)
                c['spread'] = an.spread or 0.0
                S = r.S
                c['atr'] = S.atr(1)
                c['atr_hist'] = [S.atr(i) for i in range(1, min(S.n, X.VOL_N + 1))]
                c['htf_trend'] = Z.trend_side(H) if H is not None else 0
            out.append(c)
    return out


def _nearest(cs: List[Dict]) -> List[Dict]:
    """fxcore.signals' choice: one BUY / SELL per (TF, side), the zone nearest to price."""
    best: Dict[Tuple[str, str], Dict] = {}
    for c in cs:
        k = (c['tf'], c['side'])
        if k not in best or abs(c['to_entry_pips']) < abs(best[k]['to_entry_pips']):
            best[k] = c
    return list(best.values())


def exp_key(base: str, vid: str) -> str:
    """Order-list key of experiment vid on a base ('current/be_1r'); the base itself = its ablation key."""
    return BASES[base][0] if vid == 'current' else f'{base}/{vid}'


def variant_signals(cands: List[Dict], variants: Dict[str, Optional[Sequence[str]]]) -> Dict[str, List[Dict]]:
    """{variant: BUY / SELL signals}. A tuple value = an ablation (those rules cannot fail); None = an experiment
    '<base>/<id>' (or a bare id = on 'current') of fxexperiments.VARIANTS on a base of BASES (the base's ignored rules
    are taken out of the failing rules first; select before the one-per-TF-and-side choice, adjust after it: its
    order plan or a skip)."""
    out: Dict[str, List[Dict]] = {}
    for v, ign in variants.items():
        if ign is not None:
            out[v] = _nearest([c for c in cands if c['fails'] <= set(ign)])
            continue
        base, _, vid = v.rpartition('/')
        drop = frozenset(BASES[base or 'current'][1])
        pool = [{**c, 'fails': c['fails'] - drop} for c in cands] if drop else cands
        ss = []
        for c in _nearest([c for c in pool if X.select(vid, c)]):
            a = X.adjust(vid, c)
            if a is not None:
                ss.append({**c, 'exp': a})
        out[v] = ss
    return out


def default_signal_fn(inst: Dict, bars: Dict[str, List[Bar]], spread: Optional[float],
                      variants: Dict[str, Optional[Sequence[str]]]) -> Dict[str, List[Dict]]:
    """fxcore.analyse once per H4 close, the zone rules once per zone, shared by every ablation and experiment."""
    an = F.analyse(inst, bars, spread)
    return variant_signals(candidates(an), variants)


SignalFn = Callable[[Dict, Dict[str, List[Bar]], Optional[float], Dict[str, Sequence[str]]], Dict[str, List[Dict]]]


# ---- walk forward over one instrument ---------------------------------------------------------------------------------
def run_instrument(inst: Dict, h4: List[Q], htf: Dict[str, List[Bar]], start: str, end: str = '9999',
                   variants: Optional[Dict[str, Sequence[str]]] = None, signal_fn: SignalFn = default_signal_fn,
                   expiry: Optional[Dict[str, float]] = None, step_n: int = 1, deadline: Optional[float] = None,
                   warmup: int = C.KEEP_BARS['H4']) -> Dict:
    """Evaluate the rules at every H4 close in [start, end) on the bars closed at that time; simulate the orders on
    the bars after. Returns {'orders': [Order], 'evals', 'partial', 'last'}."""
    variants = VARIANTS if variants is None else variants
    expiry = expiry or EXPIRY_DAYS
    pip = C.pip_of(inst)
    ends = {tf: [bar_end(b.d, tf) for b in htf.get(tf, [])] for tf in ('D1', 'W1', 'MN')}
    bids = [q.bid for q in h4]                   # zones on BID bars, as the live scanner (MT4 / MT5 charts plot bid)
    sps = [q.spread for q in h4]
    seen = {v: set() for v in variants}
    active: Dict[str, List[Order]] = {v: [] for v in variants}
    done: List[Tuple[str, Order]] = []
    evals, partial, last, first = 0, False, None, None
    j0 = max(warmup, bisect.bisect_left([q.d for q in h4], start))
    stair_memo: Dict[Tuple[str, int], bool] = {}

    def stair_at(o: Order, j: int) -> bool:
        """fxexperiments.stair_approach on the entry-TF bars closed before H4 bar j opens (no look-ahead)."""
        k = (o.tf, j)
        if k not in stair_memo:
            if o.tf in ('H1', 'H4'):
                bs = bids[max(0, j - 40):j]
            else:
                tf = o.tf if o.tf in ends else 'D1'
                n = bisect.bisect_right(ends[tf], h4[j].d)
                bs = htf.get(tf, [])[max(0, n - 40):n]
            stair_memo[k] = X.stair_approach(bs)
        return stair_memo[k]

    for j in range(len(h4)):
        q = h4[j]
        pre = (lambda o, _j=j: stair_at(o, _j))
        for v in variants:                       # orders placed at earlier closes see this bar
            keep = []
            for o in active[v]:
                step(o, q, pre)
                (keep if o.status in ('pending', 'open') else done).append(o if o.status in ('pending', 'open') else (v, o))
            active[v] = keep
        if j < j0 or q.d >= end or (j - j0) % max(1, step_n):
            continue
        if deadline is not None and time.time() > deadline:
            partial = True
            break
        t = bar_end(q.d, 'H4')                   # the close of bar j = "now"
        bars = {'H4': bids[max(0, j + 1 - C.KEEP_BARS['H4']):j + 1]}
        for tf in ('D1', 'W1', 'MN'):
            k = bisect.bisect_right(ends[tf], t)
            bars[tf] = htf.get(tf, [])[max(0, k - C.KEEP_BARS[tf]):k]
        spread = F.typical_spread(sps[max(0, j + 1 - 50):j + 1])
        try:
            got = signal_fn(inst, bars, spread, variants)
        except Exception:  # noqa: BLE001  (a bad window must not kill the run)
            got = {}
        evals += 1
        last = q.d
        first = first or q.d
        for v, ss in got.items():
            for s in ss:
                key = (s['tf'], s['side'], s['base_start'])
                if key in seen[v] or s.get('target') is None or s.get('stop') is None:
                    continue
                seen[v].add(key)
                d = 1 if s['kind'] == 'BUY' else -1
                ex = s.get('exp') or {}
                legs = ex.get('legs') or [(s['entry'], 1.0)]
                grp = f"{v}|{inst['name']}|{s['tf']}|{s['side']}|{s['base_start']}" if len(legs) > 1 else ''
                os_ = [Order(inst=inst['name'], sym=inst.get('sym') or inst['name'], cls=bt_class(inst), wl=bool(inst.get('wl')),
                             tf=s['tf'], d=d, entry=e, stop=ex.get('stop', s['stop']), target=ex.get('target', s['target']),
                             distal=s['distal'], signal=q.d, expires=add_days(t, expiry.get(s['tf'], 10)),
                             zone_type=s.get('zone_type') or '', pattern=s.get('pattern') or '', score=int(s.get('score') or 0),
                             rr=float(s.get('rr') or 0), spread_pips=round(spread / pip, 2) if spread is not None else None,
                             rule=ex.get('rule', ''), size=float(ex.get('size', 1.0)), cancel50=bool(ex.get('cancel50')),
                             stair=bool(ex.get('stair')), group=grp, weight=w) for e, w in legs]
                if all(o.risk > 0 and d * (o.target - o.entry) > 0 for o in os_):
                    active[v].extend(os_)
    if h4:
        for v in variants:
            for o in active[v]:
                mark_open(o, h4[-1])
                done.append((v, o))
    return {'orders': done, 'evals': evals, 'partial': partial, 'last': last, 'first': first}


# ---- statistics ----------------------------------------------------------------------------------------------------
def max_drawdown(rs: List[float]) -> float:
    eq = peak = dd = 0.0
    for r in rs:
        eq += r
        peak = max(peak, eq)
        dd = max(dd, peak - eq)
    return dd


def longest_losing(rs: List[float]) -> int:
    best = cur = 0
    for r in rs:
        cur = cur + 1 if r <= 0 else 0
        best = max(best, cur)
    return best


def bootstrap_ci(rs: List[float], n: int = BOOT_N, seed: int = 7) -> Optional[Tuple[float, float]]:
    if len(rs) < 5:
        return None
    rnd = random.Random(seed)
    k = len(rs)
    means = sorted(sum(rnd.choices(rs, k=k)) / k for _ in range(n))
    return round(means[int(0.025 * n)], 3), round(means[int(0.975 * n) - 1], 3)


def stats(orders: List[Order], boot: bool = True) -> Dict:
    sig = len(orders)
    resolved = [o for o in orders if o.status != 'pending']
    filled = [o for o in orders if o.status in FILLED]
    closed = sorted((o for o in orders if o.status in CLOSED), key=lambda o: (o.exit_t or '', o.signal))
    rs = [o.r for o in closed]
    wins = [r for r in rs if r > 0]
    losses = [r for r in rs if r <= 0]
    n = len(rs)
    exp = sum(rs) / n if n else None
    gl = -sum(losses)
    out = {'signals': sig, 'filled': len(filled), 'trades': n, 'open': sum(o.status == 'open' for o in orders),
           'fill_rate': round(len(filled) / len(resolved), 3) if resolved else None,
           'win_rate': round(len(wins) / n, 3) if n else None,
           'avg_win_r': round(sum(wins) / len(wins), 3) if wins else None,
           'avg_loss_r': round(sum(losses) / len(losses), 3) if losses else None,
           'avg_r': round(exp, 3) if exp is not None else None, 'expectancy_r': round(exp, 3) if exp is not None else None,
           'total_r': round(sum(rs), 2),
           'profit_factor': (round(sum(wins) / gl, 2) if gl > 0 else (None if not wins else 'inf')),
           'max_dd_r': round(max_drawdown(rs), 2), 'longest_losing': longest_losing(rs),
           'expired': sum(o.status == 'expired' for o in orders), 'invalidated': sum(o.status == 'invalidated' for o in orders),
           'missed': sum(o.status == 'missed' for o in orders)}
    ci = bootstrap_ci(rs) if boot else None
    out['ci95'] = list(ci) if ci else None
    return out


def score_bucket(s: int) -> str:
    return '8-10' if s >= 8 else ('6-7' if s >= 6 else '0-5')


GROUPS = {'class': lambda o: o.cls, 'tf': lambda o: o.tf, 'zone_type': lambda o: o.zone_type or '?',
          'pattern': lambda o: o.pattern or '?', 'score': lambda o: score_bucket(o.score), 'side': lambda o: 'BUY' if o.d > 0 else 'SELL'}


def split_label(start: str, end: str, frac: float = IS_FRAC) -> str:
    a, b = _p(start), _p(end)
    return _s(a + (b - a) * frac)


def summarise(orders: List[Order], split: str, boot: bool = True) -> Dict:
    """{'all', 'is', 'oos', 'by': {group: {key: {'all', 'is', 'oos'}}}}."""
    def three(os_):
        return {'all': stats(os_, boot), 'is': stats([o for o in os_ if o.signal < split], boot),
                'oos': stats([o for o in os_ if o.signal >= split], boot)}
    out = three(orders)
    out['by'] = {}
    for g, key in GROUPS.items():
        buckets: Dict[str, List[Order]] = {}
        for o in orders:
            buckets.setdefault(key(o), []).append(o)
        out['by'][g] = {k: three(v) for k, v in sorted(buckets.items())}
    return out


# ---- experiments (public/learn/fx_experiments.json) ---------------------------------------------------------------------
def exp_trades(orders: List[Order]) -> List[Dict]:
    """Closed trades of one variant: {'signal', 'exit_t', 'r' (x size), 'mfe', 'mae', 'bars'}. split_entry legs (same
    group) form one trade: R = sum(weight x leg PnL) / sum(weight x leg risk) over ALL planned legs (1R = the loss
    when both halves fill and stop out), closed once no leg is open and at least one filled; MFE / MAE / bars from the
    proximal leg (in its own R). Trades still open at the end are not counted."""
    out, groups = [], {}
    for o in orders:
        if o.group:
            groups.setdefault(o.group, []).append(o)
        elif o.status in CLOSED:
            out.append({'signal': o.signal, 'exit_t': o.exit_t or '', 'r': o.r * o.size, 'mfe': o.mfe, 'mae': o.mae, 'bars': o.bars})
    for legs in groups.values():
        filled = [o for o in legs if o.status in FILLED]
        if not filled or any(o.status == 'open' for o in legs):
            continue
        den = sum(o.weight * o.risk0 for o in legs)
        pnl = sum(o.weight * o.r * o.risk0 for o in filled)
        a = min(legs, key=lambda o: o.d * -o.entry)          # the proximal leg (nearest to price)
        out.append({'signal': a.signal, 'exit_t': max(o.exit_t or '' for o in filled),
                    'r': (pnl / den if den > 0 else 0.0) * a.size, 'mfe': a.mfe, 'mae': a.mae, 'bars': a.bars})
    out.sort(key=lambda t: (t['exit_t'], t['signal']))
    return out


def exp_stats(ts: List[Dict]) -> Dict:
    """STATS of fx_experiments.json; null when undefined (no trades, no losses for pf, < 5 trades for the CI)."""
    rs = [t['r'] for t in ts]
    n = len(rs)
    if not n:
        return {'n': 0, 'win': None, 'exp_r': None, 'ci': None, 'pf': None, 'avg_mfe_r': None, 'avg_mae_r': None,
                'avg_bars': None, 'max_dd_r': 0.0}
    gw = sum(r for r in rs if r > 0)
    gl = -sum(r for r in rs if r <= 0)
    ci = bootstrap_ci(rs)
    return {'n': n, 'win': round(sum(r > 0 for r in rs) / n, 3), 'exp_r': round(sum(rs) / n, 3),
            'ci': list(ci) if ci else None, 'pf': round(gw / gl, 3) if gl > 0 else None,
            'avg_mfe_r': round(sum(t['mfe'] for t in ts) / n, 3), 'avg_mae_r': round(sum(t['mae'] for t in ts) / n, 3),
            'avg_bars': round(sum(t['bars'] for t in ts) / n, 2), 'max_dd_r': round(max_drawdown(rs), 3)}


def _pct(xs: List[float], q: float) -> Optional[float]:
    if not xs:
        return None
    s = sorted(xs)
    return round(s[min(len(s) - 1, int(q * len(s)))], 3)


def _iso(lbl: str) -> str:
    return lbl[:16] + ':00' if lbl and len(lbl) >= 16 else lbl


def _halves(ts: List[Dict], split: str) -> Dict:
    return {'is': exp_stats([t for t in ts if t['signal'] < split]), 'oos': exp_stats([t for t in ts if t['signal'] >= split])}


def experiment_set(orders: Dict[str, List[Order]], split: str, base: str, ran: Iterable[str]) -> Dict:
    """One base's full variant matrix: {'baseline', 'variants' (the base itself under its id), 'skipped', 'excursions'
    (MFE / MAE of the base's trades)}."""
    ran = set(ran)
    variants, skipped = {}, dict(X.SKIPPED)
    for vid, meta in X.VARIANTS.items():
        if vid in X.SKIPPED:
            continue
        key = exp_key(base, vid)
        if key not in ran:
            skipped[vid if vid != 'current' else base] = 'not run (--no-experiments)'
            continue
        if vid == 'current':
            vid, meta = base, {'group': 'baseline', 'desc': BASE_DESC[base]}
        variants[vid] = {'group': meta['group'], 'desc': meta['desc'], **_halves(exp_trades(orders.get(key, [])), split)}
    cur = exp_trades(orders.get(BASES[base][0], []))
    mf, ma = [t['mfe'] for t in cur], [t['mae'] for t in cur]
    qs = (('p25', .25), ('p50', .5), ('p75', .75), ('p90', .9))
    return {'baseline': base, 'variants': variants, 'skipped': skipped,
            'excursions': {'mfe_r': {k: _pct(mf, q) for k, q in qs}, 'mae_r': {k: _pct(ma, q) for k, q in qs}, 'n': len(cur)}}


def choose_base(bases: Dict[str, Dict]) -> str:
    """The strictest base (BASES order) with in-sample n >= BASE_MIN_IS, else the one with the most trades (ties:
    the stricter)."""
    for b in BASES:
        if b in bases and bases[b]['is']['n'] >= BASE_MIN_IS:
            return b
    return max((b for b in BASES if b in bases), key=lambda b: (bases[b]['is']['n'] + bases[b]['oos']['n'],
                                                                -list(BASES).index(b)))


def build_experiments(orders: Dict[str, List[Order]], period: Dict, generated: Optional[str] = None,
                      ran: Optional[Iterable[str]] = None, with_all: bool = False):
    """The auto-learner's input (schema 1): the variant matrix of the chosen base (choose_base) vs that base,
    in-sample (signals before the split) and out-of-sample, + 'base_rules' (the chosen base) and 'bases' (each base's
    own IS / OOS stats, so the report can show how many trades each produces). with_all -> (that, the research file
    with every base's matrix under 'sets')."""
    split = period['split']
    ran = set(orders) if ran is None else set(ran)
    bases = {b: _halves(exp_trades(orders.get(k, [])), split) for b, (k, _ign) in BASES.items() if k in ran}
    if not bases:
        bases = {'current': _halves([], split)}
    chosen = choose_base(bases)
    head = {'schema': 1, 'market': 'fx',
            'generated_at': generated or dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
            'period': {'start': _iso(period['start']), 'end': _iso(period['end']), 'split': _iso(split)}}
    sets = {b: experiment_set(orders, split, b, ran) for b in bases}
    one = {**head, **sets[chosen], 'base_rules': chosen, 'bases': bases}
    if not with_all:
        return one
    return one, {**head, 'base_rules': chosen, 'bases': bases, 'sets': sets}


STATS_KEYS = ('n', 'win', 'exp_r', 'ci', 'pf', 'avg_mfe_r', 'avg_mae_r', 'avg_bars', 'max_dd_r')
GROUPS_OK = ('exit', 'freshness', 'continuation', 'stop', 'filter', 'size', 'baseline')


def validate_experiments(js: Dict) -> List[str]:
    """Schema-1 check of fx_experiments.json (stdlib): the list of problems, empty = valid."""
    err = []
    num = lambda v: isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)  # noqa: E731
    for k, t in (('schema', int), ('market', str), ('generated_at', str), ('period', dict), ('baseline', str),
                 ('variants', dict), ('skipped', dict), ('excursions', dict)):
        if not isinstance(js.get(k), t):
            err.append(f'{k}: missing / not {t.__name__}')
    if err:
        return err
    if js['schema'] != 1 or js['market'] != 'fx' or js['baseline'] not in BASES:
        err.append('schema / market / baseline')
    if 'base_rules' in js and js['base_rules'] != js['baseline']:
        err.append('base_rules != baseline')
    for b, st in (js.get('bases') or {}).items():
        if b not in BASES or not isinstance(st, dict) or any(set(st.get(h) or {}) != set(STATS_KEYS) for h in ('is', 'oos')):
            err.append(f'bases.{b}')
    for k in ('start', 'end', 'split'):
        try:
            dt.datetime.fromisoformat(str(js['period'].get(k)))
        except ValueError:
            err.append(f'period.{k} not ISO')
    if js['baseline'] not in js['variants']:
        err.append('the baseline is not a variant key')
    for vid, v in js['variants'].items():
        if v.get('group') not in GROUPS_OK or not isinstance(v.get('desc'), str) or not v['desc']:
            err.append(f'{vid}: group / desc')
        for half in ('is', 'oos'):
            st = v.get(half)
            if not isinstance(st, dict) or set(st) != set(STATS_KEYS):
                err.append(f'{vid}.{half}: keys {sorted(st or {})}')
                continue
            if not isinstance(st['n'], int) or st['n'] < 0:
                err.append(f'{vid}.{half}.n')
            if st['win'] is not None and not (num(st['win']) and 0 <= st['win'] <= 1):
                err.append(f'{vid}.{half}.win')
            for k in ('exp_r', 'pf', 'avg_mfe_r', 'avg_mae_r', 'avg_bars', 'max_dd_r'):
                if st[k] is not None and not num(st[k]):
                    err.append(f'{vid}.{half}.{k}')
            ci = st['ci']
            if ci is not None and not (isinstance(ci, list) and len(ci) == 2 and all(num(x) for x in ci) and ci[0] <= ci[1]):
                err.append(f'{vid}.{half}.ci')
    for vid, why in js['skipped'].items():
        if not isinstance(why, str) or vid in js['variants']:
            err.append(f'skipped.{vid}')
    ex = js['excursions']
    for k in ('mfe_r', 'mae_r'):
        d = ex.get(k)
        if not isinstance(d, dict) or set(d) != {'p25', 'p50', 'p75', 'p90'} or any(x is not None and not num(x) for x in d.values()):
            err.append(f'excursions.{k}')
    if not isinstance(ex.get('n'), int):
        err.append('excursions.n')
    return err


def validate_all(js: Dict) -> List[str]:
    """fx_experiments_all.json: every set must be a valid schema-1 experiments document on its own."""
    if not isinstance(js.get('sets'), dict) or not js['sets'] or js.get('base_rules') not in js['sets']:
        return ['sets / base_rules']
    head = {k: js.get(k) for k in ('schema', 'market', 'generated_at', 'period')}
    return [f'{b}: {e}' for b, st in js['sets'].items() for e in validate_experiments({**head, **st, 'bases': js.get('bases')})]


def verdict(s: Dict) -> str:
    """Plain words for the owner: is the edge proven out of sample?"""
    o = s['oos']
    if not o['trades'] or o['trades'] < 30:
        return f"not enough out-of-sample trades ({o['trades']}) to judge"
    ci = o['ci95']
    if ci and ci[0] > 0:
        return f"positive out of sample: {o['expectancy_r']:+.2f} R per trade, 95% CI {ci[0]:+.2f}..{ci[1]:+.2f} (edge above zero)"
    if ci and ci[1] < 0:
        return f"negative out of sample: {o['expectancy_r']:+.2f} R per trade, 95% CI {ci[0]:+.2f}..{ci[1]:+.2f} (loses money)"
    return (f"not proven: out-of-sample {o['expectancy_r']:+.2f} R per trade, 95% CI "
            f"{ci[0]:+.2f}..{ci[1]:+.2f} includes zero" if ci else 'not proven')


# ---- OANDA history (paged, cached) ----------------------------------------------------------------------------------
def _cache_path(name: str, tf: str) -> str:
    return os.path.join(BT_CACHE, f'{name}.{tf}.json')


def _parse_h4(raw: bytes) -> List[Tuple[list, str]]:
    js = json.loads(raw)
    out = []
    for c in js.get('candles') or []:
        if not c.get('complete'):
            continue
        try:
            b, a = c['bid'], c['ask']
            row = [C.label(str(c['time']), 'H4', strict=False)] + [float(b[k]) for k in 'ohlc'] + [float(a[k]) for k in 'ohlc']
        except (KeyError, TypeError, ValueError):
            m = c.get('mid')
            if not m:
                continue
            row = [C.label(str(c['time']), 'H4', strict=False)] + [float(m[k]) for k in 'ohlc'] * 2
        out.append((row, str(c['time'])[:19] + 'Z'))
    return out


def _parse_htf(raw: bytes, tf: str) -> List[Tuple[list, str]]:
    return [([lbl, b.o, b.h, b.l, b.c], u) for lbl, b, _sp, u in O.parse_candles(raw, tf, strict=False)]


def fetch_history(name: str, tf: str, get=None, start: str = HISTORY_START, log=None, max_pages: int = 40) -> List[list]:
    """All complete candles since `start` (cached; topped up from the newest cached candle)."""
    get = get or O.default_get
    try:
        with open(_cache_path(name, tf)) as f:
            rec = json.load(f)
    except (OSError, ValueError):
        rec = {'rows': [], 'last_utc': None}
    rows: List[list] = rec.get('rows') or []
    frm = rec.get('last_utc') or start
    if rows and time.time() - rec.get('fetched', 0) < 6 * 3600:
        return rows
    have = {r[0] for r in rows}
    for _ in range(max_pages):
        url = O.candles_url(name, tf, C.COLD_COUNT, frm)
        if tf == 'H4':
            url = url.replace('price=MBA', 'price=BA')
        raw = get(url)
        got = _parse_h4(raw) if tf == 'H4' else _parse_htf(raw, tf)
        new = [(r, u) for r, u in got if r[0] not in have]
        for r, u in new:
            rows.append(r)
            have.add(r[0])
        if got:
            frm = got[-1][1]
        if len(json.loads(raw).get('candles') or []) < C.COLD_COUNT or not new:
            break
    rows.sort(key=lambda r: r[0])
    os.makedirs(BT_CACHE, exist_ok=True)
    tmp = _cache_path(name, tf) + '.tmp'
    with open(tmp, 'w') as f:
        json.dump({'rows': rows, 'last_utc': frm, 'fetched': time.time()}, f, separators=(',', ':'))
    os.replace(tmp, _cache_path(name, tf))
    if log:
        log(f'  {name} {tf}: {len(rows)} bars ({rows[0][0] if rows else "-"} .. {rows[-1][0] if rows else "-"})')
    return rows


def load_cached(name: str) -> Tuple[List[Q], Dict[str, List[Bar]]]:
    h4, htf = [], {}
    with open(_cache_path(name, 'H4')) as f:
        h4 = [Q(*r[:9]) for r in json.load(f)['rows']]
    for tf in ('D1', 'W1', 'MN'):
        try:
            with open(_cache_path(name, tf)) as f:
                htf[tf] = [Bar(r[0], r[1], r[2], r[3], r[4]) for r in json.load(f)['rows']]
        except (OSError, ValueError):
            htf[tf] = []
    return h4, htf


# ---- parallel driver ------------------------------------------------------------------------------------------------
_JOB: Dict = {}


def _worker(inst: Dict) -> Dict:
    t0 = time.time()
    try:
        if _JOB.get('synthetic'):
            h4, htf = _JOB['synthetic'][inst['name']]
        else:
            h4, htf = load_cached(inst['name'])
        res = run_instrument(inst, h4, htf, _JOB['start'], variants=_JOB['variants'], expiry=_JOB['expiry'],
                             step_n=_JOB['step'], deadline=_JOB['deadline'], warmup=_JOB.get('warmup', C.KEEP_BARS['H4']))
        return {'name': inst['name'], 'orders': [(v, asdict(o)) for v, o in res['orders']], 'evals': res['evals'],
                'partial': res['partial'], 'first': res['first'], 'last': res['last'],
                'secs': round(time.time() - t0, 1), 'error': None}
    except Exception as e:  # noqa: BLE001
        return {'name': inst['name'], 'orders': [], 'evals': 0, 'partial': False, 'first': None, 'last': None,
                'secs': round(time.time() - t0, 1), 'error': f'{type(e).__name__}: {str(e)[:160]}'}


def run_all(uni: List[Dict], job: Dict, workers: int, log=print) -> List[Dict]:
    _JOB.clear()
    _JOB.update(job)
    out = []
    if workers <= 1:
        for i in uni:
            out.append(_worker(i))
            log(f"  {i['name']}: {out[-1]['evals']} evals, {len(out[-1]['orders'])} orders, {out[-1]['secs']}s"
                + (f" ERROR {out[-1]['error']}" if out[-1]['error'] else ''))
        return out
    import multiprocessing as mp
    ctx = mp.get_context('fork')
    with ctx.Pool(workers) as pool:
        for r in pool.imap_unordered(_worker, uni):
            out.append(r)
            log(f"  {r['name']}: {r['evals']} evals, {len(r['orders'])} orders, {r['secs']}s"
                + (' (partial: time budget)' if r['partial'] else '') + (f" ERROR {r['error']}" if r['error'] else ''))
    return out


# ---- report ---------------------------------------------------------------------------------------------------------
def _f(v, fmt='{:+.2f}') -> str:
    if v is None:
        return '-'
    if isinstance(v, str):
        return v
    return fmt.format(v)


def _ci(s: Dict) -> str:
    return f"{s['ci95'][0]:+.2f}..{s['ci95'][1]:+.2f}" if s.get('ci95') else '-'


HEAD = '| {} | signals | trades | fill | win | avg R | PF | max DD R | lose streak | 95% CI exp. R | IS exp. (n) | OOS exp. (n) |'


def row(name: str, x: Dict) -> str:
    a, i, o = x['all'], x['is'], x['oos']
    return (f"| {name} | {a['signals']} | {a['trades']} | {_f(a['fill_rate'], '{:.0%}')} | {_f(a['win_rate'], '{:.0%}')} | "
            f"{_f(a['expectancy_r'])} | {_f(a['profit_factor'], '{:.2f}')} | {_f(a['max_dd_r'], '{:.1f}')} | {a['longest_losing']} | "
            f"{_ci(a)} | {_f(i['expectancy_r'])} ({i['trades']}) | {_f(o['expectancy_r'])} ({o['trades']}) |")


def table(title: str, rows: Iterable[Tuple[str, Dict]]) -> List[str]:
    h = HEAD.format(title)
    return [h, '|' + '---|' * (h.count('|') - 1)] + [row(n, x) for n, x in rows]


def markdown(js: Dict) -> str:
    p = js['params']
    full = js['variants'].get('full')
    L = ['# FX backtest: do the live forex rules make money?', '',
         f"Generated {js['generated']} by `tools/fx_scanner/fx_backtest.py` on {js['feed']} history"
         + (' (SYNTHETIC SELFTEST DATA: not evidence)' if js.get('synthetic') else '') + '.', '',
         f"Test period {js['period']['start']} .. {js['period']['end']} (forex time), in-sample = signals before "
         f"{js['period']['split']} (older 70%), out-of-sample after. {js['counts']['instruments']} instruments, "
         f"{js['counts']['evals']} H4 evaluations" + (', PARTIAL (time budget hit)' if js.get('partial') else '') + '.', '']
    if full:
        L += ['## Verdict', '', f"**Full rules: {full['verdict']}.**", '']
    L += ['R = profit in units of the planned risk (entry to stop). Expectancy = average R per closed trade, after the '
          'spread (bid / ask fills). PF = gross win R / gross loss R. A 95% CI that includes 0 means the edge is not '
          'proven.', '', '## Ablations (which filters remove false signals)', '']
    L += table('variant', [(VARIANT_LABEL.get(v, v), s) for v, s in js['variants'].items()])
    if full:
        for g, title in (('class', 'class'), ('tf', 'entry TF'), ('zone_type', 'zone type'), ('pattern', 'pattern'),
                         ('score', 'Raja score'), ('side', 'side')):
            L += ['', f'## Full rules by {title}', '']
            L += table(title, full['by'][g].items())
    L += ['', '## Method', '',
          '* Signals: `fxcore.analyse` + `fxcore.signals` (the live scanner code) at every H4 close, on the H4 / D1 / W1 / '
          'MN bars closed at that moment (same history caps as the scanner) and the typical spread of the last 50 H4 '
          'closes. One order per zone (TF, side, base start), placed at the close of the signal bar.',
          f"* Order: limit at the proximal, the scanner's stop (distal + % of height) and target (before the next opposite "
          f"zone, else the 250% projection). Expiry {p['expiry_days']} days per entry TF; cancelled when a close removes "
          'the zone (beyond the distal) or price reaches the target first.',
          '* Fills on H4 bid / ask: BUY fills when the ask reaches the entry, exits on the bid (SELL mirrored), so the '
          'spread is paid. Conservative: fill bar = stop check only, stop before target in one candle, gap through the '
          'stop exits at the open, no price improvement on fills.',
          '* Ablation (b) / (c) turn the location (top-down nesting) / spread rule from FAIL into INFO; (d) is the subset '
          'of (a) on the watchlist majors (all majors when the watchlist has none).',
          '* Classes: majors = USD vs G8; minors = crosses of EUR / GBP / JPY / CHF; crosses = other G8 crosses; '
          'exotics; metals; indices / commodities (CFDs, only with --include-cfd or on the watchlist).',
          f"* Bootstrap: {BOOT_N} resamples of the closed-trade R list (percentile 95% CI).",
          '* Caveats: OANDA prices, not Pepperstone; no swap / commission; trades still open at the end are excluded '
          '(listed as open); early years have shorter D1 history than the live scanner (cache since 2005).', '',
          'Not financial advice. Past results do not guarantee future results.']
    if js.get('experiments'):
        L += [''] + experiments_md(js['experiments'])
    if js.get('errors'):
        L += ['', '## Errors', ''] + [f'* {k}: {v}' for k, v in js['errors'].items()]
    return '\n'.join(L) + '\n'


def experiments_md(ex: Dict) -> List[str]:
    """The experiments section: a results table + one short section per variant (its exact definition)."""
    bl = ex['baseline']
    cur = ex['variants'].get(bl, {})
    co = (cur.get('oos') or {}).get('exp_r')
    bt = ', '.join(f"`{b}` {st['is']['n']} / {st['oos']['n']}" for b, st in (ex.get('bases') or {}).items())
    L = [f'## Experiments: the `{bl}` rules with ONE change each', '',
         f'Bases (in-sample / out-of-sample trades): {bt}. The strictest base with >= {BASE_MIN_IS} in-sample trades '
         f'(else the one with the most trades) is the baseline: `{bl}`. Every base\'s matrix: '
         '`public/learn/fx_experiments_all.json`.', '',
         'Written to `public/learn/fx_experiments.json` for the auto-learner (`tools/learn/learner.py`), which adopts '
         'a variant only when it beats the baseline in BOTH halves and out of sample. Signals are computed once per H4 '
         'close and shared; a variant only filters them / changes the order plan and re-runs the fill / exit '
         'simulation (same bid / ask fills, spread, stop-first rules as above). R x size for the half-size variants. '
         'IS = signals before the split, OOS = after.', '',
         '| variant | group | IS n | IS exp. R | OOS n | OOS exp. R | OOS 95% CI | OOS - base | OOS PF | OOS max DD R | avg MFE R | avg MAE R | avg bars |',
         '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    for vid, v in ex['variants'].items():
        i, o = v['is'], v['oos']
        dlt = o['exp_r'] - co if o['exp_r'] is not None and co is not None and vid != bl else None
        ci = f"{o['ci'][0]:+.2f}..{o['ci'][1]:+.2f}" if o.get('ci') else '-'
        L.append(f"| {vid} | {v['group']} | {i['n']} | {_f(i['exp_r'])} | {o['n']} | {_f(o['exp_r'])} | {ci} | {_f(dlt)} | "
                 f"{_f(o['pf'], '{:.2f}')} | {_f(o['max_dd_r'], '{:.1f}')} | {_f(o['avg_mfe_r'], '{:.2f}')} | "
                 f"{_f(o['avg_mae_r'], '{:.2f}')} | {_f(o['avg_bars'], '{:.1f}')} |")
    exc = ex.get('excursions') or {}
    if exc.get('n'):
        m, a = exc['mfe_r'], exc['mae_r']
        L += ['', f"`{bl}` trades ({exc['n']}): MFE R p25 / p50 / p75 / p90 = {_f(m['p25'], '{:.2f}')} / {_f(m['p50'], '{:.2f}')} / "
              f"{_f(m['p75'], '{:.2f}')} / {_f(m['p90'], '{:.2f}')}; MAE R = {_f(a['p25'], '{:.2f}')} / {_f(a['p50'], '{:.2f}')} / "
              f"{_f(a['p75'], '{:.2f}')} / {_f(a['p90'], '{:.2f}')} (MAE positive = against the trade)."]
    L += experiments_defs_md(ex.get('skipped') or {})
    return L


def experiments_defs_md(skipped: Dict[str, str]) -> List[str]:
    L = []
    for vid, meta in X.VARIANTS.items():
        L += ['', f"### `{vid}` ({meta['group']})", '', meta['desc'] + ' ' + X.DEFINITIONS.get(vid, '')]
        if vid in skipped:
            L += ['', f'Not run: {skipped[vid]}.']
    return L


def print_summary(js: Dict, log=print) -> None:
    log('')
    log(f"{'variant':32s} {'sig':>6s} {'trades':>6s} {'fill':>5s} {'win':>5s} {'expR':>6s} {'PF':>5s} {'DD':>6s} "
        f"{'streak':>6s} {'CI95':>13s} {'IS':>6s} {'OOS':>6s}")
    for v, s in js['variants'].items():
        a, i, o = s['all'], s['is'], s['oos']
        log(f"{VARIANT_LABEL.get(v, v):32s} {a['signals']:6d} {a['trades']:6d} {_f(a['fill_rate'], '{:.0%}'):>5s} "
            f"{_f(a['win_rate'], '{:.0%}'):>5s} {_f(a['expectancy_r']):>6s} {_f(a['profit_factor'], '{:.2f}'):>5s} "
            f"{_f(a['max_dd_r'], '{:.1f}'):>6s} {a['longest_losing']:6d} {_ci(a):>13s} {_f(i['expectancy_r']):>6s} {_f(o['expectancy_r']):>6s}")
    full = js['variants'].get('full')
    if full:
        for g in ('class', 'tf'):
            log(f'\nfull rules by {g}:')
            for k, s in full['by'][g].items():
                a = s['all']
                log(f"  {k:12s} trades {a['trades']:5d}  win {_f(a['win_rate'], '{:.0%}'):>4s}  exp {_f(a['expectancy_r']):>6s}"
                    f"  PF {_f(a['profit_factor'], '{:.2f}'):>5s}  CI {_ci(a)}  OOS {_f(s['oos']['expectancy_r'])} ({s['oos']['trades']})")
        log(f"\nVERDICT (full rules): {full['verdict']}")


def orders_of(results: List[Dict]) -> Dict[str, List[Order]]:
    orders: Dict[str, List[Order]] = {}
    for r in results:
        for v, od in r['orders']:
            orders.setdefault(v, []).append(Order(**od))
    return orders


def print_experiments(ex: Dict, log=print) -> None:
    bl = ex['baseline']
    co = ex['variants'].get(bl, {}).get('oos', {}).get('exp_r')
    log('\nexperiment bases: ' + ', '.join(f"{b} IS {st['is']['n']} / OOS {st['oos']['n']} trades"
                                          for b, st in (ex.get('bases') or {}).items()) + f' -> base {bl}')
    log(f"\n{'experiment':14s} {'IS n':>6s} {'IS expR':>8s} {'OOS n':>6s} {'OOS expR':>8s} {'vs cur':>7s} {'OOS CI':>13s}")
    for vid, v in ex['variants'].items():
        i, o = v['is'], v['oos']
        dlt = o['exp_r'] - co if o['exp_r'] is not None and co is not None and vid != bl else None
        ci = f"{o['ci'][0]:+.2f}..{o['ci'][1]:+.2f}" if o.get('ci') else '-'
        log(f"{vid:14s} {i['n']:6d} {_f(i['exp_r']):>8s} {o['n']:6d} {_f(o['exp_r']):>8s} {_f(dlt):>7s} {ci:>13s}")
    for vid, why in ex['skipped'].items():
        log(f'  skipped {vid}: {why}')


def build(results: List[Dict], uni: List[Dict], start: str, args, synthetic: bool = False) -> Dict:
    by_name = {i['name']: i for i in uni}
    orders = orders_of(results)
    lasts = [r['last'] for r in results if r['last']]
    end = max(lasts) if lasts else start
    split = split_label(start, end)
    variants: Dict[str, Dict] = {}
    for v in list(VARIANTS) + ['watchlist_majors']:
        if v == 'watchlist_majors':
            base = orders.get('full', [])
            wl = [o for o in base if o.cls == 'majors' and by_name.get(o.inst, {}).get('wl')]
            os_ = wl or [o for o in base if o.cls == 'majors']
        elif v in orders or v in VARIANTS and v in args_variants(args):
            os_ = orders.get(v, [])
        else:
            continue
        s = summarise(os_, split)
        s['verdict'] = verdict(s)
        variants[v] = s
    per_inst = {}
    for o in orders.get('full', []):
        per_inst.setdefault(o.sym, []).append(o)
    js = {'version': 1, 'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
          'feed': 'OANDA ' + (os.environ.get('OANDA_ENV') or 'practice'), 'synthetic': synthetic,
          'period': {'start': start, 'end': end, 'split': split},
          'params': {'years': args.years, 'expiry_days': EXPIRY_DAYS, 'step': args.step, 'is_frac': IS_FRAC,
                     'max_spread_frac': C.MAX_SPREAD_FRAC, 'approach_h': C.APPROACH_H, 'sl_pct': C.SL_PCT,
                     'include_cfd': bool(args.include_cfd)},
          'counts': {'instruments': len(results), 'evals': sum(r['evals'] for r in results)},
          'partial': any(r['partial'] for r in results),
          'errors': {r['name']: r['error'] for r in results if r['error']},
          'instruments': [{'name': r['name'], 'sym': by_name.get(r['name'], {}).get('sym'), 'class': bt_class(by_name[r['name']]) if r['name'] in by_name else None,
                           'first': r['first'], 'last': r['last'], 'evals': r['evals'], 'secs': r['secs'], 'partial': r['partial']}
                          for r in sorted(results, key=lambda r: r['name'])],
          'variants': variants,
          'per_instrument': {k: stats(v, boot=False) for k, v in sorted(per_inst.items())},
          'disclaimer': 'Backtest on OANDA history, not financial advice. Past results do not guarantee future results.'}
    return js


def args_variants(args) -> Dict[str, Optional[Sequence[str]]]:
    """The ablations (rule tuples) + the experiment ids (None) of this run."""
    out: Dict[str, Optional[Sequence[str]]] = {'full': ()} if args.no_ablations else dict(VARIANTS)
    if not getattr(args, 'no_experiments', False):
        for b, (k, ign) in BASES.items():
            out[k] = tuple(ign)
            out.update({exp_key(b, vid): None for vid in X.experiment_ids()})
    return out


def _dump_json(path: str, obj) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(obj, f, indent=1, ensure_ascii=False, allow_nan=False)
    os.replace(tmp, path)


def parse_expiry(s: str) -> Dict[str, float]:
    out = dict(EXPIRY_DAYS)
    for part in (s or '').split(','):
        if '=' in part:
            k, v = part.split('=', 1)
            out[k.strip().upper()] = float(v)
    return out


def selftest_data(n: int = 6000):
    import synth_fx
    insts, data = [], {}
    for name, start, seed in (('EUR_USD', 1.10, 15), ('GBP_JPY', 185.0, 827), ('XAU_AUD', 3900.0, 636)):
        i = {'name': name, 'type': 'METAL' if name.startswith('XAU') else 'CURRENCY', 'sym': name.replace('_', ''),
             'pipLocation': -2 if name.endswith('JPY') or name.startswith('XAU') else -4,
             'displayPrecision': 3 if name.endswith('JPY') else (2 if name.startswith('XAU') else 5), 'wl': True}
        i['cls'] = C.fx_class(name, i['type'])
        h4 = synth_fx.h4_walk(seed, n=n, start=start)
        sp = 1.2 * C.pip_of(i)
        data[name] = ([quote_from_mid(b, sp) for b in h4],
                      {tf: synth_fx.aggregate(h4, tf) for tf in ('D1', 'W1', 'MN')})
        insts.append(i)
    return insts, data


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--instruments', default='', help="comma-separated Pepperstone / OANDA names, or 'watchlist'")
    ap.add_argument('--years', default='max', help="test period in years back from the newest bar, or 'max'")
    ap.add_argument('--max-instruments', type=int, default=0, help='first N of the universe (watchlist first)')
    ap.add_argument('--include-cfd', action='store_true', help='indices / commodities CFDs too')
    ap.add_argument('--no-ablations', action='store_true', help='full rules only (ablations: no-nesting / no-spread)')
    ap.add_argument('--no-experiments', action='store_true', help='skip the experiment variants (fxexperiments.py)')
    ap.add_argument('--step', type=int, default=1, help='evaluate every Nth H4 close (1 = every close)')
    ap.add_argument('--expiry-days', default='', help='e.g. H4=5,D1=15,W1=45,MN=120')
    ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
    ap.add_argument('--budget-min', type=float, default=float(os.environ.get('FX_BT_BUDGET_MIN') or 0),
                    help='stop evaluating after N minutes (0 = no limit); results are flagged partial')
    ap.add_argument('--no-write', action='store_true')
    ap.add_argument('--selftest', action='store_true', help='synthetic data, no network, nothing written')
    a = ap.parse_args(argv)
    t0 = time.time()
    EXPIRY_DAYS.update(parse_expiry(a.expiry_days))
    variants = args_variants(a)
    if a.selftest:
        uni, data = selftest_data()
        first = min(d[0][300].d for d in data.values())
        job = {'start': first, 'variants': variants, 'expiry': EXPIRY_DAYS, 'step': max(a.step, 6), 'deadline': None,
               'synthetic': data, 'warmup': 300}
        res = run_all(uni, job, workers=1)
        js = build(res, uni, first, a, synthetic=True)
        ex, ex_all = build_experiments(orders_of(res), js['period'], js['generated'], ran=variants, with_all=True)
        print_summary(js)
        print_experiments(ex)
        bad = validate_experiments(ex) + validate_all(ex_all)
        if bad:
            print('fx_experiments.json schema problems: ' + '; '.join(bad))
        return 0 if not js['errors'] and not bad else 1
    SD.set_budget(90)                                        # network only
    O.token()
    instruments, src = O.account_instruments(log=print)
    import fxscan as X
    known = {i['name'] for i in instruments} if src != 'fallback' else None
    wl = W.load(known)
    uni = [i for i in X.universe(instruments, wl, include_cfd=a.include_cfd) if i['name'] != 'USDX']
    if a.instruments.strip().lower() == 'watchlist':
        uni = [i for i in uni if i.get('wl')]
    elif a.instruments.strip():
        want = {s.strip().upper() for s in a.instruments.split(',') if s.strip()}
        uni = [i for i in uni if i['sym'].upper() in want or i['name'].upper() in want]
    if a.max_instruments > 0:
        uni = uni[:a.max_instruments]
    print(f'{len(uni)} instruments ({src} list, watchlist {len(wl["names"])} from {wl["source"]}); fetching history')
    ok = []
    errors = {}
    for i in uni:
        try:
            for tf in ('H4', 'D1', 'W1', 'MN'):
                fetch_history(i['name'], tf, log=print)
            ok.append(i)
        except Exception as e:  # noqa: BLE001
            errors[i['name']] = f'fetch: {type(e).__name__}: {str(e)[:120]}'
            print(f"  {i['name']}: {errors[i['name']]}")
    print(f'history ready in {time.time() - t0:.0f}s')
    newest = ''
    for i in ok:
        h4, _ = load_cached(i['name'])
        newest = max(newest, h4[-1].d if h4 else '')
    if not ok or not newest:
        print('no data')
        return 2
    if a.years.strip().lower() in ('', 'max', 'all', '0'):
        start = '2000-01-01T00:00'
    else:
        start = _s(_p(newest) - dt.timedelta(days=365.25 * float(a.years)))
    deadline = time.time() + a.budget_min * 60 if a.budget_min > 0 else None
    job = {'start': start, 'variants': variants, 'expiry': EXPIRY_DAYS, 'step': a.step, 'deadline': deadline}
    print(f'walk-forward from {start} with {a.workers} workers, variants {", ".join(variants)}')
    res = run_all(ok, job, workers=a.workers)
    firsts = [r['first'] for r in res if r['first']]
    eff_start = min(firsts) if firsts else start
    js = build(res, ok, eff_start, a)
    js['errors'].update(errors)
    js['seconds'] = round(time.time() - t0)
    ex, ex_all = (build_experiments(orders_of(res), js['period'], js['generated'], ran=variants, with_all=True)
                  if not a.no_experiments else (None, None))
    print_summary(js)
    if ex:
        print_experiments(ex)
        bad = validate_experiments(ex) + validate_all(ex_all)
        if bad:
            print('::error::fx_experiments.json schema problems: ' + '; '.join(bad))
            ex = ex_all = None
    if not a.no_write:
        _dump_json(OUT_JSON, js)
        os.makedirs(os.path.dirname(OUT_MD), exist_ok=True)
        with open(OUT_MD, 'w') as f:
            f.write(markdown({**js, 'experiments': ex}))
        print(f'wrote {OUT_JSON} and {OUT_MD}')
        if ex:
            _dump_json(OUT_EXP, ex)
            _dump_json(OUT_EXP_ALL, ex_all)
            print(f'wrote {OUT_EXP} (base {ex["base_rules"]}) and {OUT_EXP_ALL}')
    print(f'done in {time.time() - t0:.0f}s')
    return 0


if __name__ == '__main__':
    sys.exit(main())
