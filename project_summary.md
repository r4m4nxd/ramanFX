# Project summary: Line-Haul Cost Collector (Power Apps)

## Project name
- Line-Haul Cost Collector, titled "Line-Haul Form" inside the app

## One-line purpose
- Collects line-haul carrier rates in one place, works out the true line-haul cost (fuel surcharge, add-ons, discounts), and keeps exactly one active rate per lane.

## Who uses it
- Pricing and linehaul staff at a freight and logistics company: they enter rates, look up current costs and keep fuel surcharges up to date.
- Managers use it to see which rate is active on each lane and when rates expire.
- Built to run on PC, tablet (iPad landscape) and, occasionally, phone.

## Tech stack
- **Power Apps (canvas app):**
  - The whole app is written as Power Fx source in YAML (pa.yaml paste format) and pasted into Power Apps Studio.
- **Power Fx:**
  - Named formulas (`App.Formulas`) for the theme colours, pick lists and a cached fuel table.
  - User-defined functions (UDFs) for all cost maths, so it's written once.
  - `With`, `Switch`, `ForAll`, `Patch`, `AddColumns`, `ClearCollect` and `IfError`/`IsError` patterns.
  - Responsive auto-layout containers.
- **SharePoint Online lists** as the database, through the standard connector, so no premium licence is needed.
- **Python 3:**
  - A layout generator (`build.py`, about 1,600 lines) that writes all four screens as Power Apps YAML and runs a fit audit on every control before writing.
  - Scripts that rebuild hand-edited Studio screens from their exported YAML and apply only the requested changes.
- **openpyxl and LibreOffice** to build and verify the formula-driven Excel bulk-upload template.
- **HTML/CSS/JavaScript** for an interactive design mock-up of all four screens, published as a Claude artifact for stakeholder review.
- **Git and GitHub** for version control: about 20 commits on a feature branch for this work.
- **Not used:** Power BI, Power Automate, Supabase or OpenAI. A nightly Power Automate flow to expire old rates is documented as an optional next step.

## Data sources and data model
- **SharePoint list `LinehaulRates`**, the main table:
  - Lane fields: Origin (Title), Destination, Mode, Carrier, Equipment.
  - Fuel and service fields: Fuel program, ServiceDays.
  - Dates: EffectiveDate, ExpiryDate.
  - Money fields: Base, Adj/AdjType, Discount/DiscountType, F_Adj, F_Discount.
  - Other: Comments, Active, SubmittedBy, SubmittedEmail, Timestamp.
- **SharePoint list `Carriers`**: carrier names, kept in upper case with duplicates blocked.
- **SharePoint list `FuelLibrary`**: fuel program, FSC %, effective date and who changed it last.
- **Lane key:** Origin + Destination + Carrier + Mode + Equipment. The business rule is one active rate per lane key.
- **Computed columns** added in the app: `IsOn` (active flag), `Expired`, `LH` (line-haul cost) and `NoFSC` (fuel program missing from the library).
- **Reference lists:** 16 terminals, 4 modes, 12 equipment types and 5 fuel programs (including all-in rates).
- **Equipment model:** each equipment type maps to length (20, 40 or 53 ft), cubic feet and skid spots, which give cost per ft³, per linear ft and per skid spot.
- There are no DAX measures, SQL views or stored procedures: all logic is Power Fx named formulas and functions over SharePoint.

## Screens and major features
- **Rate entry:**
  - Two-column card layout with Lane and Cost side by side.
  - Searchable picker panels for terminals, mode, equipment, carrier and fuel program, plus adding a new carrier from inside the picker.
  - Service-day chips (ALL plus the 7 days).
  - Effective and expiry dates, and an Active toggle.
  - `$ | %` buttons for the add-on and the discount.
  - Live calculation as the user types: line-haul cost, cost per ft³, per linear ft and per skid spot, and a step-by-step "how the cost is built" breakdown.
  - Validation in plain language ("Still needed: Carrier, Base rate"), with amber outlines on missing required fields.
  - A confirmation dialog before saving when the new rate would replace an active rate, duplicate an existing rate, already be expired, or has a base rate that looks like a typo.
- **Recent entries:**
  - Searchable table with filter chips: Active only, Include fuel and Show expired.
  - Lane, carrier, mode and equipment filters.
  - Active / Inactive / Expired status pills; inactive and expired rows are greyed out.
  - An "Expires in" column (days, then weeks, then months) whose colour shifts from normal text through amber to red as expiry gets closer, with the exact date on hover.
  - The cost column header always says whether fuel is included.
