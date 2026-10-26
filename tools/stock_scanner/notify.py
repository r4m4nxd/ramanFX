"""Telegram messages for the daily scan (Bot API sendMessage, parse_mode HTML, <>& escaped), grouped by SECTOR.

1) Header: date, regime (SPY / QQQ / IWM vs the 200-day average + curve), counts, sectors ranked by BUYs.
2) Signals first, when there are any: one message per sector (emoji + bold name): BUY cards (top N by Raja score),
   WATCH cards, EXIT cards. Fixed labels on every card so it reads (and parses) the same each day.
3) Every day, the zone lists (lists.py; the same lists as latest.json zone_lists and the app's market map), D1 / W1 /
   MN zones only, grouped by sector, top TELEGRAM_LIST_CAP per section by zone score, the rest "+N more on the app":
     DEMAND  🟢 In demand now · ⬇️ Approaching demand (close <= 3% above the proximal) · ↗️ Left demand (bounced)
     SUPPLY  🔴 In supply · ⬆️ Approaching supply · ↘️ Left supply (rejected)
   Each line: TICKER (TSX:… when Canadian) price · zone TF type score · % to the zone · Raja status (BUY or the first
   rule that blocks a BUY; supply: the direction).
4) Every message < 4000 UTF-16 units, split only between blocks. >= 1.1 s between sends; a 429 waits retry_after.
5) Last line: link to the full list in the app. Footer: "Not financial advice — zone rules only."

Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (unset -> printed instead). TELEGRAM_TOP_N (default 5), TELEGRAM_LIST_CAP (15).
Preview without sending: python tools/stock_scanner/scan.py --preview-telegram (reads the published JSON).
"""
from __future__ import annotations

import html
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Tuple

import lists as L

LIMIT = 4096
SAFE = 4000
FULL_LIST = os.environ.get('SCANNER_APP_URL', 'https://raman-fx.vercel.app/scanner')
FOOTER = 'Not financial advice — zone rules only. Untested on stocks until the backtest says otherwise.'
SECTOR_EMOJI = {'Information Technology': '💻', 'Health Care': '🩺', 'Financials': '🏦', 'Consumer Discretionary': '🛍️',
                'Consumer Staples': '🛒', 'Industrials': '🏭', 'Energy': '🛢️', 'Materials': '⛏️', 'Utilities': '💡',
                'Real Estate': '🏠', 'Communication Services': '📡', 'Other': '📦'}
SECTOR_SHORT = {'Information Technology': 'Tech', 'Health Care': 'Health', 'Financials': 'Financials', 'Consumer Discretionary': 'Discretionary',
                'Consumer Staples': 'Staples', 'Industrials': 'Industrials', 'Energy': 'Energy', 'Materials': 'Materials',
                'Utilities': 'Utilities', 'Real Estate': 'Real estate', 'Communication Services': 'Comms', 'Other': 'Other'}
LIST_CAP = int(os.environ.get('TELEGRAM_LIST_CAP') or '15')
ICON = {'pass': '✓', 'fail': '✗', 'warn': '!', 'unknown': '?', 'info': '·'}


def esc(s) -> str: return html.escape(str(s), quote=False)
def u16(s: str) -> int: return len(s.encode('utf-16-le')) // 2
def _f(v, nd=2) -> str: return 'n/a' if v is None else f'{v:,.{nd}f}'


def _idx(s: Dict) -> str:
    ix = [i for i in (s.get('indexes') or []) if i]
    return f" · [{' '.join(ix)}]" if ix else ''


