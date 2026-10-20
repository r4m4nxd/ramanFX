#!/usr/bin/env python3
"""Generates the Line-Haul Cost Collector screens as Power Apps paste YAML.

Run: python3 build.py  ->  writes scrEntry.yaml, scrRecent.yaml, scrDetails.yaml, scrFuel.yaml
Every formula below is plain Power Fx; this script only handles layout boilerplate.
"""
import pathlib
from textwrap import dedent

OUT = pathlib.Path(__file__).parent
FONT = "Font.'Segoe UI'"
NUM = r'"^(\d+\.?\d*|\.\d+)?$"'  # empty or a positive number: no $, %, minus or letters


# ---------------------------------------------------------------- emitter
def node(name, control, props, children=None, variant=None):
    return {"name": name, "control": control, "variant": variant, "props": props, "children": children or []}


def fx(src):
    return dedent(src).strip()


def fmt(key, val, ind):
    v, pad = str(val), " " * ind
    if any(t in v for t in ("\n", ": ", " #")):
        body = "\n".join((pad + "  " + l) if l.strip() else "" for l in ("=" + v).split("\n"))
        return f"{pad}{key}: |-\n{body}"
    return f"{pad}{key}: ={v}"


def emit(n, ind):
    pad = " " * ind
    out = [f"{pad}- {n['name']}:", f"{pad}    Control: {n['control']}"]
    if n["variant"]:
        out.append(f"{pad}    Variant: {n['variant']}")
    if n["props"]:
        out.append(f"{pad}    Properties:")
        out += [fmt(k, n["props"][k], ind + 6) for k in sorted(n["props"])]
    if n["children"]:
        out.append(f"{pad}    Children:")
        for c in n["children"]:
            out += emit(c, ind + 6)
    return out


def write_screen(name, props, children):
    out = ["Screens:", f"  {name}:", "    Properties:"]
    out += [fmt(k, props[k], 6) for k in sorted(props)]
    out.append("    Children:")
    for c in children:
        out += emit(c, 6)
    (OUT / f"{name}.yaml").write_text("\n".join(out) + "\n")


# ---------------------------------------------------------------- primitives
def s(text):
    return '"' + text.replace('"', '""') + '"'


def rad(r):
    return {"RadiusTopLeft": r, "RadiusTopRight": r, "RadiusBottomLeft": r, "RadiusBottomRight": r}


def pads(t, r=None, b=None, l=None):
    r = t if r is None else r
    return {"PaddingTop": t, "PaddingRight": r, "PaddingBottom": t if b is None else b, "PaddingLeft": r if l is None else l}


def fixed(w=None, h=None):
    p = {"FillPortions": 0}
    if w is not None:
        p["Width"] = w
    if h is not None:
        p["Height"] = h
    return p


def fill(fp=1, minw=40):
    return {"FillPortions": fp, "LayoutMinWidth": minw}


STRETCH = {"AlignInContainer": "AlignInContainer.Stretch"}


def box(name, direction, children, **p):
    base = {"LayoutDirection": f"LayoutDirection.{direction}", "LayoutGap": 0, "DropShadow": "DropShadow.None",
            "Fill": "clrClear", "BorderThickness": 0, **pads(0), **rad(0)}
    base.update(p)
    return node(name, "GroupContainer@1.5.0", base, children, "AutoLayout")


def manual(name, children, **p):
    base = {"DropShadow": "DropShadow.None", "Fill": "clrClear", "BorderThickness": 0, **rad(0)}
    base.update(p)
    return node(name, "GroupContainer@1.5.0", base, children, "ManualLayout")


def lbl(name, text, **p):
    base = {"Text": text, "Font": FONT, "Color": "clrInk", "Size": 10, "BorderThickness": 0,
            "VerticalAlign": "VerticalAlign.Middle", **pads(0)}
    base.update(p)
    return node(name, "Label@2.5.1", base)


def caps(name, text, **p):
    base = {"Size": 8.5, "FontWeight": "FontWeight.Bold", "Color": "clrInk3", "Height": 18}
    base.update(p)
    return lbl(name, s(text), **base)


def rect(name, **p):
    base = {"Fill": "clrLine", "BorderThickness": 0}
    base.update(p)
    return node(name, "Rectangle@2.3.0", base)


def btn(name, text, kind="secondary", **p):
    base = {"Text": text, "Font": FONT, "Size": 10.5, "FontWeight": "FontWeight.Semibold", "BorderThickness": 1,
            "DisabledFill": "clrSoft", "DisabledColor": "clrInk3", "DisabledBorderColor": "clrLine", **rad(5)}
    if kind == "primary":
        base.update(Fill="clrBlue", Color="clrWhite", BorderColor="clrBlue", HoverFill="clrBlueHover", HoverColor="clrWhite",
                    HoverBorderColor="clrBlueHover", PressedFill="clrInk", PressedColor="clrWhite", PressedBorderColor="clrInk")
    elif kind == "danger":
        base.update(Fill="clrPanel", Color="clrRed", BorderColor="clrLine", HoverFill="clrRedBg", HoverColor="clrRed",
                    HoverBorderColor="clrRed", PressedFill="clrRedBg", PressedColor="clrRed", PressedBorderColor="clrRed")
    else:
        base.update(Fill="clrPanel", Color="clrInk", BorderColor="clrLine", HoverFill="clrSoft", HoverColor="clrInk",
                    HoverBorderColor="clrInk3", PressedFill="clrLine", PressedColor="clrInk", PressedBorderColor="clrInk3")
    base.update(p)
    return node(name, "Classic/Button@2.2.0", base)


def pill(name, text, fillc, color, **p):
    base = {"Text": text, "Font": FONT, "Size": 8.5, "FontWeight": "FontWeight.Bold", "BorderThickness": 0, **rad(11),
            "Fill": fillc, "Color": color, "HoverFill": fillc, "HoverColor": color, "PressedFill": fillc, "PressedColor": color,
            "BorderColor": "clrClear", "HoverBorderColor": "clrClear", "PressedBorderColor": "clrClear", "Height": 22}
    base.update(p)
    return node(name, "Classic/Button@2.2.0", base)


def textin(name, hint="", **p):
    base = {"Default": s(""), "HintText": s(hint), "Font": FONT, "Size": 10.5, "Color": "clrInk", "Fill": "clrPanel",
            "BorderColor": "clrLine", "BorderThickness": 1, "HoverBorderColor": "clrInk3", "HoverFill": "clrPanel",
            "PressedBorderColor": "clrBlue", "PressedFill": "clrPanel", "Height": 38, **rad(5), **STRETCH}
    base.update(p)
    return node(name, "Classic/TextInput@2.3.2", base)


def numin(name, hint="0", **p):
    base = {"Format": "TextFormat.Number", "Align": "Align.Right",
            "BorderColor": f"If(IsMatch(Self.Text, {NUM}), clrLine, clrRed)"}
    base.update(p)
    return textin(name, hint, **base)


