#!/bin/bash
# 15-min status: restart uploader if missing, count rendered files per audio/* branch, uploaded count.
cd /home/user/ramanFX
if ! ps -eo args | grep -q "^[p]ython3 tools/narration/upload_drive.py"; then
  setsid nohup python3 tools/narration/upload_drive.py --watch >> tools/narration/out/upload.log 2>&1 < /dev/null &
  echo "uploader restarted"
fi
total=0
for ref in $(git ls-remote origin "refs/heads/audio/*" | awk '{print $2}'); do
  b=${ref#refs/heads/}
  git fetch -q origin "$b" 2>/dev/null
  n=$(git ls-tree -r --name-only FETCH_HEAD 2>/dev/null | grep -c 'am_michael.m4a')
  total=$((total+n)); echo "$b $n"
done
echo "rendered_on_branches $total (+5 course on Drive from local)"
python3 -I -c "import json;print('uploaded', len(json.load(open('/root/.config/ramanfx/drive_uploaded.json'))))"
# Raja transcription: one cloud session per recording, branch audio/rajatx-*
git fetch -q origin '+refs/heads/audio/rajatx-*:refs/remotes/origin/audio/rajatx-*' 2>/dev/null
tx=0; nt=0
for r in $(git for-each-ref --format='%(refname)' refs/remotes/origin/audio/rajatx-); do
  git ls-tree -r --name-only "$r" tools/raja_hindi/transcripts | grep -q . && n=$(git ls-tree -r --name-only "$r" tools/raja_hindi/transcripts | grep -c '\.json$') && [ "$n" -gt 1 ] && tx=$((tx+1))
  git ls-tree -r --name-only "$r" tools/raja_hindi/lessons | grep -c '_notes.md$' | grep -qv '^1$' && nt=$((nt+1))
done
echo "raja_transcribed $tx/20 raja_notes $nt/20"