def _fund_row(s: Dict) -> str:
    f = s.get('fundamentals') or {}
    if not f:
        return ''
    def pct(v): return 'n/a' if v is None else f'{v * 100:+.0f}%'
    pe = f"{f['pe']:.0f}" if f.get('pe') else ('neg' if f.get('eps_ttm') is not None and f['eps_ttm'] <= 0 else 'n/a')
    de = f"{f['debt_to_equity']:.1f}" if f.get('debt_to_equity') is not None else 'n/a'
    mc = f.get('market_cap')
    mcs = 'n/a' if not mc else (f'${mc / 1e12:.1f}T' if mc >= 1e12 else f'${mc / 1e9:.0f}B' if mc >= 1e9 else f'${mc / 1e6:.0f}M')
    return f"Fund: <pre>P/E {pe} · Rev YoY {pct(f.get('revenue_yoy'))} · EPS YoY {pct(f.get('eps_yoy'))} · Debt/Eq {de} · Mcap {mcs}</pre>"


def _curve_word(c) -> str:
    if c is None:
        return 'n/a'
    word = 'low' if c <= 25 else 'high' if c >= 75 else 'mid'
    return f'{word} {int(round(c)) + 0}%'


def _curve_owner(s: Dict) -> bool:
    """The curve rule passed by the owner's ATH rule (no MN supply overhead, W1 + MN trend up)."""
    return any(r.get('short') == 'curve' and 'owner rule' in (r.get('text') or '') for r in s.get('rules') or [])


def _rules_short(s: Dict) -> str:
    out = []
    for r in s['rules']:
        if r.get('short') in ('leg',) and r['status'] == 'pass':
            continue
        out.append(f"{ICON[r['status']]}{r.get('short') or r['ref']}")
    return ' '.join(out)


def _pz_line(s: Dict) -> str:
    parts = [f"{k.upper()} {_f(s.get(k))} ({_f(s.get('rr_' + k), 1)}R)" for k in ('pz1', 'pz2', 'pz3') if s.get(k) is not None]
    return 'Targets: ' + (' · '.join(parts) if parts else 'n/a')


def _flags(s: Dict) -> str:
    f = []
    if s.get('fv_inside'):
        f.append('inside fair value')
    elif s.get('fv_dist_atr') is not None and s['fv_dist_atr'] >= 1:
        f.append(f"{s['fv_dist_atr']:.1f} ATR below FV")
    if s.get('index_aligned'):
        f.append('index aligned')
    elif s.get('index_state') == 'supply':
        f.append('⚠ index in supply')
    return (' · ' + ' · '.join(f)) if f else ''


def index_text(ix) -> str:
    if not ix:
        return ''
    def z(k):
        v = ix.get(k)
        return f"{k} {v['pct']:.1f}% {'below' if k == 'demand' else 'above'}" if v else f'no {k}'
    return f"RFX index (SPY·QQQ·IWM·DIA) {ix['price']:.2f}: {ix['state'].upper() if ix['state'] != 'middle' else 'middle'} · {z('demand')} · {z('supply')} · {ix['direction']}"


def watch_block(alerts) -> str:
    if not alerts:
        return ''
    icon = {'APPROACH': '🔔', 'IN ZONE': '🎯', 'IN SUPPLY': '⛔', 'INDEX': '🌐'}
    return '⭐ <b>Watchlist alerts</b>\n' + '\n'.join(f"{icon.get(a['kind'], '•')} {esc(a['kind'])} · {esc(a['text'])}" for a in alerts)


