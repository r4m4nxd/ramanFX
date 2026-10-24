// Sam Seiden: "5 years of supply and demand teaching" (src/core/mentors/seiden). Lesson numbers are the PDF page each
// article starts on (L163 = page 163), the same numbers Learn shows.
import type { ChecklistDef } from './index';

export const SEIDEN_CHECKLIST: ChecklistDef = {
  name: 'Sam Seiden',
  short: 'Seiden',
  tagline: 'The origin of the method: odds enhancers, profit margin, first return, and who is on the other side.',
  stages: [
    {
      title: 'Mindset & risk rules',
      items: [
        ['Price is the {primary} input; indicators are secondary at most.', 'L17 · L278'],
        ['Write a plan with {no discretion} left in it.', 'L42'],
        ['Risk a fixed {1%}; size from the stop distance.', 'L144'],
        ['Never change the rules because of a {loss}.', 'L102'],
      ],
    },
    {
      title: 'Top-down: direction',
      items: [
        ['Never trade from {one timeframe}: larger for direction, smaller for entry.', 'L97 · L299'],
        ['Swing: weekly or daily direction, {60-minute} entries, no smaller.', 'L260'],
        ['Uptrend: buy {demand} only. Downtrend: sell {supply} only.', 'L410'],
        ['Check the HTF {curve}: buy low on it, sell high on it.', 'L9 · L102'],
      ],
    },
    {
      title: 'Find & draw zones',
      items: [
        ['Find a strong {momentum} move, then draw its {origin}.', 'L154 · L271'],
        ['Prefer pivots (RBD, DBR) over {middle-of-move} bases.', 'L178 · L93'],
        ['Two lines around the base; the majority of trading {inside}.', 'L78 · L81'],
      ],
    },
    {
      title: 'Qualify: odds enhancers',
      items: [
        ['Score {strength} of the move away: gap > big candles > gradual.', 'L1 · L335'],
        ['Score {time} at level: fewer candles = stronger.', 'L331 · L391'],
        ['Score {freshness}: 1st return 2, 2nd 1, 3rd 0.', 'L1'],
        ['Score {profit margin}: at least {3:1} to the opposing level.', 'L1 · L163'],
        ['Score big picture: near HTF demand, low on the curve, with trend.', 'L1 · L102'],
        ['9-10 = limit order; 8 = {confirmation}; under 7 = no trade.', 'L1'],
        ['Stacked levels (another just beyond) are {stronger}.', 'L321'],
      ],
    },
    {
      title: 'Plan: entry, stop, target, size',
      items: [
        ['Entry at the {proximal} line, before price arrives.', 'L110 · L193'],
        ['Stop just beyond the {distal}, where the opposing orders sit.', 'L144'],
        ['Target 1 at {3:1}, target 2 near 5:1 or the opposing level.', 'L190 · L248'],
        ['Place entry, stop and targets together as an {OCO} bracket.', 'L125'],
      ],
    },
    {
      title: 'Entry',
      items: [
        ['Ask: {who is on the other side} of my trade?', 'L93 · L95'],
        ['Sell to novices buying {after a rally} into supply.', 'L49 · L54'],
        ['Bad news pushing price into fresh demand = a {buy}.', 'L150 · L167'],
        ['Stand aside into major {announcements} like FOMC.', 'L410'],
      ],
    },
    {
      title: 'Manage & exit',
      items: [
        ['At {3:1} move the stop to breakeven.', 'L223'],
        ['Trail on a smaller timeframe beyond each new {zone}.', 'L144'],
        ['Exit just {before} the opposing level, not at it.', 'L328'],
        ['Review average win, average loss and {win rate} regularly.', 'L42'],
      ],
    },
  ],
  never: [
    ['Never buy {after a rally} or at supply.', 'L356'],
    ['Never chase a missed {fill}.', 'L56'],
    ['Never trade at {equilibrium}, in the middle of a range.', 'L46 · L89'],
    ['Never trade a level penetrated {25%} or more.', 'L418'],
    ['Never short near HTF {demand}.', 'L163'],
  ],
  visual: [
    ['Price could not {stay} there: a pivot, a real level.', 'L87 · L95'],
    ['Empty space with no basing to the next level: {profit margin}.', 'L414'],
    ['Each return reacts less: the level is {failing}.', 'L217'],
    ['Gap into a level after a rally: {novices} arriving.', 'L104 · L108'],
    ['Shrinking distance between pivots: the {trend} is ending.', 'L295'],
  ],
  notes: [
    'Base size: L5 calls 3-6 candles ideal; later articles (L331, L335, L391) say fewer candles is stronger. The sheet uses fewer.',
    'Touches: most articles trade only the first (at most second) return; L418 keeps trading a level whose returns leave strongly.',
    'Trend filter: L193 and L201 use a moving average only to locate levels; L394 drops MAs. Price trend is used here.',
  ],
};
