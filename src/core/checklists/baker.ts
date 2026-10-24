// Kevin Baker: "We Don't Need No Stinkin' Indicators" (src/core/mentors/baker, L1-14 = chapters/topics).
// Not the same person as the main mentor Kevin. Written for stocks: "a few cents" = a few ticks/pips in forex.
import type { ChecklistDef } from './index';

export const BAKER_CHECKLIST: ChecklistDef = {
  name: 'Kevin Baker',
  short: 'Baker',
  tagline: 'No indicators: grade zones on speed, freshness and time, stops beyond the zone, 3:1 to the first exit.',
  stages: [
    {
      title: 'Mindset & risk rules',
      items: [
        ['Read supply and demand from {price}, not indicators.', 'L1'],
        ['Risk {1%} or less; size from the risk, never the reverse.', 'L10'],
        ['Write the plan: symbols, timeframe, setups, minimum ratio, {hours}.', 'L12'],
        ['No more than {two or three} positions at once.', 'L8 · L14'],
      ],
    },
    {
      title: 'Timeframe & direction',
      items: [
        ['Investing: {weekly}. Swing: daily. Day: daily zones, hourly or 5m entries.', 'L6 · L7 · L8'],
        ['Swing high = supply won; swing low = demand won; tight range = {balance}.', 'L3'],
      ],
    },
    {
      title: 'Find & draw zones',
      items: [
        ['{Pivot} zone: the full high-to-low of the turning candle.', 'L4'],
        ['{Range} zone: a tight range price left dramatically.', 'L4'],
        ['{Indecision} zone: a doji halfway through a strong trend.', 'L4'],
        ['{Gap} zone: draw the gap as one big candle.', 'L4'],
        ['Too wide? Refine on the hourly; never move the {distal}.', 'L4'],
      ],
    },
    {
      title: 'Grade the zone',
      items: [
        ['Fast {out}, ideally fast in.', 'L5'],
        ['{Fresh}: look left (up to five years) for an older retest.', 'L5'],
        ['Little {time} inside: reversal few candles, range 3-6.', 'L5'],
        ['More touches = {weaker}, unlike support and resistance.', 'L5'],
        ['Opposing zone directly in the path? {Wait} for the break or skip.', 'L5'],
      ],
    },
    {
      title: 'Plan: stop, exits, size',
      items: [
        ['Stop a few cents {beyond the zone}, set before entry.', 'L11'],
        ['Three exits, one cent before each {obstacle}.', 'L10 · L11'],
        ['At least {3:1} to the first exit, or skip.', 'L10 · L14'],
        ['Shares = account risk ÷ {risk per share}, costs included.', 'L11'],
        ['Enter the {stop order} together with the entry.', 'L10'],
      ],
    },
    {
      title: 'Entry',
      items: [
        ['With trend: {rejection candle} with its wick in the zone; enter after the close.', 'L7'],
        ['Against trend: {strong} zones only, limit near the far edge.', 'L7', 'Raja confirms counter-trend zones'],
        ['A broken zone {flips} sides; trade its pullback.', 'L7 · L9', 'Raja: flip areas are weak'],
        ['Gap through a zone: wait for the opening {pullback}.', 'L9'],
        ['All-time high or low: wait for a strong {new zone}.', 'L9'],
      ],
    },
    {
      title: 'Manage & review',
      items: [
        ['Trail beyond each new {higher low} (long) on the execution chart.', 'L8'],
        ['Cut losers at the stop; {no hoping}.', 'L10'],
        ['Review every trade against the {plan}.', 'L12 · L14'],
      ],
    },
  ],
  never: [
    ['Never buy with supply {directly overhead}.', 'L5'],
    ['Never use {ATR} or volatility stops; the zone sets the stop.', 'L11'],
    ['Never widen the stop to make a trade {fit}.', 'L5'],
    ['Never fade a strong trend at a {weak} zone.', 'L7'],
  ],
  visual: [
    ['One-candle turn = faster in and out = bigger {imbalance}.', 'L2'],
    ['Merge any reversal pattern into one {hammer} or shooting star.', 'L2'],
    ['A fast falling-knife drop into strong demand: the {best} trade.', 'L8'],
    ['Tight sideways candles: {balance}, nothing to trade inside.', 'L3'],
  ],
  notes: [
    'Baker trades a broken zone from the other side and fades trends without confirmation at strong zones; Raja calls flip areas weak and confirms. Follow Raja when they clash.',
  ],
};