def signal_card(s: Dict) -> str:
    kind = s['kind']
    head = ('🟢 BUY' if kind == 'BUY' else '🟡 WATCH') + f" <b>{esc(s['symbol'])}</b> · {esc(s.get('name', ''))}{esc(_idx(s))}"
    if s.get('home'):
        head += f" · {esc(s['home'].replace(':', ': '))} · US listing ({esc(s.get('currency') or 'USD')})"
    state = 'fresh' if s['touches'] == 0 else f"touch {s['touches'] + 1}"
    lines = [head,
             f"Zone: {s['tf']} demand {s['proximal']:.2f}–{s['distal']:.2f} ({state}, {s['zone_type']} type, score {s.get('score', 0)}/10)",
             f"Entry {_f(s['entry'])} · Stop {_f(s['stop'])} · Target {_f(s['target'])}"
             + (' (250% projection, no supply above, L5)' if s.get('target_kind') == 'projection' else '') + f" · R:R {_f(s['rr'], 1)}",
             _pz_line(s),
             f"Scores: Raja {s.get('score', 0)}/10 · Seiden odds {_f(s.get('seiden_score'), 1)}/10" + _flags(s),
             f"Curve: {_curve_word(s.get('curve'))}" + (' (ATH area, W1 + MN up: allowed)' if _curve_owner(s) else '') + " · Trend: {esc(s['direction'])} (W1 {esc(s['w1'])}, MN {esc(s['mn'])})",
             'Rules: ' + esc(_rules_short(s))]
    if kind == 'WATCH':
        lines.append('Note: ' + esc('new zone, price still far' if s.get('watch') == 'new' else 'tested: needs a lower-TF confirmation'))
    fr = _fund_row(s)
    if fr:
        lines.append(fr)
    if s.get('chart'):
        lines.append(f"<a href=\"{esc(s['chart'])}\">Chart</a>")
    return '\n'.join(lines)


def exit_card(e: Dict) -> str:
    if 'warnings' not in e:                  # the published file keeps only the warning kinds (no position data)
        words = {'stop': 'stop hit by the close', 'demand_broken': 'demand under the entry broken by a close',
                 'near_supply': 'near the next supply', 'in_supply': 'inside a supply'}
        return f"🔴 EXIT <b>{esc(e['symbol'])}</b> · " + esc(' · '.join(words.get(r, r) for r in e.get('reasons') or []))
    parts = []
    for w in e['warnings']:
        if w['reason'] in ('near_supply', 'in_supply'):
            parts.append(f"{'near' if w['reason'] == 'near_supply' else 'inside'} {w['tf']} supply {w['lo']:.2f}–{w['hi']:.2f} · distance {w['dist_pct']:.1f}%")
        elif w['reason'] == 'stop':
            parts.append('stop hit by the close')
        else:
            parts.append('demand under the entry broken by a close')
    pos = ', '.join(x for x in (f"entry {e['entry']}" if e.get('entry') is not None else '', f"stop {e['stop']}" if e.get('stop') is not None else '',
                                f"{e['shares']} sh" if e.get('shares') is not None else '') if x)
    return (f"🔴 EXIT <b>{esc(e['symbol'])}</b> · " + esc(' · '.join(parts)) + f"\nPrice {e['price']:.2f}" + (f' ({esc(pos)})' if pos else '')
            + '\n' + '\n'.join('⚠ ' + esc(w['text']) for w in e['warnings']))


def regime_text(res: Dict) -> str:
    out = []
    for r in res.get('regime') or []:
        a = r.get('above200')
        side = 'above' if a else ('below' if a is not None else 'n/a vs')
        out.append(f"{r['symbol']} {side} 200D · MN curve {_curve_word(r.get('curve'))} · {r['direction']}")
    return '\n'.join(esc(x) for x in out) if out else 'Regime: n/a'


def by_sector(res: Dict) -> Dict[str, Tuple[List[Dict], List[Dict], List[Dict]]]:
    g: Dict[str, Tuple[List[Dict], List[Dict], List[Dict]]] = {}
    for s in res.get('signals', []):
        g.setdefault(s.get('sector') or 'Other', ([], [], []))[0 if s['kind'] == 'BUY' else 1].append(s)
    for e in res.get('exits', []):
        g.setdefault(e.get('sector') or 'Other', ([], [], []))[2].append(e)
    key = lambda s: (-s.get('score', 0), -(s.get('rr') or 0))
    for b, w, _ in g.values():
        b.sort(key=key)
        w.sort(key=key)
    return dict(sorted(g.items(), key=lambda kv: (-len(kv[1][0]), -len(kv[1][2]), -len(kv[1][1]), kv[0])))


