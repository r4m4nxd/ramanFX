#!/usr/bin/env python3
"""Generates the Line-Haul Cost Collector screens as Power Apps paste YAML.

Run: python3 build.py  ->  writes scrEntry.yaml, scrRecent.yaml, scrDetails.yaml, scrFuel.yaml
Every formula below is plain Power Fx; this script only handles layout boilerplate.
"""
import pathlib
from textwrap import dedent, indent

OUT = pathlib.Path(__file__).parent
FONT = "Font.'Segoe UI'"
# type scale (pt): one size per role, used everywhere
T_DISPLAY, T_PAGE, T_KEYFIG, T_FIG, T_SECTION = 20, 16, 18, 14, 13
T_BODY, T_TABLE, T_SECONDARY, T_CAPTION, T_MICRO = 11, 10.5, 10, 9, 8.5
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


PT_TO_PX = 96 / 72
TEXT_CONTROLS = ("Label@", "Classic/Button@", "Classic/TextInput@", "Classic/DatePicker@", "Classic/Toggle@")
ISSUES = []


def _num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def audit(n, screen):
    """Flags any text control whose fixed size can't hold its font (1.4 line height) or its literal text."""
    pr = n["props"]
    if n["control"].startswith(TEXT_CONTROLS) and pr.get("Visible") != "false":
        size, h, w = _num(pr.get("Size", 10.5)), _num(pr.get("Height")), _num(pr.get("Width"))
        line = size * PT_TO_PX * 1.4
        pad_v = (_num(pr.get("PaddingTop", 0)) or 0) + (_num(pr.get("PaddingBottom", 0)) or 0)
        if h is not None and pr.get("Wrap") != "true" and pr.get("Mode") != "TextMode.MultiLine" and h < line + pad_v:
            ISSUES.append(f"{screen}/{n['name']}: height {h:g} < {line + pad_v:.1f} needed for {size}pt")
        text = pr.get("Text", "")
        literal = text[1:-1] if text.startswith('"') and text.endswith('"') and text.count('"') == 2 else None
        if n["control"].startswith("Classic/Toggle@"):
            texts = [pr.get("TrueText", '""')[1:-1], pr.get("FalseText", '""')[1:-1]]
            extra = 52  # the switch itself
        else:
            texts, extra = ([literal] if literal else []), 0
        pad_h = (_num(pr.get("PaddingLeft", 0)) or 0) + (_num(pr.get("PaddingRight", 0)) or 0)
        bold = 0.62 if "Bold" in str(pr.get("FontWeight", "")) or "Semibold" in str(pr.get("FontWeight", "")) else 0.56
        for tx in texts:
            need = len(tx) * size * PT_TO_PX * bold + pad_h + extra
            if w is not None and pr.get("Wrap") != "true" and w < need:
                ISSUES.append(f"{screen}/{n['name']}: width {w:g} < {need:.0f} for '{tx}'")
    if n["control"].startswith("GroupContainer@") and n["variant"] == "AutoLayout":
        inset = min(_num(pr.get(k, 0)) or 0 for k in ("PaddingTop", "PaddingRight", "PaddingBottom", "PaddingLeft"))
        for c in n["children"]:
            cp = c["props"]
            if inset < 2 and (_num(cp.get("BorderThickness", 0)) or 0) > 0 and cp.get("Visible") != "false":
                ISSUES.append(f"{screen}/{c['name']}: border touches the edge of {n['name']} (container needs 2 px padding)")
    for c in n["children"]:
        audit(c, screen)


def write_screen(name, props, children):
    for c in children:
        audit(c, name)
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
    for c in children:  # Studio gives auto-layout children a large default minimum, which clips them
        c["props"].setdefault("LayoutMinWidth", 0)
        c["props"].setdefault("LayoutMinHeight", 0)
    return node(name, "GroupContainer@1.5.0", base, children, "AutoLayout")


def manual(name, children, **p):
    base = {"DropShadow": "DropShadow.None", "Fill": "clrClear", "BorderThickness": 0, **rad(0)}
    base.update(p)
    return node(name, "GroupContainer@1.5.0", base, children, "ManualLayout")


def lbl(name, text, **p):
    base = {"Text": text, "Font": FONT, "Color": "clrInk", "Size": T_TABLE, "BorderThickness": 0,
            "VerticalAlign": "VerticalAlign.Middle", **pads(0)}
    base.update(p)
    return node(name, "Label@2.5.1", base)


def caps(name, text, **p):
    base = {"Size": T_CAPTION, "FontWeight": "FontWeight.Bold", "Color": "clrInk3", "Height": 18}
    base.update(p)
    return lbl(name, s(text), **base)


def rect(name, **p):
    base = {"Fill": "clrLine", "BorderThickness": 0}
    base.update(p)
    return node(name, "Rectangle@2.3.0", base)


def btn(name, text, kind="secondary", **p):
    base = {"Text": text, "Font": FONT, "Size": T_BODY, "FontWeight": "FontWeight.Semibold", "BorderThickness": 1,
            "PaddingLeft": 12, "PaddingRight": 12, "PaddingTop": 0, "PaddingBottom": 0,
            "DisabledFill": "clrSoft", "DisabledColor": "clrInk3", "DisabledBorderColor": "clrLine", **rad(5)}
    if kind == "primary":
        base.update(Fill="clrBlue", Color="clrWhite", BorderColor="clrBlue", HoverFill="clrBlue", HoverColor="clrWhite",
                    HoverBorderColor="clrBlueHover", PressedFill="clrInk", PressedColor="clrWhite", PressedBorderColor="clrInk")
    elif kind == "danger":
        base.update(Fill="clrPanel", Color="clrRed", BorderColor="clrLine", HoverFill="clrPanel", HoverColor="clrRed",
                    HoverBorderColor="clrRed", PressedFill="clrRedBg", PressedColor="clrRed", PressedBorderColor="clrRed")
    else:
        base.update(Fill="clrPanel", Color="clrInk", BorderColor="clrLine", HoverFill="clrPanel", HoverColor="clrInk",
                    HoverBorderColor="clrInk3", PressedFill="clrLine", PressedColor="clrInk", PressedBorderColor="clrInk3")
    base.update(p)
    return node(name, "Classic/Button@2.2.0", base)


def pill(name, text, fillc, color, **p):
    base = {"Text": text, "Font": FONT, "Size": T_MICRO, "FontWeight": "FontWeight.Bold", "BorderThickness": 0, **rad(11),
            "PaddingLeft": 10, "PaddingRight": 10, "PaddingTop": 0, "PaddingBottom": 0,
            "Fill": fillc, "Color": color, "HoverFill": fillc, "HoverColor": color, "PressedFill": fillc, "PressedColor": color,
            "BorderColor": "clrClear", "HoverBorderColor": "clrClear", "PressedBorderColor": "clrClear", "Height": 22}
    base.update(p)
    return node(name, "Classic/Button@2.2.0", base)


def textin(name, hint="", **p):
    base = {"Default": s(""), "HintText": s(hint), "Font": FONT, "Size": T_BODY, "Color": "clrInk", "Fill": "clrPanel",
            "PaddingLeft": 12, "PaddingRight": 12, "PaddingTop": 6, "PaddingBottom": 6,
            "BorderColor": "clrLine", "BorderThickness": 1, "HoverBorderColor": "clrInk3", "HoverFill": "clrPanel",
            "PressedBorderColor": "clrBlue", "PressedFill": "clrPanel", "Height": 36, **rad(5), **STRETCH}
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
            "Font": FONT, "Size": T_BODY, "Color": "clrInk", "Fill": "clrPanel",
            "BorderColor": f"If(IsBlank(Self.Selected.{field}), clrAmber, clrLine)",
            "ChevronBackground": "clrPanel", "ChevronFill": "clrInk3", "ChevronHoverBackground": "clrSoft",
            "ChevronHoverFill": "clrInk", "HoverBorderColor": "clrInk3", "HoverFill": "clrSoft", "HoverColor": "clrInk",
            "PressedBorderColor": "clrBlue", "PressedFill": "clrBlue", "PressedColor": "clrWhite",
            "SelectionFill": "clrBlue", "SelectionColor": "clrWhite", "Height": 36, **STRETCH}
    base.update(p)
    return node(name, "Classic/ComboBox@2.4.0", base)


