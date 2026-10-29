"""Merge the deep market-hours shards (deep.py fx / stocks) into the committed outputs.

    python report.py --in <dir with fx_*.json, stocks_*.json> --cal cal.json [--root <repo root>]

Writes (paths under --root, default the repo):
  public/research/market_hours_by_symbol.json   compact, every symbol (the app's Market hours page)
  public/research/market_hours.json             group summaries (profiles, weekdays, era check, DST, coverage)
  docs/research/Market_Hours.md                 summary + one table per forex / metal / CFD instrument
  docs/research/Market_Hours_Stocks.md          stocks: summary + one table per sector, one row per stock
  docs/research/market_hours_fx.png, market_hours_stocks.png, market_hours_era.png
"""
from __future__ import annotations

import argparse
import datetime as dt
import glob
import json
import math
import os
import sys
from typing import Dict, List, Optional

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
WD = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
NS = 48
CLS_LABEL = {'major': 'Majors', 'cross': 'Crosses', 'exotic': 'Exotics', 'metal': 'Metals', 'cfd': 'Index / commodity CFDs',
             'stock': 'Stocks', 'etf': 'ETFs'}
NOTE = {
    '17:00': 'Tokyo 09:00 (winter)', '18:00': 'Asia morning (Tokyo 09:00-10:00 JST, Tokyo fix 09:55)',
    '00:00': 'Frankfurt 08:00 / pre-London', '01:00': 'London open 08:00 (normal weeks)',
    '02:00': 'London 2nd hour / London open in DST-mismatch weeks', '06:00': 'US pre-data hour',
    '06:30': 'US data 08:30 ET (NFP, CPI, retail sales, claims)', '07:00': 'US 09:00 ET',
    '07:30': 'NYSE open 09:30 ET', '08:00': '10:00 ET data (ISM, JOLTS, sentiment)',
    '08:30': 'first stock hour', '09:00': 'London 16:00 close / WM-R fix (normal weeks)',
    '12:00': 'US 14:00 ET (FOMC days; oil settles 14:30 ET)', '12:30': 'FOMC press conference (FOMC days)',
    '13:30': 'last regular stock half-hour', '14:00': 'NYSE close 16:00 ET (closing-auction prints)',
    '15:00': 'FX rollover 17:00 ET (wide spreads)',
}


def slot_name(i: int) -> str:
    return f'{i // 2:02d}:{30 * (i % 2):02d}'


def ny_name(i: int) -> str:
    return slot_name((i + 4) % NS)


def sidx(s: str) -> int:
    return int(s[:2]) * 2 + int(s[3:]) // 30


def arr(x) -> np.ndarray:
    return np.array([np.nan if v is None else v for v in x], dtype=float)


def nmed(rows: List[np.ndarray]) -> np.ndarray:
    if not rows:
        return np.full(NS, np.nan)
    m = np.vstack(rows)
    with np.errstate(all='ignore'):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            return np.nanmedian(m, axis=0)


def r2(x, n=2):
    return None if x is None or (isinstance(x, float) and not math.isfinite(x)) else round(float(x), n)


def fx(x, suf='x', n=2):
    return '-' if x is None or (isinstance(x, float) and not math.isfinite(x)) else f'{x:.{n}f}{suf}'


def md_table(head, rows) -> str:
    s = '| ' + ' | '.join(head) + ' |\n|' + '|'.join('---' for _ in head) + '|\n'
    for r in rows:
        s += '| ' + ' | '.join('' if x is None else str(x).replace('|', '/') for x in r) + ' |\n'
    return s


def load_shards(d: str):
    out = {'fx': [], 'stocks': []}
    info = []
    for p in sorted(glob.glob(os.path.join(d, '**', '*.json'), recursive=True)):
        try:
            with open(p) as f:
                js = json.load(f)
        except (OSError, ValueError):
            continue
        if not isinstance(js, dict) or js.get('kind') not in out:
            continue
        out[js['kind']].extend(js.get('results') or [])
        info.append({k: js.get(k) for k in ('kind', 'shard', 'shards', 'asked', 'ok', 'requests', 'seconds', 'alpaca_feed', 'end')}
                    | {'n_errors': len(js.get('errors') or {}), 'errors': dict(list((js.get('errors') or {}).items())[:60]),
                       'log_tail': (js.get('log_tail') or [])[-12:]})
    for k in out:
        seen = {}
        for r in out[k]:
            seen[r['name']] = r
        out[k] = sorted(seen.values(), key=lambda r: r['name'])
    return out, info


# ---- compact per-symbol JSON ------------------------------------------------------------------------------------------
def compact(r: Dict) -> Dict:
    w = r.get('weekday') or {}
    e = r.get('era') or {}

    def ev(x):
        return None if not x else [x['x'], x['n'], x.get('big'), x.get('bigc')]
    return {
        's': r['sym'], 'n': r['name'], 'k': r['cls'], 'g': r.get('group') or '', 'd': r.get('display') or '',
        'i': r.get('idx') or '', 'wl': bool(r.get('wl')),
        'y': [r['from'], r['to'], r['years']],
        't': [[x['mt'], x['ny'], x['from'], x['to'], x['a'], x['big']] for x in r.get('top') or []],
        'tr': r.get('win_rel'), 'th': r.get('win_halves_spearman'),
        'w': [w.get('best'), w.get('quiet'), w.get('x'), (w.get('ci') or [None, None])[0], (w.get('ci') or [None, None])[1], w.get('rel')] if w else None,
        'dd': [(r.get('days') or {}).get(x) for x in WD[:5]],
        'e': [e.get('recent2y_vs_all'), e.get('pre_vs_post2020'), e.get('top_pre2020'), e.get('top_post2020'), e.get('top_recent2y'), e.get('drift')],
        'nfp': ev(r.get('nfp')), 'f12': ev(r.get('fomc_1200')), 'f1230': ev(r.get('fomc_1230')),
        'p': [None if v is None else int(round(v * 100)) for v in r.get('profile') or []],
    }


