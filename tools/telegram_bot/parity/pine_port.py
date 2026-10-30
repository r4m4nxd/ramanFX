"""Machine translation of the Pine arrival engine (the RFX_ARRIVAL_PINE block of public/tools/RamanFX_ZoneVision_Arrival.pine,
copied verbatim into RamanFX_ZoneStrategy.pine) to Python, replayed on tools/telegram_bot/parity/arrival_fixtures.json.

TradingView cannot run here, so the Pine text itself is translated line by line (the block is written in a strict
subset for this: one statement per line, while loops, `cond ? a : b`, UDTs, arrays) and executed. Array reads use a
list type that raises on an out-of-range index, as Pine's array.get does. The output is mapped to the canonical TS
shape and compared with the same tolerance as mql_port.py.

    python3 tools/telegram_bot/parity/pine_port.py [file.pine]
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import mql_port  # noqa: E402  (fixture loader, epoch(), close())

DEFAULT_PINE = HERE.parents[2] / 'public' / 'tools' / 'RamanFX_ZoneVision_Arrival.pine'


class PArr(list):
    def get(self, i):
        if not (0 <= i < len(self)): raise IndexError(f'array.get({i}) of size {len(self)}')
        return list.__getitem__(self, i)
    def set(self, i, v):
        if not (0 <= i < len(self)): raise IndexError(f'array.set({i}) of size {len(self)}')
        list.__setitem__(self, i, v)
    def push(self, v): self.append(v)
    def size(self): return len(self)
    def unshift(self, v): self.insert(0, v)
    def concat(self, o): self.extend(o); return self
    def slice(self, a, b): return PArr(list.__getitem__(self, slice(a, b)))
    def copy(self): return PArr(self)
    def clear(self): del self[:]


def array_new(n=0, v=None): return PArr([v] * n)
def array_from(*a): return PArr(a)


def block(text: str) -> str:
    a = text.index('// ==== RFX_ARRIVAL_PINE BEGIN ====')
    b = text.index('// ==== RFX_ARRIVAL_PINE END ====')
    return text[a:b]


def split_top(s: str, sep: str) -> list[str]:
    out, depth, cur, q = [], 0, '', None
    for ch in s:
        if q:
            cur += ch
            if ch == q: q = None
            continue
        if ch in '"\'': q = ch; cur += ch; continue
        if ch in '([': depth += 1
        elif ch in ')]': depth -= 1
        if ch == sep and depth == 0: out.append(cur); cur = ''; continue
        cur += ch
    out.append(cur)
    return out


def tern(s: str) -> str:
    """Pine `c ? a : b` (lowest precedence, right associative) -> Python `(a if c else b)`, recursively."""
    depth, q, qpos = 0, None, -1
    for i, ch in enumerate(s):
        if q:
            if ch == q: q = None
            continue
        if ch in '"\'': q = ch; continue
        if ch in '([': depth += 1
        elif ch in ')]': depth -= 1
        elif ch == '?' and depth == 0: qpos = i; break
    if qpos >= 0:
        depth, q, n = 0, None, 0
        for j in range(qpos + 1, len(s)):
            ch = s[j]
            if q:
                if ch == q: q = None
                continue
            if ch in '"\'': q = ch; continue
            if ch in '([': depth += 1
            elif ch in ')]': depth -= 1
            elif depth == 0 and ch == '?': n += 1
            elif depth == 0 and ch == ':':
                if n == 0:
                    return f'({tern(s[qpos + 1:j]).strip()} if {tern(s[:qpos]).strip()} else {tern(s[j + 1:]).strip()})'
                n -= 1
        raise SyntaxError('unbalanced ?: in ' + s)
    # no top-level ternary: recurse into the parenthesised groups (each comma-separated part on its own)
    out, i = '', 0
    while i < len(s):
        ch = s[i]
        if ch in '"\'':
            j = s.index(ch, i + 1); out += s[i:j + 1]; i = j + 1; continue
        if ch == '(':
            depth, j = 1, i + 1
            while depth:
                if s[j] == '(': depth += 1
                elif s[j] == ')': depth -= 1
                j += 1
            inner = s[i + 1:j - 1]
            out += '(' + ', '.join(tern(p).strip() for p in split_top(inner, ',')) + ')'
            i = j; continue
        out += ch; i += 1
    return out


def expr(e: str) -> str:
    e = re.sub(r'array\.new<[^>]*>', 'array_new', e)
    e = e.replace('array.from(', 'array_from(').replace('math.max(', 'max(').replace('math.min(', 'min(').replace('math.abs(', 'abs(')
    e = e.replace('str.tostring(', 'str(')
    e = re.sub(r'\b([A-Z]\w*)\.new\(', r'\1(', e)
    e = re.sub(r'\btrue\b', 'True', e); e = re.sub(r'\bfalse\b', 'False', e); e = re.sub(r'\bna\b', 'None', e)
    return tern(e)


TYPE = r'(?:int|float|bool|string|array<[^>]+>|[A-Z]\w*)'


def translate(src: str) -> str:
    lines = [ln.split('//', 1)[0].rstrip() if '"' not in ln.split('//', 1)[0] else ln.rstrip() for ln in src.splitlines()]
    # (no string in the block holds '//': the simple split is safe; the check above keeps quoted lines intact)
    py, i = [], 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip(): i += 1; continue
        m = re.match(r'^type (\w+)$', ln)
        if m:
            fields, i = [], i + 1
            while i < len(lines) and (not lines[i].strip() or lines[i].startswith('    ')):
                f = lines[i].strip()
                if f:
                    fm = re.match(rf'^{TYPE}\s+(\w+)(?:\s*=\s*(.*))?$', f)
                    fields.append((fm.group(1), expr(fm.group(2)) if fm.group(2) else 'None'))
                i += 1
            py.append(f'class {m.group(1)}:')
            args = ', '.join(f'{n}={d}' for n, d in fields)
            py.append(f'    def __init__(self, {args}):')
            for n, _ in fields: py.append(f'        self.{n} = {n}')
            py.append('    def copy(self): import copy as _c; return _c.copy(self)')
            continue
        m = re.match(r'^(\w+)\((.*)\)\s*=>\s*(.*)$', ln)
        if m:
            params = ', '.join(p.strip().split()[-1] for p in split_top(m.group(2), ',') if p.strip())
            py.append(f'def {m.group(1)}({params}):')
            if m.group(3):
                py.append(f'    return {expr(m.group(3))}'); i += 1; continue
            i += 1
            body = []
            while i < len(lines) and (not lines[i].strip() or lines[i].startswith('    ')):
                if lines[i].strip(): body.append(lines[i])
                i += 1
            last = max(k for k, b in enumerate(body) if not b.startswith('     ') and b.startswith('    '))
            for k, b in enumerate(body):
                py.append(stmt(b, ret=(k == last)))
            continue
        py.append(stmt(ln, False))
        i += 1
    return '\n'.join(py) + '\n'


def stmt(ln: str, ret: bool) -> str:
    ind = ln[:len(ln) - len(ln.lstrip())]
    s = ln.strip()
    if ret: return f'{ind}return {expr(s)}'
    for kw, pk in (('else if ', 'elif '), ('if ', 'if '), ('while ', 'while ')):
        if s.startswith(kw): return f'{ind}{pk}{expr(s[len(kw):])}:'
    if s == 'else': return f'{ind}else:'
    if s in ('break', 'continue'): return ind + s
    m = re.match(rf'^(?:var\s+)?{TYPE}\s+(\w+)\s*=\s*(.*)$', s)
    if m: return f'{ind}{m.group(1)} = {expr(m.group(2))}'
    m = re.match(r'^([\w.]+)\s*(:=|\+=|-=)\s*(.*)$', s)
    if m: return f'{ind}{m.group(1)} {"=" if m.group(2) == ":=" else m.group(2)} {expr(m.group(3))}'
    m = re.match(r'^(\w+)\s*=\s*(.*)$', s)
    if m: return f'{ind}{m.group(1)} = {expr(m.group(2))}'
    return ind + expr(s)


def load(path: Path):
    code = translate(block(path.read_text()))
    ns = {'array_new': array_new, 'array_from': array_from, 'PArr': PArr}
    exec(compile(code, str(path) + ' [pine->py]', 'exec'), ns)
    return ns, code


def run_case(ns, c):
    names: dict[str, dict[int, str]] = {}
    def ser(rows, tf, price):
        S = ns['rxNew'](mql_port.TF_MIN[tf])
        for r in reversed(rows):
            t = mql_port.epoch(r[0]) * 1000; names.setdefault(tf, {})[t] = r[0]
            ns['rxPush'](S, t, float(r[1]), float(r[2]), float(r[3]), float(r[4]))
        return ns['rxFinish'](S, S.c.get(1) if price is None else float(price))
    p = ns['rxParamsFX']() if c['market'] == 'fx' else ns['rxParamsRaja']()
    tf, htf, ltf = mql_port.TF_MIN[c['tf']], mql_port.TF_MIN[c['htf']] if c['htf'] else 0, mql_port.TF_MIN[c['ltf']] if c['ltf'] else 0
    R = ns['rxReading'](tf, htf, ltf)
    R.S = ser(c['bars'][c['tf']], c['tf'], None)
    if c['htf']: R.H = ser(c['bars'][c['htf']], c['htf'], c['price']); R.hasH = True
    if c['ltf']: R.LS = ser(c['bars'][c['ltf']], c['ltf'], None); R.hasL = True
    ns['arrArrivalTf'](R, float(c['price']), p, float(c.get('spread') or 0))
    nm = lambda t, k='S': names.get({'S': c['tf'], 'H': c['htf'], 'L': c['ltf']}[k], {}).get(t, '')
    Z = lambda z, k='S': {'dir': z.dir, 'prox': z.prox, 'dist': z.dist, 'legBar': z.legBar, 'saBar': z.saBar, 'removed': z.removed,
                   'removedBar': z.removedBar if z.removed else -1, 'tLeg': nm(z.tLeg, k), 't0': nm(z.baseStart, k), 'made': nm(z.made, k)}
    Ln = lambda t, k='S': {'dir': t.dir, 'a': t.a, 'b': t.b, 'pa': t.pa, 'pb': t.pb, 'ta': nm(t.ta, k), 'tb': nm(t.tb, k)}
    Ar = lambda a, zs, k='S': {'zone': Z(a.zone, k), 'line': Ln(a.line, k), 'legs': list(a.legs), 'crossBar': a.crossBar, 'crossPx': a.crossPx,
                        'removed': [Z(zs.get(y), k) for y in a.rem], 'strong': a.strong, 'valley': a.valley}
    Lr = R.lines
    lines = {'up': ({'a': Lr.up.a, 'b': Lr.up.b, 'pa': Lr.up.pa, 'pb': Lr.up.pb} if Lr.hasUp else None),
             'dn': ({'a': Lr.dn.a, 'b': Lr.dn.b, 'pa': Lr.dn.pa, 'pb': Lr.dn.pb} if Lr.hasDn else None), 'why': {'up': Lr.whyUp, 'dn': Lr.whyDn}}
    plan = None
    if R.hasPlan:
        P = R.plan
        plan = {'dir': P.dir, 'entry': P.entry, 'stop': P.stop, 'buffer': P.buffer, 'atr': P.atr, 'basis': 'htf' if P.basis == 1 else 'valley',
                'valley': P.valley, 'host': Z(P.host, 'H') if P.hasHost else None, 'rr': P.rr if P.hasRR else None,
                'ceiling': P.ceiling if P.hasCeiling else None, 'lineNow': P.lineNow if P.hasLineNow else None,
                'ceilingLine': Ln(P.ceilingLine, 'H') if P.hasLineNow else None, 'weak': [Z(R.zones.get(i)) for i in P.weak],
                'realign': Z(R.zones.get(P.realign)) if P.realign >= 0 else None, 'target': Z(R.zones.get(P.target)) if P.target >= 0 else None,
                'targetPx': P.targetPx if P.hasTargetPx else None, 'htfZone': Z(P.htfZone, 'H') if P.hasHtfZone else None,
                'tp': P.tp if P.hasTp else None, 'capped': P.capped, 'extended': P.extended}
    conf = None
    if R.hasConfirm:
        K = R.conf
        conf = {'tf': c['ltf'], 'zone': Z(K.zone, 'L'), 'arrival': Ar(R.larr.get(K.arr), R.lz, 'L'), 'target': K.target if K.hasTarget else None,
                'inArea': K.inArea, 'entry': K.entry, 'stop': K.stop, 'buffer': K.buffer, 'atr': K.atr,
                'basis': 'htf' if K.basis == 1 else 'valley', 'rr': K.rr if K.hasRR else None}
    mom = {'a': Lr.mom.a, 'b': Lr.mom.b, 'pa': Lr.mom.pa, 'pb': Lr.mom.pb, 'dir': Lr.mom.dir} if Lr.hasMom else None
    return {'lines': lines, 'arrivals': [Ar(a, R.zones) for a in R.arr], 'current': R.cur, 'plan': plan, 'confirm': conf, 'pending': R.pending}, mom


def run_fixtures(pine: Path, fixtures: Path | None = None, out_json: bool = False) -> int:
    ns, _ = load(pine)
    fx = json.loads((fixtures or HERE / 'arrival_fixtures.json').read_text())
    bad, moms, errs = 0, {}, []
    for c in fx['cases']:
        got, mom = run_case(ns, c)
        moms[c['name']] = mom
        try:
            mql_port.close(got, c['expected']); msg = 'ok'
        except AssertionError as e:
            bad += 1; msg = f'MISMATCH {e}'; errs.append(f"{c['name']}: {e}")
        if not out_json: print(f"{c['name']:<12} {c['tf']:<3} arrivals {len(got['arrivals'])}  {msg}")
    if out_json: print(json.dumps({'bad': bad, 'errors': errs[:5], 'momentum': moms}))
    else: print(f"{len(fx['cases']) - bad}/{len(fx['cases'])} fixture cases match the Pine port")
    return bad


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    sys.exit(1 if run_fixtures(Path(args[0]) if args else DEFAULT_PINE, Path(args[1]) if len(args) > 1 else None, out_json='--json' in sys.argv) else 0)
