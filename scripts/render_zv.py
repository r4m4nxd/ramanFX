#!/usr/bin/env python3
"""Draws one ZoneVision model dump (scripts/render-zv.ts) to PNG in an MT5-like light look (+ the owner's marks in blue when the
dump has them). Every line is one straight segment on the bar axis, as MT5 draws an OBJ_TREND. Usage: render_zv.py IN.json OUT.png"""
import json
import sys
import textwrap

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

d = json.load(open(sys.argv[1]))
C = d['candles']
idx = {c[0]: i for i, c in enumerate(C)}
n = len(C)
fig, ax = plt.subplots(figsize=(16, 9.6), dpi=110)
fig.patch.set_facecolor('white'); ax.set_facecolor('white')
lo = min(c[3] for c in C); hi = max(c[2] for c in C)
pad = (hi - lo) * 0.06
for i, (t, o, h, l, c) in enumerate(C):
    ax.plot([i, i], [l, h], color='black', lw=0.7, zorder=3)
    bull = c >= o
    ax.add_patch(Rectangle((i - 0.32, min(o, c)), 0.64, max(abs(c - o), (hi - lo) * 0.0008), facecolor='white' if bull else 'black', edgecolor='black', lw=0.7, zorder=4))


def xof(t):
    if t in idx: return idx[t]
    if t.startswith('+'): return n - 1 + int(t[1:])
    before = [i for k, i in idx.items() if k <= t]
    return max(before) if before else None


# realignment target
tg = d.get('target')
if tg and tg['hi'] >= lo - (hi - lo) * 2:
    x0 = xof(tg['t0']); x0 = 0 if x0 is None else x0
    ax.add_patch(Rectangle((x0, tg['lo']), n + 3 - x0, tg['hi'] - tg['lo'], facecolor=(0.5, 0.25, 0.75, 0.10), edgecolor=(0.5, 0.25, 0.75), lw=1.6, zorder=1))
    ax.text(x0 + 0.5, tg['hi'], tg['label'], color=(0.5, 0.25, 0.75), fontsize=8, va='bottom', zorder=6)
    lo = min(lo, tg['lo']); hi = max(hi, tg['hi'])
# zones with a reason
for z in d['zones']:
    x0 = xof(z['t0']); x0 = 0 if x0 is None else x0
    col = (0.18, 0.55, 0.34) if z['dir'] > 0 else (0.78, 0.24, 0.24)
    ax.add_patch(Rectangle((x0, min(z['prox'], z['dist'])), n + 3 - x0, abs(z['prox'] - z['dist']), facecolor=col + (0.13,), edgecolor=col, lw=0.6, zorder=2))
    ax.text(x0 + 0.3, z['dist'], z['label'], color=col, fontsize=7, va='top' if z['dir'] > 0 else 'bottom', zorder=6)
STY = {'live': ('black', '-', 1.2), 'target': ((0.5, 0.25, 0.75), '--', 1.4), 'broken': ((0.6, 0.6, 0.6), ':', 1.2), 'momentum': ('red', '--', 1.0),
       'momentum-broken': ('red', ':', 0.9), 'htf': ((0.78, 0.59, 0.16), ':', 1.4)}
for L in d['lines']:
    xs, ys = [], []
    for t, v in L['pts']:
        x = xof(t)
        if x is None: continue
        xs.append(x); ys.append(v)
    if len(xs) < 2: continue
    col, ls, lw = STY.get(L['role'], ('black', '-', 1))
    if L['role'] == 'live' and d.get('target') and L['tf'] == d['tf'] and False: lw = 2
    ax.plot(xs, ys, color=col, ls=ls, lw=lw, zorder=5)
    if L['role'] in ('htf', 'target'): ax.text(xs[-1] + 0.3, ys[-1], f" {L['tf']} {'up' if L['dir'] > 0 else 'down'} line {ys[-1]:.{d['digits']}f}", color=col, fontsize=7, va='center', zorder=6)
    lo = min(lo, min(ys)) if L['role'] != 'htf' else lo
    if L['role'] == 'momentum': ax.text(xs[-1] + 0.3, ys[-1], ' momentum', color='red', fontsize=7, va='center', zorder=6)