# ---- groups -----------------------------------------------------------------------------------------------------------
def group_summary(rs: List[Dict]) -> Dict:
    if not rs:
        return {}
    prof = nmed([arr(r['profile']) for r in rs])
    pv = nmed([arr(r['heavy']['prof_v']) for r in rs])
    pr = nmed([arr(r['heavy']['prof_r']) for r in rs])
    pb = nmed([arr(r['heavy']['prof_big']) for r in rs])
    eras = {}
    for k in ('pre2020', 'post2020', 'recent2y'):
        rows = [arr(r['heavy'][k]) for r in rs if r['heavy'].get(k)]
        eras[k] = {'n': len(rows), 'profile': [r2(x) for x in nmed(rows)]} if rows else None
    days = {}
    for d in WD[:5]:
        xs = [r['days'].get(d) for r in rs if (r.get('days') or {}).get(d) is not None]
        days[d] = r2(float(np.median(xs))) if xs else None
    bw = [r['weekday']['best'] for r in rs if r.get('weekday')]
    rel_bw = [r['weekday']['best'] for r in rs if r.get('weekday') and r['weekday']['rel'] == 'reliable']
    tops = [r['top'][0]['mt'] for r in rs if r.get('top')]

    def cnt(xs):
        c = {}
        for x in xs:
            c[x] = c.get(x, 0) + 1
        return dict(sorted(c.items(), key=lambda kv: -kv[1]))

    def evmed(k):
        xs = [r[k]['x'] for r in rs if r.get(k)]
        return {'median_x': r2(float(np.median(xs))) if xs else None, 'q1': r2(float(np.percentile(xs, 25))) if xs else None,
                'q3': r2(float(np.percentile(xs, 75))) if xs else None, 'n_inst': len(xs),
                'median_days': int(np.median([r[k]['n'] for r in rs if r.get(k)])) if xs else 0}
    sp_r = [r['era']['recent2y_vs_all'] for r in rs if r['era'].get('recent2y_vs_all') is not None]
    sp_pp = [r['era']['pre_vs_post2020'] for r in rs if r['era'].get('pre_vs_post2020') is not None]
    cells_rv = nmed([arr(r['heavy']['cell_rv']) for r in rs]) if rs else None
    cells_rr = nmed([arr(r['heavy']['cell_rr']) for r in rs]) if rs else None
    dst = {}
    dl = [r['heavy'].get('dst') for r in rs if r['heavy'].get('dst')]
    if dl:
        for k in dl[0]:
            xs = [d[k] for d in dl if d.get(k) is not None]
            dst[k] = r2(float(np.median(xs))) if xs else None
    return {
        'n': len(rs), 'years_median': r2(float(np.median([r['years'] for r in rs])), 1),
        'from_min': min(r['from'] for r in rs), 'to_max': max(r['to'] for r in rs),
        'profile': [r2(x) for x in prof], 'vol': [r2(x) for x in pv], 'range': [r2(x) for x in pr],
        'big_pct': [r2(100 * x, 1) for x in pb], 'eras': eras, 'days': days,
        'best_weekday_counts': cnt(bw), 'reliable_best_weekday_counts': cnt(rel_bw), 'top_slot_counts': cnt(tops),
        'win_reliable_share': r2(100 * np.mean([r.get('win_rel') == 'reliable' for r in rs]), 1),
        'day_reliable_share': r2(100 * np.mean([bool(r.get('weekday')) and r['weekday']['rel'] == 'reliable' for r in rs]), 1),
        'drift_share': r2(100 * np.mean([bool(r['era'].get('drift')) for r in rs]), 1),
        'era_recent_vs_all_median': r2(float(np.median(sp_r))) if sp_r else None,
        'era_pre_vs_post_median': r2(float(np.median(sp_pp))) if sp_pp else None,
        'nfp': evmed('nfp'), 'fomc_1200': evmed('fomc_1200'), 'fomc_1230': evmed('fomc_1230'),
        'cells_rv': [r2(x) for x in cells_rv] if cells_rv is not None else None,
        'cells_rr': [r2(x) for x in cells_rr] if cells_rr is not None else None, 'dst': dst,
    }


def windows_of(prof: List[Optional[float]], k: int = 4, thr: float = 1.0):
    sys.path.insert(0, HERE)
    from deep import peaks
    p = arr(prof)
    out = []
    for w in peaks(p, thr=thr, k=k):
        s = w['slot']
        out.append({'mt': slot_name(s), 'ny': ny_name(s), 'from': slot_name(w['lo']), 'to': slot_name((w['hi'] + 1) % NS),
                    'a': r2(p[s])})
    return out


