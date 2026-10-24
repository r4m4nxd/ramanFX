# Lesson narration (Kokoro-82M, kokoro-onnx fp32)

- Voices: af_heart, am_michael. AAC 64k mono, -16 LUFS, limiter -4 dBFS.
- Output: tools/narration/out/<source>/<NN>/<voice>.m4a + chapters.json; manifest.json per source (gitignored).
- Status: PROGRESS.md; log: out/batch.log. Pauses below 3 GB free disk.
- Resume / restart (resumable by textHash):
  `cd /home/user/ramanFX && node tools/narration/dump-narration.mjs && nohup nice -n 5 python3 tools/narration/batch.py >> tools/narration/out/batch.log 2>&1 &`
- Stop: run `pkill -f 'python3 tools/narration/batch.py'` on its own (not chained in a compound command).
- Google Drive folder ids: drive_folders.json (upload needs a user OAuth token, see chat).
- Known leftovers for narration.ts: dates like 4-21-09, "3M" read as 3 minute in one Kevin lesson 2 note.