def toggle(name, true_text, false_text, default="false", **p):
    base = {"Default": default, "TrueText": s(true_text), "FalseText": s(false_text), "Font": FONT, "Size": T_SECONDARY,
            "FontWeight": "FontWeight.Semibold", "Color": "clrInk", "TrueFill": "clrBlue", "TrueHoverFill": "clrBlueHover",
            "FalseFill": "RGBA(190, 200, 210, 1)", "FalseHoverFill": "clrInk3", "HandleFill": "clrWhite",
            "TextPosition": "TextPosition.Right", "BorderThickness": 0}
    base.update(p)
    return node(name, "Classic/Toggle@2.1.0", base)


def datepick(name, default, **p):
    base = {"DefaultDate": default, "Font": FONT, "Size": T_BODY, "PaddingLeft": 12, "PaddingRight": 4, "Color": "clrInk", "Fill": "clrPanel",
            "BorderColor": "clrLine", "BorderThickness": 1, "IconBackground": "clrBlue", "IconFill": "clrWhite",
            "Height": 36, **STRETCH}
    base.update(p)
    return node(name, "Classic/DatePicker@2.6.0", base)


# ---------------------------------------------------------------- composites
def field(name, label, controls, fp=1, head=None, h=None):
    top = caps(name + "Lbl", label, **STRETCH) if head is None else box(
        name + "Head", "Horizontal", [caps(name + "Lbl", label, **fill(1, 40))] + head,
        Height=18, LayoutGap=8, LayoutAlignItems="LayoutAlignItems.Center", **STRETCH, **fixed())
    size = {"FillPortions": 0, "Height": h} if h is not None else fill(fp, 100)
    return box(name, "Vertical", [top] + controls, LayoutGap=2, **pads(2), **size, **STRETCH)


def row(name, height, children, gap=12, inset=0, **p):
    return box(name, "Horizontal", children, Height=height, LayoutGap=gap, **pads(inset), **fixed(), **STRETCH, **p)


def section(name, num, title, hint, body, height=None, head_extra=(), body_pad=16, body_gap=12, **p):
    size = {"Height": height, "FillPortions": 0} if height is not None else {"FillPortions": 1}
    head = box(name + "Head", "Horizontal", [
        lbl(name + "Num", s(num), Fill="clrInk", Color="clrWhite", Size=T_CAPTION, FontWeight="FontWeight.Bold",
            Align="Align.Center", **fixed(24, 24)),
        lbl(name + "Title", title, Size=T_SECTION, FontWeight="FontWeight.Bold", **fixed(250, 30)),
        lbl(name + "Hint", hint, Size=T_SECONDARY, Color="clrInk3", Height=30, **fill(1)),
        *head_extra,
    ], Height=48, LayoutGap=12, LayoutAlignItems="LayoutAlignItems.Center", **pads(0, 16), **fixed(), **STRETCH)
    inner = box(name + "Body", "Vertical", body, LayoutGap=body_gap, **pads(body_pad, 16), **fill(1), **STRETCH)
    base = {"Fill": "clrPanel", "BorderColor": "clrLine", "BorderThickness": 1, **rad(6), **size, **STRETCH}
    base.update(p)
    return box(name, "Vertical", [head, rect(name + "Sep", Height=1, **fixed(), **STRETCH), inner], **base)


def fact(name, key, value, edge="clrBlue"):
    return manual(name, [
        rect(name + "Edge", Fill=edge, X=0, Y=0, Width=3, Height="Parent.Height"),
        lbl(name + "K", s(key.upper()), Size=T_CAPTION, FontWeight="FontWeight.Bold", Color="clrInk3",
            X=14, Y=7, Width="Parent.Width - 22", Height=18),
        lbl(name + "V", value, Size=T_BODY, FontWeight="FontWeight.Semibold",
            X=14, Y=27, Width="Parent.Width - 22", Height=22),
    ], Fill="clrSoft", Height=56, RadiusTopRight=3, RadiusBottomRight=3, **fill(1, 80), **STRETCH)


def cost_tile(name, key, value, main=False, fp=1):
    return box(name, "Vertical", [
        lbl(name + "K", s(key.upper()), Size=T_CAPTION, FontWeight="FontWeight.Bold", Color="clrInk3", Height=18, **STRETCH),
        lbl(name + "V", value, Size=T_KEYFIG if main else T_FIG, FontWeight="FontWeight.Bold", Height=34, **STRETCH),
    ], Fill="clrSoft" if main else "clrPanel", BorderColor="clrLine", BorderThickness=1, **rad(6),
        **pads(8, 14), **fill(fp, 90), **STRETCH)


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
            lbl(f"{p}Nav{key}Text", s(text), Size=T_MICRO, FontWeight="FontWeight.Semibold",
                Color="clrWhite" if on else "clrRailInk", Align="Align.Center", OnSelect=go, **fixed(88, 18)),
        ], Fill="clrRailOn" if on else "clrClear", LayoutGap=4, LayoutAlignItems="LayoutAlignItems.Center",
            LayoutJustifyContent="LayoutJustifyContent.Center", **rad(6), **fixed(88, 64)))
    return box(f"{p}Rail", "Vertical", [
        node(f"{p}Logo", "Image@2.2.3", {"Image": "'cff logo'", "ImagePosition": "ImagePosition.Fit",
                                          "Width": 48, "Height": 48, "FillPortions": 0}),
        rect(f"{p}RailGap", Fill="clrClear", **fixed(10, 10)),
        *navs,
    ], Fill="clrRail", LayoutGap=8, LayoutAlignItems="LayoutAlignItems.Center", **pads(14, 5),
        **fixed(96), LayoutMinWidth=96, **STRETCH)


def header(p, step, right):
    return box(f"{p}Header", "Horizontal", [
        lbl(f"{p}HdrTitle", s("Line-Haul Rates"), Size=T_PAGE, FontWeight="FontWeight.Semibold", **fixed(210, 36)),
        rect(f"{p}HdrDiv", **fixed(1, 24)),
        lbl(f"{p}HdrStep", step, Size=T_BODY, Color="clrInk3", Height=36, Visible="Parent.Width > 700", **fill(1)),
        lbl(f"{p}HdrUser", 'User().FullName & " · " & Text(Today(), "mmm d, yyyy")', Size=T_SECONDARY, Color="clrInk2",
            FontWeight="FontWeight.Semibold", Align="Align.Right", Visible="Parent.Width > 1000", **fixed(240, 36)),
        *right,
    ], Fill="clrPanel", Height=60, LayoutGap=16, LayoutAlignItems="LayoutAlignItems.Center",
        DropShadow="DropShadow.Light", **pads(2, 16), **fixed(), **STRETCH)


def shell(p, current, step, right, body, action=None):
    main = [header(p, step, right), body] + ([action] if action else [])
    return box(f"{p}Root", "Horizontal", [
        rail(p, current),
        box(f"{p}Main", "Vertical", main, Fill="clrPage", **fill(1, 300), **STRETCH),
    ], Fill="clrPage", X=0, Y=0, Width="Parent.Width", Height="Parent.Height")


def body(p, children, scroll=True, gap=16):
    extra = {"LayoutOverflowY": "LayoutOverflow.Scroll"} if scroll else {}
    return box(f"{p}Body", "Vertical", children, LayoutGap=gap, **pads(16), **fill(1), **STRETCH, **extra)


def hidden(name, text):
    return lbl(name, text, Visible="false", X=0, Y=0, Width=10, Height=10)


