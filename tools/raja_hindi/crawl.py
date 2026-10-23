"""Crawl public Drive folders (embeddedfolderview) and build inventory.json/.md.
Sizes/mime via ranged GET on the usercontent download endpoint."""
import json, re, subprocess, sys, html, time
ROOTS = {"private": "1w0ktu4UODrNI-vQpd0AGj-NmYhPnA0Ke", "course": "1nlvwqVZ74r1pEnaeiMXTWhDPFsjwf36o"}
OUT = "/home/user/ramanFX/tools/raja_hindi/inventory"
ENT = re.compile(r'<div class="flip-entry" id="entry-([^"]+)".*?<a href="([^"]+)".*?<div class="flip-entry-title">(.*?)</div>', re.S)

def get(url):
    for i in range(5):
        r = subprocess.run(["curl", "-sSL", "--max-time", "60", url], capture_output=True, text=True)
        if r.returncode == 0 and "flip-entry" in r.stdout or "flip-empty" in r.stdout:
            return r.stdout
        time.sleep(2 ** i)
    return r.stdout

def crawl(fid, path, out):
    for m in ENT.finditer(get(f"https://drive.google.com/embeddedfolderview?id={fid}")):
        eid, href, title = m.group(1), m.group(2), html.unescape(m.group(3))
        if "/folders/" in href:
            crawl(eid, path + [title], out)
        else:
            out.append({"path": path, "id": eid, "name": title})

def head(fid):
    url = f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t"
    for i in range(4):
        r = subprocess.run(["curl", "-sSL", "-r", "0-0", "-D", "-", "-o", "/dev/null", "--max-time", "60", url], capture_output=True, text=True)
        size = mime = None
        for line in r.stdout.splitlines():
            l = line.lower()
            if l.startswith("content-range:"): size = int(l.split("/")[-1])
            if l.startswith("content-type:"): mime = line.split(":", 1)[1].strip()
        if size: return size, mime
        time.sleep(2 ** i)
    return None, mime

items = []
for g in ["private", "course"]:
    files = []
    crawl(ROOTS[g], [], files)
    for f in files:
        f["group"] = g
        f["size"], f["mimeType"] = head(f["id"])
        print(g, "/".join(f["path"]), f["name"], f["size"], f["mimeType"], flush=True)
    items += files
json.dump(items, open(OUT + ".json", "w"), indent=1, ensure_ascii=False)
