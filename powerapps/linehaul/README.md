# Line-Haul Cost Collector: redesigned screens

Four new screens in the LTL Rate Request style, laid out for iPad landscape. They sit alongside the old screens until you switch over.

| File | What it is |
|---|---|
| `App.Formulas.fx` | Theme colours, pick lists, and the cost functions `LHCost`, `FscPct`, `FuelMissing`, `EquipFt`, `CubicFt`, `SkidSpots` |
| `scrEntry.yaml` | Rate entry |
| `scrRecent.yaml` | Recent entries |
| `scrDetails.yaml` | Rate details |
| `scrFuel.yaml` | Fuel library |
| `LinehaulApp_FullCode.txt` | Everything above in one file, in paste order |
| `build.py` | Generates the four YAML files. Edit it, then run `python3 build.py`. |

## Install (in this order)

1. **Settings → Display:** orientation *Landscape*, size *4:3 (iPad)*, then turn off *Scale to fit* and *Lock aspect ratio*. The layouts are built for iPad landscape and stretch to fill any screen from 1024 px wide up.
2. **Settings → Updates → New:** check that **User-defined functions** is on. It's on by default in current Studio.
3. **Settings → General:** set the data row limit to 2000.
4. **FuelLibrary list:** add one item with Title `ALL-IN` and FSC `0`. The fuel picker now reads from the library, so ALL-IN has to exist there.
5. **Data pane:** refresh `LinehaulRates`, `Carriers` and `FuelLibrary`.
6. **App → Formulas:** paste the whole of `App.Formulas.fx`, below anything already there.
7. **Screens:** open each `scr*.yaml`, copy all of it, then in the Tree view right-click → **Paste**. Paste in the order Fuel, Details, Recent, Entry. Studio may show errors until all four exist, because the screens navigate to each other.
8. **App → StartScreen:** `scrEntry`.
9. Test it, then delete `EntryScreen`, `RecentScreen`, `LHFormDetails` and `FuelScreen`.

## What changed in the logic

- **One cost formula.** `LHCost()` replaces the six copies, and fuel is read once through `nfFuel`. This fixes LH cost and cost/ft³ disagreeing (`F_Adj/100` vs `F_Adj`).
- **Save first, then deactivate.** The new rate is saved first. Older active rows for the same lane key are switched off only after the save succeeds, using a delegable `Filter` instead of `UpdateIf`.
- **One rule set for validation.** `entLblErrors` holds the validation rules. The Save button, the status line and the field borders all read from it, so they can't disagree.
- **Numbers only.** Cost fields accept positive numbers only, so a `%`, `$`, minus sign or letter is caught before saving.
- **Service days:** ALL clears the other days and is saved as `ALL`; other days are saved in week order.
- **Fuel add-on and discount** are always percentage points, which is how the calculation always treated them.
- **Recent filters use `StartsWith`,** so they stay delegable past 2,000 rows. The equipment filter still matches anywhere in the name ("53"), applied to the rows already loaded.
- **No duplicates:**
  - Carrier names are saved in upper case, and duplicates are blocked with a delegable exact match.
  - Fuel program names are checked the same way.
- **Failed saves are reported.** If a save fails, the user is told and the form keeps its data.
- **New variable names** (`varRate`, `colDays`, `colLaneRates`, `varFuelForm`, `varFuelEdit`, `varFuelRec`, `varEditRate`, `varConfirmSave`, `varConfirmEdit`, `varSaving`, `varSavingEdit`) so they don't clash with the old screens while both exist.

## Duplicates and edit mode

**New rate (Save rate)** stops on a confirm dialog when any of these is true:
- the lane already has an active rate and this one is marked active. The button reads **Replace and save**, and the old rate is switched off only after the new one saves.
- a live rate for this lane already has the same base and fuel, so saving would create a duplicate.
- the expiry date has already passed.
- the base is over $20,000, which is likely a typo.

**Rate details → Edit rate** changes Active, Effective, Expiry and Comments. Price fields can't be edited, so a price change is always a new rate and the history stays intact.
- **Hard stops:** expiry on or before the effective date; making an expired rate active.
- **Confirm first:** making it active while another rate is active (that one gets switched off); switching off the lane's only active rate; moving the expiry into the past.
- **All rates on this lane:** lists every rate for the lane key, expired ones included. It flags lanes that already have more than one active rate (left over from old data); open the one to keep, Edit rate, Save, and the others switch off.

## Rules that keep the data clean

| Rule | Where |
|---|---|
| Lane fields, carrier and fuel come from lists, never free text | Entry |
| New carrier and fuel program names are trimmed, upper-cased, and blocked if they already exist | Entry, Fuel library |
| Origin ≠ destination; base > $0; % discount < 100; LH cost must stay above $0 | Entry (Save disabled) |
| Fuel program must have an FSC; fuel discount can't exceed the FSC | Entry |
| Expiry after effective; an expired rate can't be active | Entry, Edit |
| Only one active rate per lane key | Entry and Edit save logic |
| Save buttons lock while saving, so a double click can't create two rows | Entry, Edit |
| A failed save says so and keeps the form filled | Everywhere |
| Nothing is ever deleted; old rates are switched to inactive | By design |

## Recommended SharePoint settings

Do these once in the list settings. They protect the data even if someone edits the list directly.

1. **Indexed columns** on `LinehaulRates`: Title, Destination, Carrier, Mode, Equipment, Active, ExpiryDate and Timestamp. Without indexes, filters stop working once the list passes 5,000 items.
2. **Required columns:** Title, Destination, Carrier, Mode, Equipment, Fuel, Base, EffectiveDate and ExpiryDate.
3. **List validation** (List settings → Validation settings): `=[ExpiryDate]>[EffectiveDate]`
4. **Active** column default = Yes.
5. **Permissions:** users get *Contribute without delete*, so rates can't be deleted from the list itself.
6. Optional: a Power Automate flow that runs nightly and switches expired active rates to inactive.

## Known limits

- Cost uses **today's** FSC, so editing a fuel program changes the cost of past rates.
- The fuel-library row filter and the equipment "contains" filter run on the first 2,000 rows returned. The rows are already filtered by lane, carrier and mode and exclude expired rates, so this only matters at very large volumes.

## Layout (iPad landscape)

- **Rate entry:** Lane and Cost sit side by side in equal-height cards. A single bottom bar shows the four cost tiles, what's still missing, and the Reset and Save buttons.
- **Recent entries:** filters, toggles and the result count share one row, so the table gets the rest of the screen.
- **Rate details:** the lane title runs across the top. Lane facts and cost are on the left; the edit panel and all rates on this lane are on the right.
- **Fuel library:** the program list is on the left, with the add/edit panel always open on the right.
- **Spacing:** only 4, 8, 12 and 16 px gaps, 16 px padding on every card and the page, 6 px card corners.
- **Touch-first states:** hover never changes a button's fill, because on iPad hover sticks after a tap. Pressing gives the feedback instead (primary buttons go dark, chips fill blue).
- **No screen transitions:** people switch screens many times a day, so navigation is instant. Rate entry opens with the cursor in Origin.
