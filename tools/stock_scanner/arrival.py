"""Raja ARRIVAL zones, REALIGNMENT areas and lower-TF CONFIRMATIONS (owner-approved rules, Oct 2026): a 1:1 port of
supabase/functions/telegram-bot/arrival.ts (the bot chart's canonical implementation), checked against the shared
fixture tools/telegram_bot/parity/arrival_fixtures.json (tests/test_arrival.py). Pure. Used by the alerts
(arrival_alerts.py: FX fxarrival.py / realign.py, stocks stock_arrivals.py).

Per timeframe, on CLOSED bars (zones.Series shifts: 0 = phantom bar, 1 = newest closed bar, larger = older):
  lines    zvtrend.zv_lines: the two most recent real peaks (down) / valleys (up), wick to wick, FitAnchor re-anchored,
           confirmed, not too flat, not broken by a full closed candle.
  ARRIVAL  a zone z (dir d) whose leg-out crosses the trend line against it and removes >= 1 opposite zone:
           1. leg-out = z.leg_bar, then up to 2 newer bars while each closes in direction d and is not basing (shift >= 1)
           2. the line = zv_lines on the closed bars older than the leg-out (shifts >= leg_bar + 1, phantom = their
              newest close): the DOWN line for a demand, the UP line for a supply; < 10 such bars = no line
           3. crossed = the first leg-out bar (oldest first) closing beyond it
           4. removed = the opposite detect() zones removed on a leg-out bar (detect order); 2+ = STRONG
  CURRENT  the newest arrival (smallest leg_bar) whose zone is not removed.
  PLAN     lineNow = the HTF line against d (zv_lines on the HTF closed bars + the live price), its value now; ceiling =
           lineNow when beyond price; weak = the TF's not-removed opposite zones not wholly on the arrival's side of price
           (Raja: after a supply arrival no limit buys on that TF); realign = the weak zone nearest lineNow; target =
           realign, else the weak zone nearest price; tp = min / max(target, ceiling) (capped), or without a ceiling the
           nearest opposite HTF zone wholly beyond price when further (extended); entry = proximal, stop = STOP RULE,
           rr = (tp - entry) / (entry - stop) (None when <= 0 or no tp).
  STOP     (owner, Oct 2026; arrival.ts header) buffer = max(0.1 x ATR14 of the entry TF at its newest closed bar, the
           typical spread in price units: FX the instrument's spread, stocks 5 bps of the price); valley = the extreme
           wick (demand low / supply high) of the leg-out candle, its base and the 2 candles before the base (shifts
           leg_bar .. leg_bar + base_n + 2); host = the newest not-removed HIGHER-TF zone of the same side overlapping
           the entry zone (plan: the HTF zones; confirmation: the realignment zone). stop = host.dist -/+ 2 buffers
           (basis 'htf') unless the valley stop (valley -/+ 1 buffer, basis 'valley') is further.
  CONFIRM  on the LTF (CONFIRM_TF): an LTF arrival of the other side, not removed, overlapping the realign zone, with
           its leg-out at / after the TF arrival's; entry its proximal, stop = STOP RULE (host = the realign zone), target = the TF's newest real
           pivot on the arrival's side (supply arrival: the last real peak's high); pending = a realign zone waits.
Alert-side extras (not in arrival.ts, never change the parity outputs): Arrival.known_bar (the bar on which the
arrival became true: the alerts send only new ones) and Arrival.date.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Sequence

import zones as Z
import zvtrend as ZV

CONFIRM_TF = {'H1': 'M15', 'H4': 'M15', 'D1': 'H1', 'W1': 'H4', 'MN': 'D1', '3M': 'W1'}   # owner: H4->15m, D1->1H, W1->H4, MN->D1, 3M->W1
HIGHER_TF = {'M15': 'H1', 'H1': 'H4', 'H4': 'D1', 'D1': 'W1', 'W1': 'MN', 'MN': '3M', '3M': None}
LOWER_OF = CONFIRM_TF
FX_P = {**Z.RAJA, 'base_strict': True, 'emo_touch': True}           # zonecore.ts FX_PARAMS
NEW_BARS = {'M15': 2, 'H1': 2}   # alerts: an arrival is new when it became true on the newest closed bar (the 15-min /
                                 # 1-hour checks: the newest 2, a skipped run is caught up)
INSIDE_NEAR = 0.5                # realign job: an area counts as "price inside" up to 50% of its height beyond it
SL_ATR_FRAC = 0.1              # stop rule (arrival.ts SL): buffer = max(0.1 x ATR14 entry TF, spread)
SL_HTF_BUFFERS = 2             # host stop = 2 buffers beyond the HTF zone's distal
STOCK_SPREAD_BPS = 5.0         # a stock's typical spread (bps of the price)
AS_OF_BARS = ZV.ZV['lookback'] + 60   # bars kept before the leg-out on real TFs (zv_lines reads the newest 200 + 2)


def new_bars(tf: str) -> int:
    return NEW_BARS.get(tf, 1)


@dataclass
class Arrival:
    tf: str
    zone: Z.Zone
    line: ZV.ZvLine               # in the TF's own shifts (a, b = the older series' shifts + leg_bar)
    legs: List[int]
    cross_bar: int
    cross_px: float
    removed: List[Z.Zone]
    valley: float = 0.0           # stop rule: the base valley's low (demand) / peak's high (supply)
    t_leg: str = ''               # S.T[leg_bar]
    known_bar: int = 0            # alert extra: the shift on which the arrival became true
    date: str = ''                # alert extra: S.T[known_bar]

    @property
    def dir(self) -> int: return self.zone.dir

    @property
    def strong(self) -> bool: return len(self.removed) >= 2

    @property
    def id(self) -> str: return self.zone.zid


@dataclass
class Plan:
    dir: int
    entry: float
    stop: float
    ceiling: Optional[float] = None
    line_now: Optional[float] = None
    ceiling_line: Optional[ZV.ZvLine] = None
    weak: List[Z.Zone] = field(default_factory=list)
    realign: Optional[Z.Zone] = None
    target: Optional[Z.Zone] = None
    target_px: Optional[float] = None
    htf_zone: Optional[Z.Zone] = None
    tp: Optional[float] = None
    capped: bool = False
    extended: bool = False
    buffer: float = 0.0
    atr: float = 0.0
    basis: str = 'valley'          # 'htf' | 'valley'
    valley: float = 0.0
    host: Optional[Z.Zone] = None  # the same-side HTF zone the entry zone sits in
    rr: Optional[float] = None


@dataclass
class Confirm:
    tf: str
    arrival: Arrival
    target: Optional[float]
    in_area: bool
    stop: float = 0.0
    buffer: float = 0.0
    atr: float = 0.0
    basis: str = 'valley'
    rr: Optional[float] = None

    @property
    def entry(self) -> float: return self.arrival.zone.prox

    @property
    def zone(self) -> Z.Zone: return self.arrival.zone


@dataclass
class ArrivalTf:
    tf: str
    htf: Optional[str]
    ltf: Optional[str]
    S: Optional[Z.Series] = None
    zones: List[Z.Zone] = field(default_factory=list)
    arrivals: List[Arrival] = field(default_factory=list)
    current: Optional[Arrival] = None
    plan: Optional[Plan] = None
    confirm: Optional[Confirm] = None
    pending: bool = False
    swing: Optional[float] = None   # the newest real pivot on the current arrival's side (the confirmation target)


def lo(z) -> float: return min(z.prox, z.dist)
def hi(z) -> float: return max(z.prox, z.dist)


def gap(v: float, z) -> float:
    return lo(z) - v if v < lo(z) else (v - hi(z) if v > hi(z) else 0.0)


def t16(t: str) -> str:
    return t[:16] if len(t) >= 16 else f'{t[:10]}T00:00'


def stock_spread(price: float) -> float:
    return price * STOCK_SPREAD_BPS / 1e4 if price and price > 0 else 0.0


@dataclass
class Stop:
    stop: float
    buffer: float
    atr: float
    basis: str
    valley: float
    host: Optional[object]


def stop_of(S: Z.Series, d: int, valley: float, host_dist: Optional[float], spread: float = 0.0, host=None) -> Stop:
    """arrival.ts stopOf: the stop rule for a zone of dir d on the entry TF's series S."""
    atr = S.atr(1)
    buf = max(SL_ATR_FRAC * atr, spread if spread and spread > 0 else 0.0)
    vs = valley - d * buf
    if host_dist is not None:
        hs = host_dist - d * SL_HTF_BUFFERS * buf
        if (hs <= vs) if d > 0 else (hs >= vs):
            return Stop(hs, buf, atr, 'htf', valley, host)
    return Stop(vs, buf, atr, 'valley', valley, host)


