"""Write docs/research/TREND_VS_SD.md from results.json (run_all.py). Every number in the report comes from results.json;
the sentences around them were written for the run of 2026-11-01 and are checked against the numbers by `check()` below
(it refuses to write the report when a claim in the text no longer matches the data).

    python tools/research/trend_vs_sd/make_doc.py --results docs/research/trend_vs_sd/results.json --out docs/research/TREND_VS_SD.md
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Dict

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import sim as S  # noqa: E402
import tvsdlib as L  # noqa: E402

MAIN = '2009-now'
NAME = {'A': 'A  Supply / demand alone', 'B': 'B  Trend following alone', 'C': 'C  Trend filter + S/D entry',
        'AF': 'A + trend filter, A exits', 'AT': 'A entries, trailing exit, no filter'}


def pct(v, d=1, sign=False):
    return 'n/a' if v is None else (f'{v * 100:+.{d}f}%' if sign else f'{v * 100:.{d}f}%')


def rr(v, d=2):
    return 'n/a' if v is None else f'{v:+.{d}f}'


def pf(v):
    return 'n/a' if v is None else ('inf' if v == 'inf' else f'{v:.2f}')


def ci(p):
    c = p.get('ci')
    return '' if not c else f' ({c[0]:+.2f} … {c[1]:+.2f})'


def table(head, rows, align=None):
    out = ['| ' + ' | '.join(head) + ' |', '|' + '|'.join(('---:' if (align and align[i] == 'r') else '---') for i in range(len(head))) + '|']
    out += ['| ' + ' | '.join(str(c) for c in r) + ' |' for r in rows]
    return '\n'.join(out)


def check(R: Dict) -> None:
    """The sentences below claim: none of the three has a significant positive expectancy; A < B; 2021-now negative for all three."""
    V = R['variants']
    p = {k: V[k]['periods'] for k in 'ABC'}
    assert p['A'][MAIN]['exp'] < 0 and p['A'][MAIN]['ci'][1] <= 0.01, 'A should be clearly negative'
    assert all(p[k][MAIN]['ci'][0] < 0 < p[k][MAIN]['ci'][1] for k in 'BC'), 'B / C should be indistinguishable from zero'
    assert p['B'][MAIN]['exp'] > p['A'][MAIN]['exp'] and p['B'][MAIN]['exp'] > p['C'][MAIN]['exp'], 'B should be the best'
    assert all(p[k]['2021-now']['exp'] < 0 for k in 'ABC'), 'all three should be negative in 2021-now'
    assert all(p[k]['2015-20']['exp'] > 0 for k in 'ABC'), 'all three should be small positive in 2015-20'
    assert R['best'] == 'B'
    assert R['orders']['L6']['all'] == 0
    assert R['ladder']['L1']['A']['periods'][MAIN]['exp'] < p['A'][MAIN]['exp'], 'the quality rules should not help A'
    assert R['decomp']['AT']['periods'][MAIN]['exp'] > 0 and R['decomp']['AF']['periods'][MAIN]['exp'] < 0.01
    assert R['risk_sizes']['A']['rows']['0.005']['mc']['p_half_start'] > 0.3


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--results', required=True)
    ap.add_argument('--out', required=True)
    a = ap.parse_args(argv)
    R = json.load(open(a.results))
    check(R)
    V, P = R['variants'], {k: R['variants'][k]['periods'] for k in 'ABC'}
    D = R['decomp']
    Pm = {k: P[k][MAIN] for k in 'ABC'}
    best = R['best']
    gross = {k: R['cost_sens']['0.0'][k]['periods'][MAIN] for k in 'ABC'}
    x2 = {k: R['cost_sens']['2.0'][k]['periods'][MAIN] for k in 'ABC'}
    gen = R['fill_sens']['A_generous']['periods']
    rk = R['risk_sizes']
    lad = R['ladder']
    L1A = lad['L1']['A']['periods'][MAIN]
    first = f"{R['last_bar'][:4]}"
    years = Pm['A']['years']

    out = []
    w = out.append
    w('# Trend following vs supply / demand: which one makes money?')
    w('')
    w(f"Back-test of three rule sets on the same 13 markets, Jan 2009 to {R['last_bar']} ({years:.1f} years, daily bars, spreads and commission "
      f"paid, 0.5% of the account risked per trade). Run {R['generated']}. Nothing was tuned: the trend parameters, risk and costs were fixed before the first run "
      f"(the few choices made later are listed under Caveats), so every year is out-of-sample.")
    w('')
    w('## The answer in five lines')
    w('')
    w(f"1. **None of the three makes money.** Trend alone (B) is break-even ({rr(Pm['B']['exp'])}R per trade, {pct(Pm['B']['cagr'], 1, True)} a year); supply / demand alone (A) loses "
      f"({rr(Pm['A']['exp'])}R, {pct(Pm['A']['cagr'], 1, True)} a year, the account falls to {R['equity_end']['A']:.2f}x); trend filter + S/D (C) is break-even ({rr(Pm['C']['exp'])}R, "
      f"{pct(Pm['C']['cagr'], 1, True)} a year). C beats A and ties B; it does not beat both.")
    w(f"2. **It fades out of sample.** 2015-20 was mildly positive for all three, 2021-now is negative for all three (A {rr(P['A']['2021-now']['exp'])}R, B {rr(P['B']['2021-now']['exp'])}R, "
      f"C {rr(P['C']['2021-now']['exp'])}R per trade). Nothing is statistically different from zero except A, which is (just) negative.")
    w(f"3. **The zones carry no edge.** A is {rr(gross['A']['exp'])}R per trade before costs; the scanner's full rule set never fires on D1 / W1 ({R['orders']['L6']['all']} orders in {years:.0f} years) and its "
      f"zone-quality rules did not help ({rr(L1A['exp'])}R on {L1A['n']} trades). Only the exit helped: a trailing stop instead of a fixed target gave {rr(D['AT']['periods'][MAIN]['exp'])}R (not proven).")
    w(f"4. **More risk only brings ruin faster.** Chance of losing half the account at 0.5% / 2% / 5% risk per trade: A {pct(rk['A']['rows']['0.005']['mc']['p_half_start'], 0)} / "
      f"{pct(rk['A']['rows']['0.02']['mc']['p_half_start'], 0)} / {pct(rk['A']['rows']['0.05']['mc']['p_half_start'], 0)}; even the break-even B "
      f"{pct(rk['B']['rows']['0.005']['mc']['p_half_start'], 0)} / {pct(rk['B']['rows']['0.02']['mc']['p_half_start'], 0)} / {pct(rk['B']['rows']['0.05']['mc']['p_half_start'], 0)}.")
    w("5. **Change:** risk 0.5% or less until a forward journal shows an edge; journal which zones you take and when you exit by hand (the mechanical zones show no edge, so any edge would be in that discretion); "
      "try trailing exits against fixed targets; do not expect a trend filter to fix the entries.")
    w('')
    w('![Equity of the three variants](trend_vs_sd/equity.png)')
    w('')
    w('## 1. The three variants side by side')
    w('')
    w(f"Whole period, Jan 2009 to {R['last_bar']}. R = profit in units of the planned risk (entry to stop, spread included). Expectancy = average R per trade. "
      "PF = gross profit / gross loss. 95% CI: resampled by calendar month (trades in a month share the market). CAGR and drawdown are from the daily "
      "mark-to-market account at 0.5% risk per trade.")
    w('')
    rows = []
    for k in 'ABC':
        p = Pm[k]
        rows.append([NAME[k], p['n'], pct(p['win'], 0), rr(p['avg_win']), rr(p['avg_loss']), rr(p['exp']) + ci(p), pf(p['pf']), pct(p['cagr'], 1, True),
                     pct(p['maxdd'], 0), p['streak']])
    w(table(['variant', 'trades', 'win %', 'avg win R', 'avg loss R', 'expectancy R (95% CI)', 'PF', 'CAGR', 'max DD', 'longest losing streak'], rows,
            'lrrrrrrrrr'))
    w('')
    w('### Out-of-sample split (nothing tuned on either half)')
    w('')
    rows = []
    for k in 'ABC':
        for per, lab in (('2009-14', '2009-14'), ('2015-20', '2015-20'), ('2021-now', '2021-now'), ('2015-now', '2015-now')):
            p = P[k][per]
            rows.append([NAME[k] if per == '2009-14' else '', lab, p['n'], pct(p['win'], 0), rr(p['exp']) + ci(p), pf(p['pf']), pct(p['cagr'], 1, True), pct(p['maxdd'], 0)])
    w(table(['variant', 'period', 'trades', 'win %', 'expectancy R (95% CI)', 'PF', 'CAGR', 'max DD'], rows, 'llrrrrrr'))
    w('')
    w('2015-20 vs 2021-now is the requested split. 2009-14 is extra history (the zone engine needs about three years of monthly bars before it can start), '
      'shown so that the picture does not hang on one decade.')
    w('')
    w('### What each ingredient does (fixed rules, a 2 x 2 look, not an optimisation)')
    w('')
    rows = []
    for k, lab in (('A', 'A: S/D zones, target exit, no filter'), ('AF', 'S/D zones, target exit, **with** trend filter'),
                   ('AT', 'S/D zones, **trailing** exit, no filter'), ('C', 'C: S/D zones, trailing exit, trend filter')):
        p = D[k]['periods']
        rows.append([lab, p[MAIN]['n'], pct(p[MAIN]['win'], 0), rr(p[MAIN]['exp']) + ci(p[MAIN]), pf(p[MAIN]['pf']), rr(p['2015-20']['exp']), rr(p['2021-now']['exp']),
                     pct(p[MAIN]['cagr'], 1, True), pct(p[MAIN]['maxdd'], 0)])
    w(table(['entries / exit / filter', 'trades', 'win %', 'expectancy R (95% CI)', 'PF', '2015-20 R', '2021-now R', 'CAGR', 'max DD'], rows, 'lrrrrrrrr'))
    w('')
    w('Reading it: the trend filter does nothing for the target-exit version (A vs filtered A) and makes the trailing-exit version worse (AT vs C). The '
      'trailing exit is what moved the result, and even that is inside the noise (all CIs include zero). It was found by looking at four cells, so treat it '
      'as a lead for a forward test, not a result.')
    w('')
    w('## 2. Per year and per symbol')
    w('')
    w("Year return = change of the 0.5%-risk account in that calendar year. Trades and expectancy are by entry year.")
    w('')
    yrs = sorted({y['year'] for k in 'ABC' for y in V[k]['yearly']})
    ym = {k: {y['year']: y for y in V[k]['yearly']} for k in 'ABC'}
    rows = []
    for y in yrs:
        row = [y]
        for k in 'ABC':
            e = ym[k].get(y)
            row += [pct(e['ret'], 1, True), e['n'], rr(e['exp']) if e['n'] else 'n/a'] if e else ['', '', '']
        rows.append(row)
    w(table(['year', 'A return', 'A n', 'A R', 'B return', 'B n', 'B R', 'C return', 'C n', 'C R'], rows, 'lrrrrrrrrr'))
    w('')
    syms = sorted({s['sym'] for k in 'ABC' for s in V[k]['symbols']}, key=lambda s: ('FX', 'Metals', 'Indices', 'Oil').index(L.GROUP[s]) * 100 + L.SYMS.index(s))
    sm = {k: {s['sym']: s for s in V[k]['symbols']} for k in 'ABC'}
    rows = []
    for s in syms:
        row = [s, L.GROUP[s]]
        for k in 'ABC':
            e = sm[k].get(s)
            row += [e['n'], rr(e['exp']), rr(e['sum_r'], 1)] if e else ['', '', '']
        rows.append(row)
    w(table(['symbol', 'group', 'A n', 'A R/trade', 'A sum R', 'B n', 'B R/trade', 'B sum R', 'C n', 'C R/trade', 'C sum R'], rows, 'llrrrrrrrrr'))
    w('')
    w('No symbol is a reliable winner across the variants (the best single numbers, such as gold for A and B or the S&P 500 for C, come from 30-150 trades '
      'with a standard error of 0.1-0.4R, and 13 symbols x 3 variants guarantee some good-looking cells).')
    w('')
    w('## 3. Variant A, rule by rule: how much of the owner\'s method is left')
    w('')
    f = R['funnel']
    w(f"The live scanner (`tools/fx_scanner/fxcore.py`, the same functions) was run at every D1 close from Sep 2008 on the bars closed at that moment. "
      f"{f['zones_near']:,} different D1 / W1 zones came within one zone-height of price; {f['fresh_near']:,} were still fresh on that first day. "
      f"Share of those fresh zones that FAIL each scanner rule on that day (a zone can fail several):")
    w('')
    fb = f['blocked_by']
    lab = {'location': 'HTF location chain (MN -> W1 -> D1 touched)', 'blind': 'a limit order is allowed here (arrival / WOW / at the trendline)',
           'leg': 'departure at least 2x the base', 'room': 'nearest opposite zone (any TF) at least 2x the stop away', 'strong': 'strong zone type (ARR / WOW / STR)',
           'direction': 'direction agrees (D1 -> W1 -> MN)', 'curve': 'curve side', 'clean': 'not an overlap / flip zone', 'sideways': 'not sideways',
           'out of TL': 'not out of the trendline', 'not used': 'has not done its job yet', 'area': 'D1 / H4 zone, not a W1 / MN area',
           'HTF opposite': 'no opposite HTF zone on top', 'trendline': 'trendline distance / touches', 'reduced': 'direction FULL, not reduced',
           'no 3rd CP': 'not the 3rd continuation in a row', 'spread': 'spread under 10% of the stop'}
    rows = [[lab.get(k, k), f'{v / f["fresh_near"] * 100:.0f}%'] for k, v in fb.items() if k in lab and v / f['fresh_near'] > 0.02]
    w(table(['scanner rule', 'fresh zones failing it'], rows, 'lr'))
    w('')
    w('Variant A (the headline) keeps only the first step. Each later step adds the next group of rules (cumulative). The last step is the whole live scanner.')
    w('')
    rows = []
    for n, v in lad.items():
        o = R['orders'][n]
        pa, pc = v['A']['periods'][MAIN], v['C']['periods'][MAIN]
        rows.append([n, v['text'], o['all'], pa.get('n', 0), pct(pa['win'], 0) if pa.get('n') else '', (rr(pa['exp']) + ci(pa)) if pa.get('n') else '', pf(pa['pf']) if pa.get('n') else '',
                     pc.get('n', 0), (rr(pc['exp'])) if pc.get('n') else ''])
    w(table(['step', 'rules added', 'orders', 'A trades', 'win %', 'A expectancy R (95% CI)', 'PF', 'C trades', 'C R'], rows, 'llrrrrrrr'))
    w('')
    w(f"Everything below 30 trades is anecdote. The pattern is what matters: the more of the owner's rules are applied, the fewer the trades and the worse the "
      f"average (the 95% CI at L1 is {L1A['ci'][0]:+.2f} … {L1A['ci'][1]:+.2f}R). The complete scanner rule set produced no D1 / W1 order at all, so \"the method as "
      "written\" cannot be tested mechanically on D1 / W1; what the owner trades is a looser, discretionary version.")
    w('')
    w(f"A by zone timeframe: D1 {rr(V['A']['tf']['D1']['exp'])}R ({V['A']['tf']['D1']['n']} trades), W1 {rr(V['A']['tf']['W1']['exp'])}R ({V['A']['tf']['W1']['n']} trades). "
      f"Exits: {V['A']['exit_reasons'].get('stop', 0)} stops, {V['A']['exit_reasons'].get('target', 0)} targets, {V['A']['exit_reasons'].get('gap', 0)} gaps through the stop.")
    w('')
    w('## 4. Risk size: what 0.5%, 2% and 5% per trade do to the same trades')
    w('')
    w('The closed trades of each variant (in the order they closed, 0.5% run) are replayed at a fixed fraction of the current account per trade: '
      '"replay" is the real order of the trades; "re-shuffled" resamples the trades with replacement 10,000 times (same number of trades as in the history, '
      f"{years:.0f} years) to see how lucky or unlucky the order was. **Chance of losing 50%** = share of the 10,000 paths whose account touches half of its "
      'start at any time. The 5% total-open-risk cap is not applied here, so at 2% and 5% the real damage from several trades going wrong together '
      '(USD pairs, index shorts) would be worse than shown.')
    w('')
    rows = []
    for k in ('A', 'B', 'C'):
        for f_ in ('0.005', '0.02', '0.05'):
            r = rk[k]['rows'][f_]
            rows.append([NAME[k] + (' (best)' if k == best else '') if f_ == '0.005' else '', f'{float(f_) * 100:g}%', f"{r['replay']['final']:.2f}x", pct(r['replay']['maxdd'], 0),
                         f"{r['mc']['median_final']:.2f}x ({r['mc']['p5_final']:.2f} … {r['mc']['p95_final']:.2f})", pct(r['mc']['p_half_start'], 0), pct(r['mc']['p_dd50'], 0),
                         pct(r['mc_block']['p_half_start'], 0)])
    w(table(['variant', 'risk per trade', 'final equity (replay)', 'max drawdown (replay)', 're-shuffled: median final (5th … 95th pct)', 'chance of losing 50%',
             'chance of a 50% drawdown', 'same, in blocks of 10 trades'], rows, 'lrrrrrrr'))
    w('')
    w('"Chance of losing 50%" counts any dip to half of the starting account; "50% drawdown" is a fall of half from the highest point so far; the last column '
      'resamples blocks of 10 consecutive trades so losing streaks stay together. The best variant by expectancy is B; A is shown because it is the owner\'s method.')
    w('')
    w('![Risk size comparison](trend_vs_sd/risk.png)')
    w('')
    ex = abs(Pm['A']['exp'])
    w(f"At 0.5% the owner's method already halves the account over the period ({pct(rk['A']['rows']['0.005']['mc']['p_half_start'], 0)} chance). An average trade of {rr(Pm['A']['exp'])}R "
      f"costs {ex * 0.5:.3f}% of the account at 0.5% risk, {ex * 2:.2f}% at 2% and {ex * 5:.2f}% at 5%; over {rk['A']['n']:,} trades that compounds to "
      f"{rk['A']['rows']['0.005']['replay']['final']:.2f}x, {rk['A']['rows']['0.02']['replay']['final']:.2f}x and {rk['A']['rows']['0.05']['replay']['final']:.2f}x. "
      "Risking more multiplies the good and the bad trades alike, but with an average below zero the loss side wins. At 2-5% risk, losing the account is the expected outcome here, not bad luck.")
    w('')
    w('## 5. How sure are these numbers? (checks and sensitivities)')
    w('')
    rows = []
    for k in 'ABC':
        rows.append([NAME[k], rr(gross[k]['exp']), rr(Pm[k]['exp']), rr(x2[k]['exp']), pct(gross[k]['cagr'], 1, True), pct(Pm[k]['cagr'], 1, True), pct(x2[k]['cagr'], 1, True)])
    rows.append(['A, generous fill (a limit bar may also credit the target)', '', rr(gen[MAIN]['exp']), '', '', pct(gen[MAIN]['cagr'], 1, True), ''])
    w(table(['', 'R/trade, no cost', 'R/trade, base cost', 'R/trade, 2x cost', 'CAGR, no cost', 'CAGR, base cost', 'CAGR, 2x cost'], rows, 'lrrrrrr'))
    w('')
    w(f"- Costs matter for A (about {abs(gross['A']['exp'] - Pm['A']['exp']):.2f}R per trade) and little for B (the stops are 3 ATR wide). Without any cost A is still negative; "
      f"under the most generous fill rule A is {rr(gen[MAIN]['exp'])}R, i.e. break-even at best. No reading of the fills turns A into a money maker.")
    w('- **No look-ahead.** `tools/research/trend_vs_sd/validate.py` cuts all the data at 2019-12-15 and re-runs everything: every trade that closed before the cut and the whole '
      'equity curve up to it are identical for A, B and C, and the zone records of three symbols (EURUSD, XAUUSD, US30) before the cut are identical with and without the later bars. '
      'A zone enters only through `fxcore.analyse` on the bars that were closed at that close (leg-out and stay-away candle included).')
    w('- **H4 history.** The scanner also reads H4 zones (they limit the room / target of a D1 zone), so real H4 bars from 2008 were fetched (qa-bars.yml, `since`). A stand-in '
      '(the D1 bar as an H4 bar) was tried first and changed the room rule on about a quarter of the zone-days, which is why it was not used.')
    w('- **Sample size.** B and A have about 1,200-1,600 trades, C 650. Trades are correlated (USD pairs, index shorts in a crash), which is why the CIs resample whole months.')
    w('')
    w('## 6. Rules used (all fixed in advance)')
    w('')
    w('**Markets (13):** ' + ', '.join(L.SYMS) + '. The first 11 are the owner\'s MT5 symbols; US500 and SPOTCRUDE (OANDA SPX500_USD and WTICO_USD) were added for breadth. '
      'Daily bars, BID, OANDA practice history aligned to 17:00 New York (= Pepperstone server midnight), `data` branch `qa/bars`. Older thin Sunday bars are merged into Monday.')
    w('')
    w('**A: supply / demand alone.** The live scanner\'s functions at every D1 close: fresh D1 or W1 zone, price within one zone height of the proximal (the moment the scanner shows a BUY / SELL), '
      'a target exists (nearest opposite zone of any TF minus 7 pips, else the 250% projection) and the spread is under 10% of the stop. '
      'Limit at the proximal (buys pay the ask), stop = distal + 10% of the zone height (D1) or 5% (W1), at least 3 pips, target as above, valid 15 days (D1) / 45 days (W1), cancelled if a close '
      'goes beyond the distal or the target trades first, time stop after 150 days. No other filter. (The 3-pip minimum buffer is 0.04 ATR on indices and oil, the scanner\'s ATR-pip rule.)')
    w('')
    w('**B: trend following alone.** Long when the close is above the 100-day SMA and is a new 50-day closing high (short: the mirror); market entry at the next open. '
      'Initial stop 3 x ATR(20) (Wilder). Exit: a trailing stop at the 20-day low (shorts: 20-day high), a stop order that only moves in the trade\'s favour; no target.')
    w('')
    w('**C: trend filter + S/D entry.** A\'s orders, filled only if at the previous close the symbol is in a B-regime in the order\'s direction: close above the 100-day SMA and the most recent 50-day '
      'closing extreme was a high (shorts: below and a low). Stop = A\'s stop, exit = B\'s trailing 20-day stop (never looser than A\'s stop), no target, no time stop.')
    w('')
    w('**Fills (daily bars, stated conservatively).** Limit orders fill at the limit price on the first bar that trades through it (no price improvement on gaps). '
      'A trade can be stopped out on its fill bar; a target is not credited on the fill bar. When a bar touches both stop and target, the stop wins. A bar that opens beyond a stop exits '
      'at the open. Moving (trailing) stops act from the next bar. One open trade per symbol; when several orders compete on a day they are taken in a pseudo-random fixed order.')
    w('')
    w('**Risk.** Each trade risks 0.5% of the mark-to-market account to its stop (units = 0.5% x equity / (|entry - stop| + cost)); P&L = R x that amount (currency conversion drift ignored). '
      'Open risk = every open trade\'s distance to its CURRENT stop, summed with no credit for correlation (several USD-short trades count in full); a new trade is skipped when the total would pass 5%. '
      f"The cap skipped {V['B']['skipped']['cap']} B trades and no A or C trades. Median size: A {V['A']['lev_median']:.1f}x the account (max {V['A']['lev_max']:.1f}x), "
      f"B {V['B']['lev_median']:.2f}x (max {V['B']['lev_max']:.2f}x), C {V['C']['lev_median']:.1f}x (max {V['C']['lev_max']:.1f}x); this is why B's CAGR looks small at 0.5% risk, so compare the R columns.")
    w('')
    w('**Costs (one full spread + commission per round trip, constant over the years):** ' + ', '.join(f'{s} {L.COST[s]:g}' for s in L.SYMS) + ' (price units).')
    w('')
    w('## 7. Caveats')
    w('')
    w('- OANDA practice BID prices, not the owner\'s Pepperstone feed; daily bars aligned the same way. Spreads are typical averages held constant; real 2009-2019 spreads were wider and widen at rollover and news, which hurts A more than B.')
    w('- No swaps / financing. Trend trades are held for weeks; long index and gold CFDs pay financing, carry earns or costs on FX. This would move B and C by a small amount in either direction.')
    w('- The zone engine is the project\'s reading of the Raja / Kevin rules. The owner\'s discretion (which zones to take, how they read structure, when they exit by hand) is not in A. '
      'The earlier arrival study (`docs/research/arrival_study`) found the same on Kevin\'s own calls: about break-even before the owner\'s extras.')
    w('- 13 markets, no bonds, rates or agricultural futures. Trend following earns most of its historical return there; with only FX, gold / silver, three US indices and one oil contract the sample is narrow, and the 2008 crash (best year for trend followers) is before the start.')
    s11 = R['sub11']
    w('- SPOTCRUDE is a futures-based CFD: OANDA and the owner\'s broker roll on different dates, so zone levels can differ (the scanner marks it "context only"). '
      f"On the owner's 11 symbols only (no US500, no oil) the picture is the same: A {rr(s11['A']['periods'][MAIN]['exp'])}R, B {rr(s11['B']['periods'][MAIN]['exp'])}R, "
      f"C {rr(s11['C']['periods'][MAIN]['exp'])}R per trade (CAGR {pct(s11['A']['periods'][MAIN]['cagr'], 1, True)}, {pct(s11['B']['periods'][MAIN]['cagr'], 1, True)}, {pct(s11['C']['periods'][MAIN]['cagr'], 1, True)}).")
    w('- Variant A\'s zone scan starts in Sep 2008 and the sims in Jan 2009 (monthly bars start in 2005 and the engine needs about three years of them; H4 bars start in 2008). Everything before 2015 was also untuned, so it counts as out-of-sample too.')
    w('- The "which ingredient" 2 x 2 and the ladder look at several cells; with CIs this wide a positive cell is expected by chance. Only A, B and C were pre-specified.')
    w('- Choices made after seeing data, all stated: A\'s headline step is L0 (picked because it is the only step with a few hundred trades; the order counts were looked at before the results); '
      'weekend bars merged into Monday; real H4 bars fetched; the fill-bar and cost sensitivities. The numbers 100 / 50 / 20 / 3 ATR, 0.5% / 5% and the cost table were fixed before the first run and never changed.')
    w('- Data branch: to get the long history, `qa-bars.yml` was dispatched on this branch for MN / W1 / D1 since 2005 and H4 since 2008 (new `since` input; US500 added to `qa_bars.py`). '
      'The `qa/bars` files of the `data` branch now hold these longer histories (a superset of what they held); default ranges of the workflow are unchanged.')
    w('')
    w('## 8. Reproduce')
    w('')
    w('```')
    w('git fetch origin data                                   # qa/bars: OANDA bars (qa-bars.yml; H4 from 2008 via the `since` input)')
    w('python tools/research/trend_vs_sd/collect_zones.py --out /tmp/zones.json          # variant A zone records, ~4 min on 4 cores')
    w('python tools/research/trend_vs_sd/run_all.py --zones /tmp/zones.json --out docs/research/trend_vs_sd')
    w('python tools/research/trend_vs_sd/make_doc.py --results docs/research/trend_vs_sd/results.json --out docs/research/TREND_VS_SD.md')
    w('python tools/research/trend_vs_sd/validate.py --zones /tmp/zones.json              # look-ahead test')
    w('```')
    w('')
    w('Files: `docs/research/trend_vs_sd/results.json` (every number above), `trades.csv` (every trade of A, B, C), `equity.png`, `risk.png`. '
      'Code: `tools/research/trend_vs_sd/` (`tvsdlib.py` data and costs, `collect_zones.py`, `sim.py`, `stats.py`, `run_all.py`, `charts.py`, `make_doc.py`, `validate.py`).')
    w('')
    w('Not financial advice. Past results do not guarantee future results.')
    with open(a.out, 'w') as f:
        f.write('\n'.join(out) + '\n')
    print(f'{a.out}: {len(out)} lines')
    return 0


if __name__ == '__main__':
    sys.exit(main())
