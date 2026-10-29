import { useMemo } from 'react';
import { bareSymbol } from '@/core/tvSymbol';
import { useStore } from './store';

/** Your most-traded symbols (broker names, suffixes stripped), most trades first. */
export function useTopSymbols(n = 8): string[] {
  const trades = useStore(s => s.trades);
  return useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of trades) { const s = bareSymbol(t.symbol); c[s] = (c[s] ?? 0) + 1; }
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([s]) => s);
  }, [trades, n]);
}
