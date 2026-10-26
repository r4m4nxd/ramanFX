"""The owner's TradingView watchlist -> OANDA instruments.

Source (first non-empty wins): env FX_WATCHLIST (repository secret / variable), else the committed
tools/fx_scanner/watchlist.txt. Format = TradingView's watchlist "Export list" file: comma-separated or one symbol
per line, `###Section` headers, symbols with or without an exchange prefix (OANDA:EURUSD, PEPPERSTONE:XAUUSD,
FX:GBPJPY, TVC:GOLD). Lines starting with '#' (one or two) are comments.

Watchlist instruments get instant alerts (located zone touch / approach, new signal) and come first in the daily
summary; a watchlist CFD (US30, NAS100, USOIL...) is scanned even when FX_INCLUDE_CFD is off.
"""
from __future__ import annotations

import os
import re
from typing import Dict, List, Optional, Tuple

import fxcfg as C

PATH = os.path.join(C.HERE, 'watchlist.txt')

# Pepperstone / TradingView ticker -> OANDA instrument (names a plain BASEQUOTE split cannot find). The first
# Pepperstone name per OANDA instrument is the one shown everywhere (pepper_symbol). None = not offered by OANDA.
ALIAS = {
    # metals / energy / softs (Pepperstone CFD names first)
    'XAUUSD': 'XAU_USD', 'GOLD': 'XAU_USD', 'XAGUSD': 'XAG_USD', 'SILVER': 'XAG_USD', 'XPTUSD': 'XPT_USD',
    'PLATINUM': 'XPT_USD', 'XPDUSD': 'XPD_USD', 'PALLADIUM': 'XPD_USD', 'COPPER': 'XCU_USD', 'XCUUSD': 'XCU_USD',
    'SPOTCRUDE': 'WTICO_USD', 'USOIL': 'WTICO_USD', 'WTI': 'WTICO_USD', 'XTIUSD': 'WTICO_USD', 'CL1!': 'WTICO_USD',
    'SPOTBRENT': 'BCO_USD', 'UKOIL': 'BCO_USD', 'BRENT': 'BCO_USD', 'XBRUSD': 'BCO_USD',
    'NATGAS': 'NATGAS_USD', 'XNGUSD': 'NATGAS_USD', 'CORN': 'CORN_USD', 'WHEAT': 'WHEAT_USD',
    'SOYBEANS': 'SOYBN_USD', 'SUGAR': 'SUGAR_USD',
    # indices
    'US30': 'US30_USD', 'DJI': 'US30_USD', 'NAS100': 'NAS100_USD', 'US100': 'NAS100_USD', 'NDX': 'NAS100_USD',
    'US500': 'SPX500_USD', 'SPX500': 'SPX500_USD', 'SPX': 'SPX500_USD', 'US2000': 'US2000_USD',
    'GER40': 'DE30_EUR', 'GER30': 'DE30_EUR', 'DE40': 'DE30_EUR', 'FRA40': 'FR40_EUR', 'EUSTX50': 'EU50_EUR',
    'EU50': 'EU50_EUR', 'UK100': 'UK100_GBP', 'JPN225': ('JP225Y_JPY', 'JP225_USD'), 'JP225': ('JP225Y_JPY', 'JP225_USD'),
    'AUS200': 'AU200_AUD', 'CHINAH': 'CHINAH_HKD',
    'HK50': 'HK33_HKD', 'CN50': 'CN50_USD', 'NETH25': 'NL25_EUR', 'SPA35': 'ESPIX_EUR', 'SWI20': 'CH20_CHF',
    # crypto (OANDA offers crypto only in some regions; checked against the account's list)
    'BTCUSD': 'BTC_USD', 'ETHUSD': 'ETH_USD', 'LTCUSD': 'LTC_USD', 'BCHUSD': 'BCH_USD',
    # the dollar index: computed from OANDA pairs (ICE formula, see synth_usdx in fxscan.py)
    'USDX': 'USDX', 'DXY': 'USDX',
    # not on OANDA
    'CA60': None, 'SCI25': None, 'VIX': None, 'CATTLE': None, 'COCOA': None, 'COFFEE': None,
    'COTTON': None, 'LDSUGAR': None, 'GASOLINE': None, 'EURX': None, 'JPYX': None,
}
SYNTHETIC = {'USDX'}
_REV: dict = {}
for _k, _v in ALIAS.items():
    for _x in ((_v,) if isinstance(_v, str) else (_v or ())):
        _REV.setdefault(_x, _k)