def build_messages(res: Dict, top: int = 5, cap: int = LIST_CAP) -> List[str]:
    sigs = res.get('signals', [])
    buys = [s for s in sigs if s['kind'] == 'BUY']
    watch = [s for s in sigs if s['kind'] == 'WATCH']
    exits = res.get('exits', [])
    groups = by_sector(res)
    ranked = ' · '.join(f"{SECTOR_SHORT.get(k, k)} {len(v[0])}" for k, v in groups.items() if v[0]) or 'none'
    idx_counts = {}
    for s in buys:
        for i in s.get('indexes') or []:
            idx_counts[i] = idx_counts.get(i, 0) + 1
    title = '🧪 SELFTEST (synthetic data) · ' if res.get('fixture') else ''
    header = (f"{title}<b>RamanFX stock scan · {esc(res.get('date', ''))}</b>\n"
              f"{regime_text(res)}\n"
              + (esc(index_text(res.get('rfx_index'))) + '\n' if res.get('rfx_index') else '')
              + f"<b>{len(buys)}</b> BUY · {len(watch)} WATCH · {len(exits)} EXIT · {res.get('scanned', 0)} stocks scanned"
              + (f" · {len(res['uncovered'])} TSX-only names need a TSX data feed" if res.get('uncovered') else '') + '\n'
              + f"BUYs by sector: {esc(ranked)}"
              + (f"\nBy index: {esc(' · '.join(f'{k} {v}' for k, v in sorted(idx_counts.items())))}" if idx_counts else '')
              + '\nRaja rules (ZoneVision Raja template), Kevin second.')
    msgs = [header]
    wb = watch_block(res.get('watch_alerts') or [])
    if wb:
        msgs.extend(pack_cards(wb.split('\n', 1)[0], ['\n'.join(wb.split('\n')[1:])]))
    for sector, (b, w, e) in groups.items():
        cards = [signal_card(s) for s in b[:top]] + [signal_card(s) for s in w[:top]] + [exit_card(x) for x in e]
        more = max(0, len(b) - top) + max(0, len(w) - top)
        title = f"{SECTOR_EMOJI.get(sector, '📦')} <b>{esc(sector)}</b> · {len(b)} BUY · {len(w)} WATCH · {len(e)} EXIT"
        tail = f'+{more} more: full list {FULL_LIST}' if more else ''
        msgs.extend(pack_cards(title, cards, tail))
    zl = res.get('zone_lists') or L.zone_lists(res.get('details') or {})
    msgs.extend(list_messages(zl, cap=cap))
    if not buys:
        why = ', '.join(f"{r['label']} ({r['count']})" for r in ((res.get('blocked') or {}).get('reasons') or [])[:4])
        msgs.append('No BUY setup passed every rule today. No zone, no trade.' + (f'\nTop reasons: {esc(why)}' if why else ''))
    msgs.append(f'full list: {FULL_LIST}\n<i>{esc(FOOTER)}</i>')
    return msgs


STRONG_CAP = 10
MAP_URL = FULL_LIST + '?view=map'
SIDE_HEAD = {'demand': '🟢 <b>DEMAND</b> · D1 / W1 / MN zones', 'supply': '🔴 <b>SUPPLY</b> · D1 / W1 / MN zones'}
SECTION_HEAD = {('demand', 'in'): '🟢 <b>In demand now</b>', ('demand', 'near'): '⬇️ <b>Approaching demand</b>',
                ('demand', 'left'): '↗️ <b>Left demand</b>', ('supply', 'in'): '🔴 <b>In supply</b>',
                ('supply', 'near'): '⬆️ <b>Approaching supply</b>', ('supply', 'left'): '↘️ <b>Left supply</b>'}
SECTION_NOTE = {'in': 'close inside the zone', 'near': 'close within {near}% of the proximal',
                'left': 'touched in the last {n} sessions, closed back {way} the proximal'}
SECTION_ORDER = ('in', 'near', 'left')


def touch_word(r: Dict) -> str:
    """fresh / 2x tested; inside or just off the zone the count includes this touch: '1st touch'."""
    n = int(r.get('touches') or 0)
    if n == 0:
        return 'fresh'
    if r.get('section') in ('in', 'left'):
        return {1: '1st touch', 2: '2nd touch', 3: '3rd touch'}.get(n, f'touch {n}')
    return f'{n}x tested'


