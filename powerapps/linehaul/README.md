# Line-Haul Cost Collector: redesigned screens

Four new screens in the LTL Rate Request style. They sit alongside the old screens until you switch over.

| File | What it is |
|---|---|
| `App.Formulas.fx` | Theme colours, pick lists, and the cost functions `LHCost`, `FscPct`, `FuelMissing`, `EquipFt`, `CubicFt`, `SkidSpots` |
| `scrEntry.yaml` | Rate entry |
| `scrRecent.yaml` | Recent entries |
| `scrDetails.yaml` | Rate details |
| `scrFuel.yaml` | Fuel library |
| `build.py` | Generates the four YAML files. Edit it, then run `python3 build.py`. |

## Install (in this order)

1. **Settings → Display:** turn off *Scale to fit* and *Lock aspect ratio*, and keep orientation *Portrait*. This lets the screens fill the device.
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
- **New variable names** (`varRate`, `colDays`, `varFuelForm`, `varFuelEdit`, `varFuelRec`) so they don't clash with the old screens while both exist.

## Known limits

- Cost uses **today's** FSC, so editing a fuel program changes the cost of past rates.
- The fuel-library row filter and the equipment "contains" filter run on the first 2,000 rows returned. The rows are already filtered by lane, carrier and mode and exclude expired rates, so this only matters at very large volumes.