def closed_series(S: Z.Series, k: int, tf: Optional[str] = None, keep: Optional[int] = None) -> Z.Series:
    """The closed bars at shifts >= k as a series of their own (phantom = the newest of them's close): shift k -> 1."""
    tf = tf or S.tf
    old = S.n - 1 if keep is None else min(S.n - 1, k + keep)
    bars = [Z.Bar(S.T[j], S.O[j], S.H[j], S.L[j], S.C[j]) for j in range(old, k - 1, -1)]
    return Z.Series(bars, S.C[k] if S.n > k else 0.0, tf)


def series_of(bars: Sequence[Z.Bar], tf: str, price: Optional[float] = None) -> Z.Series:
    """Closed bars oldest first -> Series (phantom = price, default the newest close)."""
    return Z.Series(list(bars), (bars[-1].c if bars else 0.0) if price is None else price, tf)


def find_arrivals(S: Z.Series, tf: str, p=FX_P, zones: Optional[List[Z.Zone]] = None):
    """(zones, arrivals newest first) of one TF. S = its closed bars (+ any phantom: never read). zones = detect(S, p)
    when not given (a scanner row's zones, detected with the same parameters)."""
    if zones is None:
        zones = Z.detect(S, p) if S.n > p['max_base'] + 4 else []
    out: List[Arrival] = []
    keep = None if tf in ZV.VIRTUAL else AS_OF_BARS
    for z in zones:
        L, d = z.leg_bar, z.dir
        legs = [L]
        j = L - 1
        while j >= 1 and len(legs) < 3 and S.cdir(j) == d and not S.basing(j):
            legs.append(j)
            j -= 1
        if S.n - 1 - L < 2 * ZV.ZV['swing'] + 6:              # closed bars older than the leg-out
            continue
        T = closed_series(S, L + 1, tf, keep)
        r = ZV.zv_lines(T)
        t = r.dn if d > 0 else r.up
        if t is None:
            continue
        cross = next((j for j in legs if (S.C[j] > t.at(j - L) if d > 0 else S.C[j] < t.at(j - L))), None)
        if cross is None:
            continue
        newest = legs[-1]
        rem = [y for y in zones if y.dir == -d and y.removed and newest <= y.removed_bar <= L]
        if not rem:
            continue
        line = ZV.ZvLine(t.dir, t.a + L, t.b + L, t.pa, t.pb, t.cuts)
        known = min(cross, max(y.removed_bar for y in rem), z.sa_bar)
        j1 = min(L + z.base_n + ZV.ZV['swing'], S.n - 1)
        valley = min(S.L[j] for j in range(L, j1 + 1)) if d > 0 else max(S.H[j] for j in range(L, j1 + 1))
        out.append(Arrival(tf, z, line, legs, cross, t.at(cross - L), rem, valley=valley, t_leg=S.T[L], known_bar=known, date=S.T[known]))
    out.sort(key=lambda a: a.zone.leg_bar)
    return zones, out


