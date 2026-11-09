# Project Summary: YOY Account Summary (Executive Information System)

## Project name
- YOY Account Summary, an Executive Information System (EIS) for an LTL freight division

## One-line purpose
- A Power BI report that gives executives, sales leaders and sales reps year-over-year and week-over-week views of company KPIs and per-account performance, with Power Apps comment write-back and automated weekly email reports.

## Who uses it
- Executives: division-wide KPIs, renewals and cancellations
- Sales leaders: their team's accounts
- Sales reps and pricing analysts (BAS reps): their own accounts, renewal follow-up, GRI (general rate increase) tracking
- In production for about 3 years; users are routed by role through a Power Apps login

## Tech stack
- Languages: DAX, Power Query M, T-SQL, TMDL (Tabular Model Definition Language), JSON (report definition and theme), HTML/CSS/JavaScript (prototypes), Python (scripted bulk edits of the project files)
- Power Platform:
  - Power BI Desktop and Power BI Service
  - PBIP project format (report definition plus TMDL semantic model as plain text)
  - Power Apps: canvas app for login and role routing, plus two embedded Power Apps visuals for comments
  - Power Automate: weekly email flow
- Data: Microsoft SQL Server, on-premises, through the Power BI gateway; mixed import and DirectQuery storage
- Role lists: SharePoint list used by the Power App
- Design tooling: Figma, a Power BI theme JSON, and HTML prototypes
- Not used in this project: Supabase, OpenAI

## Major features and screens (13 report pages, 330+ visuals, 43 bookmarks)
- Info: usage guide
- Main, Leader and Sales Summary: one layout per audience
  - Rolling 12-month KPI cards: Base $/CWT, average density, tonnage, base revenue $ and bills, each against the prior year
  - Gross margin (or margin band code for reps) and Accepted GRI %
  - Account status, pricing stage, expiry status and fiscal-year GRI status charts
  - Revenue-quality, density, tonnage, base $ and bills trend switcher
  - Recent comments panel (Power Apps)
- Monthly Variance (executive, leader and sales versions)
  - Account-level YoY table: margin, single pickup and delivery %, expiry, GRI %, statuses, account type, density, and tonnage and revenue change in $ and %
  - Custom filter pane with an active-filter counter
  - Trend charts
- Lane-YOY: lane (origin to destination) drill-through for one account, with comments and an "Add Comment" Power App
- Weekly Variance: week-over-week and same-week-last-year tonnage, base $ and bills, with an A–D account-type switch and variance by origin
- Lane-Weekly: weekly lane drill-through, variance by origin and by destination
- for-emails WoW: a hidden page that feeds the Power Automate weekly tonnage email
- User Activity: logins, time spent and comment activity per user
- Tooltip page: active-filter summary

## Integrations
- Power BI + Power Apps
  - Login app routes each user to their role's pages, using the SharePoint role list
  - Embedded Power Apps visuals write account comments back to SQL and display them in the report
- Power BI + Power Automate: a scheduled flow sends weekly week-over-week tonnage emails to reps, using the report's email page and sales-region email data
- Power BI + SQL Server: a stored procedure with dynamic date parameters, views, and DirectQuery for live GRI notes
- Power BI Service: scheduled refresh through the on-premises gateway, an app for distribution, and Replace-in-place publishing so links are kept

## Data sources and model
- 16 business tables, 26 relationships, about 134 measures and about 40 calculated columns
- Main tables:
  - Fact: shipments summary (bills, tonnage, cube, base, accessorials, fuel, total revenue by account, lane, month and week); account margin and service mix
  - Customer view: expiry and active flag
  - Sales region: rep, leader, BAS rep and emails
  - Notes: latest account note, latest GRI note (DirectQuery), BAS stage history and comment log
  - User activity
  - Fiscal date table and slicer date table
  - GRI calculation table
  - Parameter tables: trip start date, and trip end computed as the last completed Saturday
- SQL objects used:
  - A shipments-summary stored procedure that takes start and end trip dates
  - Views for customers, sales regions, latest notes, GRI notes, BAS stages, account notes and user activity
- DAX measure families:
  - Totals
  - Rolling 12 completed months, current vs prior year
  - YoY variance $ and %
  - Week-over-week and same-week-last-year
  - Density and revenue per CWT
  - Gross margin and margin bands
  - Fiscal-year GRI %
  - Status and stage counts
  - Dynamic K/M/B format strings
  - Filter-tooltip measures
  - Data-health measures