def combo(name, items, field, placeholder="Select…", **p):
    base = {"Items": items, "DisplayFields": f'["{field}"]', "SearchFields": f'["{field}"]', "SelectMultiple": "false",
            "IsSearchable": "true", "DefaultSelectedItems": "Blank()", "InputTextPlaceholder": s(placeholder),
            "Font": FONT, "Size": 10.5, "Color": "clrInk", "Fill": "clrPanel",
            "BorderColor": f"If(IsBlank(Self.Selected.{field}), clrAmber, clrLine)",
            "ChevronBackground": "clrPanel", "ChevronFill": "clrInk3", "ChevronHoverBackground": "clrSoft",
            "ChevronHoverFill": "clrInk", "HoverBorderColor": "clrInk3", "HoverFill": "clrSoft", "HoverColor": "clrInk",
            "PressedBorderColor": "clrBlue", "PressedFill": "clrBlue", "PressedColor": "clrWhite",
            "SelectionFill": "clrBlue", "SelectionColor": "clrWhite", "Height": 38, **STRETCH}
    base.update(p)
    return node(name, "Classic/ComboBox@2.4.0", base)


def toggle(name, true_text, false_text, default="false", **p):
    base = {"Default": default, "TrueText": s(true_text), "FalseText": s(false_text), "Font": FONT, "Size": 10,
            "FontWeight": "FontWeight.Semibold", "Color": "clrInk", "TrueFill": "clrBlue", "TrueHoverFill": "clrBlueHover",
            "FalseFill": "RGBA(190, 200, 210, 1)", "FalseHoverFill": "clrInk3", "HandleFill": "clrWhite",
            "TextPosition": "TextPosition.Right", "BorderThickness": 0}
    base.update(p)
    return node(name, "Classic/Toggle@2.1.0", base)


def datepick(name, default, **p):
    base = {"DefaultDate": default, "Font": FONT, "Size": 10.5, "Color": "clrInk", "Fill": "clrPanel",
            "BorderColor": "clrLine", "BorderThickness": 1, "IconBackground": "clrBlue", "IconFill": "clrWhite",
            "Height": 38, **STRETCH}
    base.update(p)
    return node(name, "Classic/DatePicker@2.6.0", base)


# ---------------------------------------------------------------- composites
def field(name, label, controls, fp=1, head=None):
    top = caps(name + "Lbl", label, **STRETCH) if head is None else box(
        name + "Head", "Horizontal", [caps(name + "Lbl", label, **fill(1, 40))] + head,
        Height=18, LayoutGap=6, LayoutAlignItems="LayoutAlignItems.Center", **STRETCH, **fixed())
    return box(name, "Vertical", [top] + controls, LayoutGap=4, **fill(fp, 100), **STRETCH)


def row(name, height, children, gap=12, **p):
    return box(name, "Horizontal", children, Height=height, LayoutGap=gap, **fixed(), **STRETCH, **p)


def section(name, num, title, hint, body, height=None, head_extra=(), body_pad=16, body_gap=12, **p):
    size = {"Height": height, "FillPortions": 0} if height is not None else {"FillPortions": 1}
    head = box(name + "Head", "Horizontal", [
        lbl(name + "Num", s(num), Fill="clrInk", Color="clrWhite", Size=9, FontWeight="FontWeight.Bold",
            Align="Align.Center", **fixed(24, 24)),
        lbl(name + "Title", title, Size=12, FontWeight="FontWeight.Bold", **fixed(150, 30)),
        lbl(name + "Hint", hint, Size=9, Color="clrInk3", Height=30, **fill(1)),
        *head_extra,
    ], Height=48, LayoutGap=12, LayoutAlignItems="LayoutAlignItems.Center", **pads(0, 16), **fixed(), **STRETCH)
    inner = box(name + "Body", "Vertical", body, LayoutGap=body_gap, **pads(body_pad, 16), **fill(1), **STRETCH)
    base = {"Fill": "clrPanel", "BorderColor": "clrLine", "BorderThickness": 1, **rad(6), **size, **STRETCH}
    base.update(p)
    return box(name, "Vertical", [head, rect(name + "Sep", Height=1, **fixed(), **STRETCH), inner], **base)


def fact(name, key, value, edge="clrBlue"):
    return manual(name, [
        rect(name + "Edge", Fill=edge, X=0, Y=0, Width=3, Height="Parent.Height"),
        lbl(name + "K", s(key.upper()), Size=8, FontWeight="FontWeight.Bold", Color="clrInk3",
            X=12, Y=7, Width="Parent.Width - 16", Height=16),
        lbl(name + "V", value, Size=10.5, FontWeight="FontWeight.Semibold",
            X=12, Y=25, Width="Parent.Width - 16", Height=24),
    ], Fill="clrSoft", Height=56, RadiusTopRight=3, RadiusBottomRight=3, **fill(1, 80), **STRETCH)


def cost_tile(name, key, value, main=False, fp=1):
    return box(name, "Vertical", [
        lbl(name + "K", s(key.upper()), Size=8, FontWeight="FontWeight.Bold", Color="clrInk3", Height=16, **STRETCH),
        lbl(name + "V", value, Size=17 if main else 13, FontWeight="FontWeight.Bold", Height=32, **STRETCH),
    ], Fill="clrSoft" if main else "clrPanel", BorderColor="clrLine", BorderThickness=1, **rad(6),
        **pads(6, 12), **fill(fp, 90), **STRETCH)


def rail(p, current):
    items = [("New", "New rate", "Icon.Edit", "scrEntry"),
             ("Recent", "Recent", "Icon.DetailList", "scrRecent"),
             ("Fuel", "Fuel library", "Icon.Money", "scrFuel")]
    navs = []
    for key, text, icon, scr in items:
        on = key == current
        go = f"Navigate({scr}, ScreenTransition.None)"
        navs.append(box(f"{p}Nav{key}", "Vertical", [
            node(f"{p}Nav{key}Icon", "Classic/Icon@2.5.0", {
                "Icon": icon, "Color": "clrOrange" if on else "clrRailInk", "HoverColor": "clrWhite",
                "PressedColor": "clrWhite", "OnSelect": go, "Tooltip": s(text), "Width": 26, "Height": 26,
                "FillPortions": 0}),
            lbl(f"{p}Nav{key}Text", s(text), Size=8.5, FontWeight="FontWeight.Semibold",
                Color="clrWhite" if on else "clrRailInk", Align="Align.Center", OnSelect=go, **fixed(74, 18)),
        ], Fill="clrRailOn" if on else "clrClear", LayoutGap=3, LayoutAlignItems="LayoutAlignItems.Center",
            LayoutJustifyContent="LayoutJustifyContent.Center", **rad(6), **fixed(74, 64)))
    return box(f"{p}Rail", "Vertical", [
        node(f"{p}Logo", "Image@2.2.3", {"Image": "'cff logo'", "ImagePosition": "ImagePosition.Fit",
                                          "Width": 48, "Height": 48, "FillPortions": 0}),
        rect(f"{p}RailGap", Fill="clrClear", **fixed(10, 10)),
        *navs,
    ], Fill="clrRail", LayoutGap=6, LayoutAlignItems="LayoutAlignItems.Center", **pads(14, 5),
        **fixed(84), LayoutMinWidth=84, **STRETCH)


