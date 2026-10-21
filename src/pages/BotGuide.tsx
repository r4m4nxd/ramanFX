import { useSearchParams } from 'react-router-dom';
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
    <div className="overflow-x-auto -mx-1">
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
        <a className="btn" href="/tools/RamanFX_ZoneBot.mq4" download><Icon name="download" size={14} />RamanFX_ZoneBot.mq4</a>
        <a className="btn" href="/tools/RamanFX_ZoneVision.mq4" download><Icon name="download" size={14} />RamanFX_ZoneVision.mq4</a>
      </div>
      <Steps items={[
        <>In MT4: <b>File → Open Data Folder → MQL4</b>. Put <K>RamanFX_ZoneBot.mq4</K> in <b>Experts</b> and <K>RamanFX_ZoneVision.mq4</K> in <b>Indicators</b>.</>,
        <>Open each file in MetaEditor (F4) and press <b>F7</b> to compile. It must say <b>0 errors</b>. Warnings are fine.</>,
        <>Back in MT4, right-click <b>Navigator → Refresh</b>. Both show up under Expert Advisors and Indicators.</>,
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
          'Pending orders are cancelled if the zone breaks, price runs 80% to target first, news is near, on Friday after the cut-off, or after 100 entry-TF bars.',
          'A market order without a stop is closed immediately: there is always a stop.',
          'MT4 must stay open for management. If MT4 is closed, your SL and TP still sit at the broker.',
        ]} tone="profit" />
      </Section>

      <Section title="Key settings">
        <Table head={['Input', 'What it does']} rows={[
          ['InpMode', 'Approve (default): you confirm every order. Auto: it places orders itself. Scanner: alerts only.'],
          ['InpAggressive', 'Off by default. On = trade every legit zone it can, on every timeframe: all entry timeframes M1 to W1, set & forget AND confirmation entries, grades A, B and C (C still risks half with InpHalfRiskC), VP zones too, one order per pair per timeframe (caps raised to at least 7 per pair and 60 in total) and every timeframe scanned on each tick. The zone rules stay: chain, stay-away gap, size vs the median, fresh zones only, HTF trend / trendline bias, no overextended zones, minimum R:R, stop buffers, risk % per trade and the news filter in live trading. It does not switch Approve to Auto.'],
          ['InpGrades', 'Which grades it may advise/trade.'],
          ['InpRiskPct', 'Risk per trade, default 1% of balance. Also capped by InpMaxLots and InpMaxMarginPct.'],
          ['InpEntry', 'Set & forget, confirmation, or both.'],
          ['InpTF_M1 … InpTF_W1', 'Switch timeframes on/off (D1/W1 need more history to load).'],
          ['InpMinRR', 'Minimum reward:risk (2).'],
          ['InpMaxDistATR', 'How far a zone may be from price, in HTF ATR (2). ATR = average size of the last 14 HTF candles. A zone 2.5 x weekly ATR away needs about 3 weeks of one-way move, and price often turns first.'],
          ['InpTLSwing', 'Trendlines like Kevin draws them. A valley is REAL only when price then makes a higher high (above the last peak) before breaking it; a peak is real only when price then makes a lower low. Like your drills: the newest line runs from the previous real valley (or, if that is too flat, from the lowest point) to the newest one; the overall line runs from the very bottom (top) of the move to the real valley (peak) that keeps the others above it. The anchor moves only if a candle pokes through by more than a hair (0.05 ATR), the same as ZoneVision. Only respected lines are used. The HTF lines are drawn on the entry chart in gold, and a zone within 1 ATR of a respected line is marked “at the trendline”. N = bars each side of a swing point (2).'],
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

      <Section title="TradingView version">
        <div className="flex flex-wrap gap-2 mb-3"><a className="btn" href="/tools/RamanFX_ZoneVision.pine" download><Icon name="download" size={14} />RamanFX_ZoneVision.pine</a></div>
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
          ['Dark line', 'Newest intact trendline each way.'],
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