# ---- charts -----------------------------------------------------------------------------------------------------------
def heatmap(cells_rv, cells_rr, rows: List[int], slots: List[int], title: str, path: str) -> None:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib.colors import LinearSegmentedColormap
    cmap = LinearSegmentedColormap.from_list('seq', ['#f4f8fd', '#cde2fb', '#86b6ef', '#3987e5', '#1c5cab', '#0d366b'])
    cmap.set_bad('#e6e6e6')
    fig, axes = plt.subplots(2, 1, figsize=(max(9, 0.3 * len(slots) + 2), 2 * (0.45 * len(rows) + 1.6)), dpi=130)
    for ax, cells, lab in ((axes[0], cells_rv, 'Volume vs a typical half-hour (median over instruments, x)'),
                           (axes[1], cells_rr, 'Range (high - low) vs a typical half-hour (median over instruments, x)')):
        grid = [[cells[w * NS + s] for s in slots] for w in rows]
        vals = [v for r in grid for v in r if v is not None and math.isfinite(v)]
        vmax = max(vals) if vals else 1
        m = [[float('nan') if v is None else v for v in r] for r in grid]
        im = ax.imshow(m, aspect='auto', cmap=cmap, vmin=0, vmax=vmax)
        ax.set_yticks(range(len(rows)), [WD[w] for w in rows], fontsize=9)
        ticks = [i for i, s in enumerate(slots) if s % 2 == 0]
        ax.set_xticks([i - 0.5 for i in ticks], [f'{slots[i] // 2:02d}\n{(slots[i] // 2 + 2) % 24:02d}' for i in ticks], fontsize=7.5)
        ax.set_title(lab, fontsize=10, loc='left', color='#222')
        ax.tick_params(length=0, colors='#444')
        for sp in ax.spines.values():
            sp.set_visible(False)
        flat = sorted(((v, i, j) for i, r in enumerate(grid) for j, v in enumerate(r) if v is not None and math.isfinite(v)), reverse=True)[:10]
        for v, i, j in flat:
            ax.text(j, i, f'{v:.1f}', ha='center', va='center', fontsize=6, color='white' if v > 0.55 * vmax else '#111')
        cb = fig.colorbar(im, ax=ax, fraction=0.025, pad=0.01)
        cb.ax.tick_params(labelsize=7)
        cb.outline.set_visible(False)
    axes[1].set_xlabel('Half-hour cells; ticks at the full hour (top: Calgary time, bottom: New York time)', fontsize=8.5, color='#444')
    fig.suptitle(title, fontsize=11.5, x=0.01, ha='left', color='#111')
    fig.tight_layout()
    fig.savefig(path, facecolor='white')
    plt.close(fig)


def era_chart(groups: Dict[str, Dict], path: str) -> None:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    panels = [(k, g) for k, g in groups.items() if g and g.get('eras')]
    if not panels:
        return
    fig, axes = plt.subplots(len(panels), 1, figsize=(11, 2.8 * len(panels)), dpi=130, squeeze=False)
    colors = {'pre2020': '#86b6ef', 'post2020': '#1c5cab', 'recent2y': '#eb6834'}
    labels = {'pre2020': 'before 2020', 'post2020': '2020 and later', 'recent2y': 'last 2 years'}
    for ax, (k, g) in zip(axes[:, 0], panels):
        for e in ('pre2020', 'post2020', 'recent2y'):
            d = g['eras'].get(e)
            if not d:
                continue
            y = arr(d['profile'])
            ax.plot(range(NS), y, color=colors[e], lw=2, label=f"{labels[e]} ({d['n']} instruments)")
        ax.set_title(k, fontsize=10, loc='left', color='#222')
        ax.set_xticks(range(0, NS, 4), [f'{h:02d}\n{(h + 2) % 24:02d}' for h in range(0, 24, 2)], fontsize=7.5)
        ax.set_ylabel('activity (x typical)', fontsize=8, color='#444')
        ax.grid(axis='y', color='#eee')
        for sp in ('top', 'right'):
            ax.spines[sp].set_visible(False)
        ax.legend(fontsize=7.5, frameon=False, loc='upper right')
    axes[-1, 0].set_xlabel('Calgary time (top) / New York time (bottom), Mon-Fri', fontsize=8.5, color='#444')
    fig.suptitle('Era check: has the daily activity profile moved?', fontsize=11.5, x=0.01, ha='left')
    fig.tight_layout()
    fig.savefig(path, facecolor='white')
    plt.close(fig)


# ---- markdown -----------------------------------------------------------------------------------------------------------
def win_text(t: Dict) -> str:
    return f"{t['from']}-{t['to']} (peak **{t['mt']}**)"