def modal(p, visible, title, message, cancel, ok_text, ok):
    """Full-screen confirm dialog. The shade rectangle swallows clicks meant for the screen behind."""
    return manual(f"{p}Modal", [
        rect(f"{p}ModalShade", Fill="RGBA(22, 32, 43, 0.45)", X=0, Y=0, Width="Parent.Width", Height="Parent.Height",
             OnSelect="false"),
        manual(f"{p}ModalCard", [
            lbl(f"{p}ModalTitle", title, Size=T_SECTION, FontWeight="FontWeight.Bold",
                X=20, Y=16, Width="Parent.Width - 40", Height=30),
            lbl(f"{p}ModalMsg", message, Size=T_BODY, Color="clrInk2", Wrap="true", VerticalAlign="VerticalAlign.Top",
                X=20, Y=54, Width="Parent.Width - 40", Height="Parent.Height - 124"),
            btn(f"{p}ModalCancel", s("Go back"), OnSelect=cancel,
                X="Parent.Width - 332", Y="Parent.Height - 58", Width=120, Height=38),
            btn(f"{p}ModalOk", ok_text, "primary", OnSelect=ok,
                X="Parent.Width - 200", Y="Parent.Height - 58", Width=180, Height=38),
        ], Fill="clrPanel", BorderColor="clrLine", BorderThickness=1, DropShadow="DropShadow.Bold", **rad(8),
            X="(Parent.Width - 500) / 2", Y="(Parent.Height - 300) / 2", Width=500, Height=300),
    ], Visible=visible, X=0, Y=0, Width="Parent.Width", Height="Parent.Height")


# ================================================================ ENTRY
E_ADJ = 'If(entTglAdjPct.Value, "%", "$")'
E_DISC = 'If(entTglDiscPct.Value, "%", "$")'