def pepper_symbol(name: str) -> str:
    """OANDA instrument -> the Pepperstone symbol shown everywhere (EUR_USD -> EURUSD, WTICO_USD -> SPOTCRUDE)."""
    return _REV.get(name) or name.replace('_', '')


CURRENCIES = set(C.G8) | {'SGD', 'HKD', 'ZAR', 'MXN', 'TRY', 'SEK', 'NOK', 'DKK', 'PLN', 'HUF', 'CZK', 'CNH', 'THB'} | set(C.METALS)


def raw_text() -> Tuple[str, str]:
    """(text, source) of the watchlist."""
    env = (os.environ.get('FX_WATCHLIST') or '').strip()
    if env:
        return env, 'FX_WATCHLIST'
    try:
        with open(PATH) as f:
            return f.read(), 'watchlist.txt'
    except OSError:
        return '', 'none'


def parse(text: str) -> List[Tuple[str, str]]:
    """[(section, tradingview symbol)] in file order; symbols before any header go to section ''."""
    out, sec = [], ''
    for line in text.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.startswith('#') and not s.startswith('###'):
            continue                                  # comment
        for tok in s.split(','):
            t = tok.strip()
            if not t:
                continue
            if t.startswith('###'):
                sec = t[3:].strip()
                continue
            out.append((sec, t))
    return out


def tv_ticker(sym: str) -> str:
    """'OANDA:EURUSD' -> 'EURUSD' (exchange prefix and spaces dropped, upper case, '/' '_' '.' removed)."""
    t = sym.split(':', 1)[1] if ':' in sym else sym
    t = t.split(',')[0]
    return re.sub(r'[\s/_.]', '', t).upper()


def map_symbol(sym: str, known: Optional[set] = None) -> Optional[str]:
    """TradingView symbol -> OANDA instrument name, None when unmapped. `known` (names on the account) checks it. The
    reversed pair (SGD_CHF for CHFSGD) is NEVER used: its prices are the reciprocal, so demand / supply and BUY / SELL
    would be inverted (see inverse_only)."""
    t = tv_ticker(sym)
    cands: List[str] = []
    if t in ALIAS:
        a = ALIAS[t]
        if a is None:
            return None
        if a in SYNTHETIC:
            return a
        cands.extend((a,) if isinstance(a, str) else a)
    m = re.fullmatch(r'([A-Z]{3})([A-Z]{3})', t)
    if m and m.group(1) in CURRENCIES and m.group(2) in CURRENCIES:
        cands.append(f'{m.group(1)}_{m.group(2)}')
    m3 = re.fullmatch(r'([A-Z]{3,5})(USD)', t)
    if m3 and not cands:
        cands.append(f'{m3.group(1)}_USD')               # crypto / other X-USD CFDs (checked against `known`)
    m2 = re.fullmatch(r'([A-Z0-9]+)_?([A-Z]{3})', sym.split(':', 1)[-1].upper().replace('/', '_'))
    if '_' in sym and m2:
        cands.insert(0, f'{m2.group(1)}_{m2.group(2)}')   # already an OANDA name (EUR_USD, US30_USD)
    if not cands:
        return None
    if known is None:
        return cands[0]
    return next((c for c in cands if c in known), None)


def inverse_only(sym: str, known: Optional[set]) -> bool:
    """The pair is not on the account but its inverse is (CHFSGD -> SGD_CHF)."""
    m = re.fullmatch(r'([A-Z]{3})([A-Z]{3})', tv_ticker(sym))
    return bool(known and m and f'{m.group(2)}_{m.group(1)}' in known and f'{m.group(1)}_{m.group(2)}' not in known)


def load(known: Optional[set] = None) -> Dict:
    """{'source', 'items': [{section, symbol, instrument}], 'unmapped': [{symbol, section, note}], 'names': [instrument],
    'sections': {instrument: section}} (an instrument listed twice keeps its first section)."""
    text, src = raw_text()
    items, unmapped, sections = [], [], {}
    for sec, sym in parse(text):
        inst = map_symbol(sym, known)
        items.append({'section': sec, 'symbol': sym, 'instrument': inst})
        if inst is None:
            unmapped.append({'symbol': sym, 'section': sec,
                             'note': 'only the inverse pair on OANDA (not used: levels would be inverted)' if inverse_only(sym, known) else 'not on OANDA'})
        else:
            sections.setdefault(inst, sec)
    return {'source': src, 'items': items, 'unmapped': unmapped, 'names': list(sections), 'sections': sections}