def header(p, step, right):
    return box(f"{p}Header", "Horizontal", [
        lbl(f"{p}HdrTitle", s("Line-Haul Rates"), Size=15, FontWeight="FontWeight.Semibold", **fixed(160, 36)),
        rect(f"{p}HdrDiv", **fixed(1, 24)),
        lbl(f"{p}HdrStep", step, Size=11, Color="clrInk3", Height=36, **fill(1)),
        lbl(f"{p}HdrUser", 'User().FullName & " · " & Text(Today(), "mmm d, yyyy")', Size=9, Color="clrInk2",
            FontWeight="FontWeight.Semibold", Align="Align.Right", **fixed(210, 36)),
        *right,
    ], Fill="clrPanel", Height=60, LayoutGap=14, LayoutAlignItems="LayoutAlignItems.Center",
        DropShadow="DropShadow.Light", **pads(0, 16, 0, 20), **fixed(), **STRETCH)


def shell(p, current, step, right, body, action=None):
    main = [header(p, step, right), body] + ([action] if action else [])
    return box(f"{p}Root", "Horizontal", [
        rail(p, current),
        box(f"{p}Main", "Vertical", main, Fill="clrPage", **fill(1, 300), **STRETCH),
    ], Fill="clrPage", X=0, Y=0, Width="Parent.Width", Height="Parent.Height")


def body(p, children, scroll=True, gap=14):
    extra = {"LayoutOverflowY": "LayoutOverflow.Scroll"} if scroll else {}
    return box(f"{p}Body", "Vertical", children, LayoutGap=gap, **pads(16), **fill(1), **STRETCH, **extra)


def hidden(name, text):
    return lbl(name, text, Visible="false", X=0, Y=0, Width=10, Height=10)


# ================================================================ ENTRY
E_ADJ = 'If(entTglAdjPct.Value, "%", "$")'
E_DISC = 'If(entTglDiscPct.Value, "%", "$")'

entry_errors = fx(f"""
    With(
        {{
            miss: Concat(
                Filter(
                    Table(
                        {{f: "Origin", ok: !IsBlank(entCmbOrigin.Selected.Value)}},
                        {{f: "Destination", ok: !IsBlank(entCmbDest.Selected.Value)}},
                        {{f: "Mode", ok: !IsBlank(entCmbMode.Selected.Value)}},
                        {{f: "Equipment", ok: !IsBlank(entCmbEquip.Selected.Value)}},
                        {{f: "Carrier", ok: !IsBlank(entCmbCarrier.Selected.Title)}},
                        {{f: "Service days", ok: CountRows(colDays) > 0}},
                        {{f: "Base rate", ok: !IsBlank(Trim(entTxtBase.Text))}},
                        {{f: "Fuel program", ok: !IsBlank(entCmbFuel.Selected.Title)}}
                    ),
                    !ok
                ),
                f,
                ", "
            )
        }},
        Trim(
            If(!IsBlank(miss), "Still needed: " & miss & ". ", "") &
            If(entNumOk.Text <> "ok", "Cost fields take numbers only (no $, % or minus). ", "") &
            If(
                IsBlank(entDteEff.SelectedDate) || IsBlank(entDteExpiry.SelectedDate) ||
                entDteExpiry.SelectedDate <= entDteEff.SelectedDate,
                "Expiry must be after the effective date. ", ""
            ) &
            If(
                entNumOk.Text = "ok" && entTglDiscPct.Value && Coalesce(Value(entTxtDisc.Text), 0) >= 100,
                "A % discount must be under 100. ", ""
            )
        )
    )
""")

entry_numok = fx(f"""
    If(
        IsMatch(entTxtBase.Text, {NUM}) &&
        IsMatch(entTxtAdj.Text, {NUM}) &&
        IsMatch(entTxtDisc.Text, {NUM}) &&
        IsMatch(entTxtFAdj.Text, {NUM}) &&
        IsMatch(entTxtFDisc.Text, {NUM}),
        "ok",
        ""
    )
""")

entry_calc = fx(f"""
    If(
        entNumOk.Text = "ok" && !IsBlank(Trim(entTxtBase.Text)) &&
        !IsBlank(entCmbFuel.Selected.Title) && !IsBlank(entCmbEquip.Selected.Value),
        Text(
            LHCost(
                Value(entTxtBase.Text), entCmbFuel.Selected.Title,
                Value(entTxtFAdj.Text), Value(entTxtFDisc.Text),
                Value(entTxtAdj.Text), {E_ADJ},
                Value(entTxtDisc.Text), {E_DISC},
                true
            )
        ),
        ""
    )
""")


def entry_tile_value(divisor=None):
    v = "Value(entCalc.Text)" + (f" / {divisor}(entCmbEquip.Selected.Value)" if divisor else "")
    return f'If(IsBlank(entCalc.Text), "—", Text({v}, "$#,##0.00"))'


entry_key = fx("""
    If(
        IsBlank(entCmbOrigin.Selected.Value) || IsBlank(entCmbDest.Selected.Value) ||
        IsBlank(entCmbCarrier.Selected.Title) || IsBlank(entCmbMode.Selected.Value) ||
        IsBlank(entCmbEquip.Selected.Value),
        "—",
        entCmbOrigin.Selected.Value & entCmbDest.Selected.Value & "-" & entCmbCarrier.Selected.Title & "-" &
        entCmbMode.Selected.Value & "-" & entCmbEquip.Selected.Value
    )
""")

entry_replace = fx("""
    If(
        !entTglActive.Value || entLblKey.Text = "—",
        "",
        With(
            {
                p: LookUp(
                    LinehaulRates,
                    Title = entCmbOrigin.Selected.Value &&
                    Destination = entCmbDest.Selected.Value &&
                    Carrier = entCmbCarrier.Selected.Title &&
                    Mode = entCmbMode.Selected.Value &&
                    Equipment = entCmbEquip.Selected.Value &&
                    Active = true
                )
            },
            If(
                IsBlank(p),
                "",
                "⚠ Saving switches off the current active rate for this lane (base " &
                Text(p.Base, "$#,##0.00") & ", added " & Text(p.Timestamp, "mmm d, yyyy") & ")."
            )
        )
    )
""")

entry_fsc_today = fx("""
    With(
        {f: entCmbFuel.Selected.Title},
        If(
            IsBlank(f), "—",
            f = "ALL-IN", "All-in rate",
            FuelMissing(f), "Not in library",
            Text(LookUp(nfFuel, Title = f).FSC, "0.00") & "%"
        )
    )
""")

entry_fsc_applied = fx("""
    If(
        IsBlank(entCmbFuel.Selected.Title) || entNumOk.Text <> "ok",
        "—",
        Text(FscPct(entCmbFuel.Selected.Title, Value(entTxtFAdj.Text), Value(entTxtFDisc.Text), true), "0.00") & "%"
    )
""")

entry_equip = fx("""
    With(
        {e: entCmbEquip.Selected.Value},
        If(
            IsBlank(e), "—",
            EquipFt(e) & " ft · " & Text(CubicFt(e), "#,##0") & " ft³ · " & SkidSpots(e) & " skids"
        )
    )
""")


