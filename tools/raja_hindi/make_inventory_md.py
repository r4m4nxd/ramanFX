"""Add durations from process_state.json to inventory.json and write inventory.md."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import process as P

inv = json.load(open(P.INV))
state = json.load(open(P.TOOLS + "/process_state.json"))
recs = P.recordings(inv)
byid = {}
for r in recs:
    s = state.get(f"{r['group']}/{r['safe']}", {})
    for k in ("mp4", "m4a"):
        if r[k]: byid[r[k]["id"]] = (r, s)
for f in inv:
    if f["id"] in byid:
        r, s = byid[f["id"]]
        f["recording"] = f"{r['group']}/{r['safe']}"
        f["duration_s"] = s.get("video_duration_s") if f["name"].endswith(".mp4") else s.get("duration_s")
        if f["duration_s"] is None: f["duration_s"] = s.get("duration_s")
json.dump(inv, open(P.INV, "w"), indent=1, ensure_ascii=False)
L = ["# Raja Sahil Changaiz Hindi/Urdu recordings - inventory", "",
     "Source: Google Drive (private 1:1 folder 1w0ktu4UODrNI-vQpd0AGj-NmYhPnA0Ke, course folder 1nlvwqVZ74r1pEnaeiMXTWhDPFsjwf36o).",
     "One recording per folder; when a folder has an audio*.m4a it is used for audio, the .mp4 for frames.", ""]
tot = {}
for g in ("private", "course"):
    L += [f"## {g}", "", "| # | recording (safe name) | Drive folder | files (id, MB) | duration | frames |", "|---|---|---|---|---|---|"]
    for i, r in enumerate([r for r in recs if r["group"] == g], 1):
        s = state.get(f"{g}/{r['safe']}", {})
        files = "<br>".join(f"{r[k]['name']} (`{r[k]['id']}`, {r[k]['size']/1e6:.0f})" for k in ("mp4", "m4a") if r[k])
        d = s.get("duration_s") or 0; tot[g] = tot.get(g, 0) + d
        L.append(f"| {i} | {r['safe']} | {r['folder'] or '(root)'} | {files} | {int(d//3600)}:{int(d%3600//60):02d}:{int(d%60):02d} | {s.get('frames','-')} |")
    L += ["", f"Total {g}: {tot[g]/3600:.2f} h", ""]
other = [f for f in inv if not f["name"].lower().endswith((".mp4", ".m4a"))]
L += ["Non-media files skipped: " + ", ".join(f"{'/'.join(f['path'])}/{f['name']}" for f in other), ""]
open(P.TOOLS + "/inventory.md", "w").write("\n".join(L))
print(tot)
