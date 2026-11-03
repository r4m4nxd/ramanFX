"""The auto-learner: turns backtest experiments + live outcomes into the scanners' policy (owner 2026-11-03: "the bots
should learn and improve by themselves, using previous years' data").

    python tools/learn/learner.py                 # reads public/learn/*.json, writes public/learn/policy.json + report
    python tools/learn/learner.py --dry-run       # print the decision, write nothing, send nothing

Inputs (all on the data branch):
  public/learn/fx_experiments.json, stock_experiments.json   tools/fx_scanner/fx_backtest.py / stock_scanner/backtest.py:
                                                             each rule change ('variant') vs the current rules, in-sample
                                                             (older 70%) and out-of-sample (recent 30%), bootstrap CI.
  public/learn/outcomes.json                                 tools/learn/outcomes.py: what really happened after each
                                                             live trade idea.
  public/learn/policy.json                                   the previous decision (adoptions, candidates, history).

Rules for changing the scanners (deliberately strict: a rule is only ever adopted on evidence it was not fitted on):
  * Enough data: in-sample n >= MIN_IS, out-of-sample n >= MIN_OOS (a filter may cut trades, but it must keep at least
    KEEP_FRAC of the current rules' total R, so 'trade almost nothing' never wins).
  * Better in BOTH halves: is.exp_r and oos.exp_r above `current` by at least MIN_GAIN R per trade, and the drawdown
    not more than DD_SLACK worse.
  * Strong (oos CI low end above current's oos expectancy): adopted at once. Otherwise it becomes a candidate and is
    adopted when it qualifies again on the next run (two independent runs).
  * One rule per group (one break-even rule, one freshness rule ...): the best qualifying one. At most MAX_NEW new
    adoptions per run, so the scanners change gradually.
  * An adopted rule that no longer qualifies on a later run is dropped (back to the current rule).
  * Live safety net: when the live trade ideas of a market lost money over the last 90 days (n >= LIVE_MIN, expectancy
    below LIVE_FLOOR R) the policy says 'half size' for that market until it recovers.
  * LEARN_MODE=off (repo variable): nothing is adopted; the report still runs.
Outputs: public/learn/policy.json (read by the scanners and the bot's /learn), public/learn/report.md, one Telegram
message when something changed (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID; printed when unset).
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import sys
import urllib.parse
import urllib.request
from typing import Dict, List, Optional, Tuple

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
LEARN = os.path.join(ROOT, 'public', 'learn')
MARKETS = ('fx', 'stock')
MIN_IS, MIN_OOS = 100, 40
MIN_GAIN = 0.05          # R per trade
KEEP_FRAC = 0.8          # of the current rules' total R (n x expectancy), out-of-sample
DD_SLACK = 1.25
MAX_NEW = 3
LIVE_MIN, LIVE_FLOOR = 30, -0.15
MARKET_WORD = {'fx': 'Currencies, metals and indices', 'stock': 'Stocks'}


def load(path: str) -> Optional[dict]:
    try:
        with open(path, encoding='utf-8') as f:
            js = json.load(f)
        return js if isinstance(js, dict) else None
    except (OSError, ValueError):
        return None


def _num(v) -> Optional[float]:
    return float(v) if isinstance(v, (int, float)) and v == v and abs(v) != float('inf') else None


def stats(v: dict, half: str) -> dict:
    s = (v or {}).get(half) or {}
    return s if isinstance(s, dict) else {}


def judge(var: dict, cur: dict) -> Tuple[str, str, float]:
    """('strong' | 'qualifies' | 'no', plain reason, out-of-sample gain in R per trade) for one variant vs current."""
    vi, vo, ci, co = stats(var, 'is'), stats(var, 'oos'), stats(cur, 'is'), stats(cur, 'oos')
    n_is, n_oos = _num(vi.get('n')) or 0, _num(vo.get('n')) or 0
    e_is, e_oos, c_is, c_oos = (_num(x.get('exp_r')) for x in (vi, vo, ci, co))
    if None in (e_is, e_oos, c_is, c_oos):
        return 'no', 'missing results', 0.0
    gain = e_oos - c_oos
    if n_is < MIN_IS or n_oos < MIN_OOS:
        return 'no', f'too few trades ({int(n_is)} older, {int(n_oos)} recent)', gain
    if e_is - c_is < MIN_GAIN or gain < MIN_GAIN:
        return 'no', f'not better in both periods ({e_is - c_is:+.2f}R older, {gain:+.2f}R recent)', gain
    cur_total, var_total = (_num(co.get('n')) or 0) * c_oos, n_oos * e_oos
    if cur_total > 0 and var_total < KEEP_FRAC * cur_total:
        return 'no', 'keeps too little of the total profit (filters out too many trades)', gain
    dd_v, dd_c = _num(vo.get('max_dd_r')), _num(co.get('max_dd_r'))
    if dd_v is not None and dd_c is not None and dd_c > 0 and dd_v > DD_SLACK * dd_c:
        return 'no', f'bigger losing streak ({dd_v:.1f}R vs {dd_c:.1f}R)', gain
    lo = _num((vo.get('ci') or [None])[0])
    if lo is not None and lo > c_oos:
        return 'strong', f'{gain:+.2f}R per trade on recent data, clearly better', gain
    return 'qualifies', f'{gain:+.2f}R per trade on recent data', gain


def decide(exp: Optional[dict], prev_market: dict, live: Optional[dict], mode: str, now: str) -> Tuple[dict, List[dict]]:
    """The market's new policy + the changes made (history rows)."""
    prev_adopted = {a['id']: a for a in prev_market.get('adopted', [])}
    prev_cand = {c['id']: c for c in prev_market.get('candidates', [])}
    out = {'adopted': [], 'candidates': [], 'rejected': [], 'tested': 0, 'source': None, 'live': live, 'half_size': False}
    changes: List[dict] = []
    variants = (exp or {}).get('variants') or {}
    cur = variants.get((exp or {}).get('baseline') or 'current')
    if not exp or not isinstance(cur, dict):
        out['adopted'] = list(prev_adopted.values())          # no new evidence: keep what we had
        out['note'] = 'no backtest results yet'
    else:
        out['source'] = exp.get('generated_at')
        out['base_rules'] = exp.get('base_rules') or exp.get('baseline') or 'current'   # 'loose' = measured on relaxed rules
        out['bases'] = exp.get('bases')
        verdicts = []
        for vid, v in variants.items():
            if vid == ((exp.get('baseline') or 'current')) or not isinstance(v, dict):
                continue
            out['tested'] += 1
            grade, why, gain = judge(v, cur)
            verdicts.append((vid, v, grade, why, gain))
        best_by_group: Dict[str, tuple] = {}
        for row in verdicts:
            vid, v, grade, why, gain = row
            if grade == 'no':
                continue
            g = v.get('group') or vid
            if g not in best_by_group or gain > best_by_group[g][4]:
                best_by_group[g] = row
        keep_ids = {r[0] for r in best_by_group.values()}
        new_count = 0
        for vid, v, grade, why, gain in sorted(best_by_group.values(), key=lambda r: -r[4]):
            entry = {'id': vid, 'group': v.get('group'), 'desc': v.get('desc') or vid, 'gain_r': round(gain, 3), 'why': why,
                     'oos': stats(v, 'oos'), 'current_oos': stats(cur, 'oos')}
            if vid in prev_adopted:
                out['adopted'].append({**entry, 'since': prev_adopted[vid].get('since', now)})
            elif mode != 'off' and new_count < MAX_NEW and (grade == 'strong' or vid in prev_cand):
                out['adopted'].append({**entry, 'since': now})
                changes.append({'at': now, 'change': 'adopt', 'id': vid, 'desc': entry['desc'], 'gain_r': entry['gain_r']})
                new_count += 1
            else:
                out['candidates'].append({**entry, 'first_seen': prev_cand.get(vid, {}).get('first_seen', now)})
        for vid, a in prev_adopted.items():
            if vid not in keep_ids:
                changes.append({'at': now, 'change': 'drop', 'id': vid, 'desc': a.get('desc', vid),
                                'why': next((r[3] for r in verdicts if r[0] == vid), 'no longer tested')})
        out['rejected'] = [{'id': r[0], 'desc': r[1].get('desc') or r[0], 'why': r[3], 'gain_r': round(r[4], 3)}
                           for r in sorted(verdicts, key=lambda r: -r[4]) if r[0] not in keep_ids][:12]
        out['skipped'] = exp.get('skipped') or {}
        out['excursions'] = exp.get('excursions')
    if mode == 'off':
        for a in out['adopted']:
            changes.append({'at': now, 'change': 'drop', 'id': a['id'], 'desc': a.get('desc', a['id']), 'why': 'learning switched off'})
        out['adopted'] = []
    if live and (live.get('n') or 0) >= LIVE_MIN and (_num(live.get('exp_r')) or 0) < LIVE_FLOOR:
        out['half_size'] = True
    return out, changes


