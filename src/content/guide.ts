// The in-app Guide (/guide): every feature, the Telegram bot, the automatic messages, data, keys and fixes.
// One data file so it is easy to keep current. Plain words, short lines, Calgary clock.
// src/content/guide.test.ts fails when a command in supabase/functions/telegram-bot/commands.json has no row here.
// Secret NAMES only, never values.
//
// Calgary time: Alberta stays on UTC-6 all year from 2026-11-01. New York is 1 h ahead in US winter (Nov-Mar)
// and 2 h ahead in US summer (Mar-Nov), so every New York time shows as "winter (summer)".

import type { IconName } from '@/ui/Icon';

export interface GuideItem {
  /** Anchor: /guide#<id>. Unique across the whole guide. */
  id: string;
  title: string;
  /** Time label for schedule rows (Calgary clock). */
  when?: string;
  body?: string;
  steps?: string[];
  points?: [string, string][];
  /** App link (route). */
  to?: string;
  /** Telegram command, without the slash (the sync test reads it). */
  cmd?: string;
  /** What to type. */
  example?: string;
  /** What you get back. */
  get?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  icon: IconName;
  intro: string;
  /** 'commands' renders the items as a command table. */
  kind?: 'commands';
  items: GuideItem[];
}

export const APP_URL = 'https://raman-fx.vercel.app';