## Work done in this session (audit and modernization)
- Audited the full model and report as text: all TMDL tables and measures, the report JSON for every visual, page and bookmark filter, and the relationships
- Rewrote 46 measures and added 16 (10 fiscal-year, week and label helpers, plus 6 data-health measures)
- Rewrote 2 calculated columns and added 1 SQL-computed column
- Fixed filters and titles on 5 visuals
- Updated a renamed measure in 9 report and bookmark files
- Applied every change in bulk by editing the PBIP text files with a Python script, not by clicking through Power BI
- Published by replacing the existing report in place: report and page links, Power Apps deep links, the app, subscriptions, scheduled refresh and the Power Automate connection were all kept, with no issues after publishing
- Produced a refreshed design direction: a theme, a same-layout redesign, and a from-scratch redesign, in Figma and as clickable prototypes

## Hard problems solved
- Hard-coded fiscal years: the GRI measure, chart filters and chart titles had fixed dates and labels such as "F25", "F26" and Oct 1, 2025. Replaced them with fiscal-year logic derived from today's date (October start), so measures, filters and titles roll over by themselves each October.
- January rollover bug: weekly measures used `YEAR(TODAY())` and "week − 1". They went blank in January and had no previous week for week 1. Rebuilt them to anchor on the latest week in the data, keeping the business rule of matching week number vs week number for full weeks.
- Wrong weekly YoY %: the formula divided by this week instead of last year's week, producing values like −116% where about −54% was correct. Fixed the denominator.
- Rolling 12 completed months: the window could include the partial current month on pages without a page filter. Capped the window at the last completed month inside the measures themselves, using `DATESINPERIOD`.
- Account classification bug: A/B/C/D account type was annualizing only the months elapsed so far, so in November it used a single month × 12. Switched it to the full previous fiscal year, keeping the thresholds.
- DirectQuery limitation: the fiscal-year GRI flag needed today's date on a DirectQuery table. Moved the logic into the SQL query so it is computed live on the server.
- Misleading results:
  - New accounts showed 0% YoY; they now show blank.
  - Forced zeros made every account appear in tables; removed them.
  - Division-by-zero risks fixed with `DIVIDE`.
  - The margin cap was confirmed as a business rule and kept.
- Bulk changes without breaking links:
  - Wrote a Python patcher for TMDL and report JSON that keeps object IDs and line endings.
  - Renamed a measure everywhere it is referenced.
  - Swapped visual filters and turned static titles into measure-driven titles.
- Zero-maintenance monitoring: added "data as of", "data age" and data-health measures, plus counts of accounts missing a sales team or expiry date, so stale refreshes and data gaps show up in the report.
- Test configuration left in production: found a hard-coded test email address feeding the weekly email flow, and changed it to each rep's real address.
- Rollback option: kept the previous GRI calculation method as a separate measure, also free of hard-coded years.

## Documentation produced
- DAX fix scripts (v1 and v2), with a before/after explanation for each fix
- Patched PBIP project packages (v2 and v3), with install, refresh and publish steps
- Hard-coded value audit: report, page, visual and bookmark filters, with an action for each
- Maintenance checklist covering:
  - Scheduled refresh and failure alerts
  - Ownership of the semantic model, gateway and flow
  - Gateway redundancy
  - SQL data-quality fixes
  - Known limits (53-week years)
  - Yearly check dates
- Power BI theme JSON and a page-by-page redesign layout spec
- Design guide keeping the current layout: numbered changes, palette, order of work
- Clickable HTML prototypes with example data:
  - Every page in its current layout
  - A from-scratch 5-page redesign: Pulse, Accounts, Weekly, Renewals, Activity
- Figma file with 6 redesigned report pages (1920×1080) for team design review

## Numbers
- 13 report pages, 330+ visuals, 43 bookmarks
- 16 business tables, 26 relationships, about 134 measures, about 40 calculated columns
- History from October 2021 to the latest completed week, refreshed daily
- 46 measures rewritten, 16 measures added, 0 hard-coded fiscal years left in measures or visual filters
- About 3 years in production; republished with 0 issues and no broken links
- User counts, time saved and refresh runtime: not measured in this session. Add these from your Power BI usage metrics and refresh history.

## Note on this repository
- The `ramanFX` repository attached to this session holds a separate project (an FX and stock research and alert app). This session made no changes to it. The Power BI work above was done on project files you uploaded, not in this repository.
