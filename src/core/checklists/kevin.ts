// Kevin: same school as Raja, taught in clean English. Sources: the video course (L1-23, src/core/videoLessons.ts with
// the frame notes in src/core/mentors/kevin) and his three PDFs (src/core/course.ts: S&D, Confirmation, Set & Forget).
// Tags: "S&D PDF", "Conf PDF", "S&F PDF". A third element marks where he differs from Raja.
import type { ChecklistDef } from './index';

export const KEVIN_CHECKLIST: ChecklistDef = {
  name: 'Kevin',
  short: 'Kevin',
  tagline: 'Same approach as Raja in plain English: MTA, multiple sequence, set & forget vs confirmation, the curve.',
  stages: [
    {
      title: 'Mindset & risk rules',
      items: [
        ['Risk {1%} per trade, always, with a hard stop.', 'L18', 'Raja allows 1-2%'],
        ['Probabilities, not predictions: never trade a {prediction} against the trend.', 'L11'],
        ['Stick to one {side}: long, short or flat. Flat is a position.', 'L11'],
        ['Know your win rate, R:R and {max drawdown} before trading.', 'L16 · S&D PDF'],
        ['Judge a system over {six months}, not three losses.', 'L11 · L16'],
        ['Never move your stop {wider}.', 'S&D PDF'],
      ],
    },
    {
      title: 'Top-down: direction',
      goal: 'HTF trend first, then zones, then one timeframe higher.',
      items: [
        ['Pick {one} entry timeframe and its HTF: H1-D, H4-W, D-M (15m-H4).', 'L4 · S&D PDF'],
        ['Check the {HTF trend} first; do not start on the entry chart.', 'L12 · L13'],
        ['Trend = higher highs + a {blatantly obvious} trendline.', 'S&F PDF'],
        ['Draw a trendline only after the prior swing {high/low} is broken.', 'L5 · L14'],
        ['{Momentum lines} (steep, tiny pullbacks) are not trendlines; never draw them.', 'L5', 'Raja draws steep lines along impulses'],
        ['Trendline removed by the {first candle} closing fully, body and wick, beyond.', 'L18 · L22'],
        ['Draw the {curve} between HTF demand and supply, split at {50%}.', 'S&F PDF', 'Raja uses 25% bands'],
        ['MSA: ask why the HTF zone should hold; check the {next timeframe up}.', 'L7'],
        ['HTF sideways = {low odds}; wait for price to leave the range.', 'L20'],
      ],
    },
    {
      title: 'Find & draw zones',
      items: [
        ['Zone = {basing} + strong move away + stay away + {space}.', 'L18'],
        ['No strong {move away} = no zone.', 'S&D PDF'],
        ['Tight basing, 1-4 candles; {1-2} candles is best.', 'S&D PDF', 'Raja allows 1-6'],
        ['Distal on the {extreme wick} of the basing, wick always included.', 'L3 · L16'],
        ['Proximal on a basing candle body or wick, tight to the move.', 'L3 · S&D PDF'],
        ['Keep zones a {similar size} on one timeframe; never shrink to fit.', 'L3 · L18'],
        ['VP = DBR / RBD (reversal); CP = RBR / DBD (continuation).', 'S&D PDF'],
        ['Draw zones {before the fact}, never because price reacted there.', 'L16'],
      ],
    },
    {
      title: 'Qualify the zone',
      items: [
        ['Must break an opposing zone {OR} remove a trendline (either is enough).', 'S&D PDF · L2', 'Raja: trendline alone = inheritance, weak'],
        ['Inside a matching HTF zone, a clean zone may qualify without removing.', 'L2', 'Raja: removed nothing = weak'],
        ['Zones must be {fresh}: price has not returned yet.', 'S&D PDF'],
        ['Tested over {75%} deep = out.', 'L13'],
        ['Trade only the {nearest} ETF zone until it is removed.', 'L8'],
        ['Inside HTF demand only buys; inside HTF supply only {sells}.', 'L4'],
        ['Three CPs in a row = {overextended}: stop or cut risk.', 'L8 · L13'],
        ['Be wary of zones sitting {on a trendline} or old S/R.', 'L16', 'Raja prefers the zone nearest the trendline'],
        ['Low odds: counter-trend, near the {opposing HTF zone}, or old zone.', 'S&F PDF'],
      ],
    },
    {
      title: 'Plan: entry, stop, target, size',
      items: [
        ['Limit order just {before the proximal}, spread added.', 'L6 · S&D PDF'],
        ['Stop just beyond the {distal} with a little room.', 'L6', 'You and Raja: % of zone height beyond the distal'],
        ['Profit margin = room to the next opposing {HTF} zone.', 'S&F PDF'],
        ['High odds: 1:3+ or the opposing zone, TP always in the market.', 'S&F PDF'],
        ['No MSA zone? Risk {0.25-0.5%} instead of 1%.', 'L7'],
        ['Low odds: {0.5%} risk, 1:1 target, alert at 1:1.', 'S&F PDF'],
      ],
    },
    {
      title: 'Entry: set & forget or confirmation',
      items: [
        ['Set & forget: HTF trend {and} ETF trend agree, fresh zone.', 'S&D PDF · S&F PDF', 'Raja: S&F only on strong/arrival zones'],
        ['Embedded LTF zone formed with the HTF zone = {set & forget}.', 'L23'],
        ['Confirmation: wait until price {actually touches} the HTF zone.', 'Conf PDF'],
        ['Then on the ETF: opposing zone and/or trendline {removed}.', 'L15 · Conf PDF'],
        ['Best signal: trendline {and} zone removed. Enter on the pullback.', 'Conf PDF'],
        ['Confirm counter-trend, near-trendline, oversized or {doubtful} zones.', 'L15'],
        ['No trade into {news}; wait for spreads to settle.', 'L12'],
      ],
    },
    {
      title: 'Manage the trade',
      items: [
        ['His plan: {25%} off at 3:1, hold 75% to the HTF zone.', 'L6', 'Raja splits into two equal positions'],
        ['His plan: move the stop to {breakeven} around 2:1.', 'L17', 'Raja: never breakeven, stop stays at the zone'],
        ['Bump the stop under new {lower-timeframe} zones as price moves.', 'L6 · S&D PDF'],
        ['Remove the order if price hits the {opposing HTF zone} first.', 'L10'],
        ['Set & forget: keep only the order at the {nearest} zone.', 'L10'],
        ['Zone clearly broken: take the {loss} and move on.', 'L16'],
      ],
    },
    {
      title: 'Exit & review',
      items: [
        ['Hold toward the {opposing HTF zone} when inside a HTF zone.', 'L4'],
        ['Close sooner if an opposing zone sits close to the {target}.', 'L6'],
        ['Screenshot every timeframe; track {doubtful} zones to decide later.', 'L15 · L18'],
        ['Losing streak? Re-read your {pre-written} notes before changing anything.', 'L17'],
      ],
    },
  ],
  never: [
    ['Never buy inside HTF {supply} or sell inside HTF demand.', 'L4 · L12'],
    ['Never chase price; wait for the {pullback}.', 'L1'],
    ['Never trade a zone inside a big {messy range}.', 'L20'],
    ['Never call a zone removed by an {emotional wick}.', 'L18 · L21'],
    ['Never force a trade; {no opportunity} is a valid decision.', 'L18'],
    ['Never trade without a {hard stop}.', 'L18'],
    ['Never change the strategy after {two or three} losses.', 'L11 · L17'],
  ],
  visual: [
    ['A pause, then a big fast move away: the {footprint}.', 'L1'],
    ['Marubozu leaving the base: an {odds booster}.', 'S&D PDF'],
    ['A gap away from the base: {extreme} imbalance.', 'S&D PDF'],
    ['A stay-away candle with {space} before the proximal.', 'L18'],
    ['Steep line with tiny pullbacks: {momentum}, not a trend.', 'L5'],
    ['Obvious S/R just before your zone: a {liquidity trap} that fuels it.', 'S&D PDF'],
  ],
  notes: [
    'Where Kevin differs from Raja the bullet carries a ≠ note. You trade Raja first: when they clash, follow Raja.',
  ],
};
