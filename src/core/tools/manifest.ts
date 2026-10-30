// Every downloadable trading tool in public/tools, grouped by platform for the /tools page.
// Versions are read from each file's header (#property version / the Pine indicator title); keep them in step when a file
// is updated. manifest.test.ts fails if a file in public/tools is missing here or a listed file does not exist.

export type Platform = 'mt5' | 'mt4' | 'tv';
export type ToolFile = { file: string; note?: string };
export type PresetGroup = { title: string; note?: string; files: ToolFile[]; collapsed?: boolean };
export type Tool = {
  id: string;
  platform: Platform;
  name: string;
  version: string;
  kind: 'Indicator' | 'Expert Advisor' | 'Script' | 'Strategy';
  purpose: string;
  /** Files that must sit together (same folder) for it to compile / run. */
  files: ToolFile[];
  install: string[];
  presets?: PresetGroup[];
  /** Contextual guide in the app, if any. */
  guide?: { to: string; label: string };
  demoOnly?: boolean;
};

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'mt5', label: 'MT5' },
  { value: 'mt4', label: 'MT4' },
  { value: 'tv', label: 'TradingView' },
];

const mt5Compile = 'Open the .mq5 in MetaEditor (F4) and press F7: it must say 0 errors. Then Navigator → Refresh.';
const mt4Compile = 'Open it in MetaEditor (F4) and press F7: it must say 0 errors. Then Navigator → Refresh.';
const pineSteps = (name: string, preset = true) => [
  'Tap Copy code (or View → Copy).',
  'TradingView: Pine Editor → Open → New blank indicator → select all, paste → Save.',
  'Add to chart.',
  ...(preset ? [`Settings → Inputs: set Preset = Raja (or Custom to use every input as set). Use the same preset in every ${name} script.`] : []),
];

