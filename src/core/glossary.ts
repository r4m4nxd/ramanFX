// Glossary of supply-and-demand terms used across the mentors and the bot.
// Source: docs/Combined_Rulebook.md, section 5. Mentor tags show who the definition cites.
export type GlossaryMentor = 'kevin' | 'seiden' | 'baker' | 'raja' | 'bot';
export interface GlossaryTerm { term: string; definition: string; mentors?: GlossaryMentor[] }

export const GLOSSARY: GlossaryTerm[] = [
  {"term": "All Star", "definition": "Seiden: S/D level + Bollinger Band pierce + trend context + margin; T1 = the BB midline", "mentors": ["seiden"]},
  {"term": "Arrival (Seiden)", "definition": "How price comes back: sharp and base-free = good; stair-step = bad", "mentors": ["seiden"]},
  {"term": "Arrival zone", "definition": "Kevin / drill: a zone that broke a trendline AND took out a high / low or a zone: the strongest", "mentors": ["kevin"]},
  {"term": "Base / basing", "definition": "The short pause (1-6 candles) before the move away. Candle body < 50% of its range = a basing candle (bot)", "mentors": ["bot"]},
  {"term": "Breakout entry", "definition": "A stop order through a level. Kevin: beyond the removed opposing zone. Seiden: prefers the return to the origin", "mentors": ["kevin", "seiden"]},
  {"term": "Bull / bear trap", "definition": "Seiden: a breakout above an obvious high (e.g. the Globex high) into fresh supply, which is sold", "mentors": ["seiden"]},
  {"term": "Chain / qualification", "definition": "Kevin: a zone counts only if its move removed an opposing zone or a trendline, or made an all-time high / low", "mentors": ["kevin"]},
  {"term": "Confirmation entry", "definition": "Wait for proof at the zone. Kevin: an opposing ETF zone / trendline removed. Seiden: a leave-the-zone trigger. Baker: a rejection candle", "mentors": ["kevin", "seiden", "baker"]},
  {"term": "Curve", "definition": "Where price sits between the HTF demand and the HTF supply (0-100%). Buy low, sell high; the middle is equilibrium"},
  {"term": "DBR / RBD", "definition": "Drop-Base-Rally (demand) / Rally-Base-Drop (supply): reversal zones, also called VP (valleys and peaks)"},
  {"term": "Distal line", "definition": "The far edge: the extreme wick of the base / leg. The stop goes just beyond it"},
  {"term": "Emotional candle", "definition": "A candle with range > 3 × ATR; its wick does not test or remove a zone (bot)", "mentors": ["bot"]},
  {"term": "Equilibrium", "definition": "Balanced trading: no edge"},
  {"term": "ETF / ITF / HTF", "definition": "Entry / intermediate / higher timeframe (e.g. 15m / H1 / H4)"},
  {"term": "Flip / polarity", "definition": "A broken zone that switches side (old supply → new demand)"},
  {"term": "Fresh / tested", "definition": "Fresh = not revisited since it formed. Tested = price returned to the proximal"},
  {"term": "Initial profit margin / run-out", "definition": "How far price ran from the zone before it first came back (Seiden's qualifying rule: ≥ 3 × the zone height)", "mentors": ["seiden"]},
  {"term": "Leg-in", "definition": "The move *into* the base. Fast is better (Baker)", "mentors": ["baker"]},
  {"term": "Leg-out / move away / departure", "definition": "The move *out* of the base. Its strength (legRatio, gap, big bodies) shows how big the imbalance was", "mentors": ["bot"]},
  {"term": "Levels on top of levels", "definition": "Two same-side zones stacked together (Seiden: stronger; Kevin: ~50/50)", "mentors": ["kevin", "seiden"]},
  {"term": "Liquidity trap", "definition": "An obvious S/R just before the zone, where retail stops sit and fuel the reaction"},
  {"term": "Look left", "definition": "Check older price for opposing levels (margin) or an older zone under the base (origin freshness)"},
  {"term": "Motion into mass", "definition": "Seiden: each visit fills resting orders, so the level weakens until it breaks", "mentors": ["seiden"]},
  {"term": "Novice / two mistakes", "definition": "Buying after a rally AND into supply (a third mistake: against the trend). The S/D trader takes the other side"},
  {"term": "Odds enhancer", "definition": "A scored factor that raises the probability of a level (Seiden's sheet; bot ZScore 0-15)", "mentors": ["seiden", "bot"]},
  {"term": "Overextended / golden area", "definition": "Kevin's channel: from the trendline to its 50% line = golden; beyond 50% = overextended", "mentors": ["kevin"]},
  {"term": "Parity rule", "definition": "Repo rule: ZoneBot must trade exactly the zones ZoneVision draws, so drawing changes go into both", "mentors": ["bot"]},
  {"term": "Penetration depth", "definition": "How far a return went into the zone (0-100%). Seiden: ≥ 25% = done; Kevin: > 75% = void", "mentors": ["kevin", "seiden"]},
  {"term": "Pivot vs cluster", "definition": "Seiden: a pivot (price could not stay) is a strong level; a cluster (long sideways block) is weak", "mentors": ["seiden"]},
  {"term": "Profit margin", "definition": "Room from the entry to the nearest opposing level, in R"},
  {"term": "Proximal line", "definition": "The zone edge price reaches first: the top of demand, the bottom of supply. Usually the base body edge; the limit order sits just before it"},
  {"term": "R, BE, MFE / MAE", "definition": "R = initial risk. BE = stop moved to entry (+ costs). MFE / MAE = max favourable / adverse excursion of a trade"},
  {"term": "RBR / DBD", "definition": "Rally-Base-Rally (demand) / Drop-Base-Drop (supply): continuation zones, also called CP"},
  {"term": "Removed", "definition": "A candle body (close) beyond the distal: the zone is void"},
  {"term": "Set & forget", "definition": "Pending limit with stop and target placed in advance, then left alone"},
  {"term": "Space / gap (Kevin)", "definition": "The distance between the stay-away candle and the proximal; small = drawable only (InpMinGap)", "mentors": ["kevin", "bot"]},
  {"term": "Stay-away candle", "definition": "The candle after the leg-out that does not come back to the proximal (Kevin's 3rd part)", "mentors": ["kevin"]},
  {"term": "X-ray", "definition": "Seiden: inspect a big HTF zone on lower TFs to find its proximal / distal sub-levels", "mentors": ["seiden"]},
];

export const GLOSSARY_MENTOR_LABEL: Record<GlossaryMentor, string> = { kevin: 'Kevin', seiden: 'Seiden', baker: 'Baker', raja: 'Raja', bot: 'Bot' };
