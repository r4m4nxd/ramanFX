# Lesson narration (Kokoro-82M, kokoro-onnx fp32)

- Voices: af_heart, am_michael. AAC 64k mono, -16 LUFS, limiter -4 dBFS.
- Output: tools/narration/out/<source>/<NN>/<voice>.m4a + chapters.json; manifest.json per source (gitignored).
- Status: PROGRESS.md; log: out/batch.log. Pauses below 3 GB free disk.
- Resume / restart (resumable by textHash):
  `cd /home/user/ramanFX && node tools/narration/dump-narration.mjs && nohup nice -n 5 python3 tools/narration/batch.py >> tools/narration/out/batch.log 2>&1 &`
- Stop: run `pkill -f 'python3 tools/narration/batch.py'` on its own (not chained in a compound command).
- Google Drive folder ids: drive_folders.json (upload needs a user OAuth token, see chat).
- Known leftovers for narration.ts: dates like 4-21-09, "3M" read as 3 minute in one Kevin lesson 2 note.

## Queued (user request)
1. After the narration batch: transcribe the remaining 20 Raja Hindi/Urdu recordings on ~7 parallel cloud sessions (download from the shared Drive folders, whisper large-v3 lang=ur, push transcripts to audio/raja-tx-* branches).
2. Write the English Raja lessons from those transcripts (as the Feb 2 pilot, src/core/mentors/raja/private.ts n>=101 and course sessions).
3. Narrate every new Raja lesson with am_michael and upload to Drive "2 Raja" (uploader handles it automatically once rendered).