def live_summary(outcomes: Optional[dict], market: str) -> Optional[dict]:
    """The market's last-90-day live results from outcomes.json (all kinds summed, weighted by n)."""
    groups = (((outcomes or {}).get('windows') or {}).get('90d') or {})
    n = wins = tot = 0.0
    for key, g in groups.items():
        if not str(key).startswith(f'{market}|') or not isinstance(g, dict):
            continue
        k = _num(g.get('filled')) or _num(g.get('n')) or 0
        e, w = _num(g.get('exp_r')), _num(g.get('win'))
        if not k or e is None:
            continue
        n += k
        tot += k * e
        wins += k * (w or 0)
    return {'n': int(n), 'exp_r': round(tot / n, 3), 'win': round(wins / n, 3)} if n else None


def message(policy: dict, changes: List[dict]) -> str:
    esc = lambda s: html.escape(str(s), quote=False)  # noqa: E731
    lines = ['<b>The scanners learned something</b> · monthly review', '']
    for c in changes:
        mk = MARKET_WORD.get(c.get('market', ''), c.get('market', ''))
        if c['change'] == 'adopt':
            lines.append(f"▲ <b>{esc(mk)}</b> · new rule: {esc(c['desc'])} <i>({c['gain_r']:+.2f}R per trade on recent data it was not tuned on)</i>")
        else:
            lines.append(f"▼ <b>{esc(mk)}</b> · rule removed: {esc(c['desc'])} <i>({esc(c.get('why', ''))})</i>")
    for m in MARKETS:
        p = policy['markets'].get(m) or {}
        if p.get('half_size'):
            lv = p.get('live') or {}
            lines.append(f"● <b>{esc(MARKET_WORD[m])}</b>: live ideas lost money lately ({lv.get('exp_r', 0):+.2f}R per idea over {lv.get('n', 0)}), so the alerts say trade half size")
    lines += ['', 'Send /learn for everything the scanners tested.', '<i>For learning only, not financial advice</i>']
    return '\n'.join(lines)