def list_line(r: Dict) -> str:
    """AAPL 347.73 · W1 STR 7/10 fresh · +2.1% · ✗ high on curve (one stock of a zone list)."""
    name = f"<b>{esc(r['s'])}</b>" + (f" ({esc(r['h'])})" if r.get('h') else '')
    zone = f"{r['tf']} {r['type']}" + (f" {r['score']}/10" if r.get('score') is not None else '') + ' ' + touch_word(r)
    if r['section'] == 'in':
        where = 'in zone'
    else:
        where = f"{r['pct']:.1f}% {'above' if r['side'] == 'demand' else 'below'}"
    st, lab = r.get('status') or '', r.get('label') or ''
    stat = '✅ BUY' if st == 'BUY' else '🟡 WATCH' if st == 'WATCH' else '✓ rules pass' if st == 'ok' else (lab if st == 'dir' else f'✗ {lab}' if lab else '')
    return f"{name} {_f(r.get('px'))} · {esc(zone)} · {where}" + (f' · {esc(stat)}' if stat else '')


def section_blocks(zl: Dict, side: str, sec: str, cap: int = LIST_CAP) -> List[str]:
    """[header, one block per sector (emoji + short name, then a line per stock), '+N more' link]: the top `cap` by
    zone score, grouped by sector (most stocks first)."""
    rows = (zl.get(side) or {}).get(sec) or []
    note = SECTION_NOTE[sec].format(near=f"{zl.get('near_pct', L.NEAR_PCT):g}", n=zl.get('left_sessions', L.LEFT_SESSIONS),
                                    way='above' if side == 'demand' else 'below')
    head = f"{SECTION_HEAD[(side, sec)]} · {len(rows)}" + (f' (top {cap})' if len(rows) > cap else '') + f"\n<i>{esc(note)}</i>"
    if not rows:
        return [head + '\nnone today']
    top = rows[:cap]
    by: Dict[str, List[Dict]] = {}
    for r in top:
        by.setdefault(r.get('sec') or 'Other', []).append(r)
    blocks = [head]
    for k, v in sorted(by.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        blocks.append(f"{SECTOR_EMOJI.get(k, '📦')} <b>{esc(SECTOR_SHORT.get(k, k))}</b>\n" + '\n'.join(list_line(r) for r in v))
    if len(rows) > cap:
        blocks.append(f'+{len(rows) - cap} more on the app: {MAP_URL}&b={sec}_{side}')
    return blocks


def list_messages(zl: Dict, cap: int = LIST_CAP) -> List[str]:
    """One DEMAND and one SUPPLY message (split when long), every section present even when empty."""
    out: List[str] = []
    for side in ('demand', 'supply'):
        blocks: List[str] = []
        for sec in SECTION_ORDER:
            blocks.extend(section_blocks(zl, side, sec, cap))
        out.extend(pack_cards(SIDE_HEAD[side], blocks))
    return out


def load_published(out_dir: str) -> Dict:
    """The committed scan as a result dict for build_messages: latest.json + the ticker details of the shards (the
    zone lists come from latest.json when it has them, else they are rebuilt from the shards and index.json)."""
    with open(os.path.join(out_dir, 'latest.json')) as f:
        res = json.load(f)
    rows: Dict[str, Dict] = {}
    try:
        with open(os.path.join(out_dir, 'index.json')) as f:
            rows = {r['s']: r for r in json.load(f).get('tickers') or []}
    except (OSError, ValueError):
        pass
    if not res.get('zone_lists'):
        details: Dict[str, Dict] = {}
        tdir = os.path.join(out_dir, 't')
        for name in sorted(os.listdir(tdir)) if os.path.isdir(tdir) else []:
            if name.endswith('.json'):
                with open(os.path.join(tdir, name)) as f:
                    details.update(json.load(f).get('tickers') or {})
        res['zone_lists'] = L.zone_lists(details, rows)
    return res


def preview(out_dir: str, top: int = 5, cap: int = LIST_CAP, out=sys.stdout) -> List[str]:
    """Print the exact messages of the published scan, never sending (the length of each in UTF-16 units)."""
    msgs = build_messages(load_published(out_dir), top=top, cap=cap)
    for k, m in enumerate(msgs):
        print(f'----- message {k + 1}/{len(msgs)} · {u16(m)} UTF-16 units -----', file=out)
        print(m, file=out)
    return msgs


def strong_block(rows: List[Dict], cap: int = STRONG_CAP) -> List[str]:
    """[title, one line per sector]: tickers inside a fresh strong demand that the rules block (top `cap` by Raja
    score), 'TICKER (reason)' grouped by sector."""
    if not rows:
        return []
    top = sorted(rows, key=lambda r: (-(r.get('score') or 0), r['symbol']))[:cap]
    by: Dict[str, List[Dict]] = {}
    for r in top:
        by.setdefault(r.get('sector') or 'Other', []).append(r)
    title = f"🧲 <b>In strong demand (rules blocked)</b> · {len(rows)}" + (f' (top {cap})' if len(rows) > cap else '')
    return [title] + [f"{SECTOR_EMOJI.get(k, '📦')} {esc(SECTOR_SHORT.get(k, k))}: " + ', '.join(
        f"{esc(r['symbol'])} ({esc(r.get('label') or r.get('rule') or '?')})" for r in v)
        for k, v in sorted(by.items(), key=lambda kv: (-len(kv[1]), kv[0]))]


def pack_cards(title: str, cards: List[str], tail: str = '', limit: int = SAFE) -> List[str]:
    """Cards into messages under `limit` UTF-16 units; a split happens only between cards (a single card longer
    than the limit is cut on a line boundary as a last resort)."""
    out, cur = [], title
    for c in cards + ([tail] if tail else []):
        if u16(c) + u16(title) + 2 > limit:
            c = _cut(c, limit - u16(title) - 2)
        if u16(cur) + 2 + u16(c) > limit:
            out.append(cur)
            cur = title + ' (cont.)\n\n' + c
        else:
            cur = cur + '\n\n' + c
    out.append(cur)
    return out


def _cut(card: str, limit: int) -> str:
    keep = []
    for line in card.split('\n'):
        if u16('\n'.join(keep + [line])) > limit - 2:
            break
        keep.append(line)
    return '\n'.join(keep) + '\n…'


def send(messages: List[str], pause: float = 1.1) -> bool:
    token, chat = os.environ.get('TELEGRAM_BOT_TOKEN'), os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat:
        print('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set: printing instead\n')
        for m in messages:
            print(m)
            print('\n' + '-' * 40 + '\n')
        return False
    ok = True
    for k, m in enumerate(messages):
        if k:
            time.sleep(pause)
        body = urllib.parse.urlencode({'chat_id': chat, 'text': m, 'parse_mode': 'HTML', 'disable_web_page_preview': 'true'}).encode()
        for attempt in range(4):
            req = urllib.request.Request(f'https://api.telegram.org/bot{token}/sendMessage', data=body)
            try:
                with urllib.request.urlopen(req, timeout=15) as r:
                    ok = ok and json.loads(r.read()).get('ok', False)
                break
            except urllib.error.HTTPError as e:
                wait = 0
                try:
                    wait = int(json.loads(e.read()).get('parameters', {}).get('retry_after', 0))
                except Exception:  # noqa: BLE001
                    pass
                if e.code == 429 and attempt < 3:
                    time.sleep(min(max(wait, 1), 30) + 0.5)
                    continue
                print(f'Telegram send failed: HTTP {e.code}', file=sys.stderr)   # never print the token / URL
                ok = False
                break
            except Exception as e:  # noqa: BLE001
                print(f'Telegram send failed: {type(e).__name__}', file=sys.stderr)
                ok = False
                break
    return ok
