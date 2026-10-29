"""Synthetic instruments from OANDA legs: FX crosses OANDA does not quote (EURMXN = EURUSD x USDMXN, NOKJPY =
USDJPY / USDNOK, CHFSGD = 1 / SGDCHF ...) and currency baskets (EURX, JPYX), the same way as the scanner's USDX.

    value = k x PRODUCT(leg ^ w)            per bar label present in EVERY leg (same server-time grid, BID candles)

  open / close   exact from the legs' open / close at the same timestamps.
  high / low     an UPPER bound of the true range: high = k x PRODUCT(leg high ^ w for w > 0, leg low ^ w for w < 0),
                 low the mirror. The legs' extremes rarely happen in the same minute, so the bound overstates the wick
                 by at most the smaller leg's range in that bar (never understates it: zones built on it have their
                 distal a little further out, i.e. a slightly wider stop). To keep that error small the H4 bars take
                 the extremes of their four synthetic H1 bars, and D1 / W1 / MN bars the extremes of their synthetic
                 H4 bars whenever the finer bars cover the whole period (else the plain bound). Typical overstatement
                 on H1: 0.01-0.05% of price, i.e. 1-5 pips on EURMXN; bodies (the proximal) are exact.
  bid            a product of bids is the cross's bid. A division (w = -1) of bids gives a price one divisor-spread
                 too high: crosses (all weights +-1) are multiplied by (1 - the divisor's typical relative spread).
  spread         the combined legs: value x SUM(|w| x leg spread / leg price) (typical H4 close spreads).

Baskets (EURX, JPYX) are context only: Pepperstone does not publish their exact definition (see instruments.json
`note`), so their LEVELS are approximate even though their shape follows the currency.
"""
from __future__ import annotations

from typing import Callable, Dict, List, Optional, Tuple

from . import bars as B  # noqa: F401  (sys.path setup)
import fxcfg as C
from zones import Bar

LegGetter = Callable[[str], Tuple[Dict[str, List[Bar]], Optional[float]]]
TFS = ('H1', 'H4', 'D1', 'W1', 'MN')
FINER = {'H4': 'H1', 'D1': 'H4', 'W1': 'H4', 'MN': 'H4'}


def _key(tf: str, lbl: str) -> str:
    return C.h4_bucket(lbl) if tf == 'H4' else C.period_key(tf, lbl)


def compose(parts: Dict[str, Dict[str, List[Bar]]], weights: Dict[str, float], k: float = 1.0,
            shift: float = 1.0) -> Dict[str, List[Bar]]:
    """{tf: bars} of k x PRODUCT(leg ^ w) x shift (see the module doc for the high / low method)."""
    out: Dict[str, List[Bar]] = {}
    for tf in TFS:
        maps = {n: {b.d: b for b in (parts.get(n) or {}).get(tf, [])} for n in weights}
        common = sorted(set.intersection(*(set(m) for m in maps.values()))) if maps else []
        bars = []
        for lbl in common:
            def val(pick):
                v = k * shift
                for n, w in weights.items():
                    v *= getattr(maps[n][lbl], pick(w)) ** w
                return v
            o, c = val(lambda w: 'o'), val(lambda w: 'c')
            h, l = val(lambda w: 'h' if w > 0 else 'l'), val(lambda w: 'l' if w > 0 else 'h')
            bars.append(Bar(lbl, o, max(h, o, c), min(l, o, c), c))
        out[tf] = bars
    for tf in ('H4', 'D1', 'W1', 'MN'):                     # tighter wicks from the finer synthetic bars
        fine = out.get(FINER[tf]) or []
        if not fine:
            continue
        groups: Dict[str, List[Bar]] = {}
        for b in fine:
            groups.setdefault(_key(tf, b.d), []).append(b)
        # the finer bars cover a period when every leg has exactly that many finer bars in it
        legn: Dict[str, int] = {}
        for n in weights:
            cnt: Dict[str, int] = {}
            for b in (parts.get(n) or {}).get(FINER[tf], []):
                kk = _key(tf, b.d)
                cnt[kk] = cnt.get(kk, 0) + 1
            for kk, v in cnt.items():
                legn[kk] = max(legn.get(kk, 0), v)
        first = fine[0].d
        fixed = []
        for b in out[tf]:
            kk = _key(tf, b.d)
            g = groups.get(kk)
            if g and b.d >= first and len(g) == legn.get(kk, -1):
                hh, ll = max(x.h for x in g), min(x.l for x in g)
                b = Bar(b.d, b.o, max(min(hh, b.h), b.o, b.c), min(max(ll, b.l), b.o, b.c), b.c)
            fixed.append(b)
        out[tf] = fixed
    return out


def is_cross(weights: Dict[str, float]) -> bool:
    return all(abs(abs(w) - 1) < 1e-12 for w in weights.values())


def combined_spread(value: float, legs: Dict[str, Tuple[float, Optional[float]]], weights: Dict[str, float]) -> Optional[float]:
    """value x SUM(|w| x spread / price) over the legs; None when a leg's spread is unknown."""
    rel = 0.0
    for n, w in weights.items():
        px, sp = legs[n]
        if sp is None or not px:
            return None
        rel += abs(w) * sp / px
    return value * rel


def bars(spec: Dict, leg: LegGetter) -> Tuple[Dict[str, List[Bar]], Optional[float]]:
    """({tf: bars}, typical spread) of a synthetic instrument; leg(name) = the OANDA getter of one leg."""
    w = {n: float(x) for n, x in spec['legs'].items()}
    parts, info = {}, {}
    for n in w:
        b, sp = leg(n)
        parts[n] = b
        h4 = b.get('H4') or []
        info[n] = (h4[-1].c if h4 else 0.0, sp)
    shift = 1.0
    if is_cross(w):
        for n, x in w.items():
            px, sp = info[n]
            if x < 0 and sp is not None and px:
                shift *= 1 - sp / px                        # bid / bid -> bid / ask
    out = compose(parts, w, float(spec.get('k') or 1.0), shift)
    h4 = out.get('H4') or []
    sp = combined_spread(h4[-1].c, info, w) if h4 else None
    return out, sp