def per_instrument_md(r: Dict) -> str:
    L = []
    cls = CLS_LABEL.get(r['cls'], r['cls'])
    L.append(f"### {r['sym']}" + (f" ({r['name']})" if r['name'] != r['sym'] else '') +
             f" - {cls}{' - watchlist' if r.get('wl') else ''}\n")
    L.append(f"{r['from']} to {r['to']} ({r['years']} years, {r['buckets']:,} half-hours). Best times: **{r['win_rel']}**"
             f" (first vs second half rho {fx(r.get('win_halves_spearman'), '')}).\n")
    rows = []
    for i, t in enumerate(r.get('top') or []):
        rows.append([f'Best window {i + 1}', win_text(t), f"{t['ny']} ET", fx(t['a']), fx(t['v']), fx(t['r']),
                     f"{t['big']}%", NOTE.get(t['mt'], '')])
    L.append(md_table(['', 'Calgary', 'Peak NY', 'Activity', 'Volume', 'Range', 'Big-move days', 'What happens then'], rows))
    w = r.get('weekday')
    d = r.get('days') or {}
    ev = []
    if w:
        ev.append(['Best weekday', f"**{w['best']}**: {w['x']}x the quietest ({w['quiet']}), 95% CI {w['ci'][0]}-{w['ci'][1]}, "
                   f"{w['n_days']} days - **{w['rel']}**"])
    if d:
        ev.append(['Day activity Mon-Fri', ' / '.join(f'{k} {fx(v)}' for k, v in d.items())])
    n = r.get('nfp')
    if n:
        lab = 'NFP 09:30 ET (07:30 Calgary)' if r['cls'] in ('stock', 'etf') else 'NFP 08:30 ET (06:30 Calgary)'
        ev.append([lab, f"range {n['x']}x other Fridays ({n['n']} NFP days; big moves {n['big']}% vs {n['bigc']}%)"])
    for k, lab in (('fomc_1200', 'FOMC 14:00 ET (12:00 Calgary)'), ('fomc_1230', 'FOMC 14:30 ET press conf. (12:30)')):
        f_ = r.get(k)
        if f_:
            ev.append([lab, f"range {f_['x']}x a normal {'Wednesday'} ({f_['n']} FOMC days; big moves {f_['big']}% vs {f_['bigc']}%)"])
    e = r.get('era') or {}
    ev.append(['Era check', f"last 2 y vs all rho {fx(e.get('recent2y_vs_all'), '')}; before vs since 2020 rho "
               f"{fx(e.get('pre_vs_post2020'), '')}; peak {e.get('top_pre2020') or '-'} -> {e.get('top_post2020') or '-'} "
               f"(last 2 y {e.get('top_recent2y') or '-'}) - **{'shifted' if e.get('drift') else 'stable'}**"])
    L.append(md_table(['', ''], ev))
    return '\n'.join(L)


def schedule_rows(label: str, g: Dict) -> List[List]:
    rows = []
    for w in windows_of(g.get('profile') or [], k=4, thr=1.2):
        s = sidx(w['mt'])
        rows.append([f"{w['from']}-{w['to']}", label, f"**{w['mt']}**", f"{w['ny']} ET", fx(w['a']), fx(g['vol'][s]),
                     fx(g['range'][s]), f"{g['big_pct'][s]}%", NOTE.get(w['mt'], '')])
    return rows