entry_errors = fx(f"""
    With(
        {{
            miss: Concat(
                Filter(
                    Table(
                        {{f: "Origin", ok: !IsBlank(varOrigin)}},
                        {{f: "Destination", ok: !IsBlank(varDest)}},
                        {{f: "Mode", ok: !IsBlank(varMode)}},
                        {{f: "Equipment", ok: !IsBlank(varEquip)}},
                        {{f: "Carrier", ok: !IsBlank(varCarrier)}},
                        {{f: "Service days", ok: CountRows(colDays) > 0}},
                        {{f: "Base rate", ok: !IsBlank(Trim(entTxtBase.Text))}},
                        {{f: "Fuel program", ok: !IsBlank(varFuel)}}
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
                !IsBlank(varOrigin) && varOrigin = varDest,
                "Origin and destination can't be the same. ", ""
            ) &
            If(
                entNumOk.Text = "ok" && !IsBlank(Trim(entTxtBase.Text)) && Value(entTxtBase.Text) <= 0,
                "Base rate must be more than $0. ", ""
            ) &
            If(
                entNumOk.Text = "ok" && entTglDiscPct.Value && Coalesce(Value(entTxtDisc.Text), 0) >= 100,
                "A % discount must be under 100. ", ""
            ) &
            If(
                FuelMissing(varFuel),
                "The fuel program has no FSC. Fix it in the Fuel library first. ", ""
            ) &
            If(
                entNumOk.Text = "ok" && !IsBlank(varFuel) &&
                FscPct(varFuel, Value(entTxtFAdj.Text), Value(entTxtFDisc.Text), true) < 0,
                "Fuel discount is bigger than the FSC. ", ""
            ) &
            If(
                !IsBlank(entCalc.Text) && Value(entCalc.Text) <= 0,
                "The discount wipes out the whole cost. Check the discount. ", ""
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
        !IsBlank(varFuel) && !IsBlank(varEquip),
        Text(
            LHCost(
                Value(entTxtBase.Text), varFuel,
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
    v = "Value(entCalc.Text)" + (f" / {divisor}(varEquip)" if divisor else "")
    return f'If(IsBlank(entCalc.Text), "—", Text({v}, "$#,##0.00"))'


entry_key = fx("""
    If(
        IsBlank(varOrigin) || IsBlank(varDest) ||
        IsBlank(varCarrier) || IsBlank(varMode) ||
        IsBlank(varEquip),
        "—",
        varOrigin & varDest & "-" & varCarrier & "-" &
        varMode & "-" & varEquip
    )
""")

entry_replace = fx("""
    If(
        !entTglActive.Value || entLblKey.Text = "—",
        "",
        With(
            {
                p: LookUp(
                    AddColumns(
                        Filter(
                            LinehaulRates,
                            Title = varOrigin &&
                            Destination = varDest &&
                            Carrier = varCarrier &&
                            Mode = varMode &&
                            Equipment = varEquip
                        ),
                        IsOn, Upper(Trim(Active)) in ["YES", "TRUE"]
                    ),
                    IsOn
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

entry_dupe = fx("""
    If(
        entLblKey.Text = "—" || entNumOk.Text <> "ok" || IsBlank(Trim(entTxtBase.Text)) ||
        IsBlank(varFuel),
        "",
        With(
            {
                p: LookUp(
                    LinehaulRates,
                    Title = varOrigin &&
                    Destination = varDest &&
                    Carrier = varCarrier &&
                    Mode = varMode &&
                    Equipment = varEquip &&
                    Base = Value(entTxtBase.Text) &&
                    Fuel = varFuel &&
                    ExpiryDate >= Today()
                )
            },
            If(
                IsBlank(p),
                "",
                "⚠ A rate with the same base (" & Text(p.Base, "$#,##0.00") & ") and fuel already exists for this lane, " &
                "added " & Text(p.Timestamp, "mmm d, yyyy") & " by " & p.SubmittedBy & ". Saving creates a duplicate."
            )
        )
    )
""")

entry_confirm = fx("""
    Concat(
        Filter(
            Table(
                {t: entLblReplace.Text},
                {t: entLblDupe.Text},
                {
                    t: If(
                        !IsBlank(entDteExpiry.SelectedDate) && entDteExpiry.SelectedDate < Today(),
                        "⚠ The expiry date has already passed, so this rate won't show in Recent entries.",
                        ""
                    )
                },
                {
                    t: If(
                        entNumOk.Text = "ok" && Coalesce(Value(entTxtBase.Text), 0) > 20000,
                        "⚠ The base rate is over $20,000. Check it isn't a typo.",
                        ""
                    )
                }
            ),
            !IsBlank(t)
        ),
        t,
        Char(10) & Char(10)
    )
""")

entry_fsc_today = fx("""
    With(
        {f: varFuel},
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
        IsBlank(varFuel) || entNumOk.Text <> "ok",
        "—",
        Text(FscPct(varFuel, Value(entTxtFAdj.Text), Value(entTxtFDisc.Text), true), "0.00") & "%"
    )
""")

entry_equip = fx("""
    With(
        {e: varEquip},
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
    return field(f"{p}Bd", "How the cost is built", h=134, controls=[
        box(f"{p}BdRow", "Horizontal", [
            lbl(f"{p}BdLeft", left, Size=T_TABLE, Color="clrInk2", VerticalAlign="VerticalAlign.Top", Wrap="true",
                Height=112, **fill(1)),
            lbl(f"{p}BdRight", right, Size=T_TABLE, FontWeight="FontWeight.Semibold", Align="Align.Right",
                VerticalAlign="VerticalAlign.Top", **fixed(150, 112)),
        ], Height=112, LayoutGap=12, **fixed(), **STRETCH),
    ])


entry_do_save = fx("""
    If(
        !IsBlank(entLblErrors.Text),
        Notify(entLblErrors.Text, NotificationType.Error),
        With(
            {
                n: Patch(
                    LinehaulRates,
                    Defaults(LinehaulRates),
                    {
                        Title: varOrigin,
                        Destination: varDest,
                        Mode: varMode,
                        Carrier: varCarrier,
                        Equipment: varEquip,
                        Fuel: varFuel,
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
                        Active: If(entTglActive.Value, "Yes", "No"),
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
                    Upper(n.Active) = "YES",
                    ForAll(
                        Filter(
                            AddColumns(
                                Filter(
                                    LinehaulRates,
                                    Title = n.Title && Destination = n.Destination && Carrier = n.Carrier &&
                                    Mode = n.Mode && Equipment = n.Equipment
                                ),
                                IsOn, Upper(Trim(Active)) in ["YES", "TRUE"]
                            ),
                            IsOn && ID <> n.ID
                        ) As old,
                        Patch(LinehaulRates, LookUp(LinehaulRates, ID = old.ID), {Active: "No"})
                    )
                );
                Notify("Rate saved for " & n.Title & n.Destination & " " & n.Carrier & ".", NotificationType.Success);
                Select(entBtnReset)
            )
        )
    )
""")

entry_do_save = "Set(varSaving, true);\n" + entry_do_save + ";\nSet(varSaving, false)"

entry_save = ("If(\n    !IsBlank(entLblErrors.Text),\n    Notify(entLblErrors.Text, NotificationType.Error),\n"
              "    !IsBlank(entLblConfirm.Text),\n    Set(varConfirmSave, true),\n"
              + indent(entry_do_save, "    ") + "\n)")

entry_reset = fx("""
    Set(varOrigin, Blank()); Set(varDest, Blank()); Set(varMode, Blank()); Set(varEquip, Blank());
    Set(varCarrier, Blank()); Set(varFuel, Blank()); Set(varPick, "");
    Reset(entDteEff); Reset(entDteExpiry); Reset(entTglActive);
    Reset(entTxtBase); Reset(entTxtAdj); Reset(entTglAdjPct); Reset(entTxtDisc); Reset(entTglDiscPct);
    Reset(entTxtFAdj); Reset(entTxtFDisc); Reset(entTxtNotes);
    Clear(colDays);
    Set(varConfirmSave, false)
""")

entry_add_carrier = fx("""
    With(
        {c: Upper(Trim(entPickNew.Text))},
        If(
            IsBlank(c),
            Notify("Type a carrier name first.", NotificationType.Warning),
            !IsBlank(LookUp(Carriers, Title = c)),
            Set(varCarrier, c);
            Notify(c & " was already in the list, so it's selected.", NotificationType.Information);
            Set(varPick, ""),
            With(
                {r: Patch(Carriers, Defaults(Carriers), {Title: c})},
                If(
                    IsError(r),
                    Notify("The carrier wasn't added. Try again.", NotificationType.Error),
                    Set(varCarrier, c);
                    Notify(c & " added and selected.", NotificationType.Success);
                    Set(varPick, "")
                )
            )
        )
    )
""")

PICK_ITEMS = fx("""
    Switch(
        varPick,
        "Origin", nfTerminals,
        "Destination", nfTerminals,
        "Mode", nfModes,
        "Equipment", nfEquipment,
        "Carrier", ForAll(Sort(Carriers, Title, SortOrder.Ascending), {Value: Title}),
        "Fuel program", ForAll(Sort(FuelLibrary, Title, SortOrder.Ascending), {Value: Title}),
        Filter(nfTerminals, false)
    )
""")
PICK_CUR = ('Switch(varPick, "Origin", varOrigin, "Destination", varDest, "Mode", varMode, '
            '"Equipment", varEquip, "Carrier", varCarrier, "Fuel program", varFuel, "")')
PICK_SET = fx("""
    Switch(
        varPick,
        "Origin", Set(varOrigin, ThisItem.Value),
        "Destination", Set(varDest, ThisItem.Value),
        "Mode", Set(varMode, ThisItem.Value),
        "Equipment", Set(varEquip, ThisItem.Value),
        "Carrier", Set(varCarrier, ThisItem.Value),
        "Fuel program", Set(varFuel, ThisItem.Value)
    );
    Set(varPick, "")
""")


def picker_btn(name, var, label):
    color = f"If(IsBlank({var}), clrInk3, clrInk)"
    return btn(name, f'If(IsBlank({var}), "Select…", {var}) & "   ▾"', Align="Align.Left", PaddingLeft=12,
               FontWeight="FontWeight.Normal", Color=color, HoverColor=color, PressedColor=color,
               PressedFill="clrSoft", BorderColor=f"If(IsBlank({var}), clrAmber, clrLine)",
               HoverBorderColor="clrInk3", PressedBorderColor="clrBlue", Height=36,
               OnSelect=f'Set(varPick, "{label}"); Reset(entPickSearch); Reset(entPickNew)', **STRETCH)


entry_picker = manual("entPicker", [
    rect("entPickShade", Fill="RGBA(22, 32, 43, 0.45)", X=0, Y=0, Width="Parent.Width", Height="Parent.Height",
         OnSelect='Set(varPick, "")'),
    manual("entPickCard", [
        lbl("entPickTitle", '"Choose " & Lower(varPick)', Size=T_SECTION, FontWeight="FontWeight.Bold",
            X=20, Y=16, Width="Parent.Width - 92", Height=36),
        btn("entPickClose", s("✕"), Tooltip=s("Close"), OnSelect='Set(varPick, "")',
            X="Parent.Width - 60", Y=16, Width=40, Height=36),
        textin("entPickSearch", "Search", X=20, Y=64, Width="Parent.Width - 40", Height=40),
        rect("entPickLine", X=0, Y=119, Width="Parent.Width", Height=1),
        node("entPickGallery", "Gallery@2.15.0", {
            "Items": "Filter(" + PICK_ITEMS + ",\n    IsBlank(Trim(entPickSearch.Text)) || Upper(Trim(entPickSearch.Text)) in Upper(Value)\n)",
            "TemplateSize": 48, "TemplatePadding": 0, "BorderThickness": 0, "ShowScrollbar": "true",
            "TemplateFill": f"If(ThisItem.Value = {PICK_CUR}, clrSoft, clrPanel)",
            "OnSelect": PICK_SET,
            "X": 0, "Y": 120, "Width": "Parent.Width",
            "Height": 'Parent.Height - 120 - If(varPick = "Carrier", 80, 8)',
        }, [
            lbl("entPickRowText", "ThisItem.Value", Size=T_BODY, OnSelect="Select(Parent)",
                FontWeight=f"If(ThisItem.Value = {PICK_CUR}, FontWeight.Bold, FontWeight.Normal)",
                PaddingLeft=20, X=0, Y=0, Width="Parent.TemplateWidth - 60", Height=48),
            lbl("entPickRowCheck", s("✓"), Size=T_SECTION, Color="clrBlue", FontWeight="FontWeight.Bold",
                Visible=f"ThisItem.Value = {PICK_CUR}", OnSelect="Select(Parent)", Align="Align.Center",
                X="Parent.TemplateWidth - 56", Y=0, Width=40, Height=48),
            rect("entPickRowSep", Fill="clrSoft", X=0, Y=47, Width="Parent.TemplateWidth", Height=1),
        ], "BrowseLayout_Vertical_TwoTextOneImageVariant_ver5.0"),
        rect("entPickFootLine", Visible='varPick = "Carrier"', X=0, Y="Parent.Height - 80",
             Width="Parent.Width", Height=1),
        textin("entPickNew", "Not listed? Type a new carrier", Visible='varPick = "Carrier"',
               X=20, Y="Parent.Height - 60", Width="Parent.Width - 180", Height=40),
        btn("entPickAdd", s("Add carrier"), "primary", Visible='varPick = "Carrier"', OnSelect=entry_add_carrier,
            X="Parent.Width - 148", Y="Parent.Height - 60", Width=128, Height=40),
    ], Fill="clrPanel", BorderColor="clrLine", BorderThickness=1, DropShadow="DropShadow.Bold", **rad(8),
        X="(Parent.Width - 460) / 2", Y=32, Width=460, Height="Parent.Height - 64"),
], Visible="!IsBlank(varPick)", X=0, Y=0, Width="Parent.Width", Height="Parent.Height")


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
    return btn(f"entDay{day.title()}", s(day), Size=T_SECONDARY, OnSelect=day_select, **rad(15), **fixed(54, 30),
               Fill=f"If({on}, clrBlue, clrPanel)", Color=f"If({on}, clrWhite, clrInk2)",
               BorderColor=f"If({on}, clrBlue, clrLine)", HoverFill=f"If({on}, clrBlue, clrPanel)",
               HoverColor=f"If({on}, clrWhite, clrInk2)", PressedFill="clrBlue", PressedColor="clrWhite")


def pct_toggle(name):
    return toggle(name, "%", "$", Size=T_CAPTION, FontWeight="FontWeight.Bold", **fixed(64, 18))


def unit(name, text):
    return lbl(name, s(text), Fill="clrSoft", BorderColor="clrLine", BorderThickness=1, Color="clrInk3",
               FontWeight="FontWeight.Bold", Align="Align.Center", **fixed(40, 38))


ENT_LANE_H = "(470 + If(entLblReplace.Visible, 68, 0) + If(entLblDupe.Visible, 68, 0))"
ENT_COST_H = "436"
ENT_NARROW_FP = "If(entBody.Width < 900, 0, 1)"

lane_section = section("entSecLane", "1", s("Lane"), s("Who moves it, where, on what"), FillPortions=ENT_NARROW_FP, Height=ENT_LANE_H, LayoutMinWidth=320, body=[
    row("entRowLane1", 60, [
        field("entFldOrigin", "Origin *", [picker_btn("entPickOrigin", "varOrigin", "Origin")]),
        field("entFldDest", "Destination *", [picker_btn("entPickDest", "varDest", "Destination")]),
        field("entFldMode", "Mode *", [picker_btn("entPickMode", "varMode", "Mode")]),
        field("entFldEquip", "Equipment *", [picker_btn("entPickEquip", "varEquip", "Equipment")]),
    ]),
    row("entRowLane2", 96, [
        field("entFldCarrier", "Carrier *", [
            picker_btn("entPickCarrier", "varCarrier", "Carrier"),
        ]),
        field("entFldDays", "Service days *", [
            box("entDays", "Horizontal", [day_chip(d) for d in
                                          ["ALL", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]],
                LayoutWrap="true", LayoutGap=8, Height=72, **pads(2), **fixed(), **STRETCH),
        ], fp=1.3),
    ]),
    row("entRowLane3", 60, [
        field("entFldEff", "Effective *", [datepick("entDteEff", "Date(Year(Today()), 1, 1)")]),
        field("entFldExpiry", "Expiry *", [datepick(
            "entDteExpiry",
            "DateAdd(Date(Year(entDteEff.SelectedDate) + 1, Month(entDteEff.SelectedDate), 1), -1, TimeUnit.Days)")]),
        field("entFldActive", "Active rate", [toggle("entTglActive", "Active", "Inactive",
                                                     default="true", Height=36, **STRETCH)]),
    ]),
    field("entFldNotes", "Comments", h=88, controls=[textin("entTxtNotes", "Anything the next person should know about this rate",
                                             Mode="TextMode.MultiLine", Height=64, EnableSpellCheck="true")]),
    row("entRowKey", 28, [
        caps("entKeyLbl", "Lane key", **fixed(80, 28)),
        lbl("entLblKey", entry_key, Size=T_BODY, FontWeight="FontWeight.Semibold", Height=28, **fill(1)),
    ], LayoutAlignItems="LayoutAlignItems.Center"),
    lbl("entLblReplace", entry_replace, Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk",
        BorderColor="RGBA(233, 215, 155, 1)", BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12),
        **fixed(h=56), **STRETCH),
    lbl("entLblDupe", entry_dupe, Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk",
        BorderColor="RGBA(233, 215, 155, 1)", BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12),
        **fixed(h=56), **STRETCH),
])

cost_section = section("entSecCost", "2", s("Cost"), s("Fuel goes on the base first, then add-on, then discount"), FillPortions=ENT_NARROW_FP, Height=ENT_COST_H, LayoutMinWidth=320, body=[
    row("entRowCost1", 60, [
        field("entFldBase", "Base rate ($) *", [
            numin("entTxtBase", "$0.00",
                  BorderColor=f"If(!IsMatch(Self.Text, {NUM}), clrRed, IsBlank(Trim(Self.Text)), clrAmber, clrLine)"),
        ]),
        field("entFldAdj", "Add-on", [numin("entTxtAdj")], head=[pct_toggle("entTglAdjPct")]),
        field("entFldDisc", "Discount", [numin("entTxtDisc")], head=[pct_toggle("entTglDiscPct")]),
    ]),
    row("entRowCost2", 60, [
        field("entFldFuel", "Fuel program *", [picker_btn("entPickFuel", "varFuel", "Fuel program")]),
        field("entFldFAdj", "Fuel add-on (pts)", [numin("entTxtFAdj", "0 pts")]),
        field("entFldFDisc", "Fuel discount (pts)", [numin("entTxtFDisc", "0 pts")]),
    ]),
    row("entRowFacts", 56, [
        fact("entFactFsc", "FSC today", entry_fsc_today),
        fact("entFactFscApplied", "FSC applied", entry_fsc_applied),
        fact("entFactEquip", "Equipment", entry_equip),
    ], gap=8),
    breakdown("ent",
              breakdown_left("varFuel", "Value(entTxtFAdj.Text)", "Value(entTxtFDisc.Text)", "true"),
              breakdown_right("!IsBlank(entCalc.Text)", "Value(entTxtBase.Text)", "varFuel",
                              "Value(entTxtFAdj.Text)", "Value(entTxtFDisc.Text)", "Value(entTxtAdj.Text)",
                              "entTglAdjPct.Value", "Value(entTxtDisc.Text)", "entTglDiscPct.Value", "true")),
])

entry_action = box("entActionWrap", "Vertical", [
    box("entAction", "Horizontal", [
        cost_tile("entTileLH", "LH cost · fuel in", entry_tile_value(), main=True, fp=1.3),
        cost_tile("entTileFt3", "per ft³", entry_tile_value("CubicFt")),
        cost_tile("entTileLin", "per linear ft", entry_tile_value("EquipFt")),
        cost_tile("entTileSkid", "per skid spot", entry_tile_value("SkidSpots")),
        lbl("entLblStatus", 'If(IsBlank(entLblErrors.Text), "✓ Ready to save", entLblErrors.Text)',
            Color="If(IsBlank(entLblErrors.Text), clrGreenInk, clrAmberInk)", Size=T_SECONDARY,
            FontWeight="FontWeight.Semibold", Wrap="true", **fill(1.6, 160), **STRETCH),
        btn("entBtnReset", s("Reset"), "danger", OnSelect=entry_reset, **fixed(100, 44)),
        btn("entBtnSave", 'If(varSaving, "Saving…", "Save rate")', "primary", OnSelect=entry_save,
            DisplayMode="If(IsBlank(entLblErrors.Text) && !varSaving, DisplayMode.Edit, DisplayMode.Disabled)",
            **fixed(140, 44)),
    ], Fill="clrPanel", BorderColor="clrLine", BorderThickness=1, **rad(6), LayoutGap=12, **pads(10, 16),
        LayoutAlignItems="LayoutAlignItems.Center", **fill(1), **STRETCH),
], Height=110, **pads(2, 16, 16, 16), **fixed(), **STRETCH)

write_screen("scrEntry", {"Fill": "clrPage", "OnVisible": 'Set(varPick, ""); Set(varConfirmSave, false)'}, [
    shell("ent", "New", s("New rate"),
          [btn("entHdrBtnRecent", s("Recent entries"), OnSelect="Navigate(scrRecent, ScreenTransition.None)",
               **fixed(160, 38))],
          body("ent", [row("entCols", fx(f"""
              If(
                  entBody.Width < 900,
                  {ENT_LANE_H} + 16 + {ENT_COST_H} + 4,
                  {ENT_LANE_H} + 4
              )
          """), inset=2, children=[lane_section, cost_section], gap=16,
              LayoutDirection="If(entBody.Width < 900, LayoutDirection.Vertical, LayoutDirection.Horizontal)")]),
          entry_action),
    hidden("entLblErrors", entry_errors),
    hidden("entNumOk", entry_numok),
    hidden("entCalc", entry_calc),
    hidden("entLblConfirm", entry_confirm),
    modal("ent", "varConfirmSave", s("Check before saving"), "entLblConfirm.Text",
          "Set(varConfirmSave, false)",
          'If(IsBlank(entLblReplace.Text), "Save anyway", "Replace and save")',
          "Set(varConfirmSave, false);\n" + entry_do_save),
    entry_picker,
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
        Filter(
            AddColumns(
                Sort(
                    Filter(
                        LinehaulRates,
                        ExpiryDate >= Today(),
                        StartsWith(Title, Left(l, 2)),
                        StartsWith(Destination, Mid(l, 3, 2)),
                        StartsWith(Carrier, c),
                        StartsWith(Mode, m)
                    ),
                    Timestamp,
                    SortOrder.Descending
                ),
                IsOn, Upper(Trim(Active)) in ["YES", "TRUE"],
                LH, LHCost(Base, Fuel, F_Adj, F_Discount, Adj, AdjType, Discount, DiscountType, recTglFuel.Value),
                NoFSC, recTglFuel.Value && FuelMissing(Fuel)
            ),
            (IsBlank(e) || e in Equipment) && (!recTglActive.Value || IsOn)
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
            kids.append(pill("recRowStatus", 'If(ThisItem.IsOn, "Active", "Inactive")',
                             "If(ThisItem.IsOn, clrGreenBg, clrSoft)", "If(ThisItem.IsOn, clrGreenInk, clrInk3)",
                             OnSelect="Select(Parent)", X=f"Parent.TemplateWidth * {x} + 8", Y=12, Width=74))
            continue
        kids.append(lbl(f"recRow{key}", REC_TEXT[key], OnSelect="Select(Parent)",
                        Size=T_SECONDARY if key == "Added" else T_TABLE,
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
    row("recFilters", "If(recBody.Width < 1120, 92, 42)", inset=2, children=[
        *[textin(f"recTxt{k}", hint, **fixed(150, 38)) for k, hint in
          [("Lane", "Lane, e.g. TOWI"), ("Carrier", "Carrier"), ("Mode", "Mode"), ("Equip", "Equipment, e.g. 53")]],
        toggle("recTglActive", "Active only", "Active only", **fixed(160, 32)),
        toggle("recTglFuel", "Include fuel", "Include fuel", **fixed(160, 32)),
        btn("recBtnClear", s("Clear filters"), Size=T_SECONDARY,
            OnSelect="Reset(recTxtLane); Reset(recTxtCarrier); Reset(recTxtMode); Reset(recTxtEquip); Reset(recTglActive)",
            **fixed(132, 32)),
        lbl("recLblCount", fx("""
            CountRows(recGallery.AllItems) & If(CountRows(recGallery.AllItems) = 1, " rate", " rates") &
            " · fuel " & If(recTglFuel.Value, "included", "excluded")
        """), Size=T_SECONDARY, Color="clrInk3", Align="Align.Right", Height=30, **fill(1)),
    ], gap=12, LayoutAlignItems="LayoutAlignItems.Center", LayoutWrap="true"),
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
], scroll=False, gap=16)

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


det_hero = row("detHero", 44, inset=2, children=[
    lbl("detLblLane", f'{R}.Title & "  →  " & {R}.Destination', Size=T_DISPLAY, FontWeight="FontWeight.Bold", **fixed(150, 44)),
    pill("detChipCarrier", f"{R}.Carrier", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(140, 26)),
    pill("detChipMode", f"{R}.Mode", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(100, 26)),
    pill("detChipEquip", f"{R}.Equipment", "clrPanel", "clrInk", BorderColor="clrLine", BorderThickness=1,
         HoverBorderColor="clrLine", PressedBorderColor="clrLine", **fixed(170, 26)),
    rect("detHeroSpacer", Fill="clrClear", Height=10, **fill(1, 0)),
    pill("detStatus", f'If({R}.IsOn, "Active", "Inactive")', f"If({R}.IsOn, clrGreenBg, clrSoft)",
         f"If({R}.IsOn, clrGreenInk, clrInk3)", **fixed(90, 26)),
], gap=12, LayoutAlignItems="LayoutAlignItems.Center")

det_lane = section("detSecLane", "1", s("Lane"), s("Read only"), height=210, body_gap=8, body=[
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
                   height="If(detLblWarn.Visible, 608, 540)",
                   head_extra=[toggle("detTglFuel", "Include fuel", "Include fuel", default="true", **fixed(170, 32))],
                   body=[
    row("detTiles", 72, inset=2, children=[
        cost_tile("detTileLH", "LH cost", det_tile_value(), main=True, fp=1.4),
        cost_tile("detTileFt3", "per ft³", det_tile_value("CubicFt")),
        cost_tile("detTileLin", "per linear ft", det_tile_value("EquipFt")),
        cost_tile("detTileSkid", "per skid spot", det_tile_value("SkidSpots")),
    ], gap=12),
    lbl("detLblWarn", f"If(detTglFuel.Value && FuelMissing({R}.Fuel), \"⚠ \" & {R}.Fuel & \" isn't in the Fuel Library, so this cost has no fuel. Add it on the Fuel library screen.\", \"\")",
        Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk", BorderColor="RGBA(233, 215, 155, 1)",
        BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12), **fixed(h=56), **STRETCH),
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
    field("detFldNotes", "Comments", h=82, controls=[
        lbl("detLblNotes", f'If(IsBlank({R}.Comments), "No comments", {R}.Comments)',
            Color=f"If(IsBlank({R}.Comments), clrInk3, clrInk)", Size=T_BODY, Wrap="true",
            VerticalAlign="VerticalAlign.Top", **fixed(h=60), **STRETCH),
    ]),
])


# ---------------------------------------------------------------- details: edit mode + lane history
DET_KEY = (f"Title = {R}.Title && Destination = {R}.Destination && Carrier = {R}.Carrier && "
           f"Mode = {R}.Mode && Equipment = {R}.Equipment")
DET_COLLECT = fx(f"""
    ClearCollect(
        colLaneRates,
        Sort(
            AddColumns(Filter(LinehaulRates, {DET_KEY}), IsOn, Upper(Trim(Active)) in ["YES", "TRUE"], LH, 0, NoFSC, false),
            Timestamp,
            SortOrder.Descending
        )
    )
""")
DET_OPEN_EDIT = ("Set(varEditRate, true); Reset(detTglEditActive); Reset(detDteEditEff); "
                 "Reset(detDteEditExp); Reset(detTxtEditNotes)")

det_edit_err = fx("""
    Trim(
        If(
            IsBlank(detDteEditEff.SelectedDate) || IsBlank(detDteEditExp.SelectedDate) ||
            detDteEditExp.SelectedDate <= detDteEditEff.SelectedDate,
            "Expiry must be after the effective date. ", ""
        ) &
        If(
            detTglEditActive.Value && !IsBlank(detDteEditExp.SelectedDate) && detDteEditExp.SelectedDate < Today(),
            "An expired rate can't be active. Extend the expiry or set it to inactive. ", ""
        )
    )
""")

det_edit_warn = fx("""
    With(
        {act: First(Filter(colLaneRates, ID <> varRate.ID && IsOn))},
        Trim(
            If(
                detTglEditActive.Value && !IsBlank(act),
                "⚠ Another rate on this lane is active (base " & Text(act.Base, "$#,##0.00") & ", added " &
                Text(act.Timestamp, "mmm d, yyyy") & "). Saving switches it off. ", ""
            ) &
            If(
                !detTglEditActive.Value && varRate.IsOn && IsBlank(act),
                "⚠ This is the only active rate on this lane. After saving, the lane has no active rate. ", ""
            ) &
            If(
                !IsBlank(detDteEditExp.SelectedDate) && detDteEditExp.SelectedDate < Today() &&
                varRate.ExpiryDate >= Today(),
                "⚠ The new expiry has already passed, so this rate will drop off Recent entries. ", ""
            )
        )
    )
""")

det_do_save = fx(f"""
    Set(varSavingEdit, true);
    With(
        {{
            r: Patch(
                LinehaulRates,
                LookUp(LinehaulRates, ID = varRate.ID),
                {{
                    Active: If(detTglEditActive.Value, "Yes", "No"),
                    EffectiveDate: detDteEditEff.SelectedDate,
                    ExpiryDate: detDteEditExp.SelectedDate,
                    Comments: detTxtEditNotes.Text
                }}
            )
        }},
        If(
            IsError(r) || IsBlank(r.ID),
            Notify("Changes weren't saved. Check your connection and try again.", NotificationType.Error),
            If(
                Upper(r.Active) = "YES",
                ForAll(
                    Filter(
                        AddColumns(
                            Filter(
                                LinehaulRates,
                                Title = r.Title && Destination = r.Destination && Carrier = r.Carrier &&
                                Mode = r.Mode && Equipment = r.Equipment
                            ),
                            IsOn, Upper(Trim(Active)) in ["YES", "TRUE"]
                        ),
                        IsOn && ID <> r.ID
                    ) As old,
                    Patch(LinehaulRates, LookUp(LinehaulRates, ID = old.ID), {{Active: "No"}})
                )
            );
            Set(
                varRate,
                Patch(
                    varRate,
                    {{
                        Active: r.Active,
                        IsOn: Upper(r.Active) = "YES",
                        EffectiveDate: r.EffectiveDate,
                        ExpiryDate: r.ExpiryDate,
                        Comments: r.Comments
                    }}
                )
            );
""") + "\n" + indent(DET_COLLECT, "        ") + ";\n        " + fx("""
            Set(varEditRate, false);
            Notify("Changes saved.", NotificationType.Success)
        )
    );
    Set(varConfirmEdit, false);
    Set(varSavingEdit, false)
""")

det_save = ("If(\n    !IsBlank(detLblEditErr.Text),\n    Notify(detLblEditErr.Text, NotificationType.Error),\n"
            "    !IsBlank(detLblEditWarn.Text),\n    Set(varConfirmEdit, true),\n"
            + indent(det_do_save, "    ") + "\n)")

det_edit = section("detSecEdit", "✎", s("Edit status & dates"),
                   s("To change the price, save a new rate so the history stays intact"),
                   height="302 + If(detLblEditErr.Visible, 68, 0) + If(detLblEditWarn.Visible, 86, 0)",
                   Visible="varEditRate", BorderColor="clrBlueHover", body=[
    row("detEditRow", 60, [
        field("detFldEditActive", "Active rate", [toggle("detTglEditActive", "Active", "Inactive",
                                                         default=f"{R}.IsOn", Height=36, **STRETCH)]),
        field("detFldEditEff", "Effective *", [datepick("detDteEditEff", f"{R}.EffectiveDate")]),
        field("detFldEditExp", "Expiry *", [datepick("detDteEditExp", f"{R}.ExpiryDate")]),
    ]),
    field("detFldEditNotes", "Comments", h=88, controls=[textin("detTxtEditNotes", "Why the change?", Default=f"{R}.Comments",
                                                 Mode="TextMode.MultiLine", Height=64)]),
    lbl("detLblEditErr", det_edit_err, Visible="!IsBlank(Self.Text)", Fill="clrRedBg", Color="clrRed",
        BorderColor="clrRed", BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12), **fixed(h=56), **STRETCH),
    lbl("detLblEditWarn", det_edit_warn, Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk",
        BorderColor="RGBA(233, 215, 155, 1)", BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12),
        **fixed(h=74), **STRETCH),
    row("detEditBtns", 42, inset=2, children=[
        rect("detEditSpacer", Fill="clrClear", Height=10, **fill(1, 0)),
        btn("detBtnEditCancel", s("Cancel"), OnSelect="Set(varEditRate, false)", **fixed(100, 38)),
        btn("detBtnEditSave", 'If(varSavingEdit, "Saving…", "Save changes")', "primary", OnSelect=det_save,
            DisplayMode="If(IsBlank(detLblEditErr.Text) && !varSavingEdit, DisplayMode.Edit, DisplayMode.Disabled)",
            **fixed(140, 38)),
    ], gap=12),
])

# column: (key, header, x fraction, width fraction, align)
LANE_COLS = [("Status", "Status", 0.00, 0.16, "Left"), ("Base", "Base", 0.16, 0.15, "Right"),
             ("Fuel", "Fuel", 0.33, 0.14, "Left"), ("Eff", "Effective", 0.47, 0.17, "Left"),
             ("Exp", "Expiry", 0.64, 0.17, "Left"), ("Added", "Added", 0.81, 0.19, "Left")]
LANE_TEXT = {
    "Base": 'Text(ThisItem.Base, "$#,##0.00")',
    "Fuel": "ThisItem.Fuel",
    "Eff": 'Text(ThisItem.EffectiveDate, "mmm d, yyyy")',
    "Exp": 'Text(ThisItem.ExpiryDate, "mmm d, yyyy")',
    "Added": 'Text(ThisItem.Timestamp, "mmm d, yyyy")',
}


def lane_template():
    kids = [pill("detLaneRowStatus", 'If(ThisItem.IsOn, "Active", "Inactive")',
                 "If(ThisItem.IsOn, clrGreenBg, clrSoft)", "If(ThisItem.IsOn, clrGreenInk, clrInk3)",
                 OnSelect="Select(Parent)", X=12, Y=11, Width=74)]
    for key, _, x, w, align in LANE_COLS[1:]:
        kids.append(lbl(f"detLaneRow{key}", LANE_TEXT[key], OnSelect="Select(Parent)", Size=T_TABLE,
                        FontWeight="If(ThisItem.ID = varRate.ID, FontWeight.Bold, FontWeight.Normal)",
                        Color="If(ThisItem.ExpiryDate < Today(), clrRed, clrInk)" if key == "Exp" else "clrInk",
                        Align=f"Align.{align}", PaddingLeft=10, PaddingRight=10,
                        X=f"Parent.TemplateWidth * {x}", Y=0, Width=f"Parent.TemplateWidth * {w}", Height=44))
    kids.append(rect("detLaneRowSep", Fill="clrSoft", X=0, Y=43, Width="Parent.TemplateWidth", Height=1))
    return kids


det_history = section("detSecHistory", "3", s("All rates on this lane"),
                      'CountRows(colLaneRates) & If(CountRows(colLaneRates) = 1, " rate", " rates") & " · select one to open it"',
                      height="89 + If(detLblMultiActive.Visible, 56, 0) + Min(Max(CountRows(colLaneRates), 1), 6) * 44",
                      body_pad=0, body_gap=0, body=[
    lbl("detLblMultiActive",
        'With({n: CountRows(Filter(colLaneRates, IsOn))}, If(n > 1, "⚠ " & n & " rates on this lane are active. '
        'Open the one that should stay active, choose Edit rate and save it; the others switch off.", ""))',
        Visible="!IsBlank(Self.Text)", Fill="clrAmberBg", Color="clrAmberInk", Size=T_SECONDARY, Wrap="true",
        **pads(8, 16), **fixed(h=56), **STRETCH),
    manual("detLaneHdr", [
        *[caps(f"detLaneHdr{k}", h, Align=f"Align.{a}", PaddingLeft=12 if k == "Status" else 10, PaddingRight=10,
               X=f"Parent.Width * {x}", Y=7, Width=f"Parent.Width * {w}") for k, h, x, w, a in LANE_COLS],
        rect("detLaneHdrLine", Fill="clrBlue", X=0, Y=30, Width="Parent.Width", Height=2),
    ], Fill="clrPanel", Height=32, **fixed(), **STRETCH),
    node("detLaneGallery", "Gallery@2.15.0", {
        "Items": "colLaneRates", "TemplateSize": 44, "TemplatePadding": 0,
        "TemplateFill": "If(ThisItem.ID = varRate.ID, clrSoft, clrPanel)", "BorderThickness": 0,
        "OnSelect": "Set(varRate, ThisItem); Set(varEditRate, false)", "ShowScrollbar": "true",
        "Height": "Min(Max(CountRows(colLaneRates), 1), 6) * 44", **fixed(), **STRETCH,
    }, lane_template(), "BrowseLayout_Vertical_TwoTextOneImageVariant_ver5.0"),
])

DET_LEFT_H = "(detSecLane.Height + 16 + detSecCost.Height)"
DET_RIGHT_H = "(If(varEditRate, detSecEdit.Height + 16, 0) + detSecHistory.Height)"

write_screen("scrDetails", {"Fill": "clrPage", "OnVisible": "Set(varEditRate, false); Set(varConfirmEdit, false); Set(varSavingEdit, false);\n" + DET_COLLECT}, [
    shell("det", "Recent",
          f'"Rate details · " & {R}.Title & {R}.Destination & "-" & {R}.Carrier & "-" & {R}.Mode & "-" & {R}.Equipment',
          [btn("detHdrBtnEdit", s("Edit rate"), "primary", Visible="!varEditRate", OnSelect=DET_OPEN_EDIT,
               **fixed(110, 38)),
           btn("detHdrBtnBack", s("← Back to recent"), OnSelect="Navigate(scrRecent, ScreenTransition.None)",
               **fixed(176, 38))],
          body("det", [
              det_hero,
              row("detCols", fx(f"""
                  If(
                      detBody.Width < 900,
                      {DET_LEFT_H} + 4 + 16 + {DET_RIGHT_H} + 4,
                      Max({DET_LEFT_H}, {DET_RIGHT_H}) + 4
                  )
              """), [
                  box("detColLeft", "Vertical", [det_lane, det_cost], LayoutGap=16, Height=DET_LEFT_H + " + 4", **pads(2),
                      FillPortions="If(detBody.Width < 900, 0, 1.15)", LayoutMinWidth=320, **STRETCH),
                  box("detColRight", "Vertical", [det_edit, det_history], LayoutGap=16, Height=DET_RIGHT_H + " + 4", **pads(2),
                      FillPortions="If(detBody.Width < 900, 0, 1)", LayoutMinWidth=320, **STRETCH),
              ], gap=16,
                  LayoutDirection="If(detBody.Width < 900, LayoutDirection.Vertical, LayoutDirection.Horizontal)"),
              lbl("detLblFooter",
                  f'"Submitted by " & {R}.SubmittedBy & " · " & Text({R}.Timestamp, "mmm d, yyyy h:mm AM/PM")',
                  Size=T_SECONDARY, Color="clrInk3", **fixed(h=24), **STRETCH),
          ])),
    modal("det", "varConfirmEdit", s("Check before saving"), "detLblEditWarn.Text",
          "Set(varConfirmEdit, false)", s("Save changes"), det_do_save),
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
    lbl("fulRowProg", "ThisItem.Title", Size=T_BODY, FontWeight="FontWeight.Bold", PaddingLeft=16,
        X=0, Y=0, Width="Parent.TemplateWidth * 0.28", Height=58),
    lbl("fulRowFsc", 'Text(ThisItem.FSC, "0.00") & "%"', Size=T_BODY, FontWeight="FontWeight.Bold", Align="Align.Right",
        PaddingRight=10, X="Parent.TemplateWidth * 0.28", Y=0, Width="Parent.TemplateWidth * 0.14", Height=58),
    lbl("fulRowEff", 'Text(ThisItem.EffectiveDate, "mmm d, yyyy")', Size=T_TABLE, PaddingLeft=16,
        X="Parent.TemplateWidth * 0.46", Y=0, Width="Parent.TemplateWidth * 0.18", Height=58),
    lbl("fulRowWho", 'ThisItem.AddedByUser & Char(10) & Text(ThisItem.Timestamp, "mmm d, h:mm AM/PM")', Size=T_SECONDARY,
        Color="clrInk3", Wrap="true", PaddingLeft=16, X="Parent.TemplateWidth * 0.64", Y=0,
        Width="Parent.TemplateWidth * 0.24", Height=58),
    btn("fulRowEdit", s("Edit"), Size=T_SECONDARY, X="Parent.TemplateWidth - 76", Y=15, Width=60, Height=28,
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
                Set(varFuelEdit, false);
                Set(varFuelRec, Blank());
                Reset(fulTxtProgram);
                Reset(fulTxtFsc);
                Reset(fulDteEff)
            )
        )
    )
""")

fuel_programs = section("fulSecList", "A", s("Programs"),
                        s("Rates use today's FSC, so editing a program updates every rate on it"),
                        body_pad=0, body_gap=0, FillPortions=1.5, LayoutMinWidth=320,
                        body=[fuel_header, fuel_gallery])

fuel_form = section("fulSecForm", "B", 'If(varFuelEdit, "Edit program", "Add program")',
                    'If(varFuelEdit, "Changing " & varFuelRec.Title & " updates the cost of every rate on it", "Program names must be unique")',
                    height="If(fulLblErr.Visible, 416, 348)", BorderColor="clrBlueHover",
                    FillPortions="If(fulBody.Width < 900, 0, 1)", LayoutMinWidth=320,
                    AlignInContainer="If(fulBody.Width < 900, AlignInContainer.Stretch, AlignInContainer.Start)", body=[
    row("fulFormRow1", 60, [field("fulFldProgram", "Program *", [
        textin("fulTxtProgram", "e.g. CP", Default='If(varFuelEdit, varFuelRec.Title, "")')])]),
    row("fulFormRow2", 60, [field("fulFldFsc", "FSC (%) *", [
        textin("fulTxtFsc", "e.g. 36.16", Format="TextFormat.Number", Align="Align.Right",
               Default='If(varFuelEdit, Text(varFuelRec.FSC), "")')])]),
    row("fulFormRow3", 60, [field("fulFldEff", "Effective *", [
        datepick("fulDteEff", "If(varFuelEdit, varFuelRec.EffectiveDate, Today())")])]),
    lbl("fulLblErr", fuel_err, Visible="!IsBlank(Self.Text)", Fill="clrRedBg", Color="clrRed",
        BorderColor="clrRed", BorderThickness=1, Size=T_SECONDARY, Wrap="true", **pads(8, 12), **fixed(h=56), **STRETCH),
    row("fulFormBtns", 42, inset=2, children=[
        rect("fulFormSpacer", Fill="clrClear", Height=10, **fill(1, 0)),
        btn("fulBtnCancel", s("Clear"), OnSelect=f"Set(varFuelEdit, false); Set(varFuelRec, Blank()); {fuel_open}",
            **fixed(100, 38)),
        btn("fulBtnSave", s("Save"), "primary", OnSelect=fuel_save, **fixed(120, 38), DisplayMode=fx("""
            If(
                IsBlank(Trim(fulTxtProgram.Text)) || IsBlank(Trim(fulTxtFsc.Text)) ||
                IsBlank(fulDteEff.SelectedDate) || !IsBlank(fulLblErr.Text),
                DisplayMode.Disabled,
                DisplayMode.Edit
            )
        """)),
    ], gap=12),
])

write_screen("scrFuel", {"Fill": "clrPage", "OnVisible": f"Set(varFuelForm, true); Set(varFuelEdit, false); Set(varFuelRec, Blank()); {fuel_open}"}, [
    shell("ful", "Fuel", s("Fuel library · FSC % by program"),
          [btn("fulHdrBtnAdd", s("+ Add program"), "primary", **fixed(150, 38),
               OnSelect=f"Set(varFuelRec, Blank()); Set(varFuelEdit, false); Set(varFuelForm, true); {fuel_open}")],
          body("ful", [box("fulCols", "Horizontal", [fuel_programs, fuel_form], LayoutGap=16, **pads(2),
                           LayoutDirection="If(fulBody.Width < 900, LayoutDirection.Vertical, LayoutDirection.Horizontal)",
                           **fill(1), **STRETCH)], scroll=False)),
])

print("wrote", ", ".join(sorted(p.name for p in OUT.glob("scr*.yaml"))))
print("\n".join(ISSUES) if ISSUES else "audit: every text control fits")