def breakdown_left(fuel, fadj, fdisc, with_fuel):
    return fx(f"""
        With(
            {{f: {fuel}, fa: Coalesce({fadj}, 0), fd: Coalesce({fdisc}, 0)}},
            "Base" & Char(10) &
            If(
                IsBlank(f), "Fuel",
                f = "ALL-IN", "Fuel · all-in rate",
                FuelMissing(f), "Fuel · " & f & " has no FSC in the library",
                !({with_fuel}), "Fuel · excluded",
                "Fuel · " & f & " " & Text(LookUp(nfFuel, Title = f).FSC, "0.00") & "%" &
                If(fa > 0, " + " & fa, "") & If(fd > 0, " − " & fd, "") &
                " = " & Text(FscPct(f, fa, fd, true), "0.00") & "%"
            ) & Char(10) &
            "Add-on" & Char(10) &
            "Discount" & Char(10) &
            "LH cost"
        )
    """)


def breakdown_right(ready, base, fuel, fadj, fdisc, adj, adj_pct, disc, disc_pct, with_fuel):
    return fx(f"""
        If(
            !({ready}),
            "—",
            With(
                {{b: Coalesce({base}, 0), fsc: FscPct({fuel}, {fadj}, {fdisc}, {with_fuel})}},
                With(
                    {{x: b * (1 + fsc / 100)}},
                    With(
                        {{a: If({adj_pct}, x * Coalesce({adj}, 0) / 100, Coalesce({adj}, 0))}},
                        With(
                            {{d: If({disc_pct}, (x + a) * Coalesce({disc}, 0) / 100, Coalesce({disc}, 0))}},
                            Text(b, "$#,##0.00") & Char(10) &
                            "+ " & Text(x - b, "$#,##0.00") & Char(10) &
                            "+ " & Text(a, "$#,##0.00") & Char(10) &
                            "− " & Text(d, "$#,##0.00") & Char(10) &
                            Text(x + a - d, "$#,##0.00")
                        )
                    )
                )
            )
        )
    """)


def breakdown(p, left, right):
    return field(f"{p}Bd", "How the cost is built", [
        box(f"{p}BdRow", "Horizontal", [
            lbl(f"{p}BdLeft", left, Size=9.5, Color="clrInk2", VerticalAlign="VerticalAlign.Top", Wrap="true",
                Height=96, **fill(1)),
            lbl(f"{p}BdRight", right, Size=9.5, FontWeight="FontWeight.Semibold", Align="Align.Right",
                VerticalAlign="VerticalAlign.Top", **fixed(150, 96)),
        ], Height=96, LayoutGap=12, **fixed(), **STRETCH),
    ])


entry_save = fx("""
    If(
        !IsBlank(entLblErrors.Text),
        Notify(entLblErrors.Text, NotificationType.Error),
        With(
            {
                n: Patch(
                    LinehaulRates,
                    Defaults(LinehaulRates),
                    {
                        Title: entCmbOrigin.Selected.Value,
                        Destination: entCmbDest.Selected.Value,
                        Mode: entCmbMode.Selected.Value,
                        Carrier: entCmbCarrier.Selected.Title,
                        Equipment: entCmbEquip.Selected.Value,
                        Fuel: entCmbFuel.Selected.Title,
                        ServiceDays: If(
                            "ALL" in colDays.Value,
                            "ALL",
                            Concat(Filter(nfDays, Value in colDays.Value), Value, ";")
                        ),
                        EffectiveDate: entDteEff.SelectedDate,
                        ExpiryDate: entDteExpiry.SelectedDate,
                        Base: Value(entTxtBase.Text),
                        Adj: Value(entTxtAdj.Text),
                        AdjType: If(IsBlank(Trim(entTxtAdj.Text)), "", If(entTglAdjPct.Value, "%", "$")),
                        Discount: Value(entTxtDisc.Text),
                        DiscountType: If(IsBlank(Trim(entTxtDisc.Text)), "", If(entTglDiscPct.Value, "%", "$")),
                        F_Adj: Value(entTxtFAdj.Text),
                        F_AdjType: If(IsBlank(Trim(entTxtFAdj.Text)), "", "%"),
                        F_Discount: Value(entTxtFDisc.Text),
                        F_DiscountType: If(IsBlank(Trim(entTxtFDisc.Text)), "", "%"),
                        Comments: entTxtNotes.Text,
                        Active: entTglActive.Value,
                        SubmittedBy: User().FullName,
                        SubmittedEmail: User().Email,
                        Timestamp: Now()
                    }
                )
            },
            If(
                IsError(n) || IsBlank(n.ID),
                Notify("The rate wasn't saved. Check your connection and try again.", NotificationType.Error),
                If(
                    n.Active,
                    ForAll(
                        Filter(
                            Filter(
                                LinehaulRates,
                                Title = n.Title && Destination = n.Destination && Carrier = n.Carrier &&
                                Mode = n.Mode && Equipment = n.Equipment && Active = true
                            ),
                            ID <> n.ID
                        ) As old,
                        Patch(LinehaulRates, old, {Active: false})
                    )
                );
                Notify("Rate saved for " & n.Title & n.Destination & " " & n.Carrier & ".", NotificationType.Success);
                Select(entBtnReset)
            )
        )
    )
""")

entry_reset = fx("""
    Reset(entCmbOrigin); Reset(entCmbDest); Reset(entCmbMode); Reset(entCmbEquip);
    Reset(entCmbCarrier); Reset(entCmbFuel);
    Reset(entDteEff); Reset(entDteExpiry); Reset(entTglActive);
    Reset(entTxtBase); Reset(entTxtAdj); Reset(entTglAdjPct); Reset(entTxtDisc); Reset(entTglDiscPct);
    Reset(entTxtFAdj); Reset(entTxtFDisc); Reset(entTxtNotes); Reset(entTxtNewCarrier);
    Clear(colDays);
    Set(varAddCarrier, false)
""")

entry_add_carrier = fx("""
    With(
        {c: Upper(Trim(entTxtNewCarrier.Text))},
        If(
            IsBlank(c),
            Notify("Type a carrier name first.", NotificationType.Warning),
            !IsBlank(LookUp(Carriers, Title = c)),
            Notify(c & " is already in the list.", NotificationType.Warning),
            Patch(Carriers, Defaults(Carriers), {Title: c});
            Notify(c & " added. Pick it from the list.", NotificationType.Success);
            Reset(entTxtNewCarrier);
            Set(varAddCarrier, false)
        )
    )
""")

day_select = fx("""
    With(
        {d: Self.Text},
        If(
            d = "ALL",
            If("ALL" in colDays.Value, Clear(colDays), ClearCollect(colDays, {Value: "ALL"})),
            RemoveIf(colDays, Value = "ALL");
            If(d in colDays.Value, RemoveIf(colDays, Value = d), Collect(colDays, {Value: d}))
        )
    )
""")


def day_chip(day):
    on = "Self.Text in colDays.Value"
    return btn(f"entDay{day.title()}", s(day), Size=9, OnSelect=day_select, **rad(15), **fixed(54, 30),
               Fill=f"If({on}, clrBlue, clrPanel)", Color=f"If({on}, clrWhite, clrInk2)",
               BorderColor=f"If({on}, clrBlue, clrLine)", HoverFill=f"If({on}, clrBlueHover, clrSoft)",
               HoverColor=f"If({on}, clrWhite, clrInk)", PressedFill="clrBlue", PressedColor="clrWhite")