def build_fx_md(R: Dict, fxr: List[Dict], cal: Dict, info: List[Dict], synthetic: bool) -> str:
    G = R['groups']
    cur, met, cfd = G.get('Forex currencies') or {}, G.get('Metals') or {}, G.get('Index / commodity CFDs') or {}
    st_ = G.get('Stocks (all)') or {}
    L = ['# Market hours: when does each market move? (Calgary time)\n']
    L.append(f"Generated {R['meta']['generated']} by `tools/research/market_hours/deep.py` + `report.py` (workflow "
             "`market-hours.yml`)" + (' - **SYNTHETIC SELF-TEST DATA, NOT MARKET DATA**' if synthetic else '') + '. '
             f"Coverage: **{R['meta']['n_fx']} forex / metal / CFD instruments** (OANDA M30, {cur.get('from_min', '-')} to "
             f"{cur.get('to_max', '-')}, median {cur.get('years_median', '-')} years each) and **{R['meta']['n_stocks']} US "
             f"stocks / ETFs** (Alpaca 30-minute, feed {R['meta'].get('alpaca_feed')}, median {st_.get('years_median', '-')} "
             'years). Stocks have their own file: [Market_Hours_Stocks.md](Market_Hours_Stocks.md); every symbol is '
             'searchable in the app (Market hours page). All times are **Calgary (America/Edmonton)**; New York is always '
             '2 h ahead. Descriptive statistics only - no trading signal, no profit claim.\n')
    L.append('## In plain words\n')
    L.extend(R['summary'])
    L.append('\n## When to open the charts (group profiles, Mon-Fri)\n')
    L.append('Activity = sqrt(volume x range) of a half-hour relative to a typical half-hour of the same instrument and '
             'month (1.0x = typical), median over the group\'s instruments, whole history. The window around each '
             'peak keeps at least 2/3 of the peak.\n')
    rows = []
    for lab, g in (('Forex currencies', cur), ('Metals', met), ('Index / commodity CFDs', cfd), ('US stocks', st_)):
        if g:
            rows += schedule_rows(lab, g)
    rows.sort(key=lambda r: (sidx(r[0][:5]) - 30) % NS)
    L.append(md_table(['Calgary window', 'Market', 'Peak', 'Peak NY', 'Activity', 'Volume', 'Range', 'Big-move days',
                       'What happens then'], rows))
    L.append('![Forex heatmap](market_hours_fx.png)\n')
    # era
    L.append('## Era check: has the pattern drifted?\n')
    L.append('For every instrument the Mon-Fri half-hour profile of the last 2 years is compared with its whole '
             'history, and before 2020 with 2020 and later (Spearman rank correlation of the 48 half-hours; 1.0 = same '
             'shape). "Shifted" = rho below 0.8 or the peak half-hour moved by more than 30 minutes.\n')
    erows = []
    for lab, g in G.items():
        if not g:
            continue
        pre = (g.get('eras') or {}).get('pre2020') or {}
        post = (g.get('eras') or {}).get('post2020') or {}
        tp = slot_name(int(np.nanargmax(arr(pre['profile'])))) if pre else '-'
        tq = slot_name(int(np.nanargmax(arr(post['profile'])))) if post else '-'
        erows.append([lab, g['n'], fx(g.get('era_recent_vs_all_median'), ''), fx(g.get('era_pre_vs_post_median'), ''),
                      f"{g.get('drift_share')}%", tp, tq])
    L.append(md_table(['Group', 'Instruments', 'Median rho last 2 y vs all', 'Median rho pre vs post 2020',
                       'Shifted', 'Group peak before 2020', 'Group peak since 2020'], erows))
    L.append('![Era check](market_hours_era.png)\n')
    # DST
    d = cur.get('dst') or {}
    if d:
        L.append('## Daylight saving: what moves on the Calgary clock\n')
        L.append('New York events never move on the Calgary clock (both follow US DST dates). London does: the London open '
                 '(08:00 London) is 01:00 Calgary most of the year but 02:00 in the US/UK mismatch weeks (2nd Sunday of '
                 'March -> last Sunday of March; last Sunday of October -> 1st Sunday of November). Measured volume (forex '
                 'currencies, median):\n')
        L.append(md_table(['Calgary', 'Normal weeks', 'Mismatch weeks'],
                          [['01:00', fx(d.get('normal_01:00')), fx(d.get('mismatch_01:00'))],
                           ['02:00', fx(d.get('normal_02:00')), fx(d.get('mismatch_02:00'))]]))
        L.append('Asian evening (Sun-Thu) by Calgary season: Calgary on MST (Nov-Mar) vs MDT (Mar-Nov):\n')
        L.append(md_table(['Calgary', 'MST (winter)', 'MDT (summer)'],
                          [['17:00', fx(d.get('mst_17:00')), fx(d.get('mdt_17:00'))],
                           ['18:00', fx(d.get('mst_18:00')), fx(d.get('mdt_18:00'))]]))
    # calendar
    L.append('## NFP and FOMC dates\n')
    L.append(f"- FOMC statement dates: {len(cal.get('fomc') or [])} ({cal.get('fomc_source')}).\n"
             f"- NFP (Employment Situation) release dates: {len(cal.get('nfp') or [])} ({cal.get('nfp_source')}).\n"
             '- Ratio = median range of the event half-hour on event days / the same half-hour on control days (NFP: other '
             'Fridays; FOMC: other days of the same weekday). Group medians:\n')
    crow = []
    for lab, g in G.items():
        if not g:
            continue
        for k, nm in (('nfp', 'NFP'), ('fomc_1200', 'FOMC 12:00'), ('fomc_1230', 'FOMC 12:30')):
            e = g.get(k) or {}
            if e.get('median_x') is not None:
                crow.append([lab, nm, fx(e['median_x']), f"{fx(e['q1'])}-{fx(e['q3'])}", e['n_inst'], e['median_days']])
    L.append(md_table(['Group', 'Event', 'Median range ratio', 'IQR over instruments', 'Instruments', 'Event days (median)'], crow))
    # per instrument
    L.append('## Every forex pair, metal and CFD\n')
    L.append('One table per instrument (watchlist first). "reliable" = the first and second half of the instrument\'s '
             'history agree; "weak" = the difference is within noise, do not lean on it.\n')
    order = sorted(fxr, key=lambda r: (not r.get('wl'), ['major', 'cross', 'exotic', 'metal', 'cfd'].index(r['cls'])
                                       if r['cls'] in ('major', 'cross', 'exotic', 'metal', 'cfd') else 9, r['sym']))
    for r in order:
        L.append(per_instrument_md(r))
    L.append(method_md())
    L.append(coverage_md(info))
    return '\n'.join(L)


def method_md() -> str:
    return ('## Method\n\n'
            '- Forex / metals / CFDs: OANDA v20 **M30 mid candles** with tick volume, from 2005 (or the first candle '
            'OANDA serves). Stocks: Alpaca **30-minute bars**, unadjusted prices, 04:00-20:00 ET, from 2016; a missing '
            'bar inside a trading day = no trade (0 volume, 0 range).\n'
            '- Each half-hour is labelled by its Calgary start time and Calgary weekday (DST handled per date).\n'
            '- Normalisation per instrument and calendar month: relative volume = volume / the month\'s median half-hour, '
            'relative range = high-low / the month\'s median half-hour (forex: all 24 h; stocks: regular session only). '
            'Activity = sqrt(relative volume x relative range). Big move = range > 2x typical.\n'
            '- Best windows = the three strongest peaks of the Mon-Fri median activity profile; each window keeps >= 2/3 '
            'of its peak. Reliability: first vs second half of the history (profile Spearman >= 0.8 and the best '
            'half-hour within 10% of the maximum in both halves).\n'
            '- Weekdays: whole trading days (forex 17:00-17:00 New York, stocks regular session; days with less than half '
            'the usual bars dropped), day volume and range relative to the month\'s median day, activity per weekday = '
            'median. Best vs quietest weekday ratio with a 400-sample bootstrap 95% CI; "reliable" = CI above 1.0 and both '
            'halves of the history pick the same best day.\n'
            '- Group tables = median over instruments of each instrument\'s own medians (each instrument counts once).\n')