def report(policy: dict) -> str:
    out = ['# What the scanners learned', '', f"Updated {policy['generated_at']} · mode: {policy['mode']}", '']
    for m in MARKETS:
        p = policy['markets'].get(m) or {}
        out += [f'## {MARKET_WORD[m]}', '', f"Rules tested: {p.get('tested', 0)} · results from {p.get('source') or 'n/a'}", '']
        for title, key in (('In use', 'adopted'), ('Waiting for a second confirmation', 'candidates'), ('Not better', 'rejected')):
            rows = p.get(key) or []
            out.append(f'**{title}** ({len(rows)})')
            out += [f"- {r.get('desc', r['id'])} · {r.get('why', '')}" for r in rows] or ['- none']
            out.append('')
        if p.get('live'):
            lv = p['live']
            out += [f"Live ideas, last 90 days: {lv['n']} · win rate {lv['win']:.0%} · {lv['exp_r']:+.2f}R per idea", '']
    return '\n'.join(out)


def send(text: str) -> None:
    tok, chat = os.environ.get('TELEGRAM_BOT_TOKEN'), os.environ.get('TELEGRAM_CHAT_ID')
    if not tok or not chat:
        print(text)
        return
    body = urllib.parse.urlencode({'chat_id': chat, 'text': text[:4000], 'parse_mode': 'HTML', 'disable_web_page_preview': 'true'}).encode()
    try:
        with urllib.request.urlopen(f'https://api.telegram.org/bot{tok}/sendMessage', body, timeout=20) as r:
            print('telegram sent:', json.loads(r.read()).get('ok'))
    except Exception as e:  # noqa: BLE001
        print(f'telegram send failed: {type(e).__name__}', file=sys.stderr)


def run(learn_dir: str = LEARN, mode: Optional[str] = None, now: Optional[str] = None, dry: bool = False) -> Tuple[dict, List[dict]]:
    mode = (mode or os.environ.get('LEARN_MODE') or 'auto').lower()
    now = now or dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    prev = load(os.path.join(learn_dir, 'policy.json')) or {}
    outcomes = load(os.path.join(learn_dir, 'outcomes.json'))
    policy = {'schema': 1, 'generated_at': now, 'mode': mode, 'markets': {}, 'history': list(prev.get('history') or [])[-100:]}
    changes: List[dict] = []
    for m in MARKETS:
        exp = load(os.path.join(learn_dir, f'{m}_experiments.json'))
        pm, ch = decide(exp, (prev.get('markets') or {}).get(m) or {}, live_summary(outcomes, m), mode, now)
        policy['markets'][m] = pm
        for c in ch:
            c['market'] = m
        changes += ch
    policy['history'] += changes
    if not dry:
        os.makedirs(learn_dir, exist_ok=True)
        with open(os.path.join(learn_dir, 'policy.json'), 'w', encoding='utf-8') as f:
            json.dump(policy, f, indent=1)
        with open(os.path.join(learn_dir, 'report.md'), 'w', encoding='utf-8') as f:
            f.write(report(policy))
        half_now = {m for m in MARKETS if policy['markets'][m].get('half_size')}
        half_before = {m for m in MARKETS if ((prev.get('markets') or {}).get(m) or {}).get('half_size')}
        if changes or half_now != half_before:
            send(message(policy, changes))
    return policy, changes


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--dir', default=LEARN)
    a = ap.parse_args(argv)
    policy, changes = run(a.dir, dry=a.dry_run)
    for m in MARKETS:
        p = policy['markets'][m]
        print(f"{m}: tested {p.get('tested', 0)} · in use {[x['id'] for x in p['adopted']]} · candidates {[x['id'] for x in p['candidates']]} · half size {p['half_size']}")
    print(f'changes: {len(changes)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