def pct_toggle(name):
    return toggle(name, "%", "$", Size=9, FontWeight="FontWeight.Bold", **fixed(64, 18))


def unit(name, text):
    return lbl(name, s(text), Fill="clrSoft", BorderColor="clrLine", BorderThickness=1, Color="clrInk3",
               FontWeight="FontWeight.Bold", Align="Align.Center", **fixed(40, 38))


lane_section = section("entSecLane", "1", s("Lane"), s("Who moves it, where, on what"), height="If(entLblReplace.Visible, 422, 376)", body=[
    row("entRowLane1", 60, [
        field("entFldOrigin", "Origin *", [combo("entCmbOrigin", "nfTerminals", "Value")]),
        field("entFldDest", "Destination *", [combo("entCmbDest", "nfTerminals", "Value")]),
        field("entFldMode", "Mode *", [combo("entCmbMode", "nfModes", "Value")]),
        field("entFldEquip", "Equipment *", [combo("entCmbEquip", "nfEquipment", "Value")]),
    ]),
    row("entRowLane2", 96, [
        field("entFldCarrier", "Carrier *", [
            row("entCarrierRow", 38, [
                combo("entCmbCarrier", "Sort(Carriers, Title, SortOrder.Ascending)", "Title",
                      placeholder="Select carrier…", Visible="!varAddCarrier", **fill(1)),
                textin("entTxtNewCarrier", "New carrier name", Visible="varAddCarrier", **fill(1)),
                btn("entBtnAddCarrier", s("+"), Size=14, Tooltip=s("Add a carrier"), Visible="!varAddCarrier",
                    OnSelect="Set(varAddCarrier, true)", **fixed(38, 38)),
                btn("entBtnSaveCarrier", s("Add"), "primary", Visible="varAddCarrier",
                    OnSelect=entry_add_carrier, **fixed(60, 38)),
                btn("entBtnCancelCarrier", s("✕"), Visible="varAddCarrier", Tooltip=s("Cancel"),
                    OnSelect="Reset(entTxtNewCarrier); Set(varAddCarrier, false)", **fixed(38, 38)),
            ], gap=6),
        ]),
        field("entFldDays", "Service days *", [
            box("entDays", "Horizontal", [day_chip(d) for d in
                                          ["ALL", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]],
                LayoutWrap="true", LayoutGap=6, Height=70, **fixed(), **STRETCH),
        ], fp=1.3),
    ]),
    row("entRowLane3", 60, [
        field("entFldEff", "Effective *", [datepick("entDteEff", "Date(Year(Today()), 1, 1)")]),
        field("entFldExpiry", "Expiry *", [datepick(
            "entDteExpiry",
            "DateAdd(Date(Year(entDteEff.SelectedDate) + 1, Month(entDteEff.SelectedDate), 1), -1, TimeUnit.Days)")]),
        field("entFldActive", "Active rate", [toggle("entTglActive", "Yes, use this rate", "No, keep for reference",
                                                     default="true", Height=38, **STRETCH)]),
    ]),
    row("entRowKey", 28, [
        caps("entKeyLbl", "Lane key", **fixed(80, 28)),
        lbl("entLblKey", entry_key, Size=10, FontWeight="FontWeight.Semibold", Height=28, **fill(1)),
    ], LayoutAlignItems="LayoutAlignItems.Center"),
    lbl("entLblReplace", entry_replace, Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk",
        BorderColor="RGBA(233, 215, 155, 1)", BorderThickness=1, Size=9.5, Wrap="true", **pads(0, 12),
        **fixed(h=34), **STRETCH),
])

cost_section = section("entSecCost", "2", s("Cost"), s("Fuel goes on the base first, then add-on, then discount"), height=520, body=[
    row("entRowCost1", 60, [
        field("entFldBase", "Base rate *", [row("entBaseRow", 38, [
            unit("entBaseUnit", "$"),
            numin("entTxtBase", "0.00", **fill(1),
                  BorderColor=f"If(!IsMatch(Self.Text, {NUM}), clrRed, IsBlank(Trim(Self.Text)), clrAmber, clrLine)"),
        ], gap=6)]),
        field("entFldAdj", "Add-on", [numin("entTxtAdj")], head=[pct_toggle("entTglAdjPct")]),
        field("entFldDisc", "Discount", [numin("entTxtDisc")], head=[pct_toggle("entTglDiscPct")]),
    ]),
    row("entRowCost2", 60, [
        field("entFldFuel", "Fuel program *", [combo("entCmbFuel", "Sort(FuelLibrary, Title, SortOrder.Ascending)", "Title")]),
        field("entFldFAdj", "Fuel add-on", [row("entFAdjRow", 38, [numin("entTxtFAdj", **fill(1)), unit("entFAdjUnit", "pts")], gap=6)]),
        field("entFldFDisc", "Fuel discount", [row("entFDiscRow", 38, [numin("entTxtFDisc", **fill(1)), unit("entFDiscUnit", "pts")], gap=6)]),
    ]),
    row("entRowFacts", 56, [
        fact("entFactFsc", "FSC today", entry_fsc_today),
        fact("entFactFscApplied", "FSC applied", entry_fsc_applied),
        fact("entFactEquip", "Equipment", entry_equip),
    ], gap=8),
    field("entFldNotes", "Comments", [textin("entTxtNotes", "Anything the next person should know about this rate",
                                             Mode="TextMode.MultiLine", Height=64, EnableSpellCheck="true")]),
    breakdown("ent",
              breakdown_left("entCmbFuel.Selected.Title", "Value(entTxtFAdj.Text)", "Value(entTxtFDisc.Text)", "true"),
              breakdown_right("!IsBlank(entCalc.Text)", "Value(entTxtBase.Text)", "entCmbFuel.Selected.Title",
                              "Value(entTxtFAdj.Text)", "Value(entTxtFDisc.Text)", "Value(entTxtAdj.Text)",
                              "entTglAdjPct.Value", "Value(entTxtDisc.Text)", "entTglDiscPct.Value", "true")),
])

entry_action = box("entActionWrap", "Vertical", [
    box("entAction", "Vertical", [
        row("entTiles", 62, [
            cost_tile("entTileLH", "LH cost · fuel in", entry_tile_value(), main=True, fp=1.4),
            cost_tile("entTileFt3", "per ft³", entry_tile_value("CubicFt")),
            cost_tile("entTileLin", "per linear ft", entry_tile_value("EquipFt")),
            cost_tile("entTileSkid", "per skid spot", entry_tile_value("SkidSpots")),
        ], gap=10),
        row("entActRow", 40, [
            lbl("entLblStatus", 'If(IsBlank(entLblErrors.Text), "✓ Ready to save", entLblErrors.Text)',
                Color="If(IsBlank(entLblErrors.Text), clrGreenInk, clrAmberInk)", Size=9.5,
                FontWeight="FontWeight.Semibold", Wrap="true", Height=40, **fill(1)),
            btn("entBtnReset", s("Reset"), "danger", OnSelect=entry_reset, **fixed(100, 40)),
            btn("entBtnSave", s("Save rate"), "primary", OnSelect=entry_save,
                DisplayMode="If(IsBlank(entLblErrors.Text), DisplayMode.Edit, DisplayMode.Disabled)", **fixed(140, 40)),
        ], gap=10, LayoutAlignItems="LayoutAlignItems.Center"),
    ], Fill="clrPanel", BorderColor="clrLine", BorderThickness=1, **rad(6), LayoutGap=10, **pads(12, 16),
        **fill(1), **STRETCH),
], Height=160, **pads(0, 16, 16, 16), **fixed(), **STRETCH)