export const GUIDE: GuideSection[] = [
  // ── 1 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'start', title: 'Start here', icon: 'sparkles',
    intro: 'RamanFX = this app (journal, planner, scanners, lessons) + a Telegram bot that scans, alerts and coaches you. Everything runs by itself; you only read, decide and log.',
    items: [
      { id: 'what', title: 'The 3 parts',
        points: [
          ['App', 'raman-fx.vercel.app. Journal, planner, reports, stock + forex scanners, lessons, Ask, market hours. Phone and PC stay in sync when signed in.'],
          ['Telegram bot', 'Type a command or just a symbol (EURUSD, XAUUSD, NVDA). Pushes scans, alerts, the morning brief and coach messages.'],
          ['Robots in the background', 'GitHub Actions run the scanners, brief, reminders and big moves. Supabase runs the bot and the trader coach.'],
        ] },
      { id: 'first', title: 'If you forgot everything',
        steps: [
          'Open Telegram, send /help (all commands) or /guide (short cheat sheet + link here).',
          'Send a symbol, e.g. EURUSD: zones on every timeframe, price, signals, buttons for chart / scan / news.',
          'Open the app: Dashboard for today, Planner before a trade, Journal after.',
          'Search this page (box at the top) for any word: chart, alert, key, 401, quiet…',
        ] },
      { id: 'share', title: 'Sharing with family',
        steps: [
          'Your brother (or anyone) opens Telegram, finds @rfxscannerbot and sends /start. The bot answers with his ID (a number).',
          'He sends you that number.',
          'You send the bot: /adduser <his ID> <Name>, e.g. /adduser 123456789 Rohan. He gets a welcome message and the command keyboard.',
          'He gets the market messages for stocks only to start; he changes it with /markets (crypto, forex & metals, indices). /adduser <ID> <Name> all = every market.',
          'He can use every market command (/stocks, /zones, /chart, /scan 3 an hour, /alert, /mute, /quiet…) with his own alerts and settings. Your journal, positions, alerts, watch list, coach and /health stay private.',
          '/users lists who has access (max 5) · /removeuser <ID> takes it away. Someone who blocks the bot is switched off by itself.',
        ] },
      { id: 'install', title: 'Install the app on your phone',
        body: 'iPhone: Safari → Share → Add to Home Screen. Android: Chrome menu → Install app. In Telegram: the Menu button (bottom left of the bot chat) opens the app as a Mini App. After an update, close and reopen it.' },
      { id: 'clock', title: 'Times are Calgary time',
        body: 'Alberta stays on UTC-6 all year from Nov 1, 2026. New York is 1 h ahead in US winter (Nov–Mar), 2 h in US summer. In this guide "7:30 AM (6:30)" means winter (summer).' },
      { id: 'not-advice', title: 'Signals are a shortlist, not orders',
        body: 'Every scan is rule-based. Check the level on your Pepperstone chart (ZoneVision) before placing anything. Our own forex research on the mechanical rules was negative after costs.' },
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'daily', title: 'Daily routine', icon: 'clock',
    intro: 'What arrives in Telegram and when (Calgary clock, winter time first, US summer in brackets). Quiet hours make alerts silent.',
    items: [
      { id: 'd-brief', when: '6:00 AM weekdays', title: 'Morning brief',
        body: 'Yesterday\'s biggest candles (forex, metals, indices, stocks) with zone context, today\'s high-impact events and the busy window, Kevin\'s newest daily plan, overnight headlines, headlines for your held / watched symbols, earnings today or next weekday. Sent once, 5:55 to ~6:45, never after 7:30. Skipped on weekends and NYSE holidays.' },
      { id: 'd-lesson', when: 'right after the brief', title: 'Lesson of the day',
        body: 'A short lesson from the mentors with an [Open lesson] button. Rotates through all lessons, never repeats until all are used.' },
      { id: 'd-reminders', when: '6:45 AM (5:45) · 12:30 PM (11:30)', title: 'Event reminders',
        body: 'NFP and CPI days: 45 min before the 8:30 AM New York release (7:30 AM Calgary winter, 6:30 summer). Fed decision days: 30 min before the 2:00 PM New York statement (1:00 PM winter, 12:00 summer). A daily nudge only if the repo variable REMINDER_DAILY is on.' },
      { id: 'd-open', when: '7:30 AM (6:30) · 8:30 AM (7:30)', title: 'US data, then NYSE opens',
        body: 'Busiest window for forex, gold and indices is 7:00–11:00 AM (6:00–10:00). /times shows today\'s exact list.' },
      { id: 'd-fx', when: 'every hour, ~5–25 min past', title: 'FX scan (hourly)',
        body: 'After every H1 close in the forex week (Sunday 4 PM (3 PM) → Friday 4 PM (3 PM)). Sends a message only when something is new: a new BUY / SELL / WATCH, a fill, a cancel, a price alert. Nothing new = no message.' },
      { id: 'd-h4', when: 'every 4 h: 12 AM, 4, 8, 12 PM, 4, 8 (1 h earlier in summer)', title: 'FX H4 digest',
        body: 'One compact message per new H4 candle: counts and the top 5 watchlist instruments in / near a located zone, or "No new setups".' },
      { id: 'd-movers', when: 'hourly, ~:05 (every day: crypto)', title: 'Big moves (1W · 1D · 4H · 1H)',
        body: 'ONE message an hour at most, when a candle that just closed was 2× its 20-candle average range (and a minimum %). Sections highest first: 🟪 1W (Friday 3 PM), 🟦 1D (3 PM; crypto 6 PM, the UTC day), 🟩 4H (forex grid), ⬜ 1H; under each Forex & metals / Indices & commodities / Crypto / Stocks, every mover one line ("▲ GBPJPY +1.2% · 2.6× · into D1 supply"). Stocks: 1H 7 AM–5 PM New York, 1D + Friday 1W with the 3 PM message (gaps ≥ 3% and big bodies too), no 4H. Past 8 per group "+N more → app" (Big moves page). 4H / 1D / 1W found in quiet hours arrive when they end.' },
      { id: 'd-breaking', when: 'any time (checked every 10 min)', title: 'Breaking news',
        body: 'A fresh headline tagged with a symbol on your /watch list or an open journal position. Max 1 per symbol per 3 h and 6 a day, muted symbols skipped, held back during quiet hours (lands in the 6 AM brief). Plain FX pairs have no tag, so none for them; gold / US indices / oil go through their ETF.' },
      { id: 'd-stocks', when: '3:30 PM (2:30) weekdays', title: 'Stock scan',
        body: '30 min after the US close. Today\'s BUY / WATCH at fresh demand, exit warnings for your holdings, the watchlist. A retry 3 h later if the first run was missed.' },
      { id: 'd-daily', when: '~4:05 PM (3:05)', title: 'FX daily summary',
        body: 'With the first scan after the daily candle closes (5 PM New York).' },
      { id: 'd-fund', when: '~5:00 PM (4:00) weekdays', title: 'Fundamentals refresh (silent)',
        body: 'Rates, CPI, GDP, unemployment, SEC numbers and earnings dates for /fund. No message.' },
      { id: 'd-coach', when: 'when you trade', title: 'Trader coach',
        body: 'Rule guard, 30-min cooling-off pause, "why did you take it?" prompts. See Alerts & messages.' },
      { id: 'd-week', when: 'Sunday 6:00 PM', title: 'Weekly report card',
        body: 'Mon–Sun: trades, win rate, net R, rules followed %, most expensive habit, best / worst setup, [Open journal].' },
      { id: 'd-weekend', when: 'weekends', title: 'Crypto only',
        body: 'Forex is closed, crypto trades 24/7: a crypto-only scan runs after each new crypto H1 candle.' },
      { id: 'd-you', title: 'Your own loop',
        steps: [
          'Before: read the brief, /times, Dashboard checklist. Map zones in Planner → Zone watchlist.',
          'Setup touches: Planner → New plan. NO TRADE / LOW / HIGH odds and the order ticket.',
          'Took it: /took EURUSD buy 1.0850 sl 1.0820 tp 1.0910 (or plan it in the app). Reply to the 📝 prompt with why.',
          'After: import the MT5 report, read the Daily journal, fix what the verdicts flagged.',
          'Weekly: Sunday report, Reports → Strategy, MAE / MFE lab.',
        ] },
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'app', title: 'App features', icon: 'dashboard',
    intro: 'Every page in the menu, what it is for and the one thing to remember. Tap "Open" to go there.',
    items: [
      { id: 'a-dashboard', title: 'Dashboard', to: '/',
        body: 'Today strip (CLEAR / CAUTION / STOP TRADING from your risk rules), pre-session checklist, rule of the day, KPIs, equity curve, P&L bars, trader score (from 20 trades).' },
      { id: 'a-planner', title: 'Planner', to: '/plan',
        body: 'Grade a setup before risking money: Setup → Zone → Context → Levels → Verdict. NO TRADE (a hard rule failed), LOW odds (max 0.5% risk, 1:1 target) or HIGH odds, with an order ticket.',
        points: [['Zone watchlist', 'Waiting → Touched → Order placed → Invalid. "Plan it" opens the Planner pre-filled.'], ['Plan status', 'Planned → Waiting → Touched → Order placed → In trade, or skip / missed. Imports link trades to plans automatically.'], ['From Telegram', '/took adds a plan here after the app syncs.']] },
      { id: 'a-journal', title: 'Daily journal', to: '/journal',
        body: 'One card per day (or week): running P&L, rules kept, "What the day says" (only facts the numbers prove), the trades and your day review (saves as you type). Notes you reply to the coach\'s 📝 prompt land here.' },
      { id: 'a-import', title: 'Import trades',
        steps: ['MT5: Toolbox → History → right-click → Report → HTML (or Open XML).', 'App: Import (top right), drop the file. Re-importing is safe: matched by position ID.', 'Optional: RamanFX_Excursions.csv (MAE / MFE) and RamanFX_Bars.csv (trade charts), from the scripts on Tools.'],
        body: 'Set the broker server clock once in Settings → Time zone (most MT5 brokers: GMT+2 winter / GMT+3 summer).' },
      { id: 'a-trades', title: 'Trades & trade page', to: '/trades',
        body: 'Filter every trade. A trade page has the Guru verdict, a candle chart from your own broker data, screenshots (paste / drop), notes, tags, mistakes, grade and drawings.' },
      { id: 'charts', title: 'Trade charts (MT5 / MT4 script)', to: '/tools',
        body: 'Every trade on candles from your own broker: entry, exit, stop, target and plan zone drawn exactly.',
        steps: ['Download RamanFX_Charts.mq5 (or .mq4): link on any trade page or Tools.', 'MT5: File → Open Data Folder → MQL5 → Scripts, put it there, refresh the Navigator, drag it onto any chart → OK.', 'Import the RamanFX_Bars.csv it saves (MQL5\\Files). Re-run after new trades, in each terminal you trade from.', 'Open any trade: the chart sits under the verdict. Signed in, the candles sync to your phone.'] },
      { id: 'a-reports', title: 'Reports, P&L calendar, heat maps', to: '/reports',
        body: 'Reports: overview, strategy parts, time, setups, symbols, R. Calendar (/calendar): days coloured by P&L, press and hold a day. Heat maps (/heatmaps): day × hour, symbol × session.' },
      { id: 'a-exits', title: 'MAE / MFE lab', to: '/exits',
        body: 'How far trades went against / for you and what other management would have made. Needs RamanFX_Excursions.csv (script on the page).' },
      { id: 'a-zones', title: 'Zone scorecard', to: '/zones',
        body: 'Import a ZoneVision research CSV from MT5: which zone types paid (Raja types, curve, room). Stored on this device only. Read the "before trusting a number" note.' },
      { id: 'a-guru', title: 'Guru (coach)', to: '/guru',
        body: 'Streak mode after 3 losses (half risk, high odds only), odds drill, your discipline stats, realistic returns, the playbook library.' },
      { id: 'a-playbook', title: 'Playbook, Strategies, Risk rules', to: '/playbook',
        body: 'Playbook: ETF / ITF / HTF alignment matrix and checklist. Strategies (/strategies): results per rule set. Risk rules (/risk): daily loss, trades per day, losses in a row, cooldown, risk %. The Telegram coach reads these same rules.' },
      { id: 'a-calc', title: 'Calculator', to: '/calculator',
        body: 'Position size, pip value, P&L, R:R, margin, Monte Carlo, drawdown, prop firm, options, compounding, pivots / Fib, currency, 230+ instruments.' },
      { id: 'a-scanner', title: 'Stock scanner', to: '/scanner',
        body: 'Daily US + Canadian (US listings) stock scan by the Raja rules: BUY / WATCH at fresh demand, sort by Raja, Seiden, nearest or R:R, exit warnings for holdings, a starred watchlist (this device). Tap a stock for its page with every zone. Updated once a day after the close.' },
      { id: 'a-fx', title: 'Forex scanner', to: '/scanner/fx',
        body: 'Stocks | Forex switch on the scanner page. Signals, market map, every pair\'s zones MN → H1. Updated by the hourly scan; prices from OANDA, names and links Pepperstone.' },
      { id: 'a-moves', title: 'Big moves', to: '/moves',
        body: 'Every big candle of the latest 1W / 1D / 4H / 1H closes, all of them (Telegram shows the top 8 per group): % move, × its normal range, zone context, the "why" headline. The "+N more → app" link opens the right timeframe.' },
      { id: 'a-insiders', title: 'Insider buys', to: '/insiders',
        body: 'SEC Form 4 open-market buys: 2+ insiders buying the same stock within 14 days (3+ = strong) or one CEO / CFO buy of $250k+, last 30 days, with the scanner\'s zone, trend, P/E and earnings. ⭐ = strong cluster at a weekly / monthly demand. Updated every 30 min on US weekdays; Telegram alerts new ones (score 5+, at most 6 a day).' },
      { id: 'a-hours', title: 'Market hours', to: '/market-hours',
        body: 'Best Calgary times and weekdays for every pair and stock, from full history: busiest half-hours, weekdays, news days vs normal days, has it changed. Same data as /hours in Telegram.' },
      { id: 'a-chart', title: 'Advanced chart & news', to: '/chart',
        body: 'Live TradingView chart on the Pepperstone feed (drawings are not saved: keep zone prices in the zone watchlist). Economic news (/news page): calendar, headlines, currency strength.' },
      { id: 'a-learn', title: 'Lessons', to: '/learn',
        body: 'Every mentor lesson as notes: Kevin\'s course, his Sunday Zoom sessions and daily pre-session plans, Raja, Sam Seiden, Kevin Baker, plus the glossary. Mark done, diagrams, quizzes.' },
      { id: 'a-listen', title: 'Listen to a lesson', to: '/learn',
        body: 'The Listen bar on a lesson plays the recorded narration (streamed from your Google Drive, signed in only) or reads aloud with the device voice or the Natural (Kokoro) voice made on your phone. Speed, skip, chapters, lock-screen controls, resumes where you stopped.' },
      { id: 'a-checklist', title: 'Checklist', to: '/checklist',
        body: 'Cradle-to-grave trade checklist per mentor: Check, Memorize (reveal or key words), Read. Save as PDF.' },
      { id: 'a-ask', title: 'Ask your mentors', to: '/ask',
        body: 'Search every lesson by meaning, on your device. You get the mentors\' own words and a link to the lesson; nothing is made up. Same as /ask in Telegram.' },
      { id: 'a-practice', title: 'Sandbox', to: '/practice',
        body: 'Blind chart tests, drawing tools and pattern drills.' },
      { id: 'a-tools', title: 'Tools & Bot guide', to: '/tools',
        body: 'Every MT5 / MT4 / TradingView download (ZoneVision, ZoneBot, chart and excursion scripts) with presets. ZoneVision 2.13 (MT4 2.00, TradingView ZV Arrival) draws the same ARRIVAL zones, weak zones, realignment area, stop rule and lower-TF confirmation as the bot, with alerts; ZoneBot has the optional arrival entries (off by default, demo presets). Bot guide (/bot-guide): install and use the MT4 / MT5 ZoneBot and ZoneVision.' },
      { id: 'a-notebook', title: 'Notebook', to: '/notebook',
        body: 'Free-form notes in folders, with templates; collects day reviews and trade notes.' },
      { id: 'a-settings', title: 'Settings', to: '/settings',
        body: 'Cloud sync (sign in on every device; newer edit wins, nothing deleted), your time zone and broker server clock, backup / restore, the Classic app (/legacy.html, same data).' },
      { id: 'a-header', title: 'Header & search',
        body: 'Date range and account filters apply to every page. Eye icon hides amounts. Sun / moon = theme. Ctrl/⌘ + K (phone: More → Search) finds any page or trade.' },
    ],
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'bot', title: 'Telegram bot', icon: 'bolt', kind: 'commands',
    intro: 'Type a command, tap the Menu (/) list, or just send a symbol. Every reply is short, Calgary time, distances in % (never pips).',
    items: [
      { id: 'b-symbol', title: 'Just a symbol', example: 'EURUSD', get: 'Same as /zones: price, every zone on every timeframe, signals, latest headline, buttons.' },
      { id: 'b-fx', cmd: 'fx', title: 'FX setups', example: '/fx', get: 'Open FX BUY / SELL / WATCH, getting close, in a zone, bounced.' },
      { id: 'b-stocks', cmd: 'stocks', title: 'Stock setups', example: '/stocks', get: 'Today\'s stock BUY / WATCH and what is close to a zone.' },
      { id: 'b-signals', cmd: 'signals', title: 'All signals', example: '/signals', get: 'Every open BUY / SELL / WATCH, both markets.' },
      { id: 'b-near', cmd: 'near', title: 'Near a zone', example: '/near', get: 'Everything within 1% of a strong zone.' },
      { id: 'b-scan', cmd: 'scan', title: 'Fresh scan', example: '/scan EURUSD', get: 'Runs the real scanner on that one symbol with every rule; the result card arrives in ~1 min. /scan alone: every market (~2 min). 6 an hour.' },
      { id: 'b-zones', cmd: 'zones', title: 'Zones', example: '/zones XAUUSD', get: 'Every zone on every timeframe: proximal / distal, demand / supply, fresh / tested, % away, live price when keys are set.' },
      { id: 'b-chart', cmd: 'chart', title: 'Chart', example: '/chart EURUSD  ·  /chart EURUSD 15m', get: 'One image with 4 timeframes, or one TF: MN, W1, D1, 4H, 1H, 15m (forex); 3M, MN, W1, D1, 1H, 15m (stocks). Zones and trendlines drawn; 15m and stock 1H need live data. Buttons switch views.' },
      { id: 'b-hours', cmd: 'hours', title: 'Best hours', example: '/hours XAUUSD', get: 'Best Calgary times and weekdays from the market-hours study.' },
      { id: 'b-fund', cmd: 'fund', title: 'Fundamentals', example: '/fund EURUSD  ·  /fund NVDA', get: 'FX: rates, last / next decision, CPI, GDP, carry, a one-line bias (context, not a signal). Stocks: market cap, P/E, revenue, EPS, margin, earnings dates, SEC filings. /fund alone: the 8 central banks.' },
      { id: 'b-insiders', cmd: 'insiders', title: 'Insider buys', example: '/insiders  ·  /insiders NVDA', get: 'The latest insider cluster buys (SEC Form 4), ⭐ first; with a symbol: its 30-day insider buys and sells. /fund and the zones / chart replies add a 🕵️ line when insiders bought.' },
      { id: 'b-news', cmd: 'news', title: 'News', example: '/news  ·  /news NVDA', get: 'Today\'s high-impact events + top 5 headlines; with a symbol: its last ~6 headlines.' },
      { id: 'b-times', cmd: 'times', title: 'Today\'s times', example: '/times', get: 'US data, NYSE open / close, busy window, London fix, forex rollover, today\'s NFP / CPI / Fed.' },
      { id: 'b-next', cmd: 'next', title: 'Next big events', example: '/next', get: 'Next jobs report, CPI and Fed decision with dates and Calgary times.' },
      { id: 'b-alert', cmd: 'alert', title: 'Price / zone alert', example: '/alert XAUUSD 2650  ·  /alert NVDA zone', get: 'One-shot alert when price crosses the level (direction picked for you) or enters any strong zone. Checked by the scans.' },
      { id: 'b-alerts', cmd: 'alerts', title: 'Your alerts', example: '/alerts', get: 'Alerts with 🗑 buttons, mutes, quiet hours, watchlist.' },
      { id: 'b-unalert', cmd: 'unalert', title: 'Delete alert', example: '/unalert 12', get: 'Deletes alert number 12 (numbers in /alerts).' },
      { id: 'b-mute', cmd: 'mute', title: 'Mute a symbol', example: '/mute EURUSD 1w', get: 'No scanner alerts for it: 1d default, 12h, 3d, 1w, 2w, up to 90d.' },
      { id: 'b-unmute', cmd: 'unmute', title: 'Unmute', example: '/unmute EURUSD', get: 'Alerts back on.' },
      { id: 'b-quiet', cmd: 'quiet', title: 'Quiet hours', example: '/quiet 22:00-06:00  ·  /quiet off', get: 'Alerts arrive silently in that Calgary window; breaking news waits for the brief.' },
      { id: 'b-watch', cmd: 'watch', title: 'Watch', example: '/watch AUDNZD', get: 'Adds an extra watchlist symbol (scanned and reported like the watchlist, gets breaking news). /watch alone: the list. Max 50.' },
      { id: 'b-unwatch', cmd: 'unwatch', title: 'Unwatch', example: '/unwatch AUDNZD', get: 'Removes it.' },
      { id: 'b-markets', cmd: 'markets', title: 'Markets (shared users)', example: '/markets', get: 'For people you shared the bot with: ✅ / ▫️ buttons pick which markets\' automatic messages they get (Stocks, Crypto, Forex & metals, Indices & commodities; stocks only to start). Commands still work for any symbol.' },
      { id: 'b-took', cmd: 'took', title: 'Log a trade', example: '/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910', get: 'Adds it to the Planner as a plan (shows after the app syncs).' },
      { id: 'b-ask', cmd: 'ask', title: 'Ask the lessons', example: '/ask what is a proximal line', get: 'Top 3 passages in the mentors\' own words with [📖 Open] links. Ending any message with ? works too.' },
      { id: 'b-health', cmd: 'health', title: 'Health', example: '/health', get: 'Last good FX scan, stock scan, big moves and brief, keys OK (GitHub, OANDA, Alpaca, Telegram), GitHub token expiry. /status works too.' },
      { id: 'b-guide', cmd: 'guide', title: 'This guide', example: '/guide', get: 'A short cheat sheet and a button that opens this page. /howto works too.' },
      { id: 'b-help', cmd: 'help', title: 'Help', example: '/help', get: 'Every command, grouped. Also brings back the quick keyboard.' },
      { id: 'b-buttons', title: 'Buttons under replies',
        get: '🔎 Zones · 📊 Chart · 🔄 Live scan (= /scan SYM) · 📑 Fundamentals · 📰 News · 🔕 Mute 1w · ⏰ 0.2% (alert when price is 0.2% from the nearest strong zone) · 🗑 delete alert · timeframe buttons on charts · Open in app.' },
      { id: 'b-keyboard', title: 'Quick keyboard',
        get: 'Six big buttons under the text box: 💱 FX · 📈 Stocks · ⏳ Near · 📋 Signals · 🕐 Times · 📅 Next. Gone? Send /help.' },
      { id: 'b-miniapp', title: 'Menu button (Mini App)',
        get: 'Bottom-left "RamanFX" button in the chat opens the app inside Telegram. Guide is in the menu under Help.' },
      { id: 'b-reply', title: 'Reply to a 📝 prompt',
        get: 'Reply to the coach\'s "why did you take it?" message: your text is saved as that trade\'s note in the journal.' },
      { id: 'b-pinned', title: 'Pinned list',
        get: 'The command list is pinned at the top of the chat and updated when commands change.' },
    ],
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'alerts', title: 'Alerts & messages', icon: 'alert',
    intro: 'Every message the system sends by itself, and how to calm it down.',
    items: [
      { id: 'm-fx', title: 'FX instant alerts', body: 'Only when something is new in an hourly scan: new BUY / SELL / WATCH, entry filled, cancelled, a /alert hit. Each with zone, entry, stop, target, R:R and buttons.' },
      { id: 'm-stock', title: 'Stock scan message', body: 'Once a day after the close: top trade cards (3 by default), BUY / WATCH per sector, watchlist approaching a zone, exit warnings for holdings.' },
      { id: 'm-ondemand', title: 'On-demand result card', body: '"🔄 SYM · on-demand scan": every rule for that one symbol, from /scan SYM or [🔄 Live scan]. Writes nothing; the regular scans are unchanged.' },
      { id: 'm-guard', title: 'Rule guard', body: '🛑 "Stop trading today" when the daily loss limit or max trades is hit (once a day). ⚠️ "Close to your daily limit" at 70%. Only while the day is live, so an evening import stays quiet. Limits = your Risk rules page.' },
      { id: 'm-cool', title: 'Cooling-off pause', body: '⏸ "30-min pause (your rule). Next look at 9:15 AM." after your max losses in a row inside the cooldown. Once per streak.' },
      { id: 'm-why', title: '"Why did you take it?"', body: '📝 for a trade or open position from the last 24 h with no note. Reply to it to save the reason. At most 3 per run, once per trade.' },
      { id: 'm-report', title: 'Sunday report card', body: 'Sunday 6 PM. R multiples only; $ amounts only if show_amounts is turned on in the coach config.' },
      { id: 'm-breaking', title: 'Breaking news', body: 'Watched or open symbols only, max 1 per symbol per 3 h and 6 a day. Buttons [📰 More] [📊 Chart].' },
      { id: 'm-health', title: 'Health watchdog',
        body: 'Silent while everything works. ONE "⚠️ FX scan missed 2 hours — …" style message when a scan, the brief, big moves, fundamentals or a key stays broken past its grace window (again at most every 6 h), and ONE "✅ resolved: …" when it clears. Max 4 a day; nothing during quiet hours (what is still broken arrives when they end). /health shows the status any time.' },
      { id: 'm-quiet', title: 'Make it quieter',
        points: [['/mute SYM 1w', 'one symbol off for a while'], ['/quiet 22:00-06:00', 'silent overnight'], ['FX_H4_DIGEST=false', 'repo variable: no H4 digest'], ['REMINDER_DAILY=off', 'repo variable: no daily nudge'], ['Pause the coach', 'set enabled = false in rfx_coach_config (Supabase SQL editor)']] },
      { id: 'm-samples', title: 'See a sample', body: 'GitHub → Actions: "Telegram layout test" sends the current scan messages once; "Big moves" with test=true sends a sample; "Telegram bot webhook" with sample_chart=true sends a chart album.' },
    ],
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'data', title: 'Data & coverage', icon: 'layers',
    intro: 'Where every number comes from, what is live and what is from the last scan.',
    items: [
      { id: 'c-fx', title: 'Forex, metals, CFDs: OANDA',
        body: 'OANDA practice API (free). Shown with Pepperstone names and TradingView links (PEPPERSTONE:EURUSD). Quotes can differ by a few pips: check on Pepperstone. Majors, crosses, exotics, metals; index / energy CFDs only when on the watchlist. XAUUSD H4 zones are blocked (Raja prefers XAUAUD low TFs).' },
      { id: 'c-synth', title: 'Synthetic crosses & indices',
        body: '9 crosses OANDA does not serve (CHFSGD, EURMXN, GBPMXN, GBPNOK, GBPSEK, GBPTRY, NOKJPY, NOKSEK, SEKJPY) are built from OANDA legs and traded normally. USDX (ICE formula), EURX and JPYX baskets are approximate: context only.' },
      { id: 'c-crypto', title: 'Crypto 24/7',
        body: '15 coins (BTC, ETH, SOL, XRP…) from Coinbase, then Kraken; BNB from Binance.US, then OKX. Scanned every hour including weekends.' },
      { id: 'c-yahoo', title: 'Yahoo (unofficial)',
        body: 'VIX, CA60, SCI25, GASOLINE, COCOA, COFFEE, COTTON, LDSUGAR, CATTLE from Yahoo\'s unofficial feed: labelled, context only (futures / proxies, levels differ from Pepperstone). If Yahoo blocks, that symbol is skipped; the scan never fails for it.' },
      { id: 'c-stocks', title: 'Stocks: Alpaca',
        body: 'Free Alpaca account: daily bars since 2016, split-adjusted; IEX real-time feed for 1H / 15m and the latest trade. ~1,100 tickers: S&P 500, Nasdaq-100, Dow 30, S&P/TSX 60 + Composite (through their US listing), global ADR leaders, US top liquid. Yahoo / Stooq only as fallback. TSX-only names: no data.' },
      { id: 'c-fund', title: 'Fundamentals',
        body: 'FX: TradingView economic calendar (rates, CPI, GDP, jobs) + Fed dates from federalreserve.gov. Stocks: SEC EDGAR (only when the SEC_CONTACT variable is set), next earnings from Nasdaq\'s calendar or estimated from filings.' },
      { id: 'c-news', title: 'Headlines & calendar',
        body: 'Alpaca News (Benzinga, tagged by symbol) + RSS: investingLive, Investing.com, CNBC, CoinDesk. Cached 5 min. Event dates: federalreserve.gov, bls.gov, TradingView calendar.' },
      { id: 'c-live', title: 'Live vs scan-based',
        points: [
          ['Live (at the moment you ask)', 'Bot /chart, /zones and a bare symbol: price, candles and zones from OANDA / Alpaca when the Supabase keys are set (30 s cache, "live · 7:42 AM"). 15m charts and stock 1H. TradingView chart in the app. Headlines.'],
          ['From the latest scan', 'BUY / SELL / WATCH everywhere, /fx, /stocks, /signals, /near, alerts, the app\'s scanner pages (FX hourly, stocks daily).'],
          ['Studies', 'Market hours (/hours, Market hours page), backtests, zone scorecard: refreshed by hand.'],
          ['On your device', 'Ask search and the Natural voice run in your browser; nothing leaves the phone.'],
        ] },
      { id: 'c-ctrader', title: 'Not yet: exact Pepperstone feed',
        body: 'An exact Pepperstone price feed needs the cTrader Open API (app registration + OAuth). Pending, not built. Until then OANDA prices + "check on Pepperstone".' },
    ],
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'keys', title: 'Settings & keys', icon: 'settings',
    intro: 'Names only. Values live in GitHub or Supabase settings, never in the code or this app.',
    items: [
      { id: 'k-gh', title: 'GitHub → repo Settings → Secrets and variables → Actions → Secrets',
        points: [
          ['TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID', 'every Telegram message from the scanners, brief, reminders, big moves; also the webhook setup'],
          ['OANDA_API_TOKEN', 'forex data for the scans, brief, big moves, market hours'],
          ['ALPACA_KEY_ID, ALPACA_SECRET_KEY', 'stock data, big moves, brief, market hours'],
          ['FX_WATCHLIST, WATCHLIST, HOLDINGS_JSON', 'your private watchlists and holdings (exit warnings, earnings heads-up)'],
          ['SEC_UA', 'contact for SEC downloads in the stock scan'],
          ['EODHD_API_KEY, FMP_API_KEY', 'optional extras (paid TSX feed; foreign filers\' fundamentals)'],
        ] },
      { id: 'k-ghvars', title: 'GitHub → Variables (not secret)',
        body: 'OANDA_ENV (practice / live), SEC_CONTACT, REMINDER_DAILY, REMINDER_CONTACT, FX_H4_DIGEST, FX_INCLUDE_CFD, SCANNER_UNIVERSES, TELEGRAM_TOP_N, SCANNER_TSX_FEED, TELEGRAM_WEBHOOK_LABEL.' },
      { id: 'k-sb', title: 'Supabase → Edge Functions → Secrets',
        points: [
          ['telegram-bot', 'OANDA_API_TOKEN (+ optional OANDA_ENV), ALPACA_KEY_ID, ALPACA_SECRET_KEY (live charts / zones), GITHUB_DISPATCH_TOKEN (/scan), TELEGRAM_BOT_TOKEN (button toasts)'],
          ['trader-coach', 'TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (push messages), GITHUB_DISPATCH_TOKEN (reliable scheduler), ALPACA_KEY_ID, ALPACA_SECRET_KEY (breaking news); reads OANDA_API_TOKEN for the health watchdog key check (Edge secrets are shared by all functions)'],
          ['lesson-audio', 'GOOGLE_REFRESH_TOKEN (recorded narration from Drive), optional ALLOWED_USERS'],
        ] },
      { id: 'k-dispatch', title: 'GITHUB_DISPATCH_TOKEN',
        body: 'Fine-grained GitHub token, repository r4m4nxd/ramanFX only, permission Actions: Read and write. Fine-grained tokens expire: note the date and renew before it (same name in both Supabase functions).' },
      { id: 'k-db', title: 'Supabase database switches',
        points: [['rfx_coach_config.enabled', 'false = pause the coach'], ['rfx_coach_config.show_amounts', 'true = $ in the Sunday report'], ['rfx_bot_config.rotate_until', 'opens a 15-min window to rotate the webhook secret (then run the webhook workflow with a new label)']] },
      { id: 'k-deploy', title: 'How things deploy',
        points: [
          ['App', 'Vercel builds raman-fx.vercel.app from main automatically, only when app files change (scripts/vercel-ignore.sh); claude/* branches never deploy.'],
          ['Data', 'The scheduled jobs (scans, big moves, fundamentals, brief and reminder state) commit to the data branch, never main, and the data branch never deploys: main gets only code commits. The app, bot and watchdog read the data branch (scripts/data-branch.sh).'],
          ['Bot / coach', 'tools/telegram_bot/deploy_entry.ts and supabase/functions/trader-coach/deploy_entry.ts import the code at one commit: put the new commit SHA in, deploy that file as the function (verify_jwt off).'],
          ['Command menu', 'Actions → "Telegram bot webhook" (runs on its own after a bot change) sets the webhook, Menu commands, Mini App button and the pinned list.'],
        ] },
      { id: 'k-app', title: 'In the app', to: '/settings',
        body: 'Settings: sign in for cloud sync, time zone (Calgary) and broker server clock, backup. Nothing secret is stored in the app.' },
    ],
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'fix', title: 'Troubleshooting', icon: 'wrench',
    intro: 'Symptom → likely cause → fix. Check GitHub → Actions first: a red run says why.',
    items: [
      { id: 't-lastclose', title: 'Stock charts / zones say "close · scanned …" instead of "live"',
        body: 'Live stock data failed: usually the Alpaca keys are rejected (401) or missing in Supabase. Make new keys at alpaca.markets (Paper account → API keys), update ALPACA_KEY_ID / ALPACA_SECRET_KEY in Supabase secrets and in GitHub secrets.' },
      { id: 't-livehint', title: '"(live data needs OANDA/Alpaca keys in Supabase)"',
        body: 'The key is not set in the telegram-bot function secrets. Add OANDA_API_TOKEN and / or the Alpaca pair. "(live data did not load just now)" = a one-off hiccup: try again.' },
      { id: 't-scan', title: '/scan: "needs a GitHub token" or "did not start"',
        body: 'GITHUB_DISPATCH_TOKEN is missing or expired. Make a new fine-grained token (Actions: read and write, this repo only) and paste it in both Supabase functions. "Limit reached" = 6 on-demand scans an hour: wait.' },
      { id: 't-health', title: '⚠️ message from the health watchdog',
        body: 'It names what is missing or failing, with a link to the failed run. Scan missed: the coach already retried; check Actions (red run?) and the GITHUB_DISPATCH_TOKEN. "key rejected": renew that key (names in Settings & keys). "GitHub token expires …": make a new token before that date. A ✅ resolved message follows by itself. /health = current status.' },
      { id: 't-late', title: 'Scans, brief or big moves late or missing',
        body: 'GitHub\'s own cron drops many runs; the trader coach dispatches them every 10 min instead. If it stopped: the dispatch token expired (see above) or the coach is paused (rfx_coach_config.enabled).' },
      { id: 't-stockfail', title: '"scan failed: no price data"',
        body: 'Stock scan got nothing from Alpaca: keys wrong or expired in GitHub secrets. Re-run Actions → Stock scan after fixing.' },
      { id: 't-fxfail', title: 'FX scan red / no forex messages',
        body: 'OANDA token invalid (practice tokens can be revoked when you reset the demo). Generate a new one in OANDA → Manage API Access, update OANDA_API_TOKEN in GitHub (and Supabase for live charts).' },
      { id: 't-silent', title: 'Bot does not answer',
        body: 'Run Actions → "Telegram bot webhook" once. It re-points the webhook and checks /help end to end; its log says what failed. A message from another chat is ignored on purpose.' },
      { id: 't-menu', title: 'New command missing from the / menu',
        body: 'Run "Telegram bot webhook" (resend_list off to skip re-pinning). Telegram can take a minute to refresh the menu; reopen the chat.' },
      { id: 't-nocoach', title: 'No coach messages',
        body: 'trader-coach needs TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID secrets; the journal must have synced (sign in in the app). The day guard only speaks while the day is live.' },
      { id: 't-note', title: 'Reply to 📝 not saved',
        body: 'Use Telegram\'s Reply on the prompt itself. The note appears after the app syncs; the coach re-applies it if a sync overwrote it.' },
      { id: 't-fund', title: '/fund shows old or n/a numbers',
        body: 'The nightly Fundamentals workflow failed or SEC_CONTACT is not set (stocks fall back to cached / scanner rows). TSX-only names have none.' },
      { id: 't-audio', title: 'Recorded lesson audio will not play',
        body: 'Sign in first (owner only). Still failing: the Google Drive token (GOOGLE_REFRESH_TOKEN in lesson-audio) expired; re-create it with rclone.' },
      { id: 't-app', title: 'App looks old or blank',
        body: 'Close and reopen (installed app), or pull to refresh. Sync red = tap it to retry. Check you are signed in (Settings).' },
      { id: 't-vercel', title: '"App not updating — Vercel may be rate-limited"',
        body: 'Vercel free plan: 100 deployments a day. Data never deploys (the jobs commit it to the data branch, which Vercel ignores; the app loads it live from GitHub), only app changes on main do, so this means many app commits in one day: the next push after the daily limit resets goes live. "App data not loading" = the GitHub rewrites in vercel.json (to the data branch) broke.' },
      { id: 't-yahoo', title: 'VIX / softs missing',
        body: 'Yahoo blocked the request for that run; they come back on their own. Context only anyway.' },
      { id: 't-levels', title: 'Level differs from my Pepperstone chart',
        body: 'Expected: data is OANDA (a few pips apart), synthetic or Yahoo. Trust the Pepperstone chart.' },
    ],
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────────────────────────────────────
  {
    id: 'limits', title: 'Costs & limits', icon: 'shield',
    intro: 'Everything runs on free plans today. These are the limits you can hit.',
    items: [
      { id: 'l-cost', title: 'What it costs',
        points: [['Vercel (app), Supabase (bot, coach, sync), GitHub Actions (scans)', 'free plans'], ['OANDA practice, Alpaca paper (IEX), Telegram, RSS, SEC', 'free'], ['Optional paid', 'EODHD TSX feed (off unless set); FMP free tier']] },
      { id: 'l-bot', title: 'Bot limits',
        points: [['/scan SYM', '6 an hour; the same symbol again within 2 min just says "scanning"'], ['Alerts', '50 at a time, one-shot (fire once, then gone)'], ['Extra watchlist', '50 symbols'], ['Mute', 'up to 90 days'], ['Messages', 'about 4,000 characters; longer lists say "+N more in the app"'], ['/ask', 'top 3 passages, ~1,500 characters']] },
      { id: 'l-push', title: 'Push limits',
        points: [['Breaking news', '1 per symbol per 3 h, 6 a day'], ['Big moves', 'one message an hour at most'], ['"Why" prompts', '3 per run, once per trade'], ['Rule guard', 'once a day; pause once per streak'], ['Brief', 'once a day, never after 7:30 AM']] },
      { id: 'l-vercel', title: 'App hosting limit',
        points: [['Vercel free plan', '100 deployments a day'], ['Data (scans, big moves, fundamentals, bot state)', 'never deploys: committed to the data branch (no deployments), served live from GitHub'], ['Watchdog', 'alerts if the app stops updating (an app change not live after 90 min)']] },
      { id: 'l-data', title: 'Data limits',
        points: [['Live candles', 'cached 30 s'], ['Headlines', 'cached 5 min'], ['Calendar', 'cached 15 min (TradingView rate-limits)'], ['Stock history', 'from 2016 (Alpaca)'], ['IEX feed', 'a few % of US volume: fine for price, not for volume']] },
    ],
  },
];

/** Every searchable word of an item (and its section title). */
export function itemText(it: GuideItem): string {
  return [it.title, it.when, it.body, ...(it.steps ?? []), ...(it.points ?? []).flat(), it.cmd && `/${it.cmd}`, it.example, it.get, it.to]
    .filter(Boolean).join(' ').toLowerCase();
}

/** Sections with only the items that match `q` (all words, any order); a section title match keeps all its items. */
export function filterGuide(q: string, sections: GuideSection[] = GUIDE): GuideSection[] {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return sections;
  return sections.flatMap(s => {
    const head = `${s.title} ${s.intro}`.toLowerCase();
    if (words.every(w => head.includes(w))) return [s];
    const items = s.items.filter(it => { const t = `${itemText(it)} ${head}`; return words.every(w => t.includes(w)); });
    return items.length ? [{ ...s, items }] : [];
  });
}

/** Section id that holds an anchor (a section id or an item id). */
export function sectionOf(anchor: string): string | null {
  for (const s of GUIDE) if (s.id === anchor || s.items.some(i => i.id === anchor)) return s.id;
  return null;
}