def coverage_md(info: List[Dict]) -> str:
    L = ['## Coverage and run log\n']
    rows = []
    for i in info:
        rows.append([i['kind'], f"{i['shard']}/{i['shards']}", i['asked'], i['ok'], i['n_errors'], i['requests'],
                     f"{(i['seconds'] or 0) / 60:.0f} min", i.get('alpaca_feed') or '-'])
    L.append(md_table(['Data', 'Shard', 'Asked', 'Analysed', 'Missing', 'API requests', 'Time', 'Feed'], rows))
    errs = []
    for i in info:
        for k, v in list((i.get('errors') or {}).items())[:25]:
            errs.append(f'- {i["kind"]} {k}: {str(v)[:160]}')
    if errs:
        L.append('Missing instruments (first 25 per shard):\n')
        L.append('\n'.join(errs) + '\n')
    L.append('## Caveats\n\n'
             '- OANDA volume is **tick volume** (price updates on OANDA\'s feed), not exchange volume; practice-server '
             'prices. It tracks the shape of activity well, not its size.\n'
             '- Stock volume is consolidated SIP volume (with an IEX fallback the volumes are IEX only - see Feed above).\n'
             '- Medians describe a typical day; rare shocks do not show in a median (the big-move share is the better '
             'guide for those). Differences of 0.1-0.2x between neighbouring half-hours are within noise.\n'
             '- Holidays and half days are left in (medians limit their pull). Split months add noise to a stock\'s '
             'normalisation for one month (prices are unadjusted).\n'
             '- High activity means bigger moves in both directions and, at some times (the 15:00 Calgary rollover), '
             'wider spreads. It says when to look, not which way to trade.\n')
    return '\n'.join(L)


def build_stocks_md(R: Dict, sr: List[Dict], synthetic: bool) -> str:
    G = R['groups']
    st_ = G.get('Stocks (all)') or {}
    L = ['# Market hours: every US stock (Calgary time)\n']
    L.append(f"Generated {R['meta']['generated']}" + (' - **SYNTHETIC SELF-TEST DATA**' if synthetic else '') +
             f". {len(sr)} stocks / ETFs, Alpaca 30-minute bars ({st_.get('from_min', '-')} to {st_.get('to_max', '-')}, "
             f"median {st_.get('years_median', '-')} years). Summary, method and caveats: [Market_Hours.md](Market_Hours.md). "
             'Calgary time; New York = Calgary + 2 h. Descriptive only, no profit claim.\n')
    L.append('## In plain words\n')
    L.extend(R['summary_stocks'])
    L.append('\n![Stocks heatmap](market_hours_stocks.png)\n')
    secs = {}
    for r in sr:
        secs.setdefault(r.get('group') or 'Other', []).append(r)
    L.append('## By sector (group profile)\n')
    rows = []
    for sec, rs in sorted(secs.items()):
        g = G.get('Sector: ' + sec) or {}
        if not g:
            continue
        w = windows_of(g['profile'], k=3, thr=1.0)
        rows.append([sec, g['n'], ', '.join(f"{x['mt']} ({fx(x['a'])})" for x in w),
                     ' / '.join(f"{k} {fx(v)}" for k, v in (g.get('days') or {}).items()),
                     fx((g.get('nfp') or {}).get('median_x')), fx((g.get('fomc_1230') or {}).get('median_x')),
                     f"{g.get('drift_share')}%"])
    L.append(md_table(['Sector', 'Stocks', 'Group peaks (Calgary)', 'Day activity Mon-Fri', 'NFP open ratio',
                       'FOMC 12:30 ratio', 'Shifted era'], rows))
    L.append('## Every stock, by sector\n')
    L.append('Columns: the three best half-hour windows (Calgary, peak in bold, activity x typical); best and quietest '
             'weekday with the ratio and its 95% CI; reliability of times / days ("weak" = within noise); NFP = range of '
             'the 07:30 Calgary opening half-hour on NFP Fridays vs other Fridays; FOMC = 12:30 Calgary half-hour on FOMC '
             'days vs other Wednesdays; era = before vs since 2020.\n')
    for sec, rs in sorted(secs.items()):
        L.append(f'### {sec} ({len(rs)})\n')
        rows = []
        for r in sorted(rs, key=lambda r: r['sym']):
            t = r.get('top') or []
            w = r.get('weekday') or {}
            e = r.get('era') or {}
            rows.append([f"**{r['sym']}**", (r.get('display') or '')[:28], r['years'],
                         *[f"{x['from']}-{x['to']} **{x['mt']}** {fx(x['a'])}" if i < len(t) else '-' for i, x in enumerate(t + [{}] * (3 - len(t))) if i < 3],
                         f"{w.get('best', '-')} / {w.get('quiet', '-')} {fx(w.get('x'))} ({(w.get('ci') or ['-', '-'])[0]}-{(w.get('ci') or ['-', '-'])[1]})" if w else '-',
                         f"{r.get('win_rel')} / {w.get('rel', '-')}",
                         fx((r.get('nfp') or {}).get('x')), fx((r.get('fomc_1230') or {}).get('x')),
                         'shifted' if e.get('drift') else 'stable'])
        L.append(md_table(['Symbol', 'Name', 'Years', 'Best 1', 'Best 2', 'Best 3', 'Best / quiet day', 'Reliability (times / days)',
                           'NFP', 'FOMC', 'Era'], rows))
    return '\n'.join(L)