write_screen("scrEntry", {"Fill": "clrPage"}, [
    shell("ent", "New", s("New rate"),
          [btn("entHdrBtnRecent", s("Recent entries"), OnSelect="Navigate(scrRecent, ScreenTransition.None)",
               **fixed(140, 38))],
          body("ent", [lane_section, cost_section]),
          entry_action),
    hidden("entLblErrors", entry_errors),
    hidden("entNumOk", entry_numok),
    hidden("entCalc", entry_calc),
])


# ================================================================ RECENT
recent_items = fx("""
    With(
        {
            l: Upper(Trim(recTxtLane.Text)),
            c: Upper(Trim(recTxtCarrier.Text)),
            m: Upper(Trim(recTxtMode.Text)),
            e: Upper(Trim(recTxtEquip.Text))
        },
        AddColumns(
            Filter(
                Sort(
                    Filter(
                        LinehaulRates,
                        ExpiryDate >= Today(),
                        StartsWith(Title, Left(l, 2)),
                        StartsWith(Destination, Mid(l, 3, 2)),
                        StartsWith(Carrier, c),
                        StartsWith(Mode, m),
                        !recTglActive.Value || Active = true
                    ),
                    Timestamp,
                    SortOrder.Descending
                ),
                IsBlank(e) || e in Equipment
            ),
            LH, LHCost(Base, Fuel, F_Adj, F_Discount, Adj, AdjType, Discount, DiscountType, recTglFuel.Value),
            NoFSC, recTglFuel.Value && FuelMissing(Fuel)
        )
    )
""")

# column: (key, header, x fraction, width fraction, align)
REC_COLS = [
    ("Lane", "Lane", 0.00, 0.10, "Left"),
    ("Carrier", "Carrier", 0.10, 0.15, "Left"),
    ("Mode", "Mode", 0.25, 0.11, "Left"),
    ("Equip", "Equipment", 0.36, 0.17, "Left"),
    ("LH", "LH cost", 0.53, 0.11, "Right"),
    ("Ft3", "$/ft³", 0.64, 0.09, "Right"),
    ("Status", "Status", 0.73, 0.12, "Left"),
    ("Added", "Added", 0.85, 0.15, "Left"),
]
REC_TEXT = {
    "Lane": 'ThisItem.Title & " → " & ThisItem.Destination',
    "Carrier": "ThisItem.Carrier",
    "Mode": "ThisItem.Mode",
    "Equip": "ThisItem.Equipment",
    "LH": 'Text(ThisItem.LH, "$#,##0.00") & If(ThisItem.NoFSC, " ⚠", "")',
    "Ft3": 'Text(ThisItem.LH / CubicFt(ThisItem.Equipment), "$#,##0.00")',
    "Added": 'Text(ThisItem.Timestamp, "mmm d, h:mm AM/PM")',
}


def rec_template():
    kids = []
    for key, _, x, w, align in REC_COLS:
        if key == "Status":
            kids.append(pill("recRowStatus", 'If(ThisItem.Active, "Active", "Inactive")',
                             "If(ThisItem.Active, clrGreenBg, clrSoft)", "If(ThisItem.Active, clrGreenInk, clrInk3)",
                             OnSelect="Select(Parent)", X=f"Parent.TemplateWidth * {x} + 8", Y=12, Width=74))
            continue
        kids.append(lbl(f"recRow{key}", REC_TEXT[key], OnSelect="Select(Parent)",
                        Size=8.5 if key == "Added" else 10,
                        FontWeight="FontWeight.Bold" if key == "Lane" else "FontWeight.Normal",
                        Color="If(ThisItem.NoFSC, clrAmberInk, clrInk)" if key == "LH" else
                        ("clrInk3" if key == "Added" else "clrInk"),
                        Align=f"Align.{align}", PaddingLeft=10, PaddingRight=10,
                        X=f"Parent.TemplateWidth * {x}", Y=0, Width=f"Parent.TemplateWidth * {w}", Height=46))
    kids.append(rect("recRowSep", Fill="clrSoft", X=0, Y=45, Width="Parent.TemplateWidth", Height=1))
    return kids


rec_header = manual("recColHdr", [
    *[caps(f"recHdr{key}", head, Align=f"Align.{align}", PaddingLeft=10, PaddingRight=10,
           X=f"Parent.Width * {x}", Y=8, Width=f"Parent.Width * {w}") for key, head, x, w, align in REC_COLS],
    rect("recHdrLine", Fill="clrBlue", X=0, Y=34, Width="Parent.Width", Height=2),
], Fill="clrPanel", Height=36, **fixed(), **STRETCH)

recent_body = body("rec", [
    row("recFilters", 36, [
        textin(f"recTxt{k}", hint, Height=36, **fill(1)) for k, hint in
        [("Lane", "Lane, e.g. TOWI"), ("Carrier", "Carrier"), ("Mode", "Mode"), ("Equip", "Equipment, e.g. 53")]
    ], gap=8),
    row("recCtl", 32, [
        toggle("recTglActive", "Active only", "Active only", **fixed(150, 30)),
        toggle("recTglFuel", "Include fuel", "Include fuel", **fixed(150, 30)),
        btn("recBtnClear", s("Clear filters"), Size=9.5,
            OnSelect="Reset(recTxtLane); Reset(recTxtCarrier); Reset(recTxtMode); Reset(recTxtEquip); Reset(recTglActive)",
            **fixed(120, 30)),
        lbl("recLblCount", fx("""
            CountRows(recGallery.AllItems) & If(CountRows(recGallery.AllItems) = 1, " rate", " rates") &
            " · fuel " & If(recTglFuel.Value, "included", "excluded")
        """), Size=9, Color="clrInk3", Align="Align.Right", Height=30, **fill(1)),
    ], gap=16, LayoutAlignItems="LayoutAlignItems.Center"),
    box("recTable", "Vertical", [
        rec_header,
        node("recGallery", "Gallery@2.15.0", {
            "Items": recent_items, "TemplateSize": 46, "TemplatePadding": 0,
            "TemplateFill": "If(ThisItem.IsSelected, clrSoft, clrPanel)", "BorderThickness": 0,
            "OnSelect": "Set(varRate, ThisItem); Navigate(scrDetails, ScreenTransition.None)",
            "ShowScrollbar": "true", **fill(1), **STRETCH,
        }, rec_template(), "BrowseLayout_Vertical_TwoTextOneImageVariant_ver5.0"),
        lbl("recLblEmpty", s("No rates match these filters. Clear filters to see everything."),
            Visible="IsEmpty(recGallery.AllItems)", Color="clrInk3", Align="Align.Center", **fixed(h=60), **STRETCH),
    ], Fill="clrPanel", BorderColor="clrLine", BorderThickness=1, **rad(6), **fill(1), **STRETCH),
], scroll=False, gap=10)