- **Rate details:**
  - The lane as the page heading, with chips, a status pill and an always-visible "Submitted by" line.
  - Cost tiles, a cost breakdown and comments.
  - An "Edit status & dates" panel to change active state, dates and comments only. A price change has to be a new rate, so the history stays intact.
  - A list of every rate on the same lane, with a warning when more than one is active.
- **Fuel library:**
  - Table of fuel programs and FSC % with who changed each one last and when.
  - An add/edit panel that is always open, with duplicate names blocked and FSC format checked.
- **Throughout:**
  - A shared navigation rail and header on every screen.
  - A light theme with a teal accent, deliberately distinct from a sister app.
  - A fixed type scale and an 8-point spacing system.
  - Layouts that stack into one column on narrow screens.

## Integrations
- Power Apps canvas app reading and writing three SharePoint lists through the standard SharePoint connector.
- Bulk data loading into SharePoint through a validated Excel template.
- No external APIs.

## Hard problems solved
- **Cost totals that didn't agree:** the cost calculation was copied into six labels, and two of them handled the fuel add-on differently. Replaced with one user-defined function, `LHCost()`, used everywhere, reading a fuel table cached once in a named formula.
- **One active rate per lane:**
  - The new rate is saved first, and older active rates on the lane are switched off only after the save succeeds.
  - Users confirm in a dialog before an active rate is replaced.
  - Both Save buttons lock while saving, so a double click can't create two rows.
- **SharePoint delegation limits:**
  - Swapped non-delegable `in` and `UpdateIf` for delegable `StartsWith` and key filters.
  - Ran the remaining checks on rows already loaded, so results stay correct past 2,000 records.
- **Yes/No and text column mismatch:** SharePoint returned no rows when the Active flag was filtered in the query, and the column turned out to be text. Fixed by filtering on the lane in SharePoint, then computing an `IsOn` flag on the loaded rows and using it everywhere.
- **Classic combo boxes showing empty lists:** their dropdowns were clipped inside containers. Replaced them with a screen-level searchable picker panel, which also gives bigger touch targets on tablets.
- **Controls clipped inside containers:**
  - Auto-layout children inherit large default minimum sizes, which clipped icons, labels and borders. The generator now sets minimums to zero.
  - Borders drawn on a container's edge get cut off, so the generator enforces a 2 px inset rule and the audit flags any breach.
- **Text that didn't fit:** wrote an audit that checks every text control's height against its font size and line height, and its width against its fixed text. It found and fixed 30+ problems before release.
- **Hand edits lost on rebuild:** a scripted rebuild of the user's own Studio-edited screens applies only the requested changes and keeps every manual tweak. Those screens are kept as the master copies.
- **Data quality:**
  - Hard stops for bad entries: same origin and destination, zero base rate, a % discount of 100 or more, a discount that wipes out the whole cost, a fuel program with no FSC, and expiry before the effective date.
  - Carrier and fuel names are trimmed, upper-cased and checked for duplicates.
  - Nothing is ever deleted; old rates are switched to inactive.

## Documentation produced
- Build handoff and install README:
  - setup steps;
  - paste order;
  - recommended SharePoint list settings (indexed columns, required fields, list validation, permissions);
  - known limits.
- A guide to the theme and type-scale tokens.
- A step-by-step edit guide for applying targeted changes in Power Apps Studio.
- A full-code bundle with all screens and formulas in paste order.
- An interactive HTML mock-up of the four screens, used for design review before building.
- **Excel bulk-upload template:**
  - Five tabs: a "Start here" guide in plain language, a column guide (meaning, required or not, data type, allowed values, example), worked examples, the allowed-value lists, and the fill-in sheet.
  - Dropdown and number/date validation on every column.
  - A per-row "Check" column that names each problem in plain words.
- A column-by-column data requirements message for the people supplying data.

## Numbers
- **App:**
  - 4 screens, about 170 controls on the largest screen, and 7 shared cost and equipment functions.
  - About 19,000 lines of generated Power Apps YAML, plus a 1,600-line Python generator.
- **Reference data:** 16 terminals, 12 equipment types, 4 modes and 5 fuel programs.
- **Bulk template:** 500 data rows and 2,000 validation and check formulas, recalculated with zero formula errors.
- **Data review:**
  - A 164-row reference dataset passed every validation rule.
  - A 383-row supplier file was screened automatically. It found:
    - every row missing the Active flag;
    - more than 230 invalid mode values;
    - about 270 fuel names not on the allowed list;
    - 76 equipment values not on the allowed list;
    - discounts entered as negative numbers.
- **Not measured:** user count, time saved and runtime figures. Add these once the app is in use.

## Host repository
- The work lives in `powerapps/linehaul/` of a personal repository whose main project is a separate React, TypeScript and Vite web app with a Supabase back end (a trading journal and learning tool). That app was not built or changed in this session.
