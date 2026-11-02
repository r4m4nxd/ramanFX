"""cTrader Open API client (JSON over WebSocket, port 5036). Read-only: prices only.

Secrets (env): CTRADER_CLIENT_ID, CTRADER_CLIENT_SECRET, CTRADER_ACCESS_TOKEN (CTRADER_REFRESH_TOKEN kept for renewal).
`python ctrader.py check` logs in and prints safe facts only (account ids masked, symbol count, a few candles).
"""
import json, os, sys, time, itertools
import websocket  # pip install websocket-client

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ct_token  # noqa: E402  (the newest access token: Supabase table, else the secret)

HOSTS = {True: "wss://live.ctraderapi.com:5036", False: "wss://demo.ctraderapi.com:5036"}
# payload types (OpenApiMessages.proto)
APP_AUTH, APP_AUTH_RES = 2100, 2101
ACC_AUTH, ACC_AUTH_RES = 2102, 2103
SYMBOLS, SYMBOLS_RES = 2114, 2115
TRENDBARS, TRENDBARS_RES = 2137, 2138
ACC_LIST, ACC_LIST_RES = 2149, 2150
ERROR, HEARTBEAT = 2142, 51
ASSET_CLASS, ASSET_CLASS_RES = 2153, 2154
CATEGORY, CATEGORY_RES = 2160, 2161
PERIOD = {"M1": 1, "M5": 5, "M15": 7, "M30": 8, "H1": 9, "H4": 10, "D1": 12, "W1": 13, "MN1": 14, "MN": 14}


class CTrader:
    def __init__(self, live=True):
        self.ws = websocket.create_connection(HOSTS[live], timeout=30)
        self.ids = itertools.count(1)

    def call(self, ptype, payload, want):
        cid = str(next(self.ids))
        self.ws.send(json.dumps({"clientMsgId": cid, "payloadType": ptype, "payload": payload}))
        while True:
            m = json.loads(self.ws.recv())
            t = m.get("payloadType")
            if t == HEARTBEAT:
                continue
            if t == ERROR or "errorCode" in m.get("payload", {}):
                p = m.get("payload", {})
                raise RuntimeError(f"cTrader error {p.get('errorCode')}: {p.get('description', '')}")
            if t == want and m.get("clientMsgId") in (cid, None):
                return m.get("payload", {})

    def app_auth(self):
        return self.call(APP_AUTH, {"clientId": os.environ["CTRADER_CLIENT_ID"], "clientSecret": os.environ["CTRADER_CLIENT_SECRET"]}, APP_AUTH_RES)

    def accounts(self):
        return self.call(ACC_LIST, {"accessToken": ct_token.access_token()}, ACC_LIST_RES).get("ctidTraderAccount", [])

    def acc_auth(self, acc):
        return self.call(ACC_AUTH, {"ctidTraderAccountId": acc, "accessToken": ct_token.access_token()}, ACC_AUTH_RES)

    def symbols(self, acc):
        return self.call(SYMBOLS, {"ctidTraderAccountId": acc}, SYMBOLS_RES).get("symbol", [])

    def trendbars(self, acc, symbol_id, period, frm_ms, to_ms):
        """Raw trendbars [(start_utc_minutes, o, h, l, c, volume)] in [frm_ms, to_ms], oldest first (prices / 1e5)."""
        p = self.call(TRENDBARS, {"ctidTraderAccountId": acc, "period": PERIOD[period], "symbolId": symbol_id,
                                  "fromTimestamp": int(frm_ms), "toTimestamp": int(to_ms)}, TRENDBARS_RES)
        out = []
        for b in p.get("trendbar", []):
            lo = b.get("low", 0)
            out.append((b["utcTimestampInMinutes"], (lo + b.get("deltaOpen", 0)) / 1e5, (lo + b.get("deltaHigh", 0)) / 1e5,
                        lo / 1e5, (lo + b.get("deltaClose", 0)) / 1e5, b.get("volume", 0)))
        out.sort()
        return out

    def bars(self, acc, symbol_id, period, count=10):
        now = int(time.time() * 1000)
        span = {"M1": 60, "M5": 300, "M15": 900, "M30": 1800, "H1": 3600, "H4": 14400, "D1": 86400, "W1": 604800, "MN1": 2678400}[period]
        p = self.call(TRENDBARS, {"ctidTraderAccountId": acc, "period": PERIOD[period], "symbolId": symbol_id,
                                  "fromTimestamp": now - span * 1000 * (count * 2 + 10), "toTimestamp": now, "count": count}, TRENDBARS_RES)
        out = []
        for b in p.get("trendbar", []):
            lo = b.get("low", 0)
            out.append({"t": time.strftime("%Y-%m-%d %H:%M", time.gmtime(b["utcTimestampInMinutes"] * 60)),
                        "o": (lo + b.get("deltaOpen", 0)) / 1e5, "h": (lo + b.get("deltaHigh", 0)) / 1e5,
                        "l": lo / 1e5, "c": (lo + b.get("deltaClose", 0)) / 1e5})
        return out[-count:]


