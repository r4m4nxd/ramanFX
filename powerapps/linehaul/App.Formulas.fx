// Line-Haul Cost Collector · App.Formulas
// Paste into App → Formulas (append below anything already there).

// ---------- Theme: LTL Rate Request layout, plum palette so the two apps aren't confused ----------
clrInk = RGBA(22, 32, 43, 1);
clrInk2 = RGBA(72, 88, 106, 1);
clrInk3 = RGBA(125, 139, 153, 1);
clrPage = RGBA(242, 239, 245, 1);
clrPanel = RGBA(255, 255, 255, 1);
clrLine = RGBA(226, 219, 232, 1);
clrSoft = RGBA(247, 244, 249, 1);
clrBlue = RGBA(102, 51, 122, 1);        // primary accent (plum)
clrBlueHover = RGBA(126, 72, 148, 1);
clrRed = RGBA(196, 22, 28, 1);
clrRedBg = RGBA(253, 236, 237, 1);
clrAmber = RGBA(242, 183, 5, 1);
clrAmberBg = RGBA(255, 247, 221, 1);
clrAmberInk = RGBA(125, 94, 0, 1);
clrGreenBg = RGBA(231, 244, 236, 1);
clrGreenInk = RGBA(20, 96, 63, 1);
clrRail = RGBA(45, 26, 54, 1);
clrRailOn = RGBA(64, 40, 76, 1);
clrRailInk = RGBA(214, 202, 222, 1);
clrOrange = RGBA(224, 102, 43, 1);
clrWhite = RGBA(255, 255, 255, 1);
clrClear = RGBA(0, 0, 0, 0);

// ---------- Pick lists ----------
nfTerminals = ["VI", "VA", "KE", "ED", "CA", "RG", "SK", "WI", "TO", "OT", "ML", "FR", "SJ", "MT", "HX", "SS"];
nfModes = ["FLEX", "STANDARD", "PREMIUM", "ROAD"];
nfEquipment = ["IM20", "IM40", "IM40 INSULATED", "IM53", "IM53 HEATED", "DRY 53 TANDEM", "DRY 53 TRIDEM", "PVT53 DRY", "PVT 53 HEATED", "53FT REEFER", "FLATBED 53FT TRIAXLE", "FLATBED SUPER B"];
nfDays = ["ALL", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Fuel table read once and reused by every cost label (refreshes after Refresh(FuelLibrary)).
nfFuel = ShowColumns(FuelLibrary, Title, FSC);

// ---------- Equipment ----------
EquipFt(Equip:Text):Number = If(StartsWith(Equip, "IM20"), 20, StartsWith(Equip, "IM40"), 40, 53);
CubicFt(Equip:Text):Number = Switch(EquipFt(Equip), 20, 1280, 40, 2350, 3830);
SkidSpots(Equip:Text):Number = Switch(EquipFt(Equip), 20, 10, 40, 20, 26);

// ---------- Cost maths (one definition used by every screen) ----------
// A program that isn't ALL-IN and has no FSC in the library.
FuelMissing(Fuel:Text):Boolean = !IsBlank(Fuel) && Fuel <> "ALL-IN" && IsBlank(LookUp(nfFuel, Title = Fuel).FSC);

// FSC % applied to the base: library FSC + fuel add-on − fuel discount (percentage points).
FscPct(Fuel:Text, FAdj:Number, FDisc:Number, WithFuel:Boolean):Number =
    If(
        !WithFuel || IsBlank(Fuel) || Fuel = "ALL-IN" || FuelMissing(Fuel),
        0,
        LookUp(nfFuel, Title = Fuel).FSC + Coalesce(FAdj, 0) - Coalesce(FDisc, 0)
    );

// Fuel on base first, then add-on, then discount. AdjType/DiscType are "%" or "$".
LHCost(Base:Number, Fuel:Text, FAdj:Number, FDisc:Number, Adj:Number, AdjType:Text, Disc:Number, DiscType:Text, WithFuel:Boolean):Number =
    With(
        {x: Coalesce(Base, 0) * (1 + FscPct(Fuel, FAdj, FDisc, WithFuel) / 100)},
        With(
            {y: If(AdjType = "%", x * (1 + Coalesce(Adj, 0) / 100), x + Coalesce(Adj, 0))},
            If(DiscType = "%", y * (1 - Coalesce(Disc, 0) / 100), y - Coalesce(Disc, 0))
        )
    );
