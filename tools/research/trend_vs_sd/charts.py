"""The two charts of docs/research/TREND_VS_SD.md (light background, log scale)."""
from __future__ import annotations

import datetime as dt
import os
from typing import Dict, List

import matplotlib
matplotlib.use('Agg')
import matplotlib.dates as mdates  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.ticker import NullFormatter  # noqa: E402
import numpy as np  # noqa: E402

COL = {'A': '#c0392b', 'B': '#1f6fb2', 'C': '#2e8b57'}
NAME = {'A': 'A  Supply / demand alone', 'B': 'B  Trend following alone', 'C': 'C  Trend filter + supply / demand entry'}
SHORT = {'A': 'A supply / demand', 'B': 'B trend following', 'C': 'C trend + S/D'}
BG = '#ffffff'
GRID = '#e3e6ea'
INK = '#1c2530'


def _style(ax):
    ax.set_facecolor(BG)
    ax.grid(True, color=GRID, lw=0.8)
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)
    for s in ('left', 'bottom'):
        ax.spines[s].set_color('#9aa4af')
    ax.tick_params(colors=INK, labelsize=10)


def draw(R: Dict, eq: Dict[str, Dict[str, float]], rs: Dict[str, List[float]], outdir: str) -> None:
    os.makedirs(outdir, exist_ok=True)
    # ---- 1. equity curves
    fig, ax = plt.subplots(figsize=(11, 6.2), dpi=130)
    fig.patch.set_facecolor(BG)
    _style(ax)
    for k in 'ABC':
        ds = sorted(eq[k])
        x = [dt.date.fromisoformat(d) for d in ds]
        y = [eq[k][d] for d in ds]
        p = R['variants'][k]['periods']['2009-now']
        ax.plot(x, y, color=COL[k], lw=1.8, label=f"{NAME[k]}   (CAGR {p['cagr']*100:+.1f}%, max drawdown {p['maxdd']*100:.0f}%, {p['n']} trades)")
    ax.axhline(1.0, color='#555', lw=0.9, ls='--')
    ax.set_yscale('log')
    ax.set_yticks([0.5, 0.6, 0.7, 0.8, 1.0, 1.2, 1.4])
    ax.set_yticklabels(['0.5', '0.6', '0.7', '0.8', '1.0', '1.2', '1.4'])
    ax.yaxis.set_minor_formatter(NullFormatter())
    ax.set_ylim(0.47, 1.5)
    ax.axvline(dt.date(2015, 1, 1), color='#888', lw=0.9, ls=':')
    ax.axvline(dt.date(2021, 1, 1), color='#888', lw=0.9, ls=':')
    for xd, t in ((dt.date(2011, 7, 1), '2009-14'), (dt.date(2017, 12, 1), '2015-20'), (dt.date(2023, 12, 1), '2021-now')):
        ax.text(xd, 1.46, t, ha='center', va='top', fontsize=10, color='#667', style='italic')
    ax.set_title('Same 13 markets, 0.5% risk per trade, spreads and commission paid\nEquity, start = 1.0 (log scale)', fontsize=13, color=INK, loc='left')
    ax.set_ylabel('Account equity (multiple of start)', fontsize=11, color=INK)
    ax.xaxis.set_major_locator(mdates.YearLocator(2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    ax.legend(loc='lower left', fontsize=10, frameon=True, facecolor=BG, edgecolor=GRID)
    fig.tight_layout()
    fig.savefig(os.path.join(outdir, 'equity.png'), facecolor=BG)
    plt.close(fig)

    # ---- 2. risk size comparison: best variant and A, replayed at 0.5 / 2 / 5%, and P(lose half)
    best = R['best']
    risks = ['0.005', '0.02', '0.05']
    rcol = {'0.005': '#1f6fb2', '0.02': '#e08a1e', '0.05': '#c0392b'}
    fig, axs = plt.subplots(1, 3, figsize=(15.5, 6.4), dpi=120, gridspec_kw={'width_ratios': [1, 1, 0.9]})
    fig.patch.set_facecolor(BG)
    shown = [best] + (['A'] if best != 'A' else ['B'])
    for ax, k in zip(axs[:2], shown):
        _style(ax)
        seq = rs[k]
        for f in risks:
            e = [1.0]
            for r in seq:
                e.append(max(e[-1] * (1 + float(f) * r), 1e-4))
            row = R['risk_sizes'][k]['rows'][f]
            ax.plot(range(len(e)), e, color=rcol[f], lw=1.6,
                    label=f"{float(f)*100:g}% per trade: ends at {row['replay']['final']:.2f}x, worst drawdown {row['replay']['maxdd']*100:.0f}%,\n"
                          f"   chance of losing half: {row['mc']['p_half_start']*100:.0f}%")
        ax.axhline(1.0, color='#555', lw=0.9, ls='--')
        ax.axhline(0.5, color='#999', lw=0.9, ls=':')
        ax.set_yscale('log')
        ax.set_ylim(0.01, 6)
        ax.yaxis.set_minor_formatter(NullFormatter())
        ax.set_title(f"{NAME[k]}\nthe same {len(seq)} trades, only the bet size changes", fontsize=11.5, color=INK, loc='left')
        ax.set_xlabel('trade number (in the order they closed)', fontsize=10, color=INK)
        ax.set_ylabel('Equity (multiple of start, log)', fontsize=10, color=INK)
        ax.legend(loc='upper left', bbox_to_anchor=(0, -0.17), fontsize=8.6, frameon=False)
    ax = axs[2]
    _style(ax)
    w = 0.26
    for j, f in enumerate(risks):
        vals = [R['risk_sizes'][k]['rows'][f]['mc']['p_half_start'] * 100 for k in 'ABC']
        xs = np.arange(3) + (j - 1) * w
        bars = ax.bar(xs, vals, w, color=rcol[f], label=f"{float(f)*100:g}% risk")
        for xx, v in zip(xs, vals):
            ax.text(xx, v + 1.2, f'{v:.0f}%', ha='center', fontsize=9, color=INK)
    ax.set_xticks(range(3))
    ax.set_xticklabels([SHORT[k] for k in 'ABC'], fontsize=10)
    ax.set_ylim(0, 118)
    ax.set_ylabel('Chance the account falls to half or less\n(10,000 re-shuffles of the trades)', fontsize=10, color=INK)
    ax.set_title('Probability of losing 50% of the account', fontsize=11.5, color=INK, loc='left')
    ax.legend(fontsize=9.5, frameon=False, loc='upper left', ncol=3)
    fig.suptitle('Bigger bets do not fix a thin edge: they only make the swings (and the ruin odds) bigger', fontsize=13.5, color=INK, x=0.012, ha='left')
    fig.tight_layout(rect=(0, 0.04, 1, 0.94))
    fig.savefig(os.path.join(outdir, 'risk.png'), facecolor=BG)
    plt.close(fig)