def inventory():
    """Every enabled symbol of the live account grouped by asset class / category (names only, no secrets): which
    Pepperstone symbols exist beyond the scanner's universe. Writes ctrader_symbols.json (uploaded as an artifact)."""
    c = CTrader(live=True); c.app_auth()
    a = next(x for x in c.accounts() if x.get("isLive"))
    acc = a["ctidTraderAccountId"]; c.acc_auth(acc)
    cls = {x["id"]: x.get("name", "") for x in c.call(ASSET_CLASS, {"ctidTraderAccountId": acc}, ASSET_CLASS_RES).get("assetClass", [])}
    cat = {x["id"]: (cls.get(x.get("assetClassId"), "?"), x.get("name", "")) for x in c.call(CATEGORY, {"ctidTraderAccountId": acc}, CATEGORY_RES).get("symbolCategory", [])}
    groups = {}
    for s in c.symbols(acc):
        if not s.get("enabled", True):
            continue
        k = cat.get(s.get("symbolCategoryId"), ("?", "?"))
        groups.setdefault(f"{k[0]} / {k[1]}", []).append(s.get("symbolName"))
    for k in sorted(groups):
        names = sorted(groups[k])
        print(f"{k}: {len(names)}" + (f"  {' '.join(names[:400])}" if not k.lower().startswith(("share", "stock", "etf")) else ""))
    with open("ctrader_symbols.json", "w") as f:
        json.dump(groups, f, indent=0)
    return 0


def mask(x):
    s = str(x)
    return "***" + s[-3:]


def check():
    for k in ("CTRADER_CLIENT_ID", "CTRADER_CLIENT_SECRET", "CTRADER_ACCESS_TOKEN", "CTRADER_REFRESH_TOKEN"):
        print(f"{k}: {'set' if os.environ.get(k) else 'MISSING'}")
    c = CTrader(live=True)
    c.app_auth(); print("app auth: OK")
    accs = c.accounts()
    print(f"accounts on this token: {len(accs)}")
    for a in accs:
        print(f"  account {mask(a.get('ctidTraderAccountId'))} login {mask(a.get('traderLogin'))} live={a.get('isLive')} broker={a.get('brokerTitleShort', '')}")
    if not accs:
        return 1
    a = next((x for x in accs if x.get("isLive")), accs[0])
    if not a.get("isLive"):
        c = CTrader(live=False); c.app_auth()
    acc = a["ctidTraderAccountId"]
    c.acc_auth(acc); print(f"account auth ({'live' if a.get('isLive') else 'demo'}): OK")
    syms = c.symbols(acc)
    print(f"symbols: {len(syms)}")
    names = {s.get("symbolName"): s.get("symbolId") for s in syms}
    for want in ("EURUSD", "XAUUSD", "Soybeans", "VIX", "Coffee", "US500", "GER40"):
        hit = [n for n in names if n and want.lower() in n.lower()][:3]
        print(f"  {want}: {hit or '-'}")
    for n in ("EURUSD", "XAUUSD"):
        if n in names:
            for b in c.bars(acc, names[n], "D1", 3):
                print(f"  {n} D1 {b}")
    return 0


if __name__ == "__main__":
    sys.exit(check() if sys.argv[1:] == ["check"] else inventory() if sys.argv[1:] == ["inventory"] else 2)
