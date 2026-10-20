# Rate entry: changes 3, 4 and 5 only

These edits go into your current Studio version of `scrEntry`. Nothing else changes.

## 3 · Breakdown shows a prompt until there is a cost

**entBdLeft → Text**
```powerfx
If(
    IsBlank(entCalc.Text),
    "Enter a base rate, equipment and fuel program to see how the cost is built.",
    With(
        {f: varFuel, fa: Coalesce(Value(entTxtFAdj.Text), 0), fd: Coalesce(Value(entTxtFDisc.Text), 0)},
        "Base" & Char(10) &
        If(
            f = "ALL-IN", "Fuel · all-in rate",
            FuelMissing(f), "Fuel · " & f & " has no FSC in the library",
            "Fuel · " & f & " " & Text(LookUp(nfFuel, Title = f).FSC, "0.00") & "%" &
            If(fa > 0, " + " & fa, "") & If(fd > 0, " − " & fd, "") &
            " = " & Text(FscPct(f, fa, fd, true), "0.00") & "%"
        ) & Char(10) &
        "Add-on" & Char(10) &
        "Discount" & Char(10) &
        "LH cost"
    )
)
```

**entBdLeft → Color**
```powerfx
If(IsBlank(entCalc.Text), clrInk3, clrInk2)
```

**entBdRight → Text:** change only the first two lines inside `If(`:
```powerfx
    !(!IsBlank(entCalc.Text)),
    "—",
```
to
```powerfx
    IsBlank(entCalc.Text),
    "",
```

## 4 · `$ | %` buttons instead of the switch

The two switches stay on the screen, hidden. Every formula still reads `entTglAdjPct.Value` and `entTglDiscPct.Value`, so nothing else needs to change.

**entTglAdjPct:** set `Visible` to `false` and `Default` to `varAdjPct`.
**entTglDiscPct:** set `Visible` to `false` and `Default` to `varDiscPct`.

**Paste into entFldAdjHead** (select the container, then Ctrl+V):
```yaml
- entSegAdj:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      BorderThickness: =0
      Fill: =clrClear
      FillPortions: =0
      Height: =18
      LayoutDirection: =LayoutDirection.Horizontal
      Width: =56
    Children:
      - entSegAdjAmt:
          Control: Classic/Button@2.2.0
          Properties:
            BorderColor: =clrLine
            BorderThickness: =0
            Color: =If(!varAdjPct, clrWhite, clrInk2)
            Fill: =If(!varAdjPct, clrBlue, clrSoft)
            FillPortions: =0
            Font: =Font.'Segoe UI'
            FontWeight: =FontWeight.Bold
            Height: =18
            HoverBorderColor: =clrInk3
            HoverColor: =If(!varAdjPct, clrWhite, clrInk)
            HoverFill: =If(!varAdjPct, clrBlue, clrSoft)
            OnSelect: =Set(varAdjPct, false); Reset(entTglAdjPct)
            PressedBorderColor: =clrInk3
            PressedColor: =clrWhite
            PressedFill: =clrBlue
            RadiusBottomLeft: =4
            RadiusTopLeft: =4
            Size: =9
            Text: ="$"
            Tooltip: ="Add-on in dollars"
            Width: =28
      - entSegAdjPct:
          Control: Classic/Button@2.2.0
          Properties:
            BorderColor: =clrLine
            BorderThickness: =0
            Color: =If(varAdjPct, clrWhite, clrInk2)
            Fill: =If(varAdjPct, clrBlue, clrSoft)
            FillPortions: =0
            Font: =Font.'Segoe UI'
            FontWeight: =FontWeight.Bold
            Height: =18
            HoverBorderColor: =clrInk3
            HoverColor: =If(varAdjPct, clrWhite, clrInk)
            HoverFill: =If(varAdjPct, clrBlue, clrSoft)
            OnSelect: =Set(varAdjPct, true); Reset(entTglAdjPct)
            PressedBorderColor: =clrInk3
            PressedColor: =clrWhite
            PressedFill: =clrBlue
            RadiusBottomRight: =4
            RadiusTopRight: =4
            Size: =9
            Text: ="%"
            Tooltip: ="Add-on in percent"
            Width: =28
```

**Paste into entFldDiscHead:**
```yaml
- entSegDisc:
    Control: GroupContainer@1.5.0
    Variant: AutoLayout
    Properties:
      BorderThickness: =0
      Fill: =clrClear
      FillPortions: =0
      Height: =18
      LayoutDirection: =LayoutDirection.Horizontal
      Width: =56
    Children:
      - entSegDiscAmt:
          Control: Classic/Button@2.2.0
          Properties:
            BorderColor: =clrLine
            BorderThickness: =0
            Color: =If(!varDiscPct, clrWhite, clrInk2)
            Fill: =If(!varDiscPct, clrBlue, clrSoft)
            FillPortions: =0
            Font: =Font.'Segoe UI'
            FontWeight: =FontWeight.Bold
            Height: =18
            HoverBorderColor: =clrInk3
            HoverColor: =If(!varDiscPct, clrWhite, clrInk)
            HoverFill: =If(!varDiscPct, clrBlue, clrSoft)
            OnSelect: =Set(varDiscPct, false); Reset(entTglDiscPct)
            PressedBorderColor: =clrInk3
            PressedColor: =clrWhite
            PressedFill: =clrBlue
            RadiusBottomLeft: =4
            RadiusTopLeft: =4
            Size: =9
            Text: ="$"
            Tooltip: ="Discount in dollars"
            Width: =28
      - entSegDiscPct:
          Control: Classic/Button@2.2.0
          Properties:
            BorderColor: =clrLine
            BorderThickness: =0
            Color: =If(varDiscPct, clrWhite, clrInk2)
            Fill: =If(varDiscPct, clrBlue, clrSoft)
            FillPortions: =0
            Font: =Font.'Segoe UI'
            FontWeight: =FontWeight.Bold
            Height: =18
            HoverBorderColor: =clrInk3
            HoverColor: =If(varDiscPct, clrWhite, clrInk)
            HoverFill: =If(varDiscPct, clrBlue, clrSoft)
            OnSelect: =Set(varDiscPct, true); Reset(entTglDiscPct)
            PressedBorderColor: =clrInk3
            PressedColor: =clrWhite
            PressedFill: =clrBlue
            RadiusBottomRight: =4
            RadiusTopRight: =4
            Size: =9
            Text: ="%"
            Tooltip: ="Discount in percent"
            Width: =28
```

**entBtnReset → OnSelect:** add this line at the very start:
```powerfx
Set(varAdjPct, false); Set(varDiscPct, false);
```

## 5 · "Active" sits next to its switch

**entTglActive:** set `AlignInContainer` to `AlignInContainer.Start` and `Width` to `150`.