for p in d['pivots']:
    x = xof(p['t'])
    if x is None or p['t'] not in idx: continue
    ax.plot([x], [p['p'] + (pad * 0.15 if p['k'] > 0 else -pad * 0.15)], 'o', ms=3, color=(0.78, 0.24, 0.24) if p['k'] > 0 else (0.18, 0.55, 0.34), zorder=7)
# the owner's marks (blue): pivots = hollow circles, trend lines solid, momentum dashed (ending at his break mark), zones = boxes
OW = d.get('owner')
BLUE = (0.12, 0.35, 0.85)
if OW:
    for z in OW['zones']:
        x0 = xof(z['t0']); x0 = 0 if x0 is None else x0
        ax.add_patch(Rectangle((x0, min(z['prox'], z['dist'])), n + 3 - x0, abs(z['prox'] - z['dist']), facecolor='none', edgecolor=BLUE, lw=1.3, ls=(0, (4, 2)), alpha=0.8, zorder=6))
    for L in OW['lines']:
        xa, xb = xof(L['a']), xof(L['b'])
        if xa is None or xb is None or xb == xa: continue
        sl = (L['pb'] - L['pa']) / (L['ib'] - L['ia'])
        xe = xof(L['brk']) if L['brk'] else n + 2
        ye = L['pa'] + sl * ((L['ibrk'] if L['brk'] else (n + 2 - xa + L['ia'])) - L['ia'])
        ax.plot([xa, xe], [L['pa'], ye], color=BLUE, ls='--' if L['momentum'] else '-', lw=4.5, alpha=0.28, zorder=4, solid_capstyle='butt')
        ax.plot([xa, xb], [L['pa'], L['pb']], 'o', ms=4, mfc='none', mec=BLUE, zorder=8)
    for p in OW['pivots']:
        x = xof(p['t'])
        if x is None: continue
        ax.plot([x], [p['p'] + (pad * 0.32 if p['k'] > 0 else -pad * 0.32)], 'o', ms=6, mfc='none', mec=BLUE, mew=1.3, zorder=8)
pad = (hi - lo) * 0.06
ax.set_xlim(-1, n + 16); ax.set_ylim(lo - pad, hi + pad * 1.5)
for tx in ax.texts: tx.set_clip_on(True)
step = max(1, n // 10)
ax.set_xticks(range(0, n, step)); ax.set_xticklabels([C[i][0][:10] if d['tf'] not in ('H4', 'H1') else C[i][0][:13].replace('T', ' ') for i in range(0, n, step)], fontsize=7, rotation=0)
ax.yaxis.tick_right(); ax.tick_params(axis='y', labelsize=7); ax.grid(color=(0.92, 0.92, 0.92), lw=0.5)
# DIRECTION: one row per part (NOW / TARGET / THEN / FLIP), wrapped, ABOVE the chart (a corner panel that never covers price)
rows = []
for part in d['direction'].split(' | '):
    rows += textwrap.wrap(part, 118, subsequent_indent='    ')
fig.text(0.008, 0.995, d.get('title', f"{d['sym']} {d['tf']}  -  ZoneVision model"), fontsize=10, va='top', ha='left')
fig.text(0.008, 0.968, '\n'.join(rows), fontsize=7.2, va='top', ha='left', family='monospace',
         bbox=dict(facecolor='white', edgecolor=(0.8, 0.8, 0.8), alpha=0.95))
ax.text(0.005, 0.01, 'STRUCTURE ' + d['structure'], transform=ax.transAxes, fontsize=8, va='bottom', ha='left', color=(0.35, 0.35, 0.35), zorder=8,
        bbox=dict(facecolor='white', edgecolor='none', alpha=0.8))
top = 0.955 - 0.0145 * len(rows)
plt.subplots_adjust(left=0.02, right=0.955, bottom=0.05, top=top)
plt.savefig(sys.argv[2]); plt.close(fig)
