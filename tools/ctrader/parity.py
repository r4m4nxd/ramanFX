"""Dev check: cTrader (Pepperstone) bars vs OANDA bars for a few symbols: labels must line up, closes should be within
a few spreads. Prints a table only (no secrets). Run: python tools/ctrader/parity.py"""
import os, sys, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for p in (os.path.join(ROOT, 'fx_scanner'), os.path.join(ROOT, 'stock_scanner')):
    sys.path.insert(0, p)
os.environ.setdefault('FX_CACHE', '/tmp/fxcache_parity')
import fxcfg as C  # noqa: E402
import oanda as O  # noqa: E402
import sources.ctrader_feed as CTF  # noqa: E402

PAIRS = [('EURUSD', 'EUR_USD'), ('USDJPY', 'USD_JPY'), ('GBPJPY', 'GBP_JPY'), ('XAUUSD', 'XAU_USD'),
         ('US500', 'SPX500_USD'), ('GER40', 'DE30_EUR'), ('VIX', None), ('Soybeans', None), ('Coffee', None)]
t0 = time.time()
bad = 0
for sym, on in PAIRS:
    try:
        ct = CTF.bars(sym)
    except Exception as e:  # noqa: BLE001
        print(f'{sym}: cTrader ERROR {type(e).__name__}: {e}'); bad += 1; continue
    line = [f'{sym:9}']
    for tf in CTF.TFS:
        b = ct.get(tf) or []
        line.append(f'{tf} n={len(b)} last={b[-1].d if b else "-"}')
    print(' | '.join(line))
    if not on or not os.environ.get('OANDA_API_TOKEN'):
        continue
    for tf in CTF.TFS:
        try:
            ob, _ = O.update(on, tf)
        except Exception as e:  # noqa: BLE001
            print(f'   {tf}: OANDA error {e}'); continue
        cm = {x.d: x for x in ct[tf]}
        om = {x.d: x for x in ob}
        common = sorted(set(cm) & set(om))[-30:]
        only_ct = sorted(set(cm) - set(om))[-3:]
        only_oa = sorted(set(om) - set(cm))[-3:]
        if not common:
            print(f'   {tf}: NO COMMON LABELS ct_last={ct[tf][-1].d if ct[tf] else "-"} oa_last={ob[-1].d if ob else "-"}'); bad += 1; continue
        diffs = sorted(abs(cm[k].c - om[k].c) / om[k].c * 1e4 for k in common)
        med = diffs[len(diffs) // 2]
        print(f'   {tf}: common {len(common)} close diff median {med:.1f} bp max {diffs[-1]:.1f} bp | only cT {only_ct} | only OANDA {only_oa}')
        if med > 10:
            bad += 1
print(f'requests {CTF.STATS} in {time.time() - t0:.0f}s; problems: {bad}')
sys.exit(1 if bad else 0)