def arrival_tf(S: Z.Series, tf: str, price: float, p=FX_P, htf_S: Optional[Z.Series] = None,
               ltf_S: Optional[Z.Series] = None, htf: Optional[str] = '', ltf: Optional[str] = '',
               zones: Optional[List[Z.Zone]] = None, htf_zones: Optional[List[Z.Zone]] = None,
               ltf_zones: Optional[List[Z.Zone]] = None, spread: float = 0.0) -> ArrivalTf:
    """arrivalTf: the arrival reading of one TF. S / htf_S / ltf_S = series of CLOSED bars (htf_S: phantom = the live
    price, as the TS builds it; S / ltf_S: any phantom). htf / ltf default to HIGHER_TF / CONFIRM_TF. spread = the
    typical spread in price units (the stop rule's buffer floor)."""
    htf = HIGHER_TF.get(tf) if htf == '' else htf
    ltf = CONFIRM_TF.get(tf) if ltf == '' else ltf
    res = ArrivalTf(tf, htf, ltf, S)
    if S is None or S.n - 1 < 20:
        return res
    res.zones, res.arrivals = find_arrivals(S, tf, p, zones)
    cur = res.current = next((a for a in res.arrivals if not a.zone.removed), None)
    if cur is None:
        return res
    d = cur.dir
    ceiling = line_now = None
    ceiling_line = None
    H = None
    hz: List[Z.Zone] = []
    if htf and htf_S is not None and htf_S.n - 1 >= 10:
        H = htf_S
        rl = ZV.zv_lines(H)
        t = rl.dn if d > 0 else rl.up
        if t is not None:
            line_now, ceiling_line = t.at(0), t
            if (line_now > price) if d > 0 else (line_now < price):
                ceiling = line_now
        hz = htf_zones if htf_zones is not None else (Z.detect(H, p) if H.n > p['max_base'] + 4 else [])
    age = p['max_zone_age']
    weak = [z for z in res.zones if z.dir == -d and not z.removed and z.leg_bar <= age and (hi(z) > price if d > 0 else lo(z) < price)]
    realign = None
    if line_now is not None and weak:
        v = line_now
        realign = sorted(weak, key=lambda z: (gap(v, z), gap(price, z)))[0]
    target = realign if realign is not None else (sorted(weak, key=lambda z: gap(price, z))[0] if weak else None)
    target_px = target.prox if target is not None else None
    tp, capped, extended, htf_zone = target_px, False, False, None
    if ceiling is not None:
        tp = ceiling if target_px is None else (min(target_px, ceiling) if d > 0 else max(target_px, ceiling))
        capped = tp == ceiling
    elif H is not None:
        beyond = [z for z in hz if z.dir == -d and not z.removed and z.leg_bar <= age and (lo(z) > price if d > 0 else hi(z) < price)]
        if beyond:
            cand = sorted(beyond, key=lambda z: gap(price, z))[0]
            htf_zone = cand
            if target_px is None or (cand.prox > target_px if d > 0 else cand.prox < target_px):
                tp, extended = cand.prox, True
    hosts = [z for z in hz if z.dir == d and not z.removed and lo(z) <= hi(cur.zone) and hi(z) >= lo(cur.zone)]
    host = min(hosts, key=lambda z: z.leg_bar) if hosts else None
    st = stop_of(S, d, cur.valley, host.dist if host is not None else None, spread, host)
    res.plan = Plan(d, cur.zone.prox, st.stop, ceiling, line_now, ceiling_line, weak, realign, target, target_px,
                    htf_zone, tp, capped, extended, st.buffer, st.atr, st.basis, st.valley, host, rr(cur.zone.prox, st.stop, tp))
    piv = [q for q in ZV.zv_pivots(S, min(ZV.ZV['lookback'], S.n - 1 - ZV.ZV['swing'])) if q.t == (1 if d < 0 else -1)]
    res.swing = piv[-1].p if piv else None
    if realign is not None and ltf:
        res.pending = True
        if ltf_S is not None and ltf_S.n - 1 >= 20:
            c = confirm_in(ltf_S, ltf, p, -d, lo(realign), hi(realign), cur.t_leg, ltf_zones)
            if c is not None:
                cs = stop_of(ltf_S, -d, c.valley, realign.dist, spread, realign)
                res.confirm = Confirm(ltf, c, res.swing, gap(price, realign) == 0, cs.stop, cs.buffer, cs.atr, cs.basis,
                                      rr(c.zone.prox, cs.stop, res.swing))
                res.pending = False
    return res


def confirm_in(ltf_S: Z.Series, ltf: str, p, d: int, area_lo: float, area_hi: float, t_leg: str,
               zones: Optional[List[Z.Zone]] = None) -> Optional[Arrival]:
    """The newest LTF arrival of direction d, not removed, overlapping [area_lo, area_hi], leg-out at / after t_leg."""
    _, la = find_arrivals(ltf_S, ltf, p, zones)
    t0 = t16(t_leg)
    return next((a for a in la if a.dir == d and not a.zone.removed and lo(a.zone) <= area_hi and hi(a.zone) >= area_lo
                 and t16(a.t_leg) >= t0), None)


def touches_area(lo_: float, hi_: float, bar_lo: float, bar_hi: float, near: float = 0.0) -> bool:
    """A bar (or the price: bar_lo = bar_hi) reached the area (widened by `near` x its height)."""
    h = (hi_ - lo_) * near
    return bar_lo <= hi_ + h and bar_hi >= lo_ - h


def rr(entry: float, stop: float, target: Optional[float]) -> Optional[float]:
    if target is None or entry == stop:
        return None
    r = (target - entry) / (entry - stop)
    return r if r > 0 else None
