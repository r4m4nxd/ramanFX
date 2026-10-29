# Lesson videos -> PDFs Claude can read

1. Install once: Python 3 (python.org, tick "Add to PATH"), ffmpeg (`winget install Gyan.FFmpeg`), Pillow (`pip install pillow`).
2. Put each video and its transcript (same file name, `.txt` / `.srt` / `.vtt`) in one folder.
3. Run: `python video_to_pdf.py "C:\Lessons\Kevin"`
4. Each video gives `<name>.pdf` (key chart moments + what he says at that moment) and `<name>_sheet.jpg` (overview).
5. Upload the PDFs in the Claude chat (not Google Drive: Drive only passes text, not images).

Tuning: more frames `--scene 0.08 --every 10`; fewer `--scene 0.2 --every 40`; cap pages `--max 40`; PDF size cap `--maxmb 8`.