write_screen("scrRecent", {"Fill": "clrPage"}, [
    shell("rec", "Recent", s("Recent entries · newest first, expired rates hidden"),
          [btn("recHdrBtnNew", s("+ New rate"), "primary", OnSelect="Navigate(scrEntry, ScreenTransition.None)",
               **fixed(130, 38))],
          recent_body),
])


# ================================================================ DETAILS
R = "varRate"


def money_or_dash(v, t):
    return f'If(Coalesce({R}.{v}, 0) = 0, "—", If({R}.{t} = "%", Text({R}.{v}) & "%", Text({R}.{v}, "$#,##0.00")))'


def pts_or_dash(v):
    return f'If(Coalesce({R}.{v}, 0) = 0, "—", Text({R}.{v}) & " pts")'


DET_LH = (f"LHCost({R}.Base, {R}.Fuel, {R}.F_Adj, {R}.F_Discount, {R}.Adj, {R}.AdjType, "
          f"{R}.Discount, {R}.DiscountType, detTglFuel.Value)")


def det_tile_value(divisor=None):
    v = DET_LH + (f" / {divisor}({R}.Equipment)" if divisor else "")
    return f'If(IsBlank({R}.Base), "—", Text({v}, "$#,##0.00"))'


det_hero = row("detHero", 44, [
    lbl("detLblLane", f'{R}.Title & "  →  " & {R}.Destination', Size=20, FontWeight="FontWeight.Bold", **fixed(150, 44)),
    pill("detChipCarrier", f"{R}.Carrier", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(140, 26)),
    pill("detChipMode", f"{R}.Mode", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(100, 26)),
    pill("detChipEquip", f"{R}.Equipment", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(170, 26)),
    rect("detHeroSpacer", Fill="clrClear", Height=10, **fill(1, 0)),
    pill("detStatus", f'If({R}.Active, "Active", "Inactive")', f"If({R}.Active, clrGreenBg, clrSoft)",
         f"If({R}.Active, clrGreenInk, clrInk3)", **fixed(90, 26)),
], gap=10, LayoutAlignItems="LayoutAlignItems.Center")

det_lane = section("detSecLane", "1", s("Lane"), s("Read only"), height=204, body_gap=8, body=[
    row("detLaneRow1", 56, [
        fact("detFactOrigin", "Origin", f"{R}.Title"),
        fact("detFactDest", "Destination", f"{R}.Destination"),
        fact("detFactCarrier", "Carrier", f"{R}.Carrier"),
    ], gap=8),
    row("detLaneRow2", 56, [
        fact("detFactDays", "Service days", f"{R}.ServiceDays"),
        fact("detFactEff", "Effective", f'Text({R}.EffectiveDate, "mmm d, yyyy")'),
        fact("detFactExpiry", "Expiry", f'Text({R}.ExpiryDate, "mmm d, yyyy")'),
    ], gap=8),
])

det_cost = section("detSecCost", "2", s("Cost"), s("Calculated with today's FSC"),
                   height="If(detLblWarn.Visible, 548, 502)",
                   head_extra=[toggle("detTglFuel", "Include fuel", "Include fuel", default="true", **fixed(150, 30))],
                   body=[
    row("detTiles", 62, [
        cost_tile("detTileLH", "LH cost", det_tile_value(), main=True, fp=1.4),
        cost_tile("detTileFt3", "per ft³", det_tile_value("CubicFt")),
        cost_tile("detTileLin", "per linear ft", det_tile_value("EquipFt")),
        cost_tile("detTileSkid", "per skid spot", det_tile_value("SkidSpots")),
    ], gap=10),
    lbl("detLblWarn", f"If(detTglFuel.Value && FuelMissing({R}.Fuel), \"⚠ \" & {R}.Fuel & \" isn't in the Fuel Library, so this cost has no fuel. Add it on the Fuel library screen.\", \"\")",
        Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk", BorderColor="RGBA(233, 215, 155, 1)",
        BorderThickness=1, Size=9.5, Wrap="true", **pads(0, 12), **fixed(h=34), **STRETCH),
    row("detCostRow1", 56, [
        fact("detFactBase", "Base", f'Text({R}.Base, "$#,##0.00")'),
        fact("detFactAdj", "Add-on", money_or_dash("Adj", "AdjType")),
        fact("detFactDisc", "Discount", money_or_dash("Discount", "DiscountType")),
    ], gap=8),
    row("detCostRow2", 56, [
        fact("detFactFuel", "Fuel program", f"{R}.Fuel"),
        fact("detFactFAdj", "Fuel add-on", pts_or_dash("F_Adj")),
        fact("detFactFDisc", "Fuel discount", pts_or_dash("F_Discount")),
    ], gap=8),
    breakdown("det",
              breakdown_left(f"{R}.Fuel", f"{R}.F_Adj", f"{R}.F_Discount", "detTglFuel.Value"),
              breakdown_right(f"!IsBlank({R}.Base)", f"{R}.Base", f"{R}.Fuel", f"{R}.F_Adj", f"{R}.F_Discount",
                              f"{R}.Adj", f'{R}.AdjType = "%"', f"{R}.Discount", f'{R}.DiscountType = "%"',
                              "detTglFuel.Value")),
    field("detFldNotes", "Comments", [
        lbl("detLblNotes", f'If(IsBlank({R}.Comments), "No comments", {R}.Comments)',
            Color=f"If(IsBlank({R}.Comments), clrInk3, clrInk)", Size=10, Wrap="true",
            VerticalAlign="VerticalAlign.Top", **fixed(h=60), **STRETCH),
    ]),
])

write_screen("scrDetails", {"Fill": "clrPage"}, [
    shell("det", "Recent",
          f'"Rate details · " & {R}.Title & {R}.Destination & "-" & {R}.Carrier & "-" & {R}.Mode & "-" & {R}.Equipment',
          [btn("detHdrBtnBack", s("← Back to recent"), OnSelect="Navigate(scrRecent, ScreenTransition.None)",
               **fixed(150, 38))],
          body("det", [
              det_hero, det_lane, det_cost,
              lbl("detLblFooter",
                  f'"Submitted by " & {R}.SubmittedBy & " · " & Text({R}.Timestamp, "mmm d, yyyy h:mm AM/PM")',
                  Size=9, Color="clrInk3", **fixed(h=24), **STRETCH),
          ])),
])


# ================================================================ FUEL
FUEL_COLS = [("Prog", "Program", 0.00, 0.28, "Left"), ("Fsc", "FSC", 0.28, 0.14, "Right"),
             ("Eff", "Effective", 0.46, 0.18, "Left"), ("Who", "Last updated", 0.64, 0.24, "Left")]

fuel_header = manual("fulColHdr", [
    *[caps(f"fulHdr{k}", h, Align=f"Align.{a}", PaddingLeft=16, PaddingRight=10,
           X=f"Parent.Width * {x}", Y=7, Width=f"Parent.Width * {w}") for k, h, x, w, a in FUEL_COLS],
    rect("fulHdrLine", Fill="clrBlue", X=0, Y=30, Width="Parent.Width", Height=2),
], Fill="clrPanel", Height=32, **fixed(), **STRETCH)

