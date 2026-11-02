# Handoff: continue here (2026-11-02)

Owner: RamanFX trader in Calgary. Replies must be brief and plain (often driving: no numbers then). Questions go in
batches, as yes/no with a picture of their own chart, and only what the data cannot settle. Keep cost low: use a cheaper
model for mechanical jobs (renders, ports, plumbing), do small things directly, and avoid needless agent rounds.

## Repo, branches, deploy
- Work branch `claude/festive-edison-fzvdr6` (ZoneVision + research). Live code is `main`; the owner allowed pushes
  to main (`.claude/settings.json`). Push only feature commits to main, never the ZoneVision WIP unless the owner says so.
- Telegram bot = Supabase edge function `telegram-bot` (project dqjzufofmblerslcynzr). To deploy: pin the commit SHA in
  `tools/telegram_bot/deploy_entry.ts` (trader-coach: `supabase/functions/trader-coach/deploy_entry.ts`), push to main,
  then deploy that file as index.ts with MCP deploy_edge_function (verify_jwt false).
- Data lives on the `data` branch, never main. Vercel builds main (100 builds/day).
- Never print or commit secrets; no model names in commits or files.

## ZoneVision (MT5 indicator), the main thread
- Rules: docs/training/SPEC.md (v1.4) and the 2.16–2.20 sections of docs/training/ZV216.md. Canonical model:
  supabase/functions/telegram-bot/zvModel.ts. MQL mirror: public/tools/RFX_ZoneCore.mqh + RamanFX_ZoneVision.mq5.
  Python port: tools/telegram_bot/parity/mql_model.py. Conformance must stay 100% (parity test + zv216-conformance
  seeds 7 / 23).
- 2.20 vs the owner's 9 marked charts: trend-line rows 23/29 (79%), pivots 73, momentum 23, zones recall 15/50 and
  precision 15/69. The owner compiled 2.20 and it runs.
- The owner's own rules (verbatim in SPEC §11):
  - Q1: a tiny wick breaks a line; if price then makes a new extreme in the trend direction, redraw from the new pivot
    and show only the current pivot-to-pivot line.
  - Q2: anchors may be any candle in the valley / peak area; the line must not cut candles.
  - Q10: a wick poke is provisional. If a strong opposite candle closes through, that candle is the break and becomes
    an arrival zone.
- IN PROGRESS when this session ended: 2.21 display cleanup (the owner said the charts were crowded):
  1. a Panels ON/OFF button, and compact square info panels (~280 px, font 8);
  2. thin borders and pale fills on all boxes, with no dark realign band;
  3. pivot dots off by default plus a Dots button;
  4. Labels OFF hides ALL text, and labels are shorter and never stack.
  Check the work branch for a "2.21" commit. If it is there, review it and send the owner the two .mq5/.mqh files. If it
  is missing, do it.
- Open owner questions:
  - AUDUSD H4 Oct 22 00:00: is a deep-wick candle that closes back the break, or the next close (04:00)?
  - Gold MN 2022-10 → 2023-10: should a line stay drawn while unbroken, however far price moved away?
- Still needed from the owner:
  - Raja's lesson on drawing a zone box (which candles, wick or body). Zones are the weakest part.
  - More charts marked on the app's Train my eye page.
  - Momentum lines are still weak.

## Telegram bot / app (live on main)
- Insider alerts:
  - every 10 min, 6:00–22:00 New York;
  - early first big buy, big non-plan sells, Form 144 at 0.05%+ of market cap, 13D activists;
  - 10 alerts a day.
  - Code: tools/insiders, workflow insiders.yml.
- /holders SYM plus the 👥 Holders button, and a holders card in the app. Data comes from tools/holders and
  holders.yml (daily).
- The chart images were decluttered (PR #3) and every reply passes tgSafe (HTML escape).

## Research
- docs/research/TREND_VS_SD.md: over 18 years and 13 markets, supply & demand alone loses slightly, trend following is
  about break-even, and the combination is about break-even.
- Bet size is the killer: at 2–5% risk the account is ruined.
- Lead to test: a trailing exit on S/D entries.

## Owner decisions still open
- Turn on the 3-month paper tracker (0.5% risk).
- Add the CFTC COT report (big funds' positioning) to the bot.
- Move the SEC contact from a repository variable to a GitHub secret (owner action).
- Older: ZoneBot presets, voice, cTrader secrets.
