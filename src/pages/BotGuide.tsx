import { Link, useSearchParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Badge, Card, cx, Page, RevealText } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-2.5">
      {items.map((x, i) => (
        <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-ink2">
          <span className="num w-6 h-6 rounded-full grid place-items-center text-[11px] font-semibold shrink-0 bg-accent/10 text-accent">{i + 1}</span>
          <span className="min-w-0 pt-0.5">{x}</span>
        </li>
      ))}
    </ol>
  );
}
function List({ items, tone }: { items: ReactNode[]; tone?: 'profit' | 'loss' | 'accent' }) {
  const dot = tone === 'profit' ? 'bg-profit' : tone === 'loss' ? 'bg-loss' : tone === 'accent' ? 'bg-accent' : 'bg-ink3';
  return (
    <ul className="flex flex-col gap-2">
      {items.map((p, i) => <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink2"><span className={cx('mt-[9px] w-1.5 h-1.5 rounded-full shrink-0', dot)} /><span className="min-w-0">{p}</span></li>)}
    </ul>
  );
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <Card><h3 className="text-[15px] font-semibold mb-3">{title}</h3>{children}</Card>;
}
function Table({ rows, head }: { rows: ReactNode[][]; head: string[] }) {
  return (
    <div className="overflow-x-auto -mx-1 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" tabIndex={0} role="region" aria-label={`Table: ${head.join(', ')}`}>
      <table className="w-full text-[13px]">
        <thead><tr className="text-left text-ink3">{head.map(h => <th key={h} className="label font-normal px-1 pb-2">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line align-top">{r.map((c, j) => <td key={j} className={cx('px-1 py-2', j === 0 ? 'font-mono text-[12px] whitespace-nowrap' : 'text-ink2')}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
const K = ({ children }: { children: ReactNode }) => <code className="font-mono text-[12px] px-1 py-0.5 rounded bg-raised">{children}</code>;

function Install() {
  return (
    <Section title="Install (both tools)">
      <div className="flex flex-wrap gap-2 mb-4">
        <Link to="/tools" className="btn-primary"><Icon name="download" size={14} />All tools (MT5 · MT4 · TradingView)<Icon name="chevronRight" size={14} /></Link>
      </div>
      <Steps items={[
        <>In MT4: <b>File → Open Data Folder → MQL4</b>. Put <K>RamanFX_ZoneBot.mq4</K> in <b>Experts</b> and <K>RamanFX_ZoneVision.mq4</K> in <b>Indicators</b>.</>,
        <>Open each file in MetaEditor (F4) and press <b>F7</b> to compile. It must say <b>0 errors</b>. Warnings are fine.</>,
        <>Back in MT4, right-click <b>Navigator → Refresh</b>. Both show up under Expert Advisors and Indicators.</>,
        <>MT5 (ZoneVision 2.13, ZoneBot 1.65): put <K>RFX_ZoneCore.mqh</K> in the <b>same folder</b> as each .mq5 that uses it (Indicators for ZoneVision, Experts for ZoneBot), then compile. Both files read the same core, so the bot and the indicator find the same zones.</>,
        <>Updating to a new version: download again, overwrite, compile, then <b>remove the bot from the chart and drag it on again</b>. MT4 keeps your old settings if you only recompile, so new defaults would not load.</>,
      ]} />
    </Section>
  );
}

function ZoneBot() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="What the bot does">
        <List items={[
          'Watches the pair of the chart it is attached to, on every timeframe from M1 to W1 (one advice per timeframe at most).',
          "Finds fresh supply and demand zones using your mentor's rules (basing, explosive move away, stay-away candle, room to the proximal line), checks the higher-timeframe trend, and grades each setup A, B or C, scored the same way as your Planner.",
          'Uses YOUR trendlines on the chart for the bias, and turns YOUR rectangles into advice.',
          'In Approve mode it never trades on its own: it alerts you, you check the chart, you press Approve or Deny.',
          'Once a trade is open it manages it: half risk at +1R, break-even at +2R, trails the stop under new zones in profit.',
        ]} tone="accent" />
      </Section>

      <Section title="Start it on a pair">
        <Steps items={[
          <>Turn <b>AutoTrading</b> on in the MT4 toolbar (the button must be green). Without it MT4 refuses every order, even the ones you approve.</>,
          <>Open the pair you want (any timeframe) and drag <b>RamanFX_ZoneBot</b> onto the chart.</>,
          <>In the <b>Common</b> tab tick <b>Allow live trading</b>. In <b>Inputs</b> keep <K>InpMode = Approve</K>. Press OK. A smiley face top-right means it is running.</>,
          <>Want another pair? Open that pair's chart and drop the bot there too. Each chart's bot handles only its own pair, its own orders and its own files.</>,
          <>Use a <b>demo account</b> until the logs prove it.</>,
        ]} />
      </Section>

      <Section title="Reading the chart">
        <Table head={['Where', 'What it shows']} rows={[
          ['Top-right', <>Bot status: mode, pending/open orders, your trendline bias ("Bias UP: your rising trendline holding"), and <b>Top skips</b>, the reasons zones were rejected. If you see no advice, read this line first.</>],
          ['Under it', <>The <b>advice panel</b>. First a <b>Refresh PAIR</b> button, then one row per timeframe (M1 → W1): <K>M15 BUY VP A78 1:3.2 trap</K> with <b>View</b>, <b>Approve</b> and <b>Deny</b>.</>],
          ['Under the panel', 'The reasoning of the advice you are viewing: zone, grade and score, HTF trend, entry method, why the stop and target sit where they do.'],
          ['On the chart', 'After View: the zone box, entry (blue), stop (red dashed) and target (green dashed) with prices.'],
        ]} />
        <div className="mt-3 text-[13px] text-ink2">Row code: timeframe · direction · <b>VP</b> (valley/peak reversal), <b>CP</b> (continuation) or <b>YOURS</b> (your rectangle) · grade and score · R:R · <b>trap</b> when a liquidity trap sits in front of the zone.</div>
      </Section>

      <Section title="The approve workflow">
        <Steps items={[
          <>The bot finds a setup and you get a <b>pop-up</b> and a <b>phone push</b>. For push: MT4 <b>Tools → Options → Notifications</b>, enter your MetaQuotes ID from the MT4 phone app.</>,
          <>Press <b>View</b>. The chart switches to that timeframe and draws the zone, entry, stop and target. The panel stays, so everything is on one screen.</>,
          <>Do your analysis: your trendline, the curve, the HTF zone, the liquidity in front.</>,
          <>Press <b>Approve</b> to place the limit order (1% risk, or 0.5% for grade C). A pop-up says <b>order placed</b>, or <b>NOT placed</b> with the reason (AutoTrading off, margin, broker error).</>,
          <>Press <b>Deny</b> to drop it. That zone is never advised again.</>,
          <>Press <b>Refresh</b> any time to rescan all timeframes of the pair now.</>,
        ]} />
        <div className="mt-3 text-[13px] text-ink2">Advice disappears on its own when its zone is broken, price reaches the entry, or price runs 80% of the way to the target first. The list is saved per pair, so it survives timeframe changes and MT4 restarts.</div>
      </Section>

      <Section title="Using your own drawings">
        <List items={[
          <><b>Trendlines</b>: the bot takes the trendline closest to price. A rising line that holds, or a falling line broken upward, means UP. The mirror cases mean DOWN. This decides the trend for all timeframes on that pair.</>,
          <><b>Rectangles</b>: draw a box on a zone. Below price it is demand (buy limit at the top line); above price it is supply (sell limit at the bottom line). The stop goes just beyond the box, and the target is the swing high or low since the box. The timeframe is the smallest one whose candles fit the box. It is advised as <b>YOURS</b> when it agrees with your trendline bias and gives at least 1:1.5.</>,
          <>Turn this off with <K>InpUseMyLines = false</K>.</>,
        ]} tone="accent" />
      </Section>

      <Section title="How it picks entry, stop and target">
        <Table head={['Part', 'Rule']} rows={[
          ['Entry', 'Limit at the proximal line (buy limit + spread, so it fills on the ask).'],
          ['Stop · CP', 'A few pips beyond the distal line.'],
          ['Stop · VP', 'Beyond the swing valley/peak of the whole drop/rally into the zone (including the leg-in wick).'],
          ['Stop buffer', 'Scaled by timeframe: M1 1, M5 1.5, M15 3, H1 5, H4 10, D1 20, W1 40 pips (× InpStopScale), never smaller than 3 pips / 3 spreads / 0.2 ATR.'],
          ['Target', 'The nearer of the recent swing high/low and the next opposing zone, capped before any fresh opposing HTF zone.'],
          ['Gate', 'R:R at least InpMinRR (2), price has pulled back from the swing, and the zone is within 2 HTF ATR of price.'],
          ['Ranking', 'If several zones qualify on one timeframe, the highest planner score wins (VP preferred) and nearer zones are favoured.'],
        ]} />
      </Section>

      <Section title="Grades (same points as the Planner)">
        <List items={[
          'Score 0–100 from: move away (A+ vs decent), base candles (1–3 best), opposing zone removed, untouched, not old, with the HTF trend, at an HTF zone, no opposing HTF zone close by, low/high in the curve, liquidity trap, confirmation or entry-TF trend, VP bonus.',
          <><b>A</b> ≥ 75 · <b>B</b> 60–74 · <b>C</b> &lt; 60 (low odds, half risk when <K>InpHalfRiskC</K> is on).</>,
          <>Only want A trades? <K>InpGrades = A only</K>. Options: All, A only, A+B, B only, C only.</>,
        ]} />
      </Section>

      <Section title="Trade management (while the bot runs)">
        <List items={[
          '+1R: stop moves to −0.5R (risk cut in half).',
          '+2R: stop to break-even (+ spread).',
          'In profit: each new same-direction continuation zone pulls the stop under its distal line.',
          'Pending orders are cancelled if the zone breaks, price runs 80% to target first, news is near (intraday entries; InpNewsIntradayOnly), on Friday after the cut-off, or after 100 entry-TF bars. Kevin best / Zones 3R use Kevin\'s rules instead (no time limit): zone broken, the move ran to the target (InpCancelRunFrac), the opposing HTF zone hit first, or the trendline lost / a nearer zone removed without ITF or HTF zone support; intraday limits are also pulled before news and re-armed after.',
          'A market order without a stop is closed immediately: there is always a stop.',
          'MT4 must stay open for management. If MT4 is closed, your SL and TP still sit at the broker.',
        ]} tone="profit" />
      </Section>

      <Section title="Key settings">
        <Table head={['Input', 'What it does']} rows={[
          ['InpMode', 'Approve (default): you confirm every order. Auto: it places orders itself. Scanner: alerts only.'],
          ['InpPreset', 'Kevin best (default): only the best setups. Entry timeframes M15, H1 and H4 only (each one still needs its InpTF_ toggle on). It trades only zones ZoneVision draws (from v1.60 the bot uses ZoneVision\'s own zone, chain, grade, notes, trendline and bias code), and only when ZoneVision says Trade: YES with grade A, or grade B on an Arrival zone (Arrival = the move away broke a trendline AND removed an opposing zone, the previous swing or made a new high / low). The HTF bias (ZoneVision\'s: HTF swings, replaced by the newest HTF trendline break) must point your way, no respected trendline between price and the zone, no overextended zones. From v1.61 also Kevin\'s: the chain must come from a removed opposing zone, a removed trendline or an all-time high / low (a swing high / low alone is not enough), no buys inside a HTF supply (no sells inside a HTF demand), no 3rd continuation zone in a row (overextended), and once the ETF trend is lost (a nearer zone removed or the ETF swings against) the zone must sit inside an ITF (or HTF) zone with that trendline holding. A zone at the proximal line of a HTF zone gets its stop about 50% into the HTF zone, and a zone inside a HTF zone targets the opposing HTF zone. The stop gets a volatility floor (InpBestStopATR), the R:R is checked again on that wider stop, and lots follow the final stop. One order per zone across all timeframes; several zones = several orders, buys and sells may run together on a pair (hedge, each with its own stop / target / break-even). The limit is placed once price is within 1 x HTF ATR of the zone, never cancelled and re-placed (only updated when the levels move more than 10% of the zone, once per candle). Kevin\'s limit-removal rules (no time rule): cancelled when the zone breaks, price runs InpCancelRunFrac of the way to the target before the fill, price hits the opposing HTF zone first, or the entry-TF trendline in the trade direction breaks (or a nearer same-direction zone is removed) and the zone is not inside an ITF or HTF zone with that trendline holding; also on price > 3 x HTF ATR away (re-armed later, max 2 times per zone), intraday limits before news, daily / weekly loss limits, the loss-streak pause, max trades per day or the Friday cut-off (those pauses do not use up one of the zone\'s 2 placements). Limited only by InpMaxOpenRiskPct (both directions) and InpMaxTradesDay. Management: nothing until +2R, then break-even plus spread and commission. Custom: exactly your own inputs below (one best zone per pair and timeframe). Aggressive: same as InpAggressive = true (which still forces it).'],
          ['InpGlobalRR', 'Global target R:R for EVERY template (Kevin best, Zones 3R, Breakout, Impulse, Custom, Aggressive); 0 (default) = each template keeps its own target. With e.g. 4 the target is the NEAREST of: entry + 4 x stop (1:4), the nearest fresh opposing zone beyond the entry on the entry timeframe or the HTF (placed just before its proximal line, spread included) and the nearest unbroken swing high (buys) / swing low (sells) beyond the entry (ZoneVision fractal, within InpLookback bars). Candidates closer than 0.5R are ignored as noise; if nothing is nearer, the 1:4 target is used. Lots are unchanged (they follow the stop). On Impulse it replaces InpImpRR (the half-close ladder still runs). Pending orders are updated to the same target. The source (RR, opp zone, HTF zone, swing) is shown in the order comment (short: RR / OZ / HZ / SW when space is tight), the chart label and the skip text.'],
          ['InpGlobalRRMinCheck', 'With InpGlobalRR > 0 (default true): skip the trade when the nearest target gives less than InpMinRR (skip text: global RR: nearest target only 1:x.x (source)). This replaces the template\'s own minimum R:R check (InpMinRR, InpBoMinRR) while InpGlobalRR is on. False = take the nearest target whatever its R:R.'],
          ['Zones 3R preset', 'InpPreset = PRESET_ZONES_3R: trades every zone ZoneVision draws on M15, H1 and H4 and labels STRONG (InpZ3Zones = Strong, default; All = also its OK / WEAK zones, shown as skip: weak zone otherwise). ZoneVision\'s grade, Trade: YES / NO, arrival and chain never block it, and with the default InpZ3Bias = false not even the bias does. The order label shows grade and strength (e.g. C STRONG). Entry InpZ3Front x zone height before the proximal, stop InpZ3StopBuf x zone height + spread beyond the distal, target fixed at InpZ3RR (default 1:3), stop to break-even at 1:1, full risk on every grade. One order per zone (several zones = several orders, buys and sells together = hedge). Skips only: zone already traded / placed twice, zone removed or its move already ran to the target, zone too small for the spread, price further than InpMaxDistATR x HTF ATR (armed when it comes closer), the capital protection limits, news / Friday. Pending limits follow Kevin\'s removal rules as in Kevin best.'],
          ['Breakout preset', 'InpPreset = PRESET_BREAKOUT (4, RamanFX_ZoneBot_Breakout.set): Kevin\'s breakout confirmation entry, to A/B test against Zones 3R. Price must have contacted a HTF zone in your direction within InpConfTouchBars entry bars (InpBoNeedHTF). On the entry timeframe (M15, H1, H4) an opposing zone sits in the way and a zone in your direction that ZoneVision draws (a proper basing structure) formed below it (above it for sells), after the HTF contact and within about one HTF zone height of it. The bot places a BUY STOP InpBoBuffer x the opposing zone height beyond its distal line (SELL STOP mirrored), stop InpBoStopBuf x the basing zone height + spread beyond the basing zone\'s distal. No basing zone = no trade. Target: the next fresh opposing zone beyond the one being broken or the opposing HTF zone, whichever is nearer, else InpBoRRCap x risk; skipped below InpBoMinRR (Kevin: breakout = higher win rate, smaller R:R, about 1.5R where the pullback gave 10R). Also skipped: an opposing HTF zone before the entry, price already through the entry, entry further than InpMaxDistATR x HTF ATR. One order per basing zone (max 2 placements), buys and sells together (hedge), capital protection as Kevin best, full risk, break-even at InpBoBE R. The stop order is cancelled when the basing zone is removed (close beyond its distal), price reaches the target without a fill, the ETF trendline breaks / a nearer zone is removed without ITF or HTF support (as for limits), news, Friday, loss limits. No time rule. Report entry type: Breakout stop (journal Entry Order: stop). Chart label: BO buy stop.'],
          ['Impulse preset', 'InpPreset = PRESET_IMPULSE (5, RamanFX_ZoneBot_Impulse.set). Your own method, not Kevin\'s. On each new M15 / H1 / H4 candle: the candle that just closed is impulsive (body >= InpImpATR x ATR(14) of the timeframe, measured before that candle; close in the outer 25% of its range in its direction) AND breaks structure (closes beyond the previous swing high / low, ZoneVision fractal with InpTLSwing bars each side, or removes an opposing zone). With InpImpBias it must not point against the HTF bias. Then a MARKET order at once, one per impulse candle. Big stop: beyond the further of the candle\'s opposite extreme and the distal of the base it left from, plus InpImpStopBuf x that distance + spread; skipped when the stop is more than InpImpMaxStopATR x ATR. Target InpImpRR x risk (0 = no fixed target, the .set default). Management: at +InpImpBE R (1R) the stop goes to break-even (spread + commission); at every +InpHalfEveryR R of the original risk (2R, 4R, 6R...) half of the remaining lots is closed (skipped if below the minimum lot) and the stop locks +(level - InpLockBackR) R (2R -> +1R, 4R -> +3R), never backwards. The remainder keeps its state under its new MT4 ticket. In the report the parts of one position count as ONE trade (P/L summed, R = sum of each part\'s R x its share of the lots). Report entry type: Impulse market (journal Entry Order: market). Capital protection, hedging and drawings as Zones 3R.'],
          ['InpBoNeedHTF / InpBoBuffer / InpBoStopBuf', 'Breakout preset (defaults true / 0.05 / 0.10): HTF zone contact required; entry this fraction of the opposing zone height beyond its distal; stop this fraction of the basing zone height + spread beyond its distal.'],
          ['InpBoMinRR / InpBoRRCap / InpBoBE', 'Breakout preset (defaults 1.5 / 3.0 / 1.0): minimum R:R; fixed target in R when no opposing zone lies beyond the one being broken; break-even trigger in R.'],
          ['InpImpATR / InpImpStopBuf / InpImpMaxStopATR', 'Impulse preset (defaults 1.5 / 0.10 / 3.0): impulse body in ATR; stop buffer as a fraction of the entry-to-extreme distance; maximum stop in ATR.'],
          ['InpImpRR / InpImpBE / InpImpBias', 'Impulse preset (defaults 3.0 / 1.0 / true; the Impulse .set uses InpImpRR = 0 = no fixed target): target in R, break-even trigger in R, skip impulses against the HTF bias.'],
          ['InpHalfEveryR / InpLockBackR', 'Impulse preset (defaults 2.0 / 1.0): close half of the remaining lots at every +2R, +4R, +6R... of the original risk (0 = off) and lock the stop at that level minus 1R.'],
          ['InpBestStopATR', 'Kevin best preset only (default 0.5): the stop sits at least this many x ATR(14) of the entry timeframe away from the entry; on gold, silver and oil also at least 0.35 x ATR(14) of the higher timeframe. The extra distance goes beyond the distal line. A zone whose R:R drops below InpMinRR on the wider stop is skipped (best: rr after vol stop).'],
          ['InpDraw', 'On by default. Draws on the chart the bot is attached to (its own symbol): exactly the zones ZoneVision draws on the chart timeframe (same boxes, names, verdict and grade, notes in the tooltip, HTF band), ZoneVision\'s trendlines (this chart + the HTF levels above, refined and de-duplicated), a short skip reason next to the latest 10 skipped zones, entry / stop / target marks with a label like A ARRIVAL H1 buy RR 3.1 risk 0.50% for every bot order of that symbol (any entry timeframe, removed once closed or cancelled), and a panel with preset, open risk, today P/L, loss streak, trades today and why trading is paused. Redrawn on a new candle or when an order changes. In the Strategy Tester it draws only in visual mode.'],
          ['InpBestRiskPct', 'Capital protection, Kevin best preset only (default 0.5): risk per trade in % of balance, used instead of InpRiskPct.'],
          ['InpMaxOpenRiskPct', 'Kevin best and Zones 3R (default 3.0): the total risk to the stop of all open and pending bot orders, buys and sells together, must stay within this % of balance, otherwise no new order (best: max open risk). A stop at break-even counts as 0.'],
          ['InpMaxTradesDay', 'Kevin best and Zones 3R (default 5): new fills per pair per UTC day. Once reached, no new orders and the other pending orders on that pair are cancelled for the day.'],
          ['InpCancelRunFrac', 'Kevin best and Zones 3R (default 1.0): an unfilled limit is cancelled once price has run this fraction of the way from the entry to the target (1 = the target was reached without us: the move happened). 0.5 = cancel at halfway. The zone is then never armed again.'],
          ['ZoneVision inputs', 'InpMinLegRatio (1.2), InpEmoATR (3.0), InpMaxZones (4), InpTLHistory (3), InpHTFLevels (4), InpRefineHTF and InpRequireQualified (= ZoneVision InpOnlyQualified) have ZoneVision\'s defaults; keep them equal in both so the bot trades exactly the zones ZoneVision shows.'],
          ['InpMaxLossStreak', 'Kevin best only (default 2): after this many losing trades in a row, no new orders until the next UTC day.'],
          ['InpDailyLossPctBest', 'Kevin best only (default 2.0): closed plus floating loss vs the balance at the start of the UTC day. Once reached, no new orders and pending orders are cancelled for the rest of the day.'],
          ['InpWeeklyLossPct', 'Kevin best only (default 4.0): the same against the balance at the start of the week (Monday UTC), for the rest of the week.'],
          ['InpDDHalfRiskPct', 'Kevin best only (default 6.0): when equity is this % below its highest point, risk per trade is halved until equity makes a new high.'],
          ['InpAggressive', 'Off by default. On = trade every legit zone it can, on every timeframe you leave ticked (InpTF_M1 to InpTF_W1, all on by default), set & forget AND confirmation entries, grades A, B and C (C still risks half with InpHalfRiskC), VP zones too, one order per pair per timeframe (caps raised to at least 7 per pair and 60 in total) and every timeframe scanned on each tick. The zone rules stay: chain, stay-away gap, size vs the median, fresh zones only, HTF trend / trendline bias, no overextended zones, minimum R:R, stop buffers, risk % per trade and the news filter in live trading. It does not switch Approve to Auto.'],
          ['InpGrades', 'Which grades it may advise/trade.'],
          ['InpRiskPct', 'Risk per trade, default 1% of balance. Also capped by InpMaxLots and InpMaxMarginPct.'],
          ['InpEntry', 'Set & forget, confirmation, or both.'],
          ['InpTF_M1 … InpTF_W1', 'Switch timeframes on/off (D1/W1 need more history to load).'],
          ['InpMinRR', 'Minimum reward:risk (2).'],
          ['InpMaxDistATR', 'How far a zone may be from price, in HTF ATR (2). ATR = average size of the last 14 HTF candles. A zone 2.5 x weekly ATR away needs about 3 weeks of one-way move, and price often turns first.'],
          ['InpTLSwing', 'Trendlines like Kevin draws them. A valley is REAL only when price then makes a higher high (above the last peak) before breaking it; a peak is real only when price then makes a lower low. Like your drills: the newest line runs from the previous real valley (or, if that is too flat, from the lowest point) to the newest one; the overall line runs from the very bottom (top) of the move to the real valley (peak) that keeps the others above it. The anchor moves only if a candle pokes through by more than a hair (0.05 ATR), the same as ZoneVision. Only respected lines are used. The HTF lines are drawn on the entry chart in gold, and a zone within 1 ATR of a respected line is marked “at the trendline”. N = bars each side of a swing point (2). These are the preset logic\'s own lines (unchanged); the arrival entries use the owner two-pivot rule (see Arrival entries).'],
          ['Arrival zone', 'The strongest zone (Kevin + your first mentor): its move away broke the trendline AND took out the previous high / low, an opposing zone or made a new high / low - usually one big candle that breaks everything and leaves an imbalance. Labelled ARRIVAL, ranked first, +8 planner points.'],
          ['InpTLBias', 'Bias from the newest higher-timeframe trendline break, the way you read it: a broken daily downtrend line = bullish for H4 / H1, a broken uptrend line = bearish. Your own drawn lines still win. Zones get +3 when price can reach them without crossing a trendline and -5 when it must break one first.'],
          ['InpBlockOverext', 'No advice for a zone beyond the 50% line of the trendline channel (overextended). Kevin buys / sells only in the golden area between the trendline and 50%. A zone whose move broke a trendline now also counts as in the chain.'],
          ['InpTesterGMT', 'Strategy Tester only: your broker server offset from GMT (usually 2, or 3 in summer), so the Friday cut-off, the Asian-session rule and the session / weekday breakdown of the report use UTC. In the tester the bot always runs AUTO on the tested pair.'],
          ['Backtest report', 'When a Strategy Tester run ends, the Journal tab shows the same KPIs as this app (win rate, net, profit factor, payoff, breakeven win rate, expectancy, R, streaks, drawdown and drawdown %, recovery factor, green / red days, Sharpe, Sortino, trader score), then a table by entry timeframe with a Best timeframe ranking (total R and expectancy, at least 10 trades), and tables by grade, entry type, side, session, weekday, hold time and R. Four files go to the tester files folder (MT4 data folder, tester, files): RamanFX_Backtest_PAIR.csv (one row per trade), RamanFX_Backtest_PAIR_KPIs.csv (overall + every group), RamanFX_Backtest_PAIR_Statement.htm and RamanFX_Backtest_PAIR_Exits.csv.'],
          ['Import a backtest', 'Drop RamanFX_Backtest_PAIR_Statement.htm into Import: it arrives as its own account (number 900000 + a fixed number per pair, named ZoneBot Backtest PAIR). Then drop RamanFX_Backtest_PAIR_Exits.csv so every trade gets its initial stop and target and the R values match the report.'],
          ['InpTesterNews', 'Strategy Tester only: use RamanFX_News.csv. Leave off unless that file holds the past news for the test period.'],
          ['InpHalfwayAlert', 'Far zones are not advised: the bot draws a gold halfway line and alerts when price gets there. Then look for a new lower-timeframe zone in the chain. Every advice shows its distance in ATR.'],
          ['InpCurveFilter', 'On = demand only in the lower third of the HTF curve, supply in the upper third.'],
          ['InpRequireQualified', 'On (default) = chain rule, the same as ZoneVision: the move away must remove an opposing zone or a trendline, make a new high/low of the lookback, or take out the previous swing high/low.'],
          ['InpMinGap', 'Space under the stay-away candle (x zone height). Less = drawable only, not traded.'],
          ['InpMinSizeVsMedian', 'Zones under this x the median zone size on the chart are skipped (too small).'],
          ['InpMetalOilStop', 'Wider stop buffer on gold, silver and oil.'],
          ['InpNewsIntradayOnly', 'News filter only for intraday entries; H4 and up ignore it.'],
          ['InpStopScale', 'Multiplies the timeframe stop buffer (1.0).'],
          ['InpSkipAsian / news / Friday', 'Session, news (RamanFX_News.csv) and Friday filters.'],
          ['InpAlerts / InpPush', 'Pop-up and phone push for new advice.'],
          ['InpUseMyLines', 'Use your trendlines and rectangles (on).'],
          ['InpZoneSource', 'MT5 v1.63, default 0 = the v1.62 zones. 1 = trade only zones that the shared ZoneVision 2.00 core (RFX_ZoneCore.mqh) also draws on the chart symbol; any other zone is skipped as core mismatch. 2 = the same plus a live cross-check with the ZoneVision export (ZoneVision input InpExportGV on that chart, same zone rules = same cfg checksum). In the Strategy Tester 2 works as 1.'],
          ['InpMinConsensus', 'Off by default (0). Skip a zone whose mentor consensus (Raja 40, Kevin 30, Seiden 20, Baker 10) is below this number (0-100).'],
          ['InpMinVerdict', 'Off by default (0). 1 = B or better, 2 = A or better, 3 = A+ only (the ZoneVision 2.00 verdict, same scale as its InpAlertMinVerdict).'],
          ['InpMinHistE / InpMinHistN', 'Off by default (0 / 30). Skip a zone when its calibrated history (RFX_Calib.csv from analyze.py) has a best expectancy below InpMinHistE R, or fewer than InpMinHistN zones.'],
          ['InpTPFromHist', 'Off by default. Target = the best R of the zone history cell x the risk, never beyond an opposing HTF zone.'],
          ['InpRiskByHist', 'Off by default. Risk x (0.5 + calibrated chance of 3R), kept between 0.5 and 1.0.'],
          ['InpEntryByLens', 'Default 0 = v1 entries. 1 = Raja: set and forget only on a strong, fresh zone, otherwise a confirmation entry is needed. 2 = Seiden: 9-10 points limit, 8 points confirmation, less = skip.'],
          ['InpUseDirection', 'Off by default. Use the ZoneVision Direction engine instead of the v1 bias: WAIT or BLOCKED = skip, REDUCED = half risk.'],
          ['InpDirTable / InpWKevin ... InpWBaker / InpUseCalWeights / InpCalFile', 'Keep these equal to ZoneVision: the Direction timeframe stack (1 = Kevin lesson 4, D1 to 1M to 3M), the consensus weights, and the calibration file. They only matter when a v2 input above is on.'],
        ]} />
      </Section>

      <Section title="Arrival entries (MT5 1.65 / MT4 1.63, off by default)">
        <div className="text-[13px] text-ink2 mb-3">The owner-approved Raja / Kevin arrival rules of Oct 2026, the same engine as the Telegram bot and ZoneVision 2.13 (its ARRIVAL zones). Both entry modes are <b>off by default</b>; the presets below switch one on for a <b>demo</b> test (AUTO mode, only the arrival entries trade, Kevin best capital protection).</div>
        <div className="flex flex-wrap gap-2 mb-3">
          <a className="btn" href="/tools/MT5_ZoneBot_ArrivalLimit.set" download><Icon name="download" size={14} />MT5_ZoneBot_ArrivalLimit.set</a>
          <a className="btn" href="/tools/MT5_ZoneBot_ArrivalRealign.set" download><Icon name="download" size={14} />MT5_ZoneBot_ArrivalRealign.set</a>
          <a className="btn" href="/tools/RamanFX_ZoneBot_ArrivalLimit.set" download><Icon name="download" size={14} />MT4 ArrivalLimit</a>
          <a className="btn" href="/tools/RamanFX_ZoneBot_ArrivalRealign.set" download><Icon name="download" size={14} />MT4 ArrivalRealign</a>
        </div>
        <Table head={['Input', 'What it does']} rows={[
          ['InpArrLimit', 'Arrival zone limit: on each new candle of an entry timeframe, a limit at the proximal of the current ARRIVAL zone (its leg-out, the departure plus up to 2 more strong candles, closed beyond that timeframe\'s trend line and removed at least one opposite zone). Stop = the stop rule below. Target = the plan: the weak zone (or the one nearest the higher-TF line), capped before an intact opposite higher-TF trend line, extended to the higher-TF zone once that line is crossed.'],
          ['InpArrRealign', 'Realignment + LTF confirmation: after an arrival, the realignment area is the weak same-TF zone nearest the higher-TF trend line. When a lower-TF arrival forms inside it (H4 to M15, D1 to H1, W1 to H4, MN to D1, H1 to M15), a limit at that lower-TF zone, stop by the stop rule on the lower TF (host = the realignment zone), target = the newest real peak (buys) / valley (sells) of the arrival timeframe.'],
          ['Stop rule', 'Entry zone inside a same-side higher-TF zone: 2 buffers beyond that zone\'s distal (but never inside the valley stop). Otherwise 1 buffer beyond the zone\'s valley / peak (the extreme of the leg-out candle, its base and the 2 candles before it). Buffer = the larger of 0.1 x ATR14 of the entry TF and the spread (InpArrSpreadPips, 0 = live spread).'],
          ['InpArrOnly', 'Only the arrival entries trade (the preset\'s own zone entries are skipped). On in the two arrival presets.'],
          ['InpArrBlockWeak', 'Off by default. The preset\'s own limit orders skip zones an arrival made WEAK (Raja: after a supply arrival no limit buys on that timeframe).'],
          ['InpArrStrongOnly / InpArrMinRR / InpArrFallbackRR', 'Only STRONG arrivals (2+ opposite zones removed); minimum R:R (2); target = N x risk when the plan has none (3).'],
          ['InpArrMarket', '0 = FX zone settings (Raja, a 7+ candle base is no zone, as the bot\'s FX scan), 1 = stocks (Raja).'],
          ['Orders', 'Comment like 5 H4 ARR buy 1:2.6 or 5 H4 RLN sell 1:3.0. One order per zone (and the bot\'s one-order-per-symbol-and-TF rule). A pending ARR / RLN limit is cancelled when its zone is no longer the live plan; break-even and the other management follow the preset.'],
        ]} />
      </Section>

      <Section title="When something is wrong">
        <Table head={['You see', 'Do this']} rows={[
          ['No advice', <>Read <b>Top skips</b> (top-right). "HTF trend unclear": draw your trendline. "too far from price" / "R:R below": loosen <K>InpMaxDistATR</K> / <K>InpMinRR</K>, or press Refresh later.</>],
          ['Approve does nothing / "AutoTrading is OFF"', 'Turn the AutoTrading button green and tick "Allow live trading" (F7 on the chart → Common).'],
          ['"NOT placed – margin"', 'Lower InpRiskPct, or the stop is very wide for the account.'],
          ['MT4 slow', 'Keep InpScansPerTick at 4 or lower, switch off M1 and W1, run the bot on fewer charts.'],
          ['Compile error', 'Send a screenshot of the MetaEditor Errors tab.'],
        ]} />
      </Section>

      <Section title="Files it writes (MQL4\\Files)">
        <List items={[
          <><K>RamanFX_Advice_PAIR.csv</K>: the open advice list and denied zones.</>,
          <><K>RamanFX_Bot_Orders.txt</K>: why each order was placed (ZoneVision shows this on the chart).</>,
          <><K>RamanFX_Bot_Signals.csv</K>: setups found and why they were taken or skipped.</>,
          <><K>RamanFX_Bot_Variants.csv</K>: replay of each filled trade with different TP and break-even rules, so you can see which works best.</>,
        ]} />
      </Section>
    </div>
  );
}

function ZoneVision() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="What ZoneVision does">
        <List items={[
          "Draws the zones exactly as the bot sees them, in your mentor's clean style: only the few closest zones, light fills, a price tag on each line.",
          'Names each zone (e.g. "Rally Base Rally Demand (CP) | B") with its grade, and marks "on S/R level (crowded)" when retail traders are piled there.',
          'Purple bars = liquidity traps: an obvious swing level in front of the zone that has not been swept yet. Price usually takes that liquidity first, which makes the zone better.',
          'Shows one intact trendline each way, the HTF zone band (yellow) and the bias, plus a 4-line panel top-left.',
          "Bottom-right: the bot's reasoning for its live orders on this pair.",
          'It never trades. It is your eyes; the bot is your hands.',
        ]} tone="accent" />
      </Section>

      <Section title="ARRIVAL zones and trend lines (MT5 2.13, MT4 2.00, TradingView Arrival)">
        <div className="text-[13px] text-ink2 mb-3">The owner-approved Raja / Kevin rules of Oct 2026, computed by the same engine as the Telegram bot (its charts and arrival alerts), so the indicator and the bot show the same arrival zones on the same candles. On TradingView they are in the companion <b>RamanFX ZoneVision Arrival</b> (the main script is at the Pine size limit).</div>
        <div className="flex flex-wrap gap-2 mb-3"><a className="btn" href="/tools/RamanFX_ZoneVision_Arrival.pine" download><Icon name="download" size={14} />RamanFX_ZoneVision_Arrival.pine</a></div>
        <Table head={['On chart', 'Meaning']} rows={[
          ['Dark line', 'Trend line: through the 2 most recent real peaks (down line, each followed by a lower low, the newer one lower) or real valleys (up line, each followed by a higher high, the newer one higher), wick to wick. A candle between the two that pokes through becomes the older anchor (wick re-anchoring). A near-flat line is no line. The line is gone once a full closed candle is beyond it. No overall line, no older lines.'],
          ['Thin red dashed line', 'Kevin\'s momentum line: a steep one-way leg with no real peak / valley. Only when there is no trend line that way, and never used as a trend line (its break is often a false breakout).'],
          ['Bold box + ARRIVAL tag', 'Arrival zone: its leg-out (the departure plus up to 2 more strong candles) closed beyond the trend line and removed at least one opposite zone. 2 or more removed = STRONG. The dotted line is the trend line it crossed.'],
          ['Dotted box with an X', 'An opposite zone the arrival removed.'],
          ['Dashed box, weak - no limit', 'After the arrival, the same-TF opposite zones are weak: no limit orders there (Raja).'],
          ['Gold box, REALIGN area', 'The weak zone nearest the higher-TF trend line: where a counter-trade is allowed, only after a lower-TF arrival inside it.'],
          ['entry / SL / TP lines', 'Entry = the zone proximal. SL = stop rule: 2 buffers beyond the same-side higher-TF zone the zone sits in, else 1 buffer beyond its valley / peak (buffer = max(0.1 x ATR14, spread)). TP capped before an intact higher-TF line (gold dotted ceiling) or extended to the higher-TF zone once that line is crossed.'],
          ['CONFIRMATION box', 'The lower-TF arrival inside the realignment area (H4 to M15, D1 to H1, W1 to H4, MN to D1, H1 to M15) with its own entry, SL and target.'],
          ['Bottom-left line', 'ARRIVAL summary: zone, SL basis, TP, realignment and confirmation status.'],
        ]} />
        <div className="mt-3"><Table head={['Input', 'What it does']} rows={[
          ['InpTLTwoPivot', 'On (default): the trend-line rule above. Off = the old lines (MT5 / MT4 only).'],
          ['InpArrShow / InpArrShowRemoved / InpArrShowWeak / InpArrShowRealign / InpArrShowPlan / InpArrShowConfirm / InpArrShowMomentum', 'Each drawing on / off (all on by default).'],
          ['InpArrAlertNew / InpArrAlertConfirm / InpArrAlertRealign', 'Alerts (push too with InpArrPush): a new arrival and a lower-TF confirmation are on, realignment area entered is off. Never fired for what is already on the chart when it loads. TradingView: Create alert, condition ZV Arrival, Any alert() function call (or one of its three alert conditions).'],
          ['InpArrMarket / InpArrSpreadPips', 'Zone settings (0 = FX, 1 = stocks) and the spread floor of the stop buffer (0 = the live spread; TradingView has no spread, so it is an input there).'],
        ]} /></div>
      </Section>

      <Section title="TradingView version">
        <div className="flex flex-wrap gap-2 mb-3"><a className="btn" href="/tools/RamanFX_ZoneVision.pine" download><Icon name="download" size={14} />RamanFX_ZoneVision.pine</a><Link to="/tools?p=tv" className="btn"><Icon name="copy" size={14} />Copy code on a phone</Link></div>
        <Steps items={[
          <>Open the file in a text editor and copy everything.</>,
          <>TradingView: <b>Pine Editor</b> (bottom) → <b>Open → New blank indicator</b> → select all, paste → <b>Save</b> → <b>Add to chart</b>.</>,
          <>Everything the MT4 bot thinks except placing orders: same zones, names, purple liquidity traps, trendlines and HTF bias (1m up to 12M), plus up to 5 <b>potential trades</b> ranked by the Planner score (A/B/C) with entry, stop, target and R:R, and a <b>Why #1</b> checklist of Sam Seiden's odds enhancers and your mentor's rules (✔ / ✘). Filter by grade, show counter-trend setups, and pick the panel corner and text size in Settings.</>,
          <>Alerts: <b>Create alert</b> → Condition <b>RamanFX ZoneVision</b> → <b>Any alert() function call</b>. You get pinged when price reaches a fresh zone with the HTF trend.</>,
          <>Differences from MT4: no HTF zone band, and it cannot read the MT4 bot's orders.</>,
        ]} />
      </Section>

      <Section title="Start it">
        <Steps items={[
          <>Drag <b>RamanFX_ZoneVision</b> (Indicators) onto any chart. It works on every timeframe and redraws when you switch.</>,
          <>Use it on the same chart as the bot: the bot panel sits top-right, ZoneVision's panel top-left and its order notes bottom-right, so nothing overlaps.</>,
          <>Keep the zone rules (<K>InpMinLegRatio</K>, <K>InpMaxBase</K>, <K>InpMaxZoneATR</K>, <K>InpLookback</K>) the <b>same as the bot</b> so both see the same zones.</>,
        ]} />
      </Section>

      <Section title="Reading it">
        <Table head={['On chart', 'Meaning']} rows={[
          ['Green box', 'Fresh demand zone. The top line is the proximal (entry), the bottom line the distal.'],
          ['Peach box', 'Fresh supply zone.'],
          ['Faded box', 'Removed zone (price closed beyond distal). Only shown if InpShowRemoved is on.'],
          ['Purple bar', 'Liquidity trap in front of the zone.'],
          ['Yellow band', 'Closest HTF zone above and below: where the bigger picture is in control.'],
          ['Dark line', 'Trend line each way through the 2 most recent real peaks / valleys (see ARRIVAL zones and trend lines above). The thin red dashed line is a momentum line, not a trend line.'],
          ['Blue / red / green lines', "The bot's planned entry, stop and target for the best setup (InpShowPlan)."],
          ['Top-left panel', 'Timeframe pair (e.g. H1 → D1), bias, structure, and what the bot is watching or waiting for.'],
          ['Bottom-right text', 'Why the bot placed its live order on this pair.'],
        ]} />
      </Section>

      <Section title="Zone names">
        <Table head={['Name', 'Type']} rows={[
          ['Rally Base Rally (RBR)', 'Demand, continuation (CP)'],
          ['Drop Base Rally (DBR)', 'Demand, valley (VP): reversal'],
          ['Drop Base Drop (DBD)', 'Supply, continuation (CP)'],
          ['Rally Base Drop (RBD)', 'Supply, peak (VP): reversal'],
        ]} />
        <div className="mt-3 text-[13px] text-ink2">Grade on the label: <b>A</b> = big move away (≥ 2.5× the base), ≤ 3 base candles, wide-range candle, left fast. <b>B</b> = solid. <b>C</b> = weak. Emotional candles (&gt; 3 ATR) are ignored when judging removal.</div>
      </Section>

      <Section title="Key settings">
        <Table head={['Input', 'What it does']} rows={[
          ['InpMaxZones', 'How many zones to draw: the N closest to price (4).'],
          ['InpShowTested / InpShowRemoved', 'Also draw tested or removed zones.'],
          ['InpShowNames', 'Zone name and grade inside the box.'],
          ['InpShowTrendlines / InpShowBrokenTL', 'Trendlines on/off, broken ones too.'],
          ['InpShowHTF', 'HTF band on/off.'],
          ['InpShowPlan', "Bot's entry/stop/target lines."],
          ['InpShowPanel', 'Top-left info panel.'],
          ['InpShowBotOrders', "Bot's reasoning bottom-right."],
          ['InpExplain', 'Labels the 4 parts of the zone (base, move away, stay-away, space). Good for learning.'],
          ['InpShowRejected', 'Debug: shows rejected candidates and why.'],
          ['InpTrapATR / InpTrapSwing', 'How close and how obvious a level must be to count as a liquidity trap.'],
          ['Colours', 'Demand/supply fill and line, trap, HTF band, text.'],
          ['InpDirEngine / InpShowDirPanel', 'MT5 2.00, on by default: the top-down Direction box under the panel (ETF, ITF, HTF and Higher+1 states, one readout such as LONG - FULL or WAIT - REALIGNING). It only reads the zones and lines; the v1 drawing does not change.'],
          ['InpDirTable', 'Timeframe stack: 1 (default) = Kevin lesson 4 (D1 to 1M to 3M, built from monthly bars), 0 = the v1 mapping, 2 = Kevin lesson 15 slide.'],
          ['InpCurveMode / InpCurveLines / InpCurveFilter', 'Raja curve between the HTF strong zones with 25 / 50 / 75 lines (default on). The filter that hides zones on the wrong side of the curve is off by default.'],
          ['InpDNA / InpLenses / InpLensTag', 'Zone DNA, the four mentor lenses and the consensus verdict A+ / A / B / C / X, shown as a small tag inside each drawn zone. Click the tag or the zone for the Mentors, DNA, History and Plans sections.'],
          ['InpWRaja / InpWKevin / InpWSeiden / InpWBaker', 'Consensus weights, default 40 / 30 / 20 / 10. Keep them equal in ZoneBot.'],
          ['InpCalFile / InpShowHist', 'RFX_Calib.csv from analyze.py --calibrate, in Terminal Common Files. With it the tag shows the history, for example 3R 64% n212.'],
          ['InpShowWOW / InpMergeOverlap / InpTheme', 'Off or neutral by default: Raja WOW target ladder, merging of overlapping zones, forced light or dark colours.'],
          ['InpAlertBreak / InpAlertDepth / InpAlertDir', 'Zone break and depth alerts (off), Direction change alert (on, never on load).'],
          ['InpExportGV / InpExportN', 'Off by default. Writes the drawn zones, Direction and history as global variables for ZoneBot (InpZoneSource = 2).'],
          ['InpDumpObjects', 'Developer check (off): writes every v1 object to a CSV so two versions can be compared byte for byte.'],
        ]} />
      </Section>

      <Section title="Daily routine with both">
        <Steps items={[
          'Open the pair. ZoneVision draws the zones; draw your trendlines (and a rectangle if you see a zone it missed).',
          'Drop the bot on the chart. Check the bias line top-right matches your read.',
          "Wait for the alert. Press View, compare the bot's plan with ZoneVision's zone and the purple trap.",
          'Approve or Deny. The bot manages the trade; ZoneVision shows why it is in.',
          'Weekly: import the bot trades into RamanFX and review them with the Planner grades.',
        ]} />
      </Section>
    </div>
  );
}

export default function BotGuide() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('t') === 'vision' ? 'vision' : 'bot';
  return (
    <Page>
      <div className="flex flex-col gap-4 max-w-[900px]">
        <Card>
          <div className="flex flex-wrap items-center gap-2 mb-2"><Badge tone="accent">MT4</Badge><Badge tone="warn">Demo first</Badge></div>
          <RevealText as="h2" className="text-[22px] font-semibold tracking-tight" text="Bot guide" />
          <p className="text-[14px] text-ink2 mt-2 max-w-[70ch] leading-relaxed">How to install and use the RamanFX ZoneBot (finds, advises and manages trades) and the ZoneVision indicator (draws what the bot sees).</p>
          <div className="flex gap-2 mt-4" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'bot'} className={tab === 'bot' ? 'btn-primary' : 'btn'} onClick={() => setSp({})}>ZoneBot</button>
            <button type="button" role="tab" aria-selected={tab === 'vision'} className={tab === 'vision' ? 'btn-primary' : 'btn'} onClick={() => setSp({ t: 'vision' })}>ZoneVision</button>
          </div>
        </Card>
        <Install />
        {tab === 'bot' ? <ZoneBot /> : <ZoneVision />}
      </div>
    </Page>
  );
}