def summaries(G: Dict, fxr: List[Dict], sr: List[Dict]) -> (List[str], List[str]):
    cur, st_, cfd, met = (G.get(k) or {} for k in ('Forex currencies', 'Stocks (all)', 'Index / commodity CFDs', 'Metals'))
    out, outs = [], []

    def at(g, s):
        p = g.get('profile') or []
        i = sidx(s)
        return fx(p[i]) if i < len(p) else '-'

    def best(g, k=3):
        return ', '.join(f"{w['mt']} ({fx(w['a'])})" for w in windows_of(g.get('profile') or [], k=k, thr=1.0))
    if cur:
        out.append(f"- **Forex currencies ({cur['n']} pairs, median {cur['years_median']} years):** the strongest half-hours "
                   f"start at {best(cur)} Calgary. 06:30 (US data) {at(cur, '06:30')}, 07:30 (NYSE open) {at(cur, '07:30')}, "
                   f"08:00 {at(cur, '08:00')}, London open 01:00 {at(cur, '01:00')}; quietest around 15:00 (rollover) "
                   f"{at(cur, '15:00')}.")
        tc = list((cur.get('top_slot_counts') or {}).items())[:4]
        out.append('- **Each pair\'s own best half-hour:** ' + ', '.join(f'{k} for {v} pairs' for k, v in tc) +
                   f". {cur.get('win_reliable_share')}% of pairs have reliable best times (both halves of the history agree).")
    if met:
        out.append(f"- **Metals ({met['n']}):** peaks at {best(met)}.")
    if cfd:
        out.append(f"- **Index / commodity CFDs ({cfd['n']}):** peaks at {best(cfd)} - the cash-market opens dominate.")
    for lab, g in (('Forex currencies', cur), ('Stocks', st_)):
        if not g:
            continue
        days = g.get('days') or {}
        if days:
            vals = [v for v in days.values() if v is not None]
            spread = (max(vals) / min(vals) - 1) * 100 if vals and min(vals) > 0 else 0
            rb = list((g.get('reliable_best_weekday_counts') or {}).items())
            line = (f"- **Weekdays, {lab.lower()}:** day activity " + ' / '.join(f'{k} {fx(v)}' for k, v in days.items()) +
                    f" - only {spread:.0f}% between the busiest and the quietest weekday. Best weekday reliable for "
                    f"{g.get('day_reliable_share')}% of instruments" + (f" (mostly {', '.join(f'{k} {v}' for k, v in rb[:3])})" if rb else '') + '.')
            (out if lab != 'Stocks' else outs).append(line)
    if cur and (cur.get('nfp') or {}).get('median_x'):
        out.append(f"- **NFP Fridays:** the 06:30 Calgary half-hour moves {cur['nfp']['median_x']}x as far as on other Fridays "
                   f"(median pair, IQR {cur['nfp']['q1']}-{cur['nfp']['q3']}, {cur['nfp']['median_days']} NFP days). "
                   f"**FOMC days:** 12:00 Calgary {fx((cur.get('fomc_1200') or {}).get('median_x'))}, press conference 12:30 "
                   f"{fx((cur.get('fomc_1230') or {}).get('median_x'))} vs a normal day.")
    if cur:
        out.append(f"- **Era check:** last 2 years vs whole history: median rho {cur.get('era_recent_vs_all_median')} "
                   f"(forex), {st_.get('era_recent_vs_all_median', '-') if st_ else '-'} (stocks); "
                   f"{cur.get('drift_share')}% of pairs and {st_.get('drift_share', '-') if st_ else '-'}% of stocks shifted.")
    if st_:
        outs.append(f"- **All {st_['n']} stocks:** strongest half-hours {best(st_)} Calgary. The 07:30 open: volume "
                    f"{fx(st_['vol'][15])}, range {fx(st_['range'][15])}, big-move days {st_['big_pct'][15]}%. The 13:30 last "
                    f"half-hour: volume {fx(st_['vol'][27])} but range {fx(st_['range'][27])}.")
        tc = list((st_.get('top_slot_counts') or {}).items())[:3]
        outs.append('- **Each stock\'s own best half-hour:** ' + ', '.join(f'{k} for {v} stocks' for k, v in tc) +
                    f"; best times reliable for {st_.get('win_reliable_share')}% of stocks.")
        if (st_.get('nfp') or {}).get('median_x'):
            outs.append(f"- **NFP Fridays:** opening half-hour range {st_['nfp']['median_x']}x other Fridays (median stock); "
                        f"**FOMC days** 12:30 Calgary {fx((st_.get('fomc_1230') or {}).get('median_x'))}.")
        outs.append(f"- **Era:** median rho last 2 y vs all {st_.get('era_recent_vs_all_median')}, before vs since 2020 "
                    f"{fx(st_.get('era_pre_vs_post_median'), '')}; {st_.get('drift_share')}% of stocks shifted.")
    if out:
        out.append(f"- Stocks in short: strongest half-hours {best(st_)} Calgary (details in Market_Hours_Stocks.md)." if st_ else '')
    return [x for x in out if x], [x for x in outs if x]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--in', dest='inp', required=True)
    ap.add_argument('--cal', required=True)
    ap.add_argument('--root', default=ROOT)
    ap.add_argument('--synthetic', action='store_true')
    a = ap.parse_args(argv)
    with open(a.cal) as f:
        cal = json.load(f)
    data, info = load_shards(a.inp)
    fxr, sr = data['fx'], data['stocks']
    groups = {
        'Forex currencies': group_summary([r for r in fxr if r['cls'] in ('major', 'cross', 'exotic')]),
        'Majors': group_summary([r for r in fxr if r['cls'] == 'major']),
        'Crosses': group_summary([r for r in fxr if r['cls'] == 'cross']),
        'Exotics': group_summary([r for r in fxr if r['cls'] == 'exotic']),
        'Metals': group_summary([r for r in fxr if r['cls'] == 'metal']),
        'Index / commodity CFDs': group_summary([r for r in fxr if r['cls'] == 'cfd']),
        'Stocks (all)': group_summary(sr),
    }
    for sec in sorted({r.get('group') or 'Other' for r in sr}):
        groups['Sector: ' + sec] = group_summary([r for r in sr if (r.get('group') or 'Other') == sec])
    groups = {k: v for k, v in groups.items() if v}
    feed = next((i.get('alpaca_feed') for i in info if i.get('alpaca_feed')), None)
    meta = {'generated': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), 'synthetic': a.synthetic,
            'timezone': 'America/Edmonton', 'n_fx': len(fxr), 'n_stocks': len(sr), 'alpaca_feed': feed,
            'fomc_source': cal.get('fomc_source'), 'nfp_source': cal.get('nfp_source'), 'n_fomc': len(cal.get('fomc') or []),
            'n_nfp': len(cal.get('nfp') or []), 'big_move_x': 2.0,
            'method': 'per instrument and month: half-hour volume and high-low / the month median; activity = sqrt(vol x range)'}
    s_fx, s_st = summaries(groups, fxr, sr)
    R = {'meta': meta, 'groups': groups, 'summary': s_fx, 'summary_stocks': s_st, 'shards': info,
         'calendar': {k: cal.get(k) for k in ('fomc_source', 'nfp_source', 'fomc_per_year', 'nfp_per_year', 'errors')}}
    pub = os.path.join(a.root, 'public', 'research')
    docs = os.path.join(a.root, 'docs', 'research')
    os.makedirs(pub, exist_ok=True)
    os.makedirs(docs, exist_ok=True)
    by = {'meta': {k: meta[k] for k in ('generated', 'synthetic', 'timezone', 'n_fx', 'n_stocks', 'alpaca_feed', 'fomc_source', 'nfp_source')},
          'symbols': [compact(r) for r in fxr + sr]}
    with open(os.path.join(pub, 'market_hours_by_symbol.json'), 'w') as f:
        json.dump(by, f, separators=(',', ':'))
    with open(os.path.join(pub, 'market_hours.json'), 'w') as f:
        json.dump(R, f, separators=(',', ':'))
    with open(os.path.join(docs, 'Market_Hours.md'), 'w') as f:
        f.write(build_fx_md(R, fxr, cal, info, a.synthetic))
    with open(os.path.join(docs, 'Market_Hours_Stocks.md'), 'w') as f:
        f.write(build_stocks_md(R, sr, a.synthetic))
    try:
        cur = groups.get('Forex currencies') or {}
        if cur.get('cells_rv'):
            heatmap(cur['cells_rv'], cur['cells_rr'], [6, 0, 1, 2, 3, 4], list(range(NS)),
                    f"Forex currencies ({cur['n']} pairs, {cur['from_min']} to {cur['to_max']}): weekday x half-hour, Calgary time",
                    os.path.join(docs, 'market_hours_fx.png'))
        sg = groups.get('Stocks (all)') or {}
        if sg.get('cells_rv'):
            heatmap(sg['cells_rv'], sg['cells_rr'], [0, 1, 2, 3, 4], list(range(4, 36)),
                    f"US stocks ({sg['n']} symbols, pre + regular + post, {sg['from_min']} to {sg['to_max']}): weekday x half-hour, Calgary time",
                    os.path.join(docs, 'market_hours_stocks.png'))
        era_chart({k: groups[k] for k in ('Forex currencies', 'Metals', 'Index / commodity CFDs', 'Stocks (all)') if k in groups},
                  os.path.join(docs, 'market_hours_era.png'))
    except ImportError as e:
        print(f'charts skipped: {e}')
    print(f'report: {len(fxr)} fx, {len(sr)} stocks -> {pub}, {docs}')
    return 0 if (fxr or sr) else 1


if __name__ == '__main__':
    sys.exit(main())