export const TOOLS: Tool[] = [
  // ─── MT5 ────────────────────────────────────────────────────────────
  {
    id: 'zv5', platform: 'mt5', name: 'ZoneVision', version: '2.13', kind: 'Indicator',
    purpose: 'Draws the zones, trendlines, Direction box and mentor grades exactly as the ZoneBot sees them. 2.13: the owner trend-line rule (2 most recent real peaks / valleys, wick re-anchored), ARRIVAL zones with weak zones, realignment area, stop rule, TP / ceiling and lower-TF confirmation + alerts, the same engine as the Telegram bot. Never trades.',
    files: [{ file: 'RamanFX_ZoneVision.mq5' }, { file: 'RFX_ZoneCore.mqh', note: 'shared core, same folder' }],
    install: [
      'MT5: File → Open Data Folder → MQL5 → Indicators.',
      'Put RamanFX_ZoneVision.mq5 and RFX_ZoneCore.mqh in that same folder.',
      mt5Compile,
      'Drag it onto a chart → Inputs → Load → pick a template (Raja first).',
      'Updating to 2.13: copy BOTH files again (the core changed), compile, re-attach. The ARRIVAL input group is on by default (alerts: new arrival + LTF confirmation).',
    ],
    presets: [
      {
        title: 'Templates per mentor', note: 'Indicator Inputs tab → Load.',
        files: [
          { file: 'ZV_Template_Raja.set', note: 'Raja v2.1: curve, realignment, WOW targets' },
          { file: 'ZV_Template_Kevin.set', note: 'Kevin: top-down table, trendlines decide bias' },
          { file: 'ZV_Template_Seiden.set', note: 'Sam Seiden: odds enhancers, 3:1 profit margin' },
          { file: 'ZV_Template_Baker.set', note: 'Kevin Baker: candle zones, deep entry' },
          { file: 'ZV_Template_Global.set', note: 'All four merged by your weights' },
        ],
      },
    ],
    guide: { to: '/bot-guide?t=vision', label: 'ZoneVision guide' },
  },
  {
    id: 'bot5', platform: 'mt5', name: 'ZoneBot', version: '1.65', kind: 'Expert Advisor', demoOnly: true,
    purpose: "Expert Advisor built from your mentor's rules: fresh zones with the HTF trend, 1% risk, always a stop. Needs a hedging account for the hedging presets.",
    files: [{ file: 'RamanFX_ZoneBot.mq5' }, { file: 'RFX_ZoneCore.mqh', note: 'shared core, same folder' }],
    install: [
      'MT5: File → Open Data Folder → MQL5 → Experts.',
      'Put RamanFX_ZoneBot.mq5 and RFX_ZoneCore.mqh in that same folder.',
      mt5Compile,
      'Drag it onto one chart, allow Algo Trading, Inputs → Load a preset. Demo account only.',
      '1.65: optional arrival entries (Arrival zone limit / Realignment + LTF confirmation, the bot\'s stop rule), off by default; the two Arrival presets test them on demo.',
    ],
    presets: [
      {
        title: 'Presets', note: 'EA Inputs tab → Load.',
        files: [
          { file: 'MT5_ZoneBot_KevinBest.set', note: 'Kevin best: M15 / H1 / H4, grade A' },
          { file: 'MT5_ZoneBot_Zones3R.set', note: 'Every zone ZoneVision draws, 1:3' },
          { file: 'MT5_ZoneBot_TopDown.set', note: 'Top-down variant of Zones 3R' },
          { file: 'MT5_ZoneBot_Breakout.set', note: "Kevin's stop order beyond the opposing zone" },
          { file: 'MT5_ZoneBot_Impulse.set', note: 'Market order after an impulse candle' },
        ],
      },
      {
        title: 'Arrival presets (demo)', note: 'Owner arrival rules, only the arrival entries trade.',
        files: [
          { file: 'MT5_ZoneBot_ArrivalLimit.set', note: 'Arrival zone limit, H1 / H4 / D1' },
          { file: 'MT5_ZoneBot_ArrivalRealign.set', note: 'Realignment + LTF confirmation, H4 / D1 / W1' },
        ],
      },
      {
        title: 'More presets', note: 'Strategy Tester A/B runs.', collapsed: true,
        files: [
          { file: 'MT5_ZoneBot_Test_A_Baseline.set', note: 'Baseline' },
          { file: 'MT5_ZoneBot_Test_B_ZVzones_A.set', note: 'ZoneVision zones, grade A' },
          { file: 'MT5_ZoneBot_Test_C_ZVzones_A_Direction.set', note: 'B + Direction filter' },
          { file: 'MT5_ZoneBot_Test_D_A_plus_WeeklyTrend.set', note: 'A + weekly trend' },
          { file: 'MT5_ZoneBot_Test_E_A_plus_DailyTrend.set', note: 'A + daily trend' },
        ],
      },
    ],
    guide: { to: '/bot-guide', label: 'Bot guide' },
  },
  {
    id: 'exc5', platform: 'mt5', name: 'Excursions', version: '2.00', kind: 'Script',
    purpose: 'Exact MAE / MFE for every closed position, the opening stop, how it closed and R-level touches. Import the CSV into the MAE / MFE lab.',
    files: [{ file: 'RamanFX_Excursions.mq5' }],
    install: [
      'MT5: File → Open Data Folder → MQL5 → Scripts. Put the file there.',
      mt5Compile,
      'Drag it onto any chart → OK. It saves RamanFX_Excursions.csv in MQL5\\Files.',
      'Here: Import → drop the CSV.',
    ],
    guide: { to: '/exits', label: 'MAE / MFE lab' },
  },
  {
    id: 'charts5', platform: 'mt5', name: 'Charts', version: '1.10', kind: 'Script',
    purpose: "Exports your broker's candles around every closed position so each trade replays on a real chart.",
    files: [{ file: 'RamanFX_Charts.mq5' }],
    install: [
      'MT5: File → Open Data Folder → MQL5 → Scripts. Put the file there.',
      mt5Compile,
      'Drag it onto any chart → OK. It saves a CSV in MQL5\\Files.',
      'Here: Import → drop the CSV.',
    ],
    guide: { to: '/guide#charts', label: 'How to' },
  },

  // ─── MT4 ────────────────────────────────────────────────────────────
  {
    id: 'zv4', platform: 'mt4', name: 'ZoneVision', version: '2.00', kind: 'Indicator',
    purpose: 'The v1 indicator: zones with their 4 parts labelled, trendlines, HTF zones and the trade the bot would take. 2.00: the owner trend-line rule and the ARRIVAL zones (weak zones, realignment, stop rule, lower-TF confirmation) + alerts, as MT5 2.13.',
    files: [{ file: 'RamanFX_ZoneVision.mq4' }],
    install: [
      'MT4: File → Open Data Folder → MQL4 → Indicators. Put the file there.',
      mt4Compile,
      'Drag it onto a chart.',
    ],
    guide: { to: '/bot-guide?t=vision', label: 'ZoneVision guide' },
  },
  {
    id: 'bot4', platform: 'mt4', name: 'ZoneBot', version: '1.63', kind: 'Expert Advisor', demoOnly: true,
    purpose: "Expert Advisor built from your mentor's rules. Logs every setup and a replay of every take-profit and break-even variant.",
    files: [{ file: 'RamanFX_ZoneBot.mq4' }],
    install: [
      'MT4: File → Open Data Folder → MQL4 → Experts. Put the file there.',
      mt4Compile,
      'Drag it onto one chart, tick "Allow live trading", Inputs → Load a preset. Demo account only.',
      'Updating: overwrite, compile, then remove the bot and drag it on again so new defaults load.',
    ],
    presets: [
      {
        title: 'Presets', note: 'EA Inputs tab → Load.',
        files: [
          { file: 'RamanFX_ZoneBot_KevinBest.set', note: 'Kevin best' },
          { file: 'RamanFX_ZoneBot_Zones3R.set', note: 'Every zone, 1:3' },
          { file: 'RamanFX_ZoneBot_TopDown.set', note: 'Top-down' },
          { file: 'RamanFX_ZoneBot_Breakout.set', note: 'Breakout stop order' },
          { file: 'RamanFX_ZoneBot_Impulse.set', note: 'Impulse candle' },
        ],
      },
      {
        title: 'Arrival presets (demo)', note: '1.63: owner arrival rules, only the arrival entries trade.',
        files: [
          { file: 'RamanFX_ZoneBot_ArrivalLimit.set', note: 'Arrival zone limit, H1 / H4 / D1' },
          { file: 'RamanFX_ZoneBot_ArrivalRealign.set', note: 'Realignment + LTF confirmation, H4 / D1 / W1' },
        ],
      },
    ],
    guide: { to: '/bot-guide', label: 'Bot guide' },
  },
  {
    id: 'exc4', platform: 'mt4', name: 'Excursions', version: '2.00', kind: 'Script',
    purpose: 'MAE / MFE, how each trade closed and R-level touches (MT4 does not store the opening stop).',
    files: [{ file: 'RamanFX_Excursions.mq4' }],
    install: [
      'MT4: File → Open Data Folder → MQL4 → Scripts. Put the file there.',
      mt4Compile,
      'Drag it onto any chart → OK. It saves a CSV in MQL4\\Files.',
      'Here: Import → drop the CSV.',
    ],
    guide: { to: '/exits', label: 'MAE / MFE lab' },
  },
  {
    id: 'charts4', platform: 'mt4', name: 'Charts', version: '1.10', kind: 'Script',
    purpose: "Your broker's candles around every closed trade, so each trade replays on a real chart.",
    files: [{ file: 'RamanFX_Charts.mq4' }],
    install: [
      'MT4: File → Open Data Folder → MQL4 → Scripts. Put the file there.',
      mt4Compile,
      'Drag it onto any chart → OK. It saves a CSV in MQL4\\Files.',
      'Here: Import → drop the CSV.',
    ],
    guide: { to: '/guide#charts', label: 'How to' },
  },

  // ─── TradingView ────────────────────────────────────────────────────
  {
    id: 'zvtv', platform: 'tv', name: 'ZoneVision', version: '2.13', kind: 'Indicator',
    purpose: 'Port of the MT5 ZoneVision: same zones, trendlines (2.13: the owner two-pivot rule), HTF trend, mentor lenses, potential trades and alerts. ARRIVAL zones: add ZoneVision Arrival.',
    files: [{ file: 'RamanFX_ZoneVision.pine' }],
    install: pineSteps('ZoneVision'),
    guide: { to: '/bot-guide?t=vision', label: 'ZoneVision guide' },
  },
  {
    id: 'zvdirtv', platform: 'tv', name: 'ZoneVision Direction', version: '2.13', kind: 'Indicator',
    purpose: 'Companion of ZoneVision: the top-down Direction box, Raja curve 25 / 50 / 75, the WOW ladder and Direction alerts.',
    files: [{ file: 'RamanFX_ZoneVision_Direction.pine' }],
    install: pineSteps('ZoneVision'),
  },
  {
    id: 'zvarrtv', platform: 'tv', name: 'ZoneVision Arrival', version: '2.13', kind: 'Indicator',
    purpose: "Companion of ZoneVision: the owner ARRIVAL rules (the Telegram bot's engine) - arrival zone, the zones it removed (X), weak zones, realignment area, stop rule, TP / ceiling, lower-TF confirmation, momentum line, 3 alert conditions.",
    files: [{ file: 'RamanFX_ZoneVision_Arrival.pine' }],
    install: [
      ...pineSteps('ZoneVision', false),
      'With RamanFX ZoneVision on the same chart, switch this one\'s trend lines off (Inputs: This TF\'s two trend lines) - ZoneVision draws them.',
      'Alerts: Create alert → Condition ZV Arrival → Any alert() function call (or one of its 3 conditions).',
    ],
    guide: { to: '/bot-guide?t=vision', label: 'ZoneVision guide' },
  },
  {
    id: 'stratv', platform: 'tv', name: 'Zone Strategy', version: '1.1', kind: 'Strategy',
    purpose: 'Automatic backtest of the ZoneVision / ZoneBot zone rules in the Strategy Tester (no trendline checks). 1.1: optional Entry mode Arrival zone limit / Realignment + LTF confirmation (the bot\'s arrival engine and stop rule), off by default.',
    files: [{ file: 'RamanFX_ZoneStrategy.pine' }],
    install: [
      'Tap Copy code (or View → Copy).',
      'TradingView: Pine Editor → Open → New strategy → select all, paste → Save.',
      'Add to chart, then open the Strategy Tester tab.',
    ],
  },
];

/** In-app tools (not downloads). */
export const IN_APP: { to: string; label: string; hint: string }[] = [
  { to: '/calculator', label: 'Calculator', hint: 'Lot size, pip value, R:R' },
  { to: '/risk', label: 'Risk rules', hint: 'Daily loss and trade limits' },
  { to: '/exits', label: 'MAE / MFE lab', hint: 'Import the Excursions CSV' },
  { to: '/practice', label: 'Sandbox', hint: 'Blind chart tests and drills' },
  { to: '/scanner', label: 'Stock scanner', hint: 'Daily S&P 500 zone scan (Raja rules), also sent to Telegram' },
];

export const toolUrl = (file: string) => `/tools/${file}`;
export const isPine = (file: string) => file.endsWith('.pine');
export const allToolFiles = () => [...new Set(TOOLS.flatMap(t => [...t.files, ...(t.presets ?? []).flatMap(p => p.files)].map(f => f.file)))];