fuel_open = "Reset(fulTxtProgram); Reset(fulTxtFsc); Reset(fulDteEff)"

fuel_gallery = node("fulGallery", "Gallery@2.15.0", {
    "Items": "Sort(FuelLibrary, Title, SortOrder.Ascending)", "TemplateSize": 58, "TemplatePadding": 0,
    "TemplateFill": "If(varFuelForm && varFuelEdit && ThisItem.ID = varFuelRec.ID, clrAmberBg, clrPanel)",
    "BorderThickness": 0, "ShowScrollbar": "true", **fill(1), **STRETCH,
}, [
    lbl("fulRowProg", "ThisItem.Title", Size=12, FontWeight="FontWeight.Bold", PaddingLeft=16,
        X=0, Y=0, Width="Parent.TemplateWidth * 0.28", Height=58),
    lbl("fulRowFsc", 'Text(ThisItem.FSC, "0.00") & "%"', Size=12, FontWeight="FontWeight.Bold", Align="Align.Right",
        PaddingRight=10, X="Parent.TemplateWidth * 0.28", Y=0, Width="Parent.TemplateWidth * 0.14", Height=58),
    lbl("fulRowEff", 'Text(ThisItem.EffectiveDate, "mmm d, yyyy")', Size=10, PaddingLeft=16,
        X="Parent.TemplateWidth * 0.46", Y=0, Width="Parent.TemplateWidth * 0.18", Height=58),
    lbl("fulRowWho", 'ThisItem.AddedByUser & Char(10) & Text(ThisItem.Timestamp, "mmm d, h:mm AM/PM")', Size=8.5,
        Color="clrInk3", Wrap="true", PaddingLeft=16, X="Parent.TemplateWidth * 0.64", Y=0,
        Width="Parent.TemplateWidth * 0.24", Height=58),
    btn("fulRowEdit", s("Edit"), Size=9, X="Parent.TemplateWidth - 76", Y=15, Width=60, Height=28,
        OnSelect=f"Set(varFuelRec, ThisItem); Set(varFuelEdit, true); Set(varFuelForm, true); {fuel_open}"),
    rect("fulRowSep", Fill="clrSoft", X=0, Y=57, Width="Parent.TemplateWidth", Height=1),
], "BrowseLayout_Vertical_TwoTextOneImageVariant_ver5.0")

fuel_err = fx(r"""
    With(
        {p: Upper(Trim(fulTxtProgram.Text)), v: Trim(fulTxtFsc.Text)},
        If(
            !IsBlank(v) && !IsMatch(v, "^\d{1,3}(\.\d{1,2})?$"),
            "FSC % must be a number with up to 2 decimals, e.g. 36.16.",
            !IsBlank(p) && !IsBlank(
                LookUp(FuelLibrary, Title = p && (!varFuelEdit || ID <> varFuelRec.ID))
            ),
            p & " is already in the library. Edit that row instead.",
            ""
        )
    )
""")

fuel_save = fx("""
    If(
        !IsBlank(fulLblErr.Text),
        Notify(fulLblErr.Text, NotificationType.Error),
        With(
            {
                r: Patch(
                    FuelLibrary,
                    If(varFuelEdit, LookUp(FuelLibrary, ID = varFuelRec.ID), Defaults(FuelLibrary)),
                    {
                        Title: Upper(Trim(fulTxtProgram.Text)),
                        FSC: Value(fulTxtFsc.Text),
                        EffectiveDate: fulDteEff.SelectedDate,
                        Timestamp: Now(),
                        AddedByEmail: User().Email,
                        AddedByUser: User().FullName
                    }
                )
            },
            If(
                IsError(r) || IsBlank(r.ID),
                Notify("The fuel program wasn't saved. Try again.", NotificationType.Error),
                Notify(r.Title & If(varFuelEdit, " updated.", " added."), NotificationType.Success);
                Refresh(FuelLibrary);
                Set(varFuelForm, false);
                Set(varFuelEdit, false);
                Set(varFuelRec, Blank())
            )
        )
    )
""")

fuel_programs = section("fulSecList", "A", s("Programs"),
                        s("Rates use today's FSC, so editing a program updates every rate on it"),
                        body_pad=0, body_gap=0, body=[fuel_header, fuel_gallery])

fuel_form = section("fulSecForm", "B", 'If(varFuelEdit, "Edit program", "Add program")',
                    'If(varFuelEdit, "Changing " & varFuelRec.Title & " updates the cost of every rate on it", "Program names must be unique")',
                    height="If(fulLblErr.Visible, 250, 204)", Visible="varFuelForm", BorderColor="clrBlueHover", body=[
    row("fulFormRow", 60, [
        field("fulFldProgram", "Program *", [textin("fulTxtProgram", "e.g. CP",
                                                    Default='If(varFuelEdit, varFuelRec.Title, "")')]),
        field("fulFldFsc", "FSC % *", [row("fulFscRow", 38, [
            textin("fulTxtFsc", "e.g. 36.16", Format="TextFormat.Number", Align="Align.Right",
                   Default='If(varFuelEdit, Text(varFuelRec.FSC), "")', **fill(1)),
            unit("fulFscUnit", "%"),
        ], gap=6)]),
        field("fulFldEff", "Effective *", [datepick("fulDteEff", "If(varFuelEdit, varFuelRec.EffectiveDate, Today())")]),
    ]),
    lbl("fulLblErr", fuel_err, Visible="!IsBlank(Self.Text)", Fill="clrRedBg", Color="clrRed",
        BorderColor="clrRed", BorderThickness=1, Size=9.5, Wrap="true", **pads(0, 12), **fixed(h=34), **STRETCH),
    row("fulFormBtns", 38, [
        rect("fulFormSpacer", Fill="clrClear", Height=10, **fill(1, 0)),
        btn("fulBtnCancel", s("Cancel"), OnSelect="Set(varFuelForm, false); Set(varFuelEdit, false)",
            **fixed(100, 38)),
        btn("fulBtnSave", s("Save"), "primary", OnSelect=fuel_save, **fixed(120, 38), DisplayMode=fx("""
            If(
                IsBlank(Trim(fulTxtProgram.Text)) || IsBlank(Trim(fulTxtFsc.Text)) ||
                IsBlank(fulDteEff.SelectedDate) || !IsBlank(fulLblErr.Text),
                DisplayMode.Disabled,
                DisplayMode.Edit
            )
        """)),
    ], gap=10),
])

write_screen("scrFuel", {"Fill": "clrPage", "OnVisible": "Set(varFuelForm, false); Set(varFuelEdit, false)"}, [
    shell("ful", "Fuel", s("Fuel library · FSC % by program"),
          [btn("fulHdrBtnAdd", s("+ Add program"), "primary", **fixed(150, 38),
               OnSelect=f"Set(varFuelRec, Blank()); Set(varFuelEdit, false); Set(varFuelForm, true); {fuel_open}")],
          body("ful", [fuel_programs, fuel_form], scroll=False)),
])

print("wrote", ", ".join(sorted(p.name for p in OUT.glob("scr*.yaml"))))
